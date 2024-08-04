import { Component, OnInit } from "@angular/core"

import {
  NgbDropdownConfig,
  NgbTabChangeEvent,
  NgbTabsetConfig,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap"

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

import { Financialcharge, FinancialchargeService, CodeService } from "../../../../core/erp"
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  FieldType, GridService, complexObjectFormatter
} from "angular-slickgrid"



@Component({
  selector: 'kt-edit-fc',
  templateUrl: './edit-fc.component.html',
  styleUrls: ['./edit-fc.component.scss']
})
export class EditFcComponent implements OnInit {
  financialcharge: Financialcharge
  fcFORM: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  data: []
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  gridObj: any
  angularGrid: AngularGridInstance
  error = false;
  fcEdit: any
  title: String = 'Modifier Charge - '

  constructor(
      config: NgbDropdownConfig,
      private fcFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private codeService: CodeService,
      private financialchargeService: FinancialchargeService,
      private modalService: NgbModal,
  ) {
      config.autoClose = true
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(true)
    this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.financialchargeService.getOne(id).subscribe((response: any)=>{
          this.fcEdit = response.data
          console.log(this.fcEdit)
          this.initCode()
          this.loadingSubject.next(false)
          this.title = this.title + this.fcEdit.fc_code
        })
    })
  }

  // init code
  initCode() {
    this.createForm()
    this.loadingSubject.next(false)
  }
//create form
createForm() {
  this.loadingSubject.next(false)

  this.financialcharge = new Financialcharge()
  this.fcFORM = this.fcFB.group({
      fc_code: [this.fcEdit.fc_code],
      fc_desc: [
          this.fcEdit.fc_desc,
          Validators.required,
      ],
      fc_type: [this.fcEdit.fc_type],
  })
}



//reste form
reset() {
  this.financialcharge = new Financialcharge()
  this.createForm()
  this.hasFormErrors = false
}
// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.fcFORM.controls
  /** check form */
  if (this.fcFORM.invalid) {
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
    prepareCode(): Financialcharge {
      const controls = this.fcFORM.controls
      const _financialcharge = new Financialcharge()
      _financialcharge.fc_code = controls.fc_code.value
      _financialcharge.fc_desc = controls.fc_desc.value
      _financialcharge.fc_type = controls.fc_type.value
      return _financialcharge
  }
/**
     * Add code
     *
     * @param _financialcharge: DeviseModel
     */
    addCode(_financialcharge: Financialcharge) {
      this.loadingSubject.next(true)
      this.financialchargeService.update(this.fcEdit.id, _financialcharge).subscribe(
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
              this.router.navigateByUrl("/financialcharge/update-fc")
          }
      )
  }


 /**
     * Go back to the list
     *
     */
    goBack() {
      this.loadingSubject.next(false)
      const url = `/financialcharge/create-fc`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }


  handleSelectedRowsChanged(e, args) {
    const controls = this.fcFORM.controls
    
    if (Array.isArray(args.rows) && this.gridObj) {
        args.rows.map((idx) => {
            const item = this.gridObj.getDataItem(idx)
            // TODO : HERE itterate on selected field and change the value of the selected field
           
                    controls.fc_type.setValue(item.code_value || "")
        
           
        })
    }
  }
  
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid
    this.gridObj = (angularGrid && angularGrid.slickGrid) || {}
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
    ]
  
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
        checkboxSelector: {
        },
        multiSelect: false,
        rowSelectionOptions: {
            selectActiveRow: true,
        },
    }
  
    // fill the dataset with your data
    this.codeService
        .getBy({ code_fldname: 'fc_type' })
        .subscribe((response: any) => (this.data = response.data))
  }

  open(content) {
    this.prepareGrid()
    this.modalService.open(content, { size: "lg" })
  }
  onAlertClose($event) {
    this.hasFormErrors = false;
  }
  onChangeType() {
    const controls = this.fcFORM.controls
    this.codeService
        .getByOne({
              code_fldname: "fc_type", code_value:controls.fc_type.value,
        })
        .subscribe((resp: any) => {
            console.log(resp.data)
            if (!resp.data) {
              alert("Type n'existe pas")
              document.getElementById("fc_type").focus();
              controls.fc_type.setValue(null)
            }
  })
}
}