const router = require('express').Router();

const ToDoController = require('../app/controllers/toDoController');
const Authentication = require('../app/Middleware/Authentication');

router.post('/create', Authentication, ToDoController.createToDo);
router.put('/update/:id', Authentication, ToDoController.updateToDo);
router.get('/get-all', Authentication, ToDoController.getAllToDo);
router.get('/get/:id', Authentication, ToDoController.getToDoById);
router.delete('/delete/:id', Authentication, ToDoController.deleteToDo);
module.exports = router;
