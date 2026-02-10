import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '@core/services/auth.service';
import { WebSocketService } from '@core/services/websocket.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatBadgeModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  sidenavOpened = true;
  wsConnected = false;

  navItems: NavItem[] = [
    { label: 'Tableau de bord', icon: 'dashboard', route: '/dashboard' },
    { label: 'Pièces', icon: 'meeting_room', route: '/rooms' },
    { label: 'Appareils', icon: 'devices', route: '/devices' },
    { label: 'Plugins', icon: 'extension', route: '/plugins' },
    { label: 'Scénarios', icon: 'auto_fix_high', route: '/scenarios' },
    { label: 'Planification', icon: 'calendar_today', route: '/schedules' },
    { label: 'Historique', icon: 'timeline', route: '/history' },
    { label: 'Logs', icon: 'receipt_long', route: '/logs' },
  ];

  constructor(
    public authService: AuthService,
    private wsService: WebSocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.wsService.connect();
    this.wsService.connected$.subscribe(connected => {
      this.wsConnected = connected;
    });
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  logout(): void {
    this.authService.logout();
    this.wsService.disconnect();
    this.router.navigate(['/login']);
  }
}
