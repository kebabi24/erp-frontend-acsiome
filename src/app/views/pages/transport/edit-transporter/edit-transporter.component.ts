// Angular
import { Component, ChangeDetectorRef, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Editor,
    Editors,
    AngularGridInstance,
    GridService,
    Formatters,
    FieldType,
    OnEventArgs,
  } from "angular-slickgrid";
  
import { ActivatedRoute, Router } from "@angular/router"
import {
    NgbTabChangeEvent,
} from "@ng-bootstrap/ng-bootstrap"

import { FormBuilder, FormGroup, Validators } from "@angular/forms"
// Material
import { MatDialog } from "@angular/material/dialog"
// RxJS
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { map, startWith, delay, first } from "rxjs/operators"
// NGRX
import { Store, select } from "@ngrx/store"
import { Dictionary, Update } from "@ngrx/entity"
import { AppState } from "../../../../core/reducers"
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
// Services and Models
import {
    selectLastCreatedProductId,
    selectProductById,
    SPECIFICATIONS_DICTIONARY,
    ProductModel,
    ProductOnServerCreated,
    ProductUpdated,
    ProductsService,
} from "../../../../core/e-commerce"

import {
    Address,
    AddressService,
    CodeService,
    Provider,
    ProviderService,
    DeviseService,
    TaxeService
   
} from "../../../../core/erp"


@Component({
  selector: 'kt-edit-transporter',
  templateUrl: './edit-transporter.component.html',
  styleUrls: ['./edit-transporter.component.scss']
})
export class EditTransporterComponent implements OnInit {

  private componentSubscriptions: Subscription
  // sticky portlet header margin
  private headerMargin: number

  // properties
  address: Address
  addressForm: FormGroup
 
  hasFormErrors = false
  hasProviderFormErrors = false
  selectedTab = 0
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  addressId$: Observable<Number>

  isExist = false

 

  
  providers: []
  columnDefinitions3: Column[] = []
  gridOptions3: GridOption = {}
  gridObj3: any
  angularGrid3: AngularGridInstance
  
  error = false

  datatax: []
  columnDefinitionstax: Column[] = []
  gridOptionstax: GridOption = {}
  gridObjtax: any
  angularGridtax: AngularGridInstance

  devises: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;


  datacode: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;
  fieldcode = "";
  fldname;
  user: any
  // selects
  ad_city: any[] = []
  ad_state: any[] = []
  ad_county: any[] = []
  vd_type: any[] = []
  vd_shipvia: any[] = []
  vd_promo: any[] = []
  vd_lang: any[] = []
  ad_tax_zone: any[] = []
  ad_tax_usage: any[] = []
  ad_country: any[] = []
  addressEdit: any
  title: String = 'Modifier Transporteur - '

  /**
   * Component constructor
   *
   * @param activatedRoute: ActivatedRoute
   * @param router: Router
   * @param typesUtilsService: TypesUtilsService
   * @param FB: FormBuilder
   * @param dialog: MatDialog
   * @param subheaderService: SubheaderService
   * @param layoutUtilsService: SubheaderService
   * @param layoutConfigService: LayoutConfigService
   * @param addressService: AddressService
   * @param codeService: CodeService
   * @param providerService: ProviderService
   * @param cdr: ChangeDetectorRef
   * 
 
   */
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private typesUtilsService: TypesUtilsService,
      private formBuilder: FormBuilder,
      public dialog: MatDialog,
      private subheaderService: SubheaderService,
      private layoutUtilsService: LayoutUtilsService,
      private layoutConfigService: LayoutConfigService,
      private addressService: AddressService,
      private codeService: CodeService,
      private modalService: NgbModal,
      
      private providerService: ProviderService,
     
      private cdr: ChangeDetectorRef,
      private deviseService: DeviseService,
     
