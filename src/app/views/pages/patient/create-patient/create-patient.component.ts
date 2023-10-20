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
    
    datashift: []
    columnDefinitionsshift: Column[] = []
    gridOptionsshift: GridOption = {}
    gridObjshift: any
    angularGridshift: AngularGridInstance


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

    jbangularGrid: AngularGridInstance;
    jbgrid: any;
    jbgridService: GridService;
    jbdataView: any;
    jbcolumnDefinitions: Column[];
    jbgridOptions: GridOption;
    dataset: any[];

    pat_city: any[] = []
    pat_state: any[] = []
    pat_county: any[] = []
    pat_country: any[] = []
    row_number;
    httpOptions = this.httpUtils.getHTTPHeaders()
    leveljbd = [];
    leveljob = []
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
    this.initjbGrid()
}
initjbGrid() {
  this.jbcolumnDefinitions = [
    {
      id: "id",
      field: "id",
      excludeFromHeaderMenu: true,
      formatter: Formatters.deleteIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          this.jbangularGrid.gridService.deleteItem(args.dataContext);
        }
      },
    
    },
    {
      id: "patd_type",
      name: "Tytpe",
      field: "patd_type",
      sortable: true,
      width: 50,
      filterable: false,
      type: FieldType.string,
    
      
      editor: {
          model: Editors.singleSelect,

          // We can also add HTML text to be rendered (any bad script will be sanitized) but we have to opt-in, else it will be sanitized
          enableRenderHtml: true,
          collectionAsync:  this.http.get(`${API_URL}/pathotype`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
       /*   customStructure: {    
            value: 'code_value',
            label: 'code_cmmt',
            optionLabel: 'code_value', // if selected text is too long, we can use option labels instead
            //labelSuffix: 'text',
         },*/
          editorOptions: {
            maxHeight: 400
          }
        },
    },

   
    {
      id: "patd_disease",
      name: "Maladie",
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
      width: 50,
      filterable: false,
      type: FieldType.text,
      
      editor: {
        model: Editors.longText,
      },
      

    },
    
  ];

  this.jbgridOptions = {
   
    asyncEditorLoading: false,
    editable: true,
    enableAutoResize:true,
    autoHeight:false,
    enableColumnPicker: true,
    enableCellNavigation: true,
    enableRowSelection: true,
  };
  // this.codeService.getBy({ code_fldname: "pat_type" })
  // .subscribe((response: any) => (this.mvdataset = response.data));
  this.dataset = []

}

addNewItem() {
  this.jbgridService.addItem(
    {
      id: this.dataset.length + 1,
     
     patd_type: null,
     patd_disease: null,
     patd_year: null,
     patd_cmmt: null 
    },
    { position: "bottom" }
  );
}

jbGridReady(angularGrid: AngularGridInstance) {
  this.jbangularGrid = angularGrid;
  this.jbdataView = angularGrid.dataView;
  this.jbgrid = angularGrid.slickGrid;
  this.jbgridService = angularGrid.gridService;
}
mvGridReady(angularGrid: AngularGridInstance) {
  this.mvangularGrid = angularGrid;new Patient
  this.mvdataView = angularGrid.dataView;
  this.mvgrid = angularGrid.slickGrid;
  this.mvgridService = angularGrid.gridService;
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
  
  this.addPatient(patient,this.dataset)
  
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
    addPatient(_patient: Patient, details: any) {
      const controls = this.patForm.controls
      this.loadingSubject.next(true)
      console.log(details)
      this.patientService.add({ Patient: _patient,  patientDetail: details }).subscribe(
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

handleSelectedRowsChangedshift(e, args) {
  
  const controls = this.patForm.controls;
  if (Array.isArray(args.rows) && this.gridObjshift) {
      args.rows.map((idx) => {
          const item = this.gridObjshift.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
                  controls.pat_shift.setValue(item.code_value || "")
      })
  }
}
angularGridReadyshift(angularGrid: AngularGridInstance) {
  this.angularGridshift = angularGrid
  this.gridObjshift = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridshift() {
  this.columnDefinitionsshift = [
      /*{
          id: "id",
          field: "id",
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,

          minWidth: 50,
          maxWidth: 50,
      },*/
      {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
      },
      {
          id: "code_value",
          name: "Code Equipe",
          field: "code_value",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "code_cmmt",
          name: "Designation",
          field: "code_cmmt",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      
  ]

  this.gridOptionsshift = {
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
  this.codeService
      .getBy ({code_fldname: "pat_shift"})
      .subscribe((response: any) => (this.datashift = response.data))
}
openshift(contentshift) {
  
  this.prepareGridshift()
  this.modalService.open(contentshift, { size: "lg" })
}
onChangeshift() {
  const controls = this.patForm.controls;
  
  this.codeService.getBy({ code_fldname: "pat_shift", code_value : controls.pat_shift.value}).subscribe(
    (res: any) => {
console.log(res.data)
      if (res.data.length == 0) {

          alert("Equipe n'existe pas  ")
          controls.pat_shift.setValue(null);
          document.getElementById("pat_shift").focus();
        }
    
    });
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
