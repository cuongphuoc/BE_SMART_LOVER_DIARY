const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Admin = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['admin'], default: 'admin' },
        slug: { type: String, slug: 'name', unique: true },
        deletedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
    },
);

// Add plugins
mongoose.plugin(slug);
User.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Admin', Admin);
