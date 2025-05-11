const Diary = require('../models/Diary'); // Path to the model

module.exports = {
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
    console.log(req.query)
    try {
      let { date } = req.query; // Get the date from the URL parameter, e.g. '2025-05-07'
        console.log(date)
      // Ensure the date is in a valid format by appending 'T00:00:00.000Z' if needed
      if (!date.includes('T')) {
        date += 'T00:00:00.000Z'; // Append the time part to make it a full ISO 8601 string
      }
  
      // Convert to a valid Date object
      const startDate = new Date(date);
  
      if (isNaN(startDate)) {
        throw new Error("Invalid Date format.");
      }
  
      // Set the endDate to be just before midnight of the next day
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1); // This gives you '2025-05-08T00:00:00.000Z'
  
      // Query the database for diaries between startDate and endDate
      const diaries = await Diary.find({
        date: { $gte: startDate, $lt: endDate } // Filters the diaries for that specific date
      });
  
      if (diaries.length > 0) {
        // Convert each diary date to ISO string format for consistent response
        const formattedDiaries = diaries.map(diary => ({
          ...diary.toObject(),
          date: diary.date.toISOString(), // Format date as string
        }));
  
        res.status(200).json(formattedDiaries); // Return the diaries
      } else {
        res.status(404).json([] );
      }
    } catch (error) {
      res.status(400).json([] );
    }
  },

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
