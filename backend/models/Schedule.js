const mongoose = require('mongoose');

const BlockSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Study', 'Break', 'Revision'], required: true },
  startTime: { type: String, required: true }, // HH:mm
  endTime: { type: String, required: true }, // HH:mm
  duration: { type: Number, required: true }, // in minutes
  completed: { type: Boolean, default: false },
  missed: { type: Boolean, default: false },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }
});

const ScheduleSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  blocks: [BlockSchema],
  totalStudyTime: { type: Number, default: 0 },
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
