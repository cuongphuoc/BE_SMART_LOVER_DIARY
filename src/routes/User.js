const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/Usercontroller');
const Authentication = require('../app/Middleware/Authentication');
const checkRole = require('../app/Middleware/RoleMiddleware');

// [GET] /api/users - Lấy danh sách tất cả người dùng (chỉ admin)
router.get('/', Authentication, checkRole('admin'), userController.getData);

// [POST] /api/users - Thêm người dùng mới
router.post('/register', userController.register);

router.post('/login', userController.login);

// [PUT] /api/users/:id - Cập nhật thông tin người dùng theo id
router.put('/:id', Authentication, userController.edit);

// [DELETE] /api/users/:id - Xóa mềm người dùng theo id
router.delete('/:id', Authentication, userController.delete);

module.exports = router;
