// Room
export interface Room {
  id: number;
  name: string;
  icon: string;
  color: string;
  parent_id: number | null;
  order: number;
  created_at: string;
  updated_at: string;
  devices?: Device[];
  children?: Room[];
}

// Plugin
export interface Plugin {
  id: number;
  name: string;
  slug: string;
  description: string;
  version: string;
  category: 'control' | 'info';
  icon: string;
  enabled: boolean;
  needs_polling: boolean;
  needs_hub_config: boolean;
  hub_config: any;
  config_schema: any;
  default_config: any;
  created_at: string;
  updated_at: string;
}

export interface PluginConnectionStatus {
  connected: boolean;
  message: string;
  last_check?: string;
}

// Device
export interface Device {
  id: number;
  name: string;
  device_type: string;
  icon: string;
  room_id: number;
  plugin_id: number;
  linked_sensor_id: number | null;
  config: any;
  state: any;
  is_visible: boolean;
  historize: boolean;
  notify_on_state_change: boolean;
  hysteresis: number | null;
  order: number;
  created_at: string;
  updated_at: string;
}

// Scenario
export interface Scenario {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  blockly_xml: string;
  triggers: any[];
  conditions: any[];
  actions: any[];
  last_triggered: string;
  trigger_count: number;
  created_at: string;
  updated_at: string;
}

// Schedule
export interface Schedule {
  id: number;
  name: string;
  description: string;
  schedule_type: string;
  cron_expression: string;
  time: string;
  days_of_week: number[];
  timezone: string;
  action: any;
  enabled: boolean;
  next_run: string;
  last_run: string;
  created_at: string;
  updated_at: string;
}

// Log
export interface LogEntry {
  id: number;
  level: string;
  category: string;
  source: string;
  message: string;
  details: any;
  user_id: number;
  device_id: number;
  scenario_id: number;
  created_at: string;
}

// Auth
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// History
export interface HistoryPoint {
  timestamp: string;
  value: any;
  field: string;
}

export interface HistoryData {
  device_id: number;
  field: string;
  start: string;
  end: string;
  points: HistoryPoint[];
}
