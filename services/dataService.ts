import { User, Conversation } from '../types';
import { USERS as SEED_USERS, GEMINI_USER } from '../constants';

const USERS_DB_KEY = 'rchat_users';
const CONVERSATIONS_DB_PREFIX = 'rchat_conversations_';

// --- User Management ---

const getUsersFromStorage = (): User[] => {
    const usersJson = localStorage.getItem(USERS_DB_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
};

const saveUsersToStorage = (users: User[]) => {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
};

const initializeUserDatabase = () => {
    if (!localStorage.getItem(USERS_DB_KEY)) {
        const usersWithPasswords = SEED_USERS.map(u => ({ ...u, password: u.username }));
        saveUsersToStorage(usersWithPasswords);
    }
};

initializeUserDatabase();

export const getAllUsers = (currentUserId: string): User[] => {
    const users = getUsersFromStorage();
    return users
        .filter(u => u.id !== currentUserId)
        .map(u => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userWithoutPassword } = u;
            return userWithoutPassword;
        });
};

export const authenticateUser = (username: string, password: string): User | null => {
    const users = getUsersFromStorage();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    
    if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
};

export const createUser = (name: string, username: string, password: string): { success: boolean, message: string, user?: User } => {
    const users = getUsersFromStorage();
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, message: 'Username already taken.' };
    }

    const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        username,
        password,
        avatar: `https://i.pravatar.cc/150?u=${username}`,
        isAi: false,
    };

    saveUsersToStorage([...users, newUser]);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userToReturn } = newUser;
    return { success: true, message: 'Account created successfully!', user: userToReturn };
};

export const updateUser = (
  userId: string,
  currentPassword_from_form: string,
  updates: { name?: string, newPassword?: string }
): { success: boolean, message: string, user?: User } => {
    const users = getUsersFromStorage();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return { success: false, message: 'User not found.' };
    }
    
    const userToUpdate = { ...users[userIndex] };

    if (userToUpdate.password !== currentPassword_from_form) {
        return { success: false, message: 'Incorrect current password.' };
    }

    let hasChanges = false;
    if (updates.name && updates.name !== userToUpdate.name) {
        userToUpdate.name = updates.name;
        hasChanges = true;
    }

    if (updates.newPassword) {
        userToUpdate.password = updates.newPassword;
        hasChanges = true;
    }

    if (!hasChanges) {
        return { success: true, message: "No changes were made.", user: userToUpdate };
    }

    users[userIndex] = userToUpdate;
    saveUsersToStorage(users);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...updatedUserToReturn } = userToUpdate;

    return { success: true, message: 'Profile updated successfully!', user: updatedUserToReturn };
};


// --- Conversation Management ---

const getInitialConversations = (): Conversation[] => {
  return [
    {
      id: 'convo-gemini',
      participant: GEMINI_USER,
      messages: [
        {
          id: 'msg-gemini-1',
          text: "Hello! I'm your Gemini AI assistant. How can I help you today?",
          timestamp: new Date(),
          senderId: 'gemini-ai',
        },
      ],
    },
  ];
};


export const getConversations = (userId: string): Conversation[] => {
    const conversationsKey = `${CONVERSATIONS_DB_PREFIX}${userId}`;
    const conversationsJson = localStorage.getItem(conversationsKey);
    
    if (conversationsJson) {
        // Dates are stored as strings in JSON, so we need to parse them back
        const parsedConvos = JSON.parse(conversationsJson) as Conversation[];
        return parsedConvos.map(convo => ({
            ...convo,
            messages: convo.messages.map(msg => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
            }))
        }));
    } else {
        // This is a new user, create initial conversation set
        const initialConvos = getInitialConversations();
        saveConversations(userId, initialConvos);
        return initialConvos;
    }
};

export const saveConversations = (userId: string, conversations: Conversation[]) => {
    const conversationsKey = `${CONVERSATIONS_DB_PREFIX}${userId}`;
    localStorage.setItem(conversationsKey, JSON.stringify(conversations));
};