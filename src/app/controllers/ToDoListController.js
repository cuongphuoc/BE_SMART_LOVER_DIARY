const ToDo = require('../models/ToDo');

class ToDoListController {
    // [GET] /api/todos - Lấy tất cả nhiệm vụ của cặp đôi
    getData(req, res, next) {
        const coupleId = req.user.id_couple;

        if (!coupleId) {
            return res.status(400).json({ message: 'User is not associated with a couple.' });
        }

        ToDo.find({ id_couple: coupleId })
            .then((todos) => res.status(200).json(todos))
            .catch((error) => res.status(500).json({ error: error.message }));
    }

    // [POST] /api/todos - Thêm nhiệm vụ mới
    add(req, res, next) {
        const coupleId = req.user.id_couple;
        const userId = req.user.id;

        if (!coupleId) {
            return res.status(400).json({ message: 'User is not associated with a couple.' });
        }

        const { todos } = req.body;

        if (!Array.isArray(todos) || todos.length === 0) {
            return res.status(400).json({ message: 'No tasks to save.' });
        }

        const todoDocs = todos.map(todo => ({
            task: todo.text,
            id_user: userId,
            id_couple: coupleId,
            date: new Date(), // optional, hoặc dùng default trong schema
        }));

        // Dùng insertMany để lưu hàng loạt
        ToDo.insertMany(todoDocs)
            .then(savedTodos => res.status(201).json(savedTodos))
            .catch(error => res.status(400).json({ error: error.message }));
    }


    // [PUT] /api/todos/:id - Cập nhật nhiệm vụ theo ID
    edit(req, res, next) {
        const todoId = req.params.id;
        const coupleId = req.user.id_couple;

        ToDo.findOne({ _id: todoId, id_couple: coupleId })
            .then((todo) => {
                if (!todo) {
                    return res.status(404).json({ message: 'ToDo not found or not belonging to your couple.' });
                }

                ToDo.updateOne({ _id: todoId }, req.body)
                    .then((result) => res.status(200).json(result))
                    .catch((error) => res.status(400).json({ error: error.message }));
            })
            .catch((error) => res.status(500).json({ error: error.message }));
    }

    // [DELETE] /api/todos/:id - Xoá mềm nhiệm vụ theo ID
    delete(req, res, next) {
        const todoId = req.params.id;
        const coupleId = req.user.id_couple;

        ToDo.findOne({ _id: todoId, id_couple: coupleId })
            .then((todo) => {
                if (!todo) {
                    return res.status(404).json({ message: 'ToDo not found or not belonging to your couple.' });
                }

                ToDo.delete({ _id: todoId })
                    .then((result) =>
                        res.status(200).json({ message: 'ToDo deleted successfully', result })
                    )
                    .catch((error) => res.status(400).json({ error: error.message }));
            })
            .catch((error) => res.status(500).json({ error: error.message }));
    }
}

module.exports = new ToDoListController();
