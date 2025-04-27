const Expenses = require('../models/ExpenseModel');

// [POST] /api/expenses - thêm expense
class ExpensesController {
    async getExpenses(req, res, next) {
        try {
            // lấy couple id từ params
            const { id } = req.params;
            const expenses = await Expenses.find({ coupleId: id });

            if (!expenses || expenses.length === 0) {
                return res
                    .status(404)
                    .json({ message: 'No expenses found for this couple' });
            }
            res.status(200).json(expenses);
        } catch (error) {
            next(error);
        }
    }
    async createExpenses(req, res) {
        try {
            const expense = new Expenses(req.body);
            const savedExpense = await expense.save();
            res.status(201).json({
                message: 'Expense created successfully',
                data: savedExpense,
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // [PUT] /api/expenses/update-expenses/:id - edit expense
    async updateExpenses(req, res, next) {
        try {
            const { id } = req.params; // lấy id của expense từ params
            const updateData = req.body;
            const updatedExpense = await Expenses.findByIdAndUpdate(
                id,
                updateData,
                {
                    new: true,
                },
            ); // tìm expense theo id và cập nhật
            if (!updatedExpense) {
                return res.status(404).json({ message: 'Expense not found' });
            }
            res.status(200).json(updatedExpense);
        } catch (error) {
            next(error);
        }
    }
    // [DELETE] /api/delete-expenses/:id - delete expense
    async deleteExpenses(req, res, next) {
        try {
            const { id } = req.params; // id từ slug
            const result = await Expenses.delete({ _id: id }); // sử dụng hàm delete từ plugin mongoose-delete
            if (!result || result.deletedCount === 0) {
                return res.status(404).json({ message: 'Expense not found' });
            }
            res.status(200).json({ message: 'Expense deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new ExpensesController();
