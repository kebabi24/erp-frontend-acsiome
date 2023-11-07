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
import { Observable, Observer, Subject } from "rxjs";
import { finalize, takeUntil, tap } from "rxjs/operators";
// Translate
import { TranslateService } from "@ngx-translate/core";
// Store
import { Store } from "@ngrx/store";
import { AppState } from "../../../../core/reducers";
// Auth
import { AuthNoticeService, AuthService, Login } from "../../../../core/auth";
import { disableCursor } from "@fullcalendar/angular";
import { PatientService } from "src/app/core/erp";


/**
 * ! Just example => Should be removed in development
 */


@Component({
  selector: "kt-patient-signup",
  templateUrl: "./patient-signup.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class PatientSignupComponent implements OnInit, OnDestroy {
  imports: [MatSelectModule];
  // Public params
  loginForm: FormGroup;
  loading = false;
  isLoggedIn$: Observable<boolean>;
  errors: any = [];

  
  isExist = false;
  phone = ""

  

 
  

  private unsubscribe: Subject<any>;

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
    private patientService: PatientService,
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
    this.route.params.subscribe((params) => {
      this.phone = params["phone"];
    });
    this.initLoginForm();
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
        this.phone,
        Validators.compose([
          Validators.required, 
          // Validators.maxLength(10),
          Validators.pattern("[0][567][0-9]{8}"),
        ]),
      ],
      gender: ["", Validators.compose([])],
      email: [""],
      password: [""],
      birthdate: [""],
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

    const patient = {
      pat_fname: controls.name.value,
      pat_phone: this.phone,
      pat_birth_date : controls.birthdate.value,
      pat_sex: controls.gender.value,
      pat_password: controls.password.value,

    };
    this.patientService
      .addPatient(patient)

      .subscribe(
        (res: any) => {
          console.log(res);
        },
        (err) =>
          this.authNoticeService.setNotice(
            this.translate.instant("Erreur creation patient"),
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
          this.initLoginForm()
          this.cdr.markForCheck();
          this.loading = false;
         
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

  time = new Observable<string>((observer: Observer<string>) => {
    setInterval(() => {
      observer.next("");
    }, 1000);
  });

  
  onChangePhone(){
    
  }
  


 
}



