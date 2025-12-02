const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Storage Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "sigura_kost",
        allowed_formats: ["jpg", "png", "jpeg", "webp"]
    }
});

// Multer
const upload = multer({ storage });

module.exports = upload;
