
import { Chat } from "@google/genai";

export interface User {
  id: string;
  name: string; // Display name
  username: string;
  avatar: string;
  isAi: boolean;
  password?: string; // Only present for registered users in our "DB"
}

export interface Message {
  id:string;
  text: string;
  timestamp: Date;
  senderId: string; // user.id
  reactions?: Record<string, string[]>; // emoji -> userIds
}

export interface Conversation {
  id: string;
  participant: User;
  messages: Message[];
  geminiChat?: Chat;
}
