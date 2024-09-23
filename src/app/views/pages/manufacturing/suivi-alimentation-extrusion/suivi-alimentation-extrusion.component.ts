
import { ChangeDetectorRef,Component, OnInit } from "@angular/core";
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
  GridStateChange,
  GridStateService,
  GroupTotalFormatters,
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
   SiteService, WorkOrderService, CodeService,DomainService,
} from "../../../../core/erp";
import { jsPDF } from "jspdf";
@Component({
  selector: 'kt-suivi-alimentation-extrusion',
  templateUrl: './suivi-alimentation-extrusion.component.html',
  styleUrls: ['./suivi-alimentation-extrusion.component.scss']
})


export class SuiviAlimentationExtrusionComponent implements OnInit {

  woForm: FormGroup;
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
  dataset2: any[];
  dataset3: any[];
  // grid options
  domain: any;

  datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;
  
  datawo: [];
  columnDefinitionswo: Column[] = [];
  gridOptionswo: GridOption = {};
  gridObjwo: any;
  angularGridwo: AngularGridInstance;
  
  datashift: [];
  columnDefinitionsshift: Column[] = [];
  gridOptionsshift: GridOption = {};
  gridObjshift: any;
  angularGridshift: AngularGridInstance;
  
  user;
  row_number;
  message = "";
  
