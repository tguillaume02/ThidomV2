import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Device } from '@core/models/models';

@Component({
  selector: 'app-thermostat-widget',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './thermostat-widget.component.html',
  styleUrl: './thermostat-widget.component.scss',
})
export class ThermostatWidgetComponent {
  @Input() device!: Device;
  @Input() currentTemperature: number | null = null;
  @Input() tempSourceLabel = '';
  @Output() tempChange = new EventEmitter<number>();

  hasTemperature(): boolean {
    return this.currentTemperature !== null;
  }

  getTargetTemp(): number {
    return this.device.state?.target_temperature ?? this.device.state?.temperature ?? 20;
  }

  adjust(delta: number): void {
    const current = this.getTargetTemp();
    const newTemp = Math.round(Math.max(5, Math.min(35, current + delta)) * 2) / 2;
    this.tempChange.emit(newTemp);
  }
}
