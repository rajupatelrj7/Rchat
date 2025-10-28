import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatView from './ChatView';
import ProfileScreen from './ProfileScreen';
import NewChatScreen from './NewChatScreen';
import { Conversation, Message, User } from '../types';
import { getConversations, saveConversations, updateUser, getAllUsers } from '../services/dataService';
import { getGeminiResponse, createAiChat } from '../services/geminiService';

interface ChatInterfaceProps {
  currentUser: User;
  onUserUpdate: (user: User) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentUser, onUserUpdate }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    const userConversations = getConversations(currentUser.id);
    setConversations(userConversations);
    if (userConversations.length > 0) {
      // Initialize Gemini chat sessions for any existing AI contacts
      const conversationsWithChat = userConversations.map(c => {
        if (c.participant.isAi && !c.geminiChat) {
          return { ...c, geminiChat: createAiChat() };
        }
        return c;
      });
      setConversations(conversationsWithChat);
      setSelectedConversationId(conversationsWithChat[0].id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
        setAllUsers(getAllUsers(currentUser.id));
    }
  }, [currentUser]);

  const updateAndSaveConversations = (updatedConversations: Conversation[]) => {
    setConversations(updatedConversations);
    saveConversations(currentUser.id, updatedConversations);
  };

  const handleStartNewConversation = (participant: User) => {
    const existingConvo = conversations.find(c => c.participant.id === participant.id);
    if (existingConvo) {
      setSelectedConversationId(existingConvo.id);
    } else {
      const newConversation: Conversation = {
        id: `convo-${participant.id}`,
        participant,
        messages: [],
      };
      const updatedConversations = [newConversation, ...conversations];
      updateAndSaveConversations(updatedConversations);
      setSelectedConversationId(newConversation.id);
    }
    setIsNewChatModalOpen(false);
  };


  const handleSendMessage = async (text: string) => {
    if (!selectedConversationId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text,
      timestamp: new Date(),
      senderId: currentUser.id,
    };

    const conversation = conversations.find(c => c.id === selectedConversationId);
    if (!conversation) return;

    const updatedConversations = conversations.map(c =>
      c.id === selectedConversationId
        ? { ...c, messages: [...c.messages, newMessage] }
        : c
    );
    updateAndSaveConversations(updatedConversations);

    if (conversation.participant.isAi && conversation.geminiChat) {
      setIsAiTyping(true);
      const aiResponseText = await getGeminiResponse(conversation.geminiChat, text);
      setIsAiTyping(false);

      const aiMessage: Message = {
        id: `msg-ai-${Date.now()}`,
        text: aiResponseText,
        timestamp: new Date(),
        senderId: conversation.participant.id,
      };
      
      const finalConversations = conversations.map(c =>
          c.id === selectedConversationId
            ? { ...c, messages: [...c.messages, newMessage, aiMessage] }
            : c
        )
      // We need to re-find the conversation from the latest state
      setConversations(prevConvos => {
          const newConvos = prevConvos.map(c =>
              c.id === selectedConversationId
                ? { ...c, messages: [...c.messages, aiMessage] }
                : c
          );
          saveConversations(currentUser.id, newConvos);
          return newConvos;
      });
    }
  };
  
  const handleToggleReaction = (messageId: string, emoji: string) => {
    if (!selectedConversationId) return;

    const newConversations = conversations.map(convo => {
        if (convo.id !== selectedConversationId) {
            return convo;
        }

        const messageIndex = convo.messages.findIndex(m => m.id === messageId);
        if (messageIndex === -1) {
            return convo;
        }

        const updatedMessages = [...convo.messages];
        const targetMessage = { ...updatedMessages[messageIndex] };
        targetMessage.reactions = { ...(targetMessage.reactions || {}) };

        const userIds = targetMessage.reactions[emoji] || [];
        
        if (userIds.includes(currentUser.id)) {
            const newUserIds = userIds.filter(id => id !== currentUser.id);
            if (newUserIds.length > 0) {
                targetMessage.reactions[emoji] = newUserIds;
            } else {
                delete targetMessage.reactions[emoji];
            }
        } else {
            targetMessage.reactions[emoji] = [...userIds, currentUser.id];
        }

        updatedMessages[messageIndex] = targetMessage;
        return { ...convo, messages: updatedMessages };
    });
    
    updateAndSaveConversations(newConversations);
  };
  
  const handleProfileSave = async (data: { name: string; currentPassword: string; newPassword?: string; }) => {
    const result = updateUser(currentUser.id, data.currentPassword, {
      name: data.name,
      newPassword: data.newPassword,
    });
    if (result.success && result.user) {
      onUserUpdate(result.user);
    }
    return result;
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="flex h-screen w-screen bg-[#0e1621]">
      <div className={`w-full md:w-[350px] lg:w-[400px] flex-shrink-0 bg-[#18222d] border-r border-gray-700
        ${selectedConversationId ? 'hidden md:flex' : 'flex'} flex-col`}>
        <Sidebar
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
          currentUser={currentUser}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenNewChat={() => setIsNewChatModalOpen(true)}
        />
      </div>
      <div className={`w-full flex-grow ${selectedConversationId ? 'flex' : 'hidden md:flex'}`}>
        {selectedConversation ? (
          <ChatView
            key={selectedConversationId}
            conversation={selectedConversation}
            onSendMessage={handleSendMessage}
            isAiTyping={isAiTyping && selectedConversation.participant.isAi}
            onBack={() => setSelectedConversationId(null)}
            onToggleReaction={handleToggleReaction}
            currentUser={currentUser}
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-gray-400 bg-[#0e1621]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Welcome to Rchat</h2>
              <p className="mt-2">Select a chat to start messaging.</p>
            </div>
          </div>
        )}
      </div>
      {isProfileModalOpen && (
          <ProfileScreen 
            user={currentUser}
            onClose={() => setIsProfileModalOpen(false)}
            onSave={handleProfileSave}
          />
      )}
      {isNewChatModalOpen && (
          <NewChatScreen
            currentUser={currentUser}
            existingConversations={conversations}
            onClose={() => setIsNewChatModalOpen(false)}
            onStartConversation={handleStartNewConversation}
            allUsers={allUsers}
          />
      )}
    </div>
  );
};

export default ChatInterface;