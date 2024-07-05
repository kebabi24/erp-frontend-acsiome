import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import { AngularGridInstance, Column, FieldType, GridOption, OnEventArgs, GridService, Editors,Formatter, thousandSeparatorFormatted, Formatters } from 'angular-slickgrid';

import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import {   CodeService} from "../../../../core/erp"

const myCustomStringFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>{
  if (value!= null){
    return `<div class="text"  aria-hidden="${value}" style="font-size:14px; font-weight: bold;" >${value}</div>`
  }
}


@Component({
  selector: 'kt-list-section',
  templateUrl: './list-section.component.html',
  styleUrls: ['./list-section.component.scss']
})
export class ListSectionComponent implements OnInit {

  
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private codeService: CodeService
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
                  sortable:true,
              },
              {
                  id: "code_value",
                  name: "Code Rubrique",
                  field: "code_value",
                  sortable: true,
                  minWidth: 70,
                  resizeExtraWidthPadding: 20,
                  filterable: true,
                  type: FieldType.string,
                  formatter:myCustomStringFormatter,
              },
              {
                  id: "code_cmmt",
                  name: "Désignation",
                  field: "code_cmmt",
                  sortable: true,
                  formatter:myCustomStringFormatter,
                  minWidth: 100,
                  filterable: true,
                  type: FieldType.string,
              },
              {
                id: "chr01",
                name: "Domaine",
                field: "chr01",
                sortable: true,
                formatter:myCustomStringFormatter,
                minWidth: 100,
               
                filterable: true,
                type: FieldType.string,
            },      
            ]

    this.gridOptions = {
      editable:true,
      rowHeight: 40,
      enableAutoResize:true,
      autoFitColumnsOnFirstLoad: false,
    enableAutoSizeColumns: false,
    

    // then enable resize by content with these 2 flags
    autosizeColumnsByCellContentOnFirstLoad: true,
    enableAutoResizeColumnsByCellContent: true,
      autoHeight:false,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableFiltering:true,
    
      presets: {
        sorters: [{ columnId: "id", direction: "ASC" }],
      } 
    }


    this.codeService.getBy({code_fldname:"pt_group"}).subscribe(
      (response: any) => {
        this.dataset = response.data
          console.log(this.dataset)
       // this.dataset.push();
        // this.grid.invalidate();
        // this.grid.render();
        // this.dataView.refresh()
        //this.dataView.setItems(this.dataset)
      },
      (error) => {
        this.dataset = []
    
      },
      () => {}
      )
    

  }

}
