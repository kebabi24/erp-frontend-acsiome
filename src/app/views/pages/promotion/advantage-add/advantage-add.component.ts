
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarOptions, FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!

import {Column, GridOption, AngularGridInstance, FieldType} from "angular-slickgrid"
import { ActivatedRoute, Router } from "@angular/router"
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MatDialog } from "@angular/material/dialog"
import { Observable, BehaviorSubject, Subscription, of, Observer } from "rxjs"
import { OnEventArgs, GridService, Editors, thousandSeparatorFormatted, Formatters } from 'angular-slickgrid';
import {ThemePalette} from '@angular/material/core';


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

import interactionPlugin from '@fullcalendar/interaction'; 

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

import {

  CodeService,
  CustomerMobile,
  PosCategoryService,
  CustomerMobileService,
  AddresseMobile,
  CRMService,
  ItemService,
  PromotionService
} from "../../../../core/erp"
import { config } from 'process';
import * as moment from 'moment';
export type ControlPosition = keyof typeof google.maps.ControlPosition;
@Component({
  selector: 'kt-advantage-add',
  templateUrl: './advantage-add.component.html',
  styleUrls: ['./advantage-add.component.scss']
})
export class AdvantageAddComponent implements OnInit {
  hasFormErrors= false
  hasaddresseFormErrors=false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$ : Observable<boolean>

  populationForm: FormGroup;

  products: any = [];
  isExist = false ;
  cantSearch = true ;
  
  // GRID 
  columnDefinitions: Column[] = []
  columnDefinitions2: Column[] = []
  gridOptions: GridOption = {}
  gridOptions2: GridOption = {}
  gridObj: any
  angularGrid: AngularGridInstance
  gridService: GridService
  message: any
  column : Column
  grid: any
  dataView: any

  selectedProducts: any[];

  adv_types = [
    {
      name : "remise_pu",
      value: "Remise sur le prix unitaire"
    },
    {
      name : "remise_mt",
      value: "Remise sur le montant total"
    },
    {
      name : "remise_mt_pu",
      value: "Remise sur le MT/PU"
    },
    {
      name : "gratuite",
      value: "Gratuité"
    },
  ]

  product_list = ""


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private promotionService : PromotionService,
    private itemService : ItemService,
    private modalService: NgbModal,
    config: NgbDropdownConfig
  
  ) {
    config.autoClose= true
    this.prepareGrid()
   }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.createPopulationForm()
    this.init()
  }

  time = new Observable<string>((observer: Observer<string>) => {
    setInterval(() => {
      observer.next("");
    }, 1000);
  });

  init(){
    // this.createCategoryForm()
    this.loadingSubject.next(false)
  }

  createPopulationForm() {
    const date = new Date()
    
    this.loadingSubject.next(false);
    this.populationForm = this.formBuilder.group({

      code_adv: [ '', Validators.required],
      type_adv: [ {value : '',disabled : !this.isExist}, Validators.required],
      amount_perc: [ {value : '',disabled : !this.isExist}, Validators.required],
      
   })
     
  }

  onChangeCode() {
    const controls = this.populationForm.controls
    const code_adv = controls.code_adv.value
    if(code_adv === "") { 
      this.cantSearch = true 
      this.selectedProducts = []
    } 

      this.promotionService.getAdv(code_adv).subscribe(
          (res: any) => {
            if (res.data) {
              alert("Ce code de avantage exist déja")
              document.getElementById("code").focus(); 
              controls.type_adv.disable()
              controls.amount_perc.disable()    
            } else { 
              this.isExist = true
              controls.type_adv.enable()
              controls.amount_perc.enable()   
          }
               
      })
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
     this.hasFormErrors = false
     const controls = this.populationForm.controls
     if (this.populationForm.invalid) {
       Object.keys(controls).forEach((controlName) =>
           controls[controlName].markAsTouched()
       )

         this.hasFormErrors = true
         return
       }
     if(this.selectedProducts.length == 0){
       alert("Sélectionner au moins un produit à ajouter dans la population")
       return 
     }
    const adv_code = controls.code_adv.value
    const type_adv = controls.type_adv.value
    const amount_perc = controls.amount_perc.value

    

    if(this.selectedProducts.length>0){
      console.log('products selected')
      this.selectedProducts.forEach(index =>{
        const product = this.products[index]
        if(this.product_list.length == 0 ){
          this.product_list += product.pt_part
        }else{
          this.product_list +=","+ product.pt_part
        }
          
        
      }) 
    }
     let advantage = {
      adv_code , adv_type: type_adv , amount : amount_perc , product_list : this.product_list
     }
     console.log("submit")
     this.promotionService
       .createAdvantage(advantage)

       .subscribe(
         (res: any) => {
           console.log(res);
           this.prepareGrid()
           this.createPopulationForm()
         },
         (err) =>
           this.layoutUtilsService.showActionNotification(
             "Erreur lors de l'ajout de la population",
             MessageType.Create,
             10000,
             true,
             true
           ),
         () => {
           this.createPopulationForm()
           this.layoutUtilsService.showActionNotification(
             "Population ajoutée avec succès",
             MessageType.Create,
             10000,
             true,
             true
           );
           // this.router.navigateByUrl("/auth/new-customer/");
         }
       );
  }
  

  

  onAlertClose($event) {
    // this.hasFormErrors = false
  }

  // GRID STUFF
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

  this.itemService.getAll().subscribe(
    (response: any) => {
      this.products = response.data
      this.dataView.setItems(this.products)
    },
    (error) => {
        this.products = []
    },
    () => {}
  )

    this.columnDefinitions = this.columnDefinitions = [      
      {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 40,
          maxWidth: 40,
      },
      {
          id: "pt_part",
          name: "Code Produit",
          field: "pt_part",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "pt_desc1",
          name: "Deescription",
          field: "pt_desc1",
          sortable: true,
          filterable: true,
          width: 100,
          type: FieldType.string,
      },
      {
          id: "pt_um",
          name: "UM",
          field: "pt_um",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "pt_part_type",
        name: "Type",
        field: "pt_part_type",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pt_draw",
        name: "Classe",
        field: "pt_draw",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },

   
      
    ]

      this.gridOptions = {
        autoHeight:true,
        asyncEditorLoading: false,
        editable: true,
        enableAddRow:true,
        enableColumnPicker: true,
        enableCellNavigation: true,
        enableRowSelection: true,
        enableCheckboxSelector: true,
        rowSelectionOptions: {
          selectActiveRow: false
        },
        checkboxSelector: {
          hideSelectAllCheckbox: true,
        },
      };
}

onSelectedRowsChanged(e, args) {
  console.log('indexs', args.rows);
  this.selectedProducts =[]
  this.selectedProducts = args.rows;
  console.log(this.selectedProducts)

}

}
