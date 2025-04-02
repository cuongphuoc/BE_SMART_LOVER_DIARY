const express = require('express');
const router = express.Router();

const diaryController = require('../app/controllers/DiaryController');

// [GET] /api/diaries - Lấy danh sách tất cả nhật ký
router.get('/', diaryController.getData);

// [POST] /api/diaries - Thêm nhật ký mới
router.post('/', diaryController.add);

// [PUT] /api/diaries/:id - Cập nhật nhật ký theo id
router.put('/:id', diaryController.edit);

// [DELETE] /api/diaries/:id - Xóa mềm nhật ký theo id
router.delete('/:id', diaryController.delete);

module.exports = router;
