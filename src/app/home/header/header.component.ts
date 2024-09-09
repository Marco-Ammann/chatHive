import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatIconModule,
    RouterLinkActive,
    RouterLink,
    MatCardModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentUser: any;
  private awayTimeout: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.getCurrentUser();
    this.setupWindowFocusEvents();
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
      } else {
        this.currentUser = null;
      }
    });
  }

  // Event-Listener für Fenster-Verlassen (blur) und Zurückkehren (focus)
  setupWindowFocusEvents() {
    window.addEventListener('blur', () => {
      this.startAwayTimer();
    });

    window.addEventListener('focus', () => {
      this.cancelAwayTimer();
      this.changeStatus('online');
    });
  }

  startAwayTimer() {
    // Timer von 5 Sekunden, bevor der Status auf "away" gesetzt wird
    this.awayTimeout = setTimeout(() => {
      this.changeStatus('away');
    }, 10000);
  }

  cancelAwayTimer() {
    // Wenn der Benutzer zurückkehrt, den Timer stoppen
    if (this.awayTimeout) {
      clearTimeout(this.awayTimeout);
      this.awayTimeout = null;
    }
  }

  changeStatus(newStatus: string) {
    if (this.currentUser) {
      console.log(
        'Changing status to',
        newStatus,
        'for user',
        this.currentUser.id
      );
      this.authService
        .updateUserStatus(this.currentUser.id, newStatus)
        .subscribe({
          next: () => {
            this.currentUser.status = newStatus; // Update UI after changing status
          },
          error: (err) => {
            console.error('Failed to update status', err);
          },
        });
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Handle successful logout
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
      },
    });
  }
}
