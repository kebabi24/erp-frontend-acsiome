import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  GridService,
  FieldType,
  Formatters,
  OnEventArgs,
} from "angular-slickgrid";
import { BehaviorSubject, Observable } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { InventoryStatusService, InventoryStatus, LocationService } from "../../../../core/erp";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
@Component({
  selector: 'kt-status-mouvement',
  templateUrl: './status-mouvement.component.html',
  styleUrls: ['./status-mouvement.component.scss']
})
export class StatusMouvementComponent implements OnInit {

  statusForm: FormGroup;
  row_number;

  isExist = false

  status: []
  columnDefinitions4: Column[] = []
  gridOptions4: GridOption = {}
  gridObj4: any
  angularGrid4: AngularGridInstance
  
  dataloc: []
  columnDefinitionsloc: Column[] = []
  gridOptionsloc: GridOption = {}
  gridObjloc: any
  angularGridloc: AngularGridInstance
  selectedField = ""

 

  sc: [];

  // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;

  constructor(
    config: NgbDropdownConfig,
    private statusFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private inventoryStatusService: InventoryStatusService,
    private locationService: LocationService,

  ) {
    config.autoClose = true;
  }

  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.createForm();
    this.initmvGrid();
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.statusForm = this.statusFB.group({
      ism_loc_start: [null, Validators.required],
      ism_loc_end  : [null,  Validators.required],
     
    });
  }


  onChangeCodeStart() {
    const controls = this.statusForm.controls
    this.locationService
        .getByOne({
              loc_loc: controls.ism_loc_start.value
        })
        .subscribe((response: any) => {
          console.log(response.data)
            if (response.data ) {
                this.isExist = true
                console.log(response.data.length)
              
            } 
            else {
              alert ("Emplacement Erroné")
              controls.ism_loc_start.setValue(null);
              document.getElementById("ism_loc_start").focus();
            }
     })
  }
  onChangeCodeEnd() {
    const controls = this.statusForm.controls
    this.locationService
        .getByOne({
              loc_loc: controls.ism_loc_end.value
        })
        .subscribe((response: any) => {
          console.log(response.data)
            if (response.data ) {
                this.isExist = true
                console.log(response.data.length)
                        this.inventoryStatusService
                        .getByIsm({
                              ism_loc_start: controls.ism_loc_start.value,
                              ism_loc_end: controls.ism_loc_end.value
                        })
                        .subscribe((respo: any) => {
                          console.log(respo.data)
                            this.mvdataset=respo.data
                            console.log(respo.data)
                            
                    })                           
            }
            else {
              alert ("Emplacement Erroné")
              controls.ism_loc_end.setValue(null);
              document.getElementById("ism_loc_end").focus();
              
            }
             
     })
  }
  //reste form
  reset() {
   this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.statusForm.controls;
    /** check form */
    if (this.statusForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    // tslint:disable-next-line:prefer-const
    let status = this.preparestatus();
    for (let data of this.mvdataset) {
      delete data.id;
      delete data.cmvid;
    }
    this.addstatus(status, this.mvdataset);
  }
  /**
   * Returns object for saving
   */
  preparestatus(): any {
    const controls = this.statusForm.controls;
   let _status = {
    ism_loc_start : controls.ism_loc_start.value,
    ism_loc_end : controls.ism_loc_end.value
   }
    return _status;
  }
  /**
   * Add code
   *
   * @param _status: InventoryStatusModel
   */
  addstatus(_status: any, details: any) {
    this.loadingSubject.next(true);
    this.inventoryStatusService
      .addIsm({ Status:_status,inventoryStatusMouvement: details })
      .subscribe(
        (reponse) => console.log("response", Response),
        (error) => {
          this.layoutUtilsService.showActionNotification(
            "Erreur verifier les informations",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.loadingSubject.next(false);
        },
        () => {
          this.layoutUtilsService.showActionNotification(
            "Ajout avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.loadingSubject.next(false);
          this.router.navigateByUrl("/");
        }
      );
  }

  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  initmvGrid() {
    this.mvcolumnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.mvangularGrid.gridService.deleteItem(args.dataContext);
          }
        },
      },
      {
        id: "ism_status_start",
        name: "Status Départ",
        field: "ism_status_start",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvid",
        field: "cmvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.row_number = args.row;
          let element: HTMLElement = document.getElementById(
            "openItemsGrid"
          ) as HTMLElement;
          element.click();
        },
      },
      {
        id: "ism_status_end",
        name: "Status Arrivé",
        field: "ism_status_end",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvid",
        field: "cmvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.row_number = args.row;
          let element: HTMLElement = document.getElementById(
            "openItemsGrid5"
          ) as HTMLElement;
          element.click();
        },
      },
    ];

    this.mvgridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
    };

    this.mvdataset = [];
  }
  addNewItem() {
    const newId = this.mvdataset.length+1;

    const newItem = {
      id: newId,
      ism_status_start: null,
      ism_status_end: null,
      cmvid: "",
    };
    this.mvgridService.addItem(newItem, { position: "bottom" });
  }

  handleSelectedRowsChanged4(e, args) {
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        console.log(item);
        updateItem.ism_status_start = item.is_status;
        
        this.mvgridService.updateItem(updateItem);
      });
    }
  }
  handleSelectedRowsChanged5(e, args) {
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        console.log(item);
        updateItem.ism_status_end = item.is_status;
        
        this.mvgridService.updateItem(updateItem);
      });
    }
  }

  angularGridReady4(angularGrid: AngularGridInstance) {
    this.angularGrid4 = angularGrid
    this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {}
}


prepareGrid4() {
    this.columnDefinitions4 = [
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
            name: "Description",
            field: "is_desc",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.string,
        },
    ]

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
        },
        multiSelect: false,
        rowSelectionOptions: {
            selectActiveRow: true,
        },
    }

    // fill the dataset with your data
    this.inventoryStatusService
        .getAll()
        .subscribe((response: any) => (this.status = response.data))
}
open4(content) {
   
    this.prepareGrid4()
    this.modalService.open(content, { size: "lg" })
}
onAlertClose($event) {
  this.hasFormErrors = false
}


handleSelectedRowsChangedloc(e, args) {
  const controls = this.statusForm.controls
 
  if (Array.isArray(args.rows) && this.gridObjloc) {
      args.rows.map((idx) => {
          const item = this.gridObjloc.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
          switch (this.selectedField) {
              case "ism_loc_start": {
                  controls.ism_loc_start.setValue(item.loc_loc || "")
                  break
              }  
              case "ism_loc_end": {
                controls.ism_loc_end.setValue(item.loc_loc || "")
                break
            }    
              default:
                  break
          }
      })
  }
}
angularGridReadyloc(angularGrid: AngularGridInstance) {
  this.angularGridloc = angularGrid
  this.gridObjloc = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridloc() {
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
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
      },
      {
          id: "loc_loc",
          name: "Emplacement",
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
      
  ]

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
      checkboxSelector: {
      },
      multiSelect: false,
      rowSelectionOptions: {
          selectActiveRow: true,
      },
  }

  // fill the dataset with your data
  this.locationService
      .getAll()
      .subscribe((response: any) => (this.dataloc = response.data))
}
openloc(contentloc, field) {
  this.selectedField = field
  this.prepareGridloc()
  this.modalService.open(contentloc, { size: "lg" })
}

}
