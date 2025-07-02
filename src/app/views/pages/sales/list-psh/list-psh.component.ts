import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import {
  Formatter,
  Editor,
  Editors,
  OnEventArgs,
  AngularGridInstance,
  Aggregators,
  Column,
  DelimiterType,
  FieldType,
  FileType,
  Filters,
  Formatters,
  FlatpickrOption,
  GridService,
  GridOption,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
  ColumnFilter,
  Filter,
  FilterArguments,
  FilterCallback,
  MultipleSelectOption,
  OperatorType,
  OperatorString,
  SearchTerm,
} from "angular-slickgrid"
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
  SiteService,
  MobileSettingsService,
  SaleShiperService,
  AccountShiperService,
  CustomerService,
  DeviseService,
} from "../../../../core/erp";
import { round } from 'lodash';
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
import thId from "src/assets/plugins/formvalidation/src/js/validators/id/thId";
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { HttpClient } from "@angular/common/http"
const API_URL = environment.apiUrl + "/users-mobile"

const API_URL_codes = environment.apiUrl + "/codes"
const API_URL_items = environment.apiUrl + "/items"

@Component({
  selector: 'kt-list-psh',
  templateUrl: './list-psh.component.html',
  styleUrls: ['./list-psh.component.scss']
})
export class ListPshComponent implements OnInit {

 
 
  soForm: FormGroup;
  totForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;

  draggableGroupingPlugin: any;
  
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];

  draggableGroupingPluginp: any;
  
  selectedGroupingFieldsp: Array<string | GroupingGetterFunction> = ['', '', ''];
  // grid options

  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];

  
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  
  
  datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;
  
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
  invid : any;
