const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const ExpenseSchema = new Schema(
    {
        coupleId: {
            type: Schema.Types.ObjectId,
            ref: 'Couple',
            required: true,
        },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        // Tùy chọn: tạo slug từ mô tả nếu cần (không bắt buộc là duy nhất)
        slug: { type: String, slug: 'description', unique: false },
    },
    {
        timestamps: true,
    },
);

// Add plugins
mongoose.plugin(slug);
ExpenseSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Expense', ExpenseSchema);
