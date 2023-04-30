import { Component, OnInit } from "@angular/core"
import {
    NgbDropdownConfig,
    NgbTabChangeEvent,
    NgbTabsetConfig,
    NgbModal,
} from "@ng-bootstrap/ng-bootstrap"



import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
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

import { Deal, DealService,CodeService} from "../../../../core/erp"

@Component({
  selector: 'kt-create-deal',
  templateUrl: './create-deal.component.html',
  styleUrls: ['./create-deal.component.scss']
})
export class CreateDealComponent implements OnInit {

  deal: Deal
  dealForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  isExist = false
  error = false;
  msg: String;

  
  deal_inv_meth: any[] = [];
  deal_pay_meth: any[] = [];
  deal_status: any[] = [];

  constructor(
      config: NgbDropdownConfig,
      private dealFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private dealService: DealService,
      private codeService: CodeService,
  ) {
      config.autoClose = true
      this.codeService
        .getBy({ code_fldname: "deal_pay_meth" })
        .subscribe((response: any) => (this.deal_pay_meth = response.data))
      this.codeService
        .getBy({ code_fldname: "deal_inv_meth" })
        .subscribe((response: any) => (this.deal_inv_meth = response.data))
      this.codeService
        .getBy({ code_fldname: "deal_status" })
        .subscribe((response: any) => (this.deal_status = response.data))  
  }

  ngOnInit(): void {
      this.loading$ = this.loadingSubject.asObservable()
      this.loadingSubject.next(false)
      this.createForm()
  }
  //create form
  createForm() {
    this.loadingSubject.next(false)
      this.deal = new Deal()
      this.dealForm = this.dealFB.group({
          deal_code: [this.deal.deal_code, Validators.required],
          deal_desc: [{ value: this.deal.deal_desc, disabled: !this.isExist },  Validators.required ],
          
          deal_start_date: [{ value: this.deal.deal_start_date, disabled: !this.isExist }],
          deal_end_date: [{ value: this.deal.deal_end_date, disabled: !this.isExist }],
          
          deal_amt: [{ value: this.deal.deal_amt, disabled: !this.isExist }],
          deal_inv_meth: [{ value: this.deal.deal_inv_meth, disabled: !this.isExist }],
          deal_pay_meth: [{ value: this.deal.deal_pay_meth, disabled: !this.isExist }],
          
          deal_pen_cust: [{ value: this.deal.deal_pen_cust, disabled: !this.isExist }],
          deal_pen_prov: [{ value: this.deal.deal_pen_prov, disabled: !this.isExist }],
          deal_delai_cust: [{ value: this.deal.deal_delai_cust, disabled: !this.isExist }],
          deal_delai_prov: [{ value: this.deal.deal_delai_prov, disabled: !this.isExist }],

          deal_sign_cust: [{ value: this.deal.deal_sign_cust, disabled: !this.isExist }],
          deal_sign_prov: [{ value: this.deal.deal_sign_prov, disabled: !this.isExist }],

          
          deal_open: [{ value: this.deal.deal_open, disabled: !this.isExist }],
          deal_status: [{ value: this.deal.deal_status, disabled: !this.isExist }],
          
      })
  }
  
  onChangeCode() {
      const controls = this.dealForm.controls
      this.dealService
          .getBy({
                deal_code: controls.deal_code.value,
                

          })
          .subscribe((response: any) => {
              if (response.data.length) {
                  this.isExist = true
                  console.log(response.data.length)
              } else {
                  controls.deal_desc.enable()
                  controls.deal_start_date.enable()
                  controls.deal_end_date.enable()
                  controls.deal_amt.enable()
                  controls.deal_pay_meth.enable()
                  controls.deal_inv_meth.enable()

                  controls.deal_pen_cust.enable()
                  controls.deal_pen_prov.enable()
                  controls.deal_delai_cust.enable()
                  controls.deal_delai_prov.enable()

                  controls.deal_sign_cust.enable()
                  controls.deal_sign_prov.enable()
        
                  
                  controls.deal_open.enable() 
                  controls.deal_status.enable()

              }
             
       })
     
    }


    
  
  //reste form
  reset() {
      this.deal = new Deal()
      this.createForm()
      this.hasFormErrors = false
  }
  // save data
  onSubmit() {
      this.hasFormErrors = false
      const controls = this.dealForm.controls
      /** check form */
      if (this.dealForm.invalid) {
          Object.keys(controls).forEach((controlName) =>
              controls[controlName].markAsTouched()
          )

          this.hasFormErrors = true
          return
      }

      // tslint:disable-next-line:prefer-const
      let deal = this.prepareDeal()
      this.addDeal(deal)
  }
  /**
   * Returns object for saving
   */
  prepareDeal(): Deal {
      const controls = this.dealForm.controls
      const _deal = new Deal()
      _deal.deal_code = controls.deal_code.value
      _deal.deal_desc= controls.deal_desc.value
      _deal.deal_amt= controls.deal_amt.value
      _deal.deal_pay_meth= controls.deal_pay_meth.value
      _deal.deal_inv_meth= controls.deal_inv_meth.value
      

      _deal.deal_pen_cust= controls.deal_pen_cust.value
      _deal.deal_pen_prov= controls.deal_pen_prov.value
      _deal.deal_delai_cust= controls.deal_delai_cust.value
      _deal.deal_delai_prov= controls.deal_delai_prov.value

      _deal.deal_sign_cust= controls.deal_sign_cust.value
      _deal.deal_sign_prov= controls.deal_sign_prov.value

      _deal.deal_open= controls.deal_open.value
      _deal.deal_status= controls.deal_status.value
      
      _deal.deal_start_date = controls.deal_start_date.value
      ? `${controls.deal_start_date.value.year}/${controls.deal_start_date.value.month}/${controls.deal_start_date.value.day}`
      : null
  _deal.deal_end_date = controls.deal_end_date.value
      ? `${controls.deal_end_date.value.year}/${controls.deal_end_date.value.month}/${controls.deal_end_date.value.day}`
      : null

      return _deal
  }
  /**
   * Add code
   *
   * @param _code: CodeModel
   */
  addDeal(_deal: Deal) {
      this.loadingSubject.next(true)
      this.dealService.add(_deal).subscribe(
          (reponse) => console.log("response", Response),
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
                  "Ajout avec succès",
                  MessageType.Create,
                  10000,
                  true,
                  true
              )
              this.loadingSubject.next(false)
              this.router.navigateByUrl("/")
          }
      )
  }

  /**
   * Go back to the list
   *
   */
  goBack() {
      this.loadingSubject.next(false)
      const url = `/`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }




 
}
