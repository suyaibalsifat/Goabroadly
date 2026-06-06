const mongoose = require("mongoose");

const migrationOfferSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    countrySlug: { type: String, required: true },
    agencyName: { type: String, required: true },
    heroImageUrl: { type: String, default: "" }, // ◄ New global banner/hero image path
    visaCategoryText: { type: String, required: true },
    legalCredentialsText: { type: String, required: true },
    successRateText: { type: String, required: true },
    baseRate: { type: Number, required: true },
    processingWindowLabel: { type: String, required: true },
    installmentTermsLabel: { type: String, required: true },
    metrics: {
      approvalRecord: String,
      processingSpeed: String,
      familiesLandedString: String,
      legalClearanceLabel: String,
    },
    calculatorRules: {
      baseCrsMin: Number,
      baseCrsMax: Number,
      ageFactor30sMinus: Number,
      educationMastersBonus: Number,
      experienceThreeYearsBonus: Number,
      ieltsClb9Bonus: Number,
    },
    roadmapPhases: [
      {
        phaseNumber: Number,
        phaseTitle: String,
        description: String,
        imageUrl: String, // ◄ Maintained for dynamic step-by-step images
      },
    ],
    alternativePathways: [
      {
        title: String,
        description: String,
      },
    ],
    familyBenefits: [String],
    costBreakdown: [
      {
        label: String,
        amount: Number,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("MigrationOffer", migrationOfferSchema);
