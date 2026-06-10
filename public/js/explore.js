/**
 * GoAbroadly Marketplace Core System Integration Engine
 */

let REAL_MARKETPLACE_DATASET = [];
let ACTIVE_SHORTLISTED_SLUGS = [];

const FILTERS = {
  framework: "all",
  region: "all",
  searchQuery: "",
  sortBy: "featured",
};

document.addEventListener("DOMContentLoaded", async () => {
  syncShortlistState();
  initializeDropdownMenus();
  initializeFilterTriggers();
  await fetchMasterMarketplaceRegistry();
});

function syncShortlistState() {
  try {
    const rawData = localStorage.getItem("goabroadly_saved_tracks");
    ACTIVE_SHORTLISTED_SLUGS = rawData ? JSON.parse(rawData) : [];
  } catch (e) {
    ACTIVE_SHORTLISTED_SLUGS = [];
  }
  updateShortlistBadges();
}

function initializeDropdownMenus() {
  const profileButton = document.getElementById("profile-dropdown-btn");
  const profileContainer = document.getElementById(
    "profile-dropdown-container",
  );
  const cartTrigger = document.getElementById("cart-toggle-btn");
  const portfolioDrawer = document.getElementById("portfolio-drawer");
  const drawerCloseBtn = document.getElementById("drawer-close-btn");
  const logoutBtn = document.getElementById("logout-action-trigger");

  if (profileButton && profileContainer) {
    profileButton.addEventListener("click", (e) => {
      e.stopPropagation();
      profileContainer.classList.toggle("show-menu");
    });
    document.addEventListener("click", () =>
      profileContainer.classList.remove("show-menu"),
    );
  }

  if (cartTrigger && portfolioDrawer) {
    cartTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      renderShortlistDrawerItems();
      portfolioDrawer.classList.add("open-drawer");
    });
  }

  if (drawerCloseBtn && portfolioDrawer) {
    drawerCloseBtn.addEventListener("click", () =>
      portfolioDrawer.classList.remove("open-drawer"),
    );
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "login.html";
    });
  }
}

function initializeFilterTriggers() {
  const frameworkPills = document.querySelectorAll(
    "#framework-filter-pills .pill-filter-btn",
  );
  const regionDropdown = document.getElementById("filter-region-select");
  const searchInputBox = document.getElementById("marketplace-search");
  const sortingSelector = document.getElementById("marketplace-sort");

  frameworkPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      frameworkPills.forEach((btn) =>
        btn.classList.remove("pill-filter-btn--active"),
      );
      pill.classList.add("pill-filter-btn--active");

      FILTERS.framework = pill
        .getAttribute("data-framework")
        .toLowerCase()
        .trim();
      processActiveMarketplaceFilters();
    });
  });

  if (regionDropdown) {
    regionDropdown.addEventListener("change", (e) => {
      FILTERS.region = e.target.value.toLowerCase().trim();
      processActiveMarketplaceFilters();
    });
  }

  if (searchInputBox) {
    searchInputBox.addEventListener("input", (e) => {
      FILTERS.searchQuery = e.target.value.toLowerCase().trim();
      processActiveMarketplaceFilters();
    });
  }

  if (sortingSelector) {
    sortingSelector.addEventListener("change", (e) => {
      FILTERS.sortBy = e.target.value;
      processActiveMarketplaceFilters();
    });
  }

  const staticCountryTiles = document.querySelectorAll(".retail-sector-tile");
  staticCountryTiles.forEach((tile) => {
    tile.style.cursor = "pointer";
    tile.addEventListener("click", (e) => {
      e.preventDefault();
      const code = tile.getAttribute("data-country").toLowerCase().trim();
      window.location.href = `country-detail.html?country=${code}`;
    });
  });
}

async function fetchMasterMarketplaceRegistry() {
  try {
    const stream = await fetch("/api/marketplace/all-offers");
    const json = await stream.json();

    if (json.status === "success" && Array.isArray(json.data)) {
      REAL_MARKETPLACE_DATASET = json.data;
    } else {
      REAL_MARKETPLACE_DATASET = loadLocalDatabaseSeedMirrors();
    }
  } catch (error) {
    REAL_MARKETPLACE_DATASET = loadLocalDatabaseSeedMirrors();
  }

  processActiveMarketplaceFilters();
  syncDynamicCountryBadges();
  renderDynamicAgenciesShowcase();
}

