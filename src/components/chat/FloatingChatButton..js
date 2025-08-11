// components/FloatingChatButton.js
'use client';
import { useState } from 'react';
import {  Bot, X, Minimize2, Menu } from 'lucide-react';
import ChatInterface from './ChatInterface';

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
        className="fixed bottom-8 md:bottom-16 md:right-16 right-8 z-50 w-16 h-16 bg-gradient-to-r from-green-600 to-[#ffff57] hover:from-[#ffff57] hover:to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center group"
        >
          < Bot size={35} />
          
          {/* Tooltip */}
          <div className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-white text-[#1e002b] text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Ask CeloKit-AI
          </div>
          
          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25"></div>
        </button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 ease-in-out ${
            isMinimized 
              ? 'bottom-8 right-6 w-80 h-16' 
              : 'md:bottom-3 bottom-0 right-0 md:right-3 w-full h-full md:w-[65%] md:h-[500px]'
          }`}
        >
          <div className="bg-[#1e002b]  w-full md:rounded-lg shadow-2xl border border-gray-800 h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-[#1e002b] border-b w-full border-gray-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Sidebar Toggle Button */}
                <button
                  onClick={handleToggleSidebar}
                  className="text-white/80 hover:text-white p-1 rounded transition-colors"
                  title="Toggle chat history"
                >
                  <Menu size={24} />
                </button>
                
               
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/80 hover:text-white p-1 rounded transition-colors"
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  <Minimize2 size={16} />
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowSidebar(false);
                  }}
                  className="text-white/80 hover:text-white p-1 rounded transition-colors"
                  title="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <div className="flex-1 overflow-hidden">
                <ChatInterface 
                  showSidebar={showSidebar}
                  onToggleSidebar={handleToggleSidebar}
                />
              </div>
            )}
            
            {/* Minimized State */}
            {isMinimized && (
              <div className="flex-1 flex items-center justify-between px-4">
                <span className="text-gray-600 text-sm">Chat minimized - click to expand</span>
                <button
                  onClick={handleToggleSidebar}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors"
                  title="Toggle chat history"
                >
                  <Menu size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}