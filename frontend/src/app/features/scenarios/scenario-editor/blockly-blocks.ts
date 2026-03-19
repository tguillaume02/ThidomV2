import * as Blockly from 'blockly';

// =============================
// DEVICE LIST FOR DROPDOWNS
// =============================

interface DeviceEntry {
  id: number;
  name: string;
  device_type: string;
  state?: any;
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

function getScenarioDropdownOptions(): Array<[string, string]> {
  return [['(ID scenario)', '0']];
}

// =============================
// DYNAMIC STATE FIELDS
// =============================

const _stateFieldsCache: Map<number, Array<[string, string]>> = new Map();
let _fetchStateFieldsFn: ((deviceId: number) => Promise<Array<{key: string; label: string}>>) | null = null;

export function setFetchStateFieldsFn(fn: (deviceId: number) => Promise<Array<{key: string; label: string}>>): void {
  _fetchStateFieldsFn = fn;
}

function loadFieldsForDevice(deviceId: number, block: Blockly.Block, fieldName: string): void {
  if (!_fetchStateFieldsFn || _stateFieldsCache.has(deviceId)) return;
  _fetchStateFieldsFn(deviceId).then(fields => {
    if (fields.length > 0) {
      const options: Array<[string, string]> = fields.map(f => [f.label, f.key]);
      _stateFieldsCache.set(deviceId, options);
      const dropdown = block.getField(fieldName) as Blockly.FieldDropdown;
      if (dropdown) { dropdown.getOptions(false); }
    }
  }).catch(() => {});
}

function getFieldsFromState(deviceId: number): Array<[string, string]> {
  const device = _deviceList.find(d => d.id === deviceId);
  if (!device?.state || typeof device.state !== 'object') return [];
  const result: Array<[string, string]> = [];
  const SKIP = new Set(['last_refresh', 'latitude', 'longitude']);
  function flatten(obj: any, prefix: string): void {
    for (const [key, value] of Object.entries(obj)) {
      if (SKIP.has(key)) continue;
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        flatten(value, fullKey);
      } else if (!Array.isArray(value)) {
        result.push([fullKey.replace(/\./g, ' > '), fullKey]);
      }
    }
  }
  flatten(device.state, '');
  return result;
}

