import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"

// Angular slickgrid
import {
    Formatter,
    Editor,
    Editors,
    OnEventArgs,
    AngularGridInstance,
    Aggregators, 
    Column,
    DelimiterType, 
    FieldType,
    FileType,
    Filters,
    Formatters,
    GridOption,
    Grouping,
    GroupingGetterFunction,
    GroupTotalFormatters,
    SortDirectionNumber,
    Sorters,
    GridService,
    ColumnFilter,
    Filter,
    FilterArguments,
    FilterCallback,
    OperatorType,
    OperatorString,
    SearchTerm,
  } from "angular-slickgrid" 
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

import { Code, CodeService } from "../../../../core/erp"

@Component({
  selector: 'kt-provider-settings',
  templateUrl: './provider-settings.component.html',
  styleUrls: ['./provider-settings.component.scss']
})
export class ProviderSettingsComponent implements OnInit {

  code: Code
  codeForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  check_form: any[] = []
  isTerms: Boolean = false

  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  draggableGroupingPlugin: any;
  angularGrid: AngularGridInstance;

  grid: any;
  gridService: GridService;
  dataview: any;
 
  domain    : any;
  user : any;
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  gridObj: any;
  dataviewObj: any;


  constructor(
      config: NgbDropdownConfig,
      private codeFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private codeService: CodeService
  ) {
      config.autoClose = true
      this.codeService
      .getBy({ code_fldname: "check_form" })
      .subscribe((response: any) => (this.check_form = response.data))
  }
  ngOnInit(): void {
      this.loading$ = this.loadingSubject.asObservable()
      this.loadingSubject.next(false)
      this.createForm()
      this.prepareGrid()
     /* window.onload = () => {
        const lang = "fr"
        if ( lang == "fr") {
          this.onchangelabel() } else {
            
          }
      }*/
  }
 /* onchangelabel(){
      console.log("hhhhhhhhhhhhhhhlllllllllllllllllllllllllllllll")
            document.getElementById('fld').innerHTML = 'Couuuude';
          }*/
  //create form
  createForm() {
      this.loadingSubject.next(false)

      this.code = new Code()
      this.codeForm = this.codeFB.group({
          code_fldname: [this.code.code_fldname, Validators.required],
          code_value: [this.code.code_value, Validators.required],
          code_cmmt: [
              { value: this.code.code_cmmt, disabled: !this.isExist },
              Validators.required,
          ],
          code_desc: [{ value: this.code.code_desc, disabled: !this.isTerms}],
         dec01: [{ value: this.code.dec01, disabled: !this.isTerms }],
          
      })
  }
  onAlertClose($event) {
    this.hasFormErrors = false
}

  onChangeField(){
    const controls = this.codeForm.controls
    if(controls.code_fldname.value == 'vd_cr_terms') {
      this.isTerms = true
    controls.code_desc.enable()
    controls.dec01.enable()
    } else {
      this.isTerms = false
    controls.code_desc.disable()
    controls.dec01.disable()
    }
    this.codeService.getBy({code_fldname: controls.code_fldname.value}).subscribe(
        (response: any) => {
            this.dataset = response.data
            this.dataviewObj.setItems(this.dataset)
        },
        (error) => {
            this.dataset = []
        },
        () => {}
    )
  }
  onChangeCode() {
      const controls = this.codeForm.controls
      this.codeService
          .getBy({
              code_value: controls.code_value.value,
              code_fldname: controls.code_fldname.value,
          })
          .subscribe((response: any) => {
            console.log(response.data)
              if (response.data.length!=0) {
                  this.isExist = true
                  
                  this.hasFormErrors = true;
                  controls.code_cmmt.setValue(null)
                  controls.code_cmmt.disable()
                  return;
              } else {
                 
                  controls.code_cmmt.enable()
                
                 
              }
          })
  }
  //reste form
  reset() {
      this.code = new Code()
      this.createForm()
      this.dataset=[]
      this.hasFormErrors = false
  }
  // save data
  onSubmit() {
      this.hasFormErrors = false
      const controls = this.codeForm.controls
      /** check form */
      if (this.codeForm.invalid) {
          Object.keys(controls).forEach((controlName) =>
              controls[controlName].markAsTouched()
          )

          this.hasFormErrors = true
          return
      }

      // tslint:disable-next-line:prefer-const
      let address = this.prepareCode()
      this.addCode(address)
  }
  /**
   * Returns object for saving
   */
  prepareCode(): Code {
      const controls = this.codeForm.controls
      const _code = new Code()
      _code.code_fldname = controls.code_fldname.value
      _code.code_value = controls.code_value.value
      _code.code_cmmt = controls.code_cmmt.value
      _code.code_desc = controls.code_desc.value
      _code.dec01 = controls.dec01.value
     
      return _code
  }
  /**
   * Add code
   *
   * @param _code: CodeModel
   */
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
              this.reset()
          }
      )
  }

  /**
   * Go back to the list
   *
   */
  goBack() {
      this.loadingSubject.next(false)
      const url = `/code-mstr/codes-list`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid; // grid object
    this.dataviewObj = angularGrid.dataView;
    this.gridService = angularGrid.gridService;
      this.grid = angularGrid.slickGrid; // grid object
      this.dataview = angularGrid.dataView;
    
  }

prepareGrid() {

  this.columnDefinitions = [
    
  
        {
      id: "code_fldname",
      name: "Champ",
      field: "code_fldname",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      filter: {
        collection: [ { value: 'vd_type', label: 'Type' }, { value: 'vd_shipvia', label: 'Mode Expédition' }, { value: 'vd_promo', label: 'Groupe Promotion' },{ value: 'vd_lang', label: 'Langue' }, { value: 'check_form', label: 'Mode de Paiement' },{ value: 'vd_cr_terms', label: 'Délai de Paiement' },{ value: 'vd_sort', label: 'Activitée' },{ value: 'bank', label: 'Banque' } ],
        model: Filters.multipleSelect,
 
        // you can add "multiple-select" plugin options like styling the first row
        // previously known as `filterOptions` for < 9.0
       
 
        // you can also add an optional placeholder
        placeholder: 'Choisir Paramétre'
    },
   
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
      name: "Désignation",
      field: "code_cmmt",
      sortable: true,
      width: 200,
      filterable: true,
      type: FieldType.string,
   
  },
  {
      id: "code_desc",
      name: "Usage",
      field: "code_desc",
      sortable: true,
      width: 200,
      filterable: true,
      type: FieldType.string,
      
  },
  
  {
      id: "dec01",
      name: "Délai",
      field: "dec01",
      sortable: true,
      width: 80,
      filterable: true,
      type: FieldType.float,
  },
  
      
       
     
  ]

  this.gridOptions = {
     /* autoResize: {
        containerId: 'demo-container',
        sidePadding: 10
      },*/
   
      enableFiltering: true,
      enableSorting: true,
      enableAutoResize: true,
      exportOptions: {
        sanitizeDataExport: true
      },
     
  }

  // fill the dataset with your data
 
}
}
