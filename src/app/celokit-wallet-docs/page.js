'use client'
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, Zap, Shield, Code, Wallet, ChevronRight, Book, Terminal, Settings,  Menu, X } from 'lucide-react';
import { Highlight, themes } from 'prism-react-renderer';

const CeloKitDocs = () => {
    const [activeTab, setActiveTab] = useState({});
    const [copiedCode, setCopiedCode] = useState('');
    const [activeSection, setActiveSection] = useState('overview');

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
    const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    };
  
    const closeMobileMenu = () => {
      setIsMobileMenuOpen(false);
    };
    

    const copyToClipboard = async (text, id) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedCode(id);
            setTimeout(() => setCopiedCode(''), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const setTabForSection = (section, tab) => {
        setActiveTab(prev => ({
            ...prev,
            [section]: tab
        }));
    };

    const getActiveTab = (section, defaultTab = 'javascript') => {
        return activeTab[section] || defaultTab;
    };

    const getLanguage = (language) => {
        switch (language) {
            case 'typescript': return 'typescript';
            case 'bash': return 'bash';
            case 'css': return 'css';
            default: return 'javascript';
        }
    };

    const CodeBlock = ({ code, language = 'javascript', id, title, description }) => {
        const [mounted, setMounted] = useState(false);

        useEffect(() => {
            setMounted(true);
        }, []);

        if (!mounted) {
            return (
                <div className="bg-[#1e002b] rounded-lg p-4 text-gray-300 font-mono text-sm">
                    Loading...
                </div>
            );
        }

        return (
            <div className="relative bg-[#1e002b] rounded-lg    overflow-hidden border border-gray-700">
                {title && (
                    <div className="bg-[#1e002b] px-4 py-2 text-sm text-gray-300 border-b border-gray-700 flex items-center justify-between">
                        <span className="font-medium">{title}</span>
                        <span className="text-xs text-gray-500 uppercase">{language}</span>
                    </div>
                )}
                {description && (
                    <div className="bg-[#1e002b]/50 px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
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
                            <pre style={style} className={`${className} p-4 overflow-x-auto text-sm`}>
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

    const TabGroup = ({ section, tabs, children }) => {
        const activeTabKey = getActiveTab(section);

        return (
            <div className="mt-4 w-[90%] md:w-full">
                <div className="flex border-b border-gray-700 bg-[#1e002b]/50 rounded-t-lg overflow-hidden">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setTabForSection(section, tab.key)}
                            className={`px-6 py-3 text-sm font-medium transition-all duration-200 relative ${activeTabKey === tab.key
                                    ? 'text-[#ffff57] bg-[#1e002b] shadow-lg'
                                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#1e002b]/30'
                                }`}
                        >
                            {tab.label}
                            {activeTabKey === tab.key && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ffff57] to-green-600"></div>
                            )}
                        </button>
                    ))}
                </div>
                <div className="bg-[#1e002b] rounded-b-lg border border-t-0 border-gray-700">
                    {children(activeTabKey)}
                </div>
            </div>
        );
    };

    const sidebarSections = [
        { id: 'overview', label: 'Overview', icon: Book },
        { id: 'installation', label: 'Installation', icon: Terminal },
        { id: 'setup', label: 'Quick Setup', icon: Zap },
        { id: 'components', label: 'Components', icon: Code },
        { id: 'advanced', label: 'Advanced Usage', icon: Settings },
        { id: 'troubleshooting', label: 'Troubleshooting', icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-[#1e002b] border-t overflow-hidden  border-t-gray-800">
            {/* Header */}
           

            <div className="flex ">
            <button
        onClick={toggleMobileMenu}
        className="fixed top-20 left-4 border-t   border-gray-800 z-40 md:hidden mx-auto bg-[#1e002b] w-[95%] pb-4 pt-3 px-2 text-gray-400 hover:text-white  transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <div className='flex items-center gap-2'><Menu className="w-5 h-5" /> SideBar</div>
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

                {/* Sidebar */}
                <aside
        className={`w-64 md:bg-[#1e002b]/50 bg-[#1e002b]  border-r  border-gray-700 min-h-screen fixed md:top-28 top-20 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <nav className="p-6 pt-16 md:pt-6">
          <ul className="space-y-2">
            {sidebarSections.map((section) => {
              const Icon = section.icon;
              return (
                <li key={section.id}>
                  <button
                    onClick={() => {
                      setActiveSection(section.id);
                      closeMobileMenu(); // Close mobile menu when item is selected
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-[#ffff57]/10 to-green-600/10 text-[#ffff57] border border-[#ffff57]/20'
                        : 'text-gray-400 hover:text-white hover:bg-[#1e002b]/30'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{section.label}</span>
                    {activeSection === section.id && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                </li>
              );
            })}
            <div className="flex items-center pl-3 pt-3 space-x-4">
              <a
                href="https://github.com/elite-tch/celokit-ai"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <span className="px-3 py-1 bg-green-900/30 text-green-400 text-xs font-medium rounded-full border border-green-700">
                v1.0.0
              </span>
            </div>
          </ul>
        </nav>
      </aside>

                {/* Main Content */}
                <main className="flex-1 px-4 pt-42 md:p-8 md:ml-80 md:max-w-4xl ">
                    {/* Overview Section */}
                    {activeSection === 'overview' && (
                        <section>
                            <div className="text-center mb-12">
                                <h2 className="md:text-4xl text-3xl font-bold text-white mb-4">
                                    Build on Celo with AI-Powered Tools
                                </h2>
                                <p className="md:text-xl text-sm text-gray-300 mb-8 max-w-3xl mx-auto">
                                    CeloKit-AI simplifies Celo blockchain development with pre-built components,
                                    AI assistance, and seamless wallet integration for both Mainnet and Alfajores testnet.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-[#1e002b]/50 p-6 rounded-xl border border-gray-700 hover:border-[#ffff57]/30 transition-all duration-300">
                                        <Wallet className="w-8 h-8 text-[#ffff57] mb-3 mx-auto" />
                                        <h3 className="font-semibold text-white mb-2">One-Click Connect</h3>
                                        <p className="text-sm text-gray-400">Instant wallet connection with beautiful UI components</p>
                                    </div>
                                    <div className="bg-[#1e002b]/50 p-6 rounded-xl border border-gray-700 hover:border-green-600/30 transition-all duration-300">
                                        <Shield className="w-8 h-8 text-green-600 mb-3 mx-auto" />
                                        <h3 className="font-semibold text-white mb-2">Multi-Network</h3>
                                        <p className="text-sm text-gray-400">Seamless switching between Mainnet & Alfajores</p>
                                    </div>
                                    <div className="bg-[#1e002b]/50 p-6 rounded-xl border border-gray-700 hover:border-blue-400/30 transition-all duration-300">
                                        <Zap className="w-8 h-8 text-blue-400 mb-3 mx-auto" />
                                        <h3 className="font-semibold text-white mb-2">Easy Transactions</h3>
                                        <p className="text-sm text-gray-400">Built-in modals for sending tokens with validation</p>
                                    </div>
                                    <div className="bg-[#1e002b]/50 p-6 rounded-xl border border-gray-700 hover:border-purple-400/30 transition-all duration-300">
                                        <Code className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
                                        <h3 className="font-semibold text-white mb-2">AI-Assisted</h3>
                                        <p className="text-sm text-gray-400">Smart code generation and development helpers</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#1e002b]/30 rounded-xl p-8 border border-gray-700">
                                <h3 className="text-2xl font-semibold text-white mb-4">What makes CeloKit-AI special?</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-lg font-semibold text-[#ffff57] mb-3">🎯 Developer-First</h4>
                                        <p className="text-gray-300 md:text-base text-sm mb-4">
                                            Built specifically for Celo developers, with components optimized for Celo's unique features
                                            like stable coins (cUSD, cEUR) and mobile-first design.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-green-600 mb-3">🤖 AI-Enhanced</h4>
                                        <p className="text-gray-300 md:text-base text-sm-300 mb-4">
                                            Integrated AI tools help generate smart contracts, suggest optimizations,
                                            and provide real-time development assistance.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-blue-400 mb-3">📱 Mobile-Ready</h4>
                                        <p className="text-gray-300 md:text-base text-sm mb-4">
                                            Components are designed with mobile-first approach, perfect for Celo's
                                            focus on mobile financial access.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-purple-400 mb-3">⚡ Performance</h4>
                                        <p className="text-gray-300 md:text-base text-sm mb-4">
                                            Optimized for fast loading and minimal bundle size, with tree-shaking
                                            support for production builds.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Installation Section */}
                    {activeSection === 'installation' && (
                        <section className='max-w-[90%]'>
                            <h2 className="md:text-3xl text-2xl font-bold text-white mb-6 flex items-center">
                                <Terminal className="w-8 h-8 text-[#ffff57] mr-3" />
                                Installation
                            </h2>

                            <div className="bg-[#1e002b]/50 rounded-xl p-6 border border-gray-700 mb-8">
                                <p className="text-gray-300 md:text-base text-sm mb-6">
                                    Install CeloKit-AI and its peer dependencies to get started with Celo blockchain development.
                                    The library requires several peer dependencies for wallet connections and blockchain interactions.
                                </p>

                                <TabGroup
                                    section="installation"
                                    tabs={[
                                        { key: 'npm', label: 'npm' },
                                        { key: 'yarn', label: 'Yarn' },
                                        { key: 'pnpm', label: 'pnpm' },
                                        { key: 'bun', label: 'Bun' }
                                    ]}
                                >
                                    {(activeTab) => (
                                        <div className="p-0">
                                            {activeTab === 'npm' && (
                                                <CodeBlock
                                                id="install-bun"
                                                language="bash"
                                                title="Install with Bun"
                                               
                                                code={`# Install CeloKit-AI 
bun add celokit-ai 

# Install additional utilities (optional)
bun add clsx tailwind-merge`}   />
                                            )}
                                            {activeTab === 'yarn' && (
                                                <CodeBlock
                                                    id="install-yarn"
                                                    language="bash"
                                                    title="Install with Yarn"
                                                  
                                                    code={`# Install CeloKit-AI
yarn add celokit-ai 

# Install additional utilities (optional)
yarn add clsx tailwind-merge`}
                                                />
                                            )}
                                            {activeTab === 'pnpm' && (
                                                <CodeBlock
                                                    id="install-pnpm"
                                                    language="bash"
                                                    title="Install with pnpm"
                                                    
                                                    code={`# Install CeloKit-AI 
pnpm add celokit-ai 

# Install additional utilities (optional)
pnpm add clsx tailwind-merge`}
                                                />
                                            )}
                                            {activeTab === 'bun' && (
                                                <CodeBlock
                                                    id="install-bun"
                                                    language="bash"
                                                    title="Install with Bun"
                                                   
                                                    code={`# Install CeloKit-AI 
bun add celokit-ai 

# Install additional utilities (optional)
bun add clsx tailwind-merge`}
                                                />
                                            )}
                                        </div>
                                    )}
                                </TabGroup>

                                <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                                    <h4 className="text-blue-400 font-semibold mb-3">📦 Dependencies Explained (that will be installed) </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-300"><strong className="text-[#ffff57]">celokit-ai:</strong> Core toolkit with Celo-optimized components</p>
                                            <p className="text-gray-300"><strong className="text-[#ffff57]">@rainbow-me/rainbowkit:</strong> Beautiful wallet connection UI library</p>
                                            <p className="text-gray-300"><strong className="text-[#ffff57]">wagmi:</strong> React hooks for Ethereum/Celo blockchain interactions</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-300"><strong className="text-[#ffff57]">viem:</strong> TypeScript-first Ethereum library for low-level operations</p>
                                            <p className="text-gray-300"><strong className="text-[#ffff57]">@tanstack/react-query:</strong> Powerful data fetching and caching solution</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Setup Section */}
                    {activeSection === 'setup' && (
                        <section className=''>
                            <h2 className="md:text-3xl text-2xl font-bold text-white mb-6 flex items-center">
                                <Zap className="w-8 h-8 text-[#ffff57] mr-3" />
                                Quick Setup
                            </h2>

                            {/* Step 1: Environment Configuration */}
                            <div className="mb-10">
                                <h3 className="md:text-2xl text-xl font-semibold text-white mb-4 flex items-center">
                                    <span className="w-8 h-8 bg-gradient-to-r from-[#ffff57] to-green-600 rounded-lg flex items-center justify-center text-gray-900 mr-3 text-lg font-bold">1</span>
                                    Environment Configuration
                                </h3>
                                <p className="text-gray-300 max-w-[90%]  md:text-base text-sm mb-4">
                                    Create a <code className="bg-[#1e002b] px-2 py-1 rounded text-[#ffff57]">.env.local</code> file
                                    in your project root to configure WalletConnect for proper wallet connections.
                                </p>

                               <div className='w-[90%] md:w-full'>

                               <CodeBlock
                                    id="env-config"
                                    language="bash"
                                    title=".env.local"
                                    description="Environment variables for WalletConnect and app configuration"
                                    code={`# Required: Get your project ID from https://cloud.walletconnect.com

NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here

`}
                                />
                               </div>

                                <div className="mt-4 p-4 bg-yellow-900/20 border w-[90%] border-[#ffff57]/30 rounded-lg">
                                    <h4 className="text-[#ffff57] font-semibold mb-2">⚠️ WalletConnect Setup Required</h4>
                                    <p className="text-sm text-gray-300">
                                        Visit <a href="https://cloud.walletconnect.com" className="text-blue-400 hover:underline">WalletConnect Cloud</a> to create a free project and get your Project ID. This is required for wallet connections to work properly across different wallet providers.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2: Setup Providers 
                            <div className="mb-10">
                                <h3 className="text-2xl font-semibold text-white mb-4 flex items-center">
                                    <span className="w-8 h-8 bg-gradient-to-r from-[#ffff57] to-green-600 rounded-lg flex items-center justify-center text-gray-900 mr-3 text-lg font-bold">2</span>
                                    Setup Providers
                                </h3>
                                <p className="text-gray-300 mb-4">
                                    Create a providers component to wrap your Next.js app with the necessary context providers.
                                    This enables wallet connections, network switching, and blockchain interactions throughout your application.
                                </p>

                                <TabGroup
                                    section="providers"
                                    tabs={[
                                        { key: 'javascript', label: 'JavaScript' },
                                        { key: 'typescript', label: 'TypeScript' }
                                    ]}
                                >
                                    {(activeTab) => (
                                        <div className="p-0">
                                            {activeTab === 'javascript' && (
                                                <CodeBlock
                                                    id="providers-js"
                                                    language="javascript"
                                                    title="app/providers.js"
                                                    description="Client-side providers wrapper for Web3 functionality"
                                                    code={`'use client'


import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from 'celokit-ai/config'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'


const queryClient = new QueryClient()

export function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}`}
                                                />
                                            )}
                                            {activeTab === 'typescript' && (
                                                <CodeBlock
                                                    id="providers-ts"
                                                    language="typescript"
                                                    title="app/providers.tsx"
                                                    description="Type-safe providers wrapper with proper interfaces"
                                                    code={`'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from 'celokit-ai/config'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { ReactNode } from 'react'
import '@rainbow-me/rainbowkit/styles.css'

interface ProvidersProps {
  children: ReactNode
}

const queryClient = new QueryClient()

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}`}
                                                />
                                            )}
                                        </div>
                                    )}
                                </TabGroup>
                            </div> */}

                            {/* Step 3: Layout Setup */}
                            <div className="mb-10">
                                <h3 className="md:text-2xl text-xl  font-semibold text-white mb-4 flex items-center">
                                    <span className="w-8 h-8 bg-gradient-to-r from-[#ffff57] to-green-600 rounded-lg flex items-center justify-center text-gray-900 mr-3 text-lg font-bold">2</span>
                                    Root Layout Setup
                                </h3>
                                <p className="text-gray-300 w-[90%] md:text-base text-sm mb-4">
                                    Wrap your entire Next.js app with the Providers component in your root layout.
                                    This ensures all pages have access to Web3 functionality.
                                </p>

                                <TabGroup
                                    section="layout"
                                    tabs={[
                                        { key: 'javascript', label: 'JavaScript' },
                                        { key: 'typescript', label: 'TypeScript' }
                                    ]}
                                >
                                    {(activeTab) => (
                                        <div className="p-0">
                                            {activeTab === 'javascript' && (
                                                <CodeBlock
                                                    id="layout-js"
                                                    language="javascript"
                                                    title="app/layout.js"
                                                    description="Root layout with providers and global styles"
                                                    code={`import { Providers } from "celokit-ai"
import './globals.css'


export const metadata = {
  
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className=" antialiased">
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  )
}`}
                                                />
                                            )}
                                            {activeTab === 'typescript' && (
                                                <CodeBlock
                                                    id="layout-ts"
                                                    language="typescript"
                                                    title="app/layout.tsx"
                                                    description="Type-safe root layout with metadata configuration"
                                                    code={`import { Providers } from "celokit-ai"
import { ReactNode } from 'react'
import type { Metadata } from 'next'
import './globals.css'


export const metadata: Metadata = {
  
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className=" antialiased">
        <Providers>
              {children}
        </Providers>
      </body>
    </html>
  )
}`}
                                                />
                                            )}
                                        </div>
                                    )}
                                </TabGroup>
                            </div>

                            {/* Step 4: Basic Usage */}
                            <div className="mb-8">
                                <h3 className="md:text-2xl text-xl  font-semibold text-white mb-4 flex items-center">
                                    <span className="w-8 h-8 bg-gradient-to-r from-[#ffff57] to-green-600 rounded-lg flex items-center justify-center text-gray-900 mr-3 text-lg font-bold">3</span>
                                    Create Your First Page
                                </h3>
                                <p className="text-gray-300 md:text-base text-sm mb-4">
                                    Now create a page that uses CeloKit-AI components. This example shows a complete homepage
                                    with wallet connection, network switching, and transaction functionality.
                                </p>

                                <TabGroup
                                    section="homepage"
                                    tabs={[
                                        { key: 'javascript', label: 'JavaScript' },
                                        { key: 'typescript', label: 'TypeScript' }
                                    ]}
                                >
                                    {(activeTab) => (
                                        <div className="p-0">
                                            {activeTab === 'javascript' && (
                                                <CodeBlock
                                                    id="homepage-js"
                                                    language="javascript"
                                                    title="app/page.js"
                                                    description="Complete homepage example with all CeloKit-AI components"
                                                    code={`'use client'

