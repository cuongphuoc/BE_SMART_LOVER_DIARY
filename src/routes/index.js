const UserRouter = require('./user');
const ExpensesRouter = require('./expensesRoute');
const ShareMoment = require('./ShareMomentRoutes');
const Authentication = require('../Middleware/Authentication');

function route(app) {
    // Gắn router user với đường dẫn /user
    app.use('/api/user', UserRouter);
    // route for expenses
    app.use('/api/expenses', Authentication, ExpensesRouter);
    // route for sharing moment
    app.use('/api/sharing-moment', Authentication, ShareMoment);
}

module.exports = route;
