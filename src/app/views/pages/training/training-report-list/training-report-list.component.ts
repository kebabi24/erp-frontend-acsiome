import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import { AngularGridInstance, Column, FieldType, GridOption, OnEventArgs, GridService, Editors,Formatter, thousandSeparatorFormatted, Formatters } from 'angular-slickgrid';

import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { AddReport,AddReportService,  CodeService,ItemService} from "../../../../core/erp"

const myCustomStringFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>{
  if (value!= null){
    return `<div class="text"  aria-hidden="${value}" style="font-size:14px; font-weight: bold;" >${value}</div>`
  }
}

@Component({
  selector: 'kt-training-report-list',
  templateUrl: './training-report-list.component.html',
  styleUrls: ['./training-report-list.component.scss']
})

export class TrainingReportListComponent implements OnInit {

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
      private addReportservice : AddReportService,
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
              id: "pmr_nbr",
              name: "Session",
              field: "pmr_nbr",
              sortable: true,
              minWidth: 70,
              maxWidth: 120,          
              type: FieldType.string,
              filterable:true,
          },
          {
              id: "pmr_pm_code",
              name: "Programme",
              field: "pmr_pm_code",
              sortable: true,
              minWidth: 100,
              maxWidth: 350,
              type: FieldType.string,
              filterable:true,
          }, 
          {
            id: "pmr_site",
            name: "formateur",
            field: "pmr_site",
            type: FieldType.string,
            sortable: true,
            filterable:true,
          },         
          {
            id: "pmr_inst",
            name: "formation",
            field: "pmr_inst",
            type: FieldType.string,
            sortable: true,
            filterable:true,
          },     
          {
            id: "pmr_task",
            name: "salle de formation",
            field: "pmr_task",
            type: FieldType.string,
            sortable: true,
           
          },     
          {
            id: "pmr_task_status",
            name: "statut",
            field: "pmr_status",
            type: FieldType.string,
          
            filterable:true,
            sortable: true,
           
          },      
          {
            id: "pmr_start_date",
            name: "Date debut",
            field: "pmr_start_date",
            type: FieldType.date,
            
            filterable:true,
            sortable: true,
           
          }, 
          {
            id: "pmr_end_date",
            name: "Date Fin",
            field: "pmr_end_date",
            type: FieldType.date,
            
            filterable:true,
            sortable: true,
           
          }, 
          {
            id: "pmr_employe",
            name: "Matricule employe",
            field: "pmr_employe",
            type: FieldType.string,
           
            filterable:true,
            sortable: true,
           
          },         
          {
            id: "pmr_present",
            name: "présent",
            field: "pmr_present",
            type: FieldType.string,
            
            filterable:true,
            sortable: true,
           
          },         
          {
            id: "pmr_dissipated",
            name: "dissipé",
            field: "pmr_dissipated",
            type: FieldType.string,
            
            filterable:true,
            sortable: true,
           
          },  
          {
            id: "pmr_acted",
            name: "présent",
            field: "pmr_acted",
            type: FieldType.string,
            
            filterable:true,
            sortable: true,
           
          },  
          {
            id: "pmr_mastered",
            name: "maitrisé",
            field: "pmr_mastered",
            type: FieldType.string,
            
            filterable:true,
            sortable: true,
           
          },  
          {
            id: "pmr_cmmt",
            name: "Commentaire",
            field: "pmr_cmmt",
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
  
    this.addReportservice.getBy(
      {}
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
