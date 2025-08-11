// lib/code-utils.js
export function parseLanguage(rawLanguage) {
    if (!rawLanguage) return 'javascript';
  
    // Normalize common language names and typos
    const languageMap = {
      js: 'javascript',
      ts: 'typescript',
      py: 'python',
      sh: 'bash',
      zsh: 'bash',
      kt: 'kotlin',
      rs: 'rust',
      go: 'golang',
      cs: 'csharp',
      m: 'objectivec',
      h: 'c',
      cpp: 'cpp',
      hpp: 'cpp',
      cc: 'cpp',
      hh: 'cpp',
      avascript: 'javascript', // Fix common typo
      // Add more mappings as needed
    };
  
    const normalized = rawLanguage.toLowerCase().trim();
    return languageMap[normalized] || normalized;
  }