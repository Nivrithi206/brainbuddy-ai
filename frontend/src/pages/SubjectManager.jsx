import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, BookOpen, Clock, AlertCircle } from 'lucide-react';

export default function SubjectManager() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  
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
      const res = await axios.get('https://vast-sloths-grow.loca.lt/api/subjects');
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject.trim()) return;
    try {
      await axios.post('https://vast-sloths-grow.loca.lt/api/subjects', { name: newSubject });
      setNewSubject('');
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTopic = async () => {
    if (!topicName.trim() || !selectedSubject) return;
    try {
      await axios.post(`https://vast-sloths-grow.loca.lt/api/subjects/${selectedSubject}/topics`, {
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

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Subject Manager</h1>
        <p className="text-gray-400 mt-2">Add subjects and break them down into topics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Add Subject / Topic */}
        <div className="space-y-6">
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-400" /> New Subject</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newSubject}
                onChange={e => setNewSubject(e.target.value)}
                placeholder="e.g. Data Structures"
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
              <button 
                onClick={handleAddSubject}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-indigo-400" /> Add Topic</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Subject</label>
                <select 
                  value={selectedSubject || ''}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="" disabled>Select Subject</option>
                  {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Topic Name</label>
                <input 
                  type="text" 
                  value={topicName}
                  onChange={e => setTopicName(e.target.value)}
                  placeholder="e.g. Arrays and Strings"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Priority</label>
                  <select 
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Difficulty (1-5)</label>
                  <input 
                    type="number" min="1" max="5"
                    value={difficulty}
                    onChange={e => setDifficulty(parseInt(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Estimated Time (mins)</label>
                <input 
                  type="number" step="15"
                  value={estimatedTime}
                  onChange={e => setEstimatedTime(parseInt(e.target.value))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button 
                onClick={handleAddTopic}
                disabled={!selectedSubject || !topicName}
                className="w-full py-2 mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl font-medium transition-colors"
              >
                Add Topic
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: List */}
        <div className="col-span-2 space-y-4">
          {subjects.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700 border-dashed p-8 rounded-2xl text-center text-gray-400">
              No subjects yet. Add your first subject to get started.
            </div>
          ) : (
            subjects.map(subject => (
              <div key={subject._id} className="bg-gray-800 border border-gray-700 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-indigo-400 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }}></div>
                  {subject.name}
                </h3>
                
                {subject.topics.length === 0 ? (
                  <p className="text-sm text-gray-500">No topics added.</p>
                ) : (
                  <div className="space-y-3">
                    {subject.topics.map((topic, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-900 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-colors">
                        <div>
                          <p className="font-medium text-sm">{topic.name}</p>
                          <div className="flex gap-3 mt-1 text-xs text-gray-400">
                            <span className={topic.priority === 'High' ? 'text-red-400' : topic.priority === 'Medium' ? 'text-yellow-400' : 'text-green-400'}>
                              {topic.priority}
                            </span>
                            <span>Diff: {topic.difficulty}/5</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 text-xs bg-gray-800 px-2 py-1 rounded">
                          <Clock className="w-3 h-3" /> {topic.estimatedTime}m
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
