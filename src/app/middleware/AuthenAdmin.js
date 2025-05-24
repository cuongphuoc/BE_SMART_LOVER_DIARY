const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Kiểm tra token có tồn tại không
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cuong');

    // Lưu thông tin người dùng vào request
    req.user = {
      id: decoded.id,
      role: decoded.role,
      id_couple:decoded.id_couple

    };
    console.log(req.user)

    next(); // Cho phép truy cập route tiếp theo
  } catch (error) {
    console.error('JWT verify error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
