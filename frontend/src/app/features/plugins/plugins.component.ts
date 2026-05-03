import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PluginService } from '@core/services/plugin.service';
import { WebSocketService } from '@core/services/websocket.service';
import { Plugin, PluginConnectionStatus } from '@core/models/models';
import { PluginSetupDialogComponent } from './plugin-setup-dialog/plugin-setup-dialog.component';

@Component({
  selector: 'app-plugins',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './plugins.component.html',
  styleUrl: './plugins.component.scss',
})
export class PluginsComponent implements OnInit, OnDestroy {
  plugins: Plugin[] = [];
  statuses: Record<number, PluginConnectionStatus> = {};
  loading = true;
  syncing = false;

  private wsSub?: Subscription;

  get controlPlugins(): Plugin[] {
    return this.plugins.filter(p => p.category === 'control');
  }

  get infoPlugins(): Plugin[] {
    return this.plugins.filter(p => p.category === 'info');
  }

  constructor(
    private pluginService: PluginService,
    private wsService: WebSocketService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadPlugins();
    this.wsSub = this.wsService.messages$.subscribe(msg => {
      if (msg.type === 'plugin_changed') {
        this.loadPlugins();
      }
    });
  }

  ngOnDestroy(): void {
    this.wsSub?.unsubscribe();
  }

  loadPlugins(): void {
    this.loading = true;
    this.pluginService.getPlugins().subscribe({
      next: (plugins) => {
        this.plugins = plugins;
        this.loading = false;
        this.refreshStatuses();
      },
      error: () => { this.loading = false; },
    });
  }

  refreshStatuses(): void {
    for (const p of this.plugins) {
      if (p.enabled && this.hasHubConfig(p)) {
        this.pluginService.getPluginStatus(p.id).subscribe({
          next: (s) => { this.statuses[p.id] = s; },
        });
      } else {
        delete this.statuses[p.id];
      }
    }
  }

  status(plugin: Plugin): PluginConnectionStatus | null {
    return this.statuses[plugin.id] ?? null;
  }

  hasHubConfig(plugin: Plugin): boolean {
    return plugin.needs_hub_config === true;
  }

  syncPlugins(): void {
    this.syncing = true;
    this.pluginService.syncPlugins().subscribe({
      next: (result) => {
        this.syncing = false;
        this.loadPlugins();
        this.snackBar.open(
          `Synchronisation terminee : ${result.synced?.length || 0} nouveau(x) plugin(s)`,
          'OK', { duration: 3000 },
        );
      },
      error: () => {
        this.syncing = false;
        this.snackBar.open('Erreur de synchronisation', 'Fermer', { duration: 3000 });
      },
    });
  }

  togglePlugin(plugin: Plugin): void {
    if (plugin.enabled) {
      if (!confirm(`Desactiver le plugin "${plugin.name}" ?\n\nTous les appareils lies seront eteints et les planifications/scenarios associes seront desactives.`)) {
        return;
      }
    }
    this.pluginService.updatePlugin(plugin.id, { enabled: !plugin.enabled }).subscribe({
      next: (updated) => {
        const idx = this.plugins.findIndex(p => p.id === plugin.id);
        if (idx >= 0) this.plugins[idx] = updated;
        if (!updated.enabled) {
          delete this.statuses[plugin.id];
          this.snackBar.open(`Plugin "${updated.name}" desactive`, 'OK', { duration: 5000 });
        } else {
          this.snackBar.open(`Plugin "${updated.name}" active`, 'OK', { duration: 3000 });
          if (this.hasHubConfig(updated)) {
            this.pluginService.getPluginStatus(updated.id).subscribe({
              next: (s) => { this.statuses[updated.id] = s; },
            });
          } else {
            delete this.statuses[updated.id];
          }
        }
      },
    });
  }

  openSetup(plugin: Plugin): void {
    const ref = this.dialog.open(PluginSetupDialogComponent, {
      data: { plugin },
      width: '540px',
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) this.refreshStatuses();
    });
  }
}
