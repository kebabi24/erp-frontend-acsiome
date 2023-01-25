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
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
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
  PurchaseOrderService,
  SequenceService,
  UsersService,
  ItemService,
  PurchaseOrder,
  TaxeService,
  DeviseService,
  CodeService,
  SiteService,
  PosCategoryService,
  InventoryTransactionService,
} from "../../../../core/erp";
import { round } from 'lodash';
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
import thId from "src/assets/plugins/formvalidation/src/js/validators/id/thId";


@Component({
  selector: 'kt-dayly-site-trans',
  templateUrl: './dayly-site-trans.component.html',
  styleUrls: ['./dayly-site-trans.component.scss']
})
export class DaylySiteTransComponent implements OnInit {

  purchaseOrder: PurchaseOrder;
  poForm: FormGroup;
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
  nmdataset: any[];

  // grid options

  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];

  providers: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;

  users: [];
  columnDefinitions3: Column[] = [];
  gridOptions3: GridOption = {};
  gridObj3: any;
  angularGrid3: AngularGridInstance;

  requisitions: [];
  columnDefinitions5: Column[] = [];
  gridOptions5: GridOption = {};
  gridObj5: any;
  angularGrid5: AngularGridInstance;

  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

  ums: [];
  columnDefinitionsum: Column[] = [];
  gridOptionsum: GridOption = {};
  gridObjum: any;
  angularGridum: AngularGridInstance;


  datatax: [];
  columnDefinitionstax: Column[] = [];
  gridOptionstax: GridOption = {};
  gridObjtax: any;
  angularGridtax: AngularGridInstance;


  devises: [];
  columnDefinitionscurr: Column[] = [];
  gridOptionscurr: GridOption = {};
  gridObjcurr: any;
  angularGridcurr: AngularGridInstance;

  datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;
  dataloc: [];
  columnDefinitionsloc: Column[] = [];
  gridOptionsloc: GridOption = {};
  gridObjloc: any;
  angularGridloc: AngularGridInstance;
  seq;
  user;
  row_number;
  message = "";
  requistionServer;
  vpServer;
  provider;
  curr
  details : any [];
  datasetPrint = [];
  date: String;
  po_cr_terms: any[] = [];
  constructor(
    config: NgbDropdownConfig,
    private poFB: FormBuilder,
    private totFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private userService: UsersService,
    private inventoryTransactionService: InventoryTransactionService,
    private sequenceService: SequenceService,
    private purchaseOrderService: PurchaseOrderService,
    private itemsService: ItemService,
    private codeService: CodeService,
    private deviseService: DeviseService,
    private siteService: SiteService,
    private taxService: TaxeService,
    private posCategoryService: PosCategoryService,
  ) {
    config.autoClose = true;
    this.codeService
      .getBy({ code_fldname: "vd_cr_terms" })
      .subscribe((response: any) => (this.po_cr_terms = response.data));
    // this.initGrid();
    // this.initmvGrid();

  }
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  initGrid() {
    this.columnDefinitions = [
      
      {
        id: "id",
        name: "Ligne",
        field: "id",
        minWidth: 50,
        maxWidth: 50,
        selectable: true,
      },
      {
        id: "part",
        name: "Article",
        field: "part",
        sortable: true,
        width: 100,
        filterable: true,
        
      },
      {
        id: "desc",
        name: "Description",
        field: "desc",
        sortable: true,
        width: 150,
        filterable: true,
      },
      {
        id: "serial",
        name: "Lot Série",
        field: "serial",
        sortable: true,
        width: 150,
        filterable: true,
      },
      {
        id: "qtyinvbeg",
        name: "Inventaire Hier",
        field: "qtyinvbeg",
        sortable: true,
        minWidth: 100,
        filterable: false,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
       
      
      },
      {
        id: "qtyinvdeb",
        name: "Inv Début",
        field: "qtyinvdeb",
        sortable: true,
        minWidth: 100,
        filterable: false,
        type: FieldType.float,     
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
      },
      {
        id: "qtyrec",
        name: "Réception",
        field: "qtyrec",
        sortable: true,
        minWidth: 100,
        filterable: false,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
      },
      {
        id: "qtyiss",
        name: "Qte Consomée",
        field: "qtyiss",
        sortable: true,
        minWidth: 100,
        filterable: true,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
      },
      {
        id: "qtyrest",
        name: "Qte Théorique",
        field: "qtyrest",
        sortable: true,
        minWidth: 100,
        filterable: true,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
      },
      {
        id: "qtyinvfin",
        name: "Inv Fin",
        field: "qtyinvfin",
        sortable: true,
        minWidth: 100,
        filterable: true,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
      },
      
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableFiltering: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: false,
      autoHeight: true,
      enableAutoResize:true,
      formatterOptions: {
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: false,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal:2,
        maxDecimal:2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
    };

    this.dataset = [];
    const controls = this.poForm.controls
    //const date = `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    const date = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
    this.inventoryTransactionService.getDayly1({tr_site: controls.tr_site.value, tr_effdate: date}).subscribe(
      (response: any) => {   
        this.dataset = response.data
        console.log(response.data)
       this.dataView.setItems(this.dataset);
        
         },
      (error) => {
          this.dataset = []
      },
      () => {}
  )
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
   
    this.createForm();
    this.initGrid();
    this.initmvGrid();
   
  }

  

  
 
  initmvGrid() {
    this.mvcolumnDefinitions = [
  /*    {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.mvangularGrid.gridService.deleteItem(args.dataContext);
          }
        },
      },
      {
        id: "id",
        name: "id",
        field: "id",
        excludeFromHeaderMenu: true,
      
        minWidth: 30,
        maxWidth: 30,
        
      },*/
      {
        id: "part",
        name: "Code Produit",
        field: "part",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.string,
       
      },
      {
        id: "desc1",
        name: "Description",
        field: "desc1",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
       
      },
      {
        id: "ord_qty",
        name: "Qte vendu",
        field: "ord_qty",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
       
      },
  
      
    ];

    this.mvgridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableFiltering: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableAutoResize: true,
      autoHeight: true,
      formatterOptions: {
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: true,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
  
    };

    this.mvdataset = [];
    
    const controls = this.poForm.controls
    const date = new Date(`${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`)
    console.log(date,controls.calc_date.value)
    this.posCategoryService.getSumeQty({usrd_site: this.user.usrd_site, created_date: date}).subscribe(
      (response: any) => {   
        this.mvdataset = response.data
       
       this.mvdataView.setItems(this.mvdataset);
        
         },
      (error) => {
          this.mvdataset = []
      },
      () => {}
  )
  }
  change() {
    this.mvdataset = []
    this.dataset = []
    const controls = this.poForm.controls
    const date = new Date(`${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`)
    console.log(date,controls.tr_site.value)
    this.posCategoryService.getSumeQty({usrd_site: controls.tr_site.value, created_date: date}).subscribe(
      (response: any) => {   
        this.mvdataset = response.data
       console.log(this.mvdataset)
       this.mvdataView.setItems(this.mvdataset);
        
         },
      (error) => {
          this.mvdataset = []
      },
      () => {}
  )
  this.initGrid()
  }
  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.purchaseOrder = new PurchaseOrder();
    const date = new Date;
    
    this.poForm = this.poFB.group({
     // po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],
     tr_site:[this.user.usrd_site,Validators.required],
      calc_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      
    });

    const controls = this.poForm.controls
   /* this.sequenceService.getBy({ seq_type: "PO", seq_profile: this.user.usrd_profile }).subscribe(
      (res: any) => {
        this.seq = res.data[0].seq_seq
        console.log(this.seq)
        controls.po_category.setValue(this.seq);
    
    })
    */

  }
  //reste form
  reset() {
    this.purchaseOrder = new PurchaseOrder();
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.poForm.controls;
    /** check form */
    if (this.poForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }

    if (!this.dataset.length) {
      this.message = "La liste des article ne peut pas etre vide";
      this.hasFormErrors = true;

      return;
    }
    // tslint:disable-next-line:prefer-const
    var val = 0
    var array = [];
    var result = [];
    var array = this.dataset
    array.reduce(function(res, value) {
    //console.log('aaa',res[value.prod_line])
    if (!res[value.vend]) {
      res[value.vend] = { vend: value.vend, qty: 0 };
      result.push(res[value.vend])
    }
    res[value.vend].qty += value.qty;
    return res;
    }, {});
    console.log("array",result)
    
    this.addPo( this.user.usrd_site,result,this.dataset);
  }

  /**
   *
   * Returns object for saving
   */
  /**
   * Add po
   *
   * @param _po: po
   */
  addPo(site:any, pos: any, detail: any) {
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
    }
    this.loadingSubject.next(true);
    let po = null;
    const controls = this.poForm.controls;

    this.purchaseOrderService
      .addPos({ Site:site,purchaseOrder: pos, purchaseOrderDetail: detail })
      .subscribe(
        (reponse: any) => (po = reponse.data),
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
          //console.log(this.provider, po, this.dataset);
          this.router.navigateByUrl("/purchasing/po-list");
        }
      );
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

  // add new Item to Datatable
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  onChangesite() {
    const controls = this.poForm.controls;
    const si_site = controls.tr_site.value;
    
    this.siteService.getByOne({ si_site }).subscribe(
      (res: any) => {
  
        if (!res.data) {
  
            alert("Site n'existe pas  ")
            controls.tr_site.setValue(null);
            document.getElementById("tr_site").focus();
          } else {
           if( this.user.usrd_site != "*" && si_site != this.user.usrd_site){
            alert("Site n'est pas autorisé pour cet utilisateur ")
            controls.tr_site.setValue(null);
            document.getElementById("tr_site").focus();
             


           } 
          }
      
      });
  }
  
  handleSelectedRowsChangedsite(e, args) {
    const controls = this.poForm.controls;
      if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);
        console.log(item);
        
       controls.tr_site.setValue(item.si_site);
        
    this.change()
     
  });

    }
  }
  angularGridReadysite(angularGrid: AngularGridInstance) {
    this.angularGridsite = angularGrid;
    this.gridObjsite = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridsite() {
    this.columnDefinitionssite = [
      
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "si_site",
        name: "Site",
        field: "si_site",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "si_desc",
        name: "Designation",
        field: "si_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionssite = {
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
      };
    // fill the dataset with your data
    if(this.user.usrd_site == "*") {
    this.siteService
      .getAll()
      .subscribe((response: any) => (this.datasite = response.data));
    }
    else {
      this.siteService
      .getBy({si_site : this.user.usrd_site})
      .subscribe((response: any) => (this.datasite = response.data));
  
    }
  }
  opensite(contentsite) {
    this.prepareGridsite();
    this.modalService.open(contentsite, { size: "lg" });
  }

}
