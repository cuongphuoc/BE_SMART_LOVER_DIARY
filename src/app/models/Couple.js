const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Couple = new Schema(
  {
    user1: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user2: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    coupleName: { type: String, required: true }, // Ví dụ: "Alice & Bob"
    startDate: { type: Date, required: true }, // Ngày bắt đầu mối quan hệ
    slug: { type: String, slug: 'coupleName', unique: true },
  },
  {
    timestamps: true,
  },
);

// Add plugins
mongoose.plugin(slug);
Couple.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

module.exports = mongoose.model('Couple', Couple);
