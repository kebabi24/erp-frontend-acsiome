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

import { Doctor, DoctorService, CodeService,UsersService} from "../../../../core/erp"
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { array } from "@amcharts/amcharts4/core";
const API_URL = environment.apiUrl + "/codes"
@Component({
  selector: 'kt-create-doctor',
  templateUrl: './create-doctor.component.html',
  styleUrls: ['./create-doctor.component.scss']
})
export class CreateDoctorComponent implements OnInit {

  
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>


  doctor: Doctor;
  docForm: FormGroup
  hasFormErrors = false
  hasEmployeErrors = false
  isExist = false
  
  error = false
  field = ""
  selectedTab = 0
  
  
   
    hasEmployeFormErrors = false

  // grid options
  
  data: [];
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  gridObj: any;
  angularGrid: AngularGridInstance;
  
  data1: [];
  columnDefinitions1: Column[] = [];
  gridOptions1: GridOption = {};
  gridObj1: any;
  angularGrid1: AngularGridInstance;
  gridService1: GridService;

    doc_city: any[] = []
    doc_state: any[] = []
    doc_county: any[] = []
    doc_country: any[] = []
    row_number;
    httpOptions = this.httpUtils.getHTTPHeaders()
    leveljbd = [];
  leveljob = []
  constructor(
      config: NgbDropdownConfig,
      private docFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public  dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private modalService: NgbModal,
      private doctorService: DoctorService,
      private codeService: CodeService,
      private http: HttpClient,
      private httpUtils: HttpUtilsService,
      private userService: UsersService,
    
      
  ) {
      config.autoClose = true
      this.codeService
      .getBy({ code_fldname: "ad_state" })
      .subscribe((response: any) => (this.doc_state = response.data))
      this.codeService
      .getBy({ code_fldname: "ad_country" })
      .subscribe((response: any) => (this.doc_country = response.data))
  this.codeService
      .getBy({ code_fldname: "ad_county" })
      .subscribe((response: any) => (this.doc_county = response.data))
      this.codeService
      .getBy({ code_fldname: "ad_city" })
      .subscribe((response: any) => (this.doc_city = response.data))
  

  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.createForm()
}
//create form
createForm() {
  this.loadingSubject.next(false)

  this.doctor = new Doctor()
  
  this.docForm = this.docFB.group({
      doc_code: [this.doctor.doc_code, Validators.required],
      doc_name: [
          { value: this.doctor.doc_name, disabled: !this.isExist },
          Validators.required,
      ],
      doc_spec:  [{ value: this.doctor.doc_spec, disabled: !this.isExist }],
      doc_line1:  [{ value: this.doctor.doc_line1, disabled: !this.isExist }, Validators.required,],
      doc_country: [{ value: this.doctor.doc_country, disabled: !this.isExist }],
      doc_city: [{ value: this.doctor.doc_city, disabled: !this.isExist }],
      
      doc_state: [{ value: this.doctor.doc_state, disabled: !this.isExist }],

      doc_zip: [{ value: this.doctor.doc_zip, disabled: !this.isExist }],
      doc_phone: [{ value: this.doctor.doc_phone, disabled: !this.isExist }],
      doc_fax: [{ value: this.doctor.doc_fax, disabled: !this.isExist }],
      doc_mail: [{ value: this.doctor.doc_mail, disabled: !this.isExist }],
    
   
     

  })
}

onChangeCode() {
  const controls = this.docForm.controls
  this.doctorService
      .getBy({
            doc_code: controls.doc_code.value,
      })
      .subscribe((response: any) => {
          if (response.data.length) {
              this.isExist = true
              console.log(response.data.length)
          } else {
              controls.doc_name.enable()
             
              controls.doc_line1.enable()  
              controls.doc_country.enable()
              controls.doc_city.enable()
              controls.doc_state.enable()
              controls.doc_zip.enable()
              controls.doc_phone.enable()
              controls.doc_fax.enable()
              controls.doc_mail.enable()
              // controls.doc_site.enable()
             
          }
   })
}

//reste form
reset() {
  this.doctor = new Doctor()
  this.createForm()
  this.hasFormErrors = false
  
}
// save data
onSubmit() {
  this.hasFormErrors = false
  
  const controls = this.docForm.controls
  /** check form */
  if (this.docForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      
      this.selectedTab = 0
      
      return
  }
  

  // tslint:disable-next-line:prefer-const
  let doc = this.prepareCode()

  
  this.addDoctor(doc)
  
}
/**
     * Returns object for saving
     */
    prepareCode(): Doctor {
      const controls = this.docForm.controls
      const _doctor = new Doctor()
      _doctor.doc_code = controls.doc_code.value
      _doctor.doc_name = controls.doc_name.value
      _doctor.doc_spec = controls.doc_spec.value
      _doctor.doc_line1 = controls.doc_line1.value
      
      _doctor.doc_country = controls.doc_country.value
      _doctor.doc_city = controls.doc_city.value
      
      _doctor.doc_state = controls.doc_state.value
      _doctor.doc_zip =  controls.doc_zip.value

      _doctor.doc_phone = controls.doc_phone.value
      _doctor.doc_fax = controls.doc_fax.value
      _doctor.doc_mail = controls.doc_mail.value




      
      return _doctor
  }
  onChangeState() {
    const controls  = this.docForm.controls
  
    this.codeService
        .getBy({ code_fldname: "ad_city", chr01: controls.doc_state.value.substring(0, 2) })
        .subscribe((response: any) => {(this.doc_city = response.data)
        })    
}
/**
     * Add code
     *
     
     */
    addDoctor(_doctor: Doctor) {
      const controls = this.docForm.controls
      this.loadingSubject.next(true)
      
      this.doctorService.add( _doctor ).subscribe(
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
              this.router.navigateByUrl("/patient/create-doctor")
          }
      )
  }


 

 /**
     * Go back to the list
     *
     */
    goBack() {
      this.loadingSubject.next(false)
      const url = `/patient/list-doctor`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }






