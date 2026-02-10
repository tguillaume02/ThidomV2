import {
  RoomService
} from "./chunk-LVNRJANL.js";
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
  MatLabel
} from "./chunk-A3S6NR4S.js";
import {
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
  RequiredValidator
} from "./chunk-3YNX47WL.js";
import {
  CommonModule,
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
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-7ID3BB7P.js";

// src/app/features/rooms/room-dialog/room-dialog.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function RoomDialogComponent_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 14);
    \u0275\u0275listener("click", function RoomDialogComponent_For_12_Template_button_click_0_listener() {
      const ic_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.icon = ic_r2);
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ic_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("selected", ctx_r2.icon === ic_r2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ic_r2);
  }
}
function RoomDialogComponent_For_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 15);
    \u0275\u0275listener("click", function RoomDialogComponent_For_18_Template_button_click_0_listener() {
      const c_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.color = c_r5);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r5 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("background", c_r5);
    \u0275\u0275classProp("selected", ctx_r2.color === c_r5);
  }
}
function RoomDialogComponent_For_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const room_r6 = ctx.$implicit;
    \u0275\u0275property("value", room_r6.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(room_r6.name);
  }
}
var ROOM_ICONS = [
  "meeting_room",
  "living",
  "bed",
  "kitchen",
  "bathroom",
  "garage",
  "deck",
  "balcony",
  "stairs",
  "roofing",
  "warehouse",
  "home",
  "cottage",
  "other_houses",
  "night_shelter",
  "storefront"
];
var ROOM_COLORS = [
  "#4CAF50",
  "#2196F3",
  "#FF9800",
  "#9C27B0",
  "#F44336",
  "#00BCD4",
  "#FF5722",
  "#607D8B",
  "#E91E63",
  "#009688"
];
var RoomDialogComponent = class _RoomDialogComponent {
  constructor(dialogRef, data) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.icons = ROOM_ICONS;
    this.colors = ROOM_COLORS;
    this.isEdit = !!data.room;
    this.name = data.room?.name || "";
    this.icon = data.room?.icon || "meeting_room";
    this.color = data.room?.color || "#4CAF50";
    this.parentId = data.room?.parent_id || null;
    this.availableParents = data.rooms || [];
  }
  save() {
    if (!this.name.trim())
      return;
    this.dialogRef.close({
      name: this.name.trim(),
      icon: this.icon,
      color: this.color,
      parent_id: this.parentId
    });
  }
  cancel() {
    this.dialogRef.close(null);
  }
  static {
    this.\u0275fac = function RoomDialogComponent_Factory(t) {
      return new (t || _RoomDialogComponent)(\u0275\u0275directiveInject(MatDialogRef), \u0275\u0275directiveInject(MAT_DIALOG_DATA));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RoomDialogComponent, selectors: [["app-room-dialog"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 32, vars: 6, consts: [["mat-dialog-title", ""], ["appearance", "outline", 1, "full-width"], ["matInput", "", "placeholder", "Ex: Salon", "required", "", 3, "ngModelChange", "ngModel"], [1, "icon-selector"], [1, "icon-grid"], [1, "icon-btn", 3, "selected"], [1, "color-selector"], [1, "color-grid"], [1, "color-btn", 3, "background", "selected"], [3, "ngModelChange", "ngModel"], [3, "value"], ["align", "end"], ["mat-button", "", 3, "click"], ["mat-raised-button", "", "color", "primary", 3, "click", "disabled"], [1, "icon-btn", 3, "click"], [1, "color-btn", 3, "click"]], template: function RoomDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "h2", 0);
        \u0275\u0275text(1);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(2, "mat-dialog-content")(3, "mat-form-field", 1)(4, "mat-label");
        \u0275\u0275text(5, "Nom de la pi\xE8ce");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "input", 2);
        \u0275\u0275twoWayListener("ngModelChange", function RoomDialogComponent_Template_input_ngModelChange_6_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.name, $event) || (ctx.name = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "div", 3)(8, "label");
        \u0275\u0275text(9, "Ic\xF4ne");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(10, "div", 4);
        \u0275\u0275repeaterCreate(11, RoomDialogComponent_For_12_Template, 3, 3, "button", 5, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(13, "div", 6)(14, "label");
        \u0275\u0275text(15, "Couleur");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(16, "div", 7);
        \u0275\u0275repeaterCreate(17, RoomDialogComponent_For_18_Template, 1, 4, "button", 8, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(19, "mat-form-field", 1)(20, "mat-label");
        \u0275\u0275text(21, "Pi\xE8ce parente (optionnel)");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(22, "mat-select", 9);
        \u0275\u0275twoWayListener("ngModelChange", function RoomDialogComponent_Template_mat_select_ngModelChange_22_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.parentId, $event) || (ctx.parentId = $event);
          return $event;
        });
        \u0275\u0275elementStart(23, "mat-option", 10);
        \u0275\u0275text(24, "Aucune (pi\xE8ce racine)");
        \u0275\u0275elementEnd();
        \u0275\u0275repeaterCreate(25, RoomDialogComponent_For_26_Template, 2, 2, "mat-option", 10, _forTrack0);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(27, "mat-dialog-actions", 11)(28, "button", 12);
        \u0275\u0275listener("click", function RoomDialogComponent_Template_button_click_28_listener() {
          return ctx.cancel();
        });
        \u0275\u0275text(29, "Annuler");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(30, "button", 13);
        \u0275\u0275listener("click", function RoomDialogComponent_Template_button_click_30_listener() {
          return ctx.save();
        });
        \u0275\u0275text(31);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(ctx.isEdit ? "Modifier la pi\xE8ce" : "Nouvelle pi\xE8ce");
        \u0275\u0275advance(5);
        \u0275\u0275twoWayProperty("ngModel", ctx.name);
        \u0275\u0275advance(5);
        \u0275\u0275repeater(ctx.icons);
        \u0275\u0275advance(6);
        \u0275\u0275repeater(ctx.colors);
        \u0275\u0275advance(5);
        \u0275\u0275twoWayProperty("ngModel", ctx.parentId);
        \u0275\u0275advance();
        \u0275\u0275property("value", null);
        \u0275\u0275advance(2);
        \u0275\u0275repeater(ctx.availableParents);
        \u0275\u0275advance(5);
        \u0275\u0275property("disabled", !ctx.name.trim());
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.isEdit ? "Modifier" : "Cr\xE9er", " ");
      }
    }, dependencies: [
      CommonModule,
      FormsModule,
      DefaultValueAccessor,
      NgControlStatus,
      RequiredValidator,
      NgModel,
      MatDialogModule,
      MatDialogTitle,
      MatDialogActions,
      MatDialogContent,
      MatFormFieldModule,
      MatFormField,
      MatLabel,
      MatInputModule,
      MatInput,
      MatSelectModule,
      MatSelect,
      MatOption,
      MatButtonModule,
      MatButton,
      MatIconModule,
      MatIcon
    ], styles: ["\n\n.full-width[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.icon-selector[_ngcontent-%COMP%], .color-selector[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n.icon-selector[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], .color-selector[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.85rem;\n  color: var(--thidom-text-secondary);\n  margin-bottom: 8px;\n}\n.icon-grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n.icon-grid[_ngcontent-%COMP%]   .icon-btn[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  border: 1px solid var(--thidom-border);\n  border-radius: 8px;\n  background: transparent;\n  color: var(--thidom-text-secondary);\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.2s;\n}\n.icon-grid[_ngcontent-%COMP%]   .icon-btn[_ngcontent-%COMP%]:hover, .icon-grid[_ngcontent-%COMP%]   .icon-btn.selected[_ngcontent-%COMP%] {\n  background: rgba(0, 230, 118, 0.15);\n  color: var(--thidom-green);\n  border-color: var(--thidom-green);\n}\n.color-grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n.color-grid[_ngcontent-%COMP%]   .color-btn[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  border: 2px solid transparent;\n  border-radius: 50%;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.color-grid[_ngcontent-%COMP%]   .color-btn[_ngcontent-%COMP%]:hover {\n  transform: scale(1.15);\n}\n.color-grid[_ngcontent-%COMP%]   .color-btn.selected[_ngcontent-%COMP%] {\n  border-color: white;\n  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);\n}\n/*# sourceMappingURL=room-dialog.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RoomDialogComponent, { className: "RoomDialogComponent", filePath: "src\\app\\features\\rooms\\room-dialog\\room-dialog.component.ts", lineNumber: 39 });
})();

