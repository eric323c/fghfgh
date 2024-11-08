function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  if (!file) {
    alert('Please select a file.');
    return;
  }

  // Convert file to Base64
  const reader = new FileReader();
  reader.onloadend = () => {
    const base64File = reader.result;

    // Send Base64 file to the serverless function
    fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: base64File })
    })
    .then(response => response.json())
    .then(data => {
      if (data.url) {
        document.getElementById('output').innerHTML = `<p>Uploaded successfully:</p><img src="${data.url}" alt="Uploaded image" style="max-width:300px;" />`;
      } else {
        document.getElementById('output').innerHTML = `<p>Error: ${data.error}</p>`;
      }
    })
    .catch(error => console.error('Error uploading file:', error));
  };
  reader.readAsDataURL(file);
}
