"use client";

import React, { useState, useCallback } from 'react';

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
  const [commits, setCommits] = useState<{ id: string; project: string; time: string }[]>([
    { id: '7a1b3c9', project: 'wtkpro', time: 'Just now' },
    { id: 'c8e2f4a', project: 'tradeconvert', time: '2 hours ago' },
    { id: 'f9d0a1b', project: 'wtkpro', time: 'Yesterday' },
  ]);

  const processInput = async (content: string, filename: string = '') => {
    const meta = tokenizeAndRoute(content, filename);
    const hash = await generateCommitId(content, Date.now());
    setMetadata(meta);
    setCommitId(hash);
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
        await processInput(text, file.name);
      };
      reader.readAsText(file);
    }
  };

  const handlePaste = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    if (text.length > 5) {
      await processInput(text);
    } else {
      setMetadata(null);
      setCommitId(null);
    }
  };

  const handleCommit = () => {
    if (commitId && metadata) {
      setCommits([{ id: commitId, project: metadata.projectId, time: 'Just now' }, ...commits]);
      setInputText('');
      setMetadata(null);
      setCommitId(null);
    }
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
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-console-border min-h-[calc(100vh-65px)]">
        
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
        <section className="lg:col-span-6 bg-console-bg p-6 flex flex-col gap-6 relative">
          <h2 className="text-xs font-bold text-console-text-muted tracking-widest flex items-center gap-2 mb-2">
            <span className="text-base">🎛️</span> INGESTION WORKSPACE
          </h2>

          <div 
            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px] transition-ui ${isDragging ? 'border-console-accent-cyan bg-console-accent-cyan/5' : 'border-console-border hover:border-console-text-muted'}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <div className="text-4xl mb-4">📥</div>
            <p className="font-mono text-sm mb-4">Drag & Drop File Here</p>
            <span className="text-xs text-console-text-muted bg-console-bg px-4 relative -top-3">- OR -</span>
            <textarea 
              className="w-full bg-console-panel border border-console-border rounded p-4 font-mono text-sm resize-none focus:outline-none focus:border-console-accent-cyan transition-ui"
              rows={4}
              placeholder="📝 Paste Raw Markdown Text Snippet..."
              value={inputText}
              onChange={handlePaste}
            />
          </div>

          {/* Diff Validation View */}
          <div className="flex-1 bg-console-panel border border-console-border rounded-lg flex flex-col overflow-hidden">
            <div className="bg-[#0f172a] px-4 py-3 border-b border-console-border flex items-center gap-2">
              <span className="text-base">📊</span>
              <h3 className="font-mono text-xs text-console-text-muted">PRE-COMMIT DIFF VALIDATION VIEW</h3>
            </div>
            
            <div className="flex-1 p-4 font-mono text-sm overflow-auto">
              {!metadata ? (
                <div className="text-console-text-muted italic flex h-full items-center justify-center">
                  Awaiting input data...
                </div>
              ) : (
                <div className="space-y-4">
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

                  <div className="bg-[#020617] p-4 rounded border border-console-border font-mono text-sm">
                    <div className="text-console-git-add whitespace-pre-wrap truncate max-h-[150px]">
                      {inputText.split('\n').map((line, i) => (
                        <div key={i} className="flex"><span className="opacity-50 select-none mr-4">+</span>{line}</div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <button 
                      onClick={handleCommit}
                      className="interactive bg-console-accent-cyan text-console-bg px-6 py-2 rounded font-bold uppercase tracking-widest text-xs hover:opacity-90"
                    >
                      [ Confirm Commit @ {commitId} ]
                    </button>
                    {metadata.isNewProject && (
                      <button className="interactive text-console-text-muted border border-console-border px-4 py-2 rounded text-xs hover:text-console-text-main hover:border-console-text-muted">
                        Change Name Manually
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
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
    </div>
  );
}
