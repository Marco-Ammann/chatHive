/** Represents a Message in a Direct Message (DM) conversation */
export interface DirectMessageMessage {
   id: string;
   content: string;
   createdAt: string; // ISO timestamp
   userId: string; // User ID of the message sender
   dmId: string; // Direct Message ID this message belongs to
   reactions: { [reactionType: string]: string[] }; // e.g., { like: ['user1', 'user2'] }
}
