const { MongoClient, GridFSBucket } = require("mongodb");
const mongoose = require("mongoose");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorhander");
const PDF = require("../models/pdfModel"); // Assuming you have a PDF model for metadata

// Use the MongoDB URI from environment variables
const mongoURI = process.env.DB_URI;

// Upload PDF (Admin)
// Upload PDF (Admin)
exports.uploadPDF = catchAsyncErrors(async (req, res, next) => {
  // Check if files are uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHander("No file uploaded", 400));
  }

  // Extract the file from req.files
  const fileKey = Object.keys(req.files)[0]; // Get the first key in req.files
  const pdfFile = req.files[fileKey]; // Access the file using the key

  // Check if the file object is valid
  if (!pdfFile || !pdfFile.data) {
    return next(new ErrorHander("Invalid file data", 400));
  }

  // Connect to MongoDB
  const client = new MongoClient(process.env.DB_URI);
  await client.connect();
  const db = client.db();
  const bucket = new GridFSBucket(db, { bucketName: "pdfs" });

  // Create an upload stream
  const uploadStream = bucket.openUploadStream(pdfFile.name);

  console.log(pdfFile.name);
  console.log("uoptdf");
  console.log(Buffer.isBuffer(pdfFile.data));
  // Check if data is a Buffer or a Stream
  if (Buffer.isBuffer(pdfFile.data)) {
    // If data is a Buffer, use end() to write it
    uploadStream.end(pdfFile.data);
  } else {
    // If data is a Stream, pipe it
    pdfFile.data
      .pipe(uploadStream)
      .on("error", (err) => {
        return next(new ErrorHander("Error uploading PDF", 500));
      })
      .on("finish", async () => {
        const pdf = await PDF.create({ filename: "sdfdsf", metadata: "asdfasdfdf" });
        res.status(201).json({
          success: true,
          pdf,
        });
      });
  }
});

// Download PDF
exports.downloadPDF = catchAsyncErrors(async (req, res, next) => {
  const client = new MongoClient(mongoURI);
  await client.connect();
  const db = client.db();
  const bucket = new GridFSBucket(db, { bucketName: "pdfs" });

  const downloadStream = bucket.openDownloadStreamByName(req.params.filename);
  downloadStream.on("error", (err) => {
    return next(new ErrorHander("PDF not found", 404));
  });

  downloadStream.pipe(res);
});

// Get all PDFs
exports.getAllPDFs = catchAsyncErrors(async (req, res, next) => {
  const pdfs = await PDF.find();

  res.status(200).json({
    success: true,
    pdfs,
  });
});

// Get single PDF metadata
exports.getSinglePDF = catchAsyncErrors(async (req, res, next) => {
  const pdf = await PDF.findById(req.params.id);

  if (!pdf) {
    return next(new ErrorHander("PDF not found", 404));
  }

  res.status(200).json({
    success: true,
    pdf,
  });
});
