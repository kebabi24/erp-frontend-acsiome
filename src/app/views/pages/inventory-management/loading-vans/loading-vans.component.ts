import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig,NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"


// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  EditorValidator,
  EditorArgs,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
// Layout
import {
    SubheaderService,
    LayoutConfigService,
} from "../../../../core/_base/layout"
// CRUD
import {
    LayoutUtilsService,
    TypesUtilsService,
    MessageType,
} from "../../../../core/_base/crud"
import { MatDialog } from "@angular/material/dialog"

import { InventoryManagementService, printInventory } from "../../../../core/erp"

@Component({
  selector: 'kt-loading-vans',
  templateUrl: './loading-vans.component.html',
  styleUrls: ['./loading-vans.component.scss']
})
export class LoadingVansComponent implements OnInit {

  chargeForm: FormGroup
  productLotForm:FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

  role_code : any
  load_request_code : any
  roles: any[] = []
  loadRequests: any[] = []
  loadRequestData: any[] = []
  loadRequest : any 
  lots: any[] = []
  selectedLotsIndexes: any[] = []
  selected_lot_code :any 

  currentPageCode : any
  currentPageIndex : any
  currentProductCode: any 
  selectedLotCode : any

  pageCodeToAddIn : any 
  productCodeToAdd: any

  // GRID
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  


  constructor(
      config: NgbDropdownConfig,
      private tagFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private inventoryManagementService: InventoryManagementService,
      private modalService: NgbModal
  ) {
      config.autoClose = true
      this.prepareGrid()
  }
  ngOnInit(): void {
      this.loading$ = this.loadingSubject.asObservable()
      this.loadingSubject.next(false)
      this.prepareRoles()
      this.createForm()
      this.createForm2()
  }

  //create form
  createForm() {
      this.loadingSubject.next(false)

      this.chargeForm = this.tagFB.group({
        role_code :[this.role_code],
        load_request_code:[this.load_request_code]
      })
  }

  createForm2() {
    this.loadingSubject.next(false)

    this.productLotForm = this.tagFB.group({
      selected_lot_code : [this.selected_lot_code]
    })
  }
  // sets grid data for lots
  open(content,product_code , page_code) {
    console.log(product_code,page_code)
    this.currentPageCode = page_code 
    this.currentProductCode = product_code
    this.currentPageIndex = this.loadRequestData.findIndex(page =>{
      return page.page_code === page_code
    })
    console.log(this.currentPageIndex)
    const ld_loc = this.loadRequest.role_loc
    const ld_site = this.loadRequest.role_site
    this.inventoryManagementService.getProductLots(ld_loc,ld_site,product_code).subscribe(
      (response: any) => {
        this.dataset = response.data
        this.dataView.setItems(this.dataset)
      },
      (error) => {
        this.dataset = []
    
      },
      () => {}
      )
    this.modalService.open(content, { size: "lg" })
  }

  //reste form
  reset() {
      this.createForm()
      this.hasFormErrors = false
  }
  // save data
  onSubmit() {
     const details = []
     const lines = []
     this.loadRequestData.forEach(loadRequest => {
      loadRequest.selectedProducts.forEach(product => {
        // if(product.lots.length >0){
        //   product.lots.forEach(lot =>{
        //     details.push({
        //       "product_code":"EM000001",
        //       "load_request_code":"LOADRQR2-003"
        //     })
        //   })
        // }
      })
      
     })

     this.inventoryManagementService.createLoadRequestDetails(details,lines).subscribe(

      (response: any) => {
        console.log(response)
      },
      (error) => {
        // this.loadRequestData = []
        console.log(error)
      },
      () => {
        this.layoutUtilsService.showActionNotification(
            "Load Request Details Updated",
            MessageType.Create,
            10000,
            true,
            true
        )
        this.loadingSubject.next(false)
        // this.router.navigateByUrl("/customers-mobile/cluster-create")
    }
    )
     
  }

