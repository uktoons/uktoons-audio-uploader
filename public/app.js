document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('uploadForm');

  // Function to handle form submission for uploading music
  uploadForm.addEventListener('submit', event => {
      event.preventDefault();

      const formData = new FormData(uploadForm);

      fetch('/upload', {
          method: 'POST',
          body: formData
      })
      .then(response => {
          if (response.ok) {
              uploadForm.reset(); // Reset form fields
              window.location.href = '/music.html'; // Redirect to music page
          } else {
              console.error('Failed to upload music:', response.statusText);
          }
      })
      .catch(error => console.error('Error uploading music:', error));
  });
});
