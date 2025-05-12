// Theme Switching Logic
document.getElementById("lightBtn").addEventListener("click", () => {
    document.body.style.background = "#f5f5f5";
  });
  
  document.getElementById("darkBtn").addEventListener("click", () => {
    document.body.style.background = "#1e1e1e";
  });
  
  // Toggle Preferences (example logging)
  document.getElementById("twitterToggle").addEventListener("change", function () {
    console.log("Auto-publish to Twitter:", this.checked);
  });
  
  document.getElementById("scheduleToggle").addEventListener("change", function () {
    console.log("Schedule Posts:", this.checked);
  });
  
//profile photo
  const fileInput = document.getElementById('fileInput');
  const profilePic = document.getElementById('profilePic');

  // Load image from localStorage if exists
  window.addEventListener('DOMContentLoaded', () => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      profilePic.src = savedImage;
    }
  });

  // Save selected image to localStorage
  fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageDataUrl = e.target.result;
        profilePic.src = imageDataUrl;
        localStorage.setItem('profileImage', imageDataUrl); // Save to localStorage
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
    }
  });
