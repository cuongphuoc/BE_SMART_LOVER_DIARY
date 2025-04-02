const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import UUID
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Couple = new Schema(
  {
    id_couple: { type: String, default: uuidv4, unique: true }, // Tạo ID cặp đôi duy nhất
    id_user1: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    id_user2: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true }, // Ngày bắt đầu mối quan hệ
  },
  {
    timestamps: true,
  },
);

// Add plugins
Couple.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

module.exports = mongoose.model('Couple', Couple);
