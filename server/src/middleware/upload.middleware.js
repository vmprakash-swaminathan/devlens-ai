const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = "uploads/";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== ".zip") {
        return cb(new Error("Only ZIP files are allowed"), false);
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;