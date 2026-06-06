document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const submitBtn = loginForm.querySelector(".auth-btn-submit");

    submitBtn.textContent = "Verifying Credentials...";
    submitBtn.disabled = true;

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status !== "success") {
        throw new Error(data.message || "Authentication failed.");
      }

      // Store identity attributes to session state (Without JWT Token strings)
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("sessionUserEmail", data.data.user.email);
      localStorage.setItem(
        "profileName",
        `${data.data.user.firstName} ${data.data.user.lastName}`,
      );
      localStorage.setItem("userRole", data.data.user.accountType);

      // Clean dashboard direction mappings
      if (data.data.user.accountType === "agency") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "explore.html";
      }
    } catch (error) {
      alert(error.message);
      submitBtn.textContent = "Sign In to Account";
      submitBtn.disabled = false;
    }
  });
});