import { 
  ConnectButton,
  NetworkSwitcher,
  SendTransaction,
} from 'celokit-ai'

export default function HomePage() {
  const handleWalletConnect = (account) => {
    console.log('Wallet connected:', account)
    // Add your custom logic here
  }

  const handleTransactionComplete = (txHash) => {
    console.log('Transaction completed:', txHash)
    // Add success handling logic
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#ffff57] to-green-600 bg-clip-text text-transparent">
            Welcome to CeloKit-AI
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Experience seamless Celo blockchain integration
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="bg-[#1e002b]/50 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
            <Wallet className="w-6 h-6 mr-2 text-[#ffff57]" />
            Wallet Connection
          </h2>
          <div className="flex justify-center mb-4">
            <ConnectButton 
               className="hover:scale-105 transition-transform"
            />
          </div>
         
        </div>

        {/* Network Management */}
        <div className="bg-[#1e002b]/50 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
            <Settings className="w-6 h-6 mr-2 text-green-600" />
            Network Management
          </h2>
          <NetworkSwitcher 
           className="max-w-xs mx-auto"
          />
         
        </div>

        {/* Transactions */}
        <div className="bg-[#1e002b]/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
            <Zap className="w-6 h-6 mr-2 text-blue-400" />
            Send Transactions
          </h2>
          <SendTransaction
          className="max-w-md mx-auto"
          />
        </div>
      </div>
    </div>
  )
}`}
                                                />
                                            )}
                                            {activeTab === 'typescript' && (
                                                <CodeBlock
                                                    id="homepage-ts"
                                                    language="typescript"
                                                    title="app/page.tsx"
                                                    description="Type-safe homepage with all CeloKit-AI components"
                                                    code={`'use client'

