import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import { AngularGridInstance, Column, FieldType, GridOption, OnEventArgs, GridService, Editors,Formatter, thousandSeparatorFormatted, Formatters } from 'angular-slickgrid';

import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import {   CodeService,ItemService} from "../../../../core/erp"

const myCustomStringFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>{
  if (value!= null){
    return `<div class="text"  aria-hidden="${value}" style="font-size:14px; font-weight: bold;" >${value}</div>`
  }
}

@Component({
  selector: 'kt-update-training',
  templateUrl: './update-training.component.html',
  styleUrls: ['./update-training.component.scss']
})
export class UpdateTrainingComponent implements OnInit {

 
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  datadet: any [] = []
  columnDefinitions1: Column[] = [];
  gridOptions1: GridOption = {};
  gridObj1: any;
  angularGrid1: AngularGridInstance;
  item: any
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private modalService: NgbModal,
      private layoutUtilsService: LayoutUtilsService,
      private itemService: ItemService
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
  }



  prepareGrid() {
    this.columnDefinitions = [
      {
        id: "mod",
        name: "Edit",
        field: "id",
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
       // formatter: Formatters.editIcon,
        formatter: (row, cell, value, columnDef, dataContext) => {
          // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
          return `
               <a class="btn btn-sm btn-clean btn-icon mr-2" title="Modifier Formation">
               <i class="flaticon2-pen"></i>
           </a>
           `;
        },
        minWidth: 50,
        maxWidth: 50,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id
                // if( args.dataContext.po.po_stat == "V" ||  args.dataContext.po.po_stat == "P" || args.dataContext.po.po_stat == null) {
          // this.router.navigateByUrl(`/purchasing/edit-po/${id}`)
          this.router.navigateByUrl(`/training/edit-training/${id}`)
          // }
          // else {
          //   alert("Modification Impossible pour ce Status")
          // }
            
        // })
        },
      },

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
              id: "pt_part",
              name: "Code Formation",
              field: "pt_part",
              sortable: true,
              minWidth: 70,
              maxWidth: 120,          
              type: FieldType.string,
              filterable:true,
          },
          {
              id: "pt_desc1",
              name: "Désignation",
              field: "pt_desc1",
              sortable: true,
              minWidth: 100,
              maxWidth: 350,
              type: FieldType.string,
              filterable:true,
          },      
          {
            id: "pt_draw",
            name: "Domaine",
            field: "pt_draw",
            type: FieldType.string,
            sortable: true,
            filterable:true,
          },     
          {
            id: "pt_group",
            name: "Rubrique",
            field: "pt_group",
            type: FieldType.string,
            sortable: true,
           
          },     
          {
            id: "pt_formula",
            name: "Ext / Int",
            field: "pt_formula",
            type: FieldType.boolean,
            formatter: Formatters.checkmark,
            filterable:true,
            sortable: true,
           
          }, 
          {
            id: "pt_ms",
            name: "Certification",
            field: "pt_ms",
            type: FieldType.boolean,
            formatter: Formatters.checkmark,
            filterable:true,
            sortable: true,
           
          },      
          {
            id: "pt_rollup",
            name: "Fidélité",
            field: "pt_rollup",
            type: FieldType.boolean,
            formatter: Formatters.checkmark,
            filterable:true,
            sortable: true,
           
          },    
          {
            id: "pt_origin",
            field: "pt_origin",
            type: FieldType.string,
            filterable:true,
            sortable: true,
           
          },      
          {
            id: "pt_meter_um",
            field: "pt_meter_um",
            type: FieldType.string,
            filterable:true,
            sortable: true,
           
          },           
          {
            id: "det",
            name: "Détail",
            field: "id",
            excludeFromColumnPicker: true,
            excludeFromGridMenu: true,
            excludeFromHeaderMenu: true,
           // formatter: Formatters.editIcon,
            formatter: (row, cell, value, columnDef, dataContext) => {
              // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
              return `
                   <a class="btn btn-sm btn-clean btn-icon mr-2" title="Voir Détail">
                   <i class="flaticon2-list-1"></i>
               </a>
               `;
            },
            minWidth: 50,
            maxWidth: 50,
            // use onCellClick OR grid.onClick.subscribe which you can see down below
            onCellClick: (e: Event, args: OnEventArgs) => {
              this.item = args.dataContext.pt_part
            
                    // if( args.dataContext.po.po_stat == "V" ||  args.dataContext.po.po_stat == "P" || args.dataContext.po.po_stat == null) {
              // this.router.navigateByUrl(`/purchasing/edit-po/${id}`)
              let element: HTMLElement = document.getElementById(
                "openDetsGrid"
              ) as HTMLElement;
              element.click();
              // }
              // else {
              //   alert("Modification Impossible pour ce Status")
              // }
                
            // })
            },
          },
    
        ]
  
    this.gridOptions = {
     
      rowHeight: 40,
      enableAutoResize:true,
      autoHeight:false,
      enableCellNavigation: true,
      enableSorting: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      frozenColumn: 0,
      frozenBottom: true,
      enableFilterTrimWhiteSpace:true,
      presets: {
        sorters: [{ columnId: "id", direction: "ASC" }],
      } 
    
    }
  
    this.itemService.getBy(
      {pt_part_type:"FORMATION"},
      ).subscribe(
      (response: any) => {
        console.log(response.data)
        this.dataset = response.data
        console.log(this.dataset)
        
      
        // this.dataView.setItems(this.dataset)
         
      },
      (error) => {
          console.log(error)
          this.dataset=[]
      },
    )
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
     presets: {
      sorters: [{ columnId: "id", direction: "ASC" }],
    } 
    };
    this.itemService.getByDetTr({ptd_part:this.item}).subscribe(
      (respo: any) => {this.datadet = respo.data
        console.log(respo.data)
      })
    // fill the dataset with your data
  
    // this.codeService.getBy({ code_fldname: "pt_draw" }).subscribe((response: any) => (this.codes = response.data));
  }
}
