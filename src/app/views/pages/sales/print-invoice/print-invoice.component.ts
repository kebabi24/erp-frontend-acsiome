import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  EditorValidator,
  EditorArgs,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
import { round } from 'lodash';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
// Layout
import {
  SubheaderService,
  LayoutConfigService,
} from "../../../../core/_base/layout";
// CRUD
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import {
  SaleOrderService,
  CustomerService,
  ItemService,
  AddressService,
  TaxeService,
  DeviseService,
  InventoryTransaction,
  SaleShiper,
  InventoryTransactionService,
  InventoryStatusService,
  SaleShiperService,
  LocationService,
  SiteService,
  MesureService,
  SequenceService,
  LocationDetailService,
  CodeService,
  InvoiceOrderTempService,
  InvoiceOrderTemp,
  printIH,
  Item,
} from "../../../../core/erp";
import { DecimalPipe } from "@angular/common";


@Component({
  selector: 'kt-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss']
})
export class PrintInvoiceComponent implements OnInit {

  invoiceOrder: InvoiceOrderTemp;
  inventoryTransaction: InventoryTransaction;
  ihForm: FormGroup;
  totForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  angularGridih: AngularGridInstance; 
  gridih: any;
  gridServiceih: GridService;
  dataViewih: any;
  columnDefinitionsih: Column[];
  gridOptionsih: GridOption;
  ihdataset : any[];

  customer: any;
  
  customers: [];
    columnDefinitions2: Column[] = [];
    gridOptions2: GridOption = {};
    gridObj2: any;
    angularGrid2: AngularGridInstance;
  
    
 
  
  sos: [];
  columnDefinitions5: Column[] = [];
  gridOptions5: GridOption = {};
  gridObj5: any;
  angularGrid5: AngularGridInstance;


  
  
  sequences: []
    columnDefinitions1: Column[] = []
    gridOptions1: GridOption = {}
    gridObj1: any
    angularGrid1: AngularGridInstance

  row_number;
  message = "";
  soServer;
  location: any;
  details: any;
  datasetPrint = [];
  stat: String;
  status: any;
  qty: Number;
  qtyship: Number;
  expire: Date;
  seq: any;
  ith_cr_terms: any[] = [];
  detail: any;
  curr: any;  
  user;
  pshnbr: String;
  constructor(
    config: NgbDropdownConfig,
    private ihFB: FormBuilder,
    private totFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public  dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private customersService: CustomerService,
    private saleShiperService: SaleShiperService,
    private saleOrderService: SaleOrderService,
    private invoiceOrderService: InvoiceOrderTempService,
    
    private sequenceService: SequenceService,
    private codeService: CodeService,
    private addressService: AddressService,
    private itemsService: ItemService,
    private deviseService: DeviseService,
    private inventoryStatusService: InventoryStatusService,
    private siteService: SiteService,
    private mesureService: MesureService,
    private locationService: LocationService,
    private locationDetailService: LocationDetailService,
  ) {
    config.autoClose = true;
      this.codeService
        .getBy({ code_fldname: "cm_cr_terms" })
        .subscribe((response: any) => (this.ith_cr_terms = response.data));
      
      this.initGridih();
  }
  
  gridReadyih(angularGrid: AngularGridInstance) {
    this.angularGridih = angularGrid;
    this.dataViewih = angularGrid.dataView;
    this.gridih = angularGrid.slickGrid;
    this.gridServiceih = angularGrid.gridService;
  }
  initGridih() {
    this.columnDefinitionsih = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
    },
      
    {
      id: "itdh_line",
      name: "Ligne",
      field: "itdh_line",
      minWidth: 50,
      maxWidth: 50,
      selectable: true,
      sortable: true,
    },
    {
      id: "itdh_nbr",
      name: "Commande",
      field: "itdh_nbr",
      sortable: true,
      width: 50,
      filterable: false,
      
    },
    
