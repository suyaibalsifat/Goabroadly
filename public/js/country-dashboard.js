let regionalMemoryMap = {}; // Holds our dynamic metrics on tap

document.addEventListener("DOMContentLoaded", async () => {
  // Extract parameters out from active location parameters string
  const urlParams = new URLSearchParams(window.location.search);
  const countrySlug = urlParams.get("country") || "japan"; // defaults safely to japan

  try {
    const response = await fetch(`/api/countries/${countrySlug}`);
    const data = await response.json();

    if (data.status !== "success") {
      throw new Error(data.message || "Could not retrieve country properties.");
    }

    renderCountryDashboard(data.data.country);
  } catch (err) {
    console.error("Dashboard engine failure:", err);
    alert("Error gathering gateway data metrics: " + err.message);
  }
});

function renderCountryDashboard(country) {
  // 1. Dynamic document header settings
  document.title = `Explore ${country.name} Opportunities Gateway | GoAbroadly`;

  // 2. Section 1 Rendering: Hero Metrics Header Array
  const heroBlock = document.querySelector(".hero-title-block");
  if (heroBlock) {
    heroBlock.innerHTML = `
      <h1>${country.name} ${country.flagEmoji}</h1>
      <p style="font-size: 16px; color: #666; margin: 0 0 24px 0; line-height: 1.5;">${country.heroDescription}</p>
      <div class="macro-stats-row">
        <div class="macro-stat-card"><span class="val">${country.metrics.population}</span><span class="lbl">Population</span></div>
        <div class="macro-stat-card"><span class="val">${country.metrics.language}</span><span class="lbl">Language</span></div>
        <div class="macro-stat-card"><span class="val" style="color:#10b981;">${country.metrics.safetyIndex}/10</span><span class="lbl">Safety Index</span></div>
        <div class="macro-stat-card"><span class="val">${country.metrics.costTier}</span><span class="lbl">Cost Tier</span></div>
      </div>
    `;
  }

  const heroImg = document.querySelector(".hero-gallery img");
  if (heroImg) heroImg.src = country.heroImageUrl;

  // 3. Section 3 Rendering: Quad Grid Content Arrays
  const quadGridCards = document.querySelectorAll(
    ".overview-quad-grid .overview-card",
  );
  if (quadGridCards.length === 4) {
    quadGridCards[0].querySelector("p").textContent =
      country.overview.education;
    quadGridCards[1].querySelector("p").textContent =
      country.overview.employment;
    quadGridCards[2].querySelector("p").textContent =
      country.overview.lifestyle;
    quadGridCards[3].querySelector("p").textContent =
      country.overview.healthcare;
  }

  // 4. Section 4 Rendering: Offers Counters Hub Mapping
  const pathCards = document.querySelectorAll(
    ".opportunities-hub-grid .hub-product-card",
  );
  if (pathCards.length === 4) {
    pathCards[0].querySelector(".count").textContent =
      `${country.offersSummary.studyActiveCount} Active Offers →`;
    pathCards[1].querySelector(".count").textContent =
      `${country.offersSummary.migrationActiveCount} Active Offers →`;
    pathCards[2].querySelector(".count").textContent =
      `${country.offersSummary.tourismActiveCount} Active Packages →`;
    pathCards[3].querySelector(".count").textContent =
      `${country.offersSummary.languageActiveCount} Active Programs →`;
  }

  // 5. Section 5 Mapping: Save Regions to Memory and Draw Buttons Layout
  const navContainer = document.querySelector(".region-nav-list");
  if (navContainer && country.regions.length > 0) {
    navContainer.innerHTML = ""; // Clear mock buttons
    country.regions.forEach((reg, index) => {
      regionalMemoryMap[reg.key] = reg; // store internally
      const activeClass = index === 0 ? "active" : "";
      navContainer.innerHTML += `
        <button class="region-nav-btn ${activeClass}" onclick="switchRegionData('${reg.key}')">${reg.name}</button>
      `;
    });
    // Prime the content box with the very first element block
    switchRegionData(country.regions[0].key);
  }

  // 6. Section 6 Mapping: Monthly Cost Tracker Rows
  const costFrame = document.querySelector(".cost-chart-grid");
  if (costFrame) {
    costFrame.innerHTML = "";
    country.costSnapshots.forEach((c) => {
      costFrame.innerHTML += `
        <div class="cost-bar-row">
          <h4>${c.trackName}</h4>
          <div class="cost-visual-track">
            <div class="cost-visual-fill" style="width: ${c.fillWidthPercentage}%;"></div>
          </div>
          <span class="cost-range">${c.rangeString} <small style="color:#666; font-size:12px;">/ month</small></span>
        </div>
      `;
    });
  }

  // 7. Section 7 Mapping: Dynamic Visa Rows Generation Array
  const pathwayFrame = document.querySelector(".pathway-comparison-box");
  if (pathwayFrame) {
    // Keep only the first header element card
    const headerHtml = pathwayFrame.querySelector(".header-row").outerHTML;
    let combinedRows = headerHtml;

    country.visaPathways.forEach((v) => {
      const tierColor = v.potentialTier === "High" ? "#10b981" : "#ffab00";
      combinedRows += `
        <div class="pathway-row-card">
          <div><h4>${v.classification}</h4></div>
          <div>${v.processingWindow}</div>
          <span style="color: ${tierColor}; font-weight: 500;">${v.potentialTier} Potential Track</span>
          <div style="text-align: right; font-weight: 600;">${v.activeOffersCount} Offers</div>
        </div>
      `;
    });
    pathwayFrame.innerHTML = combinedRows;
  }
}

// Global Switch Executor to modify live regional attributes smoothly
window.switchRegionData = function (key) {
  const data = regionalMemoryMap[key];
  if (!data) return;

  document.getElementById("js-reg-cost").textContent = data.costIndex;
  document.getElementById("js-reg-salary").textContent = data.medianWage;
  document.getElementById("js-reg-pop").textContent = data.population;
  document.getElementById("js-reg-ind").textContent = data.sectors;

  // Toggle visual active button classes cleanly
  document.querySelectorAll(".region-nav-btn").forEach((btn) => {
    if (btn.textContent.includes(data.name.split(" ")[0])) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
};
