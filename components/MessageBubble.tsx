
import React, { useState, useEffect, useRef } from 'react';
import { Message, User } from '../types';
import { EmojiIcon } from './icons';

interface MessageBubbleProps {
  message: Message;
  onToggleReaction: (messageId: string, emoji: string) => void;
  currentUser: User;
}

const formatTimestamp = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onToggleReaction, currentUser }) => {
  const isMe = message.senderId === currentUser.id;
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEmojiSelect = (emoji: string) => {
    onToggleReaction(message.id, emoji);
    setShowPicker(false);
  };

  // FIX: Add type guard to ensure 'users' is an array before accessing 'length'.
  const hasReactions = message.reactions && Object.values(message.reactions).some(users => Array.isArray(users) && users.length > 0);

  return (
    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
      <div className={`group relative flex items-center ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="relative">
          <button
            onClick={() => setShowPicker(p => !p)}
            aria-label="Add reaction"
            className={`p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity mx-1`}
          >
            <EmojiIcon className="w-5 h-5" />
          </button>
          
          {showPicker && (
            <div
              ref={pickerRef}
              className={`absolute bottom-full mb-1 flex items-center space-x-1 bg-[#2a3942] p-1.5 rounded-full shadow-lg z-30 ${isMe ? 'right-0' : 'left-0'}`}
            >
              {EMOJI_REACTIONS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="text-2xl p-1 rounded-full hover:bg-white/20 transition-colors transform hover:scale-125"
                  aria-label={`React with ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          className={`px-4 py-2 rounded-xl max-w-md lg:max-w-xl shadow-md ${
            isMe
              ? 'bg-cyan-700 text-white rounded-br-none'
              : 'bg-[#222e3a] text-gray-200 rounded-bl-none'
          }`}
        >
          <p className="text-sm break-words">{message.text}</p>
          <span className={`text-xs mt-1 block ${isMe ? 'text-cyan-200' : 'text-gray-500'} text-right`}>
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
      </div>

      {hasReactions && (
        <div className={`flex flex-wrap gap-1 mt-1.5 ${isMe ? 'mr-2' : 'ml-12'}`}>
          {Object.entries(message.reactions!).map(([emoji, userIds]) => {
            // FIX: Add type guard to ensure 'userIds' is an array before accessing its properties.
            if (!Array.isArray(userIds) || userIds.length === 0) return null;
            const amIReacting = userIds.includes(currentUser.id);
            return (
              <button
                key={emoji}
                onClick={() => onToggleReaction(message.id, emoji)}
                aria-label={`${userIds.length} ${emoji} reactions`}
                className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs shadow-md backdrop-blur-sm transition-colors ${
                  amIReacting
                    ? 'bg-blue-500/80 text-white'
                    : 'bg-gray-600/60 text-gray-200 hover:bg-gray-500/60'
                }`}
              >
                <span>{emoji}</span>
                <span className="font-medium">{userIds.length}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
