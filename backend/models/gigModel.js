const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    // required: true,
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
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
});

module.exports = mongoose.model("Gig", gigSchema);
