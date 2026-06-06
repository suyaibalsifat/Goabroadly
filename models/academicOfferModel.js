const mongoose = require("mongoose");

const academicOfferSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    countrySlug: { type: String, required: true },
    agencyName: { type: String, required: true },
    locationString: { type: String, required: true },
    visaTrackText: { type: String, required: true },
    baseRate: { type: Number, required: true },
    nextAcademicIntake: { type: String, required: true },
    galleryImages: [String],
    comparisonFeatures: {
      baseFeeSavedText: String,
      thisPackageVisaRate: String,
      platformAvgVisaRate: String,
      thisPackageVelocity: String,
      platformAvgVelocity: String,
      accommodationStatus: String,
      platformAvgAccommodation: String,
    },
    metrics: {
      visaSuccessRate: String,
      studentsMatchedString: String,
      avgProcessingTime: String,
      ratingScoreString: String,
      reviewCountLabel: String,
    },
    inclusions: [String],
    pathwayPhases: [
      {
        phaseNumber: Number,
        phaseTitle: String,
        description: String,
        imageUrl: String,
      },
    ],
    costBreakdown: [
      {
        label: String,
        amount: Number,
      },
    ],
    successfulPlacements: [
      {
        studentName: String,
        routeString: String,
        quoteText: String,
      },
    ],
    verifiedReviews: [
      {
        starsCount: Number,
        reviewText: String,
        authorMeta: String,
      },
    ],
    similarPackages: [
      {
        agencyName: String,
        basePriceLabel: String,
        successPercentage: String,
        targetHref: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("AcademicOffer", academicOfferSchema);
