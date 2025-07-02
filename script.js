// گرنگ: ئەم هێڵەی خوارەوە دەبێت لە فایلی index.html زیاد بکرێت، پێش بارکردنی ئەم فایلی script.js.
// <script src="https://js.upload.io/upload-js/v3.0.0/upload-js.min.js"></script>

// Replace 'YOUR_UPLOAD_IO_API_KEY' with your actual API Key from Upload.io dashboard.
// This is crucial for the uploader to work.
const UPLOAD_IO_API_KEY = 'public_W23MTFj4y8xLMzeGo7MATTggeiWQ'; 

// --- Debugging and Initialization ---
let upload; // Declare upload variable globally or in a scope accessible by the event listeners

// Check if the API key is set. If not, alert the user and prevent further execution.
if (UPLOAD_IO_API_KEY === 'YOUR_UPLOAD_IO_API_KEY' || !UPLOAD_IO_API_KEY ) {
    console.error('ERROR: Upload.io API Key is not set. Please replace "public_W23MTFj4y8xLMzeGo7MATTggeiWQ" in script.js.');
    alert('تکایە API Keyی Upload.io ی خۆت لە فایلی script.js دابنێ. دەتوانیت لە داشبۆردی Upload.io بەدەستی بهێنیت.');
    // Optionally, disable the upload button permanently if API key is missing
    document.addEventListener('DOMContentLoaded', () => {
        const uploadBtn = document.getElementById('uploadBtn');
        if (uploadBtn) {
            uploadBtn.disabled = true;
            uploadBtn.textContent = 'API Key Not Set';
        }
    });
    // Exit script if API key is missing
    throw new Error("Upload.io API Key is missing."); 
} else {
    // Initialize the Upload.io client only if the API key is valid.
    // This 'Upload' object becomes available after the Upload.io SDK is loaded in index.html.
    try {
        upload = Upload({ apiKey: UPLOAD_IO_API_KEY });
        console.log('Upload.io client initialized successfully:', upload);
    } catch (e) {
        console.error('ERROR: Failed to initialize Upload.io client. Is the SDK loaded?', e);
        alert('هەڵە لە بارکردنی Upload.io SDK. تکایە دڵنیابە لەوەی کە هێڵی <script> لە index.html دروستە.');
        document.addEventListener('DOMContentLoaded', () => {
            const uploadBtn = document.getElementById('uploadBtn');
            if (uploadBtn) {
                uploadBtn.disabled = true;
                uploadBtn.textContent = 'SDK Error';
            }
        });
        throw e; // Re-throw to stop script execution
    }
}

// --- DOM Element References ---
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileDetails = document.getElementById('fileDetails');
const uploadBtn = document.getElementById('uploadBtn');
const uploadStatus = document.getElementById('uploadStatus');
const uploadedFileUrl = document.getElementById('uploadedFileUrl');

// Variable to store the currently selected file
let selectedFile = null;

// --- Event Listeners ---

// Event listener for when a file is selected via the input field
fileInput.addEventListener('change', (event) => {
    console.log('File input change event triggered.');
    handleFiles(event.target.files);
});

// Event listener for dragover event on the upload area
uploadArea.addEventListener('dragover', (event) => {
    event.preventDefault(); // Prevent default to allow drop
    uploadArea.style.borderColor = '#007bff'; // Change border color to indicate dragover
    console.log('Dragover event.');
});

// Event listener for dragleave event on the upload area
uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#ccc'; // Revert border color
    console.log('Dragleave event.');
});

// Event listener for drop event on the upload area
uploadArea.addEventListener('drop', (event) => {
    event.preventDefault(); // Prevent default behavior (e.g., opening file in new tab)
    uploadArea.style.borderColor = '#ccc'; // Revert border color
    console.log('Drop event triggered.');
    handleFiles(event.dataTransfer.files); // Process the dropped files
});

// Event listener for the upload button click
uploadBtn.addEventListener('click', async () => {
    console.log('Upload button clicked.');
    if (!selectedFile) {
        uploadStatus.textContent = 'تکایە فایلێک هەڵبژێرە.';
        console.warn('Upload button clicked but no file selected.');
        return;
    }

    uploadStatus.textContent = 'فایل ئەپلۆد دەکرێت...'; // Show uploading status
    uploadBtn.disabled = true; // Disable button during upload
    console.log('Attempting to upload file:', selectedFile.name);

    try {
        // Use Upload.io's uploadFile function to send the file.
        // This function handles the entire upload process to Upload.io's servers.
        const { fileUrl } = await upload.uploadFile(selectedFile);

        uploadStatus.textContent = 'فایل بە سەرکەوتوویی ئەپلۆد کرا!'; // Success message
        // Display the uploaded file URL as a clickable link
        uploadedFileUrl.innerHTML = `<p>لینکی فایل: <a href="${fileUrl}" target="_blank">${fileUrl}</a></p>`;
        console.log('File uploaded successfully. URL:', fileUrl);
    } catch (error) {
        console.error('Error uploading file:', error); // Log error to console
        // Display error message to the user
        uploadStatus.textContent = `هەڵە لە ئەپلۆدکردن: ${error.message || 'هەڵەیەکی نەزانراو ڕوویدا.'}`;
    } finally {
        uploadBtn.disabled = false; // Re-enable the upload button after completion (success or failure)
        console.log('Upload process finished. Button re-enabled.');
    }
});

// --- Helper Functions ---

/**
 * Handles the selected or dropped files.
 * Displays file details and enables/disables the upload button.
 * @param {FileList} files - The FileList object from input or drag-and-drop.
 */
function handleFiles(files) {
    if (files.length > 0) {
        selectedFile = files[0]; // Get the first selected file
        console.log('File selected:', selectedFile.name, 'Size:', selectedFile.size);
        
        // Display file name and size
        fileDetails.innerHTML = `<p>ناوی فایل: ${selectedFile.name}</p><p>قەبارە: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>`;
        
        // Enable the upload button
        uploadBtn.disabled = false; 
        console.log('Upload button enabled.');
        
        uploadStatus.textContent = ''; // Clear previous status messages
        uploadedFileUrl.innerHTML = ''; // Clear previous uploaded URL
    } else {
        selectedFile = null; // No file selected
        console.log('No file selected.');
        fileDetails.innerHTML = `<p>هیچ فایلێک هەڵنەبژێردراوە.</p>`;
        
        // Disable the upload button
        uploadBtn.disabled = true; 
        console.log('Upload button disabled.');
        
        uploadStatus.textContent = '';
        uploadedFileUrl.innerHTML = '';
    }
}
