const express = require('express');
const router = express.Router();

const coupleController = require('../app/controllers/CoupleController');

// [GET] /api/couples - Lấy danh sách tất cả các cặp đôi
router.get('/', coupleController.getData);

// [POST] /api/couples - Thêm cặp đôi mới
router.post('/', coupleController.add);

// [PUT] /api/couples/:id - Cập nhật thông tin cặp đôi theo id
router.put('/:id', coupleController.edit);

// [DELETE] /api/couples/:id - Xóa mềm cặp đôi theo id
router.delete('/:id', coupleController.delete);

module.exports = router;