import { 
  ConnectButton,
  NetworkSwitcher,
  SendTransaction
} from 'celokit-ai'


export default function HomePage() {
  const handleWalletConnect = (account: Address) => {
    console.log('Wallet connected:', account)
    // Add your custom logic here
  }

  const handleTransactionComplete = (txHash: string) => {
    console.log('Transaction completed:', txHash)
    // Add success handling logic
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#ffff57] to-green-600 bg-clip-text text-transparent">
            Welcome to CeloKit-AI
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Experience seamless Celo blockchain integration
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="bg-[#1e002b]/50 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
            <Wallet className="w-6 h-6 mr-2 text-[#ffff57]" />
            Wallet Connection
          </h2>
          <div className="flex justify-center mb-4">
            <ConnectButton   />
          </div>
          
        </div>

        {/* Network Management */}
        <div className="bg-[#1e002b]/50 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
            <Settings className="w-6 h-6 mr-2 text-green-600" />
            Network Management
          </h2>
          <NetworkSwitcher 
         className="max-w-xs mx-auto"
          />
          
        </div>

        {/* Transactions */}
        <div className="bg-[#1e002b]/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
            <Zap className="w-6 h-6 mr-2 text-blue-400" />
            Send Transactions
          </h2>
          <SendTransaction
          className="max-w-md mx-auto"
          />
        </div>
      </div>
    </div>
  )
}`}
                                                />
                                            )}
                                        </div>
                                    )}
                                </TabGroup>
                            </div>
                        </section>
                    )}

                    {/* Components Section */}
                    {activeSection === 'components' && (
                        <section>
                            <h2 className="md:text-3xl text-2xl font-bold text-white mb-6 flex items-center">
                                <Code className="w-8 h-8 text-[#ffff57] mr-3" />
                                Component API
                            </h2>

                            {/* ConnectButton */}
                            <div className="mb-10">
                                <h3 className="md:text-2xl text-xl  font-semibold text-white mb-4">
                                    ConnectButton
                                </h3>
                                <p className="text-gray-300 max-w-[90%] md:text-base text-sm mb-4">
                                    The ConnectButton component provides a beautiful, customizable button for wallet connection.
                                    It handles all connection states (disconnected, connecting, connected) with built-in UI.
                                </p>

                                <TabGroup
                                    section="connect-button"
                                    tabs={[
                                        { key: 'javascript', label: 'JavaScript' },
                                        { key: 'typescript', label: 'TypeScript' }
                                    ]}
                                >
                                    {(activeTab) => (
                                        <div className="p-0">
                                            {activeTab === 'javascript' && (
                                                <CodeBlock
                                                    id="connectbutton-js"
                                                    language="javascript"
                                                    title="ConnectButton Usage"
                                                    description="Basic implementation with common props"
                                                    code={`import { ConnectButton } from 'celokit-ai'

