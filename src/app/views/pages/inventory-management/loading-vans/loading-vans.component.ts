import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import { Column, GridOption, Formatter, Editor, Editors, AngularGridInstance, EditorValidator, EditorArgs, GridService, Formatters, FieldType, OnEventArgs } from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of, Observer } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
// Layout
import { SubheaderService, LayoutConfigService } from "../../../../core/_base/layout";
// CRUD
import { LayoutUtilsService, TypesUtilsService, MessageType } from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";

import { InventoryManagementService, printInventory, InventoryTransactionService, RoleService } from "../../../../core/erp";

@Component({
  selector: "kt-loading-vans",
  templateUrl: "./loading-vans.component.html",
  styleUrls: ["./loading-vans.component.scss"],
})
export class LoadingVansComponent implements OnInit {
  chargeForm: FormGroup;
  productLotForm: FormGroup;
  hasFormErrors = false;
  isExist = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;

  role_code: any;
  role: any;
  load_request_code: any;
  roles: any[] = [];
  loadRequests: any[] = [];
  loadRequestData: any[] = [];
  loadRequest: any;
  lots: any[] = [];
  selectedLotsIndexes: any[] = [];
  selected_lot_code: any;

  currentPageCode: any;
  currentPageIndex: any;
  currentProductCode: any;
  selectedLotCode: any;

  pageCodeToAddIn =""
  productCodeToAdd=""
  productDescToAdd=""

  // GRID
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  showSpinner : Boolean =  false;

  pageCodeForAddition = ""
  
user: any

  constructor(config: NgbDropdownConfig, private tagFB: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog, private layoutUtilsService: LayoutUtilsService, private inventoryManagementService: InventoryManagementService, private inventoryTransactionService: InventoryTransactionService, private roleService: RoleService, private modalService: NgbModal) {
    config.autoClose = true;
    this.prepareGrid();
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user = JSON.parse(localStorage.getItem("user"));
    this.prepareRoles();
    this.createForm();
    this.createForm2();
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);

