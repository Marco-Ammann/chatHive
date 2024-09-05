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
    MatInputModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit {
  channelListForm: FormGroup;
  channels$: Observable<Channel[] | null>;
  channelListControl = new FormControl('');
  channelFormControl = new FormControl('');
  constructor(
    private messageService: MessageService,
    private channelService: ChannelService
  ) {
    this.channels$ = this.channelService.channels$;
    this.channelListForm = new FormGroup({
      name: new FormControl('channelListControl'),
    });
  }

  ngOnInit(): void {
    // Additional logic, if needed
  }

  addChannel() {
    const channel: Channel = {
      id: '',
      name: this.channelFormControl.value ?? '',
      createdAt: Timestamp.now(),
      members: ['user1', 'user2'],
      threads: [],
    };
    this.channelService.addChannel(channel);
  }
}
