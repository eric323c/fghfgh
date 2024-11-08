function fetchFiles() {
  fetch('/files')
    .then(response => response.json())
    .then(files => {
      const container = document.getElementById('filesContainer');
      container.innerHTML = '';
      files.forEach(file => {
        container.innerHTML += `<div>${file.filename}</div>`;
      });
    })
    .catch(error => console.error('Error fetching files:', error));
}

// Fetch files initially and after file upload
fetchFiles();

document.getElementById('uploadForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new FormData(this);
  fetch('/upload', {
      method: 'POST',
      body: formData,
  })
  .then(response => response.json())
  .then(data => {
    console.log('Upload successful:', data);
    fetchFiles(); // Reload files list after upload
  })
  .catch(error => console.error('Error uploading file:', error));
});
