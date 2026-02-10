import { Component, OnInit } from '@angular/core';
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
import { DeviceService } from '@core/services/device.service';
import { RoomService } from '@core/services/room.service';
import { PluginService } from '@core/services/plugin.service';
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
export class DevicesComponent implements OnInit {
  devices: Device[] = [];
  rooms: Room[] = [];
  plugins: Plugin[] = [];
  loading = true;
  filterRoom: number | null = null;
  filterType = '';
  searchText = '';

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
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.roomService.getRooms().subscribe(rooms => this.rooms = rooms);
    this.pluginService.getPlugins().subscribe(plugins => this.plugins = plugins);
    this.deviceService.getDevices().subscribe({
      next: (devices) => {
        this.devices = devices;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Erreur de chargement des appareils', 'Fermer', { duration: 3000 });
      }
    });
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
    const action = device.state?.power === 'on' ? 'turn_off' : 'turn_on';
    this.deviceService.executeAction(device.id, action).subscribe(updated => {
      const idx = this.devices.findIndex(d => d.id === device.id);
      if (idx >= 0) this.devices[idx] = updated;
    });
  }

  isOn(device: Device): boolean {
    return device.state?.power === 'on';
  }
}
