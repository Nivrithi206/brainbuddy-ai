import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SubjectManager from './pages/SubjectManager';
import Planner from './pages/Planner';
import Analytics from './pages/Analytics';
import Chatbot from './components/Chatbot';
import { LayoutDashboard, BookOpen, Calendar as CalendarIcon, PieChart, Zap } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="p-6 flex items-center gap-3 border-b border-gray-700">
            <Zap className="w-8 h-8 text-indigo-500 fill-indigo-500" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">BrainBuddy</h1>
          </div>
          
          <nav className="flex-1 p-4 flex flex-col gap-2">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </Link>
            <Link to="/planner" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
              <CalendarIcon className="w-5 h-5" /> Planner
            </Link>
            <Link to="/subjects" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
              <BookOpen className="w-5 h-5" /> Subjects
            </Link>
            <Link to="/analytics" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
              <PieChart className="w-5 h-5" /> Analytics
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative">
          <div className="p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/subjects" element={<SubjectManager />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </div>
          
          {/* Floating Chatbot */}
          <Chatbot />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
