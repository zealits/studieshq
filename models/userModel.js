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
    enum: ["applied", "allocated", "completed", "contractSigned"],
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
  // New field for storing contract PDF
  contractPdf: {
    type: Buffer,
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
    // required: true,
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
    // required: [true, "Please Enter Your Name"],
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
  is2FAEnabled: { type: Boolean, default: false },
  twoFASecret: { type: String },

  // New Fields for OTP and Email Verification
  verificationCode: {
    type: String,
  },
  verificationCodeExpire: {
    type: Date,
    // select: false,
  },
  isVerified: {
    type: Boolean,
    default: false, // Initially set to false until email is verified
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

// Generate OTP for Email Verification
userSchema.methods.generateVerificationCode = function () {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("Generated OTP:", otpCode); // Log the plain OTP

  this.verificationCode = crypto.createHash("sha256").update(otpCode).digest("hex");
  // console.log("Hashed OTP:", this.verificationCode); // Log the hashed OTP

  this.verificationCodeExpire = Date.now() + 10 * 60 * 1000;

  return otpCode;
};

userSchema.methods.verifyOTP = async function (enteredOtp) {
  // console.log(this.email);
  const hashedOtp = crypto.createHash("sha256").update(enteredOtp).digest("hex");
  // console.log("Entered OTP:", enteredOtp); // Log the entered OTP
  // console.log("Hashed Entered OTP:", hashedOtp); // Log the hashed entered OTP
  // console.log("Stored Hashed OTP:",/ this.verificationCode); // Log the stored hashed OTP

  if (hashedOtp === this.verificationCode && this.verificationCodeExpire > Date.now()) {
    this.isVerified = true;
    this.verificationCode = undefined;
    this.verificationCodeExpire = undefined;
    await this.save();
    return true;
  } else {
    return false;
  }
};

module.exports = mongoose.model("User", userSchema);
