const Country = require("../models/countryModel");

// Get all countries (for the main browse/explore catalog view)
exports.getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find().select(
      "name slug flagEmoji heroDescription metrics",
    );

    res.status(200).json({
      status: "success",
      results: countries.length,
      data: { countries },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// Get a single country's comprehensive payload matrix by slug
exports.getCountryBySlug = async (req, res) => {
  try {
    const country = await Country.findOne({ slug: req.params.slug });

    if (!country) {
      return res.status(404).json({
        status: "fail",
        message:
          "This country gateway does not exist or has not been activated yet.",
      });
    }

    res.status(200).json({
      status: "success",
      data: { country },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
///  YOUR UPDATED FIX:
exports.getAllCountries = async (req, res) => {
  try {
    // Add heroImageUrl right here so the database passes it to the frontend!
    const countries = await Country.find().select(
      "name slug flagEmoji heroDescription metrics continent heroImageUrl",
    );

    res.status(200).json({
      status: "success",
      results: countries.length,
      data: { countries },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