    {
      id: "itdh_part",
      name: "Article",
      field: "itdh_part",
      sortable: true,
      width: 50,
      filterable: false,
      
    },
    {
      id: "desc",
      name: "Description",
      field: "desc",
      sortable: true,
      width: 180,
      filterable: false,
    },
    {
      id: "itdh_um",
      name: "UM",
      field: "itdh_um",
      sortable: true,
      width: 50,
      filterable: false,
      
    },
    {
      id: "itdh_qty_inv",
      name: "Qte",
      field: "itdh_qty_inv",
      sortable: true,
      width: 80,
      filterable: false,
      
    },
    {
      id: "itdh_price",
      name: "Prix unitaire",
      field: "itdh_price",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      formatter: Formatters.decimal,
     
    },
    {
      id: "itdh_disc_pct",
      name: "Remise",
      field: "itdh_disc_pct",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      formatter: Formatters.decimal,
     
    },
    {
      id: "itdh_taxable",
      name: "A Taxer",
      field: "itdh_taxable",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      formatter: Formatters.checkbox,
     
    },
    {
      id: "itdh_tax_code",
      name: "Code Taxe",
      field: "itdh_tax_code",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      
    },
   
    {
      id: "itdh_taxc",
      name: "Taux Taxe",
      field: "itdh_taxc",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      formatter: Formatters.decimal,
     
    },
      
    ];

    this.gridOptionsih = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableSorting: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      
      formatterOptions: {
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: true,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
     /* presets: {
        sorters: [
          { columnId: 'psh_line', direction: 'ASC' }
        ],
      },*/
    };

    this.dataset = [];
  }
  ngOnInit(): void {
    this.reset();
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    this.createForm();
    this.createtotForm();
  }

  createtotForm() {
    this.loadingSubject.next(false);
    //this.saleOrder = new SaleOrder();
    //const date = new Date;
    
    this.totForm = this.totFB.group({
  //    so__chr01: [this.invoiceOrder.ith__chr01],
      tht: [{value: 0.00 , disabled: true}],
      tva: [{value: 0.00 , disabled: true}],
      timbre: [{value: 0.00 , disabled: true}],
      ttc: [{value: 0.00 , disabled: true}],
    });
  }
  //create form
  createForm() {
    this.loadingSubject.next(false);
      this.invoiceOrder = new InvoiceOrderTemp();
      const date = new Date;
      
      this.ihForm = this.ihFB.group({
    //    so__chr01: [this.invoiceOrder.ith__chr01],
        ith_category: [this.invoiceOrder.ith_category , Validators.required],
        ith_nbr: [this.invoiceOrder.ith_nbr , Validators.required],
        ith_cust: [{value: this.invoiceOrder.ith_cust , disabled: true}],
        name: [{value:"", disabled: true}],
        
        ith_bill: [{value: this.invoiceOrder.ith_bill , disabled: true}],
        namebill: [{value:"", disabled: true}],
        
        ith_inv_date: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }],
        
        ith_taxable: [{value: this.invoiceOrder.ith_taxable, disabled: true}],
       
        ith_po: [{value:this.invoiceOrder.ith_po, disabled: true}],
        ith_rmks: [this.invoiceOrder.ith_rmks],
        ith_curr: [{value:this.invoiceOrder.ith_curr, disabled: true}],
        ith_ex_rate: [{value:this.invoiceOrder.ith_ex_rate, disabled: true}],
        ith_ex_rate2: [{value:this.invoiceOrder.ith_ex_rate2, disabled: true}],
        ith_cr_terms: [this.invoiceOrder.ith_cr_terms, Validators.required],
        print:[true]
      });
  
      
      
  
    }
  //reste form
  reset() {
    this.inventoryTransaction = new InventoryTransaction();
    this.createForm();
    this.dataset = [];
    this.ihdataset = [];
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.ihForm.controls;
    /** check form */
    if (this.ihForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }

    if (!this.ihdataset.length) {
      this.message = "La liste des article ne peut pas etre vide ";
      this.hasFormErrors = true;

      return;
    }

    for (var i = 0; i < this.ihdataset.length; i++) {
      console.log(this.ihdataset[i]  )
     if (this.ihdataset[i].itdh_part == "" || this.ihdataset[i].itdh_part == null  ) {
      this.message = "L' article ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.ihdataset[i].itdh_um == "" || this.ihdataset[i].itdh_um == null  ) {
      this.message = "L' UM ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.ihdataset[i].itdh_qty_inv == 0 ) {
      this.message = "La Quantite ne peut pas etre 0";
      this.hasFormErrors = true;
      return;
 
     }

    }
/*
    this.sequenceService.getByOne({ seq_type: "IV", seq_profile: this.user.usrd_profile }).subscribe(
      (response: any) => {
    this.seq = response.data
    console.log(this.seq)   
        if (this.seq) {
         this.pshnbr = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`
         console.log(this.seq.seq_prefix)
         console.log(this.seq.seq_curr_val)
         
        console.log(this.pshnbr)
         const id = Number(this.seq.id)
      let obj = { }
      obj = {
        seq_curr_val: Number(this.seq.seq_curr_val )+1
      }
      this.sequenceService.update(id , obj ).subscribe(
        (reponse) => console.log("response", Response),
        (error) => {
          this.message = "Erreur modification Sequence";
          this.hasFormErrors = true;
          return;
     
        
        },
        )
      }else {
        this.message = "Parametrage Manquant pour la sequence";
        this.hasFormErrors = true;
        return;
   
       }

      })
      */
    // tslint:disable-next-line:prefer-const
    let ih = this.prepareIh()
    this.addIh(ih, this.ihdataset);


  }

  prepareIh(): any {
    const controls = this.ihForm.controls;
    const controlstot = this.totForm.controls 
    const _ih = new InvoiceOrderTemp();
    _ih.ith_category =  controls.ith_category.value
    _ih.ith_cust = controls.ith_cust.value;
    _ih.ith_bill = controls.ith_bill.value;
    _ih.ith_nbr = controls.ith_nbr.value;
    
    _ih.ith_inv_date = controls.ith_inv_date.value
      ? `${controls.ith_inv_date.value.year}/${controls.ith_inv_date.value.month}/${controls.ith_inv_date.value.day}`
      : null;
    
      if (controls.ith_taxable.value == null || controls.ith_taxable.value == "" ) { _ih.ith_taxable = false} else { _ih.ith_taxable = controls.ith_taxable.value}
    
   
    _ih.ith_rmks = controls.ith_rmks.value;
    
    _ih.ith_rmks = controls.ith_rmks.value;
    _ih.ith_curr = controls.ith_curr.value;
    _ih.ith_ex_rate = controls.ith_ex_rate.value;
    _ih.ith_ex_rate2 = controls.ith_ex_rate2.value;
    _ih.ith_cr_terms = controls.ith_cr_terms.value;
    _ih.ith_amt = controlstot.tht.value;
    _ih.ith_tax_amt = controlstot.tva.value;
    _ih.ith_trl1_amt = controlstot.timbre.value;
    
    return _ih;
  
  }
  /**
   * Add po
   *
   * @param _ih: ih
   */
  addIh(_ih: any, detail: any) {
    var array = []
    var iharray = []
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
     
    }
    this.loadingSubject.next(true);
    let ih = null;
    const controls = this.ihForm.controls;

    this.invoiceOrderService
      .add({ invoiceOrder: _ih, invoiceOrderDetail: detail })
      .subscribe(
        (reponse: any) => (ih = reponse.data),
        (error) => {
          this.layoutUtilsService.showActionNotification(
            "Erreur verifier les informations",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.loadingSubject.next(false);
        },
        () => {
          this.layoutUtilsService.showActionNotification(
            "Ajout avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.loadingSubject.next(false);
          console.log(this.dataset);
        
          array = this.ihdataset;        
          var result = [];
  array.reduce(function(res, value) {
    //console.log('aaa',res[value.itdh_part])
    if (!res[value.itdh_part]) {
      res[value.itdh_part] = { itdh_part: value.itdh_part,  itdh_qty_inv: 0 };
      result.push(res[value.itdh_part])
      
    }
    res[value.itdh_part].itdh_qty_inv += value.itdh_qty_inv; 
    return res;
  }, {});
  
  console.log('bbb',result)
  var bool = false
  for (var obj = 0; obj < result.length; obj++) {
    const det = result[obj];
    
iharray.push(det)
bool = false
var j = 0
   
    do {
  if (this.ihdataset[j].itdh_part = det.itdh_part ) {
    iharray[obj].itdh_line = obj + 1
    iharray[obj].desc =  this.ihdataset[j].desc
    iharray[obj].itdh_price =  this.ihdataset[j].itdh_price
    iharray[obj].itdh_taxable = this.ihdataset[j].itdh_taxable
    iharray[obj].itdh_tax_code = this.ihdataset[j].itdh_tax_code
    iharray[obj].itdh_taxc = this.ihdataset[j].itdh_taxc
    iharray[obj].itdh_disc_pct = this.ihdataset[j].itdh_disc_pct
    iharray[obj].itdh_um = this.ihdataset[j].itdh_um
    
    
  bool = true   
  }
  j++
  }while ( j < this.ihdataset.length || bool == false);


                         
  }
  console.log("hnahna", iharray)
  

          if(controls.print.value == true) printIH(this.customer, iharray, ih,this.curr);
          this.reset()
          this.router.navigateByUrl("/sales/print-invoice");
          this.reset()
        }
      );
  }
 
  


 

  

  onChangeSeq() {
    const controls = this.ihForm.controls
    console.log(this.user.usrd_profile)
    this.sequenceService
        .getBy({seq_seq: controls.ith_category.value, seq_type: 'IV', seq_profile: this.user.usrd_profile})
        .subscribe((response: any) => {
            console.log(response)
            if (response.data.length == 0) {
                alert("Sequence nexiste pas")
                controls.ith_category.setValue("")
                //console.log(response.data.length)
                document.getElementById("SEQUENCE").focus();
            } 
        })
}

 
  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  
  
  onChangeCC() {
    const controls = this.ihForm.controls;
    const so_nbr = controls.ith_nbr.value;
    
    this.ihdataset = [];
        this.saleOrderService.getBy({ so_nbr, so_to_inv: true, so_invoiced: false }).subscribe(
          (res: any) => {
            console.log(res)
            const { saleOrder, details } = res.data;
           if (saleOrder != null) {
            const det1 = details;
            
            this.soServer = saleOrder;
            //console.log(this.soServer)
            //console.log(this.soServer.so_cust)
            controls.ith_nbr.setValue(this.soServer.so_nbr|| "")
            controls.ith_cust.setValue(this.soServer.so_cust|| "");
            controls.ith_bill.setValue(this.soServer.so_bill|| "");
            controls.ith_curr.setValue(this.soServer.so_curr|| "");
            controls.ith_ex_rate.setValue(this.soServer.so_ex_rate|| "1");
            controls.ith_ex_rate2.setValue(this.soServer.so_ex_rate2|| "1");
            controls.ith_taxable.setValue(this.soServer.so_taxable);
            controls.ith_cr_terms.setValue(this.soServer.so_cr_terms|| "");
            const ad_addr = this.soServer.so_cust;
            this.addressService.getBy({ad_addr: ad_addr}).subscribe((response: any)=>{
                    
                    
              //this.customer = response.data
    
            controls.name.setValue(response.data.ad_name);
          
            })
            this.customersService.getBy({cm_addr: this.soServer.so_bill}).subscribe((response: any)=>{
                    
                    
              this.customer = response.data
    
            controls.namebill.setValue(this.customer.address.ad_name);
          
            })
            this.deviseService.getBy({cu_curr: this.soServer.so_curr}).subscribe((res: any)=>{
                    
                    
              this.curr = res.data
    
            
          
            })
          
          
            for (var object = 0; object < det1.length; object++) {
              const detail = details[object];
             console.log(detail)
                  this.gridServiceih.addItem(
                    {
                      id: detail.sod_line, //this.dataset.length + 1,
                      itdh_line: detail.sod_line,   //this.dataset.length + 1,
                      itdh_nbr: detail.sod_nbr,
                     
                      itdh_part: detail.sod_part,
                      cmvid: "",
                      desc: detail.item.pt_desc1,
                      itdh_qty_inv: detail.sod_qty_ord ,
                      itdh_um: detail.sod_um,
                      itdh_um_conv: detail.sod_um_conv,
                      itdh_type: detail.sod_type,
                      itdh_price: detail.sod_price,
                      itdh_disc_pct: detail.sod_disc_pct,
                      itdh_taxable: detail.sod_taxable,
                      itdh_taxc: detail.sod_taxc,
                      itdh_tax_code: detail.sod_tax_code,
                      itdh_site: detail.sod_site,
                      itdh_loc: detail.sod_loc,
                      itdh_serial: detail.sod_serial,
                      itdh_status: detail.sod_status,
                      itdh_expire: detail.sod_expire,
                    },
                    { position: "bottom" }
                  );
          
        }

        this.calculatetot();

      }else {
        alert("Comande n'existe pas ou bien Facturé")
        controls.ith_nbr.setValue("")
        //console.log(response.data.length)
        document.getElementById("ihnbr").focus();
      }
      })    
    
          
  }



calculatetot(){
  const controls = this.totForm.controls 
   const controlsso = this.ihForm.controls 
   console.log(this.ihdataset)
   let tht = 0
   let tva = 0
   let timbre = 0
   let ttc = 0
   console.log(this.ihdataset.length)
   
   for (var i = 0; i < this.ihdataset.length; i++) {
     console.log("here", this.ihdataset[i].itdh_price,this.ihdataset[i].itdh_qty_inv, this.ihdataset[i].itdh_disc_pct, this.ihdataset[i].itdh_taxc   )
     tht += round((this.ihdataset[i].itdh_price * ((100 - this.ihdataset[i].itdh_disc_pct) / 100 ) *  this.ihdataset[i].itdh_qty_inv),2)
     if(this.ihdataset[i].itdh_taxable == true) tva += round((this.ihdataset[i].itdh_price * ((100 - this.ihdataset[i].itdh_disc_pct) / 100 ) *  this.ihdataset[i].itdh_qty_inv) * (this.ihdataset[i].itdh_taxc ? this.ihdataset[i].itdh_taxc / 100 : 0),2)
    
  
     

     console.log(tva)
     if(controlsso.ith_cr_terms.value == "ES") { timbre = round((tht + tva) / 100,2);
       if (timbre > 10000) { timbre = 10000} } 
  
   }
 ttc = round(tht,2) + round(tva,2) + round(timbre,2)
console.log(tht,tva,timbre,ttc)
controls.tht.setValue(tht.toFixed(2));
controls.tva.setValue(tva.toFixed(2));
controls.timbre.setValue(timbre.toFixed(2));
controls.ttc.setValue(ttc.toFixed(2));

}


handleSelectedRowsChanged(e, args) {
  const controls = this.ihForm.controls
  if (Array.isArray(args.rows) && this.gridObj1) {
      args.rows.map((idx) => {
          const item = this.gridObj1.getDataItem(idx)
          controls.ith_category.setValue(item.seq_seq || "")
      })
  }
}

angularGridReady(angularGrid: AngularGridInstance) {
  this.angularGrid1 = angularGrid
  this.gridObj1 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid1() {
  this.columnDefinitions1 = [
      {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
      },
      {
          id: "seq_seq",
          name: "code sequence",
          field: "seq_seq",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "seq_desc",
          name: "description",
          field: "seq_desc",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "seq_appr1",
          name: "approbateur 1",
          field: "seq_appr1",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "seq_appr2",
          name: "approbateur 2",
          field: "seq_appr2",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "seq_appr3",
          name: "approbateur 3",
          field: "seq_appr3",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
  ]

  this.gridOptions1 = {
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
 
  this.sequenceService
      .getBy({seq_type: 'IV', seq_profile: this.user.usrd_profile})
      .subscribe((response: any) => (this.sequences = response.data))
     
}
open(content) {
  this.prepareGrid1()
  this.modalService.open(content, { size: "lg" })
}


handleSelectedRowsChanged5(e, args) {
  const controls = this.ihForm.controls;

     
    
    if (Array.isArray(args.rows) && this.gridObj5) {
      args.rows.map((idx) => {
        const item = this.gridObj5.getDataItem(idx);
        controls.ith_nbr.setValue(item.so_nbr || "");
        const so_nbr = item.so_nbr;
        this.ihdataset = [];
        this.saleOrderService.getBy({ so_nbr }).subscribe(
          (res: any) => {
            console.log(res)
            const { saleOrder, details } = res.data;
            const det1 = details;
            
            this.soServer = saleOrder;
            //console.log(this.soServer)
            //console.log(this.soServer.so_cust)
            controls.ith_nbr.setValue(this.soServer.so_nbr|| "")
            controls.ith_cust.setValue(this.soServer.so_cust|| "");
            controls.ith_bill.setValue(this.soServer.so_bill|| "");
            controls.ith_curr.setValue(this.soServer.so_curr|| "");
            controls.ith_ex_rate.setValue(this.soServer.so_ex_rate|| "1");
            controls.ith_ex_rate2.setValue(this.soServer.so_ex_rate2|| "1");
            controls.ith_taxable.setValue(this.soServer.so_taxable);
            controls.ith_cr_terms.setValue(this.soServer.so_cr_terms|| "");
            const ad_addr = this.soServer.so_cust;
            this.addressService.getBy({ad_addr: ad_addr}).subscribe((response: any)=>{
                    
                    
              //this.customer = response.data
    
            controls.name.setValue(response.data.ad_name);
          
            })
            this.customersService.getBy({cm_addr: this.soServer.so_bill}).subscribe((response: any)=>{
                    
                    
              this.customer = response.data
    
            controls.namebill.setValue(this.customer.address.ad_name);
          
            })
            this.deviseService.getBy({cu_curr: this.soServer.so_curr}).subscribe((res: any)=>{
                    
                    
              this.curr = res.data
    
            
          
            })
          
          
            for (var object = 0; object < det1.length; object++) {
              const detail = details[object];
             console.log(detail)
                  this.gridServiceih.addItem(
                    {
                      id: detail.sod_line, //this.dataset.length + 1,
                      itdh_line: detail.sod_line,   //this.dataset.length + 1,
                      itdh_nbr: detail.sod_nbr,
                     
                      itdh_part: detail.sod_part,
                      cmvid: "",
                      desc: detail.item.pt_desc1,
                      itdh_qty_inv: detail.sod_qty_ord ,
                      itdh_um: detail.sod_um,
                      itdh_um_conv: detail.sod_um_conv,
                      itdh_type: detail.sod_type,
                      itdh_price: detail.sod_price,
                      itdh_disc_pct: detail.sod_disc_pct,
                      itdh_taxable: detail.sod_taxable,
                      itdh_tax_code: detail.sod_tax_code,
                      itdh_taxc: detail.sod_taxc,
                      itdh_site: detail.sod_site,
                      itdh_loc: detail.sod_loc,
                      itdh_serial: detail.sod_serial,
                      itdh_status: detail.sod_status,
                      itdh_expire: detail.sod_expire,
                    },
                    { position: "bottom" }
                  );
          
        }

        this.calculatetot();

     
      })    
    
   })
    }
}
  

angularGridReady5(angularGrid: AngularGridInstance) {
  this.angularGrid5 = angularGrid;
  this.gridObj5 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGrid5() {
  this.columnDefinitions5 = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "sos_nbr",
      name: "N° BC",
      field: "so_nbr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "so_ord_date",
      name: "Date",
      field: "so_ord_date",
      sortable: true,
      filterable: true,
      type: FieldType.date,
    },
    {
      id: "so_cust",
      name: "Client",
      field: "so_cust",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "so_bill",
      name: "Adr Facturation",
      field: "so_bill",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    
    {
      id: "so_status",
      name: "status",
      field: "so_status",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptions5 = {
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
  this.saleOrderService
    .getByAll( {so_to_inv: true, so_invoiced: false})
    .subscribe((response: any) => {
      //console.log(response.data)
      this.sos = response.data 
    console.log(response.data )
    });
    
    
    
  }
open5(content) {
  this.prepareGrid5();
  this.modalService.open(content, { size: "lg" });
}


}
