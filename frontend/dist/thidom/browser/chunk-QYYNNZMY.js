import {
  MatProgressSpinner,
  MatProgressSpinnerModule
} from "./chunk-I7UA5NI6.js";
import {
  PluginService
} from "./chunk-NJMTHRNX.js";
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
  MatDialogClose,
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
  MatLabel
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
  NgControlStatus,
  NgModel,
  NumberValueAccessor
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

// src/app/features/plugins/plugin-setup-dialog/plugin-setup-dialog.component.ts
var _forTrack0 = ($index, $item) => $item.key;
var _forTrack1 = ($index, $item) => $item.port;
function PluginSetupDialogComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275element(1, "mat-spinner", 4);
    \u0275\u0275elementEnd();
  }
}
function PluginSetupDialogComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 5);
    \u0275\u0275text(1, "Ce plugin ne necessite pas de configuration hub.");
    \u0275\u0275elementEnd();
  }
}
function PluginSetupDialogComponent_Conditional_7_For_2_Conditional_0_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 11);
    \u0275\u0275text(1, "Aucun port detecte");
    \u0275\u0275elementEnd();
  }
}
function PluginSetupDialogComponent_Conditional_7_For_2_Conditional_0_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sp_r4 = ctx.$implicit;
    \u0275\u0275property("value", sp_r4.port);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", sp_r4.port, " \u2013 ", sp_r4.description, " ");
  }
}
function PluginSetupDialogComponent_Conditional_7_For_2_Conditional_0_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r2 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", ctx_r2.config[field_r2.key]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.config[field_r2.key], " (non detecte) ");
  }
}
function PluginSetupDialogComponent_Conditional_7_For_2_Conditional_0_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-hint");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(field_r2.description);
  }
}
function PluginSetupDialogComponent_Conditional_7_For_2_Conditional_0_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 14);
  }
}
function PluginSetupDialogComponent_Conditional_7_For_2_Conditional_0_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1, "refresh");
    \u0275\u0275elementEnd();
  }
}
function PluginSetupDialogComponent_Conditional_7_For_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "mat-form-field", 9)(2, "mat-label");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "mat-select", 10);
    \u0275\u0275twoWayListener("ngModelChange", function PluginSetupDialogComponent_Conditional_7_For_2_Conditional_0_Template_mat_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r1);
      const field_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.config[field_r2.key], $event) || (ctx_r2.config[field_r2.key] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275template(5, PluginSetupDialogComponent_Conditional_7_For_2_Conditional_0_Conditional_5_Template, 2, 0, "mat-option", 11);
    \u0275\u0275repeaterCreate(6, PluginSetupDialogComponent_Conditional_7_For_2_Conditional_0_For_7_Template, 2, 3, "mat-option", 12, _forTrack1);
    \u0275\u0275template(8, PluginSetupDialogComponent_Conditional_7_For_2_Conditional_0_Conditional_8_Template, 2, 2, "mat-option", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275template(9, PluginSetupDialogComponent_Conditional_7_For_2_Conditional_0_Conditional_9_Template, 2, 1, "mat-hint");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 13);
    \u0275\u0275listener("click", function PluginSetupDialogComponent_Conditional_7_For_2_Conditional_0_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.refreshSerialPorts());
    });
    \u0275\u0275template(11, PluginSetupDialogComponent_Conditional_7_For_2_Conditional_0_Conditional_11_Template, 1, 0, "mat-spinner", 14)(12, PluginSetupDialogComponent_Conditional_7_For_2_Conditional_0_Conditional_12_Template, 2, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const field_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(field_r2.title);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.config[field_r2.key]);
    \u0275\u0275advance();
    \u0275\u0275conditional(5, ctx_r2.serialPorts.length === 0 && !ctx_r2.loadingPorts ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.serialPorts);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(8, ctx_r2.config[field_r2.key] && !ctx_r2.isPortInList(ctx_r2.config[field_r2.key]) ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(9, field_r2.description ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r2.loadingPorts);
    \u0275\u0275advance();
    \u0275\u0275conditional(11, ctx_r2.loadingPorts ? 11 : 12);
  }
}
function PluginSetupDialogComponent_Conditional_7_For_2_Conditional_1_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opt_r6 = ctx.$implicit;
    \u0275\u0275property("value", opt_r6);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(opt_r6);
  }
}
function PluginSetupDialogComponent_Conditional_7_For_2_Conditional_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-hint");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(field_r2.description);
  }
}
function PluginSetupDialogComponent_Conditional_7_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-form-field", 15)(1, "mat-label");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "mat-select", 10);
    \u0275\u0275twoWayListener("ngModelChange", function PluginSetupDialogComponent_Conditional_7_For_2_Conditional_1_Template_mat_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r5);
      const field_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.config[field_r2.key], $event) || (ctx_r2.config[field_r2.key] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(4, PluginSetupDialogComponent_Conditional_7_For_2_Conditional_1_For_5_Template, 2, 2, "mat-option", 12, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, PluginSetupDialogComponent_Conditional_7_For_2_Conditional_1_Conditional_6_Template, 2, 1, "mat-hint");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(field_r2.title);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.config[field_r2.key]);
    \u0275\u0275advance();
    \u0275\u0275repeater(field_r2.enum);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(6, field_r2.description ? 6 : -1);
  }
}
function PluginSetupDialogComponent_Conditional_7_For_2_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 17);
    \u0275\u0275twoWayListener("ngModelChange", function PluginSetupDialogComponent_Conditional_7_For_2_Conditional_2_Conditional_3_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r7);
      const field_r2 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.config[field_r2.key], $event) || (ctx_r2.config[field_r2.key] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r2 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.config[field_r2.key]);
    \u0275\u0275property("placeholder", field_r2.description || "");
  }
}
function PluginSetupDialogComponent_Conditional_7_For_2_Conditional_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 18);
    \u0275\u0275twoWayListener("ngModelChange", function PluginSetupDialogComponent_Conditional_7_For_2_Conditional_2_Conditional_4_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r8);
      const field_r2 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.config[field_r2.key], $event) || (ctx_r2.config[field_r2.key] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r2 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("type", field_r2.format === "password" ? "password" : "text");
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.config[field_r2.key]);
    \u0275\u0275property("placeholder", field_r2.description || "");
  }
}
function PluginSetupDialogComponent_Conditional_7_For_2_Conditional_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-hint");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(field_r2.description);
  }
}
function PluginSetupDialogComponent_Conditional_7_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-form-field", 15)(1, "mat-label");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, PluginSetupDialogComponent_Conditional_7_For_2_Conditional_2_Conditional_3_Template, 1, 2, "input", 16)(4, PluginSetupDialogComponent_Conditional_7_For_2_Conditional_2_Conditional_4_Template, 1, 3)(5, PluginSetupDialogComponent_Conditional_7_For_2_Conditional_2_Conditional_5_Template, 2, 1, "mat-hint");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(field_r2.title);
    \u0275\u0275advance();
    \u0275\u0275conditional(3, field_r2.type === "integer" || field_r2.type === "number" ? 3 : 4);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(5, field_r2.description ? 5 : -1);
  }
}
function PluginSetupDialogComponent_Conditional_7_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, PluginSetupDialogComponent_Conditional_7_For_2_Conditional_0_Template, 13, 7, "div", 8)(1, PluginSetupDialogComponent_Conditional_7_For_2_Conditional_1_Template, 7, 3)(2, PluginSetupDialogComponent_Conditional_7_For_2_Conditional_2_Template, 6, 3);
  }
  if (rf & 2) {
    const field_r2 = ctx.$implicit;
    \u0275\u0275conditional(0, field_r2.format === "serial-port" ? 0 : field_r2.enum && field_r2.enum.length > 0 ? 1 : 2);
  }
}
function PluginSetupDialogComponent_Conditional_7_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19)(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("ok", ctx_r2.connectionStatus.connected)("err", !ctx_r2.connectionStatus.connected);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.connectionStatus.connected ? "check_circle" : "error");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.connectionStatus.message);
  }
}
function PluginSetupDialogComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275repeaterCreate(1, PluginSetupDialogComponent_Conditional_7_For_2_Template, 3, 1, null, null, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, PluginSetupDialogComponent_Conditional_7_Conditional_3_Template, 5, 6, "div", 7);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.fields);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(3, ctx_r2.connectionStatus ? 3 : -1);
  }
}
function PluginSetupDialogComponent_Conditional_11_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 21);
  }
}
function PluginSetupDialogComponent_Conditional_11_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 21);
  }
}
function PluginSetupDialogComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 20);
    \u0275\u0275listener("click", function PluginSetupDialogComponent_Conditional_11_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.test());
    });
    \u0275\u0275template(1, PluginSetupDialogComponent_Conditional_11_Conditional_1_Template, 1, 0, "mat-spinner", 21);
    \u0275\u0275text(2, " Tester la connexion ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 22);
    \u0275\u0275listener("click", function PluginSetupDialogComponent_Conditional_11_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.save());
    });
    \u0275\u0275template(4, PluginSetupDialogComponent_Conditional_11_Conditional_4_Template, 1, 0, "mat-spinner", 21);
    \u0275\u0275text(5, " Enregistrer ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r2.testing);
    \u0275\u0275advance();
    \u0275\u0275conditional(1, ctx_r2.testing ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.saving);
    \u0275\u0275advance();
    \u0275\u0275conditional(4, ctx_r2.saving ? 4 : -1);
  }
}
var PluginSetupDialogComponent = class _PluginSetupDialogComponent {
  constructor(dialogRef, data, pluginService, snackBar) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.pluginService = pluginService;
    this.snackBar = snackBar;
    this.fields = [];
    this.config = {};
    this.connectionStatus = null;
    this.loading = true;
    this.testing = false;
    this.saving = false;
    this.serialPorts = [];
    this.loadingPorts = false;
  }
  ngOnInit() {
    this.pluginService.getPluginHubSchema(this.data.plugin.id).subscribe({
      next: (res) => {
        const schema = res.hub_config_schema || {};
        const defaults = res.default_hub_config || {};
        const current = res.current_hub_config || {};
        this.fields = this.parseSchema(schema);
        this.config = __spreadValues(__spreadValues({}, defaults), current);
        this.loading = false;
        if (this.fields.some((f) => f.format === "serial-port")) {
          this.refreshSerialPorts();
        }
      },
      error: () => {
        this.loading = false;
      }
    });
    this.pluginService.getPluginStatus(this.data.plugin.id).subscribe({
      next: (s) => {
        this.connectionStatus = s;
      }
    });
  }
  parseSchema(schema) {
    const props = schema?.properties || {};
    return Object.entries(props).map(([key, p]) => ({
      key,
      type: p.type || "string",
      title: p.title || key,
      description: p.description,
      default: p.default,
      enum: p.enum,
      format: p.format
    }));
  }
  refreshSerialPorts() {
    this.loadingPorts = true;
    this.pluginService.getSerialPorts().subscribe({
      next: (ports) => {
        this.serialPorts = ports;
        this.loadingPorts = false;
      },
      error: () => {
        this.serialPorts = [];
        this.loadingPorts = false;
      }
    });
  }
  isPortInList(port) {
    return this.serialPorts.some((sp) => sp.port === port);
  }
  test() {
    this.testing = true;
    this.pluginService.testPluginConnection(this.data.plugin.id, this.config).subscribe({
      next: (s) => {
        this.connectionStatus = s;
        this.testing = false;
      },
      error: () => {
        this.connectionStatus = { connected: false, message: "Erreur lors du test" };
        this.testing = false;
      }
    });
  }
  save() {
    this.saving = true;
    this.pluginService.savePluginHubConfig(this.data.plugin.id, this.config).subscribe({
      next: (res) => {
        this.saving = false;
        this.connectionStatus = res.connection_status;
        this.snackBar.open("Configuration enregistree", "OK", { duration: 3e3 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.saving = false;
        this.snackBar.open("Erreur lors de la sauvegarde", "Fermer", { duration: 3e3 });
      }
    });
  }
  static {
    this.\u0275fac = function PluginSetupDialogComponent_Factory(t) {
      return new (t || _PluginSetupDialogComponent)(\u0275\u0275directiveInject(MatDialogRef), \u0275\u0275directiveInject(MAT_DIALOG_DATA), \u0275\u0275directiveInject(PluginService), \u0275\u0275directiveInject(MatSnackBar));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PluginSetupDialogComponent, selectors: [["app-plugin-setup-dialog"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 12, vars: 3, consts: [["mat-dialog-title", ""], [1, "center"], ["align", "end"], ["mat-button", "", "mat-dialog-close", ""], ["diameter", "32"], [1, "no-config"], [1, "form-fields"], [1, "status-bar", 3, "ok", "err"], [1, "serial-port-row"], ["appearance", "outline", 1, "flex-grow"], [3, "ngModelChange", "ngModel"], ["disabled", ""], [3, "value"], ["mat-icon-button", "", "matTooltip", "Rafraichir la liste des ports", 1, "refresh-btn", 3, "click", "disabled"], ["diameter", "20"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "type", "number", 3, "ngModel", "placeholder"], ["matInput", "", "type", "number", 3, "ngModelChange", "ngModel", "placeholder"], ["matInput", "", 3, "ngModelChange", "type", "ngModel", "placeholder"], [1, "status-bar"], ["mat-stroked-button", "", "color", "accent", 3, "click", "disabled"], ["diameter", "18", 1, "inline-spinner"], ["mat-raised-button", "", "color", "primary", 3, "click", "disabled"]], template: function PluginSetupDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "h2", 0)(1, "mat-icon");
        \u0275\u0275text(2, "settings");
        \u0275\u0275elementEnd();
        \u0275\u0275text(3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "mat-dialog-content");
        \u0275\u0275template(5, PluginSetupDialogComponent_Conditional_5_Template, 2, 0, "div", 1)(6, PluginSetupDialogComponent_Conditional_6_Template, 2, 0)(7, PluginSetupDialogComponent_Conditional_7_Template, 4, 1);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "mat-dialog-actions", 2)(9, "button", 3);
        \u0275\u0275text(10, "Annuler");
        \u0275\u0275elementEnd();
        \u0275\u0275template(11, PluginSetupDialogComponent_Conditional_11_Template, 6, 4);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate1(" Configuration \u2013 ", ctx.data.plugin.name, " ");
        \u0275\u0275advance(2);
        \u0275\u0275conditional(5, ctx.loading ? 5 : ctx.fields.length === 0 ? 6 : 7);
        \u0275\u0275advance(6);
        \u0275\u0275conditional(11, ctx.fields.length > 0 ? 11 : -1);
      }
    }, dependencies: [
      CommonModule,
      FormsModule,
      DefaultValueAccessor,
      NumberValueAccessor,
      NgControlStatus,
      NgModel,
      MatDialogModule,
      MatDialogClose,
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
      MatIconButton,
      MatIconModule,
      MatIcon,
      MatProgressSpinnerModule,
      MatProgressSpinner,
      MatSnackBarModule,
      MatTooltipModule,
      MatTooltip
    ], styles: ["\n\n.center[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  padding: 24px;\n}\n.no-config[_ngcontent-%COMP%] {\n  color: #888;\n  text-align: center;\n  padding: 16px;\n}\n.form-fields[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  min-width: 420px;\n}\n.full-width[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.serial-port-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 4px;\n}\n.serial-port-row[_ngcontent-%COMP%]   .flex-grow[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.refresh-btn[_ngcontent-%COMP%] {\n  margin-top: 8px;\n}\n.status-bar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 14px;\n  border-radius: 8px;\n  margin-top: 8px;\n  font-size: 0.9rem;\n}\n.status-bar.ok[_ngcontent-%COMP%] {\n  background: rgba(76, 175, 80, 0.12);\n  color: #2e7d32;\n}\n.status-bar.err[_ngcontent-%COMP%] {\n  background: rgba(244, 67, 54, 0.1);\n  color: #c62828;\n}\n.inline-spinner[_ngcontent-%COMP%] {\n  display: inline-block;\n  margin-right: 6px;\n}\nmat-dialog-actions[_ngcontent-%COMP%] {\n  gap: 8px;\n}\n/*# sourceMappingURL=plugin-setup-dialog.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PluginSetupDialogComponent, { className: "PluginSetupDialogComponent", filePath: "src\\app\\features\\plugins\\plugin-setup-dialog\\plugin-setup-dialog.component.ts", lineNumber: 157 });
})();

// src/app/features/plugins/plugins.component.ts
var _forTrack02 = ($index, $item) => $item.id;
function PluginsComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-progress-bar", 3);
  }
}
function PluginsComponent_Conditional_9_For_6_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r4 = ctx;
    \u0275\u0275classProp("ok", s_r4.connected)("err", !s_r4.connected);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r4.connected ? "check_circle" : "error_outline");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r4.message);
  }
}
function PluginsComponent_Conditional_9_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 9)(2, "div", 10)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 11)(6, "span", 12);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 13);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "mat-slide-toggle", 14);
    \u0275\u0275listener("change", function PluginsComponent_Conditional_9_For_6_Template_mat_slide_toggle_change_10_listener() {
      const plugin_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.togglePlugin(plugin_r2));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "p", 15);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275template(13, PluginsComponent_Conditional_9_For_6_Conditional_13_Template, 5, 6, "div", 16);
    \u0275\u0275elementStart(14, "div", 17)(15, "div", 18)(16, "mat-chip");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "mat-chip");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "button", 19);
    \u0275\u0275listener("click", function PluginsComponent_Conditional_9_For_6_Template_button_click_20_listener() {
      const plugin_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openSetup(plugin_r2));
    });
    \u0275\u0275elementStart(21, "mat-icon");
    \u0275\u0275text(22, "settings");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_17_0;
    const plugin_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("disabled", !plugin_r2.enabled);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(plugin_r2.icon || "extension");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(plugin_r2.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("v", plugin_r2.version, "");
    \u0275\u0275advance();
    \u0275\u0275property("checked", plugin_r2.enabled);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(plugin_r2.description);
    \u0275\u0275advance();
    \u0275\u0275conditional(13, (tmp_17_0 = plugin_r2.enabled && ctx_r2.status(plugin_r2)) ? 13 : -1, tmp_17_0);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(plugin_r2.category);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(plugin_r2.slug);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !plugin_r2.enabled);
  }
}
function PluginsComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2", 5)(1, "mat-icon");
    \u0275\u0275text(2, "settings_remote");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Plugins de controle ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 6);
    \u0275\u0275repeaterCreate(5, PluginsComponent_Conditional_9_For_6_Template, 23, 11, "div", 7, _forTrack02);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r2.controlPlugins);
  }
}
function PluginsComponent_Conditional_10_For_6_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r7 = ctx;
    \u0275\u0275classProp("ok", s_r7.connected)("err", !s_r7.connected);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r7.connected ? "check_circle" : "error_outline");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r7.message);
  }
}
function PluginsComponent_Conditional_10_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 9)(2, "div", 21)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 11)(6, "span", 12);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 13);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "mat-slide-toggle", 22);
    \u0275\u0275listener("change", function PluginsComponent_Conditional_10_For_6_Template_mat_slide_toggle_change_10_listener() {
      const plugin_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.togglePlugin(plugin_r6));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "p", 15);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275template(13, PluginsComponent_Conditional_10_For_6_Conditional_13_Template, 5, 6, "div", 16);
    \u0275\u0275elementStart(14, "div", 17)(15, "div", 18)(16, "mat-chip");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "mat-chip");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "button", 19);
    \u0275\u0275listener("click", function PluginsComponent_Conditional_10_For_6_Template_button_click_20_listener() {
      const plugin_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openSetup(plugin_r6));
    });
    \u0275\u0275elementStart(21, "mat-icon");
    \u0275\u0275text(22, "settings");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_17_0;
    const plugin_r6 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("disabled", !plugin_r6.enabled);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(plugin_r6.icon || "extension");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(plugin_r6.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("v", plugin_r6.version, "");
    \u0275\u0275advance();
    \u0275\u0275property("checked", plugin_r6.enabled);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(plugin_r6.description);
    \u0275\u0275advance();
    \u0275\u0275conditional(13, (tmp_17_0 = plugin_r6.enabled && ctx_r2.status(plugin_r6)) ? 13 : -1, tmp_17_0);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(plugin_r6.category);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(plugin_r6.slug);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !plugin_r6.enabled);
  }
}
function PluginsComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2", 5)(1, "mat-icon");
    \u0275\u0275text(2, "info");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Plugins d'information ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 6);
    \u0275\u0275repeaterCreate(5, PluginsComponent_Conditional_10_For_6_Template, 23, 11, "div", 7, _forTrack02);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r2.infoPlugins);
  }
}
function PluginsComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "mat-icon");
    \u0275\u0275text(2, "extension");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "Aucun plugin enregistre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6, 'Cliquez sur "Synchroniser" pour detecter les plugins disponibles');
    \u0275\u0275elementEnd()();
  }
}
var PluginsComponent = class _PluginsComponent {
  get controlPlugins() {
    return this.plugins.filter((p) => p.category === "control");
  }
  get infoPlugins() {
    return this.plugins.filter((p) => p.category === "info");
  }
  constructor(pluginService, snackBar, dialog) {
    this.pluginService = pluginService;
    this.snackBar = snackBar;
    this.dialog = dialog;
    this.plugins = [];
    this.statuses = {};
    this.loading = true;
    this.syncing = false;
  }
  ngOnInit() {
    this.loadPlugins();
  }
  loadPlugins() {
    this.loading = true;
    this.pluginService.getPlugins().subscribe({
      next: (plugins) => {
        this.plugins = plugins;
        this.loading = false;
        this.refreshStatuses();
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  refreshStatuses() {
    for (const p of this.plugins) {
      if (p.enabled) {
        this.pluginService.getPluginStatus(p.id).subscribe({
          next: (s) => {
            this.statuses[p.id] = s;
          }
        });
      }
    }
  }
  status(plugin) {
    return this.statuses[plugin.id] ?? null;
  }
  syncPlugins() {
    this.syncing = true;
    this.pluginService.syncPlugins().subscribe({
      next: (result) => {
        this.syncing = false;
        this.loadPlugins();
        this.snackBar.open(`Synchronisation terminee : ${result.synced?.length || 0} nouveau(x) plugin(s)`, "OK", { duration: 3e3 });
      },
      error: () => {
        this.syncing = false;
        this.snackBar.open("Erreur de synchronisation", "Fermer", { duration: 3e3 });
      }
    });
  }
  togglePlugin(plugin) {
    if (plugin.enabled) {
      if (!confirm(`Desactiver le plugin "${plugin.name}" ?

Tous les appareils lies seront eteints et les planifications/scenarios associes seront desactives.`)) {
        return;
      }
    }
    this.pluginService.updatePlugin(plugin.id, { enabled: !plugin.enabled }).subscribe({
      next: (updated) => {
        const idx = this.plugins.findIndex((p) => p.id === plugin.id);
        if (idx >= 0)
          this.plugins[idx] = updated;
        if (!updated.enabled) {
          delete this.statuses[plugin.id];
          this.snackBar.open(`Plugin "${updated.name}" desactive`, "OK", { duration: 5e3 });
        } else {
          this.snackBar.open(`Plugin "${updated.name}" active`, "OK", { duration: 3e3 });
          this.pluginService.getPluginStatus(updated.id).subscribe({
            next: (s) => {
              this.statuses[updated.id] = s;
            }
          });
        }
      }
    });
  }
  openSetup(plugin) {
    const ref = this.dialog.open(PluginSetupDialogComponent, {
      data: { plugin },
      width: "540px"
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved)
        this.refreshStatuses();
    });
  }
  static {
    this.\u0275fac = function PluginsComponent_Factory(t) {
      return new (t || _PluginsComponent)(\u0275\u0275directiveInject(PluginService), \u0275\u0275directiveInject(MatSnackBar), \u0275\u0275directiveInject(MatDialog));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PluginsComponent, selectors: [["app-plugins"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 12, vars: 6, consts: [[1, "page-container", "fade-in"], [1, "page-header"], ["mat-raised-button", "", "color", "primary", 3, "click", "disabled"], ["mode", "indeterminate", "color", "accent"], [1, "empty-state"], [1, "section-title"], [1, "card-grid"], [1, "thidom-card", "plugin-card", 3, "disabled"], [1, "thidom-card", "plugin-card"], [1, "plugin-header"], [1, "plugin-icon"], [1, "plugin-info"], [1, "plugin-name"], [1, "plugin-version"], ["matTooltip", "Activer/Desactiver", 3, "change", "checked"], [1, "plugin-description"], [1, "plugin-status", 3, "ok", "err"], [1, "plugin-footer"], [1, "plugin-chips"], ["mat-icon-button", "", "matTooltip", "Configurer le hub", 3, "click", "disabled"], [1, "plugin-status"], [1, "plugin-icon", "info"], [3, "change", "checked"]], template: function PluginsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1");
        \u0275\u0275text(3, "Plugins");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "button", 2);
        \u0275\u0275listener("click", function PluginsComponent_Template_button_click_4_listener() {
          return ctx.syncPlugins();
        });
        \u0275\u0275elementStart(5, "mat-icon");
        \u0275\u0275text(6, "sync");
        \u0275\u0275elementEnd();
        \u0275\u0275text(7);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(8, PluginsComponent_Conditional_8_Template, 1, 0, "mat-progress-bar", 3)(9, PluginsComponent_Conditional_9_Template, 7, 0)(10, PluginsComponent_Conditional_10_Template, 7, 0)(11, PluginsComponent_Conditional_11_Template, 7, 0, "div", 4);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(4);
        \u0275\u0275property("disabled", ctx.syncing);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate1(" ", ctx.syncing ? "Synchronisation..." : "Synchroniser", " ");
        \u0275\u0275advance();
        \u0275\u0275conditional(8, ctx.loading ? 8 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(9, ctx.controlPlugins.length > 0 ? 9 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(10, ctx.infoPlugins.length > 0 ? 10 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(11, !ctx.loading && ctx.plugins.length === 0 ? 11 : -1);
      }
    }, dependencies: [
      CommonModule,
      MatCardModule,
      MatIconModule,
      MatIcon,
      MatButtonModule,
      MatButton,
      MatIconButton,
      MatChipsModule,
      MatChip,
      MatSnackBarModule,
      MatProgressBarModule,
      MatProgressBar,
      MatSlideToggleModule,
      MatSlideToggle,
      MatTooltipModule,
      MatTooltip,
      MatDialogModule
    ], styles: ["\n\n.section-title[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 1.2rem;\n  font-weight: 400;\n  color: var(--thidom-text-primary);\n  margin: 24px 0 16px;\n}\n.section-title[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: var(--thidom-green);\n}\n.plugin-card.disabled[_ngcontent-%COMP%] {\n  opacity: 0.5;\n}\n.plugin-card[_ngcontent-%COMP%]   .plugin-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 12px;\n}\n.plugin-card[_ngcontent-%COMP%]   .plugin-header[_ngcontent-%COMP%]   .plugin-icon[_ngcontent-%COMP%] {\n  width: 44px;\n  height: 44px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(0, 230, 118, 0.1);\n  color: var(--thidom-green);\n}\n.plugin-card[_ngcontent-%COMP%]   .plugin-header[_ngcontent-%COMP%]   .plugin-icon.info[_ngcontent-%COMP%] {\n  background: rgba(33, 150, 243, 0.1);\n  color: #42a5f5;\n}\n.plugin-card[_ngcontent-%COMP%]   .plugin-header[_ngcontent-%COMP%]   .plugin-info[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.plugin-card[_ngcontent-%COMP%]   .plugin-header[_ngcontent-%COMP%]   .plugin-info[_ngcontent-%COMP%]   .plugin-name[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 500;\n  font-size: 1.05rem;\n  color: var(--thidom-text-primary);\n}\n.plugin-card[_ngcontent-%COMP%]   .plugin-header[_ngcontent-%COMP%]   .plugin-info[_ngcontent-%COMP%]   .plugin-version[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: var(--thidom-text-secondary);\n}\n.plugin-card[_ngcontent-%COMP%]   .plugin-description[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  color: var(--thidom-text-secondary);\n  margin-bottom: 12px;\n  line-height: 1.4;\n}\n.plugin-card[_ngcontent-%COMP%]   .plugin-footer[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.plugin-card[_ngcontent-%COMP%]   .plugin-footer[_ngcontent-%COMP%]   .plugin-chips[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  flex: 1;\n}\n.plugin-card[_ngcontent-%COMP%]   .plugin-status[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 12px;\n  border-radius: 8px;\n  font-size: 0.85rem;\n  margin-bottom: 12px;\n}\n.plugin-card[_ngcontent-%COMP%]   .plugin-status.ok[_ngcontent-%COMP%] {\n  background: rgba(76, 175, 80, 0.1);\n  color: #2e7d32;\n}\n.plugin-card[_ngcontent-%COMP%]   .plugin-status.err[_ngcontent-%COMP%] {\n  background: rgba(244, 67, 54, 0.1);\n  color: #c62828;\n}\n.plugin-card[_ngcontent-%COMP%]   .plugin-status[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.empty-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 60px 20px;\n  color: var(--thidom-text-secondary);\n}\n.empty-state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 4rem;\n  width: 64px;\n  height: 64px;\n  margin-bottom: 16px;\n  opacity: 0.4;\n}\n.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  margin-bottom: 8px;\n  color: var(--thidom-text-primary);\n}\n/*# sourceMappingURL=plugins.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PluginsComponent, { className: "PluginsComponent", filePath: "src\\app\\features\\plugins\\plugins.component.ts", lineNumber: 34 });
})();
export {
  PluginsComponent
};
//# sourceMappingURL=chunk-QYYNNZMY.js.map
