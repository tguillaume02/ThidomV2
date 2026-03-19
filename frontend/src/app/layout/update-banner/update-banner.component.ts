import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { WebSocketService } from '@core/services/websocket.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-update-banner',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSnackBarModule,
  ],
  templateUrl: './update-banner.component.html',
  styleUrl: './update-banner.component.scss',
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class UpdateBannerComponent implements OnInit, OnDestroy {
  updateAvailable = false;
  updating = false;
  remoteMessage = '';
  remoteAuthor = '';
  remoteSha = '';

  private wsSub?: Subscription;

  constructor(
    private http: HttpClient,
    private wsService: WebSocketService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    // Check on load
    this.checkForUpdate();

    // Listen for WebSocket push notifications
    this.wsSub = this.wsService.messages$.subscribe(msg => {
      if (msg.type === 'update_available') {
        this.updateAvailable = true;
        this.remoteMessage = msg['remote_message'] || '';
        this.remoteAuthor = msg['remote_author'] || '';
        this.remoteSha = msg['remote_sha'] || '';
      }
    });
  }

  ngOnDestroy(): void {
    this.wsSub?.unsubscribe();
  }

  checkForUpdate(): void {
    this.http.get<any>(`${environment.apiUrl}/system/check-update`).subscribe({
      next: (res) => {
        if (res.update_available) {
          this.updateAvailable = true;
          this.remoteMessage = res.remote_message || '';
          this.remoteAuthor = res.remote_author || '';
          this.remoteSha = res.remote_sha || '';
        }
      },
    });
  }

  applyUpdate(): void {
    this.updating = true;
    this.http.post<any>(`${environment.apiUrl}/system/apply-update`, {}).subscribe({
      next: (res) => {
        this.updating = false;
        if (res.success) {
          this.updateAvailable = false;
          this.snackBar.open(
            'Mise a jour appliquee. Redemarrage necessaire.',
            'Recharger',
            { duration: 0 },
          ).onAction().subscribe(() => {
            window.location.reload();
          });
        } else {
          this.snackBar.open(
            'Erreur de mise a jour: ' + (res.output || 'Inconnue'),
            'Fermer',
            { duration: 8000 },
          );
        }
      },
      error: () => {
        this.updating = false;
        this.snackBar.open('Erreur de connexion', 'Fermer', { duration: 5000 });
      },
    });
  }

  dismiss(): void {
    this.updateAvailable = false;
  }
}
