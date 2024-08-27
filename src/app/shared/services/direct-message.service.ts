import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DirectMessage } from '../models/direct-message.model';

@Injectable({
  providedIn: 'root',
})
export class DirectMessageService {
  constructor(private firestore: Firestore) {}

  getDirectMessages(dmId: string): Observable<DirectMessage[]> {
    const dmCollection = collection(this.firestore, `directMessages/${dmId}/messages`);
    return collectionData(dmCollection, { idField: 'id' }) as Observable<DirectMessage[]>;
  }

  sendDirectMessage(dmId: string, message: DirectMessage) {
    const dmCollection = collection(this.firestore, `directMessages/${dmId}/messages`);
    return addDoc(dmCollection, message);
  }
}
