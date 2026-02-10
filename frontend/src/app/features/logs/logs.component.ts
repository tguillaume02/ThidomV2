import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { LogService } from '@core/services/log.service';
import { LogEntry } from '@core/models/models';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatChipsModule,
    MatPaginatorModule,
  ],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss',
})
export class LogsComponent implements OnInit {
  logs: LogEntry[] = [];
  loading = true;
  filterLevel = '';
  filterCategory = '';
  limit = 50;
  offset = 0;
  totalLogs = 0;

  levels = ['DEBUG', 'INFO', 'WARNING', 'ERROR'];
  categories = ['user_action', 'system', 'scenario', 'error'];

  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading = true;
    this.logService.getLogs({
      level: this.filterLevel || undefined,
      category: this.filterCategory || undefined,
      limit: this.limit,
      offset: this.offset,
    }).subscribe({
      next: (logs) => {
        this.logs = logs;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.loadLogs();
  }

  resetFilters(): void {
    this.filterLevel = '';
    this.filterCategory = '';
    this.offset = 0;
    this.loadLogs();
  }

  getLevelIcon(level: string): string {
    switch (level) {
      case 'ERROR': return 'error';
      case 'WARNING': return 'warning';
      case 'INFO': return 'info';
      case 'DEBUG': return 'bug_report';
      default: return 'circle';
    }
  }

  getLevelClass(level: string): string {
    return `level-${level.toLowerCase()}`;
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      user_action: 'Utilisateur',
      system: 'Système',
      scenario: 'Scénario',
      error: 'Erreur',
    };
    return labels[category] || category;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('fr-FR');
  }
}
