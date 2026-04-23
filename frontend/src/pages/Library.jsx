import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageSquare, Book, Filter, Clock, ChevronRight, Hash, Plus, Save, Trash2, Edit3, X, Check } from 'lucide-react';
import axios from '../api/axios';

export default function Library() {
  const [activeTab, setActiveTab] = useState('Study Notes');
  const [notes, setNotes] = useState([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);

  const [chats] = useState([
    { id: 1, title: 'Quantum Mechanics Review', date: '2 hours ago', tokens: 1240, category: 'Physics' },
    { id: 2, title: 'Backpropagation Logic', date: 'Yesterday', tokens: 850, category: 'Computer Science' },
    { id: 3, title: 'Cellular Mitosis Phase 2', date: '2 days ago', tokens: 2100, category: 'Biology' },
  ]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get('/notes');
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNote = async () => {
    if (!newNoteContent.trim()) return;
    try {
      if (editingNoteId) {
        await axios.put(`/notes/${editingNoteId}`, { title: newNoteTitle, content: newNoteContent });
      } else {
        await axios.post('/notes', { title: newNoteTitle || 'Untitled Note', content: newNoteContent });
      }
      setIsAddingNote(false);
      setEditingNoteId(null);
      setNewNoteTitle('');
      setNewNoteContent('');
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await axios.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (note) => {
    setEditingNoteId(note._id);
    setNewNoteTitle(note.title);
    setNewNoteContent(note.content);
    setIsAddingNote(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tight text-white">
            Knowledge <span className="text-primary text-glow">Library</span>
          </h1>
          <p className="text-gray-400 text-lg">Retrieve, review, and record your cognitive sessions.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => { setIsAddingNote(true); setEditingNoteId(null); setNewNoteTitle(''); setNewNoteContent(''); }}
            className="flex items-center gap-2 px-6 py-4 bg-primary text-background font-black rounded-2xl hover:scale-105 active:scale-95 transition-all glow-primary uppercase tracking-widest text-xs"
          >
            <Plus className="w-4 h-4" /> New Note
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Categories
            </h3>
            <div className="space-y-2">
              {['Study Notes', 'AI Chat Logs', 'Resources'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-primary/20 text-primary border border-primary/30' : 'text-gray-500 hover:bg-white/5'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-6">
          
          <AnimatePresence>
            {isAddingNote && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-8 border-l-4 border-primary glow-primary overflow-hidden"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-xl text-white uppercase tracking-tighter">
                    {editingNoteId ? 'Edit Note' : 'Initialize New Note'}
                  </h3>
                  <button onClick={() => setIsAddingNote(false)} className="p-2 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4">
                  <input 
                    type="text"
                    value={newNoteTitle}
                    onChange={e => setNewNoteTitle(e.target.value)}
                    placeholder="Note Title"
                    className="w-full bg-surface-container border border-white/5 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all font-bold"
                  />
                  <textarea 
                    value={newNoteContent}
                    onChange={e => setNewNoteContent(e.target.value)}
                    placeholder="Write your study insights here..."
                    rows="6"
                    className="w-full bg-surface-container border border-white/5 rounded-xl px-5 py-4 text-gray-300 focus:outline-none focus:border-primary transition-all resize-none"
                  ></textarea>
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={handleSaveNote}
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-background font-black rounded-xl hover:opacity-90 transition-all uppercase tracking-widest text-[10px]"
                    >
                      <Save className="w-4 h-4" /> Commit to Memory
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {activeTab === 'Study Notes' ? (
              notes.length === 0 ? (
                <div className="glass-card p-20 text-center border-dashed">
                  <p className="text-gray-500 italic">Your neural archives are empty. Record your first insight.</p>
                </div>
              ) : (
                notes.map((note, i) => (
                  <motion.div 
                    key={note._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-6 border border-white/5 hover:border-primary/30 transition-all group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                          <Edit3 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-100">{note.title}</h4>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
                            Updated: {new Date(note.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(note)} className="p-2 text-gray-500 hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteNote(note._id)} className="p-2 text-gray-500 hover:text-tertiary transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-400 text-sm leading-relaxed line-clamp-3">{note.content}</p>
                  </motion.div>
                ))
              )
            ) : (
              chats.map((chat, i) => (
                <motion.div 
                  key={chat.id}
                  className="glass-card p-6 flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center border border-white/5 shadow-inner">
                      <MessageSquare className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-100 group-hover:text-primary transition-colors">{chat.title}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{chat.category} • {chat.date}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
