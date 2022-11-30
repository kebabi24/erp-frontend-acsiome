import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
} from "angular-slickgrid"
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of, Observer } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
import {MatSelectModule} from '@angular/material/select';
// Layout
import {
  SubheaderService,
  LayoutConfigService,
} from "../../../../core/_base/layout"
// CRUD
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud"
import { MatDialog } from "@angular/material/dialog"
import { SaleOrderService, printCustomerCAList, CustomerService } from "../../../../core/erp"
@Component({
  selector: 'kt-customer-satisfaction',
  templateUrl: './customer-satisfaction.component.html',
  styleUrls: ['./customer-satisfaction.component.scss']
})
export class CustomerSatisfactionComponent implements OnInit {
  imports:[ MatSelectModule ]
  satisfactionForm: FormGroup
  reclamationForm : FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

  order_code : String;
  status : String ;
  reclamation_causes : any = [];
  customeControls : Object = {};

  // name = new Observable<string>((observer: Observer<string>) => {
  //   setInterval(() => {
  //     observer.next("");

  //   }, 10);
  // });
  


  


  
  constructor(config: NgbDropdownConfig,
      private tagFB: FormBuilder,
      private fb: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private customerService: CustomerService,
      private layoutUtilsService: LayoutUtilsService,
      private modalService: NgbModal,
      private saleorderService: SaleOrderService) { config.autoClose = true}
      
  

  ngOnInit(): void {
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
          return false;
        };
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)

        this.getReclamationCauses()
        this.createReclamationForm()
        this.createForm()
}

getReclamationCauses(){

  this.customerService.getReclamationCauses().subscribe(
    (reponse) => {
      if(reponse['data'] != null){
        this.reclamation_causes = reponse['data']
        this.reclamation_causes.forEach(cause => {
          this.customeControls[cause.code_value] =new FormControl('')
          console.log(cause.code_value+'text-area')
          this.customeControls[cause.code_value+'text-area'] =new FormControl('')
        });
        this.customeControls['order_code']= new FormControl('')

        this.reclamationForm = this.tagFB.group({
          order_code: new FormControl(''),
          ...this.customeControls})

        }
      },
    (error) => {
        this.layoutUtilsService.showActionNotification(
            "Erreur lors de la récupération des données du backend",
            MessageType.Create,
            10000,
            true,
            true
        )
        this.loadingSubject.next(false)
    }, 
  )
}





createForm() {
  this.loadingSubject.next(false)
  

  this.satisfactionForm = this.tagFB.group({
    order_code:[''],
  })
}

createReclamationForm() {
  this.loadingSubject.next(false)
  

  this.reclamationForm = this.tagFB.group({
    order:[''],
  })
}

updateStatus(s){
  if(this.status !== s){
    this.status = s
    console.log('status updated to : \t'+ this.status)
  }
  
}

open(content) {
  this.updateStatus('angry')
  this.modalService.open(content, { size: "lg" })
}


//reste form
reset() {
  this.createForm()
  this.hasFormErrors = false
}


// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.satisfactionForm.controls
  this.order_code = controls.order_code.value

  /** check form */
  // if (this.reclamationForm.invalid) {
  //     Object.keys(controls).forEach((controlName) =>
  //         controls[controlName].markAsTouched()
  //     )
  
  //     this.hasFormErrors = true
  //     return
  // }
  var satisfactionData ={
    order_code : this.order_code,
    status: this.status
  }
  var complaintDetails = []

  if(this.status ==='angry'){
    
    const controlsReclamation = this.reclamationForm.controls
    this.reclamation_causes.forEach(cause => {
      if(controlsReclamation[cause.code_value].value){
        const code_value = cause.code_value
        const observation = controlsReclamation[cause.code_value+'text-area'].value
        complaintDetails.push({
          code_value:code_value,
          observation:observation
        })
        // console.log(cause.code_value+'\t')
        // console.log(controls[cause.code_value].value) // this is true if selected
        // console.log(controls[cause.code_value+'text-area'].value)
      }
    });
    console.log(complaintDetails)
  }
  

  this.customerService.createSatisfaction(satisfactionData,complaintDetails).subscribe(
    (reponse) => {
  
      console.log(reponse)
    },
    (error) => {
        this.layoutUtilsService.showActionNotification(
            "Erreur verifier les informations",
            MessageType.Create,
            10000,
            true,
            true
        )
        this.loadingSubject.next(false)
    },
    () => {
        this.layoutUtilsService.showActionNotification(
            "Feedback enregistr avec succès,merci !",
            MessageType.Create,
            10000,
            true,
            true
        )
        this.loadingSubject.next(false)
        // this.router.navigateByUrl("/customers-mobile/cluster-create")
    }
  )

  
}
 
/**
 * Add code
 *
 * @param _code: CodeModel
 */


/**
 * Go back to the list
 *
 */
goBack() {
    this.loadingSubject.next(false)
    const url = `/`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

saveComplaint(){
    document.getElementById('closeForm').click()
}

}