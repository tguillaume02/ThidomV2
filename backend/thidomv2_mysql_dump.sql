-- ThiDomV2 -- MySQL dump
-- Migrated from legacy MariaDB backup (backup_bdd_04_03_2026.sql)
-- Adapted to the new ThiDomV2 schema (SQLAlchemy models)
--
-- Usage:
--   mysql -u thidomv2_user -p thidomv2 < thidomv2_mysql_dump.sql
--
-- Prerequisites:
--   CREATE DATABASE thidomv2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--   CREATE USER 'thidomv2_user'@'localhost' IDENTIFIED BY 'motdepasse';
--   GRANT ALL PRIVILEGES ON thidomv2.* TO 'thidomv2_user'@'localhost';
--   FLUSH PRIVILEGES;
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- ============================================================================
-- Table: rooms
-- (migrated from old "Lieux" table)
-- ============================================================================

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `icon` varchar(50) DEFAULT 'home',
  `color` varchar(7) DEFAULT '#4CAF50',
  `parent_id` int DEFAULT NULL,
  `order` int DEFAULT 0,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_rooms_id` (`id`),
  KEY `fk_rooms_parent` (`parent_id`),
  CONSTRAINT `fk_rooms_parent` FOREIGN KEY (`parent_id`) REFERENCES `rooms` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `rooms` (`id`, `name`, `icon`, `color`, `parent_id`, `order`, `created_at`) VALUES
(1, 'Bureau', 'computer', '#2196F3', NULL, 1, NOW()),
(2, 'Cuisine', 'restaurant', '#FF9800', NULL, 2, NOW()),
(3, 'Chambre', 'bed', '#9C27B0', NULL, 3, NOW()),
(4, 'Cave', 'basement', '#795548', NULL, 4, NOW()),
(5, 'Salon', 'weekend', '#4CAF50', NULL, 5, NOW()),
(6, 'Chambre Alice', 'child_care', '#E91E63', NULL, 6, NOW());

-- ============================================================================
-- Table: plugins
-- (migrated from old "Module_Type" table)
-- ============================================================================

DROP TABLE IF EXISTS `plugins`;
CREATE TABLE `plugins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `version` varchar(20) DEFAULT '1.0.0',
  `category` varchar(50) NOT NULL,
  `icon` varchar(50) DEFAULT 'extension',
  `enabled` tinyint(1) DEFAULT 1,
  `hub_config` json DEFAULT NULL,
  `config_schema` json DEFAULT NULL,
  `default_config` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_plugins_name` (`name`),
  UNIQUE KEY `uq_plugins_slug` (`slug`),
  KEY `ix_plugins_id` (`id`),
  KEY `ix_plugins_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `plugins` (`id`, `name`, `slug`, `description`, `version`, `category`, `icon`, `enabled`, `hub_config`, `created_at`) VALUES
(1, 'RF24Network', 'rf24network', 'Appareils sans-fil nRF24L01+ via dongle USB', '1.0.0', 'control', 'router', 1,
 '{"serial_port": "/dev/ttyUSBArduino", "baud_rate": 115200}', NOW()),
(2, 'Virtual', 'virtual', 'Appareils virtuels (tests, logique, widgets divers)', '1.0.0', 'info', 'memory', 1, NULL, NOW()),
(3, 'Weather', 'weather', 'Meteo (OpenWeatherMap + Meteo France + Domogeek)', '1.0.0', 'info', 'wb_sunny', 1, NULL, NOW()),
(4, 'Telegram', 'telegram', 'Notifications Telegram', '1.0.0', 'info', 'telegram', 1,
 '{"bot_token": "612571410:AAGm-1YNStfCeVPJstFLhm-pFDvD8w_ISTM", "chat_id": "-1001459172383"}', NOW()),
(5, 'Camera', 'camera', 'Cameras IP / Webcam', '1.0.0', 'info', 'videocam', 1, NULL, NOW());

-- ============================================================================
-- Table: devices
-- (migrated from old "Device" + "cmd_device" tables)
-- ============================================================================

