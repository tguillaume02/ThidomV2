import * as Blockly from 'blockly';

// =============================
// DEVICE LIST FOR DROPDOWNS
// =============================

interface DeviceEntry {
  id: number;
  name: string;
  device_type: string;
}

let _deviceList: DeviceEntry[] = [];

export function setDeviceList(devices: DeviceEntry[]): void {
  _deviceList = devices;
}

function getDeviceDropdownOptions(): Array<[string, string]> {
  if (_deviceList.length === 0) {
    return [['(aucun appareil)', '0']];
  }
  return _deviceList.map(d => [`${d.name} (ID:${d.id})`, String(d.id)]);
}

function getSensorDropdownOptions(): Array<[string, string]> {
  const sensors = _deviceList.filter(d => d.device_type === 'sensor' || d.device_type === 'thermostat');
  if (sensors.length === 0) {
    return [['(aucun capteur)', '0']];
  }
  return sensors.map(d => [`${d.name} (ID:${d.id})`, String(d.id)]);
}

function getFieldDropdownOptions(): Array<[string, string]> {
  return [
    ['power', 'power'],
    ['temperature', 'temperature'],
    ['target_temperature', 'target_temperature'],
    ['humidity', 'humidity'],
    ['brightness', 'brightness'],
    ['position', 'position'],
    ['contact', 'contact'],
    ['occupancy', 'occupancy'],
    ['locked', 'locked'],
    ['smoke', 'smoke'],
    ['recording', 'recording'],
  ];
}

function getValueDropdownOptions(): Array<[string, string]> {
  return [
    ['on', 'on'],
    ['off', 'off'],
    ['true', 'true'],
    ['false', 'false'],
  ];
}

// =============================
// TRIGGER BLOCKS
// =============================

Blockly.Blocks['thidom_trigger_device_state'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Quand')
      .appendField(new Blockly.FieldDropdown(function() { return getSensorDropdownOptions(); }), 'DEVICE_ID')
      .appendField('.')
      .appendField(new Blockly.FieldDropdown(function() { return getFieldDropdownOptions(); }), 'FIELD');
    this.setColour(45);
    this.setNextStatement(true, null);
    this.setTooltip('Declencher quand l\'etat d\'un appareil change');
  }
};

Blockly.Blocks['thidom_trigger_time'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Quand il est')
      .appendField(new Blockly.FieldTextInput('08:00'), 'TIME');
    this.setColour(45);
    this.setNextStatement(true, null);
    this.setTooltip('Declencher a une heure precise');
  }
};

// =============================
// CONDITION BLOCKS
// =============================

Blockly.Blocks['thidom_condition_device_state'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Si')
      .appendField(new Blockly.FieldDropdown(function() { return getDeviceDropdownOptions(); }), 'DEVICE_ID')
      .appendField('.')
      .appendField(new Blockly.FieldDropdown(function() { return getFieldDropdownOptions(); }), 'FIELD')
      .appendField(new Blockly.FieldDropdown([['==', '=='], ['!=', '!='], ['>', '>'], ['<', '<'], ['>=', '>='], ['<=', '<=']]), 'OPERATOR')
      .appendField(new Blockly.FieldTextInput('on'), 'VALUE');
    this.setColour(210);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Condition sur l\'etat d\'un appareil');
  }
};

Blockly.Blocks['thidom_condition_time_range'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Si entre')
      .appendField(new Blockly.FieldTextInput('08:00'), 'START')
      .appendField('et')
      .appendField(new Blockly.FieldTextInput('22:00'), 'END');
    this.setColour(210);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Condition sur une plage horaire');
  }
};

// =============================
// ACTION BLOCKS
// =============================

