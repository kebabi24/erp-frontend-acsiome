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
// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  FieldType, GridService
} from "angular-slickgrid"
import { Site, SiteService, AccountService, InventoryStatusService, EntityService, CustomerService } from "../../../../core/erp"

@Component({
  selector: 'kt-edit-site',
  templateUrl: './edit-site.component.html',
  styleUrls: ['./edit-site.component.scss']
})
export class EditSiteComponent implements OnInit {
  site: Site
  siteForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  siteEdit: any
  title: String = 'Modifier Site - '

  data: []
    columnDefinitions3: Column[] = []
    gridOptions3: GridOption = {}
    gridObj3: any
    angularGrid3: AngularGridInstance
    selectedField = ""
   
    fieldcode = "";
    error = false;

    datastatus: [];
    columnDefinitionsstatus: Column[] = [];
    gridOptionsstatus: GridOption = {};
    gridObjstatus: any;
    angularGridstatus: AngularGridInstance;

    dataentity: [];
    columnDefinitionsentity: Column[] = [];
    gridOptionsentity: GridOption = {};
    gridObjentity: any;
    angularGridentity: AngularGridInstance;

    customers: [];
    columnDefinitions2: Column[] = [];
    gridOptions2: GridOption = {};
    gridObj2: any;
    angularGrid2: AngularGridInstance;

  constructor(
      config: NgbDropdownConfig,
      private siteFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private accountService: AccountService,
      private entityService: EntityService,
      private inventoryStatusService: InventoryStatusService,
      private modalService: NgbModal, 
      private layoutUtilsService: LayoutUtilsService,
      private siteService: SiteService,
      private customersService: CustomerService,
  ) {
      config.autoClose = true
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(true)
    this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.siteService.getOne(id).subscribe((response: any)=>{
          this.siteEdit = response.data
          this.initCode()
          this.loadingSubject.next(false)
          this.title = this.title + this.siteEdit.si_site
        })
    })
  }
  // init code
  initCode() {
    this.createForm()
    this.loadingSubject.next(false)
  }
  createForm() {
    this.loadingSubject.next(false)
    
    this.siteForm = this.siteFB.group({

      si_site: [this.siteEdit.si_site, Validators.required],
      si_desc: [this.siteEdit.si_desc,  Validators.required ],
      si_cust: [this.siteEdit.si_cust],
      si_entity: [this.siteEdit.si_entity],
      si_default: [this.siteEdit.si_default],
      si_status: [this.siteEdit.si_status],
      si_xfer_cc: [this.siteEdit.si_xfer_cc],
      si_xfer_sub: [this.siteEdit.si_xfer_sub],
      si_xfer_acct: [this.siteEdit.si_xfer_acct],
      si_auto_loc: [this.siteEdit.si_auto_loc],
      si_xfer_ownership: [this.siteEdit.si_xfer_ownership],

    })
  }
    
  //reste form
 reset() {
  this.site = new Site()
  this.createForm()
  this.hasFormErrors = false
}
// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.siteForm.controls
  /** check form */
  if (this.siteForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      return
  }

  // tslint:disable-next-line:prefer-const
  let address = this.prepareSite()
  this.addSite(address)
}
/**
* Returns object for saving
*/

prepareSite(): Site {
  const controls = this.siteForm.controls
  const _site = new Site()
  _site.id = this.siteEdit.id
  _site.si_site = controls.si_site.value
        _site.si_desc= controls.si_desc.value
        _site.si_entity= controls.si_entity.value
        _site.si_default= controls.si_default.value
        _site.si_cust= controls.si_cust.value
        _site.si_status= controls.si_status.value
        _site.si_xfer_cc= controls.si_xfer_cc.value
        _site.si_xfer_sub= controls.si_xfer_sub.value
        _site.si_xfer_acct= controls.si_xfer_acct.value
        _site.si_auto_loc= controls.si_auto_loc.value
        _site.si_xfer_ownership= controls.si_xfer_ownership.value
        return _site
}
/**
* Add code
*
* @param _site: SiteModel
*/
addSite(_site: Site) {
  this.loadingSubject.next(true)
  this.siteService.update(this.siteEdit.id, _site).subscribe(
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
          this.router.navigateByUrl("/inventory-settings/list-loc")
      }
  )
}

