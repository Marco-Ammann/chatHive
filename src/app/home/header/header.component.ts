import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentUser: any;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.currentUser = {
          id: user.uid,
          username: user.displayName ?? '',
          email: user.email ?? '',
          avatarUrl: user.photoURL ?? '',
          status: 'online', // You can set the status dynamically
        };
      } else {
        this.currentUser = null;
      }
      console.log('Current user:', this.currentUser);
    });
  }
}
