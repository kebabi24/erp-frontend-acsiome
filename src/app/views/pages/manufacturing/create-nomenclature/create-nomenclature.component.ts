import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig, NgbModal, } from "@ng-bootstrap/ng-bootstrap"

// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Editor,
    Editors,
    AngularGridInstance,
    FieldType,
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

import {CodeService, Bom, BomService, MesureService, } from "../../../../core/erp"

@Component({
  selector: 'kt-create-nomenclature',
  templateUrl: './create-nomenclature.component.html',
  styleUrls: ['./create-nomenclature.component.scss']
})
export class CreateNomenclatureComponent implements OnInit {
    
  bom: Bom
  bomForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  data: [];
  columnDefinitions3: Column[] = [];
  gridOptions3: GridOption = {};
  gridObj3: any;
  angularGrid3: AngularGridInstance;
  selectedField = "";
  fieldcode = "";
error = false;
  constructor(
      config: NgbDropdownConfig,
      private bomFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private bomService: BomService,
      private codeService: CodeService,
      private modalService: NgbModal,
      private mesureService: MesureService,
  ) {
      config.autoClose = true
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.createForm()
}
//create form
createForm() {
  this.loadingSubject.next(false)

  this.bom = new Bom()
  this.bomForm = this.bomFB.group({
      bom_parent: [this.bom.bom_parent, Validators.required],
      bom_desc: [
          { value: this.bom.bom_desc, disabled: !this.isExist },
         Validators.required,
      ],
      bom_batch: [{ value: this.bom.bom_batch, disabled: !this.isExist }],
      bom_batch_um: [{ value: this.bom.bom_batch_um, disabled: !this.isExist }],
      bom_formula: [{ value: this.bom.bom_formula, disabled: !this.isExist }],
      bom_rmks: [{ value: this.bom.bom_rmks, disabled: !this.isExist }],
      bom__chr01: [{ value: this.bom.bom__chr01, disabled: !this.isExist }],
  })
}

onChangeCode() {
  const controls = this.bomForm.controls
  this.bomService
      .getBy({
            bom_parent: controls.bom_parent.value,
      })
      .subscribe((response: any) => {
          console.log(response.data)
          if (response.data) {
              this.isExist = true
              console.log(response.data.length)
          } else {
              controls.bom_desc.enable()
              controls.bom_batch.enable()
              controls.bom_batch_um.enable()
              controls.bom_formula.enable()
              controls.bom_rmks.enable()

          }
   })
}
//reste form
reset() {
  this.bom = new Bom()
  this.createForm()
  this.hasFormErrors = false
}
// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.bomForm.controls
  /** check form */
  if (this.bomForm.invalid) {
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
    prepareCode(): Bom {
      const controls = this.bomForm.controls
      const _bom = new Bom()
      _bom.bom_parent = controls.bom_parent.value
      _bom.bom_desc = controls.bom_desc.value
      _bom.bom_batch = controls.bom_batch.value
      _bom.bom_batch_um = controls.bom_batch_um.value
      _bom.bom_formula = controls.bom_formula.value
      _bom.bom_rmks = controls.bom_rmks.value
      return _bom
  }
/**
     * Add code
     *
     * @param _bom: DeviseModel
     */
    addCode(_bom: Bom) {
        const controls = this.bomForm.controls;
      this.loadingSubject.next(true)
      this.bomService.add(_bom).subscribe(
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
              const bom_parent = controls.bom_parent.value
              
              this.router.navigateByUrl(`/manufacturing/edit-ps/${bom_parent}`)
          }
      )
  }


 /**
     * Go back to the list
     *
     */
    goBack() {
      this.loadingSubject.next(false)
      const url = `/manufacturing/codes-list`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }

  angularGridReady3(angularGrid: AngularGridInstance) {
    this.angularGrid3 = angularGrid;
    this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid3() {
    this.columnDefinitions3 = [
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
        id: "code_fldname",
        name: "Champs",
        field: "code_fldname",
        sortable: true,
        filterable: true,
        type: FieldType.string,
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
      checkboxSelector: {},
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };

    // fill the dataset with your data
    this.codeService
      .getBy({ code_fldname: 'pt_um' })
      .subscribe((response: any) => (this.data = response.data));
  }
  open3(content, field) {
    this.selectedField = field;
    this.prepareGrid3();
    this.modalService.open(content, { size: "lg" });
  }
  handleSelectedRowsChanged3(e, args) {
    const controls = this.bomForm.controls;
   

    if (Array.isArray(args.rows) && this.gridObj3) {
      args.rows.map((idx) => {
        const item = this.gridObj3.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        controls.bom_batch_um.setValue(item.code_value)
      });
    }
  }
  changeUm() {
    const controls = this.bomForm.controls; // chof le champs hada wesh men form rah
    const um_um = controls.bom_batch_um.value;
    this.mesureService.getBy({ um_um }).subscribe(
      (res: any) => {
        const { data } = res;
        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "cette unite de mesure n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
        } else {
          this.error = false;
        }
      },
      (error) => console.log(error)
    );
  }
}
