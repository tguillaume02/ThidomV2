import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { environment } from '@environments/environment';

interface UpdateLog {
  status: 'idle' | 'running' | 'done' | 'failed';
  log: string[];
}

@Component({
  selector: 'app-update-progress-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './update-progress-dialog.component.html',
  styleUrl: './update-progress-dialog.component.scss',
})
export class UpdateProgressDialogComponent implements OnInit, OnDestroy {
  status: 'idle' | 'running' | 'done' | 'failed' = 'running';
  logLines: string[] = [];
  private pollTimer: any;

  @ViewChild('logContainer') logContainer?: ElementRef<HTMLDivElement>;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<UpdateProgressDialogComponent>,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.poll();
    this.pollTimer = setInterval(() => this.poll(), 2000);
  }

  ngOnDestroy(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
    }
  }

  get statusLabel(): string {
    switch (this.status) {
      case 'running': return 'Mise a jour en cours...';
      case 'done':    return 'Mise a jour terminee !';
      case 'failed':  return 'Echec de la mise a jour';
      default:        return 'En attente...';
    }
  }

  get statusIcon(): string {
    switch (this.status) {
      case 'running': return 'sync';
      case 'done':    return 'check_circle';
      case 'failed':  return 'error';
      default:        return 'hourglass_empty';
    }
  }

  get isFinished(): boolean {
    return this.status === 'done' || this.status === 'failed';
  }

  private poll(): void {
    this.http.get<UpdateLog>(`${environment.apiUrl}/system/update-log`).subscribe({
      next: (res) => {
        this.status = res.status as any;
        this.logLines = res.log;
        this.scrollToBottom();
        if (this.isFinished && this.pollTimer) {
          clearInterval(this.pollTimer);
          this.pollTimer = null;
          this.dialogRef.disableClose = false;
        }
      },
      error: () => {
        // Backend may be restarting during update — keep polling
      },
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.logContainer?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 50);
  }

  reload(): void {
    window.location.reload();
  }
}
