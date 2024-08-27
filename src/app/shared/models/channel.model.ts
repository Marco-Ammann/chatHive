/** Represents a Channel in the chat application */
export interface Channel {
   id: string;
   name: string;
   createdAt: string; // ISO timestamp
   members: string[]; // Array of user IDs
   messages: string[]; // Array of message IDs
   threads: string[]; // Array of thread IDs
}
