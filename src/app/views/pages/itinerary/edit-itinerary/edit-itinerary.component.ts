import { Component, OnInit } from "@angular/core";

import { NgbDropdownConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
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
import { ActivatedRoute, Router } from "@angular/router";
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Observable, BehaviorSubject, Subscription, of, Observer } from "rxjs";
import { SubheaderService, LayoutConfigService } from "../../../../core/_base/layout";

import { LayoutUtilsService, TypesUtilsService, MessageType } from "../../../../core/_base/crud";

import { Itinerary, ItineraryService, CustomerMobileService, CodeMobileService, RoleService, RoleItinerary } from "../../../../core/erp";

import { config } from "process";
import { create } from "lodash";

@Component({
  selector: "kt-edit-itinerary",
  templateUrl: "./edit-itinerary.component.html",
  styleUrls: ["./edit-itinerary.component.scss"],
})
export class EditItineraryComponent implements OnInit {
  lat = 36.748205868214235;
  lng = 3.083509081242227;
  zoom: number = 10;
  itinerary: Itinerary;
  itineraryForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  isExist = false;
  customers: number[] = [];
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  gridService: GridService;
  gridObj: any;
  angularGrid: AngularGridInstance;
  //selectedRows: any[] = []
  dataset: any[] = [];
  itinerary_type: any[] = [];
  week_days: any[] = [];
  // roles : any[] = []
  itineraryEdit: any;
  somedata: any[] = [];
  formReady: boolean = false;
  selectedCustomers: any[] = [];
  param: any;
  dataView: any;
  grid: any;
  datacust: [];
  columnDefinitionscust: Column[] = [];
  gridOptionscust: GridOption = {};
  gridObjcust: any;
  angularGridcust: AngularGridInstance;
  row_number;
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router, 
              private typesUtilsService: TypesUtilsService, 
              private formBuilder: FormBuilder, 
              public dialog: MatDialog, 
              private subheaderService: SubheaderService, 
              private layoutUtilsService: LayoutUtilsService, 
              private layoutConfigService: LayoutConfigService, 
              private modalService: NgbModal, 
              private itineraryService: ItineraryService, 
              private customerMobileService: CustomerMobileService, 
              private codeMobileService: CodeMobileService, 
              private roleService: RoleService, 
              config: NgbDropdownConfig) {
    config.autoClose = true;
    this.codeMobileService.getBy({ code_name: "week_days" }).subscribe((response: any) => (this.week_days = response.data));
    this.codeMobileService.getBy({ code_name: "itinerary_type" }).subscribe((response: any) => (this.itinerary_type = response.data));
  
  }

  ngOnInit(): void {
   
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(true);
    // this.createForm()
    // setTimeout(() => {
    //   this.createForm();
    // }, 1000);
   
   
    // this.customerMobileService.getBySomething({ itinerary_code: this.param }).subscribe((response: any) => (this.selectedCustomers = response.data));
    // this.customerMobileService.getBySomething({ itinerary_code: this.param }).subscribe((res: any) => {
    //   console.log(res.data)
    //   this.selectedCustomers = res.data.map((item) => {
    //     return item;
    //   });
    // });
    
    this.activatedRoute.params.subscribe((params) => {
      console.log(params)
      const id = params.id;
      this.param = id;
      this.itineraryService.getOne(id).subscribe((response: any) => {
        // this.somedata.push(response.data);
        this.itineraryEdit = response.data
        console.log(this.itineraryEdit);
        this.initCode()
        this.customerMobileService.getCustomersByitin({ itinerary_code: this.itineraryEdit.itinerary_code }).subscribe((res: any) => {
          console.log(res.data)
          this.dataset = res.data
         
         });
      });
    });
    this.prepareGrid();
  
  }
  // time = new Observable<string>((observer: Observer<string>) => {
  //   setInterval(() => {
  //     observer.next("");
  //   }, 1000);
  // });
  initCode() {
    this.createForm()
   
    this.loadingSubject.next(false)
  }
  createForm() {
    this.loadingSubject.next(false);
    this.itinerary = new Itinerary();
    // this.formReady = true;
    // console.log(this.itineraryEdit[0]);
   
    this.itineraryForm = this.formBuilder.group({
      itinerary_code: [this.itineraryEdit.itinerary_code, Validators.required],
      itinerary_name: [this.itineraryEdit.itinerary_name, Validators.required],
      itinerary_type: [this.itineraryEdit.itinerary_type],
      itinerary_day: [this.itineraryEdit.itinerary_day],
      // customers: [this.itinerary.customers_name, Validators.required],
      // roles : [{value : this.itinerary.roles}, Validators.required]
    });
  }

  prepareGrid() {
    this.columnDefinitions = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },

      {
        id: "customer_code",
        name: "code client",
        field: "customer_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "customer_name",
        name: "Nom",
        field: "customer_name",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "rank",
        name: "Rang",
        field: "rank",
        sortable: true,
        filterable: true,
        type: FieldType.integer,
        editor: {
          model: Editors.integer,
        },
      },
     
    ];

    this.gridOptions = {
      enableAutoResize: true,
      enableCellNavigation: true,
      enableFiltering: true,
      enableCheckboxSelector: true,
      enableRowSelection: true,
      editable:true,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false,
      },
      frozenColumn: 0,
      frozenBottom: true,
      //multiSelect: false,
    };
  
    // fill the dataset with your data
    // this.dataset = [];
    // this.customerMobileService.getAllCustomers().subscribe(
    //   (response: any) => (this.dataset = response.data),
    //   (error) => {
    //     this.dataset = [];
    //   },
    //   () => {}
    // );
  }

  reset() {
    this.itinerary = new Itinerary();
    this.createForm();
    this.hasFormErrors = false;
  }

  onSubmit() {
    
    this.hasFormErrors = false;
    const controls = this.itineraryForm.controls;
    /** check form */
    // if (this.itineraryForm.invalid) {
    //   Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());

    //   this.hasFormErrors = true;
    //   return;
    // }

    // tslint:disable-next-line:prefer-const
    let itn = this.prepareItinerary();
    
    this.updateItinerary(itn, this.dataset);
  }

  prepareItinerary(): Itinerary {
    const controls = this.itineraryForm.controls;
    const _itinerary = new Itinerary();
    _itinerary.itinerary_code = controls.itinerary_code.value;
    _itinerary.itinerary_name = controls.itinerary_name.value;
    _itinerary.itinerary_day = controls.itinerary_day.value;
    _itinerary.itinerary_type = controls.itinerary_type.value;
    return _itinerary;
  }

  updateItinerary(_itinerary: Itinerary, _customers: any) {
    this.loadingSubject.next(true);
    this.itineraryService.updateItinerary(_itinerary.itinerary_code, { itinerary: _itinerary, customers: _customers }).subscribe(
      (reponse) => console.log("response", Response),
      (error) => {
        alert("Erreur, vérifier les informations");
        this.loadingSubject.next(false);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        this.router.navigateByUrl("/itinerary/list-itinerary");
      }
    );
  }

  // prepareRoleItinerary(){
  //   const _controls = this.itineraryForm.controls
  //   const _role_itinerary = new RoleItinerary()

  //     _role_itinerary.role_name = _controls.roles.value
  //     _role_itinerary.itinerary_name = _controls.itinerary_name.value

  //     return _role_itinerary
  // }

  // addRoleItinerary(_role_itinerary: RoleItinerary){
  //   this.loadingSubject.next(true)
  //   this.itineraryService.addRoleItinerary(_role_itinerary).subscribe(
  //       (reponse) => console.log("response", Response),
  //       (error) => {
  //           this.layoutUtilsService.showActionNotification(
  //               "Erreur verifier les informations",
  //               MessageType.Create,
  //               10000,
  //               true,
  //               true
  //           )
  //           this.loadingSubject.next(false)
  //       },
  //       () => {
  //             this.layoutUtilsService.showActionNotification(
  //               "Ajout avec succès",
  //               MessageType.Create,
  //               10000,
  //               true,
  //               true
  //           )
  //           this.loadingSubject.next(false)
  //           this.router.navigateByUrl("/itinerary/list-itinerary")

  //       }
  //   )
  // }

  goBack() {
    this.loadingSubject.next(false);
    const url = `/itinerary/list-itinerary`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  handleSelectedRowsChanged(e, args) {
    if (Array.isArray(args.rows) && this.gridObj) {
      // console.log("log")
      this.customers = args.rows.map((idx: number) => {
        const item = this.gridObj.getDataItem(idx);
       
        return item;
      });
    }
    console.log("item",this.customers)
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = (angularGrid && angularGrid.slickGrid) || {};
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
    console.log("this.dataView",this.dataView);
    console.log("selected customers", this.selectedCustomers);
    // const selectedRows = this.selectedCustomers.map((item) => this.dataView.getIdxById(item.customer_code));
    // console.log(selectedRows);
    // this.grid.setSelectedRows(selectedRows);
//     const selectedRows = []
//     console.log("dataset",this.dataset)
//     this.dataset.forEach((element) => {
//       this.selectedCustomers.forEach((element2) => {
//         if (element.customer_code === element2.customer_code) {
//           console.log(this.dataView.getIdxById(element.id))
//           selectedRows.push(this.dataView.getIdxById(element.id));
//         }
//       });
//     });
// console.log(selectedRows)
//     this.grid.setSelectedRows(selectedRows);
  }
  addNewItem() {
    let element: HTMLElement = document.getElementById(
      "openItemsGrid"
  ) as HTMLElement
  element.click()
  }
handleSelectedRowsChangedcust(e, args) {
  this.gridService.addItem(
    {
      id: this.dataset.length + 1,
      customer_code : null,
      customer_name:null,
      rank: null,
    },
    { position: "bottom" }
  );
  this.row_number = this.dataset.length - 1;
  let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
  const controls = this.itineraryForm.controls;

  if (Array.isArray(args.rows) && this.gridObjcust) {
    args.rows.map((idx) => {
    
      const item = this.gridObjcust.getDataItem(idx);
      console.log(item);
     

      updateItem.customer_code = item.customer_code;
      updateItem.customer_name = item.customer_name;
      
    });
  }
}

angularGridReadycust(angularGrid: AngularGridInstance) {
  this.angularGridcust = angularGrid;
  this.gridObjcust = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridcust() {
  this.columnDefinitionscust = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "customer_code",
      name: "code",
      field: "customer_code",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "customer_name",
      name: "Nom",
      field: "customer_name",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },

  ];

  this.gridOptionscust = {
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
 
  this.customerMobileService.getAllCustomers().subscribe((response: any) => (this.datacust = response.data));
}
opencust(content) {
  this.prepareGridcust();
  this.modalService.open(content, { size: "lg" });
}

}
