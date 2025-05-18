const Expense = require('../models/Expense');

class ExpenseController {
    // [GET] /api/expenses - Lấy danh sách tất cả chi tiêu của cặp đôi
    getData(req, res, next) {
        const { month, year } = req.query;
        const coupleId = req.user.id_couple; // Lấy ID cặp đôi từ thông tin người dùng

        if (!coupleId) {
            return res.status(400).json({ message: 'User is not associated with a couple.' });
        }

        let query = { id_couple: coupleId };

        if (month && year) {
            // Lọc theo tháng và năm
            const startOfMonth = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1, 0, 0, 0, 0));
            const endOfMonth = new Date(Date.UTC(parseInt(year), parseInt(month), 0, 23, 59, 59, 999));

            query.date = {
                $gte: startOfMonth,
                $lte: endOfMonth,
            };
        }

        Expense.find(query)
            // Lấy thông tin username của người dùng
            .then((expenses) => res.status(200).json(expenses))
            .catch((error) => res.status(500).json({ error: error.message }));
    }

    // [POST] /api/expenses - Thêm chi tiêu mới
    add(req, res, next) {
        console.log("user ID: " + req.user.id);
        console.log("role: " + req.user.role);
        console.log("request couple ID: " + req.body?.id_couple);
        console.log("user couple ID: " + req.user.id_couple);

        const coupleId = req.user.id_couple;
        const userId = req.user.id;

        if (!coupleId) {
            return res.status(400).json({ message: 'User is not associated with a couple.' });
        }

        const expenseData = { ...req.body, id_user: userId, id_couple: coupleId };
        const expense = new Expense(expenseData);

        expense.save()
            .then((savedExpense) => res.status(201).json(savedExpense))
            .catch((error) => res.status(400).json({ error: error.message }));
    }

    // [PUT] /api/expenses/:id - Cập nhật chi tiêu theo ID
    edit(req, res, next) {
        const expenseId = req.params.id;
        const coupleId = req.user.id_couple;

        Expense.findOne({ _id: expenseId, id_couple: coupleId })
            .then((expense) => {
                if (!expense) {
                    return res.status(404).json({ message: 'Expense not found or not belonging to your couple.' });
                }
                Expense.updateOne({ _id: expenseId }, req.body)
                    .then((result) => res.status(200).json(result))
                    .catch((error) => res.status(400).json({ error: error.message }));
            })
            .catch((error) => res.status(500).json({ error: error.message }));
    }

    // [DELETE] /api/expenses/:id - Xoá mềm chi tiêu theo ID
    delete(req, res, next) {
        const expenseId = req.params.id;
        const coupleId = req.user.id_couple;

        Expense.findOne({ _id: expenseId, id_couple: coupleId })
            .then((expense) => {
                if (!expense) {
                    return res.status(404).json({ message: 'Expense not found or not belonging to your couple.' });
                }
                Expense.delete({ _id: expenseId })
                    .then((result) =>
                        res.status(200).json({ message: 'Expense deleted successfully', result })
                    )
                    .catch((error) => res.status(400).json({ error: error.message }));
            })
            .catch((error) => res.status(500).json({ error: error.message }));
    }
}

module.exports = new ExpenseController();