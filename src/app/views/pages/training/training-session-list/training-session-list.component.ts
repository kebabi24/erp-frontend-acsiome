import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import { AngularGridInstance, Column, FieldType, GridOption, Aggregators,  OnEventArgs, GridService, Editors,Formatter, thousandSeparatorFormatted, Formatters, Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,} from 'angular-slickgrid';

import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { AffectEmp,AffectEmpService,  CodeService,ItemService} from "../../../../core/erp"

const myCustomStringFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>{
  if (value!= null){
    return `<div class="text"  aria-hidden="${value}" style="font-size:14px; font-weight: bold;" >${value}</div>`
  }
}
   
@Component({
  selector: 'kt-training-session-list',
  templateUrl: './training-session-list.component.html',
  styleUrls: ['./training-session-list.component.scss']
})
 
export class TrainingSessionListComponent implements OnInit {
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  draggableGroupingPlugin: any;
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  dataview: any;
  grid: any;
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  datadet: any [] = []
  columnDefinitions1: Column[] = [];
  gridOptions1: GridOption = {};
  gridObj1: any;
  angularGrid1: AngularGridInstance;
  angularGrid: AngularGridInstance;
  gridService: GridService;
  item: any
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      config: NgbDropdownConfig,
      private modalService: NgbModal,
      private layoutUtilsService: LayoutUtilsService,
      private itemService: ItemService,
      private affectEmpService : AffectEmpService,
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.grid = angularGrid.slickGrid; // grid object
    this.dataview = angularGrid.dataView;
    this.gridService = angularGrid.gridService;
  }

  prepareGrid() {
    this.columnDefinitions = [
          {
              id: "id",
              name: "id",
              field: "id",
              excludeFromHeaderMenu: true,
              minWidth: 40,
              maxWidth: 60,
              sortable:true,
          },
          {
              id: "pme_nbr",
              name: "BT",
              field: "pme_nbr",
              sortable: true,
              minWidth: 70,
              maxWidth: 120,          
              type: FieldType.string,
              filterable:true,
              grouping: {
                getter: 'pme_nbr',
                formatter: (g) => `Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [new Aggregators.Sum('price')],
                aggregateCollapsed: true,
                
                collapsed:true
              }
          },
          {
              id: "pme_pm_code",
              name: "BT",
              field: "pme_pm_code",
              sortable: true,
              minWidth: 100,
              maxWidth: 350,
              type: FieldType.string,
              filterable:true,
              grouping: {
                getter: 'pme_pm_code',
                formatter: (g) => `Programme: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [new Aggregators.Sum('price')],
                aggregateCollapsed: true,
                
                collapsed:true
              }
          }, 
          {
            id: "pme_site",
            name: "site",
            field: "pme_site",
            type: FieldType.string,
            sortable: true,
            filterable:true,
            grouping: {
              getter: 'pme_site',
              formatter: (g) => `Formateur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },         
          {
            id: "pme_inst",
            name: "Equipement",
            field: "pme_inst",
            type: FieldType.string,
            sortable: true,
            filterable:true,
            grouping: {
              getter: 'pme_inst',
              formatter: (g) => `Formation: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },     
          // {
          //   id: "price",
          //   name: "Budget",
          //   field: "price",
          //   type: FieldType.string,
          //   sortable: true,
          //   filterable:true,
          //   groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
          // },     
          {
            id: "pme_task",
            name: "Tache",
            field: "pme_task",
            type: FieldType.string,
            sortable: true,
            grouping: {
              getter: 'pme_task',
              formatter: (g) => `Salle: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
           
          },     
          {
            id: "pme_task_status",
            name: "statut",
            field: "pme_task_status",
            type: FieldType.string,
          
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_status',
              formatter: (g) => `Statut: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },      
          {
            id: "pme_start_date",
            name: "Date debut",
            field: "pme_start_date",
            type: FieldType.date,
            
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_start_date',
              formatter: (g) => `Debut Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          }, 
          {
            id: "pme_end_date",
            name: "Date Fin",
            field: "pme_end_date",
            type: FieldType.date,
            
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_end_date',
              formatter: (g) => `Fin Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          }, 
          // {
          //   id: "pme_duration",
          //   name: "Durée",
          //   field: "pme_duration",
          //   type: FieldType.integer,
            
          //   filterable:true,
          //   sortable: true,
          //   grouping: {
          //     getter: 'pme_duration',
          //     formatter: (g) => `Debut Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          //     aggregators: [new Aggregators.Sum('price')],
          //     aggregateCollapsed: true,
              
          //     collapsed:true
          //   }
          // },
          {
            id: "pme_start_time",
            name: "Heure debut",
            field: "pme_start_time",
            type: FieldType.date,
            
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_start_Time',
              formatter: (g) => `Heure Debut Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },   
          {
            id: "pme_end_time",
            name: "Heure Fin",
            field: "pme_end_time",
            type: FieldType.date,
            
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_end_Time',
              formatter: (g) => `Heure Fin: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },
          
          
        
    
        ]
  
    this.gridOptions = {
     
      rowHeight: 40,
      enableDraggableGrouping: true,
      createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        preHeaderPanelHeight: 40,
      enableAutoResize:true,
      autoHeight:false,
      enableCellNavigation: true,
      enableSorting: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      
      frozenBottom: true,
      enableFilterTrimWhiteSpace:true,
      
      presets: {
        sorters: [{ columnId: "id", direction: "ASC" }],
      } ,
      
      draggableGrouping: {
        dropPlaceHolderText: 'Drop a column header here to group by the column',
        // groupIconCssClass: 'fa fa-outdent',
        deleteIconCssClass: 'fa fa-times',
        onGroupChanged: (e, args) => this.onGroupChanged(args),
        onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
    
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
    }
  
    this.affectEmpService.getByGlobal(
      {}
      ).subscribe(
      (response: any) => {
        console.log(response.data)
        this.dataset = response.data
        console.log(this.dataset)
        
      
         this.dataview.setItems(this.dataset)
         
      },
      (error) => {
          console.log(error)
          this.dataset=[]
      },
    )
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
 openDet(content) {
    this.prepareGrid1();
    this.modalService.open(content, { size: "lg" });
  }
  angularGridReady1(angularGrid: AngularGridInstance) {
    this.angularGrid1 = angularGrid;
    this.gridObj1 = (angularGrid && angularGrid.slickGrid) || {};
  }
  
  prepareGrid1() {
    this.columnDefinitions1 = [
      {
        id: "id",
        name: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        minWidth: 10,
        sortable:true,
    },
      {
        id: "ptd_desc",
        name: "Désignation",
        field: "ptd_desc",
        sortable: true,
        minWidth: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "ptd_gol",
        name: "Objectif",
        field: "ptd_gol",
        sortable: true,
        minWidth: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      
    ];
  
    this.gridOptions1 = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
       autoHeight: false,
      // frozenColumn: 0,
      // frozenBottom: true,
      // autoFitColumnsOnFirstLoad: true,
      // enableAutoSizeColumns:true,
    
     //enableAutoResizeColumnsByCellContent:true,
      
    };
    this.itemService.getByDetTr({ptd_part:this.item}).subscribe(
      (respo: any) => {this.datadet = respo.data
        console.log(respo.data)
      })
    // fill the dataset with your data
  
    // this.codeService.getBy({ code_fldname: "pt_draw" }).subscribe((response: any) => (this.codes = response.data));
  }
  listtraining() {
    this.loadingSubject.next(false)
    const url = `/training/list-training`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
createtraining() {
  this.loadingSubject.next(false)
  const url = `/training/create-training`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
students() {
  this.loadingSubject.next(false)
  const url = `/accounting-setting/list-employe`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
createsession() {
  this.loadingSubject.next(false)
  const url = `/training/create-training-session`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
approverequest() {
  this.loadingSubject.next(false)
  const url = `/training/approval-req`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
createTrainor() {
  this.loadingSubject.next(false)
  const url = `/providers/create-rep-job`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
createlocation() {
  this.loadingSubject.next(false)
  const url = `/inventory-settings/list-loc`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
}


