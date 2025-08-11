'use client'
import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, Wallet, Zap, Code, MessageSquare, Mail, Twitter, Phone, Linkedin } from 'lucide-react';
import Link from 'next/link'
import Image from 'next/image';
import { ConnectButton } from '@/wallet-kit/lib';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const pathname = usePathname();
  
  const navigation = [
    { 
      name: 'Home', 
      href: '/', 
      description: 'Welcome to Celokit-Ai'
    },
    { 
      name: 'Docs', 
      href: '/celokit-wallet-docs', 
      description: 'Learn how to use Celokit-AI'
    },
    { 
      name: 'Demo', 
      href: '/celokit-wallet-demo', 
      description: 'Try Celokit-AI live'
    },
   
    { 
      name: 'Help & Support', 
      href: '#', 
      description: 'Get in touch with us',
      isContact: true
    }
  ];
  
  // Close dropdown when clicking outsidegiy 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isContactOpen && !event.target.closest('.contact-dropdown')) {
        setIsContactOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isContactOpen]);
  
  return (
    <>
      <nav className="fixed bg-[#1e002b] w-full md:sticky text-white top-0 z-50 transition-all md:px-8 px-4 py-2 duration-300">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex flex-col">
              <Image src='/logo.png' alt='logo' width={100} height={100} className='w-33' />
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              
              if (item.isContact) {
                return (
                  <div key={item.name} className="relative contact-dropdown">
                    <button
                      onClick={() => setIsContactOpen(!isContactOpen)}
                      className={`group capitalize relative flex items-center space-x-2 px-4 py-2 rounded-xl hover:text-celo-green dark:hover:text-celo-green transition-all duration-300 hover:bg-celo-green/5 dark:hover:bg-celo-green/10 ${isContactOpen ? 'text-celo-green' : ''}`}
                    >
                      <span className="font-medium">{item.name}</span>
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-[#1e002b] text-xs px-2 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                        {item.description}
                      </div>
                    </button>
                    
                    {isContactOpen && (
                      <div className="absolute right-0 mt-2 w-56 origin-top-right bg-[#2a003b] divide-y divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                        <div className="px-4 py-3">
                          <p className="text-sm text-gray-300">Connect with us</p>
                        </div>
                        <div className="py-1">
                          <a href="mailto:izuchukwujohnbosco95@gmail.com" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#3a004b] hover:text-white">
                            <Mail className="w-4 h-4 mr-3" />
                            Email
                          </a>
                          <a href="https://x.com/IzuchukwuJ99034?t=FUnrvJlLf4cQFTd6upkZHg&s=09" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#3a004b] hover:text-white">
                            <Twitter className="w-4 h-4 mr-3" />
                            Twitter
                          </a>
                          <a href="tel:+2349135537940" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#3a004b] hover:text-white">
                            <Phone className="w-4 h-4 mr-3" />
                            Phone
                          </a>
                          <a href="https://www.linkedin.com/in/izuchukwu-johnbosco-a29663360?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#3a004b] hover:text-white">
                            <Linkedin className="w-4 h-4 mr-3" />
                            LinkedIn
                          </a>
                          <a href="https://discord.gg/elite_95" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#3a004b] hover:text-white">
                            <MessageSquare className="w-4 h-4 mr-3" />
                            Discord
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group capitalize relative flex items-center space-x-2 px-4 py-2 rounded-xl hover:text-celo-green dark:hover:text-celo-green transition-all duration-300 hover:bg-celo-green/5 dark:hover:bg-celo-green/10 ${isActive ? 'text-[#ffff57]' : ''}`}
                >
                  <span className="font-medium">{item.name}</span>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-[#1e002b] text-xs px-2 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {item.description}
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden lg:block">
              <ConnectButton/>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="w-8 h-8 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-8 h-8 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
       
        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all capitalize duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 bg-[#1e002b] backdrop-blur-md">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                
                if (item.isContact) {
                  return (
                    <div key={item.name} className="contact-dropdown">
                      <button
                        onClick={() => setIsContactOpen(!isContactOpen)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-left ${isContactOpen ? 'text-celo-green' : 'text-gray-300'}`}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {item.description}
                          </span>
                        </div>
                      </button>
                      
                      {isContactOpen && (
                        <div className="mt-2 ml-4 space-y-2">
                          <a href="mailto:izuchukwujohnbosco95@gmail.com" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#3a004b] rounded">
                            <Mail className="w-4 h-4 mr-3" />
                            Email
                          </a>
                          <a href="https://x.com/IzuchukwuJ99034?t=FUnrvJlLf4cQFTd6upkZHg&s=09" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#3a004b] rounded">
                            <Twitter className="w-4 h-4 mr-3" />
                            Twitter
                          </a>
                          <a href="tel:+2349135537940" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#3a004b] rounded">
                            <Phone className="w-4 h-4 mr-3" />
                            Phone
                          </a>
                          <a href="https://www.linkedin.com/in/izuchukwu-johnbosco-a29663360?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#3a004b] rounded">
                            <Linkedin className="w-4 h-4 mr-3" />
                            LinkedIn
                          </a>
                          <a href="https://discord.gg/elite_95" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#3a004b] rounded">
                            <MessageSquare className="w-4 h-4 mr-3" />
                            Discord
                          </a>
                        </div>
                      )}
                    </div>
                  );
                }
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 capitalize px-4 py-3 rounded-xl ${isActive ? 'text-[#ffff57]' : 'text-gray-300'}`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.description}
                      </span>
                    </div>
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <ConnectButton/>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}