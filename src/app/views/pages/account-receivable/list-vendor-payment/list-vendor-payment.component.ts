import { Component, OnInit } from "@angular/core"
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
  GridOption,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
 
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

import { BankService} from "../../../../core/erp"


const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';

@Component({
  selector: 'kt-list-vendor-payment',
  templateUrl: './list-vendor-payment.component.html',
  styleUrls: ['./list-vendor-payment.component.scss']
})
export class ListVendorPaymentComponent implements OnInit {

  draggableGroupingPlugin: any;
  
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];

  draggableGroupingPluginp: any;
  
  selectedGroupingFieldsp: Array<string | GroupingGetterFunction> = ['', '', ''];
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  dataView: any;
  
  angularGrid: AngularGridInstance;

  
  gridObj: any;
  dataviewObj: any;
  soForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;
  user: any;
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private soFB: FormBuilder,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private bankService: BankService,
      
  ) {
     // this.prepareGrid()
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    console.log(this.user)
    this.createForm();
    this.prepareGrid()
    this.solist();
  }

  createForm() {
    this.loadingSubject.next(false);
    const date = new Date;
    
    this.soForm = this.soFB.group({
     
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
  }
  solist() {
    this.dataset = []
   
    const controls = this.soForm.controls
    const date = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
  
    const date1 = controls.calc_date1.value
    ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
    : null;
   
    let obj= {date,date1}
    this.bankService.getBKHTrBy(obj).subscribe(
      (response: any) => {   
        this.dataset = response.data
       console.log(this.dataset)
       this.dataView.setItems(this.dataset);
        
         },
      (error) => {
          this.dataset = []
      },
      () => {}
  )
  }
  
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid; // grid object
    this.dataView = angularGrid.dataView;
  }
  prepareGrid() {

      this.columnDefinitions = [
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
            id: "bkh_code",
            name: "N° Verssement",
            field: "bkh_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            width:120,
          },
          {
            id: "bkh_num_doc",
            name: "N° Document",
            field: "bkh_num_doc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "bkh_addr",
            name: "Vendeur",
            field: "bkh_addr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'bkh_addr',
              formatter: (g) => `Vendeur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('bkh_amt'),  
                new Aggregators.Sum('bkh_2000'),
                new Aggregators.Sum('bkh_1000'),
                new Aggregators.Sum('bkh_0500'),
                new Aggregators.Sum('bkh_0200'),    
                new Aggregators.Sum('bkh_p200'),    
                new Aggregators.Sum('bkh_p100'),
                new Aggregators.Sum('bkh_p050'),
                new Aggregators.Sum('bkh_p020'),
                new Aggregators.Sum('bkh_p010'),
                new Aggregators.Sum('bkh_p005'),
                new Aggregators.Sum('bkh_bon'),
                new Aggregators.Sum('bkh_cheque'),             
              
              ],
                aggregateCollapsed: false,
                collapsed: false,
              }
    
          },
          {
            id: "bkh_bank",
            name: "Code Banque",
            field: "bkh_bank",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'bkh_bank',
              formatter: (g) => `Caisse: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('bkh_amt'),  
              new Aggregators.Sum('bkh_2000'),
              new Aggregators.Sum('bkh_1000'),
              new Aggregators.Sum('bkh_0500'),
              new Aggregators.Sum('bkh_0200'),    
              new Aggregators.Sum('bkh_p200'),    
              new Aggregators.Sum('bkh_p100'),
              new Aggregators.Sum('bkh_p050'),
              new Aggregators.Sum('bkh_p020'),
              new Aggregators.Sum('bkh_p010'),
              new Aggregators.Sum('bkh_p005'),
              new Aggregators.Sum('bkh_bon'),
              new Aggregators.Sum('bkh_cheque'),             
              
              ],
                aggregateCollapsed: false,
                collapsed: false,
              }
            
          },
          {
            id: "bkh_effdate",
            name: "Date Effet",
            field: "bkh_effdate",
            sortable: true,
            filterable: true,
            width:120,
            type: FieldType.dateIso,
            grouping: {
              getter: 'bkh_effdate',
              formatter: (g) => `Date Effet: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('bkh_amt'),  
              new Aggregators.Sum('bkh_2000'),
              new Aggregators.Sum('bkh_1000'),
              new Aggregators.Sum('bkh_0500'),
              new Aggregators.Sum('bkh_0200'),    
              new Aggregators.Sum('bkh_p200'),    
              new Aggregators.Sum('bkh_p100'),
              new Aggregators.Sum('bkh_p050'),
              new Aggregators.Sum('bkh_p020'),
              new Aggregators.Sum('bkh_p010'),
              new Aggregators.Sum('bkh_p005'),
              new Aggregators.Sum('bkh_bon'),
              new Aggregators.Sum('bkh_cheque'),             
              
              ],
                aggregateCollapsed: false,
                collapsed: false,
              }
            
          }, 
          {
            id: "chr01",
            name: "Role",
            field: "chr01",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'chr01',
              formatter: (g) => `Role: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
              new Aggregators.Sum('bkh_amt'),  
              new Aggregators.Sum('bkh_2000'),
              new Aggregators.Sum('bkh_1000'),
              new Aggregators.Sum('bkh_0500'),
              new Aggregators.Sum('bkh_0200'),    
              new Aggregators.Sum('bkh_p200'),    
              new Aggregators.Sum('bkh_p100'),
              new Aggregators.Sum('bkh_p050'),
              new Aggregators.Sum('bkh_p020'),
              new Aggregators.Sum('bkh_p010'),
              new Aggregators.Sum('bkh_p005'),
              new Aggregators.Sum('bkh_bon'),
              new Aggregators.Sum('bkh_cheque'),                            
                  
              
              ],
                aggregateCollapsed: false,
                collapsed: false,
              }
            
          }, 
         
          {
            id: "bkh_balance",
            name: "Balance",
            field: "bkh_balance",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            
          }, 
         
          {
            id: "bkh_amt",
            name: "Montant",
            field: "bkh_amt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            minWidth: 100,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
          },
          {
            id: "bkh_2000",
            name: "Billet 2000",
            field: "bkh_2000",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            
          }, 
          {
            id: "bkh_1000",
            name: "Billet 1000",
            field: "bkh_1000",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            
          }, 
          {
            id: "bkh_0500",
            name: "Billet 500",
            field: "bkh_0500",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
          }, 
          {
            id: "bkh_0200",
            name: "Billet 200",
            field: "bkh_0200",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
          },
          {
            id: "bkh_p200",
            name: "Piéce 200",
            field: "bkh_p200",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
          },
          {
            id: "bkh_p100",
            name: "Piéce 100",
            field: "bkh_p100",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
          },
          {
            id: "bkh_p050",
            name: "Piéce 50",
            field: "bkh_p050",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
          },
          {
            id: "bkh_p020",
            name: "Piéce 20",
            field: "bkh_p020",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
          },
          {
            id: "bkh_p010",
            name: "Piéce 10",
            field: "bkh_p010",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
          },
          {
            id: "bkh_p005",
            name: "Piéce 5",
            field: "bkh_p005",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
          },
          {
            id: "bkh_bon",
            name: "Bon",
            field: "bkh_bon",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
          },
          {
            id: "bkh_rmks",
            name: "Motif",
            field: "bkh_rmks",
            sortable: true,
            filterable: true,
            type: FieldType.text,
            
          },
          {
            id: "bkh_cheque",
            name: "Cheque",
            field: "bkh_cheque",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
          },

      ]

      this.gridOptions = {
        enableDraggableGrouping: true,
        createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        preHeaderPanelHeight: 40,
          enableFiltering: true,
          enableSorting: true,
          enableAutoResize:true,
          
          autoHeight:false,
          exportOptions: {
            sanitizeDataExport: true
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

      // fill the dataset with your data
      this.dataset = []
//       this.bankService.getBKHBy({bkh_type : "P"}).subscribe(
//           (response: any) => (this.dataset = response.data),
//           (error) => {
//               this.dataset = []
//           },
//           () => {}
//       )
// console.log(this.dataset)
    }
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
      this.dataView.collapseAllGroups();
    }
  
    expandAllGroups() {
      this.dataView.expandAllGroups();
    }
    clearGrouping() {
      if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
        this.draggableGroupingPlugin.clearDroppedGroups();
      }
      this.gridObj.invalidate(); // invalidate all rows and re-render
    }
   
}
