import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Channel } from '../../shared/models/channel.model';
import { Observable } from 'rxjs';
import { ChannelService } from '../../shared/services/channel.service';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { DirectMessageService } from '../../shared/services/direct-message.service';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { NewChannelDialogComponent } from './new-channel-dialog/new-channel-dialog.component';

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
    MatProgressSpinnerModule,
    MatDialogModule,
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

  usersLoaded = false;
  channelsLoaded = false;

  constructor(
    private channelService: ChannelService,
    private authService: AuthService,
    private directMessageService: DirectMessageService,
    private dialog: MatDialog
  ) {
    this.form = new FormGroup({
      channelsControl: this.channelsControl,
      usersControl: this.usersControl,
    });
  }

  ngOnInit(): void {
    this.loadChannels();
    this.loadUsers();
  }

  private loadChannels(): void {
    this.channels$.subscribe(() => (this.channelsLoaded = true));
  }

  private loadUsers(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUserId = user.uid;
        this.users$ = this.authService.getAllUsers();
        this.users$.subscribe(() => (this.usersLoaded = true));
      }
    });
  }

  selectChannel(channel: Channel): void {
    this.selectedItemId = channel.id;
    this.channelService.selectChannel(channel.id);
    this.form.controls['usersControl'].reset();
  }

  selectUser(user: User): void {
    this.selectedItemId = user.id;
    this.directMessageService.openDirectMessage(this.currentUserId, user.id);
    this.form.controls['channelsControl'].reset();
  }

  openNewChannelDialog(): void {
    this.dialog
      .open(NewChannelDialogComponent)
      .afterClosed()
      .subscribe((result) => {
        if (this.currentUserId && result?.name) {
          this.createChannel(result.name);
        }
      });
  }

  private createChannel(name: string): void {
    const newChannel: Omit<Channel, 'id'> = {
      name: '#' + name,
      createdAt: Timestamp.now(),
      members: [this.currentUserId],
      threads: [],
    };
    this.channelService.addChannel(newChannel).then((docRef) => {
      console.log('New channel created with ID:', docRef.id);
    });
  }

  isActive(itemId: string): boolean {
    return this.selectedItemId === itemId;
  }
}