function getDefaultFieldDropdownOptions(): Array<[string, string]> {
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

function getDynamicFieldOptions(deviceId: number, block: Blockly.Block, fieldName: string): Array<[string, string]> {
  const cached = _stateFieldsCache.get(deviceId);
  if (cached && cached.length > 0) return cached;
  const fromState = getFieldsFromState(deviceId);
  if (fromState.length > 0) { _stateFieldsCache.set(deviceId, fromState); return fromState; }
  loadFieldsForDevice(deviceId, block, fieldName);
  return getDefaultFieldDropdownOptions();
}

function makeDeviceFieldBlock(block: Blockly.Block, deviceFieldName: string, fieldFieldName: string, allDevices: boolean): { deviceDropdown: Blockly.FieldDropdown; fieldDropdown: Blockly.FieldDropdown } {
  const getOptions = allDevices ? getDeviceDropdownOptions : getSensorDropdownOptions;
  const deviceDropdown = new Blockly.FieldDropdown(
    function() { return getOptions(); },
    function(newValue: string) {
      const deviceId = Number(newValue);
      if (deviceId && !_stateFieldsCache.has(deviceId)) {
        loadFieldsForDevice(deviceId, block, fieldFieldName);
      }
      return newValue;
    }
  );
  const fieldDropdown = new Blockly.FieldDropdown(
    () => getDynamicFieldOptions(Number(block.getFieldValue(deviceFieldName) || '0'), block, fieldFieldName)
  );
  return { deviceDropdown, fieldDropdown };
}

const OPERATORS: Array<[string, string]> = [['==', '=='], ['!=', '!='], ['>', '>'], ['<', '<'], ['>=', '>='], ['<=', '<='], ['contient', 'contains']];
const CMP_OPERATORS: Array<[string, string]> = [['==', '=='], ['!=', '!='], ['>', '>'], ['<', '<'], ['>=', '>='], ['<=', '<=']];

const STATE_VALUES: Array<[string, string]> = [
  ['on', 'on'], ['off', 'off'],
  ['open', 'open'], ['close', 'close'],
  ['true', 'true'], ['false', 'false'],
];

const DAY_OPTIONS: Array<[string, string]> = [
  ['Lundi', '1'], ['Mardi', '2'], ['Mercredi', '3'], ['Jeudi', '4'],
  ['Vendredi', '5'], ['Samedi', '6'], ['Dimanche', '7'],
];

// =============================
// TRIGGER BLOCKS
// =============================

Blockly.Blocks['thidom_trigger_device_state'] = {
  init(this: Blockly.Block) {
    const { deviceDropdown, fieldDropdown } = makeDeviceFieldBlock(this, 'DEVICE_ID', 'FIELD', false);
    this.appendDummyInput()
      .appendField('Quand')
      .appendField(deviceDropdown, 'DEVICE_ID')
      .appendField('.')
      .appendField(fieldDropdown, 'FIELD');
    this.setColour(45);
    this.setNextStatement(true, null);
    this.setTooltip('Declencher quand l\'etat d\'un appareil change');
  },
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

Blockly.Blocks['thidom_trigger_day'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Jour')
      .appendField(new Blockly.FieldDropdown(CMP_OPERATORS), 'OPERATOR')
      .appendField(new Blockly.FieldDropdown(DAY_OPTIONS), 'VALUE');
    this.setColour(45);
    this.setNextStatement(true, null);
    this.setTooltip('Declencher selon le jour de la semaine');
  }
};

// =============================
// CONDITION BLOCKS
// =============================

Blockly.Blocks['thidom_condition_device_state'] = {
  init(this: Blockly.Block) {
    const { deviceDropdown, fieldDropdown } = makeDeviceFieldBlock(this, 'DEVICE_ID', 'FIELD', true);
    this.appendDummyInput()
      .appendField('Si')
      .appendField(deviceDropdown, 'DEVICE_ID')
      .appendField('.')
      .appendField(fieldDropdown, 'FIELD')
      .appendField(new Blockly.FieldDropdown(OPERATORS), 'OPERATOR')
      .appendField(new Blockly.FieldTextInput('on'), 'VALUE');
    this.setColour(210);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Condition sur l\'etat d\'un appareil');
  },
};

Blockly.Blocks['thidom_condition_device_state_dropdown'] = {
  init(this: Blockly.Block) {
    const { deviceDropdown, fieldDropdown } = makeDeviceFieldBlock(this, 'DEVICE_ID', 'FIELD', true);
    this.appendDummyInput()
      .appendField('Si')
      .appendField(deviceDropdown, 'DEVICE_ID')
      .appendField('.')
      .appendField(fieldDropdown, 'FIELD')
      .appendField(new Blockly.FieldDropdown(CMP_OPERATORS), 'OPERATOR')
      .appendField(new Blockly.FieldDropdown(STATE_VALUES), 'VALUE');
    this.setColour(210);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Condition avec valeur predefinies (on/off/open/close)');
  },
};

Blockly.Blocks['thidom_condition_x_equals_y'] = {
  init(this: Blockly.Block) {
    const dfd1 = makeDeviceFieldBlock(this, 'DEVICE_ID_X', 'FIELD_X', true);
    const dfd2 = makeDeviceFieldBlock(this, 'DEVICE_ID_Y', 'FIELD_Y', true);
    this.appendDummyInput()
      .appendField('Si')
      .appendField(dfd1.deviceDropdown, 'DEVICE_ID_X')
      .appendField('.')
      .appendField(dfd1.fieldDropdown, 'FIELD_X')
      .appendField('=')
      .appendField(dfd2.deviceDropdown, 'DEVICE_ID_Y')
      .appendField('.')
      .appendField(dfd2.fieldDropdown, 'FIELD_Y');
    this.setColour(210);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Condition: champ X = champ Y');
  },
};

