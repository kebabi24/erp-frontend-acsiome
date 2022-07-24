import { Component, OnInit } from '@angular/core';
import { Role, RoleService  } from "../../../../core/erp"

import {
  Column,
  GridOption,
  Formatter,
  Formatters,
  Editor,
  Editors,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid"

import { ActivatedRoute, Router } from "@angular/router"

import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud"
import { MatDialog } from "@angular/material/dialog"
@Component({
  selector: 'kt-list-all-roles',
  templateUrl: './list-all-roles.component.html',
  styleUrls: ['./list-all-roles.component.scss']
})
export class ListAllRolesComponent implements OnInit {
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private RoleService: RoleService
  ) {
    this.prepareGrid()
   }

  ngOnInit(): void {
  }

  createCode() {
    this.router.navigateByUrl("roles/list-all-roles")
  }

  prepareGrid() {
    this.columnDefinitions = [

        {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
        },
       
        {
            id: "role_name",
            name: "Role",
            field: "role_name",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "role_code",
          name: "Role",
          field: "role_code",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
        {
          id: "userMobile_code",
          name: "Nom d'utilisateur",
          field: "userMobile_code",
          sortable: true,
          filterable: true,
          type: FieldType.date,
        },
        
        
    ]

    this.gridOptions = {
        enableSorting: true,
        enableCellNavigation: true,
        enableExcelCopyBuffer: true,
        enableFiltering: true,
        autoEdit: false,
        autoHeight: false,
        frozenColumn: 0,
        frozenBottom: true,
    }
    console.log(this.dataset)
    // fill the dataset with your data
    this.dataset = []
    this.RoleService.getAllRoles().subscribe(
      
        (response: any) => {
          this.dataset = response.data
        },
        (error) => {
            this.dataset = []
        },
        () => {}
    )
  }

}
