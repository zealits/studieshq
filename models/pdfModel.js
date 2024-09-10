const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    metadata: {
        type: Object,  // You can store any additional metadata like uploader's ID, description, etc.
        default: {}
    }
});

const PDF = mongoose.model('PDF', pdfSchema);

module.exports = PDF;
