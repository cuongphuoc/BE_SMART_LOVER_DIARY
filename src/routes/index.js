const User = require('./Account');
const Expenses = require('./Expense');
const ShareMoment = require('./ShareMoment');
const Authentication = require('../app/Middleware/Authentication');
const Couple = require('./Couple');
const ToDo = require('./toDo');
function route(app) {
    // Gắn router user với đường dẫn /user
    app.use('/api/user', User);
    // route for expenses
    app.use('/api/expenses', Authentication, Expenses);
    // route for sharing moment
    app.use('/api/sharing-moment', Authentication, ShareMoment);
    // route for connect couple
    app.use('/api/couple', Authentication, Couple);
    app.use('/api/couple-todo', Authentication, ToDo);
}

module.exports = route;
