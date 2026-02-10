import {
  MatCheckboxModule
} from "./chunk-7CNMJOQD.js";
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
  MatLabel
} from "./chunk-A3S6NR4S.js";
import {
  MatTooltip,
  MatTooltipModule
} from "./chunk-3VUMTD7Q.js";
import {
  DefaultValueAccessor,
  FocusMonitor,
  FormsModule,
  MatButton,
  MatButtonModule,
  MatCommonModule,
  MatIcon,
  MatIconButton,
  MatIconModule,
  MatOption,
  MatPseudoCheckbox,
  MatRipple,
  MatRippleModule,
  NG_VALUE_ACCESSOR,
  NgControlStatus,
  NgModel,
  RequiredValidator,
  SelectionModel
} from "./chunk-3YNX47WL.js";
import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  CommonModule,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  HttpClient,
  Inject,
  InjectionToken,
  Input,
  InputFlags,
  NgModule,
  Optional,
  Output,
  ViewChild,
  ViewEncapsulation$1,
  booleanAttribute,
  environment,
  forwardRef,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵInputTransformsFeature,
  ɵɵProvidersFeature,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵinjectAttribute,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-7ID3BB7P.js";

// node_modules/@angular/material/fesm2022/button-toggle.mjs
var _c0 = ["button"];
var _c1 = ["*"];
function MatButtonToggle_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-pseudo-checkbox", 3);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r1.disabled);
  }
}
function MatButtonToggle_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-pseudo-checkbox", 3);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r1.disabled);
  }
}
var MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS = new InjectionToken("MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS", {
  providedIn: "root",
  factory: MAT_BUTTON_TOGGLE_GROUP_DEFAULT_OPTIONS_FACTORY
});
function MAT_BUTTON_TOGGLE_GROUP_DEFAULT_OPTIONS_FACTORY() {
  return {
    hideSingleSelectionIndicator: false,
    hideMultipleSelectionIndicator: false
  };
}
var MAT_BUTTON_TOGGLE_GROUP = new InjectionToken("MatButtonToggleGroup");
var MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MatButtonToggleGroup),
  multi: true
};
var uniqueIdCounter = 0;
var MatButtonToggleChange = class {
  constructor(source, value) {
    this.source = source;
    this.value = value;
  }
};
var MatButtonToggleGroup = class _MatButtonToggleGroup {
  /** `name` attribute for the underlying `input` element. */
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
    this._markButtonsForCheck();
  }
  /** Value of the toggle group. */
  get value() {
    const selected = this._selectionModel ? this._selectionModel.selected : [];
    if (this.multiple) {
      return selected.map((toggle) => toggle.value);
    }
    return selected[0] ? selected[0].value : void 0;
  }
  set value(newValue) {
    this._setSelectionByValue(newValue);
    this.valueChange.emit(this.value);
  }
  /** Selected button toggles in the group. */
  get selected() {
    const selected = this._selectionModel ? this._selectionModel.selected : [];
    return this.multiple ? selected : selected[0] || null;
  }
  /** Whether multiple button toggles can be selected. */
  get multiple() {
    return this._multiple;
  }
  set multiple(value) {
    this._multiple = value;
    this._markButtonsForCheck();
  }
  /** Whether multiple button toggle group is disabled. */
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
    this._markButtonsForCheck();
  }
  /** Whether checkmark indicator for single-selection button toggle groups is hidden. */
  get hideSingleSelectionIndicator() {
    return this._hideSingleSelectionIndicator;
  }
  set hideSingleSelectionIndicator(value) {
    this._hideSingleSelectionIndicator = value;
    this._markButtonsForCheck();
  }
  /** Whether checkmark indicator for multiple-selection button toggle groups is hidden. */
  get hideMultipleSelectionIndicator() {
    return this._hideMultipleSelectionIndicator;
  }
  set hideMultipleSelectionIndicator(value) {
    this._hideMultipleSelectionIndicator = value;
    this._markButtonsForCheck();
  }
  constructor(_changeDetector, defaultOptions) {
    this._changeDetector = _changeDetector;
    this._multiple = false;
    this._disabled = false;
    this._controlValueAccessorChangeFn = () => {
    };
    this._onTouched = () => {
    };
    this._name = `mat-button-toggle-group-${uniqueIdCounter++}`;
    this.valueChange = new EventEmitter();
    this.change = new EventEmitter();
    this.appearance = defaultOptions && defaultOptions.appearance ? defaultOptions.appearance : "standard";
    this.hideSingleSelectionIndicator = defaultOptions?.hideSingleSelectionIndicator ?? false;
    this.hideMultipleSelectionIndicator = defaultOptions?.hideMultipleSelectionIndicator ?? false;
  }
  ngOnInit() {
    this._selectionModel = new SelectionModel(this.multiple, void 0, false);
  }
  ngAfterContentInit() {
    this._selectionModel.select(...this._buttonToggles.filter((toggle) => toggle.checked));
  }
  /**
   * Sets the model value. Implemented as part of ControlValueAccessor.
   * @param value Value to be set to the model.
   */
  writeValue(value) {
    this.value = value;
    this._changeDetector.markForCheck();
  }
  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn) {
    this._controlValueAccessorChangeFn = fn;
  }
  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
  }
  /** Dispatch change event with current selection and group value. */
  _emitChangeEvent(toggle) {
    const event = new MatButtonToggleChange(toggle, this.value);
    this._rawValue = event.value;
    this._controlValueAccessorChangeFn(event.value);
    this.change.emit(event);
  }
  /**
   * Syncs a button toggle's selected state with the model value.
   * @param toggle Toggle to be synced.
   * @param select Whether the toggle should be selected.
   * @param isUserInput Whether the change was a result of a user interaction.
   * @param deferEvents Whether to defer emitting the change events.
   */
  _syncButtonToggle(toggle, select, isUserInput = false, deferEvents = false) {
    if (!this.multiple && this.selected && !toggle.checked) {
      this.selected.checked = false;
    }
    if (this._selectionModel) {
      if (select) {
        this._selectionModel.select(toggle);
      } else {
        this._selectionModel.deselect(toggle);
      }
    } else {
      deferEvents = true;
    }
    if (deferEvents) {
      Promise.resolve().then(() => this._updateModelValue(toggle, isUserInput));
    } else {
      this._updateModelValue(toggle, isUserInput);
    }
  }
  /** Checks whether a button toggle is selected. */
  _isSelected(toggle) {
    return this._selectionModel && this._selectionModel.isSelected(toggle);
  }
  /** Determines whether a button toggle should be checked on init. */
  _isPrechecked(toggle) {
    if (typeof this._rawValue === "undefined") {
      return false;
    }
    if (this.multiple && Array.isArray(this._rawValue)) {
      return this._rawValue.some((value) => toggle.value != null && value === toggle.value);
    }
    return toggle.value === this._rawValue;
  }
  /** Updates the selection state of the toggles in the group based on a value. */
  _setSelectionByValue(value) {
    this._rawValue = value;
    if (!this._buttonToggles) {
      return;
    }
    if (this.multiple && value) {
      if (!Array.isArray(value) && (typeof ngDevMode === "undefined" || ngDevMode)) {
        throw Error("Value must be an array in multiple-selection mode.");
      }
      this._clearSelection();
      value.forEach((currentValue) => this._selectValue(currentValue));
    } else {
      this._clearSelection();
      this._selectValue(value);
    }
  }
  /** Clears the selected toggles. */
  _clearSelection() {
    this._selectionModel.clear();
    this._buttonToggles.forEach((toggle) => toggle.checked = false);
  }
  /** Selects a value if there's a toggle that corresponds to it. */
  _selectValue(value) {
    const correspondingOption = this._buttonToggles.find((toggle) => {
      return toggle.value != null && toggle.value === value;
    });
    if (correspondingOption) {
      correspondingOption.checked = true;
      this._selectionModel.select(correspondingOption);
    }
  }
  /** Syncs up the group's value with the model and emits the change event. */
  _updateModelValue(toggle, isUserInput) {
    if (isUserInput) {
      this._emitChangeEvent(toggle);
    }
    this.valueChange.emit(this.value);
  }
  /** Marks all of the child button toggles to be checked. */
  _markButtonsForCheck() {
    this._buttonToggles?.forEach((toggle) => toggle._markForCheck());
  }
  static {
    this.\u0275fac = function MatButtonToggleGroup_Factory(t) {
      return new (t || _MatButtonToggleGroup)(\u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS, 8));
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _MatButtonToggleGroup,
      selectors: [["mat-button-toggle-group"]],
      contentQueries: function MatButtonToggleGroup_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          \u0275\u0275contentQuery(dirIndex, MatButtonToggle, 5);
        }
        if (rf & 2) {
          let _t;
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._buttonToggles = _t);
        }
      },
      hostAttrs: ["role", "group", 1, "mat-button-toggle-group"],
      hostVars: 5,
      hostBindings: function MatButtonToggleGroup_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275attribute("aria-disabled", ctx.disabled);
          \u0275\u0275classProp("mat-button-toggle-vertical", ctx.vertical)("mat-button-toggle-group-appearance-standard", ctx.appearance === "standard");
        }
      },
      inputs: {
        appearance: "appearance",
        name: "name",
        vertical: [InputFlags.HasDecoratorInputTransform, "vertical", "vertical", booleanAttribute],
        value: "value",
        multiple: [InputFlags.HasDecoratorInputTransform, "multiple", "multiple", booleanAttribute],
        disabled: [InputFlags.HasDecoratorInputTransform, "disabled", "disabled", booleanAttribute],
        hideSingleSelectionIndicator: [InputFlags.HasDecoratorInputTransform, "hideSingleSelectionIndicator", "hideSingleSelectionIndicator", booleanAttribute],
        hideMultipleSelectionIndicator: [InputFlags.HasDecoratorInputTransform, "hideMultipleSelectionIndicator", "hideMultipleSelectionIndicator", booleanAttribute]
      },
      outputs: {
        valueChange: "valueChange",
        change: "change"
      },
      exportAs: ["matButtonToggleGroup"],
      standalone: true,
      features: [\u0275\u0275ProvidersFeature([MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR, {
        provide: MAT_BUTTON_TOGGLE_GROUP,
        useExisting: _MatButtonToggleGroup
      }]), \u0275\u0275InputTransformsFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatButtonToggleGroup, [{
    type: Directive,
    args: [{
      selector: "mat-button-toggle-group",
      providers: [MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR, {
        provide: MAT_BUTTON_TOGGLE_GROUP,
        useExisting: MatButtonToggleGroup
      }],
      host: {
        "role": "group",
        "class": "mat-button-toggle-group",
        "[attr.aria-disabled]": "disabled",
        "[class.mat-button-toggle-vertical]": "vertical",
        "[class.mat-button-toggle-group-appearance-standard]": 'appearance === "standard"'
      },
      exportAs: "matButtonToggleGroup",
      standalone: true
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS]
    }]
  }], {
    _buttonToggles: [{
      type: ContentChildren,
      args: [forwardRef(() => MatButtonToggle), {
        // Note that this would technically pick up toggles
        // from nested groups, but that's not a case that we support.
        descendants: true
      }]
    }],
    appearance: [{
      type: Input
    }],
    name: [{
      type: Input
    }],
    vertical: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    value: [{
      type: Input
    }],
    valueChange: [{
      type: Output
    }],
    multiple: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    change: [{
      type: Output
    }],
    hideSingleSelectionIndicator: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    hideMultipleSelectionIndicator: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var MatButtonToggle = class _MatButtonToggle {
  /** Unique ID for the underlying `button` element. */
  get buttonId() {
    return `${this.id}-button`;
  }
  /** The appearance style of the button. */
  get appearance() {
    return this.buttonToggleGroup ? this.buttonToggleGroup.appearance : this._appearance;
  }
  set appearance(value) {
    this._appearance = value;
  }
  /** Whether the button is checked. */
  get checked() {
    return this.buttonToggleGroup ? this.buttonToggleGroup._isSelected(this) : this._checked;
  }
  set checked(value) {
    if (value !== this._checked) {
      this._checked = value;
      if (this.buttonToggleGroup) {
        this.buttonToggleGroup._syncButtonToggle(this, this._checked);
      }
      this._changeDetectorRef.markForCheck();
    }
  }
  /** Whether the button is disabled. */
  get disabled() {
    return this._disabled || this.buttonToggleGroup && this.buttonToggleGroup.disabled;
  }
  set disabled(value) {
    this._disabled = value;
  }
  constructor(toggleGroup, _changeDetectorRef, _elementRef, _focusMonitor, defaultTabIndex, defaultOptions) {
    this._changeDetectorRef = _changeDetectorRef;
    this._elementRef = _elementRef;
    this._focusMonitor = _focusMonitor;
    this._checked = false;
    this.ariaLabelledby = null;
    this._disabled = false;
    this.change = new EventEmitter();
    const parsedTabIndex = Number(defaultTabIndex);
    this.tabIndex = parsedTabIndex || parsedTabIndex === 0 ? parsedTabIndex : null;
    this.buttonToggleGroup = toggleGroup;
    this.appearance = defaultOptions && defaultOptions.appearance ? defaultOptions.appearance : "standard";
  }
  ngOnInit() {
    const group = this.buttonToggleGroup;
    this.id = this.id || `mat-button-toggle-${uniqueIdCounter++}`;
    if (group) {
      if (group._isPrechecked(this)) {
        this.checked = true;
      } else if (group._isSelected(this) !== this._checked) {
        group._syncButtonToggle(this, this._checked);
      }
    }
  }
  ngAfterViewInit() {
    this._focusMonitor.monitor(this._elementRef, true);
  }
  ngOnDestroy() {
    const group = this.buttonToggleGroup;
    this._focusMonitor.stopMonitoring(this._elementRef);
    if (group && group._isSelected(this)) {
      group._syncButtonToggle(this, false, false, true);
    }
  }
  /** Focuses the button. */
  focus(options) {
    this._buttonElement.nativeElement.focus(options);
  }
  /** Checks the button toggle due to an interaction with the underlying native button. */
  _onButtonClick() {
    const newChecked = this._isSingleSelector() ? true : !this._checked;
    if (newChecked !== this._checked) {
      this._checked = newChecked;
      if (this.buttonToggleGroup) {
        this.buttonToggleGroup._syncButtonToggle(this, this._checked, true);
        this.buttonToggleGroup._onTouched();
      }
    }
    this.change.emit(new MatButtonToggleChange(this, this.value));
  }
  /**
   * Marks the button toggle as needing checking for change detection.
   * This method is exposed because the parent button toggle group will directly
   * update bound properties of the radio button.
   */
  _markForCheck() {
    this._changeDetectorRef.markForCheck();
  }
  /** Gets the name that should be assigned to the inner DOM node. */
  _getButtonName() {
    if (this._isSingleSelector()) {
      return this.buttonToggleGroup.name;
    }
    return this.name || null;
  }
  /** Whether the toggle is in single selection mode. */
  _isSingleSelector() {
    return this.buttonToggleGroup && !this.buttonToggleGroup.multiple;
  }
  static {
    this.\u0275fac = function MatButtonToggle_Factory(t) {
      return new (t || _MatButtonToggle)(\u0275\u0275directiveInject(MAT_BUTTON_TOGGLE_GROUP, 8), \u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(FocusMonitor), \u0275\u0275injectAttribute("tabindex"), \u0275\u0275directiveInject(MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS, 8));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _MatButtonToggle,
      selectors: [["mat-button-toggle"]],
      viewQuery: function MatButtonToggle_Query(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275viewQuery(_c0, 5);
        }
        if (rf & 2) {
          let _t;
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._buttonElement = _t.first);
        }
      },
      hostAttrs: ["role", "presentation", 1, "mat-button-toggle"],
      hostVars: 12,
      hostBindings: function MatButtonToggle_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("focus", function MatButtonToggle_focus_HostBindingHandler() {
            return ctx.focus();
          });
        }
        if (rf & 2) {
          \u0275\u0275attribute("aria-label", null)("aria-labelledby", null)("id", ctx.id)("name", null);
          \u0275\u0275classProp("mat-button-toggle-standalone", !ctx.buttonToggleGroup)("mat-button-toggle-checked", ctx.checked)("mat-button-toggle-disabled", ctx.disabled)("mat-button-toggle-appearance-standard", ctx.appearance === "standard");
        }
      },
      inputs: {
        ariaLabel: [InputFlags.None, "aria-label", "ariaLabel"],
        ariaLabelledby: [InputFlags.None, "aria-labelledby", "ariaLabelledby"],
        id: "id",
        name: "name",
        value: "value",
        tabIndex: "tabIndex",
        disableRipple: [InputFlags.HasDecoratorInputTransform, "disableRipple", "disableRipple", booleanAttribute],
        appearance: "appearance",
        checked: [InputFlags.HasDecoratorInputTransform, "checked", "checked", booleanAttribute],
        disabled: [InputFlags.HasDecoratorInputTransform, "disabled", "disabled", booleanAttribute]
      },
      outputs: {
        change: "change"
      },
      exportAs: ["matButtonToggle"],
      standalone: true,
      features: [\u0275\u0275InputTransformsFeature, \u0275\u0275StandaloneFeature],
      ngContentSelectors: _c1,
      decls: 8,
      vars: 11,
      consts: [["button", ""], ["type", "button", 1, "mat-button-toggle-button", "mat-focus-indicator", 3, "click", "id", "disabled"], [1, "mat-button-toggle-label-content"], ["state", "checked", "aria-hidden", "true", "appearance", "minimal", 1, "mat-mdc-option-pseudo-checkbox", 3, "disabled"], [1, "mat-button-toggle-focus-overlay"], ["matRipple", "", 1, "mat-button-toggle-ripple", 3, "matRippleTrigger", "matRippleDisabled"]],
      template: function MatButtonToggle_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = \u0275\u0275getCurrentView();
          \u0275\u0275projectionDef();
          \u0275\u0275elementStart(0, "button", 1, 0);
          \u0275\u0275listener("click", function MatButtonToggle_Template_button_click_0_listener() {
            \u0275\u0275restoreView(_r1);
            return \u0275\u0275resetView(ctx._onButtonClick());
          });
          \u0275\u0275elementStart(2, "span", 2);
          \u0275\u0275template(3, MatButtonToggle_Conditional_3_Template, 1, 1, "mat-pseudo-checkbox", 3)(4, MatButtonToggle_Conditional_4_Template, 1, 1, "mat-pseudo-checkbox", 3);
          \u0275\u0275projection(5);
          \u0275\u0275elementEnd()();
          \u0275\u0275element(6, "span", 4)(7, "span", 5);
        }
        if (rf & 2) {
          const button_r3 = \u0275\u0275reference(1);
          \u0275\u0275property("id", ctx.buttonId)("disabled", ctx.disabled || null);
          \u0275\u0275attribute("tabindex", ctx.disabled ? -1 : ctx.tabIndex)("aria-pressed", ctx.checked)("name", ctx._getButtonName())("aria-label", ctx.ariaLabel)("aria-labelledby", ctx.ariaLabelledby);
          \u0275\u0275advance(3);
          \u0275\u0275conditional(3, ctx.buttonToggleGroup && ctx.checked && !ctx.buttonToggleGroup.multiple && !ctx.buttonToggleGroup.hideSingleSelectionIndicator ? 3 : -1);
          \u0275\u0275advance();
          \u0275\u0275conditional(4, ctx.buttonToggleGroup && ctx.checked && ctx.buttonToggleGroup.multiple && !ctx.buttonToggleGroup.hideMultipleSelectionIndicator ? 4 : -1);
          \u0275\u0275advance(3);
          \u0275\u0275property("matRippleTrigger", button_r3)("matRippleDisabled", ctx.disableRipple || ctx.disabled);
        }
      },
      dependencies: [MatRipple, MatPseudoCheckbox],
      styles: [".mat-button-toggle-standalone,.mat-button-toggle-group{position:relative;display:inline-flex;flex-direction:row;white-space:nowrap;overflow:hidden;-webkit-tap-highlight-color:rgba(0,0,0,0);transform:translateZ(0);border-radius:var(--mat-legacy-button-toggle-shape)}.mat-button-toggle-standalone:not([class*=mat-elevation-z]),.mat-button-toggle-group:not([class*=mat-elevation-z]){box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)}.cdk-high-contrast-active .mat-button-toggle-standalone,.cdk-high-contrast-active .mat-button-toggle-group{outline:solid 1px}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.mat-button-toggle-group-appearance-standard{border-radius:var(--mat-standard-button-toggle-shape);border:solid 1px var(--mat-standard-button-toggle-divider-color)}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard .mat-pseudo-checkbox,.mat-button-toggle-group-appearance-standard .mat-pseudo-checkbox{--mat-minimal-pseudo-checkbox-selected-checkmark-color: var( --mat-standard-button-toggle-selected-state-text-color )}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard:not([class*=mat-elevation-z]),.mat-button-toggle-group-appearance-standard:not([class*=mat-elevation-z]){box-shadow:none}.cdk-high-contrast-active .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.cdk-high-contrast-active .mat-button-toggle-group-appearance-standard{outline:0}.mat-button-toggle-vertical{flex-direction:column}.mat-button-toggle-vertical .mat-button-toggle-label-content{display:block}.mat-button-toggle{white-space:nowrap;position:relative;color:var(--mat-legacy-button-toggle-text-color);font-family:var(--mat-legacy-button-toggle-label-text-font);font-size:var(--mat-legacy-button-toggle-label-text-size);line-height:var(--mat-legacy-button-toggle-label-text-line-height);font-weight:var(--mat-legacy-button-toggle-label-text-weight);letter-spacing:var(--mat-legacy-button-toggle-label-text-tracking);--mat-minimal-pseudo-checkbox-selected-checkmark-color: var( --mat-legacy-button-toggle-selected-state-text-color )}.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay{opacity:var(--mat-legacy-button-toggle-focus-state-layer-opacity)}.mat-button-toggle .mat-icon svg{vertical-align:top}.mat-button-toggle .mat-pseudo-checkbox{margin-right:12px}[dir=rtl] .mat-button-toggle .mat-pseudo-checkbox{margin-right:0;margin-left:12px}.mat-button-toggle-checked{color:var(--mat-legacy-button-toggle-selected-state-text-color);background-color:var(--mat-legacy-button-toggle-selected-state-background-color)}.mat-button-toggle-disabled{color:var(--mat-legacy-button-toggle-disabled-state-text-color);background-color:var(--mat-legacy-button-toggle-disabled-state-background-color);--mat-minimal-pseudo-checkbox-disabled-selected-checkmark-color: var( --mat-legacy-button-toggle-disabled-state-text-color )}.mat-button-toggle-disabled.mat-button-toggle-checked{background-color:var(--mat-legacy-button-toggle-disabled-selected-state-background-color)}.mat-button-toggle-appearance-standard{color:var(--mat-standard-button-toggle-text-color);background-color:var(--mat-standard-button-toggle-background-color);font-family:var(--mat-standard-button-toggle-label-text-font);font-size:var(--mat-standard-button-toggle-label-text-size);line-height:var(--mat-standard-button-toggle-label-text-line-height);font-weight:var(--mat-standard-button-toggle-label-text-weight);letter-spacing:var(--mat-standard-button-toggle-label-text-tracking)}.mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard{border-left:solid 1px var(--mat-standard-button-toggle-divider-color)}[dir=rtl] .mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard{border-left:none;border-right:solid 1px var(--mat-standard-button-toggle-divider-color)}.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard{border-left:none;border-right:none;border-top:solid 1px var(--mat-standard-button-toggle-divider-color)}.mat-button-toggle-appearance-standard.mat-button-toggle-checked{color:var(--mat-standard-button-toggle-selected-state-text-color);background-color:var(--mat-standard-button-toggle-selected-state-background-color)}.mat-button-toggle-appearance-standard.mat-button-toggle-disabled{color:var(--mat-standard-button-toggle-disabled-state-text-color);background-color:var(--mat-standard-button-toggle-disabled-state-background-color)}.mat-button-toggle-appearance-standard.mat-button-toggle-disabled .mat-pseudo-checkbox{--mat-minimal-pseudo-checkbox-disabled-selected-checkmark-color: var( --mat-standard-button-toggle-disabled-selected-state-text-color )}.mat-button-toggle-appearance-standard.mat-button-toggle-disabled.mat-button-toggle-checked{color:var(--mat-standard-button-toggle-disabled-selected-state-text-color);background-color:var(--mat-standard-button-toggle-disabled-selected-state-background-color)}.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay{background-color:var(--mat-standard-button-toggle-state-layer-color)}.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{opacity:var(--mat-standard-button-toggle-hover-state-layer-opacity)}.mat-button-toggle-appearance-standard.cdk-keyboard-focused:not(.mat-button-toggle-disabled) .mat-button-toggle-focus-overlay{opacity:var(--mat-standard-button-toggle-focus-state-layer-opacity)}@media(hover: none){.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{display:none}}.mat-button-toggle-label-content{-webkit-user-select:none;user-select:none;display:inline-block;padding:0 16px;line-height:var(--mat-legacy-button-toggle-height);position:relative}.mat-button-toggle-appearance-standard .mat-button-toggle-label-content{padding:0 12px;line-height:var(--mat-standard-button-toggle-height)}.mat-button-toggle-label-content>*{vertical-align:middle}.mat-button-toggle-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:inherit;pointer-events:none;opacity:0;background-color:var(--mat-legacy-button-toggle-state-layer-color)}.cdk-high-contrast-active .mat-button-toggle-checked .mat-button-toggle-focus-overlay{border-bottom:solid 500px;opacity:.5;height:0}.cdk-high-contrast-active .mat-button-toggle-checked:hover .mat-button-toggle-focus-overlay{opacity:.6}.cdk-high-contrast-active .mat-button-toggle-checked.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay{border-bottom:solid 500px}.mat-button-toggle .mat-button-toggle-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-button-toggle-button{border:0;background:none;color:inherit;padding:0;margin:0;font:inherit;outline:none;width:100%;cursor:pointer}.mat-button-toggle-disabled .mat-button-toggle-button{cursor:default}.mat-button-toggle-button::-moz-focus-inner{border:0}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard{--mat-focus-indicator-border-radius:var(--mat-standard-button-toggle-shape)}.mat-button-toggle-group-appearance-standard .mat-button-toggle:last-of-type .mat-button-toggle-button::before{border-top-right-radius:var(--mat-standard-button-toggle-shape);border-bottom-right-radius:var(--mat-standard-button-toggle-shape)}.mat-button-toggle-group-appearance-standard .mat-button-toggle:first-of-type .mat-button-toggle-button::before{border-top-left-radius:var(--mat-standard-button-toggle-shape);border-bottom-left-radius:var(--mat-standard-button-toggle-shape)}"],
      encapsulation: 2,
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatButtonToggle, [{
    type: Component,
    args: [{
      selector: "mat-button-toggle",
      encapsulation: ViewEncapsulation$1.None,
      exportAs: "matButtonToggle",
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "[class.mat-button-toggle-standalone]": "!buttonToggleGroup",
        "[class.mat-button-toggle-checked]": "checked",
        "[class.mat-button-toggle-disabled]": "disabled",
        "[class.mat-button-toggle-appearance-standard]": 'appearance === "standard"',
        "class": "mat-button-toggle",
        "[attr.aria-label]": "null",
        "[attr.aria-labelledby]": "null",
        "[attr.id]": "id",
        "[attr.name]": "null",
        "(focus)": "focus()",
        "role": "presentation"
      },
      standalone: true,
      imports: [MatRipple, MatPseudoCheckbox],
      template: '<button #button class="mat-button-toggle-button mat-focus-indicator"\n        type="button"\n        [id]="buttonId"\n        [attr.tabindex]="disabled ? -1 : tabIndex"\n        [attr.aria-pressed]="checked"\n        [disabled]="disabled || null"\n        [attr.name]="_getButtonName()"\n        [attr.aria-label]="ariaLabel"\n        [attr.aria-labelledby]="ariaLabelledby"\n        (click)="_onButtonClick()">\n  <span class="mat-button-toggle-label-content">\n    <!-- Render checkmark at the beginning for single-selection. -->\n    @if (buttonToggleGroup && checked && !buttonToggleGroup.multiple && !buttonToggleGroup.hideSingleSelectionIndicator) {\n      <mat-pseudo-checkbox\n          class="mat-mdc-option-pseudo-checkbox"\n          [disabled]="disabled"\n          state="checked"\n          aria-hidden="true"\n          appearance="minimal"></mat-pseudo-checkbox>\n    }\n    <!-- Render checkmark at the beginning for multiple-selection. -->\n    @if (buttonToggleGroup && checked && buttonToggleGroup.multiple && !buttonToggleGroup.hideMultipleSelectionIndicator) {\n      <mat-pseudo-checkbox\n          class="mat-mdc-option-pseudo-checkbox"\n          [disabled]="disabled"\n          state="checked"\n          aria-hidden="true"\n          appearance="minimal"></mat-pseudo-checkbox>\n    }\n    <ng-content></ng-content>\n  </span>\n</button>\n\n<span class="mat-button-toggle-focus-overlay"></span>\n<span class="mat-button-toggle-ripple" matRipple\n     [matRippleTrigger]="button"\n     [matRippleDisabled]="this.disableRipple || this.disabled">\n</span>\n',
      styles: [".mat-button-toggle-standalone,.mat-button-toggle-group{position:relative;display:inline-flex;flex-direction:row;white-space:nowrap;overflow:hidden;-webkit-tap-highlight-color:rgba(0,0,0,0);transform:translateZ(0);border-radius:var(--mat-legacy-button-toggle-shape)}.mat-button-toggle-standalone:not([class*=mat-elevation-z]),.mat-button-toggle-group:not([class*=mat-elevation-z]){box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)}.cdk-high-contrast-active .mat-button-toggle-standalone,.cdk-high-contrast-active .mat-button-toggle-group{outline:solid 1px}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.mat-button-toggle-group-appearance-standard{border-radius:var(--mat-standard-button-toggle-shape);border:solid 1px var(--mat-standard-button-toggle-divider-color)}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard .mat-pseudo-checkbox,.mat-button-toggle-group-appearance-standard .mat-pseudo-checkbox{--mat-minimal-pseudo-checkbox-selected-checkmark-color: var( --mat-standard-button-toggle-selected-state-text-color )}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard:not([class*=mat-elevation-z]),.mat-button-toggle-group-appearance-standard:not([class*=mat-elevation-z]){box-shadow:none}.cdk-high-contrast-active .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.cdk-high-contrast-active .mat-button-toggle-group-appearance-standard{outline:0}.mat-button-toggle-vertical{flex-direction:column}.mat-button-toggle-vertical .mat-button-toggle-label-content{display:block}.mat-button-toggle{white-space:nowrap;position:relative;color:var(--mat-legacy-button-toggle-text-color);font-family:var(--mat-legacy-button-toggle-label-text-font);font-size:var(--mat-legacy-button-toggle-label-text-size);line-height:var(--mat-legacy-button-toggle-label-text-line-height);font-weight:var(--mat-legacy-button-toggle-label-text-weight);letter-spacing:var(--mat-legacy-button-toggle-label-text-tracking);--mat-minimal-pseudo-checkbox-selected-checkmark-color: var( --mat-legacy-button-toggle-selected-state-text-color )}.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay{opacity:var(--mat-legacy-button-toggle-focus-state-layer-opacity)}.mat-button-toggle .mat-icon svg{vertical-align:top}.mat-button-toggle .mat-pseudo-checkbox{margin-right:12px}[dir=rtl] .mat-button-toggle .mat-pseudo-checkbox{margin-right:0;margin-left:12px}.mat-button-toggle-checked{color:var(--mat-legacy-button-toggle-selected-state-text-color);background-color:var(--mat-legacy-button-toggle-selected-state-background-color)}.mat-button-toggle-disabled{color:var(--mat-legacy-button-toggle-disabled-state-text-color);background-color:var(--mat-legacy-button-toggle-disabled-state-background-color);--mat-minimal-pseudo-checkbox-disabled-selected-checkmark-color: var( --mat-legacy-button-toggle-disabled-state-text-color )}.mat-button-toggle-disabled.mat-button-toggle-checked{background-color:var(--mat-legacy-button-toggle-disabled-selected-state-background-color)}.mat-button-toggle-appearance-standard{color:var(--mat-standard-button-toggle-text-color);background-color:var(--mat-standard-button-toggle-background-color);font-family:var(--mat-standard-button-toggle-label-text-font);font-size:var(--mat-standard-button-toggle-label-text-size);line-height:var(--mat-standard-button-toggle-label-text-line-height);font-weight:var(--mat-standard-button-toggle-label-text-weight);letter-spacing:var(--mat-standard-button-toggle-label-text-tracking)}.mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard{border-left:solid 1px var(--mat-standard-button-toggle-divider-color)}[dir=rtl] .mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard{border-left:none;border-right:solid 1px var(--mat-standard-button-toggle-divider-color)}.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle-appearance-standard+.mat-button-toggle-appearance-standard{border-left:none;border-right:none;border-top:solid 1px var(--mat-standard-button-toggle-divider-color)}.mat-button-toggle-appearance-standard.mat-button-toggle-checked{color:var(--mat-standard-button-toggle-selected-state-text-color);background-color:var(--mat-standard-button-toggle-selected-state-background-color)}.mat-button-toggle-appearance-standard.mat-button-toggle-disabled{color:var(--mat-standard-button-toggle-disabled-state-text-color);background-color:var(--mat-standard-button-toggle-disabled-state-background-color)}.mat-button-toggle-appearance-standard.mat-button-toggle-disabled .mat-pseudo-checkbox{--mat-minimal-pseudo-checkbox-disabled-selected-checkmark-color: var( --mat-standard-button-toggle-disabled-selected-state-text-color )}.mat-button-toggle-appearance-standard.mat-button-toggle-disabled.mat-button-toggle-checked{color:var(--mat-standard-button-toggle-disabled-selected-state-text-color);background-color:var(--mat-standard-button-toggle-disabled-selected-state-background-color)}.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay{background-color:var(--mat-standard-button-toggle-state-layer-color)}.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{opacity:var(--mat-standard-button-toggle-hover-state-layer-opacity)}.mat-button-toggle-appearance-standard.cdk-keyboard-focused:not(.mat-button-toggle-disabled) .mat-button-toggle-focus-overlay{opacity:var(--mat-standard-button-toggle-focus-state-layer-opacity)}@media(hover: none){.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{display:none}}.mat-button-toggle-label-content{-webkit-user-select:none;user-select:none;display:inline-block;padding:0 16px;line-height:var(--mat-legacy-button-toggle-height);position:relative}.mat-button-toggle-appearance-standard .mat-button-toggle-label-content{padding:0 12px;line-height:var(--mat-standard-button-toggle-height)}.mat-button-toggle-label-content>*{vertical-align:middle}.mat-button-toggle-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:inherit;pointer-events:none;opacity:0;background-color:var(--mat-legacy-button-toggle-state-layer-color)}.cdk-high-contrast-active .mat-button-toggle-checked .mat-button-toggle-focus-overlay{border-bottom:solid 500px;opacity:.5;height:0}.cdk-high-contrast-active .mat-button-toggle-checked:hover .mat-button-toggle-focus-overlay{opacity:.6}.cdk-high-contrast-active .mat-button-toggle-checked.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay{border-bottom:solid 500px}.mat-button-toggle .mat-button-toggle-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-button-toggle-button{border:0;background:none;color:inherit;padding:0;margin:0;font:inherit;outline:none;width:100%;cursor:pointer}.mat-button-toggle-disabled .mat-button-toggle-button{cursor:default}.mat-button-toggle-button::-moz-focus-inner{border:0}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard{--mat-focus-indicator-border-radius:var(--mat-standard-button-toggle-shape)}.mat-button-toggle-group-appearance-standard .mat-button-toggle:last-of-type .mat-button-toggle-button::before{border-top-right-radius:var(--mat-standard-button-toggle-shape);border-bottom-right-radius:var(--mat-standard-button-toggle-shape)}.mat-button-toggle-group-appearance-standard .mat-button-toggle:first-of-type .mat-button-toggle-button::before{border-top-left-radius:var(--mat-standard-button-toggle-shape);border-bottom-left-radius:var(--mat-standard-button-toggle-shape)}"]
    }]
  }], () => [{
    type: MatButtonToggleGroup,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [MAT_BUTTON_TOGGLE_GROUP]
    }]
  }, {
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: FocusMonitor
  }, {
    type: void 0,
    decorators: [{
      type: Attribute,
      args: ["tabindex"]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS]
    }]
  }], {
    ariaLabel: [{
      type: Input,
      args: ["aria-label"]
    }],
    ariaLabelledby: [{
      type: Input,
      args: ["aria-labelledby"]
    }],
    _buttonElement: [{
      type: ViewChild,
      args: ["button"]
    }],
    id: [{
      type: Input
    }],
    name: [{
      type: Input
    }],
    value: [{
      type: Input
    }],
    tabIndex: [{
      type: Input
    }],
    disableRipple: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    appearance: [{
      type: Input
    }],
    checked: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    change: [{
      type: Output
    }]
  });
})();
var MatButtonToggleModule = class _MatButtonToggleModule {
  static {
    this.\u0275fac = function MatButtonToggleModule_Factory(t) {
      return new (t || _MatButtonToggleModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
      type: _MatButtonToggleModule
    });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
      imports: [MatCommonModule, MatRippleModule, MatButtonToggle, MatCommonModule]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatButtonToggleModule, [{
    type: NgModule,
    args: [{
      imports: [MatCommonModule, MatRippleModule, MatButtonToggleGroup, MatButtonToggle],
      exports: [MatCommonModule, MatButtonToggleGroup, MatButtonToggle]
    }]
  }], null, null);
})();

