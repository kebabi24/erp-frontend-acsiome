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
import { environment } from "../../../../../environments/environment"
/**
 * ! Just example => Should be removed in development
 */
const DEMO_PARAMS = {
    EMAIL: "admin@demo.com",
    PASSWORD: "demo",
}
const instance = "Instance : " + environment.Instance 
const key = environment.key
@Component({
    selector: "kt-login",
    templateUrl: "./login.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit, OnDestroy {
    // Public params
    loginForm: FormGroup
    loading = false
    isLoggedIn$: Observable<boolean>
    errors: any = []
    // instance: any

    private unsubscribe: Subject<any>

    private returnUrl: any

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
            console.log(params)
            this.returnUrl = params.returnUrl || "/"
        })
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this.authNoticeService.setNotice(null)
        this.unsubscribe.next()
        this.unsubscribe.complete()
        this.loading = false
    }

    /**
     * Form initalization
     * Default params, validators
     */
    initLoginForm() {
        // demo message to show

        this.loginForm = this.fb.group({
            userName: [
                "",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
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
        document.getElementById("instance").innerHTML = instance;
    }

    /**
     * Form Submit
     */
    submit() {
        const controls = this.loginForm.controls
        /** check form */
        if (this.loginForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )
            return
        }

        this.loading = true

        const authData = {
            userName: controls.userName.value,
            password: controls.password.value,
        }
        this.auth
            .login(authData.userName, authData.password,key)

            .subscribe(
                (res: any) => {
                    const {
                        data: { user, token , domain},
					} = res
					this.store.dispatch(new Login({authToken: token}));
                    localStorage.setItem("user", JSON.stringify(user))
                    localStorage.setItem("token", JSON.stringify(token))
                    localStorage.setItem("domain", JSON.stringify(domain))
                    this.router.navigateByUrl(this.returnUrl) // Main page
                },
                (err) =>{
                console.log("hhhhh",err.error.message)
                    this.authNoticeService.setNotice(
                        this.translate.instant(
                            err.error.message
                        ),
                        "danger"
                    ),
                        
                () => {
                    this.loading = false
                    this.cdr.markForCheck()
                }
                 }
            )

        // .pipe(
        // 	tap(res => {
        // 		console.log(res)
        // 		// if (user) {
        // 		// 	this.store.dispatch(new Login({authToken: user.accessToken}));
        // 		// 	this.router.navigateByUrl(this.returnUrl); // Main page
        // 		// } else {
        // 		// 	this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
        // 		// }
        // 	}),
        // 	takeUntil(this.unsubscribe),
        // 	finalize(() => {
        // 		this.loading = false;
        // 		this.cdr.markForCheck();
        // 	})
        // )
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
}
