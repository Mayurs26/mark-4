import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Conversation, Message } from '@/types';
import { mockConversations, mockMessages } from '@/mocks/conversations';

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
  loadConversations: (userId: string) => void;
  loadMessages: (conversationId: string) => void;
  sendMessage: (conversationId: string, senderId: string, text: string) => void;
  markAsRead: (conversationId: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [...mockConversations],
      messages: {
        c1: mockMessages.slice(0, 4),
        c2: mockMessages.slice(4, 6),
        c3: mockMessages.slice(6, 9),
      },
      isLoading: false,
      error: null,
      
      loadConversations: (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          // Filter conversations where the user is a participant
          const userConversations = mockConversations.filter(
            conversation => conversation.participants.includes(userId)
          );
          
          set({ conversations: userConversations, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred', 
            isLoading: false 
          });
        }
      },
      
      loadMessages: (conversationId: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, we would fetch messages from an API
          // For this demo, we're using mock data
          const conversationMessages = get().messages[conversationId] || [];
          
          set({ 
            messages: { 
              ...get().messages, 
              [conversationId]: conversationMessages 
            }, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred', 
            isLoading: false 
          });
        }
      },
      
      sendMessage: (conversationId: string, senderId: string, text: string) => {
        try {
          const conversations = [...get().conversations];
          const messages = { ...get().messages };
          
          // Create new message
          const newMessage: Message = {
            id: `msg${Date.now()}`,
            senderId,
            text,
            timestamp: new Date().toISOString(),
            read: false,
          };
          
          // Add message to conversation
          const conversationMessages = messages[conversationId] || [];
          messages[conversationId] = [...conversationMessages, newMessage];
          
          // Update last message in conversation
          const conversationIndex = conversations.findIndex(c => c.id === conversationId);
          if (conversationIndex !== -1) {
            conversations[conversationIndex] = {
              ...conversations[conversationIndex],
              lastMessage: newMessage,
              updatedAt: newMessage.timestamp,
            };
          }
          
          set({ conversations, messages });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred'
          });
        }
      },
      
      markAsRead: (conversationId: string) => {
        try {
          const messages = { ...get().messages };
          const conversationMessages = messages[conversationId] || [];
          
          // Mark all messages as read
          const updatedMessages = conversationMessages.map(message => ({
            ...message,
            read: true,
          }));
          
          messages[conversationId] = updatedMessages;
          
          set({ messages });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred'
          });
        }
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);