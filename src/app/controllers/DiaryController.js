const Diary = require('../models/Diary'); // Path to the model
const User=require('../models/User')
module.exports = {
  async getByCouple(req, res) {
  try {
    const { id_couple } = req.user;

    if (!id_couple) {
      return res.status(400).json({ error: 'id_couple is required.' });
    }

    const diaries = await Diary.find({ id_couple }).sort({ date: -1 });

    res.status(200).json(diaries);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching diaries by couple: ' + error.message });
  }
},
  // Add a new diary entry
 async add(req, res) {
  try {
    // Tạo đối tượng nhật ký mới
    const diary = new Diary({
      ...req.body,
      id_user: req.user.id,
      id_couple: req.user.id_couple
    });

    // Lưu nhật ký vào cơ sở dữ liệu
    const savedDiary = await diary.save();

    // Trả về kết quả
    res.status(200).json(savedDiary);
  } catch (error) {
    res.status(400).json({ error: 'Error adding diary: ' + error.message });
  }
},

  // Get all diaries, sorted by the newest first
  async get(req, res) {
    try {
      const diaries = await Diary.find().sort({ date: -1 }); // Sort by date in descending order
      res.status(200).json(diaries);
    } catch (error) {
      res.status(400).json({ error: 'Error fetching diaries: ' + error.message });
    }
  },

  // Edit a diary entry by ID
  async edit(req, res) {
    const { id_diary, title, description, date, kind, link_img } = req.body;
    
    try {
      // Ensure that diaryId is provided
      if (!id_diary) {
        return res.status(400).json({ error: 'Diary ID (id_diary) is required.' });
      }
  
      // Update the diary entry by its custom id_diary field
      const updated = await Diary.findOneAndUpdate(
        { id_diary: id_diary },  // Find by the custom id_diary field
        { title, description, date, kind, link_img },  // Fields to update
        {
          new: true,  // Return the updated diary entry
          runValidators: true,  // Ensure validation is applied
        }
      );
  
      if (!updated) {
        return res.status(404).json({ error: 'Diary not found.' });
      }
  
      res.status(200).json(updated);
    } catch (error) {
      console.error('Error updating diary:', error);
      res.status(400).json({ error: 'Error updating diary: ' + error.message });
    }
  }
  ,

  // Get diaries for a specific date (Format: YYYY-MM-DD)
async getByDate(req, res) {
  try {
    const { id, id_couple } = req.user;
    let { date } = req.query;

    if (!date) throw new Error("Missing 'date' query param");

    const originalDate = new Date(date);
    if (isNaN(originalDate)) throw new Error("Invalid date format");

    const startDate = new Date(originalDate);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 1);

    const diaries = await Diary.find({
      id_user: id,
      id_couple: id_couple,
      date: { $gte: startDate, $lt: endDate },
    });

    const user = await User.findById(id);
    const authorName = user ? user.name : "Unknown";

    const formatted = diaries.map(d => ({
      ...d.toObject(),
      date: d.date.toISOString(),
      author: authorName
    }));

    res.status(diaries.length > 0 ? 200 : 404).json(formatted);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
,

  // Delete a diary entry by ID
  async delete(req, res) {
    try {
      const result = await Diary.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'Diary deleted successfully', result });
    } catch (error) {
      res.status(400).json({ error: 'Error deleting diary: ' + error.message });
    }
  }
};