function WalletConnect() {
  return (
    <ConnectButton 
      className="custom-class"
      onConnect={(account) => console.log('Connected:', account)}
      onDisconnect={() => console.log('Disconnected')}
    />
  )
}`}
                                                />
                                            )}
                                            {activeTab === 'typescript' && (
                                                <CodeBlock
                                                    id="connectbutton-ts"
                                                    language="typescript"
                                                    title="ConnectButton Usage (TypeScript)"
                                                    description="Type-safe implementation with event handlers"
                                                    code={`import { ConnectButton } from 'celokit-ai'


function WalletConnect() {
  const handleConnect = (account: Address) => {
    console.log('Connected:', account)
    // Your connection logic
  }

  const handleDisconnect = () => {
    console.log('Disconnected')
    // Your disconnection logic
  }

  return (
    <ConnectButton 
       className="custom-class"
      onConnect={handleConnect}
      onDisconnect={handleDisconnect}
    />
  )
}`}
                                                />
                                            )}
                                        </div>
                                    )}
                                </TabGroup>

                                <div className="mt-6 bg-[#1e002b]/30 max-w-[90%] rounded-lg p-4 border border-gray-700">
                                    <h4 className="text-lg font-semibold text-[#ffff57] mb-3">ConnectButton Props</h4>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-700">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Prop</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-700">
                                               
                                                
                                                
                                                <tr>
                                                    <td className="px-4 py-3 text-sm text-gray-300">className</td>
                                                    <td className="px-4 py-3 text-sm text-gray-300">string</td>
                                                   
                                                    <td className="px-4 py-3 text-sm text-gray-300">Custom CSS classes</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 text-sm text-gray-300">onConnect</td>
                                                    <td className="px-4 py-3 text-sm text-gray-300">(address: string) ={'>'} void</td>
                                                 
                                                    <td className="px-4 py-3 text-sm text-gray-300">Callback when wallet connects</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 text-sm text-gray-300">onDisconnect</td>
                                                    <td className="px-4 py-3 text-sm text-gray-300">() ={'>'} void</td>
                                                  
                                                    <td className="px-4 py-3 text-sm text-gray-300">Callback when wallet disconnects</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* NetworkSwitcher */}
                            <div className="mb-10">
                                <h3 className="md:text-2xl text-xl font-semibold text-white mb-4">
                                    NetworkSwitcher
                                </h3>
                                <p className="text-gray-300 md:text-base text-sm max-w-[90%] mb-4">
                                    The NetworkSwitcher component allows users to switch between supported Celo networks
                                    (Mainnet and Alfajores testnet by default). It includes network validation and automatic
                                    wallet switching.
                                </p>

                                <TabGroup
                                    section="network-switcher"
                                    tabs={[
                                        { key: 'javascript', label: 'JavaScript' },
                                        { key: 'typescript', label: 'TypeScript' }
                                    ]}
                                >
                                    {(activeTab) => (
                                        <div className="p-0">
                                            {activeTab === 'javascript' && (
                                                <CodeBlock
                                                    id="networkswitcher-js"
                                                    language="javascript"
                                                    title="NetworkSwitcher Usage"
                                                    description="Basic implementation with allowed chains"
                                                    code={`import { NetworkSwitcher } from 'celokit-ai'

