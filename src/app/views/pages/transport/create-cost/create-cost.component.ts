import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"


import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  EditorValidator,
  EditorArgs,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
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
import {
  NgbModal,
 
} from "@ng-bootstrap/ng-bootstrap"
import { Transportcost, TransportcostService, AccountService, TaxeService,ProjectService } from "../../../../core/erp"

@Component({
  selector: 'kt-create-cost',
  templateUrl: './create-cost.component.html',
  styleUrls: ['./create-cost.component.scss']
})
export class CreateCostComponent implements OnInit {
  transportcost: Transportcost
  trcForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

  datatax: []
  columnDefinitionstax: Column[] = []
  gridOptionstax: GridOption = {}
  gridObjtax: any
  angularGridtax: AngularGridInstance

  pms: [];
  columnDefinitionspm: Column[] = [];
  gridOptionspm: GridOption = {};
  gridObjpm: any;
  angularGridpm: AngularGridInstance;

  
  accounts: []
    columnDefinitionsacct: Column[] = []
    gridOptionsacct: GridOption = {}
    gridObjacct: any
    angularGridacct: AngularGridInstance

  constructor(
      config: NgbDropdownConfig,
      private trcFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private modalService: NgbModal,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private accountService: AccountService,
      private projectService: ProjectService,
      private taxService: TaxeService,
      private transportcostService: TransportcostService
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

 this.transportcost = new Transportcost()
  this.trcForm = this.trcFB.group({
     trc_code: [this.transportcost.trc_code, Validators.required],
     trc_desc: [
          { value:this.transportcost.trc_desc, disabled: !this.isExist },
          Validators.required,
      ],
     trc_acct: [{ value:this.transportcost.trc_acct, disabled: !this.isExist }],
     trc_project: [{ value:this.transportcost.trc_project, disabled: !this.isExist }],
     trc_taxc: [{ value:this.transportcost.trc_taxc, disabled: !this.isExist }],
     
     trc_taxable: [{ value:this.transportcost.trc_taxable, disabled: !this.isExist }],
     trc_disc: [{ value:this.transportcost.trc_disc, disabled: !this.isExist }],
  })
}

onChangeCode() {
  const controls = this.trcForm.controls
 this.transportcostService
      .getByOne({
           trc_code: controls.trc_code.value,
      })
      .subscribe((response: any) => {
          console.log(response.data)
          if (response.data) {
              this.isExist = true
              console.log(response.data.length)
          } else {
              controls.trc_desc.enable()
              controls.trc_project.enable()
              controls.trc_acct.enable()
              controls.trc_taxable.enable()
              controls.trc_taxc.enable()
              controls.trc_disc.enable()
              document.getElementById("trc_desc").focus(); 
          }
   })
}
//reste form
reset() {
 this.transportcost = new Transportcost()
  this.createForm()
  this.hasFormErrors = false
}
// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.trcForm.controls
  /** check form */
  if (this.trcForm.invalid) {
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
    prepareCode(): Transportcost {
      const controls = this.trcForm.controls
      const _transportcost = new Transportcost()
      _transportcost.trc_code = controls.trc_code.value
      _transportcost.trc_desc = controls.trc_desc.value
      _transportcost.trc_acct = controls.trc_acct.value
      _transportcost.trc_project = controls.trc_project.value
      _transportcost.trc_taxable = controls.trc_taxable.value
      _transportcost.trc_taxc = controls.trc_taxc.value
      _transportcost.trc_disc = controls.trc_disc.value
      return _transportcost
  }
/**
     * Add code
     *
     * @param _transportcost: DeviseModel
     */
    addCode(_transportcost: Transportcost) {
      this.loadingSubject.next(true)
     this.transportcostService.add(_transportcost).subscribe(
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
              this.router.navigateByUrl("/transport/create-cost")
          }
      )
  }


 /**
     * Go back to the list
     *
     */
    goBack() {
      this.loadingSubject.next(false)
      const url = `/transport/create-cost`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }

  onChangePM(){
    const controls = this.trcForm.controls // chof le champs hada wesh men form rah
    const pm_code  = controls.trc_project.value ;      
    this.projectService
    .getBy({pm_code}).subscribe((res:any)=>{
      console.log(res.data)
     if (!res.data.project) {
       alert("Projet n'existe pas")
      controls.trc_project.setValue(null)
      document.getElementById("trc_project").focus(); 

     }
        })
  
  
  
  }
  onChangeTax(){
    const controls = this.trcForm.controls // chof le champs hada wesh men form rah
    const tx2_tax_code  = controls.trc_taxc.value ;      
    this.taxService
    .getBy({tx2_tax_code}).subscribe((res:any)=>{
      console.log(res.data)
      if (!res.data) {
        alert("Taxe n'existe pas")
        controls.trc_taxc.setValue(null)
        document.getElementById("trc_taxc").focus(); 
  
       }
            
        })
  
  
  
  }
  onChangeAcct(){
    const controls = this.trcForm.controls // chof le champs hada wesh men form rah
    const ac_code  = controls.trc_acct.value ;      
    this.accountService
    .getBy({ac_code}).subscribe((res:any)=>{
     console.log(res.data)
      if (!res.data) {
        alert("Compte n'existe pas")
        controls.trc_acct.setValue(null)
        document.getElementById("trc_acct").focus(); 
  
       }
            
        })
  
  
  
  
  }
  handleSelectedRowsChangedtax(e, args) {
    const controls = this.trcForm.controls
    if (Array.isArray(args.rows) && this.gridObjtax) {
        args.rows.map((idx) => {
            const item = this.gridObjtax.getDataItem(idx)
            controls.trc_taxc.setValue(item.tx2_tax_code || "")
        })
    }
}

  angularGridReadytax(angularGrid: AngularGridInstance) {
    this.angularGridtax = angularGrid
    this.gridObjtax = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridtax() {
    this.columnDefinitionstax = [
        {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
        },
        {
            id: "tx2_tax_code",
            name: "code ",
            field: "tx2_tax_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "tx2_tax_pct",
          name: "Taux Taxe ",
          field: "tx2_tax_pct",
          sortable: true,
          filterable: true,
          type: FieldType.float,
      },
        {
            id: "tx2_desc",
            name: "Designation",
            field: "tx2_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "tx2_tax_type",
            name: "Type Taxe",
            field: "tx2_tax_type",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
    ]

    this.gridOptionstax = {
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
    this.taxService
        .getAll()
        .subscribe((response: any) => (this.datatax = response.data))
}
opentax(contenttax) {
    this.prepareGridtax()
    this.modalService.open(contenttax, { size: "lg" })
}



handleSelectedRowsChangedpm(e, args) {
 
  const controls = this.trcForm.controls;

  
  if (Array.isArray(args.rows) && this.gridObjpm) {
    args.rows.map((idx) => {
      const item = this.gridObjpm.getDataItem(idx);
      controls.trc_project.setValue(item.pm_code || "");

    });
  }
}

angularGridReadypm(angularGrid: AngularGridInstance) {
  this.angularGridpm = angularGrid;
  this.gridObjpm = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridpm() {
  this.columnDefinitionspm = [
    {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
    },
    {
        id: "pm_code",
        name: "Code Projet",
        field: "pm_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
    },
    {
        id: "pm_desc",
        name: "Designation",
        field: "pm_desc",
        sortable: true,
        width: 120,
        filterable: true,
        type: FieldType.string,
    },
    {
      id: "pm_cust",
      name: "Client",
      field: "pm_cust",
      sortable: true,
      width: 80,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptionspm = {
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
  };

  // fill the dataset with your data
  this.projectService
    .getAll()
    .subscribe((response: any) => (this.pms = response.data));
}
openpm(content) {
  this.prepareGridpm();
  this.modalService.open(content, { size: "lg" });
}

handleSelectedRowsChangedacct(e, args) {
  const controls = this.trcForm.controls
  if (Array.isArray(args.rows) && this.gridObjacct) {
      args.rows.map((idx) => {
          const item = this.gridObjacct.getDataItem(idx)
          controls.trc_acct.setValue(item.ac_code || "")
      })
  }
}

  angularGridReadyacct(angularGrid: AngularGridInstance) {
    this.angularGridacct = angularGrid
    this.gridObjacct = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridacct() {
    this.columnDefinitionsacct = [
        {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
        },
        {
            id: "ac_code",
            name: "code ",
            field: "ac_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "ac_desc",
            name: "Description",
            field: "ac_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        
    ]

    this.gridOptionsacct = {
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
  this.accountService
      .getAll()
      .subscribe((response: any) => (this.accounts = response.data))
}
openacct(content) {
    this.prepareGridacct()
    this.modalService.open(content, { size: "lg" })
}
onAlertClose($event) {
  this.hasFormErrors = false;
}
}
