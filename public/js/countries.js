document.addEventListener("DOMContentLoaded", async () => {
  const gridContainer = document.getElementById("countries-grid-container");
  const statsBar = document.getElementById("jurisdiction-count");
  const searchInput = document.getElementById("country-search");
  const regionSelect = document.getElementById("region-filter");

  let allCountries = [];

  try {
    const response = await fetch("/api/countries");
    const data = await response.json();

    if (data.status === "success") {
      allCountries = data.data.countries;
      renderCatalogCards(allCountries);
    }
  } catch (err) {
    console.error("Failed loading data matrix:", err);
  }

  function renderCatalogCards(countriesList) {
    if (!gridContainer) return;
    gridContainer.innerHTML = "";

    if (statsBar) {
      statsBar.textContent = `Syncing complete. Displaying ${countriesList.length} verified paths.`;
    }

    countriesList.forEach((country) => {
      const card = document.createElement("div");
      card.className = "jurisdiction-card";

      // We read directly from country.heroImageUrl just like your detail dashboard does
      card.innerHTML = `
        <div class="card-image-wrapper">
          <img src="${country.heroImageUrl}" alt="${country.name}" class="card-banner-img">
          <span class="card-continent-pill">${country.continent || "Global"} Sector</span>
        </div>
        <div class="card-body-content">
          <div class="card-header-block">
            <span class="card-flag">${country.flagEmoji || "🌐"}</span>
            <h2 class="card-title">${country.name}</h2>
          </div>
          <p class="card-desc">${country.heroDescription}</p>
          <div class="card-metrics-preview">
            <div><strong>Pop:</strong> <span>${country.metrics?.population || "N/A"}</span></div>
            <div><strong>Safety:</strong> <span style="color:#10b981;">${country.metrics?.safetyIndex || "N/A"}/10</span></div>
            <div><strong>Tier:</strong> <span>${country.metrics?.costTier || "N/A"}</span></div>
          </div>
          <button class="card-action-btn" onclick="window.location.href='country-detail.html?country=${country.slug}'">
            Explore Sovereign Pathways →
          </button>
        </div>
      `;
      gridContainer.appendChild(card);
    });
  }

  // Live matching updates
  function filterMatrix() {
    const query = searchInput.value.toLowerCase().trim();
    const region = regionSelect.value;

    const matched = allCountries.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(query);
      const matchesRegion = region === "all" || c.continent === region;
      return matchesSearch && matchesRegion;
    });
    renderCatalogCards(matched);
  }

  if (searchInput) searchInput.addEventListener("input", filterMatrix);
  if (regionSelect) regionSelect.addEventListener("change", filterMatrix);
});
