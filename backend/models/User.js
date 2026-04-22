const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, default: 'Student' },
  moodHistory: [{
    date: { type: String }, // YYYY-MM-DD format
    mood: { type: String, enum: ['Productive', 'Neutral', 'Lazy', 'Stressed'] }
  }],
  realityMode: { type: Boolean, default: false },
  dailyQuoteIndex: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', UserSchema);
