'use client'
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Code, 
  Zap, 
  ArrowRight, 
  CheckCircle,
  Sparkles,
  Terminal,
  Wallet,
  FileCode,
  Play,
  Download
} from 'lucide-react';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const steps = [
    {
      id: 1,
      title: "Describe Your Goal",
      description: "Tell CeloKit AI what you want to build — from connecting a wallet to sending cUSD. Our AI understands both natural language and Celo-specific terms.",
      icon: MessageSquare,
      color: "from-green-500 to-green-600",
      demo: {
        type: "chat",
        content: "I want to connect Valora and send 5 cUSD to a user"
      }
    },
    {
      id: 2,
      title: "AI Plans Your Integration",
      description: "CeloKit AI reviews your request, checks Celo SDK best practices, and creates a step-by-step plan with security and optimization in mind.",
      icon: Sparkles,
      color: "from-purple-500 to-purple-600",
      demo: {
        type: "thinking",
        content: "Preparing wallet connect module... Adding send function with cUSD decimals..."
      }
    },
    {
      id: 3,
      title: "Get Instant Code",
      description: "Receive production-ready code snippets tailored to your request. Includes wallet connection, balance checks, transaction sending, and error handling.",
      icon: Code,
      color: "from-green-500 to-green-600",
      demo: {
        type: "code",
        content: `import { newKit } from '@celo/contractkit'

const sendCUSD = async (to, amount) => {
  const kit = newKit('https://alfajores-forno.celo-testnet.org')
  const stableToken = await kit.contracts.getStableToken()
  const tx = await stableToken.transfer(to, amount)
  return await kit.sendTransactionObject(tx)
}`
      }
    },
    {
      id: 4,
      title: "Deploy & Test on Celo",
      description: "Run the code instantly in testnet, verify balances, and deploy confidently to mainnet — all guided by CeloKit AI.",
      icon: Zap,
      color: "from-purple-500 to-purple-600",
      demo: {
        type: "deploy",
        content: "✅ Wallet connected • ✅ Balance checked • 🚀 Transaction sent"
      }
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const StepDemo = ({ step }) => {
    const { demo } = step;
    
    if (demo.type === 'chat') {
      return (
        <div className=" bg-gray-900 md:text-base text-sm rounded-2xl p-6 shadow-xl border border-blue-500/20 md:h-64">
          <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <MessageSquare className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-gray-900 dark:text-white">Ask CeloKit AI</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-end">
              <div className="bg-green-500 text-white px-4 py-3 rounded-2xl max-w-xs">
                {demo.content}
              </div>
            </div>
            <div className="flex justify-start">
              <div className="border border-gray-800  text-white px-4 py-3 rounded-2xl max-w-xs">
                I'll create a secure wallet connection and transaction function for you...
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (demo.type === 'thinking') {
      return (
        <div className="bg-gradient-to-br from-purple-50 md:text-base text-sm to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 shadow-xl border border-purple-200 dark:border-purple-700 md:h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Sparkles className="w-8 h-8 text-purple-100" />
            </div>
            <div className="text-gray-700 dark:text-gray-300 font-medium mb-2">AI Planning</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{demo.content}</div>
            <div className="flex justify-center space-x-1 mt-4">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      );
    }
    
    if (demo.type === 'code') {
      return (
        <div className="bg-gray-900 rounded-2xl md:text-base p-6 shadow-xl border border-blue-500/20 md:h-64  font-mono text-sm">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-gray-400 ml-4">celo-transaction.js</span>
          </div>
          <div className="text-green-400 whitespace-pre-wrap leading-relaxed">
            {demo.content}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-400">Generated in 1.8s</div>
            <button className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1">
              <FileCode className="w-3 h-3" />
              <span>Copy Code</span>
            </button>
          </div>
        </div>
      );
    }
    
    if (demo.type === 'deploy') {
      return (
        <div className="bg-gradient-to-br md:text-base text-sm from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 shadow-xl border border-purple-200 dark:border-purple-700 md:h-64">
          <div className="flex items-center space-x-2 mb-6">
            <Terminal className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-900 dark:text-white">Deployment Status</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-900 dark:text-white font-medium">Wallet Connected</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-900 dark:text-white font-medium">Transaction Verified</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-xl">
              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-900 dark:text-white font-medium">Deploying to Mainnet</span>
            </div>
          </div>
          <button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
            <Play className="w-4 h-4" />
            <span>Deploy with CeloKit</span>
          </button>
        </div>
      );
    }
  };

  return (
    <section ref={sectionRef} className="py-10  relative overflow-hidden">
     

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-full px-4 py-2 text-sm font-medium text-green-700 dark:text-green-400 mb-6">
            <Zap className="w-4 h-4" />
            <span>How CeloKit AI Works</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl  font-black md:leading-20 text-gray-900 dark:text-white mb-6">
            Build Celo dApps{' '}
            <span className="bg-gradient-to-r from-green-600 to-[#ffff57] bg-clip-text text-transparent">
              Smarter
            </span>
            <br />with AI Assistance
          </h2>
          
          <p className="md:text-lg text-sm text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            CeloKit AI is your all-in-one toolkit to connect wallets, check balances, send transactions, and deploy  with AI-powered code generation and guidance.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-enter">
            <div className={`transition-all duration-700  ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="mb-4">
                <div className={`inline-flex items-center space-x-2 bg-gradient-to-r ${steps[activeStep].color} text-white px-4 py-2 rounded-full text-sm font-medium mb-4`}>
                  <span>Step {steps[activeStep].id}</span>
                </div>
              </div>
              
              <h3 className="text-2xl lg:text-4xl text-left font-bold text-gray-900 dark:text-white mb-2 md:mb-6">
                {steps[activeStep].title}
              </h3>
              
              <p className="md:text-lg text-sm text-gray-600 text-left dark:text-gray-300 leading-relaxed mb-8">
                {steps[activeStep].description}
              </p>

              <div className="space-y-3">
                {activeStep === 0 && [
                  "Understands wallet & token terms",
                  "Supports Valora, MetaMask, and more",
                  "Context-aware developer replies"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 md:text-base text-sm dark:text-gray-300">{feature}</span>
                  </div>
                ))}
                
                {activeStep === 1 && [
                  "Follows Celo SDK best practices",
                  "Security-first architecture",
                  "Optimized for cUSD & CELO"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700 md:text-base text-sm dark:text-gray-300">{feature}</span>
                  </div>
                ))}
                
                {activeStep === 2 && [
                  "Ready-to-use code snippets",
                  "Error handling built-in",
                  "Testnet & mainnet compatible"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700 md:text-base text-sm dark:text-gray-300">{feature}</span>
                  </div>
                ))}
                
                {activeStep === 3 && [
                  "One-click deploy",
                  "Live transaction feedback",
                  "Mainnet-ready output"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700 md:text-base text-sm dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="relative">
                <div className={`absolute -inset-4 bg-gradient-to-r ${steps[activeStep].color} opacity-20 rounded-3xl blur-xl transition-all duration-500`}></div>
                <div className="relative">
                  <StepDemo step={steps[activeStep]} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-3 mt-16">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeStep 
                    ? 'bg-green-500 scale-150' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        
      </div>

      <style jsx global>{`
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </section>
  );
};

export default HowItWorks;
