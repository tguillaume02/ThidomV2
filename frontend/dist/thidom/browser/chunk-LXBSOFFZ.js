import {
  MatCheckboxModule
} from "./chunk-7CNMJOQD.js";
import {
  RoomService
} from "./chunk-LVNRJANL.js";
import {
  PluginService
} from "./chunk-NJMTHRNX.js";
import {
  MatMenu,
  MatMenuItem,
  MatMenuModule,
  MatMenuTrigger
} from "./chunk-IMDHGTIK.js";
import {
  DeviceService
} from "./chunk-YRR6QPHE.js";
import {
  MatSlideToggle,
  MatSlideToggleModule
} from "./chunk-LJTFCNGQ.js";
import {
  MatChip,
  MatChipsModule
} from "./chunk-TPFVVE76.js";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle
} from "./chunk-2JZK2537.js";
import {
  MatSelect,
  MatSelectModule
} from "./chunk-N62PVXES.js";
import {
  MatSnackBar,
  MatSnackBarModule
} from "./chunk-FZHVEDA5.js";
import {
  MatInput,
  MatInputModule
} from "./chunk-SJP3SAKT.js";
import {
  MatProgressBar,
  MatProgressBarModule
} from "./chunk-JDQ2CLAH.js";
import {
  MatCardModule,
  MatFormField,
  MatFormFieldModule,
  MatHint,
  MatLabel,
  MatSuffix
} from "./chunk-A3S6NR4S.js";
import {
  MatTooltip,
  MatTooltipModule
} from "./chunk-3VUMTD7Q.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MatButton,
  MatButtonModule,
  MatIcon,
  MatIconButton,
  MatIconModule,
  MatOption,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgModel,
  NumberValueAccessor,
  RequiredValidator
} from "./chunk-3YNX47WL.js";
import {
  CommonModule,
  __spreadValues,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-7ID3BB7P.js";

// src/app/features/devices/device-dialog/device-dialog.component.ts
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.value;
var _forTrack2 = ($index, $item) => $item.key;
function DeviceDialogComponent_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 6)(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const room_r1 = ctx.$implicit;
    \u0275\u0275property("value", room_r1.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(room_r1.icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", room_r1.name, " ");
  }
}
function DeviceDialogComponent_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 6)(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const dt_r2 = ctx.$implicit;
    \u0275\u0275property("value", dt_r2.value);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(dt_r2.icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", dt_r2.label, " ");
  }
}
function DeviceDialogComponent_For_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 6)(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementStart(4, "small");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const plugin_r3 = ctx.$implicit;
    \u0275\u0275property("value", plugin_r3.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(plugin_r3.icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", plugin_r3.name, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("(", plugin_r3.category, ")");
  }
}
function DeviceDialogComponent_Conditional_26_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 6)(1, "mat-icon");
    \u0275\u0275text(2, "sensors");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sensor_r6 = ctx.$implicit;
    \u0275\u0275property("value", sensor_r6.id);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", sensor_r6.name, " (", sensor_r6.state == null ? null : sensor_r6.state.temperature, "\xB0C) ");
  }
}
function DeviceDialogComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-form-field", 1)(1, "mat-label");
    \u0275\u0275text(2, "Capteur de temperature lie (optionnel)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "mat-select", 9);
    \u0275\u0275twoWayListener("ngModelChange", function DeviceDialogComponent_Conditional_26_Template_mat_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r4 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r4.linkedSensorId, $event) || (ctx_r4.linkedSensorId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(4, "mat-option", 6);
    \u0275\u0275text(5, "Aucun (utilise le capteur de la piece)");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(6, DeviceDialogComponent_Conditional_26_For_7_Template, 4, 3, "mat-option", 6, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "mat-hint");
    \u0275\u0275text(9, "Si vide, le thermostat utilisera le capteur de temperature de sa piece");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "mat-form-field", 1)(11, "mat-label");
    \u0275\u0275text(12, "Hysteresis (\xB0C)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "input", 13);
    \u0275\u0275twoWayListener("ngModelChange", function DeviceDialogComponent_Conditional_26_Template_input_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r4 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r4.hysteresis, $event) || (ctx_r4.hysteresis = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "mat-hint");
    \u0275\u0275text(15, "Tolerance avant activation/desactivation du chauffage (ex: 0.5 = \xB10.5\xB0C autour de la consigne). Laisser vide pour desactiver.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r4.linkedSensorId);
    \u0275\u0275advance();
    \u0275\u0275property("value", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r4.temperatureSensors);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r4.hysteresis);
  }
}
function DeviceDialogComponent_Conditional_27_For_4_Conditional_0_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opt_r9 = ctx.$implicit;
    \u0275\u0275property("value", opt_r9);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(opt_r9);
  }
}
function DeviceDialogComponent_Conditional_27_For_4_Conditional_0_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-hint");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r8 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(field_r8.description);
  }
}
function DeviceDialogComponent_Conditional_27_For_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-form-field", 1)(1, "mat-label");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "mat-select", 9);
    \u0275\u0275twoWayListener("ngModelChange", function DeviceDialogComponent_Conditional_27_For_4_Conditional_0_Template_mat_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r7);
      const field_r8 = \u0275\u0275nextContext().$implicit;
      const ctx_r4 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r4.config[field_r8.key], $event) || (ctx_r4.config[field_r8.key] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(4, DeviceDialogComponent_Conditional_27_For_4_Conditional_0_For_5_Template, 2, 2, "mat-option", 6, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, DeviceDialogComponent_Conditional_27_For_4_Conditional_0_Conditional_6_Template, 2, 1, "mat-hint");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r8 = \u0275\u0275nextContext().$implicit;
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(field_r8.label);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r4.config[field_r8.key]);
    \u0275\u0275advance();
    \u0275\u0275repeater(field_r8.enum);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(6, field_r8.description ? 6 : -1);
  }
}
function DeviceDialogComponent_Conditional_27_For_4_Conditional_1_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-hint");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r8 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(field_r8.description);
  }
}
function DeviceDialogComponent_Conditional_27_For_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-form-field", 1)(1, "mat-label");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 14);
    \u0275\u0275twoWayListener("ngModelChange", function DeviceDialogComponent_Conditional_27_For_4_Conditional_1_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r10);
      const field_r8 = \u0275\u0275nextContext().$implicit;
      const ctx_r4 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r4.config[field_r8.key], $event) || (ctx_r4.config[field_r8.key] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, DeviceDialogComponent_Conditional_27_For_4_Conditional_1_Conditional_4_Template, 2, 1, "mat-hint");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r8 = \u0275\u0275nextContext().$implicit;
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(field_r8.label);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r4.config[field_r8.key]);
    \u0275\u0275advance();
    \u0275\u0275conditional(4, field_r8.description ? 4 : -1);
  }
}
function DeviceDialogComponent_Conditional_27_For_4_Conditional_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-hint");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r8 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(field_r8.description);
  }
}
function DeviceDialogComponent_Conditional_27_For_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-form-field", 1)(1, "mat-label");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 15);
    \u0275\u0275twoWayListener("ngModelChange", function DeviceDialogComponent_Conditional_27_For_4_Conditional_2_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r11);
      const field_r8 = \u0275\u0275nextContext().$implicit;
      const ctx_r4 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r4.config[field_r8.key], $event) || (ctx_r4.config[field_r8.key] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, DeviceDialogComponent_Conditional_27_For_4_Conditional_2_Conditional_4_Template, 2, 1, "mat-hint");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r8 = \u0275\u0275nextContext().$implicit;
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(field_r8.label);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r4.config[field_r8.key]);
    \u0275\u0275advance();
    \u0275\u0275conditional(4, field_r8.description ? 4 : -1);
  }
}
function DeviceDialogComponent_Conditional_27_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DeviceDialogComponent_Conditional_27_For_4_Conditional_0_Template, 7, 3, "mat-form-field", 1)(1, DeviceDialogComponent_Conditional_27_For_4_Conditional_1_Template, 5, 3)(2, DeviceDialogComponent_Conditional_27_For_4_Conditional_2_Template, 5, 3);
  }
  if (rf & 2) {
    const field_r8 = ctx.$implicit;
    \u0275\u0275conditional(0, field_r8.enum ? 0 : field_r8.type === "integer" || field_r8.type === "number" ? 1 : 2);
  }
}
function DeviceDialogComponent_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "h3");
    \u0275\u0275text(2, "Configuration du plugin");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, DeviceDialogComponent_Conditional_27_For_4_Template, 3, 1, null, null, _forTrack2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r4.configFields);
  }
}
var DeviceDialogComponent = class _DeviceDialogComponent {
  get temperatureSensors() {
    return (this.allDevices || []).filter((d) => d.device_type === "sensor" && d.state?.temperature !== void 0);
  }
  constructor(dialogRef, data) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.name = "";
    this.deviceType = "";
    this.icon = "";
    this.roomId = null;
    this.pluginId = null;
    this.linkedSensorId = null;
    this.config = {};
    this.isVisible = true;
    this.historize = false;
    this.notifyOnStateChange = false;
    this.hysteresis = null;
    this.selectedPlugin = null;
    this.configFields = [];
    this.deviceTypes = [
      { value: "light", label: "Lumi\xE8re", icon: "lightbulb" },
      { value: "switch", label: "Interrupteur", icon: "toggle_on" },
      { value: "sensor", label: "Capteur", icon: "sensors" },
      { value: "thermostat", label: "Thermostat", icon: "thermostat" },
      { value: "cover", label: "Volet", icon: "blinds" },
      { value: "lock", label: "Serrure", icon: "lock" },
      { value: "camera", label: "Cam\xE9ra", icon: "videocam" },
      { value: "variable", label: "Variable", icon: "data_object" }
    ];
    this.isEdit = !!data.device;
    this.rooms = data.rooms;
    this.plugins = data.plugins;
    this.allDevices = data.devices || [];
    if (data.device) {
      this.name = data.device.name;
      this.deviceType = data.device.device_type;
      this.icon = data.device.icon;
      this.roomId = data.device.room_id;
      this.pluginId = data.device.plugin_id;
      this.linkedSensorId = data.device.linked_sensor_id || null;
      this.config = __spreadValues({}, data.device.config || {});
      this.isVisible = data.device.is_visible;
      this.historize = data.device.historize;
      this.notifyOnStateChange = data.device.notify_on_state_change || false;
      this.hysteresis = data.device.hysteresis ?? null;
    }
  }
  ngOnInit() {
    if (this.pluginId) {
      this.onPluginChange();
    }
  }
  onPluginChange() {
    this.selectedPlugin = this.plugins.find((p) => p.id === this.pluginId) || null;
    if (this.selectedPlugin?.config_schema?.properties) {
      this.configFields = Object.entries(this.selectedPlugin.config_schema.properties).map(([key, schema]) => ({
        key,
        label: schema.title || key,
        type: schema.type || "string",
        description: schema.description || "",
        enum: schema.enum || null,
        default: schema.default
      }));
      if (!this.isEdit && this.selectedPlugin.default_config) {
        this.config = __spreadValues({}, this.selectedPlugin.default_config);
      }
    } else {
      this.configFields = [];
    }
  }
  save() {
    if (!this.name.trim() || !this.roomId || !this.pluginId)
      return;
    this.dialogRef.close({
      name: this.name.trim(),
      device_type: this.deviceType,
      icon: this.icon,
      room_id: this.roomId,
      plugin_id: this.pluginId,
      linked_sensor_id: this.deviceType === "thermostat" ? this.linkedSensorId : null,
      config: this.config,
      is_visible: this.isVisible,
      historize: this.historize,
      notify_on_state_change: this.notifyOnStateChange,
      hysteresis: this.deviceType === "thermostat" ? this.hysteresis : null
    });
  }
  cancel() {
    this.dialogRef.close(null);
  }
  static {
    this.\u0275fac = function DeviceDialogComponent_Factory(t) {
      return new (t || _DeviceDialogComponent)(\u0275\u0275directiveInject(MatDialogRef), \u0275\u0275directiveInject(MAT_DIALOG_DATA));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DeviceDialogComponent, selectors: [["app-device-dialog"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 40, vars: 12, consts: [["mat-dialog-title", ""], ["appearance", "outline", 1, "full-width"], ["matInput", "", "required", "", "placeholder", "Ex: Lampe salon", 3, "ngModelChange", "ngModel"], [1, "form-row"], ["appearance", "outline", 1, "half-width"], ["required", "", 3, "ngModelChange", "ngModel"], [3, "value"], [1, "config-section"], [1, "toggles-row"], [3, "ngModelChange", "ngModel"], ["align", "end"], ["mat-button", "", 3, "click"], ["mat-raised-button", "", "color", "primary", 3, "click", "disabled"], ["matInput", "", "type", "number", "step", "0.1", "min", "0", "max", "5", "placeholder", "Ex: 0.5", 3, "ngModelChange", "ngModel"], ["matInput", "", "type", "number", 3, "ngModelChange", "ngModel"], ["matInput", "", 3, "ngModelChange", "ngModel"]], template: function DeviceDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "h2", 0);
        \u0275\u0275text(1);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(2, "mat-dialog-content")(3, "mat-form-field", 1)(4, "mat-label");
        \u0275\u0275text(5, "Nom");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "input", 2);
        \u0275\u0275twoWayListener("ngModelChange", function DeviceDialogComponent_Template_input_ngModelChange_6_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.name, $event) || (ctx.name = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "div", 3)(8, "mat-form-field", 4)(9, "mat-label");
        \u0275\u0275text(10, "Pi\xE8ce");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "mat-select", 5);
        \u0275\u0275twoWayListener("ngModelChange", function DeviceDialogComponent_Template_mat_select_ngModelChange_11_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.roomId, $event) || (ctx.roomId = $event);
          return $event;
        });
        \u0275\u0275repeaterCreate(12, DeviceDialogComponent_For_13_Template, 4, 3, "mat-option", 6, _forTrack0);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(14, "mat-form-field", 4)(15, "mat-label");
        \u0275\u0275text(16, "Type d'appareil");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(17, "mat-select", 5);
        \u0275\u0275twoWayListener("ngModelChange", function DeviceDialogComponent_Template_mat_select_ngModelChange_17_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.deviceType, $event) || (ctx.deviceType = $event);
          return $event;
        });
        \u0275\u0275repeaterCreate(18, DeviceDialogComponent_For_19_Template, 4, 3, "mat-option", 6, _forTrack1);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(20, "mat-form-field", 1)(21, "mat-label");
        \u0275\u0275text(22, "Plugin");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "mat-select", 5);
        \u0275\u0275twoWayListener("ngModelChange", function DeviceDialogComponent_Template_mat_select_ngModelChange_23_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.pluginId, $event) || (ctx.pluginId = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function DeviceDialogComponent_Template_mat_select_ngModelChange_23_listener() {
          return ctx.onPluginChange();
        });
        \u0275\u0275repeaterCreate(24, DeviceDialogComponent_For_25_Template, 6, 4, "mat-option", 6, _forTrack0);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(26, DeviceDialogComponent_Conditional_26_Template, 16, 3)(27, DeviceDialogComponent_Conditional_27_Template, 5, 0, "div", 7);
        \u0275\u0275elementStart(28, "div", 8)(29, "mat-slide-toggle", 9);
        \u0275\u0275twoWayListener("ngModelChange", function DeviceDialogComponent_Template_mat_slide_toggle_ngModelChange_29_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.isVisible, $event) || (ctx.isVisible = $event);
          return $event;
        });
        \u0275\u0275text(30, "Visible sur le dashboard");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(31, "mat-slide-toggle", 9);
        \u0275\u0275twoWayListener("ngModelChange", function DeviceDialogComponent_Template_mat_slide_toggle_ngModelChange_31_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.historize, $event) || (ctx.historize = $event);
          return $event;
        });
        \u0275\u0275text(32, "Activer l'historisation");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(33, "mat-slide-toggle", 9);
        \u0275\u0275twoWayListener("ngModelChange", function DeviceDialogComponent_Template_mat_slide_toggle_ngModelChange_33_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.notifyOnStateChange, $event) || (ctx.notifyOnStateChange = $event);
          return $event;
        });
        \u0275\u0275text(34, "Notification Telegram au changement d'etat");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(35, "mat-dialog-actions", 10)(36, "button", 11);
        \u0275\u0275listener("click", function DeviceDialogComponent_Template_button_click_36_listener() {
          return ctx.cancel();
        });
        \u0275\u0275text(37, "Annuler");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(38, "button", 12);
        \u0275\u0275listener("click", function DeviceDialogComponent_Template_button_click_38_listener() {
          return ctx.save();
        });
        \u0275\u0275text(39);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(ctx.isEdit ? "Modifier l'appareil" : "Nouvel appareil");
        \u0275\u0275advance(5);
        \u0275\u0275twoWayProperty("ngModel", ctx.name);
        \u0275\u0275advance(5);
        \u0275\u0275twoWayProperty("ngModel", ctx.roomId);
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.rooms);
        \u0275\u0275advance(5);
        \u0275\u0275twoWayProperty("ngModel", ctx.deviceType);
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.deviceTypes);
        \u0275\u0275advance(5);
        \u0275\u0275twoWayProperty("ngModel", ctx.pluginId);
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.plugins);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(26, ctx.deviceType === "thermostat" ? 26 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(27, ctx.configFields.length > 0 ? 27 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275twoWayProperty("ngModel", ctx.isVisible);
        \u0275\u0275advance(2);
        \u0275\u0275twoWayProperty("ngModel", ctx.historize);
        \u0275\u0275advance(2);
        \u0275\u0275twoWayProperty("ngModel", ctx.notifyOnStateChange);
        \u0275\u0275advance(5);
        \u0275\u0275property("disabled", !ctx.name.trim() || !ctx.roomId || !ctx.pluginId);
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.isEdit ? "Modifier" : "Cr\xE9er", " ");
      }
    }, dependencies: [
      CommonModule,
      FormsModule,
      DefaultValueAccessor,
      NumberValueAccessor,
      NgControlStatus,
      RequiredValidator,
      MinValidator,
      MaxValidator,
      NgModel,
      MatDialogModule,
      MatDialogTitle,
      MatDialogActions,
      MatDialogContent,
      MatFormFieldModule,
      MatFormField,
      MatLabel,
      MatHint,
      MatInputModule,
      MatInput,
      MatSelectModule,
      MatSelect,
      MatOption,
      MatButtonModule,
      MatButton,
      MatIconModule,
      MatIcon,
      MatCheckboxModule,
      MatSlideToggleModule,
      MatSlideToggle
    ], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\nmat-dialog-content[_ngcontent-%COMP%] {\n  padding: 8px 24px 16px !important;\n}\n.full-width[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.half-width[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.form-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n}\n.config-section[_ngcontent-%COMP%] {\n  margin: 20px 0;\n  padding: 20px;\n  background: rgba(255, 255, 255, 0.03);\n  border-radius: 10px;\n  border: 1px solid var(--thidom-border);\n}\n.config-section[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n  font-weight: 500;\n  color: var(--thidom-green);\n  margin-bottom: 16px;\n}\n.thermostat-section-label[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n  font-weight: 500;\n  color: var(--thidom-green);\n  margin: 16px 0 8px;\n  display: block;\n}\n.toggles-row[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n  margin-top: 16px;\n  padding: 16px;\n  background: rgba(255, 255, 255, 0.03);\n  border-radius: 10px;\n  border: 1px solid var(--thidom-border);\n}\n/*# sourceMappingURL=device-dialog.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DeviceDialogComponent, { className: "DeviceDialogComponent", filePath: "src\\app\\features\\devices\\device-dialog\\device-dialog.component.ts", lineNumber: 32 });
})();

// src/app/features/devices/devices.component.ts
var _forTrack02 = ($index, $item) => $item.id;
function DevicesComponent_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const room_r1 = ctx.$implicit;
    \u0275\u0275property("value", room_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(room_r1.name);
  }
}
function DevicesComponent_For_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const type_r2 = ctx.$implicit;
    \u0275\u0275property("value", type_r2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(type_r2);
  }
}
function DevicesComponent_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-progress-bar", 11);
  }
}
function DevicesComponent_For_34_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 31);
    \u0275\u0275listener("click", function DevicesComponent_For_34_Conditional_28_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r6);
      const device_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.toggleDevice(device_r4));
    });
    \u0275\u0275elementStart(3, "mat-icon");
    \u0275\u0275text(4, "power_settings_new");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const device_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275classProp("on", ctx_r4.isOn(device_r4));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r4.isOn(device_r4) ? "Allum\xE9" : "\xC9teint", " ");
    \u0275\u0275advance();
    \u0275\u0275property("matTooltip", ctx_r4.isOn(device_r4) ? "\xC9teindre" : "Allumer");
    \u0275\u0275advance();
    \u0275\u0275classProp("on", ctx_r4.isOn(device_r4));
  }
}
function DevicesComponent_For_34_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const device_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", device_r4.state.temperature, "\xB0C");
  }
}
function DevicesComponent_For_34_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 29);
    \u0275\u0275text(1, "timeline");
    \u0275\u0275elementEnd();
  }
}
function DevicesComponent_For_34_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 30);
    \u0275\u0275text(1, "visibility_off");
    \u0275\u0275elementEnd();
  }
}
function DevicesComponent_For_34_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "div", 16)(2, "div", 17)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 18)(6, "span", 19);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 20);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "button", 21)(11, "mat-icon");
    \u0275\u0275text(12, "more_vert");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "mat-menu", null, 0)(15, "button", 22);
    \u0275\u0275listener("click", function DevicesComponent_For_34_Template_button_click_15_listener() {
      const device_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.openEditDialog(device_r4));
    });
    \u0275\u0275elementStart(16, "mat-icon");
    \u0275\u0275text(17, "edit");
    \u0275\u0275elementEnd();
    \u0275\u0275text(18, " Modifier ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "button", 23);
    \u0275\u0275listener("click", function DevicesComponent_For_34_Template_button_click_19_listener() {
      const device_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.deleteDevice(device_r4));
    });
    \u0275\u0275elementStart(20, "mat-icon");
    \u0275\u0275text(21, "delete");
    \u0275\u0275elementEnd();
    \u0275\u0275text(22, " Supprimer ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "div", 24)(24, "div", 25)(25, "mat-chip");
    \u0275\u0275text(26);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div", 26);
    \u0275\u0275template(28, DevicesComponent_For_34_Conditional_28_Template, 5, 6)(29, DevicesComponent_For_34_Conditional_29_Template, 2, 1, "span", 27);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "div", 28);
    \u0275\u0275template(31, DevicesComponent_For_34_Conditional_31_Template, 2, 0, "mat-icon", 29)(32, DevicesComponent_For_34_Conditional_32_Template, 2, 0, "mat-icon", 30);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const device_r4 = ctx.$implicit;
    const deviceMenu_r7 = \u0275\u0275reference(14);
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275classProp("device-on", ctx_r4.isOn(device_r4));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("on", ctx_r4.isOn(device_r4));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r4.getDeviceIcon(device_r4));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(device_r4.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", ctx_r4.getRoomName(device_r4.room_id), " \xB7 ", ctx_r4.getPluginName(device_r4.plugin_id), " ");
    \u0275\u0275advance();
    \u0275\u0275property("matMenuTriggerFor", deviceMenu_r7);
    \u0275\u0275advance(16);
    \u0275\u0275textInterpolate(device_r4.device_type);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(28, device_r4.state && device_r4.state.power !== void 0 ? 28 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(29, (device_r4.state == null ? null : device_r4.state.temperature) !== void 0 ? 29 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(31, device_r4.historize ? 31 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(32, !device_r4.is_visible ? 32 : -1);
  }
}
function DevicesComponent_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14)(1, "mat-icon");
    \u0275\u0275text(2, "devices_other");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "Aucun appareil trouv\xE9");
    \u0275\u0275elementEnd()();
  }
}
var DevicesComponent = class _DevicesComponent {
  get filteredDevices() {
    return this.devices.filter((d) => {
      if (this.filterRoom && d.room_id !== this.filterRoom)
        return false;
      if (this.filterType && d.device_type !== this.filterType)
        return false;
      if (this.searchText && !d.name.toLowerCase().includes(this.searchText.toLowerCase()))
        return false;
      return true;
    });
  }
  get deviceTypes() {
    return [...new Set(this.devices.map((d) => d.device_type))];
  }
  constructor(deviceService, roomService, pluginService, dialog, snackBar) {
    this.deviceService = deviceService;
    this.roomService = roomService;
    this.pluginService = pluginService;
    this.dialog = dialog;
    this.snackBar = snackBar;
    this.devices = [];
    this.rooms = [];
    this.plugins = [];
    this.loading = true;
    this.filterRoom = null;
    this.filterType = "";
    this.searchText = "";
  }
  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.loading = true;
    this.roomService.getRooms().subscribe((rooms) => this.rooms = rooms);
    this.pluginService.getPlugins().subscribe((plugins) => this.plugins = plugins);
    this.deviceService.getDevices().subscribe({
      next: (devices) => {
        this.devices = devices;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open("Erreur de chargement des appareils", "Fermer", { duration: 3e3 });
      }
    });
  }
  openCreateDialog() {
    const dialogRef = this.dialog.open(DeviceDialogComponent, {
      width: "720px",
      maxHeight: "90vh",
      data: { device: null, rooms: this.rooms, plugins: this.plugins, devices: this.devices }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deviceService.createDevice(result).subscribe({
          next: () => {
            this.loadData();
            this.snackBar.open("Appareil cr\xE9\xE9", "OK", { duration: 3e3 });
          },
          error: () => this.snackBar.open("Erreur lors de la cr\xE9ation", "Fermer", { duration: 3e3 })
        });
      }
    });
  }
  openEditDialog(device) {
    const dialogRef = this.dialog.open(DeviceDialogComponent, {
      width: "720px",
      maxHeight: "90vh",
      data: { device, rooms: this.rooms, plugins: this.plugins, devices: this.devices }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deviceService.updateDevice(device.id, result).subscribe({
          next: () => {
            this.loadData();
            this.snackBar.open("Appareil modifi\xE9", "OK", { duration: 3e3 });
          },
          error: () => this.snackBar.open("Erreur lors de la modification", "Fermer", { duration: 3e3 })
        });
      }
    });
  }
  deleteDevice(device) {
    if (confirm(`Supprimer l'appareil "${device.name}" ?`)) {
      this.deviceService.deleteDevice(device.id).subscribe({
        next: () => {
          this.loadData();
          this.snackBar.open("Appareil supprim\xE9", "OK", { duration: 3e3 });
        },
        error: () => this.snackBar.open("Erreur lors de la suppression", "Fermer", { duration: 3e3 })
      });
    }
  }
  getRoomName(roomId) {
    return this.rooms.find((r) => r.id === roomId)?.name || "\u2014";
  }
  getPluginName(pluginId) {
    return this.plugins.find((p) => p.id === pluginId)?.name || "\u2014";
  }
  getDeviceIcon(device) {
    const icons = {
      light: "lightbulb",
      switch: "toggle_on",
      sensor: "sensors",
      thermostat: "thermostat",
      cover: "blinds",
      lock: "lock",
      camera: "videocam",
      variable: "data_object"
    };
    return device.icon || icons[device.device_type] || "devices";
  }
  toggleDevice(device) {
    const action = device.state?.power === "on" ? "turn_off" : "turn_on";
    this.deviceService.executeAction(device.id, action).subscribe((updated) => {
      const idx = this.devices.findIndex((d) => d.id === device.id);
      if (idx >= 0)
        this.devices[idx] = updated;
    });
  }
  isOn(device) {
    return device.state?.power === "on";
  }
  static {
    this.\u0275fac = function DevicesComponent_Factory(t) {
      return new (t || _DevicesComponent)(\u0275\u0275directiveInject(DeviceService), \u0275\u0275directiveInject(RoomService), \u0275\u0275directiveInject(PluginService), \u0275\u0275directiveInject(MatDialog), \u0275\u0275directiveInject(MatSnackBar));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DevicesComponent, selectors: [["app-devices"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 36, vars: 6, consts: [["deviceMenu", "matMenu"], [1, "page-container", "fade-in"], [1, "page-header"], ["mat-raised-button", "", "color", "primary", 3, "click"], [1, "filters-row"], ["appearance", "outline", 1, "filter-field"], ["matInput", "", "placeholder", "Nom de l'appareil...", 3, "ngModelChange", "ngModel"], ["matSuffix", ""], [3, "ngModelChange", "ngModel"], [3, "value"], ["value", ""], ["mode", "indeterminate", "color", "accent"], [1, "card-grid"], [1, "thidom-card", "device-card", 3, "device-on"], [1, "empty-state"], [1, "thidom-card", "device-card"], [1, "device-header"], [1, "device-icon"], [1, "device-info"], [1, "device-name"], [1, "device-meta"], ["mat-icon-button", "", 3, "matMenuTriggerFor"], ["mat-menu-item", "", 3, "click"], ["mat-menu-item", "", 1, "delete-action", 3, "click"], [1, "device-body"], [1, "device-type-badge"], [1, "device-state-row"], [1, "state-text"], [1, "device-footer"], ["matTooltip", "Historisation active", 1, "badge-icon"], ["matTooltip", "Masqu\xE9 du dashboard", 1, "badge-icon"], ["mat-icon-button", "", 3, "click", "matTooltip"]], template: function DevicesComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "h1");
        \u0275\u0275text(3, "Appareils");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "button", 3);
        \u0275\u0275listener("click", function DevicesComponent_Template_button_click_4_listener() {
          return ctx.openCreateDialog();
        });
        \u0275\u0275elementStart(5, "mat-icon");
        \u0275\u0275text(6, "add");
        \u0275\u0275elementEnd();
        \u0275\u0275text(7, " Nouvel appareil ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(8, "div", 4)(9, "mat-form-field", 5)(10, "mat-label");
        \u0275\u0275text(11, "Rechercher");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "input", 6);
        \u0275\u0275twoWayListener("ngModelChange", function DevicesComponent_Template_input_ngModelChange_12_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.searchText, $event) || (ctx.searchText = $event);
          return $event;
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(13, "mat-icon", 7);
        \u0275\u0275text(14, "search");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(15, "mat-form-field", 5)(16, "mat-label");
        \u0275\u0275text(17, "Pi\xE8ce");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(18, "mat-select", 8);
        \u0275\u0275twoWayListener("ngModelChange", function DevicesComponent_Template_mat_select_ngModelChange_18_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filterRoom, $event) || (ctx.filterRoom = $event);
          return $event;
        });
        \u0275\u0275elementStart(19, "mat-option", 9);
        \u0275\u0275text(20, "Toutes");
        \u0275\u0275elementEnd();
        \u0275\u0275repeaterCreate(21, DevicesComponent_For_22_Template, 2, 2, "mat-option", 9, _forTrack02);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(23, "mat-form-field", 5)(24, "mat-label");
        \u0275\u0275text(25, "Type");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(26, "mat-select", 8);
        \u0275\u0275twoWayListener("ngModelChange", function DevicesComponent_Template_mat_select_ngModelChange_26_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filterType, $event) || (ctx.filterType = $event);
          return $event;
        });
        \u0275\u0275elementStart(27, "mat-option", 10);
        \u0275\u0275text(28, "Tous");
        \u0275\u0275elementEnd();
        \u0275\u0275repeaterCreate(29, DevicesComponent_For_30_Template, 2, 2, "mat-option", 9, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(31, DevicesComponent_Conditional_31_Template, 1, 0, "mat-progress-bar", 11);
        \u0275\u0275elementStart(32, "div", 12);
        \u0275\u0275repeaterCreate(33, DevicesComponent_For_34_Template, 33, 14, "div", 13, _forTrack02);
        \u0275\u0275elementEnd();
        \u0275\u0275template(35, DevicesComponent_Conditional_35_Template, 5, 0, "div", 14);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(12);
        \u0275\u0275twoWayProperty("ngModel", ctx.searchText);
        \u0275\u0275advance(6);
        \u0275\u0275twoWayProperty("ngModel", ctx.filterRoom);
        \u0275\u0275advance();
        \u0275\u0275property("value", null);
        \u0275\u0275advance(2);
        \u0275\u0275repeater(ctx.rooms);
        \u0275\u0275advance(5);
        \u0275\u0275twoWayProperty("ngModel", ctx.filterType);
        \u0275\u0275advance(3);
        \u0275\u0275repeater(ctx.deviceTypes);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(31, ctx.loading ? 31 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275repeater(ctx.filteredDevices);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(35, !ctx.loading && ctx.filteredDevices.length === 0 ? 35 : -1);
      }
    }, dependencies: [
      CommonModule,
      FormsModule,
      DefaultValueAccessor,
      NgControlStatus,
      NgModel,
      MatCardModule,
      MatIconModule,
      MatIcon,
      MatButtonModule,
      MatButton,
      MatIconButton,
      MatDialogModule,
      MatFormFieldModule,
      MatFormField,
      MatLabel,
      MatSuffix,
      MatInputModule,
      MatInput,
      MatSelectModule,
      MatSelect,
      MatOption,
      MatSnackBarModule,
      MatProgressBarModule,
      MatProgressBar,
      MatMenuModule,
      MatMenu,
      MatMenuItem,
      MatMenuTrigger,
      MatChipsModule,
      MatChip,
      MatTooltipModule,
      MatTooltip,
      MatSlideToggleModule
    ], styles: ["\n\n.filters-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n  margin-bottom: 20px;\n  flex-wrap: wrap;\n}\n.filters-row[_ngcontent-%COMP%]   .filter-field[_ngcontent-%COMP%] {\n  min-width: 200px;\n  flex: 1;\n}\n.device-card[_ngcontent-%COMP%] {\n  border-left: 3px solid transparent;\n}\n.device-card.device-on[_ngcontent-%COMP%] {\n  border-left-color: var(--thidom-green);\n}\n.device-card[_ngcontent-%COMP%]   .device-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 12px;\n}\n.device-card[_ngcontent-%COMP%]   .device-header[_ngcontent-%COMP%]   .device-icon[_ngcontent-%COMP%] {\n  width: 42px;\n  height: 42px;\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(255, 255, 255, 0.05);\n  color: var(--thidom-text-secondary);\n}\n.device-card[_ngcontent-%COMP%]   .device-header[_ngcontent-%COMP%]   .device-icon.on[_ngcontent-%COMP%] {\n  background: rgba(0, 230, 118, 0.12);\n  color: var(--thidom-green);\n}\n.device-card[_ngcontent-%COMP%]   .device-header[_ngcontent-%COMP%]   .device-info[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.device-card[_ngcontent-%COMP%]   .device-header[_ngcontent-%COMP%]   .device-info[_ngcontent-%COMP%]   .device-name[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 500;\n  color: var(--thidom-text-primary);\n}\n.device-card[_ngcontent-%COMP%]   .device-header[_ngcontent-%COMP%]   .device-info[_ngcontent-%COMP%]   .device-meta[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: var(--thidom-text-secondary);\n}\n.device-card[_ngcontent-%COMP%]   .device-body[_ngcontent-%COMP%]   .device-type-badge[_ngcontent-%COMP%] {\n  margin-bottom: 8px;\n}\n.device-card[_ngcontent-%COMP%]   .device-body[_ngcontent-%COMP%]   .device-state-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n.device-card[_ngcontent-%COMP%]   .device-body[_ngcontent-%COMP%]   .device-state-row[_ngcontent-%COMP%]   .state-text[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  color: var(--thidom-text-secondary);\n}\n.device-card[_ngcontent-%COMP%]   .device-body[_ngcontent-%COMP%]   .device-state-row[_ngcontent-%COMP%]   .state-text.on[_ngcontent-%COMP%] {\n  color: var(--thidom-green);\n}\n.device-card[_ngcontent-%COMP%]   .device-body[_ngcontent-%COMP%]   .device-state-row[_ngcontent-%COMP%]   .on[_ngcontent-%COMP%] {\n  color: var(--thidom-green);\n}\n.device-card[_ngcontent-%COMP%]   .device-footer[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  margin-top: 12px;\n  padding-top: 8px;\n  border-top: 1px solid var(--thidom-border);\n}\n.device-card[_ngcontent-%COMP%]   .device-footer[_ngcontent-%COMP%]   .badge-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n  color: var(--thidom-text-secondary);\n}\n.empty-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 60px 20px;\n  color: var(--thidom-text-secondary);\n}\n.empty-state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 4rem;\n  width: 64px;\n  height: 64px;\n  margin-bottom: 16px;\n  opacity: 0.4;\n}\n.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  color: var(--thidom-text-primary);\n}\n.delete-action[_ngcontent-%COMP%] {\n  color: #f44336;\n}\n/*# sourceMappingURL=devices.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DevicesComponent, { className: "DevicesComponent", filePath: "src\\app\\features\\devices\\devices.component.ts", lineNumber: 46 });
})();
export {
  DevicesComponent
};
//# sourceMappingURL=chunk-LXBSOFFZ.js.map
