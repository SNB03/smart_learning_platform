import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, User, Bot } from 'lucide-react';

const AITutorChat = ({ isOpen, onClose, student }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: `Hi ${student?.fullName.split(' ')[0] || ''}! I'm your AI Tutor. Ask me anything about your subjects.` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/student/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userText, classLevel: student?.classLevel || 5 })
      });

      if (response.ok) {
        const data = await response.text();
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: data }]);
      } else {
        throw new Error("Failed");
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: "I'm having trouble connecting to the network right now. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Dark overlay (Mobile only) */}
      <div className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" onClick={onClose}></div>

      {/* THE FIX IS HERE:
        Added `md:max-h-[calc(100vh-8rem)]` to ensure the top never hits the top of the laptop screen.
      */}
      <div className="fixed inset-x-0 bottom-0 md:inset-auto md:bottom-28 md:right-8 w-full md:w-[400px] h-[90dvh] md:h-[600px] md:max-h-[calc(100vh-8rem)] bg-slate-50 md:rounded-[2rem] shadow-2xl z-[101] flex flex-col overflow-hidden animate-slide-up rounded-t-[2rem] border-t md:border border-slate-200">

        {/* Mobile Drag Handle Indicator */}
        <div className="md:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/40 rounded-full z-20 pointer-events-none"></div>

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-5 pt-6 sm:pt-5 flex justify-between items-center text-white shrink-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 flex items-center justify-center shadow-inner shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-lg leading-tight truncate">AI Study Buddy</h3>
              <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0"></span> Online
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors relative z-10 active:scale-95 shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-white/50 scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.sender === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-purple-100 text-purple-600'}`}>
                {msg.sender === 'user' ? <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </div>
              <div className={`p-3 sm:p-3.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'}`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 sm:gap-3 max-w-[85%] animate-fade-in">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-1"><Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></div>
              <div className="p-3 sm:p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-100 shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <form onSubmit={handleSend} className="relative flex items-center bg-slate-50 border border-slate-200 rounded-full px-1 shadow-inner focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 bg-transparent outline-none py-3 sm:py-3.5 px-4 text-[13px] sm:text-sm font-medium text-slate-800 w-full"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className={`p-2 sm:p-2.5 rounded-full flex items-center justify-center transition-all shrink-0 ${input.trim() && !isTyping ? 'bg-indigo-600 text-white shadow-md active:scale-95' : 'bg-slate-200 text-slate-400'}`}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
          <p className="text-[9px] font-bold text-center text-slate-400 mt-2 uppercase tracking-widest hidden md:block">AI can make mistakes. Verify important info.</p>
        </div>

      </div>
    </>
  );
};

export default AITutorChat;