const Diary = require('../models/Diary');
const Couple = require('../models/Couple');

const getDiaryStats = async (req, res) => {
  try {
    const id_couple = req.user.id_couple;
    console.log("id_couple:", id_couple);

    // Sử dụng Promise.all để thực hiện các truy vấn đồng thời
    const [totalDiaries, diariesToday, couple] = await Promise.all([
      Diary.countDocuments({ id_couple }),
      Diary.countDocuments({
        id_couple,
        date: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lte: new Date().setHours(23, 59, 59, 999),
        },
      }),
      Couple.findOne({ _id:id_couple }).select('startDate'), // Chỉ chọn trường startDate
    ]);

    if (!couple) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin cặp đôi' });
    }

    // Tính số ngày yêu nhau
    const startDate = new Date(couple.startDate);
    const now = new Date();
    let datingDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    datingDays++;
    return res.json({
      totalDiaries,
      diariesToday,
      datingDays,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thống kê nhật ký:", error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

module.exports = getDiaryStats;