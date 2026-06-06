/**
 * ==========================================================================
 * GOABROADLY DYNAMIC MARKETPLACE INTERACTIVE CONTROLLER (VISUAL EDITION)
 * ==========================================================================
 */

const TIMELINE_METRIC_ENGINE = {
  1: {
    title: "Phase 1: Background Analysis & Solvency Mapping",
    body: "Our in-house compliance specialists evaluate documentation, compile certified translations, and audit bank statements to align exactly with immigration parameters within week two.",
    img: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80",
  },
  2: {
    title: "Phase 2: Registry Match & Institutional Submissions",
    body: "Your cleared portfolio metrics are directed into pre-vetted application processing lines across our 14 partner university campuses to unlock instant authorization vouchers.",
    img: "https://images.unsplash.com/photo-1521737711867-e3b904737572?auto=format&fit=crop&w=400&q=80",
  },
  3: {
    title: "Phase 3: Certificate of Eligibility (COE) Hold Queue",
    body: "We lodge your complete technical dossier directly into the regional Immigration Bureau registry system and provide direct status tracking transparency right to your profile pipeline.",
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&q=80",
  },
  4: {
    title: "Phase 4: Embassy Passport Verification & Stamping",
    body: "Upon clearing the immigration token block, our local ground consultants guide you through the passport physical drop-off mechanics at your localized destination consulate.",
    img: "https://images.unsplash.com/photo-1512418490979-917959338e7f?auto=format&fit=crop&w=400&q=80",
  },
  5: {
    title: "Phase 5: Transit Deployment & Core Key Exchange",
    body: "We sync flight itineraries down to our ground team, who will receive you at the entry terminal gates with your mobile network connectivity tokens and immediate apartment housing keys.",
    img: "https://images.unsplash.com/photo-1483450388369-9ed95738483c?auto=format&fit=crop&w=400&q=80",
  },
};

function switchTimelineNode(nodeIndex) {
  const nodeData = TIMELINE_METRIC_ENGINE[nodeIndex];
  if (!nodeData) return;

  // Swap text content safely
  const textWrapper = document.getElementById("js-timeline-text");
  textWrapper.innerHTML = `
    <strong style="font-size:16px; display:block; margin-bottom:4px;">${nodeData.title}</strong>
    ${nodeData.body}
  `;

  // Swap target step image element sources smoothly
  const imgElement = document.getElementById("js-timeline-img");
  imgElement.src = nodeData.img;

  // Update selection node tracking lines
  const steps = document.querySelectorAll(".timeline-node-step");
  steps.forEach((step, idx) => {
    if (idx === nodeIndex - 1) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });
}
