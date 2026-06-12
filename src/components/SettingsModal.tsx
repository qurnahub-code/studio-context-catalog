import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export default function SettingsModal({ isOpen, onClose, projectId }: SettingsModalProps) {
  const [repo, setRepo] = useState('');
  const [token, setToken] = useState('');
  const [targetModel, setTargetModel] = useState('cursor');

  useEffect(() => {
    if (isOpen) {
      setRepo(localStorage.getItem(`ctx_repo_${projectId}`) || '');
      setToken(localStorage.getItem(`ctx_token_${projectId}`) || '');
      setTargetModel(localStorage.getItem(`ctx_model_${projectId}`) || 'cursor');
    }
  }, [isOpen, projectId]);

  const handleSave = () => {
    localStorage.setItem(`ctx_repo_${projectId}`, repo);
    localStorage.setItem(`ctx_token_${projectId}`, token);
    localStorage.setItem(`ctx_model_${projectId}`, targetModel);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#020617] border border-console-border rounded-lg shadow-[0_0_40px_rgba(56,189,248,0.15)] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-console-border bg-console-panel">
          <div className="flex items-center gap-3 text-console-accent-cyan font-mono text-sm uppercase tracking-widest font-bold">
            <span className="text-base">🐙</span>
            <span>Project Settings</span>
          </div>
          <button onClick={onClose} className="text-console-text-muted hover:text-console-text-main transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-sm text-console-text-main font-sans">
          
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-console-text-muted">Target AI Model</label>
            <select 
              value={targetModel}
              onChange={(e) => setTargetModel(e.target.value)}
              className="w-full bg-console-bg border border-console-border rounded px-3 py-2 text-console-text-main focus:outline-none focus:border-console-accent-cyan transition-ui"
            >
              <option value="cursor">Cursor (.cursorrules)</option>
              <option value="claude">Claude Code (CLAUDE.md)</option>
              <option value="copilot">GitHub Copilot</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-console-text-muted">Target Repository</label>
            <input 
              type="text" 
              placeholder="e.g. qurnahub-code/niche-storefront" 
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className="w-full bg-console-bg border border-console-border rounded px-3 py-2 text-console-text-main focus:outline-none focus:border-console-accent-cyan transition-ui"
            />
            <p className="text-[10px] text-console-text-muted italic">Format: owner/repository. Must match exactly.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-console-text-muted">Personal Access Token</label>
            <input 
              type="password" 
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full bg-console-bg border border-console-border rounded px-3 py-2 text-console-text-main focus:outline-none focus:border-console-accent-cyan transition-ui"
            />
            <p className="text-[10px] text-console-text-muted italic">Stored securely in your local browser cache.</p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-console-border bg-console-panel flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold font-mono uppercase tracking-widest text-console-text-muted hover:text-console-text-main transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-console-accent-cyan text-console-bg text-xs font-bold font-mono uppercase tracking-widest rounded hover:bg-opacity-90 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>

      </div>
    </div>
  );
}
