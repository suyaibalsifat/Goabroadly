const express = require("express");
const router = express.Router();
const agencyController = require("../controllers/agencyController");

router.get(
  "/marketplace/all-offers",
  agencyController.getAllActiveMigrationOffers,
);

// NEW SLUG ROUTE: Resolves details across all three collections
router.get("/marketplace/detail/:slug", agencyController.getUnifiedOfferBySlug);
router.get("/agencies/:slug", agencyController.getAgencyProfileBySlug);

module.exports = router;