// src/app/features/schedules/schedule-dialog/schedule-dialog.component.ts
var _forTrack0 = ($index, $item) => $item.value;
var _forTrack1 = ($index, $item) => $item.id;
var _forTrack2 = ($index, $item) => $item.label;
function ScheduleDialogComponent_For_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const st_r1 = ctx.$implicit;
    \u0275\u0275property("value", st_r1.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(st_r1.label);
  }
}
function ScheduleDialogComponent_Conditional_22_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 23);
    \u0275\u0275listener("click", function ScheduleDialogComponent_Conditional_22_For_5_Template_button_click_0_listener() {
      const i_r3 = \u0275\u0275restoreView(_r2).$index;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.daysOfWeek[i_r3] = !ctx_r3.daysOfWeek[i_r3]);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const day_r5 = ctx.$implicit;
    const i_r3 = ctx.$index;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("selected", ctx_r3.daysOfWeek[i_r3]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", day_r5, " ");
  }
}
function ScheduleDialogComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "label");
    \u0275\u0275text(2, "Jours de la semaine");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 21);
    \u0275\u0275repeaterCreate(4, ScheduleDialogComponent_Conditional_22_For_5_Template, 2, 3, "button", 22, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r3.dayLabels);
  }
}
function ScheduleDialogComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-form-field", 1)(1, "mat-label");
    \u0275\u0275text(2, "Expression Cron");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 24);
    \u0275\u0275twoWayListener("ngModelChange", function ScheduleDialogComponent_Conditional_23_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.cronExpression, $event) || (ctx_r3.cronExpression = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "mat-hint");
    \u0275\u0275text(5, "minute heure jour mois jour_semaine");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.cronExpression);
  }
}
function ScheduleDialogComponent_Conditional_41_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 7)(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const at_r8 = ctx.$implicit;
    \u0275\u0275property("value", at_r8.value);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(at_r8.icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", at_r8.label, " ");
  }
}
function ScheduleDialogComponent_Conditional_41_Conditional_7_For_2_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const device_r12 = ctx.$implicit;
    \u0275\u0275property("value", device_r12.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(device_r12.name);
  }
}
function ScheduleDialogComponent_Conditional_41_Conditional_7_For_2_For_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 37);
    \u0275\u0275listener("click", function ScheduleDialogComponent_Conditional_41_Conditional_7_For_2_For_21_Template_button_click_0_listener() {
      const preset_r15 = \u0275\u0275restoreView(_r14).$implicit;
      const target_r11 = \u0275\u0275nextContext().$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.applyPreset(target_r11, preset_r15));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const preset_r15 = ctx.$implicit;
    const target_r11 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classProp("active", target_r11.state_key === preset_r15.key && target_r11.state_value === preset_r15.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", preset_r15.label, " ");
  }
}
function ScheduleDialogComponent_Conditional_41_Conditional_7_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 26)(1, "div", 28)(2, "mat-form-field", 29)(3, "mat-label");
    \u0275\u0275text(4, "Appareil");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "mat-select", 6);
    \u0275\u0275twoWayListener("ngModelChange", function ScheduleDialogComponent_Conditional_41_Conditional_7_For_2_Template_mat_select_ngModelChange_5_listener($event) {
      const target_r11 = \u0275\u0275restoreView(_r10).$implicit;
      \u0275\u0275twoWayBindingSet(target_r11.device_id, $event) || (target_r11.device_id = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(6, ScheduleDialogComponent_Conditional_41_Conditional_7_For_2_For_7_Template, 2, 2, "mat-option", 7, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "mat-form-field", 30)(9, "mat-label");
    \u0275\u0275text(10, "Propriete");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 31);
    \u0275\u0275twoWayListener("ngModelChange", function ScheduleDialogComponent_Conditional_41_Conditional_7_For_2_Template_input_ngModelChange_11_listener($event) {
      const target_r11 = \u0275\u0275restoreView(_r10).$implicit;
      \u0275\u0275twoWayBindingSet(target_r11.state_key, $event) || (target_r11.state_key = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "mat-form-field", 32)(13, "mat-label");
    \u0275\u0275text(14, "Valeur");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "input", 33);
    \u0275\u0275twoWayListener("ngModelChange", function ScheduleDialogComponent_Conditional_41_Conditional_7_For_2_Template_input_ngModelChange_15_listener($event) {
      const target_r11 = \u0275\u0275restoreView(_r10).$implicit;
      \u0275\u0275twoWayBindingSet(target_r11.state_value, $event) || (target_r11.state_value = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "button", 34);
    \u0275\u0275listener("click", function ScheduleDialogComponent_Conditional_41_Conditional_7_For_2_Template_button_click_16_listener() {
      const $index_r13 = \u0275\u0275restoreView(_r10).$index;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.removeTarget($index_r13));
    });
    \u0275\u0275elementStart(17, "mat-icon");
    \u0275\u0275text(18, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "div", 35);
    \u0275\u0275repeaterCreate(20, ScheduleDialogComponent_Conditional_41_Conditional_7_For_2_For_21_Template, 2, 3, "button", 36, _forTrack2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const target_r11 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", target_r11.device_id);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r3.devices);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", target_r11.state_key);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", target_r11.state_value);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r3.visualTargets.length <= 1);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r3.statePresets);
  }
}
function ScheduleDialogComponent_Conditional_41_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275repeaterCreate(1, ScheduleDialogComponent_Conditional_41_Conditional_7_For_2_Template, 22, 4, "div", 26, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementStart(3, "button", 27);
    \u0275\u0275listener("click", function ScheduleDialogComponent_Conditional_41_Conditional_7_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.addTarget());
    });
    \u0275\u0275elementStart(4, "mat-icon");
    \u0275\u0275text(5, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(6, " Ajouter un appareil ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r3.visualTargets);
  }
}
function ScheduleDialogComponent_Conditional_41_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-form-field", 1)(1, "mat-label");
    \u0275\u0275text(2, "Message");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "textarea", 38);
    \u0275\u0275twoWayListener("ngModelChange", function ScheduleDialogComponent_Conditional_41_Conditional_8_Template_textarea_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r16);
      const ctx_r3 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r3.notificationMessage, $event) || (ctx_r3.notificationMessage = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.notificationMessage);
  }
}
function ScheduleDialogComponent_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 16)(1, "mat-form-field", 1)(2, "mat-label");
    \u0275\u0275text(3, "Type d'action");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "mat-select", 6);
    \u0275\u0275twoWayListener("ngModelChange", function ScheduleDialogComponent_Conditional_41_Template_mat_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.actionType, $event) || (ctx_r3.actionType = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(5, ScheduleDialogComponent_Conditional_41_For_6_Template, 4, 3, "mat-option", 7, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(7, ScheduleDialogComponent_Conditional_41_Conditional_7_Template, 7, 0, "div", 25)(8, ScheduleDialogComponent_Conditional_41_Conditional_8_Template, 4, 1, "mat-form-field", 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.actionType);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r3.actionTypes);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(7, ctx_r3.actionType === "set_device_state" ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(8, ctx_r3.actionType === "send_notification" || ctx_r3.actionType === "send_telegram" ? 8 : -1);
  }
}
function ScheduleDialogComponent_Conditional_42_For_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 45);
    \u0275\u0275listener("click", function ScheduleDialogComponent_Conditional_42_For_7_Template_button_click_0_listener() {
      const tpl_r19 = \u0275\u0275restoreView(_r18).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.insertActionTemplate(tpl_r19.value));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tpl_r19 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", tpl_r19.label, " ");
  }
}
function ScheduleDialogComponent_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 17)(1, "div", 39)(2, "button", 40);
    \u0275\u0275listener("click", function ScheduleDialogComponent_Conditional_42_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.formatJson());
    });
    \u0275\u0275elementStart(3, "mat-icon");
    \u0275\u0275text(4, "auto_fix_high");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(5, "div", 41);
    \u0275\u0275repeaterCreate(6, ScheduleDialogComponent_Conditional_42_For_7_Template, 2, 1, "button", 42, _forTrack2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "mat-form-field", 43)(9, "textarea", 44);
    \u0275\u0275twoWayListener("ngModelChange", function ScheduleDialogComponent_Conditional_42_Template_textarea_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r17);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.actionJson, $event) || (ctx_r3.actionJson = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "mat-hint");
    \u0275\u0275text(11, "JSON de l'action (set_device_state, send_notification, etc.)");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r3.actionTemplates);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.actionJson);
  }
}
var ScheduleDialogComponent = class _ScheduleDialogComponent {
  constructor(dialogRef, data) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.name = "";
    this.description = "";
    this.scheduleType = "daily";
    this.cronExpression = "";
    this.time = "08:00";
    this.daysOfWeek = [false, true, true, true, true, true, false];
    this.timezone = "Europe/Paris";
    this.actionJson = '{\n  "type": "set_device_state",\n  "targets": [\n    {\n      "device_id": 1,\n      "state": {\n        "power": "on"\n      }\n    }\n  ]\n}';
    this.enabled = true;
    this.editorMode = "visual";
    this.actionType = "set_device_state";
    this.visualTargets = [{ device_id: null, state_key: "power", state_value: "on" }];
    this.notificationMessage = "";
    this.dayLabels = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    this.scheduleTypes = [
      { value: "once", label: "Une fois" },
      { value: "daily", label: "Quotidien" },
      { value: "weekly", label: "Hebdomadaire" },
      { value: "monthly", label: "Mensuel" },
      { value: "cron", label: "Expression Cron" }
    ];
    this.actionTypes = [
      { value: "set_device_state", label: "Controle appareil", icon: "devices" },
      { value: "send_notification", label: "Notification", icon: "notifications" },
      { value: "send_telegram", label: "Notification Telegram", icon: "send" }
    ];
    this.statePresets = [
      { key: "power", value: "on", label: "Allumer" },
      { key: "power", value: "off", label: "Eteindre" },
      { key: "position", value: "100", label: "Ouvrir (volet)" },
      { key: "position", value: "0", label: "Fermer (volet)" },
      { key: "target_temperature", value: "20", label: "Consigne 20\uFFFDC" },
      { key: "locked", value: "true", label: "Verrouiller" },
      { key: "locked", value: "false", label: "Deverrouiller" }
    ];
    this.actionTemplates = [
      { label: "Allumer appareil", value: '{\n  "type": "set_device_state",\n  "targets": [{"device_id": 1, "state": {"power": "on"}}]\n}' },
      { label: "Eteindre appareil", value: '{\n  "type": "set_device_state",\n  "targets": [{"device_id": 1, "state": {"power": "off"}}]\n}' },
      { label: "Notification", value: '{\n  "type": "send_notification",\n  "config": {"message": "Rappel planifie"}\n}' },
      { label: "Notification Telegram", value: '{\n  "type": "send_telegram",\n  "config": {"message": "Message Telegram"}\n}' }
    ];
    this.isEdit = !!data.schedule;
    this.devices = data.devices || [];
    if (data.schedule) {
      this.name = data.schedule.name;
      this.description = data.schedule.description || "";
      this.scheduleType = data.schedule.schedule_type;
      this.cronExpression = data.schedule.cron_expression || "";
      this.time = data.schedule.time || "08:00";
      this.timezone = data.schedule.timezone || "Europe/Paris";
      this.enabled = data.schedule.enabled;
      this.actionJson = JSON.stringify(data.schedule.action, null, 2);
      if (data.schedule.days_of_week) {
        this.daysOfWeek = [0, 1, 2, 3, 4, 5, 6].map((d) => data.schedule.days_of_week.includes(d));
      }
      this._parseActionToVisual(data.schedule.action);
    }
  }
  _parseActionToVisual(action) {
    if (!action)
      return;
    this.actionType = action.type || "set_device_state";
    if (action.type === "set_device_state" && action.targets) {
      this.visualTargets = action.targets.map((t) => {
        const entries = Object.entries(t.state || {});
        const [key, value] = entries.length > 0 ? entries[0] : ["power", "on"];
        return { device_id: t.device_id, state_key: key, state_value: String(value) };
      });
      if (this.visualTargets.length === 0) {
        this.visualTargets = [{ device_id: null, state_key: "power", state_value: "on" }];
      }
    } else if (action.type === "send_notification" || action.type === "send_telegram") {
      this.notificationMessage = action.config?.message || "";
    }
  }
  _buildActionFromVisual() {
    if (this.actionType === "set_device_state") {
      const targets = this.visualTargets.filter((t) => t.device_id !== null).map((t) => {
        let val = t.state_value;
        if (val === "true")
          val = true;
        else if (val === "false")
          val = false;
        else if (!isNaN(Number(val)) && val.trim() !== "")
          val = Number(val);
        return { device_id: t.device_id, state: { [t.state_key]: val } };
      });
      return { type: "set_device_state", targets };
    } else {
      return { type: this.actionType, config: { message: this.notificationMessage } };
    }
  }
  addTarget() {
    this.visualTargets.push({ device_id: null, state_key: "power", state_value: "on" });
  }
  removeTarget(index) {
    if (this.visualTargets.length > 1) {
      this.visualTargets.splice(index, 1);
    }
  }
  applyPreset(target, preset) {
    target.state_key = preset.key;
    target.state_value = preset.value;
  }
  syncVisualToJson() {
    const action = this._buildActionFromVisual();
    this.actionJson = JSON.stringify(action, null, 2);
  }
  syncJsonToVisual() {
    try {
      const action = JSON.parse(this.actionJson);
      this._parseActionToVisual(action);
    } catch {
    }
  }
  onEditorModeChange() {
    if (this.editorMode === "json") {
      this.syncVisualToJson();
    } else {
      this.syncJsonToVisual();
    }
  }
  getDeviceName(id) {
    if (id === null)
      return "";
    return this.devices.find((d) => d.id === id)?.name || `Appareil #${id}`;
  }
  insertActionTemplate(template) {
    this.actionJson = template;
  }
  formatJson() {
    try {
      const parsed = JSON.parse(this.actionJson);
      this.actionJson = JSON.stringify(parsed, null, 2);
    } catch {
    }
  }
  save() {
    if (!this.name.trim())
      return;
    let action;
    if (this.editorMode === "visual") {
      action = this._buildActionFromVisual();
    } else {
      try {
        action = JSON.parse(this.actionJson);
      } catch {
        action = {};
      }
    }
    const daysOfWeek = this.daysOfWeek.map((checked, idx) => checked ? idx : -1).filter((d) => d >= 0);
    this.dialogRef.close({
      name: this.name.trim(),
      description: this.description,
      schedule_type: this.scheduleType,
      cron_expression: this.scheduleType === "cron" ? this.cronExpression : null,
      time: this.time,
      days_of_week: this.scheduleType === "weekly" ? daysOfWeek : null,
      timezone: this.timezone,
      action,
      enabled: this.enabled
    });
  }
  cancel() {
    this.dialogRef.close(null);
  }
  static {
    this.\u0275fac = function ScheduleDialogComponent_Factory(t) {
      return new (t || _ScheduleDialogComponent)(\u0275\u0275directiveInject(MatDialogRef), \u0275\u0275directiveInject(MAT_DIALOG_DATA));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ScheduleDialogComponent, selectors: [["app-schedule-dialog"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 50, vars: 14, consts: [["mat-dialog-title", ""], ["appearance", "outline", 1, "full-width"], ["matInput", "", "required", "", "placeholder", "Ex: Allumer lumieres le matin", 3, "ngModelChange", "ngModel"], ["matInput", "", "placeholder", "Description optionnelle", 3, "ngModelChange", "ngModel"], [1, "form-row"], ["appearance", "outline", 1, "half-width"], [3, "ngModelChange", "ngModel"], [3, "value"], ["matInput", "", "type", "time", 3, "ngModelChange", "ngModel"], [1, "days-selector"], ["matInput", "", 3, "ngModelChange", "ngModel"], [1, "action-section"], [1, "action-header"], [1, "editor-toggle", 3, "ngModelChange", "ngModel"], ["value", "visual", "matTooltip", "Editeur visuel"], ["value", "json", "matTooltip", "Editeur JSON"], [1, "visual-editor"], [1, "json-editor"], ["align", "end"], ["mat-button", "", 3, "click"], ["mat-raised-button", "", "color", "primary", 3, "click", "disabled"], [1, "days-grid"], [1, "day-btn", 3, "selected"], [1, "day-btn", 3, "click"], ["matInput", "", "placeholder", "*/15 * * * *", 3, "ngModelChange", "ngModel"], [1, "targets-list"], [1, "target-row"], ["mat-stroked-button", "", 1, "add-target-btn", 3, "click"], [1, "target-fields"], ["appearance", "outline", 1, "target-device"], ["appearance", "outline", 1, "target-key"], ["matInput", "", "placeholder", "power", 3, "ngModelChange", "ngModel"], ["appearance", "outline", 1, "target-value"], ["matInput", "", "placeholder", "on", 3, "ngModelChange", "ngModel"], ["mat-icon-button", "", "color", "warn", "matTooltip", "Supprimer", 3, "click", "disabled"], [1, "target-presets"], ["mat-stroked-button", "", 1, "preset-chip", 3, "active"], ["mat-stroked-button", "", 1, "preset-chip", 3, "click"], ["matInput", "", "rows", "3", "placeholder", "Votre message de notification...", 3, "ngModelChange", "ngModel"], [1, "action-toolbar"], ["mat-stroked-button", "", "matTooltip", "Formater le JSON", 1, "mini-btn", 3, "click"], [1, "action-templates"], ["mat-stroked-button", "", 1, "tpl-btn"], ["appearance", "outline", 1, "full-width", "action-field"], ["matInput", "", "rows", "12", "spellcheck", "false", 1, "code-textarea", 3, "ngModelChange", "ngModel"], ["mat-stroked-button", "", 1, "tpl-btn", 3, "click"]], template: function ScheduleDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "h2", 0);
        \u0275\u0275text(1);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(2, "mat-dialog-content")(3, "mat-form-field", 1)(4, "mat-label");
        \u0275\u0275text(5, "Nom");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "input", 2);
        \u0275\u0275twoWayListener("ngModelChange", function ScheduleDialogComponent_Template_input_ngModelChange_6_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.name, $event) || (ctx.name = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "mat-form-field", 1)(8, "mat-label");
        \u0275\u0275text(9, "Description");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(10, "input", 3);
        \u0275\u0275twoWayListener("ngModelChange", function ScheduleDialogComponent_Template_input_ngModelChange_10_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.description, $event) || (ctx.description = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(11, "div", 4)(12, "mat-form-field", 5)(13, "mat-label");
        \u0275\u0275text(14, "Type");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "mat-select", 6);
        \u0275\u0275twoWayListener("ngModelChange", function ScheduleDialogComponent_Template_mat_select_ngModelChange_15_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.scheduleType, $event) || (ctx.scheduleType = $event);
          return $event;
        });
        \u0275\u0275repeaterCreate(16, ScheduleDialogComponent_For_17_Template, 2, 2, "mat-option", 7, _forTrack0);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(18, "mat-form-field", 5)(19, "mat-label");
        \u0275\u0275text(20, "Heure");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(21, "input", 8);
        \u0275\u0275twoWayListener("ngModelChange", function ScheduleDialogComponent_Template_input_ngModelChange_21_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.time, $event) || (ctx.time = $event);
          return $event;
        });
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(22, ScheduleDialogComponent_Conditional_22_Template, 6, 0, "div", 9)(23, ScheduleDialogComponent_Conditional_23_Template, 6, 1, "mat-form-field", 1);
        \u0275\u0275elementStart(24, "mat-form-field", 1)(25, "mat-label");
        \u0275\u0275text(26, "Fuseau horaire");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(27, "input", 10);
        \u0275\u0275twoWayListener("ngModelChange", function ScheduleDialogComponent_Template_input_ngModelChange_27_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.timezone, $event) || (ctx.timezone = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(28, "div", 11)(29, "div", 12)(30, "h3")(31, "mat-icon");
        \u0275\u0275text(32, "play_circle");
        \u0275\u0275elementEnd();
        \u0275\u0275text(33, " Action a executer");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(34, "mat-button-toggle-group", 13);
        \u0275\u0275twoWayListener("ngModelChange", function ScheduleDialogComponent_Template_mat_button_toggle_group_ngModelChange_34_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.editorMode, $event) || (ctx.editorMode = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function ScheduleDialogComponent_Template_mat_button_toggle_group_ngModelChange_34_listener() {
          return ctx.onEditorModeChange();
        });
        \u0275\u0275elementStart(35, "mat-button-toggle", 14)(36, "mat-icon");
        \u0275\u0275text(37, "tune");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(38, "mat-button-toggle", 15)(39, "mat-icon");
        \u0275\u0275text(40, "code");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275template(41, ScheduleDialogComponent_Conditional_41_Template, 9, 3, "div", 16)(42, ScheduleDialogComponent_Conditional_42_Template, 12, 1, "div", 17);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(43, "mat-slide-toggle", 6);
        \u0275\u0275twoWayListener("ngModelChange", function ScheduleDialogComponent_Template_mat_slide_toggle_ngModelChange_43_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.enabled, $event) || (ctx.enabled = $event);
          return $event;
        });
        \u0275\u0275text(44, "Planification active");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(45, "mat-dialog-actions", 18)(46, "button", 19);
        \u0275\u0275listener("click", function ScheduleDialogComponent_Template_button_click_46_listener() {
          return ctx.cancel();
        });
        \u0275\u0275text(47, "Annuler");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(48, "button", 20);
        \u0275\u0275listener("click", function ScheduleDialogComponent_Template_button_click_48_listener() {
          return ctx.save();
        });
        \u0275\u0275text(49);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(ctx.isEdit ? "Modifier la planification" : "Nouvelle planification");
        \u0275\u0275advance(5);
        \u0275\u0275twoWayProperty("ngModel", ctx.name);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.description);
        \u0275\u0275advance(5);
        \u0275\u0275twoWayProperty("ngModel", ctx.scheduleType);
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.scheduleTypes);
        \u0275\u0275advance(5);
        \u0275\u0275twoWayProperty("ngModel", ctx.time);
        \u0275\u0275advance();
        \u0275\u0275conditional(22, ctx.scheduleType === "weekly" ? 22 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(23, ctx.scheduleType === "cron" ? 23 : -1);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.timezone);
        \u0275\u0275advance(7);
        \u0275\u0275twoWayProperty("ngModel", ctx.editorMode);
        \u0275\u0275advance(7);
        \u0275\u0275conditional(41, ctx.editorMode === "visual" ? 41 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(42, ctx.editorMode === "json" ? 42 : -1);
        \u0275\u0275advance();
        \u0275\u0275twoWayProperty("ngModel", ctx.enabled);
        \u0275\u0275advance(5);
        \u0275\u0275property("disabled", !ctx.name.trim());
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.isEdit ? "Modifier" : "Creer", " ");
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
      MatCheckboxModule,
      MatSlideToggleModule,
      MatSlideToggle,
      MatButtonToggleModule,
      MatButtonToggleGroup,
      MatButtonToggle,
      MatTooltipModule,
      MatTooltip
    ], styles: ['\n\n.full-width[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.half-width[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.form-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n}\n.days-selector[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n.days-selector[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.85rem;\n  color: var(--thidom-text-secondary);\n  margin-bottom: 8px;\n}\n.days-selector[_ngcontent-%COMP%]   .days-grid[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n}\n.days-selector[_ngcontent-%COMP%]   .days-grid[_ngcontent-%COMP%]   .day-btn[_ngcontent-%COMP%] {\n  width: 44px;\n  height: 44px;\n  border-radius: 50%;\n  border: 1px solid var(--thidom-border);\n  background: transparent;\n  color: var(--thidom-text-secondary);\n  cursor: pointer;\n  font-size: 0.8rem;\n  font-weight: 500;\n  transition: all 0.2s;\n}\n.days-selector[_ngcontent-%COMP%]   .days-grid[_ngcontent-%COMP%]   .day-btn[_ngcontent-%COMP%]:hover {\n  border-color: var(--thidom-green);\n}\n.days-selector[_ngcontent-%COMP%]   .days-grid[_ngcontent-%COMP%]   .day-btn.selected[_ngcontent-%COMP%] {\n  background: var(--thidom-green);\n  color: #000;\n  border-color: var(--thidom-green);\n}\n.action-section[_ngcontent-%COMP%] {\n  margin: 16px 0;\n  padding: 16px;\n  background: rgba(255, 255, 255, 0.03);\n  border-radius: 10px;\n  border: 1px solid var(--thidom-border);\n}\n.action-section[_ngcontent-%COMP%]   .action-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 12px;\n}\n.action-section[_ngcontent-%COMP%]   .action-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 0.95rem;\n  font-weight: 500;\n  color: var(--thidom-green);\n  margin: 0;\n}\n.action-section[_ngcontent-%COMP%]   .action-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.action-section[_ngcontent-%COMP%]   .action-header[_ngcontent-%COMP%]   .editor-toggle[_ngcontent-%COMP%] {\n  transform: scale(0.85);\n}\n.action-section[_ngcontent-%COMP%]   .visual-editor[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.action-section[_ngcontent-%COMP%]   .visual-editor[_ngcontent-%COMP%]   .targets-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.action-section[_ngcontent-%COMP%]   .visual-editor[_ngcontent-%COMP%]   .target-row[_ngcontent-%COMP%] {\n  padding: 12px;\n  background: rgba(255, 255, 255, 0.02);\n  border-radius: 8px;\n  border: 1px solid var(--thidom-border);\n}\n.action-section[_ngcontent-%COMP%]   .visual-editor[_ngcontent-%COMP%]   .target-fields[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: flex-start;\n}\n.action-section[_ngcontent-%COMP%]   .visual-editor[_ngcontent-%COMP%]   .target-fields[_ngcontent-%COMP%]   .target-device[_ngcontent-%COMP%] {\n  flex: 2;\n  min-width: 0;\n}\n.action-section[_ngcontent-%COMP%]   .visual-editor[_ngcontent-%COMP%]   .target-fields[_ngcontent-%COMP%]   .target-key[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.action-section[_ngcontent-%COMP%]   .visual-editor[_ngcontent-%COMP%]   .target-fields[_ngcontent-%COMP%]   .target-value[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.action-section[_ngcontent-%COMP%]   .visual-editor[_ngcontent-%COMP%]   .target-presets[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 4px;\n  margin-top: 6px;\n}\n.action-section[_ngcontent-%COMP%]   .visual-editor[_ngcontent-%COMP%]   .target-presets[_ngcontent-%COMP%]   .preset-chip[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  padding: 0 8px;\n  min-height: 26px;\n  line-height: 26px;\n  border-radius: 13px;\n}\n.action-section[_ngcontent-%COMP%]   .visual-editor[_ngcontent-%COMP%]   .target-presets[_ngcontent-%COMP%]   .preset-chip.active[_ngcontent-%COMP%] {\n  border-color: var(--thidom-green);\n  color: var(--thidom-green);\n  background: rgba(0, 230, 118, 0.08);\n}\n.action-section[_ngcontent-%COMP%]   .visual-editor[_ngcontent-%COMP%]   .add-target-btn[_ngcontent-%COMP%] {\n  align-self: flex-start;\n  font-size: 0.85rem;\n}\n.action-section[_ngcontent-%COMP%]   .visual-editor[_ngcontent-%COMP%]   .add-target-btn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.action-section[_ngcontent-%COMP%]   .json-editor[_ngcontent-%COMP%]   .action-toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  margin-bottom: 8px;\n}\n.action-section[_ngcontent-%COMP%]   .json-editor[_ngcontent-%COMP%]   .action-toolbar[_ngcontent-%COMP%]   .mini-btn[_ngcontent-%COMP%] {\n  min-width: 36px;\n  padding: 0 8px;\n  line-height: 32px;\n}\n.action-section[_ngcontent-%COMP%]   .json-editor[_ngcontent-%COMP%]   .action-toolbar[_ngcontent-%COMP%]   .mini-btn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n}\n.action-section[_ngcontent-%COMP%]   .json-editor[_ngcontent-%COMP%]   .action-templates[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n  margin-bottom: 12px;\n}\n.action-section[_ngcontent-%COMP%]   .json-editor[_ngcontent-%COMP%]   .action-templates[_ngcontent-%COMP%]   .tpl-btn[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  padding: 2px 10px;\n  min-height: 28px;\n  line-height: 1;\n}\n.action-section[_ngcontent-%COMP%]   .json-editor[_ngcontent-%COMP%]   .action-field[_ngcontent-%COMP%]   .code-textarea[_ngcontent-%COMP%] {\n  font-family:\n    "Consolas",\n    "Monaco",\n    monospace;\n  font-size: 0.85rem;\n  line-height: 1.5;\n  min-height: 200px;\n}\n/*# sourceMappingURL=schedule-dialog.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ScheduleDialogComponent, { className: "ScheduleDialogComponent", filePath: "src\\app\\features\\schedules\\schedule-dialog\\schedule-dialog.component.ts", lineNumber: 42 });
})();

