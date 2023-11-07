import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
// Angular slickgrid
import { HttpClient } from "@angular/common/http"
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
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

import { Patient, PatientService, CodeService, SiteService,UsersService, AssociationService} from "../../../../core/erp"
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { array } from "@amcharts/amcharts4/core";
import { filters } from "dist/assets/plugins/formvalidation/src/js";
const API_URL = environment.apiUrl + "/codes"
@Component({
  selector: 'kt-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.scss']
})
export class CreatePatientComponent implements OnInit {
  patient: Patient
  patForm: FormGroup
  hasFormErrors = false
  hasEmployeErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  error = false
  field = ""
  selectedTab = 0
    data: []
    columnDefinitions3: Column[] = []
    gridOptions3: GridOption = {}
    gridObj3: any
    angularGrid3: AngularGridInstance
    selectedField = ""
   
    hasEmployeFormErrors = false

    datasite: []
    columnDefinitionssite: Column[] = []
    gridOptionssite: GridOption = {}
    gridObjsite: any
    angularGridsite: AngularGridInstance

    dataass: []
    columnDefinitionsass: Column[] = []
    gridOptionsass: GridOption = {}
    gridObjass: any
    angularGridass: AngularGridInstance
    
    datatrait: any [] = []
    datasettrait: any [] = []
    columnDefinitionstrait: Column[] = []
    gridOptionstrait: GridOption = {}
    gridObjtrait: any
    angularGridtrait: AngularGridInstance
    gridtrait: any;
    gridServicetrait: GridService;
    dataViewtrait: any;
    
    jobs: [];
    columnDefinitions2: Column[] = [];
    gridOptions2: GridOption = {};
    gridObj2: any;
    angularGrid2: AngularGridInstance;

  // grid options
    mvangularGrid: AngularGridInstance;
    mvgrid: any;
    mvgridService: GridService;
    mvdataView: any;
    mvcolumnDefinitions: Column[];
    mvgridOptions: GridOption;
    mvdataset: any[];

    angularGrid: AngularGridInstance;
    grid: any;
    gridService: GridService;
    dataView: any;
    columnDefinitions: Column[];
    gridOptions: GridOption;
    dataset: any[];
    

