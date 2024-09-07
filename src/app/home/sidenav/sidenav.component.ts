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
import { MatExpansionModule } from '@angular/material/expansion';
import { DirectMessageService } from '../../shared/services/direct-message.service';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

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
    MatExpansionModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit {
  channels$: Observable<Channel[]> = this.channelService.getChannels();
  users$: Observable<User[]> = new Observable();
  currentUserId!: string;
  selectedItemId: string | null = null;
  form: FormGroup;

  channelsControl = new FormControl();
  usersControl = new FormControl();

  // Flags für das Laden von Channels und Benutzern
  usersLoaded = false;
  channelsLoaded = false;

  constructor(
    private channelService: ChannelService,
    private authService: AuthService,
    private directMessageService: DirectMessageService
  ) {
    this.form = new FormGroup({
      channelsControl: this.channelsControl,
      usersControl: this.usersControl,
    });
  }

  ngOnInit(): void {
    // Lade Channels und setze das Flag, wenn fertig
    this.channels$ = this.channelService.getChannels();
    this.channels$.subscribe(() => {
      this.channelsLoaded = true;
    });

    // Lade Benutzer und setze das Flag, wenn fertig
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUserId = user.id;
        this.users$ = this.authService.getAllUsers();
        this.users$.subscribe(() => {
          this.usersLoaded = true;
        });
      }
    });
  }

  selectChannel(channel: Channel): void {
    this.selectedItemId = channel.id;
    this.channelService.selectChannel(channel.id);
    this.usersControl.reset(); // Setze User-Auswahl zurück
    console.log('Channel selected:', channel);
  }

  selectUser(user: User): void {
    this.selectedItemId = user.id;
    this.directMessageService.openDirectMessage(this.currentUserId, user.id);
    this.channelsControl.reset(); // Setze Channel-Auswahl zurück
    console.log('Direct message opened with:', user);
  }

  isActive(itemId: string): boolean {
    return this.selectedItemId === itemId;
  }
}
