import { useState, useEffect } from 'react';
import { ingestUrl, ingestPdf, checkIndexStatus } from '../api/chatApi';

export default function IngestForm({ onSuccess }) {
  const [activeTab, setActiveTab] = useState('url'); // 'url' or 'pdf'
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [indexExists, setIndexExists] = useState(false);

  useEffect(() => {
    checkIndexStatus()
      .then(res => {
        if (res.data && res.data.exists) {
          setIndexExists(true);
        }
      })
      .catch(err => console.error('Error checking index status:', err));
  }, []);

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    try {
      await ingestUrl(url.trim());
      onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to ingest URL. Make sure it is public and active.');
    }
    setLoading(false);
  };

  const handlePdfUpload = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }
    setLoading(true);
    setError('');
    setFileName(file.name);
    try {
      await ingestPdf(file);
      onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to ingest PDF. Check file format or size.');
    }
    setLoading(false);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragOver(true);
    } else if (e.type === 'dragleave') {
      setDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePdfUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="p-5 flex flex-col gap-4 flex-1 overflow-y-auto bg-zinc-950 text-zinc-200">
      <div className="space-y-1">
        <h3 className="text-md font-semibold text-white">Index Source Data</h3>
        <p className="text-xs text-zinc-400">Feed the AI a webpage URL or a PDF brochure to chat with its contents.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
        <button
          onClick={() => { setActiveTab('url'); setError(''); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg transition-all duration-300 cursor-pointer ${
            activeTab === 'url'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          Website URL
        </button>
        <button
          onClick={() => { setActiveTab('pdf'); setError(''); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg transition-all duration-300 cursor-pointer ${
            activeTab === 'pdf'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          PDF Document
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 flex flex-col justify-center">
        {activeTab === 'url' ? (
          <form onSubmit={handleUrlSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Website Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 text-xs">
                  https://
                </span>
                <input
                  type="text"
                  required
                  disabled={loading}
                  className="w-full text-xs bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-xl pl-16 pr-3 py-2.5 text-white placeholder-zinc-600 outline-none transition-all duration-300 focus:ring-1 focus:ring-zinc-500/20"
                  placeholder="www.example.com"
                  value={url.replace(/^https?:\/\//i, '')}
                  onChange={e => setUrl(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="w-full relative group overflow-hidden bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5 text-zinc-950" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Scraping & Indexing...
                </span>
              ) : (
                "Train Chatbot on URL"
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Upload Document</label>
              
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border border-dashed rounded-xl p-5 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] ${
                  dragOver
                    ? 'border-zinc-500 bg-zinc-800/10'
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-800'
                } ${loading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                onClick={() => document.getElementById('pdf-file-input').click()}
              >
                <input
                  id="pdf-file-input"
                  type="file"
                  accept=".pdf"
                  disabled={loading}
                  className="hidden"
                  onChange={e => e.target.files && handlePdfUpload(e.target.files[0])}
                />
                
                {loading ? (
                  <div className="flex flex-col items-center gap-2">
                    <svg className="animate-spin h-6 w-6 text-zinc-400" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-[11px] text-zinc-300">Parsing PDF & embedding...</span>
                    {fileName && <span className="text-[10px] text-zinc-500 max-w-[150px] truncate">{fileName}</span>}
                  </div>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-zinc-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-xs text-zinc-300 font-medium">Drag & drop your PDF here</p>
                    <p className="text-[10px] text-zinc-500 mt-1">or click to browse from device</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 text-[11px] flex gap-2 items-start mt-2">
          <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {indexExists && (
        <div className="border-t border-zinc-800/80 pt-4 flex flex-col gap-2 mt-1">
          <div className="text-center text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">Or Use Pre-Indexed Data</div>
          <button
            onClick={onSuccess}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-[11px] py-2 px-4 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Chat with Pre-Loaded Index
          </button>
        </div>
      )}
    </div>
  );
}