// src/app/core/services/schedule.service.ts
var ScheduleService = class _ScheduleService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${environment.apiUrl}/schedules`;
  }
  getSchedules() {
    return this.http.get(`${this.apiUrl}/`);
  }
  getSchedule(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  createSchedule(schedule) {
    return this.http.post(`${this.apiUrl}/`, schedule);
  }
  updateSchedule(id, schedule) {
    return this.http.put(`${this.apiUrl}/${id}`, schedule);
  }
  deleteSchedule(id) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  static {
    this.\u0275fac = function ScheduleService_Factory(t) {
      return new (t || _ScheduleService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ScheduleService, factory: _ScheduleService.\u0275fac, providedIn: "root" });
  }
};

// src/app/features/schedules/schedules.component.ts
var _forTrack02 = ($index, $item) => $item.date;
var _forTrack12 = ($index, $item) => $item.id;
function SchedulesComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-progress-bar", 8);
  }
}
function SchedulesComponent_Conditional_17_For_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const day_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(day_r3);
  }
}
function SchedulesComponent_Conditional_17_For_17_For_2_Conditional_3_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275listener("click", function SchedulesComponent_Conditional_17_For_17_For_2_Conditional_3_For_2_Template_div_click_0_listener() {
      const s_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r1.openEditDialog(s_r5));
    });
    \u0275\u0275element(1, "span", 26);
    \u0275\u0275elementStart(2, "span", 27);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r5 = ctx.$implicit;
    \u0275\u0275property("matTooltip", s_r5.name + " - " + (s_r5.time || ""));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", s_r5.time || "\u2014", " ", s_r5.name, "");
  }
}
function SchedulesComponent_Conditional_17_For_17_For_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275repeaterCreate(1, SchedulesComponent_Conditional_17_For_17_For_2_Conditional_3_For_2_Template, 4, 3, "div", 24, _forTrack12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const day_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(day_r6.schedules);
  }
}
function SchedulesComponent_Conditional_17_For_17_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21)(1, "span", 22);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, SchedulesComponent_Conditional_17_For_17_For_2_Conditional_3_Template, 3, 0, "div", 23);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const day_r6 = ctx.$implicit;
    \u0275\u0275classProp("other-month", !day_r6.isCurrentMonth)("today", day_r6.isToday)("has-schedules", day_r6.schedules.length > 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(day_r6.day);
    \u0275\u0275advance();
    \u0275\u0275conditional(3, day_r6.schedules.length > 0 ? 3 : -1);
  }
}
function SchedulesComponent_Conditional_17_For_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275repeaterCreate(1, SchedulesComponent_Conditional_17_For_17_For_2_Template, 4, 8, "div", 20, _forTrack02);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const week_r7 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(week_r7);
  }
}
function SchedulesComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 12)(2, "button", 13);
    \u0275\u0275listener("click", function SchedulesComponent_Conditional_17_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.prevMonth());
    });
    \u0275\u0275elementStart(3, "mat-icon");
    \u0275\u0275text(4, "chevron_left");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "span", 14);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 13);
    \u0275\u0275listener("click", function SchedulesComponent_Conditional_17_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.nextMonth());
    });
    \u0275\u0275elementStart(8, "mat-icon");
    \u0275\u0275text(9, "chevron_right");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "button", 15);
    \u0275\u0275listener("click", function SchedulesComponent_Conditional_17_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.goToday());
    });
    \u0275\u0275text(11, "Aujourd'hui");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 16)(13, "div", 17);
    \u0275\u0275repeaterCreate(14, SchedulesComponent_Conditional_17_For_15_Template, 2, 1, "div", 18, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(16, SchedulesComponent_Conditional_17_For_17_Template, 3, 0, "div", 19, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.getMonthLabel());
    \u0275\u0275advance(8);
    \u0275\u0275repeater(ctx_r1.weekDays);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.calendarWeeks);
  }
}
function SchedulesComponent_Conditional_18_For_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 34);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const schedule_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(schedule_r9.description);
  }
}
function SchedulesComponent_Conditional_18_For_2_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 39)(1, "mat-icon");
    \u0275\u0275text(2, "access_time");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 45);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const schedule_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(schedule_r9.time);
  }
}
function SchedulesComponent_Conditional_18_For_2_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 39)(1, "mat-icon");
    \u0275\u0275text(2, "calendar_today");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const schedule_r9 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.getDaysLabel(schedule_r9.days_of_week));
  }
}
function SchedulesComponent_Conditional_18_For_2_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 39)(1, "mat-icon");
    \u0275\u0275text(2, "code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "code");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const schedule_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(schedule_r9.cron_expression);
  }
}
function SchedulesComponent_Conditional_18_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 29)(1, "div", 30)(2, "div", 31)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 32)(6, "span", 33);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, SchedulesComponent_Conditional_18_For_2_Conditional_8_Template, 2, 1, "span", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "button", 35)(10, "mat-icon");
    \u0275\u0275text(11, "more_vert");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "mat-menu", null, 0)(14, "button", 36);
    \u0275\u0275listener("click", function SchedulesComponent_Conditional_18_For_2_Template_button_click_14_listener() {
      const schedule_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openEditDialog(schedule_r9));
    });
    \u0275\u0275elementStart(15, "mat-icon");
    \u0275\u0275text(16, "edit");
    \u0275\u0275elementEnd();
    \u0275\u0275text(17, " Modifier ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "button", 37);
    \u0275\u0275listener("click", function SchedulesComponent_Conditional_18_For_2_Template_button_click_18_listener() {
      const schedule_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteSchedule(schedule_r9));
    });
    \u0275\u0275elementStart(19, "mat-icon");
    \u0275\u0275text(20, "delete");
    \u0275\u0275elementEnd();
    \u0275\u0275text(21, " Supprimer ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "div", 38)(23, "div", 39)(24, "mat-icon");
    \u0275\u0275text(25, "repeat");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "mat-chip");
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(28, SchedulesComponent_Conditional_18_For_2_Conditional_28_Template, 5, 1, "div", 39)(29, SchedulesComponent_Conditional_18_For_2_Conditional_29_Template, 5, 1, "div", 39)(30, SchedulesComponent_Conditional_18_For_2_Conditional_30_Template, 5, 1, "div", 39);
    \u0275\u0275elementStart(31, "div", 40)(32, "mat-icon");
    \u0275\u0275text(33, "play_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "span", 41);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(36, "div", 42)(37, "div", 43)(38, "span");
    \u0275\u0275text(39);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "span");
    \u0275\u0275text(41);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "mat-slide-toggle", 44);
    \u0275\u0275listener("change", function SchedulesComponent_Conditional_18_For_2_Template_mat_slide_toggle_change_42_listener() {
      const schedule_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleSchedule(schedule_r9));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const schedule_r9 = ctx.$implicit;
    const scheduleMenu_r10 = \u0275\u0275reference(13);
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("disabled", !schedule_r9.enabled);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("active", schedule_r9.enabled);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getTypeIcon(schedule_r9.schedule_type));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(schedule_r9.name);
    \u0275\u0275advance();
    \u0275\u0275conditional(8, schedule_r9.description ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("matMenuTriggerFor", scheduleMenu_r10);
    \u0275\u0275advance(18);
    \u0275\u0275textInterpolate(ctx_r1.getTypeLabel(schedule_r9.schedule_type));
    \u0275\u0275advance();
    \u0275\u0275conditional(28, schedule_r9.time ? 28 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(29, schedule_r9.days_of_week && schedule_r9.days_of_week.length > 0 ? 29 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(30, schedule_r9.cron_expression ? 30 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.formatAction(schedule_r9.action));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Prochaine : ", ctx_r1.formatDate(schedule_r9.next_run), "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Derniere : ", ctx_r1.formatDate(schedule_r9.last_run), "");
    \u0275\u0275advance();
    \u0275\u0275property("checked", schedule_r9.enabled);
  }
}
function SchedulesComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275repeaterCreate(1, SchedulesComponent_Conditional_18_For_2_Template, 43, 16, "div", 28, _forTrack12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.schedules);
  }
}
function SchedulesComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "mat-icon");
    \u0275\u0275text(2, "calendar_today");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "Aucune planification configuree");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6, "Planifiez des actions automatiques");
    \u0275\u0275elementEnd()();
  }
}
var SchedulesComponent = class _SchedulesComponent {
  constructor(scheduleService, deviceService, dialog, snackBar) {
    this.scheduleService = scheduleService;
    this.deviceService = deviceService;
    this.dialog = dialog;
    this.snackBar = snackBar;
    this.schedules = [];
    this.devices = [];
    this.loading = true;
    this.viewMode = "list";
    this.currentMonth = /* @__PURE__ */ new Date();
    this.calendarWeeks = [];
    this.weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  }
  ngOnInit() {
    this.loadSchedules();
    this.deviceService.getDevices().subscribe((devices) => this.devices = devices);
  }
  loadSchedules() {
    this.loading = true;
    this.scheduleService.getSchedules().subscribe({
      next: (schedules) => {
        this.schedules = schedules;
        this.loading = false;
        this.buildCalendar();
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  // Calendar
  buildCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0)
      startDay = 6;
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const days = [];
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, day: d.getDate(), isCurrentMonth: false, isToday: false, schedules: [] });
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const dayOfWeek = date.getDay();
      const matchingSchedules = this.schedules.filter((s) => {
        if (!s.enabled)
          return false;
        if (s.schedule_type === "daily")
          return true;
        if (s.schedule_type === "weekly" && s.days_of_week) {
          return s.days_of_week.includes(dayOfWeek);
        }
        return false;
      });
      days.push({
        date,
        day: d,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
        schedules: matchingSchedules
      });
    }
    while (days.length % 7 !== 0) {
      const d = new Date(year, month + 1, days.length - lastDay.getDate() - startDay + 1);
      days.push({ date: d, day: d.getDate(), isCurrentMonth: false, isToday: false, schedules: [] });
    }
    this.calendarWeeks = [];
    for (let i = 0; i < days.length; i += 7) {
      this.calendarWeeks.push(days.slice(i, i + 7));
    }
  }
  prevMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.buildCalendar();
  }
  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.buildCalendar();
  }
  goToday() {
    this.currentMonth = /* @__PURE__ */ new Date();
    this.buildCalendar();
  }
  getMonthLabel() {
    return this.currentMonth.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  }
  // CRUD
  openCreateDialog() {
    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
      width: "720px",
      maxHeight: "90vh",
      data: { schedule: null, devices: this.devices }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.scheduleService.createSchedule(result).subscribe({
          next: () => {
            this.loadSchedules();
            this.snackBar.open("Planification creee", "OK", { duration: 3e3 });
          }
        });
      }
    });
  }
  openEditDialog(schedule) {
    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
      width: "720px",
      maxHeight: "90vh",
      data: { schedule, devices: this.devices }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.scheduleService.updateSchedule(schedule.id, result).subscribe({
          next: () => {
            this.loadSchedules();
            this.snackBar.open("Planification modifiee", "OK", { duration: 3e3 });
          }
        });
      }
    });
  }
  deleteSchedule(schedule) {
    if (confirm(`Supprimer la planification "${schedule.name}" ?`)) {
      this.scheduleService.deleteSchedule(schedule.id).subscribe({
        next: () => {
          this.loadSchedules();
          this.snackBar.open("Planification supprimee", "OK", { duration: 3e3 });
        }
      });
    }
  }
  toggleSchedule(schedule) {
    this.scheduleService.updateSchedule(schedule.id, { enabled: !schedule.enabled }).subscribe({
      next: (updated) => {
        const idx = this.schedules.findIndex((s) => s.id === schedule.id);
        if (idx >= 0)
          this.schedules[idx] = updated;
        this.buildCalendar();
      }
    });
  }
  getTypeLabel(type) {
    const labels = {
      once: "Une fois",
      daily: "Quotidien",
      weekly: "Hebdomadaire",
      monthly: "Mensuel",
      cron: "Cron"
    };
    return labels[type] || type;
  }
  getTypeIcon(type) {
    const icons = {
      once: "event",
      daily: "today",
      weekly: "date_range",
      monthly: "calendar_month",
      cron: "schedule"
    };
    return icons[type] || "schedule";
  }
  getDaysLabel(days) {
    if (!days || days.length === 0)
      return "";
    const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    return days.map((d) => dayNames[d] || "?").join(", ");
  }
  formatDate(date) {
    if (!date)
      return "\u2014";
    return new Date(date).toLocaleString("fr-FR");
  }
  formatAction(action) {
    if (!action)
      return "\u2014";
    if (action.type === "set_device_state") {
      const targets = action.targets || [];
      return `Appareil(s): ${targets.length} action(s)`;
    }
    if (action.type === "send_notification") {
      return `Notification: ${action.config?.message || ""}`;
    }
    return action.type || "Action";
  }
  static {
    this.\u0275fac = function SchedulesComponent_Factory(t) {
      return new (t || _SchedulesComponent)(\u0275\u0275directiveInject(ScheduleService), \u0275\u0275directiveInject(DeviceService), \u0275\u0275directiveInject(MatDialog), \u0275\u0275directiveInject(MatSnackBar));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SchedulesComponent, selectors: [["app-schedules"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 20, vars: 5, consts: [["scheduleMenu", "matMenu"], [1, "page-container", "fade-in"], [1, "page-header"], [1, "header-actions"], [1, "view-toggle", 3, "ngModelChange", "ngModel"], ["value", "list", "matTooltip", "Vue liste"], ["value", "calendar", "matTooltip", "Vue calendrier"], ["mat-raised-button", "", "color", "primary", 3, "click"], ["mode", "indeterminate", "color", "accent"], [1, "calendar-container"], [1, "card-grid"], [1, "empty-state"], [1, "calendar-header"], ["mat-icon-button", "", 3, "click"], [1, "month-label"], ["mat-stroked-button", "", 1, "today-btn", 3, "click"], [1, "calendar-grid"], [1, "calendar-weekdays"], [1, "weekday-label"], [1, "calendar-week"], [1, "calendar-day", 3, "other-month", "today", "has-schedules"], [1, "calendar-day"], [1, "day-number"], [1, "day-schedules"], [1, "day-schedule-item", 3, "matTooltip"], [1, "day-schedule-item", 3, "click", "matTooltip"], [1, "schedule-dot"], [1, "schedule-label"], [1, "thidom-card", "schedule-card", 3, "disabled"], [1, "thidom-card", "schedule-card"], [1, "schedule-header"], [1, "schedule-icon"], [1, "schedule-info"], [1, "schedule-name"], [1, "schedule-desc"], ["mat-icon-button", "", 3, "matMenuTriggerFor"], ["mat-menu-item", "", 3, "click"], ["mat-menu-item", "", 1, "delete-action", 3, "click"], [1, "schedule-details"], [1, "detail-row"], [1, "detail-row", "action-row"], [1, "action-summary"], [1, "schedule-footer"], [1, "footer-dates"], [3, "change", "checked"], [1, "time-value"]], template: function SchedulesComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "h1");
        \u0275\u0275text(3, "Planification");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 3)(5, "mat-button-toggle-group", 4);
        \u0275\u0275twoWayListener("ngModelChange", function SchedulesComponent_Template_mat_button_toggle_group_ngModelChange_5_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.viewMode, $event) || (ctx.viewMode = $event);
          return $event;
        });
        \u0275\u0275elementStart(6, "mat-button-toggle", 5)(7, "mat-icon");
        \u0275\u0275text(8, "view_list");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(9, "mat-button-toggle", 6)(10, "mat-icon");
        \u0275\u0275text(11, "calendar_month");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(12, "button", 7);
        \u0275\u0275listener("click", function SchedulesComponent_Template_button_click_12_listener() {
          return ctx.openCreateDialog();
        });
        \u0275\u0275elementStart(13, "mat-icon");
        \u0275\u0275text(14, "add");
        \u0275\u0275elementEnd();
        \u0275\u0275text(15, " Nouvelle planification ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(16, SchedulesComponent_Conditional_16_Template, 1, 0, "mat-progress-bar", 8)(17, SchedulesComponent_Conditional_17_Template, 18, 1, "div", 9)(18, SchedulesComponent_Conditional_18_Template, 3, 0, "div", 10)(19, SchedulesComponent_Conditional_19_Template, 7, 0, "div", 11);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(5);
        \u0275\u0275twoWayProperty("ngModel", ctx.viewMode);
        \u0275\u0275advance(11);
        \u0275\u0275conditional(16, ctx.loading ? 16 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(17, ctx.viewMode === "calendar" ? 17 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(18, ctx.viewMode === "list" ? 18 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(19, !ctx.loading && ctx.schedules.length === 0 ? 19 : -1);
      }
    }, dependencies: [
      CommonModule,
      FormsModule,
      NgControlStatus,
      NgModel,
      MatCardModule,
      MatIconModule,
      MatIcon,
      MatButtonModule,
      MatButton,
      MatIconButton,
      MatDialogModule,
      MatSnackBarModule,
      MatProgressBarModule,
      MatProgressBar,
      MatMenuModule,
      MatMenu,
      MatMenuItem,
      MatMenuTrigger,
      MatSlideToggleModule,
      MatSlideToggle,
      MatChipsModule,
      MatChip,
      MatTooltipModule,
      MatTooltip,
      MatButtonToggleModule,
      MatButtonToggleGroup,
      MatButtonToggle
    ], styles: ["\n\n.page-header[_ngcontent-%COMP%]   .header-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  align-items: center;\n}\n.page-header[_ngcontent-%COMP%]   .view-toggle[_ngcontent-%COMP%] {\n  border-radius: 8px;\n}\n.calendar-container[_ngcontent-%COMP%] {\n  background: var(--thidom-bg-card);\n  border: 1px solid var(--thidom-border);\n  border-radius: 12px;\n  padding: 24px;\n  margin-bottom: 24px;\n}\n.calendar-container[_ngcontent-%COMP%]   .calendar-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-bottom: 20px;\n}\n.calendar-container[_ngcontent-%COMP%]   .calendar-header[_ngcontent-%COMP%]   .month-label[_ngcontent-%COMP%] {\n  font-size: 1.4rem;\n  font-weight: 500;\n  color: var(--thidom-text-primary);\n  text-transform: capitalize;\n  min-width: 220px;\n  text-align: center;\n}\n.calendar-container[_ngcontent-%COMP%]   .calendar-header[_ngcontent-%COMP%]   .today-btn[_ngcontent-%COMP%] {\n  margin-left: auto;\n  font-size: 0.85rem;\n}\n.calendar-container[_ngcontent-%COMP%]   .calendar-grid[_ngcontent-%COMP%]   .calendar-weekdays[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(7, 1fr);\n  margin-bottom: 6px;\n}\n.calendar-container[_ngcontent-%COMP%]   .calendar-grid[_ngcontent-%COMP%]   .calendar-weekdays[_ngcontent-%COMP%]   .weekday-label[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: 0.85rem;\n  font-weight: 600;\n  color: var(--thidom-text-secondary);\n  padding: 10px 0;\n}\n.calendar-container[_ngcontent-%COMP%]   .calendar-grid[_ngcontent-%COMP%]   .calendar-week[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(7, 1fr);\n}\n.calendar-container[_ngcontent-%COMP%]   .calendar-grid[_ngcontent-%COMP%]   .calendar-day[_ngcontent-%COMP%] {\n  min-height: 110px;\n  border: 1px solid var(--thidom-border);\n  padding: 6px 8px;\n  position: relative;\n  transition: background 0.2s;\n}\n.calendar-container[_ngcontent-%COMP%]   .calendar-grid[_ngcontent-%COMP%]   .calendar-day.other-month[_ngcontent-%COMP%] {\n  opacity: 0.3;\n}\n.calendar-container[_ngcontent-%COMP%]   .calendar-grid[_ngcontent-%COMP%]   .calendar-day.today[_ngcontent-%COMP%] {\n  background: rgba(0, 230, 118, 0.06);\n}\n.calendar-container[_ngcontent-%COMP%]   .calendar-grid[_ngcontent-%COMP%]   .calendar-day.today[_ngcontent-%COMP%]   .day-number[_ngcontent-%COMP%] {\n  background: var(--thidom-green);\n  color: #000;\n  border-radius: 50%;\n  width: 28px;\n  height: 28px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 600;\n}\n.calendar-container[_ngcontent-%COMP%]   .calendar-grid[_ngcontent-%COMP%]   .calendar-day.has-schedules[_ngcontent-%COMP%] {\n  background: rgba(0, 230, 118, 0.03);\n}\n.calendar-container[_ngcontent-%COMP%]   .calendar-grid[_ngcontent-%COMP%]   .calendar-day[_ngcontent-%COMP%]   .day-number[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  color: var(--thidom-text-secondary);\n  margin-bottom: 6px;\n  display: inline-block;\n}\n.calendar-container[_ngcontent-%COMP%]   .calendar-grid[_ngcontent-%COMP%]   .calendar-day[_ngcontent-%COMP%]   .day-schedules[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  overflow: hidden;\n}\n.calendar-container[_ngcontent-%COMP%]   .calendar-grid[_ngcontent-%COMP%]   .calendar-day[_ngcontent-%COMP%]   .day-schedules[_ngcontent-%COMP%]   .day-schedule-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 5px;\n  cursor: pointer;\n  padding: 1px 4px;\n  border-radius: 3px;\n  transition: background 0.15s;\n}\n.calendar-container[_ngcontent-%COMP%]   .calendar-grid[_ngcontent-%COMP%]   .calendar-day[_ngcontent-%COMP%]   .day-schedules[_ngcontent-%COMP%]   .day-schedule-item[_ngcontent-%COMP%]:hover {\n  background: rgba(0, 230, 118, 0.08);\n}\n.calendar-container[_ngcontent-%COMP%]   .calendar-grid[_ngcontent-%COMP%]   .calendar-day[_ngcontent-%COMP%]   .day-schedules[_ngcontent-%COMP%]   .day-schedule-item[_ngcontent-%COMP%]   .schedule-dot[_ngcontent-%COMP%] {\n  width: 7px;\n  height: 7px;\n  border-radius: 50%;\n  background: var(--thidom-green);\n  flex-shrink: 0;\n}\n.calendar-container[_ngcontent-%COMP%]   .calendar-grid[_ngcontent-%COMP%]   .calendar-day[_ngcontent-%COMP%]   .day-schedules[_ngcontent-%COMP%]   .day-schedule-item[_ngcontent-%COMP%]   .schedule-label[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: var(--thidom-text-primary);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.schedule-card.disabled[_ngcontent-%COMP%] {\n  opacity: 0.5;\n}\n.schedule-card[_ngcontent-%COMP%]   .schedule-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 14px;\n}\n.schedule-card[_ngcontent-%COMP%]   .schedule-header[_ngcontent-%COMP%]   .schedule-icon[_ngcontent-%COMP%] {\n  width: 44px;\n  height: 44px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(255, 255, 255, 0.05);\n  color: var(--thidom-text-secondary);\n}\n.schedule-card[_ngcontent-%COMP%]   .schedule-header[_ngcontent-%COMP%]   .schedule-icon.active[_ngcontent-%COMP%] {\n  background: rgba(0, 230, 118, 0.12);\n  color: var(--thidom-green);\n}\n.schedule-card[_ngcontent-%COMP%]   .schedule-header[_ngcontent-%COMP%]   .schedule-info[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.schedule-card[_ngcontent-%COMP%]   .schedule-header[_ngcontent-%COMP%]   .schedule-info[_ngcontent-%COMP%]   .schedule-name[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 500;\n  font-size: 1.05rem;\n}\n.schedule-card[_ngcontent-%COMP%]   .schedule-header[_ngcontent-%COMP%]   .schedule-info[_ngcontent-%COMP%]   .schedule-desc[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.8rem;\n  color: var(--thidom-text-secondary);\n}\n.schedule-card[_ngcontent-%COMP%]   .schedule-details[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  margin-bottom: 14px;\n}\n.schedule-card[_ngcontent-%COMP%]   .schedule-details[_ngcontent-%COMP%]   .detail-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 0.85rem;\n  color: var(--thidom-text-secondary);\n}\n.schedule-card[_ngcontent-%COMP%]   .schedule-details[_ngcontent-%COMP%]   .detail-row[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n  color: var(--thidom-green);\n  flex-shrink: 0;\n}\n.schedule-card[_ngcontent-%COMP%]   .schedule-details[_ngcontent-%COMP%]   .detail-row[_ngcontent-%COMP%]   .time-value[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 500;\n  color: var(--thidom-text-primary);\n}\n.schedule-card[_ngcontent-%COMP%]   .schedule-details[_ngcontent-%COMP%]   .detail-row[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  font-family: monospace;\n  background: rgba(0, 0, 0, 0.2);\n  padding: 2px 6px;\n  border-radius: 4px;\n  font-size: 0.8rem;\n}\n.schedule-card[_ngcontent-%COMP%]   .schedule-details[_ngcontent-%COMP%]   .detail-row.action-row[_ngcontent-%COMP%] {\n  padding: 6px 8px;\n  background: rgba(255, 255, 255, 0.03);\n  border-radius: 6px;\n  border: 1px solid var(--thidom-border);\n}\n.schedule-card[_ngcontent-%COMP%]   .schedule-details[_ngcontent-%COMP%]   .detail-row.action-row[_ngcontent-%COMP%]   .action-summary[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: var(--thidom-text-primary);\n}\n.schedule-card[_ngcontent-%COMP%]   .schedule-footer[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding-top: 12px;\n  border-top: 1px solid var(--thidom-border);\n}\n.schedule-card[_ngcontent-%COMP%]   .schedule-footer[_ngcontent-%COMP%]   .footer-dates[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.schedule-card[_ngcontent-%COMP%]   .schedule-footer[_ngcontent-%COMP%]   .footer-dates[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: var(--thidom-text-secondary);\n}\n.empty-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 60px 20px;\n  color: var(--thidom-text-secondary);\n}\n.empty-state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 4rem;\n  width: 64px;\n  height: 64px;\n  margin-bottom: 16px;\n  opacity: 0.4;\n}\n.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  margin-bottom: 8px;\n  color: var(--thidom-text-primary);\n}\n.delete-action[_ngcontent-%COMP%] {\n  color: #f44336;\n}\n/*# sourceMappingURL=schedules.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SchedulesComponent, { className: "SchedulesComponent", filePath: "src\\app\\features\\schedules\\schedules.component.ts", lineNumber: 49 });
})();
export {
  SchedulesComponent
};
//# sourceMappingURL=chunk-V6SOSNHM.js.map
