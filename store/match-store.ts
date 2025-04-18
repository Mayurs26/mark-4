import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Match } from '@/types';
import { mockUsers } from '@/mocks/users';
import { mockMatches } from '@/mocks/matches';

interface MatchState {
  potentialMatches: User[];
  matches: Match[];
  isLoading: boolean;
  error: string | null;
  loadPotentialMatches: (userId: string) => void;
  swipeLeft: (userId: string) => void;
  swipeRight: (currentUserId: string, targetUserId: string) => void;
  getMatchedUsers: (userId: string) => User[];
}

export const useMatchStore = create<MatchState>()(
  persist(
    (set, get) => ({
      potentialMatches: [],
      matches: [...mockMatches],
      isLoading: false,
      error: null,
      
      loadPotentialMatches: (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          // Filter out the current user and already matched users
          const currentMatches = get().matches;
          const matchedUserIds = currentMatches
            .filter(match => match.users.includes(userId))
            .flatMap(match => match.users)
            .filter(id => id !== userId);
          
          // Get potential matches (excluding current user and already matched users)
          const potentialMatches = mockUsers.filter(
            user => user.id !== userId && !matchedUserIds.includes(user.id)
          );
          
          set({ potentialMatches, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred', 
            isLoading: false 
          });
        }
      },
      
      swipeLeft: (userId: string) => {
        const potentialMatches = [...get().potentialMatches];
        // Remove the first user from potential matches
        potentialMatches.shift();
        set({ potentialMatches });
      },
      
      swipeRight: (currentUserId: string, targetUserId: string) => {
        const potentialMatches = [...get().potentialMatches];
        const matches = [...get().matches];
        
        // Remove the first user from potential matches
        potentialMatches.shift();
        
        // In a real app, we would check if the target user has already swiped right on the current user
        // For this demo, we'll create a match 50% of the time
        const isMatch = Math.random() > 0.5;
        
        if (isMatch) {
          // Create a new match
          const newMatch: Match = {
            id: `m${matches.length + 1}`,
            users: [currentUserId, targetUserId],
            timestamp: new Date().toISOString(),
            conversationId: `c${matches.length + 1}`,
          };
          
          matches.push(newMatch);
        }
        
        set({ potentialMatches, matches });
      },
      
      getMatchedUsers: (userId: string) => {
        const { matches } = get();
        
        // Get all matches for the current user
        const userMatches = matches.filter(match => match.users.includes(userId));
        
        // Get the IDs of all matched users (excluding the current user)
        const matchedUserIds = userMatches
          .flatMap(match => match.users)
          .filter(id => id !== userId);
        
        // Get the user objects for all matched users
        return mockUsers.filter(user => matchedUserIds.includes(user.id));
      },
    }),
    {
      name: 'match-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);