Blockly.Blocks['thidom_action_set_state'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Set')
      .appendField(new Blockly.FieldDropdown(function() { return getDeviceDropdownOptions(); }), 'DEVICE_ID')
      .appendField('.')
      .appendField(new Blockly.FieldDropdown(function() { return getFieldDropdownOptions(); }), 'FIELD')
      .appendField('=')
      .appendField(new Blockly.FieldTextInput('on'), 'VALUE');
    this.setColour(120);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Changer l\'etat d\'un appareil');
  }
};

Blockly.Blocks['thidom_action_delay'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Attendre')
      .appendField(new Blockly.FieldNumber(5, 1), 'SECONDS')
      .appendField('secondes');
    this.setColour(120);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Pause avant l\'action suivante');
  }
};

Blockly.Blocks['thidom_action_notification'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Envoyer notification')
      .appendField(new Blockly.FieldTextInput('Message...'), 'MESSAGE');
    this.setColour(120);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Envoyer une notification (WebSocket + Telegram)');
  }
};

Blockly.Blocks['thidom_action_telegram'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Telegram')
      .appendField(new Blockly.FieldTextInput('Message Telegram...'), 'MESSAGE');
    this.setColour(120);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Envoyer un message Telegram');
  }
};

// =============================
// TOOLBOX
// =============================

export const THIDOM_TOOLBOX = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Declencheurs',
      colour: 45,
      contents: [
        { kind: 'block', type: 'thidom_trigger_time' },
        { kind: 'block', type: 'thidom_trigger_device_state' },
      ]
    },
    {
      kind: 'category',
      name: 'Conditions',
      colour: 210,
      contents: [
        { kind: 'block', type: 'thidom_condition_device_state' },
        { kind: 'block', type: 'thidom_condition_time_range' },
      ]
    },
    {
      kind: 'category',
      name: 'Actions',
      colour: 120,
      contents: [
        { kind: 'block', type: 'thidom_action_set_state' },
        { kind: 'block', type: 'thidom_action_delay' },
        { kind: 'block', type: 'thidom_action_notification' },
        { kind: 'block', type: 'thidom_action_telegram' },
      ]
    },
  ]
};

// =============================
// SERIALIZATION: Blocks -> JSON scenario
// =============================

export function blocklyToScenario(workspace: Blockly.Workspace): {
  triggers: any[];
  conditions: any[];
  actions: any[];
} {
  const triggers: any[] = [];
  const conditions: any[] = [];
  const actions: any[] = [];

  const blocks = workspace.getAllBlocks(true);

  for (const block of blocks) {
    switch (block.type) {
      case 'thidom_trigger_time':
        triggers.push({
          type: 'time',
          config: { time: block.getFieldValue('TIME') }
        });
        break;
      case 'thidom_trigger_device_state':
        triggers.push({
          type: 'device_state',
          config: {
            device_id: Number(block.getFieldValue('DEVICE_ID')),
            field: block.getFieldValue('FIELD'),
          }
        });
        break;
      case 'thidom_condition_device_state':
        conditions.push({
          type: 'device_state',
          config: {
            device_id: Number(block.getFieldValue('DEVICE_ID')),
            field: block.getFieldValue('FIELD'),
            operator: block.getFieldValue('OPERATOR'),
            value: block.getFieldValue('VALUE'),
          },
          operator: 'and'
        });
        break;
      case 'thidom_condition_time_range':
        conditions.push({
          type: 'time_range',
          config: {
            start: block.getFieldValue('START'),
            end: block.getFieldValue('END'),
          },
          operator: 'and'
        });
        break;
      case 'thidom_action_set_state': {
        const field = block.getFieldValue('FIELD');
        const value = block.getFieldValue('VALUE');
        let parsedValue: any = value;
        if (value === 'true') parsedValue = true;
        else if (value === 'false') parsedValue = false;
        else if (!isNaN(Number(value))) parsedValue = Number(value);

        actions.push({
          type: 'set_device_state',
          config: {
            device_id: Number(block.getFieldValue('DEVICE_ID')),
            state: { [field]: parsedValue },
          }
        });
        break;
      }
      case 'thidom_action_delay':
        actions.push({
          type: 'delay',
          config: { seconds: Number(block.getFieldValue('SECONDS')) }
        });
        break;
      case 'thidom_action_notification':
        actions.push({
          type: 'send_notification',
          config: { message: block.getFieldValue('MESSAGE') }
        });
        break;
      case 'thidom_action_telegram':
        actions.push({
          type: 'send_telegram',
          config: { message: block.getFieldValue('MESSAGE') }
        });
        break;
    }
  }

  return { triggers, conditions, actions };
}

