// Angular
import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
// RxJS
import { Observable, Subject } from "rxjs"
import { finalize, takeUntil, tap } from "rxjs/operators"
// Translate
import { TranslateService } from "@ngx-translate/core"
// Store
import { Store } from "@ngrx/store"
import { AppState } from "../../../../core/reducers"
// Auth
import { AuthNoticeService, AuthService, Login } from "../../../../core/auth"
import { PatientService } from "src/app/core/erp/_services/patient.service"



@Component({
    selector: "kt-login",
    templateUrl: "./patient-login.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class PatientLoginComponent implements OnInit, OnDestroy {
    // Public params
    loginForm: FormGroup
    loading = false
    isLoggedIn$: Observable<boolean>
    errors: any = []

    private unsubscribe: Subject<any>

    private returnUrl: any

    isExist = false 
    phone = " "

  

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
        private patientService : PatientService,
        private authNoticeService: AuthNoticeService,
        private translate: TranslateService,
        private store: Store<AppState>,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute
    ) {
        this.unsubscribe = new Subject()
    }

    /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */

    /**
     * On init
     */
    ngOnInit(): void {

        this.initLoginForm()

        // redirect back to the returnUrl before login
        this.route.queryParams.subscribe((params) => {
            this.returnUrl = params.returnUrl || "/"
        })
    }

    ngOnDestroy(): void {
        this.authNoticeService.setNotice(null)
        this.unsubscribe.next()
        this.unsubscribe.complete()
        this.loading = false
    }

 
    initLoginForm() {
        // demo message to show

        this.loginForm = this.fb.group({         
            phone: [
                "",
                Validators.compose([
                  Validators.required, 
                  Validators.pattern("[0][567][0-9]{8}"),
                ]),
              ],
            password: [
                "",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(100),
                ]),
            ],
        })
    }

    submit() {
        const controls = this.loginForm.controls
        /** check form */
        // if (this.loginForm.invalid) {
        //     Object.keys(controls).forEach((controlName) =>
        //         controls[controlName].markAsTouched()
        //     )
        //     return
        // }

        // this.loading = true

        // const authData = {
        //     userName: controls.userName.value,
        //     password: controls.password.value,
        // }
        // this.auth
        //     .login(authData.userName, authData.password)

        //     .subscribe(
        //         (res: any) => {
        //             const {
        //                 data: { user, token , domain},
		// 			} = res
		// 			this.store.dispatch(new Login({authToken: token}));
        //             localStorage.setItem("user", JSON.stringify(user))
        //             localStorage.setItem("token", JSON.stringify(token))
        //             localStorage.setItem("domain", JSON.stringify(domain))
        //             this.router.navigateByUrl(this.returnUrl) // Main page
        //         },
        //         (err) =>
        //             this.authNoticeService.setNotice(
        //                 this.translate.instant(
        //                     "Erreur dans l'authentification"
        //                 ),
        //                 "danger"
        //             ),
        //         () => {
        //             this.loading = false
        //             this.cdr.markForCheck()
        //         }
        //     )
        this.goToRdv()
        
    }

    goToRdv(){
       console.log("heyyyy")
       this.router.navigateByUrl("/crm/agenda/");
    }

    /**
     * Checking control validation
     *
     * @param controlName: string => Equals to formControlName
     * @param validationType: string => Equals to valitors name
     */
    isControlHasError(controlName: string, validationType: string): boolean {
        const control = this.loginForm.controls[controlName]
        if (!control) {
            return false
        }

        const result =
            control.hasError(validationType) &&
            (control.dirty || control.touched)
        return result
    }


    onChangePhone() {
        const controls = this.loginForm.controls;
        const phone = controls.phone.value;
        this.phone = phone
         this.patientService.getOnePatientByPhone(phone).subscribe((res: any) => {
           if (res.data) {
            this.isExist = true
            // document.getElementById("phone").focus();
            controls.password.disable()
           } else {
               controls.password.enable();
            }
        });
    }
    
    goToSignupPage(){
      this.router.navigateByUrl("/auth/patient-signup/" +this.phone);
      console.log("Hello")
    }
}
