import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Plus, BookOpen, Clock, AlertCircle, Trash2, Edit2, Check, X, ChevronRight, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubjectManager() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [targetTime, setTargetTime] = useState(60);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editSubjectName, setEditSubjectName] = useState('');
  const [editTargetTime, setEditTargetTime] = useState(60);
  
  // Topic form state
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [topicName, setTopicName] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [difficulty, setDifficulty] = useState(3);
  const [estimatedTime, setEstimatedTime] = useState(60);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get('/subjects');
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject.trim()) return;
    try {
      const colors = ['#ddb7ff', '#adc6ff', '#ffb3ad', '#fbbf24', '#34d399'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      await axios.post('/subjects', { name: newSubject, color: randomColor, targetTime });
      setNewSubject('');
      setTargetTime(60);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm('Delete this subject and all its topics?')) return;
    try {
      await axios.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject._id);
    setEditSubjectName(subject.name);
    setEditTargetTime(subject.targetTime || 60);
  };

  const handleUpdateSubject = async (id) => {
    try {
      await axios.put(`/subjects/${id}`, { name: editSubjectName, targetTime: editTargetTime });
      setEditingSubject(null);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTopic = async () => {
    if (!topicName.trim() || !selectedSubject) return;
    try {
      await axios.post(`/subjects/${selectedSubject}/topics`, {
        name: topicName,
        priority,
        difficulty,
        estimatedTime
      });
      setTopicName('');
      setEstimatedTime(60);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTopic = async (subjectId, topicId) => {
    try {
      await axios.delete(`/subjects/${subjectId}/topics/${topicId}`);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-black tracking-tight text-white">
          Academic <span className="text-secondary text-glow">Roadmap</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl">Organize your cognitive load and prioritize topics for maximum efficiency.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Management Tools */}
        <div className="lg:col-span-4 space-y-6">
          {/* New Subject Card */}
          <div className="glass-card p-6 border-l-4 border-primary">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> New Subject
            </h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  placeholder="Subject Name"
                  className="flex-1 bg-surface-container/50 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-1 block">Target Focus (Min)</label>
                  <input 
                    type="number"
                    value={targetTime}
                    onChange={e => setTargetTime(parseInt(e.target.value))}
                    className="w-full bg-surface-container/50 border border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                <button 
                  onClick={handleAddSubject}
                  className="p-3 mt-4 bg-primary text-background rounded-xl hover:scale-105 active:scale-95 transition-transform glow-primary"
                >
                  <Plus className="w-6 h-6 font-bold" />
                </button>
              </div>
            </div>
          </div>

          {/* Add Topic Card */}
          <div className="glass-card p-6 border-l-4 border-secondary glow-secondary">
            <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Topic
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-1 block">Target Subject</label>
                <select 
                  value={selectedSubject || ''}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="w-full bg-surface-container/50 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-all text-gray-300"
                >
                  <option value="" disabled>Select Subject</option>
                  {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-1 block">Topic Name</label>
                <input 
                  type="text" 
                  value={topicName}
                  onChange={e => setTopicName(e.target.value)}
                  placeholder="e.g. Backpropagation"
                  className="w-full bg-surface-container/50 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-1 block">Priority</label>
                  <select 
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    className="w-full bg-surface-container/50 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-all"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-1 block">Difficulty</label>
                  <input 
                    type="number" min="1" max="5"
                    value={difficulty}
                    onChange={e => setDifficulty(parseInt(e.target.value))}
                    className="w-full bg-surface-container/50 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-all"
                  />
                </div>
              </div>

              <button 
                onClick={handleAddTopic}
                disabled={!selectedSubject || !topicName}
                className="w-full py-3 mt-2 bg-secondary text-background font-black rounded-xl hover:bg-secondary/90 disabled:opacity-30 transition-all uppercase tracking-widest text-xs"
              >
                Inject Topic
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Roadmap List */}
        <div className="lg:col-span-8 space-y-6">
          {subjects.length === 0 ? (
            <div className="glass-card p-20 text-center border-dashed border-white/5">
              <p className="text-gray-500 text-lg italic">Your roadmap is currently empty. Initialize a subject to begin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {subjects.map(subject => (
                <motion.div 
                  layout
                  key={subject._id} 
                  className="glass-card overflow-hidden group"
                >
                  <div className="p-6 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-surface-container text-white shadow-inner border border-white/5">
                        <Hash className="w-5 h-5 opacity-40" />
                      </div>
                      
                      {editingSubject === subject._id ? (
                        <div className="flex flex-col gap-3 flex-1">
                          <input 
                            value={editSubjectName}
                            onChange={e => setEditSubjectName(e.target.value)}
                            className="bg-background/50 border border-primary/50 rounded-lg px-3 py-1 text-lg font-bold w-full focus:outline-none"
                          />
                          <div className="flex items-center gap-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Target Time (Min):</label>
                            <input 
                              type="number"
                              value={editTargetTime}
                              onChange={e => setEditTargetTime(parseInt(e.target.value))}
                              className="bg-background/50 border border-primary/50 rounded-lg px-2 py-1 text-xs font-bold w-20 focus:outline-none"
                            />
                            <div className="flex-1"></div>
                            <button onClick={() => handleUpdateSubject(subject._id)} className="p-1 text-green-400 hover:bg-green-400/10 rounded"><Check className="w-5 h-5" /></button>
                            <button onClick={() => setEditingSubject(null)} className="p-1 text-red-400 hover:bg-red-400/10 rounded"><X className="w-5 h-5" /></button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <h3 className="text-2xl font-black text-white">{subject.name}</h3>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Target Session: {subject.targetTime || 60}m</p>
                        </div>
                      )}

                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditSubject(subject)}
                        className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteSubject(subject._id)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 pt-0">
                    <div className="space-y-3">
                      {subject.topics.length === 0 ? (
                        <p className="text-sm text-gray-600 italic py-2">No components mapped for this subject yet.</p>
                      ) : (
                        subject.topics.map((topic, idx) => (
                          <motion.div 
                            key={topic._id || idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-between p-4 bg-background/30 rounded-2xl border border-white/[0.03] group/topic"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-2 h-2 rounded-full ${topic.priority === 'High' ? 'bg-tertiary glow-secondary' : topic.priority === 'Medium' ? 'bg-secondary' : 'bg-gray-600'}`}></div>
                              <div>
                                <p className="font-bold text-gray-200">{topic.name}</p>
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{topic.priority} Priority • Diff {topic.difficulty}/5</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5 text-gray-400 text-xs bg-surface-container px-3 py-1.5 rounded-xl border border-white/5">
                                <Clock className="w-3 h-3" /> {topic.estimatedTime}m
                              </div>
                              <button 
                                onClick={() => handleDeleteTopic(subject._id, topic._id)}
                                className="opacity-0 group-topic/hover:opacity-100 p-2 text-gray-600 hover:text-red-400 transition-all"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

