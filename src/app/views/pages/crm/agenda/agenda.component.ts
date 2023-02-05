
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { NgbDateStruct, NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarOptions, FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import listPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import {Column, GridOption, AngularGridInstance, FieldType} from "angular-slickgrid"
import { ActivatedRoute, Router } from "@angular/router"
import { Form, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms"
import { MatDialog ,MatDialogRef} from "@angular/material/dialog"
import { Observable, BehaviorSubject, Subscription, of, Observer } from "rxjs"
import { OnEventArgs, GridService, Editors, thousandSeparatorFormatted, Formatters } from 'angular-slickgrid';
import frLocale from '@fullcalendar/core/locales/fr';
// import {AngularDateTimePickerModule} from 'angular2-datetimepicker'
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import {  NgbCalendar, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import {  EventInput } from '@fullcalendar/core';


import { Category } from "../../../../core/erp/_models/pos-categories.model";
import {
  SubheaderService,
  LayoutConfigService,
} from "../../../../core/_base/layout"

import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud"


FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

import {CRMService,
} from "../../../../core/erp"
import { config } from 'process';
import * as moment from 'moment';
import { templateJitUrl } from '@angular/compiler';
import { K } from '@angular/cdk/keycodes';
export type ControlPosition = keyof typeof google.maps.ControlPosition;
@Component({
  selector: 'kt-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
  
})
export class AgendaComponent implements OnInit {
  posCategory : Category  
  hasaddresseFormErrors=false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$ : Observable<boolean>

  eventForm: FormGroup;
  executionForm: FormGroup;
  complaintForm : FormGroup;
  newEventForm : FormGroup;

  ableToSave : Boolean = false; // TRUE => SHOW SAVE BUTTON IN MODAL 1 ELSE DON'T SHOW IT
  eventIsComplaint : Boolean = false; // TRUE => SHOW REC DETAILS BUTTON IN MODAL 1 ELSE DON'T SHOW IT
  canAddNewEvent : Boolean = false; // TRUE => SHOW ADD EVENT BUTTON ; ELSE HIDE IT
  recreate_event : Boolean = false; // TRUE => RECREATE EVENT ; ELSE DON'T
  can_submit_line : Boolean = false; // TRUE => SEND TO BACKEND ; ELSE DON'T

  calendarOptions: CalendarOptions = {};
  events: any = [];  // for calendar 
  eventsData : any = []; // full data of events : stored here from database
  selectedEvent : any = {}  // the clicked event
  clientData : any = {};  // to store selected cliend data from database

  action_types : any = [];
  methods : any = [];
  categories: any = [];

  event_Results: any = [];
  customeControls: Object = {};
  executionLine: Object = {};
  eventHeader : Object = {};
  complaintData : Object = {};

  // FOR NEW EVENT POPUP
  filtered_categories :any = [];
  can_select_call : Boolean = false;
  result_string : String = "";
  



  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private crmService : CRMService,
    private layoutUtilsService: LayoutUtilsService,
    private calendar: NgbCalendar,
    config: NgbDropdownConfig
  
  ) {
    config.autoClose= true
    
   }

  ngOnInit(): void {
    //  this.KTCalendarBasic();
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)

    this.getParamsCategorties()
    this.getEventResults()
    // this.getTodayEvents()
    this.getActionTypes()
    this.getMethods()
    this.createFrom()
    this.createComplaintForm()
    this.createNewEventForm()
    this.init()
  }
  

  init(){
    // this.createCategoryForm()
    this.loadingSubject.next(false)
  }

  model: NgbDateStruct;
  new_event_date: { year: number; month: number };
  new_even_time = { hour: 13, minute: 30 };
  

  time = new Observable<string>((observer: Observer<string>) => {
    setInterval(() => {
      observer.next("");
    }, 1000);
  });

  createFrom(){
    this.eventForm = this.formBuilder.group({
      selectedAction: [ '', Validators.required],
      selectedMethod: [ '', Validators.required],
   })
  }

  createExecutionForm(){
    console.log("createExecutionForm called")
    this.executionForm = this.formBuilder.group({ 
      ...this.customeControls,
      observation :  new FormControl("")
    });
  }

  createComplaintForm(){
    this.complaintForm = this.formBuilder.group({ 
      // observation :  new FormControl("")
    });
  }

  createNewEventForm(){
    this.newEventForm = this.formBuilder.group({ 
      phone: [
        "",
        Validators.compose([
          Validators.required, 
          // Validators.maxLength(10),
          Validators.pattern("[0][567][0-9]{8}"),
        ]),
      ],
    });
  }

  goBack() {
    //this.loadingSubject.next(false)
    const url = `/customers-mobile`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
 
  onSubmit() {
    
      return
    
   
  }

  onAlertClose($event) {
    // this.hasFormErrors = false
  }

  open(content) {
    this.modalService.open(content, { size: "lg" });
  }

  open2(content) {
    this.modalService.open(content, { size: "lg" });
  }

  open3(content) {
    this.modalService.open(content, { size: "lg" });
  }

  open4(content) {
    this.modalService.open(content, { size: "lg" });
  }

  open5(content) {
    this.modalService.open(content, { size: "lg" });
  }

  open6(content) {
    this.modalService.open(content, { size: "lg" });
  }

  openDateTimePicker(event :any){
    // document.getElementById("6")
    console.log(event)
    const controls = this.executionForm.controls

    let selected_event_code = ""
    
    // get selected event results
    this.event_Results.forEach((event) => {
      if (controls[event.code_value].value === true) {
        if(event.code_desc === "Nouveau RDV") {
          this.canAddNewEvent = true
        }
        else{
          this.canAddNewEvent = false
        }
        selected_event_code = event.code_value;
        event.checked = true
      }else{
        event.checked = false
        controls[event.code_value].setValue(false)
      }
    });

    // select just one 
    this.event_Results.forEach(event => {
      if(event.code_value != selected_event_code ){
         console.log(event.code_value + "\t - \t  " +controls[event.code_value].value)
         event.checked = false
      }
      else{
        console.log(event.code_value + "\t - \t  " +controls[event.code_value].value)
        event.checked = true
      }
    });

    // console.log(this.event_Results)
  }

  opeNewRDVPopup(){
   document.getElementById("modal4Button").click(); 
  }

  saveNewEvent(){
    let newEvent = {}
    newEvent['code_event'] = this.selectedEvent.code_event 
    newEvent['order'] = 5
    newEvent['code_client'] = this.selectedEvent.code_client 
    newEvent['category'] = this.selectedEvent.category 
    newEvent['phone_to_call'] = this.selectedEvent.phone_to_call 
    newEvent['status'] = this.selectedEvent.status 
    newEvent['visibility'] = true
    newEvent['duration'] = this.selectedEvent.duration
    newEvent['action'] = this.selectedEvent.action
    newEvent['method'] = this.selectedEvent.method
    newEvent['event_day'] = this.model.year+'-'+this.model.month+'-'+this.model.day
    newEvent['hh'] = this.new_even_time.hour 
    newEvent['mn'] = this.new_even_time.minute 
    newEvent['ss'] = 0  

    this.crmService
      .createAgendaLine(newEvent)

      .subscribe(
        (res: any) => {
          console.log(res);
          document.getElementById("closeModal4").click(); 
        },
        (err) =>
          this.layoutUtilsService.showActionNotification(
            "Erreur lors de l'ajout de le event",
            MessageType.Create,
            10000,
            true,
            true
          ),
        () => {
          this.createFrom()
          this.layoutUtilsService.showActionNotification(
            "event créée avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
          // this.router.navigateByUrl("/auth/new-customer/");
        }
      );

    console.log(newEvent)
  }

  openComplaintModal(){
    document.getElementById("modal3Button").click();
    const phone = this.selectedEvent.code_client
    this.crmService.getComplaintData(phone).subscribe(
      (response) => {
        if (response["data"] != null) {
          this.complaintData = response["data"]
        }
      },
      (error) => {
        this.layoutUtilsService.showActionNotification(
          "Erreur lors de la récupération des données du backend",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.loadingSubject.next(false);
      }
    );
  }

  close(){
    this.eventIsComplaint = false
    document.getElementById("closeForm1").click();
  }

  // GET THE DISPLAY TEXT OF METHOD AND ACTION OF THE SELECTED EVENT
  getMethodActionDisplay(eventsData){
    eventsData.forEach(event =>{
      const indexMethod = this.methods.findIndex(method =>{
         return method.code_value == event.method
      })
      const indexAction = this.action_types.findIndex(action =>{
        return action.code_value == event.action
      })
      event.method_display = this.methods[indexMethod].code_desc
      event.action_display = this.action_types[indexAction].code_desc
    })
  }

  getCategoriesDisplay(eventsData){
    eventsData.forEach(event =>{
      const indexCategory = this.categories.findIndex(category =>{
         return category.code_value == event.category
      })
      event.category_display = this.categories[indexCategory].code_desc
      event.color =  this.categories[indexCategory].code_cmmt
    })
  }

  getCurrentTime(){
    const current = Date.now()
    const now  = new Date(current)
    const current_time = now.getHours().toString().padStart(2, '0')+':'+now.getMinutes().toString().padStart(2, '0')+':'+now.getSeconds().toString().padStart(2, '0')
    return current_time
  }

  // WHEN CLICKING ON AN EVENT FROM THE AGENDA
  eventClickHandler(calDate){
    this.getMethodActionDisplay(this.eventsData)
    const eventId = calDate.event.id
    const eventIndex = this.eventsData.findIndex(event =>{
      return event.id == eventId
    })
    this.selectedEvent = this.eventsData[eventIndex]
    this.selectedEvent.call_start_time = "00:00:00"
    this.selectedEvent.call_end_time = "00:00:00"
    this.getCustomerData(this.selectedEvent.phone_to_call)
    if(this.selectedEvent.category === "complaint"){
      this.eventIsComplaint = true
    }
    this.eventHeader['code_event'] = this.selectedEvent.code_event , 
    this.eventHeader['order'] = this.selectedEvent.order , 
    this.eventHeader['param_code'] = this.selectedEvent.param_code , 
    console.log(this.selectedEvent)
    document.getElementById("modalButton").click();
  }

  // START EVENT EXECUTION : PRESS EXECUTE IN MODAL 1 (EVENT INFO)
  executeEvent(){
    this.createExecutionForm()
    this.selectedEvent.call_start_time = this.getCurrentTime()
    document.getElementById("modal2Button").click();
  }

  // END EVENT EXECUTION : PRESS TERMINER IN MODAL 2 (EVENT INFO)
  saveExecutionLine(){
    let results = []

    // GET THE INFO OF THE SELECTED EVENT RESULT
    const controls = this.executionForm.controls
    this.event_Results.forEach((event) => {
      if (controls[event.code_value].value) {
        const code_value = event.code_value;
        const recall = event.bool01
        results.push({
          code_value: code_value,
          recall : recall
        });
      }
    });
    this.selectedEvent.call_end_time = this.getCurrentTime()

    var state = "O";
    if(results[0].recall === false) state = "T" 

    if(state !=="T" && this.selectedEvent.order == 4 && this.can_submit_line == false){
      this.openRenewPopup()
      this.can_submit_line = true
      return
    }

    this.executionLine = {
      event_day:this.selectedEvent.event_day,
      phone_to_call: this.selectedEvent.phone_to_call,
      status:state,
      duration:"not yet",
      action:this.selectedEvent.action,
      method:this.selectedEvent.method,
      call_hour:this.selectedEvent.call_start_time,
      call_end_hour:this.selectedEvent.call_end_time,
      observation:controls.observation.value,
      event_code : this.selectedEvent.code_event,
      event_result : results[0].code_value,
      category : this.selectedEvent.category
    }
    this.ableToSave = true
    this.eventIsComplaint = false
    document.getElementById("closeForm2").click();  
  }

  // SAVE EXECUTION LINE IN DATABASE
  submitExuctionLine(){
    const controls = this.eventForm.controls
    const selectedAction = controls.selectedAction.value
    const selectedMethod =  controls.selectedMethod.value
    if(selectedMethod !==""){     
      this.executionLine['method'] = selectedMethod
    }
    if(selectedAction !== ""){
      this.executionLine['action'] = selectedAction
    }

    this.crmService
      .createExecutionLine(this.executionLine, this.eventHeader,this.recreate_event)

      .subscribe(
        (res: any) => {
          console.log(res);
          this.selectedEvent={}
          this.eventHeader = {}
        },
        (err) =>
          this.layoutUtilsService.showActionNotification(
            "Erreur lors de l'ajout de la catégorie",
            MessageType.Create,
            10000,
            true,
            true
          ),
        () => {
          this.createFrom()
          this.layoutUtilsService.showActionNotification(
            "Ligne d'exécution créée avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
          // this.router.navigateByUrl("/auth/new-customer/");
        }
      );
      this.ableToSave = false
      this.executionLine = {}
      this.createExecutionForm()
      document.getElementById("closeForm1").click();
  }

  refresh(){
    
    this.crmService
      .getEventsToday()

      .subscribe(
        (res: any) => {
          this.eventsData = res.data
          this.calendarOptions.events = this.eventsData
          console.log("refreshed")
        },
        (err) =>
          this.layoutUtilsService.showActionNotification(
            "Erreur lors de l'ajout de la catégorie",
            MessageType.Create,
            10000,
            true,
            true
          ),
          ()=>{
            this.eventsData.forEach(event => {
              this.events.push({ 
                id: event.id,
                date:event.event_day,
                title:  event.category_display +'  '+ event.code_client +  ' ('+  event.order +' action)' , 
                start: event.event_day+'T'+event.hh.toString().padStart(2,"0")+':'+event.mn.toString().padStart(2,"0")+':'+event.ss.toString().padStart(2,"0") ,  
                end : event.event_day+'T'+event.hh.toString().padStart(2,"0")+':'+event.mn.toString().padStart(2,"0")+':'+55 ,
                color:event.color,
              })

             });

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
                this.eventClickHandler(calDate)
              }
            };

            
          }
        
      );
  } 

  openRenewPopup(){
    document.getElementById("modal5Button").click(); 
  }

  renew(val){
    if(val == true){
      console.log("recreate event : " + this.recreate_event)
      this.recreate_event = true
    }
    this.can_submit_line= true
    document.getElementById("closeModal5").click();
  }

  // ******************** NEW EVENT*****************************
  newEvent(){
    document.getElementById("modal6Button").click(); 
  }

  onChangePhone(){
    const controls = this.newEventForm.controls;
    const phone = controls.phone.value;
    this.crmService.getCustomerPhone(phone).subscribe((res: any) => {
      if (res.data) {
        console.log(res.data)
        this.can_select_call = true
        this.result_string="client existe"
        
        document.getElementById("phoneN").focus();
      } else {
        this.can_select_call = true
        this.result_string="client n'existe pas"

      }
    });
  }

  changeRoute(category_code){
    const controls = this.newEventForm.controls;
    const phone = controls.phone.value;
    if(category_code === "complaint"){
      
      this.crmService.createAgendaEventOrderZero(category_code,phone).subscribe(
        (res: any) => {
          window.open("/customers/customer-reclamation/"+phone)
        },
        (err) =>
          this.layoutUtilsService.showActionNotification(
            "Erreur lors de l'ajout de l'evenement'",
            MessageType.Create,
            10000,
            true,
            true
          ),
        () => {
          this.createFrom()
          this.layoutUtilsService.showActionNotification(
            "Ligne créée avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
          // this.router.navigateByUrl("/auth/new-customer/");
        
      });
      
      
    }else if(category_code === "pos_call_order"){
      this.crmService.createAgendaEventOrderZero(category_code,phone).subscribe(
        (res: any) => {
          window.open("/pos-visitor")
        },
        (err) =>
          this.layoutUtilsService.showActionNotification(
            "Erreur lors de l'ajout de l'evenement'",
            MessageType.Create,
            10000,
            true,
            true
          ),
        () => {
          this.createFrom()
          this.layoutUtilsService.showActionNotification(
            "Ligne créée avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
          // this.router.navigateByUrl("/auth/new-customer/");
        
      });
      
    }else{
      this.crmService.createAgendaEventOrderZero(category_code,phone).subscribe(
        (res: any) => {
          window.open("http://localhost:4200/customers/customer-reclamation")
        },
        (err) =>
          this.layoutUtilsService.showActionNotification(
            "Erreur lors de l'ajout de l'evenement'",
            MessageType.Create,
            10000,
            true,
            true
          ),
        () => {
          this.createFrom()
          this.layoutUtilsService.showActionNotification(
            "Ligne créée avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
          // this.router.navigateByUrl("/auth/new-customer/");
        
      });
    }
    this.can_select_call = false
  }

  // ***********************************************************
  // *******************  GETTERS ******************************
  // ***********************************************************

  getEventResults() {
    this.crmService.getEventResults().subscribe(
      (reponse) => {
        if (reponse["data"] != null) {
          this.event_Results = reponse["data"];

          this.event_Results.forEach((result) => {
            this.customeControls[result.code_value] = new FormControl("");
            result['checked'] = false
          });

          this.executionForm = this.formBuilder.group({ 
            ...this.customeControls,
            observation :  new FormControl("")
          });
        }
      },
      (error) => {
        this.layoutUtilsService.showActionNotification(
          "Erreur lors de la récupération des données du backend",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.loadingSubject.next(false);
      }
    );
  }

  getActionTypes() {
    this.crmService.getActionTypes().subscribe(
      (response) => {
        if (response["data"] != null) {
          this.action_types = response["data"]
        }
      },
      (error) => {
        this.layoutUtilsService.showActionNotification(
          "Erreur lors de la récupération des données du backend",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.loadingSubject.next(false);
      }
    );
  }

  getMethods() {
    this.crmService.getMethods().subscribe(
      (response) => {
        if (response["data"] != null) {
          this.methods = response["data"]
        }
      },
      (error) => {
        this.layoutUtilsService.showActionNotification(
          "Erreur lors de la récupération des données du backend",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.loadingSubject.next(false);
      }
    );
  }

  getParamsCategorties() {
    this.crmService.getCategories().subscribe(
      (response) => {
        if (response["data"] != null) {
          this.categories = response["data"]
          this.categories.forEach(category=>{
            if (category.bool01){
              this.filtered_categories.push(category)
            }
          })
          this.getTodayEvents()
        }
      },
      (error) => {
        this.layoutUtilsService.showActionNotification(
          "Erreur lors de la récupération des données du backend",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.loadingSubject.next(false);
      }
    );
  }

  // GET CUSTOMER DATA BY PHONE 
  getCustomerData(phone : any) {
    this.crmService.getCustomerData(phone).subscribe(
      (response) => {
        if (response["data"] != null) {
          this.clientData = response["data"]
        }
      },
      (error) => {
        this.layoutUtilsService.showActionNotification(
          "Erreur lors de la récupération des données du backend",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.loadingSubject.next(false);
      }
    );
  }

  getTodayEvents(){
    this.crmService
      .getEventsToday()

      .subscribe(
        (res: any) => {
          this.eventsData = res.data
          this.getCategoriesDisplay(this.eventsData)
          
        },
        (err) =>
          this.layoutUtilsService.showActionNotification(
            "Erreur lors de l'ajout de la catégorie",
            MessageType.Create,
            10000,
            true,
            true
          ),
          ()=>{
            this.eventsData.forEach(event => {
              this.events.push({ 
                id: event.id,
                date:event.event_day,
                title:  event.category_display +'  '+ event.code_client +  ' ('+  event.order +' action)' , 
                start: event.event_day+'T'+event.hh.toString().padStart(2,"0")+':'+event.mn.toString().padStart(2,"0")+':'+event.ss.toString().padStart(2,"0") ,  
                end : event.event_day+'T'+event.hh.toString().padStart(2,"0")+':'+event.mn.toString().padStart(2,"0")+':'+55 ,
                color:event.color,
              })

             });

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
                this.eventClickHandler(calDate)
              }
            };
          }
        
      );
  }

  getComplaintData(){

  }

}