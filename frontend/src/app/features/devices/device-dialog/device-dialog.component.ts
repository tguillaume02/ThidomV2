import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Device, Room, Plugin } from '@core/models/models';

@Component({
  selector: 'app-device-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
  ],
  templateUrl: './device-dialog.component.html',
  styleUrl: './device-dialog.component.scss',
})
export class DeviceDialogComponent implements OnInit {
  name = '';
  deviceType = '';
  icon = '';
  roomId: number | null = null;
  pluginId: number | null = null;
  linkedSensorId: number | null = null;
  config: any = {};
  isVisible = true;
  historize = false;
  notifyOnStateChange = false;
  hysteresis: number | null = null;
  autoOffDelay: number | null = null;
  refreshInterval: number | null = null;

  // Refresh interval UI state
  refreshMode: 'preset' | 'custom' = 'preset';
  customRefreshValue: number | null = null;
  customRefreshUnit: 'seconds' | 'minutes' | 'hours' = 'minutes';

  rooms: Room[];
  plugins: Plugin[];
  allDevices: Device[];
  isEdit: boolean;

  selectedPlugin: Plugin | null = null;
  configFields: any[] = [];

  deviceTypes = [
    { value: 'light', label: 'Lumière', icon: 'lightbulb' },
    { value: 'switch', label: 'Interrupteur', icon: 'toggle_on' },
    { value: 'sensor', label: 'Capteur', icon: 'sensors' },
    { value: 'motion', label: 'Détecteur de mouvement', icon: 'motion_sensor_active' },
    { value: 'relay', label: 'Relais', icon: 'electrical_services' },
    { value: 'thermostat', label: 'Thermostat', icon: 'thermostat' },
    { value: 'cover', label: 'Volet', icon: 'blinds' },
    { value: 'lock', label: 'Serrure', icon: 'lock' },
    { value: 'camera', label: 'Caméra', icon: 'videocam' },
    { value: 'variable', label: 'Variable', icon: 'data_object' },
  ];

  refreshPresets = [
    { value: 5, label: '5 sec' },
    { value: 30, label: '30 sec' },
    { value: 60, label: '1 min' },
    { value: 300, label: '5 min' },
    { value: 900, label: '15 min' },
    { value: 1800, label: '30 min' },
    { value: 3600, label: '1 heure' },
  ];

  get showRefreshInterval(): boolean {
    return this.selectedPlugin?.needs_polling === true;
  }

  get temperatureSensors(): Device[] {
    return (this.allDevices || []).filter(
      d => d.device_type === 'sensor' && d.state?.temperature !== undefined
    );
  }

  /** Human-readable label for the current refresh interval */
  get refreshDisplayLabel(): string {
    const seconds = this.refreshInterval;
    if (seconds == null) return '';
    if (seconds < 60) return `${seconds} sec`;
    if (seconds < 3600) return `${seconds / 60} min`;
    return `${seconds / 3600} h`;
  }

  constructor(
    public dialogRef: MatDialogRef<DeviceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { device: Device | null; rooms: Room[]; plugins: Plugin[]; devices?: Device[] }
  ) {
    this.isEdit = !!data.device;
    this.rooms = data.rooms;
    this.plugins = data.plugins;
    this.allDevices = data.devices || [];

    if (data.device) {
      this.name = data.device.name;
      this.deviceType = data.device.device_type;
      this.icon = data.device.icon;
      this.roomId = data.device.room_id;
      this.pluginId = data.device.plugin_id;
      this.linkedSensorId = data.device.linked_sensor_id || null;
      this.config = { ...(data.device.config || {}) };
      this.isVisible = data.device.is_visible;
      this.historize = data.device.historize;
      this.notifyOnStateChange = data.device.notify_on_state_change || false;
      this.hysteresis = data.device.hysteresis ?? null;
      this.autoOffDelay = data.device.auto_off_delay ?? null;
      this.refreshInterval = this.config.refresh_interval ?? null;
      this._initRefreshFromSeconds(this.refreshInterval);
    }
  }

  ngOnInit(): void {
    if (this.pluginId) {
      this.onPluginChange();
    }
  }

  onPluginChange(): void {
    this.selectedPlugin = this.plugins.find(p => p.id === this.pluginId) || null;
    if (this.selectedPlugin?.config_schema?.properties) {
      this.configFields = Object.entries(this.selectedPlugin.config_schema.properties)
        .filter(([key]) => key !== 'refresh_interval')
        .map(([key, schema]: [string, any]) => ({
          key,
          label: schema.title || key,
          type: schema.type || 'string',
          description: schema.description || '',
          enum: schema.enum || null,
          default: schema.default,
        }));
      if (!this.isEdit && this.selectedPlugin.default_config) {
        this.config = { ...this.selectedPlugin.default_config };
        if (this.showRefreshInterval && this.refreshInterval == null) {
          this.refreshInterval = this.config.refresh_interval ?? 900;
          this._initRefreshFromSeconds(this.refreshInterval);
        }
      }
    } else {
      this.configFields = [];
    }
  }

  selectPreset(seconds: number): void {
    this.refreshInterval = seconds;
    this.refreshMode = 'preset';
  }

  isPresetSelected(seconds: number): boolean {
    return this.refreshMode === 'preset' && this.refreshInterval === seconds;
  }

  switchToCustom(): void {
    this.refreshMode = 'custom';
    if (this.customRefreshValue == null) {
      this.customRefreshValue = 5;
      this.customRefreshUnit = 'minutes';
    }
    this._applyCustomToInterval();
  }

  onCustomValueChange(): void {
    this._applyCustomToInterval();
  }

  onCustomUnitChange(): void {
    this._applyCustomToInterval();
  }

  private _applyCustomToInterval(): void {
    if (this.customRefreshValue == null || this.customRefreshValue <= 0) return;
    const multipliers = { seconds: 1, minutes: 60, hours: 3600 };
    this.refreshInterval = Math.round(this.customRefreshValue * multipliers[this.customRefreshUnit]);
  }

  private _initRefreshFromSeconds(seconds: number | null): void {
    if (seconds == null) {
      this.refreshMode = 'preset';
      return;
    }
    const isPreset = this.refreshPresets.some(p => p.value === seconds);
    if (isPreset) {
      this.refreshMode = 'preset';
    } else {
      this.refreshMode = 'custom';
      if (seconds >= 3600 && seconds % 3600 === 0) {
        this.customRefreshValue = seconds / 3600;
        this.customRefreshUnit = 'hours';
      } else if (seconds >= 60 && seconds % 60 === 0) {
        this.customRefreshValue = seconds / 60;
        this.customRefreshUnit = 'minutes';
      } else {
        this.customRefreshValue = seconds;
        this.customRefreshUnit = 'seconds';
      }
    }
  }

  save(): void {
    if (!this.name.trim() || !this.roomId || !this.pluginId) return;
    const config = { ...this.config };
    if (this.showRefreshInterval && this.refreshInterval != null) {
      config.refresh_interval = this.refreshInterval;
    }
    this.dialogRef.close({
      name: this.name.trim(),
      device_type: this.deviceType,
      icon: this.icon,
      room_id: this.roomId,
      plugin_id: this.pluginId,
      linked_sensor_id: this.deviceType === 'thermostat' ? this.linkedSensorId : null,
      config,
      is_visible: this.isVisible,
      historize: this.historize,
      notify_on_state_change: this.notifyOnStateChange,
      hysteresis: this.deviceType === 'thermostat' ? this.hysteresis : null,
      auto_off_delay: this.autoOffDelay || null,
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
