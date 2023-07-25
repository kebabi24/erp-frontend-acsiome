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
import { Costlist, CostlistService, DeviseService, SiteService,CodeService,TransportcostService } from "../../../../core/erp"
@Component({
  selector: 'kt-edit-costlist',
  templateUrl: './edit-costlist.component.html',
  styleUrls: ['./edit-costlist.component.scss']
})
export class EditCostlistComponent implements OnInit {

  costlist: Costlist
  ltrcForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

  currs: []
  columnDefinitionscurr: Column[] = []
  gridOptionscurr: GridOption = {}
  gridObjcurr: any
  angularGridcurr: AngularGridInstance

  sites: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;

  ums: [];
  columnDefinitionsum: Column[] = [];
  gridOptionsum: GridOption = {};
  gridObjum: any;
  angularGridum: AngularGridInstance;
  
 trcs: []
    columnDefinitionstrc: Column[] = []
    gridOptionstrc: GridOption = {}
    gridObjtrc: any
    angularGridtrc: AngularGridInstance

    ltrcEdit: any
    title: String = 'Modifier Liste des Frais - '

    angularGrid: AngularGridInstance;
    grid: any;
    gridService: GridService;
    dataView: any;
    columnDefinitions: Column[];
    gridOptions: GridOption;
    dataset: any[];
    ltrc_trmode: any[] = [];
  constructor(
      config: NgbDropdownConfig,
      private ltrcFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private modalService: NgbModal,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private siteService: SiteService,
      private deviseService: DeviseService,
      private codeService: CodeService,
      private costlistService: CostlistService,
      private transportcostService: TransportcostService
  ) {
      config.autoClose = true
      this.codeService
      .getBy({ code_fldname: "transport_mode" })
      .subscribe((response: any) => (this.ltrc_trmode = response.data));
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(true)
    this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.costlistService.getOne(id).subscribe((response: any)=>{
          console.log("herehrerher",response.data)
          this.ltrcEdit = response.data.ltrc
          this.dataset = response.data.details
          console.log(response.data)
          this.initCode()
          this.initGrid();
          this.loadingSubject.next(false)
          this.title = this.title + this.ltrcEdit.ltrc_code
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

 this.costlist = new Costlist()
  this.ltrcForm = this.ltrcFB.group({
     ltrc_code: [{value:this.costlist.ltrc_code,disabled:true}],
     ltrc_desc: [
          this.ltrcEdit.ltrc_desc,
          Validators.required,
      ],
     ltrc_site: [this.ltrcEdit.ltrc_site, Validators.required],
     ltrc_curr: [this.ltrcEdit.ltrc_curr, Validators.required],
     ltrc_trc_code: [this.ltrcEdit.ltrc_trc_code, Validators.required],
     ltrc_um: [this.ltrcEdit.ltrc_um, Validators.required],

     ltrc_type: [this.ltrcEdit.ltrc_type],
     trcdesc: [{ value:null , disabled: true }],
     ltrc_trmode: [this.ltrcEdit.ltrc_trmode],
  })
  const controls = this.ltrcForm.controls
  this.transportcostService
    .getByOne({trc_code:this.ltrcEdit.ltrc_trc_code}).subscribe((res:any)=>{
     console.log(res.data)
      if (!res.data) {
       controls.ltrc_trc_code.setValue(null)
    
       } else {
         console.log("hehre")
        controls.trcdesc.setValue(res.data.trc_desc)
       }
            
        })
  
}

gridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
  this.dataView = angularGrid.dataView;
  this.grid = angularGrid.slickGrid;
  this.gridService = angularGrid.gridService;
}

initGrid() {
  this.columnDefinitions = [
    {
      id: "id",
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
      name: "Ligne",
      field: "id",
      minWidth: 30,
      maxWidth: 30,
      selectable: true,
    },
 
    {
      id: "ltrcd_weight_min",
      name: "Poids Min",
      field: "ltrcd_weight_min",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      editor: {
        model: Editors.float,
        params: { decimalPlaces: 2 }
      },
      formatter: Formatters.decimal,
      
    },
    {
      id: "ltrcd_weight_max",
      name: "Poids Max",
      field: "ltrcd_weight_max",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      editor: {
        model: Editors.float,
        params: { decimalPlaces: 2 }
      },
      formatter: Formatters.decimal,
      onCellChange: (e: Event, args: OnEventArgs) => {

        if(args.dataContext.ltrcd_weight_max < args.dataContext.ltrcd_weight_min) {
          alert("Poids Max doit etre superieur ou egale au poids min")
        }
       
      }   
    },
   
  
    {
      id: "ltrcd_start_date",
      name: "Date Debut",
      field: "ltrcd_start_date",
      sortable: true,
      width: 80,
      filterable: false,
      formatter:Formatters.dateIso,
      editor: {
        model: Editors.date,
      },
    },
    {
      id: "ltrcd_end_date",
      name: "Date Fin",
      field: "ltrcd_end_date",
      sortable: true,
      width: 80,
      filterable: false,
      formatter:Formatters.dateIso,
      editor: {
        model: Editors.date,
      },
    },
    {
      id: "ltrcd_cost",
      name: "Frais Transport",
      field: "ltrcd_cost",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      editor: {
        model: Editors.float,
        params: { decimalPlaces: 2 }
      },
      formatter: Formatters.decimal,
      
    },
    {
      id: "ltrcd_un_cost",
      name: "Frais par UM",
      field: "ltrcd_un_cost",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      editor: {
        model: Editors.float,
        params: { decimalPlaces: 2 }
      },
      formatter: Formatters.decimal,
      
    },
    {
      id: "ltrcd_liste_cost",
      name: "Frais par UM Liste",
      field: "ltrcd_liste_cost",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      editor: {
        model: Editors.float,
        params: { decimalPlaces: 2 }
      },
      formatter: Formatters.decimal,
      
    },
  ];

  this.gridOptions = {
    asyncEditorLoading: false,
    editable: true,
    enableColumnPicker: true,
    enableCellNavigation: true,
    enableRowSelection: true,
    formatterOptions: {
      
      // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
      displayNegativeNumberWithParentheses: true,

      // Defaults to undefined, minimum number of decimals
      minDecimal: 2,

      // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
      thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
    },
  };

  
}
addNewItem() {
  this.gridService.addItem(
    {
      id: this.dataset.length + 1,
     
      ltrcd_weight_min: 0,
      ltrcd_weight_max:0,
      ltrcd_start_date:null,
      ltrcd_end_date:null,
      ltrcd_un_cost: 0,
      ltrcd_cost: 0,
      ltrcd_liste_cost: 0,


    },
    { position: "bottom" }
  );
}
//reste form
reset() {
 this.costlist = new Costlist()
  this.createForm()
  this.hasFormErrors = false
}
// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.ltrcForm.controls
  /** check form */
  if (this.ltrcForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      return
  }

  // tslint:disable-next-line:prefer-const
  let address = this.prepareCode()
  this.addCode(address,this.dataset)
}
/**
     * Returns object for saving
     */
    prepareCode(): Costlist {
      const controls = this.ltrcForm.controls
      const _costlist = new Costlist()
      _costlist.ltrc_code = controls.ltrc_code.value
      _costlist.ltrc_desc = controls.ltrc_desc.value
      _costlist.ltrc_site = controls.ltrc_site.value
      _costlist.ltrc_curr = controls.ltrc_curr.value
      _costlist.ltrc_trc_code = controls.ltrc_trc_code.value
      _costlist.ltrc_um = controls.ltrc_um.value
      _costlist.ltrc_type = controls.ltrc_type.value
      _costlist.ltrc_trmode = controls.ltrc_trmode.value
      return _costlist
  }
/**
     * Add code
     *
     * @param _costlist: DeviseModel
     */
    addCode(_costlist: Costlist,detail:any) {
      this.loadingSubject.next(true)
     this.costlistService.update({costlist:_costlist,details:detail},this.ltrcEdit.id).subscribe(
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
                  "Modification avec succès",
                  MessageType.Create,
                  10000,
                  true,
                  true
              )
              this.loadingSubject.next(false)
              this.reset()
              this.router.navigateByUrl("/transport/list-edit-costlist")
          }
      )
  }


 /**
     * Go back to the list
     *
     */
    goBack() {
      this.loadingSubject.next(false)
      const url = `/transport/list-edit-costlist`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }

  onChangeSite(){
    const controls = this.ltrcForm.controls // chof le champs hada wesh men form rah
    const si_site  = controls.ltrc_site.value ;      
    this.siteService
    .getByOne({si_site}).subscribe((res:any)=>{
      console.log(res.data)
     if (!res.data) {
       alert("Site n'existe pas")
      controls.ltrc_site.setValue(null)
      document.getElementById("ltrc_site").focus(); 

     }
        })
  
  
  
  }
  onChangeCurr(){
    const controls = this.ltrcForm.controls // chof le champs hada wesh men form rah
    const cu_curr  = controls.ltrc_curr.value ;      
    this.deviseService
    .getBy({cu_curr}).subscribe((res:any)=>{
      console.log(res.data)
      if (!res.data) {
        alert("Devise n'existe pas")
        controls.ltrc_curr.setValue(null)
        document.getElementById("ltrc_curr").focus(); 
  
       }
            
        })
  
  
  
  }
  onChangeUm(){
    const controls = this.ltrcForm.controls // chof le champs hada wesh men form rah
    this.codeService
    .getBy({code_fldname:"pt_um",code_value:controls.ltrc_um.value}).subscribe((res:any)=>{
     console.log(res.data)
      if (!res.data) {
        alert("UM n'existe pas")
        controls.ltrc_um.setValue(null)
        document.getElementById("ltrc_um").focus(); 
  
       }
            
        })
  
  
  
  
  }
  onChangeTrc(){
    const controls = this.ltrcForm.controls // chof le champs hada wesh men form rah
    this.transportcostService
    .getByOne({trc_code:controls.ltrc_trc_code.value}).subscribe((res:any)=>{
     console.log(res.data)
      if (!res.data) {
        alert("Code Frais n'existe pas")
        controls.ltrc_trc_code.setValue(null)
        document.getElementById("ltrc_trc_code").focus(); 
  
       } else {
         console.log("hehre")
        controls.trcdesc.setValue(res.data.trc_desc)
       }
            
        })
  
  
  
  
  }
  handleSelectedRowsChangedsite(e, args) {
    const controls = this.ltrcForm.controls
    if (Array.isArray(args.rows) && this.gridObjsite) {
        args.rows.map((idx) => {
            const item = this.gridObjsite.getDataItem(idx)
            controls.ltrc_site.setValue(item.si_site || "")
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
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
        },
        {
            id: "si_site",
            name: "Site ",
            field: "si_site",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "si_desc",
          name: "Designation",
          field: "si_site",
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
    this.siteService
        .getAll()
        .subscribe((response: any) => (this.sites = response.data))
}
opensite(content) {
    this.prepareGridsite()
    this.modalService.open(content, { size: "lg" })
}



handleSelectedRowsChangedcurr(e, args) {
 
  const controls = this.ltrcForm.controls;

  
  if (Array.isArray(args.rows) && this.gridObjcurr) {
    args.rows.map((idx) => {
      const item = this.gridObjcurr.getDataItem(idx);
      controls.ltrc_curr.setValue(item.cu_curr || "");

    });
  }
}

angularGridReadycurr(angularGrid: AngularGridInstance) {
  this.angularGridcurr = angularGrid;
  this.gridObjcurr = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridcurr() {
  this.columnDefinitionscurr = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
  },
 
  {
      id: "cu_curr",
      name: "Devise",
      field: "cu_curr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
  },
  {
      id: "cu_desc",
      name: "Designation",
      field: "cu_desc",
      sortable: true,
      width: 200,
      filterable: true,
      type: FieldType.string,
  },
  {
    id: "cu_rnd_mthd",
    name: "Methode Arrondi",
    field: "cu_rnd_mthd",
    sortable: true,
    filterable: true,
    type: FieldType.float,
  },
  
  {
    id: "cu_active",
    name: "Actif",
    field: "cu_active",
    sortable: true,
    filterable: true,
    type: FieldType.string,
  },
  
  {
    id: "cu_iso_curr",
    name: "Devise Iso",
    field: "cu_iso_curr",
    sortable: true,
    filterable: true,
    type: FieldType.string,
  },
  ];

  this.gridOptionscurr = {
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
  this.deviseService
    .getAll()
    .subscribe((response: any) => (this.currs = response.data));
}
opencurr(content) {
  this.prepareGridcurr();
  this.modalService.open(content, { size: "lg" });
}

handleSelectedRowsChangedum(e, args) {
  const controls = this.ltrcForm.controls
  if (Array.isArray(args.rows) && this.gridObjum) {
      args.rows.map((idx) => {
          const item = this.gridObjum.getDataItem(idx)
          controls.ltrc_um.setValue(item.code_value || "")
      })
  }
}

  angularGridReadyum(angularGrid: AngularGridInstance) {
    this.angularGridum = angularGrid
    this.gridObjum = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridum() {
    this.columnDefinitionsum = [
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
            name: "code UM",
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
            filterable: true,
            type: FieldType.string,
        },
        
    ]

    this.gridOptionsum = {
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
  this.codeService
      .getBy({code_fldname:"pt_um"})
      .subscribe((response: any) => (this.ums = response.data))
}
openum(content) {
    this.prepareGridum()
    this.modalService.open(content, { size: "lg" })
}


handleSelectedRowsChangedtrc(e, args) {
  const controls = this.ltrcForm.controls
  if (Array.isArray(args.rows) && this.gridObjtrc) {
      args.rows.map((idx) => {
          const item = this.gridObjtrc.getDataItem(idx)
          controls.ltrc_trc_code.setValue(item.trc_code || "")
          controls.trcdesc.setValue(item.trc_desc)
      })
  }
}

angularGridReadytrc(angularGrid: AngularGridInstance) {
  this.angularGridtrc = angularGrid
  this.gridObjtrc = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridtrc() {
  this.columnDefinitionstrc = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
  },
 
  {
      id: "trc_code",
      name: "Code",
      field: "trc_code",
      sortable: true,
      filterable: true,
      type: FieldType.string,
  },
  {
      id: "trc_desc",
      name: "Designation",
      field: "trc_desc",
      sortable: true,
      width: 200,
      filterable: true,
      type: FieldType.string,
  },
  {
    id: "trc_acct",
    name: "Compte ",
    field: "trc_acct",
    sortable: true,
    filterable: true,
    type: FieldType.float,
  },
  
  {
    id: "trc_project",
    name: "Projet",
    field: "trc_project",
    sortable: true,
    filterable: true,
    type: FieldType.string,
  },
  
  {
    id: "trc_taxable",
    name: "A Taxer",
    field: "trc_taxable",
    sortable: true,
    filterable: true,
    type: FieldType.string,
    formatter: Formatters.checkmark
  },

  {
    id: "trc_taxc",
    name: "Taxe",
    field: "trc_taxc",
    sortable: true,
    filterable: true,
    type: FieldType.string,
  },
  {
    id: "trc_disc",
    name: "Remise au paiement",
    field: "trc_disc",
    sortable: true,
    filterable: true,
    type: FieldType.string,
    formatter: Formatters.checkmark
  }, 
  ]

  this.gridOptionstrc = {
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
  this.transportcostService
      .getAll()
      .subscribe((response: any) => (this.trcs = response.data))
}
opentrc(content) {
  this.prepareGridtrc()
  this.modalService.open(content, { size: "lg" })
}

onAlertClose($event) {
  this.hasFormErrors = false;
}
}
