// lib/codeTemplates.js
export const celoTemplates = {
    walletConnect: `// Basic RainbowKit + Wagmi setup for Celo
  import '@rainbow-me/rainbowkit/styles.css';
  import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
  import { WagmiProvider } from 'wagmi';
  import { celo, celoAlfajores } from 'wagmi/chains';
  import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
  
  const config = getDefaultConfig({
    appName: 'CeloKit App',
    projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
    chains: [celo, celoAlfajores],
    ssr: true,
  });
  
  const queryClient = new QueryClient();
  
  export default function App({ Component, pageProps }) {
    return (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    );
  }`,
  
    walletConnection: `// Wallet connection component
  import { ConnectButton } from '@rainbow-me/rainbowkit';
  import { useAccount, useBalance, useDisconnect } from 'wagmi';
  
  export default function WalletConnection() {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    
    const { data: celoBalance } = useBalance({
      address: address,
      token: undefined, // Native CELO
    });
    
    const { data: cusdBalance } = useBalance({
      address: address,
      token: '0x765DE816845861e75A25fCA122bb6898B8B1282a', // cUSD on mainnet
    });
  
    if (isConnected) {
      return (
        <div className="p-4 border rounded-lg">
          <p className="mb-2">Connected: {address}</p>
          <p className="mb-2">CELO: {celoBalance?.formatted || '0'}</p>
          <p className="mb-4">cUSD: {cusdBalance?.formatted || '0'}</p>
          <button 
            onClick={() => disconnect()}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Disconnect
          </button>
        </div>
      );
    }
  
    return <ConnectButton />;
  }`,
  
    sendCUSD: `// Send cUSD transaction
  import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
  import { parseUnits } from 'viem';
  import { useState } from 'react';
  
  const CUSD_ADDRESS = '0x765DE816845861e75A25fCA122bb6898B8B1282a'; // Celo mainnet
  
  export default function SendCUSD() {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    
    const { data: hash, writeContract, error, isPending } = useWriteContract();
    
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
      hash,
    });
  
    const sendTransaction = async () => {
      try {
        writeContract({
          address: CUSD_ADDRESS,
          abi: [
            {
              name: 'transfer',
              type: 'function',
              stateMutability: 'nonpayable',
              inputs: [
                { name: 'to', type: 'address' },
                { name: 'amount', type: 'uint256' },
              ],
              outputs: [{ name: '', type: 'bool' }],
            },
          ],
          functionName: 'transfer',
          args: [recipient, parseUnits(amount, 18)],
        });
      } catch (err) {
        console.error('Transaction error:', err);
      }
    };
  
    return (
      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Send cUSD</h2>
        
        <input
          type="text"
          placeholder="Recipient address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        
        <button
          onClick={sendTransaction}
          disabled={isPending || isConfirming || !recipient || !amount}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {isPending ? 'Preparing...' : isConfirming ? 'Confirming...' : 'Send cUSD'}
        </button>
        
        {hash && (
          <p className="mt-4 text-sm break-all">
            Transaction Hash: {hash}
          </p>
        )}
        
        {isSuccess && (
          <p className="mt-2 text-green-600">Transaction successful!</p>
        )}
        
        {error && (
          <p className="mt-2 text-red-600">
            Error: {error.shortMessage || error.message}
          </p>
        )}
      </div>
    );
  }`,
  
    celoContract: `// Basic Celo smart contract
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;
  
  import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
  import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
  import "@openzeppelin/contracts/access/Ownable.sol";
  
  contract CeloSavingsCircle is ReentrancyGuard, Ownable {
      IERC20 public immutable cUSD;
      
      struct Circle {
          uint256 id;
          address[] members;
          uint256 contributionAmount;
          uint256 duration; // in seconds
          uint256 startTime;
          uint256 currentRound;
          bool active;
          mapping(address => bool) hasPaid;
          mapping(uint256 => address) roundWinner;
      }
      
      mapping(uint256 => Circle) public circles;
      uint256 public circleCounter;
      
      event CircleCreated(uint256 indexed circleId, address creator, uint256 contributionAmount);
      event MemberJoined(uint256 indexed circleId, address member);
      event ContributionMade(uint256 indexed circleId, address member, uint256 amount);
      
      constructor(address _cUSD) {
          cUSD = IERC20(_cUSD);
      }
      
      function createCircle(
          uint256 _contributionAmount,
          uint256 _duration
      ) external returns (uint256) {
          circleCounter++;
          Circle storage newCircle = circles[circleCounter];
          
          newCircle.id = circleCounter;
          newCircle.contributionAmount = _contributionAmount;
          newCircle.duration = _duration;
          newCircle.startTime = block.timestamp;
          newCircle.active = true;
          
          newCircle.members.push(msg.sender);
          
          emit CircleCreated(circleCounter, msg.sender, _contributionAmount);
          return circleCounter;
      }
      
      function joinCircle(uint256 _circleId) external {
          Circle storage circle = circles[_circleId];
          require(circle.active, "Circle not active");
          require(circle.members.length < 10, "Circle full");
          
          // Check if already a member
          for (uint i = 0; i < circle.members.length; i++) {
              require(circle.members[i] != msg.sender, "Already a member");
          }
          
          circle.members.push(msg.sender);
          emit MemberJoined(_circleId, msg.sender);
      }
      
      function makeContribution(uint256 _circleId) external nonReentrant {
          Circle storage circle = circles[_circleId];
          require(circle.active, "Circle not active");
          require(!circle.hasPaid[msg.sender], "Already paid this round");
          
          // Verify membership
          bool isMember = false;
          for (uint i = 0; i < circle.members.length; i++) {
              if (circle.members[i] == msg.sender) {
                  isMember = true;
                  break;
              }
          }
          require(isMember, "Not a member");
          
          require(
              cUSD.transferFrom(msg.sender, address(this), circle.contributionAmount),
              "Transfer failed"
          );
          
          circle.hasPaid[msg.sender] = true;
          emit ContributionMade(_circleId, msg.sender, circle.contributionAmount);
      }
  }`,
  
    nextjsSetup: `// Complete Next.js app setup with RainbowKit and Celo
  // pages/_app.js
  import '../styles/globals.css';
  import '@rainbow-me/rainbowkit/styles.css';
  import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
  import { WagmiProvider } from 'wagmi';
  import { celo, celoAlfajores } from 'wagmi/chains';
  import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
  
  const config = getDefaultConfig({
    appName: 'CeloKit AI',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    chains: [celoAlfajores, celo],
    ssr: true,
  });
  
  const queryClient = new QueryClient();
  
  export default function App({ Component, pageProps }) {
    return (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            theme={{
              accentColor: '#35D07F', // Celo green
              accentColorForeground: 'white',
            }}
          >
            <Component {...pageProps} />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    );
  }
  
  // pages/index.js
  import { ConnectButton } from '@rainbow-me/rainbowkit';
  import { useAccount } from 'wagmi';
  import WalletConnection from '../components/WalletConnection';
  
  export default function Home() {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="p-4 bg-white shadow">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">CeloKit AI</h1>
            <ConnectButton />
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto p-4">
          <WalletConnection />
        </main>
      </div>
    );
  }`
  };