// components/ChatHistorySidebar.js
'use client';
import { useState, useEffect } from 'react';
import { MessageSquare, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

export default function ChatHistorySidebar({
  chats,
  currentChatId,
  onSelectChat,
  onCreateNew,
  onDeleteChat
}) {
  const [organizedChats, setOrganizedChats] = useState({});
  const [expandedTopics, setExpandedTopics] = useState({});

  // Organize chats by topic
  useEffect(() => {
    const organized = chats.reduce((acc, chat) => {
      const topic = chat.topic || 'General';
      if (!acc[topic]) {
        acc[topic] = [];
      }
      acc[topic].push(chat);
      return acc;
    }, {});

    setOrganizedChats(organized);
    
    // Expand all topics by default
    const topics = Object.keys(organized);
    const expanded = topics.reduce((acc, topic) => {
      acc[topic] = true;
      return acc;
    }, {});
    setExpandedTopics(expanded);
  }, [chats]);

  const toggleTopic = (topic) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topic]: !prev[topic]
    }));
  };

  return (
    <div className="w-64 md:w-52 h-full bg-[#1e002b] border-r border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={onCreateNew}
          className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm text-black font-medium  bg-green-100 rounded-md  transition-colors"
        >
          <Plus size={16} />
          New Chat
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(organizedChats).map(([topic, topicChats]) => (
          <div key={topic} className="border-b  border-gray-800">
            <div
              className="flex items-center justify-between mb-3 p-3 cursor-pointer border-b border-b-gray-800"
              onClick={() => toggleTopic(topic)}
            >
              <div className="flex items-center gap-2">
                {expandedTopics[topic] ? (
                  <ChevronDown size={16} className="text-gray-100" />
                ) : (
                  <ChevronRight size={16} className="text-gray-100" />
                )}
                <span className="font-medium text-gray-100">{topic}</span>
              </div>
              <span className="text-xs text-gray-200">{topicChats.length}</span>
            </div>

            {expandedTopics[topic] && (
              <div className="px-4 space-y-3 ">
                {topicChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex items-center  justify-between border-b border-b-gray-800 rounded pl-3 p-2 hover:bg-green-100 group-hover:text-black cursor-pointer group ${
                      chat.id === currentChatId ? 'bg-green-100 ' : 'hover:text-black'
                    }`}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <div className="flex items-center gap-2 truncate ">
                      <MessageSquare 
                        size={14} 
                        className={
                          chat.id === currentChatId 
                            ? 'text-green-600' 
                            : 'text-gray-100 group-hover:text-black'
                        } 
                      />
                      <span className={`text-sm truncate ${
                        chat.id === currentChatId
                          ? 'text-green-800 font-medium'
                          : 'text-gray-100 group-hover:text-black'
                      }`}>
                        {chat.title || 'New Chat'}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

    
    </div>
  );
}