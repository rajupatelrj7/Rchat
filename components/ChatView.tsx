
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, User } from '../types';
import MessageBubble from './MessageBubble';
import { SendIcon, BackIcon } from './icons';

interface ChatViewProps {
  conversation: Conversation;
  onSendMessage: (text: string) => void;
  isAiTyping: boolean;
  onBack: () => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  currentUser: User;
}

const ChatView: React.FC<ChatViewProps> = ({ conversation, onSendMessage, isAiTyping, onBack, onToggleReaction, currentUser }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages, isAiTyping]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0e1621]">
      <header className="flex items-center p-3 bg-[#18222d] flex-shrink-0 border-b border-gray-700 shadow-md z-10">
        <button onClick={onBack} className="md:hidden text-gray-300 hover:text-white mr-3">
          <BackIcon className="w-6 h-6" />
        </button>
        <img src={conversation.participant.avatar} alt={conversation.participant.name} className="h-10 w-10 rounded-full mr-4" />
        <div>
          <h2 className="font-semibold text-white">{conversation.participant.name}</h2>
          <p className="text-sm text-gray-400">online</p>
        </div>
      </header>

      <main className="flex-grow p-4 overflow-y-auto bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/1920/1080?blur=5')"}}>
        <div className="flex flex-col space-y-6">
          {conversation.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} onToggleReaction={onToggleReaction} currentUser={currentUser} />
          ))}
          {isAiTyping && (
             <div className="flex items-center justify-start">
                <div className="bg-[#222e3a] text-white py-2 px-4 rounded-t-xl rounded-br-xl max-w-md">
                    <div className="flex items-center space-x-1">
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-3 bg-[#18222d] flex-shrink-0 flex items-center">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-grow bg-[#24303d] rounded-full px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          onClick={handleSend}
          className="ml-3 flex-shrink-0 bg-cyan-600 hover:bg-cyan-700 rounded-full h-12 w-12 flex items-center justify-center transition-transform transform hover:scale-110"
        >
          <SendIcon className="h-6 w-6 text-white" />
        </button>
      </footer>
    </div>
  );
};

export default ChatView;
