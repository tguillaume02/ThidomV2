import {
  WebSocketService
} from "./chunk-2JRYZEP4.js";
import {
  RoomService
} from "./chunk-LVNRJANL.js";
import {
  DeviceService
} from "./chunk-YRR6QPHE.js";
import {
  MatSlideToggleModule
} from "./chunk-LJTFCNGQ.js";
import {
  MatChip,
  MatChipAvatar,
  MatChipSet,
  MatChipsModule
} from "./chunk-TPFVVE76.js";
import {
  MatProgressBar,
  MatProgressBarModule
} from "./chunk-JDQ2CLAH.js";
import {
  MatCardModule
} from "./chunk-A3S6NR4S.js";
import {
  MatTooltip,
  MatTooltipModule
} from "./chunk-3VUMTD7Q.js";
import {
  Directionality,
  FormsModule,
  MAT_RIPPLE_GLOBAL_OPTIONS,
  MatButtonModule,
  MatCommonModule,
  MatIcon,
  MatIconModule,
  MatRipple,
  MatRippleModule,
  NG_VALUE_ACCESSOR,
  Platform,
  RippleState
} from "./chunk-3YNX47WL.js";
import {
  ANIMATION_MODULE_TYPE,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  CommonModule,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  InputFlags,
  NgModule,
  NgZone,
  Optional,
  Output,
  Subject,
  ViewChild,
  ViewChildren,
  ViewEncapsulation$1,
  __spreadProps,
  __spreadValues,
  booleanAttribute,
  forwardRef,
  inject,
  numberAttribute,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵInputTransformsFeature,
  ɵɵProvidersFeature,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-7ID3BB7P.js";

// node_modules/@angular/material/fesm2022/slider.mjs
var _c0 = ["knob"];
var _c1 = ["valueIndicatorContainer"];
function MatSliderVisualThumb_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2, 1)(2, "div", 5)(3, "span", 6);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.valueIndicatorText);
  }
}
var _c2 = ["trackActive"];
var _c3 = ["*"];
function MatSlider_Conditional_6_Conditional_2_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div");
  }
  if (rf & 2) {
    const tickMark_r1 = ctx.$implicit;
    const i_r2 = ctx.$index;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap(tickMark_r1 === 0 ? "mdc-slider__tick-mark--active" : "mdc-slider__tick-mark--inactive");
    \u0275\u0275styleProp("transform", ctx_r2._calcTickMarkTransform(i_r2));
  }
}
function MatSlider_Conditional_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, MatSlider_Conditional_6_Conditional_2_For_1_Template, 1, 4, "div", 8, \u0275\u0275repeaterTrackByIndex);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275repeater(ctx_r2._tickMarks);
  }
}
function MatSlider_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6, 1);
    \u0275\u0275template(2, MatSlider_Conditional_6_Conditional_2_Template, 2, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(2, ctx_r2._cachedWidth ? 2 : -1);
  }
}
function MatSlider_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-slider-visual-thumb", 7);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("discrete", ctx_r2.discrete)("thumbPosition", 1)("valueIndicatorText", ctx_r2.startValueIndicatorText);
  }
}
var _MatThumb;
(function(_MatThumb2) {
  _MatThumb2[_MatThumb2["START"] = 1] = "START";
  _MatThumb2[_MatThumb2["END"] = 2] = "END";
})(_MatThumb || (_MatThumb = {}));
var _MatTickMark;
(function(_MatTickMark2) {
  _MatTickMark2[_MatTickMark2["ACTIVE"] = 0] = "ACTIVE";
  _MatTickMark2[_MatTickMark2["INACTIVE"] = 1] = "INACTIVE";
})(_MatTickMark || (_MatTickMark = {}));
var MAT_SLIDER = new InjectionToken("_MatSlider");
var MAT_SLIDER_THUMB = new InjectionToken("_MatSliderThumb");
var MAT_SLIDER_RANGE_THUMB = new InjectionToken("_MatSliderRangeThumb");
var MAT_SLIDER_VISUAL_THUMB = new InjectionToken("_MatSliderVisualThumb");
var MatSliderVisualThumb = class _MatSliderVisualThumb {
  constructor(_cdr, _ngZone, _elementRef, _slider) {
    this._cdr = _cdr;
    this._ngZone = _ngZone;
    this._slider = _slider;
    this._isHovered = false;
    this._isActive = false;
    this._isValueIndicatorVisible = false;
    this._platform = inject(Platform);
    this._onPointerMove = (event) => {
      if (this._sliderInput._isFocused) {
        return;
      }
      const rect = this._hostElement.getBoundingClientRect();
      const isHovered = this._slider._isCursorOnSliderThumb(event, rect);
      this._isHovered = isHovered;
      if (isHovered) {
        this._showHoverRipple();
      } else {
        this._hideRipple(this._hoverRippleRef);
      }
    };
    this._onMouseLeave = () => {
      this._isHovered = false;
      this._hideRipple(this._hoverRippleRef);
    };
    this._onFocus = () => {
      this._hideRipple(this._hoverRippleRef);
      this._showFocusRipple();
      this._hostElement.classList.add("mdc-slider__thumb--focused");
    };
    this._onBlur = () => {
      if (!this._isActive) {
        this._hideRipple(this._focusRippleRef);
      }
      if (this._isHovered) {
        this._showHoverRipple();
      }
      this._hostElement.classList.remove("mdc-slider__thumb--focused");
    };
    this._onDragStart = (event) => {
      if (event.button !== 0) {
        return;
      }
      this._isActive = true;
      this._showActiveRipple();
    };
    this._onDragEnd = () => {
      this._isActive = false;
      this._hideRipple(this._activeRippleRef);
      if (!this._sliderInput._isFocused) {
        this._hideRipple(this._focusRippleRef);
      }
      if (this._platform.SAFARI) {
        this._showHoverRipple();
      }
    };
    this._hostElement = _elementRef.nativeElement;
  }
  ngAfterViewInit() {
    this._ripple.radius = 24;
    this._sliderInput = this._slider._getInput(this.thumbPosition);
    this._sliderInputEl = this._sliderInput._hostElement;
    const input = this._sliderInputEl;
    this._ngZone.runOutsideAngular(() => {
      input.addEventListener("pointermove", this._onPointerMove);
      input.addEventListener("pointerdown", this._onDragStart);
      input.addEventListener("pointerup", this._onDragEnd);
      input.addEventListener("pointerleave", this._onMouseLeave);
      input.addEventListener("focus", this._onFocus);
      input.addEventListener("blur", this._onBlur);
    });
  }
  ngOnDestroy() {
    const input = this._sliderInputEl;
    if (input) {
      input.removeEventListener("pointermove", this._onPointerMove);
      input.removeEventListener("pointerdown", this._onDragStart);
      input.removeEventListener("pointerup", this._onDragEnd);
      input.removeEventListener("pointerleave", this._onMouseLeave);
      input.removeEventListener("focus", this._onFocus);
      input.removeEventListener("blur", this._onBlur);
    }
  }
  /** Handles displaying the hover ripple. */
  _showHoverRipple() {
    if (!this._isShowingRipple(this._hoverRippleRef)) {
      this._hoverRippleRef = this._showRipple({
        enterDuration: 0,
        exitDuration: 0
      });
      this._hoverRippleRef?.element.classList.add("mat-mdc-slider-hover-ripple");
    }
  }
  /** Handles displaying the focus ripple. */
  _showFocusRipple() {
    if (!this._isShowingRipple(this._focusRippleRef)) {
      this._focusRippleRef = this._showRipple({
        enterDuration: 0,
        exitDuration: 0
      }, true);
      this._focusRippleRef?.element.classList.add("mat-mdc-slider-focus-ripple");
    }
  }
  /** Handles displaying the active ripple. */
  _showActiveRipple() {
    if (!this._isShowingRipple(this._activeRippleRef)) {
      this._activeRippleRef = this._showRipple({
        enterDuration: 225,
        exitDuration: 400
      });
      this._activeRippleRef?.element.classList.add("mat-mdc-slider-active-ripple");
    }
  }
  /** Whether the given rippleRef is currently fading in or visible. */
  _isShowingRipple(rippleRef) {
    return rippleRef?.state === RippleState.FADING_IN || rippleRef?.state === RippleState.VISIBLE;
  }
  /** Manually launches the slider thumb ripple using the specified ripple animation config. */
  _showRipple(animation, ignoreGlobalRippleConfig) {
    if (this._slider.disabled) {
      return;
    }
    this._showValueIndicator();
    if (this._slider._isRange) {
      const sibling = this._slider._getThumb(this.thumbPosition === _MatThumb.START ? _MatThumb.END : _MatThumb.START);
      sibling._showValueIndicator();
    }
    if (this._slider._globalRippleOptions?.disabled && !ignoreGlobalRippleConfig) {
      return;
    }
    return this._ripple.launch({
      animation: this._slider._noopAnimations ? {
        enterDuration: 0,
        exitDuration: 0
      } : animation,
      centered: true,
      persistent: true
    });
  }
  /**
   * Fades out the given ripple.
   * Also hides the value indicator if no ripple is showing.
   */
  _hideRipple(rippleRef) {
    rippleRef?.fadeOut();
    if (this._isShowingAnyRipple()) {
      return;
    }
    if (!this._slider._isRange) {
      this._hideValueIndicator();
    }
    const sibling = this._getSibling();
    if (!sibling._isShowingAnyRipple()) {
      this._hideValueIndicator();
      sibling._hideValueIndicator();
    }
  }
  /** Shows the value indicator ui. */
  _showValueIndicator() {
    this._hostElement.classList.add("mdc-slider__thumb--with-indicator");
  }
  /** Hides the value indicator ui. */
  _hideValueIndicator() {
    this._hostElement.classList.remove("mdc-slider__thumb--with-indicator");
  }
  _getSibling() {
    return this._slider._getThumb(this.thumbPosition === _MatThumb.START ? _MatThumb.END : _MatThumb.START);
  }
  /** Gets the value indicator container's native HTML element. */
  _getValueIndicatorContainer() {
    return this._valueIndicatorContainer?.nativeElement;
  }
  /** Gets the native HTML element of the slider thumb knob. */
  _getKnob() {
    return this._knob.nativeElement;
  }
  _isShowingAnyRipple() {
    return this._isShowingRipple(this._hoverRippleRef) || this._isShowingRipple(this._focusRippleRef) || this._isShowingRipple(this._activeRippleRef);
  }
  static {
    this.\u0275fac = function MatSliderVisualThumb_Factory(t) {
      return new (t || _MatSliderVisualThumb)(\u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(NgZone), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(MAT_SLIDER));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _MatSliderVisualThumb,
      selectors: [["mat-slider-visual-thumb"]],
      viewQuery: function MatSliderVisualThumb_Query(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275viewQuery(MatRipple, 5);
          \u0275\u0275viewQuery(_c0, 5);
          \u0275\u0275viewQuery(_c1, 5);
        }
        if (rf & 2) {
          let _t;
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._ripple = _t.first);
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._knob = _t.first);
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._valueIndicatorContainer = _t.first);
        }
      },
      hostAttrs: [1, "mdc-slider__thumb", "mat-mdc-slider-visual-thumb"],
      inputs: {
        discrete: "discrete",
        thumbPosition: "thumbPosition",
        valueIndicatorText: "valueIndicatorText"
      },
      standalone: true,
      features: [\u0275\u0275ProvidersFeature([{
        provide: MAT_SLIDER_VISUAL_THUMB,
        useExisting: _MatSliderVisualThumb
      }]), \u0275\u0275StandaloneFeature],
      decls: 4,
      vars: 2,
      consts: [["knob", ""], ["valueIndicatorContainer", ""], [1, "mdc-slider__value-indicator-container"], [1, "mdc-slider__thumb-knob"], ["matRipple", "", 1, "mat-mdc-focus-indicator", 3, "matRippleDisabled"], [1, "mdc-slider__value-indicator"], [1, "mdc-slider__value-indicator-text"]],
      template: function MatSliderVisualThumb_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275template(0, MatSliderVisualThumb_Conditional_0_Template, 5, 1, "div", 2);
          \u0275\u0275element(1, "div", 3, 0)(3, "div", 4);
        }
        if (rf & 2) {
          \u0275\u0275conditional(0, ctx.discrete ? 0 : -1);
          \u0275\u0275advance(3);
          \u0275\u0275property("matRippleDisabled", true);
        }
      },
      dependencies: [MatRipple],
      styles: [".mat-mdc-slider-visual-thumb .mat-ripple{height:100%;width:100%}.mat-mdc-slider .mdc-slider__tick-marks{justify-content:start}.mat-mdc-slider .mdc-slider__tick-marks .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-marks .mdc-slider__tick-mark--inactive{position:absolute;left:2px}"],
      encapsulation: 2,
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSliderVisualThumb, [{
    type: Component,
    args: [{
      selector: "mat-slider-visual-thumb",
      host: {
        "class": "mdc-slider__thumb mat-mdc-slider-visual-thumb"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation$1.None,
      providers: [{
        provide: MAT_SLIDER_VISUAL_THUMB,
        useExisting: MatSliderVisualThumb
      }],
      standalone: true,
      imports: [MatRipple],
      template: '@if (discrete) {\n  <div class="mdc-slider__value-indicator-container" #valueIndicatorContainer>\n    <div class="mdc-slider__value-indicator">\n      <span class="mdc-slider__value-indicator-text">{{valueIndicatorText}}</span>\n    </div>\n  </div>\n}\n<div class="mdc-slider__thumb-knob" #knob></div>\n<div matRipple class="mat-mdc-focus-indicator" [matRippleDisabled]="true"></div>\n',
      styles: [".mat-mdc-slider-visual-thumb .mat-ripple{height:100%;width:100%}.mat-mdc-slider .mdc-slider__tick-marks{justify-content:start}.mat-mdc-slider .mdc-slider__tick-marks .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-marks .mdc-slider__tick-mark--inactive{position:absolute;left:2px}"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: NgZone
  }, {
    type: ElementRef
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [MAT_SLIDER]
    }]
  }], {
    discrete: [{
      type: Input
    }],
    thumbPosition: [{
      type: Input
    }],
    valueIndicatorText: [{
      type: Input
    }],
    _ripple: [{
      type: ViewChild,
      args: [MatRipple]
    }],
    _knob: [{
      type: ViewChild,
      args: ["knob"]
    }],
    _valueIndicatorContainer: [{
      type: ViewChild,
      args: ["valueIndicatorContainer"]
    }]
  });
})();
var MatSlider = class _MatSlider {
  /** Whether the slider is disabled. */
  get disabled() {
    return this._disabled;
  }
  set disabled(v) {
    this._disabled = v;
    const endInput = this._getInput(_MatThumb.END);
    const startInput = this._getInput(_MatThumb.START);
    if (endInput) {
      endInput.disabled = this._disabled;
    }
    if (startInput) {
      startInput.disabled = this._disabled;
    }
  }
  /** Whether the slider displays a numeric value label upon pressing the thumb. */
  get discrete() {
    return this._discrete;
  }
  set discrete(v) {
    this._discrete = v;
    this._updateValueIndicatorUIs();
  }
  /** The minimum value that the slider can have. */
  get min() {
    return this._min;
  }
  set min(v) {
    const min = isNaN(v) ? this._min : v;
    if (this._min !== min) {
      this._updateMin(min);
    }
  }
  _updateMin(min) {
    const prevMin = this._min;
    this._min = min;
    this._isRange ? this._updateMinRange({
      old: prevMin,
      new: min
    }) : this._updateMinNonRange(min);
    this._onMinMaxOrStepChange();
  }
  _updateMinRange(min) {
    const endInput = this._getInput(_MatThumb.END);
    const startInput = this._getInput(_MatThumb.START);
    const oldEndValue = endInput.value;
    const oldStartValue = startInput.value;
    startInput.min = min.new;
    endInput.min = Math.max(min.new, startInput.value);
    startInput.max = Math.min(endInput.max, endInput.value);
    startInput._updateWidthInactive();
    endInput._updateWidthInactive();
    min.new < min.old ? this._onTranslateXChangeBySideEffect(endInput, startInput) : this._onTranslateXChangeBySideEffect(startInput, endInput);
    if (oldEndValue !== endInput.value) {
      this._onValueChange(endInput);
    }
    if (oldStartValue !== startInput.value) {
      this._onValueChange(startInput);
    }
  }
  _updateMinNonRange(min) {
    const input = this._getInput(_MatThumb.END);
    if (input) {
      const oldValue = input.value;
      input.min = min;
      input._updateThumbUIByValue();
      this._updateTrackUI(input);
      if (oldValue !== input.value) {
        this._onValueChange(input);
      }
    }
  }
  /** The maximum value that the slider can have. */
  get max() {
    return this._max;
  }
  set max(v) {
    const max = isNaN(v) ? this._max : v;
    if (this._max !== max) {
      this._updateMax(max);
    }
  }
  _updateMax(max) {
    const prevMax = this._max;
    this._max = max;
    this._isRange ? this._updateMaxRange({
      old: prevMax,
      new: max
    }) : this._updateMaxNonRange(max);
    this._onMinMaxOrStepChange();
  }
  _updateMaxRange(max) {
    const endInput = this._getInput(_MatThumb.END);
    const startInput = this._getInput(_MatThumb.START);
    const oldEndValue = endInput.value;
    const oldStartValue = startInput.value;
    endInput.max = max.new;
    startInput.max = Math.min(max.new, endInput.value);
    endInput.min = startInput.value;
    endInput._updateWidthInactive();
    startInput._updateWidthInactive();
    max.new > max.old ? this._onTranslateXChangeBySideEffect(startInput, endInput) : this._onTranslateXChangeBySideEffect(endInput, startInput);
    if (oldEndValue !== endInput.value) {
      this._onValueChange(endInput);
    }
    if (oldStartValue !== startInput.value) {
      this._onValueChange(startInput);
    }
  }
  _updateMaxNonRange(max) {
    const input = this._getInput(_MatThumb.END);
    if (input) {
      const oldValue = input.value;
      input.max = max;
      input._updateThumbUIByValue();
      this._updateTrackUI(input);
      if (oldValue !== input.value) {
        this._onValueChange(input);
      }
    }
  }
  /** The values at which the thumb will snap. */
  get step() {
    return this._step;
  }
  set step(v) {
    const step = isNaN(v) ? this._step : v;
    if (this._step !== step) {
      this._updateStep(step);
    }
  }
  _updateStep(step) {
    this._step = step;
    this._isRange ? this._updateStepRange() : this._updateStepNonRange();
    this._onMinMaxOrStepChange();
  }
  _updateStepRange() {
    const endInput = this._getInput(_MatThumb.END);
    const startInput = this._getInput(_MatThumb.START);
    const oldEndValue = endInput.value;
    const oldStartValue = startInput.value;
    const prevStartValue = startInput.value;
    endInput.min = this._min;
    startInput.max = this._max;
    endInput.step = this._step;
    startInput.step = this._step;
    if (this._platform.SAFARI) {
      endInput.value = endInput.value;
      startInput.value = startInput.value;
    }
    endInput.min = Math.max(this._min, startInput.value);
    startInput.max = Math.min(this._max, endInput.value);
    startInput._updateWidthInactive();
    endInput._updateWidthInactive();
    endInput.value < prevStartValue ? this._onTranslateXChangeBySideEffect(startInput, endInput) : this._onTranslateXChangeBySideEffect(endInput, startInput);
    if (oldEndValue !== endInput.value) {
      this._onValueChange(endInput);
    }
    if (oldStartValue !== startInput.value) {
      this._onValueChange(startInput);
    }
  }
  _updateStepNonRange() {
    const input = this._getInput(_MatThumb.END);
    if (input) {
      const oldValue = input.value;
      input.step = this._step;
      if (this._platform.SAFARI) {
        input.value = input.value;
      }
      input._updateThumbUIByValue();
      if (oldValue !== input.value) {
        this._onValueChange(input);
      }
    }
  }
  constructor(_ngZone, _cdr, _elementRef, _dir, _globalRippleOptions, animationMode) {
    this._ngZone = _ngZone;
    this._cdr = _cdr;
    this._elementRef = _elementRef;
    this._dir = _dir;
    this._globalRippleOptions = _globalRippleOptions;
    this._disabled = false;
    this._discrete = false;
    this.showTickMarks = false;
    this._min = 0;
    this.disableRipple = false;
    this._max = 100;
    this._step = 1;
    this.displayWith = (value) => `${value}`;
    this._rippleRadius = 24;
    this.startValueIndicatorText = "";
    this.endValueIndicatorText = "";
    this._isRange = false;
    this._isRtl = false;
    this._hasViewInitialized = false;
    this._tickMarkTrackWidth = 0;
    this._hasAnimation = false;
    this._resizeTimer = null;
    this._platform = inject(Platform);
    this._knobRadius = 8;
    this._thumbsOverlap = false;
    this._noopAnimations = animationMode === "NoopAnimations";
    this._dirChangeSubscription = this._dir.change.subscribe(() => this._onDirChange());
    this._isRtl = this._dir.value === "rtl";
  }
  ngAfterViewInit() {
    if (this._platform.isBrowser) {
      this._updateDimensions();
    }
    const eInput = this._getInput(_MatThumb.END);
    const sInput = this._getInput(_MatThumb.START);
    this._isRange = !!eInput && !!sInput;
    this._cdr.detectChanges();
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      _validateInputs(this._isRange, this._getInput(_MatThumb.END), this._getInput(_MatThumb.START));
    }
    const thumb = this._getThumb(_MatThumb.END);
    this._rippleRadius = thumb._ripple.radius;
    this._inputPadding = this._rippleRadius - this._knobRadius;
    this._isRange ? this._initUIRange(eInput, sInput) : this._initUINonRange(eInput);
    this._updateTrackUI(eInput);
    this._updateTickMarkUI();
    this._updateTickMarkTrackUI();
    this._observeHostResize();
    this._cdr.detectChanges();
  }
  _initUINonRange(eInput) {
    eInput.initProps();
    eInput.initUI();
    this._updateValueIndicatorUI(eInput);
    this._hasViewInitialized = true;
    eInput._updateThumbUIByValue();
  }
  _initUIRange(eInput, sInput) {
    eInput.initProps();
    eInput.initUI();
    sInput.initProps();
    sInput.initUI();
    eInput._updateMinMax();
    sInput._updateMinMax();
    eInput._updateStaticStyles();
    sInput._updateStaticStyles();
    this._updateValueIndicatorUIs();
    this._hasViewInitialized = true;
    eInput._updateThumbUIByValue();
    sInput._updateThumbUIByValue();
  }
  ngOnDestroy() {
    this._dirChangeSubscription.unsubscribe();
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
  }
  /** Handles updating the slider ui after a dir change. */
  _onDirChange() {
    this._isRtl = this._dir.value === "rtl";
    this._isRange ? this._onDirChangeRange() : this._onDirChangeNonRange();
    this._updateTickMarkUI();
  }
  _onDirChangeRange() {
    const endInput = this._getInput(_MatThumb.END);
    const startInput = this._getInput(_MatThumb.START);
    endInput._setIsLeftThumb();
    startInput._setIsLeftThumb();
    endInput.translateX = endInput._calcTranslateXByValue();
    startInput.translateX = startInput._calcTranslateXByValue();
    endInput._updateStaticStyles();
    startInput._updateStaticStyles();
    endInput._updateWidthInactive();
    startInput._updateWidthInactive();
    endInput._updateThumbUIByValue();
    startInput._updateThumbUIByValue();
  }
  _onDirChangeNonRange() {
    const input = this._getInput(_MatThumb.END);
    input._updateThumbUIByValue();
  }
  /** Starts observing and updating the slider if the host changes its size. */
  _observeHostResize() {
    if (typeof ResizeObserver === "undefined" || !ResizeObserver) {
      return;
    }
    this._ngZone.runOutsideAngular(() => {
      this._resizeObserver = new ResizeObserver(() => {
        if (this._isActive()) {
          return;
        }
        if (this._resizeTimer) {
          clearTimeout(this._resizeTimer);
        }
        this._onResize();
      });
      this._resizeObserver.observe(this._elementRef.nativeElement);
    });
  }
  /** Whether any of the thumbs are currently active. */
  _isActive() {
    return this._getThumb(_MatThumb.START)._isActive || this._getThumb(_MatThumb.END)._isActive;
  }
  _getValue(thumbPosition = _MatThumb.END) {
    const input = this._getInput(thumbPosition);
    if (!input) {
      return this.min;
    }
    return input.value;
  }
  _skipUpdate() {
    return !!(this._getInput(_MatThumb.START)?._skipUIUpdate || this._getInput(_MatThumb.END)?._skipUIUpdate);
  }
  /** Stores the slider dimensions. */
  _updateDimensions() {
    this._cachedWidth = this._elementRef.nativeElement.offsetWidth;
    this._cachedLeft = this._elementRef.nativeElement.getBoundingClientRect().left;
  }
  /** Sets the styles for the active portion of the track. */
  _setTrackActiveStyles(styles) {
    const trackStyle = this._trackActive.nativeElement.style;
    trackStyle.left = styles.left;
    trackStyle.right = styles.right;
    trackStyle.transformOrigin = styles.transformOrigin;
    trackStyle.transform = styles.transform;
  }
  /** Returns the translateX positioning for a tick mark based on it's index. */
  _calcTickMarkTransform(index) {
    const translateX = index * (this._tickMarkTrackWidth / (this._tickMarks.length - 1));
    return `translateX(${translateX}px`;
  }
  // Handlers for updating the slider ui.
  _onTranslateXChange(source) {
    if (!this._hasViewInitialized) {
      return;
    }
    this._updateThumbUI(source);
    this._updateTrackUI(source);
    this._updateOverlappingThumbUI(source);
  }
  _onTranslateXChangeBySideEffect(input1, input2) {
    if (!this._hasViewInitialized) {
      return;
    }
    input1._updateThumbUIByValue();
    input2._updateThumbUIByValue();
  }
  _onValueChange(source) {
    if (!this._hasViewInitialized) {
      return;
    }
    this._updateValueIndicatorUI(source);
    this._updateTickMarkUI();
    this._cdr.detectChanges();
  }
  _onMinMaxOrStepChange() {
    if (!this._hasViewInitialized) {
      return;
    }
    this._updateTickMarkUI();
    this._updateTickMarkTrackUI();
    this._cdr.markForCheck();
  }
  _onResize() {
    if (!this._hasViewInitialized) {
      return;
    }
    this._updateDimensions();
    if (this._isRange) {
      const eInput = this._getInput(_MatThumb.END);
      const sInput = this._getInput(_MatThumb.START);
      eInput._updateThumbUIByValue();
      sInput._updateThumbUIByValue();
      eInput._updateStaticStyles();
      sInput._updateStaticStyles();
      eInput._updateMinMax();
      sInput._updateMinMax();
      eInput._updateWidthInactive();
      sInput._updateWidthInactive();
    } else {
      const eInput = this._getInput(_MatThumb.END);
      if (eInput) {
        eInput._updateThumbUIByValue();
      }
    }
    this._updateTickMarkUI();
    this._updateTickMarkTrackUI();
    this._cdr.detectChanges();
  }
  /** Returns true if the slider knobs are overlapping one another. */
  _areThumbsOverlapping() {
    const startInput = this._getInput(_MatThumb.START);
    const endInput = this._getInput(_MatThumb.END);
    if (!startInput || !endInput) {
      return false;
    }
    return endInput.translateX - startInput.translateX < 20;
  }
  /**
   * Updates the class names of overlapping slider thumbs so
   * that the current active thumb is styled to be on "top".
   */
  _updateOverlappingThumbClassNames(source) {
    const sibling = source.getSibling();
    const sourceThumb = this._getThumb(source.thumbPosition);
    const siblingThumb = this._getThumb(sibling.thumbPosition);
    siblingThumb._hostElement.classList.remove("mdc-slider__thumb--top");
    sourceThumb._hostElement.classList.toggle("mdc-slider__thumb--top", this._thumbsOverlap);
  }
  /** Updates the UI of slider thumbs when they begin or stop overlapping. */
  _updateOverlappingThumbUI(source) {
    if (!this._isRange || this._skipUpdate()) {
      return;
    }
    if (this._thumbsOverlap !== this._areThumbsOverlapping()) {
      this._thumbsOverlap = !this._thumbsOverlap;
      this._updateOverlappingThumbClassNames(source);
    }
  }
  // _MatThumb styles update conditions
  //
  // 1. TranslateX, resize, or dir change
  //    - Reason: The thumb styles need to be updated according to the new translateX.
  // 2. Min, max, or step
  //    - Reason: The value may have silently changed.
  /** Updates the translateX of the given thumb. */
  _updateThumbUI(source) {
    if (this._skipUpdate()) {
      return;
    }
    const thumb = this._getThumb(source.thumbPosition === _MatThumb.END ? _MatThumb.END : _MatThumb.START);
    thumb._hostElement.style.transform = `translateX(${source.translateX}px)`;
  }
  // Value indicator text update conditions
  //
  // 1. Value
  //    - Reason: The value displayed needs to be updated.
  // 2. Min, max, or step
  //    - Reason: The value may have silently changed.
  /** Updates the value indicator tooltip ui for the given thumb. */
  _updateValueIndicatorUI(source) {
    if (this._skipUpdate()) {
      return;
    }
    const valuetext = this.displayWith(source.value);
    this._hasViewInitialized ? source._valuetext.set(valuetext) : source._hostElement.setAttribute("aria-valuetext", valuetext);
    if (this.discrete) {
      source.thumbPosition === _MatThumb.START ? this.startValueIndicatorText = valuetext : this.endValueIndicatorText = valuetext;
      const visualThumb = this._getThumb(source.thumbPosition);
      valuetext.length < 3 ? visualThumb._hostElement.classList.add("mdc-slider__thumb--short-value") : visualThumb._hostElement.classList.remove("mdc-slider__thumb--short-value");
    }
  }
  /** Updates all value indicator UIs in the slider. */
  _updateValueIndicatorUIs() {
    const eInput = this._getInput(_MatThumb.END);
    const sInput = this._getInput(_MatThumb.START);
    if (eInput) {
      this._updateValueIndicatorUI(eInput);
    }
    if (sInput) {
      this._updateValueIndicatorUI(sInput);
    }
  }
  // Update Tick Mark Track Width
  //
  // 1. Min, max, or step
  //    - Reason: The maximum reachable value may have changed.
  //    - Side note: The maximum reachable value is different from the maximum value set by the
  //      user. For example, a slider with [min: 5, max: 100, step: 10] would have a maximum
  //      reachable value of 95.
  // 2. Resize
  //    - Reason: The position for the maximum reachable value needs to be recalculated.
  /** Updates the width of the tick mark track. */
  _updateTickMarkTrackUI() {
    if (!this.showTickMarks || this._skipUpdate()) {
      return;
    }
    const step = this._step && this._step > 0 ? this._step : 1;
    const maxValue = Math.floor(this.max / step) * step;
    const percentage = (maxValue - this.min) / (this.max - this.min);
    this._tickMarkTrackWidth = this._cachedWidth * percentage - 6;
  }
  // Track active update conditions
  //
  // 1. TranslateX
  //    - Reason: The track active should line up with the new thumb position.
  // 2. Min or max
  //    - Reason #1: The 'active' percentage needs to be recalculated.
  //    - Reason #2: The value may have silently changed.
  // 3. Step
  //    - Reason: The value may have silently changed causing the thumb(s) to shift.
  // 4. Dir change
  //    - Reason: The track active will need to be updated according to the new thumb position(s).
  // 5. Resize
  //    - Reason: The total width the 'active' tracks translateX is based on has changed.
  /** Updates the scale on the active portion of the track. */
  _updateTrackUI(source) {
    if (this._skipUpdate()) {
      return;
    }
    this._isRange ? this._updateTrackUIRange(source) : this._updateTrackUINonRange(source);
  }
  _updateTrackUIRange(source) {
    const sibling = source.getSibling();
    if (!sibling || !this._cachedWidth) {
      return;
    }
    const activePercentage = Math.abs(sibling.translateX - source.translateX) / this._cachedWidth;
    if (source._isLeftThumb && this._cachedWidth) {
      this._setTrackActiveStyles({
        left: "auto",
        right: `${this._cachedWidth - sibling.translateX}px`,
        transformOrigin: "right",
        transform: `scaleX(${activePercentage})`
      });
    } else {
      this._setTrackActiveStyles({
        left: `${sibling.translateX}px`,
        right: "auto",
        transformOrigin: "left",
        transform: `scaleX(${activePercentage})`
      });
    }
  }
  _updateTrackUINonRange(source) {
    this._isRtl ? this._setTrackActiveStyles({
      left: "auto",
      right: "0px",
      transformOrigin: "right",
      transform: `scaleX(${1 - source.fillPercentage})`
    }) : this._setTrackActiveStyles({
      left: "0px",
      right: "auto",
      transformOrigin: "left",
      transform: `scaleX(${source.fillPercentage})`
    });
  }
  // Tick mark update conditions
  //
  // 1. Value
  //    - Reason: a tick mark which was once active might now be inactive or vice versa.
  // 2. Min, max, or step
  //    - Reason #1: the number of tick marks may have changed.
  //    - Reason #2: The value may have silently changed.
  /** Updates the dots along the slider track. */
  _updateTickMarkUI() {
    if (!this.showTickMarks || this.step === void 0 || this.min === void 0 || this.max === void 0) {
      return;
    }
    const step = this.step > 0 ? this.step : 1;
    this._isRange ? this._updateTickMarkUIRange(step) : this._updateTickMarkUINonRange(step);
    if (this._isRtl) {
      this._tickMarks.reverse();
    }
  }
  _updateTickMarkUINonRange(step) {
    const value = this._getValue();
    let numActive = Math.max(Math.floor((value - this.min) / step), 0);
    let numInactive = Math.max(Math.floor((this.max - value) / step), 0);
    this._isRtl ? numActive++ : numInactive++;
    this._tickMarks = Array(numActive).fill(_MatTickMark.ACTIVE).concat(Array(numInactive).fill(_MatTickMark.INACTIVE));
  }
  _updateTickMarkUIRange(step) {
    const endValue = this._getValue();
    const startValue = this._getValue(_MatThumb.START);
    const numInactiveBeforeStartThumb = Math.max(Math.floor((startValue - this.min) / step), 0);
    const numActive = Math.max(Math.floor((endValue - startValue) / step) + 1, 0);
    const numInactiveAfterEndThumb = Math.max(Math.floor((this.max - endValue) / step), 0);
    this._tickMarks = Array(numInactiveBeforeStartThumb).fill(_MatTickMark.INACTIVE).concat(Array(numActive).fill(_MatTickMark.ACTIVE), Array(numInactiveAfterEndThumb).fill(_MatTickMark.INACTIVE));
  }
  /** Gets the slider thumb input of the given thumb position. */
  _getInput(thumbPosition) {
    if (thumbPosition === _MatThumb.END && this._input) {
      return this._input;
    }
    if (this._inputs?.length) {
      return thumbPosition === _MatThumb.START ? this._inputs.first : this._inputs.last;
    }
    return;
  }
  /** Gets the slider thumb HTML input element of the given thumb position. */
  _getThumb(thumbPosition) {
    return thumbPosition === _MatThumb.END ? this._thumbs?.last : this._thumbs?.first;
  }
  _setTransition(withAnimation) {
    this._hasAnimation = !this._platform.IOS && withAnimation && !this._noopAnimations;
    this._elementRef.nativeElement.classList.toggle("mat-mdc-slider-with-animation", this._hasAnimation);
  }
  /** Whether the given pointer event occurred within the bounds of the slider pointer's DOM Rect. */
  _isCursorOnSliderThumb(event, rect) {
    const radius = rect.width / 2;
    const centerX = rect.x + radius;
    const centerY = rect.y + radius;
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    return Math.pow(dx, 2) + Math.pow(dy, 2) < Math.pow(radius, 2);
  }
  static {
    this.\u0275fac = function MatSlider_Factory(t) {
      return new (t || _MatSlider)(\u0275\u0275directiveInject(NgZone), \u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(Directionality, 8), \u0275\u0275directiveInject(MAT_RIPPLE_GLOBAL_OPTIONS, 8), \u0275\u0275directiveInject(ANIMATION_MODULE_TYPE, 8));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _MatSlider,
      selectors: [["mat-slider"]],
      contentQueries: function MatSlider_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          \u0275\u0275contentQuery(dirIndex, MAT_SLIDER_THUMB, 5);
          \u0275\u0275contentQuery(dirIndex, MAT_SLIDER_RANGE_THUMB, 4);
        }
        if (rf & 2) {
          let _t;
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._input = _t.first);
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._inputs = _t);
        }
      },
      viewQuery: function MatSlider_Query(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275viewQuery(_c2, 5);
          \u0275\u0275viewQuery(MAT_SLIDER_VISUAL_THUMB, 5);
        }
        if (rf & 2) {
          let _t;
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._trackActive = _t.first);
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._thumbs = _t);
        }
      },
      hostAttrs: [1, "mat-mdc-slider", "mdc-slider"],
      hostVars: 12,
      hostBindings: function MatSlider_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275classMap("mat-" + (ctx.color || "primary"));
          \u0275\u0275classProp("mdc-slider--range", ctx._isRange)("mdc-slider--disabled", ctx.disabled)("mdc-slider--discrete", ctx.discrete)("mdc-slider--tick-marks", ctx.showTickMarks)("_mat-animation-noopable", ctx._noopAnimations);
        }
      },
      inputs: {
        disabled: [InputFlags.HasDecoratorInputTransform, "disabled", "disabled", booleanAttribute],
        discrete: [InputFlags.HasDecoratorInputTransform, "discrete", "discrete", booleanAttribute],
        showTickMarks: [InputFlags.HasDecoratorInputTransform, "showTickMarks", "showTickMarks", booleanAttribute],
        min: [InputFlags.HasDecoratorInputTransform, "min", "min", numberAttribute],
        color: "color",
        disableRipple: [InputFlags.HasDecoratorInputTransform, "disableRipple", "disableRipple", booleanAttribute],
        max: [InputFlags.HasDecoratorInputTransform, "max", "max", numberAttribute],
        step: [InputFlags.HasDecoratorInputTransform, "step", "step", numberAttribute],
        displayWith: "displayWith"
      },
      exportAs: ["matSlider"],
      standalone: true,
      features: [\u0275\u0275ProvidersFeature([{
        provide: MAT_SLIDER,
        useExisting: _MatSlider
      }]), \u0275\u0275InputTransformsFeature, \u0275\u0275StandaloneFeature],
      ngContentSelectors: _c3,
      decls: 9,
      vars: 5,
      consts: [["trackActive", ""], ["tickMarkContainer", ""], [1, "mdc-slider__track"], [1, "mdc-slider__track--inactive"], [1, "mdc-slider__track--active"], [1, "mdc-slider__track--active_fill"], [1, "mdc-slider__tick-marks"], [3, "discrete", "thumbPosition", "valueIndicatorText"], [3, "class", "transform"]],
      template: function MatSlider_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef();
          \u0275\u0275projection(0);
          \u0275\u0275elementStart(1, "div", 2);
          \u0275\u0275element(2, "div", 3);
          \u0275\u0275elementStart(3, "div", 4);
          \u0275\u0275element(4, "div", 5, 0);
          \u0275\u0275elementEnd();
          \u0275\u0275template(6, MatSlider_Conditional_6_Template, 3, 1, "div", 6);
          \u0275\u0275elementEnd();
          \u0275\u0275template(7, MatSlider_Conditional_7_Template, 1, 3, "mat-slider-visual-thumb", 7);
          \u0275\u0275element(8, "mat-slider-visual-thumb", 7);
        }
        if (rf & 2) {
          \u0275\u0275advance(6);
          \u0275\u0275conditional(6, ctx.showTickMarks ? 6 : -1);
          \u0275\u0275advance();
          \u0275\u0275conditional(7, ctx._isRange ? 7 : -1);
          \u0275\u0275advance();
          \u0275\u0275property("discrete", ctx.discrete)("thumbPosition", 2)("valueIndicatorText", ctx.endValueIndicatorText);
        }
      },
      dependencies: [MatSliderVisualThumb],
      styles: ['.mdc-slider{cursor:pointer;height:48px;margin:0 24px;position:relative;touch-action:pan-y}.mdc-slider .mdc-slider__track{position:absolute;top:50%;transform:translateY(-50%);width:100%}.mdc-slider .mdc-slider__track--active,.mdc-slider .mdc-slider__track--inactive{display:flex;height:100%;position:absolute;width:100%}.mdc-slider .mdc-slider__track--active{overflow:hidden}.mdc-slider .mdc-slider__track--active_fill{border-top-style:solid;box-sizing:border-box;height:100%;width:100%;position:relative;-webkit-transform-origin:left;transform-origin:left}[dir=rtl] .mdc-slider .mdc-slider__track--active_fill,.mdc-slider .mdc-slider__track--active_fill[dir=rtl]{-webkit-transform-origin:right;transform-origin:right}.mdc-slider .mdc-slider__track--inactive{left:0;top:0}.mdc-slider .mdc-slider__track--inactive::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:"";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__track--inactive::before{border-color:CanvasText}}.mdc-slider .mdc-slider__value-indicator-container{bottom:44px;left:50%;left:var(--slider-value-indicator-container-left, 50%);pointer-events:none;position:absolute;right:var(--slider-value-indicator-container-right);transform:translateX(-50%);transform:var(--slider-value-indicator-container-transform, translateX(-50%))}.mdc-slider .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0.4, 0, 1, 1);align-items:center;border-radius:4px;display:flex;height:32px;padding:0 12px;transform:scale(0);transform-origin:bottom}.mdc-slider .mdc-slider__value-indicator::before{border-left:6px solid rgba(0,0,0,0);border-right:6px solid rgba(0,0,0,0);border-top:6px solid;bottom:-5px;content:"";height:0;left:50%;left:var(--slider-value-indicator-caret-left, 50%);position:absolute;right:var(--slider-value-indicator-caret-right);transform:translateX(-50%);transform:var(--slider-value-indicator-caret-transform, translateX(-50%));width:0}.mdc-slider .mdc-slider__value-indicator::after{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:"";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__value-indicator::after{border-color:CanvasText}}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator-container{pointer-events:auto}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:scale(1)}@media(prefers-reduced-motion){.mdc-slider .mdc-slider__value-indicator,.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:none}}.mdc-slider .mdc-slider__thumb{display:flex;left:-24px;outline:none;position:absolute;user-select:none;height:48px;width:48px}.mdc-slider .mdc-slider__thumb--top{z-index:1}.mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-style:solid;border-width:1px;box-sizing:content-box}.mdc-slider .mdc-slider__thumb-knob{box-sizing:border-box;left:50%;position:absolute;top:50%;transform:translate(-50%, -50%)}.mdc-slider .mdc-slider__tick-marks{align-items:center;box-sizing:border-box;display:flex;height:100%;justify-content:space-between;padding:0 1px;position:absolute;width:100%}.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:transform 80ms ease}@media(prefers-reduced-motion){.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:none}}.mdc-slider--disabled{cursor:auto}.mdc-slider--disabled .mdc-slider__thumb{pointer-events:none}.mdc-slider__input{cursor:pointer;left:2px;margin:0;height:44px;opacity:0;pointer-events:none;position:absolute;top:2px;width:44px}.mat-mdc-slider{display:inline-block;box-sizing:border-box;outline:none;vertical-align:middle;margin-left:8px;margin-right:8px;width:auto;min-width:112px;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-slider .mdc-slider__thumb-knob{background-color:var(--mdc-slider-handle-color);border-color:var(--mdc-slider-handle-color)}.mat-mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb-knob{background-color:var(--mdc-slider-disabled-handle-color);border-color:var(--mdc-slider-disabled-handle-color)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb::before,.mat-mdc-slider .mdc-slider__thumb::after{background-color:var(--mdc-slider-handle-color)}.mat-mdc-slider .mdc-slider__thumb:hover::before,.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-surface--hover::before{opacity:var(--mdc-ripple-hover-opacity)}.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded--background-focused::before,.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:var(--mdc-ripple-focus-opacity)}.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:var(--mdc-ripple-press-opacity)}.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity)}.mat-mdc-slider .mdc-slider__track--active_fill{border-color:var(--mdc-slider-active-track-color)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__track--active_fill{border-color:var(--mdc-slider-disabled-active-track-color)}.mat-mdc-slider .mdc-slider__track--inactive{background-color:var(--mdc-slider-inactive-track-color);opacity:.24}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__track--inactive{background-color:var(--mdc-slider-disabled-inactive-track-color);opacity:.24}.mat-mdc-slider .mdc-slider__tick-mark--active{background-color:var(--mdc-slider-with-tick-marks-active-container-color);opacity:var(--mdc-slider-with-tick-marks-active-container-opacity)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__tick-mark--active{background-color:var(--mdc-slider-with-tick-marks-active-container-color);opacity:var(--mdc-slider-with-tick-marks-active-container-opacity)}.mat-mdc-slider .mdc-slider__tick-mark--inactive{background-color:var(--mdc-slider-with-tick-marks-inactive-container-color);opacity:var(--mdc-slider-with-tick-marks-inactive-container-opacity)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__tick-mark--inactive{background-color:var(--mdc-slider-with-tick-marks-disabled-container-color);opacity:var(--mdc-slider-with-tick-marks-inactive-container-opacity)}.mat-mdc-slider .mdc-slider__value-indicator{background-color:var(--mdc-slider-label-container-color);opacity:1}.mat-mdc-slider .mdc-slider__value-indicator::before{border-top-color:var(--mdc-slider-label-container-color)}.mat-mdc-slider .mdc-slider__value-indicator{color:var(--mdc-slider-label-label-text-color)}.mat-mdc-slider .mdc-slider__track{height:var(--mdc-slider-inactive-track-height)}.mat-mdc-slider .mdc-slider__track--active{height:var(--mdc-slider-active-track-height);top:calc((var(--mdc-slider-inactive-track-height) - var(--mdc-slider-active-track-height)) / 2)}.mat-mdc-slider .mdc-slider__track--active_fill{border-top-width:var(--mdc-slider-active-track-height)}.mat-mdc-slider .mdc-slider__track--inactive{height:var(--mdc-slider-inactive-track-height)}.mat-mdc-slider .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-mark--inactive{height:var(--mdc-slider-with-tick-marks-container-size);width:var(--mdc-slider-with-tick-marks-container-size)}.mat-mdc-slider.mdc-slider--disabled{opacity:0.38}.mat-mdc-slider .mdc-slider__value-indicator-text{letter-spacing:var(--mdc-slider-label-label-text-tracking);font-size:var(--mdc-slider-label-label-text-size);font-family:var(--mdc-slider-label-label-text-font);font-weight:var(--mdc-slider-label-label-text-weight);line-height:var(--mdc-slider-label-label-text-line-height)}.mat-mdc-slider .mdc-slider__track--active{border-radius:var(--mdc-slider-active-track-shape)}.mat-mdc-slider .mdc-slider__track--inactive{border-radius:var(--mdc-slider-inactive-track-shape)}.mat-mdc-slider .mdc-slider__thumb-knob{border-radius:var(--mdc-slider-handle-shape);width:var(--mdc-slider-handle-width);height:var(--mdc-slider-handle-height);border-style:solid;border-width:calc(var(--mdc-slider-handle-height) / 2) calc(var(--mdc-slider-handle-width) / 2)}.mat-mdc-slider .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-mark--inactive{border-radius:var(--mdc-slider-with-tick-marks-container-shape)}.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb-knob{background-color:var(--mdc-slider-hover-handle-color);border-color:var(--mdc-slider-hover-handle-color)}.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb-knob{background-color:var(--mdc-slider-focus-handle-color);border-color:var(--mdc-slider-focus-handle-color)}.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:var(--mdc-slider-with-overlap-handle-outline-color);border-width:var(--mdc-slider-with-overlap-handle-outline-width)}.mat-mdc-slider .mdc-slider__thumb-knob{box-shadow:var(--mdc-slider-handle-elevation)}.mat-mdc-slider .mdc-slider__input{box-sizing:content-box;pointer-events:auto}.mat-mdc-slider .mdc-slider__input.mat-mdc-slider-input-no-pointer-events{pointer-events:none}.mat-mdc-slider .mdc-slider__input.mat-slider__right-input{left:auto;right:0}.mat-mdc-slider .mdc-slider__thumb,.mat-mdc-slider .mdc-slider__track--active_fill{transition-duration:0ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill{transition-duration:80ms}.mat-mdc-slider.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider.mdc-slider--discrete .mdc-slider__track--active_fill{transition-duration:0ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill{transition-duration:80ms}.mat-mdc-slider .mdc-slider__track,.mat-mdc-slider .mdc-slider__thumb{pointer-events:none}.mat-mdc-slider .mdc-slider__value-indicator-container{transform:var(--mat-slider-value-indicator-container-transform)}.mat-mdc-slider .mdc-slider__value-indicator{width:var(--mat-slider-value-indicator-width);height:var(--mat-slider-value-indicator-height);padding:var(--mat-slider-value-indicator-padding);opacity:var(--mat-slider-value-indicator-opacity);border-radius:var(--mat-slider-value-indicator-border-radius)}.mat-mdc-slider .mdc-slider__value-indicator::before{display:var(--mat-slider-value-indicator-caret-display)}.mat-mdc-slider .mdc-slider__value-indicator-text{width:var(--mat-slider-value-indicator-width);transform:var(--mat-slider-value-indicator-text-transform)}.mat-mdc-slider .mat-ripple .mat-ripple-element{background-color:var(--mat-slider-ripple-color)}.mat-mdc-slider .mat-ripple .mat-mdc-slider-hover-ripple{background-color:var(--mat-slider-hover-state-layer-color)}.mat-mdc-slider .mat-ripple .mat-mdc-slider-focus-ripple,.mat-mdc-slider .mat-ripple .mat-mdc-slider-active-ripple{background-color:var(--mat-slider-focus-state-layer-color)}.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__track--active_fill,.mat-mdc-slider._mat-animation-noopable .mdc-slider__value-indicator{transition:none}.mat-mdc-slider .mat-mdc-focus-indicator::before{border-radius:50%}.mat-mdc-slider .mdc-slider__value-indicator{word-break:normal}.mat-mdc-slider .mdc-slider__value-indicator-text{text-align:center}.mdc-slider__thumb--focused .mat-mdc-focus-indicator::before{content:""}'],
      encapsulation: 2,
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSlider, [{
    type: Component,
    args: [{
      selector: "mat-slider",
      host: {
        "class": "mat-mdc-slider mdc-slider",
        "[class]": '"mat-" + (color || "primary")',
        "[class.mdc-slider--range]": "_isRange",
        "[class.mdc-slider--disabled]": "disabled",
        "[class.mdc-slider--discrete]": "discrete",
        "[class.mdc-slider--tick-marks]": "showTickMarks",
        "[class._mat-animation-noopable]": "_noopAnimations"
      },
      exportAs: "matSlider",
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation$1.None,
      providers: [{
        provide: MAT_SLIDER,
        useExisting: MatSlider
      }],
      standalone: true,
      imports: [MatSliderVisualThumb],
      template: `<!-- Inputs -->
<ng-content></ng-content>

<!-- Track -->
<div class="mdc-slider__track">
  <div class="mdc-slider__track--inactive"></div>
  <div class="mdc-slider__track--active">
    <div #trackActive class="mdc-slider__track--active_fill"></div>
  </div>
  @if (showTickMarks) {
    <div class="mdc-slider__tick-marks" #tickMarkContainer>
      @if (_cachedWidth) {
        @for (tickMark of _tickMarks; track i; let i = $index) {
          <div
            [class]="tickMark === 0 ? 'mdc-slider__tick-mark--active' : 'mdc-slider__tick-mark--inactive'"
            [style.transform]="_calcTickMarkTransform(i)"></div>
        }
      }
    </div>
  }
</div>

<!-- Thumbs -->
@if (_isRange) {
  <mat-slider-visual-thumb
    [discrete]="discrete"
    [thumbPosition]="1"
    [valueIndicatorText]="startValueIndicatorText">
  </mat-slider-visual-thumb>
}

<mat-slider-visual-thumb
  [discrete]="discrete"
  [thumbPosition]="2"
  [valueIndicatorText]="endValueIndicatorText">
</mat-slider-visual-thumb>
`,
      styles: ['.mdc-slider{cursor:pointer;height:48px;margin:0 24px;position:relative;touch-action:pan-y}.mdc-slider .mdc-slider__track{position:absolute;top:50%;transform:translateY(-50%);width:100%}.mdc-slider .mdc-slider__track--active,.mdc-slider .mdc-slider__track--inactive{display:flex;height:100%;position:absolute;width:100%}.mdc-slider .mdc-slider__track--active{overflow:hidden}.mdc-slider .mdc-slider__track--active_fill{border-top-style:solid;box-sizing:border-box;height:100%;width:100%;position:relative;-webkit-transform-origin:left;transform-origin:left}[dir=rtl] .mdc-slider .mdc-slider__track--active_fill,.mdc-slider .mdc-slider__track--active_fill[dir=rtl]{-webkit-transform-origin:right;transform-origin:right}.mdc-slider .mdc-slider__track--inactive{left:0;top:0}.mdc-slider .mdc-slider__track--inactive::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:"";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__track--inactive::before{border-color:CanvasText}}.mdc-slider .mdc-slider__value-indicator-container{bottom:44px;left:50%;left:var(--slider-value-indicator-container-left, 50%);pointer-events:none;position:absolute;right:var(--slider-value-indicator-container-right);transform:translateX(-50%);transform:var(--slider-value-indicator-container-transform, translateX(-50%))}.mdc-slider .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0.4, 0, 1, 1);align-items:center;border-radius:4px;display:flex;height:32px;padding:0 12px;transform:scale(0);transform-origin:bottom}.mdc-slider .mdc-slider__value-indicator::before{border-left:6px solid rgba(0,0,0,0);border-right:6px solid rgba(0,0,0,0);border-top:6px solid;bottom:-5px;content:"";height:0;left:50%;left:var(--slider-value-indicator-caret-left, 50%);position:absolute;right:var(--slider-value-indicator-caret-right);transform:translateX(-50%);transform:var(--slider-value-indicator-caret-transform, translateX(-50%));width:0}.mdc-slider .mdc-slider__value-indicator::after{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:"";pointer-events:none}@media screen and (forced-colors: active){.mdc-slider .mdc-slider__value-indicator::after{border-color:CanvasText}}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator-container{pointer-events:auto}.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:transform 100ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:scale(1)}@media(prefers-reduced-motion){.mdc-slider .mdc-slider__value-indicator,.mdc-slider .mdc-slider__thumb--with-indicator .mdc-slider__value-indicator{transition:none}}.mdc-slider .mdc-slider__thumb{display:flex;left:-24px;outline:none;position:absolute;user-select:none;height:48px;width:48px}.mdc-slider .mdc-slider__thumb--top{z-index:1}.mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-style:solid;border-width:1px;box-sizing:content-box}.mdc-slider .mdc-slider__thumb-knob{box-sizing:border-box;left:50%;position:absolute;top:50%;transform:translate(-50%, -50%)}.mdc-slider .mdc-slider__tick-marks{align-items:center;box-sizing:border-box;display:flex;height:100%;justify-content:space-between;padding:0 1px;position:absolute;width:100%}.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:transform 80ms ease}@media(prefers-reduced-motion){.mdc-slider--discrete .mdc-slider__thumb,.mdc-slider--discrete .mdc-slider__track--active_fill{transition:none}}.mdc-slider--disabled{cursor:auto}.mdc-slider--disabled .mdc-slider__thumb{pointer-events:none}.mdc-slider__input{cursor:pointer;left:2px;margin:0;height:44px;opacity:0;pointer-events:none;position:absolute;top:2px;width:44px}.mat-mdc-slider{display:inline-block;box-sizing:border-box;outline:none;vertical-align:middle;margin-left:8px;margin-right:8px;width:auto;min-width:112px;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-slider .mdc-slider__thumb-knob{background-color:var(--mdc-slider-handle-color);border-color:var(--mdc-slider-handle-color)}.mat-mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb-knob{background-color:var(--mdc-slider-disabled-handle-color);border-color:var(--mdc-slider-disabled-handle-color)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider.mdc-slider--disabled .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb::before,.mat-mdc-slider .mdc-slider__thumb::after{background-color:var(--mdc-slider-handle-color)}.mat-mdc-slider .mdc-slider__thumb:hover::before,.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-surface--hover::before{opacity:var(--mdc-ripple-hover-opacity)}.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded--background-focused::before,.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:var(--mdc-ripple-focus-opacity)}.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mat-mdc-slider .mdc-slider__thumb:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:var(--mdc-ripple-press-opacity)}.mat-mdc-slider .mdc-slider__thumb.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity)}.mat-mdc-slider .mdc-slider__track--active_fill{border-color:var(--mdc-slider-active-track-color)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__track--active_fill{border-color:var(--mdc-slider-disabled-active-track-color)}.mat-mdc-slider .mdc-slider__track--inactive{background-color:var(--mdc-slider-inactive-track-color);opacity:.24}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__track--inactive{background-color:var(--mdc-slider-disabled-inactive-track-color);opacity:.24}.mat-mdc-slider .mdc-slider__tick-mark--active{background-color:var(--mdc-slider-with-tick-marks-active-container-color);opacity:var(--mdc-slider-with-tick-marks-active-container-opacity)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__tick-mark--active{background-color:var(--mdc-slider-with-tick-marks-active-container-color);opacity:var(--mdc-slider-with-tick-marks-active-container-opacity)}.mat-mdc-slider .mdc-slider__tick-mark--inactive{background-color:var(--mdc-slider-with-tick-marks-inactive-container-color);opacity:var(--mdc-slider-with-tick-marks-inactive-container-opacity)}.mat-mdc-slider.mdc-slider--disabled .mdc-slider__tick-mark--inactive{background-color:var(--mdc-slider-with-tick-marks-disabled-container-color);opacity:var(--mdc-slider-with-tick-marks-inactive-container-opacity)}.mat-mdc-slider .mdc-slider__value-indicator{background-color:var(--mdc-slider-label-container-color);opacity:1}.mat-mdc-slider .mdc-slider__value-indicator::before{border-top-color:var(--mdc-slider-label-container-color)}.mat-mdc-slider .mdc-slider__value-indicator{color:var(--mdc-slider-label-label-text-color)}.mat-mdc-slider .mdc-slider__track{height:var(--mdc-slider-inactive-track-height)}.mat-mdc-slider .mdc-slider__track--active{height:var(--mdc-slider-active-track-height);top:calc((var(--mdc-slider-inactive-track-height) - var(--mdc-slider-active-track-height)) / 2)}.mat-mdc-slider .mdc-slider__track--active_fill{border-top-width:var(--mdc-slider-active-track-height)}.mat-mdc-slider .mdc-slider__track--inactive{height:var(--mdc-slider-inactive-track-height)}.mat-mdc-slider .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-mark--inactive{height:var(--mdc-slider-with-tick-marks-container-size);width:var(--mdc-slider-with-tick-marks-container-size)}.mat-mdc-slider.mdc-slider--disabled{opacity:0.38}.mat-mdc-slider .mdc-slider__value-indicator-text{letter-spacing:var(--mdc-slider-label-label-text-tracking);font-size:var(--mdc-slider-label-label-text-size);font-family:var(--mdc-slider-label-label-text-font);font-weight:var(--mdc-slider-label-label-text-weight);line-height:var(--mdc-slider-label-label-text-line-height)}.mat-mdc-slider .mdc-slider__track--active{border-radius:var(--mdc-slider-active-track-shape)}.mat-mdc-slider .mdc-slider__track--inactive{border-radius:var(--mdc-slider-inactive-track-shape)}.mat-mdc-slider .mdc-slider__thumb-knob{border-radius:var(--mdc-slider-handle-shape);width:var(--mdc-slider-handle-width);height:var(--mdc-slider-handle-height);border-style:solid;border-width:calc(var(--mdc-slider-handle-height) / 2) calc(var(--mdc-slider-handle-width) / 2)}.mat-mdc-slider .mdc-slider__tick-mark--active,.mat-mdc-slider .mdc-slider__tick-mark--inactive{border-radius:var(--mdc-slider-with-tick-marks-container-shape)}.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb-knob{background-color:var(--mdc-slider-hover-handle-color);border-color:var(--mdc-slider-hover-handle-color)}.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:hover .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb-knob{background-color:var(--mdc-slider-focus-handle-color);border-color:var(--mdc-slider-focus-handle-color)}.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--focused .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb:not(:disabled):active .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:#fff}.mat-mdc-slider .mdc-slider__thumb--top .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb:hover .mdc-slider__thumb-knob,.mat-mdc-slider .mdc-slider__thumb--top.mdc-slider__thumb--focused .mdc-slider__thumb-knob{border-color:var(--mdc-slider-with-overlap-handle-outline-color);border-width:var(--mdc-slider-with-overlap-handle-outline-width)}.mat-mdc-slider .mdc-slider__thumb-knob{box-shadow:var(--mdc-slider-handle-elevation)}.mat-mdc-slider .mdc-slider__input{box-sizing:content-box;pointer-events:auto}.mat-mdc-slider .mdc-slider__input.mat-mdc-slider-input-no-pointer-events{pointer-events:none}.mat-mdc-slider .mdc-slider__input.mat-slider__right-input{left:auto;right:0}.mat-mdc-slider .mdc-slider__thumb,.mat-mdc-slider .mdc-slider__track--active_fill{transition-duration:0ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill{transition-duration:80ms}.mat-mdc-slider.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider.mdc-slider--discrete .mdc-slider__track--active_fill{transition-duration:0ms}.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__thumb,.mat-mdc-slider.mat-mdc-slider-with-animation .mdc-slider__track--active_fill{transition-duration:80ms}.mat-mdc-slider .mdc-slider__track,.mat-mdc-slider .mdc-slider__thumb{pointer-events:none}.mat-mdc-slider .mdc-slider__value-indicator-container{transform:var(--mat-slider-value-indicator-container-transform)}.mat-mdc-slider .mdc-slider__value-indicator{width:var(--mat-slider-value-indicator-width);height:var(--mat-slider-value-indicator-height);padding:var(--mat-slider-value-indicator-padding);opacity:var(--mat-slider-value-indicator-opacity);border-radius:var(--mat-slider-value-indicator-border-radius)}.mat-mdc-slider .mdc-slider__value-indicator::before{display:var(--mat-slider-value-indicator-caret-display)}.mat-mdc-slider .mdc-slider__value-indicator-text{width:var(--mat-slider-value-indicator-width);transform:var(--mat-slider-value-indicator-text-transform)}.mat-mdc-slider .mat-ripple .mat-ripple-element{background-color:var(--mat-slider-ripple-color)}.mat-mdc-slider .mat-ripple .mat-mdc-slider-hover-ripple{background-color:var(--mat-slider-hover-state-layer-color)}.mat-mdc-slider .mat-ripple .mat-mdc-slider-focus-ripple,.mat-mdc-slider .mat-ripple .mat-mdc-slider-active-ripple{background-color:var(--mat-slider-focus-state-layer-color)}.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__thumb,.mat-mdc-slider._mat-animation-noopable.mdc-slider--discrete .mdc-slider__track--active_fill,.mat-mdc-slider._mat-animation-noopable .mdc-slider__value-indicator{transition:none}.mat-mdc-slider .mat-mdc-focus-indicator::before{border-radius:50%}.mat-mdc-slider .mdc-slider__value-indicator{word-break:normal}.mat-mdc-slider .mdc-slider__value-indicator-text{text-align:center}.mdc-slider__thumb--focused .mat-mdc-focus-indicator::before{content:""}']
    }]
  }], () => [{
    type: NgZone
  }, {
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: Directionality,
    decorators: [{
      type: Optional
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [MAT_RIPPLE_GLOBAL_OPTIONS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [ANIMATION_MODULE_TYPE]
    }]
  }], {
    _trackActive: [{
      type: ViewChild,
      args: ["trackActive"]
    }],
    _thumbs: [{
      type: ViewChildren,
      args: [MAT_SLIDER_VISUAL_THUMB]
    }],
    _input: [{
      type: ContentChild,
      args: [MAT_SLIDER_THUMB]
    }],
    _inputs: [{
      type: ContentChildren,
      args: [MAT_SLIDER_RANGE_THUMB, {
        descendants: false
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    discrete: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    showTickMarks: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    min: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    color: [{
      type: Input
    }],
    disableRipple: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    max: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    step: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    displayWith: [{
      type: Input
    }]
  });
})();
function _validateInputs(isRange, endInputElement, startInputElement) {
  const startValid = !isRange || startInputElement?._hostElement.hasAttribute("matSliderStartThumb");
  const endValid = endInputElement._hostElement.hasAttribute(isRange ? "matSliderEndThumb" : "matSliderThumb");
  if (!startValid || !endValid) {
    _throwInvalidInputConfigurationError();
  }
}
function _throwInvalidInputConfigurationError() {
  throw Error(`Invalid slider thumb input configuration!

   Valid configurations are as follows:

     <mat-slider>
       <input matSliderThumb>
     </mat-slider>

     or

     <mat-slider>
       <input matSliderStartThumb>
       <input matSliderEndThumb>
     </mat-slider>
   `);
}
var MAT_SLIDER_THUMB_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MatSliderThumb),
  multi: true
};
var MAT_SLIDER_RANGE_THUMB_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MatSliderRangeThumb),
  multi: true
};
var MatSliderThumb = class _MatSliderThumb {
  get value() {
    return numberAttribute(this._hostElement.value, 0);
  }
  set value(value) {
    value = isNaN(value) ? 0 : value;
    const stringValue = value + "";
    if (!this._hasSetInitialValue) {
      this._initialValue = stringValue;
      return;
    }
    if (this._isActive) {
      return;
    }
    this._setValue(stringValue);
  }
  /**
   * Handles programmatic value setting. This has been split out to
   * allow the range thumb to override it and add additional necessary logic.
   */
  _setValue(value) {
    this._hostElement.value = value;
    this._updateThumbUIByValue();
    this._slider._onValueChange(this);
    this._cdr.detectChanges();
    this._slider._cdr.markForCheck();
  }
  /**
   * The current translateX in px of the slider visual thumb.
   * @docs-private
   */
  get translateX() {
    if (this._slider.min >= this._slider.max) {
      this._translateX = this._tickMarkOffset;
      return this._translateX;
    }
    if (this._translateX === void 0) {
      this._translateX = this._calcTranslateXByValue();
    }
    return this._translateX;
  }
  set translateX(v) {
    this._translateX = v;
  }
  /** @docs-private */
  get min() {
    return numberAttribute(this._hostElement.min, 0);
  }
  set min(v) {
    this._hostElement.min = v + "";
    this._cdr.detectChanges();
  }
  /** @docs-private */
  get max() {
    return numberAttribute(this._hostElement.max, 0);
  }
  set max(v) {
    this._hostElement.max = v + "";
    this._cdr.detectChanges();
  }
  get step() {
    return numberAttribute(this._hostElement.step, 0);
  }
  set step(v) {
    this._hostElement.step = v + "";
    this._cdr.detectChanges();
  }
  /** @docs-private */
  get disabled() {
    return booleanAttribute(this._hostElement.disabled);
  }
  set disabled(v) {
    this._hostElement.disabled = v;
    this._cdr.detectChanges();
    if (this._slider.disabled !== this.disabled) {
      this._slider.disabled = this.disabled;
    }
  }
  /** The percentage of the slider that coincides with the value. */
  get percentage() {
    if (this._slider.min >= this._slider.max) {
      return this._slider._isRtl ? 1 : 0;
    }
    return (this.value - this._slider.min) / (this._slider.max - this._slider.min);
  }
  /** @docs-private */
  get fillPercentage() {
    if (!this._slider._cachedWidth) {
      return this._slider._isRtl ? 1 : 0;
    }
    if (this._translateX === 0) {
      return 0;
    }
    return this.translateX / this._slider._cachedWidth;
  }
  /** Used to relay updates to _isFocused to the slider visual thumbs. */
  _setIsFocused(v) {
    this._isFocused = v;
  }
  constructor(_ngZone, _elementRef, _cdr, _slider) {
    this._ngZone = _ngZone;
    this._elementRef = _elementRef;
    this._cdr = _cdr;
    this._slider = _slider;
    this.valueChange = new EventEmitter();
    this.dragStart = new EventEmitter();
    this.dragEnd = new EventEmitter();
    this.thumbPosition = _MatThumb.END;
    this._valuetext = signal("");
    this._knobRadius = 8;
    this._tickMarkOffset = 3;
    this._isActive = false;
    this._isFocused = false;
    this._hasSetInitialValue = false;
    this._destroyed = new Subject();
    this._skipUIUpdate = false;
    this._onTouchedFn = () => {
    };
    this._isControlInitialized = false;
    this._platform = inject(Platform);
    this._hostElement = _elementRef.nativeElement;
    this._ngZone.runOutsideAngular(() => {
      this._hostElement.addEventListener("pointerdown", this._onPointerDown.bind(this));
      this._hostElement.addEventListener("pointermove", this._onPointerMove.bind(this));
      this._hostElement.addEventListener("pointerup", this._onPointerUp.bind(this));
    });
  }
  ngOnDestroy() {
    this._hostElement.removeEventListener("pointerdown", this._onPointerDown);
    this._hostElement.removeEventListener("pointermove", this._onPointerMove);
    this._hostElement.removeEventListener("pointerup", this._onPointerUp);
    this._destroyed.next();
    this._destroyed.complete();
    this.dragStart.complete();
    this.dragEnd.complete();
  }
  /** @docs-private */
  initProps() {
    this._updateWidthInactive();
    if (this.disabled !== this._slider.disabled) {
      this._slider.disabled = true;
    }
    this.step = this._slider.step;
    this.min = this._slider.min;
    this.max = this._slider.max;
    this._initValue();
  }
  /** @docs-private */
  initUI() {
    this._updateThumbUIByValue();
  }
  _initValue() {
    this._hasSetInitialValue = true;
    if (this._initialValue === void 0) {
      this.value = this._getDefaultValue();
    } else {
      this._hostElement.value = this._initialValue;
      this._updateThumbUIByValue();
      this._slider._onValueChange(this);
      this._cdr.detectChanges();
    }
  }
  _getDefaultValue() {
    return this.min;
  }
  _onBlur() {
    this._setIsFocused(false);
    this._onTouchedFn();
  }
  _onFocus() {
    this._slider._setTransition(false);
    this._slider._updateTrackUI(this);
    this._setIsFocused(true);
  }
  _onChange() {
    this.valueChange.emit(this.value);
    if (this._isActive) {
      this._updateThumbUIByValue({
        withAnimation: true
      });
    }
  }
  _onInput() {
    this._onChangeFn?.(this.value);
    if (this._slider.step || !this._isActive) {
      this._updateThumbUIByValue({
        withAnimation: true
      });
    }
    this._slider._onValueChange(this);
  }
  _onNgControlValueChange() {
    if (!this._isActive || !this._isFocused) {
      this._slider._onValueChange(this);
      this._updateThumbUIByValue();
    }
    this._slider.disabled = this._formControl.disabled;
  }
  _onPointerDown(event) {
    if (this.disabled || event.button !== 0) {
      return;
    }
    if (this._platform.IOS) {
      const isCursorOnSliderThumb = this._slider._isCursorOnSliderThumb(event, this._slider._getThumb(this.thumbPosition)._hostElement.getBoundingClientRect());
      this._isActive = isCursorOnSliderThumb;
      this._updateWidthActive();
      this._slider._updateDimensions();
      return;
    }
    this._isActive = true;
    this._setIsFocused(true);
    this._updateWidthActive();
    this._slider._updateDimensions();
    if (!this._slider.step) {
      this._updateThumbUIByPointerEvent(event, {
        withAnimation: true
      });
    }
    if (!this.disabled) {
      this._handleValueCorrection(event);
      this.dragStart.emit({
        source: this,
        parent: this._slider,
        value: this.value
      });
    }
  }
  /**
   * Corrects the value of the slider on pointer up/down.
   *
   * Called on pointer down and up because the value is set based
   * on the inactive width instead of the active width.
   */
  _handleValueCorrection(event) {
    this._skipUIUpdate = true;
    setTimeout(() => {
      this._skipUIUpdate = false;
      this._fixValue(event);
    }, 0);
  }
  /** Corrects the value of the slider based on the pointer event's position. */
  _fixValue(event) {
    const xPos = event.clientX - this._slider._cachedLeft;
    const width = this._slider._cachedWidth;
    const step = this._slider.step === 0 ? 1 : this._slider.step;
    const numSteps = Math.floor((this._slider.max - this._slider.min) / step);
    const percentage = this._slider._isRtl ? 1 - xPos / width : xPos / width;
    const fixedPercentage = Math.round(percentage * numSteps) / numSteps;
    const impreciseValue = fixedPercentage * (this._slider.max - this._slider.min) + this._slider.min;
    const value = Math.round(impreciseValue / step) * step;
    const prevValue = this.value;
    if (value === prevValue) {
      this._slider._onValueChange(this);
      this._slider.step > 0 ? this._updateThumbUIByValue() : this._updateThumbUIByPointerEvent(event, {
        withAnimation: this._slider._hasAnimation
      });
      return;
    }
    this.value = value;
    this.valueChange.emit(this.value);
    this._onChangeFn?.(this.value);
    this._slider._onValueChange(this);
    this._slider.step > 0 ? this._updateThumbUIByValue() : this._updateThumbUIByPointerEvent(event, {
      withAnimation: this._slider._hasAnimation
    });
  }
  _onPointerMove(event) {
    if (!this._slider.step && this._isActive) {
      this._updateThumbUIByPointerEvent(event);
    }
  }
  _onPointerUp() {
    if (this._isActive) {
      this._isActive = false;
      if (this._platform.SAFARI) {
        this._setIsFocused(false);
      }
      this.dragEnd.emit({
        source: this,
        parent: this._slider,
        value: this.value
      });
      setTimeout(() => this._updateWidthInactive(), this._platform.IOS ? 10 : 0);
    }
  }
  _clamp(v) {
    const min = this._tickMarkOffset;
    const max = this._slider._cachedWidth - this._tickMarkOffset;
    return Math.max(Math.min(v, max), min);
  }
  _calcTranslateXByValue() {
    if (this._slider._isRtl) {
      return (1 - this.percentage) * (this._slider._cachedWidth - this._tickMarkOffset * 2) + this._tickMarkOffset;
    }
    return this.percentage * (this._slider._cachedWidth - this._tickMarkOffset * 2) + this._tickMarkOffset;
  }
  _calcTranslateXByPointerEvent(event) {
    return event.clientX - this._slider._cachedLeft;
  }
  /**
   * Used to set the slider width to the correct
   * dimensions while the user is dragging.
   */
  _updateWidthActive() {
  }
  /**
   * Sets the slider input to disproportionate dimensions to allow for touch
   * events to be captured on touch devices.
   */
  _updateWidthInactive() {
    this._hostElement.style.padding = `0 ${this._slider._inputPadding}px`;
    this._hostElement.style.width = `calc(100% + ${this._slider._inputPadding - this._tickMarkOffset * 2}px)`;
    this._hostElement.style.left = `-${this._slider._rippleRadius - this._tickMarkOffset}px`;
  }
  _updateThumbUIByValue(options) {
    this.translateX = this._clamp(this._calcTranslateXByValue());
    this._updateThumbUI(options);
  }
  _updateThumbUIByPointerEvent(event, options) {
    this.translateX = this._clamp(this._calcTranslateXByPointerEvent(event));
    this._updateThumbUI(options);
  }
  _updateThumbUI(options) {
    this._slider._setTransition(!!options?.withAnimation);
    this._slider._onTranslateXChange(this);
  }
  /**
   * Sets the input's value.
   * @param value The new value of the input
   * @docs-private
   */
  writeValue(value) {
    if (this._isControlInitialized || value !== null) {
      this.value = value;
    }
  }
  /**
   * Registers a callback to be invoked when the input's value changes from user input.
   * @param fn The callback to register
   * @docs-private
   */
  registerOnChange(fn) {
    this._onChangeFn = fn;
    this._isControlInitialized = true;
  }
  /**
   * Registers a callback to be invoked when the input is blurred by the user.
   * @param fn The callback to register
   * @docs-private
   */
  registerOnTouched(fn) {
    this._onTouchedFn = fn;
  }
  /**
   * Sets the disabled state of the slider.
   * @param isDisabled The new disabled state
   * @docs-private
   */
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
  }
  focus() {
    this._hostElement.focus();
  }
  blur() {
    this._hostElement.blur();
  }
  static {
    this.\u0275fac = function MatSliderThumb_Factory(t) {
      return new (t || _MatSliderThumb)(\u0275\u0275directiveInject(NgZone), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(MAT_SLIDER));
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _MatSliderThumb,
      selectors: [["input", "matSliderThumb", ""]],
      hostAttrs: ["type", "range", 1, "mdc-slider__input"],
      hostVars: 1,
      hostBindings: function MatSliderThumb_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("change", function MatSliderThumb_change_HostBindingHandler() {
            return ctx._onChange();
          })("input", function MatSliderThumb_input_HostBindingHandler() {
            return ctx._onInput();
          })("blur", function MatSliderThumb_blur_HostBindingHandler() {
            return ctx._onBlur();
          })("focus", function MatSliderThumb_focus_HostBindingHandler() {
            return ctx._onFocus();
          });
        }
        if (rf & 2) {
          \u0275\u0275attribute("aria-valuetext", ctx._valuetext());
        }
      },
      inputs: {
        value: [InputFlags.HasDecoratorInputTransform, "value", "value", numberAttribute]
      },
      outputs: {
        valueChange: "valueChange",
        dragStart: "dragStart",
        dragEnd: "dragEnd"
      },
      exportAs: ["matSliderThumb"],
      standalone: true,
      features: [\u0275\u0275ProvidersFeature([MAT_SLIDER_THUMB_VALUE_ACCESSOR, {
        provide: MAT_SLIDER_THUMB,
        useExisting: _MatSliderThumb
      }]), \u0275\u0275InputTransformsFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSliderThumb, [{
    type: Directive,
    args: [{
      selector: "input[matSliderThumb]",
      exportAs: "matSliderThumb",
      host: {
        "class": "mdc-slider__input",
        "type": "range",
        "[attr.aria-valuetext]": "_valuetext()",
        "(change)": "_onChange()",
        "(input)": "_onInput()",
        // TODO(wagnermaciel): Consider using a global event listener instead.
        // Reason: I have found a semi-consistent way to mouse up without triggering this event.
        "(blur)": "_onBlur()",
        "(focus)": "_onFocus()"
      },
      providers: [MAT_SLIDER_THUMB_VALUE_ACCESSOR, {
        provide: MAT_SLIDER_THUMB,
        useExisting: MatSliderThumb
      }],
      standalone: true
    }]
  }], () => [{
    type: NgZone
  }, {
    type: ElementRef
  }, {
    type: ChangeDetectorRef
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [MAT_SLIDER]
    }]
  }], {
    value: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    valueChange: [{
      type: Output
    }],
    dragStart: [{
      type: Output
    }],
    dragEnd: [{
      type: Output
    }]
  });
})();
var MatSliderRangeThumb = class _MatSliderRangeThumb extends MatSliderThumb {
  /** @docs-private */
  getSibling() {
    if (!this._sibling) {
      this._sibling = this._slider._getInput(this._isEndThumb ? _MatThumb.START : _MatThumb.END);
    }
    return this._sibling;
  }
  /**
   * Returns the minimum translateX position allowed for this slider input's visual thumb.
   * @docs-private
   */
  getMinPos() {
    const sibling = this.getSibling();
    if (!this._isLeftThumb && sibling) {
      return sibling.translateX;
    }
    return this._tickMarkOffset;
  }
  /**
   * Returns the maximum translateX position allowed for this slider input's visual thumb.
   * @docs-private
   */
  getMaxPos() {
    const sibling = this.getSibling();
    if (this._isLeftThumb && sibling) {
      return sibling.translateX;
    }
    return this._slider._cachedWidth - this._tickMarkOffset;
  }
  _setIsLeftThumb() {
    this._isLeftThumb = this._isEndThumb && this._slider._isRtl || !this._isEndThumb && !this._slider._isRtl;
  }
  constructor(_ngZone, _slider, _elementRef, _cdr) {
    super(_ngZone, _elementRef, _cdr, _slider);
    this._cdr = _cdr;
    this._isEndThumb = this._hostElement.hasAttribute("matSliderEndThumb");
    this._setIsLeftThumb();
    this.thumbPosition = this._isEndThumb ? _MatThumb.END : _MatThumb.START;
  }
  _getDefaultValue() {
    return this._isEndThumb && this._slider._isRange ? this.max : this.min;
  }
  _onInput() {
    super._onInput();
    this._updateSibling();
    if (!this._isActive) {
      this._updateWidthInactive();
    }
  }
  _onNgControlValueChange() {
    super._onNgControlValueChange();
    this.getSibling()?._updateMinMax();
  }
  _onPointerDown(event) {
    if (this.disabled || event.button !== 0) {
      return;
    }
    if (this._sibling) {
      this._sibling._updateWidthActive();
      this._sibling._hostElement.classList.add("mat-mdc-slider-input-no-pointer-events");
    }
    super._onPointerDown(event);
  }
  _onPointerUp() {
    super._onPointerUp();
    if (this._sibling) {
      setTimeout(() => {
        this._sibling._updateWidthInactive();
        this._sibling._hostElement.classList.remove("mat-mdc-slider-input-no-pointer-events");
      });
    }
  }
  _onPointerMove(event) {
    super._onPointerMove(event);
    if (!this._slider.step && this._isActive) {
      this._updateSibling();
    }
  }
  _fixValue(event) {
    super._fixValue(event);
    this._sibling?._updateMinMax();
  }
  _clamp(v) {
    return Math.max(Math.min(v, this.getMaxPos()), this.getMinPos());
  }
  _updateMinMax() {
    const sibling = this.getSibling();
    if (!sibling) {
      return;
    }
    if (this._isEndThumb) {
      this.min = Math.max(this._slider.min, sibling.value);
      this.max = this._slider.max;
    } else {
      this.min = this._slider.min;
      this.max = Math.min(this._slider.max, sibling.value);
    }
  }
  _updateWidthActive() {
    const minWidth = this._slider._rippleRadius * 2 - this._slider._inputPadding * 2;
    const maxWidth = this._slider._cachedWidth + this._slider._inputPadding - minWidth - this._tickMarkOffset * 2;
    const percentage = this._slider.min < this._slider.max ? (this.max - this.min) / (this._slider.max - this._slider.min) : 1;
    const width = maxWidth * percentage + minWidth;
    this._hostElement.style.width = `${width}px`;
    this._hostElement.style.padding = `0 ${this._slider._inputPadding}px`;
  }
  _updateWidthInactive() {
    const sibling = this.getSibling();
    if (!sibling) {
      return;
    }
    const maxWidth = this._slider._cachedWidth - this._tickMarkOffset * 2;
    const midValue = this._isEndThumb ? this.value - (this.value - sibling.value) / 2 : this.value + (sibling.value - this.value) / 2;
    const _percentage = this._isEndThumb ? (this.max - midValue) / (this._slider.max - this._slider.min) : (midValue - this.min) / (this._slider.max - this._slider.min);
    const percentage = this._slider.min < this._slider.max ? _percentage : 1;
    let ripplePadding = this._slider._rippleRadius;
    if (percentage === 1) {
      ripplePadding = 48;
    } else if (percentage === 0) {
      ripplePadding = 0;
    }
    const width = maxWidth * percentage + ripplePadding;
    this._hostElement.style.width = `${width}px`;
    this._hostElement.style.padding = "0px";
    if (this._isLeftThumb) {
      this._hostElement.style.left = `-${this._slider._rippleRadius - this._tickMarkOffset}px`;
      this._hostElement.style.right = "auto";
    } else {
      this._hostElement.style.left = "auto";
      this._hostElement.style.right = `-${this._slider._rippleRadius - this._tickMarkOffset}px`;
    }
  }
  _updateStaticStyles() {
    this._hostElement.classList.toggle("mat-slider__right-input", !this._isLeftThumb);
  }
  _updateSibling() {
    const sibling = this.getSibling();
    if (!sibling) {
      return;
    }
    sibling._updateMinMax();
    if (this._isActive) {
      sibling._updateWidthActive();
    } else {
      sibling._updateWidthInactive();
    }
  }
  /**
   * Sets the input's value.
   * @param value The new value of the input
   * @docs-private
   */
  writeValue(value) {
    if (this._isControlInitialized || value !== null) {
      this.value = value;
      this._updateWidthInactive();
      this._updateSibling();
    }
  }
  _setValue(value) {
    super._setValue(value);
    this._updateWidthInactive();
    this._updateSibling();
  }
  static {
    this.\u0275fac = function MatSliderRangeThumb_Factory(t) {
      return new (t || _MatSliderRangeThumb)(\u0275\u0275directiveInject(NgZone), \u0275\u0275directiveInject(MAT_SLIDER), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(ChangeDetectorRef));
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _MatSliderRangeThumb,
      selectors: [["input", "matSliderStartThumb", ""], ["input", "matSliderEndThumb", ""]],
      exportAs: ["matSliderRangeThumb"],
      standalone: true,
      features: [\u0275\u0275ProvidersFeature([MAT_SLIDER_RANGE_THUMB_VALUE_ACCESSOR, {
        provide: MAT_SLIDER_RANGE_THUMB,
        useExisting: _MatSliderRangeThumb
      }]), \u0275\u0275InheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSliderRangeThumb, [{
    type: Directive,
    args: [{
      selector: "input[matSliderStartThumb], input[matSliderEndThumb]",
      exportAs: "matSliderRangeThumb",
      providers: [MAT_SLIDER_RANGE_THUMB_VALUE_ACCESSOR, {
        provide: MAT_SLIDER_RANGE_THUMB,
        useExisting: MatSliderRangeThumb
      }],
      standalone: true
    }]
  }], () => [{
    type: NgZone
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [MAT_SLIDER]
    }]
  }, {
    type: ElementRef
  }, {
    type: ChangeDetectorRef
  }], null);
})();
var MatSliderModule = class _MatSliderModule {
  static {
    this.\u0275fac = function MatSliderModule_Factory(t) {
      return new (t || _MatSliderModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
      type: _MatSliderModule
    });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
      imports: [MatCommonModule, MatRippleModule]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSliderModule, [{
    type: NgModule,
    args: [{
      imports: [MatCommonModule, MatRippleModule, MatSlider, MatSliderThumb, MatSliderRangeThumb, MatSliderVisualThumb],
      exports: [MatSlider, MatSliderThumb, MatSliderRangeThumb]
    }]
  }], null, null);
})();

