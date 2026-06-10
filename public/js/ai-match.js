/**
 * GoAbroadly AI Multi-Input Core Matchmaking Engine Matrix
 */

let PACKAGES_MASTER_CACHE = [];

document.addEventListener("DOMContentLoaded", async () => {
  await loadMasterDatabaseCatalog();
});

async function loadMasterDatabaseCatalog() {
  try {
    const response = await fetch("/api/marketplace/all-offers");
    const json = await response.json();

    if (json.status === "success" && Array.isArray(json.data)) {
      PACKAGES_MASTER_CACHE = json.data;
    }
  } catch (err) {
    console.error("Critical error parsing aggregate collection indexes:", err);
  }
}

function evaluateAiMatches(event) {
  event.preventDefault();

  const loadingBlock = document.getElementById("match-loading");
  const resultsBlock = document.getElementById("match-results-wrapper");
  const gridContainer = document.getElementById("ai-match-cards-container");

  loadingBlock.style.display = "block";
  resultsBlock.style.display = "none";
  gridContainer.innerHTML = "";

  const targetedIntent = document.getElementById("match-intent").value;
  const maxBudgetValue =
    parseFloat(document.getElementById("match-budget").value) || 0;
  const destinationTarget = document.getElementById("match-destination").value;
  const userIeltsScore = parseFloat(
    document.getElementById("match-ielts").value,
  );
  const userStatusProfile = document.getElementById("match-profile").value;
  const userEscrowTier = document.getElementById("match-escrow").value;

  setTimeout(() => {
    let scoredMatches = [];

    PACKAGES_MASTER_CACHE.forEach((item) => {
      let alignmentScore = 95;

      const titleString = (item.title || "").toLowerCase();
      const visaString = (item.visaCategoryText || "").toLowerCase();

      if (targetedIntent !== "all" && item.frameworkType !== targetedIntent) {
        alignmentScore -= 35;
      }

      if (item.baseRate > maxBudgetValue) {
        const disparity = item.baseRate - maxBudgetValue;
        if (disparity > 1500) {
          alignmentScore -= 40;
        } else {
          alignmentScore -= 20;
        }
      } else if (
        item.baseRate <= maxBudgetValue &&
        item.baseRate >= maxBudgetValue - 1000
      ) {
        alignmentScore += 4;
      }

      if (
        destinationTarget !== "all" &&
        item.countrySlug.toLowerCase().trim() !==
          destinationTarget.toLowerCase().trim()
      ) {
        alignmentScore -= 30;
      }

      if (
        item.frameworkType === "academic" ||
        item.frameworkType === "migration"
      ) {
        if (userIeltsScore < 6.5) {
          alignmentScore -= 15;
        } else if (userIeltsScore >= 7.5) {
          alignmentScore += 3;
        }
      }

      if (
        userStatusProfile === "undergraduate" ||
        userStatusProfile === "graduate"
      ) {
        if (
          item.frameworkType === "academic" ||
          titleString.includes("masters") ||
          titleString.includes("tech")
        ) {
          alignmentScore += 5;
        }
      } else if (userStatusProfile === "professional") {
        if (
          item.frameworkType === "migration" ||
          visaString.includes("skilled") ||
          titleString.includes("express entry")
        ) {
          alignmentScore += 5;
        }
      }

      if (userEscrowTier === "strict" && item.frameworkType === "tourism") {
        alignmentScore -= 10;
      }

      alignmentScore = Math.max(15, Math.min(99, alignmentScore));
      scoredMatches.push({ ...item, aiScore: alignmentScore });
    });

    scoredMatches.sort((a, b) => b.aiScore - a.aiScore);

    loadingBlock.style.display = "none";
    resultsBlock.style.display = "block";

    document.getElementById("match-results-count").textContent =
      `Isolated ${scoredMatches.length} Pathway Alternatives`;

    renderMatchGrid(scoredMatches, gridContainer);
  }, 600);
}

// 🛠️ HELPER ROUTING UTILITY TO MAP FILENAMES
function getTargetFilenameByFramework(frameworkType) {
  if (frameworkType === "academic") return "academic-offer.html";
  if (frameworkType === "tourism") return "tourism-offer.html";
  return "migration-offer.html"; // Default fallback route mapping
}

function renderMatchGrid(matches, container) {
  if (matches.length === 0) {
    container.innerHTML = `
            <div style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; border: 1px dashed #cbd5e1; border-radius: 12px; background: #f8fafc;">
                <p style="font-size: 16px; font-weight: 600; color: #0f172a;">No Active Profiles Discovered</p>
            </div>
        `;
    return;
  }

  matches.forEach((card) => {
    let emoji = "🎓";
    if (card.frameworkType === "migration") emoji = "💼";
    if (card.frameworkType === "tourism") emoji = "🏝️";

    const cardNode = document.createElement("div");
    cardNode.style.cssText =
      "background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; position: relative; transition: border-color 0.15s, transform 0.15s; cursor: pointer;";

    cardNode.addEventListener("mouseenter", () => {
      cardNode.style.borderColor = "#0f172a";
      cardNode.style.transform = "translateY(-2px)";
    });
    cardNode.addEventListener("mouseleave", () => {
      cardNode.style.borderColor = "#e2e8f0";
      cardNode.style.transform = "none";
    });

    // 🛠️ DYNAMIC ROUTE FIX INJECTION
    const targetUrlPage = getTargetFilenameByFramework(card.frameworkType);

    cardNode.addEventListener("click", () => {
      window.location.href = `/${targetUrlPage}?offer=${card.slug}&type=${card.frameworkType}`;
    });

    cardNode.innerHTML = `
            <div style="position: relative; width: 100%; height: 170px; background: #e2e8f0;">
                <img src="${card.heroImageUrl}" alt="Visual Path Image" style="width: 100%; height: 100%; object-fit: cover;">
                <div class="match-score-badge">🎯 ${card.aiScore}% Profile Fit</div>
            </div>
            <div style="padding: 20px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background: #f1f5f9; color:#475569;">${emoji} ${card.frameworkType}</span>
                        <span style="font-size: 11px; font-weight: 600; color: #64748b;">${card.visaCategoryText}</span>
                    </div>
                    <h3 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 700; line-height: 1.4; color: #0f172a;">${card.title}</h3>
                    <p style="margin: 0 0 16px 0; font-size: 12px; color: #475569;">Managed by <strong>${card.agencyName}</strong></p>
                </div>
                <div style="border-top: 1px solid #f1f5f9; padding-top: 14px; display: flex; justify-content: space-between; align-items: flex-end;">
                    <div>
                        <span style="font-size: 10px; color: #64748b; display: block; text-transform: uppercase; font-weight: 500;">Escrow Retainer</span>
                        <strong style="font-size: 17px; font-weight: 800; color: #0f172a;">$${card.baseRate.toLocaleString()}</strong>
                    </div>
                    <div style="text-align: right; font-size: 11px; color: #1e293b; font-weight: 600; background: #f8fafc; padding: 4px 8px; border-radius: 4px; border: 1px solid #e2e8f0;">
                        ${card.processingWindowLabel}
                    </div>
                </div>
            </div>
        `;
    container.appendChild(cardNode);
  });
}
