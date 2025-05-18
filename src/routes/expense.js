const express = require('express');
const router = express.Router();
const authLogin=require('../app/middleware/AuthenLogin');
const expenseController = require('../app/controllers/ExpenseController');

// [GET] /api/expenses - Lấy danh sách tất cả chi tiêu
router.get('/',authLogin,expenseController.getData);

// [POST] /api/expenses - Thêm chi tiêu mới
router.post('/',authLogin ,expenseController.add);

// [PUT] /api/expenses/:id - Cập nhật chi tiêu theo ID
router.put('/:id', expenseController.edit);

// [DELETE] /api/expenses/:id - Xóa mềm chi tiêu theo ID
router.delete('/:id', authLogin,expenseController.delete);

module.exports = router;
