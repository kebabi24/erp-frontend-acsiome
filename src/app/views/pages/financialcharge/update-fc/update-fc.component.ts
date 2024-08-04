import { Component, OnInit } from "@angular/core"
// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Formatters,
    Editor,
    Editors,
    FieldType,
    OnEventArgs,
    FilterMultiplePassType,
    FilterMultiplePassTypeString,
    Filters,
    OperatorType,
    CaseType,
    CompoundDateFilter
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

import { FinancialchargeService } from "../../../../core/erp"
import { SPACE } from "@angular/cdk/keycodes"
import { type } from "os"
@Component({
  selector: 'kt-update-fc',
  templateUrl: './update-fc.component.html',
  styleUrls: ['./update-fc.component.scss']
})
export class UpdateFcComponent implements OnInit {

 
  // slick grid
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private financialchargeService: FinancialchargeService
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
  }

 
  prepareGrid() {
      this.columnDefinitions = [
          {
              id: "edit",
              field: "id",
              excludeFromColumnPicker: true,
              excludeFromGridMenu: true,
              excludeFromHeaderMenu: true,
              formatter: (row, cell, value, columnDef, dataContext) => {
                // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
                return `
                     <a class="btn btn-sm btn-clean btn-icon mr-2" title="Modifier Charge">
                     <i class="flaticon2-pen"></i>
                 </a>
                 `;
              },
              minWidth: 50,
              maxWidth: 50,
              // use onCellClick OR grid.onClick.subscribe which you can see down below
              onCellClick: (e: Event, args: OnEventArgs) => {
                  const id = args.dataContext.id
                  this.router.navigateByUrl(`/financialcharge/edit-fc/${id}`)
              },
          },
          {
              id: "id",
              name: "id",
              field: "id",
              sortable: true,
              minWidth: 80,
              maxWidth: 80,
          },
         
          {
              id: "fc_code",
              name: "Code",
              field: "fc_code",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
              id: "fc_desc",
              name: "Designation",
              field: "fc_desc",
              sortable: true,
              width: 200,
              filterable: true,
              type: FieldType.text,
              filter: {
                model:  Filters.inputText,
               
                operator: OperatorType.contains,
                enableTrimWhiteSpace: true,
                
                 

             },
              
            
          },
          {
            id: "fc_type",
            name: "Type",
            field: "fc_type",
            sortable: true,
            filterable: true,
            type: FieldType.text,
          },
          
        
          
          
      ]

      this.gridOptions = {
          enableSorting: true,
          enableCellNavigation: true,
          enableExcelCopyBuffer: true,
          enableFiltering: true,
          autoEdit: false,
          autoHeight: false,
          enableAutoResize:true,
          frozenColumn: 0,
          frozenBottom: true,
        
          
      }

      // fill the dataset with your data
      this.dataset = []
      this.financialchargeService.getAll().subscribe(
          (response: any) => (this.dataset = response.data),
          (error) => {
              this.dataset = []
          },
          () => {}
      )
  }
}
