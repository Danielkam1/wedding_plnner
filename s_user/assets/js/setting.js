// Get all the change buttons
const changeButtons = document.querySelectorAll('.app-btn-secondary');

// Add an event listener to each button
changeButtons.forEach((button) => {
  button.addEventListener('click', async (event) => {
    // Get the parent item element
    const item = button.closest('.item');

    // Get the item label and data elements
    const label = item.querySelector('.item-label strong').textContent;
    const data = item.querySelector('.item-data');

    // Handle the update based on the label
    switch (label) {
      case 'Photo':
        // Open a file dialog to select a new photo
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = async () => {
          // Get the selected file
          const file = fileInput.files[0];

          // Create a FormData object to send the file
          const formData = new FormData();
          formData.append('photo', file);

          // Send an AJAX request to update the user's photo
          try {
            const response = await fetch('/update-photo', {
              method: 'POST',
              body: formData
            });

            // Check if the response was successful
            if (response.ok) {
              // Get the updated photo URL from the response
              const updatedPhotoUrl = await response.json();

              // Update the image src attribute
              data.innerHTML = `<img src="${updatedPhotoUrl}" alt="">`;
            } else {
              console.error('Error updating photo:', response.status);
            }
          } catch (error) {
            console.error('Error updating photo:', error);
          }
        };

        // Trigger the file dialog
        fileInput.click();
        break;

      case 'Name':
      case 'Email':
      case 'Website':
      case 'Location':
        // Create a text input element to edit the data
        const input = document.createElement('input');
        input.type = 'text';
        input.value = data.textContent;

        // Replace the data element with the input element
        data.innerHTML = '';
        data.appendChild(input);

        // Add an event listener to the input element
        input.addEventListener('blur', async () => {
          // Get the updated value
          const updatedValue = input.value;

          // Send an AJAX request to update the user's profile information
          try {
            const response = await fetch(`/update-${label.toLowerCase()}`, {
              method: 'POST',
              body: JSON.stringify({ value: updatedValue }),
              headers: { 'Content-Type': 'application/json' }
            });

            // Check if the response was successful
            if (response.ok) {
              // Update the data element with the new value
              data.textContent = updatedValue;
            } else {
              console.error(`Error updating ${label}:`, response.status);
            }
          } catch (error) {
            console.error(`Error updating ${label}:`, error);
          }

          // Remove the input element and restore the original data element
          data.removeChild(input);
          data.textContent = updatedValue;
        });
        break;

      default:
        console.error(`Unknown label: ${label}`);
    }
  });
});