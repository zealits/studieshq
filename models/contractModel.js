const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
  userId: {
    type: String,
    // ref: 'User',
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  signature: {
    type: String, // Store the signature as a base64 encoded image or SVG
    required: true,
  },
  pdfData: { type: Buffer }, // Store PDF binary data
});

const Contract = mongoose.model("Contract", contractSchema);

module.exports = Contract;