    this.chargeForm = this.tagFB.group({
      role_code: [this.role_code],
      load_request_code: [this.load_request_code],
    });
  }

  resetForm() {}

  time = new Observable<string>((observer: Observer<string>) => {
    setInterval(() => {
      observer.next("");
    }, 1000);
  });

  createForm2() {
    this.loadingSubject.next(false);

    this.productLotForm = this.tagFB.group({
      selected_lot_code: [this.selected_lot_code],
    });
  }
  // sets grid data for lots
  open(content, product_code, page_code) {
    this.currentPageCode = page_code;
    this.currentProductCode = product_code;
    this.currentPageIndex = this.loadRequestData.findIndex((page) => {
      return page.page_code === page_code;
    });
    const ld_loc = this.loadRequest.role_loc_from;
    const ld_site = this.loadRequest.role_site;
    this.inventoryManagementService.getProductLots(ld_loc, ld_site, product_code).subscribe(
      (response: any) => {
        this.dataset = response.data;
        this.dataView.setItems(this.dataset);
      },
      (error) => {
        this.dataset = [];
      },
      () => {}
    );
    this.modalService.open(content, { size: "lg" });
  }

  //reste form
  reset() {
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    const details = [];
    const lines = [];
    this.loadRequestData.forEach((loadRequest) => {
      let sum = 0;
      loadRequest.selectedProducts.forEach((product) => {
        if (product.lots.length > 0) {
          product.lots.forEach((lot) => {
            sum += +lot.qt_effected;
            details.push({
              product_code: product.product_code,
              load_request_code: this.load_request_code,
              lot: lot.lot_code,
              qt_effected: lot.qt_effected,
              pt_price: product.pt_price,
            });
          });

          lines.push({
            product_code: product.product_code,
            load_request_code: this.load_request_code,
            qt_effected: sum,
          });
        }
      });
    });

    this.inventoryManagementService.createLoadRequestDetails(details, lines).subscribe(
      (response: any) => {
        this.loadRequestData = [];
        this.load_request_code = "";
        this.role_code = "";
        this.createForm();
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
  }

  onSaveCharge() {
    const details = [];
    const lines = [];
    let detailss = [];

    this.loadRequestData.forEach((loadRequest) => {
      let sum = 0;

      loadRequest.selectedProducts.forEach((product) => {
        if (product.lots.length > 0) {
          let i = 1;
          product.lots.forEach((lot) => {
            sum += +lot.qt_effected;

            // CREATE DETAILS LINE
            details.push({
              product_code: product.product_code,
              load_request_code: this.load_request_code,
              lot: lot.lot_code,
              qt_effected: lot.qt_effected,
              pt_price: product.pt_price,
              line: i,
            });
            // DETAIL LINE FOR ISSTR
            detailss.push({
              tr_line: i,
              tr_part: product.product_code,
              tr_serial: lot.lot_code,
              tr_qty_loc: lot.qt_effected,
              tr_um: product.pt_um,
              tr_status: lot.ld_status,
              tr_expire: lot.ld_expire,
              tr_um_conv: 1,
              tr_ref: null,
            });
            i++;
          });

          // CREATE LINE
          lines.push({
            product_code: product.product_code,
            load_request_code: this.load_request_code,
            qt_effected: sum,
          });
        }
      });
    });

    // IssTr
    let nlot = this.load_request_code;
    let it = {
      tr_site: this.loadRequest.role_site,
      tr_loc: this.role.role_loc_from, // loc from , for unload : loc
      tr_ref_site: this.loadRequest.role_site,
      tr_ref_loc: this.role.role_loc, // loc , for unload : loc from
      tr_effdate: new Date(),
      tr_nbr: nlot,
    };

    this.inventoryManagementService.createLoadRequestDetailsUpdateStatus(details, lines, this.load_request_code).subscribe(
      (response: any) => {
        this.loadRequestData = [];
        this.load_request_code = "";
        this.role_code = "";

        this.createForm();
        let detail = detailss;

        // isstr
        this.inventoryTransactionService.addTr({ nlot, it, detail }).subscribe(
          (response: any) => {},
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
  }

  goBack() {
    this.loadingSubject.next(false);
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  addRow(page_code){
    let indexPage = -1
    let indexProduct = -1
    if(this.pageCodeForAddition ==""){
      indexPage = this.loadRequestData.findIndex(page=>{
        return page.page_code == page_code;
      })
    }else{
      indexPage = this.loadRequestData.findIndex(page=>{
        return page.page_code == this.pageCodeForAddition;
      })
    }
    // console.log("indexProduct : "+ indexPage)

    // const indexProduct = this.loadRequestData[indexPage].unselectedProducts.findIndex(product=>{
       
    //    return product.product_code == this.productCodeToAdd
    // })
    if(this.productDescToAdd == ""){
      indexProduct = 0
    }else{
      indexProduct = this.loadRequestData[indexPage].unselectedProducts.findIndex(product=>{
        // console.log(product.pt_desc1 + " \t "+ this.productDescToAdd)
        
        return product.pt_desc1 == this.productDescToAdd
      })
    }
      
    // console.log("indexProduct : "+ indexProduct)

    console.log("********************")
    // SEARCH 
   


    var prod = this.loadRequestData[indexPage].unselectedProducts[indexProduct]
    console.log(prod.wasAdded)
    if(prod.wasAdded){
      alert("Ce produit a déjà été ajouté")
      return ; 
    }else{
      this.loadRequestData[indexPage].selectedProducts.push(
        // this.loadRequestData[indexPage].unselectedProducts[indexProduct]
        prod
      )
      this.loadRequestData[indexPage].unselectedProducts[indexProduct].wasAdded = true
    }
    
    this.pageCodeForAddition = ""
    this.productDescToAdd = ""
    return;
    
    delete this.loadRequestData[indexPage].unselectedProducts[indexProduct]
   
    if(this.loadRequestData[indexPage].unselectedProducts.length == 0){
      this.loadRequestData[indexPage].hasAddProduct = false
    }

    this.pageCodeForAddition = ""
    this.productDescToAdd = ""
  }

  onSelectLot(lot_code) {
    this.selectedLotCode = lot_code;
  }

  // const index = this.loadRequestData.findIndex(page=>{
  //   return page.page_code == page_code;
  // })
  onAddProductLine() {
    const pageIndex = this.loadRequestData.findIndex((page) => {
      return (page.page_code = this.currentPageCode);
    });
    const productIndex = this.loadRequestData[pageIndex].selectedProducts.findIndex((product) => {
      return (product.product_code = this.currentProductCode);
    });
    const lotIndex = this.lots.findIndex((lot) => {
      return (lot.ld_lot = this.selectedLotCode);
    });

    this.loadRequestData[pageIndex].selectedProducts[productIndex].lots.push({
      lot_code: this.selectedLotCode,
      // qnt_lot : this.lots[lotIndex].ld_qty_oh
    });
    // console.log(this.gridService.getDataItemByRowIndex(0))
  }

  onSelectProductToAdd(product_code,page_code ){
    this.pageCodeToAddIn  = page_code
    this.pageCodeForAddition = page_code
    this.productCodeToAdd =product_code
    this.productDescToAdd = product_code
    // console.log(this.pageCodeForAddition,this.productCodeToAdd)
    // console.log("title of selected product is : \t"+ this.productDescToAdd)
  }

  // FORMS DATA FUNCTIONS
  prepareLoadRequestData(load_request_code) {
    this.showSpinner = true;

    this.inventoryManagementService.getLoadRequestData(load_request_code).subscribe(
      (response: any) => {
        let data = response.loadRequestData;

        data.forEach((page) => {
          if (page.selectedProducts.length > 0) {
            page.selectedProducts.forEach((prod) => {
              prod.lots.forEach((lot) => {
                lot.lineIsOld = true;
                lot.oldQnty = lot.qt_effected;
              });
            });
          }
        });

        this.loadRequestData = data;
        console.log(this.loadRequestData);
        this.loadRequest = response.data;
        this.role = response.role;
        this.showSpinner = false;
      },
      (error) => {
        this.loadRequestData = [];
      },
      () => {}
    );
  }

  onSelectLoadRequest(load_request_code) {
    this.showSpinner = true;
    this.prepareLoadRequestData(load_request_code);
    this.load_request_code = load_request_code;
  }

  prepareRoles() {
    if ((this.user.usrd_site = "*")) {
      this.roleService.getAllRoles().subscribe(
        (response: any) => {
          this.roles = response.data;
          console.log(this.roles);
        },
        (error) => {
          this.roles = [];
        },
        () => {}
      );
    } else {
      this.roleService.getBy({ role_site: this.user.usrd_site }).subscribe(
        (response: any) => {
          this.roles = response.data;
          console.log(this.roles);
        },
        (error) => {
          this.roles = [];
        },
        () => {}
      );
    }
  }

  prepareLoadRequests(role_code) {
    this.inventoryManagementService.getLoadRequests(role_code).subscribe(
      (response: any) => {
        this.loadRequests = response.data;
      },
      (error) => {
        this.loadRequests = [];
      },
      () => {}
    );
  }

  onSelectRole(role_code) {
    console.log(role_code);
    this.prepareLoadRequests(role_code);
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
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        // formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        // onCellClick: (e: Event, args: OnEventArgs) => {
        //   if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
        //     this.angularGrid.gridService.deleteItem(args.dataContext);
        //   }
        // },
      },

      {
        id: "ld_lot",
        name: "Desc Lot",
        field: "ld_lot",
        minWidth: 100,
        maxWidth: 100,
        selectable: true,
      },

      // {
      //   id: "mvid",
      //   field: "cmvid",
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.infoIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //     // this.row_number = args.row;
      //     let element: HTMLElement = document.getElementById(
      //       "openItemsGrid"
      //     ) as HTMLElement;
      //     element.click();
      //   },
      // },
      {
        id: "ld_qty_oh",
        name: "QTE Stock",
        field: "ld_qty_oh",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
      },
      // {
      //     id: "tr_price",
      //     name: "Prix unitaire",
      //     field: "tr_price",
      //     sortable: true,
      //     width: 80,
      //     filterable: false,
      //     //type: FieldType.float,
      //     editor: {
      //         model: Editors.float,
      //         params: { decimalPlaces: 2 }
      //     },
      //     formatter: Formatters.decimal,
      // },
      {
        id: "ld_expire",
        name: "Expire",
        field: "ld_expire",
        sortable: true,
        width: 80,
        filterable: false,
        formatter: Formatters.dateIso,

        type: FieldType.dateIso,
      },
      //   {
      //     id: "qty_selected",
      //     name: "QTE Selected",
      //     field: "qty_selected",
      //     sortable: true,
      //     width: 80,
      //     filterable: false,
      //     type: FieldType.integer,
      //     editor: {
      //       model: Editors.text,
      //     },
      // },
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
      formatterOptions: {
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: true,

        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,

        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: " ", // can be any of ',' | '_' | ' ' | ''
      },
    };

    this.dataset = [];
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
    this.dataView.getItemMetadata = this.updateItemMetadata(this.dataView.getItemMetadata);
    this.grid.invalidate();
    this.grid.render();
  }

  updateItemMetadata(previousItemMetadata: any) {
    const newCssClass = "highlight-bg";
    return (rowNumber: number) => {
      const item = this.dataView.getItem(rowNumber);
      let meta = {
        cssClasses: "",
      };
      if (typeof previousItemMetadata === "object") {
        meta = previousItemMetadata(rowNumber);
      }

      if (meta && item && item.etat_service) {
        const state = item.etat_service;
        if (state === "true") {
          meta.cssClasses = (meta.cssClasses || "") + " " + newCssClass;
        }
      }

      return meta;
    };
  }

  // ROWS FUNCTIONS
  onSelectedRowsChanged(e, args) {
    this.selectedLotsIndexes = [];

    // SELECTED ROWS
    this.selectedLotsIndexes = args.rows;

    // FIND PAGE INDEX IN LOAD REQUEST DATA
    const pageIndex = this.loadRequestData.findIndex((page) => {
      return page.page_code === this.currentPageCode;
    });

    // FIND PRODUCT INDEX IN SELECTED PRODUCTS OF THE SELECTED PAGE
    const productIndex = this.loadRequestData[pageIndex].selectedProducts.findIndex((product) => {
      return product.product_code === this.currentProductCode;
    });

    //
    this.selectedLotsIndexes.forEach((index) => {
      let lotIndexStored = -1;

      lotIndexStored = this.loadRequestData[pageIndex].selectedProducts[productIndex].lots.findIndex((lot) => {
        return lot.lot_code == this.gridService.getDataItemByRowIndex(index).ld_lot;
      });

      if (lotIndexStored == -1) {
        // console.log(this.gridService.getDataItemByRowIndex(index).ld_lot)
        this.loadRequestData[pageIndex].selectedProducts[productIndex].lots.push({
          lot_code: this.gridService.getDataItemByRowIndex(index).ld_lot,
          qnt_lot: this.gridService.getDataItemByRowIndex(index).ld_qty_oh,
          qt_effected: this.gridService.getDataItemByRowIndex(index).qty_selected,
          lineIsOld: false,
          oldQnty: 0,
        });
      }
    });
  }

  onInputChanged(value, pageCode, productCode, lotCode) {
    // FIND PAGE INDEX IN LOAD REQUEST DATA
    const pageIndex = this.loadRequestData.findIndex((page) => {
      return page.page_code === pageCode;
    });

    // FIND PRODUCT INDEX IN SELECTED PRODUCTS OF THE SELECTED PAGE
    const productIndex = this.loadRequestData[pageIndex].selectedProducts.findIndex((product) => {
      return product.product_code === productCode;
    });

    const lotIndex = this.loadRequestData[pageIndex].selectedProducts[productIndex].lots.findIndex((lot) => {
      return lot.lot_code == lotCode;
    });

    // UPDATED QT VALIDATED IN LOT
    this.loadRequestData[pageIndex].selectedProducts[productIndex].lots[lotIndex].qt_effected = value;
    console.log(this.loadRequestData[pageIndex].selectedProducts[productIndex].lots);

    // UPDATED QT VALIDATED IN  PRODUCT OBJ
    let qntEffected = 0;
    this.loadRequestData[pageIndex].selectedProducts[productIndex].lots.forEach((lot) => {
      // console.log(lot)
      qntEffected += +lot.qt_effected;
    });
    this.loadRequestData[pageIndex].selectedProducts[productIndex].qt_effected = qntEffected;
    console.log("total : ", qntEffected);

    // const indexPage = this.loadRequestData.findIndex(loadRequest=>{
    //   return loadRequest.page_code  === pageCode
    // })
    // console.log('pageCodeIndex:' + indexPage)
    // const indexProduct = this.loadRequestData[indexPage].products.findIndex(product=>{
    //   return product.product_code === prodCode
    // })
    // console.log('prodCodeIndex:' + indexProduct)
    // this.loadRequestData[indexPage].products[indexProduct].qt_validated = +value
    // console.log(this.loadRequestData[indexPage].products[indexProduct])
  }

  updateQuantity(value, pageCode, productCode, lotCode) {
    console.log(value);

    // FIND PAGE INDEX IN LOAD REQUEST DATA
    const pageIndex = this.loadRequestData.findIndex((page) => {
      return page.page_code === pageCode;
    });

    // FIND PRODUCT INDEX IN SELECTED PRODUCTS OF THE SELECTED PAGE
    const productIndex = this.loadRequestData[pageIndex].selectedProducts.findIndex((product) => {
      return product.product_code === productCode;
    });

    const lotIndex = this.loadRequestData[pageIndex].selectedProducts[productIndex].lots.findIndex((lot) => {
      return lot.lot_code == lotCode;
    });

    // UPDATED QT VALIDATED IN LOT

    if (value > 0) {
      this.loadRequestData[pageIndex].selectedProducts[productIndex].lots[lotIndex].qt_effected = value;
    } else {
      let oldValue = this.loadRequestData[pageIndex].selectedProducts[productIndex].lots[lotIndex].oldQnty;
      this.loadRequestData[pageIndex].selectedProducts[productIndex].lots[lotIndex].qt_effected = oldValue;
    }
    console.log(this.loadRequestData[pageIndex].selectedProducts[productIndex].lots);

    // UPDATED QT VALIDATED IN  PRODUCT OBJ
    let qntEffected = 0;
    this.loadRequestData[pageIndex].selectedProducts[productIndex].lots.forEach((lot) => {
      // console.log(lot)
      qntEffected += +lot.qt_effected;
    });
    this.loadRequestData[pageIndex].selectedProducts[productIndex].qt_effected = qntEffected;
    console.log("total : ", qntEffected);

    // const indexPage = this.loadRequestData.findIndex(loadRequest=>{
    //   return loadRequest.page_code  === pageCode
    // })
    // console.log('pageCodeIndex:' + indexPage)
    // const indexProduct = this.loadRequestData[indexPage].products.findIndex(product=>{
    //   return product.product_code === prodCode
    // })
    // console.log('prodCodeIndex:' + indexProduct)
    // this.loadRequestData[indexPage].products[indexProduct].qt_validated = +value
    // console.log(this.loadRequestData[indexPage].products[indexProduct])
  }
}
