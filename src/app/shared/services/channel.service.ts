import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  addDoc,
  doc,
  docData,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Channel } from '../models/channel.model';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {

  private channelsSubject = new BehaviorSubject<Channel[] | null>(null);
  channels$: Observable<Channel[] | null> = this.channelsSubject.asObservable();

  constructor(private firestore: Firestore) {
    this.loadChannels(); // Load channels on service initialization
  }

  // Method to load channels from Firebase in real-time
  private loadChannels(): void {
    const channelCollection = collection(this.firestore, 'channels');
    collectionData(channelCollection, { idField: 'id' }).subscribe((channels: Channel[]) => {
        // Automatically update the BehaviorSubject when channels change
        this.channelsSubject.next(channels);
      });
  }


  getChannels(): Observable<Channel[]> {
    const channelCollection = collection(this.firestore, 'channels');
    return collectionData(channelCollection, { idField: 'id' }) as Observable<
      Channel[]
    >;
  }

  getChannel(channelId: string): Observable<Channel> {
    const channelDoc = doc(this.firestore, `channels/${channelId}`);
    return docData(channelDoc, { idField: 'id' }) as Observable<Channel>;
  }

  addChannel(channel: Channel) {
    const channelCollection = collection(this.firestore, 'channels');
    return addDoc(channelCollection, channel);
  }
}
