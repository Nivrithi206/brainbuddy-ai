import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

export default function Pomodoro() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsBreak(!isBreak);
          setMinutes(isBreak ? 25 : 5);
          setIsActive(false);
          clearInterval(interval);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes, isBreak]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(25);
    setSeconds(0);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-xs">
        {isBreak ? <Coffee className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
        {isBreak ? 'Break Earned' : 'Focus Time'}
      </div>
      
      <div className="text-5xl font-mono font-bold text-gray-100 tabular-nums">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className="flex gap-2">
        <button 
          onClick={toggleTimer}
          className={`p-3 rounded-xl transition-colors ${isActive ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
        >
          {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
        <button 
          onClick={resetTimer}
          className="p-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      <p className="text-xs text-gray-500 italic text-center">
        {isBreak ? "Refuel your brain. You earned it!" : "Deep work mode. No distractions allowed."}
      </p>
    </div>
  );
}