DROP TABLE IF EXISTS `devices`;
CREATE TABLE `devices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `device_type` varchar(50) NOT NULL,
  `icon` varchar(50) DEFAULT 'devices',
  `room_id` int NOT NULL,
  `plugin_id` int NOT NULL,
  `linked_sensor_id` int DEFAULT NULL,
  `config` json DEFAULT NULL,
  `state` json DEFAULT NULL,
  `is_visible` tinyint(1) DEFAULT 1,
  `historize` tinyint(1) DEFAULT 0,
  `notify_on_state_change` tinyint(1) DEFAULT 0,
  `hysteresis` float DEFAULT NULL,
  `order` int DEFAULT 0,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_devices_id` (`id`),
  KEY `fk_devices_room` (`room_id`),
  KEY `fk_devices_plugin` (`plugin_id`),
  KEY `fk_devices_linked_sensor` (`linked_sensor_id`),
  CONSTRAINT `fk_devices_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_devices_plugin` FOREIGN KEY (`plugin_id`) REFERENCES `plugins` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_devices_linked_sensor` FOREIGN KEY (`linked_sensor_id`) REFERENCES `devices` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bourse (stock widget) -> virtual sensor
INSERT INTO `devices` (`id`, `name`, `device_type`, `icon`, `room_id`, `plugin_id`, `config`, `state`, `is_visible`, `historize`, `notify_on_state_change`, `order`, `created_at`) VALUES
(1, 'Bourse', 'sensor', 'trending_up', 1, 2,
 '{"ref": "1rPFDJU", "source": "bourse"}',
 '{"value": 25.7, "power": "on"}',
 1, 0, 0, 1, NOW());

-- Livebox -> virtual sensor (hidden)
INSERT INTO `devices` (`id`, `name`, `device_type`, `icon`, `room_id`, `plugin_id`, `config`, `state`, `is_visible`, `historize`, `notify_on_state_change`, `order`, `created_at`) VALUES
(2, 'Livebox', 'sensor', 'router', 1, 2,
 '{"host": "192.168.1.1", "user": "admin"}',
 '{"upload": 4.35, "download": 0, "power": "on"}',
 0, 0, 0, 2, NOW());

-- Chaudiere (ancien) -> RF24 relay (hidden)
INSERT INTO `devices` (`id`, `name`, `device_type`, `icon`, `room_id`, `plugin_id`, `config`, `state`, `is_visible`, `historize`, `notify_on_state_change`, `order`, `created_at`) VALUES
(4, 'Chaudiere (ancien)', 'switch', 'local_fire_department', 4, 1,
 '{"node_id": "01", "device_guid": "1014191403", "widget_id": "1", "pin_id": "0"}',
 '{"power": "off"}',
 0, 0, 0, 1, NOW());

-- Guirlande -> RF24 relay
INSERT INTO `devices` (`id`, `name`, `device_type`, `icon`, `room_id`, `plugin_id`, `config`, `state`, `is_visible`, `historize`, `notify_on_state_change`, `order`, `created_at`) VALUES
(5, 'Guirlande', 'switch', 'lightbulb', 3, 1,
 '{"node_id": "01", "device_guid": "1219191931", "widget_id": "1", "pin_id": "9"}',
 '{"power": "off"}',
 1, 1, 0, 1, NOW());

-- Chaudiere (thermostat) -> RF24 thermostat with linked sensor
INSERT INTO `devices` (`id`, `name`, `device_type`, `icon`, `room_id`, `plugin_id`, `linked_sensor_id`, `config`, `state`, `is_visible`, `historize`, `notify_on_state_change`, `hysteresis`, `order`, `created_at`) VALUES
(6, 'Chaudiere', 'thermostat', 'thermostat', 4, 1, 8,
 '{"node_id": "02", "device_guid": "118201205", "widget_id": "5", "pin_id": "9"}',
 '{"power": "off", "target_temperature": 13, "heating": false, "temperature": 29.12}',
 1, 1, 1, 0.5, 2, NOW());

-- Temperature Cave -> RF24 sensor
INSERT INTO `devices` (`id`, `name`, `device_type`, `icon`, `room_id`, `plugin_id`, `config`, `state`, `is_visible`, `historize`, `notify_on_state_change`, `order`, `created_at`) VALUES
(7, 'Temperature Cave', 'sensor', 'thermostat', 4, 1,
 '{"node_id": "02", "device_guid": "118201205", "widget_id": "0", "pin_id": "0"}',
 '{"temperature": 29.12, "power": "on"}',
 1, 0, 0, 3, NOW());

-- Temperature Chambre Alice -> RF24 sensor
INSERT INTO `devices` (`id`, `name`, `device_type`, `icon`, `room_id`, `plugin_id`, `config`, `state`, `is_visible`, `historize`, `notify_on_state_change`, `order`, `created_at`) VALUES
(8, 'Temperature Chambre Alice', 'sensor', 'thermostat', 6, 1,
 '{"node_id": "01", "device_guid": "1025191933", "widget_id": "0", "pin_id": "0"}',
 '{"temperature": 18.62, "power": "on", "voltage": 3.56, "battery": 3.56}',
 1, 1, 0, 1, NOW());

-- Telegram -> telegram plugin
INSERT INTO `devices` (`id`, `name`, `device_type`, `icon`, `room_id`, `plugin_id`, `config`, `state`, `is_visible`, `historize`, `notify_on_state_change`, `order`, `created_at`) VALUES
(11, 'Telegram', 'sensor', 'telegram', 1, 4,
 '{"chat_id": "-1001459172383"}',
 '{"power": "on"}',
 0, 0, 0, 3, NOW());

-- Webcam -> camera plugin
INSERT INTO `devices` (`id`, `name`, `device_type`, `icon`, `room_id`, `plugin_id`, `config`, `state`, `is_visible`, `historize`, `notify_on_state_change`, `order`, `created_at`) VALUES
(13, 'Webcam', 'sensor', 'videocam', 1, 5,
 '{"url": "http://192.168.1.100"}',
 '{"power": "on"}',
 1, 0, 0, 4, NOW());

-- Meteo -> weather plugin
INSERT INTO `devices` (`id`, `name`, `device_type`, `icon`, `room_id`, `plugin_id`, `config`, `state`, `is_visible`, `historize`, `notify_on_state_change`, `order`, `created_at`) VALUES
(17, 'Meteo', 'sensor', 'wb_sunny', 1, 3,
 '{"departement": "02", "city": "AUDIGNY", "insee": "02035", "holidays_zone": "B"}',
 '{"power": "on"}',
 1, 0, 0, 5, NOW());

-- ============================================================================
-- Table: scenarios
-- (migrated from old "Scenario_Xml" + "Scenario" tables)
-- ============================================================================

DROP TABLE IF EXISTS `scenarios`;
CREATE TABLE `scenarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT 1,
  `blockly_xml` text DEFAULT NULL,
  `triggers` json DEFAULT NULL,
  `conditions` json DEFAULT NULL,
  `actions` json DEFAULT NULL,
  `last_triggered` datetime DEFAULT NULL,
  `trigger_count` int DEFAULT 0,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_scenarios_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `scenarios` (`id`, `name`, `description`, `enabled`, `blockly_xml`, `triggers`, `conditions`, `actions`, `created_at`) VALUES
