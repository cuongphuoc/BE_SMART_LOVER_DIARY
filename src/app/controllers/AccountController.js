const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Account');
const CodeCouple = require('../Middleware/CodeCouple');
class UserController {
    // [GET] /api/users - Lấy danh sách tất cả người dùng
    getData(req, res) {
        User.find({}, '-password') // không trả về password
            .then((users) => {
                if (req.user?.role !== 'admin') {
                    // nếu không phải admin, chỉ trả về thông tin của người dùng hiện tại
                    users = users.filter(
                        (user) =>
                            user._id.toString() === req.user._id.toString(),
                    );
                }
                return users;
            })
            .then((users) => res.status(200).json(users))
            .catch((error) => res.status(500).json({ error: error.message }));
    }

    // [POST] /api/users/register - ddăng ký người dùng mới
    register(req, res) {
        if (req.user?.role !== 'admin') {
            req.body.role = 'user'; // nếu không phải admin thì mặc định là user
        }
        req.body.code = CodeCouple.generateSixDigitNumber();

        // mã hóa password trước khi lưu
        bcrypt
            .hash(req.body.password, 10)
            .then((hashedPassword) => {
                req.body.password = hashedPassword;

                const user = new User(req.body);
                return user.save();
            })
            .then((savedUser) => res.status(201).json(savedUser))
            .catch((error) => res.status(400).json({ error: error.message }));
    }

    // [POST] /api/users/login - dăng nhập người dùng
    login(req, res) {
        const { email, password } = req.body;

        // kiểm tra email trong cơ sở dữ liệu
        User.findOne({ email })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                // so sánh mật khẩu
                return bcrypt
                    .compare(password, user.password)
                    .then((isMatch) => {
                        if (!isMatch) {
                            return res
                                .status(401)
                                .json({ message: 'Invalid password' });
                        }

                        // tạo token JWT
                        const token = jwt.sign(
                            { id: user._id, role: user.role },
                            process.env.JWT_SECRET,
                            {
                                expiresIn: '1h',
                            },
                        );

                        return res.status(200).json({
                            message: 'Login successful',
                            token,
                            id: user._id,
                            codeCouple: user.code,
                        });
                    });
            })
            .catch((error) => res.status(500).json({ error: error.message }));
    }

    // [PUT] /api/users/:id - sửa thông tin người dùng theo id
    edit(req, res) {
        const { role, _id } = req.user;
        const targetId = req.params.id;

        if (role !== 'admin' && _id.toString() !== targetId) {
            return res
                .status(403)
                .json({ message: 'Bạn không có quyền sửa user này' });
        }

        // nếu không phải admin, chặn sửa role
        if (role !== 'admin') {
            delete req.body.role;
        }

        User.updateOne({ _id: targetId }, req.body)
            .then((result) => res.status(200).json(result))
            .catch((error) => res.status(400).json({ error: error.message }));
    }

    // [DELETE] /api/users/:id - xoá mềm người dùng theo id
    delete(req, res) {
        const { role, _id } = req.user;
        const targetId = req.params.id;

        if (role !== 'admin' && _id.toString() !== targetId) {
            return res
                .status(403)
                .json({ message: 'Bạn không có quyền xoá user này' });
        }

        User.deleteOne({ _id: targetId })
            .then((result) =>
                res
                    .status(200)
                    .json({ message: 'User deleted successfully', result }),
            )
            .catch((error) => res.status(400).json({ error: error.message }));
    }
}

module.exports = new UserController();