function NetworkSelector() {
  return (
    <NetworkSwitcher 
      theme="dark"
      className="custom-class"
      onSwitch={(chain) => console.log('Switched to:', chain)}
    />
  )
}`}
                                                />
                                            )}
                                            {activeTab === 'typescript' && (
                                                <CodeBlock
                                                    id="networkswitcher-ts"
                                                    language="typescript"
                                                    title="NetworkSwitcher Usage (TypeScript)"
                                                    description="Type-safe implementation with chain types"
                                                    code={`import { NetworkSwitcher } from 'celokit-ai'


function NetworkSelector() {
  const handleSwitch = (chain: Chain) => {
    console.log('Switched to:', chain)
    // Your network switch logic
  }

  return (
    <NetworkSwitcher 
      theme="dark"
      className="custom-class"
      onSwitch={handleSwitch}
    />
  )
}`}
                                                />
                                            )}
                                        </div>
                                    )}
                                </TabGroup>

                                <div className="mt-6 bg-[#1e002b]/30 max-w-[90%] rounded-lg p-4 border border-gray-700">
                                    <h4 className="text-lg font-semibold text-green-600 mb-3">NetworkSwitcher Props</h4>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-700">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Prop</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
             
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-700">
                                               
                                                <tr>
                                                    <td className="px-4 py-3 text-sm text-gray-300">theme</td>
                                                    <td className="px-4 py-3 text-sm text-gray-300">'light' | 'dark'</td>
                                                   
                                                    <td className="px-4 py-3 text-sm text-gray-300">UI theme for the switcher</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 text-sm text-gray-300">className</td>
                                                    <td className="px-4 py-3 text-sm text-gray-300">string</td>
                                                   
                                                    <td className="px-4 py-3 text-sm text-gray-300">Custom CSS classes</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 text-sm text-gray-300">onSwitch</td>
                                                    <td className="px-4 py-3 text-sm text-gray-300">(chain: Chain) ={'>'} void</td>
                                                    
                                                    <td className="px-4 py-3 text-sm text-gray-300">Callback when network switches</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* SendTransaction */}
                            <div className="mb-10">
                                <h3 className="md:text-2xl text-xl font-semibold text-white mb-4">
                                    SendTransaction
                                </h3>
                                <p className="text-gray-300 md:text-base text-sm max-w-[90%] mb-4">
                                    The SendTransaction component provides a complete modal interface for sending tokens
                                    on the Celo network. It includes amount validation, gas estimation, and transaction
                                    status tracking.
                                </p>

                                <TabGroup
                                    section="send-transaction"
                                    tabs={[
                                        { key: 'javascript', label: 'JavaScript' },
                                        { key: 'typescript', label: 'TypeScript' }
                                    ]}
                                >
                                    {(activeTab) => (
                                        <div className="p-0">
                                            {activeTab === 'javascript' && (
                                                <CodeBlock
                                                    id="sendtransaction-js"
                                                    language="javascript"
                                                    title="SendTransaction Usage"
                                                    description="Basic implementation with common props"
                                                    code={`import { SendTransaction } from 'celokit-ai'