Blockly.Blocks['thidom_condition_x_and_y'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([['ET (toutes vraies)', 'and'], ['OU (une suffit)', 'or']]), 'LOGIC');
    this.appendStatementInput('CONDITIONS')
      .appendField('conditions');
    this.setColour(260);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Combiner plusieurs conditions avec ET / OU');
  },
};

Blockly.Blocks['thidom_condition_time_exact'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Heure')
      .appendField(new Blockly.FieldDropdown(CMP_OPERATORS), 'OPERATOR')
      .appendField(new Blockly.FieldTextInput('18:00'), 'TIME');
    this.setColour(210);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Condition sur une heure precise');
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

Blockly.Blocks['thidom_condition_day'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Si jour')
      .appendField(new Blockly.FieldDropdown(CMP_OPERATORS), 'OPERATOR')
      .appendField(new Blockly.FieldDropdown(DAY_OPTIONS), 'VALUE');
    this.setColour(210);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Condition sur le jour de la semaine');
  }
};

Blockly.Blocks['thidom_condition_last_execute'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Derniere execution')
      .appendField(new Blockly.FieldDropdown(CMP_OPERATORS), 'OPERATOR')
      .appendField(new Blockly.FieldNumber(5, 0), 'MINUTES')
      .appendField('min');
    this.setColour(210);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Condition: temps depuis la derniere execution du scenario');
  }
};

Blockly.Blocks['thidom_condition_last_update'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Derniere MAJ')
      .appendField(new Blockly.FieldDropdown(function() { return getDeviceDropdownOptions(); }), 'DEVICE_ID')
      .appendField(new Blockly.FieldDropdown(CMP_OPERATORS), 'OPERATOR')
      .appendField(new Blockly.FieldNumber(5, 0), 'MINUTES')
      .appendField('min');
    this.setColour(210);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Condition: temps depuis la derniere mise a jour d\'un appareil');
  }
};

// =============================
// ACTION BLOCKS
// =============================

Blockly.Blocks['thidom_action_set_state'] = {
  init(this: Blockly.Block) {
    const { deviceDropdown, fieldDropdown } = makeDeviceFieldBlock(this, 'DEVICE_ID', 'FIELD', true);
    this.appendDummyInput()
      .appendField('Set')
      .appendField(deviceDropdown, 'DEVICE_ID')
      .appendField('.')
      .appendField(fieldDropdown, 'FIELD')
      .appendField('=')
      .appendField(new Blockly.FieldTextInput('on'), 'VALUE');
    this.setColour(120);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Changer l\'etat d\'un appareil');
  },
};

Blockly.Blocks['thidom_action_set_state_dropdown'] = {
  init(this: Blockly.Block) {
    const { deviceDropdown, fieldDropdown } = makeDeviceFieldBlock(this, 'DEVICE_ID', 'FIELD', true);
    this.appendDummyInput()
      .appendField('Set')
      .appendField(deviceDropdown, 'DEVICE_ID')
      .appendField('.')
      .appendField(fieldDropdown, 'FIELD')
      .appendField('=')
      .appendField(new Blockly.FieldDropdown(STATE_VALUES), 'VALUE');
    this.setColour(120);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Changer l\'etat (on/off/open/close)');
  },
};

Blockly.Blocks['thidom_action_set_level'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Level (%)')
      .appendField(new Blockly.FieldDropdown(function() { return getDeviceDropdownOptions(); }), 'DEVICE_ID')
      .appendField('=')
      .appendField(new Blockly.FieldNumber(50, 0, 100), 'LEVEL')
      .appendField('%');
    this.setColour(120);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Regler le niveau (%) d\'un appareil');
  }
};

