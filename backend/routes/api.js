const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const { generateSchedule } = require('../utils/planner');

// Get all subjects
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new subject
router.post('/subjects', async (req, res) => {
  try {
    const { name, color } = req.body;
    const newSubject = new Subject({ name, color, topics: [] });
    await newSubject.save();
    res.json(newSubject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a topic to a subject
router.post('/subjects/:id/topics', async (req, res) => {
  try {
    const { name, priority, difficulty, estimatedTime } = req.body;
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    
    subject.topics.push({ name, priority, difficulty, estimatedTime });
    await subject.save();
    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get today's schedule
router.get('/schedule', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let schedule = await Schedule.findOne({ date: today });
    if (!schedule) {
      return res.json(null); // No schedule generated yet
    }
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate new plan
router.post('/generate-plan', async (req, res) => {
  try {
    const { availableHours, mood } = req.body;
    const subjects = await Subject.find();
    
    const { blocks, totalStudyTime } = generateSchedule(subjects, availableHours || 4, mood || 'Neutral');
    
    const today = new Date().toISOString().split('T')[0];
    
    // Replace if exists
    let schedule = await Schedule.findOne({ date: today });
    if (schedule) {
      schedule.blocks = blocks;
      schedule.totalStudyTime = totalStudyTime;
      schedule.generatedAt = Date.now();
      await schedule.save();
    } else {
      schedule = new Schedule({
        date: today,
        blocks,
        totalStudyTime
      });
      await schedule.save();
    }
    
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reschedule (Simulate Chaos)
router.post('/reschedule', async (req, res) => {
  try {
    // We just call generate-plan again but maybe with reduced hours or forced skipped blocks.
    // In a real app, we'd mark current time and only schedule for remaining hours.
    // For the demo, we just regenerate.
    const today = new Date().toISOString().split('T')[0];
    let schedule = await Schedule.findOne({ date: today });
    
    if (schedule) {
      // Mark some random study blocks as missed
      schedule.blocks.forEach(block => {
        if (block.type === 'Study' && Math.random() > 0.5) {
          block.missed = true;
        }
      });
      await schedule.save();
    }
    
    // Then re-run generate-plan logic but ignoring missed? 
    // For demo simplicity, we just return the schedule with missed blocks and then the frontend can ask to "re-optimize"
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Chatbot Endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, mood, realityMode } = req.body;
    
    // In a real app, we'd fetch the user's actual context from the DB here
    const today = new Date().toISOString().split('T')[0];
    const schedule = await Schedule.findOne({ date: today });
    const subjects = await Subject.find();
    
    const contextData = {
      mood: mood || 'Neutral',
      totalStudyTime: schedule ? schedule.totalStudyTime : 0,
      tasksSummary: subjects.map(s => `${s.name}: ${s.topics.length} topics`).join(', ')
    };
    
    const { getChatbotResponse } = require('../utils/openai');
    const reply = await getChatbotResponse(message, contextData, realityMode);
    
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
