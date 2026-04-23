import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

import { LayoutGrid, Calendar, BookOpen, BarChart2, MessageSquare, LogOut, Sparkles } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Planner from './pages/Planner';
import SubjectManager from './pages/SubjectManager';
import Analytics from './pages/Analytics';
import Library from './pages/Library';
import Chatbot from './components/Chatbot';

function Sidebar({ realityMode, setRealityMode }) {
  const location = useLocation();
  
  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/' },
    { icon: Calendar, label: 'Study Plan', path: '/planner' },
    { icon: BookOpen, label: 'Roadmap', path: '/subjects' },
    { icon: MessageSquare, label: 'Library', path: '/library' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  ];

  return (
    <div className="w-72 bg-surface/30 backdrop-blur-3xl border-r border-white/5 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center glow-primary">
            <Sparkles className="w-6 h-6 text-background font-bold" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white">BRAINBUDDY</h1>
            <p className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">Focus Protocol</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                location.pathname === item.path 
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(221,183,255,0.1)]' 
                : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${location.pathname === item.path ? 'text-primary' : 'text-gray-500'}`} />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-8 space-y-4">
        <div 
          onClick={() => setRealityMode(!realityMode)}
          className={`p-5 rounded-2xl border transition-all cursor-pointer group ${realityMode ? 'bg-tertiary/10 border-tertiary/30 shadow-[0_0_15px_rgba(255,179,173,0.1)]' : 'bg-surface-container/50 border-white/5 hover:bg-white/5'}`}
        >
          <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${realityMode ? 'text-tertiary' : 'text-gray-500'}`}>Reality Mode</p>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${realityMode ? 'text-white' : 'text-gray-400'}`}>{realityMode ? 'ACTIVE' : 'DEACTIVATED'}</span>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${realityMode ? 'bg-tertiary' : 'bg-gray-700'}`}>
              <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${realityMode ? 'right-1' : 'left-1'}`}></div>
            </div>
          </div>
        </div>

        <button className="flex items-center gap-4 px-5 py-3 w-full text-gray-500 hover:text-tertiary transition-colors group">
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </div>
  );
}

function MainLayout() {
  const [realityMode, setRealityMode] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-white selection:bg-primary selection:text-background">
      <Sidebar realityMode={realityMode} setRealityMode={setRealityMode} />
      <main className="flex-1 p-12 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/subjects" element={<SubjectManager />} />
          <Route path="/library" element={<Library />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>
      <Chatbot realityModeShared={realityMode} setRealityModeShared={setRealityMode} />

    </div>
  );
}


function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;
