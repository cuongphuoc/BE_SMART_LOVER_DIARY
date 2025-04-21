const User = require('../app/models/User'); // Import model User
const jwt = require('jsonwebtoken');
require('../config/util/dotenv');

const JWT_SECRET = process.env.JWT_SECRET;

const Authentication = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // lấy token từ header
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // giải mã token
        const user = await User.findById(decoded.id); // tìm người dùng trong cơ sở dữ liệu
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user; // lưu thông tin người dùng vào req để sử dụng trong các middleware tiếp theo
        next(); // Tiếp tục đến middleware tiếp theo
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
module.exports = Authentication;
