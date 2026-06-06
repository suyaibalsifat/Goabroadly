document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registration-form");
  const btnCitizen = document.getElementById("btn-citizen-type");
  const btnAgency = document.getElementById("btn-agency-type");

  let selectedRole = "applicant"; // Corresponds cleanly to default schema state

  // Check query parameter tracks
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("type") === "agency") {
    switchFormToRole("agency");
  }

  if (btnCitizen && btnAgency) {
    btnCitizen.addEventListener("click", () => switchFormToRole("applicant"));
    btnAgency.addEventListener("click", () => switchFormToRole("agency"));
  }

  if (form) {
    form.addEventListener("submit", handleRegistrationSubmit);
  }

  function switchFormToRole(role) {
    selectedRole = role;

    if (role === "agency") {
      btnAgency.classList.add("toggle-pill--active");
      btnCitizen.classList.remove("toggle-pill--active");

      document.getElementById("lbl-first-name").textContent = "Company Name";
      document.getElementById("reg-first-name").placeholder =
        "e.g., Global Pathways Ltd";
      document.getElementById("lbl-last-name").textContent =
        "Licence ID / Code";
      document.getElementById("reg-last-name").placeholder =
        "e.g., MARA / RCIC #";
      document.getElementById("btn-reg-submit").textContent =
        "Apply for Partner Vetting";
    } else {
      btnCitizen.classList.add("toggle-pill--active");
      btnAgency.classList.remove("toggle-pill--active");

      document.getElementById("lbl-first-name").textContent = "First Name";
      document.getElementById("reg-first-name").placeholder = "Sifat";
      document.getElementById("lbl-last-name").textContent = "Last Name";
      document.getElementById("reg-last-name").placeholder = "Al Sifat";
      document.getElementById("btn-reg-submit").textContent = "Create Account";
    }
  }

  async function handleRegistrationSubmit(event) {
    event.preventDefault();

    const firstName = document.getElementById("reg-first-name").value.trim();
    const lastName = document.getElementById("reg-last-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;
    const submitBtn = document.getElementById("btn-reg-submit");

    submitBtn.textContent = "Creating Account...";
    submitBtn.disabled = true;

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          accountType: selectedRole,
        }),
      });

      const data = await response.json();

      if (data.status !== "success") {
        throw new Error(data.message || "Registration validation error.");
      }

      // Store identity attributes to session state (Without JWT Token strings)
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("sessionUserEmail", data.data.user.email);
      localStorage.setItem(
        "profileName",
        `${data.data.user.firstName} ${data.data.user.lastName}`,
      );
      localStorage.setItem("userRole", data.data.user.accountType);

      if (data.data.user.accountType === "agency") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "explore.html";
      }
    } catch (error) {
      alert(error.message);
      submitBtn.textContent =
        selectedRole === "agency"
          ? "Apply for Partner Vetting"
          : "Create Account";
      submitBtn.disabled = false;
    }
  }
});
