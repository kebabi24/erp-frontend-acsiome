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

import { User, UsersService, SiteService, ProjectService, EmployeService, LocationService, AffectEmpService, WorkOrderService, QualityControlService, ItemService } from "../../../../core/erp";
import { MenuConfig } from "../../../../core/_config/menu.config";
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Sensibilisation } from "../../../../core/erp";
@Component({
  selector: "kt-add-control-param",
  templateUrl: "./add-control-param.component.html",
  styleUrls: ["./add-control-param.component.scss"],
})
export class AddControlParamaterComponent implements OnInit {
  user: User;
  userForm: FormGroup;
  hasFormErrors = false;
  isExist = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;



  
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};

  columnDefinitionsProducts: Column[] = [];
  gridOptionsProducts: GridOption = {};
  gridObjProducts: any;

  gridObj: any;
  angularGrid: AngularGridInstance;


  message: any;

  
  error = false;

  
  
  woData :  [];
  productsData :  [];
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
       private itemService: ItemService,
   
       private modalService: NgbModal,
       private woService : WorkOrderService,
       private qualityControlService : QualityControlService,

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
      product_code: ["", Validators.required],
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

  
  prepareGridProducts() {
    this.columnDefinitionsProducts= [
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

    this.gridOptionsProducts = {
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
    this.itemService.getAll().subscribe((response: any) => (this.productsData = response.data));
  }

 





  // GRID WO 
  open(content) {
    this.prepareGridWO();
    this.modalService.open(content, { size: "lg" });
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

  handleSelectedRowsChangedP(e, args) {
    const controls = this.userForm.controls;
    if (Array.isArray(args.rows) && this.gridObjProducts) {
      args.rows.map((idx) => {
        const p = this.gridObjProducts.getDataItem(idx);
        controls.product_code.setValue(p.pt_part || "");
        if(p.pt_part){
          this.part = p.pt_part
          this.getSpecificationTestResults()
        }
      });
    }
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = (angularGrid && angularGrid.slickGrid) || {};
  }

  angularGridReadyP(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObjProducts = (angularGrid && angularGrid.slickGrid) || {};
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
    console.log(this.checkedItemsSpecs.length + "\telement checked");
  }

  test(){
    
  }

  openProductsGrid(content){
    this.prepareGridProducts();
    this.modalService.open(content, { size: "lg" });
  }
}
