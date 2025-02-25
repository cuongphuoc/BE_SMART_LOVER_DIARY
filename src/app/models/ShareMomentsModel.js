const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const PostSchema = new Schema(
    {
        coupleId: {
            type: Schema.Types.ObjectId,
            ref: 'Couple',
            required: true,
        },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String },
        mediaUrl: { type: String },
        // Tạo slug dựa trên nội dung bài đăng nếu có (nếu content rỗng, slug có thể không được tạo)
        slug: { type: String, slug: 'content', unique: false },
    },
    {
        timestamps: true,
    },
);

// Add plugins
mongoose.plugin(slug);
PostSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Post', PostSchema);