function syncDynamicCountryBadges() {
  const staticCountryTiles = document.querySelectorAll(".retail-sector-tile");
  staticCountryTiles.forEach((tile) => {
    const slug = tile.getAttribute("data-country").toLowerCase().trim();
    const matches = REAL_MARKETPLACE_DATASET.filter(
      (item) => item.countrySlug.toLowerCase() === slug,
    ).length;
    const badgeElement = tile.querySelector(".tile-badge-tag");
    if (badgeElement) {
      badgeElement.textContent = `${matches} Track${matches === 1 ? "" : "s"}`;
    }
  });
}

function processActiveMarketplaceFilters() {
  let outputs = [...REAL_MARKETPLACE_DATASET];

  if (FILTERS.framework !== "all") {
    outputs = outputs.filter(
      (card) => card.frameworkType === FILTERS.framework,
    );
  }

  if (FILTERS.region !== "all") {
    outputs = outputs.filter((card) => card.countrySlug === FILTERS.region);
  }

  if (FILTERS.searchQuery) {
    const query = FILTERS.searchQuery;
    outputs = outputs.filter((card) => {
      return (
        card.title.toLowerCase().includes(query) ||
        card.agencyName.toLowerCase().includes(query) ||
        card.visaCategoryText.toLowerCase().includes(query)
      );
    });
  }

  if (FILTERS.sortBy === "price-low") {
    outputs.sort((x, y) => x.baseRate - y.baseRate);
  } else if (FILTERS.sortBy === "price-high") {
    outputs.sort((x, y) => y.baseRate - x.baseRate);
  }

  const counterText = document.getElementById("catalog-results-count");
  if (counterText) {
    counterText.textContent = `Showing ${outputs.length} Track${outputs.length === 1 ? "" : "s"}`;
  }

  renderDynamicCardDeckGrid(outputs);
}

// Helper utility function to choose target HTML pages based on context data tags
function getTargetFilenameByFramework(frameworkType) {
  if (frameworkType === "academic") return "academic-offer.html";
  if (frameworkType === "tourism") return "tourism-offer.html";
  return "migration-offer.html"; // Default fallback route mapping
}

