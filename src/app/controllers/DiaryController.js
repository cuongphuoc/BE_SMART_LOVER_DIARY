const Diary = require('../models/Diary');

class DiaryController {
  // [GET] /api/diaries - Lấy danh sách tất cả nhật ký
  getData(req, res, next) {
    Diary.find({})
      .then((diaries) => res.status(200).json(diaries))
      .catch((error) => res.status(500).json({ error: error.message }));
  }

  // [POST] /api/diaries - Thêm nhật ký mới
  add(req, res, next) {
    const diary = new Diary(req.body);
    diary
      .save()
      .then((savedDiary) => res.status(201).json(savedDiary))
      .catch((error) => res.status(400).json({ error: error.message }));
  }

  // [PUT] /api/diaries/:id - Sửa thông tin nhật ký theo id
  edit(req, res, next) {
    Diary.updateOne({ _id: req.params.id }, req.body)
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(400).json({ error: error.message }));
  }

  // [DELETE] /api/diaries/:id - Xoá mềm nhật ký theo id
  delete(req, res, next) {
    Diary.delete({ _id: req.params.id })
      .then((result) =>
        res.status(200).json({ message: 'Diary deleted successfully', result })
      )
      .catch((error) => res.status(400).json({ error: error.message }));
  }
}

module.exports = new DiaryController();
