const userRouter = require('./user');
const diaryRouter = require('./diary');
const coupleRouter = require('./couple');
const expenseRouter = require('./expense'); // Thêm dòng này
const chatRouter=require('./chat')
const todolistRouter=require('./todolist')
const homeRouter=require('./home')
const adminRouter=require('./Admin');
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
  app.use('/api/expenses', expenseRouter); 
  app.use('/api/chat',chatRouter);
  app.use('/api/todo',todolistRouter);
  app.use('/api/home',homeRouter);
  app.use('/api/admin',adminRouter);

  // Thêm dòng này
 // app.use('/api', returnRequestData);
}

module.exports = route;
