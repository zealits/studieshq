// const multer  = require('multer')

// const storage = multer.memoryStorage();

// const singleUpload = multer({storage}).single("file");

// module.exports = { singleUpload };

// export singleUpload;

const multer = require('multer');
const path = require('path');

// Configure storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // The directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        // Create a unique filename using the current timestamp and original file extension
        const uniqueSuffix = Date.now() + '-' + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

// Create the multer instance with configured storage
const upload = multer({ storage: storage });

module.exports = upload;


