# CeloKit-AI 🚀

*AI-powered Celo blockchain development toolkit*

## Features
- 🔌 One-click wallet connection
- 🌐 Celo Mainnet & Alfajores support
- 💸 Send transactions with built-in modals
- 🤖 AI-assisted code generation

## Installation

```bash
npm install celokit-ai @rainbow-me/rainbowkit wagmi viem
# or
yarn add celokit-ai @rainbow-me/rainbowkit wagmi viem
Quick Start
1. Setup Providers (Layout Wrapper)
Create app/providers.js:

jsx
// app/providers.js
'use client'
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
}
Wrap your app in layout.js:

jsx
import { Providers } from './providers'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
2. Use Components
jsx
import { 
  ConnectButton,
  NetworkSwitcher,
  SendTransaction
} from 'celokit-ai'

function HomePage() {
  return (
    <div className="container">
      <ConnectButton />
      <NetworkSwitcher />
      <SendTransaction />
    </div>
  )
}
Component API
ConnectButton
jsx
<ConnectButton 
  showBalance={true} 
  accountStatus="full" 
  chainStatus="icon"
/>
NetworkSwitcher
jsx
<NetworkSwitcher 
  allowedChains={['celo', 'celoAlfajores']}
/>
SendTransaction
jsx
<SendTransaction
  defaultToken="CELO"
  receiver="0x..." // Optional
  amount={0.1}     // Optional
/>
Advanced Usage
Custom Styling
Add Tailwind classes or CSS overrides:

jsx
<ConnectButton className="bg-celo-green text-white px-4 py-2 rounded-lg" />
Standalone Usage (Non-Next.js)
jsx
import { createConfig } from 'celokit-ai/config'

const wagmiConfig = createConfig({
  projectId: 'your-walletconnect-id' 
})
Troubleshooting
Q: Getting wallet connection errors?
→ Verify your WalletConnect Project ID is set in .env:

env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
Q: Transactions failing?
→ Ensure you're on the correct network (use <NetworkSwitcher>)

License
MIT © elite-tch 2025

t