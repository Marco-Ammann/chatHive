import { Component, HostListener } from '@angular/core';
import { ChatMainComponent } from './chat-main/chat-main.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { CommonModule } from '@angular/common';
import { ThreadPanelComponent } from './thread-panel/thread-panel.component';
import { LayoutService } from '../shared/services/layout.service';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ChatMainComponent,
    SidenavComponent,
    ThreadPanelComponent,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  currentDevice: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  currentView: 'sidenav' | 'chat' | 'thread' = 'sidenav'; // Default to sidenav for mobile
  isThreadPanelOpen: boolean = false; // Tracks if thread panel is open

  constructor(private layoutService: LayoutService) {}

  ngOnInit() {
    this.checkDevice();

    // Subscribe to selected channel
    this.layoutService.selectedChannel$.subscribe((channel) => {
      if (channel) {
        this.switchToChat();
      }
    });

    // Subscribe to thread panel visibility
    this.layoutService.isThreadPanelVisible$.subscribe((isVisible) => {
      this.isThreadPanelOpen = isVisible;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkDevice();
  }

  checkDevice() {
    const width = window.innerWidth;
    if (width < 768) {
      this.currentDevice = 'mobile';
      this.currentView = 'sidenav';
    } else if (width < 1024) {
      this.currentDevice = 'tablet';
      this.currentView = 'chat';
    } else {
      this.currentDevice = 'desktop';
      this.currentView = 'chat';
    }
  }

  switchToChat() {
    if (this.currentDevice === 'mobile') {
      this.currentView = 'chat';
    }
  }

  openThreadPanel() {
    if (this.currentDevice === 'mobile') {
      this.currentView = 'thread'; // Switch to thread view on mobile
    }

    // Use LayoutService to open the thread panel
    this.layoutService.toggleThreadPanel(true);
  }

  closeThreadPanel() {
    // Use LayoutService to close the thread panel
    this.layoutService.toggleThreadPanel(false);
  }
}
