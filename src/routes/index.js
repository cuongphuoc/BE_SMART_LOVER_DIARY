const UserRouter = require('./user');
const ExpensesRouter = require('./expensesRoute');
const ShareMoment = require('./ShareMomentRoutes');

function route(app) {
    // Gắn router user với đường dẫn /user
    app.use('/api/user', UserRouter);
    // route for expenses
    app.use('/api/expenses', ExpensesRouter);
    // route for sharing moment
    app.use('/api/sharing-moment', ShareMoment);
}

module.exports = route;
