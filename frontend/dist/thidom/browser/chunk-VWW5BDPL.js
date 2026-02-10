import {
  AuthService,
  Router
} from "./chunk-TSNA4FOA.js";
import {
  MatProgressSpinner,
  MatProgressSpinnerModule
} from "./chunk-I7UA5NI6.js";
import {
  MatSnackBar,
  MatSnackBarModule
} from "./chunk-FZHVEDA5.js";
import {
  MatInput,
  MatInputModule
} from "./chunk-SJP3SAKT.js";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardTitle,
  MatFormField,
  MatFormFieldModule,
  MatLabel,
  MatSuffix
} from "./chunk-A3S6NR4S.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MatButton,
  MatButtonModule,
  MatIcon,
  MatIconButton,
  MatIconModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-3YNX47WL.js";
import {
  CommonModule,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
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
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-7ID3BB7P.js";

// src/app/features/auth/login/login.component.ts
function LoginComponent_Conditional_8_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 12);
  }
}
function LoginComponent_Conditional_8_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Se connecter ");
  }
}
function LoginComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-card", 4)(1, "mat-card-header")(2, "mat-card-title");
    \u0275\u0275text(3, "Connexion");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "mat-card-content")(5, "form", 5);
    \u0275\u0275listener("ngSubmit", function LoginComponent_Conditional_8_Template_form_ngSubmit_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.login());
    });
    \u0275\u0275elementStart(6, "mat-form-field", 6)(7, "mat-label");
    \u0275\u0275text(8, "Nom d'utilisateur");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "input", 7);
    \u0275\u0275twoWayListener("ngModelChange", function LoginComponent_Conditional_8_Template_input_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.username, $event) || (ctx_r1.username = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "mat-icon", 8);
    \u0275\u0275text(11, "person");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "mat-form-field", 6)(13, "mat-label");
    \u0275\u0275text(14, "Mot de passe");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "input", 9);
    \u0275\u0275twoWayListener("ngModelChange", function LoginComponent_Conditional_8_Template_input_ngModelChange_15_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.password, $event) || (ctx_r1.password = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "button", 10);
    \u0275\u0275listener("click", function LoginComponent_Conditional_8_Template_button_click_16_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.hidePassword = !ctx_r1.hidePassword);
    });
    \u0275\u0275elementStart(17, "mat-icon");
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "button", 11);
    \u0275\u0275template(20, LoginComponent_Conditional_8_Conditional_20_Template, 1, 0, "mat-spinner", 12)(21, LoginComponent_Conditional_8_Conditional_21_Template, 1, 0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "mat-card-actions", 13)(23, "button", 14);
    \u0275\u0275listener("click", function LoginComponent_Conditional_8_Template_button_click_23_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showRegister = true);
    });
    \u0275\u0275text(24, " Cr\xE9er un compte ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.username);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.password);
    \u0275\u0275property("type", ctx_r1.hidePassword ? "password" : "text");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.hidePassword ? "visibility_off" : "visibility");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.loading || !ctx_r1.username || !ctx_r1.password);
    \u0275\u0275advance();
    \u0275\u0275conditional(20, ctx_r1.loading ? 20 : 21);
  }
}
function LoginComponent_Conditional_9_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 12);
  }
}
function LoginComponent_Conditional_9_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " S'inscrire ");
  }
}
function LoginComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-card", 4)(1, "mat-card-header")(2, "mat-card-title");
    \u0275\u0275text(3, "Inscription");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "mat-card-content")(5, "form", 5);
    \u0275\u0275listener("ngSubmit", function LoginComponent_Conditional_9_Template_form_ngSubmit_5_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.register());
    });
    \u0275\u0275elementStart(6, "mat-form-field", 6)(7, "mat-label");
    \u0275\u0275text(8, "Nom d'utilisateur");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "input", 15);
    \u0275\u0275twoWayListener("ngModelChange", function LoginComponent_Conditional_9_Template_input_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.regUsername, $event) || (ctx_r1.regUsername = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "mat-icon", 8);
    \u0275\u0275text(11, "person");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "mat-form-field", 6)(13, "mat-label");
    \u0275\u0275text(14, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "input", 16);
    \u0275\u0275twoWayListener("ngModelChange", function LoginComponent_Conditional_9_Template_input_ngModelChange_15_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.regEmail, $event) || (ctx_r1.regEmail = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "mat-icon", 8);
    \u0275\u0275text(17, "email");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "mat-form-field", 6)(19, "mat-label");
    \u0275\u0275text(20, "Nom complet");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "input", 17);
    \u0275\u0275twoWayListener("ngModelChange", function LoginComponent_Conditional_9_Template_input_ngModelChange_21_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.regFullName, $event) || (ctx_r1.regFullName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "mat-icon", 8);
    \u0275\u0275text(23, "badge");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "mat-form-field", 6)(25, "mat-label");
    \u0275\u0275text(26, "Mot de passe");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "input", 18);
    \u0275\u0275twoWayListener("ngModelChange", function LoginComponent_Conditional_9_Template_input_ngModelChange_27_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.regPassword, $event) || (ctx_r1.regPassword = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "mat-icon", 8);
    \u0275\u0275text(29, "lock");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "button", 11);
    \u0275\u0275template(31, LoginComponent_Conditional_9_Conditional_31_Template, 1, 0, "mat-spinner", 12)(32, LoginComponent_Conditional_9_Conditional_32_Template, 1, 0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(33, "mat-card-actions", 13)(34, "button", 14);
    \u0275\u0275listener("click", function LoginComponent_Conditional_9_Template_button_click_34_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showRegister = false);
    });
    \u0275\u0275text(35, " Retour \xE0 la connexion ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.regUsername);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.regEmail);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.regFullName);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.regPassword);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r1.loading || !ctx_r1.regUsername || !ctx_r1.regEmail || !ctx_r1.regPassword);
    \u0275\u0275advance();
    \u0275\u0275conditional(31, ctx_r1.loading ? 31 : 32);
  }
}
var LoginComponent = class _LoginComponent {
  constructor(authService, router, snackBar) {
    this.authService = authService;
    this.router = router;
    this.snackBar = snackBar;
    this.username = "";
    this.password = "";
    this.loading = false;
    this.hidePassword = true;
    this.showRegister = false;
    this.regUsername = "";
    this.regEmail = "";
    this.regPassword = "";
    this.regFullName = "";
    if (this.authService.isLoggedIn) {
      this.router.navigate(["/dashboard"]);
    }
  }
  login() {
    if (!this.username || !this.password)
      return;
    this.loading = true;
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(["/dashboard"]);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.detail || "Identifiants incorrects", "Fermer", { duration: 4e3 });
      }
    });
  }
  register() {
    if (!this.regUsername || !this.regEmail || !this.regPassword)
      return;
    this.loading = true;
    this.authService.register(this.regUsername, this.regEmail, this.regPassword, this.regFullName).subscribe({
      next: () => {
        this.snackBar.open("Compte cr\xE9\xE9 avec succ\xE8s ! Connectez-vous.", "OK", { duration: 4e3 });
        this.showRegister = false;
        this.username = this.regUsername;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.detail || "Erreur lors de l'inscription", "Fermer", { duration: 4e3 });
      }
    });
  }
  static {
    this.\u0275fac = function LoginComponent_Factory(t) {
      return new (t || _LoginComponent)(\u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(MatSnackBar));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 10, vars: 2, consts: [[1, "login-page"], [1, "login-container", "fade-in"], [1, "login-logo"], ["src", "assets/logo.svg", "alt", "ThiDom"], [1, "login-card"], [3, "ngSubmit"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "name", "username", "required", "", "autocomplete", "username", 3, "ngModelChange", "ngModel"], ["matSuffix", ""], ["matInput", "", "name", "password", "required", "", "autocomplete", "current-password", 3, "ngModelChange", "ngModel", "type"], ["mat-icon-button", "", "matSuffix", "", "type", "button", 3, "click"], ["mat-raised-button", "", "color", "primary", "type", "submit", 1, "full-width", "login-btn", 3, "disabled"], ["diameter", "20"], ["align", "end"], ["mat-button", "", "color", "accent", 3, "click"], ["matInput", "", "name", "regUsername", "required", "", 3, "ngModelChange", "ngModel"], ["matInput", "", "name", "regEmail", "type", "email", "required", "", 3, "ngModelChange", "ngModel"], ["matInput", "", "name", "regFullName", 3, "ngModelChange", "ngModel"], ["matInput", "", "name", "regPassword", "type", "password", "required", "", 3, "ngModelChange", "ngModel"]], template: function LoginComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "img", 3);
        \u0275\u0275elementStart(4, "h1");
        \u0275\u0275text(5, "ThiDom");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "p");
        \u0275\u0275text(7, "Gestion domotique intelligente");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(8, LoginComponent_Conditional_8_Template, 25, 6, "mat-card", 4)(9, LoginComponent_Conditional_9_Template, 36, 6, "mat-card", 4);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(8);
        \u0275\u0275conditional(8, !ctx.showRegister ? 8 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(9, ctx.showRegister ? 9 : -1);
      }
    }, dependencies: [
      CommonModule,
      FormsModule,
      \u0275NgNoValidate,
      DefaultValueAccessor,
      NgControlStatus,
      NgControlStatusGroup,
      RequiredValidator,
      NgModel,
      NgForm,
      MatCardModule,
      MatCard,
      MatCardActions,
      MatCardContent,
      MatCardHeader,
      MatCardTitle,
      MatFormFieldModule,
      MatFormField,
      MatLabel,
      MatSuffix,
      MatInputModule,
      MatInput,
      MatButtonModule,
      MatButton,
      MatIconButton,
      MatIconModule,
      MatIcon,
      MatSnackBarModule,
      MatProgressSpinnerModule,
      MatProgressSpinner
    ], styles: ["\n\n.login-page[_ngcontent-%COMP%] {\n  height: 100vh;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background:\n    linear-gradient(\n      135deg,\n      var(--thidom-bg-primary) 0%,\n      var(--thidom-bg-secondary) 100%);\n}\n.login-container[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 420px;\n  padding: 24px;\n}\n.login-logo[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 32px;\n}\n.login-logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 80px;\n  height: 80px;\n  object-fit: contain;\n  margin-bottom: 12px;\n}\n.login-logo[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 2.2rem;\n  font-weight: 700;\n  color: var(--thidom-green);\n  letter-spacing: 2px;\n  margin-bottom: 4px;\n}\n.login-logo[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--thidom-text-secondary);\n  font-size: 0.95rem;\n}\n.login-card[_ngcontent-%COMP%] {\n  background: var(--thidom-bg-card);\n  border: 1px solid var(--thidom-border);\n  border-radius: 16px;\n  padding: 8px;\n}\n.login-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n.login-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%]   mat-card-title[_ngcontent-%COMP%] {\n  color: var(--thidom-text-primary);\n  font-weight: 400;\n}\n.login-card[_ngcontent-%COMP%]   .full-width[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-bottom: 4px;\n}\n.login-card[_ngcontent-%COMP%]   .login-btn[_ngcontent-%COMP%] {\n  height: 48px;\n  font-size: 1rem;\n  margin-top: 8px;\n  border-radius: 8px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n/*# sourceMappingURL=login.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src\\app\\features\\auth\\login\\login.component.ts", lineNumber: 31 });
})();
export {
  LoginComponent
};
//# sourceMappingURL=chunk-VWW5BDPL.js.map
