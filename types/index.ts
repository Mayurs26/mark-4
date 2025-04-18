export type UserType = 'individual' | 'group';

export interface User {
  id: string;
  email: string;
  name: string;
  type: UserType;
  bio: string;
  institution: string;
  subjects: string[];
  interests: string[];
  learningGoals: string[];
  images: string[];
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface Match {
  id: string;
  users: string[];
  timestamp: string;
  conversationId: string;
}

export type ThemeType = 'light' | 'dark';