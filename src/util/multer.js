const multer = require('multer');
const path = require('path');

// setup file
const storage = multer.diskStorage({
    // định ngĩa thư mục
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/'); // folder lưu hính ảnh
    },
    // định nghĩa tên file
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        cb(null, `${Date.now()}-${basename}${ext}`);
    },
});

// chỉ lấy ảnh và video
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
});

module.exports = upload;
