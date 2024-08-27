import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Channel } from '../models/channel.model';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  constructor(private firestore: Firestore) {}

  getChannels(): Observable<Channel[]> {
    const channelCollection = collection(this.firestore, 'channels');
    return collectionData(channelCollection, { idField: 'id' }) as Observable<Channel[]>;
  }

  createChannel(channel: Channel) {
    const channelCollection = collection(this.firestore, 'channels');
    return addDoc(channelCollection, channel);
  }
}
