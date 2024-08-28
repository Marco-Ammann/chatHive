import { Component, OnInit } from '@angular/core';
import { MockFirebaseService } from '../../shared/services/mock-firebase.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentUser: any;

  constructor(private mockFirebaseService: MockFirebaseService) {}

  ngOnInit() {
    this.mockFirebaseService.getMockData().subscribe((data) => {
      this.currentUser = this.mockFirebaseService.getCurrentUser(data);
    });
  }
}
