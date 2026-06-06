/**
 * ==========================================================================
 * GOABROADLY COUNTRY DETAILS DATA ENGINE
 * ==========================================================================
 */

const COUNTRY_PATHWAYS_DB = {
  1: {
    badge: "Option 01 — Higher Education Track",
    title: "Higher Education Placement & Research Visas",
    desc: "Enables qualified students to enter registered universities, secure student visa classifications, and tap into direct localized workspace transitions upon formal graduation cycles.",
    img: "https://images.unsplash.com/photo-1521737711867-e3b904737572?auto=format&fit=crop&w=800&q=80",
  },
  2: {
    badge: "Option 02 — Short-Term Travel Track",
    title: "Temporary Tourism Entry & Cultural Sightseeing Passports",
    desc: "Simple e-visa frameworks or visa-exempt entries spanning 15 to 90 days for exploratory travel, brief networking circuits, or personal relaxation breaks.",
    img: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80",
  },
  3: {
    badge: "Option 03 — Long-Term Settlement Track",
    title: "Professional Highly-Skilled Talent & Corporate Visas",
    desc: "A target pathway optimized for software engineering, executive management, and research specialists carrying direct points-based system criteria metrics.",
    img: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
  },
  4: {
    badge: "Option 04 — Language Integration Track",
    title: "Intensive Language School Enrollments & Immersive Studies",
    desc: "Provides foundational academic entry frameworks for up to 24 months, explicitly focusing on rapid verbal and written conversational transformation goals.",
    img: "https://images.unsplash.com/photo-1483450388369-9ed95738483c?auto=format&fit=crop&w=800&q=80",
  },
};

function setItineraryStep(stepNumber) {
  const stepData = COUNTRY_PATHWAYS_DB[stepNumber];
  if (!stepData) return;

  document.getElementById("itinerary-pane-badge").textContent = stepData.badge;
  document.getElementById("itinerary-pane-title").textContent = stepData.title;
  document.getElementById("itinerary-pane-desc").textContent = stepData.desc;
  document.getElementById("itinerary-pane-img").src = stepData.img;

  const links = document.querySelectorAll(".itinerary-nav-item");
  links.forEach((link, idx) => {
    if (idx === stepNumber - 1) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function toggleRowAccordion(clickedTrigger) {
  const activeNode = clickedTrigger.parentElement;
  const isAlreadyOpen = activeNode.classList.contains("active");

  document.querySelectorAll(".accordion-row-node").forEach((node) => {
    node.classList.remove("active");
    const icon = node.querySelector(".node-icon");
    if (icon) icon.textContent = "▼";
  });

  if (!isAlreadyOpen) {
    activeNode.classList.add("active");
    clickedTrigger.querySelector(".node-icon").textContent = "▲";
  }
}
