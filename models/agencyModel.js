const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    logoUrl: { type: String, default: "" },
    heroImageUrl: { type: String, default: "" },
    bio: { type: String, required: true },
    history: { type: String, required: true },
    headquarters: { type: String, required: true },
    foundedYear: { type: Number, required: true },
    globalOfficesCount: { type: Number, required: true },
    certificationDetails: { type: String, required: true }, // e.g., "RCIC / MARA Vetted Legal Group"
    metrics: {
      successRate: { type: String, required: true },
      activeLawyers: { type: Number, required: true },
      casesProcessed: { type: String, required: true },
      ratingStars: { type: Number, default: 5.0 },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Agency", agencySchema);
