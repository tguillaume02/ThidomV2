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
    { value: 'thermostat', label: 'Thermostat', icon: 'thermostat' },
    { value: 'cover', label: 'Volet', icon: 'blinds' },
    { value: 'lock', label: 'Serrure', icon: 'lock' },
    { value: 'camera', label: 'Caméra', icon: 'videocam' },
    { value: 'variable', label: 'Variable', icon: 'data_object' },
  ];

  get temperatureSensors(): Device[] {
    return (this.allDevices || []).filter(
      d => d.device_type === 'sensor' && d.state?.temperature !== undefined
    );
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
      this.configFields = Object.entries(this.selectedPlugin.config_schema.properties).map(
        ([key, schema]: [string, any]) => ({
          key,
          label: schema.title || key,
          type: schema.type || 'string',
          description: schema.description || '',
          enum: schema.enum || null,
          default: schema.default,
        })
      );
      // Apply defaults for new devices
      if (!this.isEdit && this.selectedPlugin.default_config) {
        this.config = { ...this.selectedPlugin.default_config };
      }
    } else {
      this.configFields = [];
    }
  }

  save(): void {
    if (!this.name.trim() || !this.roomId || !this.pluginId) return;
    this.dialogRef.close({
      name: this.name.trim(),
      device_type: this.deviceType,
      icon: this.icon,
      room_id: this.roomId,
      plugin_id: this.pluginId,
      linked_sensor_id: this.deviceType === 'thermostat' ? this.linkedSensorId : null,
      config: this.config,
      is_visible: this.isVisible,
      historize: this.historize,
      notify_on_state_change: this.notifyOnStateChange,
      hysteresis: this.deviceType === 'thermostat' ? this.hysteresis : null,
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
