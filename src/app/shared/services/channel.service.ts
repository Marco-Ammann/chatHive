import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Channel } from '../models/channel.model';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private selectedChannelSubject = new BehaviorSubject<string | null>(null);
  selectedChannel$ = this.selectedChannelSubject.asObservable();

  constructor(private firestore: Firestore) {}

  // Lade alle Channels
  getChannels(): Observable<Channel[]> {
    const channelCollection = collection(this.firestore, 'channels');
    return collectionData(channelCollection, { idField: 'id' }) as Observable<Channel[]>;
  }

  // Setze den ausgewählten Channel
  selectChannel(channelId: string): void {
    this.selectedChannelSubject.next(channelId);
  }
}
