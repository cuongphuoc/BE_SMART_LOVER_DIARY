const UserRouter = require('./User');
const ExpensesRouter = require('./expensesRoutes');
function route(app) {
    // Gắn router user với đường dẫn /user
    app.use('/api/user', UserRouter);
    // route for expenses
    app.use('/api/expenses', ExpensesRouter);
}

module.exports = route;
