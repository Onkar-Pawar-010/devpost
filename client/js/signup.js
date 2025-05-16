// Placeholder for future form validations or API calls
console.log("Signup Page Loaded");
const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document
    .getElementById("confirm-password")
    .value.trim();

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullName, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Account created successfully!");
      localStorage.setItem("token", data.token); // Optional: save token
      window.location.href = "login.html"; // Or wherever you want to go next
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (error) {
    console.error("Signup error:", error);
    alert("Something went wrong. Try again.");
  }
});
