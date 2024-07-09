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
   SiteService, WorkOrderService, 
} from "../../../../core/erp";

@Component({
  selector: 'kt-rp-broyage',
  templateUrl: './rp-broyage.component.html',
  styleUrls: ['./rp-broyage.component.scss']
})
export class RpBroyageComponent implements OnInit {

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

  // grid options


  datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;
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
        width: 60,
        filterable: false,   
        columnGroup:  'OF',
        
      },
      {
        id: "date",
        name: "Date",
        field: "date",
        sortable: true,
        width: 60,
        filterable: false,
        formatter: Formatters.dateIso,   
        columnGroup:  'OF',
        
      },
      
      {
        id: "equipe",
        name: "Equipe",
        field: "equipe",
        sortable: true,
        width: 60,
        filterable: false,   
        columnGroup:  'OF',
        
      },
      
      {
        id: "gamme",
        name: "Ligne",
        field: "gamme",
        sortable: true,
        width: 60,
        filterable: false,   
        columnGroup:  'OF',
        
      },
      {
        id: "nbr",
        name: "N° OF",
        field: "nbr",
        sortable: true,
        width: 60,
        filterable: false,   
        columnGroup:  'OF',
        
      },
     
      
      
      {
        id: "isspal",
        name: "N° BIG BAG",
        field: "isspal",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'ENTREE',
      },
      {
        id: "issserial",
        name: "Lot",
        field: "issserial",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'ENTREE',
      },
      {
        id: "issorigin",
        name: "Origin",
        field: "issorigin",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'ENTREE',
      },
      {
        id: "isspart",
        name: "Article",
        field: "isspart",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'ENTREE',
      },
      {
        id: "isscolor",
        name: "Couleur",
        field: "isscolor",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'ENTREE',
      },
      {
        id: "issqty",
        name: "QTE",
        field: "issqty",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        columnGroup: 'ENTREE',
      },
      {
        id: "isstime",
        name: "Heure",
        field: "isstime",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'ENTREE',
      },
      
      
      {
        id: "rctpart",
        name: "Article",
        field: "rctpart",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'SORTIE',
      },
      {
        id: "rctcolor",
        name: "Couleur",
        field: "rctcolor",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'SORTIE',
      },
      {
        id: "rctqty",
        name: "QTE",
        field: "rctqty",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        columnGroup: 'SORTIE',
      },
      {
        id: "rctserial",
        name: "Lot",
        field: "rctserial",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'SORTIE',
      },
      
      {
        id: "rctpal",
        name: "N° BIG BAG",
        field: "rctpal",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'SORTIE',
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
 

  
 
 
  //create form
  createForm() {
    this.loadingSubject.next(false);
    const date = new Date;
    let site = this.user.usrd_site
    if (site == "*") { site = null }

    this.woForm = this.woFB.group({
     // po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],
      site:[site,Validators.required],
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
   
    const controls = this.woForm.controls
    const site = controls.site.value
    const date = controls.date.value
    ? `${controls.date.value.year}/${controls.date.value.month}/${controls.date.value.day}`
    : null;
  
    const date1 = controls.date1.value
    ? `${controls.date1.value.year}/${controls.date1.value.month}/${controls.date1.value.day}`
    : null;
    if(site != null) {
    this.workOrderService.getBrRep({site,date,date1}).subscribe(
      (response: any) => {   
       // this.sos = response.data.soss
        this.dataset = response.data
       console.log('RAPPORT',this.dataset)
       this.dataView.setItems(this.dataset);
        
         },
      (error) => {
          this.dataset = []
      },
      () => {}
  )
    }
    else {
      alert ("Site erronée")
      controls.site.setValue(null);
      document.getElementById("site").focus();
      this.dataset = []
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


  

}
