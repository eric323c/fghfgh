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
