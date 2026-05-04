import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';
import { DeviceService } from '@core/services/device.service';
import { RoomService } from '@core/services/room.service';
import { PluginService } from '@core/services/plugin.service';
import { WebSocketService } from '@core/services/websocket.service';
import { Device, Room, Plugin } from '@core/models/models';
import { DeviceDialogComponent } from './device-dialog/device-dialog.component';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatMenuModule,
    MatChipsModule,
    MatTooltipModule,
    MatSlideToggleModule,
  ],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss',
})
export class DevicesComponent implements OnInit, OnDestroy {
  devices: Device[] = [];
  rooms: Room[] = [];
  plugins: Plugin[] = [];
  loading = true;
  filterRoom: number | null = null;
  filterType = '';
  searchText = '';
  togglingDeviceIds = new Set<number>();
  private subscriptions = new Subscription();
  private wsSub?: Subscription;

  get filteredDevices(): Device[] {
    return this.devices.filter(d => {
      if (this.filterRoom && d.room_id !== this.filterRoom) return false;
      if (this.filterType && d.device_type !== this.filterType) return false;
      if (this.searchText && !d.name.toLowerCase().includes(this.searchText.toLowerCase())) return false;
      return true;
    });
  }

  get deviceTypes(): string[] {
    return [...new Set(this.devices.map(d => d.device_type))];
  }

  constructor(
    private deviceService: DeviceService,
    private roomService: RoomService,
    private pluginService: PluginService,
    private wsService: WebSocketService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.wsSub = this.wsService.messages$.subscribe(msg => {
      if (msg.type === 'device_state_update') {
        const idx = this.devices.findIndex(d => d.id === msg['device_id']);
        if (idx >= 0) {
          this.devices[idx] = { ...this.devices[idx], state: msg['state'] };
          this.devices = [...this.devices];
          this.togglingDeviceIds.delete(msg['device_id']);
        }
      }
    });
  }

  loadData(): void {
    this.loading = true;
    this.subscriptions.add(
      this.roomService.getRooms().subscribe(rooms => this.rooms = rooms)
    );
    this.subscriptions.add(
      this.pluginService.getPlugins().subscribe(plugins => this.plugins = plugins)
    );
    this.subscriptions.add(
      this.deviceService.getDevices().subscribe({
        next: (devices) => {
          this.devices = devices;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Erreur de chargement des appareils', 'Fermer', { duration: 3000 });
        }
      })
    );
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(DeviceDialogComponent, {
      width: '720px',
      maxHeight: '90vh',
      data: { device: null, rooms: this.rooms, plugins: this.plugins, devices: this.devices },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deviceService.createDevice(result).subscribe({
          next: () => {
            this.loadData();
            this.snackBar.open('Appareil créé', 'OK', { duration: 3000 });
          },
          error: () => this.snackBar.open('Erreur lors de la création', 'Fermer', { duration: 3000 })
        });
      }
    });
  }

  openEditDialog(device: Device): void {
    const dialogRef = this.dialog.open(DeviceDialogComponent, {
      width: '720px',
      maxHeight: '90vh',
      data: { device, rooms: this.rooms, plugins: this.plugins, devices: this.devices },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deviceService.updateDevice(device.id, result).subscribe({
          next: () => {
            this.loadData();
            this.snackBar.open('Appareil modifié', 'OK', { duration: 3000 });
          },
          error: () => this.snackBar.open('Erreur lors de la modification', 'Fermer', { duration: 3000 })
        });
      }
    });
  }

  deleteDevice(device: Device): void {
    if (confirm(`Supprimer l'appareil "${device.name}" ?`)) {
      this.deviceService.deleteDevice(device.id).subscribe({
        next: () => {
          this.loadData();
          this.snackBar.open('Appareil supprimé', 'OK', { duration: 3000 });
        },
        error: () => this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 })
      });
    }
  }

  getRoomName(roomId: number): string {
    return this.rooms.find(r => r.id === roomId)?.name || '—';
  }

  getPluginName(pluginId: number): string {
    return this.plugins.find(p => p.id === pluginId)?.name || '—';
  }

  getDeviceIcon(device: Device): string {
    const icons: Record<string, string> = {
      light: 'lightbulb', switch: 'toggle_on', sensor: 'sensors',
      thermostat: 'thermostat', cover: 'blinds', lock: 'lock',
      camera: 'videocam', variable: 'data_object',
    };
    return device.icon || icons[device.device_type] || 'devices';
  }

  toggleDevice(device: Device): void {
    if (this.togglingDeviceIds.has(device.id)) return;
    this.togglingDeviceIds.add(device.id);
    const action = device.state?.power === 'on' ? 'turn_off' : 'turn_on';
    this.deviceService.executeAction(device.id, action).subscribe({
      next: () => {
        setTimeout(() => this.togglingDeviceIds.delete(device.id), 10000);
      },
      error: () => {
        this.togglingDeviceIds.delete(device.id);
      }
    });
  }

  isOn(device: Device): boolean {
    return device.state?.power === 'on';
  }

  isToggleable(device: Device): boolean {
    return ['light', 'switch'].indexOf(device.device_type) !== -1;
  }

  getStateText(device: Device): string {
    const s = device.state || {};

    if (s.temperature !== undefined) return `${s.temperature}°C`;
    if (s.humidity !== undefined) return `${s.humidity}%`;
    if (s.value !== undefined) {
      const v = typeof s.value === 'number' ? s.value.toFixed(2) : s.value;
      return s.currency ? `${v} ${s.currency}` : `${v}`;
    }
    if (s.price !== undefined) {
      const p = typeof s.price === 'number' ? s.price.toFixed(2) : s.price;
      return s.currency ? `${p} ${s.currency}` : `${p}`;
    }

    return '';
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.wsSub?.unsubscribe();
  }

  formatLastSeen(isoDate: string): string {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'A l\'instant';
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    if (diffHour < 24) return `Il y a ${diffHour}h`;
    if (diffDay < 7) return `Il y a ${diffDay}j`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  }
}
