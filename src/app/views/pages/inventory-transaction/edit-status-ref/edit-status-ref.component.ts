import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

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
import { FormGroup, FormBuilder, Validators, NgControlStatus } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
// Layout
import {
  SubheaderService,
  LayoutConfigService,
} from "../../../../core/_base/layout";
// CRUD
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import {
  ItemService,
  InventoryTransaction,
  InventoryTransactionService,
  LocationService,
  SiteService,
  InventoryStatusService,
  LocationDetailService,
  CostSimulationService,
  CodeService,
} from "../../../../core/erp";
import { Reason, ReasonService} from "../../../../core/erp"
@Component({
  selector: 'kt-edit-status-ref',
  templateUrl: './edit-status-ref.component.html',
  styleUrls: ['./edit-status-ref.component.scss']
})
export class EditStatusRefComponent implements OnInit {

  inventoryTransaction: InventoryTransaction
  statusForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  isExist = false
  message = "";
  user : any;
  items: [];
    columnDefinitions4: Column[] = [];
    gridOptions4: GridOption = {};
    gridObj4: any;
    angularGrid4: AngularGridInstance;
  
    datasite: [];
    columnDefinitionssite: Column[] = [];
    gridOptionssite: GridOption = {};
    gridObjsite: any;
    angularGridsite: AngularGridInstance;
  
    dataloc: [];
    columnDefinitionsloc: Column[] = [];
    gridOptionsloc: GridOption = {};
    gridObjloc: any;
    angularGridloc: AngularGridInstance;
  
    datalocdet: [];
    columnDefinitionslocdet: Column[] = [];
    gridOptionslocdet: GridOption = {};
    gridObjlocdet: any;
    angularGridlocdet: AngularGridInstance;
    selectedField = "";
    fieldcode = "";
    
    causes: []
    columnDefinitions6: Column[] = []
    gridOptions6: GridOption = {}
    gridObj6: any
    angularGrid6: AngularGridInstance

    datastatus: []
    columnDefinitionsstatus: Column[] = []
    gridOptionsstatus: GridOption = {}
    gridObjstatus: any
    angularGridstatus: AngularGridInstance
    row_number;
    error = false;
    dateexpire: String;
    sct;
    lddet: any
    
    acts: any[] = [];
  constructor(
      config: NgbDropdownConfig,
      private statusFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private locationService: LocationService,
      private siteService: SiteService,
      private inventoryStatusService: InventoryStatusService,
      private itemService: ItemService,
      private locationDetailService: LocationDetailService,      
      private sctService: CostSimulationService,
      private modalService: NgbModal,
      private inventoryTransactionService: InventoryTransactionService,
      private reasonService: ReasonService,
      private codeService: CodeService,
  ) {
      config.autoClose = true
       }

  ngOnInit(): void {
      this.loading$ = this.loadingSubject.asObservable()
      this.loadingSubject.next(false)
      this.user = JSON.parse(localStorage.getItem("user"));
      this.createForm()
      this.getacts();
  }
  //create form
  createForm() {
      this.loadingSubject.next(false)
      this.inventoryTransaction = new InventoryTransaction()
      this.statusForm = this.statusFB.group({
          ref: [null],
          tr_site: [{value:this.inventoryTransaction.tr_site, disabled: true}, Validators.required],
          tr_loc: [{value:this.inventoryTransaction.tr_loc, disabled: true},Validators.required],
          tr_part: [{value:this.inventoryTransaction.tr_part,disabled: true}, Validators.required],
          tr_serial_prev: [{value:this.inventoryTransaction.tr_serial, disabled:true}],
          tr_serial: [{value:this.inventoryTransaction.tr_serial}], 
          tr_status: [this.inventoryTransaction.tr_status , Validators.required],
          tr_expire: [this.inventoryTransaction.tr_expire],
          tr_rmks : [this.inventoryTransaction.tr_rmks],
          tr_user1: [this.inventoryTransaction.tr_user1],
        })
  }

