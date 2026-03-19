import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Device } from '@core/models/models';

@Component({
  selector: 'app-bourse-widget',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './bourse-widget.component.html',
  styleUrl: './bourse-widget.component.scss',
})
export class BourseWidgetComponent {
  @Input() device!: Device;

  formatPrice(): string {
    const v = this.device.state?.price ?? this.device.state?.value;
    return typeof v === 'number' ? v.toFixed(2) : (v ?? '—');
  }

  formatChange(): string {
    const c = this.device.state?.change;
    if (c === undefined || c === null) return '';
    const prefix = c >= 0 ? '+' : '';
    return prefix + (typeof c === 'number' ? c.toFixed(2) : c);
  }

  formatChangePercent(): string {
    const cp = this.device.state?.change_percent;
    if (cp === undefined || cp === null) return '';
    const prefix = cp >= 0 ? '+' : '';
    return prefix + (typeof cp === 'number' ? cp.toFixed(2) : cp) + '%';
  }

  formatPrevClose(): string {
    const v = this.device.state?.previous_close;
    return typeof v === 'number' ? v.toFixed(2) : (v ?? '');
  }

  getMarketLabel(): string {
    const ms = this.device.state?.market_state;
    const labels: Record<string, string> = {
      REGULAR: 'Ouvert', CLOSED: 'Ferme', PRE: 'Pre-marche',
      POST: 'Apres-marche', PREPRE: 'Pre-marche', POSTPOST: 'Apres-marche',
    };
    return labels[ms] || ms || '';
  }
}
