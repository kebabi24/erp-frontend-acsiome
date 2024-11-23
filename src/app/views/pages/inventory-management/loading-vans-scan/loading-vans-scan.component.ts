import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import { Column, GridOption, Formatter, Editor, Editors, AngularGridInstance, EditorValidator, EditorArgs, GridService, Formatters, FieldType, OnEventArgs } from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators, ControlContainer } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of, Observer } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
// Layout
import { SubheaderService, LayoutConfigService } from "../../../../core/_base/layout";
// CRUD
import { LayoutUtilsService, TypesUtilsService, MessageType } from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";

import { InventoryManagementService, printInventory, InventoryTransactionService, ItemService, LoadRequestService, BarecodeinfosService } from "../../../../core/erp";
import * as _ from "lodash";
import jsPDF from "jspdf";
import { toJSDate } from "@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar";
import { saveAs } from "file-saver";
declare var ElectronPrinter2: any;
declare var ElectronPrinter3: any;
@Component({
  selector: "kt-loading-vans",
  templateUrl: "./loading-vans-scan.component.html",
  styleUrls: ["./loading-vans-scan.component.scss"],
})
export class LoadingVansScanComponent implements OnInit {
  chargeForm: FormGroup;
  unloadForm: FormGroup;
  productLotForm: FormGroup;
  hasFormErrors = false;
  isExist = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;

  role: any;
  load_request_code: any;
  roles: any[] = [];
  loadRequests: any[] = [];
  loadRequestData: any[] = [];
  loadRequestLineData: any[] = [];
  loadRequest: any;
  lots: any[] = [];
  selectedLotsIndexes: any[] = [];
  selected_lot_code: any;
  scanned_codes: any[] = [];
  filteredData: any[] = [];
  user: any;
  printLines: any[] = [];
  printLines2: any[] = [];
  total: number = 0;
  totalCartons: number = 0;
  // GRID
  angularGrid: AngularGridInstance;
  grid: any;

  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  

  angularGridun: AngularGridInstance;
  gridun: any;

  gridServiceun: GridService;
  dataViewun: any;
  columnDefinitionsun: Column[];
  gridOptionsun: GridOption;
  datasetun: any[];


  angularGridchar: AngularGridInstance;
  gridchar: any;

  gridServicechar: GridService;
  dataViewchar: any;
  columnDefinitionschar: Column[];
  gridOptionschar: GridOption;
  datasetchar: any[];

  angularGriddif: AngularGridInstance;
  griddif: any;
  gridServicedif: GridService;
  dataViewdif: any;
  columnDefinitionsdif: Column[];
  gridOptionsdif: GridOption;
  datasetdif: any[];

  showSpinner: Boolean = false;
  loadRequestInfo: any;
  userInfo: any;
  role_code: any = "";
  username: any = "";

  code_start_pos: number;
  code_length: number;
  lot_start_pos: number;
  lot_length: number;
  serie_start_pos: number;
  serie_length: number;
  userPrinter: any;
  nchariot: any

  chariotnum: any
  gridServicechardet: GridService;
  dataViewchardet: any;
  columnDefinitionschardet: Column[];
  gridOptionschardet: GridOption;
  datasetchardet: any[];
  angularGridchardet: AngularGridInstance;
  gridchardet: any;
  row_number;
  constructor(config: NgbDropdownConfig, private tagFB: FormBuilder, private unloadFB: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog, private layoutUtilsService: LayoutUtilsService, private inventoryManagementService: InventoryManagementService, private inventoryTransactionService: InventoryTransactionService, private loadRequestService: LoadRequestService, private barecodeinfosService: BarecodeinfosService, private itemService: ItemService, private modalService: NgbModal) {
    config.autoClose = true;

    this.barecodeinfosService.getAll().subscribe((response: any) => {
      // console.log(response.data)
      this.code_start_pos = Number(response.data[0].start) - 1;
      this.code_length = response.data[0].length;
      this.lot_start_pos = Number(response.data[1].start) - 1;
      this.lot_length = response.data[1].length;
      this.serie_start_pos = Number(response.data[2].start) - 1;
      this.serie_length = response.data[2].length;
    });
    this.prepareGrid();
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user = JSON.parse(localStorage.getItem("user"));
    this.userPrinter = this.user.usrd_dft_printer;
    this.createForm();
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);

