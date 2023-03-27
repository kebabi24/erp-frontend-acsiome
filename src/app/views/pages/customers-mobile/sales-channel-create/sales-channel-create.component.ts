import { Component, OnInit, OnChanges } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"

// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Editor,
    Editors,
    AngularGridInstance,
    GridService,
    FieldType,
    Formatters,
    OnEventArgs,
} from "angular-slickgrid"
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
import { MenuMobileConfig } from '../../../../core/_config/menuMobile.config'

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
import { IActionMapping, ITreeOptions, TREE_ACTIONS } from '@circlon/angular-tree-component';


import { CustomerMobileService   } from "../../../../core/erp"
import { takeUntil } from "rxjs/operators"
import { Cluster } from "src/app/core/erp/_models/cluster.model"


@Component({
    selector: "kt-sales-channel-create",
    templateUrl: "./sales-channel-create.component.html",
    styleUrls: ["./sales-channel-create.component.scss"],
})
export class SalesChannelCreateComponent implements OnInit {
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    confirmDelete = false

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

    sales_channels: any = []; // dataset
    
   
    constructor(
        config: NgbDropdownConfig,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private customerMobileService : CustomerMobileService
    ) {
        config.autoClose = true
        this.prepareGrid() 
       
    }
    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(true)
    }
 

    
  
    reset() {
      this.sales_channels=[]
    }


    
    


    

   
      

    

    // save data
    onSubmit() {
         console.log(this.sales_channels)
         this.customerMobileService.createSalesChannels(this.sales_channels).subscribe(
          (reponse) => console.log("response", Response),
          (error) => {
              this.layoutUtilsService.showActionNotification(
                  "Erreur verifier les informations",
                  MessageType.Create,
                  10000,
                  true,
                  true
              )
              this.loadingSubject.next(false)
          },
          () => {
              this.layoutUtilsService.showActionNotification(
                  "Ajout avec succès",
                  MessageType.Create,
                  10000,
                  true,
                  true
              )
              this.loadingSubject.next(false)
              this.sales_channels=[]
          }
      )
    }





   
    goBack() {
        this.loadingSubject.next(false)
        const url = `/`
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
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
                    id: "sales_channel_code",
                    name: "Code sale channel",
                    field: "sales_channel_code",
                    sortable: true,
                    minWidth: 100,
                    maxWidth: 300,
                    filterable: true,
                    type: FieldType.string,
                    editor: {model: Editors.text}
    
                },
    
                {
                    id: "description",
                    name: "Description",
                    field: "description",
                    sortable: true,
                    minWidth: 100,
                    maxWidth: 300,
                    filterable: true,
                    type: FieldType.string, 
                    editor: {model: Editors.text}
                },
                {
                  id: "rank",
                  name: "Rang",
                  field: "rank",
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
           id: this.sales_channels.length + 1,
   
        },
        { position: "bottom" }
      );
    }
    
    
}
