import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';
import { mockUsers } from '@/mocks/users';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  rehydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        rehydrated: false,

        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (!user) throw new Error('Invalid email or password');
            set({ user, isAuthenticated: true, isLoading: false });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'An error occurred', 
              isLoading: false 
            });
          }
        },

        signup: async (userData: Partial<User>) => {
          set({ isLoading: true, error: null });
          try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const emailExists = mockUsers.some(
              u => u.email.toLowerCase() === userData.email?.toLowerCase()
            );
            if (emailExists) throw new Error('Email already in use');

            const newUser: User = {
              id: `${mockUsers.length + 1}`,
              email: userData.email || '',
              name: userData.name || '',
              type: userData.type || 'individual',
              bio: userData.bio || '',
              institution: userData.institution || '',
              subjects: userData.subjects || [],
              interests: userData.interests || [],
              learningGoals: userData.learningGoals || [],
              images: userData.images || [],
              createdAt: new Date().toISOString(),
            };

            set({ user: newUser, isAuthenticated: true, isLoading: false });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'An error occurred', 
              isLoading: false 
            });
          }
        },

        logout: () => {
          set({ user: null, isAuthenticated: false });
        },

        updateProfile: async (userData: Partial<User>) => {
          set({ isLoading: true, error: null });
          try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const currentUser = get().user;
            if (!currentUser) throw new Error('User not authenticated');

            const updatedUser = { ...currentUser, ...userData };
            set({ user: updatedUser, isLoading: false });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'An error occurred', 
              isLoading: false 
            });
          }
        },
      };
    },
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (state) {
          state.rehydrated = true; // Correct way: directly mutate state
        }
      },
    }
  )
);
