
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Column, GridOption, AngularGridInstance, FieldType} from "angular-slickgrid"
import { ActivatedRoute, Router } from "@angular/router"
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MatDialog } from "@angular/material/dialog"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { OnEventArgs, GridService, Editors, thousandSeparatorFormatted, Formatters } from 'angular-slickgrid';


import { Category } from "../../../../core/erp/_models/pos-categories.model";
import {
  SubheaderService,
  LayoutConfigService,
} from "../../../../core/_base/layout"

import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud"

import {

  CodeService,
  CustomerMobile,
  PosCategoryService,
  CustomerMobileService,
  AddresseMobile

} from "../../../../core/erp"
import { config } from 'process';
export type ControlPosition = keyof typeof google.maps.ControlPosition;
@Component({
  selector: 'kt-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss']
})
export class CategoryListComponent implements OnInit {
  posCategory : Category  
  hasaddresseFormErrors=false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$ : Observable<boolean>

  // FOR GRID 
  dataset: any[] = []
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  gridObj: any
  angularGrid: AngularGridInstance
  gridService: GridService
  message: any
  column : Column
  grid: any
  dataView: any

  deleteIds : any[] = []


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private customerMobileService: CustomerMobileService,
    private posCategoryService: PosCategoryService,
    private cdr: ChangeDetectorRef,
    config: NgbDropdownConfig
  ) {
    this.prepareGrid()
    config.autoClose= true
    
   }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.init()
  }

  init(){
    // this.createCategoryForm()
    this.loadingSubject.next(false)
  }




  
  goBack() {
    //this.loadingSubject.next(false)
    const url = `/customers-mobile`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
 

  /**
      * Save data
      *
      * @param withBack: boolean
      */
   onSubmit() {
    // this.hasFormErrors = false
    // const controls = this.categoryForm.controls
    // const controls_ = this.addresseForm.controls

    /** check form */
    // if (this.categoryForm.invalid) {
    //   Object.keys(controls).forEach((controlName) =>
    //       controls[controlName].markAsTouched()
    //   )

    //   this.hasFormErrors = true
      //this.selectedTab = 0
      return
    
    // let customer = this.prepareCustomerMobile()
        //console.log(this.selectedMenus)
    // let addresse = this.prepareAddresseCustomerMobile()
    // this.addCustomerMobile(customer)
    // this.posCategoryService
    //   .add(categoryData)

    //   .subscribe(
    //     (res: any) => {
    //       console.log(res);
    //     },
    //     (err) =>
    //       this.layoutUtilsService.showActionNotification(
    //         "Erreur lors de l'ajout de la catégorie",
    //         MessageType.Create,
    //         10000,
    //         true,
    //         true
    //       ),
    //     () => {
    //       this.layoutUtilsService.showActionNotification(
    //         "Catégorie ajoutée avec succès",
    //         MessageType.Create,
    //         10000,
    //         true,
    //         true
    //       );
    //       // this.router.navigateByUrl("/auth/new-customer/");
    //     }
    //   );
  }


  addCustomerMobile(customer_mobile: CustomerMobile) {
    this.loadingSubject.next(true)
        this.customerMobileService.addCustomerMobile(customer_mobile).subscribe(
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
                this.router.navigateByUrl("/customers-mobile/list-customer-mobile")
            }
        )
  }
  onAlertClose($event) {
    // this.hasFormErrors = false
  }

  // ******************* GRID ****************************** 
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
  
      // if you want to change background color of Duration over 50 right after page load,
      // you would put the code here, also make sure to re-render the grid for the styling to be applied right away
      // this.dataView.getItemMetadata = this.updateItemMetadata(this.dataView.getItemMetadata);
      this.grid.invalidate();
      this.grid.render();
  }

  prepareGrid() {
    this.columnDefinitions = [
              {
                id: 'delete',
                field: 'id',
                excludeFromColumnPicker: true,
                excludeFromGridMenu: true,
                excludeFromHeaderMenu: true,
                formatter: Formatters.deleteIcon,
                minWidth: 30,
                maxWidth: 30,
                onCellClick: (e: Event, args: OnEventArgs) => {
                  // this.confirmDelete = true
                  // this.alertWarning = `Deleting: ${args.dataContext.cluster_code}`;
                  // this.deleteCluster(args.dataContext.id)
                  console.log(args.dataContext.id)
                  this.deleteIds.push(args.dataContext.id)
                  this.dataset = this.dataset.filter(function(value, index, arr){ 
                    return value.id != args.dataContext.id;
                  })
                  this.dataView.setItems(this.dataset)
                  // this.addToDeletedIds(args.dataContext.id)
                }
                
              },
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
                  id: "category_code",
                  name: "Code du categorie",
                  field: "category_code",
                  sortable: true,
                  editor: {
                    model: Editors.text,
                  },
                  minWidth: 70,
                  maxWidth: 100,
                  filterable: true,
                  type: FieldType.string,
                  onCellChange: (e: Event, args: OnEventArgs) => {
                    // this.addToUpdatedIds(args.dataContext.id)
                    //  this.dataView.getItemById(args.dataContext.id)
                    // console.log(Object.keys(this.dataView))
                  },
              },
              {
                  id: "category_name",
                  name: "Nom du category",
                  field: "category_name",
                  sortable: true,
                  editor: {
                    model: Editors.text,
                  },
                  minWidth: 100,
                  maxWidth: 300,
                  filterable: true,
                  type: FieldType.string,
                  onCellChange: (e: Event, args: OnEventArgs) => {
                    // this.addToUpdatedIds(args.dataContext.id)
                    // this.dataView.getItemById(args.dataContext.id).meta
                    // console.log(Object.keys(this.dataView))
                  },
              },
              {
                id: "category_img",
                name: "Chemin de l'image:",
                field: "category_img",
                sortable: true,
                editor: {
                  model: Editors.text,
                },
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string,
                onCellChange: (e: Event, args: OnEventArgs) => {
                  // this.addToUpdatedIds(args.dataContext.id)
                  // this.dataView.getItemById(args.dataContext.id).meta
                  // console.log(Object.keys(this.dataView))
                },
            },
              {
                id: "rang",
                name: "Rang",
                field: "rang",
                sortable: true,
                minWidth: 70,
                maxWidth: 100,
                filterable: true,  
                editor: {
                  model: Editors.text,
                },
                type: FieldType.string,
                // onCellChange: (e: Event, args: OnEventArgs) => {
                //   this.addToUpdatedIds(args.dataContext.id)
                //   // this.dataView.getItemById(args.dataContext.id).meta
                //   // console.log(Object.keys(this.dataView))
                // },
              },
              {
                id: "direct",
                name: "Direct",
                field: "direct",
                minWidth: 70,
                maxWidth: 100,
                sortable: true,
                editor: {
                  model: Editors.checkbox,
                },
                filterable: true,
                type: FieldType.boolean,
                onCellChange: (e: Event, args: OnEventArgs) => {
                  // this.addToUpdatedIds(args.dataContext.id)
                  // this.dataView.getItemById(args.dataContext.id).meta
                  // console.log(Object.keys(this.dataView))
                },
              },   
        ]

    this.gridOptions = {
        editable: true,
        enableSorting: true,
        autoEdit: false,  
        autoHeight: false,
        enableFiltering: true,
        enableAddRow:true,
        enableCellNavigation: true,
          enableRowSelection: true,
        checkboxSelector: {
          hideSelectAllCheckbox: true,
        },
        multiSelect: false,
        rowSelectionOptions: {
            selectActiveRow: true,
        }, 
    }


    this.posCategoryService.getAll().subscribe(
      (response: any) => {
        this.dataset = response.data
        console.log(this.dataset)
        this.dataView.setItems(this.dataset)
      },
      (error) => {
        this.dataset = []
    
      },
      () => {}
      )
    

  }

  direct(){
    this.router.navigateByUrl("/pos-config/create-category")
  }

  onSelectedRowsChanged(a,b){

  }

}
