import { motion } from 'framer-motion';
import { TrendingUp, Clock, Zap, Target, AlertTriangle, Lightbulb, BarChart3, PieChart, Activity } from 'lucide-react';

export default function Analytics() {
  const stats = [
    { label: 'Current Streak', value: '14 Days', icon: Zap, color: 'text-primary' },
    { label: 'Total Focus Time', value: '128.5 Hrs', icon: Clock, color: 'text-secondary' },
    { label: 'Efficiency Score', value: '82%', icon: Target, color: 'text-tertiary' },
  ];

  const insights = [
    { type: 'KEY INSIGHT', text: "You are 2.4x more likely to finish tasks when starting with a 'Calm' mood.", icon: Activity, color: 'text-primary' },
    { type: 'WARNING', text: "Focus drops by 40% when 'Tired' mood is logged before study.", icon: AlertTriangle, color: 'text-tertiary' },
    { type: 'OPTIMIZATION', text: "Listening to Lo-Fi improves 'Inspired' mood frequency by 15%.", icon: Lightbulb, color: 'text-secondary' },
  ];

  const sessions = [
    { subject: 'Advanced Neural Networks', duration: '2.5h', performance: 'A+', date: 'Today' },
    { subject: 'UI/UX Psychology', duration: '1.2h', performance: 'B', date: 'Yesterday' },
    { subject: 'Ethics in AI', duration: '0.8h', performance: 'A', date: '2 days ago' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-black tracking-tight">
          Deep <span className="text-primary text-glow">Analytics</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl">Your cognitive performance metrics for the last 7 days.</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 border-l-4 border-primary/20 hover:border-primary transition-all group"
          >
            <div className={`p-4 rounded-2xl bg-surface-container ${stat.color} mb-6 inline-block`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-4xl font-black text-white group-hover:text-glow transition-all">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Placeholder Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-secondary" /> Study Hours
            </h3>
            <span className="text-[10px] font-black text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase tracking-widest">Weekly Distribution</span>
          </div>
          <div className="h-64 bg-surface-container/30 rounded-2xl border border-dashed border-white/10 flex items-center justify-center relative overflow-hidden">
             {/* Mock Chart Elements */}
             <div className="flex items-end gap-3 h-32">
                {[40, 60, 45, 90, 75, 50, 85].map((h, i) => (
                  <div key={i} className="w-8 bg-secondary/20 border-t-2 border-secondary/50 rounded-t-lg transition-all hover:bg-secondary/40" style={{ height: `${h}%` }}></div>
                ))}
             </div>
          </div>
        </div>

        <div className="glass-card p-8 border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" /> Efficiency Score
            </h3>
            <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">Retention vs Focus</span>
          </div>
          <div className="h-64 flex flex-col justify-center items-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" className="text-surface-container" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" className="text-primary" strokeDasharray="282.7" strokeDashoffset="56.5" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">82%</span>
                <span className="text-[8px] font-black text-gray-500 uppercase">Average</span>
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-[10px] font-black text-gray-500 uppercase">Retention</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                <span className="text-[10px] font-black text-gray-500 uppercase">Focus</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold flex items-center gap-3">
          AI <span className="text-secondary text-glow">Recommendations</span>
          <TrendingUp className="w-6 h-6 text-gray-600" />
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="glass-card p-6 border border-white/5 relative overflow-hidden group"
            >
              <div className={`absolute -right-10 -bottom-10 w-32 h-32 bg-surface-container/50 rounded-full blur-3xl group-hover:bg-primary/5 transition-colors`}></div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${insight.color}`}>{insight.type}</p>
              <p className="text-sm text-gray-300 leading-relaxed z-10 relative">{insight.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Focus Sessions */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold">Recent Focus Sessions</h3>
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/[0.02]">
                <th className="px-8 py-4">Subject Component</th>
                <th className="px-8 py-4">Duration</th>
                <th className="px-8 py-4">Efficiency</th>
                <th className="px-8 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sessions.map((session, i) => (
                <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-8 py-6 font-bold text-gray-200 group-hover:text-primary transition-colors">{session.subject}</td>
                  <td className="px-8 py-6 text-sm text-gray-400">{session.duration}</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-black rounded-lg">{session.performance}</span>
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-500">{session.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