Blockly.Blocks['thidom_action_set_state_timed'] = {
  init(this: Blockly.Block) {
    const { deviceDropdown, fieldDropdown } = makeDeviceFieldBlock(this, 'DEVICE_ID', 'FIELD', true);
    this.appendDummyInput()
      .appendField('Set')
      .appendField(deviceDropdown, 'DEVICE_ID')
      .appendField('.')
      .appendField(fieldDropdown, 'FIELD')
      .appendField('=')
      .appendField(new Blockly.FieldTextInput('on'), 'VALUE')
      .appendField('pour')
      .appendField(new Blockly.FieldNumber(5, 1), 'DURATION')
      .appendField('min');
    this.setColour(120);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Changer l\'etat pendant X minutes puis revenir');
  },
};

Blockly.Blocks['thidom_action_execute_scenario'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Executer scenario ID')
      .appendField(new Blockly.FieldNumber(1, 1), 'SCENARIO_ID');
    this.setColour(120);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Executer un autre scenario');
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

Blockly.Blocks['thidom_action_email'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Email a')
      .appendField(new Blockly.FieldTextInput('user@example.com'), 'TO');
    this.appendDummyInput()
      .appendField('Sujet')
      .appendField(new Blockly.FieldTextInput('ThiDom Alert'), 'SUBJECT');
    this.appendDummyInput()
      .appendField('Message')
      .appendField(new Blockly.FieldTextInput('Contenu...'), 'MESSAGE');
    this.setColour(120);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Envoyer un email');
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
        { kind: 'block', type: 'thidom_trigger_device_state' },
        { kind: 'block', type: 'thidom_trigger_time' },
        { kind: 'block', type: 'thidom_trigger_day' },
      ]
    },
    {
      kind: 'category',
      name: 'Conditions',
      colour: 210,
      contents: [
        { kind: 'block', type: 'thidom_condition_device_state' },
        { kind: 'block', type: 'thidom_condition_device_state_dropdown' },
        { kind: 'block', type: 'thidom_condition_x_equals_y' },
        { kind: 'block', type: 'thidom_condition_x_and_y' },
        { kind: 'block', type: 'thidom_condition_time_exact' },
        { kind: 'block', type: 'thidom_condition_time_range' },
        { kind: 'block', type: 'thidom_condition_day' },
        { kind: 'block', type: 'thidom_condition_last_execute' },
        { kind: 'block', type: 'thidom_condition_last_update' },
      ]
    },
    {
      kind: 'category',
      name: 'Actions',
      colour: 120,
      contents: [
        { kind: 'block', type: 'thidom_action_set_state' },
        { kind: 'block', type: 'thidom_action_set_state_dropdown' },
        { kind: 'block', type: 'thidom_action_set_level' },
        { kind: 'block', type: 'thidom_action_set_state_timed' },
        { kind: 'block', type: 'thidom_action_execute_scenario' },
        { kind: 'block', type: 'thidom_action_delay' },
        { kind: 'block', type: 'thidom_action_notification' },
        { kind: 'block', type: 'thidom_action_telegram' },
        { kind: 'block', type: 'thidom_action_email' },
      ]
    },
  ]
};

// =============================
// SERIALIZATION: Blocks -> JSON scenario
// =============================

