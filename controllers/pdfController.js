const multer = require("multer");
const PDF = require("../models/pdfModel"); // Adjust the path as needed
const Contract = require("../models/contractModel"); // Adjust the path as needed

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage }).single("file"); // Use single file upload

const uploadPdf = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: "Error uploading file" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file was uploaded" });
    }

    try {
      const newPDF = new PDF({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer, // Save the file data
      });
      await newPDF.save();

      res.status(200).json({
        message: "File uploaded successfully",
        file: {
          filename: newPDF.filename,
          contentType: newPDF.contentType,
        },
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to save file" });
    }
  });
};

const getPdfs = async (req, res) => {
  try {
    const files = await PDF.find();
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch files" });
  }
};

const getPdf = async (req, res) => {
  try {
    // console.log(req)
    const pdf = await Contract.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ error: "File not found" });
    }

    // Assuming the file is stored as a buffer in the database
    res.setHeader("Content-Disposition", `attachment; filename=${pdf.filename}`);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdf.pdfData); // Adjust if you're using a different field for file data
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve file" });
  }
};

module.exports = { uploadPdf, getPdfs, getPdf };
