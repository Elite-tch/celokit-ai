// lib/celoKnowledge.js
export const celoKnowledgeBase = [
    {
      topic: "Celo Network Overview",
      content: `
      Celo is a mobile-first blockchain platform that makes financial tools accessible to anyone with a mobile phone. Key features:
      
      - Mobile-first design with lightweight clients
      - Stable value currencies (cUSD, cEUR, cREAL) backed by crypto collateral  
      - Carbon negative blockchain through offset purchases
      - Proof-of-Stake consensus with validator elections
      - EVM compatibility for easy Ethereum dApp porting
      - Gas fees payable in stable tokens, not just CELO
      - Account abstraction features for better UX
      
      Networks:
      - Mainnet: Chain ID 42220
      - Alfajores Testnet: Chain ID 44787
      `
    },
    {
      topic: "Celo Token Economics",
      content: `
      CELO Token (Native):
      - Used for governance, staking, and gas fees
      - Contract: Native token, no contract address needed
      
      cUSD (Celo Dollar):
      - Mainnet: 0x765DE816845861e75A25fCA122bb6898B8B1282a
      - Alfajores: 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
      
      cEUR (Celo Euro):
      - Mainnet: 0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73
      - Alfajores: 0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F
      
      cREAL (Celo Real):
      - Mainnet: 0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787
      `
    },
    {
      topic: "RainbowKit Celo Setup",
      content: `
      Configure RainbowKit for Celo networks:
      
      import { getDefaultConfig } from '@rainbow-me/rainbowkit';
      import { celo, celoAlfajores } from 'wagmi/chains';
      
      const config = getDefaultConfig({
        appName: 'My Celo App',
        projectId: 'YOUR_PROJECT_ID',
        chains: [celoAlfajores, celo],
        ssr: true,
      });
      
      Custom theme for Celo branding:
      <RainbowKitProvider
        theme={{
          accentColor: '#35D07F', // Celo green
          accentColorForeground: 'white',
          borderRadius: 'medium',
        }}
      >
      `
    },
    {
      topic: "Wagmi Celo Integration",
      content: `
      Key Wagmi hooks for Celo development:
      
      // Check balances
      const { data: celoBalance } = useBalance({ address, chainId: celo.id });
      const { data: cusdBalance } = useBalance({ 
        address, 
        token: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
        chainId: celo.id 
      });
      
      // Send transactions with stable token gas fees
      const { data: hash, writeContract } = useWriteContract();
      
      // Switch between Celo networks
      const { switchChain } = useSwitchChain();
      switchChain({ chainId: celoAlfajores.id });
      
      // Read contract data
      const { data } = useReadContract({
        address: '0x...',
        abi: contractAbi,
        functionName: 'balanceOf',
        args: [address],
        chainId: celo.id,
      });
      `
    },
    {
      topic: "Celo Smart Contract Development",
      content: `
      Celo-specific smart contract considerations:
      
      1. Gas fees can be paid in stable tokens:
         - Use feeCurrency parameter in transactions
         - Users can pay gas in cUSD instead of CELO
      
      2. Registry pattern for core contracts:
         - Access system contracts through Registry
         - Get token addresses dynamically
      
      3. Multi-token support:
         pragma solidity ^0.8.0;
         
         contract CeloExample {
             address constant CUSD = 0x765DE816845861e75A25fCA122bb6898B8B1282a;
             address constant CEUR = 0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73;
             
             function acceptMultipleTokens(address token, uint256 amount) external {
                 require(token == CUSD || token == CEUR, "Unsupported token");
                 IERC20(token).transferFrom(msg.sender, address(this), amount);
             }
         }
      `
    },
    {
      topic: "Celo DeFi Integration",
      content: `
      Popular Celo DeFi protocols:
      
      Ubeswap (DEX):
      - Router: 0xE3D8bd6Aed4F159bc8000a9cD47CffDb95F96121
      - Factory: 0x62d5b84bE28a183aBB507E125B384122D2C25fAE
      
      Moola Market (Lending):
      - Lending Pool: 0x970b12522CA9b4054807a2c5B736149a5BE6f670
      - Supports cUSD, cEUR, CELO lending/borrowing
      
      Savings Circles Pattern:
      - Community-based savings groups
      - Rotating payout system
      - Built-in governance mechanisms
      
      Example integration:
      contract SavingsCircle {
          IERC20 public immutable stableToken;
          mapping(address => uint256) public contributions;
          
          constructor(address _token) {
              stableToken = IERC20(_token);
          }
      }
      `
    },
    {
      topic: "Mobile-First Development",
      content: `
      Celo mobile development best practices:
      
      1. Progressive Web App (PWA) approach:
         - Responsive design for mobile screens
         - Offline functionality where possible
         - Fast loading times
      
      2. Valora wallet integration:
         - Deep linking support
         - WalletConnect for seamless connection
         - Mobile-optimized transaction flows
      
      3. Account abstraction features:
         - Social recovery mechanisms
         - Gasless transactions for user onboarding
         - Phone number-based addressing
      
      4. Data efficiency:
         - Minimize RPC calls
         - Cache frequently accessed data
         - Use GraphQL for complex queries
      
      Example mobile detection:
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
          // Optimize for mobile experience
          // Larger touch targets
          // Simplified UI
      }
      `
    },
    {
      topic: "Celo Testing and Deployment",
      content: `
      Celo testnet development workflow:
      
      1. Alfajores Testnet Setup:
         - Chain ID: 44787
         - RPC: https://alfajores-forno.celo-testnet.org
         - Faucet: https://faucet.celo.org
      
      2. Testing with Hardhat:
         networks: {
           alfajores: {
             url: "https://alfajores-forno.celo-testnet.org",
             accounts: [process.env.PRIVATE_KEY],
             chainId: 44787,
           },
           celo: {
             url: "https://forno.celo.org",
             accounts: [process.env.PRIVATE_KEY], 
             chainId: 42220,
           }
         }
      
      3. Verification on Celoscan:
         - Use @celo/hardhat-deploy-v2
         - Verify contracts on celoscan.io
      
      4. Frontend deployment:
         - Vercel/Netlify for static hosting
         - Configure environment variables
         - Test on both networks
      `
    }
  ];
  
  export const celoCodeExamples = {
    basicSetup: `// Basic Celo dApp setup
  import { ConnectButton } from '@rainbow-me/rainbowkit';
  import { useAccount, useBalance } from 'wagmi';
  import { celo } from 'viem/chains';
  
  export default function CeloDApp() {
    const { address, isConnected } = useAccount();
    const { data: balance } = useBalance({ 
      address, 
      chainId: celo.id 
    });
  
    return (
      <div>
        <ConnectButton />
        {isConnected && (
          <p>Balance: {balance?.formatted} CELO</p>
        )}
      </div>
    );
  }`,
  
    tokenTransfer: `// Transfer cUSD tokens
  import { useWriteContract } from 'wagmi';
  import { parseUnits } from 'viem';
  
  const CUSD_ADDRESS = '0x765DE816845861e75A25fCA122bb6898B8B1282a';
  
  export default function TransferCUSD() {
    const { writeContract } = useWriteContract();
  
    const transfer = () => {
      writeContract({
        address: CUSD_ADDRESS,
        abi: [{
          name: 'transfer',
          type: 'function',
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' }
          ],
          outputs: [{ name: '', type: 'bool' }]
        }],
        functionName: 'transfer',
        args: ['0x...', parseUnits('10', 18)]
      });
    };
  
    return <button onClick={transfer}>Send 10 cUSD</button>;
  }`,
  
    multiTokenBalance: `// Check multiple token balances
  import { useBalance } from 'wagmi';
  import { celo } from 'viem/chains';
  
  const tokens = {
    CUSD: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
    CEUR: '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73',
  };
  
  export default function MultiTokenBalance({ address }) {
    const celoBalance = useBalance({ address, chainId: celo.id });
    const cusdBalance = useBalance({ 
      address, 
      token: tokens.CUSD, 
      chainId: celo.id 
    });
    const ceurBalance = useBalance({ 
      address, 
      token: tokens.CEUR, 
      chainId: celo.id 
    });
  
    return (
      <div>
        <p>CELO: {celoBalance.data?.formatted || '0'}</p>
        <p>cUSD: {cusdBalance.data?.formatted || '0'}</p>
        <p>cEUR: {ceurBalance.data?.formatted || '0'}</p>
      </div>
    );
  }`
  };