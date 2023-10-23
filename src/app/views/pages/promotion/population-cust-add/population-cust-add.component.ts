
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
  CustomerMobileService,
  CRMService,
  PromotionService,
} from "../../../../core/erp"
import { config } from 'process';
import * as moment from 'moment';
import { timingSafeEqual } from 'crypto';
export type ControlPosition = keyof typeof google.maps.ControlPosition;
@Component({
  selector: 'kt-population-cust-add',
  templateUrl: './population-cust-add.component.html',
  styleUrls: ['./population-cust-add.component.scss']
})
export class PopulationCustomerAddComponent implements OnInit {
  hasFormErrors= false
  hasaddresseFormErrors=false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$ : Observable<boolean>

  populationForm: FormGroup;

  customers: any = [];
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

  selectedCustomers: any[];


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private crmService : CRMService,
    private customerMobileService : CustomerMobileService,
    private cdr: ChangeDetectorRef,
    private cl :  FullCalendarModule ,
    private modalService: NgbModal,
    private promotionService : PromotionService,
    config: NgbDropdownConfig
  
  ) {
    config.autoClose= true
    this.prepareGrid()
   }

  ngOnInit(): void {
    //  this.KTCalendarBasic();
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.getCustomers()
    this.prepareGrid()
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
      code_population: [ '', Validators.required],
      desc_population: [ {value : '',disabled : !this.isExist}, Validators.required],
      client_type: [ {value : '',disabled : !this.isExist}],
      client_class: [ {value : '',disabled : !this.isExist}],
      client_region: [ {value : '',disabled : !this.isExist}],
      cm_db: [ {value : '',disabled : !this.isExist}],
      start_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      end_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
   })
     
  }

  onChangeCode() {
    const controls = this.populationForm.controls
    const population_code = controls.code_population.value
    if(population_code === "") { 
      this.cantSearch = true 
      this.selectedCustomers = []
    }
    this.promotionService.getPopulationCustomer(population_code).subscribe(
        (res: any) => {
          if (res.data) {
            alert("Ce code de population exist déja")
            document.getElementById("code").focus(); 
            controls.desc_population.disable() 
          } else { 
            this.isExist = true
            this.cantSearch = false
            controls.desc_population.enable()    
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
    if(this.selectedCustomers.length == 0){
      alert("Sélectionner au moins un client à ajouter dans la population")
      return 
    }
    const population_code = controls.code_population.value
    const population_desc = controls.desc_population.value

    let populationData = []

    
    if(this.selectedCustomers.length>0){
      console.log('customers selected')
      this.selectedCustomers.forEach(index =>{
        const customer = this.customers[index]
        console.log(customer)
        populationData.push({
          population_code :population_code ,
          population_desc:population_desc,
          code_element :customer.customer_code,
          description : population_desc,
          type: ""
        })
      })
    }else{
      console.log('no customer selected')
      alert("Sélectionnez au moins un client")
      return;
    }

   
    this.promotionService
      .createPopulationCustomer(populationData)

      .subscribe(
        (res: any) => {
          this.customers=[]
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
          this.prepareGrid()
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
  

  getCustomers() {
   
    this.customers = []

    this.customerMobileService.getAllCustomers().subscribe(
      (response) => {
        if (response["data"] != null) {
          this.selectedCustomers = []
          this.customers = response["data"]
          console.log(this.customers)
         
        }
      },
      (error) => {
        this.layoutUtilsService.showActionNotification(
          "Erreur lors de la récupération des données du backend",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.loadingSubject.next(false);
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
  this.columnDefinitions = [

            {
                id: "customer_code",
                name: "Code",
                field: "customer_code",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string,
                editor: {model: Editors.text}

            },

            {
                id: "customer_name",
                name: "Nom",
                field: "customer_name",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string, 
                editor: {model: Editors.text}
            },
            {
              id: "customer_arabic_name",
              name: "Nom en arabe",
              field: "customer_arabic_name",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.string, 
              editor: {model: Editors.text}
            },

            // ACTION 1
            {
                id: "customer_phone_one",
                name: "Numéro de téléphone",
                field: "customer_phone_one",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string, 
                editor: {model: Editors.text}
            },
            {
              id: "city",
              name: "Ville",
              field: "city",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.string, 
              editor: {model: Editors.text}
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
        },
        checkboxSelector: {
          hideSelectAllCheckbox: true,
        },
      };
}

onSelectedRowsChanged(e, args) {
  console.log('indexs', args.rows);
  this.selectedCustomers =[]
  this.selectedCustomers = args.rows;
  console.log(this.selectedCustomers)
  
}

}
