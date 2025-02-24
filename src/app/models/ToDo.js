const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const ToDoSchema = new Schema(
  {
    couple: { type: Schema.Types.ObjectId, ref: 'Couple', required: true },
    task: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    slug: { type: String, slug: 'task', unique: false },
  },
  {
    timestamps: true,
  }
);

// Add plugins
mongoose.plugin(slug);
ToDoSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

module.exports = mongoose.model('ToDo', ToDoSchema);
