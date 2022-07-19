import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
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
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap"
import { Taxe, AccountService, CodeService, TaxeService} from "../../../../core/erp"
@Component({
  selector: 'kt-create-tax',
  templateUrl: './create-tax.component.html',
  styleUrls: ['./create-tax.component.scss'],
})
export class CreateTaxComponent implements OnInit {

  taxForm: FormGroup
  taxe: Taxe
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

// selects
  tx2_tax_type: any[] = []
  tx2_pt_taxc: any[] = []

  angularGrid: AngularGridInstance
    grid: any
    gridService: GridService
    dataView: any
    columnDefinitions: Column[]
    gridOptions: GridOption
    dataset: any[]

  accounts: []
    columnDefinitions4: Column[] = []
    gridOptions4: GridOption = {}
    gridObj4: any
    angularGrid4: AngularGridInstance

    row_number

  constructor(
    config: NgbDropdownConfig,
    private taxFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private taxService: TaxeService,
    private codeService: CodeService,
    private accountsService: AccountService
    ) {
     config.autoClose = true
     this.codeService
            .getBy({ code_fldname: "tx2_tax_type" })
            .subscribe((response: any) => (this.tx2_tax_type = response.data))
        this.codeService
            .getBy({ code_fldname: "tx2_pt_taxc" })
            .subscribe((response: any) => (this.tx2_pt_taxc = response.data))
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.createForm()
  }
    //create form
    createForm() {
      this.loadingSubject.next(false)

      this.taxe = new Taxe()
      this.taxForm = this.taxFB.group({
          tx2_tax_type: [this.taxe.tx2_tax_type, Validators.required],
          tx2_tax_code: [this.taxe.tx2_tax_code, Validators.required],
          tx2_pt_taxc:  [{ value: this.taxe.tx2_pt_taxc, disabled: !this.isExist },Validators.required],
          tx2_desc:     [{ value: this.taxe.tx2_desc, disabled: !this.isExist },Validators.required],
          tx2_tax_pct:  [{ value: this.taxe.tx2_tax_pct, disabled: !this.isExist }],
          tx2_by_line:  [{ value: this.taxe.tx2_by_line, disabled: !this.isExist }],
          tx2_base:  [{ value: this.taxe.tx2_base, disabled: !this.isExist }],
          tx2_pct_recv:  [{ value: this.taxe.tx2_pct_recv, disabled: !this.isExist }],
          tx2_effdate:  [{ value: this.taxe.tx2_effdate, disabled: !this.isExist }],
          tx2_exp_date:  [{ value: this.taxe.tx2_exp_date, disabled: !this.isExist }],
          tx2_update_tax:  [{ value: this.taxe.tx2_update_tax, disabled: !this.isExist }],
          tx2_rcpt_tax_point:  [{ value: this.taxe.tx2_rcpt_tax_point, disabled: !this.isExist }],
          tx2_tax_in:  [{ value: this.taxe.tx2_tax_in, disabled: !this.isExist }],
          tx2_usage_tax_point:  [{ value: this.taxe.tx2_usage_tax_point, disabled: !this.isExist }],
          tx2_ar_acct:  [{ value: this.taxe.tx2_ar_acct, disabled: !this.isExist }],
          tx2_ara_acct:  [{ value: this.taxe.tx2_ara_acct, disabled: !this.isExist }],
          tx2_ap_acct:  [{ value: this.taxe.tx2_ap_acct, disabled: !this.isExist }],
          tx2_apr_acct:  [{ value: this.taxe.tx2_apr_acct, disabled: !this.isExist }],
          tx2_stx_acct:  [{ value: this.taxe.tx2_stx_acct, disabled: !this.isExist }],
          tx2_ar_disc_acct:  [{ value: this.taxe.tx2_ar_disc_acct, disabled: !this.isExist }],
          tx2_ap_disc_acct:  [{ value: this.taxe.tx2_ap_disc_acct, disabled: !this.isExist }],
          
      })
  }
  onChangeCode() {
    const controls = this.taxForm.controls
    this.taxService
        .getBy({
            tx2_tax_type: controls.tx2_tax_type.value,
            tx2_tax_code: controls.tx2_tax_code.value,
        })
        .subscribe((response: any) => {
            console.log(response)
            if (response.data) {
                this.isExist = true
                console.log(response.data.length)
            } else {
                
                controls.tx2_pt_taxc.enable() 
                controls.tx2_desc.enable() 
                controls.tx2_tax_pct.enable() 
                controls.tx2_by_line.enable() 
                controls.tx2_base.enable() 
                controls.tx2_pct_recv.enable() 
                controls.tx2_effdate.enable() 
                controls.tx2_exp_date.enable() 
                controls.tx2_update_tax.enable() 
                controls.tx2_rcpt_tax_point.enable() 
                controls.tx2_tax_in.enable() 
                controls.tx2_usage_tax_point.enable() 
                controls.tx2_ar_acct.enable() 
                controls.tx2_ara_acct.enable() 
                controls.tx2_ap_acct.enable() 
                controls.tx2_apr_acct.enable() 
                controls.tx2_stx_acct.enable() 
                controls.tx2_ar_disc_acct.enable() 
                controls.tx2_ap_disc_acct.enable()               
            }
        })
  }
  //reste form
  reset() {
    this.taxe = new Taxe()
    this.createForm()
    this.hasFormErrors = false
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false
    const controls = this.taxForm.controls
    /** check form */
    if (this.taxForm.invalid) {
        Object.keys(controls).forEach((controlName) =>
            controls[controlName].markAsTouched()
        )

        this.hasFormErrors = true
        return
    }

    // tslint:disable-next-line:prefer-const
    let address = this.prepareCode()
    this.addCode(address)
}
/**
 * Returns object for saving
 */
prepareCode(): Taxe {
  const controls = this.taxForm.controls
  const _taxe = new Taxe()
  _taxe.tx2_tax_type = controls.tx2_tax_type.value
  _taxe.tx2_tax_code = controls.tx2_tax_code.value
 
  _taxe.tx2_pt_taxc = controls.tx2_pt_taxc.value
  _taxe.tx2_desc = controls.tx2_desc.value
  _taxe.tx2_tax_pct = controls.tx2_tax_pct.value
  _taxe.tx2_by_line = controls.tx2_by_line.value
  _taxe.tx2_base = controls.tx2_base.value
  _taxe.tx2_pct_recv = controls.tx2_pct_recv.value

  _taxe.tx2_effdate = controls.tx2_effdate.value
      ? `${controls.tx2_effdate.value.year}/${controls.tx2_effdate.value.month}/${controls.tx2_effdate.value.day}`
      : null
  _taxe.tx2_exp_date = controls.tx2_exp_date.value
      ? `${controls.tx2_exp_date.value.year}/${controls.tx2_exp_date.value.month}/${controls.tx2_exp_date.value.day}`
      : null

  _taxe.tx2_update_tax = controls.tx2_update_tax.value
  _taxe.tx2_rcpt_tax_point = controls.tx2_rcpt_tax_point.value
  _taxe.tx2_tax_in = controls.tx2_tax_in.value
  _taxe.tx2_usage_tax_point = controls.tx2_usage_tax_point.value

  _taxe.tx2_ar_acct = controls.tx2_ar_acct.value 
  _taxe.tx2_ara_acct = controls.tx2_ara_acct.value
  _taxe.tx2_ap_acct = controls.tx2_ap_acct.value 
  _taxe.tx2_apr_acct = controls.tx2_apr_acct.value 
  _taxe.tx2_stx_acct = controls.tx2_stx_acct.value 
  _taxe.tx2_ar_disc_acct = controls.tx2_ar_disc_acct.value 
  _taxe.tx2_ap_disc_acct = controls.tx2_ap_disc_acct.value 

  return _taxe
}

/**
     * Add code
     *
     * @param _code: CodeModel
     */
    addCode(_taxe: Taxe) {
      this.loadingSubject.next(true)
      this.taxService.add(_taxe).subscribe(
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
              this.router.navigateByUrl("/code-mstr/codes-list")
          }
      )
  }

  /**
   * Go back to the list
   *
   */
  goBack() {
      this.loadingSubject.next(false)
      const url = `/accounting-setting/taxes-list`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }


  handleSelectedRowsChanged4(e, args) {
    const controls = this.taxForm.controls
    if (Array.isArray(args.rows) && this.gridObj4) {
        args.rows.map((idx) => {
            const item = this.gridObj4.getDataItem(idx)
            controls.tx2_ar_acct.setValue(item.ac_code || "")
        })
    }
}
handleSelectedRowsChanged3(e, args) {
  const controls = this.taxForm.controls
  if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
          const item = this.gridObj4.getDataItem(idx)
          controls.tx2_ara_acct.setValue(item.ac_code || "")
      })
  }
}

