import { User } from './types';

export const GEMINI_USER: User = {
  id: 'gemini-ai',
  name: 'Gemini AI',
  username: 'gemini',
  avatar: `https://i.pravatar.cc/150?u=gemini`,
  isAi: true,
};

export const USERS: User[] = [
  { id: 'user-1', name: 'Alice', username: 'alice', avatar: `https://i.pravatar.cc/150?u=alice`, isAi: false },
  { id: 'user-2', name: 'Bob', username: 'bob', avatar: `https://i.pravatar.cc/150?u=bob`, isAi: false },
  { id: 'user-3', name: 'Charlie', username: 'charlie', avatar: `https://i.pravatar.cc/150?u=charlie`, isAi: false },
  { id: 'user-4', name: 'Diana', username: 'diana', avatar: `https://i.pravatar.cc/150?u=diana`, isAi: false },
];
