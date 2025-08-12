'use client'

import { useAccount } from 'wagmi'
import SendTransaction from '../../wallet-kit/wallet/SendTransaction'
import NetworkSwitcher from '../../wallet-kit/wallet/NetworkSwitcher'
import HowItWorks from '@/components/landingpage/HowItWork'
import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { ConnectButton } from '@/wallet-kit/lib'

export default function WalletPage() {
  const { isConnected } = useAccount()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (isConnected) {
      setShowModal(false) // Hide modal if connected
      return
    }

    // Show modal immediately
    setShowModal(true)

    // Auto-reopen modal every 20 seconds if still disconnected
    const interval = setInterval(() => {
      if (!isConnected) {
        setShowModal(true)
      }
    }, 20000) // 20,000ms = 20s

    return () => clearInterval(interval) // Cleanup
  }, [isConnected])

  return (
    <div className="text-white bg-[#1e002b] min-h-screen p-4">
      
      {isConnected ? (
        <div className="md:w-[70%] w-full  mx-auto space-y-6 py-8">
          <div className='mb-3'>
          <NetworkSwitcher />
          </div>
          <SendTransaction />
        </div>
      ) : (
        <>
        
          <Dialog
            open={showModal}
            onClose={() => setShowModal(false)}
            className="relative z-50 py-10"
          >
            <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center  p-4">
            <Dialog.Panel className="w-full max-w-md rounded-lg bg-[#ffff57] p-6 border ">
            <Dialog.Title className="text-xl md:text-2xl text-center font-semibold mb-3 pt-6 text-black">
  Connect Your Wallet
</Dialog.Title>
<div className="space-y-4 text-center  text-gray-900 ">
  <p>
    Please connect your wallet to access the wallet connection demo.
  </p>
</div>

  <div className="my-6 flex md:flex-row gap-4 flex-col justify-between">
    <button
      onClick={() => setShowModal(false)}
      className="px-4 py-3 text-sm border bg-[#1e002b] text-white rounded-full  transition-colors"
    >
      Learn More First
    </button>
   <div className="border border-[#1e002b] px-3  flex items-center justify-center py-2 rounded-full"> <ConnectButton/>
   </div>
  </div>
</Dialog.Panel>
            </div>
          </Dialog>

          {/* ===== HOW IT WORKS ===== */}
          <div className="max-w-6xl mx-auto py-8">
            <HowItWorks />
          </div>
        </>
      )}
    </div>
  )
}