// src/app/features/rooms/rooms.component.ts
var _forTrack02 = ($index, $item) => $item.id;
function RoomsComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-progress-bar", 4);
  }
}
function RoomsComponent_For_11_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13)(1, "mat-icon", 19);
    \u0275\u0275text(2, "subdirectory_arrow_right");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const room_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r2.getParentName(room_r2.parent_id), " ");
  }
}
function RoomsComponent_For_11_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "mat-icon");
    \u0275\u0275text(2, "account_tree");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const room_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", ctx_r2.getChildCount(room_r2.id), " sous-pi\xE8ce(s)");
  }
}
function RoomsComponent_For_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 9)(2, "div", 10)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 11)(6, "span", 12);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, RoomsComponent_For_11_Conditional_8_Template, 4, 1, "span", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "button", 14)(10, "mat-icon");
    \u0275\u0275text(11, "more_vert");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "mat-menu", null, 0)(14, "button", 15);
    \u0275\u0275listener("click", function RoomsComponent_For_11_Template_button_click_14_listener() {
      const room_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openEditDialog(room_r2));
    });
    \u0275\u0275elementStart(15, "mat-icon");
    \u0275\u0275text(16, "edit");
    \u0275\u0275elementEnd();
    \u0275\u0275text(17, " Modifier ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "button", 16);
    \u0275\u0275listener("click", function RoomsComponent_For_11_Template_button_click_18_listener() {
      const room_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.deleteRoom(room_r2));
    });
    \u0275\u0275elementStart(19, "mat-icon");
    \u0275\u0275text(20, "delete");
    \u0275\u0275elementEnd();
    \u0275\u0275text(21, " Supprimer ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "div", 17)(23, "div", 18)(24, "mat-icon");
    \u0275\u0275text(25, "devices");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "span");
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(28, RoomsComponent_For_11_Conditional_28_Template, 5, 1, "div", 18);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const room_r2 = ctx.$implicit;
    const roomMenu_r4 = \u0275\u0275reference(13);
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("border-left-color", room_r2.color);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("background", room_r2.color + "22")("color", room_r2.color);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(room_r2.icon || "meeting_room");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(room_r2.name);
    \u0275\u0275advance();
    \u0275\u0275conditional(8, ctx_r2.getParentName(room_r2.parent_id) ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("matMenuTriggerFor", roomMenu_r4);
    \u0275\u0275advance(18);
    \u0275\u0275textInterpolate1("", ctx_r2.getDeviceCount(room_r2.id), " appareil(s)");
    \u0275\u0275advance();
    \u0275\u0275conditional(28, ctx_r2.getChildCount(room_r2.id) > 0 ? 28 : -1);
  }
}
function RoomsComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "mat-icon");
    \u0275\u0275text(2, "meeting_room");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "Aucune pi\xE8ce configur\xE9e");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6, "Commencez par cr\xE9er vos pi\xE8ces");
    \u0275\u0275elementEnd()();
  }
}
var RoomsComponent = class _RoomsComponent {
  constructor(roomService, deviceService, dialog, snackBar) {
    this.roomService = roomService;
    this.deviceService = deviceService;
    this.dialog = dialog;
    this.snackBar = snackBar;
    this.rooms = [];
    this.allDevices = [];
    this.loading = true;
  }
  ngOnInit() {
    this.loadRooms();
  }
  loadRooms() {
    this.loading = true;
    this.roomService.getRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open("Erreur de chargement des pi\xE8ces", "Fermer", { duration: 3e3 });
      }
    });
    this.deviceService.getDevices().subscribe({
      next: (devices) => {
        this.allDevices = devices;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  getDeviceCount(roomId) {
    return this.allDevices.filter((d) => d.room_id === roomId).length;
  }
  openCreateDialog() {
    const dialogRef = this.dialog.open(RoomDialogComponent, {
      width: "480px",
      data: { room: null, rooms: this.rooms }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.roomService.createRoom(result).subscribe({
          next: () => {
            this.loadRooms();
            this.snackBar.open("Pi\xE8ce cr\xE9\xE9e avec succ\xE8s", "OK", { duration: 3e3 });
          },
          error: () => this.snackBar.open("Erreur lors de la cr\xE9ation", "Fermer", { duration: 3e3 })
        });
      }
    });
  }
  openEditDialog(room) {
    const dialogRef = this.dialog.open(RoomDialogComponent, {
      width: "480px",
      data: { room, rooms: this.rooms.filter((r) => r.id !== room.id) }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.roomService.updateRoom(room.id, result).subscribe({
          next: () => {
            this.loadRooms();
            this.snackBar.open("Pi\xE8ce modifi\xE9e", "OK", { duration: 3e3 });
          },
          error: () => this.snackBar.open("Erreur lors de la modification", "Fermer", { duration: 3e3 })
        });
      }
    });
  }
  deleteRoom(room) {
    if (confirm(`Supprimer la pi\xE8ce "${room.name}" et tous ses appareils ?`)) {
      this.roomService.deleteRoom(room.id).subscribe({
        next: () => {
          this.loadRooms();
          this.snackBar.open("Pi\xE8ce supprim\xE9e", "OK", { duration: 3e3 });
        },
        error: () => this.snackBar.open("Erreur lors de la suppression", "Fermer", { duration: 3e3 })
      });
    }
  }
  getParentName(parentId) {
    if (!parentId)
      return "";
    return this.rooms.find((r) => r.id === parentId)?.name || "";
  }
  getChildCount(roomId) {
    return this.rooms.filter((r) => r.parent_id === roomId).length;
  }
  static {
    this.\u0275fac = function RoomsComponent_Factory(t) {
      return new (t || _RoomsComponent)(\u0275\u0275directiveInject(RoomService), \u0275\u0275directiveInject(DeviceService), \u0275\u0275directiveInject(MatDialog), \u0275\u0275directiveInject(MatSnackBar));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RoomsComponent, selectors: [["app-rooms"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 13, vars: 2, consts: [["roomMenu", "matMenu"], [1, "page-container", "fade-in"], [1, "page-header"], ["mat-raised-button", "", "color", "primary", 3, "click"], ["mode", "indeterminate", "color", "accent"], [1, "card-grid"], [1, "thidom-card", "room-card", 3, "border-left-color"], [1, "empty-state"], [1, "thidom-card", "room-card"], [1, "room-header"], [1, "room-icon"], [1, "room-info"], [1, "room-name"], [1, "room-parent"], ["mat-icon-button", "", 3, "matMenuTriggerFor"], ["mat-menu-item", "", 3, "click"], ["mat-menu-item", "", 1, "delete-action", 3, "click"], [1, "room-stats"], [1, "room-stat"], [1, "small-icon"]], template: function RoomsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "h1");
        \u0275\u0275text(3, "Pi\xE8ces");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "button", 3);
        \u0275\u0275listener("click", function RoomsComponent_Template_button_click_4_listener() {
          return ctx.openCreateDialog();
        });
        \u0275\u0275elementStart(5, "mat-icon");
        \u0275\u0275text(6, "add");
        \u0275\u0275elementEnd();
        \u0275\u0275text(7, " Nouvelle pi\xE8ce ");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(8, RoomsComponent_Conditional_8_Template, 1, 0, "mat-progress-bar", 4);
        \u0275\u0275elementStart(9, "div", 5);
        \u0275\u0275repeaterCreate(10, RoomsComponent_For_11_Template, 29, 12, "div", 6, _forTrack02);
        \u0275\u0275elementEnd();
        \u0275\u0275template(12, RoomsComponent_Conditional_12_Template, 7, 0, "div", 7);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(8);
        \u0275\u0275conditional(8, ctx.loading ? 8 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275repeater(ctx.rooms);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(12, !ctx.loading && ctx.rooms.length === 0 ? 12 : -1);
      }
    }, dependencies: [
      CommonModule,
      FormsModule,
      MatCardModule,
      MatIconModule,
      MatIcon,
      MatButtonModule,
      MatButton,
      MatIconButton,
      MatDialogModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatSnackBarModule,
      MatProgressBarModule,
      MatProgressBar,
      MatMenuModule,
      MatMenu,
      MatMenuItem,
      MatMenuTrigger,
      MatTooltipModule
    ], styles: ["\n\n.room-card[_ngcontent-%COMP%] {\n  border-left: 4px solid var(--thidom-green);\n}\n.room-card[_ngcontent-%COMP%]   .room-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n}\n.room-card[_ngcontent-%COMP%]   .room-header[_ngcontent-%COMP%]   .room-icon[_ngcontent-%COMP%] {\n  width: 44px;\n  height: 44px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.room-card[_ngcontent-%COMP%]   .room-header[_ngcontent-%COMP%]   .room-info[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.room-card[_ngcontent-%COMP%]   .room-header[_ngcontent-%COMP%]   .room-info[_ngcontent-%COMP%]   .room-name[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 1.1rem;\n  font-weight: 500;\n  color: var(--thidom-text-primary);\n}\n.room-card[_ngcontent-%COMP%]   .room-header[_ngcontent-%COMP%]   .room-info[_ngcontent-%COMP%]   .room-parent[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 2px;\n  font-size: 0.8rem;\n  color: var(--thidom-text-secondary);\n}\n.room-card[_ngcontent-%COMP%]   .room-header[_ngcontent-%COMP%]   .room-info[_ngcontent-%COMP%]   .room-parent[_ngcontent-%COMP%]   .small-icon[_ngcontent-%COMP%] {\n  font-size: 14px;\n  width: 14px;\n  height: 14px;\n}\n.room-card[_ngcontent-%COMP%]   .room-stats[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 20px;\n  margin-top: 16px;\n  padding-top: 12px;\n  border-top: 1px solid var(--thidom-border);\n}\n.room-card[_ngcontent-%COMP%]   .room-stats[_ngcontent-%COMP%]   .room-stat[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 0.85rem;\n  color: var(--thidom-text-secondary);\n}\n.room-card[_ngcontent-%COMP%]   .room-stats[_ngcontent-%COMP%]   .room-stat[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n}\n.empty-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 60px 20px;\n  color: var(--thidom-text-secondary);\n}\n.empty-state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 4rem;\n  width: 64px;\n  height: 64px;\n  margin-bottom: 16px;\n  opacity: 0.4;\n}\n.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  margin-bottom: 8px;\n  color: var(--thidom-text-primary);\n}\n.delete-action[_ngcontent-%COMP%] {\n  color: #f44336;\n}\n/*# sourceMappingURL=rooms.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RoomsComponent, { className: "RoomsComponent", filePath: "src\\app\\features\\rooms\\rooms.component.ts", lineNumber: 41 });
})();
export {
  RoomsComponent
};
//# sourceMappingURL=chunk-JIUL7LQW.js.map
