import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DirectMessage } from '../models/direct-message.model';

@Injectable({
  providedIn: 'root'
})
export class DirectMessageService {
  constructor(private firestore: Firestore) {}

  // Öffne oder erstelle eine Direktnachricht zwischen zwei Benutzern
  openDirectMessage(userId1: string, userId2: string): Observable<DirectMessage> {
    const dmCollection = collection(this.firestore, 'directMessages');
    const directMessageId = `${userId1}_${userId2}`; // ID basierend auf den beiden Benutzer-IDs

    // Überprüfen, ob die DM bereits existiert, oder eine neue erstellen
    const dmDoc = doc(this.firestore, `directMessages/${directMessageId}`);
    return collectionData(dmDoc) as Observable<DirectMessage>;
  }
}
