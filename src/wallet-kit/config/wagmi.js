'use client'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { celo, celoAlfajores } from 'viem/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { http } from 'viem'

// First validate the projectId
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID 
if (!projectId) {
  throw new Error(
    'Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID env variable.\n' +
    'Get one at https://cloud.walletconnect.com'
  )
}

export const config = getDefaultConfig({
  appName: 'CeloKit AI',
  projectId: projectId, // Use the validated variable
  chains: [celoAlfajores, celo],
  ssr: false,
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http()
  }
})

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