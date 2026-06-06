const MigrationOffer = require("../models/migrationOfferModel");

exports.getMigrationOfferBySlug = async (req, res) => {
  try {
    const offer = await MigrationOffer.findOne({ slug: req.params.slug });

    if (!offer) {
      return res.status(404).json({
        status: "fail",
        message: `No migration profile found matching tracking target: ${req.params.slug}`,
      });
    }

    res.status(200).json({
      status: "success",
      data: { offer },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
