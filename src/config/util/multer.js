const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục nếu chưa tồn tại
const uploadDir = 'src/uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình lưu file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const basename = path
            .basename(file.originalname, ext)
            .replace(/\s+/g, '_');
        cb(null, `${Date.now()}-${basename}${ext}`);
    },
});

// Chỉ cho phép ảnh và video
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype.startsWith('image/') ||
        file.mimetype.startsWith('video/')
    ) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ cho phép upload ảnh và video'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB (có thể điều chỉnh nếu muốn)
    },
});

module.exports = upload;
