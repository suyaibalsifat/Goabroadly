const express = require("express");
const router = express.Router();
const migrationController = require("../controllers/migrationController");

router.get(
  "/migration-offers/:slug",
  migrationController.getMigrationOfferBySlug,
);

module.exports = router;
