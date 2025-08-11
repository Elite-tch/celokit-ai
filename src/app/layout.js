import './globals.css'
import { Inter } from 'next/font/google'
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from '@/wallet-kit/config/wagmi';
import FloatingChatButton from '@/components/chat/FloatingChatButton.';


import { Navbar } from '@/components/landingpage/Header';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CeloKit AI - Your Celo Development Companion',
  description: 'Intelligent assistant for Celo blockchain development with code generation, tutorials, and expert guidance.',
  keywords: 'Celo, blockchain, development, AI, smart contracts, dApp, Web3',
  authors: [{ name: 'CeloKit Team' }],
  openGraph: {
    title: 'CeloKit AI - Your Celo Development Companion',
    description: 'Build on Celo with AI-powered code generation and expert guidance',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CeloKit AI',
    description: 'Build on Celo with AI-powered development tools',
  },

}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
     
            
      <body className={inter.className}>
      
      
          <Providers>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main className="container mx-auto">
                {children}
              </main>
              <FloatingChatButton/>
            </div>
          </Providers>
         
      
      </body>

     
    </html>
  )
}