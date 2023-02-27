
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
  CRMService,
} from "../../../../core/erp"
export type ControlPosition = keyof typeof google.maps.ControlPosition;
@Component({
  selector: 'kt-param-add',
  templateUrl: './param-add.component.html',
  styleUrls: ['./param-add.component.scss']
})
export class CategoryAddComponent implements OnInit {
  posCategory : Category  
  hasFormErrors= false
  hasaddresseFormErrors=false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$ : Observable<boolean>

  paramForm: FormGroup;
  paramDetailsForm: FormGroup;

  categories: any = [];
  time_units : any = []
  action_types : any = []
  methods : any = []
  populations : any = []
  profiles : any = []

  paramDetailsToSend : any = []
  
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

  param_details: any = []; // dataset


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private crmService : CRMService,
    private cdr: ChangeDetectorRef,
    private cl :  FullCalendarModule ,
    private modalService: NgbModal,
    config: NgbDropdownConfig
  
  ) {
    config.autoClose= true
    this.prepareGrid()
   }

  ngOnInit(): void {
    //  this.KTCalendarBasic();
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.getParamsCategorties()
    this.getTimeUnits()
    this.getActionTypes()
    this.getMethods()
    this.getPopulations()
    this.getAllProfiles()
    this.createParamForm()
    this.createParamDetailsForm()
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

  createParamForm() {
    const date = new Date()
    
    this.loadingSubject.next(false);
    this.paramForm = this.formBuilder.group({
      param_code: [ '', Validators.required],
      category: [ '', Validators.required],
      description: [ '', Validators.required],
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
      duration: ['', Validators.required], 
      time_unit: [ '', Validators.required],
      profile_code: [ '', Validators.required],
   })
     
  }

  createParamDetailsForm() {
    const date = new Date()
    
    this.loadingSubject.next(false);
    this.paramDetailsForm = this.formBuilder.group({

      execution_moment: [ '', Validators.required], // execution_moment
      action_0: [ '', Validators.required],
      method_0: [ '', Validators.required],
      time_unit_0:  [ '', Validators.required],

      rel_1: ['', Validators.required], 
      action_1: [ '', Validators.required],
      method_1: [ '', Validators.required],
      time_unit_1: [ '', Validators.required],

      rel_2: ['', Validators.required], 
      action_2: [ '', Validators.required],
      method_2: [ '', Validators.required],
      time_unit_2: [ '', Validators.required],

      rel_3: ['', Validators.required], 
      action_3: [ '', Validators.required],
      method_3: [ '', Validators.required],
      time_unit_3: [ '', Validators.required],

      population_code:[ '', Validators.required],
      population_nb:[ '', Validators.required],
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
    // this.hasFormErrors = false
    const controls = this.paramForm.controls

    /** check form */
    // if (this.categoryForm.invalid) {
    //   Object.keys(controls).forEach((controlName) =>
    //       controls[controlName].markAsTouched()
    //   )

    const date1 = controls.start_date.value
    const d1 = date1.year + '-' + date1.month + '-' + date1.day

    const date2 = controls.end_date.value
    const d2 = date2.year + '-' + date2.month + '-' + date2.day

    const time_unit = controls.time_unit.value

    let factor = 1 
    switch(time_unit){
      case 'mn': factor = 60 ; break ;
      case 'hr': factor = 3600 ; break ; 
    }

    let paramHeaderData = {
      param_code : controls.param_code.value,
      category : controls.category.value,
      description : controls.description.value,
      call_duration : controls.duration.value * factor,
      validity_date_start: d1,
      validity_date_end : d2,
      profile_code : controls.profile_code.value
    }

    this.crmService
      .createParam(paramHeaderData, this.paramDetailsToSend)

      .subscribe(
        (res: any) => {
          console.log(res);
          this.createParamDetailsForm()
          this.param_details = []
        },
        (err) =>
          this.layoutUtilsService.showActionNotification(
            "Erreur lors de l'ajout de la catégorie",
            MessageType.Create,
            10000,
            true,
            true
          ),
        () => {
          this.createParamForm()
          this.layoutUtilsService.showActionNotification(
            "Paramètre ajoutée avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
          // this.router.navigateByUrl("/auth/new-customer/");
        }
      );
  }
  

  getParamsCategorties() {
    this.crmService.getCategories().subscribe(
      (response) => {
        if (response["data"] != null) {
          this.categories = response["data"]
          console.log(this.categories)
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

  getTimeUnits() {
    this.crmService.getTimeUnits().subscribe(
      (response) => {
        if (response["data"] != null) {
          this.time_units = response["data"]
          console.log(this.time_units)
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

  getActionTypes() {
    this.crmService.getActionTypes().subscribe(
      (response) => {
        if (response["data"] != null) {
          this.action_types = response["data"]
          console.log(this.action_types)
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

  getMethods() {
    this.crmService.getMethods().subscribe(
      (response) => {
        if (response["data"] != null) {
          this.methods = response["data"]
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

  getAllProfiles() {
    this.crmService.getAllProfiles().subscribe(
      (response) => {
        if (response["data"] != null) {
          this.profiles = response["data"]
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

  getPopulations() {
    this.crmService.getPopulations().subscribe(
      (response) => {
        if (response["data"] != null) {
          this.populations = response["data"]
          console.log(this.populations)
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
                id: "execution_moment",
                name: "Instant d'exécution",
                field: "execution_moment",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string,
                editor: {model: Editors.text}

            },

            {
                id: "action_0",
                name: "type action 0",
                field: "action_0",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string, 
                editor: {model: Editors.text}
            },
            {
              id: "method_0",
              name: "méthode 0",
              field: "method_0",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.string, 
              editor: {model: Editors.text}
            },

            // ACTION 1
            {
                id: "action_1",
                name: "type action 1",
                field: "action_1",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string, 
                editor: {model: Editors.text}
            },
            {
              id: "method_1",
              name: "méthode 1",
              field: "method_1",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.string, 
              editor: {model: Editors.text}
            },
            {
              id: "rel_1",
              name: "rel lim 1",
              field: "rel_1",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.string, 
              editor: {model: Editors.text}
            },

            // ACTION 2
            {
              id: "action_2",
              name: "type action 2",
              field: "action_2",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.string, 
              editor: {model: Editors.text}
            },
            {
              id: "method_2",
              name: "méthode 2",
              field: "method_2",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.string, 
              editor: {model: Editors.text}
            },
            {
              id: "rel_2",
              name: "rel lim 2",
              field: "rel_2",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.string, 
              editor: {model: Editors.text}
            },

            // ACTION 3
            {
              id: "action_3",
              name: "type action 3",
              field: "action_3",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.string, 
              editor: {model: Editors.text}
            },
            {
              id: "method_3",
              name: "méthode 3",
              field: "method_3",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.string, 
              editor: {model: Editors.text}
            },
            {
              id: "rel_3",
              name: "rel lim 3",
              field: "rel_3",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.string, 
              editor: {model: Editors.text}
            },

            // POPULATION
            {
              id: "population_code",
              name: "c population",
              field: "population_code",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.string, 
              editor: {model: Editors.text}
            },
            {
              id: "population_nb",
              name: "nb_population",
              field: "population_nb",
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
        }
      };

      // this.loadRequestService.getLoadRequests20().subscribe(
      
      //   (response: any) => {
      //     console.log(Object.keys(response.data))
      //     this.loadRequests = response.data
      //     this.dataView.setItems(this.loadRequests)
      //   },
      //   (error) => {
      //       this.loadRequests = []
      //   },
      //   () => {}
      // )


}

addNewItem( paramDetails) {
  this.gridService.addItem(
    {
      id: this.param_details.length + 1,

      execution_moment: paramDetails.execution_moment,
      action_0: paramDetails.action_0,
      method_0: paramDetails.method_0,

      action_1: paramDetails.action_1,
      method_1: paramDetails.method_1,
      rel_1: paramDetails.rel_1,

      action_2: paramDetails.action_2,
      method_2: paramDetails.method_2,
      rel_2: paramDetails.rel_2,

      action_3: paramDetails.action_3,
      method_3: paramDetails.method_3,
      rel_3: paramDetails.rel_3,

      population_code:paramDetails.population_code,
      population_nb:paramDetails.population_nb
    },
    { position: "bottom" }
  );
}

open(content) {
  this.modalService.open(content, { size: "lg" });
}

saveDetail(){
  console.log('details added')
  const controls = this.paramDetailsForm.controls

      let factor0 = 1 
      let factor1 = 1 
      let factor2 = 1 
      let factor3 = 1 
      const time_unit_0 = controls.time_unit_0.value
      const time_unit_1 =controls.time_unit_1.value
      const time_unit_2 =controls.time_unit_2.value
      const time_unit_3 =controls.time_unit_3.value

      switch(time_unit_0){
        case 'mn': factor0 = 60 ; break ;
        case 'hr': factor0 = 3600 ; break ; 
      }

      switch(time_unit_1){
        case 'mn': factor1 = 60 ; break ;
        case 'hr': factor1 = 3600 ; break ; 
      }

      switch(time_unit_2){
        case 'mn': factor2 = 60 ; break ;
        case 'hr': factor2 = 3600 ; break ; 
      }

      switch(time_unit_3){
        case 'mn': factor3 = 60 ; break ;
        case 'hr': factor3 = 3600 ; break ; 
      }


      const execution_moment = controls.execution_moment.value * factor0
      const action_0 =controls.action_0.value
      const method_0 =controls.method_0.value

      const rel_1 =controls.rel_1.value * factor1
      const action_1 =controls.action_1.value
      const method_1 =controls.method_1.value

      const rel_2 = controls.rel_2.value * factor2
      const action_2 =controls.action_2.value
      const method_2 =controls.method_2.value

      const rel_3 = controls.rel_3.value * factor3
      const action_3 =controls.action_3.value
      const method_3 =controls.method_3.value

      const population_code = controls.population_code.value
      const population_nb = controls.population_nb.value

      let paramDetails = {
        execution_moment:execution_moment,
        action_0: action_0,
        method_0:method_0,
        rel_1:rel_1,
        action_1:action_1,
        method_1:method_1,
        rel_2 : rel_2,
        action_2:action_2,
        method_2:method_2,
        rel_3:rel_3,
        action_3:action_3,
        method_3:method_3,
        population_code:population_code,
        population_nb:population_nb
      }
      this.addNewItem(paramDetails)
      document.getElementById("closeForm").click();
      this.paramDetailsToSend.push(paramDetails)
      console.log(paramDetails)
}

}
