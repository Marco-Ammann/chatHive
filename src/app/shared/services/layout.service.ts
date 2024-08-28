import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private selectedChannel = new BehaviorSubject<string | null>(null);
  private isThreadPanelVisible = new BehaviorSubject<boolean>(false);

  selectedChannel$ = this.selectedChannel.asObservable();
  isThreadPanelVisible$ = this.isThreadPanelVisible.asObservable();

  selectChannel(channelId: string) {
    this.selectedChannel.next(channelId);
  }

  toggleThreadPanel(isVisible: boolean) {
    this.isThreadPanelVisible.next(isVisible);
  }
}
