import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Calendar, Zap } from 'lucide-react';

export default function Analytics() {
  const stats = [
    { label: 'Total Study Hours', value: '24.5', icon: Zap, color: 'text-yellow-400' },
    { label: 'Completion Rate', value: '85%', icon: TrendingUp, color: 'text-green-400' },
    { label: 'Study Streak', value: '5 Days', icon: Calendar, color: 'text-indigo-400' }
  ];

  const chartData = [
    { day: 'Mon', hours: 4 },
    { day: 'Tue', hours: 6 },
    { day: 'Wed', hours: 3 },
    { day: 'Thu', hours: 5 },
    { day: 'Fri', hours: 4.5 },
    { day: 'Sat', hours: 2 },
    { day: 'Sun', hours: 0 }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Performance Analytics</h1>
        <p className="text-gray-400 mt-2">Data doesn't lie. Your productivity at a glance.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-800 border border-gray-700 p-6 rounded-2xl flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl bg-gray-900 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Simple Bar Chart */}
      <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-bold text-lg flex items-center gap-2"><BarChart2 className="w-5 h-5 text-indigo-400" /> Weekly Productivity</h3>
          <span className="text-sm text-gray-400">Past 7 Days</span>
        </div>

        <div className="flex items-end justify-between h-48 gap-2">
          {chartData.map((data, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
              <div className="w-full relative flex flex-col justify-end h-full">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.hours / 6) * 100}%` }}
                  className="bg-indigo-600/40 border border-indigo-500/50 rounded-t-lg group-hover:bg-indigo-500 transition-colors cursor-pointer relative"
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-xs px-2 py-1 rounded border border-gray-700 whitespace-nowrap">
                    {data.hours}h
                  </div>
                </motion.div>
              </div>
              <span className="text-xs text-gray-500 font-medium">{data.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl">
          <h4 className="font-bold mb-4">Mood vs Productivity</h4>
          <p className="text-sm text-gray-400">You are <span className="text-indigo-400 font-bold">32% more productive</span> when you report a "Productive" mood. Shocking, right?</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl">
          <h4 className="font-bold mb-4">Consistency Tip</h4>
          <p className="text-sm text-gray-400">Your average study session lasts 52 minutes. Try aiming for 60 to hit your weekly goal early.</p>
        </div>
      </div>
    </div>
  );
}
