import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import { Column, GridOption, Formatter, Editor, Editors, FieldType, OnEventArgs, AngularGridInstance } from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
// Layout
import { SubheaderService, LayoutConfigService } from "../../../../core/_base/layout";
// CRUD
import { LayoutUtilsService, TypesUtilsService, MessageType } from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";

import { User, UsersService, SiteService, ProjectService, EmployeService, LocationService, AffectEmpService, WorkOrderService, QualityControlService, PurchaseOrderService } from "../../../../core/erp";
import { MenuConfig } from "../../../../core/_config/menu.config";
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Sensibilisation } from "../../../../core/erp";
@Component({
  selector: "kt-control-results-entry",
  templateUrl: "./control-results-entry.component.html",
  styleUrls: ["./control-results-entry.component.scss"],
})
export class ControlResultsEntryComponent implements OnInit {
  user: User;
  userForm: FormGroup;
  hasFormErrors = false;
  isExist = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
 
  
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};

  columnDefinitionsPOD: Column[] = [];
  gridOptionsPOD: GridOption = {};
  gridObjPOD: any;
  angularGridPOD: AngularGridInstance;
  dataViewPOD: any
  
  columnDefinitionsPMD: Column[] = [];
  gridOptionsPMD: GridOption = {};
  dataViewPMD: any
  angularGridPMD: AngularGridInstance;
  gridObjPMD: any;

  


  gridObj: any;
  angularGrid: AngularGridInstance;




  
  error = false;

  
  
  woData :  [];
  podData : [];
  pmdData :[];

  selected_type : String = "";
  part : any;
  spec_test_result : any 
  specification_code :any;
  specificaiton : any 
  routing : any ;
  itemSpecDetails : [];
  checkedItemsSpecs :any[] = [];


  constructor(
    config: NgbDropdownConfig,
     private userFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
       private router: Router, 
       public dialog: MatDialog, 
       private layoutUtilsService: LayoutUtilsService,
       private employeesService: EmployeService, 
       private modalService: NgbModal,
       private woService : WorkOrderService,
       private qualityControlService : QualityControlService,
       private podService : PurchaseOrderService,
       private projectService : ProjectService,

       

          ) {
    config.autoClose = true;
    console.log(new MenuConfig().defaults);
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.createForm();
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);

    this.userForm = this.userFB.group({
      order: ["", Validators.required],
      document_code: ["", Validators.required],
      route_code: ["", Validators.required],
    });
  }

  
  
  prepareGridWO() {
    this.columnDefinitions = [
      {
        id: "wo_nbr",
        name: "wo nbr",
        field: "wo_nbr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "wo_lot",
        name: "Wo lot",
        field: "wo_lot",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "wo_part",
        name: "Wo part",
        field: "wo_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

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
      checkboxSelector: { hideSelectAllCheckbox: true},
      multiSelect: false,
      rowSelectionOptions: {selectActiveRow: true},
    };

    // fill the dataset with your data
    this.woService.getAll().subscribe((response: any) => (this.woData = response.data));
  }

  prepareGridPOD() {
    this.columnDefinitionsPOD = [
      {
        id: "pod_nbr",
        name: "nbr",
        field: "pod_nbr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pod_part",
        name: "part",
        field: "pod_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pod_tax_code",
        name: "tax code",
        field: "pod_tax_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pod_stat",
        name: "stat",
        field: "pod_stat",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionsPOD = {
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
        hideSelectAllCheckbox: true  
      },
      multiSelect: false,
      rowSelectionOptions: {selectActiveRow: true },
    };

    this.podService.getAllwithDetail().subscribe((response: any ) => {
      this.podData = response.data
      this.dataViewPOD.setItems(this.podData)
    });
  }

  prepareGridPMD() {
    this.columnDefinitionsPMD = [
    
      {
        id: "pmd_code",
        name: "Code",
        field: "pmd_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pmd_tast",
        name: "Task",
        field: "pmd_tast",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pmd_status",
        name: "Status",
        field: "pmd_status",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pmd_part",
        name: "Part",
        field: "pmd_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionsPMD = {
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

    // fill the dataset with your data
    this.projectService.getAllwithDetail().subscribe((response: any) => (this.pmdData = response.data));
  }

  



  // GRID WO 
  open(content ,contentPod , contenctPmd) {
    switch(this.selected_type){
      case 'wo':{
        this.prepareGridWO();
        this.modalService.open(content, { size: "lg" });
        break;
      } 
      case 'pod':{
        this.prepareGridPOD();
        this.modalService.open(contentPod, { size: "lg" });
        break;
      } 
      case 'pm':{
        this.prepareGridPMD()
        this.modalService.open(contenctPmd, { size: "lg" });
        break;
      } 
    }
    
  }
  handleSelectedRowsChanged(e, args) {
    const controls = this.userForm.controls;
    if (Array.isArray(args.rows) && this.gridObj) {
      args.rows.map((idx) => {
        const wo = this.gridObj.getDataItem(idx);
        controls.order.setValue(wo.wo_nbr || "");
        if(wo.wo_nbr){
          this.part = wo.wo_part
          this.getSpecificationTestResults()
        }
      });
    }
  }

  handleSelectedRowsChangedPOD(e, args) {
    const controls = this.userForm.controls;
    if (Array.isArray(args.rows) && this.gridObjPOD) {
      args.rows.map((idx) => {
        const pod = this.gridObjPOD.getDataItem(idx);
        controls.order.setValue(pod.pod_nbr || "");
        if(pod.pod_nbr){
          this.part = pod.pod_nbr
          this.getSpecificationTestResults()
        }
      });
    }
  }

  handleSelectedRowsChangedPMD(e, args) {
    const controls = this.userForm.controls;
    if (Array.isArray(args.rows) && this.gridObjPMD) {
      args.rows.map((idx) => {
        const pmd = this.gridObjPMD.getDataItem(idx);
        controls.order.setValue(pmd.pod_nbr || "");
        if(pmd.pod_nbr){
          this.part = pmd.pod_nbr
          this.getSpecificationTestResults()
        }
      });
    }
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = (angularGrid && angularGrid.slickGrid) || {};
  }

  angularGridReadyPOD(angularGrid: AngularGridInstance) {
    this.angularGridPOD = angularGrid;
    this.gridObjPOD = (angularGrid && angularGrid.slickGrid) || {};
    this.dataViewPOD = angularGrid.dataView;
  }

  angularGridReadyPMD(angularGrid: AngularGridInstance) {
    this.angularGridPMD = angularGrid;
    this.gridObjPMD = (angularGrid && angularGrid.slickGrid) || {};
    this.dataViewPMD = angularGrid.dataView;
  }



  getSpecificationTestResults(){
    this.qualityControlService.getSpecTestResults(
      {ip_part :this.part }
      ).subscribe((response: any) => {
          this.spec_test_result = response.data.specs[0]
          this.getDocumentCode()
          this.getRouting()
          this.getItemsSpecificationDetails()
      }
     );
        
  }

  getDocumentCode(){
    this.qualityControlService.findSpecificationByCode(
      this.spec_test_result.ip_nbr
      ).subscribe((response: any) => {
          this.specificaiton = response.data.specification 
          const controls = this.userForm.controls;
          controls.document_code.setValue(this.specificaiton.mp_nbr || "");
          
      }
     );
  }

  getRouting(){
    this.qualityControlService.findInspectionRouting(
      {qro_routing : this.spec_test_result.ip_routing}
      ).subscribe((response: any) => {
          this.routing = response.data 
          const controls = this.userForm.controls;
          controls.route_code.setValue(this.routing.qro_routing || "");
          
      }
     );
  }

  getItemsSpecificationDetails(){
    this.qualityControlService.findItemSpecificationDetails(
      {
        ipd_part :  this.spec_test_result.ip_part,
        ipd_routing : this.spec_test_result.ip_routing,
        ipd_op :  this.spec_test_result.ipd_op,
        ipd_nbr : this.spec_test_result.ip_nbr ,
      }
      ).subscribe((response: any) => {
          this.itemSpecDetails = response.data 
          console.log(this.itemSpecDetails)
    
      }
     );
  }

 // GRID WO END 

  goBack() {
    this.loadingSubject.next(false);
    const url = `/user-mstr/users-list`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  reset() {
    this.createForm();
    this.hasFormErrors = false;
    this.checkedItemsSpecs = [];
    this.itemSpecDetails = [];
  }

  

  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.userForm.controls;
   
    // if (this.userForm.invalid) {
    //   Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());

    //   this.hasFormErrors = true;
    //   return;
    // }

    
      let ipData = {
        ip_part :  this.spec_test_result.ip_part,
        ip_routing : this.spec_test_result.ip_routing,
        ip_op :  this.spec_test_result.ip_op,
        ip_nbr : this.spec_test_result.ip_nbr ,
      }

      let ipdsData = []
      this.checkedItemsSpecs.forEach(item => {
        ipdsData.push({
          ipd_part :  item.ipd_part,
          ipd_routing : item.ipd_routing,
          ipd_op :  item.ipd_op,
          ipd_nbr : item.ip_nbr ,
          ipd_test : item.ipd_test ,
          ipd_label : item.ipd_label ,
        })
      });
      this.qualityControlService.createIpAndIpds(
        ipData,ipdsData
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

  

  onChange(event: Event, item: any) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.checkedItemsSpecs.push(item);
    } else {
      this.checkedItemsSpecs = this.checkedItemsSpecs.filter((s) => s !== item);
    }
    console.log(this.checkedItemsSpecs.length);
  }

  onChangeType(val :any){
    this.selected_type = val 
  }

 
}
