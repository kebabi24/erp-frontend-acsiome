import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!

import {Column, GridOption, AngularGridInstance, FieldType} from "angular-slickgrid"
import { ActivatedRoute, Router } from "@angular/router"
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MatDialog } from "@angular/material/dialog"
import { Observable, BehaviorSubject, Subscription, of, Observer } from "rxjs"
import { OnEventArgs, GridService, Editors, thousandSeparatorFormatted, Formatters } from 'angular-slickgrid';
import {ThemePalette} from '@angular/material/core';
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
  EmployeService,
  PopulationemployeService,
  CodeService,
  Code,
} from "../../../../core/erp"
import { config } from 'process';
import * as moment from 'moment';
import { timingSafeEqual } from 'crypto';
@Component({
  selector: 'kt-create-population',
  templateUrl: './create-population.component.html',
  styleUrls: ['./create-population.component.scss']
})
export class CreatePopulationComponent implements OnInit {

  hasFormErrors= false
  hasaddresseFormErrors=false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$ : Observable<boolean>

  populationForm: FormGroup;

  employes: any = [];
  pop_country: any = [];
  pop_state: any = [];
  pop_city: any = [];
  isExist = true ;
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
    private employeService : EmployeService,
    private codeService:CodeService,
    private cdr: ChangeDetectorRef,
    private populationemployeService :  PopulationemployeService ,
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
      pop_code: [ '', Validators.required],
      pop_desc: [ {value : '',disabled : !this.isExist}, Validators.required],
      pop_fidelity:[ {value : false,disabled : !this.isExist}],
      pop_habilitation:[ {value : false,disabled : !this.isExist}],
      pop_last_date:[ {value : 0,disabled : !this.isExist}],
      pop_conf_date:[ {value : 0,disabled : !this.isExist}],
      pop_age1:[ {value : 0,disabled : !this.isExist}],
      pop_age2:[ {value : 100,disabled : !this.isExist}],
      pop_gender:[ {value : '',disabled : !this.isExist}],
      pop_job:[ {value : '',disabled : !this.isExist}],
      pop_level:[ {value : '',disabled : !this.isExist}],
      pop_country:[ {value : false,disabled : !this.isExist}],
      pop_state:[ {value : false,disabled : !this.isExist}],
      pop_city:[ {value : false,disabled : !this.isExist}],
      pop_county:[ {value : false,disabled : !this.isExist}],
   })
     
  }

  onChangeCode() {
    const controls = this.populationForm.controls
    const pop_code = controls.pop_code.value
    
    this.populationemployeService.getBy({pop_code}).subscribe(
        (res: any) => {
          if (res.data) {
            alert("Ce code de population exist déja")
            document.getElementById("pop_code").focus(); 
            controls.pop_desc.disable() 
          } else { 
            this.isExist = false
            this.cantSearch = false
            controls.pop_desc.enable()    
            document.getElementById("pop_desc").focus();
        }
               
    })
  } 

  
  goBack() {
    //this.loadingSubject.next(false)
    const url = `/training/create-population`
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
      alert("Sélectionner au moins un employé à ajouter dans la population")
      return 
    }
    const pop_code = controls.pop_code.value
    const pop_desc = controls.pop_desc.value
    const pop_fidelity = controls.pop_fidelity.value
    const pop_habilitation = controls.pop_habilitation.value
    const pop_last_date = controls.pop_last_date.value
    const pop_conf_date = controls.pop_conf_date.value
    const pop_age1 = controls.pop_age1.value
    const pop_age2 = controls.pop_age2.value
    const pop_gender = controls.pop_gender.value
    const pop_job = controls.pop_job.value
    const pop_level = controls.pop_level.value
    const pop_country = controls.pop_country.value
    const pop_state = controls.pop_state.value
    const pop_city = controls.pop_city.value
    const pop_county = controls.pop_county.value
    let populationData = []

    
    if(this.selectedCustomers.length>0){
      console.log('customers selected')
      this.selectedCustomers.forEach(index =>{
        const employe = this.employes[index]
        console.log(employe)
        populationData.push({
          pop_code :pop_code ,
          pop_desc:pop_desc,
          pop_fidelity:pop_fidelity,
          pop_habilitation:pop_habilitation,
          pop_last_date:pop_last_date,
          pop_conf_date:pop_conf_date,
          pop_age1:pop_age1,
          pop_age2:pop_age2,
          pop_gender:pop_gender,
          pop_job:pop_job,
          pop_level:pop_level,
          pop_country:pop_country,
          pop_state:pop_state,
          pop_city:pop_city,
          pop_county:pop_county,
          pop_emp :employe.emp_addr,
         
        })
      })
    }else{
      populationData.push({
        pop_code :pop_code ,
        pop_desc:pop_desc,
        pop_fidelity:pop_fidelity,
        pop_habilitation:pop_habilitation,
        pop_last_date:pop_last_date,
        pop_conf_date:pop_conf_date,
        pop_age1:pop_age1,
        pop_age2:pop_age2,
        pop_gender:pop_gender,
        pop_job:pop_job,
        pop_level:pop_level,
        pop_country:pop_country,
        pop_state:pop_state,
        pop_city:pop_city,
        pop_county:pop_county,
        
       
      })
    }

   
    this.populationemployeService
      .add(populationData)

      .subscribe(
        (res: any) => {
          this.employes=[]
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
          // this.createPopulationForm()
          // this.prepareGrid()
          this.layoutUtilsService.showActionNotification(
            "Population ajoutée avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
           this.reset()
           this.router.navigateByUrl("/training/create-population");
        }
      );
  }
  

 
  onAlertClose($event) {
    // this.hasFormErrors = false
  }

  reset(){
    this.employes=[]
    //this.prepareGrid()
    this.grid.setSelectedRows([]);
    this.selectedCustomers =[]
    this.employeService.getAll().subscribe(
      (response: any) => {this.employes = response.data,
        this.dataView.setItems(this.employes)},
      (error) => {
          this.employes = []
      },
      () => {}
  )
    this.createPopulationForm()
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
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
  },
  {
      id: "emp_addr",
      name: "Code Employe",
      field: "emp_addr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
  },
  {
      id: "emp_fname",
      name: "Nom",
      field: "emp_fname",
      sortable: true,
      filterable: true,
      width: 50,
      type: FieldType.string,
  },
  {
      id: "emp_lname",
      name: "Prénom",
      field: "emp_lname",
      sortable: true,
      filterable: true,
      width: 50,
      type: FieldType.string,
  },
  {
    id: "emp_line1",
    name: "Adresse",
    field: "emp_line1",
    sortable: true,
    width: 120,
    filterable: true,
    type: FieldType.string,
  },
  {
    id: "emp_birth_date",
    name: "Date Naissance",
    field: "emp_birth_date",
    sortable: true,
    filterable: true,
    width: 50,
    type: FieldType.dateIso,
  },
  
  {
    id: "emp_job",
    name: "Service",
    field: "emp_job",
    sortable: true,
    filterable: true,
    width: 50,
    type: FieldType.string,
  },
  
  {
    id: "emp_level",
    name: "Niveau",
    field: "emp_level",
    sortable: true,
    filterable: true,
    width: 50,
    type: FieldType.string,
  },
  {
    id: "emp_site",
    name: "Site",
    field: "emp_site",
    sortable: true,
    filterable: true,
    type: FieldType.string,
  },
  
  {
    id: "emp_shift",
    name: "Equipe",
    field: "emp_shift",
    sortable: true,
    filterable: true,
    type: FieldType.string,
  },

  {
    id: "emp_rate",
    name: "Taux",
    field: "emp_rate",
    sortable: true,
    filterable: true,
    type: FieldType.float,
  },
  {
    id: "emp_mrate",
    name: "Taux Multiple",
    field: "emp_mrate",
    sortable: true,
    filterable: true,
    type: FieldType.float,
  },
  {
    id: "emp_arate",
    name: "Taux",
    field: "emp_arate",
    sortable: true,
    filterable: true,
    type: FieldType.float,
  },
          
      ]

      this.gridOptions = {
        asyncEditorLoading: false,
        editable: true,
        enableFiltering:true,
        enableAddRow:true,
        enableColumnPicker: true,
        enableCellNavigation: true,
        enableRowSelection: true,
        enableCheckboxSelector: true,
        rowSelectionOptions: {
          selectActiveRow: false
        },
        rowHeight:40,
        checkboxSelector: {
          hideSelectAllCheckbox: true,
        },
      };
      this.employes = []
        this.employeService.getAll().subscribe(
            (response: any) => {this.employes = response.data,
             this.dataView.setItems(this.employes)},
            (error) => {
                this.employes = []
            },
            () => {}
        )
}

onSelectedRowsChanged(e, args) {
  console.log('indexs', args.rows);
  this.selectedCustomers =[]
  this.selectedCustomers = args.rows;
  console.log(this.selectedCustomers)
  
}
onChangeState() {
  const controls = this.populationForm.controls
 console.log(controls.ad_state.value)
  this.codeService
      .getBy({ code_fldname: "ad_city", chr01: controls.ad_state.value.substring(0, 2) })
      .subscribe((response: any) => {(this.pop_city = response.data)
      console.log(response.data)})    
}
prepareUsage(): Code {
  const controls = this.populationForm.controls
  const _code = new Code()
  _code.code_fldname = 'pt_network'
  _code.code_value = controls.pop_code.value
  _code.code_cmmt = controls.pop_desc.value
  
  return _code
}
addCode(_code: Code) {
  this.loadingSubject.next(true)
  this.codeService.add(_code).subscribe(
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
          // this.router.navigateByUrl("/code-mstr/codes-list")
          //this.reset()
      }
  )
}

}
