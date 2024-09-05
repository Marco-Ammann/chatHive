import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Channel } from '../../shared/models/channel.model';
import { Observable } from 'rxjs';
import { MessageService } from '../../shared/services/message.service';
import { ChannelService } from '../../shared/services/channel.service';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Timestamp } from 'firebase/firestore';
import { MatInputModule } from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import { DirectMessageService } from '../../shared/services/direct-message.service';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit {
  channels$: Observable<Channel[]> = this.channelService.getChannels();
  users$: Observable<User[]> = new Observable();
  currentUserId!: string;

  constructor(
    private channelService: ChannelService,
    private authService: AuthService,
    private directMessageService: DirectMessageService
  ) {}

  ngOnInit(): void {
    // Lade alle Channels
    this.channels$ = this.channelService.getChannels();

    // Lade alle Benutzer und den aktuellen Benutzer
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
        this.users$ = this.authService.getAllUsers();
      }
    });
  }

  // Wähle einen Channel und zeige Nachrichten in der ChatMain-Komponente
  selectChannel(channel: Channel): void {
    this.channelService.selectChannel(channel.id);
    console.log('Channel selected:', channel);
  }

  // Öffne einen Direktnachricht-Chat mit einem Benutzer
  selectUser(user: User): void {
    this.directMessageService.openDirectMessage(this.currentUserId, user.id);
    console.log('Direct message opened with:', user);
  }
}
