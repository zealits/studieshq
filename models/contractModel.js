const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    // required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  projectDetails: {
    type: String,
    required: true,
  },
  freelanceStudyDetails: {
    type: String,
    required: true,
  },
  email: { // New field for email address
    type: String,
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  signature: {
    type: String,
  },
  pdfData: { type: Buffer }, // Store PDF binary data
});

const Contract = mongoose.model("Contract", contractSchema);

module.exports = Contract;
