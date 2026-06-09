const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),

    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files allowed'));
        }

        cb(null, true);
    },

    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

module.exports = upload;