function PaymentForm() {
  return (
    <SendTransaction
      className="custom-class"
      onComplete={(txHash) => console.log('Transaction hash:', txHash)}
      onError={(error) => console.error('Error:', error)}
    />
  )
}`}
                                                />
                                            )}
                                            {activeTab === 'typescript' && (
                                                <CodeBlock
                                                    id="sendtransaction-ts"
                                                    language="typescript"
                                                    title="SendTransaction Usage (TypeScript)"
                                                    description="Type-safe implementation with event handlers"
                                                    code={`import { SendTransaction } from 'celokit-ai'


function PaymentForm() {
  const handleComplete = (txHash: string) => {
    console.log('Transaction completed:', txHash)
    // Your success logic
  }

  const handleError = (error: Error) => {
    console.error('Transaction failed:', error)
    // Your error handling logic
  }

  return (
    <SendTransaction
      className="custom-class"
      onComplete={handleComplete}
      onError={handleError}
    />
  )
}`}
                                                />
                                            )}
                                        </div>
                                    )}
                                </TabGroup>

                                <div className="mt-6 bg-[#1e002b]/30 max-w-[90%] rounded-lg p-4 border border-gray-700">
                                    <h4 className="text-lg font-semibold text-blue-400 mb-3">SendTransaction Props</h4>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-700">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Prop</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                                                  
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-700">
                                                
                                                <tr>
                                                    <td className="px-4 py-3 text-sm text-gray-300">className</td>
                                                    <td className="px-4 py-3 text-sm text-gray-300">string</td>
                       
                                                    <td className="px-4 py-3 text-sm text-gray-300">Custom CSS classes</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 text-sm text-gray-300">onComplete</td>
                                                    <td className="px-4 py-3 text-sm text-gray-300">(txHash: string) ={'>'} void</td>
                                                  
                                                    <td className="px-4 py-3 text-sm text-gray-300">Callback when transaction completes</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 text-sm text-gray-300">onError</td>
                                                    <td className="px-4 py-3 text-sm text-gray-300">(error: Error) ={'>'} void</td>
                                                   
                                                    <td className="px-4 py-3 text-sm text-gray-300">Callback when transaction fails</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Advanced Usage Section */}
                    {activeSection === 'advanced' && (
                        <section className='md:text-base text-sm'>
                            <h2 className="md:text-3xl text-2xl font-bold text-white mb-6 flex items-center">
                                <Settings className="w-8 h-8 text-[#ffff57] mr-3" />
                                Advanced Usage
                            </h2>

                            {/* Custom Styling */}
                            <div className="mb-10">
                                <h3 className="md:text-2xl text-xl font-semibold text-white mb-4">
                                    Custom Styling
                                </h3>
                                <p className="text-gray-300 mb-4 max-w-[90%]">
                                    All CeloKit-AI components support custom styling through Tailwind CSS classes or
                                    traditional CSS overrides. The components use a BEM-like naming convention for easy targeting.
                                </p>

                                <TabGroup
                                    section="custom-styling"
                                    tabs={[
                                        { key: 'tailwind', label: 'Tailwind CSS' },
                                        { key: 'css', label: 'CSS' }
                                    ]}
                                >
                                    {(activeTab) => (
                                        <div className="p-0">
                                            {activeTab === 'tailwind' && (
                                                <CodeBlock
                                                    id="tailwind-styling"
                                                    language="javascript"
                                                    title="Custom Styling with Tailwind"
                                                    description="Override default styles using utility classes"
                                                    code={`import { ConnectButton, NetworkSwitcher } from 'celokit-ai'

function CustomUI() {
  return (
    <div className="space-y-4">
      <ConnectButton 
        className="bg-[#ffff57] text-[#1e002b] px-6 py-3 rounded-full hover:bg-[#ffff57]/90 transition-colors"
      />
      <NetworkSwitcher 
        className="bg-[#1e002b] border border-gray-700 rounded-lg p-3"
        dropdownClassName="bg-[#1e002b] border border-gray-700 mt-2"
      />
    </div>
  )
}`}
                                                />
                                            )}
                                            {activeTab === 'css' && (
                                                <CodeBlock
                                                    id="css-styling"
                                                    language="css"
                                                    title="Custom Styling with CSS"
                                                    description="Override default styles using CSS"
                                                    code={`/* styles/connect-button.css */
.celokit-connect-button {
  background-color: #ffff57;
  color: #1e002b;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  transition: background-color 0.2s;
}

.celokit-connect-button:hover {
  background-color: #ffff5790;
}

/* styles/network-switcher.css */
.celokit-network-switcher {
  background-color: #1e002b;
  border: 1px solid #374151;
  border-radius: 0.5rem;
  padding: 0.75rem;
}

.celokit-network-switcher-dropdown {
  background-color: #1e002b;
  border: 1px solid #374151;
  margin-top: 0.5rem;
}`}
                                                />
                                            )}
                                        </div>
                                    )}
                                </TabGroup>
                            </div>

                            {/* Standalone Usage */}
                            <div className="mb-10">
                                <h3 className="md:text-2xl text-xl font-semibold text-white mb-4">
                                    Standalone Usage (Non-Next.js)
                                </h3>
                                <p className="text-gray-300 mb-4 max-w-[90%]">
                                    CeloKit-AI can be used in any React application, not just Next.js. Here's how to configure
                                    it for standalone React apps or other frameworks.
                                </p>

                                <TabGroup
                                    section="standalone"
                                    tabs={[
                                        { key: 'javascript', label: 'JavaScript' },
                                        { key: 'typescript', label: 'TypeScript' }
                                    ]}
                                >
                                    {(activeTab) => (
                                        <div className="p-0">
                                            {activeTab === 'javascript' && (
                                                <CodeBlock
                                                    id="standalone-js"
                                                    language="javascript"
                                                    title="Standalone Configuration"
                                                    description="Setup for non-Next.js applications //providers.js"
                                                    code={`import React from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from 'celokit-ai/config'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import App from './App'



// Create React Query client
const queryClient = new QueryClient()

