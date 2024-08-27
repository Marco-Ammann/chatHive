import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, doc, updateDoc, query, where, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';
import { Thread } from '../models/thread.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private firestore: Firestore) {}

  // Get messages for a specific channel
  getMessages(channelId: string): Observable<Message[]> {
    const messageCollection = collection(this.firestore, `channels/${channelId}/messages`);
    return collectionData(messageCollection, { idField: 'id' }) as Observable<Message[]>;
  }

  // Send a new message in a channel
  sendMessage(channelId: string, message: Message) {
    const messageCollection = collection(this.firestore, `channels/${channelId}/messages`);
    return addDoc(messageCollection, message);
  }

  // Get threads for a specific message in a channel
  getThreadsForMessage(channelId: string, messageId: string): Observable<Thread[]> {
    const threadCollection = collection(this.firestore, `channels/${channelId}/threads`);
    const threadQuery = query(threadCollection, where('parentMessageId', '==', messageId));
    return collectionData(threadQuery, { idField: 'id' }) as Observable<Thread[]>;
  }

  // Create a new thread for a message
  createThread(channelId: string, thread: Thread) {
    const threadCollection = collection(this.firestore, `channels/${channelId}/threads`);
    return addDoc(threadCollection, thread);
  }

  // Get replies within a specific thread
  getThreadReplies(channelId: string, threadId: string): Observable<Message[]> {
    const repliesCollection = collection(this.firestore, `channels/${channelId}/messages`);
    const repliesQuery = query(repliesCollection, where('threadId', '==', threadId), orderBy('createdAt'));
    return collectionData(repliesQuery, { idField: 'id' }) as Observable<Message[]>;
  }

  // Send a reply in a thread
  sendThreadReply(channelId: string, replyMessage: Message) {
    const messageCollection = collection(this.firestore, `channels/${channelId}/messages`);
    return addDoc(messageCollection, replyMessage);
  }
}
