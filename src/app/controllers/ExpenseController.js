const Expense = require('../models/Expense');

class ExpenseController {
  // [GET] /api/expenses - Lấy danh sách tất cả chi tiêu
  getData(req, res, next) {
    const { month, year } = req.query;

    if (month && year) {
      // Lọc theo tháng và năm nếu có tham số
      const startOfMonth = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1, 0, 0, 0, 0));
      const endOfMonth = new Date(Date.UTC(parseInt(year), parseInt(month), 0, 23, 59, 59, 999));

      Expense.find({
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      })
        .then((expenses) => res.status(200).json(expenses))
        .catch((error) => res.status(500).json({ error: error.message }));
    } else {
      // Lấy tất cả chi tiêu nếu không có tham số tháng và năm
      Expense.find({})
        .then((expenses) => res.status(200).json(expenses))
        .catch((error) => res.status(500).json({ error: error.message }));
    }
  }

  // [POST] /api/expenses - Thêm chi tiêu mới
  add(req, res, next) {
    const expense = new Expense(req.body);
    expense
      .save()
      .then((savedExpense) => res.status(201).json(savedExpense))
      .catch((error) => res.status(400).json({ error: error.message }));
  }

  // [PUT] /api/expenses/:id - Cập nhật chi tiêu theo ID
  edit(req, res, next) {
    Expense.updateOne({ _id: req.params.id }, req.body)
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(400).json({ error: error.message }));
  }

  // [DELETE] /api/expenses/:id - Xoá mềm chi tiêu theo ID
  delete(req, res, next) {
    Expense.delete({ _id: req.params.id })
      .then((result) =>
        res.status(200).json({ message: 'Expense deleted successfully', result })
      )
      .catch((error) => res.status(400).json({ error: error.message }));
  }
}

module.exports = new ExpenseController();