// Wrap your app with providers
const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)`}
                                                />
                                            )}
                                            {activeTab === 'typescript' && (
                                                <CodeBlock
                                                    id="standalone-ts"
                                                    language="typescript"
                                                    title="Standalone Configuration (TypeScript)"
                                                    description="Type-safe setup for non-Next.js apps"
                                                    code={`import React from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from 'celokit-ai/config'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import App from './App'



// Create React Query client
const queryClient = new QueryClient()

// Wrap your app with providers
const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)`}
                                                />
                                            )}
                                        </div>
                                    )}
                                </TabGroup>
                            </div>

                            {/* Custom Configuration */}
                            <div className="mb-8">
                                <h3 className="md:text-2xl text-xl font-semibold text-white mb-4">
                                    Custom Configuration
                                </h3>
                                <p className="text-gray-300 mb-4 max-w-[90%]">
                                    For advanced use cases, you can create a custom Wagmi configuration while still using
                                    CeloKit-AI components. This allows for custom chains, connectors, and other low-level settings.
                                </p>

                                <TabGroup
                                    section="custom-config"
                                    tabs={[
                                        { key: 'javascript', label: 'JavaScript' },
                                        { key: 'typescript', label: 'TypeScript' }
                                    ]}
                                >
                                    {(activeTab) => (
                                        <div className="p-0">
                                            {activeTab === 'javascript' && (
                                                <CodeBlock
                                                    id="customconfig-js"
                                                    language="javascript"
                                                    title="Custom Wagmi Configuration"
                                                    description="Extend default config with custom settings"
                                                    code={`import { createConfig } from 'celokit-ai/config'
import { http } from 'viem'
import { mainnet, alfajores } from 'viem/chains'

// Create custom config
const config = createConfig({
  projectId: process.env.WALLETCONNECT_PROJECT_ID,
  chains: [mainnet, alfajores],
  transports: {
    [mainnet.id]: http(),
    [alfajores.id]: http('https://alfajores-forno.celo-testnet.org')
  },
  // Additional Wagmi config options
  batch: {
    multicall: true
  }
})

export default config`}
                                                />
                                            )}
                                            {activeTab === 'typescript' && (
                                                <CodeBlock
                                                    id="customconfig-ts"
                                                    language="typescript"
                                                    title="Custom Wagmi Configuration (TypeScript)"
                                                    description="Type-safe custom configuration"
                                                    code={`import { createConfig } from 'celokit-ai/config'
import { http } from 'viem'
import { mainnet, alfajores } from 'viem/chains'
import type { Config } from 'wagmi'

// Create custom config
const config: Config = createConfig({
  projectId: process.env.WALLETCONNECT_PROJECT_ID,
  chains: [mainnet, alfajores],
  transports: {
    [mainnet.id]: http(),
    [alfajores.id]: http('https://alfajores-forno.celo-testnet.org')
  },
  // Additional Wagmi config options
  batch: {
    multicall: true
  }
})

