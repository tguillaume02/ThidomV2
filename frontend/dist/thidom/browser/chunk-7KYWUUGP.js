import {
  MatChip,
  MatChipsModule
} from "./chunk-TPFVVE76.js";
import {
  MatSelect,
  MatSelectModule
} from "./chunk-N62PVXES.js";
import {
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
  MatTooltip,
  MatTooltipModule
} from "./chunk-3VUMTD7Q.js";
import {
  FormsModule,
  MatButton,
  MatButtonModule,
  MatIcon,
  MatIconButton,
  MatIconModule,
  MatOption,
  NgControlStatus,
  NgModel
} from "./chunk-3YNX47WL.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  CommonModule,
  Component,
  EventEmitter,
  HttpClient,
  HttpParams,
  Inject,
  Injectable,
  InjectionToken,
  Input,
  InputFlags,
  JsonPipe,
  NgModule,
  Optional,
  Output,
  ReplaySubject,
  SkipSelf,
  Subject,
  ViewEncapsulation$1,
  booleanAttribute,
  environment,
  numberAttribute,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵInputTransformsFeature,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-7ID3BB7P.js";

// node_modules/@angular/material/fesm2022/paginator.mjs
function MatPaginator_Conditional_2_Conditional_3_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pageSizeOption_r3 = ctx.$implicit;
    \u0275\u0275property("value", pageSizeOption_r3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", pageSizeOption_r3, " ");
  }
}
function MatPaginator_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-form-field", 13)(1, "mat-select", 15);
    \u0275\u0275listener("selectionChange", function MatPaginator_Conditional_2_Conditional_3_Template_mat_select_selectionChange_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1._changePageSize($event.value));
    });
    \u0275\u0275repeaterCreate(2, MatPaginator_Conditional_2_Conditional_3_For_3_Template, 2, 2, "mat-option", 16, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("appearance", ctx_r1._formFieldAppearance)("color", ctx_r1.color);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.pageSize)("disabled", ctx_r1.disabled)("aria-labelledby", ctx_r1._pageSizeLabelId)("panelClass", ctx_r1.selectConfig.panelClass || "")("disableOptionCentering", ctx_r1.selectConfig.disableOptionCentering);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1._displayedPageSizeOptions);
  }
}
function MatPaginator_Conditional_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.pageSize);
  }
}
function MatPaginator_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 12);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, MatPaginator_Conditional_2_Conditional_3_Template, 4, 7, "mat-form-field", 13)(4, MatPaginator_Conditional_2_Conditional_4_Template, 2, 1, "div", 14);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275attribute("id", ctx_r1._pageSizeLabelId);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1._intl.itemsPerPageLabel, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(3, ctx_r1._displayedPageSizeOptions.length > 1 ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(4, ctx_r1._displayedPageSizeOptions.length <= 1 ? 4 : -1);
  }
}
function MatPaginator_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 17);
    \u0275\u0275listener("click", function MatPaginator_Conditional_6_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.firstPage());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 7);
    \u0275\u0275element(2, "path", 18);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("matTooltip", ctx_r1._intl.firstPageLabel)("matTooltipDisabled", ctx_r1._previousButtonsDisabled())("matTooltipPosition", "above")("disabled", ctx_r1._previousButtonsDisabled());
    \u0275\u0275attribute("aria-label", ctx_r1._intl.firstPageLabel);
  }
}
function MatPaginator_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 19);
    \u0275\u0275listener("click", function MatPaginator_Conditional_13_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.lastPage());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 7);
    \u0275\u0275element(2, "path", 20);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("matTooltip", ctx_r1._intl.lastPageLabel)("matTooltipDisabled", ctx_r1._nextButtonsDisabled())("matTooltipPosition", "above")("disabled", ctx_r1._nextButtonsDisabled());
    \u0275\u0275attribute("aria-label", ctx_r1._intl.lastPageLabel);
  }
}
var MatPaginatorIntl = class _MatPaginatorIntl {
  constructor() {
    this.changes = new Subject();
    this.itemsPerPageLabel = "Items per page:";
    this.nextPageLabel = "Next page";
    this.previousPageLabel = "Previous page";
    this.firstPageLabel = "First page";
    this.lastPageLabel = "Last page";
    this.getRangeLabel = (page, pageSize, length) => {
      if (length == 0 || pageSize == 0) {
        return `0 of ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} \u2013 ${endIndex} of ${length}`;
    };
  }
  static {
    this.\u0275fac = function MatPaginatorIntl_Factory(t) {
      return new (t || _MatPaginatorIntl)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
      token: _MatPaginatorIntl,
      factory: _MatPaginatorIntl.\u0275fac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatPaginatorIntl, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
function MAT_PAGINATOR_INTL_PROVIDER_FACTORY(parentIntl) {
  return parentIntl || new MatPaginatorIntl();
}
var MAT_PAGINATOR_INTL_PROVIDER = {
  // If there is already an MatPaginatorIntl available, use that. Otherwise, provide a new one.
  provide: MatPaginatorIntl,
  deps: [[new Optional(), new SkipSelf(), MatPaginatorIntl]],
  useFactory: MAT_PAGINATOR_INTL_PROVIDER_FACTORY
};
var DEFAULT_PAGE_SIZE = 50;
var MAT_PAGINATOR_DEFAULT_OPTIONS = new InjectionToken("MAT_PAGINATOR_DEFAULT_OPTIONS");
var nextUniqueId = 0;
var MatPaginator = class _MatPaginator {
  /** The zero-based page index of the displayed list of items. Defaulted to 0. */
  get pageIndex() {
    return this._pageIndex;
  }
  set pageIndex(value) {
    this._pageIndex = Math.max(value || 0, 0);
    this._changeDetectorRef.markForCheck();
  }
  /** The length of the total number of items that are being paginated. Defaulted to 0. */
  get length() {
    return this._length;
  }
  set length(value) {
    this._length = value || 0;
    this._changeDetectorRef.markForCheck();
  }
  /** Number of items to display on a page. By default set to 50. */
  get pageSize() {
    return this._pageSize;
  }
  set pageSize(value) {
    this._pageSize = Math.max(value || 0, 0);
    this._updateDisplayedPageSizeOptions();
  }
  /** The set of provided page size options to display to the user. */
  get pageSizeOptions() {
    return this._pageSizeOptions;
  }
  set pageSizeOptions(value) {
    this._pageSizeOptions = (value || []).map((p) => numberAttribute(p, 0));
    this._updateDisplayedPageSizeOptions();
  }
  constructor(_intl, _changeDetectorRef, defaults) {
    this._intl = _intl;
    this._changeDetectorRef = _changeDetectorRef;
    this._pageSizeLabelId = `mat-paginator-page-size-label-${nextUniqueId++}`;
    this._isInitialized = false;
    this._initializedStream = new ReplaySubject(1);
    this._pageIndex = 0;
    this._length = 0;
    this._pageSizeOptions = [];
    this.hidePageSize = false;
    this.showFirstLastButtons = false;
    this.selectConfig = {};
    this.disabled = false;
    this.page = new EventEmitter();
    this.initialized = this._initializedStream;
    this._intlChanges = _intl.changes.subscribe(() => this._changeDetectorRef.markForCheck());
    if (defaults) {
      const {
        pageSize,
        pageSizeOptions,
        hidePageSize,
        showFirstLastButtons
      } = defaults;
      if (pageSize != null) {
        this._pageSize = pageSize;
      }
      if (pageSizeOptions != null) {
        this._pageSizeOptions = pageSizeOptions;
      }
      if (hidePageSize != null) {
        this.hidePageSize = hidePageSize;
      }
      if (showFirstLastButtons != null) {
        this.showFirstLastButtons = showFirstLastButtons;
      }
    }
    this._formFieldAppearance = defaults?.formFieldAppearance || "outline";
  }
  ngOnInit() {
    this._isInitialized = true;
    this._updateDisplayedPageSizeOptions();
    this._initializedStream.next();
  }
  ngOnDestroy() {
    this._initializedStream.complete();
    this._intlChanges.unsubscribe();
  }
  /** Advances to the next page if it exists. */
  nextPage() {
    if (!this.hasNextPage()) {
      return;
    }
    const previousPageIndex = this.pageIndex;
    this.pageIndex = this.pageIndex + 1;
    this._emitPageEvent(previousPageIndex);
  }
  /** Move back to the previous page if it exists. */
  previousPage() {
    if (!this.hasPreviousPage()) {
      return;
    }
    const previousPageIndex = this.pageIndex;
    this.pageIndex = this.pageIndex - 1;
    this._emitPageEvent(previousPageIndex);
  }
  /** Move to the first page if not already there. */
  firstPage() {
    if (!this.hasPreviousPage()) {
      return;
    }
    const previousPageIndex = this.pageIndex;
    this.pageIndex = 0;
    this._emitPageEvent(previousPageIndex);
  }
  /** Move to the last page if not already there. */
  lastPage() {
    if (!this.hasNextPage()) {
      return;
    }
    const previousPageIndex = this.pageIndex;
    this.pageIndex = this.getNumberOfPages() - 1;
    this._emitPageEvent(previousPageIndex);
  }
  /** Whether there is a previous page. */
  hasPreviousPage() {
    return this.pageIndex >= 1 && this.pageSize != 0;
  }
  /** Whether there is a next page. */
  hasNextPage() {
    const maxPageIndex = this.getNumberOfPages() - 1;
    return this.pageIndex < maxPageIndex && this.pageSize != 0;
  }
  /** Calculate the number of pages */
  getNumberOfPages() {
    if (!this.pageSize) {
      return 0;
    }
    return Math.ceil(this.length / this.pageSize);
  }
  /**
   * Changes the page size so that the first item displayed on the page will still be
   * displayed using the new page size.
   *
   * For example, if the page size is 10 and on the second page (items indexed 10-19) then
   * switching so that the page size is 5 will set the third page as the current page so
   * that the 10th item will still be displayed.
   */
  _changePageSize(pageSize) {
    const startIndex = this.pageIndex * this.pageSize;
    const previousPageIndex = this.pageIndex;
    this.pageIndex = Math.floor(startIndex / pageSize) || 0;
    this.pageSize = pageSize;
    this._emitPageEvent(previousPageIndex);
  }
  /** Checks whether the buttons for going forwards should be disabled. */
  _nextButtonsDisabled() {
    return this.disabled || !this.hasNextPage();
  }
  /** Checks whether the buttons for going backwards should be disabled. */
  _previousButtonsDisabled() {
    return this.disabled || !this.hasPreviousPage();
  }
  /**
   * Updates the list of page size options to display to the user. Includes making sure that
   * the page size is an option and that the list is sorted.
   */
  _updateDisplayedPageSizeOptions() {
    if (!this._isInitialized) {
      return;
    }
    if (!this.pageSize) {
      this._pageSize = this.pageSizeOptions.length != 0 ? this.pageSizeOptions[0] : DEFAULT_PAGE_SIZE;
    }
    this._displayedPageSizeOptions = this.pageSizeOptions.slice();
    if (this._displayedPageSizeOptions.indexOf(this.pageSize) === -1) {
      this._displayedPageSizeOptions.push(this.pageSize);
    }
    this._displayedPageSizeOptions.sort((a, b) => a - b);
    this._changeDetectorRef.markForCheck();
  }
  /** Emits an event notifying that a change of the paginator's properties has been triggered. */
  _emitPageEvent(previousPageIndex) {
    this.page.emit({
      previousPageIndex,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.length
    });
  }
  static {
    this.\u0275fac = function MatPaginator_Factory(t) {
      return new (t || _MatPaginator)(\u0275\u0275directiveInject(MatPaginatorIntl), \u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(MAT_PAGINATOR_DEFAULT_OPTIONS, 8));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _MatPaginator,
      selectors: [["mat-paginator"]],
      hostAttrs: ["role", "group", 1, "mat-mdc-paginator"],
      inputs: {
        color: "color",
        pageIndex: [InputFlags.HasDecoratorInputTransform, "pageIndex", "pageIndex", numberAttribute],
        length: [InputFlags.HasDecoratorInputTransform, "length", "length", numberAttribute],
        pageSize: [InputFlags.HasDecoratorInputTransform, "pageSize", "pageSize", numberAttribute],
        pageSizeOptions: "pageSizeOptions",
        hidePageSize: [InputFlags.HasDecoratorInputTransform, "hidePageSize", "hidePageSize", booleanAttribute],
        showFirstLastButtons: [InputFlags.HasDecoratorInputTransform, "showFirstLastButtons", "showFirstLastButtons", booleanAttribute],
        selectConfig: "selectConfig",
        disabled: [InputFlags.HasDecoratorInputTransform, "disabled", "disabled", booleanAttribute]
      },
      outputs: {
        page: "page"
      },
      exportAs: ["matPaginator"],
      standalone: true,
      features: [\u0275\u0275InputTransformsFeature, \u0275\u0275StandaloneFeature],
      decls: 14,
      vars: 14,
      consts: [[1, "mat-mdc-paginator-outer-container"], [1, "mat-mdc-paginator-container"], [1, "mat-mdc-paginator-page-size"], [1, "mat-mdc-paginator-range-actions"], ["aria-live", "polite", 1, "mat-mdc-paginator-range-label"], ["mat-icon-button", "", "type", "button", 1, "mat-mdc-paginator-navigation-first", 3, "matTooltip", "matTooltipDisabled", "matTooltipPosition", "disabled"], ["mat-icon-button", "", "type", "button", 1, "mat-mdc-paginator-navigation-previous", 3, "click", "matTooltip", "matTooltipDisabled", "matTooltipPosition", "disabled"], ["viewBox", "0 0 24 24", "focusable", "false", "aria-hidden", "true", 1, "mat-mdc-paginator-icon"], ["d", "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"], ["mat-icon-button", "", "type", "button", 1, "mat-mdc-paginator-navigation-next", 3, "click", "matTooltip", "matTooltipDisabled", "matTooltipPosition", "disabled"], ["d", "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"], ["mat-icon-button", "", "type", "button", 1, "mat-mdc-paginator-navigation-last", 3, "matTooltip", "matTooltipDisabled", "matTooltipPosition", "disabled"], [1, "mat-mdc-paginator-page-size-label"], [1, "mat-mdc-paginator-page-size-select", 3, "appearance", "color"], [1, "mat-mdc-paginator-page-size-value"], ["hideSingleSelectionIndicator", "", 3, "selectionChange", "value", "disabled", "aria-labelledby", "panelClass", "disableOptionCentering"], [3, "value"], ["mat-icon-button", "", "type", "button", 1, "mat-mdc-paginator-navigation-first", 3, "click", "matTooltip", "matTooltipDisabled", "matTooltipPosition", "disabled"], ["d", "M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"], ["mat-icon-button", "", "type", "button", 1, "mat-mdc-paginator-navigation-last", 3, "click", "matTooltip", "matTooltipDisabled", "matTooltipPosition", "disabled"], ["d", "M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"]],
      template: function MatPaginator_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
          \u0275\u0275template(2, MatPaginator_Conditional_2_Template, 5, 4, "div", 2);
          \u0275\u0275elementStart(3, "div", 3)(4, "div", 4);
          \u0275\u0275text(5);
          \u0275\u0275elementEnd();
          \u0275\u0275template(6, MatPaginator_Conditional_6_Template, 3, 5, "button", 5);
          \u0275\u0275elementStart(7, "button", 6);
          \u0275\u0275listener("click", function MatPaginator_Template_button_click_7_listener() {
            return ctx.previousPage();
          });
          \u0275\u0275namespaceSVG();
          \u0275\u0275elementStart(8, "svg", 7);
          \u0275\u0275element(9, "path", 8);
          \u0275\u0275elementEnd()();
          \u0275\u0275namespaceHTML();
          \u0275\u0275elementStart(10, "button", 9);
          \u0275\u0275listener("click", function MatPaginator_Template_button_click_10_listener() {
            return ctx.nextPage();
          });
          \u0275\u0275namespaceSVG();
          \u0275\u0275elementStart(11, "svg", 7);
          \u0275\u0275element(12, "path", 10);
          \u0275\u0275elementEnd()();
          \u0275\u0275template(13, MatPaginator_Conditional_13_Template, 3, 5, "button", 11);
          \u0275\u0275elementEnd()()();
        }
        if (rf & 2) {
          \u0275\u0275advance(2);
          \u0275\u0275conditional(2, !ctx.hidePageSize ? 2 : -1);
          \u0275\u0275advance(3);
          \u0275\u0275textInterpolate1(" ", ctx._intl.getRangeLabel(ctx.pageIndex, ctx.pageSize, ctx.length), " ");
          \u0275\u0275advance();
          \u0275\u0275conditional(6, ctx.showFirstLastButtons ? 6 : -1);
          \u0275\u0275advance();
          \u0275\u0275property("matTooltip", ctx._intl.previousPageLabel)("matTooltipDisabled", ctx._previousButtonsDisabled())("matTooltipPosition", "above")("disabled", ctx._previousButtonsDisabled());
          \u0275\u0275attribute("aria-label", ctx._intl.previousPageLabel);
          \u0275\u0275advance(3);
          \u0275\u0275property("matTooltip", ctx._intl.nextPageLabel)("matTooltipDisabled", ctx._nextButtonsDisabled())("matTooltipPosition", "above")("disabled", ctx._nextButtonsDisabled());
          \u0275\u0275attribute("aria-label", ctx._intl.nextPageLabel);
          \u0275\u0275advance(3);
          \u0275\u0275conditional(13, ctx.showFirstLastButtons ? 13 : -1);
        }
      },
      dependencies: [MatFormField, MatSelect, MatOption, MatIconButton, MatTooltip],
      styles: [".mat-mdc-paginator{display:block;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;color:var(--mat-paginator-container-text-color);background-color:var(--mat-paginator-container-background-color);font-family:var(--mat-paginator-container-text-font);line-height:var(--mat-paginator-container-text-line-height);font-size:var(--mat-paginator-container-text-size);font-weight:var(--mat-paginator-container-text-weight);letter-spacing:var(--mat-paginator-container-text-tracking);--mat-form-field-container-height:var(--mat-paginator-form-field-container-height);--mat-form-field-container-vertical-padding:var(--mat-paginator-form-field-container-vertical-padding)}.mat-mdc-paginator .mat-mdc-select-value{font-size:var(--mat-paginator-select-trigger-text-size)}.mat-mdc-paginator .mat-mdc-form-field-subscript-wrapper{display:none}.mat-mdc-paginator .mat-mdc-select{line-height:1.5}.mat-mdc-paginator-outer-container{display:flex}.mat-mdc-paginator-container{display:flex;align-items:center;justify-content:flex-end;padding:0 8px;flex-wrap:wrap;width:100%;min-height:var(--mat-paginator-container-size)}.mat-mdc-paginator-page-size{display:flex;align-items:baseline;margin-right:8px}[dir=rtl] .mat-mdc-paginator-page-size{margin-right:0;margin-left:8px}.mat-mdc-paginator-page-size-label{margin:0 4px}.mat-mdc-paginator-page-size-select{margin:0 4px;width:84px}.mat-mdc-paginator-range-label{margin:0 32px 0 24px}.mat-mdc-paginator-range-actions{display:flex;align-items:center}.mat-mdc-paginator-icon{display:inline-block;width:28px;fill:var(--mat-paginator-enabled-icon-color)}.mat-mdc-icon-button[disabled] .mat-mdc-paginator-icon{fill:var(--mat-paginator-disabled-icon-color)}[dir=rtl] .mat-mdc-paginator-icon{transform:rotate(180deg)}.cdk-high-contrast-active .mat-mdc-icon-button[disabled] .mat-mdc-paginator-icon,.cdk-high-contrast-active .mat-mdc-paginator-icon{fill:currentColor;fill:CanvasText}.cdk-high-contrast-active .mat-mdc-paginator-range-actions .mat-mdc-icon-button{outline:solid 1px}"],
      encapsulation: 2,
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatPaginator, [{
    type: Component,
    args: [{
      selector: "mat-paginator",
      exportAs: "matPaginator",
      host: {
        "class": "mat-mdc-paginator",
        "role": "group"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation$1.None,
      standalone: true,
      imports: [MatFormField, MatSelect, MatOption, MatIconButton, MatTooltip],
      template: `<div class="mat-mdc-paginator-outer-container">
  <div class="mat-mdc-paginator-container">
    @if (!hidePageSize) {
      <div class="mat-mdc-paginator-page-size">
        <div class="mat-mdc-paginator-page-size-label" [attr.id]="_pageSizeLabelId">
          {{_intl.itemsPerPageLabel}}
        </div>

        @if (_displayedPageSizeOptions.length > 1) {
          <mat-form-field
            [appearance]="_formFieldAppearance!"
            [color]="color"
            class="mat-mdc-paginator-page-size-select">
            <mat-select
              [value]="pageSize"
              [disabled]="disabled"
              [aria-labelledby]="_pageSizeLabelId"
              [panelClass]="selectConfig.panelClass || ''"
              [disableOptionCentering]="selectConfig.disableOptionCentering"
              (selectionChange)="_changePageSize($event.value)"
              hideSingleSelectionIndicator>
              @for (pageSizeOption of _displayedPageSizeOptions; track pageSizeOption) {
                <mat-option [value]="pageSizeOption">
                  {{pageSizeOption}}
                </mat-option>
              }
            </mat-select>
          </mat-form-field>
        }

        @if (_displayedPageSizeOptions.length <= 1) {
          <div class="mat-mdc-paginator-page-size-value">{{pageSize}}</div>
        }
      </div>
    }

    <div class="mat-mdc-paginator-range-actions">
      <div class="mat-mdc-paginator-range-label" aria-live="polite">
        {{_intl.getRangeLabel(pageIndex, pageSize, length)}}
      </div>

      @if (showFirstLastButtons) {
        <button mat-icon-button type="button"
                class="mat-mdc-paginator-navigation-first"
                (click)="firstPage()"
                [attr.aria-label]="_intl.firstPageLabel"
                [matTooltip]="_intl.firstPageLabel"
                [matTooltipDisabled]="_previousButtonsDisabled()"
                [matTooltipPosition]="'above'"
                [disabled]="_previousButtonsDisabled()">
          <svg class="mat-mdc-paginator-icon"
              viewBox="0 0 24 24"
              focusable="false"
              aria-hidden="true">
            <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/>
          </svg>
        </button>
      }
      <button mat-icon-button type="button"
              class="mat-mdc-paginator-navigation-previous"
              (click)="previousPage()"
              [attr.aria-label]="_intl.previousPageLabel"
              [matTooltip]="_intl.previousPageLabel"
              [matTooltipDisabled]="_previousButtonsDisabled()"
              [matTooltipPosition]="'above'"
              [disabled]="_previousButtonsDisabled()">
        <svg class="mat-mdc-paginator-icon"
             viewBox="0 0 24 24"
             focusable="false"
             aria-hidden="true">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>
      <button mat-icon-button type="button"
              class="mat-mdc-paginator-navigation-next"
              (click)="nextPage()"
              [attr.aria-label]="_intl.nextPageLabel"
              [matTooltip]="_intl.nextPageLabel"
              [matTooltipDisabled]="_nextButtonsDisabled()"
              [matTooltipPosition]="'above'"
              [disabled]="_nextButtonsDisabled()">
        <svg class="mat-mdc-paginator-icon"
             viewBox="0 0 24 24"
             focusable="false"
             aria-hidden="true">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </button>
      @if (showFirstLastButtons) {
        <button mat-icon-button type="button"
                class="mat-mdc-paginator-navigation-last"
                (click)="lastPage()"
                [attr.aria-label]="_intl.lastPageLabel"
                [matTooltip]="_intl.lastPageLabel"
                [matTooltipDisabled]="_nextButtonsDisabled()"
                [matTooltipPosition]="'above'"
                [disabled]="_nextButtonsDisabled()">
          <svg class="mat-mdc-paginator-icon"
              viewBox="0 0 24 24"
              focusable="false"
              aria-hidden="true">
            <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/>
          </svg>
        </button>
      }
    </div>
  </div>
</div>
`,
      styles: [".mat-mdc-paginator{display:block;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;color:var(--mat-paginator-container-text-color);background-color:var(--mat-paginator-container-background-color);font-family:var(--mat-paginator-container-text-font);line-height:var(--mat-paginator-container-text-line-height);font-size:var(--mat-paginator-container-text-size);font-weight:var(--mat-paginator-container-text-weight);letter-spacing:var(--mat-paginator-container-text-tracking);--mat-form-field-container-height:var(--mat-paginator-form-field-container-height);--mat-form-field-container-vertical-padding:var(--mat-paginator-form-field-container-vertical-padding)}.mat-mdc-paginator .mat-mdc-select-value{font-size:var(--mat-paginator-select-trigger-text-size)}.mat-mdc-paginator .mat-mdc-form-field-subscript-wrapper{display:none}.mat-mdc-paginator .mat-mdc-select{line-height:1.5}.mat-mdc-paginator-outer-container{display:flex}.mat-mdc-paginator-container{display:flex;align-items:center;justify-content:flex-end;padding:0 8px;flex-wrap:wrap;width:100%;min-height:var(--mat-paginator-container-size)}.mat-mdc-paginator-page-size{display:flex;align-items:baseline;margin-right:8px}[dir=rtl] .mat-mdc-paginator-page-size{margin-right:0;margin-left:8px}.mat-mdc-paginator-page-size-label{margin:0 4px}.mat-mdc-paginator-page-size-select{margin:0 4px;width:84px}.mat-mdc-paginator-range-label{margin:0 32px 0 24px}.mat-mdc-paginator-range-actions{display:flex;align-items:center}.mat-mdc-paginator-icon{display:inline-block;width:28px;fill:var(--mat-paginator-enabled-icon-color)}.mat-mdc-icon-button[disabled] .mat-mdc-paginator-icon{fill:var(--mat-paginator-disabled-icon-color)}[dir=rtl] .mat-mdc-paginator-icon{transform:rotate(180deg)}.cdk-high-contrast-active .mat-mdc-icon-button[disabled] .mat-mdc-paginator-icon,.cdk-high-contrast-active .mat-mdc-paginator-icon{fill:currentColor;fill:CanvasText}.cdk-high-contrast-active .mat-mdc-paginator-range-actions .mat-mdc-icon-button{outline:solid 1px}"]
    }]
  }], () => [{
    type: MatPaginatorIntl
  }, {
    type: ChangeDetectorRef
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [MAT_PAGINATOR_DEFAULT_OPTIONS]
    }]
  }], {
    color: [{
      type: Input
    }],
    pageIndex: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    length: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    pageSize: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    pageSizeOptions: [{
      type: Input
    }],
    hidePageSize: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    showFirstLastButtons: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    selectConfig: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    page: [{
      type: Output
    }]
  });
})();
var MatPaginatorModule = class _MatPaginatorModule {
  static {
    this.\u0275fac = function MatPaginatorModule_Factory(t) {
      return new (t || _MatPaginatorModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
      type: _MatPaginatorModule
    });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
      providers: [MAT_PAGINATOR_INTL_PROVIDER],
      imports: [MatButtonModule, MatSelectModule, MatTooltipModule, MatPaginator]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatPaginatorModule, [{
    type: NgModule,
    args: [{
      imports: [MatButtonModule, MatSelectModule, MatTooltipModule, MatPaginator],
      exports: [MatPaginator],
      providers: [MAT_PAGINATOR_INTL_PROVIDER]
    }]
  }], null, null);
})();

