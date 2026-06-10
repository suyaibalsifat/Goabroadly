// Import all three distinct database models
const AcademicOffer = require("../models/academicOfferModel"); // Or whichever path links to your academicoffers collection schema
const MigrationOffer = require("../models/migrationOfferModel");
const TourismOffer = require("../models/tourismOfferModel"); // Or whichever path links to your tourismoffers collection schema
const Agency = require("../models/agencyModel");

/**
 * Endpoint: Unified Comprehensive Multi-Collection Registry
 * GET /api/marketplace/all-offers
 */
exports.getAllActiveMigrationOffers = async (req, res) => {
  try {
    // 1. Run concurrent database queries across all 3 structural collections
    const [academicRaw, migrationRaw, tourismRaw] = await Promise.all([
      AcademicOffer.find({})
        .lean()
        .catch(() => []),
      MigrationOffer.find({})
        .lean()
        .catch(() => []),
      TourismOffer.find({})
        .lean()
        .catch(() => []),
    ]);

    // 2. Normalize Academic Offers
    const academicNormalized = academicRaw.map((item) => ({
      _id: item._id,
      title: item.title,
      slug: item.slug,
      countrySlug: item.countrySlug,
      agencyName: item.agencyName,
      heroImageUrl:
        item.galleryImages?.[0] ||
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80",
      visaCategoryText: item.visaTrackText || "🎓 Academic Visa Route",
      baseRate: Number(item.baseRate) || 0,
      processingWindowLabel: item.nextAcademicIntake
        ? `Intake: ${item.nextAcademicIntake}`
        : "Academic Track",
      frameworkType: "academic",
    }));

    // 3. Normalize Migration Offers
    const migrationNormalized = migrationRaw.map((item) => ({
      _id: item._id,
      title: item.title,
      slug: item.slug,
      countrySlug: item.countrySlug,
      agencyName: item.agencyName,
      heroImageUrl:
        item.heroImageUrl ||
        "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80",
      visaCategoryText: item.visaCategoryText || "💼 Migration Pathway",
      baseRate: Number(item.baseRate) || 0,
      processingWindowLabel: item.processingWindowLabel || "8 - 12 Months",
      frameworkType: "migration",
    }));

    // 4. Normalize Tourism Offers
    const tourismNormalized = tourismRaw.map((item) => ({
      _id: item._id,
      title: item.title,
      slug: item.slug,
      countrySlug: item.countrySlug,
      agencyName: item.agencyName,
      heroImageUrl:
        item.heroImageUrl ||
        "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80",
      visaCategoryText: item.badgeStatus || "🏝️ Tour Itinerary",
      baseRate: Number(item.baseRate) || 0,
      processingWindowLabel: item.bookingStatusLabel || "Guaranteed Departure",
      frameworkType: "tourism",
    }));

    // 5. Aggregate all normalized collections into a single master stream array
    const masterCatalog = [
      ...academicNormalized,
      ...migrationNormalized,
      ...tourismNormalized,
    ];

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({
      status: "success",
      results: masterCatalog.length,
      data: masterCatalog,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message:
        "Failed to map unified data packages across discrete collections.",
      error: err.message,
    });
  }
};

/**
 * Endpoint: Fetch single corporate profile details by slug
 * GET /api/agencies/:slug
 */
/**
 * Endpoint: Fetch single corporate profile details by slug or name
 * GET /api/agencies/:slug
 */
exports.getAgencyProfileBySlug = async (req, res) => {
  try {
    const slugParam = req.params.slug;

    // 1. Attempt to find the agency by an exact slug match first
    let agency = await Agency.findOne({ slug: slugParam });

    // 2. BACKUP LOGIC: If no slug matches, find by "name" using a case-insensitive regex
    if (!agency) {
      // Convert "amity-law-immigration-group" to "amity law immigration group"
      const cleanName = slugParam.replace(/-/g, " ");

      agency = await Agency.findOne({
        name: { $regex: new RegExp(`^${cleanName}$`, "i") },
      });
    }

    // If still not found after backup check, return 404 safely
    if (!agency) {
      return res.status(404).json({
        status: "fail",
        message: `No corporate registration found for target signature: ${slugParam}`,
      });
    }

    // 3. Query all three tables for items related to this agency name
    const [academic, migration, tourism] = await Promise.all([
      AcademicOffer.find({ agencyName: agency.name })
        .select("title slug baseRate")
        .lean()
        .catch(() => []),
      MigrationOffer.find({ agencyName: agency.name })
        .select("title slug baseRate processingWindowLabel")
        .lean()
        .catch(() => []),
      TourismOffer.find({ agencyName: agency.name })
        .select("title slug baseRate")
        .lean()
        .catch(() => []),
    ]);

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({
      status: "success",
      data: {
        agency,
        offers: [...academic, ...migration, ...tourism],
      },
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

/**
 * Endpoint: Unified Single Slug Resolver across All Paradigms
 * GET /api/marketplace/detail/:slug
 */
exports.getUnifiedOfferBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Concurrently poll all three collections looking for this precise slug string
    const [academicItem, migrationItem, tourismItem] = await Promise.all([
      AcademicOffer.findOne({ slug })
        .lean()
        .catch(() => null),
      MigrationOffer.findOne({ slug })
        .lean()
        .catch(() => null),
      TourismOffer.findOne({ slug })
        .lean()
        .catch(() => null),
    ]);

    // Isolate the item and attach its explicit structural origin framework
    let matchedItem = null;
    let framework = "";

    if (academicItem) {
      matchedItem = academicItem;
      framework = "academic";
    } else if (migrationItem) {
      matchedItem = migrationItem;
      framework = "migration";
    } else if (tourismItem) {
      matchedItem = tourismItem;
      framework = "tourism";
    }

    if (!matchedItem) {
      return res.status(404).json({
        status: "fail",
        message: `No active pathway offering discovered tracking to slug: ${slug}`,
      });
    }

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({
      status: "success",
      frameworkType: framework,
      data: matchedItem,
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};
// Initial query processor routine built
