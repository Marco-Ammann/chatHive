import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  deleteDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../models/message.model';
import { Thread } from '../models/thread.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messagesSubject = new BehaviorSubject<Message[] | null>(null);
  messages$: Observable<Message[] | null> = this.messagesSubject.asObservable();
  constructor(private firestore: Firestore) {}

  // Send a new message in a channel
  addMessage(channelId: string, message: Message) {
    console.log('Channel ID:', channelId);
    if (!channelId) {
      console.error('Channel ID is undefined!');
      return;
    }

    const messageCollection = collection(
      this.firestore,
      `channels/${channelId}/messages`
    );
    return addDoc(messageCollection, message);
  }

  // Get messages for a specific channel
  getMessages(channelId: string): Observable<Message[]> {
    const messageCollection = collection(
      this.firestore,
      `channels/${channelId}/messages`
    );
    return collectionData(messageCollection, { idField: 'id' }) as Observable<
      Message[]
    >;
  }

  updateMessage(channelId: string, messageId: string, newContent: string) {
    const messageDoc = doc(
      this.firestore,
      `channels/${channelId}/messages/${messageId}`
    );
    return updateDoc(messageDoc, { content: newContent });
  }

  deleteMessage(channelId: string, messageId: string) {
    const messageDoc = doc(
      this.firestore,
      `channels/${channelId}/messages/${messageId}`
    );
    return deleteDoc(messageDoc);
  }

  // Get threads for a specific message in a channel
  getThreadsForMessage(
    channelId: string,
    messageId: string
  ): Observable<Thread[]> {
    const threadCollection = collection(
      this.firestore,
      `channels/${channelId}/threads`
    );
    const threadQuery = query(
      threadCollection,
      where('parentMessageId', '==', messageId)
    );
    return collectionData(threadQuery, { idField: 'id' }) as Observable<
      Thread[]
    >;
  }

  // Create a new thread for a message
  createThread(channelId: string, thread: Thread) {
    const threadCollection = collection(
      this.firestore,
      `channels/${channelId}/threads`
    );
    return addDoc(threadCollection, thread);
  }

  // Get replies within a specific thread
  getThreadReplies(channelId: string, threadId: string): Observable<Message[]> {
    const repliesCollection = collection(
      this.firestore,
      `channels/${channelId}/messages`
    );
    const repliesQuery = query(
      repliesCollection,
      where('threadId', '==', threadId),
      orderBy('createdAt')
    );
    return collectionData(repliesQuery, { idField: 'id' }) as Observable<
      Message[]
    >;
  }

  // Send a reply in a thread
  sendThreadReply(channelId: string, replyMessage: Message) {
    const messageCollection = collection(
      this.firestore,
      `channels/${channelId}/messages`
    );
    return addDoc(messageCollection, replyMessage);
  }
}