function serializeConditionBlock(block: Blockly.Block, visitedIds: Set<string>): any | null {
  visitedIds.add(block.id);
  switch (block.type) {
    case 'thidom_condition_device_state':
    case 'thidom_condition_device_state_dropdown':
      return {
        type: 'device_state',
        config: {
          device_id: Number(block.getFieldValue('DEVICE_ID')),
          field: block.getFieldValue('FIELD'),
          operator: block.getFieldValue('OPERATOR'),
          value: block.getFieldValue('VALUE'),
        },
        operator: 'and'
      };
    case 'thidom_condition_x_equals_y':
      return {
        type: 'value_compare',
        config: {
          device_id: Number(block.getFieldValue('DEVICE_ID_X')),
          field: block.getFieldValue('FIELD_X'),
          operator: '==',
          value: `{{devices.${block.getFieldValue('DEVICE_ID_Y')}.state.${block.getFieldValue('FIELD_Y')}}}`,
        },
        operator: 'and'
      };
    case 'thidom_condition_time_exact':
      return {
        type: 'time_exact',
        config: { operator: block.getFieldValue('OPERATOR'), time: block.getFieldValue('TIME') },
        operator: 'and'
      };
    case 'thidom_condition_time_range':
      return {
        type: 'time_range',
        config: { start: block.getFieldValue('START'), end: block.getFieldValue('END') },
        operator: 'and'
      };
    case 'thidom_condition_day':
      return {
        type: 'day_compare',
        config: { operator: block.getFieldValue('OPERATOR'), value: block.getFieldValue('VALUE') },
        operator: 'and'
      };
    case 'thidom_condition_last_execute':
      return {
        type: 'last_execute',
        config: { operator: block.getFieldValue('OPERATOR'), minutes: Number(block.getFieldValue('MINUTES')) },
        operator: 'and'
      };
    case 'thidom_condition_last_update':
      return {
        type: 'last_update',
        config: {
          device_id: Number(block.getFieldValue('DEVICE_ID')),
          operator: block.getFieldValue('OPERATOR'),
          minutes: Number(block.getFieldValue('MINUTES')),
        },
        operator: 'and'
      };
    case 'thidom_condition_x_and_y': {
      const logic = block.getFieldValue('LOGIC') || 'and';
      const subs: any[] = [];
      let child = block.getInputTargetBlock('CONDITIONS');
      while (child) {
        const sub = serializeConditionBlock(child, visitedIds);
        if (sub) subs.push(sub);
        child = child.getNextBlock();
      }
      return { type: 'compound', config: { logic, conditions: subs }, operator: 'and' };
    }
    default:
      return null;
  }
}

