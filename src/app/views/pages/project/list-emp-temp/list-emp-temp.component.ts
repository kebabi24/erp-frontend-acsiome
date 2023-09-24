import { Component, OnInit } from "@angular/core";
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
} from "angular-slickgrid";
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


import { EmployeService } from "../../../../core/erp";
@Component({
  selector: 'kt-list-emp-temp',
  templateUrl: './list-emp-temp.component.html',
  styleUrls: ['./list-emp-temp.component.scss']
})
export class ListEmpTempComponent implements OnInit {

 
  // slick grid
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []

  columnDefinitions2: Column[] = []
  gridOptions2: GridOption = {}
  dataset2: any[] = []
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private employeService: EmployeService
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
              sortable: true,
              minWidth: 30,
              maxWidth: 30,
          },
          {
            id: "empt_code",
            name: "Code employe",
            field: "empt_code",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "employe.emp_lname",
            name: "Nom",
            field: "employe.emp_lname",
            sortable: true,
            width: 120,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "employe.emp_fname",
            name: "Prenom",
            field: "employe.emp_fname",
            sortable: true,
            width: 120,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "empt_shift",
            name: "Equipe",
            field: "empt_shift",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "empt_site",
            name: "Site",
            field: "empt_site",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "empt_date",
            name: "Date",
            field: "empt_date",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.dateIso,
          },
          {
            id: "empt_type",
            name: "Type",
            field: "empt_type",
            sortable: true,
            width: 50,
            filterable: true,
            type: FieldType.string,
          
          },
          
          {
            id: "empt_mrate_activ",
            name: "Taux Multiple",
            field: "empt_mrate_activ",
            sortable: true,
            width: 80,
            type: FieldType.boolean,
            formatter: Formatters.checkmark,
           
          },
          {
            id: "empt_arate_activ",
            name: "Taux Additionel",
            field: "empt_arate_activ",
            sortable: true,
            width: 80,
            formatter: Formatters.checkmark,
            type: FieldType.boolean,
           
          },
          
          
      ]

      this.gridOptions = {
          enableSorting: true,
          enableCellNavigation: true,
          enableExcelCopyBuffer: true,
          enableFiltering: true,
          enableAutoResize: true,
          autoEdit: false,
          autoHeight: false,
          
          frozenColumn: 0,
          frozenBottom: true,
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
      // fill the dataset with your data
      this.dataset = []
      this.employeService.getAllTime().subscribe(
        
          (response: any) => {
            console.log(response.data),
            (this.dataset = response.data),
         
          (error) => {
              this.dataset = []
          },
          () => {}
         } )
        
  }
}