(1, 'Thermostat auto (temperature > seuil)',
 'Si la temperature (capteur Chambre Alice) depasse 18 C, regle le thermostat (Chaudiere) a 17 C. Migre depuis l''ancien systeme Blockly.',
 1,
 '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="controls_if" id="V4ekW_)$-4V|RUyX@lAG" x="358" y="24"><value name="IF0"><block type="logic_compare" id="a09=ARwn*n)Nn1/u5oz?"><field name="OP">GT</field><value name="A"><block type="temperaturevariables" id=":%.jiT2PKco`;F0bmi{t"><field name="Temperature">32</field></block></value><value name="B"><block type="math_number" id="0n|D{z.D(o@6zj/hO-PM"><field name="NUM">18</field></block></value></block></value><statement name="DO0"><block type="logic_set" id="Dg!WxpH~i*j2i)Zt?MY_"><value name="A"><block type="switchvariablesAF" id="UmP@K|vbe1=9cAXfFN9q"><field name="Switch">30</field></block></value><value name="B"><block type="math_number" id="([$y:)hnD.e27e?U|t*l"><field name="NUM">17</field></block></value></block></statement></block></xml>',
 '[{"type": "device_state", "config": {"device_id": 8, "field": "temperature"}}]',
 '[{"type": "device_state", "config": {"device_id": 8, "field": "temperature", "operator": ">", "value": 18}, "operator": "and"}]',
 '[{"type": "set_device_state", "config": {"device_id": 6, "state": {"target_temperature": 17}}}]',
 NOW());

