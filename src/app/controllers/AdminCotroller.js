const Diary = require('../models/Diary');
const User = require('../models/User');
const Couple = require('../models/Couple');

module.exports = {
  async getAllDiaries(req, res) {
    try {
      const diaries = await Diary.find().sort({ date: -1 });

      const userIds = diaries.map(d => d.id_user);
      const users = await User.find({ _id: { $in: userIds } });

      const userMap = {};
      users.forEach(u => {
        userMap[u._id.toString()] = u.name;
      });

      const result = diaries.map(d => ({
        ...d.toObject(),
        author: userMap[d.id_user] || 'Unknown'
      }));

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: 'Error fetching all diaries with authors: ' + error.message });
    }
  },

  async deleteDiary(req, res) {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Missing id query param' });
      }

      const diary = await Diary.findOne({ id_diary: id });

      if (!diary) {
        return res.status(404).json({ error: 'Diary not found' });
      }

      await Diary.deleteOne({ id_diary: id });

      res.status(200).json({ message: 'Diary deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Error deleting diary: ' + error.message });
    }
  },

  // Hàm mới: lấy danh sách cặp đôi với tên người dùng format "Khang & Anh"
  async getAllCouples(req, res) {
  try {
    const couples = await Couple.find()
      .populate('id_user1', 'email')
      .populate('id_user2', 'email')
      .sort({ createdAt: -1 });

    const result = couples.map(c => {
      const user1Email = c.id_user1?.email || 'Unknown';
      const user2Email = c.id_user2?.email || 'Unknown';

      return {
        id_couple: c.id_couple,
        coupleName: `${user1Email} & ${user2Email}`,
        startDate: c.startDate,
        createdAt: c.createdAt,
        user1_email: user1Email,
        user2_email: user2Email
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching couples: ' + error.message });
  }
},
async deleteCouple(req, res) {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Missing id query param' });
      }

      const couple = await Couple.findOne({ id_couple: id });

      if (!couple) {
        return res.status(404).json({ error: 'Couple not found' });
      }

      await Couple.deleteOne({ id_couple: id });

      res.status(200).json({ message: 'Couple deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Error deleting couple: ' + error.message });
    }
  }

};
