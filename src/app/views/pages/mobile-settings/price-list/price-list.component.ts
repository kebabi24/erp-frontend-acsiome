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
}


prepareGrid() {

  this.itemService.getAll().subscribe(
    (response: any) => {
      this.products = response.data
      this.products.forEach(prod => {

        prod.salesprice = 0 
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

    this.columnDefinitions = this.columnDefinitions = [      
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

      {
        id: "description",
        name: "Description",
        field: "description",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        editor: { 
          model: Editors.integer,
        },
      },

      {
        id: "salesprice",
        name: "Prix de vente",
        field: "salesprice",
        sortable: true,
        filterable: true,
        type: FieldType.float,
        editor: {
          model: Editors.float,
        },
      },

      {
        id: "returnprice",
        name: "Prix de retour",
        field: "returnprice",
        sortable: true,
        filterable: true,
        type: FieldType.float,
        editor: {
          model: Editors.float,
        },
      },
      
     
      
    ]

      this.gridOptions = {
        autoHeight:false,
        asyncEditorLoading: false,
        editable: true,
        enableAutoResize:true,
        enableAddRow:true,
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


onUpdatePriceList(){
  this.showUpdateButton = true
  this.isExist = false
  this.oldProductsForGrid = []
  this.oldProducts.forEach(prod => {
    this.oldProductsForGrid.push({
      id : prod.id,
      pt_part : prod.product_code, 
      description : prod.description,
      salesprice : prod.salesprice, 
      returnprice: prod.returnprice

    })
  });
  this.dataView.setItems(this.oldProductsForGrid)
}


}
