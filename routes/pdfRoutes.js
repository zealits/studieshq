const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { uploadPDF, downloadPDF, getAllPDFs, getSinglePDF } = require("../controllers/pdfController.js");

const router = express.Router();

// Admin routes
router.route("/admin/pdf/upload").post(uploadPDF);

// Public routes
router.route("/pdfs").get(getAllPDFs);
router.route("/pdf/:filename").get(downloadPDF);
router.route("/pdf/info/:id").get(getSinglePDF);

module.exports = router;
