import { Component, Inject } from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { Schedule, Device } from '@core/models/models';

interface ActionTarget {
  device_id: number | null;
  state_key: string;
  state_value: string;
}

@Component({
  selector: 'app-schedule-dialog',
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
    MatTooltipModule,
  ],
  templateUrl: './schedule-dialog.component.html',
  styleUrl: './schedule-dialog.component.scss',
})
export class ScheduleDialogComponent {
  name = '';
  description = '';
  scheduleType = 'daily';
  cronExpression = '';
  time = '08:00';
  daysOfWeek: boolean[] = [false, true, true, true, true, true, false];
  timezone = 'Europe/Paris';
  actionJson = '{\n  "type": "set_device_state",\n  "targets": [\n    {\n      "device_id": 1,\n      "state": {\n        "power": "on"\n      }\n    }\n  ]\n}';
  enabled = true;

  isEdit: boolean;
  devices: Device[];

  // Visual builder
  editorMode: 'visual' | 'json' = 'visual';
  actionType = 'set_device_state';
  visualTargets: ActionTarget[] = [{ device_id: null, state_key: 'power', state_value: 'on' }];
  notificationMessage = '';

  dayLabels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  scheduleTypes = [
    { value: 'once', label: 'Une fois' },
    { value: 'daily', label: 'Quotidien' },
    { value: 'weekly', label: 'Hebdomadaire' },
    { value: 'monthly', label: 'Mensuel' },
    { value: 'cron', label: 'Expression Cron' },
  ];

  actionTypes = [
    { value: 'set_device_state', label: 'Controle appareil', icon: 'devices' },
    { value: 'send_notification', label: 'Notification', icon: 'notifications' },
    { value: 'send_telegram', label: 'Notification Telegram', icon: 'send' },
  ];

  statePresets = [
    { key: 'power', value: 'on', label: 'Allumer' },
    { key: 'power', value: 'off', label: 'Eteindre' },
    { key: 'position', value: '100', label: 'Ouvrir (volet)' },
    { key: 'position', value: '0', label: 'Fermer (volet)' },
    { key: 'target_temperature', value: '20', label: 'Consigne 20°C' },
    { key: 'locked', value: 'true', label: 'Verrouiller' },
    { key: 'locked', value: 'false', label: 'Deverrouiller' },
  ];

  actionTemplates = [
    { label: 'Allumer appareil', value: '{\n  "type": "set_device_state",\n  "targets": [{"device_id": 1, "state": {"power": "on"}}]\n}' },
    { label: 'Eteindre appareil', value: '{\n  "type": "set_device_state",\n  "targets": [{"device_id": 1, "state": {"power": "off"}}]\n}' },
    { label: 'Notification', value: '{\n  "type": "send_notification",\n  "config": {"message": "Rappel planifie"}\n}' },
    { label: 'Notification Telegram', value: '{\n  "type": "send_telegram",\n  "config": {"message": "Message Telegram"}\n}' },
  ];

  constructor(
    public dialogRef: MatDialogRef<ScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { schedule: Schedule | null; devices?: Device[] }
  ) {
    this.isEdit = !!data.schedule;
    this.devices = data.devices || [];

    if (data.schedule) {
      this.name = data.schedule.name;
      this.description = data.schedule.description || '';
      this.scheduleType = data.schedule.schedule_type;
      this.cronExpression = data.schedule.cron_expression || '';
      this.time = data.schedule.time || '08:00';
      this.timezone = data.schedule.timezone || 'Europe/Paris';
      this.enabled = data.schedule.enabled;
      this.actionJson = JSON.stringify(data.schedule.action, null, 2);

      if (data.schedule.days_of_week) {
        this.daysOfWeek = [0, 1, 2, 3, 4, 5, 6].map(d => data.schedule!.days_of_week.includes(d));
      }

      // Parse existing action into visual mode
      this._parseActionToVisual(data.schedule.action);
    }
  }

  private _parseActionToVisual(action: any): void {
    if (!action) return;
    this.actionType = action.type || 'set_device_state';

    if (action.type === 'set_device_state' && action.targets) {
      this.visualTargets = action.targets.map((t: any) => {
        const entries = Object.entries(t.state || {});
        const [key, value] = entries.length > 0 ? entries[0] : ['power', 'on'];
        return { device_id: t.device_id, state_key: key as string, state_value: String(value) };
      });
      if (this.visualTargets.length === 0) {
        this.visualTargets = [{ device_id: null, state_key: 'power', state_value: 'on' }];
      }
    } else if (action.type === 'send_notification' || action.type === 'send_telegram') {
      this.notificationMessage = action.config?.message || '';
    }
  }

  private _buildActionFromVisual(): any {
    if (this.actionType === 'set_device_state') {
      const targets = this.visualTargets
        .filter(t => t.device_id !== null)
        .map(t => {
          let val: any = t.state_value;
          if (val === 'true') val = true;
          else if (val === 'false') val = false;
          else if (!isNaN(Number(val)) && val.trim() !== '') val = Number(val);
          return { device_id: t.device_id, state: { [t.state_key]: val } };
        });
      return { type: 'set_device_state', targets };
    } else {
      return { type: this.actionType, config: { message: this.notificationMessage } };
    }
  }

  addTarget(): void {
    this.visualTargets.push({ device_id: null, state_key: 'power', state_value: 'on' });
  }

  removeTarget(index: number): void {
    if (this.visualTargets.length > 1) {
      this.visualTargets.splice(index, 1);
    }
  }

  applyPreset(target: ActionTarget, preset: { key: string; value: string }): void {
    target.state_key = preset.key;
    target.state_value = preset.value;
  }

  syncVisualToJson(): void {
    const action = this._buildActionFromVisual();
    this.actionJson = JSON.stringify(action, null, 2);
  }

  syncJsonToVisual(): void {
    try {
      const action = JSON.parse(this.actionJson);
      this._parseActionToVisual(action);
    } catch {
      // ignore
    }
  }

  onEditorModeChange(): void {
    if (this.editorMode === 'json') {
      this.syncVisualToJson();
    } else {
      this.syncJsonToVisual();
    }
  }

  getDeviceName(id: number | null): string {
    if (id === null) return '';
    return this.devices.find(d => d.id === id)?.name || `Appareil #${id}`;
  }

  insertActionTemplate(template: string): void {
    this.actionJson = template;
  }

  formatJson(): void {
    try {
      const parsed = JSON.parse(this.actionJson);
      this.actionJson = JSON.stringify(parsed, null, 2);
    } catch {
      // ignore
    }
  }

  save(): void {
    if (!this.name.trim()) return;

    let action: any;
    if (this.editorMode === 'visual') {
      action = this._buildActionFromVisual();
    } else {
      try { action = JSON.parse(this.actionJson); } catch { action = {}; }
    }

    const daysOfWeek = this.daysOfWeek
      .map((checked, idx) => checked ? idx : -1)
      .filter(d => d >= 0);

    this.dialogRef.close({
      name: this.name.trim(),
      description: this.description,
      schedule_type: this.scheduleType,
      cron_expression: this.scheduleType === 'cron' ? this.cronExpression : null,
      time: this.time,
      days_of_week: this.scheduleType === 'weekly' ? daysOfWeek : null,
      timezone: this.timezone,
      action,
      enabled: this.enabled,
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
