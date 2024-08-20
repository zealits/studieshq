const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const gigSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gig",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
  },
  budget: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["applied", "allocated", "completed"],
    required: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  allocatedAt: Date,
  completedAt: Date,
  paymentStatus: {
    type: String,
    enum: ["not requested", "requested", "approved", "paid"],
    default: "not requested",
  },
  giftCardOption: {
    type: String,
    // enum: ["visa", "master", "none"],
  },
  userSelectedGiftCardOption: {
    type: String,
    // enum: ["visa", "master", "none"],
  },

  requestGiftCardAt: Date,
  giftCardApprovedAt: Date,
  giftCardSentAt: Date,
  giftCardPaidAt: Date,
});

const educationSchema = new mongoose.Schema({
  college: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
});

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  description: String,
});

const languageSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
  },
  proficiency: {
    type: String,
    required: true,
  },
});

const skillSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true,
  },
  proficiency: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  firstName: {
    type: String,
    trim: true,
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  country: {
    type: String,

    trim: true,
  },
  state: {
    type: String,

    trim: true,
  },
  city: {
    type: String,

    trim: true,
  },
  contactNumber: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  gigs: [gigSchema],
  education: [educationSchema],
  experience: [experienceSchema],
  languages: [languageSchema],
  skills: [skillSchema],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT Tokens
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
