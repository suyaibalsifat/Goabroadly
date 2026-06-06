const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema({
  key: { type: String, required: true }, // e.g., "tokyo"
  name: { type: String, required: true }, // e.g., "Tokyo Prefecture"
  costIndex: { type: String, required: true }, // e.g., "$1,200 - $1,800/mo"
  medianWage: { type: String, required: true }, // e.g., "$3,400/mo"
  population: { type: String, required: true }, // e.g., "14.0 Million"
  sectors: { type: String, required: true }, // e.g., "Fintech, Software, AI"
});

const costProfileSchema = new mongoose.Schema({
  trackName: { type: String, required: true }, // e.g., "Student Track Profile"
  fillWidthPercentage: { type: Number, required: true }, // e.g., 35
  rangeString: { type: String, required: true }, // e.g., "$800 - $1,400"
});

const visaPathwaySchema = new mongoose.Schema({
  classification: { type: String, required: true }, // e.g., "Higher Education Student Visa"
  processingWindow: { type: String, required: true }, // e.g., "3 Months Baseline"
  potentialTier: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: true,
  },
  activeOffersCount: { type: Number, default: 0 },
});

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true }, // e.g., "Japan"
  slug: { type: String, required: true, unique: true, lowercase: true }, // e.g., "japan"
  continent: {
    type: String,
    required: true,
    enum: ["Asia", "Europe", "Americas", "Oceania"],
  }, // ✨ ADD THIS LINE
  flagEmoji: { type: String, required: true }, // e.g., "🇯🇵"
  heroDescription: { type: String, required: true },
  heroImageUrl: { type: String, required: true },

  // SECTION 1: Macro Metrics
  metrics: {
    population: { type: String, required: true }, // e.g., "125M"
    language: { type: String, required: true },
    safetyIndex: { type: Number, required: true }, // e.g., 9.4
    costTier: { type: String, required: true }, // e.g., "$$$"
  },

  // SECTION 3: System Overview Quad
  overview: {
    education: { type: String, required: true },
    employment: { type: String, required: true },
    lifestyle: { type: String, required: true },
    healthcare: { type: String, required: true },
  },

  // SECTION 4: Available Pathways (Dynamic Offer Aggregation Reference counts)
  offersSummary: {
    studyActiveCount: { type: Number, default: 0 },
    migrationActiveCount: { type: Number, default: 0 },
    tourismActiveCount: { type: Number, default: 0 },
    languageActiveCount: { type: Number, default: 0 },
  },

  // SECTION 5, 6 & 7: Nested Complex Layout Profiles
  regions: [regionSchema],
  costSnapshots: [costProfileSchema],
  visaPathways: [visaPathwaySchema],

  createdAt: { type: Date, default: Date.now },
});

const Country = mongoose.model("Country", countrySchema);
module.exports = Country;
