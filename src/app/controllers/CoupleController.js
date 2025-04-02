const Couple = require('../models/Couple');

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
    const couple = new Couple(req.body);
    couple
      .save()
      .then((savedCouple) => res.status(201).json(savedCouple))
      .catch((error) => res.status(400).json({ error: error.message }));
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
