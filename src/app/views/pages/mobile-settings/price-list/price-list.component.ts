import { array } from '@amcharts/amcharts4/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import { AngularGridInstance, Column, FieldType, GridOption, OnEventArgs, GridService, Editors, thousandSeparatorFormatted, Formatters } from 'angular-slickgrid';

import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { MobileServiceService, MobileService, RoleService, ItineraryService, ItemService } from "../../../../core/erp"
import {   MobileSettingsService} from "../../../../core/erp"
@Component({
  selector: 'kt-price-list',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.scss']
})
export class PriceListComponent implements OnInit {
  service: MobileService
  serviceForm: FormGroup
  createServiceForm: FormGroup
  hasFormErrors = false
  isExist = false
  showUpdateButton = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  services: []
  roles : string[] = []
  itinerary: string[] = []
  dataset: any[] = []
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  gridObj: any
  angularGrid: AngularGridInstance
  gridService: GridService
  message: any
  column : Column
  grid: any
  dataView: any
  selectedRow: any
  isSelected = false
 

  selectedProducts: any[];
  products: any = [];
  oldProducts : any = []
  oldProductsForGrid : any = []
  
  public nodes = [];
  confirmDelete: boolean;
  alertWarning: string;

  priceListForm: FormGroup;

  listes: [];
  columnDefinitionsl: Column[] = [];
  gridOptionsl: GridOption = {};
  gridObjl: any;
  angularGridl: AngularGridInstance;

