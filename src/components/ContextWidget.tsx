import React, { useState, useEffect } from 'react';
import { Sparkles, Download, Layers, CheckCircle } from 'lucide-react';

// Define target structures for different models
const MODEL_PRESETS = {
  cursor: { name: 'Cursor (.cursorrules)', targetFile: '.cursorrules', desc: 'Optimized for MDC rules and inline chat context.' },
  claude: { name: 'Claude Code (CLAUDE.md)', targetFile: 'CLAUDE.md', desc: 'Focuses on test commands, build commands, and strict styles.' },
  copilot: { name: 'GitHub Copilot', targetFile: '.github/copilot-instructions.md', desc: 'Optimized for high-level repository architecture mapping.' }
};

interface CommitFile {
  file_path: string;
  content: string;
}

export default function ContextWidget({ files, projectName }: { files: CommitFile[], projectName: string }) {
  const [selectedModel, setSelectedModel] = useState<keyof typeof MODEL_PRESETS>('cursor');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  // GitHub Sync State
  const [githubRepo, setGithubRepo] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const savedRepo = localStorage.getItem('ctx_githubRepo');
    const savedToken = localStorage.getItem('ctx_githubToken');
    if (savedRepo) setGithubRepo(savedRepo);
    if (savedToken) setGithubToken(savedToken);
  }, []);

  const handleSaveGithubSettings = (repo: string, token: string) => {
    setGithubRepo(repo);
    setGithubToken(token);
    localStorage.setItem('ctx_githubRepo', repo);
    localStorage.setItem('ctx_githubToken', token);
  };

  const handleSync = async () => {
    if (!githubRepo || !githubToken || !generatedContent) return;
    setIsSyncing(true);
    setSyncStatus('idle');

    try {
      const response = await fetch('/api/v1/github/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repo: githubRepo,
          path: MODEL_PRESETS[selectedModel].targetFile,
          content: generatedContent,
          token: githubToken
        })
      });

      const data = await response.json();
      if (data.success) {
        setSyncStatus('success');
      } else {
        alert(data.error || 'Failed to sync');
        setSyncStatus('error');
      }
    } catch (e) {
      alert('Error during GitHub sync');
      setSyncStatus('error');
    }
    
    setIsSyncing(false);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Using the real API route
    try {
      const response = await fetch('/api/v1/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files, targetModel: selectedModel })
      });
      const data = await response.json();
      
      if (data.success) {
        setGeneratedContent(data.fileContent);
      } else {
        alert('Failed to compile context.');
      }
    } catch (e) {
      alert('Error during compilation.');
    }
    
    setIsGenerating(false);
  };

  if (!files || files.length === 0) {
    return (
      <div className="w-full bg-console-bg border border-console-border rounded-lg p-6 shadow-lg flex flex-col items-center justify-center text-console-text-muted min-h-[200px]">
        <Sparkles className="w-8 h-8 mb-3 opacity-30" />
        <p className="font-mono text-sm uppercase tracking-widest text-center">No nodes selected</p>
        <p className="text-xs mt-2 text-center max-w-xs">Select a project from the left panel to compile its context rules.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#020617] border border-console-border rounded-lg p-6 shadow-lg text-console-text-main font-sans">
      <div className="flex items-center gap-3 mb-2">
        <Sparkles className="text-console-accent-cyan w-5 h-5 animate-pulse" />
        <h3 className="text-sm font-bold tracking-widest uppercase font-mono text-console-accent-cyan">Context Engine Assembler</h3>
        <span className="ml-auto bg-console-border px-2 py-0.5 rounded text-[10px] text-console-text-muted font-mono uppercase">
          Target: {projectName}
        </span>
      </div>
      
      <p className="text-xs text-console-text-muted mb-6 font-mono leading-relaxed">
        Compile your organizational memory records into a single targeted rule file optimized for your AI agent.
      </p>

      {/* Target Model Selector */}
      <div className="space-y-2 mb-6">
        <label className="text-[10px] font-bold uppercase tracking-widest text-console-text-muted flex items-center gap-2">
          <span>Target AI Client</span>
          <div className="flex-1 h-px bg-console-border" />
        </label>
        <select 
          value={selectedModel}
          onChange={(e) => { setSelectedModel(e.target.value as any); setGeneratedContent(null); }}
          className="w-full bg-console-panel border border-console-border rounded px-3 py-2.5 text-sm text-console-text-main focus:outline-none focus:border-console-accent-cyan transition-ui cursor-pointer"
        >
          {Object.entries(MODEL_PRESETS).map(([key, value]) => (
            <option key={key} value={key}>{value.name}</option>
          ))}
        </select>
        <p className="text-[11px] text-console-text-muted italic px-1">{MODEL_PRESETS[selectedModel].desc}</p>
      </div>

      {/* Included Elements Indicator */}
      <div className="bg-console-panel border border-console-border rounded p-4 mb-6 relative">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-console-text-muted mb-3 border-b border-console-border/50 pb-2">
          <span>Scheduled for Assembly</span>
          <span className="text-console-accent-cyan">{files.length} found</span>
        </div>
        <div className="max-h-24 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center gap-3 text-xs text-console-text-main font-mono">
              <Layers className="w-3.5 h-3.5 text-console-accent-cyan shrink-0" />
              <span className="truncate">{file.file_path}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action CTA */}
      {!generatedContent ? (
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="interactive w-full bg-console-accent-cyan text-console-bg font-bold uppercase tracking-widest text-xs rounded py-3 transition shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-console-bg/30 border-t-console-bg rounded-full animate-spin" />
          ) : '[ Compile Target Context ]'}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-console-git-add text-xs font-mono bg-console-git-add/10 p-3 border border-console-git-add/30 rounded">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Built {MODEL_PRESETS[selectedModel].targetFile}!</span>
          </div>
          <button
            onClick={() => {
              const blob = new Blob([generatedContent], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = MODEL_PRESETS[selectedModel].targetFile;
              a.click();
            }}
            className="interactive w-full bg-transparent hover:bg-console-panel text-console-text-main font-mono text-xs rounded py-3 transition flex items-center justify-center gap-2 border border-console-border hover:border-console-text-muted"
          >
            <Download className="w-4 h-4" />
            [ Download Configuration ]
          </button>

          <div className="mt-6 pt-4 border-t border-console-border">
            <label className="text-[10px] font-bold uppercase tracking-widest text-console-text-muted flex items-center gap-2 mb-3">
              <span>GitHub CI/CD Sync</span>
              <div className="flex-1 h-px bg-console-border" />
            </label>
            
            <div className="space-y-3 mb-4">
              <input 
                type="text" 
                placeholder="Repository (e.g. owner/repo)" 
                value={githubRepo}
                onChange={(e) => handleSaveGithubSettings(e.target.value, githubToken)}
                className="w-full bg-console-panel border border-console-border rounded px-3 py-2 text-xs text-console-text-main focus:outline-none focus:border-console-accent-cyan transition-ui"
              />
              <input 
                type="password" 
                placeholder="Personal Access Token (PAT)" 
                value={githubToken}
                onChange={(e) => handleSaveGithubSettings(githubRepo, e.target.value)}
                className="w-full bg-console-panel border border-console-border rounded px-3 py-2 text-xs text-console-text-main focus:outline-none focus:border-console-accent-cyan transition-ui"
              />
            </div>

            <button
              onClick={handleSync}
              disabled={isSyncing || !githubRepo || !githubToken}
              className="interactive w-full bg-console-text-main text-console-bg font-bold uppercase tracking-widest text-xs rounded py-3 transition flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSyncing ? (
                <div className="w-4 h-4 border-2 border-console-bg/30 border-t-console-bg rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-base">🐙</span>
                  {syncStatus === 'success' ? '[ Synced Successfully! ]' : '[ Push to GitHub ]'}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
