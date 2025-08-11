// components/ChatInterface.js
'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, Code, FileText } from 'lucide-react';
import MessageBubble from './MessageBubble';
import ChatHistorySidebar from './ChatHistorySidebar';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function ChatInterface({ showSidebar = false, onToggleSidebar }) {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('celokit-chat-history');
      const savedChats = saved ? JSON.parse(saved) : [];
      setChats(savedChats);
  
      if (savedChats.length > 0 && !currentChat) {
        setCurrentChat(savedChats[0].id);
        setMessages(savedChats[0].messages);
        setFirstMessageSent(savedChats[0].messages.length > 0);
      }
    } catch (err) {
      console.error("Failed to parse chat history:", err);
      setChats([]);
    }
  }, []);

  // Save chats to localStorage
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('celokit-chat-history', JSON.stringify(chats));
    }
  }, [chats]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const createNewChat = () => {
    const newChat = {
      id: uuidv4(),
      title: 'New Chat',
      topic: 'General',
      createdAt: new Date().toISOString(),
      messages: []
    };
    
    setChats(prev => [newChat, ...prev]);
    setCurrentChat(newChat.id);
    setMessages([]);
    setInput('');
    setFirstMessageSent(false);
  };

  const selectChat = (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chatId);
      setMessages(chat.messages);
      setFirstMessageSent(chat.messages.length > 0);
      setInput('');
    }
  };

  const deleteChat = (chatId) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChat === chatId) {
      if (chats.length > 1) {
        const remainingChats = chats.filter(chat => chat.id !== chatId);
        selectChat(remainingChats[0].id);
      } else {
        createNewChat();
      }
    }
  };

  const extractTopic = (message) => {
    const topicMatch = message.match(/##\s*(.*?)\n|###\s*(.*?)\n/);
    return topicMatch ? (topicMatch[1] || topicMatch[2]) : null;
  };

  const generateChatTitle = (userMessage) => {
    return userMessage.length > 30 
      ? `${userMessage.substring(0, 30)}...` 
      : userMessage;
  };

  const generateFollowUpQuestions = (userQuery, aiResponse) => {
    // Generate contextual follow-up questions based on the conversation
    const followUps = [];
    const query = userQuery.toLowerCase();
    const response = aiResponse.toLowerCase();
    
    // Wallet connection related
    if (query.includes('wallet') || query.includes('connect')) {
      followUps.push(
        "How do I handle wallet disconnection?",
        "What wallets are supported on Celo?",
        "How to check if wallet is connected?",
        "How to switch networks in the wallet?"
      );
    }
    // Transaction related
    else if (query.includes('transaction') || query.includes('send') || response.includes('transaction')) {
      followUps.push(
        "How to estimate gas fees for this transaction?",
        "How to handle transaction failures?",
        "Can I batch multiple transactions?",
        "How to track transaction status?"
      );
    }
    // Smart contract related
    else if (query.includes('contract') || query.includes('smart') || response.includes('contract')) {
      followUps.push(
        "How to deploy this contract to mainnet?",
        "How to verify the contract on explorer?",
        "What are the gas costs for deployment?",
        "How to interact with the contract from frontend?"
      );
    }
    // Token/balance related
    else if (query.includes('balance') || query.includes('token') || query.includes('cusd') || query.includes('celo')) {
      followUps.push(
        "How to format token amounts for display?",
        "How to handle different token decimals?",
        "How to get historical token prices?",
        "How to swap between CELO and cUSD?"
      );
    }
    // Development/coding related
    else if (query.includes('code') || query.includes('implement') || response.includes('function')) {
      followUps.push(
        "How to test this code?",
        "What are the best practices here?",
        "How to handle errors in this implementation?",
        "Can you show a complete example?"
      );
    }
    // General fallback questions
    else {
      followUps.push(
        "Can you show me a code example?",
        "What are the best practices for this?",
        "How does this work on Celo mainnet?",
        "Are there any security considerations?"
      );
    }
    
    // Return 3-4 random questions from the relevant set
    return followUps.slice(0, 4);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Create new chat if none exists
    if (!currentChat) {
      createNewChat();
      // Wait for the chat to be created before continuing
      setTimeout(() => sendMessage(), 100);
      return;
    }

    const userMessage = {
      id: uuidv4(),
      content: input.trim(),
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setFirstMessageSent(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          chatId: currentChat,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const aiMessage = {
        id: uuidv4(),
        content: data.message,
        isUser: false,
        timestamp: new Date().toISOString(),
        hasContext: data.hasContext || false,
        followUpQuestions: generateFollowUpQuestions(userMessage.content, data.message),
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update chat history
      setChats(prev => prev.map(chat => {
        if (chat.id === currentChat) {
          const isFirstMessage = chat.messages.length === 0;
          const topic = isFirstMessage 
            ? extractTopic(data.message) || 'General'
            : chat.topic;
            
          return {
            ...chat,
            title: isFirstMessage 
              ? generateChatTitle(userMessage.content)
              : chat.title,
            topic,
            messages: [...chat.messages, userMessage, aiMessage],
            updatedAt: new Date().toISOString()
          };
        }
        return chat;
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      
      const errorMessage = {
        id: uuidv4(),
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    {
      icon: <Code size={16} />,
      text: "How do I connect a wallet to Celo?",
      prompt: "Show me how to connect a wallet to the Celo blockchain using RainbowKit and Wagmi"
    },
    {
      icon: <FileText size={16} />,
      text: "Send cUSD transaction",
      prompt: "Generate code to send a cUSD transaction on Celo mainnet"
    },
    {
      icon: <Sparkles size={16} />,
      text: "Create a savings circle contract",
      prompt: "Help me create a smart contract for a Celo savings circle with multiple participants"
    },
    {
      icon: <Code size={16} />,
      text: "Check token balances",
      prompt: "Show me how to check CELO and cUSD balances for a connected wallet"
    }
  ];

  return (
    <div className="h-full flex bg-[#1e002b] w-full text-amber-50 relative overflow-hidden">
      {/* Sidebar - only show when showSidebar is true */}
      {showSidebar && (
        <>
          {/* Overlay for mobile */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onToggleSidebar}
          />
          
          {/* Sidebar */}
          <div className="fixed left-0 top-0 h-full z-50 lg:relative lg:z-auto">
            <ChatHistorySidebar
              chats={chats}
              currentChatId={currentChat}
              onSelectChat={selectChat}
              onCreateNew={createNewChat}
              onDeleteChat={deleteChat}
            />
          </div>
        </>
      )}
      
      <div className="flex-1 flex flex-col min-h-0 w-full">
        {/* Welcome Screen */}
        {!firstMessageSent && (
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-y-auto">
            <div className="rounded-full flex items-center justify-center mb-4">
              <Image 
                src='/logo.png' 
                alt='logo' 
                width={140} 
                height={140} 
                className="sm:w-[160px] sm:h-[160px] lg:w-[180px] lg:h-[60px]"
              />
            </div>
            
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">
              Welcome to CeloKit AI
            </h2>
            
            <p className="text-md sm:text-sm lg:text-md mb-6 max-w-md mx-auto">
              Your intelligent assistant for Celo blockchain development. Ask me anything about building dApps on Celo!
            </p>

            {/* Quick Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl px-2">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInput(prompt.prompt)}
                  className="flex items-center gap-3 p-3 sm:p-4 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 transition-colors group"
                >
                  <div className="text-green-600 group-hover:text-green-700 flex-shrink-0">
                    {prompt.icon}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700 group-hover:text-gray-800 leading-tight">
                    {prompt.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {firstMessageSent && (
          <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-4 min-h-0">
            {messages.map((message, index) => (
              <div key={message.id}>
                <MessageBubble
                  message={message.content}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
                
                {/* Follow-up Questions - only show for AI messages */}
                {!message.isUser && message.followUpQuestions && message.followUpQuestions.length > 0 && (
                  <div className="mt-3 ml-2 sm:ml-11 flex flex-col justify-center items-center">
                    <p className="text-xs mb-4">💡 Suggested questions:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 justify-center items-center ">
                      {message.followUpQuestions.map((question, qIndex) => (
                        <button
                          key={qIndex}
                          onClick={() => setInput(question)}
                          className="text-left p-2 text-xs bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors text-green-800 hover:text-green-900 w-fit max-w-full"
                        >
                          <span className="block truncate sm:whitespace-normal">
                            {question}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 mb-4 px-2">
                <div className="w-8 h-8 rounded-full bg-[#ffff57] flex items-center justify-center flex-shrink-0">
                  <Loader2 size={16} className="text-black animate-spin" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm">CeloKit AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 sm:p-4 bg-[#1e002b] border-t border-gray-800 flex-shrink-0">
          <div className="flex gap-2 items-center sm:gap-3 items-en max-w-full">
            <div className="flex-1 relative min-w-0">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={firstMessageSent ? "Ask about Celo development..." : "What would you like to learn about Celo?"}
                className="w-full p-3 pr-12 border border-gray-800 rounded-lg resize-none focus:outline-none focus:ring-0 text-sm focus:ring-green-200 max-h-32 min-h-[44px] text-white bg-transparent"
                rows={1}
                disabled={isLoading}
              />
              
              {/* Character count */}
              <div className="absolute bottom-5 right-6 md:right-12 text-xs text-gray-400">
                {input.length}/2000
              </div>
            </div>
            
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-[#ffff57] rounded-lg text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[44px] flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
          
          {/* Tips */}
          {!firstMessageSent && (
            <div className="mt-2 text-xs text-center px-2">
              💡 Tip: Ask me to generate code, explain concepts, or help with Celo development
            </div>
          )}
        </div>
      </div>
    </div>
  );
}