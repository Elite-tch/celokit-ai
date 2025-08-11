'use client'
import { useSwitchChain, useChainId } from 'wagmi'
import { celo, celoAlfajores } from 'viem/chains'
import './celokit-ui.css'
import { useAccount, useBalance } from 'wagmi'
export default function NetworkSwitcher() {
  const chainId = useChainId()
  const { switchChain, isPending, pendingChainId, error } = useSwitchChain()
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  return (
    <div className="celokit-network-switcher">
<div className=" account-info">
            <h2 >Account Info</h2>
            <p className='address'>Address: {address}</p>
            <p >
              Balance: {balance?.formatted} {balance?.symbol}
            </p>
          </div>
      <div className="celokit-network-buttons">
        <button
          onClick={() => switchChain?.({ chainId: celo.id })}
          disabled={!switchChain || chainId === celo.id}
          className={`celokit-network-btn ${
            chainId === celo.id 
              ? 'celokit-network-btn-primary' 
              : 'celokit-network-btn-secondary'
          }`}
        >
          Celo Mainnet
        </button>

        <button
          onClick={() => switchChain?.({ chainId: celoAlfajores.id })}
          disabled={!switchChain || chainId === celoAlfajores.id}
          className={`celokit-network-btn ${
            chainId === celoAlfajores.id 
              ? 'celokit-network-btn-primary' 
              : 'celokit-network-btn-secondary'
          }`}
        >
          Alfajores Testnet
        </button>
      </div>

      {isPending && (
        <div className="celokit-status-message celokit-status-loading">
          Switching network...
        </div>
      )}
      {error && (
        <div className="celokit-status-message celokit-status-error">
          {error.message}
        </div>
      )}
    </div>
  )
}