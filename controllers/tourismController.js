const TourismOffer = require("../models/tourismOfferModel");

exports.getTourismOfferBySlug = async (req, res) => {
  try {
    // Look for the specific package matching the unique identifier slug
    const offer = await TourismOffer.findOne({ slug: req.params.slug });

    if (!offer) {
      return res.status(404).json({
        status: "fail",
        message: `No tourism package found matching identifier: ${req.params.slug}`,
      });
    }

    // Always send status text to match your frontend .status === 'success' constraint
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
