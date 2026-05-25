const multer = require('multer');

const path = require('path');

// Storage Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/resumes');
    },

    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;

        cb(null, uniqueName);
    },
});

// File Filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.pdf'];

    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedTypes.includes(ext)) {
        return cb(new Error('Only PDF files allowed'), false);
    }

    cb(null, true);
};

// Upload Middleware
const upload = multer({
    storage,
    fileFilter,
});

module.exports = upload;
