const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import UUID

const Schema = mongoose.Schema;

const Diary = new Schema(
  {
    id_user:{ type: String},
    id_couple:{type: String},
    id_diary: { type: String, default: uuidv4, unique: true }, // ID nhật ký
    title: { type: String, required: true },
    description: { type: String, required: true },
    link_img: { type: String }, // Link ảnh (có thể để trống)
    kind: { type: Boolean, required: true }, // Loại nhật ký (true/false)
    date: { type: Date, required: true }, 
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Diary', Diary);
