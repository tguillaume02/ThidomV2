import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { Device } from '@core/models/models';

@Component({
  selector: 'app-cover-widget',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatSliderModule],
  templateUrl: './cover-widget.component.html',
  styleUrl: './cover-widget.component.scss',
})
export class CoverWidgetComponent {
  @Input() device!: Device;
  @Output() positionChange = new EventEmitter<number>();

  getPosition(): number {
    return this.device.state?.position ?? 0;
  }

  onPositionChange(position: number): void {
    this.positionChange.emit(position);
  }

  setPreset(position: number): void {
    this.positionChange.emit(position);
  }
}
