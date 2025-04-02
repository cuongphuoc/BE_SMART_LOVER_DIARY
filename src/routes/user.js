const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/Usercontroller');

// [GET] /api/users - Lấy danh sách tất cả người dùng
router.get('/', userController.getData);

// [POST] /api/users - Thêm người dùng mới
router.post('/', userController.register);

// [PUT] /api/users/:id - Cập nhật thông tin người dùng theo id
router.put('/:id', userController.edit);

// [DELETE] /api/users/:id - Xóa mềm người dùng theo id
router.delete('/:id', userController.delete);

module.exports = router;
