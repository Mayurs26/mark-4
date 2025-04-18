import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'match' | 'message' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: {
    userId?: string;
    conversationId?: string;
  };
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      
      addNotification: (notification) => {
        const newNotification: Notification = {
          id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          read: false,
          ...notification,
        };
        
        set(state => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },
      
      markAsRead: (notificationId) => {
        set(state => {
          const updatedNotifications = state.notifications.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true } 
              : notification
          );
          
          const unreadCount = updatedNotifications.filter(n => !n.read).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        });
      },
      
      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(notification => ({ ...notification, read: true })),
          unreadCount: 0,
        }));
      },
      
      clearNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0,
        });
      },
      
      getUnreadCount: () => {
        return get().notifications.filter(n => !n.read).length;
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);