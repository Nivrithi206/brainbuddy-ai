import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, User, Minimize2, Sparkles, Zap, Skull } from 'lucide-react';
import axios from '../api/axios';

export default function Chatbot({ realityModeShared, setRealityModeShared }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Protocol initialized. I am BrainBuddy. How can I optimize your cognitive session today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const realityMode = realityModeShared;
  const setRealityMode = setRealityModeShared;


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Use the generic /chat endpoint with realityMode
      const res = await axios.post('/chat', { 
        message: input,
        realityMode: realityMode
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection interrupted. Please verify your neural link (backend)." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-primary text-background rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all glow-primary group"
          >
            <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' }}
            className={`w-96 h-[600px] glass-card flex flex-col overflow-hidden border-primary/20 shadow-[0_0_50px_rgba(221,183,255,0.15)] ${realityMode ? 'border-tertiary/40 shadow-[0_0_50px_rgba(255,179,173,0.15)]' : ''}`}
          >
            {/* Header */}
            <div className={`p-5 border-b border-white/5 bg-primary/5 flex items-center justify-between ${realityMode ? 'bg-tertiary/5' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${realityMode ? 'bg-tertiary/20 border-tertiary/30' : 'bg-primary/20 border-primary/30'}`}>
                  <Bot className={`w-6 h-6 ${realityMode ? 'text-tertiary' : 'text-primary'}`} />
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight text-white uppercase">BrainBuddy AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${realityMode ? 'bg-tertiary' : 'bg-green-400'}`}></div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{realityMode ? 'REALITY MODE ACTIVE' : 'Neural Link Active'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setRealityMode(!realityMode)}
                  className={`p-2 rounded-lg transition-all ${realityMode ? 'bg-tertiary text-background glow-tertiary scale-110' : 'hover:bg-white/5 text-gray-500'}`}
                  title="Reality Mode"
                >
                  <Skull className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-white transition-colors">
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                    ? 'bg-secondary/10 border border-secondary/20 text-secondary-200' 
                    : realityMode 
                      ? 'bg-tertiary/10 border border-tertiary/20 text-tertiary' 
                      : 'bg-surface-container/80 border border-white/5 text-gray-200'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-surface-container/80 p-4 rounded-2xl flex gap-1">
                    <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-5 border-t border-white/5 bg-black/20">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full bg-surface-container border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 transition-all ${loading || !input.trim() ? 'opacity-30' : 'text-primary hover:scale-110 hover:text-glow'}`}
                >
                  <Zap className={`w-5 h-5 ${realityMode ? 'text-tertiary' : 'text-primary'}`} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
