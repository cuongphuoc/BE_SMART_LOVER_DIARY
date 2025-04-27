const express = require('express');
const router = express.Router();
const Authentication = require('../app/Middleware/Authentication');
const expensesController = require('../app/Controllers/ExpensesController');

// [GET] /api/expenses/get-expenses - Get expense
router.get('/get-expenses/:id', Authentication, expensesController.getExpenses);
// [POST] /api/expenses - Add expense
router.post(
    '/create-expenses',
    Authentication,
    expensesController.createExpenses,
);
// [PUT] /api/expenses/update-expenses/:id - edit expense
router.put(
    '/update-expenses/:id',
    Authentication,
    expensesController.updateExpenses,
);
// [DELETE] /api/delete-expenses/:id - delete expense
router.put(
    '/delete-expenses/:id',
    Authentication,
    expensesController.deleteExpenses,
);

module.exports = router;
