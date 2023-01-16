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
  
  
  /**
   * ! Just example => Should be removed in development
   */
  
  
  @Component({
    selector: "kt-login",
    templateUrl: "./new_shop.component.html",
    encapsulation: ViewEncapsulation.None,
  })
  export class NewShop implements OnInit, OnDestroy {
    imports: [MatSelectModule];
    // Public params
    loginForm: FormGroup;
    loading = false;
    isLoggedIn$: Observable<boolean>;
    errors: any = [];
  
    promo_code: any;
    isExist = false;
  
    promoExist: Boolean = true;
  
    wilayas_communes_data: any = [];
    wilayas: any = [];
    communes: any = [];
    promo: any = {};
    existed_customer : any = {};
    forbidFromPromo : Boolean = false ;
    
  
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
      this.getValidePromo();
      this.getWilayasCommunes();
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
          "",
          Validators.compose([
            Validators.required, 
            // Validators.maxLength(10),
            Validators.pattern("[0][567][0-9]{8}"),
          ]),
        ],
        age: ["", Validators.compose([Validators.maxLength(2)])],
        gender: ["", Validators.compose([])],
        wilaya: ["", Validators.compose([])],
        commune: ["", Validators.compose([])],
        email: [""],
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
  
      const newClientData = {
        name: controls.name.value,
        phone: controls.phone.value,
        age: controls.age.value,
        birthdate : controls.birthdate.value,
        gender: controls.gender.value,
        wilaya: controls.wilaya.value,
        commune: controls.commune.value,
        email: controls.email.value,
        promo_code: this.promo.code_value ,
        discount_pct: this.promo.dec01,
      };
      console.log(newClientData)
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
  
    time = new Observable<string>((observer: Observer<string>) => {
      setInterval(() => {
        observer.next("");
      }, 1000);
    });
  
    onChangePhone() {
      const controls = this.loginForm.controls;
      const phone = controls.phone.value;
      this.forbidFromPromo = false
      this.auth.getCustomerPhone(phone).subscribe((res: any) => {
        if (res.data) {
          this.existed_customer = res.data
          if(this.existed_customer.cm_promo === this.promo.code_value){
            this.loginForm.patchValue({
              name : '',
              gender :'',
              birthdate : '',
              wilaya : '',
              commune : '',
              email : '',
            })
            alert("vous avez déjà profité de cette promo")
            this.forbidFromPromo = true
          }else{
            this.forbidFromPromo = false
            this.loginForm.patchValue({
              name : this.existed_customer.cm_sort,
              gender : this.existed_customer.gender,
              birthdate : this.existed_customer.cm_high_date,
              wilaya : this.existed_customer.wilaya,
              commune : this.existed_customer.commune,
              email : this.existed_customer.email,
              
            })
          }
          
          // alert("Ce numéro de téléphone existe deja");
          // this.isExist = true;
          document.getElementById("phoneN").focus();
          //  controls.phone.disable()
        } else {
          controls.phone.enable();
          console.log(res);
        }
      });
    }
  
    getWilayasCommunes() {
      this.auth
        .getWilayasCommunes()
  
        .subscribe(
          (res: any) => {
            this.wilayas_communes_data = res.data;
            this.wilayas_communes_data.forEach((wilaya) => {
              this.wilayas.push(wilaya.wilaya);
            });
          },
          (err) =>
            this.authNoticeService.setNotice(
              this.translate.instant(
                "Erreur lors de la récupération des données"
              ),
              "danger"
            )
        );
    }
  
    getValidePromo() {
      this.auth
        .getValidePromo()
  
        .subscribe(
          (res: any) => {
            if (res.data != null) {
              console.log("promo exist");
              this.promoExist = true;
              this.promo = res.data;
              console.log(this.promo);
            } else {
              console.log("promo do not exist");
              this.promoExist = false;
            }
          },
          (err) =>
            this.authNoticeService.setNotice(
              this.translate.instant(
                "Erreur lors de la récupération des données"
              ),
              "danger"
            )
        );
    }
  
    onWilayaSelect() {
      const controls = this.loginForm.controls;
      const wilaya_code = controls.wilaya.value;
      const wilayaIndex = this.wilayas_communes_data.findIndex((wilaya) => {
        return wilaya.wilaya.code_value == wilaya_code;
      });
      this.communes = this.wilayas_communes_data[wilayaIndex].communes;
    }
  }
  
  
  
  