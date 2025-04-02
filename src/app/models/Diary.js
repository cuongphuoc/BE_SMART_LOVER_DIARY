const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import UUID

const Schema = mongoose.Schema;

const Diary = new Schema(
  {
    id_diary: { type: String, default: uuidv4, unique: true }, // ID nhật ký
    title: { type: String, required: true },
    description: { type: String, required: true },
    link_img: { type: String }, // Link ảnh (có thể để trống)
    kind: { type: Boolean, required: true }, // Loại nhật ký (true/false)
    date: { type: Date, required: true }, // Ngày diễn ra sự kiện
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

module.exports = mongoose.model('Diary', Diary);
