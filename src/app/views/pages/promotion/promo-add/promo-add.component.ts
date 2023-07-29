
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
  selector: 'kt-promo-add',
  templateUrl: './promo-add.component.html',
  styleUrls: ['./promo-add.component.scss']
})
export class PromoAddComponent implements OnInit {
  hasFormErrors= false
  hasaddresseFormErrors=false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$ : Observable<boolean>

  populationForm: FormGroup;

  products: any = [];
  isExist = false ;
  cantSearch = true ;
  
  

  adv_types = []


  gridOptions3: GridOption = {}
  columnDefinitions3: Column[] = []
  gridObj3: any
  angularGrid3: AngularGridInstance
  dataView3: any
  gridService3: GridService
  popsArticle : []

  gridOptions6: GridOption = {}
  columnDefinitions6: Column[] = []
  gridObj6: any
  angularGrid6: AngularGridInstance
  dataView6: any
  gridService6: GridService
  sites : []

  gridOptions2: GridOption = {}
  columnDefinitions2: Column[] = []
  gridObj2: any
  angularGrid2: AngularGridInstance
  dataView2: any
  gridService2: GridService
  popsClient : []

  gridOptions4: GridOption = {}
  columnDefinitions4: Column[] = []
  gridObj4: any
  angularGrid4: AngularGridInstance
  dataView4: any
  gridService4: GridService
  advantages : []


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
   }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.getPopsArticle()
    this.getSites()
    this.getAdvantages()
    this.getPopsClient()
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



      promo_code: [ '', Validators.required],
      pop_a_code: [ {value : '',disabled : !this.isExist}, Validators.required],
      pop_c_code: [ {value : '',disabled : !this.isExist}, Validators.required],

      site : ['', Validators.required],

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

      condition : [ '', Validators.required],
      combine  : [ '', Validators.required],
      adv_code  : [ '', Validators.required],
      rank:[ '', Validators.required],
      
   })
     
  }

  onChangeCode() {
    const controls = this.populationForm.controls
    const promo_code = controls.promo_code.value
    if(promo_code === "") { 
      this.cantSearch = true 
    }

    

      this.promotionService.getPromo(promo_code).subscribe(
          (res: any) => {
            if (res.data) {
              alert("Ce code de population exist déja")
              document.getElementById("code").focus(); 
              controls.amount_perc.disable()
              controls.type_adv.disable()     
              controls.pop_a_code.disable()     
              controls.pop_c_code.disable()     
              controls.condition.disable()     
              controls.combine.disable()     
              controls.rank.disable()     
            } else { 
              this.isExist = true
              this.cantSearch = false
              controls.amount_perc.enable()
              controls.type_adv.enable()     
              controls.pop_a_code.enable()     
              controls.pop_c_code.enable()     
              controls.condition.enable()     
              controls.combine.enable()     
              controls.rank.enable()     
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
     
    const promo_code = controls.promo_code.value
    const pop_a_code = controls.pop_a_code.value
    const pop_c_code = controls.pop_c_code.value
    const site = controls.site.value
    const start_date = controls.start_date.value
    const end_date = controls.end_date.value
    const condition = controls.condition.value
    const combine = controls.combine.value
    const adv_code = controls.adv_code.value
    const rank = controls.rank.value
    
    let promo = {
      promo_code,pop_a_code,pop_c_code,site,condition,combine,adv_code,rank,
      start_date : start_date.year + '-' +  start_date.month + '-' + start_date.day ,
      end_date : end_date.year + '-' +  end_date.month + '-' + end_date.day 
    }

      this.promotionService
        .createPromotion(promo)

        .subscribe(
          (res: any) => {
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
              "Promotion ajoutée avec succès",
              MessageType.Create,
              10000,
              true,
              true
            );
             //this.router.navigateByUrl("/auth/new-customer/");
         }
       );
  }
  

  

  onAlertClose($event) {
    // this.hasFormErrors = false
  }


  // GRIDS 

//  ******************* GRID POPULATION ARTICLE 
  open3(content) {
    this.preparePopsArticleGrid()
    this.modalService.open(content, { size: "lg" })
  }

  preparePopsArticleGrid() {
    this.columnDefinitions3 = [
        {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
        },
        {
            id: "population_code",
            name: "Code",
            field: "population_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "description",
          name: "Description",
          field: "description",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
        {
          id: "rank",
          name: "Rang",
          field: "rank",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },   
    ]

    this.gridOptions3 = {
        enableSorting: true,
        enableCellNavigation: true,
        enableExcelCopyBuffer: true,
        enableFiltering: true,
        autoEdit: false,
        autoHeight: false,
        frozenColumn: 0,
        frozenBottom: true,
        enableRowSelection: true,
        enableCheckboxSelector: true,
        checkboxSelector: {
            
            hideSelectAllCheckbox: true,
        },
        multiSelect: false,
        rowSelectionOptions: {
            selectActiveRow: true,
        },
    }

   
  }

  getPopsArticle(){
     this.promotionService
     .getAllPopsArticle()
     .subscribe((response: any) => {
       this.popsArticle = response.data
       this.dataView3.setItems(response.data)
     })
  }
  gridReady3(angularGrid: AngularGridInstance) {
    this.angularGrid3 = angularGrid;
    this.dataView3 = angularGrid.dataView;
    this.gridObj3 = angularGrid.slickGrid;
    this.gridService3 = angularGrid.gridService;
  }
 
 angularGridReady3(angularGrid: AngularGridInstance) {
     this.angularGrid3 = angularGrid;
     this.dataView3 = angularGrid.dataView;
     this.gridObj3 = angularGrid.slickGrid;
     this.gridService3 = angularGrid.gridService;
    
 }
 handleSelectedPopArticle(e, args) {
   const controls = this.populationForm.controls
  if(args.rows.length >0){
    let index = args.rows[0]
    const pop = this.gridObj3.getDataItem(index)
    controls.pop_a_code.setValue(pop.population_code)
  }
  
}


//  ******************* GRID SITES

open8(content) {
  this.prepareGridSite()
  this.modalService.open(content, { size: "lg" })
}

prepareGridSite() {
    this.columnDefinitions6 = [
              {
                  id: "si_site",
                  name: "Code site",
                  field: "si_site",
                  sortable: true,
                  minWidth: 100,
                  maxWidth: 300,
                  filterable: true,
                  type: FieldType.string,
                  
  
              },
  
              {
                  id: "si_desc",
                  name: "Description",
                  field: "si_desc",
                  sortable: true,
                  minWidth: 100,
                  maxWidth: 300,
                  filterable: true,
                  type: FieldType.string, 
                  
              },
              {
                id: "si_status",
                name: "Status",
                field: "si_status",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.integer, 
              }    
        ]
  
        this.gridOptions6 = {
          asyncEditorLoading: false,
          editable: false,
          enableAddRow:true,
          enableAutoResize:true,
          autoHeight:true,
          enableColumnPicker: true,
          enableCellNavigation: true,
          enableRowSelection: true,
          enableCheckboxSelector: true,
          rowSelectionOptions: {
            selectActiveRow: false
          }
        };
  
}

gridReady6(angularGrid: AngularGridInstance) {
    this.angularGrid6 = angularGrid;
    this.dataView6 = angularGrid.dataView;
    this.gridObj6 = angularGrid.slickGrid;
    this.gridService6 = angularGrid.gridService;
}
    
angularGridReady6(angularGrid: AngularGridInstance) {
      this.angularGrid6 = angularGrid;
      this.dataView6 = angularGrid.dataView;
      this.gridObj6 = angularGrid.slickGrid;
      this.gridService6 = angularGrid.gridService;
    
}
    
handleSelectedSite(e, args) {
     const controls = this.populationForm.controls
     if(args.rows.length >0){
       let index = args.rows[0]
       const item = this.gridObj6.getDataItem(index)
    
       controls.site.setValue(item.si_site)
       
     }
    
}

getSites(){
      this.promotionService.getAllSites().subscribe(
      
    (response: any) => {
      this.sites = response.data
      this.dataView6.setItems(this.sites)
    },
    (error) => {
        this.sites = []
    },
    () => {}
    )
}

//  ******************* GRID POPULATION CLIENT
open2(content) {
  this.prepareGridPopClient()
  this.modalService.open(content, { size: "lg" })
}

prepareGridPopClient() {
    this.columnDefinitions2 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
    },
    {
        id: "population_code",
        name: "Code",
        field: "population_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        },
        {
          id: "population_desc",
          name: "Description",
          field: "population_desc",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },   
        ]
  
        this.gridOptions2 = {
          asyncEditorLoading: false,
          editable: false,
          enableAddRow:true,
          enableAutoResize:true,
          autoHeight:true,
          enableColumnPicker: true,
          enableCellNavigation: true,
          enableRowSelection: true,
          enableCheckboxSelector: true,
          rowSelectionOptions: {
            selectActiveRow: false
          }
        };
  
}

gridReady2(angularGrid: AngularGridInstance) {
    this.angularGrid2 = angularGrid;
    this.dataView2 = angularGrid.dataView;
    this.gridObj2 = angularGrid.slickGrid;
    this.gridService2 = angularGrid.gridService;
}
    
angularGridReady2(angularGrid: AngularGridInstance) {
      this.angularGrid2 = angularGrid;
      this.dataView2 = angularGrid.dataView;
      this.gridObj2 = angularGrid.slickGrid;
      this.gridService2 = angularGrid.gridService;
    
}
    
handleSelectedPopClient(e, args) {
     const controls = this.populationForm.controls
     if(args.rows.length >0){
       let index = args.rows[0]
       const pop = this.gridObj2.getDataItem(index)
    
       controls.pop_c_code.setValue(pop.population_code)
       
     }
    
}

getPopsClient(){
      this.promotionService.getPopsClient().subscribe(
      
    (response: any) => {
      this.popsClient = response.data
      this.dataView2.setItems(this.popsClient)
    },
    (error) => {
      this.popsClient = []
    },
    () => {}
    )
}

//  ******************* GRID ADVANTAGES
open4(content) {
  this.prepareGridAdvantages()
  this.modalService.open(content, { size: "lg" })
}

prepareGridAdvantages() {
    this.columnDefinitions4 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
    },
    {
        id: "adv_code",
        name: "Code",
        field: "adv_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        },
        {
          id: "adv_type",
          name: "Type",
          field: "adv_type",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },   
        {
          id: "adv_amount",
          name: "Montant",
          field: "adv_amount",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },  
        {
          id: "product_list",
          name: "List produits",
          field: "product_list",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },  
        ]
  
        this.gridOptions4 = {
          asyncEditorLoading: false,
          editable: false,
          enableAddRow:true,
          enableAutoResize:true,
          autoHeight:true,
          enableColumnPicker: true,
          enableCellNavigation: true,
          enableRowSelection: true,
          enableCheckboxSelector: true,
          rowSelectionOptions: {
            selectActiveRow: false
          }
        };
  
}

gridReady4(angularGrid: AngularGridInstance) {
    this.angularGrid4 = angularGrid;
    this.dataView4 = angularGrid.dataView;
    this.gridObj4 = angularGrid.slickGrid;
    this.gridService4 = angularGrid.gridService;
}
    
angularGridReady4(angularGrid: AngularGridInstance) {
      this.angularGrid4 = angularGrid;
      this.dataView4 = angularGrid.dataView;
      this.gridObj4 = angularGrid.slickGrid;
      this.gridService4 = angularGrid.gridService;
    
}
    
handleSelectedAdvantage(e, args) {
     const controls = this.populationForm.controls
     if(args.rows.length >0){
       let index = args.rows[0]
       const adv = this.gridObj4.getDataItem(index)
    
       controls.adv_code.setValue(adv.adv_code)
       
     }
    
}

getAdvantages(){
      this.promotionService.getAllAdvantages().subscribe(
      
    (response: any) => {
      this.advantages = response.data
      this.dataView2.setItems(this.advantages)
    },
    (error) => {
      this.advantages = []
    },
    () => {}
    )
}

}
