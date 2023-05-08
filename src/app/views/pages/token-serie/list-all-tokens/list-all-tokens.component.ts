import { Component, OnInit } from '@angular/core';
import { Role, RoleService, TokenSerieService  } from "../../../../core/erp"

import {
  Column,
  GridOption,
  Formatter,
  Formatters,
  Editor,
  Editors,
  FieldType,
  OnEventArgs,
  AngularGridInstance,
  GridService,
} from "angular-slickgrid"

import { ActivatedRoute, Router } from "@angular/router"

import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud"
import { MatDialog } from "@angular/material/dialog"
import { T } from '@angular/cdk/keycodes';
@Component({
  selector: 'kt-list-all-tokens',
  templateUrl: './list-all-tokens.component.html',
  styleUrls: ['./list-all-tokens.component.scss']
})
export class ListAllTokensComponent implements OnInit {
  
  
  

  // GRID 
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  gridObj: any
  angularGrid: AngularGridInstance
  gridService: GridService
  message: any
  column : Column
  grid: any
  dataView: any

  tokens: any = []; // dataset

  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private tokenSerieService : TokenSerieService,
  ) {
    this.getTokens()
    this.prepareGrid()
   }

  ngOnInit(): void {
  }

  

  



//   this.RoleService.getAllRoles().subscribe(
      
//     (response: any) => {
//       this.dataset = response.data
//     },
//     (error) => {
//         this.dataset = []
//     },
//     () => {}
// )

getTokens(){
      this.tokenSerieService.getAllTokens().subscribe(
      
    (response: any) => {
      this.tokens = response.data
      this.dataView.setItems(this.tokens)
    },
    (error) => {
        this.tokens = []
    },
    () => {}
)
}

gridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
  this.dataView = angularGrid.dataView;
  this.grid = angularGrid.slickGrid;
  this.gridService = angularGrid.gridService;
}

angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
    this.dataView.getItemMetadata = this.updateItemMetadata(this.dataView.getItemMetadata);
    this.grid.invalidate();
    this.grid.render();
}

updateItemMetadata(previousItemMetadata: any) {
  const newCssClass = 'highlight-bg';
  return (rowNumber: number) => {
    const item = this.dataView.getItem(rowNumber);
    let meta = {
      cssClasses: ''
    };
    if (typeof previousItemMetadata === 'object') {
      meta = previousItemMetadata(rowNumber);
    }

    if (meta && item && item.etat_service) {
      const state = item.etat_service;
      if (state === "true") {
        meta.cssClasses = (meta.cssClasses || '') + ' ' + newCssClass;
      }
    }

    return meta;
  };
}

prepareGrid() {
  this.columnDefinitions = [
            {
                id: "token_code",
                name: "Code token",
                field: "token_code",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string,
                editor: {model: Editors.text}

            },

            {
                id: "token_name",
                name: "Nom token ",
                field: "token_name",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string, 
                editor: {model: Editors.text}
            },
            {
              id: "token_digitcount",
              name: "Nombre de chiffres",
              field: "token_digitcount",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.integer, 
              editor: {model: Editors.integer}
            },

            
            {
                id: "service_prefix",
                name: "Service préfixe",
                field: "service_prefix",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string, 
                editor: {model: Editors.text}
            },
            {
              id: "service_next_number ",
              name: "Numéro suivant",
              field: "service_next_number ",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.integer, 
              editor: {model: Editors.integer}
            },


            // 
            {
                id: "visit_prefix",
                name: "Visit préfixe",
                field: "visit_prefix",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string, 
                editor: {model: Editors.text}
            },
            {
              id: "visit_next_number",
              name: "Numéro suivant",
              field: "visit_next_number",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.integer, 
              editor: {model: Editors.integer}
            },

            // ***
            {
              id: "customer_prefix",
              name: "Client préfixe",
              field: "customer_prefix",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.string, 
              editor: {model: Editors.text}
            },
            {
              id: "customer_next_number",
              name: "Numéro suivant",
              field: "customer_next_number",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.integer, 
              editor: {model: Editors.integer}
            },

            // ***
            {
              id: "load_request_prefix",
              name: "Demande de chargement préfixe",
              field: "load_request_prefix",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.string, 
              editor: {model: Editors.text}
            },
            {
              id: "load_request_next_number",
              name: "Numéro suivant",
              field: "load_request_next_number",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.integer, 
              editor: {model: Editors.integer}
            },

            // ***
            {
              id: "inventory_prefix",
              name: "Inventaire préfixe",
              field: "inventory_prefix",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.string, 
              editor: {model: Editors.text}
            },
            {
              id: "inventory_next_number",
              name: "Numéro suivant",
              field: "inventory_next_number",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.integer, 
              editor: {model: Editors.integer}
            },
  
            
            
      ]

      this.gridOptions = {
        asyncEditorLoading: false,
        editable: true,
        enableAddRow:true,
        enableColumnPicker: true,
        enableCellNavigation: true,
        enableRowSelection: true,
        enableCheckboxSelector: true,
        rowSelectionOptions: {
          selectActiveRow: false
        }
      };



}

addNewItem( ) {
  this.gridService.addItem(
    {
       id: this.tokens.length + 1,

    },
    { position: "bottom" }
  );
}

}
