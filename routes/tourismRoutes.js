const express = require("express");
const router = express.Router();
const tourismController = require("../controllers/tourismController");

// 💥 CRITICAL FIX: Bind the slug parameter matching the frontend fetch pattern exactly
router.get("/tourism-offers/:slug", tourismController.getTourismOfferBySlug);

module.exports = router;
