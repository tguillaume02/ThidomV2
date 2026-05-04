import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { environment } from '@environments/environment';
import { UpdateProgressDialogComponent } from './update-progress-dialog/update-progress-dialog.component';

interface VersionInfo {
  tag: string;
  sha: string;
  built: string;
  mode: string;
}

interface UpdateCheckResult {
  update_available: boolean;
  local_tag?: string;
  local_sha?: string;
  remote_sha?: string;
  remote_message?: string;
  remote_author?: string;
  remote_date?: string;
  last_check?: string;
  error?: string;
}

interface ApplyResult {
  success: boolean;
  output: string;
  restart_required: boolean;
}

@Component({
  selector: 'app-system',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDividerModule,
    MatDialogModule,
  ],
  templateUrl: './system.component.html',
  styleUrl: './system.component.scss',
})
export class SystemComponent implements OnInit {
  version: VersionInfo | null = null;
  updateCheck: UpdateCheckResult | null = null;
  checking = false;
  updating = false;

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadVersion();
    this.checkForUpdate();
  }

  loadVersion(): void {
    this.http.get<VersionInfo>(`${this.apiUrl}/system/version`).subscribe({
      next: v => this.version = v,
    });
  }

  checkForUpdate(): void {
    this.checking = true;
    this.http.get<UpdateCheckResult>(`${this.apiUrl}/system/check-update`).subscribe({
      next: res => {
        this.updateCheck = res;
        this.checking = false;
      },
      error: () => {
        this.checking = false;
        this.snackBar.open('Erreur lors de la verification', 'Fermer', { duration: 4000 });
      },
    });
  }

  applyUpdate(): void {
    if (!confirm('Lancer la mise a jour ? Le service sera redemarré automatiquement.')) return;
    this.updating = true;
    this.http.post<ApplyResult>(`${this.apiUrl}/system/apply-update`, {}).subscribe({
      next: res => {
        this.updating = false;
        if (res.success) {
          this.dialog.open(UpdateProgressDialogComponent, {
            width: '700px',
            disableClose: true,
          });
        } else {
          this.snackBar.open('Erreur : ' + res.output, 'Fermer', { duration: 8000 });
        }
      },
      error: () => {
        this.updating = false;
        this.snackBar.open('Erreur de connexion', 'Fermer', { duration: 5000 });
      },
    });
  }
}
