const Couple = require('../models/Couple');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'cuong'; 
class CoupleController {
  // [GET] /api/couples - Lấy danh sách tất cả các cặp đôi
  getData(req, res, next) {
    Couple.find({})
      .populate('id_user1 id_user2') // Lấy thông tin user1 và user2
      .then((couples) => res.status(200).json(couples))
      .catch((error) => res.status(500).json({ error: error.message }));
  }

  // [POST] /api/couples - Thêm cặp đôi mới
  add(req, res, next) {
    console.log("user " + req.user.id);
    console.log("role " + req.user.role);
    console.log("couple code " + req.body?.couplecode);
  
    const currentUser = req.user;
    const targetCoupleCode = req.body?.couplecode;
  
    if (!currentUser || !targetCoupleCode) {
      console.log("Thiếu thông tin người dùng hoặc mã couplecode.")
      return res.status(400).json({ error: 'Thiếu thông tin người dùng hoặc mã couplecode.' });
    }
    User.findById(currentUser.id).then((currentUserData) => {
      if (currentUserData.id_couple) {
        console.log({ error: 'Bạn đã tham gia một cặp đôi.'+currentUserData.id_couple })
        return res.status(400).json({ error: 'Bạn đã tham gia một cặp đôi.' });
      }
  
      User.findOne({ couplecode: targetCoupleCode, _id: { $ne: currentUser.id } })
        .then((matchedUser) => {
          if (!matchedUser) {
            console.log({ error: 'Không tìm thấy người dùng phù hợp với couplecode.' })
            return res.status(404).json({ error: 'Không tìm thấy người dùng phù hợp với couplecode.' });
          }
  
          if (matchedUser.id_couple) {
            console.log({ error: 'Người dùng này đã tham gia một cặp đôi khác.' })

            return res.status(400).json({ error: 'Người dùng này đã tham gia một cặp đôi khác.' });
          }
  
          const newCouple = new Couple({
            id_user1: currentUser.id,
            id_user2: matchedUser._id,
            startDate: req.body.connectionDate,
          });
  
          return newCouple.save()
            .then(async (savedCouple) => {
              // Cập nhật id_couple cho cả 2
              await User.updateMany(
                { _id: { $in: [currentUser.id, matchedUser._id] } },
                { id_couple: savedCouple._id }
              );
  
              // Lấy lại user hiện tại đã cập nhật
              const updatedUser = await User.findById(currentUser.id);
  
              // Tạo lại token
              const newToken = jwt.sign(
                {
                  id: updatedUser._id,
                  role: updatedUser.role,
                  id_couple: updatedUser.id_couple,
                },
                JWT_SECRET,
                { expiresIn: '7d' }
              );
  
              return res.status(201).json({
                message: 'Ghép đôi thành công!',
                couple: savedCouple,
                user: {
                  id: updatedUser._id,
                  role: updatedUser.role,
                  id_couple: updatedUser.id_couple,
                },
                token: newToken,
              });
            });
        })
        .catch((err) => res.status(500).json({ error: err.message }));
    });
  }
  // [PUT] /api/couples/:id - Sửa thông tin cặp đôi theo id
  edit(req, res, next) {
    Couple.updateOne({ _id: req.params.id }, req.body)
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(400).json({ error: error.message }));
  }

  // [DELETE] /api/couples/:id - Xoá mềm cặp đôi theo id
  delete(req, res, next) {
    Couple.delete({ _id: req.params.id })
      .then((result) =>
        res.status(200).json({ message: 'Couple deleted successfully', result })
      )
      .catch((error) => res.status(400).json({ error: error.message }));
  }
}

module.exports = new CoupleController();