/**
     * Close alert
     *
     * @param $event
     */
 onAlertClose($event) {
  this.hasFormErrors = false
}

handleSelectedRowsChanged(e, args) {
  const controls = this.docForm.controls;
  if (Array.isArray(args.rows) && this.gridObj) {
    args.rows.map((idx) => {
      const item = this.gridObj.getDataItem(idx);
      // TODO : HERE itterate on selected field and change the value of the selected field
          controls.doc_spec.setValue(item.code_value || "");
     
    });
  }
}

angularGridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
  this.gridObj = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGrid() {
  this.columnDefinitions = [
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
      id: "code_value",
      name: "Code",
      field: "code_value",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "code_cmmt",
      name: "Description",
      field: "code_cmmt",
      sortable: true,
      width: 200,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptions = {
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
    checkboxSelector: {},
    multiSelect: false,
    rowSelectionOptions: {
      selectActiveRow: true,
    },
  };

  // fill the dataset with your data
  this.codeService
    .getBy({ code_fldname: "doc_spec" })
    .subscribe((response: any) => (this.data = response.data));
}
openSpec(content) {
  this.prepareGrid();
  this.modalService.open(content, { size: "lg" });
}



handleSelectedRowsChanged1(e, args) {
  const controls = this.docForm.controls;
  if (Array.isArray(args.rows) && this.gridObj1) {
    args.rows.map((idx) => {
      const item = this.gridObj1.getDataItem(idx);
      console.log("hnahnahna",item)
      // TODO : HERE itterate on selected field and change the value of the selected field
          controls.doc_spec.setValue(item.code_value || "");
     
    });
  }
}

angularGridReady1(angularGrid: AngularGridInstance) {
  this.angularGrid1 = angularGrid;
  this.gridObj1 = (angularGrid && angularGrid.slickGrid) || {};
  this.gridService1 = angularGrid.gridService;
}

prepareGrid1() {
  this.columnDefinitions1 = [
    {
      id: "id",
      field: "id",
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,

      minWidth: 50,
      maxWidth: 50,
    },
    // {
    //   id: "id",
    //   name: "id",
    //   field: "id",
    //   sortable: true,
    //   minWidth: 80,
    //   maxWidth: 80,
    // },
    {
      id: "code_value",
      name: "Code",
      field: "code_value",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      },
    },
    {
      id: "code_cmmt",
      name: "Description",
      field: "code_cmmt",
      sortable: true,
      width: 200,
      
      filterable: true,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      },
    },
  ];

  this.gridOptions1 = {
    enableSorting: true,
    enableCellNavigation: true,
    enableExcelCopyBuffer: true,
    enableFiltering: true,
    editable:true,
    autoEdit: false,
    autoHeight: false,
    frozenColumn: 0,
    frozenBottom: true,
    enableRowSelection: true,
    enableCheckboxSelector: true,
    checkboxSelector: {},
    multiSelect: false,
    rowSelectionOptions: {
      selectActiveRow: true,
    },
  };

  // fill the dataset with your data
  this.codeService
    .getBy({ code_fldname: "doc_spec" })
    .subscribe((response: any) => (this.data1 = response.data));
}

addSpec(content) {
  this.prepareGrid1();
  this.modalService.open(content, { size: "lg" });
}

addNewItem(){
  const newId = this.data1.length+1;

  const newItem = {
    id: newId,
    code_value: null,
    code_cmmt: null,
    new: true,
  };
  this.gridService1.addItem(newItem, { position: "bottom" });
}
AddCode() {
  this.loadingSubject.next(true)
  this.codeService.addCode({detail: this.data1}).subscribe(
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
          this.reset()
      }
  )

}
changeSpec(){
  const controls = this.docForm.controls
  
  
  this.codeService
      .getByOne({ code_fldname: "doc_spec", code_value: controls.doc_spec.value })
      .subscribe((response: any) => {

        if (!response.data) {

          alert("Specialité  n'existe pas  ")
          controls.doc_spec.setValue(null);
          document.getElementById("doc_spec").focus();
        }
    
    });

 
}
}
