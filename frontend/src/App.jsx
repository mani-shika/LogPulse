import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('explorer');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/api/v1/logs/analyze', {
        method: 'POST',
        body: formData,
      });

      const rawText = await response.text();

      try {
        const jsonData = JSON.parse(rawText);
        if (jsonData.candidates && jsonData.candidates.length > 0) {
          setResult(jsonData.candidates[0].content.parts[0].text);
        } else {
          setResult("Diagnostics returned unexpected structural formatting.");
        }
      } catch {
        setResult(rawText);
      }
    } catch (error) {
      setResult('Failed to connect to internal infrastructure gateway. Verify Spring Boot status.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-screen w-screen bg-background text-on-surface font-body-sm antialiased overflow-hidden">
      
      {/* Collapsible Left Side Navigation Bar */}
      <nav className="bg-background text-primary w-16 hover:w-64 transition-all duration-300 border-r border-outline-variant flex flex-col h-full py-4 group z-50 overflow-hidden shrink-0">
        <div className="px-4 mb-8 flex items-center gap-4 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
          <div>
            <div className="font-display font-semibold text-primary tracking-tight text-xl leading-none">LogPulse</div>
            <div className="text-[10px] text-on-surface-variant uppercase tracking-wider">Admin Console</div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2 px-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-4 px-2 py-3 rounded whitespace-nowrap w-full text-left transition-colors ${activeTab === 'dashboard' ? 'text-primary border-l-2 border-primary bg-surface-container-low' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center gap-4 px-2 py-3 rounded whitespace-nowrap w-full text-left transition-colors ${activeTab === 'explorer' ? 'text-primary border-l-2 border-primary bg-surface-container-low' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>search</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explorer</span>
          </button>
        </div>
        <div className="px-2 mt-auto">
          <div className="px-2 py-2 flex items-center gap-4 border-t border-outline-variant/50 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-sm text-on-surface-variant">person</span>
            </div>
            <div className="text-xs text-on-surface-variant">Admin User</div>
          </div>
        </div>
      </nav>

      {/* Primary Workspace Window */}
      <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
        
        {/* Top Operational Navigation Bar */}
        <header className="bg-background/80 backdrop-blur-md text-primary border-b border-outline-variant flex justify-between items-center w-full px-8 h-14 shrink-0">
          <div className="flex items-center gap-8">
            <div className="font-display text-lg font-bold text-on-surface">LogPulse v2.4</div>
            <nav className="hidden md:flex items-center gap-6 h-full text-xs uppercase tracking-wider font-semibold">
              <button onClick={() => setActiveTab('explorer')} className={`py-4 ${activeTab === 'explorer' ? 'text-primary border-b border-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`}>Explorer</button>
              <button onClick={() => setActiveTab('events')} className={`py-4 ${activeTab === 'events' ? 'text-primary border-b border-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`}>Events</button>
              <button onClick={() => setActiveTab('metrics')} className={`py-4 ${activeTab === 'metrics' ? 'text-primary border-b border-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`}>Metrics</button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-on-surface-variant text-lg cursor-pointer hover:text-primary">settings</span>
            <span className="material-symbols-outlined text-on-surface-variant text-lg cursor-pointer hover:text-primary">help_outline</span>
          </div>
        </header>

        {/* Dynamic Canvas Container */}
        <main className="flex-1 flex flex-col overflow-hidden w-full p-4 gap-4">
          
          {activeTab !== 'explorer' ? (
            <div className="flex-1 border border-outline-variant rounded-lg bg-[#121212] flex flex-col items-center justify-center text-on-surface-variant/50">
               <span className="material-symbols-outlined text-5xl mb-4 text-primary/30">engineering</span>
               <h2 className="text-xl font-display text-on-surface">Module Under Construction</h2>
               <p className="text-sm mt-2">The <span className="uppercase text-primary">{activeTab}</span> telemetry stream will be integrated in a future release.</p>
            </div>
          ) : (
            <>
              {/* Integrated Source Upload & Execution Command Bar */}
              <form onSubmit={handleUpload} className="bg-[#121212] border border-outline-variant rounded-lg flex flex-col shadow-sm shrink-0">
                <div className="flex items-center px-4 py-3">
                  <span className="material-symbols-outlined text-primary mr-3" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
                  
                  <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files[0])}
                    className="bg-transparent border-none text-on-surface-variant font-code-sm text-xs w-full focus:ring-0 focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded file:border file:border-outline-variant/40 file:bg-surface-container file:text-on-surface file:text-xs file:cursor-pointer hover:file:bg-surface-container-high"
                  />
                  
                  <div className="flex gap-2 ml-4 shrink-0">
                    <button 
                      type="submit"
                      disabled={loading || !file}
                      className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded px-4 py-1.5 text-xs font-medium transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-[14px]">play_arrow</span> 
                      {loading ? 'Processing Pipeline...' : 'Run Query'}
                    </button>
                  </div>
                </div>
                <div className="px-4 py-2 bg-surface-container-low/50 flex gap-4 text-xs font-code-sm text-on-surface-variant/70 items-center rounded-b-lg border-t border-outline-variant/30">
                  <span className="text-primary/70 font-semibold uppercase tracking-wider text-[10px]">Context Buffer:</span>
                  <span>{file ? `Target stream: [${file.name}]` : 'Awaiting initialization manifest payload source source...'}</span>
                </div>
              </form>

              {/* Core Analytics View Control Layout */}
              <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
                
                {/* Visual Builder Sidebar Panel */}
                <aside className="w-64 bg-[#121212] border border-outline-variant rounded-lg flex flex-col overflow-hidden shrink-0 hidden lg:flex">
                  <div className="p-3 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/30">
                    <h2 className="text-[11px] font-semibold text-on-surface-variant tracking-wider uppercase">Visual Builder</h2>
                    <span className="material-symbols-outlined text-sm text-on-surface-variant">filter_list</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-xs">
                    <div>
                      <label className="text-on-surface-variant/80 font-medium mb-2 block">System Time Range</label>
                      <div className="w-full bg-background border border-outline-variant rounded py-1.5 px-2 text-on-surface font-medium">Last 24 hours</div>
                    </div>
                    <div>
                      <label className="text-on-surface-variant/80 font-medium mb-2 block">Static Services Scope</label>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-1 bg-background border border-primary/50 text-primary rounded flex items-center gap-1">payment-gateway</span>
                        <span className="px-2 py-1 bg-surface-container-high border border-outline-variant text-on-surface-variant rounded">user-auth</span>
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Structured Diagnostics Data Grid Area */}
                <div className="flex-1 bg-[#121212] border border-outline-variant rounded-lg flex flex-col overflow-hidden min-w-0">
                  <div className="h-10 border-b border-outline-variant bg-surface-container-low/50 flex items-center justify-between px-4 shrink-0">
                    <div className="text-xs text-on-surface-variant">
                      {loading ? 'Streaming diagnostic metrics...' : result ? 'Analysis engine processing trace completed.' : 'Workspace idle. Run telemetry target payload.'}
                    </div>
                  </div>

                  {/* Scrollable Live Target Workspace Output */}
                  <div className="flex-1 overflow-auto p-4 bg-background/30 font-code-sm text-xs">
                    {!result && !loading && (
                      <div className="h-full flex flex-col items-center justify-center text-on-surface-variant/40 gap-2">
                        <span className="material-symbols-outlined text-3xl">terminal_piece</span>
                        <p className="font-body-sm text-sm">No diagnostic context metrics compiled in buffer cache.</p>
                      </div>
                    )}

                    {loading && (
                      <div className="h-full flex flex-col items-center justify-center text-primary/70 gap-3">
                        <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="font-body-sm text-sm">Query execution pipeline evaluating server trace logs...</p>
                      </div>
                    )}

                    {result && (
                      <div className="animate-fadeIn flex flex-col gap-4">
                        <div className="border border-outline-variant bg-surface-container-lowest/80 rounded-lg p-5 border-l-4 border-primary">
                          <div className="flex items-center gap-2 text-primary font-body-sm font-semibold text-sm mb-4">
                            <span className="material-symbols-outlined text-lg">analytics</span>
                            <h3>Gemini Engine Core Analytics Verdict</h3>
                          </div>
                          
                          {/* Markdown parsing with Syntax Highlighting built in */}
                          <div className="prose prose-invert max-w-none text-left w-full text-on-surface-variant leading-relaxed font-body-sm text-sm space-y-4">
                            <ReactMarkdown
                              components={{
                                code(props) {
                                  const { children, className, node, inline, ...rest } = props;
                                  const match = /language-(\w+)/.exec(className || '');
                                  const isBlock = match || String(children).includes('\n');
                                  
                                  if (isBlock) {
                                    return (
                                      <div className="border border-outline-variant rounded-md overflow-hidden my-4 bg-surface-container-lowest">
                                        <div className="flex justify-between items-center bg-surface-container px-4 py-2 border-b border-outline-variant/60 font-code-sm text-xs">
                                          <span className="text-on-surface-variant font-bold uppercase tracking-wider text-[10px]">{match ? match[1] : 'bash'}</span>
                                          <button 
                                            type="button"
                                            onClick={() => copyToClipboard(String(children).replace(/\n$/, ''))}
                                            className="text-[11px] text-primary hover:text-white border border-outline-variant bg-background px-2.5 py-1 rounded font-body-sm transition-all"
                                          >
                                            {copied ? 'Copied ✓' : 'Copy Remediation Script 📋'}
                                          </button>
                                        </div>
                                        {/* NEW: Syntax Highlighter applied here */}
                                        <SyntaxHighlighter
                                          style={vscDarkPlus}
                                          language={match ? match[1] : 'bash'}
                                          PreTag="div"
                                          customStyle={{ margin: 0, background: '#090909', fontSize: '13px', padding: '16px' }}
                                        >
                                          {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                      </div>
                                    );
                                  }
                                  return (
                                    <code className="bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded font-code-sm text-[12px]" {...rest}>
                                      {children}
                                    </code>
                                  );
                                }
                              }}
                            >
                              {result}
                            </ReactMarkdown>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;