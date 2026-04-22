import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Skull } from 'lucide-react';
import axios from 'axios';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey there! I'm BrainBuddy. Ready to conquer some tasks or should I plan your procrastination?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [realityMode, setRealityMode] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('https://vast-sloths-grow.loca.lt/api/chat', {
        message: userMessage.content,
        mood: 'Neutral', // Ideally fetched from context
        realityMode
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to my brain. Is the backend running?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 p-4 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-transform hover:scale-110 z-50"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-8 w-96 h-[500px] bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 bg-gray-850 border-b border-gray-700 flex justify-between items-center bg-gray-900">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                  <span className="text-sm font-bold">BB</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100">BrainBuddy</h3>
                  <p className="text-xs text-gray-400">{realityMode ? 'Reality Mode: ON' : 'Friendly Mode'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setRealityMode(!realityMode)}
                  className={`p-2 rounded-lg transition-colors ${realityMode ? 'bg-red-500/20 text-red-500' : 'hover:bg-gray-700 text-gray-400'}`}
                  title="Toggle Reality Mode"
                >
                  <Skull className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : realityMode ? 'bg-red-900/30 text-red-200 border border-red-800/50 rounded-tl-none' : 'bg-gray-700 text-gray-200 rounded-tl-none'}`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-400 p-3 rounded-2xl rounded-tl-none">
                    <span className="animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-gray-900 border-t border-gray-700 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