-- ============================================================================
-- Table: schedules
-- (migrated from old "Planning" table)
-- ============================================================================

DROP TABLE IF EXISTS `schedules`;
CREATE TABLE `schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `schedule_type` varchar(20) NOT NULL,
  `cron_expression` varchar(100) DEFAULT NULL,
  `time` varchar(5) DEFAULT NULL,
  `days_of_week` json DEFAULT NULL,
  `timezone` varchar(50) DEFAULT 'Europe/Paris',
  `action` json NOT NULL,
  `enabled` tinyint(1) DEFAULT 1,
  `next_run` datetime DEFAULT NULL,
  `last_run` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_schedules_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `schedules` (`id`, `name`, `description`, `schedule_type`, `time`, `days_of_week`, `timezone`, `action`, `enabled`, `created_at`) VALUES
(1, 'Chaudiere - Nuit (23h)',
 'Regle le thermostat de la chaudiere a 17.5 C tous les jours a 23h',
 'daily', '23:00', '[0, 1, 2, 3, 4, 5, 6]', 'Europe/Paris',
 '{"type": "set_device_state", "device_id": 6, "state": {"target_temperature": 17.5}}',
 1, NOW()),
(2, 'Chaudiere - Matin (7h)',
 'Regle le thermostat de la chaudiere a 17.5 C tous les jours a 7h',
 'daily', '07:00', '[0, 1, 2, 3, 4, 5, 6]', 'Europe/Paris',
 '{"type": "set_device_state", "device_id": 6, "state": {"target_temperature": 17.5}}',
 1, NOW());

-- ============================================================================
-- Table: logs
-- (migrated from old "Log" table -- recent entries)
-- ============================================================================

DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `level` varchar(20) NOT NULL,
  `category` varchar(50) NOT NULL,
  `source` varchar(100) DEFAULT NULL,
  `message` varchar(1000) NOT NULL,
  `details` json DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `device_id` int DEFAULT NULL,
  `scenario_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_logs_id` (`id`),
  KEY `ix_logs_level` (`level`),
  KEY `ix_logs_category` (`category`),
  KEY `ix_logs_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `logs` (`id`, `level`, `category`, `source`, `message`, `device_id`, `created_at`) VALUES
(1, 'INFO', 'system', 'scheduler', 'Planning: Cave Chaudiere 01/118201205_5_9@17.5:0', 6, '2026-02-20 07:00:03'),
(2, 'INFO', 'system', 'scheduler', 'Planning: Cave Chaudiere 01/118201205_5_9@17.5:0', 6, '2026-02-23 23:00:04'),
(3, 'INFO', 'system', 'scheduler', 'Planning: Cave Chaudiere 02/118201205_5_9@17.5:0', 6, '2026-02-26 07:00:01'),
(4, 'INFO', 'system', 'scheduler', 'Planning: Cave Chaudiere 01/118201205_5_9@17.5:1', 6, '2026-02-26 23:00:03');

-- ============================================================================
-- Table: users
-- (migrated from old "User" table)
-- Password: "admin" (bcrypt hash)
-- ============================================================================

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `hashed_password` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_admin` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_username` (`username`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `ix_users_id` (`id`),
  KEY `ix_users_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `username`, `email`, `hashed_password`, `full_name`, `is_active`, `is_admin`, `created_at`) VALUES
(1, 'admin', 'admin@thidom.local',
 '$2b$12$LJ3m4ys3Lk0TSwMCkVc8aOWb1SAJdQ3FzD/rXVKwIiv/bGJDkEKey',
 'Administrateur', 1, 1, NOW());

-- ============================================================================
-- Re-enable foreign key checks
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 1;
