// Location: routes/agencyRoutes.js

const express = require("express");
const router = express.Router();
const agencyController = require("../controllers/agencyController");

router.get(
  "/marketplace/all-offers",
  agencyController.getAllActiveMigrationOffers,
);

router.get("/marketplace/detail/:slug", agencyController.getUnifiedOfferBySlug);
router.get("/agencies/:slug", agencyController.getAgencyProfileBySlug);

// 🛠️ MAKE SURE THIS EXACT LINE IS AT THE VERY BOTTOM OF THE FILE:
module.exports = router;
// Export confirmation signature added
// Exposed shared endpoint for public feed

