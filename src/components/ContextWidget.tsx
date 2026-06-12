import React, { useState, useEffect } from 'react';
import { Sparkles, Download, Layers, CheckCircle, Settings, RefreshCw } from 'lucide-react';
import SettingsModal from './SettingsModal';

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

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasGithubConfig, setHasGithubConfig] = useState(false);

  // Check config on mount and when modal closes
  useEffect(() => {
    const repo = localStorage.getItem(`ctx_repo_${projectName}`);
    const token = localStorage.getItem(`ctx_token_${projectName}`);
    setHasGithubConfig(!!(repo && token));
  }, [projectName, isSettingsOpen]);

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
        <div className="ml-auto flex items-center gap-2">
          <span className="bg-console-border px-2 py-0.5 rounded text-[10px] text-console-text-muted font-mono uppercase">
            Target: {projectName}
          </span>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 rounded bg-console-panel border border-console-border text-console-text-muted hover:text-console-accent-cyan hover:border-console-accent-cyan transition-all"
            title="Project Settings (GitHub Sync)"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        projectId={projectName} 
      />
      
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

          <div className="mt-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest p-3 rounded border border-console-border bg-console-panel">
            <span className="text-console-text-muted">Auto-Sync Status:</span>
            {hasGithubConfig ? (
              <span className="text-console-git-add flex items-center gap-1.5"><RefreshCw className="w-3 h-3" /> ENABLED</span>
            ) : (
              <span className="text-console-git-remove flex items-center gap-1.5"><CheckCircle className="w-3 h-3" /> DISABLED</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
