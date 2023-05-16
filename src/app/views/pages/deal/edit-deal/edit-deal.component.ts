import { Component, OnInit } from "@angular/core"
import {
    NgbDropdownConfig,
    NgbTabChangeEvent,
    NgbTabsetConfig,
    NgbModal,
} from "@ng-bootstrap/ng-bootstrap"



// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  GridService,
  FieldType,
  Formatters,
  OnEventArgs,
} from "angular-slickgrid";

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

import { Deal, DealService,CodeService, CustomerService} from "../../../../core/erp"

@Component({
  selector: 'kt-edit-deal',
  templateUrl: './edit-deal.component.html',
  styleUrls: ['./edit-deal.component.scss']
})
export class EditDealComponent implements OnInit {

  
  deal: Deal
  dealForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  isExist = false
  error = false;
  msg: String;
  customers: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;

  
  dealEdit: any
  title: String = 'Modifier Contrat - '


  deal_inv_meth: any[] = [];
  deal_pay_meth: any[] = [];
  deal_status: any[] = [];
  datestart: any
  dateend: any

  constructor(
      config: NgbDropdownConfig,
      private dealFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private dealService: DealService,
      private codeService: CodeService,
      private customerService: CustomerService,
      private modalService: NgbModal,
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
    this.loadingSubject.next(true)
    this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.dealService.getOne(id).subscribe((response: any)=>{
          this.dealEdit = response.data
          this.datestart = new Date(this.dealEdit.deal_start_date)
          this.dateend = new Date(this.dealEdit.deal_end_date)
          this.datestart.setDate(this.datestart.getDate() )
          this.dateend.setDate(this.dateend.getDate() )
          this.initCode()
          this.loadingSubject.next(false)
          this.title = this.title + this.dealEdit.deal_code
        })
    })
  }

  // init code
  initCode() {
    this.createForm()
    this.loadingSubject.next(false)
  }
  //create form
  createForm() {
    this.loadingSubject.next(false)
     
      this.dealForm = this.dealFB.group({
          deal_code: [this.dealEdit.deal_code, Validators.required],
          deal_desc: [this.dealEdit.deal_desc,  Validators.required ],
          
                   
          deal_cust: [this.dealEdit.deal_cust,  Validators.required],
                  
          deal_amt: [this.dealEdit.deal_amt],
          deal_inv_meth: [this.dealEdit.deal_inv_meth],
          deal_pay_meth: [this.dealEdit.deal_pay_meth],
          
          deal_pen_cust: [this.dealEdit.deal_pen_cust],
          deal_pen_prov: [this.dealEdit.deal_pen_prov],
          deal_delai_cust: [this.dealEdit.deal_delai_cust],
          deal_delai_prov: [this.dealEdit.deal_delai_prov],

          deal_sign_cust: [this.dealEdit.deal_sign_cust],
          deal_sign_prov: [this.dealEdit.deal_sign_prov],

          
          deal_open: [this.dealEdit.deal_open],
          deal_inv: [this.dealEdit.deal_inv],
          deal_status: [this.dealEdit.deal_status],
          
          deal_start_date: [{
            year: this.datestart.getFullYear(),
            month: this.datestart.getMonth()+1,
            day: this.datestart.getDate()
          }],
          deal_end_date: [{
            year: this.dateend.getFullYear(),
            month: this.dateend.getMonth()+1,
            day: this.dateend.getDate()
          }],
         
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
      _deal.deal_cust= controls.deal_cust.value
      _deal.deal_pay_meth= controls.deal_pay_meth.value
      _deal.deal_inv_meth= controls.deal_inv_meth.value
      

      _deal.deal_pen_cust= controls.deal_pen_cust.value
      _deal.deal_pen_prov= controls.deal_pen_prov.value
      _deal.deal_delai_cust= controls.deal_delai_cust.value
      _deal.deal_delai_prov= controls.deal_delai_prov.value

      _deal.deal_sign_cust= controls.deal_sign_cust.value
      _deal.deal_sign_prov= controls.deal_sign_prov.value

      _deal.deal_open= controls.deal_open.value
      _deal.deal_inv= controls.deal_inv.value
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
      this.dealService.update(this.dealEdit.id, _deal).subscribe(
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
              this.router.navigateByUrl("/deal/list-deal")
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



  onChangeCust() {
    const controls = this.dealForm.controls; // chof le champs hada wesh men form rah
    const cm_addr = controls.deal_cust.value;
    
    this.customerService.getBy({ cm_addr }).subscribe(
      (res: any) => {
        console.log(res);
        const { data } = res;
  
        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "ce client n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
          document.getElementById("cust").focus();
          controls.deal_cust.setValue(null)
        } else {
          this.error = false;
          controls.deal_cust.setValue(data.cm_addr || "");
          
  
        }
         
      },
      (error) => console.log(error)
    );
  }
  

  handleSelectedRowsChanged2(e, args) {
  
    const controls = this.dealForm.controls;
    if (Array.isArray(args.rows) && this.gridObj2) {
      args.rows.map((idx) => {
        const item = this.gridObj2.getDataItem(idx);
        
        controls.deal_cust.setValue(item.cm_addr || "");
        
        
      });
    }
  }
  angularGridReady2(angularGrid: AngularGridInstance) {
    this.angularGrid2 = angularGrid;
    this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {};
  }
  prepareGrid2() {
    this.columnDefinitions2 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "cm_addr",
        name: "code",
        field: "cm_addr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_name",
        name: "Client",
        field: "address.ad_name",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_phone",
        name: "Numero telephone",
        field: "address.ad_phone",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_taxable",
        name: "A Taxer",
        field: "address.ad_taxable",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_taxc",
        name: "Taxe",
        field: "address.ad_taxc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];
  
    this.gridOptions2 = {
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
      dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
        var val = undefined;
        try {
          val = eval("item." + column.field);
        } catch (e) {
          // ignore
        }
        return val;
      },
    };
  
    // fill the dataset with your data
    this.customerService
      .getAll()
      .subscribe((response: any) => (this.customers = response.data));
  }
  open2(content) {
    this.prepareGrid2();
    this.modalService.open(content, { size: "lg" });
  }
  
 
}

