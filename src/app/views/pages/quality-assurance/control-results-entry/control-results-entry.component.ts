import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import { Column, GridOption, Formatter, Editor, Editors, FieldType, OnEventArgs, AngularGridInstance } from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
// Layout
import { SubheaderService, LayoutConfigService } from "../../../../core/_base/layout";
// CRUD
import { LayoutUtilsService, TypesUtilsService, MessageType } from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";

import { User, UsersService, SiteService, ProjectService, EmployeService, LocationService, AffectEmpService, WorkOrderService, QualityControlService, PurchaseOrderService, LocationDetailService, ItemService } from "../../../../core/erp";
import { MenuConfig } from "../../../../core/_config/menu.config";
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Sensibilisation } from "../../../../core/erp";
import * as _ from "lodash";
@Component({
  selector: "kt-control-results-entry",
  templateUrl: "./control-results-entry.component.html",
  styleUrls: ["./control-results-entry.component.scss"],
})
export class ControlResultsEntryComponent implements OnInit {
  user: User;
  userForm: FormGroup;
  resultsForm: FormGroup;
  hasFormErrors = false;
  isExist = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
 
  
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  gridObj: any;
  angularGrid: AngularGridInstance;

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

  columnDefinitionsDoc: Column[] = [];
  gridOptionsDoc: GridOption = {};
  dataViewDoc: any
  angularGridDoc: AngularGridInstance;
  gridObjDoc: any;

  columnDefinitionsRoute: Column[] = [];
  gridOptionsRoute: GridOption = {};
  dataViewRoute: any
  angularGridRoute: AngularGridInstance;
  gridObjRoute: any;

  columnDefinitionsLD: Column[] = [];
  gridOptionsLD: GridOption = {};
  dataViewLD: any
  angularGridLD: AngularGridInstance;
  gridObjLD: any;

  columnDefinitionsPT: Column[] = [];
  gridOptionsPT: GridOption = {};
  dataViewPT: any
  angularGridPT: AngularGridInstance;
  gridObjPT: any;

  error = false;

  useOrder = true;

  woData :  [];
  podData : [];
  pmdData :[];
  ldData :[];
  ptData :[];

  selected_type : String = "";
  part : any;
  spec_test_result : any 
  specification_code :any;
  route_code :any;
  specificaiton : any 
  routing : any ;
  selected_product_code : any ; 
  selected_lot : any ; 

  itemSpecDetails :any[] = [];
  itemSpecDetailsFiltered :any[] = [] ;
  checkedItemsSpecs :any[] = [];
  specifications :any[] = [];
  routes :any[] = [];

  doc_exist = false;
  route_exist = false;

  
  customeControls: Object = {};