export function blocklyToScenario(workspace: Blockly.Workspace): {
  triggers: any[];
  conditions: any[];
  actions: any[];
} {
  const triggers: any[] = [];
  const conditions: any[] = [];
  const actions: any[] = [];

  const blocks = workspace.getAllBlocks(true);
  const visitedIds = new Set<string>();

  // First pass: serialize compound blocks to collect nested block IDs
  for (const block of blocks) {
    if (block.type === 'thidom_condition_x_and_y' && !visitedIds.has(block.id)) {
      visitedIds.add(block.id);
      const logic = block.getFieldValue('LOGIC') || 'and';
      const subConditions: any[] = [];
      let child = block.getInputTargetBlock('CONDITIONS');
      while (child) {
        const sub = serializeConditionBlock(child, visitedIds);
        if (sub) subConditions.push(sub);
        child = child.getNextBlock();
      }
      conditions.push({
        type: 'compound',
        config: { logic, conditions: subConditions },
        operator: 'and'
      });
    }
  }

  // Second pass: serialize all other blocks, skipping already-visited ones
  for (const block of blocks) {
    if (visitedIds.has(block.id)) continue;

    switch (block.type) {
      // --- Triggers ---
      case 'thidom_trigger_time':
        triggers.push({ type: 'time', config: { time: block.getFieldValue('TIME') } });
        break;
      case 'thidom_trigger_device_state':
        triggers.push({
          type: 'device_state',
          config: { device_id: Number(block.getFieldValue('DEVICE_ID')), field: block.getFieldValue('FIELD') }
        });
        break;
      case 'thidom_trigger_day':
        triggers.push({
          type: 'day_compare',
          config: { operator: block.getFieldValue('OPERATOR'), value: block.getFieldValue('VALUE') }
        });
        break;

      // --- Conditions ---
      case 'thidom_condition_device_state':
      case 'thidom_condition_device_state_dropdown':
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
      case 'thidom_condition_x_equals_y':
        conditions.push({
          type: 'value_compare',
          config: {
            device_id: Number(block.getFieldValue('DEVICE_ID_X')),
            field: block.getFieldValue('FIELD_X'),
            operator: '==',
            value: `{{devices.${block.getFieldValue('DEVICE_ID_Y')}.state.${block.getFieldValue('FIELD_Y')}}}`,
          },
          operator: 'and'
        });
        break;
      case 'thidom_condition_time_exact':
        conditions.push({
          type: 'time_exact',
          config: { operator: block.getFieldValue('OPERATOR'), time: block.getFieldValue('TIME') },
          operator: 'and'
        });
        break;
      case 'thidom_condition_time_range':
        conditions.push({
          type: 'time_range',
          config: { start: block.getFieldValue('START'), end: block.getFieldValue('END') },
          operator: 'and'
        });
        break;
      case 'thidom_condition_day':
        conditions.push({
          type: 'day_compare',
          config: { operator: block.getFieldValue('OPERATOR'), value: block.getFieldValue('VALUE') },
          operator: 'and'
        });
        break;
      case 'thidom_condition_last_execute':
        conditions.push({
          type: 'last_execute',
          config: { operator: block.getFieldValue('OPERATOR'), minutes: Number(block.getFieldValue('MINUTES')) },
          operator: 'and'
        });
        break;
      case 'thidom_condition_last_update':
        conditions.push({
          type: 'last_update',
          config: {
            device_id: Number(block.getFieldValue('DEVICE_ID')),
            operator: block.getFieldValue('OPERATOR'),
            minutes: Number(block.getFieldValue('MINUTES')),
          },
          operator: 'and'
        });
        break;

      // --- Actions ---
      case 'thidom_action_set_state':
      case 'thidom_action_set_state_dropdown': {
        const field = block.getFieldValue('FIELD');
        const value = block.getFieldValue('VALUE');
        let parsedValue: any = value;
        if (value === 'true') parsedValue = true;
        else if (value === 'false') parsedValue = false;
        else if (!isNaN(Number(value)) && value !== '') parsedValue = Number(value);
        actions.push({
          type: 'set_device_state',
          config: { device_id: Number(block.getFieldValue('DEVICE_ID')), state: { [field]: parsedValue } }
        });
        break;
      }
      case 'thidom_action_set_level':
        actions.push({
          type: 'set_level',
          config: { device_id: Number(block.getFieldValue('DEVICE_ID')), level: Number(block.getFieldValue('LEVEL')) }
        });
        break;
      case 'thidom_action_set_state_timed': {
        const field2 = block.getFieldValue('FIELD');
        const val2 = block.getFieldValue('VALUE');
        let pv2: any = val2;
        if (val2 === 'true') pv2 = true;
        else if (val2 === 'false') pv2 = false;
        else if (!isNaN(Number(val2)) && val2 !== '') pv2 = Number(val2);
        const revertValue = pv2 === 'on' ? 'off' : pv2 === 'off' ? 'on' : pv2 === 'open' ? 'close' : pv2 === 'close' ? 'open' : pv2;
        actions.push({
          type: 'set_state_timed',
          config: {
            device_id: Number(block.getFieldValue('DEVICE_ID')),
            state: { [field2]: pv2 },
            revert_state: { [field2]: revertValue },
            duration_minutes: Number(block.getFieldValue('DURATION')),
          }
        });
        break;
      }
      case 'thidom_action_execute_scenario':
        actions.push({
          type: 'execute_scenario',
          config: { scenario_id: Number(block.getFieldValue('SCENARIO_ID')) }
        });
        break;
      case 'thidom_action_delay':
        actions.push({ type: 'delay', config: { seconds: Number(block.getFieldValue('SECONDS')) } });
        break;
      case 'thidom_action_notification':
        actions.push({ type: 'send_notification', config: { message: block.getFieldValue('MESSAGE') } });
        break;
      case 'thidom_action_telegram':
        actions.push({ type: 'send_telegram', config: { message: block.getFieldValue('MESSAGE') } });
        break;
      case 'thidom_action_email':
        actions.push({
          type: 'send_email',
          config: {
            to: block.getFieldValue('TO'),
            subject: block.getFieldValue('SUBJECT'),
            message: block.getFieldValue('MESSAGE'),
          }
        });
        break;
    }
  }

  return { triggers, conditions, actions };
}

// =============================
// DESERIALIZATION: JSON scenario -> Blocks XML
// =============================