    pat_city: any[] = []
    pat_state: any[] = []
    pat_county: any[] = []
    pat_country: any[] = []
    row_number;
    httpOptions = this.httpUtils.getHTTPHeaders()
    leveljbd = [];
    leveljob = []
    dis:any
  constructor(
      config: NgbDropdownConfig,
      private patFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private modalService: NgbModal,
      private patientService: PatientService,
     
      private codeService: CodeService,
      private siteService: SiteService,
      private associationService: AssociationService,
      private http: HttpClient,
      private httpUtils: HttpUtilsService,
     
    
      
  ) {
      config.autoClose = true
      this.codeService
      .getBy({ code_fldname: "ad_state" })
      .subscribe((response: any) => (this.pat_state = response.data))
      this.codeService
      .getBy({ code_fldname: "ad_country" })
      .subscribe((response: any) => (this.pat_country = response.data))
      this.codeService
      .getBy({ code_fldname: "ad_county" })
      .subscribe((response: any) => (this.pat_county = response.data))
      this.codeService
      .getBy({ code_fldname: "ad_city" })
      .subscribe((response: any) => (this.pat_city = response.data))
  

  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.createForm()
    this.initGrid()
}

initGrid() {
  this.columnDefinitions = [
    {
      id: "idd",
      field: "id",
      excludeFromHeaderMenu: true,
      formatter: Formatters.deleteIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          this.angularGrid.gridService.deleteItem(args.dataContext);
        }
      },
    
    },
    {
      id: "id",
      field: "id",
      name: "Id",
      excludeFromHeaderMenu: true,
      minWidth: 30,
      maxWidth: 30,
    },
    {
      id: "patd_disease",
      name: "Code Maladie",
      field: "patd_disease",
      sortable: true,
      width: 50,
      filterable: false,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      },
      
    },
    {
      id: "disease",
      name: "Maladie",
      field: "disease",
      
        formatter: Formatters.complexObject,
        exportWithFormatter: true,
        dataKey: 'value',
        labelKey: 'label',
        type: FieldType.object,
        // sortComparer: SortComparers.objectString, // this sorter requires the dataKey and assume that obj1[dataKey] will be a string so it can sort it that way
        filterable: true,
        // filter: Filters.autoComplete,
        sortable: false,
        minWidth: 100,
        editor: {
          model: Editors.autoComplete,
          customStructure: {  value: 'value',label: 'label' },
          collectionAsync:  this.http.get(`${API_URL}/disease`),
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.disease.value,args.dataContext.id)
          this.gridService.updateItemById(args.dataContext.id,{ ...args.dataContext, patd_disease: args.dataContext.disease.value })
          console.log(this.dataset)
   
        // },
        
        },
    },
   
    // {
    //   id: "patd_disease",
    //   name: "Maladie",
    //   field: "patd_disease",
    //   sortable: true,
    //   width: 50,
    //   filterable: false,
    //   type: FieldType.string,
    //   editor: {
    //     model: Editors.text,
    //   },
    
    // },
    {
      id: "patd_year",
      name: "Année",
      field: "patd_year",
      sortable: true,
      width: 50,
      filterable: false,
      type: FieldType.string,
      
      editor: {
        model: Editors.integer,
      },
      
     
    },
    {
      id: "patd_cmmt",
      name: "Commentaire",
      field: "patd_cmmt",
      sortable: true,
      filterable: false,
      type: FieldType.text,
      
      editor: {
        model: Editors.longText,
      },
      

    },
    
    {
      id: "traitement",
      name: "Traitement",
      field: "traitement",
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      formatter: (row, cell, value, columnDef, dataContext) => {
        // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
        return `
        <a class="btn btn-sm btn-clean btn-icon mr-2" title="Ajouter les traitement">
             <i class="flaticon2-add"></i>
             
         </a>
         `;
      },
      minWidth: 50,
      maxWidth: 50,
      // use onCellClick OR grid.onClick.subscribe which you can see down below
      onCellClick: (e: Event, args: OnEventArgs) => {
        console.log(args.dataContext.patd_disease)
        this.dis = args.dataContext.patd_disease
        console.log(this.dis)
        this.datatrait = []
          let element: HTMLElement = document.getElementById(
            "openTraitGrid"
          ) as HTMLElement;
          element.click();
      },
    },
  ];

  this.gridOptions = {
   
    asyncEditorLoading: false,
    editable: true,
    enableAutoResize:true,
    autoHeight:true,
    enableColumnPicker: true,
    enableCellNavigation: true,
    enableRowSelection: true,

    presets: {
      // the column position in the array is very important and represent
      // the position that will show in the grid
      columns: [
        { columnId: 'idd'},
        { columnId: 'id'},
        { columnId: 'disease'},
        { columnId: 'patd_year'},
        { columnId: 'patd_cmmt'},
        { columnId: 'traitement'}
      ],
    }
  };
  // this.codeService.getBy({ code_fldname: "pat_type" })
  // .subscribe((response: any) => (this.mvdataset = response.data));
  this.dataset = []

}

addNewItem() {
  this.gridService.addItem(
    {
     id: this.dataset.length + 1,
     disease: null,
     patd_type: null,
     patd_disease: null,
     patd_year: null,
     patd_cmmt: null 
    },
    { position: "bottom" }
  );
}

gridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
  this.dataView = angularGrid.dataView;
  this.grid = angularGrid.slickGrid;
  this.gridService = angularGrid.gridService;
}
//create form
createForm() {
  this.loadingSubject.next(false)

  this.patient = new Patient()
  
  this.patForm = this.patFB.group({
      pat_code: [this.patient.pat_code, Validators.required],
      pat_lname: [
          { value: this.patient.pat_lname, disabled: !this.isExist },
          Validators.required,
      ],
      pat_fname: [
        { value: this.patient.pat_fname, disabled: !this.isExist },
        Validators.required,
    ],
      
    pat_sex: [
      { value: this.patient.pat_sex, disabled: !this.isExist },
      Validators.required,
  ],
  pat_familysit: [
    { value: this.patient.pat_familysit, disabled: !this.isExist },
    Validators.required,
],

  pat_birth_date: [this.patient.pat_birth_date, Validators.required],

  pat_child_nbr: [{ value: this.patient.pat_child_nbr, disabled: !this.isExist }],

  pat_blood: [
    { value: this.patient.pat_blood, disabled: !this.isExist },
    Validators.required,
],

      

      pat_line1:  [{ value: this.patient.pat_line1, disabled: !this.isExist }, Validators.required,],
      pat_ss_id:  [{ value: this.patient.pat_ss_id, disabled: !this.isExist }, Validators.required,],
      pat_country: [{ value: this.patient.pat_country, disabled: !this.isExist }],
      pat_city: [{ value: this.patient.pat_city, disabled: !this.isExist }],
      
      pat_state: [{ value: this.patient.pat_state, disabled: !this.isExist }],

      pat_zip: [{ value: this.patient.pat_zip, disabled: !this.isExist }],
      pat_phone: [{ value: this.patient.pat_phone, disabled: !this.isExist }],
      pat_fax: [{ value: this.patient.pat_fax, disabled: !this.isExist }],
      pat_mail: [{ value: this.patient.pat_mail, disabled: !this.isExist }],
    
      // pat_job: [{ value: this.patient.pat_job, disabled: !this.isExist }],

     
      // pat_site:  [{ value: this.patient.pat_site, disabled: !this.isExist }],
     

      pat_contact_fname:  [{ value: this.patient.pat_contact_fname, disabled: !this.isExist }],
      pat_contact_lname:  [{ value: this.patient.pat_contact_lname, disabled: !this.isExist }],
      pat_contact_adress: [{ value: this.patient.pat_contact_adress, disabled: !this.isExist }],
      pat_contact_tel: [{ value: this.patient.pat_contact_tel, disabled: !this.isExist }],
      pat_parent_liaison: [{ value: this.patient.pat_parent_liaison, disabled: !this.isExist }],
      pat_ass: [{ value: this.patient.pat_ass, disabled: !this.isExist }],
    
  })
}

onChangeCode() {
  const controls = this.patForm.controls
  this.patientService
      .getBy({
            pat_code: controls.pat_code.value,
      })
      .subscribe((response: any) => {
          if (response.data.length) {
              this.isExist = true
              console.log(response.data.length)
          } else {
              controls.pat_lname.enable()
              controls.pat_fname.enable()
              controls.pat_sex.enable()
              controls.pat_familysit.enable()
              // controls.pat_job.enable()
             
              controls.pat_line1.enable()  
              controls.pat_ss_id.enable()
              controls.pat_country.enable()
              controls.pat_city.enable()
             
              controls.pat_state.enable()
              controls.pat_zip.enable()
              controls.pat_phone.enable()
              controls.pat_fax.enable()
              controls.pat_mail.enable()
              // controls.pat_site.enable()
              controls.pat_blood.enable()
              controls.pat_child_nbr.enable()
              controls.pat_contact_fname.enable()
              controls.pat_contact_lname.enable()
              controls.pat_contact_adress.enable()
              controls.pat_contact_tel.enable()
              controls.pat_parent_liaison.enable()
              controls.pat_ass.enable()
             
          }
   })
}