// src/app/features/dashboard/dashboard.component.ts
var _forTrack0 = ($index, $item) => $item.room.id;
var _forTrack1 = ($index, $item) => $item.id;
var _forTrack2 = ($index, $item) => $item.risk_id;
function DashboardComponent_Conditional_29_For_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-chip", 14);
    \u0275\u0275listener("click", function DashboardComponent_Conditional_29_For_7_Template_mat_chip_click_0_listener() {
      const room_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectRoom(room_r4.id));
    });
    \u0275\u0275elementStart(1, "mat-icon", 15);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const room_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("selected", ctx_r1.selectedRoomId === room_r4.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(room_r4.icon || "meeting_room");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", room_r4.name, " ");
  }
}
function DashboardComponent_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "mat-chip-set")(2, "mat-chip", 14);
    \u0275\u0275listener("click", function DashboardComponent_Conditional_29_Template_mat_chip_click_2_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.selectRoom(null));
    });
    \u0275\u0275elementStart(3, "mat-icon", 15);
    \u0275\u0275text(4, "home");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " Toutes les pieces ");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(6, DashboardComponent_Conditional_29_For_7_Template, 4, 4, "mat-chip", 16, _forTrack1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275classProp("selected", ctx_r1.selectedRoomId === null);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r1.rooms);
  }
}
function DashboardComponent_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-progress-bar", 11);
  }
}
function DashboardComponent_For_32_For_10_Conditional_0_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", device_r5.state.temperature, "\xB0C");
  }
}
function DashboardComponent_For_32_For_10_Conditional_0_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 28);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(device_r5.state.condition || device_r5.state.description || device_r5.state.weather_desc);
  }
}
function DashboardComponent_For_32_For_10_Conditional_0_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "mat-icon");
    \u0275\u0275text(2, "water_drop");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", device_r5.state.humidity, "%");
  }
}
function DashboardComponent_For_32_For_10_Conditional_0_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "mat-icon");
    \u0275\u0275text(2, "air");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", device_r5.state.wind_speed, " km/h");
  }
}
function DashboardComponent_For_32_For_10_Conditional_0_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "mat-icon");
    \u0275\u0275text(2, "compress");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", device_r5.state.pressure, " hPa");
  }
}
function DashboardComponent_For_32_For_10_Conditional_0_Conditional_16_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "mat-icon");
    \u0275\u0275text(2, "wb_twilight");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext(3).$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(device_r5.state.sunrise);
  }
}
function DashboardComponent_For_32_For_10_Conditional_0_Conditional_16_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "mat-icon");
    \u0275\u0275text(2, "nights_stay");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext(3).$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(device_r5.state.sunset);
  }
}
function DashboardComponent_For_32_For_10_Conditional_0_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31);
    \u0275\u0275template(1, DashboardComponent_For_32_For_10_Conditional_0_Conditional_16_Conditional_1_Template, 5, 1, "div", 30)(2, DashboardComponent_For_32_For_10_Conditional_0_Conditional_16_Conditional_2_Template, 5, 1, "div", 30);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275conditional(1, (device_r5.state == null ? null : device_r5.state.sunrise) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(2, (device_r5.state == null ? null : device_r5.state.sunset) ? 2 : -1);
  }
}
function DashboardComponent_For_32_For_10_Conditional_0_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 33);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(device_r5.state.season);
  }
}
function DashboardComponent_For_32_For_10_Conditional_0_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 34);
    \u0275\u0275text(1, "Weekend");
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_For_32_For_10_Conditional_0_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 35);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(device_r5.state.school_holiday);
  }
}
function DashboardComponent_For_32_For_10_Conditional_0_Conditional_21_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 40);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const alert_r6 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(alert_r6.risk_name);
  }
}
function DashboardComponent_For_32_For_10_Conditional_0_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 37)(1, "mat-icon");
    \u0275\u0275text(2, "warning");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 38)(4, "span", 39);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(6, DashboardComponent_For_32_For_10_Conditional_0_Conditional_21_For_7_Template, 2, 1, "span", 40, _forTrack2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275styleProp("border-color", ctx_r1.getWeatherVigilanceColor(device_r5));
    \u0275\u0275advance();
    \u0275\u0275styleProp("color", ctx_r1.getWeatherVigilanceColor(device_r5));
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("color", ctx_r1.getWeatherVigilanceColor(device_r5));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" Vigilance ", device_r5.state.vigilance.color, " ");
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.getWeatherVigilanceAlerts(device_r5));
  }
}
function DashboardComponent_For_32_For_10_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "div", 21)(2, "div", 22)(3, "mat-icon");
    \u0275\u0275text(4, "cloud");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 23)(6, "span", 24);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 25)(9, "div", 26);
    \u0275\u0275template(10, DashboardComponent_For_32_For_10_Conditional_0_Conditional_10_Template, 2, 1, "span", 27)(11, DashboardComponent_For_32_For_10_Conditional_0_Conditional_11_Template, 2, 1, "span", 28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 29);
    \u0275\u0275template(13, DashboardComponent_For_32_For_10_Conditional_0_Conditional_13_Template, 5, 1, "div", 30)(14, DashboardComponent_For_32_For_10_Conditional_0_Conditional_14_Template, 5, 1, "div", 30)(15, DashboardComponent_For_32_For_10_Conditional_0_Conditional_15_Template, 5, 1, "div", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275template(16, DashboardComponent_For_32_For_10_Conditional_0_Conditional_16_Template, 3, 2, "div", 31);
    \u0275\u0275elementStart(17, "div", 32);
    \u0275\u0275template(18, DashboardComponent_For_32_For_10_Conditional_0_Conditional_18_Template, 2, 1, "span", 33)(19, DashboardComponent_For_32_For_10_Conditional_0_Conditional_19_Template, 2, 0, "span", 34)(20, DashboardComponent_For_32_For_10_Conditional_0_Conditional_20_Template, 2, 1, "span", 35);
    \u0275\u0275elementEnd();
    \u0275\u0275template(21, DashboardComponent_For_32_For_10_Conditional_0_Conditional_21_Template, 8, 7, "div", 36);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(device_r5.name);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(10, (device_r5.state == null ? null : device_r5.state.temperature) !== void 0 ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(11, (device_r5.state == null ? null : device_r5.state.condition) || (device_r5.state == null ? null : device_r5.state.description) || (device_r5.state == null ? null : device_r5.state.weather_desc) ? 11 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(13, (device_r5.state == null ? null : device_r5.state.humidity) !== void 0 ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(14, (device_r5.state == null ? null : device_r5.state.wind_speed) !== void 0 ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(15, (device_r5.state == null ? null : device_r5.state.pressure) !== void 0 ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(16, (device_r5.state == null ? null : device_r5.state.sunrise) || (device_r5.state == null ? null : device_r5.state.sunset) ? 16 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(18, (device_r5.state == null ? null : device_r5.state.season) ? 18 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(19, (device_r5.state == null ? null : device_r5.state.is_weekend) ? 19 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(20, (device_r5.state == null ? null : device_r5.state.is_school_holiday) ? 20 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(21, (device_r5.state == null ? null : device_r5.state.vigilance) && device_r5.state.vigilance.level >= 2 ? 21 : -1);
  }
}
function DashboardComponent_For_32_For_10_Conditional_1_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 52)(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 53);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r1.getBatteryClass(ctx_r1.getBatteryLevel(device_r5)));
    \u0275\u0275property("matTooltip", "Batterie " + ctx_r1.getBatteryLevel(device_r5) + "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getBatteryIcon(ctx_r1.getBatteryLevel(device_r5)));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r1.getBatteryLevel(device_r5), "%");
  }
}
function DashboardComponent_For_32_For_10_Conditional_1_Conditional_9_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 54);
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("src", ctx_r1.getCameraStreamUrl(device_r5), \u0275\u0275sanitizeUrl);
  }
}
function DashboardComponent_For_32_For_10_Conditional_1_Conditional_9_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 56)(1, "mat-icon");
    \u0275\u0275text(2, "videocam");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "small");
    \u0275\u0275text(6, "Ajouter stream_url dans la configuration de l'appareil");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.isDeviceOn(device_r5) ? "Flux non configure" : "Camera hors ligne");
  }
}
function DashboardComponent_For_32_For_10_Conditional_1_Conditional_9_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 55);
    \u0275\u0275element(1, "span", 57);
    \u0275\u0275text(2, " REC ");
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_For_32_For_10_Conditional_1_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 44);
    \u0275\u0275template(1, DashboardComponent_For_32_For_10_Conditional_1_Conditional_9_Conditional_1_Template, 1, 1, "img", 54)(2, DashboardComponent_For_32_For_10_Conditional_1_Conditional_9_Conditional_2_Template, 7, 1)(3, DashboardComponent_For_32_For_10_Conditional_1_Conditional_9_Conditional_3_Template, 3, 0, "div", 55);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(1, ctx_r1.getCameraStreamUrl(device_r5) ? 1 : 2);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(3, (device_r5.state == null ? null : device_r5.state.recording) ? 3 : -1);
  }
}
function DashboardComponent_For_32_For_10_Conditional_1_Conditional_13_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 58);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const detail_r7 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(detail_r7);
  }
}
function DashboardComponent_For_32_For_10_Conditional_1_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47);
    \u0275\u0275repeaterCreate(1, DashboardComponent_For_32_For_10_Conditional_1_Conditional_13_For_2_Template, 2, 1, "span", 58, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.getStateDetails(device_r5));
  }
}
function DashboardComponent_For_32_For_10_Conditional_1_Conditional_14_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 59)(1, "mat-icon");
    \u0275\u0275text(2, "warning");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Aucun capteur de temperature. Configurez un capteur lie ou ajoutez un capteur dans la piece.");
    \u0275\u0275elementEnd()();
  }
}
function DashboardComponent_For_32_For_10_Conditional_1_Conditional_14_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 60)(1, "mat-icon");
    \u0275\u0275text(2, "local_fire_department");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Chauffage actif");
    \u0275\u0275elementEnd()();
  }
}
function DashboardComponent_For_32_For_10_Conditional_1_Conditional_14_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 67)(1, "mat-icon");
    \u0275\u0275text(2, "sensors");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.getThermostatTempSource(device_r5));
  }
}
function DashboardComponent_For_32_For_10_Conditional_1_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 48);
    \u0275\u0275template(1, DashboardComponent_For_32_For_10_Conditional_1_Conditional_14_Conditional_1_Template, 5, 0, "div", 59)(2, DashboardComponent_For_32_For_10_Conditional_1_Conditional_14_Conditional_2_Template, 5, 0, "div", 60);
    \u0275\u0275elementStart(3, "div", 61)(4, "button", 62);
    \u0275\u0275listener("click", function DashboardComponent_For_32_For_10_Conditional_1_Conditional_14_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r8);
      const device_r5 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.adjustTemp(device_r5, -0.5));
    });
    \u0275\u0275elementStart(5, "mat-icon");
    \u0275\u0275text(6, "remove");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 63)(8, "span", 64);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span", 65);
    \u0275\u0275text(11, "Consigne");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "button", 66);
    \u0275\u0275listener("click", function DashboardComponent_For_32_For_10_Conditional_1_Conditional_14_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r8);
      const device_r5 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.adjustTemp(device_r5, 0.5));
    });
    \u0275\u0275elementStart(13, "mat-icon");
    \u0275\u0275text(14, "add");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(15, DashboardComponent_For_32_For_10_Conditional_1_Conditional_14_Conditional_15_Template, 5, 1, "div", 67);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(1, ctx_r1.hasThermostatTempWarning(device_r5) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(2, (device_r5.state == null ? null : device_r5.state.heating) === true ? 2 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("", ctx_r1.getTargetTemp(device_r5), "\xB0C");
    \u0275\u0275advance(6);
    \u0275\u0275conditional(15, ctx_r1.getThermostatTempSource(device_r5) ? 15 : -1);
  }
}
function DashboardComponent_For_32_For_10_Conditional_1_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 49)(1, "div", 68)(2, "mat-icon", 69);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "mat-slider", 70)(5, "input", 71);
    \u0275\u0275listener("valueChange", function DashboardComponent_For_32_For_10_Conditional_1_Conditional_15_Template_input_valueChange_5_listener($event) {
      \u0275\u0275restoreView(_r9);
      const device_r5 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onCoverPositionChange(device_r5, $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "span", 72);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 73)(9, "button", 74);
    \u0275\u0275listener("click", function DashboardComponent_For_32_For_10_Conditional_1_Conditional_15_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r9);
      const device_r5 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setCoverPreset(device_r5, 0));
    });
    \u0275\u0275elementStart(10, "mat-icon");
    \u0275\u0275text(11, "vertical_align_bottom");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "button", 75);
    \u0275\u0275listener("click", function DashboardComponent_For_32_For_10_Conditional_1_Conditional_15_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r9);
      const device_r5 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setCoverPreset(device_r5, 50));
    });
    \u0275\u0275elementStart(13, "mat-icon");
    \u0275\u0275text(14, "unfold_more");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "button", 76);
    \u0275\u0275listener("click", function DashboardComponent_For_32_For_10_Conditional_1_Conditional_15_Template_button_click_15_listener() {
      \u0275\u0275restoreView(_r9);
      const device_r5 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setCoverPreset(device_r5, 100));
    });
    \u0275\u0275elementStart(16, "mat-icon");
    \u0275\u0275text(17, "vertical_align_top");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.getCoverPosition(device_r5) > 0 ? "blinds" : "blinds_closed");
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r1.getCoverPosition(device_r5));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r1.getCoverPosition(device_r5), "%");
  }
}
function DashboardComponent_For_32_For_10_Conditional_1_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 77);
    \u0275\u0275listener("click", function DashboardComponent_For_32_For_10_Conditional_1_Conditional_17_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const device_r5 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleDevice(device_r5));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("on", ctx_r1.isDeviceOn(device_r5))("toggling", ctx_r1.togglingDeviceIds.has(device_r5.id));
    \u0275\u0275property("matTooltip", ctx_r1.getToggleTooltip(device_r5))("disabled", ctx_r1.togglingDeviceIds.has(device_r5.id));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getToggleIcon(device_r5));
  }
}
function DashboardComponent_For_32_For_10_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41)(1, "div", 21)(2, "div", 42)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 23)(6, "span", 24);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(8, DashboardComponent_For_32_For_10_Conditional_1_Conditional_8_Template, 5, 5, "div", 43);
    \u0275\u0275elementEnd();
    \u0275\u0275template(9, DashboardComponent_For_32_For_10_Conditional_1_Conditional_9_Template, 4, 2, "div", 44);
    \u0275\u0275elementStart(10, "div", 45)(11, "span", 46);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275template(13, DashboardComponent_For_32_For_10_Conditional_1_Conditional_13_Template, 3, 0, "div", 47);
    \u0275\u0275elementEnd();
    \u0275\u0275template(14, DashboardComponent_For_32_For_10_Conditional_1_Conditional_14_Template, 16, 4, "div", 48)(15, DashboardComponent_For_32_For_10_Conditional_1_Conditional_15_Template, 18, 3, "div", 49);
    \u0275\u0275elementStart(16, "div", 50);
    \u0275\u0275template(17, DashboardComponent_For_32_For_10_Conditional_1_Conditional_17_Template, 3, 7, "button", 51);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const device_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("device-on", ctx_r1.isDeviceOn(device_r5))("device-alert", (device_r5.state == null ? null : device_r5.state.smoke) === true)("device-camera", ctx_r1.isCamera(device_r5));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("on", ctx_r1.isDeviceOn(device_r5));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getDeviceIcon(device_r5));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(device_r5.name);
    \u0275\u0275advance();
    \u0275\u0275conditional(8, ctx_r1.getBatteryLevel(device_r5) !== null ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(9, ctx_r1.isCamera(device_r5) ? 9 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("on", ctx_r1.isDeviceOn(device_r5));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getStateLabel(device_r5), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(13, ctx_r1.getStateDetails(device_r5).length > 0 ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(14, ctx_r1.isThermostat(device_r5) ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(15, ctx_r1.isCover(device_r5) ? 15 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(17, ctx_r1.isToggleable(device_r5) ? 17 : -1);
  }
}
function DashboardComponent_For_32_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DashboardComponent_For_32_For_10_Conditional_0_Template, 22, 11, "div", 20)(1, DashboardComponent_For_32_For_10_Conditional_1_Template, 18, 19);
  }
  if (rf & 2) {
    const device_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(0, ctx_r1.isWeatherSensor(device_r5) ? 0 : 1);
  }
}
function DashboardComponent_For_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 17)(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h2");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 18);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 19);
    \u0275\u0275repeaterCreate(9, DashboardComponent_For_32_For_10_Template, 2, 1, null, null, _forTrack1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const group_r11 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("color", group_r11.room.color);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(group_r11.room.icon || "meeting_room");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(group_r11.room.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", group_r11.devices.length, " appareil(s)");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(group_r11.devices);
  }
}
function DashboardComponent_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "mat-icon");
    \u0275\u0275text(2, "devices_other");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "Aucun appareil a afficher");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6, 'Ajoutez des appareils depuis la section "Appareils"');
    \u0275\u0275elementEnd()();
  }
}
var DashboardComponent = class _DashboardComponent {
  get totalDevices() {
    return this.allDevices.length;
  }
  get onlineDevices() {
    return this.allDevices.filter((d) => d.state?.power === "on").length;
  }
  get totalRooms() {
    return this.rooms.length;
  }
  get displayedDevices() {
    if (this.selectedRoomId === null) {
      return this.allDevices.filter((d) => d.is_visible);
    }
    return this.allDevices.filter((d) => d.room_id === this.selectedRoomId && d.is_visible);
  }
  get roomsWithDevices() {
    const visible = this.displayedDevices;
    const roomMap = /* @__PURE__ */ new Map();
    for (const d of visible) {
      const arr = roomMap.get(d.room_id) || [];
      arr.push(d);
      roomMap.set(d.room_id, arr);
    }
    return this.rooms.filter((r) => roomMap.has(r.id)).map((r) => ({ room: r, devices: roomMap.get(r.id) }));
  }
  constructor(roomService, deviceService, wsService) {
    this.roomService = roomService;
    this.deviceService = deviceService;
    this.wsService = wsService;
    this.rooms = [];
    this.allDevices = [];
    this.selectedRoomId = null;
    this.loading = true;
    this.togglingDeviceIds = /* @__PURE__ */ new Set();
  }
  ngOnInit() {
    this.loadData();
    this.wsSub = this.wsService.messages$.subscribe((msg) => {
      if (msg.type === "device_state_update") {
        const device = this.allDevices.find((d) => d.id === msg["device_id"]);
        if (device) {
          device.state = msg["state"];
        }
      }
    });
  }
  ngOnDestroy() {
    this.wsSub?.unsubscribe();
  }
  loadData() {
    this.loading = true;
    this.roomService.getRooms().subscribe((rooms) => {
      this.rooms = rooms;
    });
    this.deviceService.getDevices().subscribe((devices) => {
      this.allDevices = devices;
      this.loading = false;
    });
  }
  selectRoom(roomId) {
    this.selectedRoomId = this.selectedRoomId === roomId ? null : roomId;
  }
  getRoomName(roomId) {
    return this.rooms.find((r) => r.id === roomId)?.name || "Inconnue";
  }
  getRoomColor(roomId) {
    return this.rooms.find((r) => r.id === roomId)?.color || "#4CAF50";
  }
  toggleDevice(device) {
    if (this.togglingDeviceIds.has(device.id))
      return;
    this.togglingDeviceIds.add(device.id);
    const action = device.state?.power === "on" ? "turn_off" : "turn_on";
    this.deviceService.executeAction(device.id, action).subscribe({
      next: (updated) => {
        this.updateDevice(updated);
        this.togglingDeviceIds.delete(device.id);
      },
      error: () => {
        this.togglingDeviceIds.delete(device.id);
      }
    });
  }
  // ---- Cover / Garage door position ----
  onCoverPositionChange(device, position) {
    this.deviceService.updateState(device.id, { position, power: position > 0 ? "on" : "off" }).subscribe({
      next: (updated) => this.updateDevice(updated)
    });
  }
  setCoverPreset(device, position) {
    this.onCoverPositionChange(device, position);
  }
  // ---- Thermostat target temperature ----
  onTargetTempChange(device, temp) {
    device.state = __spreadProps(__spreadValues({}, device.state), { target_temperature: temp });
    this.deviceService.updateState(device.id, { target_temperature: temp }).subscribe({
      next: (updated) => this.updateDevice(updated)
    });
  }
  adjustTemp(device, delta) {
    const current = device.state?.target_temperature ?? device.state?.temperature ?? 20;
    const newTemp = Math.round(Math.max(5, Math.min(35, current + delta)) * 2) / 2;
    this.onTargetTempChange(device, newTemp);
  }
  // ---- Camera ----
  getCameraStreamUrl(device) {
    if (device.device_type !== "camera")
      return null;
    if (!device.config?.stream_url)
      return null;
    return `/api/cameras/${device.id}/stream`;
  }
  getCameraSnapshotUrl(device) {
    if (device.device_type !== "camera")
      return null;
    if (!device.config?.stream_url && !device.config?.snapshot_url)
      return null;
    return `/api/cameras/${device.id}/snapshot`;
  }
  // ---- Thermostat temperature resolution ----
  getThermostatCurrentTemp(device) {
    if (device.linked_sensor_id) {
      const sensor = this.allDevices.find((d) => d.id === device.linked_sensor_id);
      if (sensor?.state?.temperature !== void 0) {
        return sensor.state.temperature;
      }
    }
    if (device.state?.temperature !== void 0) {
      return device.state.temperature;
    }
    const roomSensor = this.allDevices.find((d) => d.room_id === device.room_id && d.id !== device.id && d.device_type === "sensor" && d.state?.temperature !== void 0);
    if (roomSensor) {
      return roomSensor.state.temperature;
    }
    return null;
  }
  getThermostatTempSource(device) {
    if (device.linked_sensor_id) {
      const sensor = this.allDevices.find((d) => d.id === device.linked_sensor_id);
      if (sensor?.state?.temperature !== void 0) {
        return sensor.name;
      }
      return "Capteur lie introuvable";
    }
    if (device.state?.temperature !== void 0) {
      return "";
    }
    const roomSensor = this.allDevices.find((d) => d.room_id === device.room_id && d.id !== device.id && d.device_type === "sensor" && d.state?.temperature !== void 0);
    if (roomSensor) {
      return roomSensor.name;
    }
    return "";
  }
  hasThermostatTempWarning(device) {
    return this.getThermostatCurrentTemp(device) === null;
  }
  // ---- Helpers ----
  updateDevice(updated) {
    const idx = this.allDevices.findIndex((d) => d.id === updated.id);
    if (idx >= 0) {
      this.allDevices[idx] = updated;
    }
  }
  getDeviceIcon(device) {
    if (device.icon && device.icon !== "devices")
      return device.icon;
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
    return icons[device.device_type] || "devices";
  }
  isDeviceOn(device) {
    return device.state?.power === "on";
  }
  isToggleable(device) {
    return ["light", "switch"].includes(device.device_type);
  }
  isCover(device) {
    return device.device_type === "cover";
  }
  isThermostat(device) {
    return device.device_type === "thermostat";
  }
  isCamera(device) {
    return device.device_type === "camera";
  }
  isWeatherSensor(device) {
    return device.device_type === "sensor" && device.state?.season !== void 0;
  }
  getWeatherVigilanceColor(device) {
    const v = device.state?.vigilance;
    if (!v)
      return "";
    const colors = { vert: "#4caf50", jaune: "#ffeb3b", orange: "#ff9800", rouge: "#f44336" };
    return colors[v.color] || "";
  }
  getWeatherVigilanceAlerts(device) {
    return device.state?.vigilance?.alerts || [];
  }
  getStateLabel(device) {
    if (!device.state || Object.keys(device.state).length === 0)
      return "Hors ligne";
    const s = device.state;
    const parts = [];
    if (device.device_type === "thermostat") {
      const currentTemp = this.getThermostatCurrentTemp(device);
      if (currentTemp !== null)
        parts.push(`${currentTemp}\xB0C`);
      if (s["target_temperature"] !== void 0)
        parts.push(`Consigne ${s["target_temperature"]}\xB0C`);
      if (s["heating"] === true)
        parts.push("\u{1F525} Chauffe");
      else if (s["heating"] === false)
        parts.push("En veille");
      if (parts.length > 0)
        return parts.join(" \xB7 ");
      return "Pas de capteur";
    }
    if (s["temperature"] !== void 0) {
      parts.push(`${s["temperature"]}\xB0C`);
    }
    if (s["humidity"] !== void 0) {
      parts.push(`${s["humidity"]}%`);
    }
    if (device.device_type === "cover" && s["position"] !== void 0) {
      return s["position"] === 0 ? "Ferme" : s["position"] === 100 ? "Ouvert" : `Ouvert ${s["position"]}%`;
    }
    if (s["locked"] !== void 0) {
      return s["locked"] ? "Verrouille" : "Deverrouille";
    }
    if (device.device_type === "camera") {
      if (s["recording"])
        return "Enregistrement";
      return s["power"] === "on" ? "En ligne" : "Hors ligne";
    }
    if (s["smoke"] !== void 0) {
      return s["smoke"] ? "ALERTE FUMEE" : "Normal";
    }
    if (s["occupancy"] !== void 0) {
      return s["occupancy"] ? "Mouvement detecte" : "Aucun mouvement";
    }
    if (s["contact"] !== void 0) {
      return s["contact"] ? "Ferme" : "Ouvert";
    }
    if (s["condition"] !== void 0) {
      return `${s["condition"]}`;
    }
    if (parts.length > 0)
      return parts.join(" \xB7 ");
    if (s["power"])
      return s["power"] === "on" ? "Allume" : "Eteint";
    return "Actif";
  }
  getStateDetails(device) {
    if (!device.state)
      return [];
    const s = device.state;
    const details = [];
    if (s["brightness"] !== void 0 && s["brightness"] > 0) {
      details.push(`Luminosite ${s["brightness"]}%`);
    }
    if (s["color_temp"] !== void 0) {
      details.push(`${s["color_temp"]}K`);
    }
    if (s["wind_speed"] !== void 0) {
      details.push(`Vent ${s["wind_speed"]} km/h`);
    }
    if (s["pressure"] !== void 0) {
      details.push(`${s["pressure"]} hPa`);
    }
    if (s["consumption"] !== void 0 && s["consumption"] > 0) {
      details.push(`${s["consumption"]} W`);
    }
    if (device.device_type === "thermostat") {
      if (s["humidity"] !== void 0) {
        details.push(`Humidite ${s["humidity"]}%`);
      }
      if (device.hysteresis != null && device.hysteresis > 0) {
        details.push(`Hysteresis \xB1${device.hysteresis}\xB0C`);
      }
    }
    return details;
  }
  getBatteryLevel(device) {
    return device.state?.battery ?? null;
  }
  getBatteryIcon(level) {
    if (level > 80)
      return "battery_full";
    if (level > 60)
      return "battery_5_bar";
    if (level > 40)
      return "battery_4_bar";
    if (level > 20)
      return "battery_2_bar";
    return "battery_alert";
  }
  getBatteryClass(level) {
    if (level > 60)
      return "battery-good";
    if (level > 20)
      return "battery-medium";
    return "battery-low";
  }
  getToggleIcon(device) {
    return "power_settings_new";
  }
  getToggleTooltip(device) {
    return this.isDeviceOn(device) ? "Eteindre" : "Allumer";
  }
  getCoverPosition(device) {
    return device.state?.position ?? 0;
  }
  getTargetTemp(device) {
    return device.state?.target_temperature ?? device.state?.temperature ?? 20;
  }
  static {
    this.\u0275fac = function DashboardComponent_Factory(t) {
      return new (t || _DashboardComponent)(\u0275\u0275directiveInject(RoomService), \u0275\u0275directiveInject(DeviceService), \u0275\u0275directiveInject(WebSocketService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DashboardComponent, selectors: [["app-dashboard"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 34, vars: 6, consts: [[1, "page-container", "fade-in"], [1, "page-header"], [1, "stats-row"], [1, "stat-card"], [1, "stat-icon", "rooms"], [1, "stat-info"], [1, "stat-value"], [1, "stat-label"], [1, "stat-icon", "devices"], [1, "stat-icon", "online"], [1, "room-chips"], ["mode", "indeterminate", "color", "accent"], [1, "room-section"], [1, "empty-state"], [3, "click"], ["matChipAvatar", ""], [3, "selected"], [1, "room-section-header"], [1, "room-device-count"], [1, "card-grid"], [1, "device-card", "thidom-card", "weather-card"], [1, "device-header"], [1, "device-icon-wrapper", "on"], [1, "device-info"], [1, "device-name"], [1, "weather-widget"], [1, "weather-main"], [1, "weather-temp"], [1, "weather-desc"], [1, "weather-details"], [1, "weather-detail"], [1, "weather-sun"], [1, "weather-calendar"], [1, "weather-chip", "season"], [1, "weather-chip", "weekend"], [1, "weather-chip", "holiday"], [1, "weather-vigilance", 3, "border-color"], [1, "weather-vigilance"], [1, "vigilance-info"], [1, "vigilance-level"], [1, "vigilance-risk"], [1, "device-card", "thidom-card"], [1, "device-icon-wrapper"], [1, "battery-indicator", 3, "class", "matTooltip"], [1, "camera-container"], [1, "device-state"], [1, "state-value"], [1, "state-details"], [1, "thermostat-control"], [1, "cover-control"], [1, "device-actions"], [1, "toggle-btn", 3, "on", "toggling", "matTooltip", "disabled"], [1, "battery-indicator", 3, "matTooltip"], [1, "battery-text"], ["alt", "Camera", 1, "camera-stream", 3, "src"], [1, "recording-badge"], [1, "camera-placeholder"], [1, "rec-dot"], [1, "detail-chip"], [1, "thermostat-warning"], [1, "thermostat-heating-badge"], [1, "thermostat-row"], ["matTooltip", "Baisser", 1, "temp-btn", "minus", 3, "click"], [1, "temp-display"], [1, "temp-target"], [1, "temp-label"], ["matTooltip", "Augmenter", 1, "temp-btn", "plus", 3, "click"], [1, "thermostat-source"], [1, "cover-slider-row"], [1, "cover-icon"], ["min", "0", "max", "100", "step", "5", "discrete", "", 1, "cover-slider"], ["matSliderThumb", "", 3, "valueChange", "value"], [1, "cover-value"], [1, "cover-presets"], ["matTooltip", "Fermer", 1, "preset-btn", 3, "click"], ["matTooltip", "50%", 1, "preset-btn", 3, "click"], ["matTooltip", "Ouvrir", 1, "preset-btn", 3, "click"], [1, "toggle-btn", 3, "click", "matTooltip", "disabled"]], template: function DashboardComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1");
        \u0275\u0275text(3, "Tableau de bord");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(4, "div", 2)(5, "div", 3)(6, "mat-icon", 4);
        \u0275\u0275text(7, "meeting_room");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "div", 5)(9, "span", 6);
        \u0275\u0275text(10);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "span", 7);
        \u0275\u0275text(12, "Pieces");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(13, "div", 3)(14, "mat-icon", 8);
        \u0275\u0275text(15, "devices");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(16, "div", 5)(17, "span", 6);
        \u0275\u0275text(18);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "span", 7);
        \u0275\u0275text(20, "Appareils");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(21, "div", 3)(22, "mat-icon", 9);
        \u0275\u0275text(23, "power");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(24, "div", 5)(25, "span", 6);
        \u0275\u0275text(26);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(27, "span", 7);
        \u0275\u0275text(28, "Actifs");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275template(29, DashboardComponent_Conditional_29_Template, 8, 2, "div", 10)(30, DashboardComponent_Conditional_30_Template, 1, 0, "mat-progress-bar", 11);
        \u0275\u0275repeaterCreate(31, DashboardComponent_For_32_Template, 11, 5, "div", 12, _forTrack0);
        \u0275\u0275template(33, DashboardComponent_Conditional_33_Template, 7, 0, "div", 13);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(10);
        \u0275\u0275textInterpolate(ctx.totalRooms);
        \u0275\u0275advance(8);
        \u0275\u0275textInterpolate(ctx.totalDevices);
        \u0275\u0275advance(8);
        \u0275\u0275textInterpolate(ctx.onlineDevices);
        \u0275\u0275advance(3);
        \u0275\u0275conditional(29, ctx.rooms.length > 0 ? 29 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(30, ctx.loading ? 30 : -1);
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.roomsWithDevices);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(33, !ctx.loading && ctx.displayedDevices.length === 0 ? 33 : -1);
      }
    }, dependencies: [
      CommonModule,
      FormsModule,
      MatCardModule,
      MatIconModule,
      MatIcon,
      MatButtonModule,
      MatChipsModule,
      MatChip,
      MatChipAvatar,
      MatChipSet,
      MatTooltipModule,
      MatTooltip,
      MatProgressBarModule,
      MatProgressBar,
      MatSlideToggleModule,
      MatSliderModule,
      MatSlider,
      MatSliderThumb
    ], styles: ["\n\n.stats-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 16px;\n  margin-bottom: 24px;\n}\n.stats-row[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%] {\n  background: var(--thidom-bg-card);\n  border: 1px solid var(--thidom-border);\n  border-radius: 12px;\n  padding: 20px;\n  display: flex;\n  align-items: center;\n  gap: 16px;\n}\n.stats-row[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  width: 48px;\n  height: 48px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 12px;\n  background: rgba(0, 230, 118, 0.1);\n}\n.stats-row[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   .stat-icon.rooms[_ngcontent-%COMP%] {\n  color: #42a5f5;\n  background: rgba(66, 165, 245, 0.1);\n}\n.stats-row[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   .stat-icon.devices[_ngcontent-%COMP%] {\n  color: #ab47bc;\n  background: rgba(171, 71, 188, 0.1);\n}\n.stats-row[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   .stat-icon.online[_ngcontent-%COMP%] {\n  color: var(--thidom-green);\n}\n.stats-row[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   .stat-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.stats-row[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   .stat-info[_ngcontent-%COMP%]   .stat-value[_ngcontent-%COMP%] {\n  font-size: 1.8rem;\n  font-weight: 600;\n  color: var(--thidom-text-primary);\n}\n.stats-row[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   .stat-info[_ngcontent-%COMP%]   .stat-label[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: var(--thidom-text-secondary);\n}\n.room-chips[_ngcontent-%COMP%] {\n  margin-bottom: 24px;\n}\n.room-chips[_ngcontent-%COMP%]   mat-chip[_ngcontent-%COMP%] {\n  background: var(--thidom-bg-card) !important;\n  color: var(--thidom-text-secondary) !important;\n  border: 1px solid var(--thidom-border);\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.room-chips[_ngcontent-%COMP%]   mat-chip[_ngcontent-%COMP%]:hover, .room-chips[_ngcontent-%COMP%]   mat-chip.selected[_ngcontent-%COMP%] {\n  background: rgba(0, 230, 118, 0.15) !important;\n  color: var(--thidom-green) !important;\n  border-color: var(--thidom-green);\n}\n.room-section[_ngcontent-%COMP%] {\n  margin-bottom: 32px;\n}\n.room-section[_ngcontent-%COMP%]   .room-section-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 16px;\n  padding-bottom: 8px;\n  border-bottom: 1px solid var(--thidom-border);\n}\n.room-section[_ngcontent-%COMP%]   .room-section-header[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 1.4rem;\n  width: 24px;\n  height: 24px;\n}\n.room-section[_ngcontent-%COMP%]   .room-section-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 1.15rem;\n  font-weight: 500;\n  color: var(--thidom-text-primary);\n  margin: 0;\n}\n.room-section[_ngcontent-%COMP%]   .room-section-header[_ngcontent-%COMP%]   .room-device-count[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: var(--thidom-text-secondary);\n  margin-left: auto;\n}\n.device-card[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  cursor: default;\n  position: relative;\n  transition: border-color 0.3s, box-shadow 0.3s;\n}\n.device-card.device-on[_ngcontent-%COMP%] {\n  border-color: rgba(0, 230, 118, 0.3);\n  box-shadow: 0 0 12px rgba(0, 230, 118, 0.08);\n}\n.device-card.device-alert[_ngcontent-%COMP%] {\n  border-color: rgba(244, 67, 54, 0.5) !important;\n  box-shadow: 0 0 16px rgba(244, 67, 54, 0.15) !important;\n  animation: _ngcontent-%COMP%_pulse-alert 2s infinite;\n}\n.device-card.device-camera[_ngcontent-%COMP%] {\n  grid-column: span 1;\n}\n.device-card[_ngcontent-%COMP%]   .device-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.device-card[_ngcontent-%COMP%]   .device-header[_ngcontent-%COMP%]   .device-icon-wrapper[_ngcontent-%COMP%] {\n  width: 44px;\n  height: 44px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(255, 255, 255, 0.05);\n  flex-shrink: 0;\n  transition: all 0.3s;\n}\n.device-card[_ngcontent-%COMP%]   .device-header[_ngcontent-%COMP%]   .device-icon-wrapper[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: var(--thidom-text-secondary);\n  font-size: 1.4rem;\n}\n.device-card[_ngcontent-%COMP%]   .device-header[_ngcontent-%COMP%]   .device-icon-wrapper.on[_ngcontent-%COMP%] {\n  background: rgba(0, 230, 118, 0.15);\n}\n.device-card[_ngcontent-%COMP%]   .device-header[_ngcontent-%COMP%]   .device-icon-wrapper.on[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: var(--thidom-green);\n}\n.device-card[_ngcontent-%COMP%]   .device-header[_ngcontent-%COMP%]   .device-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  min-width: 0;\n}\n.device-card[_ngcontent-%COMP%]   .device-header[_ngcontent-%COMP%]   .device-info[_ngcontent-%COMP%]   .device-name[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n  font-weight: 500;\n  color: var(--thidom-text-primary);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.device-card[_ngcontent-%COMP%]   .device-header[_ngcontent-%COMP%]   .device-info[_ngcontent-%COMP%]   .device-room[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: var(--thidom-text-secondary);\n}\n.device-card[_ngcontent-%COMP%]   .device-header[_ngcontent-%COMP%]   .battery-indicator[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 2px;\n  flex-shrink: 0;\n}\n.device-card[_ngcontent-%COMP%]   .device-header[_ngcontent-%COMP%]   .battery-indicator[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  width: 18px;\n  height: 18px;\n}\n.device-card[_ngcontent-%COMP%]   .device-header[_ngcontent-%COMP%]   .battery-indicator[_ngcontent-%COMP%]   .battery-text[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  font-weight: 500;\n}\n.device-card[_ngcontent-%COMP%]   .device-header[_ngcontent-%COMP%]   .battery-indicator.battery-good[_ngcontent-%COMP%] {\n  color: var(--thidom-green);\n}\n.device-card[_ngcontent-%COMP%]   .device-header[_ngcontent-%COMP%]   .battery-indicator.battery-medium[_ngcontent-%COMP%] {\n  color: #ffa726;\n}\n.device-card[_ngcontent-%COMP%]   .device-header[_ngcontent-%COMP%]   .battery-indicator.battery-low[_ngcontent-%COMP%] {\n  color: #ef5350;\n  animation: _ngcontent-%COMP%_blink 2s infinite;\n}\n.device-card[_ngcontent-%COMP%]   .camera-container[_ngcontent-%COMP%] {\n  position: relative;\n  border-radius: 8px;\n  overflow: hidden;\n  background: #000;\n  min-height: 140px;\n}\n.device-card[_ngcontent-%COMP%]   .camera-container[_ngcontent-%COMP%]   .camera-stream[_ngcontent-%COMP%] {\n  width: 100%;\n  height: auto;\n  display: block;\n  border-radius: 8px;\n}\n.device-card[_ngcontent-%COMP%]   .camera-container[_ngcontent-%COMP%]   .camera-placeholder[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: 140px;\n  color: var(--thidom-text-secondary);\n  gap: 6px;\n}\n.device-card[_ngcontent-%COMP%]   .camera-container[_ngcontent-%COMP%]   .camera-placeholder[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  width: 40px;\n  height: 40px;\n  opacity: 0.3;\n}\n.device-card[_ngcontent-%COMP%]   .camera-container[_ngcontent-%COMP%]   .camera-placeholder[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n}\n.device-card[_ngcontent-%COMP%]   .camera-container[_ngcontent-%COMP%]   .camera-placeholder[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  opacity: 0.5;\n}\n.device-card[_ngcontent-%COMP%]   .camera-container[_ngcontent-%COMP%]   .recording-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 8px;\n  right: 8px;\n  background: rgba(244, 67, 54, 0.9);\n  color: white;\n  padding: 2px 8px;\n  border-radius: 4px;\n  font-size: 0.7rem;\n  font-weight: 600;\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n.device-card[_ngcontent-%COMP%]   .camera-container[_ngcontent-%COMP%]   .recording-badge[_ngcontent-%COMP%]   .rec-dot[_ngcontent-%COMP%] {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background: white;\n  animation: _ngcontent-%COMP%_blink 1s infinite;\n}\n.device-card[_ngcontent-%COMP%]   .thermostat-control[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  padding: 8px 0;\n}\n.device-card[_ngcontent-%COMP%]   .thermostat-control[_ngcontent-%COMP%]   .thermostat-warning[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 6px;\n  padding: 6px 10px;\n  background: rgba(255, 152, 0, 0.1);\n  border: 1px solid rgba(255, 152, 0, 0.3);\n  border-radius: 6px;\n}\n.device-card[_ngcontent-%COMP%]   .thermostat-control[_ngcontent-%COMP%]   .thermostat-warning[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n  color: #ffa726;\n  flex-shrink: 0;\n  margin-top: 1px;\n}\n.device-card[_ngcontent-%COMP%]   .thermostat-control[_ngcontent-%COMP%]   .thermostat-warning[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  color: #ffa726;\n  line-height: 1.3;\n}\n.device-card[_ngcontent-%COMP%]   .thermostat-control[_ngcontent-%COMP%]   .thermostat-heating-badge[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n  padding: 5px 12px;\n  background: rgba(255, 87, 34, 0.12);\n  border: 1px solid rgba(255, 87, 34, 0.35);\n  border-radius: 6px;\n  animation: _ngcontent-%COMP%_pulse-heat 2s infinite;\n}\n.device-card[_ngcontent-%COMP%]   .thermostat-control[_ngcontent-%COMP%]   .thermostat-heating-badge[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n  color: #ff5722;\n}\n.device-card[_ngcontent-%COMP%]   .thermostat-control[_ngcontent-%COMP%]   .thermostat-heating-badge[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-weight: 500;\n  color: #ff5722;\n}\n.device-card[_ngcontent-%COMP%]   .thermostat-control[_ngcontent-%COMP%]   .thermostat-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 16px;\n}\n.device-card[_ngcontent-%COMP%]   .thermostat-control[_ngcontent-%COMP%]   .temp-btn[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  border: 2px solid var(--thidom-border);\n  background: transparent;\n  color: var(--thidom-text-secondary);\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.2s;\n}\n.device-card[_ngcontent-%COMP%]   .thermostat-control[_ngcontent-%COMP%]   .temp-btn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  width: 20px;\n  height: 20px;\n}\n.device-card[_ngcontent-%COMP%]   .thermostat-control[_ngcontent-%COMP%]   .temp-btn.minus[_ngcontent-%COMP%]:hover {\n  border-color: #42a5f5;\n  color: #42a5f5;\n  background: rgba(66, 165, 245, 0.1);\n}\n.device-card[_ngcontent-%COMP%]   .thermostat-control[_ngcontent-%COMP%]   .temp-btn.plus[_ngcontent-%COMP%]:hover {\n  border-color: #ef5350;\n  color: #ef5350;\n  background: rgba(239, 83, 80, 0.1);\n}\n.device-card[_ngcontent-%COMP%]   .thermostat-control[_ngcontent-%COMP%]   .temp-display[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  min-width: 80px;\n}\n.device-card[_ngcontent-%COMP%]   .thermostat-control[_ngcontent-%COMP%]   .temp-display[_ngcontent-%COMP%]   .temp-target[_ngcontent-%COMP%] {\n  font-size: 1.8rem;\n  font-weight: 600;\n  color: var(--thidom-green);\n  line-height: 1;\n}\n.device-card[_ngcontent-%COMP%]   .thermostat-control[_ngcontent-%COMP%]   .temp-display[_ngcontent-%COMP%]   .temp-label[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  color: var(--thidom-text-secondary);\n  margin-top: 2px;\n}\n.device-card[_ngcontent-%COMP%]   .thermostat-control[_ngcontent-%COMP%]   .thermostat-source[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 4px;\n}\n.device-card[_ngcontent-%COMP%]   .thermostat-control[_ngcontent-%COMP%]   .thermostat-source[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 12px;\n  width: 12px;\n  height: 12px;\n  color: var(--thidom-text-secondary);\n}\n.device-card[_ngcontent-%COMP%]   .thermostat-control[_ngcontent-%COMP%]   .thermostat-source[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.65rem;\n  color: var(--thidom-text-secondary);\n}\n.device-card[_ngcontent-%COMP%]   .cover-control[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  padding: 4px 0;\n}\n.device-card[_ngcontent-%COMP%]   .cover-control[_ngcontent-%COMP%]   .cover-slider-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.device-card[_ngcontent-%COMP%]   .cover-control[_ngcontent-%COMP%]   .cover-slider-row[_ngcontent-%COMP%]   .cover-icon[_ngcontent-%COMP%] {\n  color: var(--thidom-text-secondary);\n  font-size: 1.2rem;\n  width: 20px;\n  height: 20px;\n  flex-shrink: 0;\n}\n.device-card[_ngcontent-%COMP%]   .cover-control[_ngcontent-%COMP%]   .cover-slider-row[_ngcontent-%COMP%]   .cover-slider[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.device-card[_ngcontent-%COMP%]   .cover-control[_ngcontent-%COMP%]   .cover-slider-row[_ngcontent-%COMP%]   .cover-value[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  font-weight: 600;\n  color: var(--thidom-green);\n  min-width: 36px;\n  text-align: right;\n}\n.device-card[_ngcontent-%COMP%]   .cover-control[_ngcontent-%COMP%]   .cover-presets[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  gap: 8px;\n}\n.device-card[_ngcontent-%COMP%]   .cover-control[_ngcontent-%COMP%]   .cover-presets[_ngcontent-%COMP%]   .preset-btn[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border-radius: 8px;\n  border: 1px solid var(--thidom-border);\n  background: transparent;\n  color: var(--thidom-text-secondary);\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.2s;\n}\n.device-card[_ngcontent-%COMP%]   .cover-control[_ngcontent-%COMP%]   .cover-presets[_ngcontent-%COMP%]   .preset-btn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  width: 18px;\n  height: 18px;\n}\n.device-card[_ngcontent-%COMP%]   .cover-control[_ngcontent-%COMP%]   .cover-presets[_ngcontent-%COMP%]   .preset-btn[_ngcontent-%COMP%]:hover {\n  border-color: var(--thidom-green);\n  color: var(--thidom-green);\n  background: rgba(0, 230, 118, 0.08);\n}\n.device-card.weather-card[_ngcontent-%COMP%] {\n  grid-column: span 1;\n}\n.device-card.weather-card[_ngcontent-%COMP%]   .weather-widget[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.device-card.weather-card[_ngcontent-%COMP%]   .weather-main[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: baseline;\n  gap: 12px;\n}\n.device-card.weather-card[_ngcontent-%COMP%]   .weather-main[_ngcontent-%COMP%]   .weather-temp[_ngcontent-%COMP%] {\n  font-size: 2.2rem;\n  font-weight: 300;\n  color: var(--thidom-green);\n  line-height: 1;\n}\n.device-card.weather-card[_ngcontent-%COMP%]   .weather-main[_ngcontent-%COMP%]   .weather-desc[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  color: var(--thidom-text-secondary);\n  text-transform: capitalize;\n}\n.device-card.weather-card[_ngcontent-%COMP%]   .weather-details[_ngcontent-%COMP%], .device-card.weather-card[_ngcontent-%COMP%]   .weather-sun[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 12px;\n}\n.device-card.weather-card[_ngcontent-%COMP%]   .weather-detail[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n.device-card.weather-card[_ngcontent-%COMP%]   .weather-detail[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n  color: var(--thidom-text-secondary);\n}\n.device-card.weather-card[_ngcontent-%COMP%]   .weather-detail[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: var(--thidom-text-secondary);\n}\n.device-card.weather-card[_ngcontent-%COMP%]   .weather-calendar[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n.device-card.weather-card[_ngcontent-%COMP%]   .weather-chip[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  padding: 3px 10px;\n  border-radius: 12px;\n  font-weight: 500;\n}\n.device-card.weather-card[_ngcontent-%COMP%]   .weather-chip.season[_ngcontent-%COMP%] {\n  background: rgba(139, 195, 74, 0.12);\n  color: #8bc34a;\n  border: 1px solid rgba(139, 195, 74, 0.3);\n}\n.device-card.weather-card[_ngcontent-%COMP%]   .weather-chip.weekend[_ngcontent-%COMP%] {\n  background: rgba(33, 150, 243, 0.12);\n  color: #42a5f5;\n  border: 1px solid rgba(33, 150, 243, 0.3);\n}\n.device-card.weather-card[_ngcontent-%COMP%]   .weather-chip.holiday[_ngcontent-%COMP%] {\n  background: rgba(255, 152, 0, 0.12);\n  color: #ffa726;\n  border: 1px solid rgba(255, 152, 0, 0.3);\n}\n.device-card.weather-card[_ngcontent-%COMP%]   .weather-vigilance[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n  padding: 8px 12px;\n  background: rgba(255, 255, 255, 0.03);\n  border-radius: 8px;\n  border: 1px solid;\n}\n.device-card.weather-card[_ngcontent-%COMP%]   .weather-vigilance[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n  flex-shrink: 0;\n  margin-top: 1px;\n}\n.device-card.weather-card[_ngcontent-%COMP%]   .weather-vigilance[_ngcontent-%COMP%]   .vigilance-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.device-card.weather-card[_ngcontent-%COMP%]   .weather-vigilance[_ngcontent-%COMP%]   .vigilance-info[_ngcontent-%COMP%]   .vigilance-level[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  font-weight: 600;\n  text-transform: capitalize;\n}\n.device-card.weather-card[_ngcontent-%COMP%]   .weather-vigilance[_ngcontent-%COMP%]   .vigilance-info[_ngcontent-%COMP%]   .vigilance-risk[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: var(--thidom-text-secondary);\n}\n.device-card[_ngcontent-%COMP%]   .device-state[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.device-card[_ngcontent-%COMP%]   .device-state[_ngcontent-%COMP%]   .state-value[_ngcontent-%COMP%] {\n  font-size: 1.4rem;\n  font-weight: 300;\n  color: var(--thidom-text-secondary);\n  line-height: 1.2;\n}\n.device-card[_ngcontent-%COMP%]   .device-state[_ngcontent-%COMP%]   .state-value.on[_ngcontent-%COMP%] {\n  color: var(--thidom-green);\n}\n.device-card[_ngcontent-%COMP%]   .device-state[_ngcontent-%COMP%]   .state-details[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n.device-card[_ngcontent-%COMP%]   .device-state[_ngcontent-%COMP%]   .state-details[_ngcontent-%COMP%]   .detail-chip[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  padding: 2px 8px;\n  border-radius: 10px;\n  background: rgba(255, 255, 255, 0.06);\n  color: var(--thidom-text-secondary);\n  border: 1px solid var(--thidom-border);\n}\n.device-card[_ngcontent-%COMP%]   .device-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  margin-top: auto;\n}\n.device-card[_ngcontent-%COMP%]   .device-actions[_ngcontent-%COMP%]   .toggle-btn[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n  border: 2px solid var(--thidom-border);\n  background: transparent;\n  color: var(--thidom-text-secondary);\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.3s ease;\n}\n.device-card[_ngcontent-%COMP%]   .device-actions[_ngcontent-%COMP%]   .toggle-btn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  width: 24px;\n  height: 24px;\n}\n.device-card[_ngcontent-%COMP%]   .device-actions[_ngcontent-%COMP%]   .toggle-btn[_ngcontent-%COMP%]:hover {\n  border-color: var(--thidom-green);\n  color: var(--thidom-green);\n  background: rgba(0, 230, 118, 0.08);\n  transform: scale(1.08);\n}\n.device-card[_ngcontent-%COMP%]   .device-actions[_ngcontent-%COMP%]   .toggle-btn.on[_ngcontent-%COMP%] {\n  border-color: var(--thidom-green);\n  background: rgba(0, 230, 118, 0.15);\n  color: var(--thidom-green);\n  box-shadow: 0 0 12px rgba(0, 230, 118, 0.2);\n}\n.device-card[_ngcontent-%COMP%]   .device-actions[_ngcontent-%COMP%]   .toggle-btn.on[_ngcontent-%COMP%]:hover {\n  background: rgba(0, 230, 118, 0.25);\n}\n.device-card[_ngcontent-%COMP%]   .device-actions[_ngcontent-%COMP%]   .toggle-btn.toggling[_ngcontent-%COMP%] {\n  pointer-events: none;\n  opacity: 0.6;\n  animation: _ngcontent-%COMP%_spin 0.8s linear infinite;\n}\n.device-card[_ngcontent-%COMP%]   .device-actions[_ngcontent-%COMP%]   .toggle-btn[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n}\n.empty-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 60px 20px;\n  color: var(--thidom-text-secondary);\n}\n.empty-state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 4rem;\n  width: 64px;\n  height: 64px;\n  margin-bottom: 16px;\n  opacity: 0.4;\n}\n.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  margin-bottom: 8px;\n  color: var(--thidom-text-primary);\n}\n.empty-state[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n@keyframes _ngcontent-%COMP%_blink {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.4;\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse-alert {\n  0%, 100% {\n    box-shadow: 0 0 8px rgba(244, 67, 54, 0.15);\n  }\n  50% {\n    box-shadow: 0 0 20px rgba(244, 67, 54, 0.3);\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse-heat {\n  0%, 100% {\n    background: rgba(255, 87, 34, 0.12);\n  }\n  50% {\n    background: rgba(255, 87, 34, 0.2);\n  }\n}\n/*# sourceMappingURL=dashboard.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DashboardComponent, { className: "DashboardComponent", filePath: "src\\app\\features\\dashboard\\dashboard.component.ts", lineNumber: 36 });
})();
export {
  DashboardComponent
};
//# sourceMappingURL=chunk-5CWWQANY.js.map
