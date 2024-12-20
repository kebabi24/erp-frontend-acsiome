// Angular
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
// RxJS
import { Observable, Subject } from "rxjs";
import { finalize, takeUntil, tap } from "rxjs/operators";
// Translate
import { TranslateService } from "@ngx-translate/core";
// Store
import { Store } from "@ngrx/store";
import { AppState } from "../../../../core/reducers";
// Auth
import { AuthNoticeService, AuthService, Login } from "../../../../core/auth";

/**
 * ! Just example => Should be removed in development
 */
const DEMO_PARAMS = {
  EMAIL: "admin@demo.com",
  PASSWORD: "demo",
};

@Component({
  selector: "kt-login",
  templateUrl: "./new_customer.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class NewCustomerComponent implements OnInit, OnDestroy {
  imports: [MatSelectModule];
  // Public params
  loginForm: FormGroup;
  loading = false;
  isLoggedIn$: Observable<boolean>;
  errors: any = [];
  promo_code: any;
  isExist = false;
  private unsubscribe: Subject<any>;

  private returnUrl: any;

  // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  /**
   * Component constructor
   *
   * @param router: Router
   * @param auth: AuthService
   * @param authNoticeService: AuthNoticeService
   * @param translate: TranslateService
   * @param store: Store<AppState>
   * @param fb: FormBuilder
   * @param cdr
   * @param route
   */
  constructor(
    private router: Router,
    private auth: AuthService,
    private authNoticeService: AuthNoticeService,
    private translate: TranslateService,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private layoutUtilsService: LayoutUtilsService
  ) {
    this.unsubscribe = new Subject();
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit(): void {
    this.initLoginForm();

    // redirect back to the returnUrl before login
    this.route.queryParams.subscribe((params) => {
      this.returnUrl = params.returnUrl || "/";
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.authNoticeService.setNotice(null);
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  /**
   * Form initalization
   * Default params, validators
   */
  initLoginForm() {
    // demo message to show

    this.loginForm = this.fb.group({
      name: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      phone: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(10)]),
      ],
      age: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(2)]),
      ],
      gender: ["", Validators.compose([Validators.required])],
      commune: ["", Validators.compose([Validators.required])],
      email: [""],
    });
  }

  /**
   * Form Submit
   */
  submit() {
    const controls = this.loginForm.controls;
    /** check form */
    if (this.loginForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.loading = true;

    this.route.params.subscribe((params) => {
      this.promo_code = params["promo_code"];
    });

    const newClientData = {
      name: controls.name.value,
      phone: controls.phone.value,
      age: controls.age.value,
      gender: controls.gender.value,
      commune: controls.commune.value,
      email: controls.email.value,
      promo_code: this.promo_code,
      discount_pct: 0,
    };
    console.log(newClientData);
    this.auth
      .createNewCustomer(newClientData)

      .subscribe(
        (res: any) => {
          console.log(res);
        },
        (err) =>
          this.authNoticeService.setNotice(
            this.translate.instant("Erreur creation customer"),
            "danger"
          ),
        () => {
          this.layoutUtilsService.showActionNotification(
            "Données enregistrées avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.cdr.markForCheck();
          this.loading = false;
          // this.loadingSubject.next(false)
          this.router.navigateByUrl("/auth/new-customer/" + this.promo_code);
        }
      );
  }

  /**
   * Checking control validation
   *
   * @param controlName: string => Equals to formControlName
   * @param validationType: string => Equals to valitors name
   */
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.loginForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  onChangePhone() {
    const controls = this.loginForm.controls;
    const phone = controls.phone.value;
    this.auth.getCustomerPhone(phone).subscribe((res: any) => {
      //   console.log("response " + Object.keys(res.data));
      console.log(res);
      if (res.data) {
        alert("Ce numéro de téléphone existe deja");
        this.isExist = true;
        document.getElementById("phoneN").focus();
        //  controls.phone.disable()
      } else {
        controls.phone.enable();
        console.log(res);
      }
    });
  }
}
