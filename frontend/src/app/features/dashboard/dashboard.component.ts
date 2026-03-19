import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { Subscription } from 'rxjs';
import { RoomService } from '@core/services/room.service';
import { DeviceService } from '@core/services/device.service';
import { WebSocketService } from '@core/services/websocket.service';
import { Room, Device } from '@core/models/models';
import { WeatherWidgetComponent } from './widgets/weather-widget/weather-widget.component';
import { BourseWidgetComponent } from './widgets/bourse-widget/bourse-widget.component';
import { ThermostatWidgetComponent } from './widgets/thermostat-widget/thermostat-widget.component';
import { CoverWidgetComponent } from './widgets/cover-widget/cover-widget.component';
import { CameraWidgetComponent } from './widgets/camera-widget/camera-widget.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatSliderModule,
    WeatherWidgetComponent,
    BourseWidgetComponent,
    ThermostatWidgetComponent,
    CoverWidgetComponent,
    CameraWidgetComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  rooms: Room[] = [];
  allDevices: Device[] = [];
  selectedRoomId: number | null = null;
  loading = true;
  togglingDeviceIds = new Set<number>();
  private wsSub?: Subscription;

  get totalDevices(): number { return this.allDevices.length; }
  get onlineDevices(): number { return this.allDevices.filter(d => d.state?.power === 'on').length; }
  get totalRooms(): number { return this.rooms.length; }

  get displayedDevices(): Device[] {
    if (this.selectedRoomId === null) {
      return this.allDevices.filter(d => d.is_visible);
    }
    return this.allDevices.filter(d => d.room_id === this.selectedRoomId && d.is_visible);
  }

  get roomsWithDevices(): { room: Room; devices: Device[] }[] {
    const visible = this.displayedDevices;
    const roomMap = new Map<number, Device[]>();
    for (const d of visible) {
      const arr = roomMap.get(d.room_id) || [];
      arr.push(d);
      roomMap.set(d.room_id, arr);
    }
    return this.rooms
      .filter(r => roomMap.has(r.id))
      .map(r => ({ room: r, devices: roomMap.get(r.id)! }));
  }

  constructor(
    private roomService: RoomService,
    private deviceService: DeviceService,
    private wsService: WebSocketService,
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.wsSub = this.wsService.messages$.subscribe(msg => {
      if (msg.type === 'device_state_update') {
        const idx = this.allDevices.findIndex(d => d.id === msg['device_id']);
        if (idx >= 0) {
          this.allDevices[idx] = {
            ...this.allDevices[idx],
            state: msg['state'],
          };
          this.allDevices = [...this.allDevices];
          this.togglingDeviceIds.delete(msg['device_id']);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.wsSub?.unsubscribe();
  }

  loadData(): void {
    this.loading = true;
    this.roomService.getRooms().subscribe(rooms => {
      this.rooms = rooms;
    });
    this.deviceService.getDevices().subscribe(devices => {
      this.allDevices = devices;
      this.loading = false;
    });
  }

  selectRoom(roomId: number | null): void {
    this.selectedRoomId = this.selectedRoomId === roomId ? null : roomId;
  }

  getRoomName(roomId: number): string {
    return this.rooms.find(r => r.id === roomId)?.name || 'Inconnue';
  }

  getRoomColor(roomId: number): string {
    return this.rooms.find(r => r.id === roomId)?.color || '#4CAF50';
  }

  toggleDevice(device: Device): void {
    if (this.togglingDeviceIds.has(device.id)) return;
    this.togglingDeviceIds.add(device.id);
    const action = device.state?.power === 'on' ? 'turn_off' : 'turn_on';
    this.deviceService.executeAction(device.id, action).subscribe({
      next: () => {
        // Safety timeout: if no WebSocket confirmation within 10s, clear toggling
        setTimeout(() => this.togglingDeviceIds.delete(device.id), 10000);
      },
      error: () => {
        this.togglingDeviceIds.delete(device.id);
      }
    });
  }

  // ---- Cover position ----

  onCoverPositionChange(device: Device, position: number): void {
    this.deviceService.updateState(device.id, { position, power: position > 0 ? 'on' : 'off' }).subscribe({
      next: updated => this.updateDevice(updated),
    });
  }

  // ---- Thermostat ----

  onTargetTempChange(device: Device, temp: number): void {
    device.state = { ...device.state, target_temperature: temp };
    this.deviceService.updateState(device.id, { target_temperature: temp }).subscribe({
      next: updated => this.updateDevice(updated),
    });
  }

  // ---- Thermostat temperature resolution ----

  getThermostatCurrentTemp(device: Device): number | null {
    if (device.linked_sensor_id) {
      const sensor = this.allDevices.find(d => d.id === device.linked_sensor_id);
      if (sensor?.state?.temperature !== undefined) return sensor.state.temperature;
    }
    if (device.state?.temperature !== undefined) return device.state.temperature;
    const roomSensor = this.allDevices.find(
      d => d.room_id === device.room_id && d.id !== device.id
        && d.device_type === 'sensor' && d.state?.temperature !== undefined
    );
    return roomSensor ? roomSensor.state.temperature : null;
  }

  getThermostatTempSource(device: Device): string {
    if (device.linked_sensor_id) {
      const sensor = this.allDevices.find(d => d.id === device.linked_sensor_id);
      if (sensor?.state?.temperature !== undefined) return sensor.name;
      return 'Capteur lie introuvable';
    }
    if (device.state?.temperature !== undefined) return '';
    const roomSensor = this.allDevices.find(
      d => d.room_id === device.room_id && d.id !== device.id
        && d.device_type === 'sensor' && d.state?.temperature !== undefined
    );
    return roomSensor ? roomSensor.name : '';
  }

  // ---- Device type checks ----

  isDeviceOn(device: Device): boolean { return device.state?.power === 'on'; }

  isToggleable(device: Device): boolean {
    return ['light', 'switch'].indexOf(device.device_type) !== -1;
  }

  isCover(device: Device): boolean { return device.device_type === 'cover'; }
  isThermostat(device: Device): boolean { return device.device_type === 'thermostat'; }
  isCamera(device: Device): boolean { return device.device_type === 'camera'; }

  isWeatherSensor(device: Device): boolean {
    if (device.device_type !== 'sensor' || !device.state) return false;
    const s = device.state;
    return s['provider'] === 'meteofrance' || s['provider'] === 'openweathermap'
      || s['weather_desc'] !== undefined || s['condition'] !== undefined
      || s['vigilance'] !== undefined || s['season'] !== undefined;
  }

  isBourseDevice(device: Device): boolean {
    if (device.device_type !== 'sensor' || !device.state) return false;
    return device.state['symbol'] !== undefined && device.state['price'] !== undefined;
  }

  // ---- Helpers ----

  private updateDevice(updated: Device): void {
    const idx = this.allDevices.findIndex(d => d.id === updated.id);
    if (idx >= 0) { this.allDevices[idx] = updated; }
  }

  getDeviceIcon(device: Device): string {
    if (device.icon && device.icon !== 'devices') return device.icon;
    const icons: Record<string, string> = {
      light: 'lightbulb', switch: 'toggle_on', sensor: 'sensors',
      thermostat: 'thermostat', cover: 'blinds', lock: 'lock',
      camera: 'videocam', variable: 'data_object',
    };
    return icons[device.device_type] || 'devices';
  }

  getStateLabel(device: Device): string {
    if (!device.state || Object.keys(device.state).length === 0) return 'Hors ligne';
    const s = device.state;
    const parts: string[] = [];

    if (device.device_type === 'thermostat') {
      const currentTemp = this.getThermostatCurrentTemp(device);
      if (currentTemp !== null) parts.push(`${currentTemp}°C`);
      if (s['target_temperature'] !== undefined) parts.push(`Consigne ${s['target_temperature']}°C`);
      if (s['heating'] === true) parts.push('🔥 Chauffe');
      else if (s['heating'] === false) parts.push('En veille');
      if (parts.length > 0) return parts.join(' · ');
      return 'Pas de capteur';
    }

    if (s['temperature'] !== undefined) parts.push(`${s['temperature']}°C`);
    if (s['humidity'] !== undefined) parts.push(`${s['humidity']}%`);

    if (device.device_type === 'cover' && s['position'] !== undefined) {
      return s['position'] === 0 ? 'Ferme' : s['position'] === 100 ? 'Ouvert' : `Ouvert ${s['position']}%`;
    }
    if (s['locked'] !== undefined) return s['locked'] ? 'Verrouille' : 'Deverrouille';
    if (device.device_type === 'camera') {
      if (s['recording']) return 'Enregistrement';
      return s['power'] === 'on' ? 'En ligne' : 'Hors ligne';
    }
    if (s['smoke'] !== undefined) return s['smoke'] ? 'ALERTE FUMEE' : 'Normal';
    if (s['occupancy'] !== undefined) return s['occupancy'] ? 'Mouvement detecte' : 'Aucun mouvement';
    if (s['contact'] !== undefined) return s['contact'] ? 'Ferme' : 'Ouvert';

    if (parts.length > 0) return parts.join(' · ');
    if (s['power']) return s['power'] === 'on' ? 'Allume' : 'Eteint';
    return 'Actif';
  }

  getStateDetails(device: Device): string[] {
    if (!device.state) return [];
    const s = device.state;
    const details: string[] = [];

    if (s['brightness'] !== undefined && s['brightness'] > 0) details.push(`Luminosite ${s['brightness']}%`);
    if (s['color_temp'] !== undefined) details.push(`${s['color_temp']}K`);
    if (s['consumption'] !== undefined && s['consumption'] > 0) details.push(`${s['consumption']} W`);
    if (device.device_type === 'thermostat') {
      if (s['humidity'] !== undefined) details.push(`Humidite ${s['humidity']}%`);
      if (device.hysteresis != null && device.hysteresis > 0) details.push(`Hysteresis ±${device.hysteresis}°C`);
    }
    return details;
  }

  getBatteryLevel(device: Device): number | null { return device.state?.battery ?? null; }

  getBatteryIcon(level: number): string {
    if (level > 80) return 'battery_full';
    if (level > 60) return 'battery_5_bar';
    if (level > 40) return 'battery_4_bar';
    if (level > 20) return 'battery_2_bar';
    return 'battery_alert';
  }

  getBatteryClass(level: number): string {
    if (level > 60) return 'battery-good';
    if (level > 20) return 'battery-medium';
    return 'battery-low';
  }

  getToggleIcon(device: Device): string { return 'power_settings_new'; }
  getToggleTooltip(device: Device): string { return this.isDeviceOn(device) ? 'Eteindre' : 'Allumer'; }
}
