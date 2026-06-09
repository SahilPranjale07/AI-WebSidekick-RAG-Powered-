import { useState, useRef } from 'react';

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue('');
    // Re-focus the input
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-zinc-800 bg-zinc-950 p-3 flex gap-2 items-center">
      <input
        ref={inputRef}
        type="text"
        disabled={disabled}
        className="flex-1 bg-zinc-900 border border-zinc-800/80 focus:border-zinc-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-all duration-300 focus:ring-1 focus:ring-zinc-500/20 disabled:opacity-50"
        placeholder="Type a message..."
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="bg-white hover:bg-zinc-200 text-black rounded-xl p-2.5 shadow-md transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shrink-0"
      >
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </form>
  );
}