  //reste form
  reset() {
      this.inventoryTransaction = new InventoryTransaction()
      this.createForm()
      this.hasFormErrors = false
  }
  // save data
  onSubmit() {
      this.hasFormErrors = false
      const controls = this.statusForm.controls
      /** check form */
      if (this.statusForm.invalid) {
        console.log("here")
          Object.keys(controls).forEach((controlName) =>
              controls[controlName].markAsTouched()
          )
          this.message = "vous ne pouvez pas supprimer cette ligne";
          this.hasFormErrors = true
          return
      }

     
      //CONTROLE CHOIX DECISION

      // tslint:disable-next-line:prefer-const
      let inventoryTransaction = this.prepareIt()
      this.addIt(inventoryTransaction)
  }
  /**
   * Returns object for saving
   */
  prepareIt(): InventoryTransaction {
      const controls = this.statusForm.controls
console.log( controls.tr_serial.value)
      const _it = new InventoryTransaction()
      _it.tr_site = controls.tr_site.value
      _it.tr_loc = controls.tr_loc.value
      _it.tr_status = controls.tr_status.value
      _it.tr_part = controls.tr_part.value
      _it.tr_type = "ISS-CHL"
      _it.tr_ref  = controls.ref.value
      _it.tr_serial = controls.tr_serial.value
      _it.tr_vend_lot = controls.tr_serial_prev.value
      _it.tr_rmks = controls.tr_rmks.value
      _it.tr_user1 = controls.tr_user1.value
      _it.tr_expire = controls.tr_expire.value
      ? `${controls.tr_expire.value.year}/${controls.tr_expire.value.month}/${controls.tr_expire.value.day}`
      : null
      
      return _it
  }
  /**
   * Add code
   *
   * @param _it: InventoryTransactionModel
   */
  addIt(_it: InventoryTransaction) {
      this.loadingSubject.next(true)
      this.inventoryTransactionService.addIssChlRef(_it).subscribe(
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
              this.router.navigateByUrl("/")
          }
      )
  }

  /**
   * Go back to the list
   *
   */
  goBack() {
      this.loadingSubject.next(false)
      const url = `/`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
  handleSelectedRowsChangedsite(e, args) {
      const controls = this.statusForm.controls
     
      if (Array.isArray(args.rows) && this.gridObjsite) {
          args.rows.map((idx) => {
              const item = this.gridObjsite.getDataItem(idx)
              // TODO : HERE itterate on selected field and change the value of the selected field
              switch (this.selectedField) {
                  case "tr_site": {
                      controls.tr_site.setValue(item.si_site || "")
                      break
                  }    
                  default:
                      break
              }
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
  

  
  changeStatus() {
      const controls = this.statusForm.controls; // chof le champs hada wesh men form rah
    
      let is_status: any;
       
         is_status = controls.tr_status.value;
        
      
    
      this.inventoryStatusService.getBy({is_status}).subscribe(
        (res: any) => {
          const { data } = res;
          this.message = "Ce code status n'existe pas!";
          if (!data.length) {
            this.layoutUtilsService.showActionNotification(
              this.message,
              MessageType.Create,
              10000,
              true,
              true
            );
            this.error = true;
          } else {
            this.inventoryStatusService.getByIsm({ism_loc_start: controls.tr_loc.value,ism_loc_end:controls.tr_loc.value, ism_status_start: this.lddet.ld_status, 
              ism_status_end:controls.tr_status.value }).subscribe((resstat:any)=>{
              console.log(resstat)
              const { data } = resstat;
              if (data.length > 0) {
                
                controls.tr_status.setValue(null)
                //console.log(response.data.length)
                document.getElementById("tr_status").focus();
                this.message = "vous n'avez pas le droit de sélectionner ce statut";
                this.hasFormErrors = true
                return
              } 
              else{
                 //CONTROLE CHOIX STATUT
                  
                  this.codeService
                  .getBy({
                    code_fldname: this.lddet.ld_status,
                    code_value:controls.tr_status.value })
                  
                  .subscribe((response: any) => {
                    const { data } = response;
                    
                    if (!data) {
                      this.message = "vous ne pouvez pas choisir ce statut";
                      this.hasFormErrors = true
                      return
                    }
                  });
              }
             
              })
            this.error = false;
          }
        },
        (error) => console.log(error)
      );
    }
    

  handleSelectedRowsChangedstatus(e, args) {
      const controls1 = this.statusForm.controls;
      
      if (Array.isArray(args.rows) && this.gridObjstatus) {
        args.rows.map((idx) => {
          const item = this.gridObjstatus.getDataItem(idx);
          // TODO : HERE itterate on selected field and change the value of the selected field
          //switch (this.selectedField) {
           // case "tr_status": {
            this.inventoryStatusService.getByIsm({ism_loc_start: controls1.tr_loc.value,ism_loc_end:controls1.tr_loc.value, ism_status_start: this.lddet.ld_status, 
              ism_status_end:item.is_status }).subscribe((resstat:any)=>{
              console.log(resstat)
              const { data } = resstat;
              console.log(data)
              if (data.length > 0) {
              
                controls1.tr_status.setValue(null)
                //console.log(response.data.length)
                document.getElementById("tr_status").focus();
                this.message = "vous n'avez pas le droit de sélectionner ce staut";
          this.hasFormErrors = true
          return
              } 
              else{
                //CONTROLE CHOIX STATUT
                
                this.codeService
                .getBy({
                  code_fldname: this.lddet.ld_status,
                  code_value:controls1.tr_status.value })
                
                .subscribe((response: any) => {
                  const { data } = response;
                  
                  if (!data) {
                    this.message = "vous ne pouvez pas choisir ce statut";
                    this.hasFormErrors = true
                    return
                  }
                });
                controls1.tr_status.setValue(item.is_status || "");
              }
              })
              
           //   break;
          //  }
            
         //   default:
         //     break;
          //}
        });
      }
    }
  

  angularGridReadystatus(angularGrid: AngularGridInstance) {
      this.angularGridstatus = angularGrid
      this.gridObjstatus = (angularGrid && angularGrid.slickGrid) || {}
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
  openstatus(content) {
     // this.selectedField = field
      this.prepareGridstatus()
      this.modalService.open(content, { size: "lg" })
  }

  handleSelectedRowsChangedloc(e, args) {
    const controls = this.statusForm.controls;

    if (Array.isArray(args.rows) && this.gridObjloc) {
      args.rows.map((idx) => {
        const item = this.gridObjloc.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        switch (this.selectedField) {
          case "tr_loc": {
            controls.tr_loc.setValue(item.loc_loc || "");
            break;
          }
          default:
            break;
        }
      });
    }
}
angularGridReadyloc(angularGrid: AngularGridInstance) {
    this.angularGridloc = angularGrid;
    this.gridObjloc = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridloc() {
    const controls = this.statusForm.controls;
     
    this.columnDefinitionsloc = [
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
        id: "loc_loc",
        name: "loc",
        field: "loc_loc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "loc_desc",
        name: "Designation",
        field: "loc_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionsloc = {
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
    this.locationService
      .getBy({ loc_site: controls.tr_site.value })
      .subscribe((response: any) => (this.dataloc = response.data));
  }
  openloc(contentloc, field) {
    this.selectedField = field;
    this.prepareGridloc();
    this.modalService.open(contentloc, { size: "lg" });
  }
  changeSite() {
    const controls = this.statusForm.controls; // chof le champs hada wesh men form rah
    const si_site = controls.tr_site.value;
    this.siteService.getByOne({ si_site }).subscribe(
      (res: any) => {
          console.log(res)
        const { data } = res;

        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "ce Site n'existe pas!",
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
  
  changeLoc() {
    const controls = this.statusForm.controls; // chof le champs hada wesh men form rah
    const loc_loc = controls.tr_loc.value;
    const loc_site = controls.tr_site.value;

    this.locationService.getByOne({ loc_loc, loc_site }).subscribe(
      (res: any) => {
        const { data } = res;

        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "cet Emplacement n'existe pas!",
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
  
  
  handleSelectedRowsChanged4(e, args) {
    const controls = this.statusForm.controls; 
    //let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
      if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
     
        controls.tr_part.setValue(item.pt_part || ""); 
    });
  }
}

  angularGridReady4(angularGrid: AngularGridInstance) {
    this.angularGrid4 = angularGrid;
    this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid4() {
    this.columnDefinitions4 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "pt_part",
        name: "code ",
        field: "pt_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pt_desc1",
        name: "desc",
        field: "pt_desc1",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pt_um",
        name: "desc",
        field: "pt_um",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptions4 = {
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
    this.itemService
      .getAll()
      .subscribe((response: any) => (this.items = response.data));
  }
  open4(content) {
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }
  

  handleSelectedRowsChangedlocdet(e, args) {
    const controls = this.statusForm.controls; 
    //let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
      if (Array.isArray(args.rows) && this.gridObjlocdet) {
      args.rows.map((idx) => {
        const item = this.gridObjlocdet.getDataItem(idx);
        controls.tr_status.enable()
        controls.tr_expire.enable()
        controls.tr_rmks.enable()     
        controls.tr_serial.setValue(item.ld_lot ); 
        controls.tr_status.setValue(item.ld_status ); 
        this.lddet = item
       
        //this.dateexpire = '${item.ld_expire.getFullYear()}-${item.ld_expire.getMonth()+1}-${item.ld_expire.getDay()' 
        if (item.ld_expire != null)

{        const d = new Date(item.ld_expire)
        controls.tr_expire.setValue({
          year: d.getFullYear(),
          month: d.getMonth()+1,
          day: d.getDate()
        }|| null); 
      }
      else { 
        controls.tr_expire.setValue( null); 
      }       
        


    });
  }
  }
  angularGridReadylocdet(angularGrid: AngularGridInstance) {
    this.angularGridlocdet = angularGrid;
    this.gridObjlocdet = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridlocdet() {
    const controls = this.statusForm.controls; 

    this.columnDefinitionslocdet = [
      // {
      //   id: "id",
      //   field: "id",
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,

      //   minWidth: 50,
      //   maxWidth: 50,
      // },
      // {
      //   id: "id",
      //   name: "id",
      //   field: "id",
      //   sortable: true,
      //   minWidth: 80,
      //   maxWidth: 80,
      // },
      {
        id: "ld_site",
        name: "Site",
        field: "ld_site",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_loc",
        name: "Emplacement",
        field: "ld_loc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_part",
        name: "Article",
        field: "ld_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_lot",
        name: "Lot",
        field: "ld_lot",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_ref",
        name: "Réf",
        field: "ld_ref",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      
      {
        id: "ld_qty_oh",
        name: "Qte",
        field: "ld_qty_oh",
        sortable: true,
        filterable: true,
        type: FieldType.float,
      },
      {
        id: "ld_status",
        name: "Status",
        field: "ld_status",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      
      {
        id: "ld_expire",
        name: "Expire",
        field: "ld_expire",
        sortable: true,
        filterable: true,
        type: FieldType.dateIso,
      },
    ];

    this.gridOptionslocdet = {
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
    this.locationDetailService
      .getBy({ ld_site:  controls.tr_site.value , ld_loc: controls.tr_loc.value  , ld_part:  controls.tr_part.value })
      .subscribe((response: any) => (this.datalocdet = response.data));
  }
  openlocdet(contentlocdet) {
    this.prepareGridlocdet();
    this.modalService.open(contentlocdet, { size: "lg" });
  }

  onChangePal() {
    /*kamel palette*/
    const controls = this.statusForm.controls
    const ref = controls.ref.value
    this.locationDetailService.getByOneRef({ ld_ref: ref  }).subscribe(
      (response: any) => {
        this.lddet = response.data
        //console.log(this.lddet.ld_qty_oh)
    if (this.lddet != null) {
     
      
     
             
     
     this.itemService.getByOne({pt_part: this.lddet.ld_part  }).subscribe(
      (respopart: any) => {
        console.log(respopart)

     this.sctService.getByOne({ sct_site: controls.tr_site.value, sct_part: this.lddet.ld_part, sct_sim: 'STD-CG' }).subscribe(
      (respo: any) => {
        this.sct = respo.data
        console.log(this.sct)
    

    //  this.gridService.addItem(
    //   {
    //     id: this.dataset.length + 1,
    //     tr_line: this.dataset.length + 1,
    //     tr_part: this.lddet.ld_part,
    //     cmvid: "",
    //     desc: respopart.data.pt_desc1,
    //     tr_qty_loc: this.lddet.ld_qty_oh,
    //     qty_oh: this.lddet.ld_qty_oh,
    //     tr_um: respopart.data.pt_um,
    //     tr_um_conv:1,
    //     tr_price: this.sct.sct_mtl_tl,
    //     cmvids: "",
    //     tr_ref: ref,
    //     tr_serial: this.lddet.ld_lot,
    //     tr_status: this.stat,
    //     tr_expire: this.lddet.ld_expire,
    //   },
    //   { position: "bottom" }
    // );
 
    controls.tr_site.setValue(this.lddet.ld_site)
    controls.tr_loc.setValue(this.lddet.ld_loc)
    controls.tr_part.setValue(this.lddet.ld_part)
    controls.tr_serial_prev.setValue(this.lddet.ld_lot)
    controls.tr_serial.setValue(this.lddet.ld_lot)
    controls.tr_status.setValue(this.lddet.ld_status)
    if(this.lddet.ld_expire != null) {
    const d = new Date(this.lddet.ld_expire)
    d.setDate(d.getDate() )
      controls.tr_expire.setValue({
        year: d.getFullYear(),
        month: d.getMonth()+1,
        day: d.getDate()
      })
    } else {
      controls.tr_expire.setValue(null)
    }
     
})
  
})     
  }
 
    else {
      this.message = "cette réference n'existe pas";
      
          this.hasFormErrors = true
          return
  //  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_part: null })
 
controls.ref.setValue(null)
document.getElementById("ref").focus();
}
})
  }
  handleSelectedRowsChanged6(e, args) {
    const controls = this.statusForm.controls
    if (Array.isArray(args.rows) && this.gridObj6) {
        args.rows.map((idx) => {
            const cause = this.gridObj6.getDataItem(idx)
            console.log(cause)
            controls.tr_rmks.setValue(cause.rsn_ref || "")

        })
    }
} 
angularGridReady6(angularGrid: AngularGridInstance) {
    this.angularGrid6 = angularGrid
    this.gridObj6 = (angularGrid && angularGrid.slickGrid) || {}
}
prepareGrid6() {
    const controls = this.statusForm.controls
    this.columnDefinitions6 = [
        {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
        },
       
       
        {
          id: "rsn_ref",
          name: "Code",
          field: "rsn_ref",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      
        {
            id: "rsn_desc",
            name: "Designation",
            field: "rsn_desc",
            sortable: true,
            width: 200,
            filterable: true,
            type: FieldType.string,
        },
    ]

    this.gridOptions6 = {
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
    
    this.reasonService
        .getBy ({rsn_type: 'STATUSCHANGE' })
        .subscribe((response: any) => (this.causes = response.data))
     
}
open6(content) {
    this.prepareGrid6()
    this.modalService.open(content, { size: "lg" })
}
getacts() {
  const controls=this.statusForm.controls
  this.codeService
    .getBy({
      code_fldname: "act",
      code_desc:this.user.usrd_code,
      chr01:controls.tr_status.value
    })
    .subscribe((response: any) => {
      const { data } = response;
      this.acts = data;
      if (!data) {
       
        // controls.wo_site.setValue("");
      }
    });
}
}