      config: NgbDropdownConfig
  ) {
      config.autoClose = true
      
      this.codeService
          .getBy({ code_fldname: "ad_state" })
          .subscribe((response: any) => (this.ad_state = response.data))
          this.codeService
          .getBy({ code_fldname: "ad_country" })
          .subscribe((response: any) => (this.ad_country = response.data))
      this.codeService
          .getBy({ code_fldname: "ad_city" })
          .subscribe((response: any) => (this.ad_city = response.data))
     
     }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
   ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(true)
    this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.addressService.getOne(id).subscribe((response: any)=>{
          this.addressEdit = response.data
          console.log(response.data)
          this.init()
          this.loadingSubject.next(false)
          this.title = this.title + this.addressEdit.ad_addr
    })
  })
  }

  
  
  /**
   * Init product
   */
  init() {
      this.createAddressForm()
    
      this.loadingSubject.next(false)
      // if (!this.product.id) {
      //     this.subheaderService.setBreadcrumbs([
      //         { title: "eCommerce", page: `/ecommerce` },
      //         { title: "Products", page: `/ecommerce/products` },
      //         { title: "Create product", page: `/ecommerce/products/add` },
      //     ])
      //     return
      // }
      // this.subheaderService.setTitle("Edit product")
      // this.subheaderService.setBreadcrumbs([
      //     { title: "eCommerce", page: `/ecommerce` },
      //     { title: "Products", page: `/ecommerce/products` },
      //     {
      //         title: "Edit product",
      //         page: `/ecommerce/products/edit`,
      //         queryParams: { id: this.product.id },
      //     },
      // ])
  }

  /**
   * Create form
   */
  createAddressForm() {
      this.address = new Address()
      this.addressForm = this.formBuilder.group({
          ad_addr: [{value:this.address.ad_addr, disabled:true}],
          ad_po_mthd: [this.addressEdit.ad_po_mthd],
          ad_name: [this.addressEdit.ad_name,Validators.required],
          ad_line1:  [this.addressEdit.ad_line1,Validators.required],
          ad_city: [this.addressEdit.ad_city],
          ad_state: [this.addressEdit.ad_state],
          ad_zip: [this.addressEdit.ad_zip],
          ad_country: [this.addressEdit.ad_country],
          ad_phone: [this.addressEdit.ad_phone, Validators.required],
          ad_phone2: [this.addressEdit.ad_phone],
          ad_ext: [this.addressEdit.ad_ext],
          ad_ext2: [this.addressEdit.ad_ext2],
          ad_fax: [this.addressEdit.ad_fax],
          ad_fax2: [this.addressEdit.ad_fax2],
          ad_attn: [this.addressEdit.ad_attn],
          ad_attn2: [this.addressEdit.ad_attn2],
          
      })
  }
  
  onChangeState() {
      const controls  = this.addressForm.controls
     console.log(controls.ad_state.value)
      this.codeService
          .getBy({ code_fldname: "ad_city", chr01: controls.ad_state.value.substring(0, 2) })
          .subscribe((response: any) => {(this.ad_city = response.data)
          console.log(response.data)})    
  }

  
  /**
   * Go back to the list
   *
   * @param id: any
   */
  goBack(id) {
      this.loadingSubject.next(false)
      const url = `/transport/create-transporter`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }

  goBackWithoutId() {
      this.router.navigateByUrl("/transport/create-transporter", {
          relativeTo: this.activatedRoute,
      })
  }

  /**
   * Refresh product
   *
   * @param isNew: boolean
   * @param id: number
   */
  
  /**
   * Reset
   */
  reset() {
      this.address = new Address()
     
      this.createAddressForm()
    
      this.hasFormErrors = false
      this.hasProviderFormErrors = false
  }

  /**
   * Save data
   *
   * @param withBack: boolean
   */
  onSubmit() {
      this.hasFormErrors = false
      const controls = this.addressForm.controls
       /** check form */
      if (this.addressForm.invalid) {
          Object.keys(controls).forEach((controlName) =>
              controls[controlName].markAsTouched()
          )

          this.hasFormErrors = true
          this.selectedTab = 0
          return
      }
     

      let address = this.prepareAddress()
      this.addAddress(address)
  }

  /**
   * Returns object for saving
   */
  prepareAddress(): Address {
      const controls = this.addressForm.controls
     
      const _address = new Address()
     
      _address.ad_addr = controls.ad_addr.value
      _address.ad_name = controls.ad_name.value
      _address.ad_line1 = controls.ad_line1.value
      _address.ad_city = controls.ad_city.value
      _address.ad_state = controls.ad_state.value
      _address.ad_zip = controls.ad_zip.value
      _address.ad_country = controls.ad_country.value
      _address.ad_phone = controls.ad_phone.value
      _address.ad_phone2 = controls.ad_phone2.value
      _address.ad_ext = controls.ad_ext.value
      _address.ad_ext2 = controls.ad_ext2.value
      _address.ad_type = "Transporter"
      _address.ad_fax = controls.ad_fax.value
      _address.ad_fax2 = controls.ad_fax2.value
      _address.ad_attn = controls.ad_attn.value
      _address.ad_attn2 = controls.ad_attn2.value
      
    
      _address.ad_po_mthd = controls.ad_po_mthd.value
      
      _address.ad_date = new Date()
      this.address = _address
      return _address
  }

  /**
   * Add product
   *
   * @param _product: ProductModel
   */
  addAddress(_address: Address) {
      this.loadingSubject.next(true)
      this.addressService.update(this.addressEdit.id,_address).subscribe(
          (reponse: any) => console.log(reponse),
          (error) =>
              this.layoutUtilsService.showActionNotification(
                  "Erreur verifier les informations",
                  MessageType.Create,
                  10000,
                  true,
                  true
              ),
          () => {
            this.layoutUtilsService.showActionNotification(
              "Modification avec succès",
              MessageType.Create,
              10000,
              true,
              true
          )
          this.loadingSubject.next(false)
          this.router.navigateByUrl("/transport/list-edit-transporter")
          }
      )
  }

  /**
   * Returns object for saving
   */
 
  /**
   * Close alert
   *
   * @param $event
   */
  onAlertClose($event) {
      this.hasFormErrors = false
  }


  onChangeVend() {
    const controls = this.addressForm.controls; // chof le champs hada wesh men form rah
    const vd_addr = controls.ad_po_mthd.value;

    this.providerService.getBy({ vd_addr }).subscribe(
      (res: any) => {
        console.log(res);
        const { data } = res;

        if (!data) {
        alert(
            "ce fournisseur n'existe pas!",)
            controls.ad_po_mthd.setValue(null);
           document.getElementById("ad_po_mthd").focus(); 
          } else {
          controls.ap_po_mthd.setValue(data.vd_addr || "");
         
        }
         
      },
      (error) => console.log(error)
    );
  }

 
  handleSelectedRowsChanged3(e, args) {
      const controls = this.addressForm.controls
      
  
      if (Array.isArray(args.rows) && this.gridObj3) {
          args.rows.map((idx) => {
              const item = this.gridObj3.getDataItem(idx)
              // TODO : HERE itterate on selected field and change the value of the selected field
                     controls.ad_po_mthd.setValue(item.vd_addr || "")
               
          })
      }
  }
  
 
  

  angularGridReady3(angularGrid: AngularGridInstance) {
    this.angularGrid3 = angularGrid;
    this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid3() {
    this.columnDefinitions3 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "vd_addr",
        name: "code",
        field: "vd_addr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_name",
        name: "Fournisseur",
        field: "address.ad_name",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_phone",
        name: "Numero telephone",
        field: "address.ad_phone",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_taxable",
        name: "A Taxer",
        field: "address.ad_taxable",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_taxc",
        name: "Taxe",
        field: "address.ad_taxc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptions3 = {
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
    this.providerService
      .getAll()
      .subscribe((response: any) => (this.providers = response.data));
  }
  open3(content) {
    this.prepareGrid3();
    this.modalService.open(content, { size: "lg" });
  }


}
