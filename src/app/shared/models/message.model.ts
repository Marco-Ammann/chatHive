/** Represents a Message in a Channel */
export interface Message {
   id: string;
   content: string;
   createdAt: string; // ISO timestamp
   userId: string; // User ID of the message sender
   channelId: string; // Channel ID to which the message belongs
   threadId?: string | null; // Thread ID if this message is part of a thread
   reactions: { [reactionType: string]: string[] }; // e.g., { like: ['user1', 'user2'], laugh: ['user3'] }
}
