import { Timestamp } from 'firebase/firestore';

/** Represents a Channel in the chat application */
export interface Channel {
  id: string;
  name: string;
  createdAt: Timestamp; // ISO timestamp readable by Firestore
  members: string[]; // Array of user IDs
  threads: string[]; // Array of thread IDs
}
