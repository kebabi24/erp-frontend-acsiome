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
  LocationService,
  BankService,
} from "../../../../core/erp";
import { round } from 'lodash';
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
import thId from "src/assets/plugins/formvalidation/src/js/validators/id/thId";


@Component({
  selector: 'kt-list-caisse',
  templateUrl: './list-caisse.component.html',
  styleUrls: ['./list-caisse.component.scss']
})
export class ListCaisseComponent implements OnInit {
  soForm: FormGroup;
  totForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;

  draggableGroupingPlugin: any;
  
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  // grid options

  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];

  datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;
  
  user;
  row_number;
  message = "";
  date: String;
  posForm: FormGroup;
  constructor(
    config: NgbDropdownConfig,
    private soFB: FormBuilder,
   
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private posFB: FormBuilder,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private siteService: SiteService,
    private bankService: BankService,
  ) {
    config.autoClose = true;

  }

  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    console.log(this.user)
    this.initmvGrid();
    this.createForm();
    this.poslist();
   
  }

  createForm() {
    const date = new Date ;
    date.setDate(date.getDate() - 2);
    const date1 = new Date;
    this.posForm = this.posFB.group({
    
      date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: 1
      }],
      date1: [{
        year:date1.getFullYear(),
        month: date1.getMonth()+1,
        day: date1.getDate()
      }],
      
      tr_site:[this.user.usrd_site,Validators.required],
    });
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
        id: "effdate",
        name: "Date Effet",
        field: "effdate",
        nameKey: 'effdate',
        sortable: true,
      

        formatter: Formatters.dateIso, 
        minWidth: 75,
        width: 120,
        exportWithFormatter: true,

        type: FieldType.date,
        filterable: true,
        filter: {
          model: Filters.dateRange,
          operator: 'RangeInclusive',
          // override any of the Flatpickr options through "filterOptions"
          //editorOptions: { minDate: 'today' } as FlatpickrOption
        },
          
        grouping: {
          getter: 'effdate',
          formatter: (g) => `Date Effet: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('balance'),
            new Aggregators.Sum('O'),
            new Aggregators.Sum('C'),
            new Aggregators.Sum('R'),
            new Aggregators.Sum('D'),
          ],
            aggregateCollapsed: false,
            collapsed: false,
          
        }
      },
      {
        id: "date",
        name: "Date Saisie",
        field: "date",
        nameKey: 'date',
        sortable: true,
      

        formatter: Formatters.dateTimeIso, 
        minWidth: 75,
        width: 120,
        exportWithFormatter: true,

        type: FieldType.date,
        filterable: true,
       
        
      },

      {
        id: "code",
        name: "Code",
        field: "code",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
        grouping: {
          getter: 'code',
          formatter: (g) => `Code: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('balance'),
            new Aggregators.Sum('O'),
            new Aggregators.Sum('C'),
            new Aggregators.Sum('R'),
            new Aggregators.Sum('D'),
          ],
            aggregateCollapsed: false,
            collapsed: false,
          }

      },
      {
        id: "site",
        name: "Site",
        field: "site",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
        grouping: {
          getter: 'site',
          formatter: (g) => `Site: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('balance'),
            new Aggregators.Sum('O'),
            new Aggregators.Sum('C'),
            new Aggregators.Sum('R'),
            new Aggregators.Sum('D'),
          ],
            aggregateCollapsed: false,
            collapsed: false,
          }

      },
      /*{
        id: "bkh_emp",
        name: "Type",
        field: "order_emp",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
        grouping: {
          getter: 'order_emp',
          formatter: (g) => `Type: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('total_price'),
            new Aggregators.Sum('disc_amt')
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
       
      },
      {
        id: "del_comp",
        name: "Plateforme de Livraison",
        field: "del_comp",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
        grouping: {
          getter: 'del_comp',
          formatter: (g) => `Plateforme: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('total_price'),
            new Aggregators.Sum('disc_amt')
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
       
      },*/
      {
        id: "balance",
        name: "Balance",
        field: "balance",
        sortable: true,
        width: 50,
        filterable: false,
       
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        type: FieldType.float,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 

      },
      {
        id: "O",
        name: "Ouverture",
        field: "O",
        sortable: true,
        width: 50,
        filterable: false,
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        type: FieldType.float,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
        formatter: Formatters.decimal,
        params: { decimalPlaces: 2 },

      },
      {
        id: "D",
        name: "Depense",
        field: "D",
        sortable: true,
        width: 50,
        filterable: false,
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        type: FieldType.float,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
        formatter: Formatters.decimal,
        params: { decimalPlaces: 2 },

      },
      {
        id: "R",
        name: "Recette",
        field: "R",
        sortable: true,
        width: 50,
        filterable: false,
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        type: FieldType.float,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
        formatter: Formatters.decimal,
        params: { decimalPlaces: 2 },

      },
      {
        id: "C",
        name: "Cloture",
        field: "C",
        sortable: true,
        width: 50,
        filterable: false,
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        type: FieldType.float,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
        formatter: Formatters.decimal,
        params: { decimalPlaces: 2 },

      },
    ];

    this.mvgridOptions = {
      enableDraggableGrouping: true,
        createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        preHeaderPanelHeight: 40,
        enableFiltering: true,
        autoHeight: false,
        enableSorting: true,
        exportOptions: {
          sanitizeDataExport: true
        },
        formatterOptions: {
        
          // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
          displayNegativeNumberWithParentheses: true,
    
          // Defaults to undefined, minimum number of decimals
          minDecimal: 2,
          maxDecimal: 2,
    
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
    
  //   `this.posCategoryService.getAllOrderss().subscribe(
  //     (response: any) => {   
  //       this.mvdataset = response.data
  //      console.log(this.mvdataset)
  //      this.mvdataView.setItems(this.mvdataset);
        
  //        },
  //     (error) => {
  //         this.mvdataset = []
  //     },
  //     () => {}
  // )`
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
  
  poslist(){
    const controls = this.posForm.controls
    console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
    this.mvdataset = []
    const date = controls.date.value
    ? `${controls.date.value.year}/${controls.date.value.month}/${controls.date.value.day}`
    : null;
  
    const date1 = controls.date1.value
    ? `${controls.date1.value.year}/${controls.date1.value.month}/${controls.date1.value.day}`
    : null;
    const site = controls.tr_site.value
    let obj= {date,date1,site}
    this.bankService.getAllGrp(obj).subscribe(
      (res: any) => {
    
      //(response: any) => (this.dataset = response.data),
      console.log(res.data)
      this.mvdataset  = res.data;
      this.mvdataView.setItems(this.mvdataset)
        
    //this.dataset = res.data
    this.loadingSubject.next(false) 
  })
  
  }

  onChangesite() {
    const controls = this.posForm.controls;
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
    const controls = this.posForm.controls;
      if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);
        console.log(item);
        
       controls.tr_site.setValue(item.si_site);
        
    
     
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