  onSaveCharge(){
    const details = []
    const lines = []
     this.loadRequestData.forEach(loadRequest => {
      loadRequest.selectedProducts.forEach(product => {
        // if(product.lots.length >0){
        //   product.lots.forEach(lot =>{
        //     details.push({
        //       "product_code":"EM000001",
        //       "load_request_code":"LOADRQR2-003"
        //     })
        //   })
        // }
        if(product.qt_effected >0){
          lines.push({
            load_request_code:this.load_request_code,
            product_code : product.pt_part,
            qt_effected : product.qt_effected
          })
        }
      })
      
     })
     console.log(lines)

     this.inventoryManagementService.createLoadRequestDetails(details,lines).subscribe(

      (response: any) => {
        console.log(response)
      },
      (error) => {
        // this.loadRequestData = []
        console.log(error)
      },
      () => {
        this.layoutUtilsService.showActionNotification(
            "Load Request Details Updated",
            MessageType.Create,
            10000,
            true,
            true
        )
        this.loadingSubject.next(false)
        // this.router.navigateByUrl("/customers-mobile/cluster-create")
    }
    )
  }
  
  goBack() {
      this.loadingSubject.next(false)
      const url = `/`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
  

  addRow(){
    const indexPage = this.loadRequestData.findIndex(page=>{
      return page.page_code == this.pageCodeToAddIn;
    })
    const indexProduct = this.loadRequestData[indexPage].unselectedProducts.findIndex(product=>{
      console.log(product.product_code +"\t"+this.productCodeToAdd )
      return product.product_code = this.productCodeToAdd
    })
    // console.log(indexProduct)
    // this.loadRequestData[indexPage].selectedProducts.push(
    //   this.loadRequestData[indexPage].unselectedProducts[indexProduct]
    // )
    // delete this.loadRequestData[indexPage].unselectedProducts[indexProduct]
    // if(this.loadRequestData[indexPage].unselectedProducts[indexProduct].lengt == 0){
    //   this.loadRequestData[indexPage].hasAddProduct = false
    // }
    // console.log(indexProduct)
    // console.log(this.loadRequestData[indexPage].unselectedProducts)
    // console.log(this.loadRequestData[indexPage].selectedProducts)
  }

  
  onSelectLot(lot_code){
    this.selectedLotCode = lot_code
  }


  // const index = this.loadRequestData.findIndex(page=>{
  //   return page.page_code == page_code;
  // })
  onAddProductLine(){
    const pageIndex = this.loadRequestData.findIndex(page=>{
      return page.page_code = this.currentPageCode
    } )
    const productIndex = this.loadRequestData[pageIndex].selectedProducts.findIndex(product=>{
      return product.product_code = this.currentProductCode
    })
    const lotIndex = this.lots.findIndex(lot=>{
      return lot.ld_lot = this.selectedLotCode
    })

    this.loadRequestData[pageIndex].selectedProducts[productIndex].lots.push({
      lot_code : this.selectedLotCode,
      // qnt_lot : this.lots[lotIndex].ld_qty_oh
    })
    // console.log(this.gridService.getDataItemByRowIndex(0))
  }

  onSelectProductToAdd(product_code,page_code){
    this.pageCodeToAddIn  = page_code
    this.productCodeToAdd =product_code
  }

  // FORMS DATA FUNCTIONS 
  prepareLoadRequestData(load_request_code){
    this.inventoryManagementService.getLoadRequestData(load_request_code).subscribe(
  
        (response: any) => {
          this.loadRequestData = response.loadRequestData
          this.loadRequest = response.data
        },
        (error) => {
          this.loadRequestData = []
        },
        () => {}
    )
  }

  onSelectLoadRequest(load_request_code){
    this.prepareLoadRequestData(load_request_code)
    this.load_request_code = load_request_code
  }

  prepareRoles(){
    this.inventoryManagementService.getRoles('administrateur').subscribe(
        
        (response: any) => {
          this.roles = response.data
        },
        (error) => {
          this.roles = []
        },
        () => {}
    )
  }

  prepareLoadRequests(role_code){
    this.inventoryManagementService.getLoadRequests(role_code).subscribe(
        (response: any) => {
          this.loadRequests = response.data
        },
        (error) => {
            this.loadRequests = []
        },
        () => {}
    )
  }

  onSelectRole(role_code){
    this.prepareLoadRequests(role_code)
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
      {
        id: "qty_selected",
        name: "QTE Selected",
        field: "qty_selected",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.integer,
        editor: {
          model: Editors.text,
        },
    },
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      rowSelectionOptions: {
        selectActiveRow: false
      },
      formatterOptions: {
        
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: true,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
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
    const newCssClass = 'highlight-bg';
    return (rowNumber: number) => {
      const item = this.dataView.getItem(rowNumber);
      let meta = {
        cssClasses: ''
      };
      if (typeof previousItemMetadata === 'object') {
        meta = previousItemMetadata(rowNumber);
      }
  
      if (meta && item && item.etat_service) {
        const state = item.etat_service;
        if (state === "true") {
          meta.cssClasses = (meta.cssClasses || '') + ' ' + newCssClass;
        }
      }
  
      return meta;
    };
  }


  // ROWS FUNCTIONS 
  onSelectedRowsChanged(e, args) {
    this.selectedLotsIndexes =[]
    
    // SELECTED ROWS 
    this.selectedLotsIndexes = args.rows;

    // FIND PAGE INDEX IN LOAD REQUEST DATA 
    const pageIndex = this.loadRequestData.findIndex(page=>{
      return page.page_code === this.currentPageCode
    })

    // FIND PRODUCT INDEX IN SELECTED PRODUCTS OF THE SELECTED PAGE 
    const productIndex = this.loadRequestData[pageIndex].selectedProducts.findIndex(product=>{
      return product.product_code === this.currentProductCode
    })
    
    // 
    this.selectedLotsIndexes.forEach(index => {

      let lotIndexStored = -1

      lotIndexStored  = this.loadRequestData[pageIndex].selectedProducts[productIndex].lots.findIndex(lot=>{
        return lot.lot_code == this.gridService.getDataItemByRowIndex(index).ld_lot
      })

      if(lotIndexStored == -1){
        // console.log(this.gridService.getDataItemByRowIndex(index).ld_lot)
        this.loadRequestData[pageIndex].selectedProducts[productIndex].lots.push({
        lot_code : this.gridService.getDataItemByRowIndex(index).ld_lot,
        qnt_lot : this.gridService.getDataItemByRowIndex(index).ld_qty_oh,
        qt_effected : this.gridService.getDataItemByRowIndex(index).qty_selected
        })
      }
      
   });
  }

  onInputChanged(value,pageCode,productCode,lotCode){
    // console.log('value:' + value)
    // console.log('page code: '+ pageCode)
    // console.log('product code: '+ productCode)
    // console.log('lot code: '+ lotCode)
    

    // FIND PAGE INDEX IN LOAD REQUEST DATA 
    const pageIndex = this.loadRequestData.findIndex(page=>{
      return page.page_code === pageCode
    })

    // FIND PRODUCT INDEX IN SELECTED PRODUCTS OF THE SELECTED PAGE 
    const productIndex = this.loadRequestData[pageIndex].selectedProducts.findIndex(product=>{
      return product.product_code === productCode 
    }) 


    const lotIndex  = this.loadRequestData[pageIndex].selectedProducts[productIndex].lots.findIndex(lot=>{
      return lot.lot_code == lotCode
    })

    // UPDATED QT VALIDATED IN LOT 
    this.loadRequestData[pageIndex].selectedProducts[productIndex].lots[lotIndex].qt_effected= value
    console.log(this.loadRequestData[pageIndex].selectedProducts[productIndex].lots)
    
    // UPDATED QT VALIDATED IN  PRODUCT OBJ
    let qntEffected = 0
    this.loadRequestData[pageIndex].selectedProducts[productIndex].lots.forEach(lot =>{
      // console.log(lot)
      qntEffected += +lot.qt_effected 
    })
    this.loadRequestData[pageIndex].selectedProducts[productIndex].qt_effected = qntEffected
    console.log('total : ',qntEffected)
    

    

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