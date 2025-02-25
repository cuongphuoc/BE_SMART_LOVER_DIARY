const express = require('express');
const router = express.Router();

const expensesController = require('../app/controllers/ExpensesController');

// [GET] /api/expenses/get-expenses - Get expense
router.get('/get-expenses/:id', expensesController.getExpenses);
// [POST] /api/expenses - Add expense
router.post('/create-expenses', expensesController.createExpenses);
// [PUT] /api/expenses/update-expenses/:id - edit expense
router.put('/update-expenses/:id', expensesController.updateExpenses);
// [DELETE] /api/delete-expenses/:id - delete expense
router.put('/delete-expenses/:id', expensesController.deleteExpenses);

module.exports = router;