handleSelectedRowsChanged2(e, args) {
  const controls = this.taxForm.controls
  if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
          const item = this.gridObj4.getDataItem(idx)
          controls.tx2_ap_acct.setValue(item.ac_code || "")
      })
  }
}
handleSelectedRowsChanged1(e, args) {
  const controls = this.taxForm.controls
  if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
          const item = this.gridObj4.getDataItem(idx)
          controls.tx2_apr_acct.setValue(item.ac_code || "")
      })
  }
}
handleSelectedRowsChanged5(e, args) {
  const controls = this.taxForm.controls
  if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
          const item = this.gridObj4.getDataItem(idx)
          controls.tx2_stx_acct.setValue(item.ac_code || "")
      })
  }
}
handleSelectedRowsChanged6(e, args) {
  const controls = this.taxForm.controls
  if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
          const item = this.gridObj4.getDataItem(idx)
          controls.tx2_ar_disc_acct.setValue(item.ac_code || "")
      })
  }
}

handleSelectedRowsChanged7(e, args) {
  const controls = this.taxForm.controls
  if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
          const item = this.gridObj4.getDataItem(idx)
          controls.tx2_ap_disc_acct.setValue(item.ac_code || "")
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
            id: "ac_code",
            name: "code ",
            field: "ac_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "ac_desc",
            name: "Description",
            field: "ac_desc",
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
  this.accountsService
      .getAll()
      .subscribe((response: any) => (this.accounts = response.data))
}
open4(content) {
    this.prepareGrid4()
    this.modalService.open(content, { size: "lg" })
}



}