  constructor(
    private cd: ChangeDetectorRef,
    config: NgbDropdownConfig,
    private woFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private siteService: SiteService,
    private workOrderService: WorkOrderService,
    private codeService: CodeService,
    private domainService: DomainService
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

  initGrid() {
    this.columnDefinitions = [
     

      {
        id: "id",
        name: "ID",
        field: "id",
        sortable: true,
        width: 20,
        filterable: false,   
        
        
      },
      {
        id: "PAYREF",
        name: "REF PAYETTE",
        field: "PAYREF",
        sortable: true,
        width: 40,
        filterable: false,
        //formatter: Formatters.dateIso,   
        columnGroup:  'PAILLETTE',
        
      },
      {
        id: "PAYCOLOR",
        name: "COULEUR",
        field: "PAYCOLOR",
        sortable: true,
        width: 40,
        filterable: false,   
        columnGroup:  'PAILLETTE',
        
      },
      {
        id: "PAYQTY",
        name: "KG",
        field: "PAYQTY",
        sortable: true,
        width: 40,
        filterable: false,   
        columnGroup:  'PAILLETTE',
        
      },
      {
        id: "PAYTIME",
        name: "HEURE",
        field: "PAYTIME",
        sortable: true,
        width: 40,
        filterable: false,   
        columnGroup:  'PAILLETTE',
        
      },
      {
        id: "PAYDEBIT",
        name: "DEBIT",
        field: "PAYDEBIT",
        sortable: true,
        width: 40,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'PAILLETTE',
      },

      {
        id: "SQLREF",
        name: "REF SQUELETTE",
        field: "SQLREF",
        sortable: true,
        width: 40,
        filterable: false,
        //formatter: Formatters.dateIso,   
        columnGroup:  'SQUELETTE',
        
      },
      {
        id: "SQLCOLOR",
        name: "COULEUR",
        field: "SQLCOLOR",
        sortable: true,
        width: 40,
        filterable: false,   
        columnGroup:  'SQUELETTE',
        
      },
      {
        id: "SQLQTY",
        name: "KG",
        field: "SQLQTY",
        sortable: true,
        width: 40,
        filterable: false,   
        columnGroup:  'SQUELETTE',
        
      },
      {
        id: "SQLTIME",
        name: "HEURE",
        field: "SQLTIME",
        sortable: true,
        width: 40,
        filterable: false,   
        columnGroup:  'SQUELETTE',
        
      },
      {
        id: "SQLDEBIT",
        name: "DEBIT",
        field: "SQLDEBIT",
        sortable: true,
        width: 40,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'SQUELETTE',
      },

      {
        id: "PREREF",
        name: "REF PREFORME",
        field: "PREREF",
        sortable: true,
        width: 40,
        filterable: false,
        //formatter: Formatters.dateIso,   
        columnGroup:  'PREFORME',
        
      },
      {
        id: "PRECOLOR",
        name: "COULEUR",
        field: "PRECOLOR",
        sortable: true,
        width: 40,
        filterable: false,   
        columnGroup:  'PREFORME',
        
      },
      {
        id: "PREQTY",
        name: "KG",
        field: "PREQTY",
        sortable: true,
        width: 40,
        filterable: false,   
        columnGroup:  'PREFORME',
        
      },
      {
        id: "PRETIME",
        name: "HEURE",
        field: "PRETIME",
        sortable: true,
        width: 40,
        filterable: false,   
        columnGroup:  'PREFORME',
        
      },
      {
        id: "PREDEBIT",
        name: "DEBIT",
        field: "PREDEBIT",
        sortable: true,
        width: 40,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'PREFORME',
      },

      {
        id: "ORGREF",
        name: "REF ORIGINAL",
        field: "ORGREF",
        sortable: true,
        width: 40,
        filterable: false,
        //formatter: Formatters.dateIso,   
        columnGroup:  '       ORIGINAL',
        
      },
      {
        id: "ORGCOLOR",
        name: "COULEUR",
        field: "ORGCOLOR",
        sortable: true,
        width: 40,
        filterable: false,   
        columnGroup:  '       ORIGINAL',
        
      },
      {
        id: "ORGQTY",
        name: "KG",
        field: "ORGQTY",
        sortable: true,
        width: 40,
        filterable: false,   
        columnGroup:  '       ORIGINAL',
        
      },
      {
        id: "ORGTIME",
        name: "HEURE",
        field: "ORGTIME",
        sortable: true,
        width: 40,
        filterable: false,   
        columnGroup:  '       ORIGINAL',
        
      },
      {
        id: "ORGDEBIT",
        name: "DEBIT",
        field: "ORGDEBIT",
        sortable: true,
        width: 40,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'ORIGINAL',
      },
      
      
      
    ];
    this.gridOptions = {
      formatterOptions: {
           
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: false,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
        maxDecimal:2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
      rowSelectionOptions: {
         
        selectActiveRow: false
      },
      enableCellNavigation: true,
      asyncEditorLoading: false,
      editable: false,
      enableCheckboxSelector:true,
      enableAutoSizeColumns: true,
      enableAutoResize: true,
      showCustomFooter: true,
      enableExcelExport: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 28,
      excelExportOptions: {
        exportWithFormatter: false
      },
      // registerExternalResources: [new ExcelExportService(), this.compositeEditorInstance],
      enableFiltering: true,
      // enableCompositeEditor: true,
     // when using the cellMenu, you can change some of the default options and all use some of the callback methods
      enableCellMenu: true,
    };
  }
  ngOnInit(): void {
    
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(true);
    this.user =  JSON.parse(localStorage.getItem('user'))
    console.log(this.user)
    this.createForm();
    this.initGrid();
    this.domain = JSON.parse(localStorage.getItem("domain"));
  }


 
 

  
 
 
  //create form
  createForm() {
    this.loadingSubject.next(false);
    const date = new Date;
    let site = this.user.usrd_site
    if (site == "*") { site = null }

    this.woForm = this.woFB.group({
     // po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],
      site:[site,Validators.required],
      wo_lot:[''],
      wo_nbr:[''],
      shift:[''],
      date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: 1
      }],
      date1: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }], 
    });

   /* this.sequenceService.getBy({ seq_type: "PO", seq_profile: this.user.usrd_profile }).subscribe(
      (res: any) => {
        this.seq = res.data[0].seq_seq
        console.log(this.seq)
        controls.po_category.setValue(this.seq);
    
    })
    */

  }
  wolist() {
    this.dataset = []
    this.dataset2 = []
    this.dataset3 = []
    const controls = this.woForm.controls
    const site = controls.site.value
    const wo_lot = controls.wo_lot.value
    const wo_nbr = controls.wo_nbr.value
    const shift = controls.shift.value
    const date = controls.date.value
    ? `${controls.date.value.year}/${controls.date.value.month}/${controls.date.value.day}`
    : null;
  
    const date1 = controls.date1.value
    ? `${controls.date1.value.year}/${controls.date1.value.month}/${controls.date1.value.day}`
    : null;
    if(site != null) {
    this.workOrderService.getExRep({site,date,date1,wo_lot,wo_nbr,shift}).subscribe(
      (response: any) => {   
       // this.sos = response.data.soss
        this.dataset = response.data
        this.dataset2 = response.data2
        this.dataset3 = response.data3
       console.log('RAPPORT',this.dataset)
       this.dataView.setItems(this.dataset);
        
         },
      (error) => {
          this.dataset = []
          this.dataset2 = []
          this.dataset3 = []
      },
      () => {}
  )
    }
    else {
      
      controls.site.setValue(null);
      document.getElementById("site").focus();
      this.dataset = []
      this.dataset2 = []
      this.dataset3 = []
      this.dataView.setItems(this.dataset)
    }
  }

  //reste form
  reset() {
    // this.purchaseOrder = new PurchaseOrder();
    this.createForm();
    this.hasFormErrors = false;
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
        filterable: false,
        type: FieldType.string,
      },
      {
        id: "si_desc",
        name: "Designation",
        field: "si_desc",
        sortable: true,
        filterable: false,
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
  onChangenbr() {
    const controls = this.woForm.controls;
    const wo_nbr = controls.wo_nbr.value;
    const wo_lot = controls.wo_lot.value;
    this.workOrderService.getByOne({ wo_lot }).subscribe(
      (res: any) => {
  
        if (!res.data) {
  
            controls.wo_nbr.setValue(null);
            controls.wo_lot.setValue(null);
            document.getElementById("wo_lot").focus();
          } 
      
      });
  }
  
 
  handleSelectedRowsChangedwo(e, args) {
    const controls = this.woForm.controls;
      if (Array.isArray(args.rows) && this.gridObjwo) {
      args.rows.map((idx) => {
        const item = this.gridObjwo.getDataItem(idx);
        console.log(item);
        
       controls.wo_nbr.setValue(item.wo_nbr);
       controls.wo_lot.setValue(item.id) 
    
     
      });

    }
  }
  angularGridReadywo(angularGrid: AngularGridInstance) {
    this.angularGridwo = angularGrid;
    this.gridObjwo = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridwo() {
    this.columnDefinitionswo = [
      
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "wo_nbr",
        name: "N° OF",
        field: "wo_nbr",
        sortable: true,
        filterable: false,
        type: FieldType.string,
      },
      {
        id: "wo_lot",
        name: "Id OF",
        field: "wo_lot",
        sortable: true,
        filterable: false,
        type: FieldType.string,
      },
      {
        id: "wo_part",
        name: "Code Bobine",
        field: "wo_part",
        sortable: true,
        filterable: false,
        type: FieldType.string,
      },
    ];

    this.gridOptionswo = {
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
    
      this.workOrderService
      .getBy({wo_routing : 'U1'})
      .subscribe((response: any) => (this.datawo = response.data));
  
    
  }
  openwo(contentwo) {
    this.prepareGridwo();
    this.modalService.open(contentwo, { size: "lg" });
  }
  onChangeshift() {
    const controls = this.woForm.controls;
    const shift = controls.shift.value;
    
    this.codeService.getBy({code_fldname:'emp_shift',code_value:shift }).subscribe(
      (res: any) => {
  
        if (!res.data) {
  
            
            controls.shift.setValue(null);
            document.getElementById("shift").focus();
          } 
      
      });
  }
  
 
  handleSelectedRowsChangedshift(e, args) {
    const controls = this.woForm.controls;
      if (Array.isArray(args.rows) && this.gridObjshift) {
      args.rows.map((idx) => {
        const item = this.gridObjshift.getDataItem(idx);
        console.log(item);
        
       controls.shift.setValue(item.code_value);
        
    
     
      });

    }
  }
  angularGridReadyshift(angularGrid: AngularGridInstance) {
    this.angularGridshift = angularGrid;
    this.gridObjshift = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridshift() {
    this.columnDefinitionsshift = [
      
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "code_Value",
        name: "Code Equipe",
        field: "code_value",
        sortable: true,
        filterable: false,
        type: FieldType.string,
      },
      {
        id: "code_cmmt",
        name: "Description",
        field: "code_cmmt",
        sortable: true,
        filterable: false,
        type: FieldType.string,
      },
    ];

    this.gridOptionsshift = {
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
    
      this.codeService
      .getBy({code_fldname : 'emp_shift'})
      .subscribe((response: any) => (this.datashift = response.data));
  
    
  }
  openshift(contentshift) {
    this.prepareGridshift();
    this.modalService.open(contentshift, { size: "lg" });
  }
  onPrint() {
    const controls = this.woForm.controls;

    this.printpdf(); //printBc(this.provider, this.dataset, po, this.curr);
    //this.goBack();
  }
  printpdf() {
    // const controls = this.totForm.controls
    const controls = this.woForm.controls;
    console.log("pdf");
    var doc = new jsPDF("l");

    // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
    var img = new Image();
    img.src = "./assets/media/logos/companylogo.png";
    //ENTETE DOCUMENT
    doc.addImage(img, "png", 20, 11, 20, 20);
    doc.setFontSize(12);
    doc.line(10, 10, 288, 10);
    doc.line(10, 10, 10, 35);
    doc.text("SUIVI ALIMENTATION EXTRUSION  " , 110, 25);
    doc.line(10, 30, 82, 30);
    doc.line(82, 10, 82, 35);
    doc.line(216, 10, 216, 35);
    doc.setFontSize(8);
    doc.text("Code: FO-PR-001/DRFT  " , 225, 15);
    doc.line(216, 20, 288, 20);
    doc.text("Date: 2024/07/08  " , 225, 25);
    doc.line(216, 30, 288, 30);
    doc.text("PAGE  " , 225, 33);
    
    doc.text("type : Formulaire" , 11, 33);
    doc.line(10, 35, 288, 35);
    doc.line(288, 10, 288, 35);
    doc.text("Date : " + String(new Date().getFullYear()) + "/" + String(Number(new Date().getMonth()) + 1) + "/" + new Date().getDate() , 11, 38);
    doc.setFontSize(8);
    
    // TABLEAU 1
    doc.setFontSize(6);
    doc.line(24, 40, 96, 40);
    doc.line(24, 40, 24, 45);
    doc.text("OUI/NON",25,42);
    doc.line(50, 40, 50, 45);
    doc.text("COULEUR/FOURNISSEUR",51,42);
    doc.line(82, 40, 82, 45);
    doc.text("COULEUR",83,42);
    doc.line(96, 40, 96, 45);
    doc.line(10, 45, 288, 45);
    doc.line(10, 45, 10, 50);
    doc.text("SAAT",12,47);
    doc.line(24, 45, 24, 50);
    doc.text("ORIGINAL",26,47);
    doc.line(50, 45, 50, 50);
    doc.text("PREFORME",51,47);
    doc.line(68, 45, 68, 50);
    doc.text("PAILLETTE",69,47);
    doc.line(82, 45, 82, 50);
    doc.text("SQUELETTE",83,47);
    doc.line(96, 45, 96, 50);
    doc.text("TECHNICIEN",100,47);
    doc.line(126, 45, 126, 50);
    doc.text("EQUIPE",130,47);
    doc.line(166, 45, 166, 50);
    doc.text("GROUPE A",170,47);
    doc.line(206, 45, 206, 50);
    doc.text("GROUPE B",210,47);
    doc.line(246, 45, 246, 50);
    doc.text("GROUPEC",250,47);
    doc.line(288, 45, 288, 50);
    doc.line(10,50,288,50)
    //line1
    doc.line(10, 50, 10, 55);
    doc.line(24, 50, 24, 55);
    doc.line(50, 50, 50, 55);
    doc.line(68, 50, 68, 55);
    doc.line(82, 50, 82, 55);
    doc.line(96, 50, 96, 55);
    doc.line(126, 50, 126, 55);
    doc.text("OPERATEUR",130,52);
    doc.line(166, 50, 166, 55);
    doc.line(206, 50, 206, 55);
    doc.line(246, 50, 246, 55);
    doc.line(288, 50, 288, 55);
    doc.line(10,55,288,55)
    
    doc.line(10, 55, 10, 60);
    doc.line(24, 55, 24, 60);
    doc.line(50, 55, 50, 60);
    doc.line(68, 55, 68, 60);
    doc.line(82, 55, 82, 60);
    doc.line(96, 55, 96, 60);
    doc.line(126, 55, 126, 60);
    doc.text("AGENT DU MELANGEUR",130,57);
    doc.line(166, 55, 166, 60);
    doc.line(206, 55, 206, 60);
    doc.line(246, 55, 246, 60);
    doc.line(288, 55, 288, 60);
    doc.line(10,60,288,60)

    doc.line(10, 60, 10, 65);
    doc.line(24, 60, 24, 65);
    doc.line(50, 60, 50, 65);
    doc.line(68, 60, 68, 65);
    doc.line(82, 60, 82, 65);
    doc.line(96, 60, 96, 65);
    doc.line(126, 60, 126,65);
    doc.text("AGENT QUALITE",130,62);
    doc.line(166, 60, 166, 65);
    doc.line(206, 60, 206, 65);
    doc.line(246, 60, 246, 65);
    doc.line(288, 60, 288, 65);
    doc.line(10,65,288,65)

    doc.line(10, 65, 10, 70);
    doc.line(24, 65, 24, 70);
    doc.line(50, 65, 50, 70);
    doc.line(68, 65, 68, 70);
    doc.line(82, 65, 82, 70);
    doc.line(96, 65, 96, 70);
    doc.line(126, 65, 126, 70);
    doc.text("RESP QUALITE",130,67);
    // doc.line(166, 65, 166, 70);
    doc.line(206, 65, 206, 70);
    doc.text("CONTROLE POST PROD",210,67);
    doc.line(246, 65, 246, 70);
    doc.text("CONTROLE SYS ERP",250,67);
    doc.line(288, 65, 288, 70);
    doc.line(10,70,288,70)

    doc.line(10, 70, 10, 75);
    doc.line(24, 70, 24, 75);
    doc.line(50, 70, 50, 75);
    doc.line(68, 70, 68, 75);
    doc.line(82, 70, 82, 75);
    doc.line(96, 70, 96, 75);
    doc.line(126, 70, 126, 75);
    // doc.line(166, 70, 166, 75);
    doc.line(206, 70, 206, 75);
    doc.line(246, 70, 246, 75);
    doc.line(288, 70, 288, 75);
    doc.line(10,75,288,75)
    
    // TABLEAU 2 
    doc.line(0, 80, 300, 80);
    doc.line(0, 85, 300, 85);
    doc.line(0, 80, 0, 85);
    doc.text("PAILLETTE", 39, 82.5);
    doc.line(77, 80, 77, 85);
    doc.text("SQUELETTE", 111, 82.5);
    doc.line(154, 80, 154, 85);
    doc.text("PREFORME", 180, 82.5);
    doc.line(221, 80, 221 , 85);
    doc.text("ORIGINAL", 245, 82.5);
    doc.line(300, 80, 300, 85);
    doc.line(0, 85, 300, 85);
    doc.line(0, 85, 0, 90);
    doc.text("REF", 1, 88.5);
    doc.line(14, 85, 14, 90);
    doc.text("COULEUR", 20, 88.5);
    doc.line(41, 85, 41, 90);
    doc.text("KG", 42, 88.5);
    doc.line(49, 85, 49, 90);
    doc.text("HEURE", 50, 88.5);
    doc.line(63, 85, 63, 90);
    doc.text("DEBIT", 64, 88.5);
    doc.line(77, 85, 77, 90);
    doc.text("REF", 85, 88.5);
    doc.line(91, 85, 91, 90);
    doc.text("COULEUR", 95, 88.5);
    doc.line(118, 85, 118, 90);
    doc.text("KG", 119, 88.5);
    doc.line(126, 85, 126, 90);
    doc.text("HEURE", 129, 88.5);
    doc.line(142, 85, 142, 90);
    doc.text("DEBIT", 143, 88.5);
    doc.line(154, 85, 154, 90);
    doc.text("REF", 157, 88.5);
    doc.line(166, 85, 166, 90);
    doc.text("COULEUR", 170, 88.5);
    doc.line(189, 85, 189, 90);
    doc.text("KG", 190, 88.5);
    doc.line(197, 85, 197, 90);
    doc.text("HEURE", 198, 88.5);
    doc.line(209, 85, 209, 90);
    doc.text("DEBIT", 210, 88.5);
    doc.line(221, 85, 221, 90);
    doc.text("REF", 222, 88.5);
    doc.line(235, 85, 235, 90);
    doc.text("COULEUR", 241, 88.5);
    doc.line(267, 85, 267, 90);
    doc.text("KG", 268, 88.5);
    doc.line(275, 85, 275, 90);
    doc.text("HEURE", 278, 88.5);
    doc.line(289, 85, 289, 90);
    doc.text("DEBIT", 290, 88.5);
    doc.line(300, 85, 300, 90);
    doc.line(0, 90, 300, 90);
    

    var i = 95;
    var paysum = 0
    var sqlsum = 0
    var presum = 0
    var orgsum = 0
    var paypct = 0
    var sqlpct = 0
    var prepct = 0
    var orgpct = 0
    var tot = 0
    doc.setFontSize(6);
    
    for (let j = 0; j < this.dataset.length; j++) {
      if (i > 170){
        doc.addPage();
        doc.addImage(img, "png", 20, 11, 20, 20);
        doc.setFontSize(12);
        doc.line(10, 10, 288, 10);
        doc.line(10, 10, 10, 35);
        doc.text("SUIVI ALIMENTATION EXTRUSION  " , 110, 25);
        doc.line(10, 30, 82, 30);
        doc.line(82, 10, 82, 35);
        doc.line(216, 10, 216, 35);
        doc.setFontSize(8);
        doc.text("Code: FO-PR-001/DRFT  " , 225, 15);
        doc.line(216, 20, 288, 20);
        doc.text("Date: 2024/07/08  " , 225, 25);
        doc.line(216, 30, 288, 30);
        doc.text("PAGE  " , 225, 33);
        
        doc.text("type : Formulaire" , 11, 33);
        doc.line(10, 35, 288, 35);
        doc.line(288, 10, 288, 35);
        doc.text("Date : " + String(new Date().getFullYear()) + "/" + String(Number(new Date().getMonth()) + 1) + "/" + new Date().getDate() , 11, 38);
        doc.setFontSize(8);
        
        // TABLEAU 1
        doc.setFontSize(6);
        doc.line(24, 40, 96, 40);
        doc.line(24, 40, 24, 45);
        doc.text("OUI/NON",25,42);
        doc.line(50, 40, 50, 45);
        doc.text("COULEUR/FOURNISSEUR",51,42);
        doc.line(82, 40, 82, 45);
        doc.text("COULEUR",83,42);
        doc.line(96, 40, 96, 45);
        doc.line(10, 45, 288, 45);
        doc.line(10, 45, 10, 50);
        doc.text("SAAT",12,47);
        doc.line(24, 45, 24, 50);
        doc.text("ORIGINAL",26,47);
        doc.line(50, 45, 50, 50);
        doc.text("PREFORME",51,47);
        doc.line(68, 45, 68, 50);
        doc.text("PAILLETTE",69,47);
        doc.line(82, 45, 82, 50);
        doc.text("SQUELETTE",83,47);
        doc.line(96, 45, 96, 50);
        doc.text("TECHNICIEN",100,47);
        doc.line(126, 45, 126, 50);
        doc.text("EQUIPE",130,47);
        doc.line(166, 45, 166, 50);
        doc.text("GROUPE A",170,47);
        doc.line(206, 45, 206, 50);
        doc.text("GROUPE B",210,47);
        doc.line(246, 45, 246, 50);
        doc.text("GROUPEC",250,47);
        doc.line(288, 45, 288, 50);
        doc.line(10,50,288,50)
        //line1
        doc.line(10, 50, 10, 55);
        doc.line(24, 50, 24, 55);
        doc.line(50, 50, 50, 55);
        doc.line(68, 50, 68, 55);
        doc.line(82, 50, 82, 55);
        doc.line(96, 50, 96, 55);
        doc.line(126, 50, 126, 55);
        doc.text("OPERATEUR",130,52);
        doc.line(166, 50, 166, 55);
        doc.line(206, 50, 206, 55);
        doc.line(246, 50, 246, 55);
        doc.line(288, 50, 288, 55);
        doc.line(10,55,288,55)
        
        doc.line(10, 55, 10, 60);
        doc.line(24, 55, 24, 60);
        doc.line(50, 55, 50, 60);
        doc.line(68, 55, 68, 60);
        doc.line(82, 55, 82, 60);
        doc.line(96, 55, 96, 60);
        doc.line(126, 55, 126, 60);
        doc.text("AGENT DU MELANGEUR",130,57);
        doc.line(166, 55, 166, 60);
        doc.line(206, 55, 206, 60);
        doc.line(246, 55, 246, 60);
        doc.line(288, 55, 288, 60);
        doc.line(10,60,288,60)

        doc.line(10, 60, 10, 65);
        doc.line(24, 60, 24, 65);
        doc.line(50, 60, 50, 65);
        doc.line(68, 60, 68, 65);
        doc.line(82, 60, 82, 65);
        doc.line(96, 60, 96, 65);
        doc.line(126, 60, 126,65);
        doc.text("AGENT QUALITE",130,62);
        doc.line(166, 60, 166, 65);
        doc.line(206, 60, 206, 65);
        doc.line(246, 60, 246, 65);
        doc.line(288, 60, 288, 65);
        doc.line(10,65,288,65)

        doc.line(10, 65, 10, 70);
        doc.line(24, 65, 24, 70);
        doc.line(50, 65, 50, 70);
        doc.line(68, 65, 68, 70);
        doc.line(82, 65, 82, 70);
        doc.line(96, 65, 96, 70);
        doc.line(126, 65, 126, 70);
        doc.text("RESP QUALITE",130,67);
        // doc.line(166, 65, 166, 70);
        doc.line(206, 65, 206, 70);
        doc.text("CONTROLE POST PROD",210,67);
        doc.line(246, 65, 246, 70);
        doc.text("CONTROLE SYS ERP",250,67);
        doc.line(288, 65, 288, 70);
        doc.line(10,70,288,70)

        doc.line(10, 70, 10, 75);
        doc.line(24, 70, 24, 75);
        doc.line(50, 70, 50, 75);
        doc.line(68, 70, 68, 75);
        doc.line(82, 70, 82, 75);
        doc.line(96, 70, 96, 75);
        doc.line(126, 70, 126, 75);
        // doc.line(166, 70, 166, 75);
        doc.line(206, 70, 206, 75);
        doc.line(246, 70, 246, 75);
        doc.line(288, 70, 288, 75);
        doc.line(10,75,288,75)
        
        // TABLEAU 2 
        doc.line(0, 80, 300, 80);
        doc.line(0, 85, 300, 85);
        doc.line(0, 80, 0, 85);
        doc.text("PAILLETTE", 39, 82.5);
        doc.line(77, 80, 77, 85);
        doc.text("SQUELETTE", 111, 82.5);
        doc.line(154, 80, 154, 85);
        doc.text("PREFORME", 180, 82.5);
        doc.line(221, 80, 221 , 85);
        doc.text("ORIGINAL", 245, 82.5);
        doc.line(300, 80, 300, 85);
        doc.line(0, 85, 300, 85);
        doc.line(0, 85, 0, 90);
        doc.text("REF", 1, 88.5);
        doc.line(14, 85, 14, 90);
        doc.text("COULEUR", 20, 88.5);
        doc.line(41, 85, 41, 90);
        doc.text("KG", 42, 88.5);
        doc.line(49, 85, 49, 90);
        doc.text("HEURE", 50, 88.5);
        doc.line(63, 85, 63, 90);
        doc.text("DEBIT", 64, 88.5);
        doc.line(77, 85, 77, 90);
        doc.text("REF", 85, 88.5);
        doc.line(91, 85, 91, 90);
        doc.text("COULEUR", 95, 88.5);
        doc.line(118, 85, 118, 90);
        doc.text("KG", 119, 88.5);
        doc.line(126, 85, 126, 90);
        doc.text("HEURE", 129, 88.5);
        doc.line(142, 85, 142, 90);
        doc.text("DEBIT", 143, 88.5);
        doc.line(154, 85, 154, 90);
        doc.text("REF", 157, 88.5);
        doc.line(166, 85, 166, 90);
        doc.text("COULEUR", 170, 88.5);
        doc.line(189, 85, 189, 90);
        doc.text("KG", 190, 88.5);
        doc.line(197, 85, 197, 90);
        doc.text("HEURE", 198, 88.5);
        doc.line(209, 85, 209, 90);
        doc.text("DEBIT", 210, 88.5);
        doc.line(221, 85, 221, 90);
        doc.text("REF", 222, 88.5);
        doc.line(235, 85, 235, 90);
        doc.text("COULEUR", 241, 88.5);
        doc.line(267, 85, 267, 90);
        doc.text("KG", 268, 88.5);
        doc.line(275, 85, 275, 90);
        doc.text("HEURE", 278, 88.5);
        doc.line(289, 85, 289, 90);
        doc.text("DEBIT", 290, 88.5);
        doc.line(300, 85, 300, 90);
        doc.line(0, 90, 300, 90);
        

        i = 95;
    
      }  
      if(this.dataset[j].PAYQTY != null){paysum = paysum + Number(this.dataset[j].PAYQTY), tot = tot + Number(this.dataset[j].PAYQTY) }
      if(this.dataset[j].SQLQTY != null){sqlsum = sqlsum + Number(this.dataset[j].SQLQTY), tot = tot + Number(this.dataset[j].SQLQTY)}
      if(this.dataset[j].PREQTY != null){presum = presum + Number(this.dataset[j].PREQTY), tot = tot + Number(this.dataset[j].PREQTY)}
      if(this.dataset[j].ORGQTY != null){orgsum = orgsum + Number(this.dataset[j].ORGQTY), tot = tot + Number(this.dataset[j].ORGQTY)}
        doc.text(this.dataset[j].PAYREF, 1, i - 1);
        doc.line(14, i - 5, 14, i);
        doc.text(this.dataset[j].PAYCOLOR, 15, i - 1);
        doc.line(41, i - 5, 41, i);
        doc.text(String((this.dataset[j].PAYQTY)), 42, i - 1);
        doc.line(49, i - 5, 49, i);
        doc.text(this.dataset[j].PAYTIME, 50, i - 1);
        doc.line(63, i - 5, 63, i);
        doc.text(this.dataset[j].PAYDEBIT, 64, i - 1);
        doc.line(77, i - 5, 77, i);
        doc.text(String(this.dataset[j].SQLREF), 78, i - 1);
        doc.line(91, i - 5, 91, i);
        doc.text(String(this.dataset[j].SQLCOLOR), 92, i - 1);
        doc.line(118, i - 5, 118, i);
        doc.text(String((this.dataset[j].SQLQTY)), 119, i - 1);
        doc.line(126, i - 5, 126, i);
        doc.text(this.dataset[j].SQLTIME, 127, i - 1);
        doc.line(142, i - 5, 142, i);
        doc.text(this.dataset[j].SQLDEBIT, 143, i - 1);
        doc.line(154, i - 5, 154, i);
        doc.text(String(this.dataset[j].PREREF), 155, i - 1);
        doc.line(166, i - 5, 166, i);
        doc.text(String(this.dataset[j].PRECOLOR), 167, i - 1);
        doc.line(189, i - 5, 189, i);
        doc.text(String((this.dataset[j].PREQTY)), 190, i - 1);
        doc.line(197, i - 5, 197, i);
        doc.text(this.dataset[j].PRETIME, 198, i - 1);
        doc.line(209, i - 5, 209, i);
        doc.text(this.dataset[j].PREDEBIT, 210, i - 1);
        doc.line(221, i - 5, 221, i);
        doc.text(String(this.dataset[j].ORGREF), 222, i - 1);
        doc.line(235, i - 5, 235, i);
        doc.text(String(this.dataset[j].ORGCOLOR), 236, i - 1);
        doc.line(267, i - 5, 267, i);
        doc.text(String((this.dataset[j].ORGQTY)), 268, i - 1);
        doc.line(275, i - 5, 275, i);
        doc.text(this.dataset[j].ORGTIME, 278, i - 1);
        doc.line(289, i - 5, 289, i);
        doc.text(this.dataset[j].ORGDEBIT, 265, i - 1);
        doc.line(0, i , 300, i);
        // doc.line(288, i - 5, 288, i);
        i = i + 5;

      
    }
    if (i > 170){
      doc.addPage();
      doc.addImage(img, "png", 20, 11, 20, 20);
      doc.setFontSize(12);
      doc.line(10, 10, 288, 10);
      doc.line(10, 10, 10, 35);
      doc.text("SUIVI ALIMENTATION EXTRUSION  " , 110, 25);
      doc.line(10, 30, 82, 30);
      doc.line(82, 10, 82, 35);
      doc.line(216, 10, 216, 35);
      doc.setFontSize(8);
      doc.text("Code: FO-PR-001/DRFT  " , 225, 15);
      doc.line(216, 20, 288, 20);
      doc.text("Date: 2024/07/08  " , 225, 25);
      doc.line(216, 30, 288, 30);
      doc.text("PAGE  " , 225, 33);
      
      doc.text("type : Formulaire" , 11, 33);
      doc.line(10, 35, 288, 35);
      doc.line(288, 10, 288, 35);
      doc.text("Date : " + String(new Date().getFullYear()) + "/" + String(Number(new Date().getMonth()) + 1) + "/" + new Date().getDate() , 11, 38);
      doc.setFontSize(8);
      
      // TABLEAU 1
      doc.setFontSize(6);
      doc.line(24, 40, 96, 40);
      doc.line(24, 40, 24, 45);
      doc.text("OUI/NON",25,42);
      doc.line(50, 40, 50, 45);
      doc.text("COULEUR/FOURNISSEUR",51,42);
      doc.line(82, 40, 82, 45);
      doc.text("COULEUR",83,42);
      doc.line(96, 40, 96, 45);
      doc.line(10, 45, 288, 45);
      doc.line(10, 45, 10, 50);
      doc.text("SAAT",12,47);
      doc.line(24, 45, 24, 50);
      doc.text("ORIGINAL",26,47);
      doc.line(50, 45, 50, 50);
      doc.text("PREFORME",51,47);
      doc.line(68, 45, 68, 50);
      doc.text("PAILLETTE",69,47);
      doc.line(82, 45, 82, 50);
      doc.text("SQUELETTE",83,47);
      doc.line(96, 45, 96, 50);
      doc.text("TECHNICIEN",100,47);
      doc.line(126, 45, 126, 50);
      doc.text("EQUIPE",130,47);
      doc.line(166, 45, 166, 50);
      doc.text("GROUPE A",170,47);
      doc.line(206, 45, 206, 50);
      doc.text("GROUPE B",210,47);
      doc.line(246, 45, 246, 50);
      doc.text("GROUPEC",250,47);
      doc.line(288, 45, 288, 50);
      doc.line(10,50,288,50)
      //line1
      doc.line(10, 50, 10, 55);
      doc.line(24, 50, 24, 55);
      doc.line(50, 50, 50, 55);
      doc.line(68, 50, 68, 55);
      doc.line(82, 50, 82, 55);
      doc.line(96, 50, 96, 55);
      doc.line(126, 50, 126, 55);
      doc.text("OPERATEUR",130,52);
      doc.line(166, 50, 166, 55);
      doc.line(206, 50, 206, 55);
      doc.line(246, 50, 246, 55);
      doc.line(288, 50, 288, 55);
      doc.line(10,55,288,55)
      
      doc.line(10, 55, 10, 60);
      doc.line(24, 55, 24, 60);
      doc.line(50, 55, 50, 60);
      doc.line(68, 55, 68, 60);
      doc.line(82, 55, 82, 60);
      doc.line(96, 55, 96, 60);
      doc.line(126, 55, 126, 60);
      doc.text("AGENT DU MELANGEUR",130,57);
      doc.line(166, 55, 166, 60);
      doc.line(206, 55, 206, 60);
      doc.line(246, 55, 246, 60);
      doc.line(288, 55, 288, 60);
      doc.line(10,60,288,60)

      doc.line(10, 60, 10, 65);
      doc.line(24, 60, 24, 65);
      doc.line(50, 60, 50, 65);
      doc.line(68, 60, 68, 65);
      doc.line(82, 60, 82, 65);
      doc.line(96, 60, 96, 65);
      doc.line(126, 60, 126,65);
      doc.text("AGENT QUALITE",130,62);
      doc.line(166, 60, 166, 65);
      doc.line(206, 60, 206, 65);
      doc.line(246, 60, 246, 65);
      doc.line(288, 60, 288, 65);
      doc.line(10,65,288,65)

      doc.line(10, 65, 10, 70);
      doc.line(24, 65, 24, 70);
      doc.line(50, 65, 50, 70);
      doc.line(68, 65, 68, 70);
      doc.line(82, 65, 82, 70);
      doc.line(96, 65, 96, 70);
      doc.line(126, 65, 126, 70);
      doc.text("RESP QUALITE",130,67);
      // doc.line(166, 65, 166, 70);
      doc.line(206, 65, 206, 70);
      doc.text("CONTROLE POST PROD",210,67);
      doc.line(246, 65, 246, 70);
      doc.text("CONTROLE SYS ERP",250,67);
      doc.line(288, 65, 288, 70);
      doc.line(10,70,288,70)

      doc.line(10, 70, 10, 75);
      doc.line(24, 70, 24, 75);
      doc.line(50, 70, 50, 75);
      doc.line(68, 70, 68, 75);
      doc.line(82, 70, 82, 75);
      doc.line(96, 70, 96, 75);
      doc.line(126, 70, 126, 75);
      // doc.line(166, 70, 166, 75);
      doc.line(206, 70, 206, 75);
      doc.line(246, 70, 246, 75);
      doc.line(288, 70, 288, 75);
      doc.line(10,75,288,75)
      
      // TABLEAU 2 
      doc.line(0, 80, 300, 80);
      doc.line(0, 85, 300, 85);
      doc.line(0, 80, 0, 85);
      doc.text("PAILLETTE", 39, 82.5);
      doc.line(77, 80, 77, 85);
      doc.text("SQUELETTE", 111, 82.5);
      doc.line(154, 80, 154, 85);
      doc.text("PREFORME", 180, 82.5);
      doc.line(221, 80, 221 , 85);
      doc.text("ORIGINAL", 245, 82.5);
      doc.line(300, 80, 300, 85);
      doc.line(0, 85, 300, 85);
      doc.line(0, 85, 0, 90);
      doc.text("REF", 1, 88.5);
      doc.line(14, 85, 14, 90);
      doc.text("COULEUR", 20, 88.5);
      doc.line(41, 85, 41, 90);
      doc.text("KG", 42, 88.5);
      doc.line(49, 85, 49, 90);
      doc.text("HEURE", 50, 88.5);
      doc.line(63, 85, 63, 90);
      doc.text("DEBIT", 64, 88.5);
      doc.line(77, 85, 77, 90);
      doc.text("REF", 85, 88.5);
      doc.line(91, 85, 91, 90);
      doc.text("COULEUR", 95, 88.5);
      doc.line(118, 85, 118, 90);
      doc.text("KG", 119, 88.5);
      doc.line(126, 85, 126, 90);
      doc.text("HEURE", 129, 88.5);
      doc.line(142, 85, 142, 90);
      doc.text("DEBIT", 143, 88.5);
      doc.line(154, 85, 154, 90);
      doc.text("REF", 157, 88.5);
      doc.line(166, 85, 166, 90);
      doc.text("COULEUR", 170, 88.5);
      doc.line(189, 85, 189, 90);
      doc.text("KG", 190, 88.5);
      doc.line(197, 85, 197, 90);
      doc.text("HEURE", 198, 88.5);
      doc.line(209, 85, 209, 90);
      doc.text("DEBIT", 210, 88.5);
      doc.line(221, 85, 221, 90);
      doc.text("REF", 222, 88.5);
      doc.line(235, 85, 235, 90);
      doc.text("COULEUR", 241, 88.5);
      doc.line(267, 85, 267, 90);
      doc.text("KG", 268, 88.5);
      doc.line(275, 85, 275, 90);
      doc.text("HEURE", 278, 88.5);
      doc.line(289, 85, 289, 90);
      doc.text("DEBIT", 290, 88.5);
      doc.line(300, 85, 300, 90);
      doc.line(0, 90, 300, 90);
      

      i = 95;
  
    }  
    if(tot != 0){paypct = 100 * Number(paysum / tot)} else{paypct = 0} 
    if(tot != 0){sqlpct = 100 * Number(sqlsum / tot)} else{sqlpct = 0} 
    if(tot != 0){prepct = 100 * Number(presum / tot)} else{prepct = 0} 
    if(tot != 0){orgpct = 100 * Number(orgsum / tot)} else{orgpct = 0} 
    paypct = Number(paypct.toFixed(2))
    sqlpct = Number(sqlpct.toFixed(2))
    prepct = Number(prepct.toFixed(2))
    orgpct = Number(orgpct.toFixed(2))
    // SOMME ET %
    doc.text("SOMME", 1, i - 1);
    doc.line(41, i - 5, 41, i);
    doc.text(String((paysum)), 42, i - 1);
    doc.line(49, i - 5, 49, i);
    doc.line(118, i - 5, 118, i);
    doc.text(String((sqlsum)), 119, i - 1);
    doc.line(126, i - 5, 126, i);
    doc.line(189, i - 5, 189, i);
    doc.text(String((presum)), 190, i - 1);
    doc.line(197, i - 5, 197, i);
    doc.line(267, i - 5, 267, i);
    doc.text(String((orgsum)), 268, i - 1);
    doc.line(275, i - 5, 275, i);
    doc.line(0, i , 300, i);
    i = i + 5
    doc.text("TOTAL KG MP", 1, i - 1);
    doc.line(41, i - 5, 41, i);
    
    doc.setFontSize(8);
    doc.text(String(tot), 45, i - 1);
    doc.line(0, i , 300, i);
    i = i + 5
    doc.setFontSize(6);
    doc.text("%", 1, i - 1);
    doc.line(41, i - 5, 41, i);
    doc.text(String((paypct)), 42, i - 1);
    doc.line(49, i - 5, 49, i);
    doc.line(118, i - 5, 118, i);
    doc.text(String((sqlpct)), 119, i - 1);
    doc.line(126, i - 5, 126, i);
    doc.line(189, i - 5, 189, i);
    doc.text(String((prepct)), 190, i - 1);
    doc.line(197, i - 5, 197, i);
    doc.line(267, i - 5, 267, i);
    doc.text(String((orgpct)), 268, i - 1);
    doc.line(275, i - 5, 275, i);
    doc.line(0, i , 300, i);
    i = i + 10
    doc.line(0, i - 5 , 300, i - 5);
    // RETOUR BOBINE ET COLORANT
    doc.text("RETOUR", 1, i - 1);
    doc.line(49, i - 5, 49, i);
    doc.text("REF 1", 50, i - 1);
    doc.line(63, i - 5, 63, i);
    doc.text("REF 2", 64, i - 1);
    doc.line(77, i - 5, 77, i);
    doc.text("KG", 78, i - 1);
    doc.line(91, i - 5, 91, i);
    doc.text("POUDRE/BLOC", 92, i - 1);
    doc.line(118, i - 5, 118, i);
    doc.text("REF", 119, i - 1);
    doc.line(130, i - 5, 130, i);
    doc.text("KG", 131, i - 1);
    doc.line(141, i - 5, 141, i);
    doc.text('REF COLORANT', 142, i - 1);
    doc.line(155, i - 5, 155, i);
    doc.text('COULEUR', 156, i - 1);
    doc.line(176, i - 5, 176, i);
    doc.text('KG', 177, i - 1);
    doc.line(187, i - 5, 187, i);
    doc.text('HEURE', 188, i - 1);
    doc.line(198, i - 5, 198, i);
    doc.text('DEBIT', 199, i - 1);
    doc.line(209, i - 5, 209, i);
    doc.line(0, i , 300, i);
    i = i + 5
    doc.line(0, i - 5 , 300, i - 5);
    var m = i
    for(let k=0;k<this.dataset2.length;k++)
    {
      doc.text(this.dataset2[k].RETOURCOLOR, 1, i - 1);
      doc.line(49, i - 5, 49, i);
      doc.text(this.dataset2[k].RETOURREF1, 50, i - 1);
      doc.line(63, i - 5, 63, i);
      doc.text(this.dataset2[k].RETOURREF2, 64, i - 1);
      doc.line(77, i - 5, 77, i);
      doc.text(this.dataset2[k].RETOURQTY, 78, i - 1);
      doc.line(91, i - 5, 91, i);
      doc.text(this.dataset2[k].PERTECOLOR, 92, i - 1);
      doc.line(118, i - 5, 118, i);
      doc.text(this.dataset2[k].PERTEREF, 119, i - 1);
      doc.line(130, i - 5, 130, i);
      doc.text(this.dataset2[k].PERTEQTY, 131, i - 1);
      doc.line(141, i - 5, 141, i);
      doc.line(0, i , 300, i);
      i = i + 5
    }
    for(let n = 0;n<this.dataset3.length;n++)
    {
      doc.text(this.dataset3[n].COLREF, 142, m - 1);
      doc.line(155, m - 5, 155, m);
      doc.text(this.dataset3[n].COLCOLOR, 156, m - 1);
      doc.line(176, m - 5, 176, m);
      doc.text(this.dataset3[n].COLQTY, 177, m - 1);
      doc.line(187, m - 5, 187, m);
      doc.text(this.dataset3[n].COLTIME, 188, m - 1);
      doc.line(198, m - 5, 198, m);
      doc.text(this.dataset3[n].COLDEBIT, 199, m - 1);
      doc.line(209, m - 5, 209, m);
      doc.line(0, m , 300, m);
      m = m + 5
    }
    let nbr = String(new Date().getFullYear()+"/" + Number(new Date().getMonth() + 1) + "/" + Number(new Date().getDate()))
    doc.save('AX-' + nbr + '.pdf')
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
    
  } 

}
