import { Conversation, Message } from '@/types';

export const mockMessages: Message[] = [
  {
    id: 'msg1',
    senderId: '1',
    text: "Hi there! I saw you're focusing on algorithms. I'm working on some practice problems too.",
    timestamp: '2023-04-10T14:35:00Z',
    read: true,
  },
  {
    id: 'msg2',
    senderId: '3',
    text: "Hey John! Yes, we're currently working through some dynamic programming problems. Would you like to join our next session?",
    timestamp: '2023-04-10T14:40:00Z',
    read: true,
  },
  {
    id: 'msg3',
    senderId: '1',
    text: "That would be great! When's your next meeting?",
    timestamp: '2023-04-10T14:45:00Z',
    read: true,
  },
  {
    id: 'msg4',
    senderId: '3',
    text: "We're meeting this Friday at 4 PM in the CS building, room 302. Looking forward to seeing you there!",
    timestamp: '2023-04-10T14:50:00Z',
    read: false,
  },
  {
    id: 'msg5',
    senderId: '1',
    text: "Hello! I'm interested in your physics study group. I'm particularly curious about your quantum mechanics discussions.",
    timestamp: '2023-04-12T09:50:00Z',
    read: true,
  },
  {
    id: 'msg6',
    senderId: '4',
    text: "Hi John! We'd love to have you join. We meet every Wednesday at 6 PM in the Physics Lab.",
    timestamp: '2023-04-12T10:05:00Z',
    read: true,
  },
  {
    id: 'msg7',
    senderId: '2',
    text: "Hi! I'm preparing for the MCAT too. Would love to join your study sessions.",
    timestamp: '2023-04-15T16:25:00Z',
    read: true,
  },
  {
    id: 'msg8',
    senderId: '7',
    text: "Hey Emma! We'd be happy to have you. We're focusing on biochemistry this week. Do you want to join our Discord server?",
    timestamp: '2023-04-15T16:30:00Z',
    read: true,
  },
  {
    id: 'msg9',
    senderId: '2',
    text: "Absolutely! Biochem is one of my weaker areas, so that would be perfect.",
    timestamp: '2023-04-15T16:35:00Z',
    read: false,
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'c1',
    participants: ['1', '3'],
    lastMessage: mockMessages[3],
    updatedAt: '2023-04-10T14:50:00Z',
  },
  {
    id: 'c2',
    participants: ['1', '4'],
    lastMessage: mockMessages[5],
    updatedAt: '2023-04-12T10:05:00Z',
  },
  {
    id: 'c3',
    participants: ['2', '7'],
    lastMessage: mockMessages[8],
    updatedAt: '2023-04-15T16:35:00Z',
  },
];