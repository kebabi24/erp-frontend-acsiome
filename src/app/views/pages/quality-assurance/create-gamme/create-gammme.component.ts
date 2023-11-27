import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import { Column, GridOption, Formatter, Editor, Editors, FieldType, OnEventArgs, AngularGridInstance, GridService } from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
// Layout
import { SubheaderService, LayoutConfigService } from "../../../../core/_base/layout";
// CRUD
import { LayoutUtilsService, TypesUtilsService, MessageType } from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";

import { User, UsersService, SiteService, ProjectService, EmployeService, LocationService, AffectEmpService, WorkOrderService, QualityControlService, ItemService, ToolService, WorkCenterService } from "../../../../core/erp";
import { MenuConfig } from "../../../../core/_config/menu.config";
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "kt-create-gammme",
  templateUrl: "./create-gammme.component.html",
  styleUrls: ["./create-gammme.component.scss"],
})
export class CreateGammeComponent implements OnInit {
  user: User;
  userForm: FormGroup;
  hasFormErrors = false;
  isExist = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;


  columnDefinitionsTO: Column[] = [];
  gridOptionsTO: GridOption = {};
  gridObjTO: any;
  angularGridTO: AngularGridInstance;

  
  columnDefinitionsM: Column[] = [];
  gridOptionsM: GridOption = {};
  dataViewM: any
  angularGridM: AngularGridInstance;
  gridObjM: any;

  columnDefinitionsP: Column[] = [];
  gridOptionsP: GridOption = {};
  dataViewP: any
  angularGridP: AngularGridInstance;
  gridObjP: any;


  columnDefinitionsDetails: Column[] = [];
  gridOptionsDetails: GridOption = {};
  dataViewDetails: any
  angularGridDetails: AngularGridInstance;
  gridObjDetails: any;
  gridService: GridService


  message: any;

  
  error = false;
  showDetailsGrid = false ;

  specifications :any[] = [];
  routes :any[] = [];



  
  
 
  
  toolsData :  [];
  machinesData :  [];
  details :any[] =[];
  products :[];

  qro_wkctr = ""
  

  constructor(
    config: NgbDropdownConfig,
     private userFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
       private router: Router, 
       public dialog: MatDialog, 
       private layoutUtilsService: LayoutUtilsService,
       private modalService: NgbModal,
       private qualityControlService : QualityControlService,
       private toolsService : ToolService,
       private workCenterService : WorkCenterService,
       private itemService : ItemService,

       

          ) {
    config.autoClose = true;
    console.log(new MenuConfig().defaults);
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.getProducts()
    this.createForm();
    this.prepareGridDetails()
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);

