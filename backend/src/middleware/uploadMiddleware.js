const multer = require('multer');
const fs = require('fs');

const path = require('path');

// Storage Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDirectory = path.join('uploads', 'resumes');

        fs.mkdirSync(uploadDirectory, {
            recursive: true,
        });

        cb(null, uploadDirectory);
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
