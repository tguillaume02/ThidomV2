import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Device } from '@core/models/models';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './weather-widget.component.html',
  styleUrl: './weather-widget.component.scss',
})
export class WeatherWidgetComponent {
  @Input() device!: Device;

  getDescription(): string {
    const s = this.device.state || {};
    return s.condition || s.description || s.weather_desc || s.daily_weather_desc || '';
  }

  getCityName(): string {
    const s = this.device.state || {};
    return s.city_name || s.city || '';
  }

  hasMinMax(): boolean {
    const s = this.device.state || {};
    return s.temperature_min !== undefined || s.temperature_max !== undefined;
  }

  getVigilanceColor(): string {
    const v = this.device.state?.vigilance;
    if (!v) return '';
    const colors: Record<string, string> = {
      vert: '#4caf50', jaune: '#ffeb3b', orange: '#ff9800', rouge: '#f44336',
    };
    return colors[v.color] || '';
  }

  getVigilanceReason(): string {
    const alerts: any[] = this.device.state?.vigilance?.alerts || [];
    if (!alerts.length) return 'Aucun risque actif';
    return alerts.map((a: any) => a.risk_name).filter(Boolean).join(', ');
  }
}