function conditionToXml(c: any): string {
  if (c.type === 'device_state') {
    return `<block type="thidom_condition_device_state"><field name="DEVICE_ID">${c.config?.device_id || '0'}</field><field name="FIELD">${c.config?.field || 'power'}</field><field name="OPERATOR">${c.config?.operator || '=='}</field><field name="VALUE">${String(c.config?.value ?? 'on')}</field>`;
  } else if (c.type === 'time_exact') {
    return `<block type="thidom_condition_time_exact"><field name="OPERATOR">${c.config?.operator || '=='}</field><field name="TIME">${c.config?.time || '18:00'}</field>`;
  } else if (c.type === 'time_range') {
    return `<block type="thidom_condition_time_range"><field name="START">${c.config?.start || '08:00'}</field><field name="END">${c.config?.end || '22:00'}</field>`;
  } else if (c.type === 'day_compare') {
    return `<block type="thidom_condition_day"><field name="OPERATOR">${c.config?.operator || '=='}</field><field name="VALUE">${c.config?.value || '1'}</field>`;
  } else if (c.type === 'last_execute') {
    return `<block type="thidom_condition_last_execute"><field name="OPERATOR">${c.config?.operator || '>='}</field><field name="MINUTES">${c.config?.minutes || 5}</field>`;
  } else if (c.type === 'last_update') {
    return `<block type="thidom_condition_last_update"><field name="DEVICE_ID">${c.config?.device_id || '0'}</field><field name="OPERATOR">${c.config?.operator || '>='}</field><field name="MINUTES">${c.config?.minutes || 5}</field>`;
  }
  return `<block type="thidom_condition_device_state"><field name="DEVICE_ID">0</field><field name="FIELD">power</field><field name="OPERATOR">==</field><field name="VALUE">on</field>`;
}

