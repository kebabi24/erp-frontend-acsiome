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
  selector: 'kt-update-population',
  templateUrl: './update-population.component.html',
  styleUrls: ['./update-population.component.scss']
})
export class UpdatePopulationComponent implements OnInit {

 
  
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
               <a class="btn btn-sm btn-clean btn-icon mr-2" title="Modifier Population">
               <i class="flaticon2-pen"></i>
           </a>
           `;
        },
        minWidth: 50,
        maxWidth: 50,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (e: Event, args: OnEventArgs) => {
          const code = args.dataContext.pop_code
                // if( args.dataContext.po.po_stat == "V" ||  args.dataContext.po.po_stat == "P" || args.dataContext.po.po_stat == null) {
          // this.router.navigateByUrl(`/purchasing/edit-po/${id}`)
          this.router.navigateByUrl(`/training/edit-population/${code}`)
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
