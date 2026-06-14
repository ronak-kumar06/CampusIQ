'use client';
import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export default function AiDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [liveSteps, setLiveSteps] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, liveSteps]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    setLiveSteps(['🧠 Analyzing intent...']);
    
    try {
      const agentUrl = process.env.NEXT_PUBLIC_AGENT_URL || 'https://campusiq-production-acbc.up.railway.app';
      const res = await fetch(`${agentUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, session_id: 'default_user' })
      });
      
      const data = await res.json();
      
      if (data.steps && data.steps.length > 0) {
        setLiveSteps(data.steps);
      }
      
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'model', content: data.response || "Sorry, I couldn't process that." }]);
        setIsLoading(false);
        setLiveSteps([]);
      }, 500); // small delay to let user read the final synthesis step
      
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: "⚠️ Cannot reach Intelligence Agent. Is the FastAPI service running?" }]);
      setIsLoading(false);
      setLiveSteps([]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-accent hover:bg-purple-500 text-white font-medium py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 z-40 flex items-center gap-2"
      >
        <span>✨</span> Ask AI
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-soft-bg">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-soft-text">
            <span className="text-accent">✨</span> Campus AI
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Explainability Panel */}
        {liveSteps.length > 0 && (
          <div className="bg-soft-blue/30 px-6 py-3 border-b border-blue-100 text-xs text-blue-800 space-y-1">
            <div className="font-semibold uppercase tracking-wider text-[10px] text-blue-500 mb-1">Agent Status</div>
            {liveSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2 animate-pulse">
                {step.includes('⚠️') ? '' : '•'} {step}
              </div>
            ))}
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-[#FDFDFD]">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-10 text-sm">
              <div className="text-4xl mb-3">👋</div>
              Ask me about library books, cafeteria menus, campus events, or your academic schedule!
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-accent text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && liveSteps.length === 0 && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 text-sm flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all shadow-sm">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="flex-grow bg-transparent outline-none text-sm text-gray-700 py-1"
              disabled={isLoading}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`ml-2 p-1.5 rounded-full flex items-center justify-center transition-colors ${
                input.trim() && !isLoading ? 'bg-accent text-white hover:bg-purple-500' : 'bg-gray-200 text-gray-400'
              }`}
            >
              <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19V6m0 0l-5 5m5-5l5 5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