//reste form
reset() {
  this.patient = new Patient()
  this.createForm()
  this.hasFormErrors = false
  
}
// save data
onSubmit() {
  this.hasFormErrors = false
  
  const controls = this.patForm.controls
  /** check form */
  if (this.patForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      
      this.selectedTab = 0
      
      return
  }
  

  // tslint:disable-next-line:prefer-const
  let patient = this.prepareCode()

  for (let data of this.dataset) {
    console.log(this.dataset)
    delete data.id;
  
   
  }
  for (let dataset of this.datasettrait) {
   // console.log(this.datasettrait)
    delete dataset.id;
  
   
  }
  this.addPatient(patient,this.dataset,this.datasettrait)
  
}
/**
     * Returns object for saving
     */
    prepareCode(): Patient {
      const controls = this.patForm.controls
      const _patient = new Patient()
      _patient.pat_code = controls.pat_code.value
      _patient.pat_lname = controls.pat_lname.value
      _patient.pat_fname = controls.pat_fname.value
      _patient.pat_sex = controls.pat_sex.value
      _patient.pat_familysit = controls.pat_familysit.value
      // _patient.pat_job = controls.pat_job.value
      _patient.pat_birth_date = controls.pat_birth_date.value
      ? `${controls.pat_birth_date.value.year}/${controls.pat_birth_date.value.month}/${controls.pat_birth_date.value.day}`
      : null
     
      _patient.pat_line1 = controls.pat_line1.value
      
      _patient.pat_country = controls.pat_country.value
      _patient.pat_city = controls.pat_city.value
      
      _patient.pat_state = controls.pat_state.value
      _patient.pat_zip =  controls.pat_zip.value

      _patient.pat_phone = controls.pat_phone.value
      _patient.pat_fax = controls.pat_fax.value
      _patient.pat_mail = controls.pat_mail.value




      _patient.pat_ss_id = controls.pat_ss_id.value
      // _patient.pat_site = controls.pat_site.value
      
      _patient.pat_child_nbr = controls.pat_child_nbr.value
      _patient.pat_blood = controls.pat_blood.value
      _patient.pat_contact_fname = controls.pat_contact_fname.value
      _patient.pat_contact_lname = controls.pat_contact_lname.value
      _patient.pat_contact_adress = controls.pat_contact_adress.value
      _patient.pat_contact_tel = controls.pat_contact_tel.value
      _patient.pat_parent_liaison = controls.pat_parent_liaison.value
      _patient.pat_ass = controls.pat_ass.value

      return _patient
  }
  onChangeState() {
    const controls  = this.patForm.controls
  
    this.codeService
        .getBy({ code_fldname: "ad_city", chr01: controls.pat_state.value.substring(0, 2) })
        .subscribe((response: any) => {(this.pat_city = response.data)
        })    
}
/**
     * Add code
     *
     * @param _patient: EmployeModel
     */
    addPatient(_patient: Patient, details: any,traitdetails:any) {
      const controls = this.patForm.controls
      this.loadingSubject.next(true)
      console.log(details)
      this.patientService.add({ Patient: _patient,  patientDetail: details , patientDetailTreatment:traitdetails}).subscribe(
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
              this.reset()
              this.router.navigateByUrl("/patient/create-patient")
          }
      )
  }


 

 /**
     * Go back to the list
     *
     */
    goBack() {
      this.loadingSubject.next(false)
      const url = `/patient/list-patient`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }






  handleSelectedRowsChangedass(e, args) {
    const controls = this.patForm.controls;
    if (Array.isArray(args.rows) && this.gridObjass) {
        args.rows.map((idx) => {
            const item = this.gridObjass.getDataItem(idx)
            console.log(item)
            // TODO : HERE itterate on selected field and change the value of the selected field
                    controls.pat_ass.setValue(item.ass_code || "")
        })
    }
}
  angularGridReadyass(angularGrid: AngularGridInstance) {
    this.angularGridass = angularGrid
    this.gridObjass = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridass() {
  
  this.columnDefinitionsass= [
        {
          id: "id",
          field: "id",
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,

          minWidth: 50,
          maxWidth: 50,
        },
        
        {
            id: "ass_code",
            name: "Code Association",
            field: "ass_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "ass_name",
          name: "Nom",
          field: "ass_name",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      
        {
            id: "ass_contact_fname",
            name: "Contact Nom",
            field: "ass_contact_fname",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "ass_contact_lname",
          name: "Contact Prenom",
          field: "ass_contact_lname",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
        
    ]

    this.gridOptionsass = {
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
        // optionally change the column index position of the icon (defaults to 0)
        // columnIndexPosition: 1,

        // remove the unnecessary "Select All" checkbox in header when in single selection mode
        hideSelectAllCheckbox: true,

        // you can override the logic for showing (or not) the expand icon
        // for example, display the expand icon only on every 2nd row
        // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
      },
      multiSelect: false,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true,
      },
    }  

    // fill the dataset with your data
    this.associationService
        .getAll()
        .subscribe((response: any) => {this.dataass = response.data
        console.log(response.data)})
}
openass(content) {
   
    this.prepareGridass()
    this.modalService.open(content, { size: "xl" })
}

handleSelectedRowsChangedsite(e, args) {
  
  const controls = this.patForm.controls;
  if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
          const item = this.gridObjsite.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
                  controls.pat_site.setValue(item.si_site || "")
      })
  }
}
angularGridReadysite(angularGrid: AngularGridInstance) {
  this.angularGridsite = angularGrid
  this.gridObjsite = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridsite() {
  this.columnDefinitionssite = [
      {
          id: "id",
          field: "id",
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,

          minWidth: 50,
          maxWidth: 50,
      },
      {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
      },
      {
          id: "si_site",
          name: "Site",
          field: "si_site",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "si_desc",
          name: "Designation",
          field: "si_desc",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      
  ]

  this.gridOptionssite = {
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
      },
      multiSelect: false,
      rowSelectionOptions: {
          selectActiveRow: true,
      },
  }

  // fill the dataset with your data
  this.siteService
      .getAll()
      .subscribe((response: any) => (this.datasite = response.data))
}
opensite(contentsite, field) {
  this.selectedField = field
  this.prepareGridsite()
  this.modalService.open(contentsite, { size: "lg" })
}
onChangesite() {
  const controls = this.patForm.controls;
  const si_site = controls.pat_site.value;
  
  this.siteService.getByOne({ si_site }).subscribe(
    (res: any) => {

      if (!res.data) {

          alert("Site n'existe pas  ")
          controls.pat_site.setValue(null);
          document.getElementById("pat_site").focus();
        }
    
    });
}

// handleSelectedRowsChangedtrait(e, args) {
  
//   const controls = this.patForm.controls;
//   if (Array.isArray(args.rows) && this.gridObjtrait) {
//       args.rows.map((idx) => {
//           const item = this.gridObjtrait.getDataItem(idx)
//           // TODO : HERE itterate on selected field and change the value of the selected field
//                   controls.pat_trait.setValue(item.code_value || "")
//       })
//   }
// }
angularGridReadytrait(angularGrid: AngularGridInstance) {
  this.angularGridtrait = angularGrid
  this.gridObjtrait = (angularGrid && angularGrid.slickGrid) || {}
  this.dataViewtrait = angularGrid.dataView;
  this.gridtrait = angularGrid.slickGrid;
  this.gridServicetrait = angularGrid.gridService;
}

prepareGridtrait(disease) {
  this.columnDefinitionstrait = [
      /*{
          id: "id",
          field: "id",
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,

          minWidth: 50,
          maxWidth: 50,
      },
      {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
      },*/
      {
          id: "patdt_treatment",
          name: "Traitment",
          field: "patdt_treatment",
          type: FieldType.string,
          editor: {
            model: Editors.text,
          },
            
      },
      {
          id: "patdt_doc",
          name: "Médecin/Clinique",
          field: "patdt_doc",
          type: FieldType.string,
          editor: {
            model: Editors.text,
          },
            
      },

      {
        id: "patdt_cmmt",
        name: "Commentaire",
        field: "patdt_cmmt",
        type: FieldType.text,
        editor: {
          model: Editors.longText,
        },
        
  
      },
      
  ]

  this.gridOptionstrait = {
    asyncEditorLoading: false,
    editable: true,
    enableAutoResize:true,
    autoHeight:false,
    autoCommitEdit:true,
    // enableColumnPicker: true,
    enableCellNavigation: true,
    // enableRowSelection: true,
     
  }

  this.datatrait = this.datasettrait.filter(function(value, index, arr){ 
    return value.patdt_disease == disease;
  })
  // fill the dataset with your data
  // this.codeService
  //     .getBy ({code_fldname: "pat_trait"})
  //     .subscribe((response: any) => (this.datatrait = response.data))
}
opentrait(contenttrait) {
  
  this.prepareGridtrait(this.dis)
  this.modalService.open(contenttrait, { size: "lg" })
}

addNewTrait() {
  this.gridServicetrait.addItem(
    {
     id: this.datasettrait.length + 1,
     patdt_disease: this.dis,
     patdt_treatment: null,
     patdt_doc: null,
     patdt_cmmt: null,
     add : true,
    },
    { position: "bottom" }
  );
  
}
AddTrait() {
  for(let obj of this.datatrait) {
    if(obj.add == true) {
    this.datasettrait.push({
      id: this.datasettrait.length  + 1 ,
      patdt_disease: this.dis,
      patdt_treatment: obj.patdt_treatment,
      patdt_doc: obj.patdt_doc,
      patdt_cmmt : obj.patdt_cmmt,
      ad : false,

    })
  }
  
  this.modalService.dismissAll()
  }  
  console.log(this.datasettrait)
}
/**
     * Close alert
     *
     * @param $event
     */
 onAlertClose($event) {
  this.hasFormErrors = false
}

onChangeAss() {
  const controls = this.patForm.controls;
  const ass_code = controls.pat_ass.value;
  
  this.associationService.getByOne({ ass_code }).subscribe(
    (res: any) => {

      if (!res.data) {

          alert("Association n'existe pas  ")
          controls.pat_ass.setValue(null);
          document.getElementById("pat_ass").focus();
        }
    
    });
}

}
