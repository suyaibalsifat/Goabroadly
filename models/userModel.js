const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide a name."],
    trim: true,
  },
  lastName: {
    type: String,
    required: function () {
      return this.accountType === "applicant";
    },
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your email address."],
    unique: true,
    lowercase: true,
    trim: true,
  },
  accountType: {
    type: String,
    enum: ["applicant", "agency"],
    default: "applicant",
  },
  password: {
    type: String,
    required: [true, "Please provide a security access password."],
    minlength: 8,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ FIXED ASYNC HOOK: Removed (next) parameters completely to stop the Kareem executor crash
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

// Instance Method for checking profile passwords securely
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
