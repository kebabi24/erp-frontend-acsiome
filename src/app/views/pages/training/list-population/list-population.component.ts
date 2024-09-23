import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import { AngularGridInstance, Column, FieldType, GridOption, OnEventArgs, GridService, Editors,Formatter, thousandSeparatorFormatted, Formatters } from 'angular-slickgrid';

import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { PopulationemployeService} from "../../../../core/erp"

const myCustomStringFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>{
  if (value!= null){
    return `<div class="text"  aria-hidden="${value}" style="font-size:12px; font-weight: bold;" >${value}</div>`
  }
}



@Component({
  selector: 'kt-list-population',
  templateUrl: './list-population.component.html',
  styleUrls: ['./list-population.component.scss']
})
export class ListPopulationComponent implements OnInit {

 
  
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private populationService: PopulationemployeService,
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
                  maxWidth: 50,
                  sortable:true,
              },
              {
                  id: "pop_code",
                  name: "Code Population",
                  field: "pop_code",
                  sortable: true,
                  minWidth: 70,
                  resizeExtraWidthPadding: 20,
                  filterable: true,
                  type: FieldType.string,
                  formatter:myCustomStringFormatter,
              },
              {
                  id: "pop_desc",
                  name: "Désignation",
                  field: "pop_desc",
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


    this.populationService.getByAll().subscribe(
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
