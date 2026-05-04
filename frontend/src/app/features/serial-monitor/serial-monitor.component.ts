import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WebSocketService, WsMessage } from '@core/services/websocket.service';
import { environment } from '@environments/environment';

interface SerialLine {
  time: string;
  direction: 'RX' | 'TX';
  raw: string;
  plugin: string;
}

@Component({
  selector: 'app-serial-monitor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatBadgeModule,
  ],
  templateUrl: './serial-monitor.component.html',
  styleUrl: './serial-monitor.component.scss',
})
export class SerialMonitorComponent implements OnInit, OnDestroy {
  lines: SerialLine[] = [];
  paused = false;
  autoScroll = true;
  showRx = true;
  showTx = true;
  rxCount = 0;
  txCount = 0;

  private wsSub?: Subscription;
  private maxLines = 500;

  @ViewChild('logContainer') logContainer?: ElementRef<HTMLDivElement>;

  constructor(
    private wsService: WebSocketService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.wsSub = this.wsService.messages$.subscribe((msg: WsMessage) => {
      if (msg.type === 'serial_monitor') {
        if (msg['direction'] === 'RX') this.rxCount++;
        if (msg['direction'] === 'TX') this.txCount++;

        if (this.paused) return;

        const line: SerialLine = {
          time: new Date().toLocaleTimeString('fr-FR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 } as any),
          direction: msg['direction'] || 'RX',
          raw: msg['raw'] || '',
          plugin: msg['plugin'] || '',
        };

        this.lines.push(line);
        if (this.lines.length > this.maxLines) {
          this.lines.splice(0, this.lines.length - this.maxLines);
        }

        if (this.autoScroll) {
          this.scrollToBottom();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.wsSub?.unsubscribe();
  }

  get filteredLines(): SerialLine[] {
    return this.lines.filter(l =>
      (l.direction === 'RX' && this.showRx) ||
      (l.direction === 'TX' && this.showTx)
    );
  }

  clear(): void {
    this.lines = [];
    this.rxCount = 0;
    this.txCount = 0;
  }

  togglePause(): void {
    this.paused = !this.paused;
  }

  sendTest(): void {
    this.http.post(`${environment.apiUrl}/system/serial-test`, {}).subscribe();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.logContainer?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 30);
  }
}