    this.chargeForm = this.tagFB.group({
      load_request_code: [null],
      pal: [],
      qty_cart:[0],
      print: [true],
    });
    document.getElementById("load_request_code").focus();
  }

  createUnloadForm() {
    this.loadingSubject.next(false);

    this.unloadForm = this.unloadFB.group({
      palu: [],
  
    });
    document.getElementById("palu").focus();
  }

  time = new Observable<string>((observer: Observer<string>) => {
    setInterval(() => {
      observer.next("");
    }, 1000);
  });

  //reste form
  reset() {
    
  //  this.modalService.dismissAll()
    this.createForm();
    document.getElementById("load_request_code").focus();
    this.dataset = []
    this.hasFormErrors = false;
    console.log("hhhhhhhhhhhhhhhhhhh")
    //this.router.navigateByUrl("/inventory-management/loading-vans-scan")
  }
  // save data
  onSubmit(content10,content11) {
    const controls = this.chargeForm.controls
    console.log(controls.load_request_code.value,this.dataset.length)
    if(controls.load_request_code.value != null && this.dataset.length > 0) {
    const details = [];
    const lines = [];
    this.filteredData = [];
    const data = _.mapValues(_.groupBy(this.dataset, "code_prod"));

    for (const [key, value] of Object.entries(data)) {
      this.filteredData.push({
        prod: key,
        rows: value,
      });
    }
    this.filteredData.forEach((element) => {
      lines.push({
        product_code: element.prod,
        load_request_code: this.load_request_code,
        qt_effected: element.rows.length,
      });
    });
    console.log("liinee", lines);
    this.filteredData.forEach((product) => {
      const filteredByLot = _.mapValues(_.groupBy(product.rows, "lot"));
      for (const [key, value] of Object.entries(filteredByLot)) {
        details.push({
          product_code: value[0].code_prod,
          load_request_code: this.load_request_code,
          lot: key,
          qt_effected: value.length,
          pt_price: value[0].price,
        });
      }
      console.log("details", details);
    });

    for (let dataa of this.dataset) {
      delete dataa.id
    }
    console.log(this.dataset)
    this.inventoryManagementService.createLoadRequestDetailsScan(details, lines,this.dataset).subscribe(
      (response: any) => {
        console.log(response.data)
        this.nchariot = response.data
        const controls = this.chargeForm.controls;
        if (controls.print.value == true) {
            this.printpdf();
           /*print2fois*/
           this.modalService.open(content10, {backdrop: 'static',  size: "lg" });
          
           document.getElementById("load_request_code").focus();
        }

        // this.loadRequestData = [];
        // this.dataset = [];
        // this.printLines = [];
        // this.username = "";
        // // this.load_request_code = "";
        // this.scanned_codes = [];

        // this.role_code = "";
        // this.total = 0;
        // this.totalCartons = 0;
      },
      (error) => {
        // this.loadRequestData = []
        console.log(error);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Load Request Details Updated", MessageType.Create, 1000, true, true);
        this.loadingSubject.next(false);
       // this.reset()
        // this.router.navigateByUrl("/customers-mobile/cluster-create")
      }
    );
    }
    else {
      this.modalService.open(content11, {size: "lg" });

    }
  }
  print2ticket() {
    this.printpdf()
    
    // this.modalService.dismissAll()
    // this.printLines= []
    // this.dataset=[]
    // this.reset()
  }
  print2ticket2() {
    this.printpdf2()
    
    // this.modalService.dismissAll()
    // this.printLines= []
    // this.dataset=[]
    // this.reset()
  }
  exitprint(){
    const controls = this.chargeForm.controls
    this.loadRequestData = [];
    this.dataset = [];
    this.printLines = [];
    this.username = "";
    // this.load_request_code = "";
    this.scanned_codes = [];

    this.role_code = "";
    this.total = 0;
    this.totalCartons = 0;
    
    controls.load_request_code.setValue(null)
    controls.qty_cart.setValue(0)
    document.getElementById("load_request_code").focus();
     //this.reset()
     this.modalService.dismissAll()
     controls.load_request_code.setValue(null)
     document.getElementById("load_request_code").focus();
     
    
  }
  exitprint2(){
    const controls = this.chargeForm.controls
    this.loadRequestData = [];
    this.dataset = [];
    this.printLines = [];
    this.username = "";
    // this.load_request_code = "";
    this.scanned_codes = [];

    this.role_code = null;
    this.total = 0;
    this.totalCartons = 0;
    
    this.dataset = [];
    this.username = null;
    this.load_request_code = null;
    this.role_code = null;
    
    controls.load_request_code.setValue(null)
    document.getElementById("load_request_code").focus();
     //this.reset()
     this.modalService.dismissAll()
     controls.load_request_code.setValue(null)
     document.getElementById("load_request_code").focus();
     
    
  }
  onSaveCharge(content4, content5, content6) {
    const controls = this.chargeForm.controls;
    console.log(controls.load_request_code.value);
    if (controls.load_request_code.value === null) {
      this.modalService.open(content4, { size: "lg" });
      document.getElementById("load_request_code").focus();
      return;
    } else {
      this.loadRequestService.getLoadRequestLineInfo(this.load_request_code).subscribe((response: any) => {
        if (response.data.loadRequest.length > 0) {
          console.log(response.data.loadRequest);
          this.datasetdif = response.data.loadRequest
          this.prepareGriddif(this.load_request_code);
          this.modalService.open(content5, { size: "lg" });
          //console.log(response);
          this.loadRequestLineData = response.data.loadRequest;
          // this.confirmPrinting();
          // this.userInfo = response.data.userMobile;
          // this.role_code = response.data.loadRequest.role_code;
          // this.username = response.data.userMobile.username;
          // document.getElementById("pal").focus();
        } else {
          this.modalService.open(content6, { size: "lg" });
          controls.load_request_code.setValue(null);
          document.getElementById("load_request_code").focus();
        }
      });
    }
  }
  confirmPrinting(content12) {
    const controls = this.chargeForm.controls;
    const details = [];
    const lines = [];

    const data = _.mapValues(_.groupBy(this.dataset, "code_prod"));
    for (const [key, value] of Object.entries(data)) {
      this.filteredData.push({
        prod: key,
        rows: value,
      });
    }
    this.filteredData.forEach((product) => {
      const filteredByLot = _.mapValues(_.groupBy(product.rows, "lot"));
      for (const [key, value] of Object.entries(filteredByLot)) {
        details.push({
          product_code: value[0].code_prod,
          load_request_code: this.load_request_code,
          lot: key,
          qt_effected: value.length,
          pt_price: value[0].price,
        });
      }

      product.rows.forEach((lot) => {
        lines.push({
          product_code: product.prod,
          load_request_code: this.load_request_code,
          qt_effected: product.rows.length,
        });
      });
    });

    this.inventoryManagementService.createLoadRequestDetailsUpdateStatus(details, lines, this.load_request_code).subscribe(
      (response: any) => {
        const controls = this.chargeForm.controls;
        if (controls.print.value == true) {
          this.printpdf2();
          this.modalService.open(content12, {backdrop: 'static',  size: "lg" });
          document.getElementById("load_request_code").focus();
        }
        // this.loadRequestData = [];
        // this.dataset = [];
        // this.username = "";
        // this.load_request_code = null;
        // this.role_code = "";
      },
      (error) => {
        // this.loadRequestData = []
        console.log(error);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Load Request Details Updated", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        // this.router.navigateByUrl("/customers-mobile/cluster-create")
      }
    );

    // controls.load_request_code.setValue(null);
    // document.getElementById("load_request_code").focus();
    // this.modalService.dismissAll();
  }



  onUnload() {
    const details = [];
    const lines = [];
    this.filteredData = [];
    const data = _.mapValues(_.groupBy(this.datasetun, "code_prod"));

    for (const [key, value] of Object.entries(data)) {
      this.filteredData.push({
        prod: key,
        rows: value,
      });
    }
    this.filteredData.forEach((element) => {
      lines.push({
        product_code: element.prod,
        load_request_code: this.load_request_code,
        qt_effected: - element.rows.length,
      });
    });
    console.log("liinee", lines);
    this.filteredData.forEach((product) => {
      const filteredByLot = _.mapValues(_.groupBy(product.rows, "lot"));
      for (const [key, value] of Object.entries(filteredByLot)) {
        details.push({
          product_code: value[0].code_prod,
          load_request_code: this.load_request_code,
          lot: key,
          qt_effected:  - value.length,
          pt_price: value[0].price,
        });
      }
      console.log("details", details);
    });

    for (let dat of this.datasetun) {
      delete dat.id
      dat.quantity = - dat.quantity
    }
    this.inventoryManagementService.createLoadRequestDetailsScan(details, lines,this.datasetun).subscribe(
      (response: any) => {
        const controls = this.chargeForm.controls;
        if (controls.print.value == true) {
           this.printpdf();
        }

        this.loadRequestData = [];
        this.datasetun = [];
        this.printLines = [];
        this.username = "";
        // this.load_request_code = "";
        this.scanned_codes = [];

        this.role_code = "";
        this.total = 0;
        this.totalCartons = 0;
      },
      (error) => {
        // this.loadRequestData = []
        console.log(error);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Load Request Details Updated", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        this.reset()
        // this.router.navigateByUrl("/customers-mobile/cluster-create")
      }
    );
    this.modalService.dismissAll()
  }

  

  openUnload(content) {
   
    this.prepareGridun()
    this.modalService.open(content, { size: "lg" });
    this.createUnloadForm()
  }
  goBack() {
    this.loadingSubject.next(false);
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  // GRID FUNCTIONS
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  prepareGrid() {
    this.columnDefinitions = [
      // {
      //   id: "id",
      //   field: "id",
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.deleteIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //     if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
      //       this.angularGrid.gridService.deleteItem(args.dataContext);
      //     }
      //   },
      // },
      {
        id: "line",
        name: "Ligne",
        field: "line",
        minWidth: 80,
        maxWidth: 80,
        type: FieldType.number,
      },

      {
        id: "code_prod",
        name: "Code produit",
        field: "code_prod",
        minWidth: 100,
        maxWidth: 100,
        type: FieldType.text,
      },

      {
        id: "desc_prod",
        name: "Description",
        field: "desc_prod",
        minWidth: 200,
        maxWidth: 200,
        type: FieldType.text,
      },
      {
        id: "lot",
        name: "N° Lot",
        field: "lot",
        minWidth: 100,
        maxWidth: 100,
        type: FieldType.text,
      },
      {
        id: "quantity",
        name: "Quantité",
        field: "quantity",
        minWidth: 100,
        maxWidth: 100,
        type: FieldType.text,
      },
      {
        id: "serie",
        name: "N° série",
        field: "serie",
        minWidth: 100,
        maxWidth: 100,
        type: FieldType.text,
      },
      
    ];

    this.gridOptions = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      autoEdit: false,
     // autoHeight: false,
      // frozenColumn: 0,
      // frozenBottom: true,
      enableAutoResize: false,
      // enableRowSelection: true,
      // enableCheckboxSelector: true,
    };

    this.dataset = [];
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
    this.grid.invalidate();
    this.grid.render();
  }





  
  prepareGridun() {
    this.columnDefinitionsun = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.angularGrid.gridService.deleteItem(args.dataContext);
          }
        },
      },
      {
        id: "line",
        name: "Ligne",
        field: "line",
        minWidth: 80,
        maxWidth: 80,
        type: FieldType.number,
      },

      {
        id: "code_prod",
        name: "Code produit",
        field: "code_prod",
        minWidth: 100,
        maxWidth: 100,
        type: FieldType.text,
      },

      {
        id: "desc_prod",
        name: "Description",
        field: "desc_prod",
        minWidth: 200,
        maxWidth: 200,
        type: FieldType.text,
      },
      {
        id: "lot",
        name: "N° Lot",
        field: "lot",
        minWidth: 100,
        maxWidth: 100,
        type: FieldType.text,
      },
      {
        id: "quantity",
        name: "Quantité",
        field: "quantity",
        minWidth: 100,
        maxWidth: 100,
        type: FieldType.text,
      },
      {
        id: "serie",
        name: "N° série",
        field: "serie",
        minWidth: 100,
        maxWidth: 100,
        type: FieldType.text,
      },
    ];

    this.gridOptionsun = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      autoEdit: false,
      autoHeight: false,
      frozenColumn: 0,
      frozenBottom: true,
      enableAutoResize: true,
      // enableRowSelection: true,
      enableCheckboxSelector: true,
    };

    this.datasetun = [];
  }

  angularGridReadyun(angularGrid: AngularGridInstance) {
    this.angularGridun = angularGrid;
    this.dataViewun = angularGrid.dataView;
    this.gridun = angularGrid.slickGrid;
    this.gridServiceun = angularGrid.gridService;
    this.gridun.invalidate();
    this.gridun.render();
  }

  onScanLoadRequest(content3,content7) {
    const controls = this.chargeForm.controls;
    this.load_request_code = controls.load_request_code.value;
    this.loadRequestService.getLoadRequestInfo(this.load_request_code).subscribe((response: any) => {
      //console.log(response.data.loadRequest)
      if (response.data.loadRequest !== null ) {
        if(response.data.loadRequest.status == 10) {
        //console.log(response);
          this.loadRequestInfo = response.data.loadRequest;
          this.userInfo = response.data.userMobile;
          this.role_code = response.data.loadRequest.role_code;
          this.username = response.data.userMobile.username;
          document.getElementById("pal").focus();
        } else {
          this.modalService.open(content7, { size: "lg" });
          controls.load_request_code.setValue(null);
          document.getElementById("load_request_code").focus();  
        }
      } else {
        this.modalService.open(content3, { size: "lg" });
        controls.load_request_code.setValue(null);
        document.getElementById("load_request_code").focus();
      }
    });
  }

  onScanPal(content1, content2,content8) {
    const controls = this.chargeForm.controls;
    if (controls.load_request_code.value === "") {
      this.modalService.open(content2, { size: "lg" });
      document.getElementById("pal").focus();
      this.playAudio()
      return;
    }
    else {  
    let pal = controls.pal.value;

    // CHECK IF THE CODE WAS SCANNED BEFORE
    let index = this.scanned_codes.indexOf(pal);
    console.log(this.scanned_codes,index)
    if (index != -1) {
      this.modalService.open(content1, { size: "lg" });
      controls.pal.setValue("");
      document.getElementById("pal").focus();
      this.playAudio()
      return;
    }
else {
    
    let prod = pal.substring(this.code_start_pos, this.code_start_pos + this.code_length);
    //console.log(this.code_start_pos , this.code_length)
    let lot = pal.substring(this.lot_start_pos, this.lot_start_pos + this.lot_length); // stop at 8
    let serie = pal.substring(this.serie_start_pos, this.serie_start_pos + this.serie_length);

    console.log(prod, lot, serie);
    this.itemService.getByOne({ pt_part: prod }).subscribe((response: any) => {
      if(response.data != null) {
      let desc = response.data.pt_desc2;
      let price = response.data.pt_price;
      this.scanned_codes.push(pal);
      this.gridService.addItem(
        {
          id: this.dataset.length + 1,
          line: this.dataset.length + 1,
          code_prod: prod,
          desc_prod: desc,
          lot: lot,
          quantity: 1,
          serie: serie,
          price: price,
        },
        { position: "bottom" }
      );
      
      this.printLines.push({
        id: this.dataset.length + 1,
        code_prod: prod,
        prodlot:prod+lot,
        desc_prod: desc,
        lot: lot,
        price: price,
        quantity: 1,
      });
      controls.qty_cart.setValue(this.dataset.length )
      
    } else {
      this.playAudio()
      this.modalService.open(content8, { size: "lg" });
    }
    });
    controls.pal.setValue(null);
    document.getElementById("pal").focus();
  }
  }
  }





  onScanPalU(content1, content2,content8) {
    const controls = this.unloadForm.controls;
    const controls1 = this.chargeForm.controls;
    if (controls1.load_request_code.value === "") {
      this.modalService.open(content2, { size: "lg" });
      document.getElementById("palu").focus();
      return;
    }

    let palu = controls.palu.value;

    // CHECK IF THE CODE WAS SCANNED BEFORE
    let index = this.scanned_codes.indexOf(palu);
    if (index != -1) {
      this.modalService.open(content1, { size: "lg" });
      controls.palu.setValue("");
      document.getElementById("palu").focus();
      return;
    }

    this.scanned_codes.push(palu);
    let prod = palu.substring(this.code_start_pos, this.code_start_pos + this.code_length);
    //console.log(this.code_start_pos , this.code_length)
    let lot = palu.substring(this.lot_start_pos, this.lot_start_pos + this.lot_length); // stop at 8
    let serie = palu.substring(this.serie_start_pos, this.serie_start_pos + this.serie_length);

    /*verifier si le code a bare a deja imputer sur la demande*/

    /*verifier si le code a bare a deja imputer sur la demande*/

    //console.log(prod, lot, serie);
    this.itemService.getByOne({ pt_part: prod }).subscribe((response: any) => {
      if(response.data !=null) {
      let desc = response.data.pt_desc2;
      let price = response.data.pt_price;
      this.gridServiceun.addItem(
        {
          id: this.datasetun.length + 1,
          line: this.datasetun.length + 1,
          code_prod: prod,
          desc_prod: desc,
          lot: lot,
          quantity: 1,
          serie: serie,
          price: price,
        },
        { position: "bottom" }
      );

      this.printLines.push({
        id: this.datasetun.length + 1,
        code_prod: prod,
        prodlot:prod+lot,
        desc_prod: desc,
        lot: lot,
        price: price,
        quantity: 1,
      });
    }
    else {
      this.playAudio()
      this.modalService.open(content8, { size: "lg" });
    }
    });
    controls.palu.setValue("");
    document.getElementById("palu").focus();
  }
  handleSelectedRowsChangeddif(e, args) {
      if (Array.isArray(args.rows) && this.griddif) {
      args.rows.map((idx) => {
        const item = this.griddif.getDataItem(idx);
        console.log(item);
        
  });

    }
  }
  angularGridReadydif(angularGrid: AngularGridInstance) {
    this.angularGriddif = angularGrid;
    this.dataViewdif = angularGrid.dataView;
    this.griddif = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGriddif(nbr) {
    this.columnDefinitionsdif = [
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
        id: "product_code",
        name: "Code Produit",
        field: "product_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "item.pt_desc2",
        name: "Designation",
        field: "item.pt_desc2",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "qt_validated",
        name: "QTE Demandée ",
        field: "qt_validated",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "qt_effected",
        name: "QTE Chargée",
        field: "qt_effected",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionsdif = {
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
    this.loadRequestService.getLoadRequestLineInfoDif(nbr).subscribe((response: any) => {
      console.log("hehhre",response.data)
      this.datasetdif = response.data.loadRequest
      console.log("hehhre",this.datasetdif)
      this.dataViewdif.setItems(this.datasetdif)
    })
  
    
  }
  // opendif(contentsite) {
  //   this.prepareGriddif();
  //   this.modalService.open(contentsite, { size: "lg" });
  // }
 




  printpdf() {
    let filteredData = [];
    const data = _.mapValues(_.groupBy(this.printLines, "prodlot"));
    //console.log("data",data)
    for (const [key, value] of Object.entries(data)) {
  //    console.log("key",key)
      filteredData.push({
        prod: key,
        occurences: value,
      });
    }
   // this.printLines = [];
   console.log("aaa",this.printLines)
    this.printLines2 = [];
    let k = 1;
    filteredData.forEach((prod) => {
      //console.log(prod);
      this.printLines2.push({
        line: k,
        product_code: prod.occurences[0].code_prod,
        product_name: prod.occurences[0].desc_prod,
        pt_price: prod.occurences[0].price,
        qt_request: prod.occurences.length,
        lot: prod.occurences[0].lot,
        // qt_validated: prod.occurences.length,
        // qt_effected: prod.occurences.length,
      });
      k++;
    });
console.log("this.printline",this.printLines2)

    this.total = 0,
    this.totalCartons= 0,
    this.printLines2.map((item) => {
      if(item.product_code != null) {
      this.total = Number(this.total) + Number(item.pt_price) * Number(item.qt_request);
      this.totalCartons = this.totalCartons + item.qt_request;
      }
    });
    ElectronPrinter2.print2(this.dataset, this.load_request_code, this.role_code, this.loadRequestInfo, this.userInfo, this.username, this.printLines2, this.userPrinter, this.total, this.totalCartons,this.nchariot)
    // saveAs(blob, this.load_request_code + ".pdf");
  }
  printpdf2() {
    // let filteredData = [];
    // const data = _.mapValues(_.groupBy(this.printLines, "code_prod"));
    // for (const [key, value] of Object.entries(data)) {
    //   filteredData.push({
    //     prod: key,
    //     occurences: value,
    //   });
    // }
    this.printLines = [];
    let k = 1;
    this.loadRequestLineData.forEach((prod) => {
      //console.log(prod);
      this.printLines.push({
        line: k,
        product_code: prod.product_code,
        product_name: prod.item.pt_desc2,
        pt_price: prod.pt_price,
        qt_request: prod.qt_request,
        // lot: prod.occurences[0].lot,
        qt_validated: prod.qt_validated,
        qt_effected: prod.qt_effected,
      });
      k++;
    });

    // var doc = new jsPDF();
    // let initialY = 65;
    // let valueToAddToX = 5;

    // var img = new Image();
    // img.src = "./assets/media/logos/companylogo.png";
    // doc.addImage(img, "png", 150, 5, 50, 30);
    // doc.setFontSize(9);

    // // if (this.domain.dom_name != null) {
    // //   doc.text(this.domain.dom_name, 10, 10);
    // // }
    // // if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
    // // if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
    // // if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
    // doc.setFontSize(14);

    // doc.line(10, 35, 200, 35);
    // doc.setFontSize(12);

    // doc.barcode(this.load_request_code, {
    //   fontSize: 70,
    //   textColor: "#000000",
    //   x: 100,
    //   y: 60,
    //   textOptions: { align: "center" }, // optional text options
    // });

    // doc.setFont("Times-Roman");

    // doc.setFontSize(12);
    // doc.text("Demande de chargement : " + this.load_request_code, 70, initialY + 5);

    // doc.setFontSize(10);
    // doc.text("Role    : " + this.role_code, 20, initialY + 10);
    // doc.text("Date    : " + this.loadRequestInfo.date_creation, 20, initialY + 15);
    // doc.text("Vendeur : " + this.userInfo.user_mobile_code + " - " + this.username, 20, initialY + 20);
    // doc.setFontSize(9);

    // doc.line(10, initialY + 25, 195, initialY + 25); // 85
    // doc.line(10, initialY + 30, 195, initialY + 30); // 90
    // doc.line(10, initialY + 25, 10, initialY + 30); // 90
    // doc.text("N", 12.5, initialY + 28.5); // 88.5
    // doc.line(20, initialY + 25, 20, initialY + 30); // 90
    // doc.text("Code Article", 25, initialY + 28.5); // 88.5
    // doc.line(45, initialY + 25, 45, initialY + 30); // 90
    // doc.text("Désignation", 67.5, initialY + 28.5); // 88.5
    // doc.line(100, initialY + 25, 100, initialY + 30); // 90
    // doc.text("Prix", 107, initialY + 28.5); // 88.5
    // doc.line(120, initialY + 25, 120, initialY + 30); // 90
    // doc.text("QTE Demandée", 123, initialY + 28.5); // 88.5
    // doc.line(145, initialY + 25, 145, initialY + 30); // 90
    // doc.text("QTE Validée", 148, initialY + 28.5); // 88.5
    // doc.line(170, initialY + 25, 170, initialY + 30); // 90
    // doc.text("QTE Chargée", 173, initialY + 28.5); // 88.5
    // doc.line(195, initialY + 25, 195, initialY + 30); // 90
    // var i = 95 + valueToAddToX;
    // doc.setFontSize(10);

    // for (let j = 0; j < this.dataset.length; j++) {
    //   if (j % 30 == 0 && j != 0) {
    //     doc.addPage();
    //     img.src = "./assets/media/logos/companylogo.png";
    //     doc.addImage(img, "png", 150, 5, 50, 30);
    //     doc.setFontSize(9);
    //     //  if (this.domain.dom_name != null) {
    //     //    doc.text(this.domain.dom_name, 10, 10);
    //     //  }
    //     //  if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
    //     //  if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
    //     //  if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
    //     doc.setFontSize(14);
    //     doc.line(10, 35, 200, 35);

    //     doc.setFontSize(12);
    //     doc.text(this.load_request_code, 70, 40);
    //     doc.setFontSize(8);

    //     doc.setFontSize(12);
    //     doc.text("Demande de chargement : " + this.load_request_code, 70, 60);
    //     doc.setFontSize(8);

    //     doc.setFontSize(8);
    //     doc.text("Role    : " + this.role_code, 20, 70);
    //     doc.text("Date    : " + this.loadRequestInfo.date_creation, 20, 75);
    //     doc.text("Vendeur : " + this.userInfo.user_mobile_code + " - " + this.username, 20, 80);

    //     doc.line(10, initialY + 25, 195, initialY + 25); // 85
    //     doc.line(10, initialY + 30, 195, initialY + 30); // 90
    //     doc.line(10, initialY + 25, 10, initialY + 30); // 90
    //     doc.text("N", 12.5, initialY + 28.5); // 88.5
    //     doc.line(20, initialY + 25, 20, initialY + 30); // 90
    //     doc.text("Code Article", 25, initialY + 28.5); // 88.5
    //     doc.line(45, initialY + 25, 45, initialY + 30); // 90
    //     doc.text("Désignation", 67.5, initialY + 28.5); // 88.5
    //     doc.line(100, initialY + 25, 100, initialY + 30); // 90
    //     doc.text("Prix", 107, initialY + 28.5); // 88.5
    //     doc.line(120, initialY + 25, 120, initialY + 30); // 90
    //     doc.text("QTE Demandée", 123, initialY + 28.5); // 88.5
    //     doc.line(145, initialY + 25, 145, initialY + 30); // 90
    //     doc.text("QTE Validée", 148, initialY + 28.5); // 88.5
    //     doc.line(170, initialY + 25, 170, initialY + 30); // 90
    //     doc.text("QTE Chargée", 173, initialY + 28.5); // 88.5
    //     doc.line(195, initialY + 25, 195, initialY + 30); // 90
    //     var i = 95 + valueToAddToX;
    //   }

    //   if (this.printLines[j].product_name.length > 35) {
    //     doc.setFontSize(8);

    //     let line = this.printLines[j];

    //     let desc1 = line.product_name.substring(0, 34);
    //     let ind = desc1.lastIndexOf(" ");
    //     desc1 = line.product_name.substring(0, ind);
    //     let desc2 = line.product_name.substring(ind + 1);

    //     doc.line(10, i - 5, 10, i);
    //     doc.text(String(line.line), 12.5, i - 1);
    //     doc.line(20, i - 5, 20, i);
    //     doc.text(line.product_code, 25, i - 1);
    //     doc.line(45, i - 5, 45, i);
    //     doc.text(desc1, 47, i - 1);
    //     doc.line(100, i - 5, 100, i);
    //     doc.text(String(line.pt_price), 118, i - 1, { align: "right" });
    //     doc.line(120, i - 5, 120, i);
    //     doc.text(String(line.qt_request), 143, i - 1, { align: "right" });
    //     doc.line(145, i - 5, 145, i);
    //     doc.text(String(line.qt_validated), 168, i - 1, { align: "right" });
    //     doc.line(170, i - 5, 170, i);
    //     doc.text(String(line.qt_effected), 193, i - 1, { align: "right" });
    //     doc.line(195, i - 5, 195, i);

    //     i = i + 5;

    //     doc.text(desc2, 47, i - 1);

    //     doc.line(10, i - 5, 10, i);
    //     doc.line(20, i - 5, 20, i);
    //     doc.line(45, i - 5, 45, i);
    //     doc.line(100, i - 5, 100, i);
    //     doc.line(120, i - 5, 120, i);
    //     doc.line(145, i - 5, 145, i);
    //     doc.line(170, i - 5, 170, i);
    //     doc.line(195, i - 5, 195, i);

    //     i = i + 5;
    //   } else {
    //     doc.setFontSize(8);
    //     let line = this.printLines[j];
    //     doc.line(10, i - 5, 10, i);
    //     doc.text(String(line.line), 12.5, i - 1);
    //     doc.line(20, i - 5, 20, i);
    //     doc.text(line.product_code, 25, i - 1);
    //     doc.line(45, i - 5, 45, i);
    //     doc.text(line.product_name, 47, i - 1);
    //     doc.line(100, i - 5, 100, i);
    //     doc.text(String(line.pt_price), 118, i - 1, { align: "right" });
    //     doc.line(120, i - 5, 120, i);
    //     doc.text(String(line.qt_request), 143, i - 1, { align: "right" });
    //     doc.line(145, i - 5, 145, i);
    //     doc.text(String(line.qt_validated), 168, i - 1, { align: "right" });
    //     doc.line(170, i - 5, 170, i);
    //     doc.text(String(line.qt_effected), 193, i - 1, { align: "right" });
    //     doc.line(195, i - 5, 195, i);
    //     i = i + 5;
    //   }
    //   doc.line(10, i - 5, 195, i - 5);
    // }

    // doc.line(10, i - 5, 195, i - 5);
    //console.log(this.dataset, "DATASET");
    //console.log(this.printLines, "Lines");

    this.total=0,
    this.totalCartons = 0,
    this.printLines.map((item) => {
      this.total = Number(this.total) + Number(item.pt_price) * Number(item.qt_effected);
      this.totalCartons = this.totalCartons + item.qt_effected;
    });
    ElectronPrinter3.print3(this.loadRequestLineData, this.load_request_code, this.role_code, this.loadRequestInfo, this.userInfo, this.username, this.printLines, this.userPrinter, this.total, this.totalCartons);

    // saveAs(blob, this.load_request_code + ".pdf");
  }
  playAudio(){
    let audio = new Audio();
    audio.src = "../../../assets/media/error/error.mp3";
    audio.load();
    audio.play();
  }


  prepareGridchar() {
    this.columnDefinitionschar = [
     
      // {
      //   id: "id",
      //   name: "ID",
      //   field: "id",
      //   minWidth: 80,
      //   maxWidth: 80,
      //   type: FieldType.number,
      // },

      {
        id: "chariot_nbr",
        name: "N° Chariot",
        field: "chariot_nbr",
        minWidth: 100,
        maxWidth: 100,
        type: FieldType.integer,
      },

      {
        id: "idprint",
        field: "idprint",
        excludeFromHeaderMenu: true,
        formatter: (row, cell, value, columnDef, dataContext) => {
          // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
          return `
            <a class="btn btn-sm btn-clean btn-icon mr-2" title="Impression Etiquette" >
                 <i class="flaticon2-printer" ></i>
                 
             </a>
             `;
        },
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.printLines= this.datasetchardet
          console.log("hhhhoun",this.printLines)
          this.nchariot = args.dataContext.chariot_nbr
       this.printpdf()
        },
      },

          ];

    this.gridOptionschar = {
      enableSorting: false,
      enableCellNavigation: true,
      enableExcelCopyBuffer: false,
      enableFiltering: false,
      autoEdit: false,
      autoHeight: false,
      enableAutoResize: false,
      // enableRowSelection: true,
      enableCheckboxSelector: true,
    };

    this.datasetchar = [];
    this.loadRequestService.getByChariot({load_request_code : this.load_request_code}).subscribe(
      (response: any) => (this.datasetchar = response.data),
      (error) => {
          this.datasetchar = []
      },
      () => {}
  )
  }

  angularGridReadychar(angularGrid: AngularGridInstance) {
    this.angularGridchar = angularGrid;
    this.dataViewchar = angularGrid.dataView;
    this.gridchar = angularGrid.slickGrid;
    this.gridServicechar = angularGrid.gridService;
    
    this.gridchar.invalidate();
    this.gridchar.render();
  }
  Openchariot(content){
    this.prepareGridchar();
    this.prepareGridchardet();
    this.modalService.open(content, { size: "lg" });
  }
  onSelectedRowsChangedchar(e, args) {
    // console.log('indexs', args.rows);
    let updateItem = this.gridServicechar.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridchar) {
      args.rows.map((idx) => {
        const item = this.gridchar.getDataItem(idx);
    this.chariotnum = item.chariot_nbr
    
    this.loadRequestService.getByChariotDet({load_request_code :this.load_request_code, chariot_nbr : this.chariotnum }).subscribe(

      (response: any) => {
        this.datasetchardet = response.data
        this.dataViewchardet.setItems(this.datasetchardet)
      },)
    
    });
  }
  }

  prepareGridchardet() {
    this.columnDefinitionschardet = [
     
      {
        id: "line",
        name: "Ligne",
        field: "line",
        minWidth: 20,
        maxWidth: 40,
        type: FieldType.number,
      },

      {
        id: "code_prod",
        name: "Code produit",
        field: "code_prod",
        minWidth:60,
        maxWidth:60,
        type: FieldType.text,
      },

      {
        id: "desc_prod",
        name: "Description",
        field: "desc_prod",
        minWidth: 100,
        maxWidth: 100,
        type: FieldType.text,
      },
      {
        id: "lot",
        name: "N° Lot",
        field: "lot",
        minWidth: 100,
        maxWidth: 100,
        type: FieldType.text,
      },
      {
        id: "quantity",
        name: "QTE",
        field: "quantity",
        minWidth: 20,
        maxWidth: 20,
        type: FieldType.text,
      },
      {
        id: "serie",
        name: "N° série",
        field: "serie",
        minWidth: 40,
        maxWidth: 40,
        type: FieldType.text,
      },

          ];

    this.gridOptionschardet = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      autoEdit: false,
      autoHeight: false,
      
      enableAutoResize: true,
      // enableRowSelection: true,
      
    };

    this.datasetchar = [];
    
  
  }

  angularGridReadychardet(angularGrid: AngularGridInstance) {
    this.angularGridchardet = angularGrid;
    this.dataViewchardet = angularGrid.dataView;
    this.gridchardet = angularGrid.slickGrid;
    this.gridServicechardet = angularGrid.gridService;
    this.gridchar.invalidate();
    this.gridchar.render();
  }
}
