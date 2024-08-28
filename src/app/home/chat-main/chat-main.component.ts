import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chat-main',
  standalone: true,
  imports: [],
  templateUrl: './chat-main.component.html',
  styleUrl: './chat-main.component.scss'
})
export class ChatMainComponent {

  @Output() messageClicked = new EventEmitter<void>();
  onMessageClick() {
    this.messageClicked.emit(); // Trigger the event to open the thread panel
  }
}
