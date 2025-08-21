// Angular
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
import { ProfileServiceService, CodeService , UsersService} from "../../../../core/erp";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
@Component({
  selector: 'kt-profile-service',
  templateUrl: './profile-service.component.html',
  styleUrls: ['./profile-service.component.scss']
})
export class ProfileServiceComponent implements OnInit {
  profileForm: FormGroup;
  row_number;

  isExist = false

  transacts: []
  columnDefinitions4: Column[] = []
  gridOptions4: GridOption = {}
  gridObj4: any
  angularGrid4: AngularGridInstance
  

  
  sc: [];

  // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];
  
  profiles: [];
    columnDefinitions2: Column[] = [];
    gridOptions2: GridOption = {};
    gridObj2: any;
    angularGrid2: AngularGridInstance;

  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;

  constructor(
    config: NgbDropdownConfig,
    private profileFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private profileServiceService: ProfileServiceService,
    private codeService: CodeService,
    private usersService : UsersService,
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
    
    this.profileForm = this.profileFB.group({
      usgs_code: [null, Validators.required],
      name : [null],
     });
  }


  onChangeCode() {
    const controls = this.profileForm.controls
    this.usersService
        .getByProfile({
              usrg_code: controls.usgs_code.value
        })
        .subscribe((response: any) => {
          console.log(response.data)
            if (response.data.length != 0 ) {
             
                controls.name.setValue(response.data[0].usrg_description)
              
            } else {
                alert("profile n'exist pas")
                controls.usgs_code.setValue(null);
                document.getElementById("usgs_code").focus(); 
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
    const controls = this.profileForm.controls;
    /** check form */
    if (this.profileForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    // tslint:disable-next-line:prefer-const
    
    for (let data of this.mvdataset) {
      delete data.id;
      delete data.cmvid;
    }
    this.addprofile(this.mvdataset,controls.usgs_code.value);
  }
  /**
   * Returns object for saving
   */
  
  
  addprofile(details: any[],code:any) {
    this.loadingSubject.next(true);
    this.profileServiceService
      .update(details ,code)
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
          this.router.navigateByUrl("/profiles/list-profile-service");
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
        id: "usgs_service",
        name: "Service",
        field: "usgs_service",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.text,
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
        id: "chr01",
        name: "Description",
        field: "chr01",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        editor: {
          model: Editors.text,
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


  
  // addNewItem() {
  //   const newId = this.mvdataset.length+1;

  //   const newItem = {
  //     id: newId,
  //     isd_tr_type: "",
  //     isd__qadc01: "",
  //     cmvid: "",
  //   };
  //   this.mvgridService.addItem(newItem, { position: "bottom" });
  // }
  addNewItem() {
    const controlsX = this.profileForm.controls
    this.mvgridService.addItem(
      {
        id: this.mvdataset.length + 1,
        usgs_code: controlsX.usgs_code.value,
        description: null,
        
      },
      { position: "bottom" }
    );
    this.row_number = this.mvdataset.length - 1;
          // this.row_number = args.row
          let element: HTMLElement = document.getElementById(
            "openItemsGrid"
        ) as HTMLElement
        element.click()
  }

  handleSelectedRowsChanged4(e, args) {
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        const index = this.mvdataset.findIndex(detaill=>{
          return detaill.usgs_service == item.code_value
       })
       if (index == -1) {
        console.log(item);
        updateItem.usgs_service = item.code_value;
        updateItem.chr01 = item.code_cmmt;
        
        this.mvgridService.updateItem(updateItem);
       } 
       else {
        alert("Service déja affecté")
       }
      });
    }
  }
  angularGridReady4(angularGrid: AngularGridInstance) {
    this.angularGrid4 = angularGrid
    this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {}
}


prepareGrid4() {
    this.columnDefinitions4 = [
        // {
        //     id: "id",
        //     field: "id",
        //     excludeFromColumnPicker: true,
        //     excludeFromGridMenu: true,
        //     excludeFromHeaderMenu: true,

        //     minWidth: 50,
        //     maxWidth: 50,
        // },
        // {
        //     id: "id",
        //     name: "id",
        //     field: "id",
        //     sortable: true,
        //     minWidth: 80,
        //     maxWidth: 80,
        // },
        // {
        //     id: "code_fldname",
        //     name: "Champs",
        //     field: "code_fldname",
        //     sortable: true,
        //     filterable: true,
        //     type: FieldType.string,
        // },
     
        {
            id: "code_value",
            name: "Code",
            field: "code_value",
            sortable: true,
            width: 80,
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
    this.codeService
        .getBy({ code_fldname: "emp_job" })
        .subscribe((response: any) => (this.transacts = response.data))
}
open4(content) {
   
    this.prepareGrid4()
    this.modalService.open(content, { size: "lg" })
}
onAlertClose($event) {
  this.hasFormErrors = false
}
handleSelectedRowsChanged2(e, args) {
  const controls = this.profileForm.controls
  if (Array.isArray(args.rows) && this.gridObj2) {
      args.rows.map((idx) => {
          const item = this.gridObj2.getDataItem(idx)
          controls.usgs_code.setValue(item.usrg_code || "")
          controls.name.setValue(item.usrg_description || "")
          const usgs_code = item.usrg_code 
          console.log(usgs_code)
          this.profileServiceService.getBy({usgs_code})
          .subscribe((respo: any) => (this.mvdataset = respo.data));
      })
  }
}

angularGridReady2(angularGrid: AngularGridInstance) {
  this.angularGrid2= angularGrid
  this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {}
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
          id: "usrg_code",
          name: "code profil",
          field: "usrg_code",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "usrg_description",
          name: "description",
          field: "usrg_description",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
  ]

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
  }

  // fill the dataset with your data
  this.usersService
      .getAllProfiles()
      .subscribe((response: any) => (this.profiles = response.data))
}
open2(content) {
  this.prepareGrid2()
  this.modalService.open(content, { size: "lg" })
}

}