// =============================
// DESERIALIZATION: JSON scenario -> Blocks XML
// =============================

export function scenarioToBlocklyXml(
  triggers: any[],
  conditions: any[],
  actions: any[]
): string {
  let xml = '<xml xmlns="https://developers.google.com/blockly/xml">';
  let y = 30;

  for (const t of triggers) {
    if (t.type === 'time') {
      xml += `<block type="thidom_trigger_time" x="30" y="${y}">`;
      xml += `<field name="TIME">${t.config?.time || '08:00'}</field>`;
      xml += '</block>';
      y += 80;
    } else if (t.type === 'device_state') {
      xml += `<block type="thidom_trigger_device_state" x="30" y="${y}">`;
      xml += `<field name="DEVICE_ID">${t.config?.device_id || '0'}</field>`;
      xml += `<field name="FIELD">${t.config?.field || 'power'}</field>`;
      xml += '</block>';
      y += 80;
    }
  }

  for (const c of conditions) {
    if (c.type === 'device_state') {
      xml += `<block type="thidom_condition_device_state" x="30" y="${y}">`;
      xml += `<field name="DEVICE_ID">${c.config?.device_id || '0'}</field>`;
      xml += `<field name="FIELD">${c.config?.field || 'power'}</field>`;
      xml += `<field name="OPERATOR">${c.config?.operator || '=='}</field>`;
      xml += `<field name="VALUE">${String(c.config?.value ?? 'on')}</field>`;
      xml += '</block>';
      y += 80;
    } else if (c.type === 'time_range') {
      xml += `<block type="thidom_condition_time_range" x="30" y="${y}">`;
      xml += `<field name="START">${c.config?.start || '08:00'}</field>`;
      xml += `<field name="END">${c.config?.end || '22:00'}</field>`;
      xml += '</block>';
      y += 80;
    }
  }

  for (const a of actions) {
    if (a.type === 'set_device_state') {
      const state = a.config?.state || {};
      const entries = Object.entries(state);
      const field = entries.length > 0 ? entries[0][0] : 'power';
      const value = entries.length > 0 ? String(entries[0][1]) : 'on';
      xml += `<block type="thidom_action_set_state" x="30" y="${y}">`;
      xml += `<field name="DEVICE_ID">${a.config?.device_id || '0'}</field>`;
      xml += `<field name="FIELD">${field}</field>`;
      xml += `<field name="VALUE">${value}</field>`;
      xml += '</block>';
      y += 80;
    } else if (a.type === 'delay') {
      xml += `<block type="thidom_action_delay" x="30" y="${y}">`;
      xml += `<field name="SECONDS">${a.config?.seconds || 5}</field>`;
      xml += '</block>';
      y += 80;
    } else if (a.type === 'send_notification') {
      xml += `<block type="thidom_action_notification" x="30" y="${y}">`;
      xml += `<field name="MESSAGE">${escapeXml(a.config?.message || 'Message...')}</field>`;
      xml += '</block>';
      y += 80;
    } else if (a.type === 'send_telegram') {
      xml += `<block type="thidom_action_telegram" x="30" y="${y}">`;
      xml += `<field name="MESSAGE">${escapeXml(a.config?.message || 'Message Telegram...')}</field>`;
      xml += '</block>';
      y += 80;
    }
  }

  xml += '</xml>';
  return xml;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
