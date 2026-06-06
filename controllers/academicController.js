const AcademicOffer = require("../models/academicOfferModel");

exports.getAcademicOfferBySlug = async (req, res) => {
  try {
    const offer = await AcademicOffer.findOne({ slug: req.params.slug });

    if (!offer) {
      return res.status(404).json({
        status: "fail",
        message: `No academic pathway matrix found matching target: ${req.params.slug}`,
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