  items: []
  columnDefinitions4: Column[] = []
  gridOptions4: GridOption = {}
  gridObj4: any
  angularGrid4: AngularGridInstance
row_number;
  constructor(
    config: NgbDropdownConfig,
        private serviceF : FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private modalService: NgbModal,
        private mobileSettingsService : MobileSettingsService,
        private itemService : ItemService,
        private formBuilder: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
        
  ) { 
        config.autoClose = true
        this.prepareGrid()
        this.createPriceListForm()
        
  }

  
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.createPriceListForm()
        
  }

  onChangeCode() {
    const controls = this.priceListForm.controls
    const pricelist_code = controls.pricelist_code.value
    

      this.mobileSettingsService.getPriceList(pricelist_code).subscribe(
          (res: any) => {
            if (res.data) {
              this.isExist =true
              this.oldProducts = res.data
                
            } else { 
              this.isExist = false
               
   
          }
               
      })
  } 

  
  onSubmit() {
    const controls = this.priceListForm.controls
    const pricelist_code = controls.pricelist_code.value
    let price_list_data = []
    this.products.forEach(product => {
      price_list_data.push({
        pricelist_code:pricelist_code,
        product_code : product.pt_part,
        description: product.description,
        salesprice: parseFloat(product.salesprice),
        returnprice: parseFloat(product.returnprice),
      })
    });
    
   
    
    
     this.mobileSettingsService.createPriceList(
      price_list_data
       ).subscribe(
       (response: any) => {
        this.resetData()
        this.createPriceListForm()
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

 

  goBack() {
    this.loadingSubject.next(false)
    const url = `/service`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}





createPriceListForm() {
  this.loadingSubject.next(false)
  this.priceListForm = this.formBuilder.group({
    pricelist_code: [ '', Validators.required],
  })
}

resetData(){
  this.products.forEach(product => { 
    product.description =""
    product.salesprice = 0
    product.returnprice=0
  
  });
}


angularGridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
    // if you want to change background color of Duration over 50 right after page load,
    // you would put the code here, also make sure to re-render the grid for the styling to be applied right away
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

updateData(){
  
  const controls = this.priceListForm.controls
  const pricelist_code = controls.pricelist_code.value
  let data = []
  this.oldProductsForGrid.forEach(prod => {
    data.push({
      pricelist_code:pricelist_code,
      product_code : prod.pt_part,
      description: prod.description,
      salesprice: parseFloat(prod.salesprice),
      returnprice: parseFloat(prod.returnprice),
    })
  });
  console.log(data)
  this.mobileSettingsService.updatePriceList(
    data
     ).subscribe(
     (response: any) => {
      this.resetData()
      this.createPriceListForm()
     },
     (error) => {
         console.log(error)
     },
     () => {
      this.layoutUtilsService.showActionNotification(
        "Mise à jour avec succès",
        MessageType.Create,
        10000,
        true,
        true
      );
      this.createPriceListForm()
      this.itemService.getAll().subscribe(
        (response: any) => {
          this.products = response.data
          this.products.forEach(prod => {
    
            prod.salesprice = 0 
            prod.pt_desc1 = prod.pt_desc1,
            // pt_desc1 : prod.item.pt_desc1,
            prod.pt_um = prod.pt_um,
            prod.pt_part_type = prod.pt_part_type,
            prod.pt_draw = prod.pt_draw,
            prod.returnprice = 0 
            prod.description  = "" 
          });
          this.dataView.setItems(this.products)
        },
        (error) => {
            this.products = []
        },
        () => {}
      )
      this.loadingSubject.next(false);
    }
   )
}


prepareGrid() {

  this.itemService.getAll().subscribe(
    (response: any) => {
      this.products = response.data
      this.products.forEach(prod => {

        prod.salesprice = 0 
        prod.pt_desc1 = prod.pt_desc1,
        // pt_desc1 : prod.item.pt_desc1,
        prod.pt_um = prod.pt_um,
        prod.pt_part_type = prod.pt_part_type,
        prod.pt_draw = prod.pt_draw,
        prod.returnprice = 0 
        prod.description  = "" 
      });
      this.dataView.setItems(this.products)
    },
    (error) => {
        this.products = []
    },
    () => {}
  )

   this.columnDefinitions = [     
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
          editor: {
            model: Editors.text,
          },
      },
      {
          id: "pt_desc1",
          name: "Description",
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

      {
        id: "description",
        name: "Description",
        field: "description",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        editor: { 
          model: Editors.text,
        },
      },

      {
        id: "salesprice",
        name: "Prix de vente",
        field: "salesprice",
        sortable: true,
        filterable: true,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
      },

      {
        id: "returnprice",
        name: "Prix de retour",
        field: "returnprice",
        sortable: true,
        filterable: true,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
      },
      
     
      
    ]

      this.gridOptions = {
        autoHeight:false,
        editable: true,
        enableAutoResize:true,
        enableCellNavigation: true,
        enableRowSelection: true,
        enableCheckboxSelector: true,
        rowSelectionOptions: {
          selectActiveRow: true
        },
        
        formatterOptions: {
        
          // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
          displayNegativeNumberWithParentheses: true,
    
          // Defaults to undefined, minimum number of decimals
          minDecimal: 2,
    
          // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
          thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
        },
       /* presets: {
          sorters: [
            { columnId: 'psh_line', direction: 'ASC' }
          ],
        },*/
      
      };
}

addNewItem() {
  const maxId = Math.max(...this.oldProductsForGrid.map(item => item.id));
  console.log('MaxId',maxId)
  this.gridService.addItem(
    {
      id: maxId + 1,
      pt_part : null, 
      pt_desc1 : null,
      pt_um :null,
      pt_part_type: null,
      pt_draw: null,
      description : null,
      salesprice : null, 
      returnprice: null
      
    },
    { position: "bottom" }
  );
  this.row_number = this.oldProductsForGrid.length - 1;
  console.log(this.row_number)
  console.log(this.oldProductsForGrid.length)
        // this.row_number = args.row
        let element: HTMLElement = document.getElementById(
          "openItemsGrid"
      ) as HTMLElement
      element.click()
}
onUpdatePriceList(){
  this.showUpdateButton = true
  this.isExist = false
  this.oldProductsForGrid = []
  this.oldProducts.forEach(prod => {
    console.log("prod",prod.item)
    this.oldProductsForGrid.push({
      id : prod.id,
      pt_part : prod.product_code, 
      pt_desc1 : prod.item.pt_desc1,
      pt_um :prod.item.pt_um,
      pt_part_type: prod.item.pt_part_type,
      pt_draw: prod.item.pt_draw,
      description : prod.description,
      salesprice : prod.salesprice, 
      returnprice: prod.returnprice

    })
  });
  this.dataView.setItems(this.oldProductsForGrid)
}


handleSelectedRowsChangedl(e, args) {
  const controls = this.priceListForm.controls;
  if (Array.isArray(args.rows) && this.gridObjl) {
    args.rows.map((idx) => {
      const item = this.gridObjl.getDataItem(idx);
      controls.pricelist_code.setValue(item.pricelist_code || "");
      this.onChangeCode()
    });
  }
}

angularGridReadyl(angularGrid: AngularGridInstance) {
  this.angularGridl = angularGrid;
  this.gridObjl = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridl() {
  this.columnDefinitionsl = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "pricelist_code",
      name: "Code",
      field: "pricelist_code",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "designation",
      name: "Designation",
      field: "designation",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptionsl = {
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
  };

  // fill the dataset with your data
  this.mobileSettingsService
    .getAllPriceList()
    .subscribe((response: any) => (this.listes = response.data));
}
open(content) {
  this.prepareGridl();
  this.modalService.open(content, { size: "lg" });
}

handleSelectedRowsChanged4(e, args) {
  let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
  
  if (Array.isArray(args.rows) && this.gridObj4) {
    args.rows.map((idx) => {
      const item = this.gridObj4.getDataItem(idx);
      console.log(item);
      updateItem.pt_part = item.pt_part, 
      updateItem.pt_desc1 = item.pt_desc1,
      updateItem.pt_um = item.pt_um,
      updateItem.pt_part_type = item.pt_part_type,
      updateItem.pt_draw = item.pt_draw,
      updateItem.description = this.oldProductsForGrid[0].description,
      updateItem.salesprice = 0, 
      updateItem.returnprice= 0
      this.gridService.updateItem(updateItem);
     
    });
  }
}
angularGridReady4(angularGrid: AngularGridInstance) {
  this.angularGrid4 = angularGrid
  this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {}
}


prepareGrid4() {
  this.columnDefinitions4 = [
    {
      id: "pt_part",
      name: "code ",
      field: "pt_part",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "pt_desc1",
      name: "desc",
      field: "pt_desc1",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "pt_um",
      name: "desc",
      field: "pt_um",
      sortable: true,
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

  // fill the dataset with your 
  const pt_part =[]
  this.oldProductsForGrid.forEach(prod => {
    if(prod.pt_part != null) {
pt_part.push(prod.pt_part)
    }

  })
  console.log(pt_part)
  console.log(this.oldProductsForGrid)
  this.itemService
      .getByNot({pt_part })
      .subscribe((response: any) => (this.items = response.data))
}
open4(content) {
 
  this.prepareGrid4()
  this.modalService.open(content, { size: "lg" })
}

}
