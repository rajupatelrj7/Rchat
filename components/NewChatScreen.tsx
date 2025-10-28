import React, { useState, useMemo } from 'react';
import { User, Conversation } from '../types';
import { CloseIcon, SearchIcon } from './icons';

interface NewChatScreenProps {
  currentUser: User;
  existingConversations: Conversation[];
  onClose: () => void;
  onStartConversation: (user: User) => void;
  allUsers: User[];
}

const NewChatScreen: React.FC<NewChatScreenProps> = ({
  currentUser,
  existingConversations,
  onClose,
  onStartConversation,
  allUsers,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const availableUsers = useMemo(() => {
    const existingParticipantIds = new Set(
      existingConversations.map(c => c.participant.id)
    );
    return allUsers.filter(u => !existingParticipantIds.has(u.id));
  }, [allUsers, existingConversations]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return availableUsers;
    }
    return availableUsers.filter(
      user =>
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query)
    );
  }, [availableUsers, searchQuery]);

  const handleUserSelect = (user: User) => {
    onStartConversation(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="w-full max-w-md h-[70vh] flex flex-col bg-[#18222d] rounded-2xl shadow-lg m-4 relative animate-fade-in-up">
        <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h1 className="text-xl font-bold text-cyan-400">New Message</h1>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="p-4 flex-shrink-0">
           <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search for users"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#24303d] rounded-full pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                autoFocus
              />
            </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          {filteredUsers.length > 0 ? (
            <ul>
              {filteredUsers.map(user => (
                <li key={user.id} onClick={() => handleUserSelect(user)}>
                  <div className="flex items-center p-3 cursor-pointer transition-colors duration-200 hover:bg-[#222e3a]">
                    <img src={user.avatar} alt={user.name} className="h-12 w-12 rounded-full mr-4" />
                    <div className="flex-grow overflow-hidden">
                      <h3 className="font-semibold truncate text-gray-200">{user.name}</h3>
                      <p className="text-sm truncate text-gray-400">@{user.username}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center p-8 text-gray-500">
              <p>No users found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChatScreen;
