import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ScheduleService } from '@core/services/schedule.service';
import { DeviceService } from '@core/services/device.service';
import { Schedule, Device } from '@core/models/models';
import { ScheduleDialogComponent } from './schedule-dialog/schedule-dialog.component';

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  schedules: Schedule[];
}

@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatTooltipModule,
    MatButtonToggleModule,
  ],
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.scss',
})
export class SchedulesComponent implements OnInit {
  schedules: Schedule[] = [];
  devices: Device[] = [];
  loading = true;
  viewMode: 'list' | 'calendar' = 'list';

  // Calendar state
  currentMonth = new Date();
  calendarWeeks: CalendarDay[][] = [];
  weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  constructor(
    private scheduleService: ScheduleService,
    private deviceService: DeviceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadSchedules();
    this.deviceService.getDevices().subscribe(devices => this.devices = devices);
  }

  loadSchedules(): void {
    this.loading = true;
    this.scheduleService.getSchedules().subscribe({
      next: (schedules) => {
        this.schedules = schedules;
        this.loading = false;
        this.buildCalendar();
      },
      error: () => { this.loading = false; }
    });
  }

  // Calendar

  buildCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: CalendarDay[] = [];

    // Previous month padding
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, day: d.getDate(), isCurrentMonth: false, isToday: false, schedules: [] });
    }

    // Current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const dayOfWeek = date.getDay();
      const matchingSchedules = this.schedules.filter(s => {
        if (!s.enabled) return false;
        if (s.schedule_type === 'daily') return true;
        if (s.schedule_type === 'weekly' && s.days_of_week) {
          return s.days_of_week.includes(dayOfWeek);
        }
        return false;
      });
      days.push({
        date,
        day: d,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
        schedules: matchingSchedules,
      });
    }

    // Next month padding
    while (days.length % 7 !== 0) {
      const d = new Date(year, month + 1, days.length - lastDay.getDate() - startDay + 1);
      days.push({ date: d, day: d.getDate(), isCurrentMonth: false, isToday: false, schedules: [] });
    }

    // Split into weeks
    this.calendarWeeks = [];
    for (let i = 0; i < days.length; i += 7) {
      this.calendarWeeks.push(days.slice(i, i + 7));
    }
  }

  prevMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.buildCalendar();
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.buildCalendar();
  }

  goToday(): void {
    this.currentMonth = new Date();
    this.buildCalendar();
  }

  getMonthLabel(): string {
    return this.currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  // CRUD

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
      width: '720px',
      maxHeight: '90vh',
      data: { schedule: null, devices: this.devices },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scheduleService.createSchedule(result).subscribe({
          next: () => {
            this.loadSchedules();
            this.snackBar.open('Planification creee', 'OK', { duration: 3000 });
          },
        });
      }
    });
  }

  openEditDialog(schedule: Schedule): void {
    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
      width: '720px',
      maxHeight: '90vh',
      data: { schedule, devices: this.devices },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scheduleService.updateSchedule(schedule.id, result).subscribe({
          next: () => {
            this.loadSchedules();
            this.snackBar.open('Planification modifiee', 'OK', { duration: 3000 });
          },
        });
      }
    });
  }

  deleteSchedule(schedule: Schedule): void {
    if (confirm(`Supprimer la planification "${schedule.name}" ?`)) {
      this.scheduleService.deleteSchedule(schedule.id).subscribe({
        next: () => {
          this.loadSchedules();
          this.snackBar.open('Planification supprimee', 'OK', { duration: 3000 });
        },
      });
    }
  }

  toggleSchedule(schedule: Schedule): void {
    this.scheduleService.updateSchedule(schedule.id, { enabled: !schedule.enabled }).subscribe({
      next: (updated) => {
        const idx = this.schedules.findIndex(s => s.id === schedule.id);
        if (idx >= 0) this.schedules[idx] = updated;
        this.buildCalendar();
      },
    });
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      once: 'Une fois',
      daily: 'Quotidien',
      weekly: 'Hebdomadaire',
      monthly: 'Mensuel',
      cron: 'Cron',
    };
    return labels[type] || type;
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      once: 'event',
      daily: 'today',
      weekly: 'date_range',
      monthly: 'calendar_month',
      cron: 'schedule',
    };
    return icons[type] || 'schedule';
  }

  getDaysLabel(days: number[] | null): string {
    if (!days || days.length === 0) return '';
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return days.map(d => dayNames[d] || '?').join(', ');
  }

  formatDate(date: string | null): string {
    if (!date) return '—';
    return new Date(date).toLocaleString('fr-FR');
  }

  formatAction(action: any): string {
    if (!action) return '—';
    if (action.type === 'set_device_state') {
      const targets = action.targets || [];
      return `Appareil(s): ${targets.length} action(s)`;
    }
    if (action.type === 'send_notification') {
      return `Notification: ${action.config?.message || ''}`;
    }
    return action.type || 'Action';
  }
}
