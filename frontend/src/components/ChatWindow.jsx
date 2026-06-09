import { useEffect, useRef, useState } from 'react';

export default function ChatWindow({ messages, loading }) {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950">
      {messages.map((msg, i) => (
        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className="max-w-[85%] space-y-1.5">
            {/* Message Bubble */}
            <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
              msg.role === 'user'
                ? 'bg-white text-zinc-950 font-semibold rounded-tr-none shadow-md shadow-black/5'
                : 'bg-zinc-900 text-zinc-100 border border-zinc-800/80 rounded-tl-none'
            }`}>
              <div className="whitespace-pre-line">{msg.text}</div>
            </div>

            {/* Sources (for bot messages with sources) */}
            {msg.role === 'bot' && msg.sources && msg.sources.length > 0 && (
              <SourcesList sources={msg.sources} />
            )}
          </div>
        </div>
      ))}
      
      {/* Bouncing Loader */}
      {loading && (
        <div className="flex justify-start">
          <div className="bg-zinc-900 border border-zinc-800/80 text-zinc-300 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
            <span className="text-[10px] text-zinc-400 mr-1">Thinking</span>
            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      )}
      
      <div ref={scrollRef} />
    </div>
  );
}

function SourcesList({ sources }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="text-[10px] text-zinc-400 px-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 hover:text-zinc-200 transition-colors duration-200 font-medium cursor-pointer"
      >
        <svg
          className={`w-3 h-3 transition-transform duration-300 ${open ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
        Sources ({sources.length} matching chunks)
      </button>

      {open && (
        <div className="mt-1.5 space-y-1.5 bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-800/80 max-h-[120px] overflow-y-auto">
          {sources.map((src, idx) => (
            <div key={idx} className="p-1.5 bg-zinc-950/60 border border-zinc-800/60 rounded-lg text-zinc-400 leading-normal select-text">
              <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wider block mb-0.5">Chunk #{idx + 1}</span>
              "{src.trim()}"
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
