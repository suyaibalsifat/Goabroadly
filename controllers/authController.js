const User = require("../models/userModel");

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, accountType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "An account with this email address already exists.",
      });
    }

    // Create new user record
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      accountType,
    });

    res.status(201).json({
      status: "success",
      data: {
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          accountType: newUser.accountType,
        },
      },
    });
  } catch (err) {
    // 🔍 This prints the exact validation breakdown to your terminal console
    console.error("\n❌ MONGOOSE REGISTRATION BREAKDOWN LOG:", err);

    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Field validation
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide both an email address and a password.",
      });
    }

    // 2) Document validation & password comparison
    const user = await User.findOne({ email });
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email address or password.",
      });
    }

    // 3) Respond with clean user profile payload matrix
    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          accountType: user.accountType,
        },
      },
    });
  } catch (err) {
    console.error("\n❌ MONGOOSE LOGIN BREAKDOWN LOG:", err);

    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