// src/app/core/services/log.service.ts
var LogService = class _LogService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${environment.apiUrl}/logs`;
  }
  getLogs(filters) {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== void 0 && value !== null && value !== "") {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get(`${this.apiUrl}/`, { params });
  }
  getCategories() {
    return this.http.get(`${this.apiUrl}/categories`);
  }
  getLevels() {
    return this.http.get(`${this.apiUrl}/levels`);
  }
  static {
    this.\u0275fac = function LogService_Factory(t) {
      return new (t || _LogService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LogService, factory: _LogService.\u0275fac, providedIn: "root" });
  }
};

// src/app/features/logs/logs.component.ts
var _forTrack0 = ($index, $item) => $item.id;
var _c0 = () => [25, 50, 100];
function LogsComponent_For_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const level_r1 = ctx.$implicit;
    \u0275\u0275property("value", level_r1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(level_r1);
  }
}
function LogsComponent_For_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cat_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("value", cat_r2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.getCategoryLabel(cat_r2));
  }
}
function LogsComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-progress-bar", 8);
  }
}
function LogsComponent_For_29_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const log_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(log_r4.source);
  }
}
function LogsComponent_For_29_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "details", 22)(1, "summary");
    \u0275\u0275text(2, "D\xE9tails");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "pre");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "json");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const log_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, log_r4.details));
  }
}
function LogsComponent_For_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14)(1, "div", 15)(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 16)(5, "div", 17)(6, "mat-chip", 18);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "mat-chip");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275template(10, LogsComponent_For_29_Conditional_10_Template, 2, 1, "span", 19);
    \u0275\u0275elementStart(11, "span", 20);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "p", 21);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275template(15, LogsComponent_For_29_Conditional_15_Template, 6, 3, "details", 22);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const log_r4 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r2.getLevelClass(log_r4.level));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.getLevelIcon(log_r4.level));
    \u0275\u0275advance(3);
    \u0275\u0275classMap(ctx_r2.getLevelClass(log_r4.level));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(log_r4.level);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.getCategoryLabel(log_r4.category));
    \u0275\u0275advance();
    \u0275\u0275conditional(10, log_r4.source ? 10 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.formatDate(log_r4.created_at));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(log_r4.message);
    \u0275\u0275advance();
    \u0275\u0275conditional(15, log_r4.details ? 15 : -1);
  }
}
function LogsComponent_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "mat-icon");
    \u0275\u0275text(2, "receipt_long");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "Aucun log trouv\xE9");
    \u0275\u0275elementEnd()();
  }
}
var LogsComponent = class _LogsComponent {
  constructor(logService) {
    this.logService = logService;
    this.logs = [];
    this.loading = true;
    this.filterLevel = "";
    this.filterCategory = "";
    this.limit = 50;
    this.offset = 0;
    this.totalLogs = 0;
    this.levels = ["DEBUG", "INFO", "WARNING", "ERROR"];
    this.categories = ["user_action", "system", "scenario", "error"];
  }
  ngOnInit() {
    this.loadLogs();
  }
  loadLogs() {
    this.loading = true;
    this.logService.getLogs({
      level: this.filterLevel || void 0,
      category: this.filterCategory || void 0,
      limit: this.limit,
      offset: this.offset
    }).subscribe({
      next: (logs) => {
        this.logs = logs;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  onPageChange(event) {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.loadLogs();
  }
  resetFilters() {
    this.filterLevel = "";
    this.filterCategory = "";
    this.offset = 0;
    this.loadLogs();
  }
  getLevelIcon(level) {
    switch (level) {
      case "ERROR":
        return "error";
      case "WARNING":
        return "warning";
      case "INFO":
        return "info";
      case "DEBUG":
        return "bug_report";
      default:
        return "circle";
    }
  }
  getLevelClass(level) {
    return `level-${level.toLowerCase()}`;
  }
  getCategoryLabel(category) {
    const labels = {
      user_action: "Utilisateur",
      system: "Syst\xE8me",
      scenario: "Sc\xE9nario",
      error: "Erreur"
    };
    return labels[category] || category;
  }
  formatDate(date) {
    return new Date(date).toLocaleString("fr-FR");
  }
  static {
    this.\u0275fac = function LogsComponent_Factory(t) {
      return new (t || _LogsComponent)(\u0275\u0275directiveInject(LogService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LogsComponent, selectors: [["app-logs"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 32, vars: 8, consts: [[1, "page-container", "fade-in"], [1, "page-header"], ["mat-stroked-button", "", 3, "click"], [1, "filters-row"], ["appearance", "outline", 1, "filter-field"], [3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], ["mode", "indeterminate", "color", "accent"], [1, "thidom-card", "logs-table-card"], [1, "logs-list"], [1, "log-entry", 3, "class"], [1, "empty-state"], [3, "page", "length", "pageSize", "pageSizeOptions"], [1, "log-entry"], [1, "log-icon"], [1, "log-content"], [1, "log-header-row"], [1, "level-chip"], [1, "log-source"], [1, "log-time"], [1, "log-message"], [1, "log-details"]], template: function LogsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1");
        \u0275\u0275text(3, "Logs");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "button", 2);
        \u0275\u0275listener("click", function LogsComponent_Template_button_click_4_listener() {
          return ctx.resetFilters();
        });
        \u0275\u0275elementStart(5, "mat-icon");
        \u0275\u0275text(6, "filter_list_off");
        \u0275\u0275elementEnd();
        \u0275\u0275text(7, " R\xE9initialiser filtres ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(8, "div", 3)(9, "mat-form-field", 4)(10, "mat-label");
        \u0275\u0275text(11, "Niveau");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "mat-select", 5);
        \u0275\u0275twoWayListener("ngModelChange", function LogsComponent_Template_mat_select_ngModelChange_12_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filterLevel, $event) || (ctx.filterLevel = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function LogsComponent_Template_mat_select_ngModelChange_12_listener() {
          return ctx.loadLogs();
        });
        \u0275\u0275elementStart(13, "mat-option", 6);
        \u0275\u0275text(14, "Tous");
        \u0275\u0275elementEnd();
        \u0275\u0275repeaterCreate(15, LogsComponent_For_16_Template, 2, 2, "mat-option", 7, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(17, "mat-form-field", 4)(18, "mat-label");
        \u0275\u0275text(19, "Cat\xE9gorie");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(20, "mat-select", 5);
        \u0275\u0275twoWayListener("ngModelChange", function LogsComponent_Template_mat_select_ngModelChange_20_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filterCategory, $event) || (ctx.filterCategory = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function LogsComponent_Template_mat_select_ngModelChange_20_listener() {
          return ctx.loadLogs();
        });
        \u0275\u0275elementStart(21, "mat-option", 6);
        \u0275\u0275text(22, "Toutes");
        \u0275\u0275elementEnd();
        \u0275\u0275repeaterCreate(23, LogsComponent_For_24_Template, 2, 2, "mat-option", 7, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(25, LogsComponent_Conditional_25_Template, 1, 0, "mat-progress-bar", 8);
        \u0275\u0275elementStart(26, "div", 9)(27, "div", 10);
        \u0275\u0275repeaterCreate(28, LogsComponent_For_29_Template, 16, 11, "div", 11, _forTrack0);
        \u0275\u0275elementEnd();
        \u0275\u0275template(30, LogsComponent_Conditional_30_Template, 5, 0, "div", 12);
        \u0275\u0275elementStart(31, "mat-paginator", 13);
        \u0275\u0275listener("page", function LogsComponent_Template_mat_paginator_page_31_listener($event) {
          return ctx.onPageChange($event);
        });
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(12);
        \u0275\u0275twoWayProperty("ngModel", ctx.filterLevel);
        \u0275\u0275advance(3);
        \u0275\u0275repeater(ctx.levels);
        \u0275\u0275advance(5);
        \u0275\u0275twoWayProperty("ngModel", ctx.filterCategory);
        \u0275\u0275advance(3);
        \u0275\u0275repeater(ctx.categories);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(25, ctx.loading ? 25 : -1);
        \u0275\u0275advance(3);
        \u0275\u0275repeater(ctx.logs);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(30, ctx.logs.length === 0 && !ctx.loading ? 30 : -1);
        \u0275\u0275advance();
        \u0275\u0275property("length", 1e3)("pageSize", ctx.limit)("pageSizeOptions", \u0275\u0275pureFunction0(7, _c0));
      }
    }, dependencies: [
      CommonModule,
      JsonPipe,
      FormsModule,
      NgControlStatus,
      NgModel,
      MatCardModule,
      MatIconModule,
      MatIcon,
      MatButtonModule,
      MatButton,
      MatFormFieldModule,
      MatFormField,
      MatLabel,
      MatInputModule,
      MatSelectModule,
      MatSelect,
      MatOption,
      MatProgressBarModule,
      MatProgressBar,
      MatChipsModule,
      MatChip,
      MatPaginatorModule,
      MatPaginator
    ], styles: ["\n\n.filters-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n  margin-bottom: 20px;\n}\n.filters-row[_ngcontent-%COMP%]   .filter-field[_ngcontent-%COMP%] {\n  min-width: 180px;\n}\n.logs-table-card[_ngcontent-%COMP%]   .logs-list[_ngcontent-%COMP%] {\n  max-height: calc(100vh - 320px);\n  overflow-y: auto;\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  padding: 12px;\n  border-bottom: 1px solid var(--thidom-border);\n  transition: background 0.2s;\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.02);\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry[_ngcontent-%COMP%]   .log-icon[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  width: 32px;\n  height: 32px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry[_ngcontent-%COMP%]   .log-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 20px;\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry.level-error[_ngcontent-%COMP%]   .log-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #f44336;\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry.level-warning[_ngcontent-%COMP%]   .log-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #ff9800;\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry.level-info[_ngcontent-%COMP%]   .log-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #42a5f5;\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry.level-debug[_ngcontent-%COMP%]   .log-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #9e9e9e;\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry[_ngcontent-%COMP%]   .log-content[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry[_ngcontent-%COMP%]   .log-content[_ngcontent-%COMP%]   .log-header-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n  margin-bottom: 4px;\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry[_ngcontent-%COMP%]   .log-content[_ngcontent-%COMP%]   .log-header-row[_ngcontent-%COMP%]   .level-chip[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  min-height: 22px;\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry[_ngcontent-%COMP%]   .log-content[_ngcontent-%COMP%]   .log-header-row[_ngcontent-%COMP%]   .level-chip.level-error[_ngcontent-%COMP%] {\n  background: rgba(244, 67, 54, 0.15) !important;\n  color: #f44336 !important;\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry[_ngcontent-%COMP%]   .log-content[_ngcontent-%COMP%]   .log-header-row[_ngcontent-%COMP%]   .level-chip.level-warning[_ngcontent-%COMP%] {\n  background: rgba(255, 152, 0, 0.15) !important;\n  color: #ff9800 !important;\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry[_ngcontent-%COMP%]   .log-content[_ngcontent-%COMP%]   .log-header-row[_ngcontent-%COMP%]   .level-chip.level-info[_ngcontent-%COMP%] {\n  background: rgba(66, 165, 245, 0.15) !important;\n  color: #42a5f5 !important;\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry[_ngcontent-%COMP%]   .log-content[_ngcontent-%COMP%]   .log-header-row[_ngcontent-%COMP%]   .level-chip.level-debug[_ngcontent-%COMP%] {\n  background: rgba(158, 158, 158, 0.15) !important;\n  color: #9e9e9e !important;\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry[_ngcontent-%COMP%]   .log-content[_ngcontent-%COMP%]   .log-header-row[_ngcontent-%COMP%]   .log-source[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: var(--thidom-green);\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry[_ngcontent-%COMP%]   .log-content[_ngcontent-%COMP%]   .log-header-row[_ngcontent-%COMP%]   .log-time[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: var(--thidom-text-secondary);\n  margin-left: auto;\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry[_ngcontent-%COMP%]   .log-content[_ngcontent-%COMP%]   .log-message[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  color: var(--thidom-text-primary);\n  margin: 0;\n  line-height: 1.4;\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry[_ngcontent-%COMP%]   .log-content[_ngcontent-%COMP%]   .log-details[_ngcontent-%COMP%] {\n  margin-top: 8px;\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry[_ngcontent-%COMP%]   .log-content[_ngcontent-%COMP%]   .log-details[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: var(--thidom-text-secondary);\n  cursor: pointer;\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry[_ngcontent-%COMP%]   .log-content[_ngcontent-%COMP%]   .log-details[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]:hover {\n  color: var(--thidom-green);\n}\n.logs-table-card[_ngcontent-%COMP%]   .log-entry[_ngcontent-%COMP%]   .log-content[_ngcontent-%COMP%]   .log-details[_ngcontent-%COMP%]   pre[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: var(--thidom-text-secondary);\n  background: rgba(0, 0, 0, 0.2);\n  padding: 8px;\n  border-radius: 4px;\n  overflow-x: auto;\n  margin-top: 4px;\n}\n.empty-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 40px 20px;\n  color: var(--thidom-text-secondary);\n}\n.empty-state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  width: 48px;\n  height: 48px;\n  margin-bottom: 12px;\n  opacity: 0.4;\n}\n.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  color: var(--thidom-text-primary);\n}\n/*# sourceMappingURL=logs.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LogsComponent, { className: "LogsComponent", filePath: "src\\app\\features\\logs\\logs.component.ts", lineNumber: 35 });
})();
export {
  LogsComponent
};
//# sourceMappingURL=chunk-7KYWUUGP.js.map
