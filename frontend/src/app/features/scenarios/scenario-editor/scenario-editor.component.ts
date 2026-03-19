import { Component, Inject, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Scenario, Device } from '@core/models/models';
import { DeviceService } from '@core/services/device.service';
import * as Blockly from 'blockly';
import { THIDOM_TOOLBOX, blocklyToScenario, scenarioToBlocklyXml, setDeviceList, setFetchStateFieldsFn } from './blockly-blocks';

@Component({
  selector: 'app-scenario-editor',
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
    MatTabsModule,
    MatSlideToggleModule,
    MatSnackBarModule,
  ],
  templateUrl: './scenario-editor.component.html',
  styleUrl: './scenario-editor.component.scss',
})
export class ScenarioEditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('blocklyDiv') blocklyDiv!: ElementRef;

  name = '';
  description = '';
  enabled = true;
  blocklyXml = '';

  triggersJson = '[]';
  conditionsJson = '[]';
  actionsJson = '[]';

  isEdit: boolean;
  activeTab = 0;
  blocklyReady = false;
  devicesLoaded = false;

  private workspace: Blockly.WorkspaceSvg | null = null;
  private lastSyncSource: 'blockly' | 'json' | null = null;

  triggerTemplates = [
    { label: 'Etat d\'un appareil', value: '{"type":"device_state","config":{"device_id":1,"field":"power"}}' },
    { label: 'Heure precise', value: '{"type":"time","config":{"time":"08:00"}}' },
    { label: 'Jour de la semaine', value: '{"type":"day_compare","config":{"operator":"==","value":"1"}}' },
  ];

  conditionTemplates = [
    { label: 'Etat appareil (texte)', value: '{"type":"device_state","config":{"device_id":1,"field":"power","operator":"==","value":"on"},"operator":"and"}' },
    { label: 'ET / OU (combiner)', value: '{"type":"compound","config":{"logic":"and","conditions":[]},"operator":"and"}' },
    { label: 'Heure precise', value: '{"type":"time_exact","config":{"operator":"==","time":"18:00"},"operator":"and"}' },
    { label: 'Plage horaire', value: '{"type":"time_range","config":{"start":"08:00","end":"22:00"},"operator":"and"}' },
    { label: 'Jour', value: '{"type":"day_compare","config":{"operator":"==","value":"1"},"operator":"and"}' },
    { label: 'Derniere execution', value: '{"type":"last_execute","config":{"operator":">=","minutes":5},"operator":"and"}' },
    { label: 'Derniere MAJ appareil', value: '{"type":"last_update","config":{"device_id":1,"operator":">=","minutes":5},"operator":"and"}' },
  ];

  actionTemplates = [
    { label: 'Changer etat appareil', value: '{"type":"set_device_state","config":{"device_id":1,"state":{"power":"on"}}}' },
    { label: 'Level (%)', value: '{"type":"set_level","config":{"device_id":1,"level":50}}' },
    { label: 'Changer etat temporaire', value: '{"type":"set_state_timed","config":{"device_id":1,"state":{"power":"on"},"revert_state":{"power":"off"},"duration_minutes":5}}' },
    { label: 'Executer scenario', value: '{"type":"execute_scenario","config":{"scenario_id":1}}' },
    { label: 'Delai (secondes)', value: '{"type":"delay","config":{"seconds":5}}' },
    { label: 'Notification', value: '{"type":"send_notification","config":{"message":"Hello!"}}' },
    { label: 'Telegram', value: '{"type":"send_telegram","config":{"message":"Message Telegram"}}' },
    { label: 'Email', value: '{"type":"send_email","config":{"to":"user@example.com","subject":"ThiDom Alert","message":"Contenu..."}}' },
  ];

  constructor(
    public dialogRef: MatDialogRef<ScenarioEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { scenario: Scenario | null },
    private snackBar: MatSnackBar,
    private deviceService: DeviceService,
  ) {
    this.isEdit = !!data.scenario;
    if (data.scenario) {
      this.name = data.scenario.name;
      this.description = data.scenario.description || '';
      this.enabled = data.scenario.enabled;
      this.blocklyXml = data.scenario.blockly_xml || '';
      this.triggersJson = JSON.stringify(data.scenario.triggers || [], null, 2);
      this.conditionsJson = JSON.stringify(data.scenario.conditions || [], null, 2);
      this.actionsJson = JSON.stringify(data.scenario.actions || [], null, 2);
    }
  }

  ngAfterViewInit(): void {
    this.deviceService.getDevices().subscribe({
      next: (devices) => {
        setDeviceList(devices.map(d => ({ id: d.id, name: d.name, device_type: d.device_type, state: d.state })));
        setFetchStateFieldsFn((deviceId: number) => {
          return new Promise((resolve, reject) => {
            this.deviceService.getStateFields(deviceId).subscribe({
              next: fields => resolve(fields),
              error: err => reject(err),
            });
          });
        });
        this.devicesLoaded = true;
        setTimeout(() => this.initBlockly(), 300);
      },
      error: () => {
        this.devicesLoaded = true;
        setTimeout(() => this.initBlockly(), 300);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.workspace) {
      this.workspace.dispose();
      this.workspace = null;
    }
  }

  private initBlockly(): void {
    if (!this.blocklyDiv?.nativeElement) return;

    try {
      this.workspace = Blockly.inject(this.blocklyDiv.nativeElement, {
        toolbox: THIDOM_TOOLBOX,
        grid: { spacing: 20, length: 3, colour: '#333', snap: true },
        zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 2, minScale: 0.5, scaleSpeed: 1.1 },
        trashcan: true,
        theme: Blockly.Themes.Classic,
        renderer: 'zelos',
      });

      if (this.blocklyXml) {
        this.loadXmlToWorkspace(this.blocklyXml);
      } else {
        this.syncJsonToBlockly();
      }

      this.blocklyReady = true;
    } catch {
      this.blocklyReady = false;
    }
  }

  private loadXmlToWorkspace(xml: string): void {
    if (!this.workspace) return;
    try {
      const dom = Blockly.utils.xml.textToDom(xml);
      Blockly.Xml.domToWorkspace(dom, this.workspace);
    } catch {
      // ignore invalid XML
    }
  }

  onTabChange(newTab: number): void {
    this.activeTab = newTab;

    if (newTab === 0 && this.workspace) {
      this.syncJsonToBlockly();
      setTimeout(() => {
        Blockly.svgResize(this.workspace!);
      }, 100);
    } else if (newTab === 1 && this.workspace && this.blocklyReady) {
      this.syncBlocklyToJson();
    }
  }

  syncBlocklyToJson(): void {
    if (!this.workspace) return;
    const blocks = this.workspace.getAllBlocks(false);
    if (blocks.length === 0) return;

    const result = blocklyToScenario(this.workspace);
    this.triggersJson = JSON.stringify(result.triggers, null, 2);
    this.conditionsJson = JSON.stringify(result.conditions, null, 2);
    this.actionsJson = JSON.stringify(result.actions, null, 2);
    this.lastSyncSource = 'blockly';

    this.snackBar.open('JSON mis a jour depuis l\'editeur visuel', '', { duration: 2000 });
  }

  syncJsonToBlockly(): void {
    if (!this.workspace) return;

    let triggers: any[] = [];
    let conditions: any[] = [];
    let actions: any[] = [];

    try { triggers = JSON.parse(this.triggersJson || '[]'); } catch { return; }
    try { conditions = JSON.parse(this.conditionsJson || '[]'); } catch { return; }
    try { actions = JSON.parse(this.actionsJson || '[]'); } catch { return; }

    if (triggers.length === 0 && conditions.length === 0 && actions.length === 0) return;

    const xml = scenarioToBlocklyXml(triggers, conditions, actions);
    this.workspace.clear();
    this.loadXmlToWorkspace(xml);
    this.lastSyncSource = 'json';
  }

  insertTemplate(target: 'triggers' | 'conditions' | 'actions', template: string): void {
    try {
      const current = target === 'triggers' ? this.triggersJson
        : target === 'conditions' ? this.conditionsJson
        : this.actionsJson;

      const arr = JSON.parse(current || '[]');
      arr.push(JSON.parse(template));
      const formatted = JSON.stringify(arr, null, 2);

      if (target === 'triggers') this.triggersJson = formatted;
      else if (target === 'conditions') this.conditionsJson = formatted;
      else this.actionsJson = formatted;
    } catch {
      // ignore parse errors
    }
  }

  save(): void {
    if (!this.name.trim()) return;

    let triggers: any[] = [];
    let conditions: any[] = [];
    let actions: any[] = [];
    let xml = '';

    if (this.workspace && this.blocklyReady && this.workspace.getAllBlocks(false).length > 0) {
      const result = blocklyToScenario(this.workspace);
      triggers = result.triggers;
      conditions = result.conditions;
      actions = result.actions;
      const dom = Blockly.Xml.workspaceToDom(this.workspace);
      xml = Blockly.Xml.domToText(dom);
    } else {
      try { triggers = JSON.parse(this.triggersJson || '[]'); } catch {}
      try { conditions = JSON.parse(this.conditionsJson || '[]'); } catch {}
      try { actions = JSON.parse(this.actionsJson || '[]'); } catch {}
    }

    this.dialogRef.close({
      name: this.name.trim(),
      description: this.description,
      enabled: this.enabled,
      blockly_xml: xml,
      triggers,
      conditions,
      actions,
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
