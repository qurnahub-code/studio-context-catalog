export async function triggerAutoSync(projectId: string) {
  // 1. Check if GitHub settings are configured for this project
  const repo = localStorage.getItem(`ctx_repo_${projectId}`);
  const token = localStorage.getItem(`ctx_token_${projectId}`);
  const targetModel = localStorage.getItem(`ctx_model_${projectId}`) || 'cursor';

  if (!repo || !token) {
    // Silent fail if not configured
    return { success: false, reason: 'not_configured' };
  }

  try {
    // 2. Fetch the latest files for this project
    const filesRes = await fetch(`/api/context/${encodeURIComponent(projectId)}`);
    const filesData = await filesRes.json();
    
    if (!filesData.success || !filesData.data || filesData.data.length === 0) {
      return { success: false, reason: 'no_files' };
    }

    // 3. Compile the context using the API
    const compileRes = await fetch('/api/v1/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files: filesData.data, targetModel })
    });
    const compileData = await compileRes.json();

    if (!compileData.success) {
      return { success: false, reason: 'compile_failed' };
    }

    // 4. Push to GitHub
    const targetFiles: Record<string, string> = {
      cursor: '.cursorrules',
      claude: 'CLAUDE.md',
      copilot: '.github/copilot-instructions.md'
    };
    
    const pushRes = await fetch('/api/v1/github/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        repo,
        path: targetFiles[targetModel] || '.cursorrules',
        content: compileData.fileContent,
        token,
        commitMessage: `ContextOps: Auto-syncing rules for ${projectId}`
      })
    });

    const pushData = await pushRes.json();
    return { success: pushData.success, data: pushData };

  } catch (error) {
    console.error('Auto-sync failed:', error);
    return { success: false, reason: 'error' };
  }
}
