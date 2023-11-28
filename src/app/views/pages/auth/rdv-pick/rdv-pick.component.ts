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




import { NgbDateStruct, NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarOptions, FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import listPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import {Column, GridOption, AngularGridInstance, FieldType} from "angular-slickgrid"
import { Form, FormControl, } from "@angular/forms"
import { MatDialog ,MatDialogRef} from "@angular/material/dialog"
import {  BehaviorSubject, Subscription, of, Observer } from "rxjs"
import { OnEventArgs, GridService, Editors, thousandSeparatorFormatted, Formatters } from 'angular-slickgrid';
import frLocale from '@fullcalendar/core/locales/fr';
// import {AngularDateTimePickerModule} from 'angular2-datetimepicker'
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import {  NgbCalendar, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import {  EventInput } from '@fullcalendar/core';



@Component({
    selector: "kt-rdv-pick",
    templateUrl: "./rdv-pick.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class RdvPickComponent implements OnInit, OnDestroy {
    // Public params
    loginForm: FormGroup
    loading = false
    isLoggedIn$: Observable<boolean>
    errors: any = []

    private unsubscribe: Subject<any>

    private returnUrl: any

    isExist = false 
    phone = " "


    calendarOptions: CalendarOptions = {};
    events: any = [];
    data: any = [];

    component_name =""

    time = new Observable<string>((observer: Observer<string>) => {
        setInterval(() => {
          observer.next("");
        }, 1000);
      });




  

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
        this.getFreeSessions()
        // this.initCalendar()

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
            .login(authData.userName, authData.password)

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
                (err) =>
                    this.authNoticeService.setNotice(
                        this.translate.instant(
                            "Erreur dans l'authentification"
                        ),
                        "danger"
                    ),
                () => {
                    this.loading = false
                    this.cdr.markForCheck()
                }
            )

        
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


  
    goToSignupPage(){
      this.router.navigateByUrl("/auth/patient-signup/" +this.phone);
      console.log("Hello")
    }

    save(){}
    goBack(){}  

    initCalendar(){
        // this.events= [
        //     { title: '20 RDV', date: '2023-11-08' },
        //     { title: '16 RDV', date: '2023-11-09' },
        //     { title: '16 RDV', date: '2023-11-10' },
        //     { title: '6 RDV', date: '2023-11-11' },
        //     { title: '12 RDV', date: '2023-11-12' },
        //     { title: '0 RDV', date: '2023-11-20' },
        //   ]
        this.calendarOptions= {
              
            plugins: [ dayGridPlugin,listPlugin ,timeGrigPlugin ,interactionPlugin],
            height : "auto" ,
            locales: [frLocale ],
            locale:'fr',
            themeSystem: 'bootstrap5',
            headerToolbar: {
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridDay'
            },

            eventTimeFormat:{
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            },
            displayEventEnd:false,
            // initialView: 'dayGridMonth',
            initialView: 'dayGridDay',
            events: this.events,
            eventClick : (calDate) =>{
            //   this.eventClickHandler(calDate)
            console.log("event clicked")
            }
          };

          
       
          
    }

    getFreeSessions(){
        this.patientService
        .getFreeSessions()
  
        .subscribe(
            (res: any) => {
                this.data = res.data
                this.data.forEach(element => {
                    this.events.push({
                     title: element.nb_sessions.toString() +'Séance disponible', date: element.date
                    })
                   });
                   this.calendarOptions.events = this.events
                  
            },
            (err) =>{
                // this.layoutUtilsService.showActionNotification(
                //     "Erreur lors de l'ajout de la catégorie",
                //     MessageType.Create,
                //     10000,
                //     true,
                //     true
                //   ),
            },
            ()=>{
               this.data.forEach(element => {
                this.events.push({
                 title: element.nb_sessions.toString() +'Séance disponible', date: element.date
                })
               });

               this.initCalendar()
            }
        )
          
    }
}

