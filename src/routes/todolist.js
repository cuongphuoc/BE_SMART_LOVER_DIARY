const express = require('express');
const router = express.Router();
const authLogin = require('../app/middleware/AuthenLogin');
const todoListController = require('../app/controllers/ToDoListController');

// [GET] /api/todos - Lấy danh sách tất cả nhiệm vụ
router.get('/', authLogin, todoListController.getData);

// [POST] /api/todos - Thêm nhiệm vụ mới
router.post('/', authLogin, todoListController.add);

// [PUT] /api/todos/:id - Cập nhật nhiệm vụ theo ID
router.put('/:id', authLogin, todoListController.edit);

// [DELETE] /api/todos/:id - Xóa mềm nhiệm vụ theo ID
router.delete('/:id', authLogin, todoListController.delete);

module.exports = router;
