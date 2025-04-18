import { Match } from '@/types';

export const mockMatches: Match[] = [
  {
    id: 'm1',
    users: ['1', '3'],
    timestamp: '2023-04-10T14:30:00Z',
    conversationId: 'c1',
  },
  {
    id: 'm2',
    users: ['1', '4'],
    timestamp: '2023-04-12T09:45:00Z',
    conversationId: 'c2',
  },
  {
    id: 'm3',
    users: ['2', '7'],
    timestamp: '2023-04-15T16:20:00Z',
    conversationId: 'c3',
  },
];