    this.userForm = this.userFB.group({
      gamme_code : ["", Validators.required],
      operation : ["", Validators.required],
      tool : ["", Validators.required],
      description : ["", Validators.required],
      machine : ["", Validators.required],
   
    });
  }

  
  // *********** GRID TOOLS START ********************
  prepareGridTO() {
    this.columnDefinitionsTO = [
      {
        id: "to_code",
        name: "Code",
        field: "to_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "to_desc",
        name: "Description",
        field: "to_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionsTO = {
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
      checkboxSelector: { hideSelectAllCheckbox: true},
      multiSelect: false,
      rowSelectionOptions: {selectActiveRow: true},
    };

    // fill the dataset with your data
    this.toolsService.getAll().subscribe((response: any) => (this.toolsData = response.data));
  }

  open(content) {
    this.prepareGridTO();
    this.modalService.open(content, { size: "lg" });
  }
  
  handleSelectedRowsChanged(e, args) {
    const controls = this.userForm.controls;
    if (Array.isArray(args.rows) && this.gridObjTO) {
      args.rows.map((idx) => {
        const tool = this.gridObjTO.getDataItem(idx);
        controls.tool.setValue(tool.to_code || "");
       
      });
    }
  }

  angularGridReadyTO(angularGrid: AngularGridInstance) {
    this.angularGridTO = angularGrid;
    this.gridObjTO = (angularGrid && angularGrid.slickGrid) || {};
  }

  // *********** GRID TOOLS END ********************

  // *********** GRID MACHINE START ********************
  prepareGridMachine() {
    this.columnDefinitionsM = [
    
      {
        id: "wc_mch",
        name: "Code",
        field: "wc_mch",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "wc_desc",
        name: "Description",
        field: "wc_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionsM = {
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
      
        hideSelectAllCheckbox: true,

       
      },
      multiSelect: false,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true,
      },
    };

    this.workCenterService.getAll().subscribe((response: any) => (this.machinesData = response.data));
   
  }

  handleSelectedRowsChangedM(e, args){
    const controls = this.userForm.controls;
    if (Array.isArray(args.rows) && this.gridObjM) {
      args.rows.map((idx) => {
        const machine = this.gridObjM.getDataItem(idx);
        this.qro_wkctr = machine.wc_wkctr
        controls.machine.setValue(machine.wc_mch || "");
        
      });
    }
  }

  angularGridReadyM(angularGrid: AngularGridInstance) {
    this.angularGridM = angularGrid;
    this.gridObjM = (angularGrid && angularGrid.slickGrid) || {};
    this.dataViewM = angularGrid.dataView;
  }

  openMachineGrid(content){
    this.prepareGridMachine()
    this.modalService.open(content, { size: "lg" });
  }
  // *********** GRID MACHINE END ********************

  // *********** GRID DETAILS START ********************
  prepareGridDetails() {
    this.columnDefinitionsDetails = [
    
      {
        id: "qps_part",
        name: "Code produit",
        field: "qps_part",
        sortable: true,
        minWidth: 100,
        maxWidth: 100,
        filterable: true,
        type: FieldType.string,
        editor: {model: Editors.text}
        },

        {
            id: "qps_qty",
            name: "Quantité",
            field: "qps_qty ",
            sortable: true,
            minWidth: 100,
            maxWidth: 300,
            filterable: true,
            type: FieldType.string, 
            editor: {model: Editors.text}
        },
    ];

    this.gridOptionsDetails = {
      autoHeight:false,
        asyncEditorLoading: false,
        editable: true,
        enableAutoResize:true,
        enableColumnPicker: true,
        enableCellNavigation: true,
        enableRowSelection: true,
        enableCheckboxSelector: true,
        rowSelectionOptions: {
          selectActiveRow: false
        },
        checkboxSelector: {
          hideSelectAllCheckbox: true,
        },
      };
   
  }

  angularGridReadyDetails(angularGrid: AngularGridInstance) {
    this.angularGridDetails = angularGrid;
    this.gridObjDetails = (angularGrid && angularGrid.slickGrid) || {};
    this.dataViewDetails = angularGrid.dataView;
    this.gridService = angularGrid.gridService;
  }
  // *********** GRID DETAILS END ********************


  // *********** GRID PRODUCT START ********************
  prepareGridP() {
    this.columnDefinitionsP = [
        {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 40,
          maxWidth: 40,
        },
        {
            id: "pt_part",
            name: "Code Produit",
            field: "pt_part",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "pt_desc1",
            name: "Deescription",
            field: "pt_desc1",
            sortable: true,
            filterable: true,
            width: 100,
            type: FieldType.string,
        },
        {
            id: "pt_um",
            name: "UM",
            field: "pt_um",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "pt_part_type",
          name: "Type",
          field: "pt_part_type",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "pt_draw",
          name: "Classe",
          field: "pt_draw",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
    ];

    this.gridOptionsP = {
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
      
        hideSelectAllCheckbox: true,

       
      },
      multiSelect: false,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true,
      },
    };

  
   
  }

  handleSelectedRowsChangedP(e, args){
    if (Array.isArray(args.rows) && this.gridObjP) {
      args.rows.map((idx) => {
        const product = this.gridObjP.getDataItem(idx);
          this.gridService.addItem(
          {
            id: this.details.length + 1,
            qps_part: product.pt_part,
            qps_qty: 0,  
          },
          { position: "bottom" }
        );
        
      });
    }
  }

  angularGridReadyP(angularGrid: AngularGridInstance) {
    this.angularGridP = angularGrid;
    this.gridObjP = (angularGrid && angularGrid.slickGrid) || {};
    this.dataViewP = angularGrid.dataView;
  }

  openPGrid(content){
    this.prepareGridP()
    this.modalService.open(content, { size: "lg" });
  }
  getProducts(){
    this.itemService.getAll().subscribe((response: any) => (this.products = response.data));
  }
  // *********** GRID PRODUCT END ********************

  goBack() {
    this.loadingSubject.next(false);
    const url = `/user-mstr/users-list`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  reset() {
    this.createForm();
    this.details = []
    this.hasFormErrors = false;
  }

  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.userForm.controls;
   
    // if (this.userForm.invalid) {
    //   Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());

    //   this.hasFormErrors = true;
    //   return;
    // }

  
      let qroData = {
        qro_routing :  controls.gamme_code.value,
        qro_op : controls.operation.value,
        qro_tool : controls.tool.value,
        qro_mch : controls.machine.value ,
        qro_wkctr : this.qro_wkctr,
        qro_desc : controls.description.value ,
      }

      this.details.forEach(element => {
        element.qps_routing = controls.gamme_code.value,
        element.qps_op = controls.operation.value
      });

      this.qualityControlService.createQroAndQps(
        qroData,this.details
         ).subscribe(
         (response: any) => {
          
          this.reset()
         },
         (error) => {
             console.log(error)
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
        }
       )
 
  }


 addNewItem(content) {
  this.openPGrid(content)
 }



}
