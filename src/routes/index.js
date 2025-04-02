const userRouter = require('./user');
const diaryRouter = require('./diary');
const coupleRouter = require('./couple');
function returnRequestData(req, res, next) {
  const requestData = {
    method: req.method,
    url: req.url,
    body: req.body, // In ra body request
    query: req.query, // In ra query parameters nếu có
    headers: req.headers, // In ra headers của request
  };

  // Trả về dữ liệu request trong response
  console.log(requestData);
  res.json("okk");
}
function route(app) {
  app.use('/api/users', userRouter);
  app.use('/api/diaries', diaryRouter);
  app.use('/api/couples', coupleRouter);
  app.use('/api',returnRequestData);
}

module.exports = route;
