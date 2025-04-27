const Couple = require('../models/Couple');
const ToDo = require('../models/ToDo');

class toDoController {
    async createToDo(req, res) {
        try {
            const { task, date } = req.body;
            const userId = req.user._id;
            const codeCouple = req.user.codeCouple; // lấy codeCouple từ req.user

            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({
                    message: 'Invalid date format. Please use YYYY-MM-DD.',
                });
            }

            if (!task) {
                return res.status(400).json({
                    message: 'Task is required',
                });
            }

            // tìm coupleId từ codeCouple
            const couple = await Couple.findOne({ codeCouple: codeCouple });
            if (!couple) {
                return res.status(400).json({
                    message: 'You are not in a couple',
                });
            }

            // tạo to do mới
            const toDo = await ToDo.create({
                coupleId: couple._id,
                userId: userId,
                task: task,
                date: parsedDate,
            });

            return res.status(200).json({
                message: 'Create to do successfully',
                toDo,
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message,
            });
        }
    }
    async updateToDo(req, res) {
        try {
            const { id } = req.params;
            const { task, date, isCompleted } = req.body;

            // check validation
            if (!task && !date && isCompleted === undefined) {
                return res.status(400).json({
                    message:
                        'At least one field (task, date, isCompleted) is required',
                });
            }

            // timf id
            const toDo = await ToDo.findById(id);
            if (!toDo) {
                return res.status(404).json({
                    message: 'To-do item not found',
                });
            }

            // Update the to-do item
            if (task) toDo.task = task;
            if (date) toDo.date = new Date(date);
            if (isCompleted !== undefined) toDo.isCompleted = isCompleted;

            await toDo.save();

            return res.status(200).json({
                message: 'To-do item updated successfully',
                toDo,
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message,
            });
        }
    }
    async getAllToDo(req, res) {
        try {
            const codeCouple = req.user.codeCouple; // lấy codeCouple từ req.user

            // tìm coupleId từ codeCouple
            const couple = await Couple.findOne({ codeCouple: codeCouple });
            if (!couple) {
                return res.status(400).json({
                    message: 'You are not in a couple',
                });
            }

            // tìm tất cả to do của coupleId
            const toDos = await ToDo.find({ coupleId: couple._id });

            return res.status(200).json({ toDos });
        } catch (error) {
            return res.status(500).json({
                error: error.message,
            });
        }
    }
    async getToDoById(req, res) {
        try {
            const { id } = req.params;

            // tìm to do theo id
            const toDo = await ToDo.findById(id);
            if (!toDo) {
                return res.status(404).json({
                    message: 'To-do item not found',
                });
            }

            return res.status(200).json({ toDo });
        } catch (error) {
            return res.status(500).json({
                error: error.message,
            });
        }
    }
    async deleteToDo(req, res) {
        try {
            const { id } = req.params;

            // tìm to do theo id
            const toDo = await ToDo.findById(id);
            if (!toDo) {
                return res.status(404).json({
                    message: 'To-do item not found',
                });
            }

            // xóa to do
            await ToDo.deleteOne({ _id: id });

            return res.status(200).json({
                message: 'To-do item deleted successfully',
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message,
            });
        }
    }
}

module.exports = new toDoController();
