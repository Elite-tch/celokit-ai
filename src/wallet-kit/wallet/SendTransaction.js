'use client'
import { useState } from 'react'
import { useAccount, useBalance, useSendTransaction } from 'wagmi'
import { toast } from 'react-hot-toast'
import { parseEther, formatEther } from 'viem'
import Modal from './Modal'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import './celokit-ui.css'

export default function SendTransaction() {
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const { sendTransactionAsync } = useSendTransaction()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isConnected) return toast.error('Please connect your wallet first')
    if (!amount || isNaN(amount)) return toast.error('Please enter a valid amount')
    if (!to || !to.startsWith('0x') || to.length !== 42) return toast.error('Please enter a valid recipient address')

    const amountInWei = parseEther(amount)

    if (balance?.value < amountInWei) {
      setModalContent({
        title: 'Insufficient Funds',
        description: `You only have ${formatEther(balance?.value)} CELO`,
        icon: <AlertCircle className="celokit-modal-icon" />,
        buttonText: 'OK',
        onButtonClick: () => setIsModalOpen(false),
      })
      return setIsModalOpen(true)
    }

    try {
      setIsLoading(true)
      const { hash } = await sendTransactionAsync({ to, value: amountInWei })

      setModalContent({
        title: 'Transaction Successful',
        description: `Transaction sent with hash: ${hash}`,
        icon: <CheckCircle2 className="celokit-modal-icon" />,
        buttonText: 'View on Explorer',
        onButtonClick: () => {
          window.open(`https://explorer.celo.org/tx/${hash}`, '_blank')
          setIsModalOpen(false)
        },
      })
      
      setTo('')
      setAmount('')
    } catch (error) {
      setModalContent({
        title: 'Transaction Failed',
        description: error?.message?.includes('insufficient funds')
          ? "You don't have enough CELO to complete this transaction"
          : error.message,
        icon: <AlertCircle className="celokit-modal-icon" />,
        buttonText: 'OK',
        onButtonClick: () => setIsModalOpen(false),
      })
    } finally {
      setIsLoading(false)
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="celokit-forms">
        <div className='account-info'>
        <h2 >Send Transaction</h2>
        </div>
        <div className="celokit-form">
        <div className="celokit-form-group">
          <label htmlFor="to" className="celokit-form-label">
            Recipient Address
          </label>
          <input
            id="to"
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="celokit-form-input "
            placeholder="0x..."
            required
          />
        </div>

        <div className="celokit-form-group" style={{ position: 'relative' }}>
          <label htmlFor="amount" className="celokit-form-label">
            Amount (CELO)
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.0001"
            min="0"
            className="celokit-form-input"
            placeholder="0.1"
            required
          />
          {balance && (
            <span className="celokit-balance">
              Balance: {formatEther(balance.value)}
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={!isConnected || isLoading}
          className="celokit-submit-btn"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Processing...
            </>
          ) : (
            'Send Transaction'
          )}
        </button>
        </div>

      
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        {...modalContent}
      />
    </>
  )
}