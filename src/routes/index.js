const userRouter = require('./user');
const diaryRouter = require('./diary');
const coupleRouter = require('./couple');
const expenseRouter = require('./expense'); // Thêm dòng này

function returnRequestData(req, res, next) {
  const requestData = {
    method: req.method,
    url: req.url,
    body: req.body,
    query: req.query,
    headers: req.headers,
  };

  console.log(requestData);
  res.json("okk");
}

function route(app) {
  app.use('/api/users', userRouter);
  app.use('/api/diaries', diaryRouter);
  app.use('/api/couples', coupleRouter);
  app.use('/api/expenses', expenseRouter); // Thêm dòng này
 // app.use('/api', returnRequestData);
}

module.exports = route;
