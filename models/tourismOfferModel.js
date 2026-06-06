const mongoose = require("mongoose");

const tourismOfferSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    countrySlug: { type: String, required: true, lowercase: true }, // Links it to a specific country profile
    agencyName: { type: String, required: true },
    badgeStatus: { type: String, default: "Premium Itinerary" },
    certificationText: { type: String, default: "Vetted Local Operator" },
    successRateText: { type: String },

    metrics: {
      satisfactionScore: { type: String, default: "98.2%" },
      durationString: { type: String, required: true }, // e.g., "7 Days / 6 Nights"
      slotsFilled: { type: String },
      clearanceStatus: { type: String, default: "All Inclusions Vetted" },
    },

    itineraryPhases: [
      {
        phaseNumber: Number,
        phaseTitle: String,
        description: String,
        imageUrl: String,
      },
    ],

    alternativePackages: [
      {
        title: String,
        description: String,
      },
    ],

    includedPerks: [{ type: String }],

    costBreakdown: [
      {
        label: String,
        amount: Number,
      },
    ],

    baseRate: { type: Number, required: true },
    bookingStatusLabel: { type: String, default: "Guaranteed Departure" },
    installmentOptionText: {
      type: String,
      default: "Available Milestone Terms",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("TourismOffer", tourismOfferSchema);
