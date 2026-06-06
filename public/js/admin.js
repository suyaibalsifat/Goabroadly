// public/js/admin.js
document.addEventListener("DOMContentLoaded", () => {
  const tourForm = document.getElementById("tourForm");
  const alertBox = document.getElementById("alert");

  if (tourForm) {
    tourForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Halt default browser form action

      // Collect string values from inputs
      const categoriesInput = document.getElementById("categories").value;
      const tagsInput = document.getElementById("tags").value;

      // Process comma-separated strings directly into formal arrays
      const categoriesArray = categoriesInput
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter((item) => item !== "");

      const tagsArray = tagsInput
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      // Construct payload document matching our Mongoose schema properties
      const payload = {
        title: document.getElementById("title").value,
        agencyName: document.getElementById("agencyName").value,
        durationDays: parseInt(
          document.getElementById("durationDays").value,
          10,
        ),
        priceCurrent: parseFloat(document.getElementById("priceCurrent").value),
        priceOld: parseFloat(document.getElementById("priceOld").value),
        image: document.getElementById("image").value,
        categories: categoriesArray,
        tags: tagsArray,
        departureDate: document.getElementById("departureDate").value,
      };

      try {
        const response = await fetch("/api/tours", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok && result.success === true) {
          showAlert(
            "Success! Tour package published to the database collection.",
            "success",
          );
          tourForm.reset(); // Reset form fields on successful database mutation
        } else {
          throw new Error(result.error || "Server processing error occurred.");
        }
      } catch (error) {
        showAlert(`Failed: ${error.message}`, "error");
      }
    });
  }

  function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert-box alert-box--${type}`;
    alertBox.style.display = "block";

    // Auto-hide notification banner after 5 seconds
    setTimeout(() => {
      alertBox.style.display = "none";
    }, 5000);
  }
});
