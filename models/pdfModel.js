const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  contentType: { type: String, required: true },
  data: { type: Buffer, required: true }, // Store the file data as a Buffer
  metadata: {
    type: Object, // You can store any additional metadata like uploader's ID, description, etc.
    default: {},
  },
});

const PDF = mongoose.model("PDF", pdfSchema);

module.exports = PDF;
