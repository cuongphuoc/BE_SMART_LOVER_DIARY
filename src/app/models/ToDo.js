const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const ToDoSchema = new Schema(
  {
    task: { type: String, required: true },
    slug: { type: String, slug: 'task', unique: false },

    // Các trường mới thêm
    id_user: { type: String,  },
    id_couple: { type: String,  },
    date: { type: Date }, // hoặc thêm default: Date.now nếu cần
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