export function scenarioToBlocklyXml(
  triggers: any[],
  conditions: any[],
  actions: any[]
): string {
  let xml = '<xml xmlns="https://developers.google.com/blockly/xml">';
  let y = 30;

  for (const t of triggers) {
    if (t.type === 'time') {
      xml += `<block type="thidom_trigger_time" x="30" y="${y}"><field name="TIME">${t.config?.time || '08:00'}</field></block>`;
    } else if (t.type === 'device_state') {
      xml += `<block type="thidom_trigger_device_state" x="30" y="${y}"><field name="DEVICE_ID">${t.config?.device_id || '0'}</field><field name="FIELD">${t.config?.field || 'power'}</field></block>`;
    } else if (t.type === 'day_compare') {
      xml += `<block type="thidom_trigger_day" x="30" y="${y}"><field name="OPERATOR">${t.config?.operator || '=='}</field><field name="VALUE">${t.config?.value || '1'}</field></block>`;
    }
    y += 80;
  }

  for (const c of conditions) {
    if (c.type === 'device_state') {
      xml += `<block type="thidom_condition_device_state" x="30" y="${y}"><field name="DEVICE_ID">${c.config?.device_id || '0'}</field><field name="FIELD">${c.config?.field || 'power'}</field><field name="OPERATOR">${c.config?.operator || '=='}</field><field name="VALUE">${String(c.config?.value ?? 'on')}</field></block>`;
    } else if (c.type === 'compound') {
      const logic = c.config?.logic || 'and';
      const subs = c.config?.conditions || [];
      let inner = '';
      for (let i = 0; i < subs.length; i++) {
        const s = subs[i];
        const subXml = conditionToXml(s);
        if (i === 0) {
          inner += subXml;
        } else {
          inner += `<next>${subXml}</next>`;
        }
      }
      for (let i = subs.length - 1; i >= 1; i--) {
        inner += '</block>';
      }
      xml += `<block type="thidom_condition_x_and_y" x="30" y="${y}"><field name="LOGIC">${logic}</field><statement name="CONDITIONS">${inner}</statement></block>`;
    } else if (c.type === 'x_and_y') {
      xml += `<block type="thidom_condition_x_and_y" x="30" y="${y}"><field name="LOGIC">and</field></block>`;
    } else if (c.type === 'time_exact') {
      xml += `<block type="thidom_condition_time_exact" x="30" y="${y}"><field name="OPERATOR">${c.config?.operator || '=='}</field><field name="TIME">${c.config?.time || '18:00'}</field></block>`;
    } else if (c.type === 'time_range') {
      xml += `<block type="thidom_condition_time_range" x="30" y="${y}"><field name="START">${c.config?.start || '08:00'}</field><field name="END">${c.config?.end || '22:00'}</field></block>`;
    } else if (c.type === 'day_compare') {
      xml += `<block type="thidom_condition_day" x="30" y="${y}"><field name="OPERATOR">${c.config?.operator || '=='}</field><field name="VALUE">${c.config?.value || '1'}</field></block>`;
    } else if (c.type === 'last_execute') {
      xml += `<block type="thidom_condition_last_execute" x="30" y="${y}"><field name="OPERATOR">${c.config?.operator || '>='}</field><field name="MINUTES">${c.config?.minutes || 5}</field></block>`;
    } else if (c.type === 'last_update') {
      xml += `<block type="thidom_condition_last_update" x="30" y="${y}"><field name="DEVICE_ID">${c.config?.device_id || '0'}</field><field name="OPERATOR">${c.config?.operator || '>='}</field><field name="MINUTES">${c.config?.minutes || 5}</field></block>`;
    }
    y += 80;
  }

  for (const a of actions) {
    if (a.type === 'set_device_state') {
      const state = a.config?.state || {};
      const entries = Object.entries(state);
      const field = entries.length > 0 ? entries[0][0] : 'power';
      const value = entries.length > 0 ? String(entries[0][1]) : 'on';
      xml += `<block type="thidom_action_set_state" x="30" y="${y}"><field name="DEVICE_ID">${a.config?.device_id || '0'}</field><field name="FIELD">${field}</field><field name="VALUE">${value}</field></block>`;
    } else if (a.type === 'set_level') {
      xml += `<block type="thidom_action_set_level" x="30" y="${y}"><field name="DEVICE_ID">${a.config?.device_id || '0'}</field><field name="LEVEL">${a.config?.level || 50}</field></block>`;
    } else if (a.type === 'set_state_timed') {
      const state = a.config?.state || {};
      const entries = Object.entries(state);
      const field = entries.length > 0 ? entries[0][0] : 'power';
      const value = entries.length > 0 ? String(entries[0][1]) : 'on';
      xml += `<block type="thidom_action_set_state_timed" x="30" y="${y}"><field name="DEVICE_ID">${a.config?.device_id || '0'}</field><field name="FIELD">${field}</field><field name="VALUE">${value}</field><field name="DURATION">${a.config?.duration_minutes || 5}</field></block>`;
    } else if (a.type === 'execute_scenario') {
      xml += `<block type="thidom_action_execute_scenario" x="30" y="${y}"><field name="SCENARIO_ID">${a.config?.scenario_id || 1}</field></block>`;
    } else if (a.type === 'delay') {
      xml += `<block type="thidom_action_delay" x="30" y="${y}"><field name="SECONDS">${a.config?.seconds || 5}</field></block>`;
    } else if (a.type === 'send_notification') {
      xml += `<block type="thidom_action_notification" x="30" y="${y}"><field name="MESSAGE">${escapeXml(a.config?.message || 'Message...')}</field></block>`;
    } else if (a.type === 'send_telegram') {
      xml += `<block type="thidom_action_telegram" x="30" y="${y}"><field name="MESSAGE">${escapeXml(a.config?.message || 'Message Telegram...')}</field></block>`;
    } else if (a.type === 'send_email') {
      xml += `<block type="thidom_action_email" x="30" y="${y}"><field name="TO">${escapeXml(a.config?.to || '')}</field><field name="SUBJECT">${escapeXml(a.config?.subject || 'ThiDom Alert')}</field><field name="MESSAGE">${escapeXml(a.config?.message || '')}</field></block>`;
    }
    y += 80;
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
