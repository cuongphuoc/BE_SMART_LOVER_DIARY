const User = require('../models/User');
const bcrypt = require('bcrypt');

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

  // [POST] /api/users/register - Đăng ký người dùng với mật khẩu được mã hóa
  async register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        // Kiểm tra thiếu trường bắt buộc
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
        const user = new User({ name, email, password: hashedPassword });
        const savedUser = await user.save();

        res.status(201).json({ message: 'User registered successfully', user: savedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

}

module.exports = new UserController();
