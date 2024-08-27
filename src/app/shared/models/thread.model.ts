/** Represents a Thread for a message */
export interface Thread {
   id: string;
   parentMessageId: string; // ID of the message that started the thread
   replies: string[]; // Array of message IDs that are replies to the thread
   createdBy: string; // User ID who created the thread
   createdAt: string; // ISO timestamp
}
