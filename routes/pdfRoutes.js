const express = require('express');
const { uploadPdf, getPdfs, getPdf } = require('../controllers/pdfController'); // Adjust the path as needed
const router = express.Router();

router.post('/upload', uploadPdf);
router.get('/getpdf', getPdfs);
router.get('/pdf/:id', getPdf); // Route to serve a specific PDF

module.exports = router;
