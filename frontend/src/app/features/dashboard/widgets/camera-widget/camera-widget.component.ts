import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Device } from '@core/models/models';

@Component({
  selector: 'app-camera-widget',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './camera-widget.component.html',
  styleUrl: './camera-widget.component.scss',
})
export class CameraWidgetComponent {
  @Input() device!: Device;

  isOn(): boolean {
    return this.device.state?.power === 'on';
  }

  getStreamUrl(): string | null {
    if (!this.device.config?.stream_url) return null;
    return `/api/cameras/${this.device.id}/stream`;
  }
}
