const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    // required: true, // Uncomment if description should be required
  },
  deadline: {
    type: String,
  },
  budget: {
    type: String,
  },
  status: {
    type: String,
    enum: ["available", "applied", "allocated", "completed"],
    default: "available",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  pdf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PDF", // Reference to the PDF model
  },
});

module.exports = mongoose.model("Gig", gigSchema);
