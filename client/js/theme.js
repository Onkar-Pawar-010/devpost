// Apply saved theme on load for all pages
window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.add("light-mode");
    }
  });
  
  // Only on settings page: toggle theme and save it in localStorage
  if (document.getElementById("lightBtn") && document.getElementById("darkBtn")) {
    document.getElementById("lightBtn").addEventListener("click", () => {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    });
  
    document.getElementById("darkBtn").addEventListener("click", () => {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    });
  }
  