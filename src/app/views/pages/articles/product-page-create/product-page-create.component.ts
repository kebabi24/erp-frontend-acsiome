import { Component, OnInit, OnChanges } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"

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
} from "angular-slickgrid"
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
import { MenuMobileConfig } from '../../../../core/_config/menuMobile.config'

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
import { IActionMapping, ITreeOptions, TREE_ACTIONS } from '@circlon/angular-tree-component';


import { CustomerMobileService   , ItemService} from "../../../../core/erp"
import { takeUntil } from "rxjs/operators"
import { ProductPage } from "src/app/core/erp/_models/product-page.model"
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";

const actionMapping: IActionMapping = {
    mouse: {
      click: (tree, node, $event) => {
        console.log(node);
        $event.shiftKey
          ? TREE_ACTIONS.TOGGLE_ACTIVE_MULTI(tree, node, $event)
          : TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
      }
    }
  };
@Component({
    selector: "kt-product-page-create",
    templateUrl: "./product-page-create.component.html",
    styleUrls: ["./product-page-create.component.scss"],
})
export class ProductPageCreateComponent implements OnInit {
    productPage: ProductPage
    productPageForm: FormGroup
    hasFormErrors = false
    isExist = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    confirmDelete = false

    // grid stuff
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
    alertWarning: any
    productCodes : any [] = []
    selectedProductsIndexes : any[] = []
    pageIsEdited = false

    items: [];
    columnDefinitions4: Column[] = [];
    gridOptions4: GridOption = {};
    gridObj4: any;
    angularGrid4: AngularGridInstance;
    
