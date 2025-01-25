import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import { AngularGridInstance, Column, FieldType, GridOption, OnEventArgs, GridService, Editors,Formatter, thousandSeparatorFormatted, Formatters } from 'angular-slickgrid';

import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { QualityControlService,  CodeService,ItemService} from "../../../../core/erp"

const myCustomStringFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>{
  if (value!= null){
    return `<div class="text"  aria-hidden="${value}" style="font-size:14px; font-weight: bold;" >${value}</div>`
  }
}

@Component({
  selector: 'kt-training-eval-list',
  templateUrl: './training-eval-list.component.html',
  styleUrls: ['./training-eval-list.component.scss']
})

export class TrainingEvalListComponent implements OnInit {

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
      private itemService: ItemService,
      private qualityControlService : QualityControlService,
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
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
              id: "mph_part",
              name: "Code Formation",
              field: "mph_part",
              sortable: true,
              minWidth: 70,
              maxWidth: 120,          
              type: FieldType.string,
              filterable:true,
          },
          {
              id: "mph_chr01",
              name: "Désignation",
              field: "mph_chr01",
              sortable: true,
              minWidth: 100,
              maxWidth: 350,
              type: FieldType.string,
              filterable:true,
          }, 
          {
            id: "mph_routing",
            name: "Type évaluation",
            field: "mph_routing",
            type: FieldType.string,
            sortable: true,
            filterable:true,
          },         
          {
            id: "mph_op",
            name: "N° parametre",
            field: "mph_op",
            type: FieldType.string,
            sortable: true,
            filterable:true,
          },     
          {
            id: "mph_procedure",
            name: "Rubrique",
            field: "mph_procedure",
            type: FieldType.string,
            sortable: true,
           
          },     
          {
            id: "mph_test",
            name: "parametre",
            field: "mph_test",
            type: FieldType.string,
            
            filterable:true,
            sortable: true,
           
          },      
          {
            id: "mph_date",
            name: "Date",
            field: "mph_date",
            type: FieldType.date,
            
            filterable:true,
            sortable: true,
           
          }, 
          {
            id: "mph_rsult",
            name: "Valeur",
            field: "mph_rsult",
            type: FieldType.string,
           
            filterable:true,
            sortable: true,
           
          },         
          {
            id: "mph_lot",
            name: "Session",
            field: "mph_lot",
            type: FieldType.string,
            
            filterable:true,
            sortable: true,
           
          },         
          {
            id: "mph_mch",
            name: "Code employé",
            field: "mph_mch",
            type: FieldType.string,
            
            filterable:true,
            sortable: true,
           
          },   
          {
            id: "mph_chr02",
            name: "Nom employé",
            field: "mph_chr02",
            type: FieldType.string,
            
            filterable:true,
            sortable: true,
           
          },    
          {
            id: "mph_cmt",
            name: "Commentaire",
            field: "mph_cmt",
            type: FieldType.string,
            filterable:true,
            sortable: true,
           
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
  
    this.qualityControlService.GetTestHistory(
      {},
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
      
    };
    this.itemService.getByDetTr({ptd_part:this.item}).subscribe(
      (respo: any) => {this.datadet = respo.data
        console.log(respo.data)
      })
    // fill the dataset with your data
  
    // this.codeService.getBy({ code_fldname: "pt_draw" }).subscribe((response: any) => (this.codes = response.data));
  }
}
