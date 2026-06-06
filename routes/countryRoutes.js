const express = require("express");
const countryController = require("../controllers/countryController");

const router = express.Router();

router.get("/countries", countryController.getAllCountries);
router.get("/countries/:slug", countryController.getCountryBySlug);

module.exports = router;
