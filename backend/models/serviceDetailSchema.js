const mongoose = require("mongoose");

// Define the schema for key services details
const keyServiceDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  details: {
    type: [String], // Array of strings for the details
    required: true,
  },
});

// Define the schema for the service details
const serviceDetailsSchema = new mongoose.Schema({
  overview: {
    type: String,
    required: true,
  },
  keyServices: [keyServiceDetailsSchema], // Array of keyServiceDetailsSchema
});

// Define the main schema for the service
const serviceDetailSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  details: {
    type: serviceDetailsSchema, // Nested serviceDetailsSchema
    required: true,
  },
});

module.exports = mongoose.model("ServiceDetail", serviceDetailSchema);
