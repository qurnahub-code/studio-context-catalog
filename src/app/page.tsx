"use client";

import React, { useState } from 'react';

export interface IngestionMetadata {
  projectId: string;
  fileCategory: 'context' | 'design' | 'history' | 'unknown';
  isNewProject: boolean;
}

function tokenizeAndRoute(content: string, filename: string = ''): IngestionMetadata {
  const normalizedText = (content + ' ' + filename).toLowerCase();
  let projectId = 'unknown';
  let isNewProject = false;

  if (/wtkpro|toolkit|formatter|decoder|utils/g.test(normalizedText)) {
    projectId = 'wtkpro';
  } else if (/tradeconvert|currency|rate|conversion/g.test(normalizedText)) {
    projectId = 'tradeconvert';
  } else {
    isNewProject = true;
    if (filename && filename.includes('-')) {
      projectId = filename.split('-')[0].toLowerCase();
    } else if (filename) {
      projectId = filename.split('.')[0].toLowerCase();
    } else {
      const headerMatch = content.match(/^#\s+(\w+)/m);
      projectId = headerMatch ? headerMatch[1].toLowerCase() : 'unnamed-module';
    }
  }

  let fileCategory: 'context' | 'design' | 'history' | 'unknown' = 'unknown';
  if (/theme|tailwind|color|hex|layout|ui|tokens/g.test(normalizedText)) {
    fileCategory = 'design';
  } else if (/changelog|v\d\.|fixed|added|optimized|milestone/g.test(normalizedText)) {
    fileCategory = 'history';
  } else if (/architecture|dependencies|next\.js|supabase|backend/g.test(normalizedText)) {
    fileCategory = 'context';
  }

  return { projectId, fileCategory, isNewProject };
}

async function generateCommitId(content: string, timestamp: number): Promise<string> {
  const encoder = new TextEncoder();
  const inputData = encoder.encode(content + timestamp.toString());
  const cryptoBuffer = await crypto.subtle.digest('SHA-256', inputData);
  const hashArray = Array.from(new Uint8Array(cryptoBuffer));
  const fullHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return fullHash.substring(0, 7);
}

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [inputText, setInputText] = useState('');
  const [metadata, setMetadata] = useState<IngestionMetadata | null>(null);
  const [commitId, setCommitId] = useState<string | null>(null);
  
  // Modal & Sequence States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingStep, setProcessingStep] = useState(-1);
  const [isSuccess, setIsSuccess] = useState(false);

  const [commits, setCommits] = useState<{ id: string; project: string; time: string }[]>([
    { id: '7a1b3c9', project: 'wtkpro', time: 'Just now' },
    { id: 'c8e2f4a', project: 'tradeconvert', time: '2 hours ago' },
    { id: 'f9d0a1b', project: 'wtkpro', time: 'Yesterday' },
  ]);

  const processInputSequence = async (content: string, filename: string = '') => {
    setIsModalOpen(true);
    setIsSuccess(false);
    
    // Step 0: Init
    setProcessingStep(0);
    await new Promise(r => setTimeout(r, 600));
    
    // Step 1: Tokenize
    setProcessingStep(1);
    const meta = tokenizeAndRoute(content, filename);
    await new Promise(r => setTimeout(r, 800));
    setMetadata(meta);
    
    // Step 2: Hashing
    setProcessingStep(2);
    const hash = await generateCommitId(content, Date.now());
    await new Promise(r => setTimeout(r, 600));
    setCommitId(hash);
    
    // Step 3: Diff rendering prep
    setProcessingStep(3);
    await new Promise(r => setTimeout(r, 500));
    
    // Step 4: Show Diff UI
    setProcessingStep(4);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const text = ev.target?.result as string;
        setInputText(text);
        await processInputSequence(text, file.name);
      };
      reader.readAsText(file);
    }
  };

  const handlePaste = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    if (text.length > 5 && !isModalOpen) {
      await processInputSequence(text);
    }
  };

  const handleCommit = async () => {
    if (commitId && metadata) {
      setIsSuccess(true);
      await new Promise(r => setTimeout(r, 1000)); // Auto-close delay
      
      setCommits([{ id: commitId, project: metadata.projectId, time: 'Just now' }, ...commits]);
      setInputText('');
      setMetadata(null);
      setCommitId(null);
      setIsModalOpen(false);
      setProcessingStep(-1);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProcessingStep(-1);
    setInputText('');
    setMetadata(null);
    setCommitId(null);
  };

  return (
    <div className="min-h-screen bg-console-bg text-console-text-main font-sans selection:bg-console-accent-cyan selection:text-console-bg">
      {/* Header */}
      <header className="border-b border-console-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-console-accent-cyan text-xl">⚡</span>
          <h1 className="font-bold tracking-wider">SUFYAN STUDIO ENGINE</h1>
        </div>
        <div className="flex items-center gap-6 font-mono text-sm text-console-text-muted">
          <div className="flex items-center gap-2">
            STATUS: ACTIVE <span className="text-console-git-add animate-pulse">●</span>
          </div>
          <div>URL: studio.web.app</div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-console-border min-h-[calc(100vh-65px)] relative">
        
        {/* Left Panel: Infrastructure & Projects */}
        <aside className="lg:col-span-3 bg-console-bg p-6 flex flex-col gap-8">
          <div>
            <h2 className="text-xs font-bold text-console-text-muted mb-4 tracking-widest flex items-center gap-2">
              <span className="text-base">📁</span> INFRASTRUCTURE
            </h2>
            <ul className="space-y-2 font-mono text-sm pl-6 border-l border-console-border ml-2">
              <li className="flex items-center gap-2 cursor-pointer hover:text-console-accent-cyan transition-ui">
                <span className="text-console-text-muted">├─</span> global-rules.md
              </li>
              <li className="flex items-center gap-2 cursor-pointer hover:text-console-accent-cyan transition-ui">
                <span className="text-console-text-muted">└─</span> system-tokens.md
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold text-console-text-muted mb-4 tracking-widest flex items-center gap-2">
              <span className="text-base">📁</span> PROJECT NODES
            </h2>
            <ul className="space-y-4 font-mono text-sm pl-6 border-l border-console-border ml-2">
              <li>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-console-text-muted">├─</span> 🌐 wtkpro
                </div>
                <ul className="space-y-2 pl-6 border-l border-console-border ml-2 text-console-text-muted">
                  <li className="hover:text-console-text-main cursor-pointer transition-ui">├─ context.md</li>
                  <li className="hover:text-console-text-main cursor-pointer transition-ui">├─ design.md</li>
                  <li className="hover:text-console-text-main cursor-pointer transition-ui">└─ history.md</li>
                </ul>
              </li>
              <li>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-console-text-muted">└─</span> 🌐 tradeconvert
                </div>
                <ul className="space-y-2 pl-6 border-l border-console-border ml-2 text-console-text-muted">
                  <li className="hover:text-console-text-main cursor-pointer transition-ui">├─ context.md</li>
                  <li className="hover:text-console-text-main cursor-pointer transition-ui">└─ design.md</li>
                </ul>
              </li>
            </ul>
          </div>
        </aside>

        {/* Center Panel: Ingestion Workspace */}
        <section className="lg:col-span-6 bg-console-bg p-6 flex flex-col gap-6">
          <h2 className="text-xs font-bold text-console-text-muted tracking-widest flex items-center gap-2 mb-2">
            <span className="text-base">🎛️</span> INGESTION WORKSPACE
          </h2>

          <div 
            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center min-h-[400px] transition-ui flex-1 ${isDragging ? 'border-console-accent-cyan bg-console-accent-cyan/5' : 'border-console-border hover:border-console-text-muted'}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <div className="text-4xl mb-4">📥</div>
            <p className="font-mono text-sm mb-4">Drag & Drop File Here</p>
            <span className="text-xs text-console-text-muted bg-console-bg px-4 relative -top-3">- OR -</span>
            <textarea 
              className="w-full max-w-xl bg-console-panel border border-console-border rounded p-4 font-mono text-sm resize-none focus:outline-none focus:border-console-accent-cyan transition-ui"
              rows={6}
              placeholder="📝 Paste Raw Markdown Text Snippet..."
              value={inputText}
              onChange={handlePaste}
            />
          </div>
        </section>

        {/* Right Panel: Commits */}
        <aside className="lg:col-span-3 bg-console-bg p-6">
          <h2 className="text-xs font-bold text-console-text-muted mb-6 tracking-widest flex items-center gap-2">
            <span className="text-base">🎫</span> RECENT COMMITS
          </h2>
          
          <div className="space-y-0 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-console-border">
            {commits.map((commit, idx) => (
              <div key={idx} className="relative pl-8 py-4 group">
                <div className="absolute left-0 top-5 w-[23px] h-px bg-console-border group-hover:bg-console-accent-cyan transition-ui"></div>
                <div className="absolute left-[-2px] top-[18px] w-[6px] h-[6px] rounded-full border-2 border-console-bg bg-console-text-muted group-hover:bg-console-accent-cyan transition-ui"></div>
                
                <div className="font-mono text-sm">
                  <span className="text-console-text-muted">[</span>
                  <span className="text-console-accent-cyan">{commit.project}</span>
                  <span className="text-console-text-muted">]</span>{' '}
                  <span className="text-console-text-main">{commit.id}</span>
                </div>
                <div className="text-xs text-console-text-muted mt-1">{commit.time}</div>
              </div>
            ))}
          </div>
        </aside>
      </main>

      {/* Processing Overlay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/85 backdrop-blur-md p-4 transition-opacity duration-300">
          <div className="modal-enter w-full max-w-3xl bg-console-panel border border-console-border rounded-lg shadow-2xl flex flex-col overflow-hidden">
            
            <div className="bg-[#0f172a] px-4 py-3 border-b border-console-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">⚙️</span>
                <h3 className="font-mono text-xs text-console-text-muted tracking-widest">SYSTEM PROCESSING SEQUENCE</h3>
              </div>
              <button onClick={closeModal} className="text-console-text-muted hover:text-console-text-main font-mono text-xs">
                [ ESC / CANCEL ]
              </button>
            </div>
            
            <div className="p-8 font-mono text-sm flex flex-col gap-6 max-h-[80vh] overflow-auto">
              
              {/* Sequence Visualizer */}
              <div className="space-y-4 border border-console-border bg-[#020617] rounded-lg p-6 relative">
                
                <div className={`transition-all duration-500 flex items-center gap-4 ${processingStep >= 0 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                  <div className={`w-2 h-2 rounded-full ${processingStep === 0 ? 'bg-console-accent-cyan animate-pulse shadow-[0_0_8px_#38bdf8]' : 'bg-console-git-add'}`} />
                  <span className="w-24 text-console-text-muted">STEP 01</span>
                  <span className={processingStep === 0 ? 'text-console-text-main font-bold' : 'text-console-text-muted'}>
                    Initializing Secure Ingestion Core...
                  </span>
                </div>

                <div className={`transition-all duration-500 flex items-center gap-4 ${processingStep >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                  <div className={`w-2 h-2 rounded-full ${processingStep === 1 ? 'bg-console-accent-cyan animate-pulse shadow-[0_0_8px_#38bdf8]' : (processingStep > 1 ? 'bg-console-git-add' : 'bg-console-border')}`} />
                  <span className="w-24 text-console-text-muted">STEP 02</span>
                  <span className={processingStep === 1 ? 'text-console-text-main font-bold' : 'text-console-text-muted'}>
                    Running Regex Tokenizer & Classifying Node...
                  </span>
                </div>

                <div className={`transition-all duration-500 flex items-center gap-4 ${processingStep >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                  <div className={`w-2 h-2 rounded-full ${processingStep === 2 ? 'bg-console-accent-cyan animate-pulse shadow-[0_0_8px_#38bdf8]' : (processingStep > 2 ? 'bg-console-git-add' : 'bg-console-border')}`} />
                  <span className="w-24 text-console-text-muted">STEP 03</span>
                  <span className={processingStep === 2 ? 'text-console-text-main font-bold' : 'text-console-text-muted'}>
                    Generating Web Crypto SHA-256 Hash...
                  </span>
                </div>

                <div className={`transition-all duration-500 flex items-center gap-4 ${processingStep >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                  <div className={`w-2 h-2 rounded-full ${processingStep === 3 ? 'bg-console-accent-cyan animate-pulse shadow-[0_0_8px_#38bdf8]' : (processingStep > 3 ? 'bg-console-git-add' : 'bg-console-border')}`} />
                  <span className="w-24 text-console-text-muted">STEP 04</span>
                  <span className={processingStep === 3 ? 'text-console-text-main font-bold' : 'text-console-text-muted'}>
                    Rendering Visual Diff Verification...
                  </span>
                </div>

                {/* Connecting line */}
                <div className="absolute left-[27px] top-[34px] bottom-[34px] w-px bg-console-border -z-10" />
              </div>

              {/* Final Diff View & Commit Success */}
              {processingStep >= 4 && metadata && commitId && (
                <div className="transition-all duration-500 opacity-100 translate-y-0">
                  {isSuccess ? (
                    <div className="bg-[#020617] border border-console-git-add rounded-lg p-10 flex flex-col items-center justify-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-console-git-add/20 flex items-center justify-center text-console-git-add text-2xl">
                        ✓
                      </div>
                      <h4 className="text-console-git-add font-bold uppercase tracking-widest text-lg">
                        Commit Successful
                      </h4>
                      <p className="text-console-text-muted text-xs">Closing window automatically...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="bg-[#020617] border border-console-border rounded p-4 border-l-4 border-l-console-accent-cyan shadow-lg">
                        <h4 className="text-console-accent-cyan uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                          <span>🛰️</span> {metadata.isNewProject ? 'NEW PROJECT NODE DETECTED' : 'EXISTING PROJECT NODE IDENTIFIED'}
                        </h4>
                        <div className="grid grid-cols-[120px_1fr] gap-2 text-sm text-console-text-muted">
                          <div>Extracted Name:</div>
                          <div className="text-console-text-main font-bold">[ {metadata.projectId} ]</div>
                          
                          <div>Category:</div>
                          <div className="text-console-text-main">[ {metadata.fileCategory}.md ]</div>
                          
                          <div>Status:</div>
                          <div className="text-console-git-add">Ready to {metadata.isNewProject ? 'Initialize Directory' : 'Update File'}</div>
                        </div>
                      </div>

                      <div className="bg-[#020617] p-4 rounded border border-console-border font-mono text-sm relative">
                        <div className="absolute top-0 left-0 bottom-0 w-8 bg-console-git-add/10 border-r border-console-git-add/20"></div>
                        <div className="text-console-git-add whitespace-pre-wrap max-h-[150px] overflow-auto pl-6">
                          {inputText.split('\n').map((line, i) => (
                            <div key={i} className="flex"><span className="absolute left-2 opacity-50 select-none text-console-git-add">+</span>{line || ' '}</div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <button 
                          onClick={handleCommit}
                          className="interactive bg-console-accent-cyan text-console-bg px-6 py-3 rounded font-bold uppercase tracking-widest text-xs hover:opacity-90 shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                        >
                          [ Confirm Commit @ {commitId} ]
                        </button>
                        {metadata.isNewProject && (
                          <button className="interactive text-console-text-muted border border-console-border px-4 py-3 rounded text-xs hover:text-console-text-main hover:border-console-text-muted">
                            Change Target Node
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
