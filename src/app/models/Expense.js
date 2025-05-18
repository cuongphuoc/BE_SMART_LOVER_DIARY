const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const ExpenseSchema = new Schema(
  {id_user:{ type: String},
    id_couple:{type: String},
    id_expense: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    id_couple: { type: Schema.Types.ObjectId, ref: 'Couple' },
    id_user: { type: Schema.Types.ObjectId, ref: 'User' },
    description: { type: String },
    money: { type: Number },
    date: { type: Date, default: Date.now },
    kind: { type: String },           // loại chi tiêu, ví dụ: ăn uống, giải trí
    isexpense: { type: Boolean },     // true: chi, false: thu
  },
  {
    timestamps: true,
  }
);

// Add soft-delete plugin
ExpenseSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

module.exports = mongoose.model('Expense', ExpenseSchema);
