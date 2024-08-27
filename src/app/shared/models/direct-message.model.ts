/** Represents a Direct Message (DM) conversation between two users */
export interface DirectMessage {
   id: string;
   participants: string[]; // Array of user IDs involved in the DM
   messages: string[]; // Array of message IDs in the DM conversation
   lastUpdated: string | null; // ISO timestamp or null if not updated yet
}
