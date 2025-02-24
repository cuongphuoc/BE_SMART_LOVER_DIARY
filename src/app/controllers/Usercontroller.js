const User = require('../models/User');

class UserController {
  // [GET] /api/users - Lấy danh sách tất cả người dùng
  getData(req, res, next) {
    User.find({})
      .then((users) => res.status(200).json(users))
      .catch((error) => res.status(500).json({ error: error.message }));
  }

  // [POST] /api/users - Thêm người dùng mới
  add(req, res, next) {
    const user = new User(req.body);
    user
      .save()
      .then((savedUser) => res.status(201).json(savedUser))
      .catch((error) => res.status(400).json({ error: error.message }));
  }

  // [PUT] /api/users/:id - Sửa thông tin người dùng theo id
  edit(req, res, next) {
    User.updateOne({ _id: req.params.id }, req.body)
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(400).json({ error: error.message }));
  }

  // [DELETE] /api/users/:id - Xoá mềm người dùng theo id
  delete(req, res, next) {
    User.delete({ _id: req.params.id })
      .then((result) =>
        res.status(200).json({ message: 'User deleted successfully', result })
      )
      .catch((error) => res.status(400).json({ error: error.message }));
  }
}

module.exports = new UserController();
