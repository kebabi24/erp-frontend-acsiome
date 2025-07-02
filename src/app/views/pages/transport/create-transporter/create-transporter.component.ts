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
  selector: 'kt-create-transporter',
  templateUrl: './create-transporter.component.html',
  styleUrls: ['./create-transporter.component.scss']
})
export class CreateTransporterComponent implements OnInit {
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
            .getBy({ code_fldname: "ad_county" })
            .subscribe((response: any) => (this.ad_county = response.data))
        this.codeService
            .getBy({ code_fldname: "vd_type" })
            .subscribe((response: any) => (this.vd_type = response.data))
        this.codeService
            .getBy({ code_fldname: "vd_shipvia" })
            .subscribe((response: any) => (this.vd_shipvia = response.data))
        this.codeService
            .getBy({ code_fldname: "vd_promo" })
            .subscribe((response: any) => (this.vd_promo = response.data))
        this.codeService
            .getBy({ code_fldname: "vd_lang" })
            .subscribe((response: any) => (this.vd_lang = response.data))
        this.codeService
            .getBy({ code_fldname: "ad_tax_zone" })
            .subscribe((response: any) => (this.ad_tax_zone = response.data))
        
        this.codeService
            .getBy({ code_fldname: "ad_tax_usage" })
            .subscribe((response: any) => (this.ad_tax_usage = response.data))        
    }

    /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */

    /**
     * On init
     */
    ngOnInit() {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.user =  JSON.parse(localStorage.getItem('user'))
        this.init()
        // sticky portlet header
        window.onload = () => {
            const style = getComputedStyle(document.getElementById("kt_header"))
            this.headerMargin = parseInt(style.height, 0)
        }
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
            ad_addr: [this.address.ad_addr, Validators.required],
            ad_po_mthd: [{ value: this.address.ad_po_mthd, disabled: !this.isExist }],
            ad_name: [{ value: this.address.ad_name, disabled: !this.isExist },Validators.required],
            ad_line1:  [{ value: this.address.ad_line1, disabled: !this.isExist },Validators.required],
            ad_city: [{ value: this.address.ad_city, disabled: !this.isExist }],
            ad_state: [{ value: this.address.ad_state, disabled: !this.isExist }],
            ad_zip: [{ value: this.address.ad_zip, disabled: !this.isExist }],
            ad_country: [{ value: this.address.ad_country, disabled: !this.isExist }],
            ad_phone: [{ value: this.address.ad_phone, disabled: !this.isExist }, Validators.required],
            ad_phone2: [{ value: this.address.ad_phone, disabled: !this.isExist }],
            ad_ext: [{ value: this.address.ad_ext, disabled: !this.isExist }],
            ad_ext2: [{ value: this.address.ad_ext2, disabled: !this.isExist }],
            ad_fax: [{ value: this.address.ad_fax, disabled: !this.isExist }],
            ad_fax2: [{ value: this.address.ad_fax2, disabled: !this.isExist }],
            ad_attn: [{ value: this.address.ad_attn, disabled: !this.isExist }],
            ad_attn2: [{ value: this.address.ad_attn2, disabled: !this.isExist }],
            
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

    onChangeCode() {
        const controls  = this.addressForm.controls
         this.addressService
            .getBy({
                  ad_addr: controls.ad_addr.value,
            })
            .subscribe((response: any) => {
                
                if (response.data) {
                    this.isExist = true
                    console.log(response.data)
                   
                } else {
                    
                    controls.ad_name.enable()
                    controls.ad_line1.enable()
                   
                    controls.ad_country.enable()
                    controls.ad_state.enable()
                    controls.ad_city.enable()
                    controls.ad_zip.enable()
                    
                    
                    controls.ad_phone.enable()
                    controls.ad_phone2.enable()
                    controls.ad_ext.enable()
                    controls.ad_ext2.enable()
                    controls.ad_fax.enable()
                    controls.ad_fax2.enable()
                    controls.ad_attn.enable()
                    controls.ad_attn2.enable()
                    
                    controls.ad_po_mthd.enable()
                   
                }
                
         })
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
        this.addressService.addAddress(_address).subscribe(
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
                "Ajout avec succès",
                MessageType.Create,
                10000,
                true,
                true
            )
            this.loadingSubject.next(false)
            this.router.navigateByUrl("/transport/create-transporter")
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
