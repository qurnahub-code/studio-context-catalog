const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const projects = ['sla-breach-calculator', 'studio-context-catalog', 'crawlscope-geo-audit', 'mcp-playground', 'niche-storefront-dashboard', 'query-purf'];

projects.forEach(project => {
  const projectPath = path.join(baseDir, project);
  if (!fs.existsSync(projectPath)) return;
  
  const overviewPath = path.join(projectPath, 'overview.md');
  const archPath = path.join(projectPath, 'architecture-and-routing.md');
  const featuresPath = path.join(projectPath, 'core-features.md');
  const stylingPath = path.join(projectPath, 'styling-and-design.md');
  
  // 1. Combine into context.md
  let contextContent = '';
  if (fs.existsSync(overviewPath)) {
    contextContent += fs.readFileSync(overviewPath, 'utf8') + '\n\n';
  }
  if (fs.existsSync(archPath)) {
    // Strip the `# ProjectName - Aspect` header to make it clean
    let archText = fs.readFileSync(archPath, 'utf8');
    archText = archText.replace(/^#\s+.*?\n+/m, '');
    contextContent += archText + '\n\n';
  }
  if (fs.existsSync(featuresPath)) {
    let featuresText = fs.readFileSync(featuresPath, 'utf8');
    featuresText = featuresText.replace(/^#\s+.*?\n+/m, '');
    contextContent += featuresText + '\n\n';
  }
  
  if (contextContent.trim()) {
    fs.writeFileSync(path.join(projectPath, 'context.md'), contextContent.trim());
  }

  // 2. Rename styling-and-design.md to design.md
  const designPath = path.join(projectPath, 'design.md');
  if (fs.existsSync(stylingPath)) {
    let designText = fs.readFileSync(stylingPath, 'utf8');
    // Rewrite the header to match the expected `# ProjectName - Design` format
    designText = designText.replace(/^#\s+(.*?)\s+-\s+Styling.*/m, '# $1 - Design');
    fs.writeFileSync(designPath, designText);
  }

  // 3. Delete the old 4 files
  if (fs.existsSync(overviewPath)) fs.unlinkSync(overviewPath);
  if (fs.existsSync(archPath)) fs.unlinkSync(archPath);
  if (fs.existsSync(featuresPath)) fs.unlinkSync(featuresPath);
  if (fs.existsSync(stylingPath)) fs.unlinkSync(stylingPath);
});

console.log("Combine complete!");
