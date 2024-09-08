import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule, MatFabButton } from '@angular/material/button';
import { MessageService } from '../../shared/services/message.service';
import { ChannelService } from '../../shared/services/channel.service';
import { Timestamp } from 'firebase/firestore';
import { Message } from '../../shared/models/message.model';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';

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
    MatFabButton,
    MatIconModule,
    FormsModule,
    MatDividerModule,
    MatMenuModule,
  ],
  templateUrl: './chat-main.component.html',
  styleUrl: './chat-main.component.scss',
})
export class ChatMainComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  messageFormControl = new FormControl('');
  messages$: Observable<Message[]> = new Observable<Message[]>();
  selectedChannelId: string | null = null;
  currentUser: any;
  users: User[] = [];
  editingMessageId: string | null = null;
  editMessageFormControl = new FormControl('');

  constructor(
    private channelService: ChannelService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.channelService.selectedChannel$.subscribe((channelId) => {
      this.selectedChannelId = channelId;
      if (channelId) {
        this.messages$ = this.messageService
          .getMessages(channelId)
          .pipe(
            map((messages: Message[]) =>
              messages.length > 0
                ? messages.sort(
                    (a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()
                  )
                : []
            )
          );
        this.scrollToBottom();
      } else {
        this.messages$ = of([]);
      }
    });

    this.getCurrentUser();
    this.authService.getAllUsers().subscribe((users) => {
      this.users = users;
    });
  }

  getAvatarUrl(userId: string): string {
    const user = this.users.find((user) => user.id === userId);
    return user?.avatarUrl || '';
  }

  trackById(index: number, message: any): string {
    return message.id;
  }

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUser = {
          id: user.uid,
          username: user.displayName,
          avatarUrl: user.photoURL,
          status: 'online',
        };
        console.log('Current User:', this.currentUser);
      } else {
        this.currentUser = null;
      }
    });
  }

  addMessage() {
    if (this.selectedChannelId && this.messageFormControl.value) {
      const message: Message = {
        id: '',
        content: this.messageFormControl.value,
        userId: this.currentUser.id,
        username: this.currentUser.username,
        createdAt: Timestamp.now(),
        channelId: this.selectedChannelId,
      };
      this.messageService.addMessage(this.selectedChannelId, message);
      this.messageFormControl.setValue('');
      this.scrollToBottom();
    } else {
      alert('Please select a channel and enter a message');
    }
  }

  deleteMessage(channelId: string, messageId: string) {
    this.messageService
      .deleteMessage(channelId, messageId)
      .then(() => {
        console.log('Message deleted');
      })
      .catch((error) => {
        console.error('Error deleting message: ', error);
      });
  }

  // Methode, um den Bearbeitungsmodus zu aktivieren
  startEditMessage(message: Message) {
    this.editingMessageId = message.id;
    this.editMessageFormControl.setValue(message.content);
  }

  // Methode, um das Bearbeiten einer Nachricht abzuschließen
  saveEditedMessage() {
    if (this.selectedChannelId && this.editingMessageId) {
      const updatedContent = this.editMessageFormControl.value ?? '';
      this.messageService
        .updateMessage(
          this.selectedChannelId,
          this.editingMessageId,
          updatedContent
        )
        .then(() => {
          this.editingMessageId = null; // Reset editing mode
        });
    }
  }

  // Methode, um die Bearbeitung abzubrechen
  cancelEditMessage() {
    this.editingMessageId = null;
  }

  sendMessage(event?: Event) {
    event?.preventDefault();
    this.addMessage();
  }

  scrollToBottom(): void {
    try {
      console.log('Scrolling to bottom...');
      setTimeout(() => {
        this.myScrollContainer.nativeElement.scrollTop =
          this.myScrollContainer.nativeElement.scrollHeight;
      }, 400);
    } catch (err) {
      console.error('Scrolling Error:', err);
    }
  }
}