domain : any
customer: any;
pshshipdate
as: any
  constructor(
    config: NgbDropdownConfig,
    private soFB: FormBuilder,
    private http: HttpClient,
    private httpUtils: HttpUtilsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private siteService: SiteService,
    private saleShiperService: SaleShiperService,
    private accountShiperService: AccountShiperService,
    private customerService: CustomerService,
    private deviseService : DeviseService
  ) {
    config.autoClose = true;
    
  
  }

  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  GridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    this.domain = JSON.parse(localStorage.getItem("domain"));
    console.log(this.user)
    this.createForm();
    this.initmvGrid();
    //this.initGrid();
    this.solist();
   
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
      },*/
      {
        id: "id",
        name: "id",
        field: "id",
        excludeFromHeaderMenu: true,
      
        minWidth: 30,
        maxWidth: 30,
        
      },
      {
        id: "psh_site",
        name: "Site",
        field: "psh_site",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        grouping: {
          getter: 'psh_site',
          formatter: (g) => `Site: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('quantity'),  
            new Aggregators.Sum('amount'),
          ],
            aggregateCollapsed: false,
            collapsed: false,
          }

      }, 
      {
        id: "psh_ship_date",
        name: "Date",
        field: "psh_ship_date",
        sortable: true,
        width: 50,
        type: FieldType.date,
        filterable: true,
        filter: {
          model: Filters.dateRange,
          operator: 'RangeInclusive',
          // override any of the Flatpickr options through "filterOptions"
          //editorOptions: { minDate: 'today' } as FlatpickrOption
        },
        grouping: {
          getter: 'psh_ship_date',
          formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('psh_ship_qty'),  
            new Aggregators.Sum('psh_price'),
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
       
      },
      {
        id: "psh_shiper",
        name: "N° BL",
        field: "psh_shiper",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        grouping: {
          getter: 'psh_shiper',
          formatter: (g) => `N° BL: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('psh_qty_ship'),  
            new Aggregators.Sum('psh_price'),
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
       
      }, 
      {
        id: "psh_nbr",
        name: "N° BC",
        field: "psh_nbr",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        grouping: {
          getter: 'psh_nbr',
          formatter: (g) => `N° BC: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('psh_qty_ship'),  
            new Aggregators.Sum('psh_price'),
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
       
      }, 
      
      {
        id: "customer_code",
        name: "Code Client",
        field: "customer_code",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        grouping: {
          getter: 'customer_code',
          formatter: (g) => `Client: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('quantity'),  
            new Aggregators.Sum('amount'),
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
       
      }, 
      {
        id: "customer_name",
        name: "Nom Client",
        field: "customer_name",
        sortable: true,
        width: 150,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        grouping: {
          getter: 'customer_name',
          formatter: (g) => `Nom Client: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('quantity'),  
            new Aggregators.Sum('amount'),
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
       
      }, 
      {
        id: "pt_part_type",
        name: "Type",
        field: "pt_part_type",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
       // filter: {collectionAsync:  this.http.get(`${API_URL_codes}/parttypes`),model: Filters.multipleSelect , operator: OperatorType.inContains },
        filter: {

         
          // collectionAsync: this.elem,
          collectionAsync:  this.http.get(`${API_URL_codes}/parttypes`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
       
         
         
           model: Filters.multipleSelect,
          
         },
        grouping: {
          getter: 'pt_part_type',
          formatter: (g) => `Type Produit: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('quantity'),  
            new Aggregators.Sum('amount'),
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
       
      },
      {
        id: "psh_part",
        name: "Code Produit",
        field: "psh_part",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        // filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        filter: {

         
          // collectionAsync: this.elem,
          collectionAsync:  this.http.get(`${API_URL_items}/findpart`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
       
         
         
           model: Filters.multipleSelect,
          
         },
        grouping: {
          getter: 'psh_part',
          formatter: (g) => `Code Produit: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('psh_qty_ship'),  
            new Aggregators.Sum('psh_price'),
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
       
      },
      {
        id: "designation",
        name: "Designation",
        field: "designation",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        grouping: {
          getter: 'designation',
          formatter: (g) => `Designation: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('psh_qty_ship'),  
            new Aggregators.Sum('psh_price'),
          
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
       
      },
      {
        id: "psh_serial",
        name: "Lot",
        field: "psh_serial",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        grouping: {
          getter: 'psh_serial',
          formatter: (g) => `Lot: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('psh_qty_ship'),  
            new Aggregators.Sum('psh_price'),
          
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
       
      },
      {
        id: "psh_invoiced",
        name: "Facturé",
        field: "psh_invoiced",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        formatter: Formatters.checkmark,
        filter: {

              
           collection: [{value: true , label: "OUI"}, {value: false , label: "NON"}],
          //collectionAsync:  this.http.get(`${API_URL}/trans`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
       
       
         
           model: Filters.multipleSelect,
          
         },
        grouping: {
          getter: 'psh_invoiced',
          formatter: (g) => `Facturé: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('psh_qty_ship'),  
            new Aggregators.Sum('psh_price'),
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
      },
      
     
     
      {
        id: "psh_qty_ship",
        name: "QTE",
        field: "psh_qty_ship",
        sortable: true,
        width: 50,
        filterable: true,
       
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        type: FieldType.float,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 

      },
      {
        id: "psh_price",
        name: "Montant",
        field: "psh_price",
        sortable: true,
        width: 50,
        filterable: true,
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        type: FieldType.number,
        formatter:Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2, exportWithFormatter: true }, 
       
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
      },
      {
        id: "print",
        name: "Imprimer",
        field: "id",
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        
          //formatter: Formatters.editIcon,
          formatter: (row, cell, value, columnDef, dataContext) => {
            // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
            return `
            <a class="btn btn-sm btn-clean btn-icon mr-2" title="Imprimer">
            <i class="flaticon2-print"></i>
        </a>
             `;
          },
        
        minWidth: 50,
        maxWidth: 80,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (e: Event, args: OnEventArgs) => {
           const id = args.dataContext.psh_shiper
           console.log(args.dataContext.psh_shiper)
           this.saleShiperService.getBy({psh_shiper:args.dataContext.psh_shiper}).subscribe(
            (response: any) => {   
              this.dataset = response.data
             console.log(this.dataset)
             this.accountShiperService.getBy({as_nbr:args.dataContext.psh_shiper}).subscribe(
              (respo: any) => {   
                this.as = respo.data[0]
                this.customerService.getBy({cm_addr:this.as.as_cust}).subscribe(
                  (respon: any) => {   
                    this.customer = respon.data
                    this.deviseService.getBy({cu_curr:this.as.as_curr}).subscribe(
                      (res: any) => {   
                        this.curr = res.data
                        this.printpdf(args.dataContext.psh_shiper)
                       
                         },
                      (error) => {
                          this.as = null
                      },
                      () => {}
                  )
                   
                     },
                  (error) => {
                      this.as = null
                  },
                  () => {}
              )
                
               
                 },
              (error) => {
                  this.as = null
              },
              () => {}
          )


               },
            (error) => {
                this.dataset = []
            },
            () => {}
        )
          //  this.router.navigateByUrl(`/inventory-transaction/po-receip-id/${id}`)
        },
      },
      

    ];

    this.mvgridOptions = {
      enableDraggableGrouping: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 40,
      enableFiltering: true,
      enableAutoResize: true,
      enableSorting: true,
      enableExcelExport:true,
      enableExcelCopyBuffer: true,
      exportOptions: {
        sanitizeDataExport: true
      },
       
        //enableRowSelection: true,
      //   enableCellNavigation: true,
      //   enableCheckboxSelector: true,
      //   checkboxSelector: {
      //     // optionally change the column index position of the icon (defaults to 0)
      //     // columnIndexPosition: 1,
  
      //     // remove the unnecessary "Select All" checkbox in header when in single selection mode
      //     hideSelectAllCheckbox: true,
  
      //     // you can override the logic for showing (or not) the expand icon
      //     // for example, display the expand icon only on every 2nd row
      //     // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
      //   },
      //  // multiSelect: false,
      //   rowSelectionOptions: {
      //     // True (Single Selection), False (Multiple Selections)
      //     selectActiveRow: true,
      //   },
       
        formatterOptions: {
        
          // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
          displayNegativeNumberWithParentheses: true,
    
          // Defaults to undefined, minimum number of decimals
          minDecimal: 2,
          maxDecimal:2,
    
          // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
          thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
        },
        gridMenu: {
          onCommand: (e, args) => {
            if (args.command === 'toggle-preheader') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
              this.clearGrouping();
            }
          },
        },
        draggableGrouping: {
          dropPlaceHolderText: 'Drop a column header here to group by the column',
          // groupIconCssClass: 'fa fa-outdent',
          deleteIconCssClass: 'fa fa-times',
          onGroupChanged: (e, args) => this.onGroupChanged(args),
          onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
      
      },

    }
    this.mvdataset = [];
    
    console.log(this.user)
    const controls = this.soForm.controls
    const date = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
  
    const date1 = controls.calc_date1.value
    ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
    : null;
    console.log(date,controls.calc_date.value,date1)
    const site = controls.site.value
    let obj= {date,date1,site}
    this.saleShiperService.getAllBy(obj).subscribe(
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
  }
  solist() {
    this.mvdataset = []
   
    const controls = this.soForm.controls
    const date = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
  
    const date1 = controls.calc_date1.value
    ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
    : null;
    const site = controls.site.value
    let obj= {date,date1,site}
    this.saleShiperService.getAllBy(obj).subscribe(
      (response: any) => {   
        this.mvdataset = response.data
       console.log(this.mvdataset)
     //  this.mvdataView.setItems(this.mvdataset);
        
         },
      (error) => {
          this.mvdataset = []
      },
      () => {}
  )
  }
  onChangesite() {
    const controls = this.soForm.controls;
    const si_site = controls.site.value;
    
   
    this.siteService.getByOne({ si_site }).subscribe(
      (res: any) => {
  
        if (!res.data) {
          if( this.user.usrd_site != "*" ) {
            alert("Site n'existe pas  ")
            controls.site.setValue(null);
            document.getElementById("site").focus();
          }
          } else {
           if( this.user.usrd_site != "*" && si_site != this.user.usrd_site){
            alert("Site n'est pas autorisé pour cet utilisateur ")
            controls.site.setValue(null);
            document.getElementById("site").focus();
             


           } 
          }
      
      });
   
  }
  
 
  //create form
  createForm() {
    this.loadingSubject.next(false);
    const date = new Date;
    
    this.soForm = this.soFB.group({
     // po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],
     site:[this.user.usrd_site,Validators.required],
     
      calc_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: 1
      }],
      calc_date1: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
    });

    const controls = this.soForm.controls
   /* this.sequenceService.getBy({ seq_type: "PO", seq_profile: this.user.usrd_profile }).subscribe(
      (res: any) => {
        this.seq = res.data[0].seq_seq
        console.log(this.seq)
        controls.po_category.setValue(this.seq);
    
    })
    */

  }
  //reste form
  onGroupChanged(change: { caller?: string; groupColumns: Grouping[] }) {
    // the "caller" property might not be in the SlickGrid core lib yet, reference PR https://github.com/6pac/SlickGrid/pull/303
    const caller = change && change.caller || [];
    const groups = change && change.groupColumns || [];

    if (Array.isArray(this.selectedGroupingFields) && Array.isArray(groups) && groups.length > 0) {
      // update all Group By select dropdown
      this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = groups[i] && groups[i].getter || '');
    } else if (groups.length === 0 && caller === 'remove-group') {
      this.clearGroupingSelects();
    }
  }
  clearGroupingSelects() {
    this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = '');
  }
  
  collapseAllGroups() {
    this.mvdataView.collapseAllGroups();
  }

  expandAllGroups() {
    this.mvdataView.expandAllGroups();
  }
  clearGrouping() {
    if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
      this.draggableGroupingPlugin.clearDroppedGroups();
    }
    this.mvgrid.invalidate(); // invalidate all rows and re-render
  }
 
   
  handleSelectedRowsChangedsite(e, args) {
    const controls = this.soForm.controls;
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



  printpdf(nbr) {
   
    this.pshshipdate = this.dataset[0].psh_ship_date
    console.log("pdf")
    var doc = new jsPDF();
    var img = new Image();
    img.src = "./assets/media/logos/companylogo.png";
      doc.addImage(img, "png", 170, 5, 45, 30);
      doc.setFontSize(9);
      if (this.domain.dom_name != null) {
        doc.text(this.domain.dom_name, 10, 10);
      }
      if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
      if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
      if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
      doc.line(10, 32, 200, 32);
      doc.text( 'RC : ' + this.domain.dom_rc + "          NIF : " + this.domain.dom_nif +  "          AI : " + this.domain.dom_ai  , 60, 37);
      doc.line(10, 40, 200, 40);
      // doc.barcode(nbr, {
      //   fontSize: 45,
      //   textColor: "#000000",
      //   x: 120,
      //   y: 50,
      //   textOptions: { align: "center" }, // optional text options
      // });
      doc.setFont("Times-Roman");
    doc.setFontSize(12);
    doc.text( 'Bon Livraison N° : ' + nbr  , 87, 45);
    doc.setFontSize(12);
    //console.log(this.customer.address.ad_misc2_id)
    doc.text('Code Client : ' + this.customer.address.ad_addr, 20 , 50 )
    doc.text('Date : ' +this.pshshipdate, 150 , 50 )
    doc.text('Nom             : ' + this.customer.address.ad_name, 20 , 55)
    doc.text('Adresse       : ' + this.customer.address.ad_line1, 20 , 60)
    if (this.customer.address.ad_misc2_id != null) {doc.text('MF          : ' + this.customer.address.ad_misc2_id, 20 , 65)}
        if (this.customer.address.ad_gst_id != null) {doc.text('RC          : ' + this.customer.address.ad_gst_id, 20 , 70)}
        if (this.customer.address.ad_pst_id) {doc.text('AI            : ' + this.customer.address.ad_pst_id, 20 , 75)}
        if (this.customer.address.ad_misc1_id != null) {doc.text('NIS         : ' + this.customer.address.ad_misc1_id, 20 , 80)}
        doc.setFontSize(9);
    doc.line(10, 85, 200, 85);
    doc.line(10, 90, 200, 90);
    doc.line(10, 85, 10, 90);
    doc.text('LN', 12.5 , 88.5);
    doc.line(20, 85, 20, 90);
    doc.text('Code Article', 25 , 88.5);
    doc.line(45, 85, 45, 90);
    doc.text('Désignation', 67.5 , 88.5);
    doc.line(100, 85, 100, 90);
    doc.text('QTE', 107 , 88.5);
    doc.line(120, 85, 120, 90);
    doc.text('UM', 123 , 88.5);
    doc.line(130, 85, 130, 90);
    doc.text('PU', 138 , 88.5);
    doc.line(150, 85, 150, 90);
    doc.text('TVA', 152 , 88.5);
    doc.line(160, 85, 160, 90);
    doc.text('REM', 162 , 88.5);
    doc.line(170, 85, 170, 90);
    doc.text('THT', 181 , 88.5);
    doc.line(200, 85, 200, 90);
    var i = 95;
    doc.setFontSize(9);
    for (let j = 0; j < this.dataset.length  ; j++) {
      
      if ((j % 30 == 0) && (j != 0) ) {
  doc.addPage();
  doc.addImage(img, "png", 170, 5, 45, 30);
  doc.setFontSize(9);
  if (this.domain.dom_name != null) {
    doc.text(this.domain.dom_name, 10, 10);
  }
  if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
  if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
  if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
  doc.line(10, 32, 200, 32);
  doc.text( 'RC : ' + this.domain.dom_rc + "          NIF : " + this.domain.dom_nif +  "          AI : " + this.domain.dom_ai  , 60, 37);
  doc.line(10, 40, 200, 40);
  // doc.barcode(nbr, {
  //   fontSize: 45,
  //   textColor: "#000000",
  //   x: 120,
  //   y: 50,
  //   textOptions: { align: "center" }, // optional text options
  // });
  doc.setFont("Times-Roman");
  doc.setFontSize(12);
  doc.text( 'Bon Livraison N° : ' + nbr  , 87, 45);
        doc.setFontSize(12);
        //console.log(this.customer.ad_misc2_id)
        doc.text('Code Client : ' + this.customer.address.ad_addr, 20 , 50 )
        doc.text('Date : ' +this.pshshipdate, 150 , 50 )
        doc.text('Nom             : ' + this.customer.address.ad_name, 20 , 55)
        doc.text('Adresse       : ' + this.customer.address.ad_line1, 20 , 60)
        if (this.customer.address.ad_misc2_id != null) {doc.text('MF          : ' + this.customer.address.ad_misc2_id, 20 , 65)}
        if (this.customer.address.ad_gst_id != null) {doc.text('RC          : ' + this.customer.address.ad_gst_id, 20 , 70)}
        if (this.customer.address.ad_pst_id) {doc.text('AI            : ' + this.customer.address.ad_pst_id, 20 , 75)}
        if (this.customer.address.ad_misc1_id != null) {doc.text('NIS         : ' + this.customer.address.ad_misc1_id, 20 , 80)}
        doc.setFontSize(9);
        doc.line(10, 85, 200, 85);
        doc.line(10, 90, 200, 90);
        doc.line(10, 85, 10, 90);
        doc.text('LN', 12.5 , 88.5);
        doc.line(20, 85, 20, 90);
        doc.text('Code Article', 25 , 88.5);
        doc.line(45, 85, 45, 90);
        doc.text('Désignation', 67.5 , 88.5);
        doc.line(100, 85, 100, 90);
        doc.text('QTE', 107 , 88.5);
        doc.line(120, 85, 120, 90);
        doc.text('UM', 123 , 88.5);
        doc.line(130, 85, 130, 90);
        doc.text('PU', 138 , 88.5);
        doc.line(150, 85, 150, 90);
        doc.text('TVA', 152 , 88.5);
        doc.line(160, 85, 160, 90);
        doc.text('REM', 162 , 88.5);
        doc.line(170, 85, 170, 90);
        doc.text('THT', 181 , 88.5);
        doc.line(200, 85, 200, 90);
        i = 95;
        doc.setFontSize(9);
  
      }
  
  
  
      if (this.dataset[j].item.pt_desc1.length > 35) {
        let desc1 = this.dataset[j].item.pt_desc1.substring(35)
        let ind = desc1.indexOf(' ')
        desc1 = this.dataset[j].item.pt_desc1.substring(0, 35  + ind)
        let desc2 = this.dataset[j].item.pt_desc1.substring(35+ind)
  
        doc.line(10, i - 5, 10, i );
        doc.text(String(("000"+ this.dataset[j].psh_line)).slice(-3), 12.5 , i  - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.dataset[j].psh_part, 25 , i  - 1);
        doc.line(45, i - 5 , 45, i );
        doc.text(desc1, 47 , i  - 1);
        doc.line(100, i - 5, 100, i );
        doc.text( String(Number(this.dataset[j].psh_qty_ship).toFixed(2)), 118 , i  - 1 , { align: 'right' });
        doc.line(120, i - 5 , 120, i );
        doc.text(this.dataset[j].psh_um, 123 , i  - 1);
        doc.line(130, i - 5, 130, i );
        doc.text( String(Number(this.dataset[j].psh_price).toFixed(2)), 148 , i  - 1 , { align: 'right' });
        doc.line(150, i - 5, 150, i );
        doc.text(String(this.dataset[j].psh_taxc) + "%" , 153 , i  - 1);
        doc.line(160, i - 5 , 160, i );
        doc.text(String(this.dataset[j].psh_disc_pct) + "%" , 163 , i  - 1);
        doc.line(170, i - 5 , 170, i );
        doc.text(String((this.dataset[j].psh_price *
                ((100 - this.dataset[j].psh_disc_pct) / 100) *
                this.dataset[j].psh_qty_ship).toFixed(2)), 198 , i  - 1,{ align: 'right' });
        doc.line(200, i-5 , 200, i );
       // doc.line(10, i, 200, i );
  
        i = i + 5;
  
        doc.text(desc2, 47 , i  - 1);
        
        doc.line(10, i - 5, 10, i );
        doc.line(20, i - 5, 20, i);
        doc.line(45, i - 5 , 45, i );
        doc.line(100, i - 5, 100, i );
        doc.line(120, i - 5 , 120, i );
        doc.line(130, i - 5, 130, i );
        doc.line(150, i - 5, 150, i );
        doc.line(160, i - 5 , 160, i );
        doc.line(170, i - 5 , 170, i );
        doc.line(200, i-5 , 200, i );
        doc.line(10, i, 200, i );
  
        i = i + 5 ;
        
      } else {
  
  
      
      doc.line(10, i - 5, 10, i );
      doc.text(String(("000"+ this.dataset[j].psh_line)).slice(-3), 12.5 , i  - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.dataset[j].psh_part, 25 , i  - 1);
      doc.line(45, i - 5 , 45, i );
      doc.text(this.dataset[j].item.pt_desc1, 47 , i  - 1);
      doc.line(100, i - 5, 100, i );
      doc.text( String(Number(this.dataset[j].psh_qty_ship).toFixed(2)), 118 , i  - 1 , { align: 'right' });
      doc.line(120, i - 5 , 120, i );
      doc.text(this.dataset[j].psh_um, 123 , i  - 1);
      doc.line(130, i - 5, 130, i );
      doc.text( String(Number(this.dataset[j].psh_price).toFixed(2)), 148 , i  - 1 , { align: 'right' });
      doc.line(150, i - 5, 150, i );
      doc.text(String(this.dataset[j].psh_taxc) + "%" , 153 , i  - 1);
      doc.line(160, i - 5 , 160, i );
      doc.text(String(this.dataset[j].psh_disc_pct) + "%" , 163 , i  - 1);
      doc.line(170, i - 5 , 170, i );
      doc.text(String((this.dataset[j].psh_price *
        ((100 - this.dataset[j].psh_disc_pct) / 100) *
        this.dataset[j].psh_qty_ship).toFixed(2)), 198 , i  - 1,{ align: 'right' });
      doc.line(200, i-5 , 200, i );
      doc.line(10, i, 200, i );
      i = i + 5;
      }
    }
    
   // doc.line(10, i - 5, 200, i - 5);
  
   doc.line(130, i + 7,  200, i + 7  );
   doc.line(130, i + 14, 200, i + 14 );
   doc.line(130, i + 21, 200, i + 21 );
   doc.line(130, i + 28, 200, i + 28 );
   doc.line(130, i + 35, 200, i + 35 );
   doc.line(130, i + 7,  130, i + 35  );
   doc.line(160, i + 7,  160, i + 35  );
   doc.line(200, i + 7,  200, i + 35  );
   doc.setFontSize(10);
   
   doc.text('Total HT', 140 ,  i + 12 , { align: 'left' });
   doc.text('TVA', 140 ,  i + 19 , { align: 'left' });
   doc.text('Timbre', 140 ,  i + 26 , { align: 'left' });
   doc.text('Total TC', 140 ,  i + 33 , { align: 'left' });
  
   
   doc.text(String(Number(this.as.dec01).toFixed(2)), 198 ,  i + 12 , { align: 'right' });
   doc.text(String(Number(this.as.dec02).toFixed(2)), 198 ,  i + 19 , { align: 'right' });
   doc.text(String(Number(this.as.dec03).toFixed(2)), 198 ,  i + 26 , { align: 'right' });
   doc.text(String(Number(this.as.as_base_amt).toFixed(2)), 198 ,  i + 33 , { align: 'right' });
  
   doc.setFontSize(8);
      let mt = NumberToLetters(
        Number(this.as.as_base_amt).toFixed(2),this.curr.cu_desc)
  
        if (mt.length > 95) {
          let mt1 = mt.substring(90)
          let ind = mt1.indexOf(' ')
         
          mt1 = mt.substring(0, 90  + ind)
          let mt2 = mt.substring(90+ind)
     
          doc.text( "Arretée la présente Commande a la somme de :" + mt1  , 20, i + 53)
          doc.text(  mt2  , 20, i + 60)
        } else {
          doc.text( "Arretée la présente Commande a la somme de :" + mt  , 20, i + 53)
  
        }
      // window.open(doc.output('bloburl'), '_blank');
      //window.open(doc.output('blobUrl'));  // will open a new tab
      var blob = doc.output("blob");
      window.open(URL.createObjectURL(blob));
  
    }
 
}
