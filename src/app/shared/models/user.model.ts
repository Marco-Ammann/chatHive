/** Represents a User in the chat application */
export interface User {
   id: string;
   username: string;
   email: string;
   avatarUrl: string;
   status: 'online' | 'offline' | 'busy' | 'away';
   channels?: string[];
   directMessageIds?: string[];
}
