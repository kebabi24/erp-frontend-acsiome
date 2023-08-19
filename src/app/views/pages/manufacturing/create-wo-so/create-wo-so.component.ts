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
  ItemService, SiteService, BomService,BomPartService, WorkOrder, WorkOrderService, SequenceService, ProviderService, WorkRoutingService, SaleOrderService,PsService

} from "../../../../core/erp";

@Component({
  selector: 'kt-create-wo-so',
  templateUrl: './create-wo-so.component.html',
  styleUrls: ['./create-wo-so.component.scss']
})
export class CreateWoSoComponent implements OnInit {

  woForm: FormGroup;
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
  sos : any[];
  

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

  providers: [];
  columnDefinitionsvend: Column[] = [];
  gridOptionsvend: GridOption = {};
  gridObjvend: any;
  angularGridvend: AngularGridInstance;

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

  gammes: [];
  columnDefinitionsgamme: Column[] = [];
  gridOptionsgamme: GridOption = {};
  gridObjgamme: any;
  angularGridgamme: AngularGridInstance;

  constructor(
    config: NgbDropdownConfig,
    private poFB: FormBuilder,
    private totFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private sequenceService: SequenceService,
    private itemsService: ItemService,
    private siteService: SiteService,
    private psService: PsService,
    private saleOrderService: SaleOrderService,
    private workOrderService: WorkOrderService,
    private workRoutingService: WorkRoutingService,
  ) {
    config.autoClose = true;
    
   
    //  this.initGrid();
    //  this.initmvGrid();

  }
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  mvGridReady(mvangularGrid: AngularGridInstance) {
    this.mvangularGrid = mvangularGrid;
    this.mvdataView = mvangularGrid.dataView;
    this.mvgrid = mvangularGrid.slickGrid;
    this.mvgridService = mvangularGrid.gridService;
  }
  initGrid() {
    this.columnDefinitions = [
     

      {
        id: "id",
        name: "ID OF",
        field: "id",
        minWidth: 50,
        maxWidth: 50,
       
      },
     
      {
        id: "wo_nbr",
        name: "N° OF",
        field: "wo_nbr",
        sortable: true,
        width: 50,
        filterable: false,   
      },
     
      {
        id: "wo_part",
        name: "Article",
        field: "wo_part",
        sortable: true,
        width: 50,
        filterable: false,
       
        
      },
      {
        id: "desc",
        name: "Description",
        field: "item.pt_desc1",
        sortable: true,
        width: 80,
        filterable: false,
       
      },
      {
        id: "item.pt_um",
        name: "UM",
        field: "item.pt_um",
        sortable: true,
        width: 80,
        filterable: false,
       
      },
      
      {
        id: "wo_qty_ord",
        name: "QTE",
        field: "wo_qty_ord",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        formatter: Formatters.decimal,
       
      },
      {
        id: "wo_status",
        name: "Status",
        field: "wo_status",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        
      },
      
    ];
    this.gridOptions = {
      // if you want to disable autoResize and use a fixed width which requires horizontal scrolling
      // it's advised to disable the autoFitColumnsOnFirstLoad as well
      // enableAutoResize: false,
      // autoFitColumnsOnFirstLoad: false,
      autoFitColumnsOnFirstLoad: false,
     
      //fullWidthRows:false,
      
      // enable the filtering but hide the user filter row since we use our own single filter
      enableFiltering: false,
      showHeaderRow: false, // hide the filter row (header row)

      autoEdit:true,
      editable: true,
      autoCommitEdit:true,
      enableCellNavigation: true,
      formatterOptions: {
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: false,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
        maxDecimal:2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
      presets: {
       
        sorters: [
          { columnId: 'id', direction: 'ASC' }
        ],
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
   
    this.dataset = [];
  }
  ngOnInit(): void {
    
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(true);
    this.user =  JSON.parse(localStorage.getItem('user'))
    console.log(this.user)
    this.createForm();
    this.initmvGrid();
    this.initGrid();
   
  }

  addNewItem() {
  const controls = this.woForm.controls
  console.log("sos", this.sos)
 this.dataset = []
    
 
 for (let data of this.mvdataset) {
  delete data.id;
  delete data.desc;
  delete data.cmvid;
 
}
this.loadingSubject.next(true);

this.workOrderService
  .addSoJob({detail:this.mvdataset, profile: this.user.usrd_profile,site: controls.site.value, saleOrders: this.sos})
  .subscribe(
   (reponse: any) => this.dataset = reponse.data,
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
      
      this.dataView.setItems(this.dataset);
      this.loadingSubject.next(false);
  //    console.log(this.provider, po, this.dataset);
  //    if(controls.print.value == true) printBc(this.provider, this.datasetPrint, po);
  //this.router.navigateByUrl("/manufacturing/list-wo")
    }
  );

    
      
    }
    

 /*for (var i= 0; i < this.dataset.length ; i++){
   console.log("here")
    this.gridService.addItem(
      {
        id: i + 1,
        part: this.dataset[i].part,
        desc: this.dataset[i].desc,
        qty_ord : this.dataset[i].qty_ord,
        um : this.dataset[i].um,
        vend : this.dataset[i].vend ,
      },
      { position: "bottom" }
    );
 }*/
 

  
 
  initmvGrid() {
    this.mvcolumnDefinitions = [
      {
        id: "part",
        name: "Code Produit",
        field: "part",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
      },
      {
        id: "desc1",
        name: "Description",
        field: "desc1",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
      },
      {
        id: "nomo",
        name: "Code Nomonclature",
        field: "nomo",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
      },
      {
        id: "gamme",
        name: "Gamme",
        field: "gamme",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
       
      },
      {
        id: "mvid",
        field: "cmvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.row_number = args.row;
          let element: HTMLElement = document.getElementById(
            "openGammesGrid"
          ) as HTMLElement;
          element.click();
        },
      },

      {
        id: "rel_date",
        name: "Date Lancement",
        field: "rel_date",
        sortable: true,
        width: 80,
        filterable: false,
        formatter: Formatters.dateIso ,
        type: FieldType.dateIso,
        editor: {
          model: Editors.date,
        },
       
      },
      {
        id: "due_date",
        name: "Date Echéance",
        field: "due_date",
        sortable: true,
        width: 80,
        filterable: false,
        formatter: Formatters.dateIso ,
        type: FieldType.dateIso,
        editor: {
          model: Editors.date,
        },
      },

      {
        id: "queue_eff",
        name: "Ordre",
        field: "queue_eff",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.dateIso,
        editor: {
          model: Editors.integer,
        },
       
      },

      {
        id: "ord_qty",
        name: "Qte Commandée",
        field: "ord_qty",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
      },

      {
        id: "qtyoh",
        name: "Qte Stock",
        field: "qtyoh",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
      },
      {
        id: "sfty_qty",
        name: "Stock Sécurité",
        field: "sfty_qty",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
      },
      {
        id: "qtylanch",
        name: "Qte on Production",
        field: "qtylanch",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
      },
      {
        id: "prod_qty",
        name: "Qte à Fabriquée",
        field: "prod_qty",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
        editor: {
          model: Editors.float,
        },
       
      },
      
      // {
      //   id: "type",
      //   name: "Type",
      //   field: "type",
      //   sortable: true,
      //   width: 50,
      //   filterable: false,
      //   type: FieldType.text,
       
      // },
      
    ];

    this.mvgridOptions = {
           // if you want to disable autoResize and use a fixed width which requires horizontal scrolling
      // it's advised to disable the autoFitColumnsOnFirstLoad as well
      // enableAutoResize: false,
      // autoFitColumnsOnFirstLoad: false,
      
  
      //fullWidthRows:false,
      
      // enable the filtering but hide the user filter row since we use our own single filter
      enableFiltering: false,
      editable: true,
      autoCommitEdit: true,
      showHeaderRow: false, // hide the filter row (header row)
      autoFitColumnsOnFirstLoad: false,
     
      enableCellNavigation: true,
      formatterOptions: {
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: false,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
        maxDecimal:2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
    
    };
    

 console.log(this.user)
 const controls = this.woForm.controls
    const site = controls.site.value
    this.saleOrderService.getSojob({site}).subscribe(
      (response: any) => {   
        this.sos = response.data.soss
        this.mvdataset = response.data.result
       console.log(this.mvdataset)
       this.mvdataView.setItems(this.mvdataset);
        
         },
      (error) => {
          this.mvdataset = []
      },
      () => {}
  )
  }
  // change() {
  //   this.mvdataset = []
  //   this.dataset = []
  //   const controls = this.woForm.controls
  //   const date = controls.calc_date.value
  //   ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
  //   : null;    console.log(date,controls.calc_date.value)
  //   this.posCategoryService.getSumeQtyPs({usrd_site: controls.site.value, created_date: date}).subscribe(
  //     (response: any) => {   
  //       this.mvdataset = response.data
  //      this.mvdataView.setItems(this.mvdataset);
        
  //        },
  //     (error) => {
  //         this.mvdataset = []
  //     },
  //     () => {}
  // )
  // }
  
 
  //create form
  createForm() {
    this.loadingSubject.next(false);
    const date = new Date;
    
    this.woForm = this.poFB.group({
     // po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],
      site:[this.user.usrd_site,Validators.required],
       
    });

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
    // this.purchaseOrder = new PurchaseOrder();
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.woForm.controls;
    /** check form */
    if (this.woForm.invalid) {
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
    
    // je dois parcourir la liste dataset des article et pour chaque item jajoute 2 champs et jenvoie la nouvelle liste 
    this.addPo( controls.site.value,result,this.dataset);
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
    const controls = this.woForm.controls;

    // this.workOrderService
    //   .addPos({ Site:site,purchaseOrder: pos, purchaseOrderDetail: detail })
    //   .subscribe(
    //     (reponse: any) => (po = reponse.data),
    //     (error) => {
    //       this.layoutUtilsService.showActionNotification(
    //         "Erreur verifier les informations",
    //         MessageType.Create,
    //         10000,
    //         true,
    //         true
    //       );
    //       this.loadingSubject.next(false);
    //     },
    //     () => {
    //       this.layoutUtilsService.showActionNotification(
    //         "Ajout avec succès",
    //         MessageType.Create,
    //         10000,
    //         true,
    //         true
    //       );
    //       this.loadingSubject.next(false);
    //       //console.log(this.provider, po, this.dataset);
    //       this.router.navigateByUrl("/purchasing/po-list");
    //     }
    //   );
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
    const controls = this.woForm.controls;
    const si_site = controls.site.value;
    
    this.siteService.getByOne({ si_site }).subscribe(
      (res: any) => {
  
        if (!res.data) {
  
            alert("Site n'existe pas  ")
            controls.site.setValue(null);
            document.getElementById("site").focus();
          } else {
           if( this.user.usrd_site != "*" && si_site != this.user.usrd_site){
            alert("Site n'est pas autorisé pour cet utilisateur ")
            controls.site.setValue(null);
            document.getElementById("site").focus();
             


           } 
          }
      
      });
  }
  
 
  handleSelectedRowsChangedsite(e, args) {
    const controls = this.woForm.controls;
      if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);
        console.log(item);
        
       controls.site.setValue(item.si_site);
        
    
     
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


  // /*vendor*/
  // handleSelectedRowsChangedvend(e, args) {
  //   let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    
  //   if (Array.isArray(args.rows) && this.gridObjvend) {
  //     args.rows.map((idx) => {
  
            
  //       const item = this.gridObjvend.getDataItem(idx);
  //             updateItem.vend = item.vd_addr;
  //             this.gridService.updateItem(updateItem);
           
  //     })   
  //   }
  // }
  
  // angularGridReadyvend(angularGrid: AngularGridInstance) {
  //   this.angularGridvend = angularGrid;
  //   this.gridObjvend = (angularGrid && angularGrid.slickGrid) || {};
  // }
  
  // prepareGridvend() {
  //   this.columnDefinitionsvend = [
  //     {
  //       id: "id",
  //       name: "id",
  //       field: "id",
  //       sortable: true,
  //       minWidth: 80,
  //       maxWidth: 80,
  //     },
  //     {
  //       id: "vd_addr",
  //       name: "code",
  //       field: "vd_addr",
  //       sortable: true,
  //       filterable: true,
  //       type: FieldType.string,
  //     },
  //     {
  //       id: "ad_name",
  //       name: "Fournisseur",
  //       field: "address.ad_name",
  //       sortable: true,
  //       filterable: true,
  //       type: FieldType.string,
  //     },
  //     {
  //       id: "ad_phone",
  //       name: "Numero telephone",
  //       field: "address.ad_phone",
  //       sortable: true,
  //       filterable: true,
  //       type: FieldType.string,
  //     },
  //     {
  //       id: "ad_taxable",
  //       name: "A Taxer",
  //       field: "address.ad_taxable",
  //       sortable: true,
  //       filterable: true,
  //       type: FieldType.string,
  //     },
  //     {
  //       id: "ad_taxc",
  //       name: "Taxe",
  //       field: "address.ad_taxc",
  //       sortable: true,
  //       filterable: true,
  //       type: FieldType.string,
  //     },
  //   ];
  
  //   this.gridOptionsvend = {
  //     enableSorting: true,
  //     enableCellNavigation: true,
  //     enableExcelCopyBuffer: true,
  //     enableFiltering: true,
  //     autoEdit: false,
  //     autoHeight: false,
  //     frozenColumn: 0,
  //     frozenBottom: true,
  //     enableRowSelection: true,
  //     enableCheckboxSelector: true,
  //     checkboxSelector: {
  //       // optionally change the column index position of the icon (defaults to 0)
  //       // columnIndexPosition: 1,
  
  //       // remove the unnecessary "Select All" checkbox in header when in single selection mode
  //       hideSelectAllCheckbox: true,
  
  //       // you can override the logic for showing (or not) the expand icon
  //       // for example, display the expand icon only on every 2nd row
  //       // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
  //     },
  //     multiSelect: false,
  //     rowSelectionOptions: {
  //       // True (Single Selection), False (Multiple Selections)
  //       selectActiveRow: true,
  //     },
  //     dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
  //       var val = undefined;
  //       try {
  //         val = eval("item." + column.field);
  //       } catch (e) {
  //         // ignore
  //       }
  //       return val;
  //     },
  //   };
  
  //   // fill the dataset with your data
  //   this.providerService
  //     .getAll()
  //     .subscribe((response: any) => (this.providers = response.data));
  // }
  // openvend(contentvend) {
  //   this.prepareGridvend();
  //   this.modalService.open(contentvend, { size: "lg" });
  // }

  
  handleSelectedRowsChangedgamme(e, args) {
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
    
    if (Array.isArray(args.rows) && this.gridObjgamme) {
      args.rows.map((idx) => {
        const item = this.gridObjgamme.getDataItem(idx);
    console.log(item)
    updateItem.gamme = item.ro_routing;
      
    this.mvgridService.updateItem(updateItem);
         
      });
    }
  }

  angularGridReadygamme(angularGrid: AngularGridInstance) {
    this.angularGridgamme = angularGrid;
    this.gridObjgamme = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridgamme() {
    this.columnDefinitionsgamme = [
      {
        id: "id",
        field: "id",
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,

        minWidth: 50,
        maxWidth: 50,
      },
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "ro_routing",
        name: "Gamme",
        field: "ro_routing",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ro_desc",
        name: "Designation",
        field: "ro_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
     


    ];

    this.gridOptionsgamme = {
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
    this.workRoutingService
      .getAllDistinct()
      .subscribe((response: any) => (this.gammes = response.data));
  }
  opengamme(content) {
    this.prepareGridgamme();
    this.modalService.open(content, { size: "lg" });
  }

}
