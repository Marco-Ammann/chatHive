import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MessageService } from '../../shared/services/message.service';
import { ChannelService } from '../../shared/services/channel.service';
import { Timestamp } from 'firebase/firestore';
import { Channel } from '../../shared/models/channel.model';
import { Message } from '../../shared/models/message.model';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-chat-main',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
  ],
  templateUrl: './chat-main.component.html',
  styleUrl: './chat-main.component.scss',
})
export class ChatMainComponent implements OnInit {
  @Output() messageClicked = new EventEmitter<void>();
  onMessageClick() {
    this.messageClicked.emit(); // Trigger the event to open the thread panel
    console.log('Message clicked');
  }

  messageFormControl = new FormControl('');
  channels$: Observable<Channel[] | null>;

  constructor(
    private messageService: MessageService,
    private channelService: ChannelService
  ) {
    this.channels$ = this.channelService.channels$;
  }

  ngOnInit(): void {
    // Additional logic, if needed
  }

  addMessage() {
    this.channelService
      .getChannel('oN4A5lY9JgYUuMdm2n9c')
      .subscribe((channel) => {
        if (channel) {
          console.log('Channel:', channel);
          this.createMessage(channel);
        } else {
          console.error('Channel not found');
        }
      });
  }

  createMessage(channel: Channel) {
    const message: Message = {
      id: 'message1',
      content: this.messageFormControl.value ?? '',
      createdAt: Timestamp.now(),
      userId: 'user1',
      channelId: channel.id,
      reactions: {},
    };
    this.messageService.addMessage(channel.id, message);
  }
}
