// routes/diaries.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authLogin=require('../app/middleware/AuthenLogin');

// Import controller
const diaryController = require('../app/controllers/DiaryController');

// Cấu hình multer cho việc upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/uploads'); // Đảm bảo thư mục này tồn tại
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Tên file với timestamp
    }
});

const upload = multer({ storage });  // Khởi tạo multer với cấu hình trên

// [GET] /api/diaries - Lấy danh sách tất cả nhật ký
router.get('/', authLogin,diaryController.getByDate);
router.get('/all', authLogin,diaryController.getByCouple);
// [POST] /api/diaries - Thêm nhật ký mới (sử dụng 'uri' làm tên trường ảnh)
router.post('/', upload.single('uri'),authLogin, diaryController.add);

// [PUT] /api/diaries/:id - Cập nhật nhật ký theo id (sử dụng 'uri' làm tên trường ảnh)
router.put('/', upload.single('uri'), diaryController.edit);

// [DELETE] /api/diaries/:id - Xóa mềm nhật ký theo id
router.delete('/:id',authLogin, diaryController.delete);

// [POST] /api/diaries/test - Thêm nhật ký mới (sử dụng 'uri' làm tên trường ảnh)
router.post('/base64',authLogin, diaryController.add);

module.exports = router;