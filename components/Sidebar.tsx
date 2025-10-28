import React, { useState, useMemo } from 'react';
import { Conversation, Message, User } from '../types';
import { MenuIcon, SearchIcon, PencilSquareIcon } from './icons';

interface SidebarProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  currentUser: User;
  onOpenProfile: () => void;
  onOpenNewChat: () => void;
}

const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const diffDays = Math.floor(diffSeconds / (24 * 3600));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }
  return date.toLocaleDateString();
};

const getLastMessage = (messages: Message[]): Message | undefined => {
    return messages.length > 0 ? messages[messages.length - 1] : undefined;
}

const Sidebar: React.FC<SidebarProps> = ({ conversations, selectedConversationId, onSelectConversation, currentUser, onOpenProfile, onOpenNewChat }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const displayedConversations = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    const sortedConversations = conversations
      .slice()
      .sort((a,b) => (getLastMessage(b.messages)?.timestamp.getTime() || 0) - (getLastMessage(a.messages)?.timestamp.getTime() || 0));

    if (!query) {
      return sortedConversations;
    }
    
    return sortedConversations.filter(convo => {
        const participantMatch = convo.participant.name.toLowerCase().includes(query);
        const messageMatch = convo.messages.some(message =>
          message.text.toLowerCase().includes(query)
        );
        return participantMatch || messageMatch;
      });

  }, [conversations, searchQuery]);

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between p-3 bg-[#222e3a] flex-shrink-0">
        <button onClick={onOpenProfile} className="p-2 text-gray-400 rounded-full hover:text-white hover:bg-white/10">
          <MenuIcon className="h-6 w-6" />
        </button>
        <div className="relative flex-grow mx-2">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search messages or users"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#18222d] rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
         <button onClick={onOpenNewChat} className="p-2 text-gray-400 rounded-full hover:text-white hover:bg-white/10">
            <PencilSquareIcon className="h-6 w-6" />
        </button>
      </header>
      <div className="flex-grow overflow-y-auto">
        <ul>
          {displayedConversations.map((convo) => {
            const lastMessage = getLastMessage(convo.messages);
            return (
              <li key={convo.id} onClick={() => onSelectConversation(convo.id)}>
                <div
                  className={`flex items-center p-3 cursor-pointer transition-colors duration-200 ${
                    selectedConversationId === convo.id ? 'bg-cyan-600' : 'hover:bg-[#222e3a]'
                  }`}
                >
                  <img src={convo.participant.avatar} alt={convo.participant.name} className="h-12 w-12 rounded-full mr-4" />
                  <div className="flex-grow overflow-hidden">
                    <div className="flex justify-between items-center">
                      <h3 className={`font-semibold truncate ${selectedConversationId === convo.id ? 'text-white' : 'text-gray-200'}`}>{convo.participant.name}</h3>
                      {lastMessage && (
                        <span className={`text-xs flex-shrink-0 ${selectedConversationId === convo.id ? 'text-gray-200' : 'text-gray-400'}`}>
                          {formatTimestamp(lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    {lastMessage && (
                        <p className={`text-sm truncate ${selectedConversationId === convo.id ? 'text-gray-200' : 'text-gray-400'}`}>
                          {lastMessage.senderId === currentUser.id && 'You: '}{lastMessage.text}
                        </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;