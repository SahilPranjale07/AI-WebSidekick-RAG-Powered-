import { useState } from 'react';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import IngestForm from './IngestForm';
import { sendMessage } from '../api/chatApi';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! Ask me anything about this website or PDF.' }
  ]);
  const [loading, setLoading] = useState(false);
  const [ingested, setIngested] = useState(false);

  const handleSend = async (question) => {
    if (!question.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setLoading(true);
    try {
      const res = await sendMessage(question);
      setMessages(prev => [...prev, {
        role: 'bot',
        text: res.data.answer,
        sources: res.data.sources
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'bot',
        text: 'Sorry, I encountered an error. Please ensure the backend is running and try again.'
      }]);
    }
    setLoading(false);
  };

  const resetSource = () => {
    if (window.confirm("Are you sure you want to index a different source? This will reset the current chat.")) {
      setIngested(false);
      setMessages([{ role: 'bot', text: 'Hi! Ask me anything about this website or PDF.' }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window Panel */}
      {open && (
        <div className="bg-zinc-950 border border-zinc-800 shadow-2xl rounded-2xl w-85 h-[520px] flex flex-col overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-zinc-900 border-b border-zinc-800/80 px-4 py-3.5 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="flex h-2 w-2 absolute top-0 right-0 -mt-0.5 -mr-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <div className="bg-zinc-800/80 p-1.5 rounded-lg text-white border border-zinc-700/50">
                  <svg className="w-4 h-4 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-xs font-bold text-white leading-tight">AI Assistant</h2>
                <p className="text-[9px] text-zinc-400">RAG Knowledge Engine</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {ingested && (
                <button
                  onClick={resetSource}
                  title="Load a new source document/URL"
                  className="text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 p-1.5 rounded-lg transition-colors cursor-pointer border border-zinc-700/30"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 p-1.5 rounded-lg transition-colors cursor-pointer border border-zinc-700/30"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form / Window Body */}
          {!ingested ? (
            <IngestForm onSuccess={() => setIngested(true)} />
          ) : (
            <>
              <ChatWindow messages={messages} loading={loading} />
              <ChatInput onSend={handleSend} disabled={loading} />
            </>
          )}
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-white hover:bg-zinc-200 text-black rounded-full w-14 h-14 shadow-lg shadow-black/25 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group focus:outline-none relative overflow-hidden border border-zinc-300/10"
      >
        {/* Glow effect on hover */}
        <span className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        
        {open ? (
          <svg className="w-6 h-6 transition-transform duration-300 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </div>
  );
}
