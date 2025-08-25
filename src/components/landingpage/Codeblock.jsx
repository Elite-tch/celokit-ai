import { useState, useEffect } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Copy, Check } from "lucide-react";

const CodeBlock = ({ code, language = 'javascript', id, title, description }) => {
        const [mounted, setMounted] = useState(false);
        const [copiedCode, setCopiedCode] = useState('');

        useEffect(() => {
            setMounted(true);
        }, []);

        const copyToClipboard = async (text, id) => {
            try {
                await navigator.clipboard.writeText(text);
                setCopiedCode(id);
                setTimeout(() => setCopiedCode(''), 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        };

        const getLanguage = (language) => {
            switch (language) {
                case 'typescript': return 'typescript';
                case 'bash': return 'bash';
                case 'css': return 'css';
                case 'python': return 'python';
                case 'json': return 'json';
                case 'html': return 'html';
                case 'solidity': return 'solidity';
                case 'rust': return 'rust';
                case 'go': return 'go';
                case 'java': return 'java';
                case 'cpp': return 'cpp';
                case 'csharp': return 'csharp';
                case 'kotlin': return 'kotlin';
                case 'ruby': return 'ruby';
                case 'php': return 'php';
                case 'sql': return 'sql';
                case 'markdown': return 'markdown';
                default: return 'javascript';
            }
        };

        
        return (
            <div className="relative bg-[#1e002b] rounded-lg    overflow-hidden border border-gray-700">
                {title && (
                    <div className="bg-[#1e002b] px-4 py-2 text-sm text-gray-300 border-b border-gray-700 flex items-center justify-between">
                        <span className="font-medium">{title}</span>
                        <span className="text-xs text-gray-500 uppercase">{language}</span>
                    </div>
                )}
                {description && (
                    <div className="bg-[#1e002b]/50 text-left px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                        {description}
                    </div>
                )}
                <div className="relative max-w-screen">
                    <Highlight
                        theme={themes.dracula}
                        code={code}
                        language={getLanguage(language)}
                    >
                        {({ className, style, tokens, getLineProps, getTokenProps }) => (
                            <pre style={style} className={`${className} p-4 text-left overflow-x-auto text-sm`}>
                                {tokens.map((line, i) => (
                                    <div key={i} {...getLineProps({ line })}>
                                        {line.map((token, key) => (
                                            <span key={key} {...getTokenProps({ token })} />
                                        ))}
                                    </div>
                                ))}
                            </pre>
                        )}
                    </Highlight>
                    <button
                        onClick={() => copyToClipboard(code, id)}
                        className="absolute top-2 right-2 p-2 bg-[#1e002b]/80 hover:bg-gray-700 rounded-md transition-all duration-200 backdrop-blur-sm"
                        title="Copy code"
                    >
                        {copiedCode === id ? (
                            <Check className="w-4 h-4 text-green-600" />
                        ) : (
                            <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                        )}
                    </button>
                </div>
            </div>
        );
    };

export default function InstallationSection() {
  const [activeTab, setActiveTab] = useState('installation');

  const tabs = {
    installation: {
      id: 'install',
      title: 'Installation',
      language: 'bash',
      code: `npm install celokit-ai`,
      description: 'Add Celokit-AI to your project with a single command.'
    },
    usage: {
      id: 'usage',
      title: 'Usage',
      language: 'javascript',
      code: `import { ConnectButton } from "celokit-ai";

<ConnectButton />`,
      description: 'No Wagmi, RainbowKit, or Viem setup required.'
    }
  };

  const current = tabs[activeTab];

  return (
    <section className="md:py-12 py-4 px-6 text-white bg-[#1e002b] mb-14 rounded backdrop-blur-3xl ">
      <div className="md:w-2xl mx-auto">
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('installation')}
            className={`${activeTab === 'installation' ? 'bg-white/10 text-white' : 'bg-white/5 text-gray-300'} px-4 py-2 rounded-md border border-white/10 transition-colors`}
          >
            Installation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('usage')}
            className={`${activeTab === 'usage' ? 'bg-white/10 text-white' : 'bg-white/5 text-gray-300'} px-4 py-2 rounded-md border border-white/10 transition-colors`}
          >
            Usage
          </button>
        </div>

        <CodeBlock
          id={current.id}
          title={current.title}
          language={current.language}
          code={current.code}
          description={current.description}
        />
      </div>
    </section>
  );
}