    row_number;
    selectedIndexes: any[];
    selectedIndexes2: any[];
    constructor(
        config: NgbDropdownConfig,
        private profileFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private modalService: NgbModal,
        private layoutUtilsService: LayoutUtilsService,
        private itemService : ItemService,
        private customerMobileService : CustomerMobileService
    ) {
        config.autoClose = true
        // this.getItems()
        this.prepareGrid() 
       
    }
    gridReady(angularGrid: AngularGridInstance) {
      this.angularGrid = angularGrid;
      this.dataView = angularGrid.dataView;
      this.grid = angularGrid.slickGrid;
      this.gridService = angularGrid.gridService;
    }
    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(true)
        this.createForm()
    }
    
    
    //create form
    createForm() {
        this.loadingSubject.next(false)

        this.productPage = new ProductPage()
        this.productPageForm = this.profileFB.group({
          product_page_code: [this.productPage.product_page_code, Validators.required],
          description: [this.productPage.description, Validators.required],
        })
    }
  
    reset() {
        this.productPage = new ProductPage()
        this.dataset=[]
        this.createForm()

        this.hasFormErrors = false
    }

    // onChangeCode() {
    //     const controls = this.productPageForm.controls
    //     const product_page_code = controls.product_page_code.value
    //     this.itemService.getProductPageByCode({product_page_code : product_page_code}).subscribe(
    //         (res: any) => {
           
    //           if (res.data.productPage) {
    //             alert("Ce code Page de Produit existe déjà")
    //             this.isExist = true
    //             document.getElementById("productPageCode").focus();
    //             controls.description.disable()
    //           } else {
    //             controls.description.enable()
    //           }
                   
    //     })
    
    // }

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

    arrayRemove(arr, value) { 
    
        return arr.filter(function(ele){ 
            return ele != value; 
        });
    }

    getItems(){
      this.itemService.getBy({pt_salable:true}).subscribe(
        (response: any) => {
          console.log(response.data)
          this.dataset = response.data
          this.dataView.setItems(this.dataset)
        },
        (error) => {
            this.dataset = []
        },
        () => {}
      )
    }

    prepareGrid() {
      // this.itemService.getBy({pt_salable:true}).subscribe(
      //   (response: any) => {
      //     this.dataset = response.data
      //     this.dataView.setItems(this.dataset)
      //   },
      //   (error) => {
      //       this.dataset = []
      //   },
      //   () => {}
      // )
       


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
                id: "product_code",
                name: "Code Produit",
                field: "product_code",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "desc",
                name: "Description",
                field: "desc",
                sortable: true,
                filterable: true,
                width: 200,
                type: FieldType.string,
            },
            {
            id: "rank",
            name: "Rang",
            field: "rank",
            sortable: true,
            filterable: true,
            type: FieldType.integer,
        },
            
        ]
  
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
            enableAutoResize:true,
            // multiSelect: false,
            rowSelectionOptions: {
              selectActiveRow: false
            },
            presets: {

              // sorters: [{ columnId: "id", direction: "ASC" }],
        
              rowSelection: {
                gridRowIndexes: this.selectedProductsIndexes,           // the row position of what you see on the screen (UI)
                dataContextIds: this.selectedProductsIndexes, // (recommended) select by your data object IDs
              }
            },
        }
  
        
    }
      

    

    // save data
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.productPageForm.controls

        /** check form */
        if (this.productPageForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )

            this.hasFormErrors = true
            return
        }

        // tslint:disable-next-line:prefer-const
        let productPage = this.prepareProductPage()
         this.addproductPage(productPage)
    }


    /**
     * Returns object for saving
     */


    prepareProductPage(): ProductPage {
        const controls = this.productPageForm.controls
        const _product_page= new ProductPage()
        _product_page.product_page_code = controls.product_page_code.value
        _product_page.description = controls.description.value
        

        return _product_page
    }



    /**
     * Add profile
     *
     * @param _productPage: ClusterModel
     */
    addproductPage(_productPage: ProductPage ) {
        
      for(let data of this.dataset) {
        delete data.id
      }
        this.loadingSubject.next(true)
        this.itemService.createProductPage({ productPage:_productPage},{productCodes : this.dataset}).subscribe(
            (reponse) => {
              // this.dataView.setItems(this.dataset)
              this.reset()
              this.productPage = new ProductPage()
              this.createForm()
              this.hasFormErrors = false
            },
            (error) => {
                this.layoutUtilsService.showActionNotification(
                    "Erreur verifier les informations",
                    MessageType.Create,
                    10000,
                    true,
                    true
                )
                this.loadingSubject.next(false)
            },
            () => {
                this.layoutUtilsService.showActionNotification(
                    "Page produits ajout avec succès",
                    MessageType.Create,
                    10000,
                    true,
                    true
                )
                this.loadingSubject.next(false)
                this.reset()
                this.router.navigateByUrl("/articles/page")
            }
        )
    }

    editProductPage(){
      const controls = this.productPageForm.controls
      const product_page_code = controls.product_page_code.value
      const description = controls.description.value
      
    }

 

    /**
     * Go back to the list
     *
     */
    goBack() {
        this.loadingSubject.next(false)
        const url = `/`
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
    }
    

    onSelectedRowsChanged(e, args) {
      // console.log('indexs', args.rows);
      const indexes = args.rows;
      this.productCodes = []
      indexes.forEach(index => {
        const product_code = this.gridService.getDataItemByRowIndex(index).pt_part
        this.productCodes.push(product_code)
      });
      console.log(this.productCodes)
    }

    

    getCurrentPageData(){
      const controls = this.productPageForm.controls
      this.isExist = false 
      this.selectedProductsIndexes = []
      this.itemService.getPageProducts(controls.product_page_code.value).subscribe(
        (reponse) => {
          const page = reponse['page']
          reponse['products_codes'].forEach(prod => {
            const index = this.getIndexOfProduct(prod.product_code)
            this.selectedProductsIndexes.push(index)
          
          });
          console.log("this.selectedProductsIndexes",this.selectedProductsIndexes)
          this.grid.setSelectedRows(this.selectedProductsIndexes);
          controls.description.setValue(page.description)
          this.pageIsEdited = true
        })
    }

    getIndexOfProduct(code_product){
      const index = this.dataset.findIndex(element =>{
        return element.pt_part == code_product
      })
      return this.dataset[index].id
    }
    
    onChangeCode() {
      const controls = this.productPageForm.controls;
  
      this.itemService.getProductPageByCode({ product_page_code: controls.product_page_code.value }).subscribe((res: any) => {
        //console.log("aa", res.data);
  
        if (res.data) {
          console.log("here",res.data)
          const product_page_code = res.data.productPage.product_page_code
          this.router.navigateByUrl(`/articles/edit-productpage/${product_page_code}`);
          //console.log(res.data.id)
        }
      });
    }

    onChangePP() {
      const controls = this.productPageForm.controls;
  
      this.itemService.getProductPageByCode({ product_page_code: controls.product_page_code.value }).subscribe((res: any) => {
        console.log("aa", res.data);
  
        if (res.data.productPage) {
          alert("Cette Page de Produit existe déja");
          this.isExist = true;
          document.getElementById("product_page_code").focus();
        } else {
          controls.description.enable();
        
        }
      });
    }
  
    handleSelectedRowsChanged4(e, args) {
      this.selectedIndexes = [];
      this.selectedIndexes = args.rows;
    }
    angularGridReady4(angularGrid: AngularGridInstance) {
      this.angularGrid4 = angularGrid;
      this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {};
    }
  
    prepareGrid4() {
      this.columnDefinitions4 = [
        {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
        },
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
          id: "pt_group",
          name: "Groupe",
          field: "pt_group",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
      ];
  
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
        editable: true,
        checkboxSelector: {
          // optionally change the column index position of the icon (defaults to 0)
          // columnIndexPosition: 1,
  
          // remove the unnecessary "Select All" checkbox in header when in single selection mode
          hideSelectAllCheckbox: true,
  
          // you can override the logic for showing (or not) the expand icon
          // for example, display the expand icon only on every 2nd row
          // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
        },
        multiSelect: true,
        rowSelectionOptions: {
          // True (Single Selection), False (Multiple Selections)
          selectActiveRow: false,
        },
        presets: {

          sorters: [{ columnId: "id", direction: "ASC" }],
        }
      };
  
      // fill the dataset with your data
      this.itemService.getBy({pt_salable:true}).subscribe((response: any) => (this.items = response.data));
    }
    open4(content) {
      this.prepareGrid4();
      this.modalService.open(content, { size: "lg" });
    }
    addNewItem(content4) {
      this.prepareGrid4();
      this.modalService.open(content4, {backdrop: 'static',  size: "lg" });
    }
    addpage() {
      // this.itinerary.push({})
      var l: any[] = [];
      let i = 0
      this.selectedIndexes.forEach((index) => {
        l.push({
          id: i,
          product_code: this.items[index]["pt_part"],
          desc: this.items[index]["pt_desc1"],
          rank: i+1,
          //trigger : this.itinerary[index]['pjd_trigger']
        });
        i ++
      });
      // console.log("lllllllll",l)
      this.dataset = l;
  
      this.dataView.setItems(this.dataset);
    }
}
