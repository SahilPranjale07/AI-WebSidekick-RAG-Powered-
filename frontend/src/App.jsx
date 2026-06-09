import ChatWidget from './components/ChatWidget';

export default function App() {
  const scrollToWidget = () => {
    // Dispatch a custom event to open the chat widget
    const toggleButton = document.querySelector('button[class*="from-violet-600"]');
    if (toggleButton) {
      toggleButton.click();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none relative">
      
      {/* Grid Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold text-lg shadow-sm">
              🤖
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block">WebWidget</span>
              <span className="text-[10px] text-zinc-500 block -mt-1">RAG Engine</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors duration-200">How It Works</a>
          </div>

          <button 
            onClick={scrollToWidget}
            className="border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 text-white font-medium text-xs py-2 px-4 rounded-xl transition-all duration-300 cursor-pointer"
          >
            Launch Assistant
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-4xl mx-auto text-center z-10 flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/50 border border-zinc-800/80 rounded-full text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mb-6 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Plug-and-play RAG chatbot
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-2xl leading-[1.1] mb-6">
          Grounded AI Chatbots for Your Website.
        </h1>
        
        <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed mb-8">
          Feed it any website URL or PDF brochure. Our RAG engine extracts, indexes, and answers user queries locally using FAISS database and the Groq LLM API.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={scrollToWidget}
            className="bg-white hover:bg-zinc-200 text-black font-semibold text-xs py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-white/5 cursor-pointer"
          >
            Open Widget Demo
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 border-t border-zinc-900 px-6 bg-zinc-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-lg mx-auto mb-16">
            <h2 className="text-2xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-xs text-zinc-500">The Retrieval-Augmented Generation pipeline broken down in three steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800/80 rounded-2xl p-6 transition-all duration-300">
              <span className="text-zinc-700 font-mono text-3xl font-bold block mb-4">01</span>
              <h3 className="text-sm font-semibold text-white mb-2">Connect Source</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Input any public website URL or upload a company PDF document through the floating dashboard.</p>
            </div>
            <div className="bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800/80 rounded-2xl p-6 transition-all duration-300">
              <span className="text-zinc-700 font-mono text-3xl font-bold block mb-4">02</span>
              <h3 className="text-sm font-semibold text-white mb-2">Local Vector Indexing</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">The parser splits text into chunks, computes mathematical embeddings locally, and indexes them in a FAISS database.</p>
            </div>
            <div className="bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800/80 rounded-2xl p-6 transition-all duration-300">
              <span className="text-zinc-700 font-mono text-3xl font-bold block mb-4">03</span>
              <h3 className="text-sm font-semibold text-white mb-2">Grounded Answers</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Users ask questions; FAISS retrieves context chunks, and the Groq LLM API generates grounded responses with source citations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-zinc-900 px-6 bg-zinc-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-lg mx-auto mb-16">
            <h2 className="text-2xl font-bold text-white mb-3">Engine Features</h2>
            <p className="text-xs text-zinc-500">Built using modern stack components for rapid, scalable client chatbot integrations.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border border-zinc-900 hover:border-zinc-800 p-6 rounded-2xl bg-zinc-900/10 flex gap-4 transition-all duration-300">
              <div className="text-xl">🌐</div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">Smart Web Scraping</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">BeautifulSoup-powered scraper that cleans HTML noise (header, footer, scripts) and extracts clean content.</p>
              </div>
            </div>
            <div className="border border-zinc-900 hover:border-zinc-800 p-6 rounded-2xl bg-zinc-900/10 flex gap-4 transition-all duration-300">
              <div className="text-xl">📄</div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">PDF Document Parsing</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Integration with PyMuPDF to extract text from uploads, allowing users to index brochure and menus instantly.</p>
              </div>
            </div>
            <div className="border border-zinc-900 hover:border-zinc-800 p-6 rounded-2xl bg-zinc-900/10 flex gap-4 transition-all duration-300">
              <div className="text-xl">📦</div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">Local FAISS Vector DB</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Uses Facebook's similarity search index for near-instant semantic search calculations on the CPU.</p>
              </div>
            </div>
            <div className="border border-zinc-900 hover:border-zinc-800 p-6 rounded-2xl bg-zinc-900/10 flex gap-4 transition-all duration-300">
              <div className="text-xl">⚡</div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">FastAPI & Uvicorn</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Asynchronous backend endpoints supporting multiple source data uploads and chat queries.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-zinc-900 bg-zinc-950 px-6 text-center text-xs text-zinc-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-semibold text-zinc-400">🤖 WebWidget RAG Engine</span>
          <span>© 2026 AI Website Chatbot Widget. All rights reserved.</span>
        </div>
      </footer>

      {/* Floating Chat Widget */}
      <ChatWidget />
    </div>
  );
}
