const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  dueDate: { type: Date, default: null },
  userId: { type: String, default: null, index: true },
}, {
  timestamps: true, 
  collection: 'tasks'
});

module.exports = mongoose.model('Task', taskSchema);
