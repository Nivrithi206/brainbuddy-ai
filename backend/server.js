const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Basic Route for Testing
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BrainBuddy API is running' });
});

async function startServer() {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected (In-Memory)');

    // Seed Data if empty
    const Subject = require('./models/Subject');
    const Note = require('./models/Note');
    const subjectCount = await Subject.countDocuments();
    if (subjectCount === 0) {
      console.log('🌱 Seeding premium demo data...');
      await Subject.insertMany([
        {
          name: 'Neural Networks',
          color: '#ddb7ff',
          targetTime: 120,
          topics: [
            { name: 'Backpropagation Logic', priority: 'High', difficulty: 4, estimatedTime: 45 },
            { name: 'Activation Functions', priority: 'Medium', difficulty: 2, estimatedTime: 30 }
          ]
        },
        {
          name: 'Quantum Physics',
          color: '#adc6ff',
          targetTime: 90,
          topics: [
            { name: 'Schrodinger Equation', priority: 'High', difficulty: 5, estimatedTime: 60 }
          ]
        },
        {
          name: 'Advanced Robotics',
          color: '#34d399',
          targetTime: 60,
          topics: [
            { name: 'Kinematics', priority: 'Medium', difficulty: 4, estimatedTime: 40 }
          ]
        }
      ]);
      
      await Note.insertMany([
        { 
          title: 'Deep Work Protocol', 
          content: 'Focus is a muscle. Dedicate 90-minute blocks to a single subject. Reality Mode is for peak cognitive load.' 
        },
        { 
          title: 'Algorithm Optimization', 
          content: 'O(n log n) is the target for sorting. Avoid nested loops.' 
        }
      ]);
      console.log('✅ Seeding complete.');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

startServer();
