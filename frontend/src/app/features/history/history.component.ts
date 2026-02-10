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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HistoryService } from '@core/services/history.service';
import { DeviceService } from '@core/services/device.service';
import { Device, HistoryData } from '@core/models/models';

@Component({
  selector: 'app-history',
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
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent implements OnInit {
  devices: Device[] = [];
  historizableDevices: Device[] = [];
  selectedDeviceId: number | null = null;
  selectedField = '';
  interval = '1h';
  historyData: HistoryData | null = null;
  loading = false;

  intervals = [
    { value: '5m', label: '5 minutes' },
    { value: '15m', label: '15 minutes' },
    { value: '1h', label: '1 heure' },
    { value: '6h', label: '6 heures' },
    { value: '1d', label: '1 jour' },
  ];

  constructor(
    private historyService: HistoryService,
    private deviceService: DeviceService,
  ) {}

  ngOnInit(): void {
    this.deviceService.getDevices().subscribe(devices => {
      this.devices = devices;
      this.historizableDevices = devices.filter(d => d.historize);
    });
  }

  loadHistory(): void {
    if (!this.selectedDeviceId) return;
    this.loading = true;

    const now = new Date();
    const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    this.historyService.getHistory(
      this.selectedDeviceId,
      this.selectedField || undefined,
      start.toISOString(),
      now.toISOString(),
      undefined,
      this.interval
    ).subscribe({
      next: (data) => {
        this.historyData = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getMaxValue(): number {
    if (!this.historyData?.points.length) return 0;
    return Math.max(...this.historyData.points.map(p => Number(p.value) || 0));
  }

  getMinValue(): number {
    if (!this.historyData?.points.length) return 0;
    return Math.min(...this.historyData.points.map(p => Number(p.value) || 0));
  }

  getAvgValue(): number {
    if (!this.historyData?.points.length) return 0;
    const sum = this.historyData.points.reduce((acc, p) => acc + (Number(p.value) || 0), 0);
    return Math.round((sum / this.historyData.points.length) * 10) / 10;
  }

  getBarHeight(value: any): number {
    const max = this.getMaxValue();
    const min = this.getMinValue();
    if (max === min) return 50;
    return ((Number(value) - min) / (max - min)) * 100;
  }

  formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
}
