const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/Usercontroller');
const authLogin=require('../app/middleware/AuthenLogin')

// [GET] /api/users - Lấy danh sách tất cả người dùng
router.get('/profile', authLogin,userController.getProfile);
router.get('/', authLogin,userController.getData);
router.get('/all',userController.getData);
router.delete('/',userController.delete);
// [POST] /api/users - Đăng ký người dùng mới
router.post('/', userController.register);

// [POST] /api/users/login - Đăng nhập người dùng
router.post('/login', userController.login);

// [POST] /api/users/couple - Kết đôi người dùng bằng couplecode


// [PUT] /api/users/:id - Cập nhật thông tin người dùng theo id
router.put('/:id', userController.edit);

// [DELETE] /api/users/:id - Xoá mềm người dùng theo id
router.delete('/:id', userController.delete);

module.exports = router;