  constructor(
    config: NgbDropdownConfig,
     private userFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
       private router: Router, 
       public dialog: MatDialog, 
       private layoutUtilsService: LayoutUtilsService,
       private modalService: NgbModal,
       private woService : WorkOrderService,
       private qualityControlService : QualityControlService,
       private podService : PurchaseOrderService,
       private projectService : ProjectService,
       private locationDetailService : LocationDetailService,
       private itemService : ItemService,

       

          ) {
    config.autoClose = true;
   
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
      item_code: ["", Validators.required],
      lot: ["", Validators.required],
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

  prepareGridDOC() {
    this.columnDefinitionsDoc = [
    
      {
        id: "mp_nbr",
        name: "Code document",
        field: "mp_nbr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "mp_desc",
        name: "Description",
        field: "mp_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "mp_expire",
        name: "Date d'expiration",
        field: "mp_expire",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    
    ];

    this.gridOptionsDoc = {
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

   
    // this.qualityControlService.findSpecificationsBy({mp_nbr : this.spec_test_result.ip_nbr}).subscribe((response: any) => ( this.specifications = response.data.specifications ));
  }

  prepareGridROUTE() {
    this.columnDefinitionsRoute = [
    
      {
        id: "qro_routing",
        name: "Route",
        field: "qro_routing",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "qro_desc",
        name: "Description",
        field: "qro_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
  
    ];

    this.gridOptionsRoute = {
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

   
    // this.qualityControlService.findSpecificationsBy({mp_nbr : this.spec_test_result.ip_nbr}).subscribe((response: any) => ( this.specifications = response.data.specifications ));
  }

  prepareGridLD() {
    this.columnDefinitionsLD = [
    
      {
        id: "ld_loc",
        name: "Location",
        field: "ld_loc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_part",
        name: "Produit",
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
  
    ];

    this.gridOptionsLD = {
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
    this.locationDetailService.getBy({
      ld_part : this.part
    }).subscribe((response: any) => (this.ldData = response.data));
  }

  prepareGridPT() {
    this.columnDefinitionsPT = [
    
      {
        id: "pt_part",
        name: "Code",
        field: "pt_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pt_group",
        name: "Groupe",
        field: "pt_group",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pt_desc1",
        name: "Description",
        field: "pt_desc1",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
  
    ];

    this.gridOptionsPT = {
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
    this.itemService.getAll().subscribe((response: any) => (this.ptData = response.data));
  }

  open(content ,contentPod , contenctPmd) {
    if(this.useOrder){
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
        // case 'free':{
        //   this.prepareGridLD()
        //   this.modalService.open(contenctLd, { size: "lg" });
        //   break;
        // } 
      }
    }
  }

  openLdGrid(contenctLd){
    if(!this.useOrder){
      this.prepareGridLD()
      this.modalService.open(contenctLd, { size: "lg" });
    }
  }

  openPtGrid(contenctPt){
    if(!this.useOrder){
      this.prepareGridPT()
      this.modalService.open(contenctPt, { size: "lg" });
    }
  }

  handleSelectedRowsChanged(e, args) {
    const controls = this.userForm.controls;
    if (Array.isArray(args.rows) && this.gridObj) {
      args.rows.map((idx) => {
        const wo = this.gridObj.getDataItem(idx);
        controls.order.setValue(wo.wo_nbr || "");
        controls.item_code.setValue(wo.wo_part || "");
        controls.item_code.disable()
        controls.lot.setValue(wo.wo_serial || "");
        controls.lot.disable()
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
        controls.item_code.setValue(pod.pod_part || "");
        controls.item_code.disable()
        controls.lot.setValue(pod.pod_serial || "");
        controls.lot.disable()
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
          controls.item_code.setValue(pmd.pm_part || "");
          controls.item_code.disable()
          controls.lot.setValue("");
          controls.lot.disable()
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

  angularGridReadyDOC(angularGrid: AngularGridInstance) {
    this.angularGridDoc = angularGrid;
    this.gridObjDoc = (angularGrid && angularGrid.slickGrid) || {};
    this.dataViewDoc = angularGrid.dataView;
  }

  angularGridReadyRoute(angularGrid: AngularGridInstance) {
    this.angularGridRoute = angularGrid;
    this.gridObjRoute = (angularGrid && angularGrid.slickGrid) || {};
    this.dataViewRoute = angularGrid.dataView;
  }

  angularGridReadyLD(angularGrid: AngularGridInstance) {
    this.angularGridLD = angularGrid;
    this.gridObjLD = (angularGrid && angularGrid.slickGrid) || {};
    this.dataViewLD = angularGrid.dataView;
  }

  angularGridReadyPT(angularGrid: AngularGridInstance) {
    this.angularGridPT = angularGrid;
    this.gridObjPT = (angularGrid && angularGrid.slickGrid) || {};
    this.dataViewPT = angularGrid.dataView;
  }

  handleSelectedRowsChangedDoc(e, args){
    const controls = this.userForm.controls;
    if (Array.isArray(args.rows) && this.gridObjDoc) {
      args.rows.map((idx) => {
        const doc = this.gridObjDoc.getDataItem(idx);
        if(doc.mp_nbr){
          this.specification_code = doc.mp_nbr
          controls.document_code.setValue(this.specification_code || "");
          this.doc_exist = true
          this.getItemsSpecificationDetails()
        }
      });
    }
  }

  handleSelectedRowsChangedRoute(e, args){
    const controls = this.userForm.controls;
    if (Array.isArray(args.rows) && this.gridObjRoute) {
      args.rows.map((idx) => {
        const route = this.gridObjRoute.getDataItem(idx);
        if(route.qro_routing){
          this.route_code = route.qro_routing
          controls.route_code.setValue(this.route_code || "");
          this.route_exist = true
          this.getItemsSpecificationDetails()

        }
      });
    }
  }

  handleSelectedRowsChangedLD(e, args){
    const controls = this.userForm.controls;
    if (Array.isArray(args.rows) && this.gridObjLD) {
      args.rows.map((idx) => {
        const ld = this.gridObjLD.getDataItem(idx);
        console.log(ld)
        controls.order.setValue(ld.ld_part || "");
        if(ld.ld_part){
          controls.lot.setValue(ld.ld_lot || "");
          controls.order.setValue("");
          controls.order.disable();
          this.selected_lot = ld.ld_lot
          this.getSpecificationTestResults()
        }
      });
    }
  }

  handleSelectedRowsChangedPT(e, args){
    const controls = this.userForm.controls;
    if (Array.isArray(args.rows) && this.gridObjPT) {
      args.rows.map((idx) => {
        const pt = this.gridObjPT.getDataItem(idx);
        controls.order.setValue(pt.pt_part || "");
        if(pt.pt_part){
          controls.item_code.setValue(pt.pt_part || "");
          controls.order.setValue("");
          controls.order.disable();
          this.part = pt.pt_part
          // this.getSpecificationTestResults()
        }
      });
    }
  }


  openDocGrid(content ){
    this.modalService.open(content, { size: "lg" });
  }

  openRouteGrid(content ){
    this.modalService.open(content, { size: "lg" });
  }

  getSpecificationTestResults(){
    this.qualityControlService.getSpecTestResults(
      {ip_part :this.part }
      ).subscribe((response: any) => {
          this.spec_test_result = response.data.specs[0]
          this.getDocuments()
          this.getRoutes()
          // this.getItemsSpecificationDetails()
      }
     );
        
  }

  getDocuments(){
    this.qualityControlService.findSpecificationsBy(
      {mp_nbr : this.spec_test_result.ip_nbr}
      ).subscribe((response: any) => {
          this.specifications = response.data.specifications 
          this.prepareGridDOC()  
      }
     );
  }

  getRoutes(){
    this.qualityControlService.findInspectionRoutesBy(
      {qro_routing : this.spec_test_result.ip_routing}
      ).subscribe((response: any) => {
        console.log(response)
           this.routes = response.data
           this.prepareGridROUTE()  
      }
     );
  }

  getItemsSpecificationDetails(){
    if(this.doc_exist && this.route_exist){
    this.qualityControlService.findItemSpecificationDetails(
      {
        ipd_part :  this.spec_test_result.ip_part,
        // ipd_routing : this.spec_test_result.ip_routing,
        ipd_routing : this.route_code,
        ipd_op :  this.spec_test_result.ipd_op,
        // ipd_nbr : this.spec_test_result.ip_nbr ,
        ipd_nbr : this.specification_code,
      }
      ).subscribe((response: any) => {
          this.itemSpecDetails = response.data 


          this.itemSpecDetails.forEach((item) => {
            let trimmed_label = item.ipd_label.split(" ").join("")
            item.trimmed_label = trimmed_label
            item.ipd_pass = false
            item.isBool = item.ipd_chr02 === "bool"
            this.customeControls[trimmed_label] = new FormControl("");
            this.customeControls[trimmed_label + "-text-area"] =new FormControl("");
            this.customeControls[trimmed_label + "-bool"] =new FormControl("");
            this.customeControls[trimmed_label + "-boolR"] =new FormControl("");
          });

          const data= _.mapValues(_.groupBy(this.itemSpecDetails, 'ipd_op'));
          for (const [key, value] of Object.entries(data)) {
            this.itemSpecDetailsFiltered.push({
              operation_title: key , 
              operations : value 
            })
          }
          console.log(this.itemSpecDetailsFiltered)

          

          this.resultsForm = this.userFB.group({
            ...this.customeControls
          })
      }
     );
    }
  }

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
    this.itemSpecDetailsFiltered = [];
  }

  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.userForm.controls;
   
      let testsHistory = []
      this.checkedItemsSpecs.forEach(item => {
        testsHistory.push({
          mph_part : item.ipd_part , 
          mph_routing : item.ipd_routing , 
          mph_op : item.ipd_op,
          mph_procedure : item.ip_nbr , 
          mph_test : item.ipd_test,
          // mph_date : "date",
          mph_cmt : "comment",
          mph_rsult : "string ",
          mph_lot : "lot",
          mph_wr_nbr : controls.order.value,
          mph_pass : true
        })
      });
      this.qualityControlService.createTestHistory(
        testsHistory
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

  onChange(event: Event, item: any ,test : any) {

    const isChecked = (event.target as HTMLInputElement).checked; 
    const test_accepted_val = test.ipd_tol // from the test
    let test_val = test_accepted_val === "true" ? true : false // use for testing 
    console.log(isChecked.toString() === test_val.toString())

    // search for the element : 
    const itemIndex = this.itemSpecDetails.findIndex(item =>{
      //  return item.operation_title == event.method
   })
    
     console.log(item)
     console.log(test)
    // if (isChecked) {
    //   this.checkedItemsSpecs.push(item);
    // } else {
    //   this.checkedItemsSpecs = this.checkedItemsSpecs.filter((s) => s !== item);
    // }
  
  }

  onChangeType(val :any){
    const controls = this.userForm.controls;
    controls.order.setValue("");
    controls.item_code.setValue("");
    controls.lot.setValue("");
    controls.document_code.setValue("");
    controls.route_code.setValue("");
    if(val =="free"){
      this.useOrder = false
      controls.order.disable();
      controls.item_code.enable();
      controls.lot.enable();
    }else{
      this.useOrder = true
      controls.order.enable();
      controls.item_code.disable();
      controls.lot.disable();
    }
    this.selected_type = val 
   
  }

 
}