goBack() {
  this.loadingSubject.next(false)
  const url = `/`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

handleSelectedRowsChangedstatus(e, args) {
  const controls1 = this.siteForm.controls;
  
  if (Array.isArray(args.rows) && this.gridObjstatus) {
    args.rows.map((idx) => {
      const item = this.gridObjstatus.getDataItem(idx);
      // TODO : HERE itterate on selected field and change the value of the selected field
      switch (this.selectedField) {
        case "si_status": {
          controls1.si_status.setValue(item.is_status || "");
          break;
        }
        
        default:
          break;
      }
    });
  }
}


angularGridReadystatus(angularGrid: AngularGridInstance) {
  this.angularGridstatus = angularGrid;
  this.gridObjstatus = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridstatus() {
  this.columnDefinitionsstatus = [
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
      id: "is_status",
      name: "Status",
      field: "is_status",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "is_desc",
      name: "Designation",
      field: "is_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "is_avail",
      name: "Disponible",
      field: "is_avail",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "is_nettable",
      name: "Gerer MRP",
      field: "is_nettable",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "is_overissue",
      name: "Sortie Excedent",
      field: "is_overissue",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },


  ];

  this.gridOptionsstatus = {
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
  this.inventoryStatusService
    .getAll()
    .subscribe((response: any) => (this.datastatus = response.data));
}
openstatus(content, field) {
  this.selectedField = field;
  this.prepareGridstatus();
  this.modalService.open(content, { size: "lg" });
}

changeStatus(field) {
  const controls = this.siteForm.controls; // chof le champs hada wesh men form rah

  let is_status: any;
  if (field == "si_status") {
   
     is_status = controls.si_status.value;
    
  }
 

  this.inventoryStatusService.getBy({is_status}).subscribe(
    (res: any) => {
      const { data } = res;
      const message = "Ce code status n'existe pas!";
      if (!data.length) {
        this.layoutUtilsService.showActionNotification(
          message,
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

changeEntity(field) {
  const controls = this.siteForm.controls; // chof le champs hada wesh men form rah

  let en_entity: any;
  if (field == "si_entity") {
   
     en_entity = controls.si_entity.value;
    
  }
 

  this.entityService.getBy({en_entity}).subscribe(
    (res: any) => {
      const { data } = res;
      const message = "Cette Entite n'existe pas!";
      if (!data.length) {
        this.layoutUtilsService.showActionNotification(
          message,
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

changeAcct (field){

  const controls1 = this.siteForm.controls 
  let ac_code : any
  if (field=="si_xfer_acct") {
     ac_code  = controls1.si_xfer_acct.value
  
  }
  
this.accountService.getBy({ac_code}).subscribe((res:any)=>{
    const {data} = res
    console.log(res)
    if (!data){ this.layoutUtilsService.showActionNotification(
        "ce compte n'existe pas!",
        MessageType.Create,
        10000,
        true,
        true
    )
    this.error = true}
    else {
        this.error = false
    }


},error=>console.log(error))
}



handleSelectedRowsChanged3(e, args) {
  const controls1 = this.siteForm.controls
  

  if (Array.isArray(args.rows) && this.gridObj3) {
      args.rows.map((idx) => {
          const item = this.gridObj3.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
          switch (this.selectedField) {
            case "si_xfer_acct": {
                controls1.si_xfer_acct.setValue(item.ac_code || "")
                break
            }    
            
              default:
                  break
          }
      })
  }
}
angularGridReady3(angularGrid: AngularGridInstance) {
  this.angularGrid3 = angularGrid
  this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {}
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
          id: "ac_code",
          name: "Compte",
          field: "ac_code",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "ac_desc",
          name: "Designation",
          field: "ac_desc",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "ac_type",
          name: "Type",
          field: "ac_type",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "ac_curr",
        name: "Devise",
        field: "ac_curr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ac_stat_acc",
        name: "Compte Statique",
        field: "ac_stat_acc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },

  ]

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
      checkboxSelector: {
      },
      multiSelect: false,
      rowSelectionOptions: {
          selectActiveRow: true,
      },
  }

  // fill the dataset with your data
  this.accountService
      .getAll()
      .subscribe((response: any) => (this.data = response.data))
}
open3(content, field) {
  this.selectedField = field
  this.prepareGrid3()
  this.modalService.open(content, { size: "lg" })
}






handleSelectedRowsChangedentity(e, args) {
  const controls1 = this.siteForm.controls
  

  if (Array.isArray(args.rows) && this.gridObjentity) {
      args.rows.map((idx) => {
          const item = this.gridObjentity.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
          switch (this.selectedField) {
            case "si_entity": {
                controls1.si_entity.setValue(item.en_entity || "")
                break
            }    
            
              default:
                  break
          }
      })
  }
}
angularGridReadyentity(angularGrid: AngularGridInstance) {
  this.angularGridentity = angularGrid
  this.gridObjentity = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridentity() {
  this.columnDefinitionsentity = [
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
          id: "en_entity",
          name: "Entite",
          field: "en_entity",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "en_name",
          name: "Designation",
          field: "en_name",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "en_type",
        name: "Type",
        field: "en_type",
        sortable: true,
        filterable: true,
        type: FieldType.string,
    },
      {
          id: "en_primary",
          name: "Principale",
          field: "en_primary",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "en_curr",
        name: "Devise",
        field: "en_curr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      

  ]

  this.gridOptionsentity = {
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
  this.entityService
      .getAll()
      .subscribe((response: any) => (this.dataentity = response.data))
     
}
openentity(content, field) {
  this.selectedField = field
  this.prepareGridentity()
  this.modalService.open(content, { size: "lg" })
}

onChangeCust() {
  const controls = this.siteForm.controls; // chof le champs hada wesh men form rah
  const cm_addr = controls.si_cust.value;
  
  this.customersService.getBy({ cm_addr, cm_hold: false }).subscribe(
    (res: any) => {
      console.log(res);
      const { data } = res;

      if (!data) {
        this.layoutUtilsService.showActionNotification(
          "ce client n'existe pas! ou bien bloqué",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.error = true;
      } else {
        this.error = false;
        controls.si_cust.setValue(data.cm_addr || "");
      }
    })

}

handleSelectedRowsChanged2(e, args) {
  const controls = this.siteForm.controls;
  if (Array.isArray(args.rows) && this.gridObj2) {
    args.rows.map((idx) => {
      const item = this.gridObj2.getDataItem(idx);
      console.log(item)
      const date = new Date()

      controls.si_cust.setValue(item.cm_addr || "");
      
     

    });
  }
}

angularGridReady2(angularGrid: AngularGridInstance) {
  this.angularGrid2 = angularGrid;
  this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGrid2() {
  this.columnDefinitions2 = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "cm_addr",
      name: "code",
      field: "cm_addr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_name",
      name: "Client",
      field: "address.ad_name",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_phone",
      name: "Numero telephone",
      field: "address.ad_phone",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxable",
      name: "A Taxer",
      field: "address.ad_taxable",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxc",
      name: "Taxe",
      field: "address.ad_taxc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptions2 = {
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
    dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
      var val = undefined;
      try {
        val = eval("item." + column.field);
      } catch (e) {
        // ignore
      }
      return val;
    },
  };

  // fill the dataset with your data
  this.customersService
    .getByAll({ cm_hold: false })
    .subscribe((response: any) => (this.customers = response.data));
}
open2(content) {
  this.prepareGrid2();
  this.modalService.open(content, { size: "lg" });
}

}
