import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig,  NgbModal, } from "@ng-bootstrap/ng-bootstrap"

// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Editor,
    Editors,
    AngularGridInstance,
    FieldType, GridService
} from "angular-slickgrid"
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

import { Delivery,CodeService ,ItemService, DeliveryService } from "../../../../core/erp"
@Component({
  selector: 'kt-create-delivery',
  templateUrl: './create-delivery.component.html',
  styleUrls: ['./create-delivery.component.scss']
})
export class CreateDeliveryComponent implements OnInit {
  delivery: Delivery
  deliveryForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  del_desc: any
  del_cndt: any
  itemEdit: any
  items: []
  columnDefinitions4: Column[] = []
  gridOptions4: GridOption = {}
  gridObj4: any
  angularGrid4: AngularGridInstance

  constructor(
      config: NgbDropdownConfig,
      private deliveryFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private modalService: NgbModal,
      private deliveryService: DeliveryService,
      private codeService: CodeService,
      private itemService: ItemService
  ) {
      config.autoClose = true
      this.codeService
      .getBy({ code_fldname: "del_desc" })
      .subscribe((response: any) => (this.del_desc = response.data))

      this.codeService
      .getBy({ code_fldname: "pt_part_type" })
      .subscribe((response: any) => (this.del_cndt = response.data))
  }
  ngOnInit(): void {
      this.loading$ = this.loadingSubject.asObservable()
      this.loadingSubject.next(false)
      this.createForm()
     /* window.onload = () => {
        const lang = "fr"
        if ( lang == "fr") {
          this.onchangelabel() } else {
            
          }
      }*/
  }
 /* onchangelabel(){
      console.log("hhhhhhhhhhhhhhhlllllllllllllllllllllllllllllll")
            document.getElementById('fld').innerHTML = 'Couuuude';
          }*/
  //create form
  createForm() {
      this.loadingSubject.next(false)

      this.delivery = new Delivery()
      this.deliveryForm = this.deliveryFB.group({
          del_code: [this.delivery.del_code, Validators.required],
          del_desc: [
              { value: this.delivery.del_desc, disabled: !this.isExist },
              Validators.required,
          ],
          del_pct_disc: [{ value: this.delivery.del_pct_disc, disabled: !this.isExist }],

          del_part_gift: [{ value: this.delivery.del_part_gift, disabled: !this.isExist }],
          pt_desc1: [ "" ],
          del_pct_part_gift: [{ value: this.delivery.del_pct_part_gift, disabled: !this.isExist }],
          del_cndt_actif: [{ value: this.delivery.del_cndt_actif, disabled: true }],
          del_cndt: [{ value: this.delivery.del_cndt, disabled: true }],
          del_cndt_qty: [{ value: this.delivery.del_cndt_qty, disabled: !this.isExist }],

          del_valid: [{ value: this.delivery.del_valid, disabled: !this.isExist }],
          del_exp: [{ value: this.delivery.del_exp, disabled: !this.isExist }],
          del_start_offer: [{ value: this.delivery.del_start_offer, disabled: !this.isExist }],
          del_end_offer: [{ value: this.delivery.del_end_offer, disabled: !this.isExist }],
         
          actif: [{ value: this.delivery.actif, disabled: !this.isExist }],
          
      })
  }
  onChangeCode() {
      const controls = this.deliveryForm.controls
      this.deliveryService
          .getBy({
              del_code: controls.del_code.value,
          })
          .subscribe((response: any) => {
              if (response.data) {
                  this.isExist = true
                 console.log(response.data)
              } else {
                  controls.del_desc.enable()
                  controls.del_pct_disc.enable()

                  controls.del_part_gift.enable()
                  controls.del_pct_part_gift.enable()
                  controls.del_valid.enable()
                  controls.del_exp.enable()
                  controls.del_start_offer.enable()
                  controls.del_end_offer.enable()
                  controls.del_cndt_actif.enable()
                  controls.actif.enable()
              }
          })
  }
  //reste form
  reset() {
      this.delivery = new Delivery()
      this.createForm()
      this.hasFormErrors = false
  }
  // save data
  onSubmit() {
      this.hasFormErrors = false
      const controls = this.deliveryForm.controls
      /** check form */
      if (this.deliveryForm.invalid) {
          Object.keys(controls).forEach((controlName) =>
              controls[controlName].markAsTouched()
          )

          this.hasFormErrors = true
          return
      }

      // tslint:disable-next-line:prefer-const
      let delivery = this.prepareDelivery()
      this.addDelivery(delivery)
  }
  /**
   * Returns object for saving
   */
  prepareDelivery(): Delivery {
      const controls = this.deliveryForm.controls
      const _delivery = new Delivery()
      _delivery.del_code = controls.del_code.value
      _delivery.del_desc = controls.del_desc.value
      
      _delivery.del_pct_disc = controls.del_pct_disc.value

      _delivery.del_part_gift = controls.del_part_gift.value
      _delivery.del_pct_part_gift = controls.del_pct_part_gift.value
      _delivery.del_valid = controls.del_valid.value
          ? `${controls.del_valid.value.year}/${controls.del_valid.value.month}/${controls.del_valid.value.day}`
          : null
      _delivery.del_exp = controls.del_exp.value
          ? `${controls.del_exp.value.year}/${controls.del_exp.value.month}/${controls.del_exp.value.day}`
          : null
      _delivery.del_start_offer = controls.del_start_offer.value
      _delivery.del_end_offer = controls.del_end_offer.value
   
      _delivery.del_cndt_actif = controls.del_cndt_actif.value
      _delivery.del_cndt = controls.del_cndt.value
      _delivery.del_cndt_qty = controls.del_cndt_qty.value
      _delivery.actif = controls.actif.value
     
      return _delivery
  }
  onChangeCnd(){
    const controls = this.deliveryForm.controls
    
    if( controls.del_cndt_actif.value == true) {

        controls.del_cndt.enable()
        controls.del_cndt_qty.enable()
        controls.del_cndt.setValue(null)

    } else {
        controls.del_cndt.disable()
        controls.del_cndt_qty.disable()
        controls.del_cndt.setValue(null)
        controls.del_cndt_qty.setValue(null)
    }


  }
  /**
   * Add delivery
   *
   * @param _delivery: CodeModel
   */
  addDelivery(_delivery: Delivery) {
      this.loadingSubject.next(true)
      this.deliveryService.add(_delivery).subscribe(
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
              // this.router.navigateByUrl("/delivery-mstr/codes-list")
              this.reset()
          }
      )
  }

  /**
   * Go back to the list
   *
   */
  goBack() {
      this.loadingSubject.next(false)
      const url = `/pos-setting/list-delivery`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
  handleSelectedRowsChanged4(e, args) {
    const controls = this.deliveryForm.controls
   
    if (Array.isArray(args.rows) && this.gridObj4) {
        args.rows.map((idx) => {
            const item = this.gridObj4.getDataItem(idx)
            controls.del_part_gift.setValue(item.pt_part || "")

            controls.pt_desc1.setValue( item.pt_desc1 || "");
           
            this.itemEdit = item

        })
    }
}

angularGridReady4(angularGrid: AngularGridInstance) {
    this.angularGrid4 = angularGrid
    this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid4() {
    this.columnDefinitions4 = [
        {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
        },
        {
            id: "pt_part",
            name: "code ",
            field: "pt_part",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "pt_desc1",
            name: "desc",
            field: "pt_desc1",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "pt_um",
            name: "desc",
            field: "pt_um",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
    ]

    this.gridOptions4 = {
        enableSorting: true,
        enableCellNavigation: true,
        enableExcelCopyBuffer: true,
        enableFiltering: true,
        autoEdit: false,
        autoHeight: false,
        frozenColumn: 0,
        frozenBottom: true,
        enableRowSelection: true,
        enableCheckboxSelector: true,
        checkboxSelector: {
            // optionally change the column index position of the icon (defaults to 0)
            // columnIndexPosition: 1,

            // remove the unnecessary "Select All" checkbox in header when in single selection mode
            hideSelectAllCheckbox: true,

            // you can override the logic for showing (or not) the expand icon
            // for example, display the expand icon only on every 2nd row
            // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
        },
        multiSelect: false,
        rowSelectionOptions: {
            // True (Single Selection), False (Multiple Selections)
            selectActiveRow: true,
        },
    }

    // fill the dataset with your data
    this.itemService
        .getBy({pt_status:"PF-ACTIF"})
        .subscribe((response: any) => (this.items = response.data))
}
openpart(content) {
    this.prepareGrid4()
    this.modalService.open(content, { size: "lg" })
}
}
