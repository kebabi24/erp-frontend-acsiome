import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import { Column, GridOption, Formatter, Editor, Editors, FieldType, OnEventArgs, AngularGridInstance, GridService, Formatters } from "angular-slickgrid";
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


  popupForm: FormGroup


  
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  gridObj: any;
  angularGrid: AngularGridInstance;

  columnDefinitionsProducts: Column[] = [];
  gridOptionsProducts: GridOption = {};
  gridObjProducts: any;


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

  doc_exist = false;
  route_exist = false;
  prod_exist = false;
  op_exist = false;

  op_number =""

  
  
  woData :  [];
  productsData :  [];
  part : any;
  spec_test_result : any 
  specification_code :any;
  specificaiton : any 
  routing : any ;
  route_code :any;
  itemSpecDetails :any[] =[];
  checkedItemsSpecs :any[] = [];

  checkedTests :any[] = [];
  dropdownOptions :any[] = [];

  valueIsBool = false;
  valueIsMinMax = false;
  valueIsChar = false;
  clickedRowIndex : any ;

  valueToAddIsBool = false;
  valueToAddIsMinMax = false;
  valueToAddIsChar = false;

  

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
       private fb: FormBuilder,

          ) {
    config.autoClose = true;
    console.log(new MenuConfig().defaults);
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.getRoutes()
    this.getDocuments()
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
      operation: ["", Validators.required],
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
          this.getDocuments()
          this.getRoutes()
          // this.getDocumentCode()
          // this.getRouting()
          // this.getItemsSpecificationDetails()
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
    this.showDetailsGrid = false
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
        ip_part :  this.part,
        ip_routing : this.route_code,
        ip_op :  this.op_number,
        ip_nbr : this.specification_code,
      }

      let ipdsData = []
      this.checkedTests.forEach(index =>{
        let item = this.itemSpecDetails[index]
        ipdsData.push({
          ipd_part :  item['ipd_part'],
          ipd_routing : item['ipd_routing'],
          ipd_op :  item['ipd_op'],
          ipd_nbr : item['ip_nbr'] ,
          ipd_test : item['ipd_test'] ,
          ipd_label : item['ipd_label'] ,
        })
      })
      // this.checkedItemsSpecs.forEach(item => {
      //   ipdsData.push({
      //     ipd_part :  item.ipd_part,
      //     ipd_routing : item.ipd_routing,
      //     ipd_op :  item.ipd_op,
      //     ipd_nbr : item.ip_nbr ,
      //     ipd_test : item.ipd_test ,
      //     ipd_label : item.ipd_label ,
      //   })
      // });
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
  

  getDocuments(){
    this.qualityControlService.findSpecificationsBy(
      {}
      // {mp_nbr : this.spec_test_result.ip_nbr}
      ).subscribe((response: any) => {
          this.specifications = response.data.specifications 
         
          this.prepareGridDOC()  
      }
     );
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
   
  }

  prepareGridDetails() {
    this.columnDefinitionsDetails = [
    
      // {
      //   id: "ipd_op",
      //   name: "Numero",
      //   field: "ipd_op",
      //   sortable: true,
      //   minWidth: 100,
      //   maxWidth: 100,
      //   filterable: true,
      //   type: FieldType.string,
      //   editor: {model: Editors.text}

      //   },
       
        {
          id: "ipd_tol_type",
          name: "unité de mesure",
          field: "ipd_tol_type",
          sortable: true,
          minWidth: 100,
          maxWidth: 300,
          filterable: true,
          type: FieldType.string, 
          editor: {model: Editors.text}
        },

        
        {
            id: "ipd_chr01",
            name: "méthode de test",
            field: "ipd_chr01",
            sortable: true,
            minWidth: 100,
            maxWidth: 300,
            filterable: true,
            type: FieldType.string, 
            editor: {model: Editors.text}
        },
        {
          id: "ipd_chr02",
          name: "Type de valeur",
          field: "ipd_chr02",
          sortable: true,
          minWidth: 100,
          maxWidth: 300,
          filterable: true,
          type: FieldType.string, 
          onCellClick: (e: Event, args: OnEventArgs) => {
            this.clickedRowIndex = args.dataContext.id
            console.log(args.dataContext.id)
          },
          editor: {model: Editors.singleSelect, 
          collection:[{value :"bool", label:"Booléen"},{value :"value", label:"Valeur"},{value :"char", label:"Caractère"}],
          elementOptions: {
            onClick: (event) => {
              switch(event.value){
                case 'bool':{
                  this.valueIsBool = true 
                  this.valueIsChar = false 
                  this.valueIsMinMax = false
                  break;
                }
                case 'value':{
                  this.valueIsBool = false 
                  this.valueIsChar = false 
                  this.valueIsMinMax = true
                  break;
                }
                case 'char':{
                  this.valueIsBool = false 
                  this.valueIsChar = true 
                  this.valueIsMinMax = false
                  break;
                }
              }
              this.createPopupForm()
              document.getElementById("modalButton").click(); 
          }} 
        }
        },
        {
          id: "ipd_dec01",
          name: "Min",
          field: "ipd_dec01",
          sortable: true,
          minWidth: 100,
          maxWidth: 300,
          filterable: true,
          type: FieldType.integer, 
          editor: {model: Editors.integer}
        },
        {
          id: "ipd_dec02",
          name: "Max",
          field: "ipd_dec02",
          sortable: true,
          minWidth: 100,
          maxWidth: 300,
          filterable: true,
          type: FieldType.integer, 
          editor: {model: Editors.integer}
          
        },
        
        {
          id: "ipd_tol",
          name: "Valeur",
          field: "ipd_tol",
          sortable: true,
          minWidth: 100,
          maxWidth: 300,
          filterable: true,
          type: FieldType.string, 
          editor: {model: Editors.text}
        },
        {
          id: "bool",
          name: "Booléen",
          field: "bool",
          sortable: true,
          minWidth: 100,
          maxWidth: 300, 
          filterable: true,
          type: FieldType.boolean, 
          editor: {model: Editors.checkbox},
          formatter :Formatters.checkmark
        }
    
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

  

  angularGridReadyDOC(angularGrid: AngularGridInstance) {
    this.angularGridDoc = angularGrid;
    this.gridObjDoc = (angularGrid && angularGrid.slickGrid) || {};
    this.dataViewDoc = angularGrid.dataView;
  }

  angularGridReadyDetails(angularGrid: AngularGridInstance) {
    this.angularGridDetails = angularGrid;
    this.gridObjDetails = (angularGrid && angularGrid.slickGrid) || {};
    this.dataViewDetails = angularGrid.dataView;
    this.gridService = angularGrid.gridService;
  }

  openDocGrid(content){
    this.modalService.open(content, { size: "lg" });
  }

  getRoutes(){
    this.qualityControlService.findInspectionRoutesBy(
      {}
      ).subscribe((response: any) => {
        console.log(response)
           this.routes = response.data
           this.prepareGridROUTE()  
      }
     );
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
  }


 // **************
 openRouteGrid(content ){
  this.modalService.open(content, { size: "lg" });
 }
 
 angularGridReadyRoute(angularGrid: AngularGridInstance) {
  this.angularGridRoute = angularGrid;
  this.gridObjRoute = (angularGrid && angularGrid.slickGrid) || {};
  this.dataViewRoute = angularGrid.dataView;
}

handleSelectedRowsChangedDetails(e, args){
  this.checkedTests = []
  this.checkedTests = args.rows;
  console.log(this.checkedTests)
}

 addNewItem( ) {
   this.gridService.addItem(
     {
       id: this.itemSpecDetails.length + 1,
       nb_line: "",
       code_param: "",
       measure_unit: "",
       test_method: "",
       val_type: "",
       max: 0,
       min: 0,
      
     },
     { position: "bottom" }
   );
 }

 createPopupForm() {
  this.loadingSubject.next(false)
    this.popupForm = this.fb.group({
        max: [""],
        min: [""],
        char: [""],
        bool: [""],
    })
}

openPopup(c){
  this.modalService.open(c, { size: "lg" });
}



// GRID CLICK HANDLERS 
handleSelectedRowsChangedRoute(e, args){
  const controls = this.userForm.controls;
  if (Array.isArray(args.rows) && this.gridObjRoute) {
    args.rows.map((idx) => {
      const route = this.gridObjRoute.getDataItem(idx);
      this.route_code = route.qro_routing
      controls.route_code.setValue(this.route_code || "");
      // if(route.qro_routing){
      this.route_code = route.qro_routing
      this.route_exist = true
      this.getItemsSpecificationDetails()
      // }
      let l = this.routes.filter((el)=>{return el.qro_routing === this.route_code})
      if(l != null){
        this.dropdownOptions = []
        l.forEach(el => {
          this.dropdownOptions.push({
            code : el.qro_op,
            value : el.qro_op,
          })
        });
      }
    });
  }
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

handleSelectedRowsChangedP(e, args) {
  const controls = this.userForm.controls;
  if (Array.isArray(args.rows) && this.gridObjProducts) {
    args.rows.map((idx) => {
      const p = this.gridObjProducts.getDataItem(idx);
      controls.product_code.setValue(p.pt_part || "");
      
        this.part = p.pt_part
        this.prod_exist = true
        
    });
  }
}

onChangeOp(op){
  this.op_number = op
}

// this.route_code ,  this.specification_code  , this.part , this.op_number
getItemsSpecificationDetails(){
  if(this.doc_exist && this.route_exist){
  this.qualityControlService.findItemSpecificationDetails(
    {
      ipd_part : this.part,
      ipd_routing : this.route_code,
      ipd_op :   this.op_number,
      ipd_nbr : this.specification_code,
    }
    ).subscribe((response: any) => {
        this.itemSpecDetails = response.data 
        console.log(this.itemSpecDetails)
        this.showDetailsGrid = true
        this.itemSpecDetails.forEach(elem =>{
          if(elem.ipd_chr02 =="bool"){
            if(elem.ipd_tol =="true") elem.bool = true
            else elem.bool = false

          }
        })
        
        this.prepareGridDetails()
    }
   );
  }
}




}
