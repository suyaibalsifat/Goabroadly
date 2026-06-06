const express = require("express");
const router = express.Router();
const academicController = require("../controllers/academicController");

// Dynamic parametric route lookup target mapping
router.get("/academic-offers/:slug", academicController.getAcademicOfferBySlug);

module.exports = router;
