import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smile, Meh, Frown, Flame } from 'lucide-react';
import axios from 'axios';
import Pomodoro from '../components/Pomodoro';

const quotes = [
  { text: "Don't stop when you're tired. Stop when you're done.", type: "motivational" },
  { text: "I'll do it later' is a recipe for 'I failed the exam'.", type: "savage" },
  { text: "Due tomorrow? Do tomorrow.", type: "funny" },
  { text: "Your phone will still be there in 2 hours. Close TikTok.", type: "savage" }
];

export default function Dashboard() {
  const [mood, setMood] = useState('Neutral');
  const [quote, setQuote] = useState(quotes[0]);
  const [schedule, setSchedule] = useState(null);
  
  useEffect(() => {
    // Pick a random quote
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const res = await axios.get('https://vast-sloths-grow.loca.lt/api/schedule');
      setSchedule(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const moods = [
    { label: 'Productive', icon: Flame, color: 'text-orange-500' },
    { label: 'Neutral', icon: Smile, color: 'text-blue-500' },
    { label: 'Lazy', icon: Meh, color: 'text-yellow-500' },
    { label: 'Stressed', icon: Frown, color: 'text-red-500' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-gray-400 mt-2">Let's see what we can conquer today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Quote Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="md:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
          <p className="text-sm text-indigo-400 font-semibold mb-2 uppercase tracking-wider">Quote of the Day</p>
          <p className="text-2xl font-serif italic text-gray-200">"{quote.text}"</p>
          <span className="inline-block mt-4 text-xs px-2 py-1 bg-gray-700 rounded-md text-gray-300 capitalize">{quote.type}</span>
        </motion.div>

        {/* Mood Tracker */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gray-800 border border-gray-700 p-6 rounded-2xl"
        >
          <h3 className="font-semibold mb-4">How are you feeling?</h3>
          <div className="grid grid-cols-2 gap-3">
            {moods.map(m => (
              <button
                key={m.label}
                onClick={() => setMood(m.label)}
                className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-colors border ${mood === m.label ? 'bg-gray-700 border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-gray-900 border-transparent hover:bg-gray-700'}`}
              >
                <m.icon className={`w-6 h-6 ${m.color}`} />
                <span className="text-xs font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Pomodoro Timer */}
        <Pomodoro />
      </div>

      {/* Today's Overview */}
      <div>
        <h2 className="text-xl font-bold mb-4">Today's Overview</h2>
        {schedule && schedule.blocks && schedule.blocks.length > 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-3xl font-bold text-indigo-400">{schedule.totalStudyTime} <span className="text-lg text-gray-400 font-normal">mins</span></p>
                <p className="text-sm text-gray-400">Total planned study time</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">{schedule.blocks.filter(b => b.type === 'Study').length}</p>
                <p className="text-sm text-gray-400">Study Sessions</p>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <p className="text-xs text-center text-gray-400 mt-3">0% Completed. Time to start!</p>
          </div>
        ) : (
          <div className="bg-gray-800/50 border border-gray-700 border-dashed rounded-2xl p-8 text-center">
            <p className="text-gray-400 mb-4">No schedule generated for today yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
