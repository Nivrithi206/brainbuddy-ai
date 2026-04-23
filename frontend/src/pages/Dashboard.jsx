import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smile, Meh, Frown, Flame, Zap, BarChart2, Calendar, Clock } from 'lucide-react';
import axios from '../api/axios';
import Pomodoro from '../components/Pomodoro';

const quotes = [
  { text: "Intelligence is the ability to adapt to change.", author: "Stephen Hawking" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Focus is a matter of deciding what things you're not going to do.", author: "John Carmack" }
];

export default function Dashboard() {
  const [mood, setMood] = useState('Neutral');
  const [quote, setQuote] = useState(quotes[0]);
  const [schedule, setSchedule] = useState(null);
  
  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const res = await axios.get('/schedule');
      setSchedule(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const stats = [
    { label: 'Focus Time', value: schedule ? `${(schedule.totalStudyTime / 60).toFixed(1)}h` : '0h', icon: Clock, color: 'text-primary' },
    { label: 'Daily Mastery', value: '15%', icon: Zap, color: 'text-secondary' },
    { label: 'Study Streak', value: '5 Days', icon: Calendar, color: 'text-tertiary' }
  ];

  const moods = [
    { label: 'Productive', icon: Flame, color: 'text-orange-400' },
    { label: 'Neutral', icon: Smile, color: 'text-secondary' },
    { label: 'Lazy', icon: Meh, color: 'text-yellow-400' },
    { label: 'Stressed', icon: Frown, color: 'text-tertiary' }
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white mb-2">
            Stay <span className="text-primary text-glow">Focused</span>
          </h1>
          <p className="text-gray-400 text-lg">Your cognitive roadmap for today is ready.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-surface/30 backdrop-blur-md p-2 rounded-2xl border border-white/5">
          {moods.map(m => (
            <button
              key={m.label}
              onClick={() => setMood(m.label)}
              className={`p-3 rounded-xl transition-all duration-300 flex flex-col items-center gap-1 ${mood === m.label ? 'bg-primary/20 border-primary/50 text-primary glow-primary' : 'hover:bg-white/5 text-gray-500'}`}
              title={m.label}
            >
              <m.icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quote Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-card p-8 flex flex-col justify-center relative overflow-hidden group"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500"></div>
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4">Daily Inspiration</p>
          <h2 className="text-3xl font-serif italic text-gray-100 leading-snug">
            "{quote.text}"
          </h2>
          <p className="mt-4 text-gray-400 font-medium">— {quote.author}</p>
        </motion.div>

        {/* Pomodoro Integrated Card */}
        <div className="glass-card p-8 glow-secondary">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Focus Engine
          </h3>
          <Pomodoro variant="minimal" />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card glass-card-hover p-6 flex items-center gap-5"
          >
            <div className={`p-4 rounded-2xl bg-surface-container ${stat.color} shadow-inner`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Today's Plan Preview */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold flex items-center gap-3">
          Today's <span className="text-secondary">Study Plan</span>
          <BarChart2 className="w-6 h-6 text-gray-600" />
        </h3>
        
        {schedule && schedule.blocks && schedule.blocks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedule.blocks.filter(b => b.type === 'Study').slice(0, 3).map((block, i) => (
              <div key={i} className="glass-card p-5 border-l-4 border-primary/50 hover:border-primary transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-100">{block.title}</h4>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-tighter">
                    {block.duration}m
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">Review core concepts and complete the assigned problem set.</p>
              </div>
            ))}
            {schedule.blocks.filter(b => b.type === 'Study').length > 3 && (
              <div className="glass-card p-5 flex items-center justify-center border-dashed text-gray-500 hover:text-white cursor-pointer">
                <p className="text-sm font-bold">+ {schedule.blocks.filter(b => b.type === 'Study').length - 3} more sessions</p>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card p-12 text-center border-dashed">
            <p className="text-gray-400">No plan generated for today.</p>
            <button className="mt-4 text-secondary text-sm font-bold hover:underline">Launch Planner →</button>
          </div>
        )}
      </div>
    </div>
  );
}

