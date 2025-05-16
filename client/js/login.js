// Placeholder for functionality like dark mode or form handling
console.log("Login Page Loaded");
document.addEventListener("DOMContentLoaded", () => {
  const form =
    document.getElementById("login-form") || document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch("http://localhost:8000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // if you use cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) {
        return alert(data.error || data.message || "Login failed");
      }

      // Save the token (if returned) for future requests
      if (data.token) localStorage.setItem("token", data.token);

      // Redirect to dashboard (or wherever)
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error("❌ Backend did not return JSON:", text); // See full HTML/error
    }
  });
});