function renderDynamicCardDeckGrid(cardsArray) {
  const cardsContainer = document.getElementById("marketplace-cards-container");
  if (!cardsContainer) return;

  cardsContainer.innerHTML = "";

  if (cardsArray.length === 0) {
    cardsContainer.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; border: 1px dashed #e5e5e5; border-radius: 12px; background: #fff;">
        <p style="font-size: 16px; font-weight: 600; margin:0 0 4px 0;">No Active Pathways Found</p>
        <p style="color: #666; font-size: 14px; margin: 0;">No tracks match the selected filters inside our system registries.</p>
      </div>
    `;
    return;
  }

  cardsArray.forEach((card) => {
    const thumb = card.heroImageUrl;
    const isActiveInLocalStorage = ACTIVE_SHORTLISTED_SLUGS.includes(card.slug);

    let frameworkEmoji = "🎓";
    if (card.frameworkType === "migration") frameworkEmoji = "💼";
    if (card.frameworkType === "tourism") frameworkEmoji = "🏝️";

    // 🛠️ DYNAMIC ROUTE SELECTION
    const targetUrlPage = getTargetFilenameByFramework(card.frameworkType);

    const cardItemNode = document.createElement("div");
    cardItemNode.className = "catalog-route-card-item";
    cardItemNode.style.cssText =
      "background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s, border-color 0.2s; cursor: pointer;";

    cardItemNode.addEventListener("click", (e) => {
      if (e.target.closest(".save-heart-toggle-btn")) return;
      window.location.href = `${targetUrlPage}?offer=${card.slug}`;
    });

    cardItemNode.innerHTML = `
      <div style="position: relative; width: 100%; height: 180px; background: #eaeaea;">
        <img src="${thumb}" alt="Guide" style="width: 100%; height: 100%; object-fit: cover;">
        <button class="save-heart-toggle-btn" data-slug="${card.slug}" style="position: absolute; top: 12px; right: 12px; background: #fff; border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); cursor: pointer; color: ${isActiveInLocalStorage ? "#ef4444" : "#000"};">
          ${isActiveInLocalStorage ? "♥" : "♡"}
        </button>
      </div>
      <div style="padding: 20px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background: #f0f0f0; color:#444;">${frameworkEmoji} ${card.frameworkType}</span>
            <span style="font-size: 11px; font-weight: 600; color: #666;">${card.visaCategoryText}</span>
          </div>
          <h3 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 700; line-height: 1.4; color: #000;">${card.title}</h3>
          <p style="margin: 0 0 16px 0; font-size: 13px; color: #555;">Managed by <strong style="color:#000; font-weight:600;">${card.agencyName}</strong></p>
        </div>
        <div style="border-top: 1px solid #f0f0f0; padding-top: 14px; display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <span style="font-size: 11px; color: #666; display: block; text-transform: uppercase;">Escrow Retainer</span>
            <strong style="font-size: 18px; font-weight: 800; color: #000;">$${card.baseRate.toLocaleString()}</strong>
          </div>
          <div style="text-align: right; font-size: 12px; color: #444; font-weight: 500;">
            ⏱️ ${card.processingWindowLabel}
          </div>
        </div>
      </div>
    `;

    const heartBtn = cardItemNode.querySelector(".save-heart-toggle-btn");
    heartBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      executeCardShortlistMutation(card.slug, heartBtn);
    });

    cardsContainer.appendChild(cardItemNode);
  });
}

function executeCardShortlistMutation(slug, element) {
  if (ACTIVE_SHORTLISTED_SLUGS.includes(slug)) {
    ACTIVE_SHORTLISTED_SLUGS = ACTIVE_SHORTLISTED_SLUGS.filter(
      (x) => x !== slug,
    );
    element.textContent = "♡";
    element.style.color = "#000";
  } else {
    ACTIVE_SHORTLISTED_SLUGS.push(slug);
    element.textContent = "♥";
    element.style.color = "#ef4444";
  }
  localStorage.setItem(
    "goabroadly_saved_tracks",
    JSON.stringify(ACTIVE_SHORTLISTED_SLUGS),
  );
  updateShortlistBadges();
  renderShortlistDrawerItems();
}

function updateShortlistBadges() {
  const count = ACTIVE_SHORTLISTED_SLUGS.length;
  const globalCountBadge = document.getElementById("global-portfolio-count");
  const drawerHeaderCount = document.getElementById("drawer-count-header");

  if (globalCountBadge) globalCountBadge.textContent = count;
  if (drawerHeaderCount) drawerHeaderCount.textContent = `(${count})`;
}

function renderShortlistDrawerItems() {
  const drawerContainer = document.getElementById("portfolio-drawer-items");
  if (!drawerContainer) return;

  drawerContainer.innerHTML = "";
  const bookmarkedItems = REAL_MARKETPLACE_DATASET.filter((item) =>
    ACTIVE_SHORTLISTED_SLUGS.includes(item.slug),
  );

  if (bookmarkedItems.length === 0) {
    drawerContainer.innerHTML = `<div class="drawer-empty-state" style="color:#666; font-style:italic;">Your portfolio collection is empty. Click ♡ on packages to compare options.</div>`;
    return;
  }

  bookmarkedItems.forEach((item) => {
    const row = document.createElement("div");
    row.style.cssText =
      "display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid #eee; align-items: center; justify-content: space-between;";

    // 🛠️ DYNAMIC PREROUTING SELECTION FOR SHORTLIST PANEL ITEMS
    const targetUrlPage = getTargetFilenameByFramework(item.frameworkType);

    row.innerHTML = `
      <div style="flex-grow: 1; cursor: pointer;">
        <h4 style="margin:0 0 4px 0; font-size:14px; font-weight:600; color:#000;">${item.title}</h4>
        <span style="font-size:12px; color:#666;">$${item.baseRate.toLocaleString()} • ${item.agencyName}</span>
      </div>
      <button style="background: none; border: none; color: #ef4444; font-size: 18px; cursor: pointer; padding:4px;">&times;</button>
    `;

    row.querySelector("div").addEventListener("click", () => {
      window.location.href = `${targetUrlPage}?offer=${item.slug}`;
    });

    row.querySelector("button").addEventListener("click", () => {
      ACTIVE_SHORTLISTED_SLUGS = ACTIVE_SHORTLISTED_SLUGS.filter(
        (x) => x !== item.slug,
      );
      localStorage.setItem(
        "goabroadly_saved_tracks",
        JSON.stringify(ACTIVE_SHORTLISTED_SLUGS),
      );
      updateShortlistBadges();
      renderShortlistDrawerItems();
      processActiveMarketplaceFilters();
    });

    drawerContainer.appendChild(row);
  });
}

function renderDynamicAgenciesShowcase() {
  const agencyContainer = document.getElementById("dynamic-agencies-container");
  if (!agencyContainer) return;

  const uniqueAgenciesMap = {};
  REAL_MARKETPLACE_DATASET.forEach((item) => {
    if (!uniqueAgenciesMap[item.agencyName]) {
      uniqueAgenciesMap[item.agencyName] = {
        name: item.agencyName,
        count: 0,
        frameworks: new Set(),
      };
    }
    uniqueAgenciesMap[item.agencyName].count++;
    if (item.frameworkType)
      uniqueAgenciesMap[item.agencyName].frameworks.add(item.frameworkType);
  });

  const uniqueAgencies = Object.values(uniqueAgenciesMap);
  agencyContainer.innerHTML = "";

  if (uniqueAgencies.length === 0) {
    uniqueAgencies.push(
      {
        name: "Global Pathways Ltd.",
        count: 2,
        fallbackAvatar: "GPL",
        bio: "Specialized in Tier-1 institutional admissions alignment and post-study transition logistics compliance.",
      },
      {
        name: "Elite Migration Group",
        count: 4,
        fallbackAvatar: "EMG",
        bio: "Dedicated legal counsel specializing in professional points-based matrices and Express Entry portfolio filing audits.",
      },
      {
        name: "Horizon Escapes Co.",
        count: 3,
        fallbackAvatar: "HEC",
        bio: "Curated luxury small-group itineraries handling end-to-end multi-destination transit logistics and tour entry processing.",
      },
      {
        name: "Nippon Travel Lines",
        count: 2,
        fallbackAvatar: "NTL",
        bio: "Premium sovereign corridor operators specializing exclusively in Japanese cultural expeditions and study operations.",
      },
    );
  }

  uniqueAgencies.forEach((agency) => {
    const initialCode =
      agency.fallbackAvatar ||
      agency.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .substring(0, 3)
        .toUpperCase();
    const cleanBio =
      agency.bio ||
      `Verified platform institution processing tracks across fields.`;
    const finalCount = agency.count || 1;
    let slug = agency.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (slug.endsWith("-")) slug = slug.slice(0, -1);

    const card = document.createElement("div");
    card.className = "agency-showcase-card";
    card.style.cursor = "pointer";

    card.innerHTML = `
      <div class="agency-showcase-card__header">
        <div class="agency-avatar-box" style="background-color: #0f172a; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700;">${initialCode}</div>
        <div>
          <h4 class="agency-showcase-title">${agency.name}</h4>
          <span class="agency-rating-stars">★★★★★ <span class="agency-rating-num">5.0</span></span>
        </div>
      </div>
      <p class="agency-showcase-bio">${cleanBio}</p>
      <div class="agency-showcase-metrics">
        <div class="asm-box"><strong>🔒 Escrow</strong><span>Vetted</span></div>
        <div class="asm-box"><strong>${finalCount} Live</strong><span>Tracks</span></div>
      </div>
      <span class="agency-action-tag-link">View Broker Directory →</span>
    `;

    card.addEventListener("click", () => {
      window.location.href = `agency-profile.html?agency=${slug}`;
    });

    agencyContainer.appendChild(card);
  });
}

function loadLocalDatabaseSeedMirrors() {
  return [
    {
      title: "Federal Skilled Worker - Express Entry",
      slug: "canada-express-entry",
      countrySlug: "canada",
      frameworkType: "migration",
      agencyName: "Elite Migration Group",
      heroImageUrl:
        "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80",
      visaCategoryText: "🇨🇦 Permanent Residency (PR)",
      baseRate: 3500,
      processingWindowLabel: "8 - 12 Months",
    },
    {
      title: "Kyoto Advanced Engineering Fellowship",
      slug: "japan-kyoto-academic",
      countrySlug: "japan",
      frameworkType: "academic",
      agencyName: "Nippon Travel Lines",
      heroImageUrl:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
      visaCategoryText: "🇯🇵 Student Visa MEXT",
      baseRate: 1200,
      processingWindowLabel: "4 - 6 Months",
    },
    {
      title: "Alpine Explorer Small-Group Cultural Run",
      slug: "australia-alpine-tourism",
      countrySlug: "australia",
      frameworkType: "tourism",
      agencyName: "Horizon Escapes Co.",
      heroImageUrl:
        "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80",
      visaCategoryText: "🇦🇺 Subclass 600 Tourist",
      baseRate: 850,
      processingWindowLabel: "14 Days",
    },
    {
      title: "Oxford Academic Tier-4 Pathway",
      slug: "uk-oxford-tier4",
      countrySlug: "united kingdom",
      frameworkType: "academic",
      agencyName: "Global Pathways Ltd.",
      heroImageUrl:
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80",
      visaCategoryText: "🇬🇧 Tier 4 Student Visa",
      baseRate: 2900,
      processingWindowLabel: "2 - 3 Months",
    },
  ];
}
// Base route page selector abstraction function
