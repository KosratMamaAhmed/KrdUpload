// --- Configuration ---
// API Keyی خۆت لێرە دابنێ
const UPLOAD_IO_API_KEY = 'public_W23MTFj4y8xLMzeGo7MATTggeiWQ'; 

// --- DOM Element References ---
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileDetails = document.getElementById('fileDetails');
const uploadBtn = document.getElementById('uploadBtn');
const uploadStatus = document.getElementById('uploadStatus');
const uploadedFileUrl = document.getElementById('uploadedFileUrl');

// Variable to store the Upload.io client instance
let upload;
// Variable to store the currently selected file
let selectedFile = null;

// --- Initialization ---
// Check if the API key is still the default placeholder.
if (UPLOAD_IO_API_KEY === 'YOUR_UPLOAD_IO_API_KEY' || !UPLOAD_IO_API_KEY) {
    console.error('ERROR: Upload.io API Key is not set.');
    alert('تکایە API Keyی Upload.io ی خۆت لە فایلی script.js دابنێ.');
    uploadBtn.disabled = true;
    uploadBtn.textContent = 'API Key Not Set';
} 
// Check if the Upload.io SDK is loaded
else if (typeof Upload === 'undefined') {
    console.error('ERROR: Upload.io SDK is not loaded. "Upload" is not defined.');
    alert('هەڵە لە بارکردنی Upload.io SDK.');
    uploadBtn.disabled = true;
    uploadBtn.textContent = 'SDK Error';
} 
else {
    // Initialize the Upload.io client
    try {
        upload = Upload({ apiKey: UPLOAD_IO_API_KEY });
        console.log('Upload.io client initialized successfully.');
    } catch (e) {
        console.error('ERROR: Failed to initialize Upload.io client.', e);
        alert('هەڵە لە ئامادەکردنی کڵاینتی Upload.io.');
    }
}

// --- Event Listeners ---

// Event listener for when a file is selected via the input field
fileInput.addEventListener('change', (event) => {
    handleFiles(event.target.files);
});

// Event listeners for drag and drop
uploadArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    uploadArea.style.borderColor = '#007bff';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#ccc';
});

uploadArea.addEventListener('drop', (event) => {
    event.preventDefault();
    uploadArea.style.borderColor = '#ccc';
    handleFiles(event.dataTransfer.files);
});

// Event listener for the upload button click
uploadBtn.addEventListener('click', async () => {
    if (!selectedFile) {
        uploadStatus.textContent = 'تکایە فایلێک هەڵبژێرە.';
        return;
    }

    uploadStatus.textContent = 'فایل ئەپلۆد دەکرێت...';
    uploadBtn.disabled = true;

    try {
        const { fileUrl } = await upload.uploadFile(selectedFile);
        uploadStatus.textContent = 'فایل بە سەرکەوتوویی ئەپلۆد کرا!';
        uploadedFileUrl.innerHTML = `<p>لینکی فایل: <a href="${fileUrl}" target="_blank">${fileUrl}</a></p>`;
        console.log('File uploaded successfully. URL:', fileUrl);
    } catch (error) {
        console.error('Error uploading file:', error);
        uploadStatus.textContent = `هەڵە لە ئەپلۆدکردن: ${error.message || 'هەڵەیەکی نەزانراو ڕوویدا.'}`;
    } finally {
        uploadBtn.disabled = false;
    }
});

// --- Helper Function ---
function handleFiles(files) {
    if (files.length > 0) {
        selectedFile = files[0];
        fileDetails.innerHTML = `<p>ناوی فایل: ${selectedFile.name}</p><p>قەبارە: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>`;
        uploadBtn.disabled = false;
        uploadStatus.textContent = '';
        uploadedFileUrl.innerHTML = '';
    } else {
        selectedFile = null;
        fileDetails.innerHTML = `<p>هیچ فایلێک هەڵنەبژێردراوە.</p>`;
        uploadBtn.disabled = true;
    }
}
