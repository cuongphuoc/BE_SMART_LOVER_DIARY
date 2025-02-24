const UserRouter = require('./User');

function route(app) {
  // Gắn router user với đường dẫn /user
  app.use('/user', UserRouter);
}

module.exports = route;