export default config`}
                                                />
                                            )}
                                        </div>
                                    )}
                                </TabGroup>
                            </div>
                        </section>
                    )}

                    {/* Troubleshooting Section */}
                    {activeSection === 'troubleshooting' && (
                        <section className="w-full max-w-none">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center">
                          <Shield className="w-6 h-6 md:w-8 md:h-8 text-[#ffff57] mr-3 flex-shrink-0" />
                          Troubleshooting
                        </h2>
                  
                        <div className="bg-[#1e002b]/30 rounded-xl text-sm md:text-base p-4 md:p-6 border border-gray-700">
                          <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">
                            Common Issues
                          </h3>
                  
                          <div className="space-y-6">
                            {/* Wallet Connection Issues */}
                            <div className="bg-[#1e002b]/50 rounded-lg p-3 md:p-4 border border-gray-700">
                              <h4 className="text-base md:text-lg font-semibold text-[#ffff57] mb-2">
                                Wallet Connection Errors
                              </h4>
                              <p className="text-gray-300 mb-3 text-sm md:text-base">
                                If you're experiencing wallet connection issues, check these common solutions:
                              </p>
                              <ul className="list-disc pl-4 md:pl-6 space-y-2 text-gray-300 text-sm md:text-base">
                                <li className="break-words">
                                  <strong>Verify WalletConnect Project ID:</strong> Ensure your{' '}
                                  <code className="bg-[#1e002b] px-1 rounded text-[#ffff57] text-xs md:text-sm break-all">
                                    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
                                  </code>{' '}
                                  is set in your{' '}
                                  <code className="bg-[#1e002b] px-1 rounded text-[#ffff57] text-xs md:text-sm">
                                    .env.local
                                  </code>{' '}
                                  file
                                </li>
                                <li className="break-words">
                                  <strong>Check Network Support:</strong> Some wallets require explicit chain support. Use{' '}
                                  <code className="bg-[#1e002b] px-1 rounded text-[#ffff57] text-xs md:text-sm break-all">
                                    allowedChains
                                  </code>{' '}
                                  prop in{' '}
                                  <code className="bg-[#1e002b] px-1 rounded text-[#ffff57] text-xs md:text-sm">
                                    NetworkSwitcher
                                  </code>
                                </li>
                                <li>
                                  <strong>Test Different Wallets:</strong> Try connecting with multiple wallets (MetaMask, Rainbow, etc.) to isolate the issue
                                </li>
                              </ul>
                              <div className="mt-4 p-3 bg-yellow-900/20 rounded border border-[#ffff57]/30">
                                <p className="text-xs md:text-sm text-[#ffff57]">
                                  <strong>Pro Tip:</strong> Clear your browser's cache and localStorage if you've recently changed your WalletConnect project ID.
                                </p>
                              </div>
                            </div>
                  
                            {/* Transaction Failures */}
                            <div className="bg-[#1e002b]/50 rounded-lg p-3 md:p-4 border border-gray-700">
                              <h4 className="text-base md:text-lg font-semibold text-red-400 mb-2">
                                Transaction Failures
                              </h4>
                              <p className="text-gray-300 mb-3 text-sm md:text-base">
                                Transactions may fail for several reasons. Here's how to debug:
                              </p>
                              <ul className="list-disc pl-4 md:pl-6 space-y-2 text-gray-300 text-sm md:text-base">
                                <li>
                                  <strong>Check Network:</strong> Ensure you're on the correct network (Mainnet vs Alfajores)
                                </li>
                                <li>
                                  <strong>Verify Gas Fees:</strong> Celo transactions require CELO for gas, even when sending stablecoins
                                </li>
                                <li>
                                  <strong>Insufficient Balance:</strong> Check that the wallet has enough of the token being sent
                                </li>
                                <li className="break-words">
                                  <strong>Use{' '}
                                    <code className="bg-[#1e002b] px-1 rounded text-[#ffff57] text-xs md:text-sm">
                                      onError
                                    </code>{' '}
                                    callback:</strong> Implement error handling to get specific failure reasons
                                </li>
                              </ul>
                              <div className="mt-4 overflow-hidden">
                                <CodeBlock
                                  id="error-handling"
                                  language="javascript"
                                  title="Error Handling Example"
                                  description="Implement transaction error handling"
                                  code={`<SendTransaction
                    onError={(error) => {
                      console.error('Transaction failed:', error)
                      // Show user-friendly error message
                      alert(\`Transaction failed: \${error.message}\`)
                    }}
                  />`}
                                />
                              </div>
                            </div>
                  
                            {/* Component Rendering Issues */}
                            <div className="bg-[#1e002b]/50 rounded-lg p-3 md:p-4 border border-gray-700">
                              <h4 className="text-base md:text-lg font-semibold text-blue-400 mb-2">
                                Component Rendering Problems
                              </h4>
                              <p className="text-gray-300 mb-3 text-sm md:text-base">
                                If components aren't rendering correctly:
                              </p>
                              <ul className="list-disc pl-4 md:pl-6 space-y-2 text-gray-300 text-sm md:text-base">
                                <li className="break-words">
                                  <strong>Check Provider Wrapping:</strong> Ensure your app is properly wrapped with the{' '}
                                  <code className="bg-[#1e002b] px-1 rounded text-[#ffff57] text-xs md:text-sm">
                                    Providers
                                  </code>{' '}
                                  component
                                </li>
                                <li className="break-words">
                                  <strong>Verify Client-Side Rendering:</strong> Some components require client-side rendering (use{' '}
                                  <code className="bg-[#1e002b] px-1 rounded text-[#ffff57] text-xs md:text-sm">
                                    'use client'
                                  </code>{' '}
                                  directive)
                                </li>
                                <li>
                                  <strong>Inspect Console Errors:</strong> Look for errors in browser console that might indicate missing dependencies
                                </li>
                              </ul>
                              <div className="mt-4 p-3 bg-blue-900/20 rounded border border-blue-700">
                                <p className="text-xs md:text-sm text-blue-300">
                                  <strong>Note:</strong> CeloKit-AI components must be rendered within the Wagmi and RainbowKit providers.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                  
                        <div className="mt-8 text-sm md:text-base text-white bg-[#1e002b]/30 rounded-xl p-4 md:p-6 border border-gray-700">
                          <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">
                            Getting Help
                          </h3>
                          <p className="text-gray-300 mb-4 text-sm md:text-base">
                            If you're still experiencing issues, try these resources:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <a
                              href="https://github.com/elite-tch/celokit-ai/issues"
                              className="bg-[#1e002b]/50 hover:bg-[#1e002b]/70 rounded-lg p-3 md:p-4 border border-gray-700 flex items-center space-x-3 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 md:w-5 md:h-5 text-[#ffff57] flex-shrink-0" />
                              <div className="min-w-0">
                                <h4 className="font-semibold text-white text-sm md:text-base">GitHub Issues</h4>
                                <p className="text-xs md:text-sm text-gray-400">Report bugs and request features</p>
                              </div>
                            </a>
                            <a
                              href="https://docs.celo.org"
                              className="bg-[#1e002b]/50 hover:bg-[#1e002b]/70 rounded-lg p-3 md:p-4 border border-gray-700 flex items-center space-x-3 transition-colors"
                            >
                              <Book className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                              <div className="min-w-0">
                                <h4 className="font-semibold text-sm md:text-base">Celo Documentation</h4>
                                <p className="text-xs md:text-sm text-gray-400">Learn about Celo blockchain</p>
                              </div>
                            </a>
                            <a
                              href="https://wagmi.sh"
                              className="bg-[#1e002b]/50 hover:bg-[#1e002b]/70 rounded-lg p-3 md:p-4 border border-gray-700 flex items-center space-x-3 transition-colors"
                            >
                              <Code className="w-4 h-4 md:w-5 md:h-5 text-blue-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <h4 className="font-semibold text-sm md:text-base">Wagmi Docs</h4>
                                <p className="text-xs md:text-sm text-gray-400">Underlying blockchain library</p>
                              </div>
                            </a>
                            <a
                              href="https://www.rainbowkit.com"
                              className="bg-[#1e002b]/50 hover:bg-[#1e002b]/70 rounded-lg p-3 md:p-4 border border-gray-700 flex items-center space-x-3 transition-colors"
                            >
                              <Wallet className="w-4 h-4 md:w-5 md:h-5 text-purple-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <h4 className="font-semibold text-sm md:text-base">RainbowKit Docs</h4>
                                <p className="text-xs md:text-sm text-gray-400">Wallet connection library</p>
                              </div>
                            </a>
                          </div>
                        </div>
                      </section>
                    )}
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-[#1e002b]/80 mt-3 border-t border-gray-700 py-6">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between  items-center">
                    <div className="flex flex-col">
              <Image src='/logo.png' alt='logo' width={100} height={100} className='w-33' />
            </div>
                        <div className="text-sm text-gray-400">
                           Alright Reserved © {new Date().getFullYear()} elite-tch
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CeloKitDocs;