import { Timestamp } from 'firebase/firestore';

/** Represents a Message in a Channel */
export interface Message {
  id: string;
  content: string;
  createdAt: Timestamp; // Change this from string to Timestamp
  userId: string;
  channelId: string;
  threadId?: string | null;
  reactions?: { [reactionType: string]: string[] };
  username: string; // Add the username property
}
