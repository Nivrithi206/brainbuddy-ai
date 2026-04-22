import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, RefreshCw } from 'lucide-react';
import axios from 'axios';

export default function Planner() {
  const [schedule, setSchedule] = useState(null);
  const [availableHours, setAvailableHours] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
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

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const res = await axios.post('https://vast-sloths-grow.loca.lt/api/generate-plan', {
        availableHours,
        mood: 'Neutral' // Real app would pull from user state
      });
      setSchedule(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSimulateChaos = async () => {
    setIsGenerating(true);
    try {
      const res = await axios.post('https://vast-sloths-grow.loca.lt/api/reschedule');
      setSchedule(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getBlockStyle = (type, missed) => {
    if (missed) return 'bg-red-900/40 border-red-800/50 text-red-200 opacity-60';
    switch (type) {
      case 'Study': return 'bg-indigo-600/20 border-indigo-500/30 text-indigo-100 hover:border-indigo-400';
      case 'Break': return 'bg-emerald-600/20 border-emerald-500/30 text-emerald-100 hover:border-emerald-400';
      case 'Revision': return 'bg-purple-600/20 border-purple-500/30 text-purple-100 hover:border-purple-400';
      default: return 'bg-gray-800 border-gray-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">Daily Planner</h1>
          <p className="text-gray-400 mt-1">Smart timetable generated just for you.</p>
        </div>
        
        <button 
          onClick={handleSimulateChaos}
          className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30 rounded-lg transition-colors text-sm font-semibold"
          title="Mark random tasks as missed to test auto-rescheduling"
        >
          <RefreshCw className="w-4 h-4" /> Simulate Chaos
        </button>
      </div>

      {/* Generator Controls */}
      <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl flex items-end gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-300 block mb-2">Available Time Today</label>
          <div className="flex items-center gap-3">
            <input 
              type="range" min="1" max="12" step="0.5"
              value={availableHours}
              onChange={e => setAvailableHours(parseFloat(e.target.value))}
              className="flex-1 accent-indigo-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="w-16 font-bold text-center text-indigo-400 bg-gray-900 py-1 rounded">{availableHours} hrs</span>
          </div>
        </div>
        <button 
          onClick={handleGeneratePlan}
          disabled={isGenerating}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl font-bold flex items-center gap-2 transition-colors"
        >
          {isGenerating ? <span className="animate-pulse">Generating...</span> : <><Sparkles className="w-5 h-5" /> Generate Plan</>}
        </button>
      </div>

      {/* Timeline */}
      <div className="bg-gray-800 border border-gray-700 p-6 md:p-8 rounded-2xl">
        {!schedule || !schedule.blocks || schedule.blocks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-2">Your day is completely open.</p>
            <p className="text-sm text-gray-500">Set your hours and click generate to build a smart plan.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-gray-700 ml-4 md:ml-6 space-y-6">
            {schedule.blocks.map((block, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative pl-6 md:pl-8"
              >
                {/* Timeline Dot */}
                <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-gray-800 ${block.missed ? 'bg-red-500' : 'bg-indigo-500'}`}></div>
                
                <div className={`p-4 rounded-xl border ${getBlockStyle(block.type, block.missed)} relative overflow-hidden group`}>
                  {block.missed && (
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                      MISSED
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">{block.title}</h4>
                    <span className="text-sm font-medium opacity-70 bg-black/20 px-2 py-1 rounded">
                      {block.startTime} - {block.endTime}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold uppercase tracking-wider opacity-80">{block.type} • {block.duration} mins</span>
                    
                    {block.type === 'Study' && !block.missed && (
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/10 hover:bg-white/20 rounded-full">
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
