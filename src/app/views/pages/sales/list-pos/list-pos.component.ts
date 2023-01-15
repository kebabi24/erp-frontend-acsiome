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
  PosCategoryService,
} from "../../../../core/erp";
import { round } from 'lodash';
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
import thId from "src/assets/plugins/formvalidation/src/js/validators/id/thId";


@Component({
  selector: 'kt-list-pos',
  templateUrl: './list-pos.component.html',
  styleUrls: ['./list-pos.component.scss']
})
export class ListPosComponent implements OnInit {
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
    private posCategoryService: PosCategoryService,
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
        id: "created_date",
        name: "Date Effet",
        field: "created_date",
        nameKey: 'created_date',
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
          getter: 'created_date',
          formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('total_price'),
            new Aggregators.Sum('disc_amt')
          ],
            aggregateCollapsed: false,
            collapsed: false,
          
        }
      },

      {
        id: "usrd_site",
        name: "Site",
        field: "usrd_site",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
        grouping: {
          getter: 'usrd_site',
          formatter: (g) => `Site: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('total_price'),
            new Aggregators.Sum('disc_amt')
          ],
            aggregateCollapsed: false,
            collapsed: false,
          }

      },
      {
        id: "order_emp",
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
       
      },
      {
        id: "total_price",
        name: "Montant",
        field: "total_price",
        sortable: true,
        width: 50,
        filterable: false,
       
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        type: FieldType.float,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 

      },
      {
        id: "Remise",
        name: "Remise",
        field: "Remise",
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
    const site = this.user.usrd_site
    let obj= {date,date1,site}
    this.posCategoryService.getAllPosGrp(obj).subscribe(
      (res: any) => {
    
      //(response: any) => (this.dataset = response.data),
      console.log(res.data)
      this.mvdataset  = res.data;
      this.mvdataView.setItems(this.mvdataset)
        
    //this.dataset = res.data
    this.loadingSubject.next(false) 
  })
  
  }
  
}
