import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PluginService, SerialPortInfo } from '@core/services/plugin.service';
import { Plugin } from '@core/models/models';

interface SchemaField {
  key: string;
  type: string;
  title: string;
  description?: string;
  default?: any;
  enum?: any[];
  format?: string;
}

@Component({
  selector: 'app-plugin-setup-dialog',
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
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>settings</mat-icon>
      Configuration &ndash; {{ data.plugin.name }}
    </h2>
    <mat-dialog-content>
      @if (loading) {
        <div class="center"><mat-spinner diameter="32"></mat-spinner></div>
      } @else if (fields.length === 0) {
        <p class="no-config">Ce plugin ne necessite pas de configuration hub.</p>
      } @else {
        <div class="form-fields">
          @for (field of fields; track field.key) {
            @if (field.format === 'serial-port') {
              <!-- Serial port picker -->
              <div class="serial-port-row">
                <mat-form-field appearance="outline" class="flex-grow">
                  <mat-label>{{ field.title }}</mat-label>
                  <mat-select [(ngModel)]="config[field.key]">
                    @if (serialPorts.length === 0 && !loadingPorts) {
                      <mat-option disabled>Aucun port detecte</mat-option>
                    }
                    @for (sp of serialPorts; track sp.port) {
                      <mat-option [value]="sp.port">
                        {{ sp.port }} &ndash; {{ sp.description }}
                      </mat-option>
                    }
                    @if (config[field.key] && !isPortInList(config[field.key])) {
                      <mat-option [value]="config[field.key]">
                        {{ config[field.key] }} (non detecte)
                      </mat-option>
                    }
                  </mat-select>
                  @if (field.description) { <mat-hint>{{ field.description }}</mat-hint> }
                </mat-form-field>
                <button mat-icon-button matTooltip="Rafraichir la liste des ports"
                        (click)="refreshSerialPorts()" [disabled]="loadingPorts"
                        class="refresh-btn">
                  @if (loadingPorts) {
                    <mat-spinner diameter="20"></mat-spinner>
                  } @else {
                    <mat-icon>refresh</mat-icon>
                  }
                </button>
              </div>
            } @else if (field.enum && field.enum.length > 0) {
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>{{ field.title }}</mat-label>
                <mat-select [(ngModel)]="config[field.key]">
                  @for (opt of field.enum; track opt) {
                    <mat-option [value]="opt">{{ opt }}</mat-option>
                  }
                </mat-select>
                @if (field.description) { <mat-hint>{{ field.description }}</mat-hint> }
              </mat-form-field>
            } @else {
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>{{ field.title }}</mat-label>
                @if (field.type === 'integer' || field.type === 'number') {
                  <input matInput type="number" [(ngModel)]="config[field.key]"
                         [placeholder]="field.description || ''">
                } @else {
                  <input matInput
                         [type]="field.format === 'password' ? 'password' : 'text'"
                         [(ngModel)]="config[field.key]"
                         [placeholder]="field.description || ''">
                }
                @if (field.description) { <mat-hint>{{ field.description }}</mat-hint> }
              </mat-form-field>
            }
          }
        </div>

        @if (connectionStatus) {
          <div class="status-bar" [class.ok]="connectionStatus.connected" [class.err]="!connectionStatus.connected">
            <mat-icon>{{ connectionStatus.connected ? 'check_circle' : 'error' }}</mat-icon>
            <span>{{ connectionStatus.message }}</span>
          </div>
        }
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      @if (fields.length > 0) {
        <button mat-stroked-button color="accent" (click)="test()" [disabled]="testing">
          @if (testing) { <mat-spinner diameter="18" class="inline-spinner"></mat-spinner> }
          Tester la connexion
        </button>
        <button mat-raised-button color="primary" (click)="save()" [disabled]="saving">
          @if (saving) { <mat-spinner diameter="18" class="inline-spinner"></mat-spinner> }
          Enregistrer
        </button>
      }
    </mat-dialog-actions>
  `,
  styles: [`
    .center { display: flex; justify-content: center; padding: 24px; }
    .no-config { color: #888; text-align: center; padding: 16px; }
    .form-fields { display: flex; flex-direction: column; gap: 4px; min-width: 420px; }
    .full-width { width: 100%; }
    .serial-port-row {
      display: flex; align-items: flex-start; gap: 4px;
    }
    .serial-port-row .flex-grow { flex: 1; }
    .refresh-btn { margin-top: 8px; }
    .status-bar {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 14px; border-radius: 8px; margin-top: 8px; font-size: 0.9rem;
    }
    .status-bar.ok  { background: rgba(76,175,80,.12); color: #2e7d32; }
    .status-bar.err { background: rgba(244,67,54,.10); color: #c62828; }
    .inline-spinner { display: inline-block; margin-right: 6px; }
    mat-dialog-actions { gap: 8px; }
  `],
})
export class PluginSetupDialogComponent implements OnInit {
  fields: SchemaField[] = [];
  config: Record<string, any> = {};
  connectionStatus: any = null;
  loading = true;
  testing = false;
  saving = false;

  serialPorts: SerialPortInfo[] = [];
  loadingPorts = false;

  constructor(
    public dialogRef: MatDialogRef<PluginSetupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { plugin: Plugin },
    private pluginService: PluginService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.pluginService.getPluginHubSchema(this.data.plugin.id).subscribe({
      next: (res) => {
        const schema = res.hub_config_schema || {};
        const defaults = res.default_hub_config || {};
        const current = res.current_hub_config || {};
        this.fields = this.parseSchema(schema);
        this.config = { ...defaults, ...current };
        this.loading = false;

        // Auto-load serial ports if any field uses serial-port format
        if (this.fields.some(f => f.format === 'serial-port')) {
          this.refreshSerialPorts();
        }
      },
      error: () => { this.loading = false; },
    });
    this.pluginService.getPluginStatus(this.data.plugin.id).subscribe({
      next: (s) => { this.connectionStatus = s; },
    });
  }

  parseSchema(schema: any): SchemaField[] {
    const props = schema?.properties || {};
    return Object.entries(props).map(([key, p]: [string, any]) => ({
      key,
      type: p.type || 'string',
      title: p.title || key,
      description: p.description,
      default: p.default,
      enum: p.enum,
      format: p.format,
    }));
  }

  refreshSerialPorts(): void {
    this.loadingPorts = true;
    this.pluginService.getSerialPorts().subscribe({
      next: (ports) => {
        this.serialPorts = ports;
        this.loadingPorts = false;
      },
      error: () => {
        this.serialPorts = [];
        this.loadingPorts = false;
      },
    });
  }

  isPortInList(port: string): boolean {
    return this.serialPorts.some(sp => sp.port === port);
  }

  test(): void {
    this.testing = true;
    this.pluginService.testPluginConnection(this.data.plugin.id, this.config).subscribe({
      next: (s) => { this.connectionStatus = s; this.testing = false; },
      error: () => {
        this.connectionStatus = { connected: false, message: 'Erreur lors du test' };
        this.testing = false;
      },
    });
  }

  save(): void {
    this.saving = true;
    this.pluginService.savePluginHubConfig(this.data.plugin.id, this.config).subscribe({
      next: (res) => {
        this.saving = false;
        this.connectionStatus = res.connection_status;
        this.snackBar.open('Configuration enregistree', 'OK', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('Erreur lors de la sauvegarde', 'Fermer', { duration: 3000 });
      },
    });
  }
}
