const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  difficulty: { type: Number, min: 1, max: 5, default: 3 }, // 1 is easiest, 5 is hardest
  estimatedTime: { type: Number, required: true }, // in minutes
  completed: { type: Boolean, default: false }
});

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, default: '#6366f1' },
  topics: [TopicSchema]
});

module.exports = mongoose.model('Subject', SubjectSchema);
