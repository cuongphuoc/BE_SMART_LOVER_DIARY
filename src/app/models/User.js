const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const User = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        slug: { type: String, slug: 'name', unique: true },
        couplecode: { type: String, sparse: true },
        isMatched: { type: Boolean, default: false },
        id_couple: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    },
    {
        timestamps: true,
    },
);

// Tự động tạo couplecode sau khi tạo user
User.pre('save', async function (next) {
    if (!this.couplecode && this.isNew) {
        const generateCode = () =>
            Math.floor(100000 + Math.random() * 900000).toString();

        let code;
        let existing;
        do {
            code = generateCode();
            existing = await mongoose.models.User.findOne({ couplecode: code });
        } while (existing);

        this.couplecode = code;
    }
    next();
});

// Add plugins
mongoose.plugin(slug);
User.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('User', User);
