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
    AccountService,
    TaxeService,
    BankService,
    DeviseService,
    SequenceService,
} from "../../../../core/erp"

import { jsPDF } from "jspdf";
@Component({
  selector: 'kt-create-std-provider',
  templateUrl: './create-std-provider.component.html',
  styleUrls: ['./create-std-provider.component.scss']
})
export class CreateStdProviderComponent implements OnInit {

// Private password
private componentSubscriptions: Subscription
// sticky portlet header margin
private headerMargin: number

// properties
address: Address
addressForm: FormGroup
formX: FormGroup
provider: Provider
providerForm: FormGroup
hasFormErrors = false
hasProviderFormErrors = false
selectedTab = 0
loadingSubject = new BehaviorSubject<boolean>(true)
loading$: Observable<boolean>
addressId$: Observable<Number>

isExist = false

sequences: []
columnDefinitions1: Column[] = []
gridOptions1: GridOption = {}
gridObj1: any
angularGrid1: AngularGridInstance

banks: [];
columnDefinitionsbank: Column[] = [];
gridOptionsbank: GridOption = {};
gridObjbank: any;
angularGridbank: AngularGridInstance;

data: []
columnDefinitions3: Column[] = []
gridOptions3: GridOption = {}
gridObj3: any
angularGrid3: AngularGridInstance
selectedField = ""

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
ck_frm: any[] = []
cr_terms: any[] = []
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
    private accountService: AccountService,
    private providerService: ProviderService,
    private taxService: TaxeService,
    private bankService: BankService,
    private cdr: ChangeDetectorRef,
    private deviseService: DeviseService,
    private sequenceService: SequenceService,
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

    this.codeService
        .getBy({ code_fldname: "check_form" })
        .subscribe((response: any) => (this.ck_frm = response.data))
    this.codeService
        .getBy({ code_fldname: "vd_cr_terms" })
        .subscribe((response: any) => (this.cr_terms = response.data))            
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

// loadProduct(_product, fromService: boolean = false) {
//     if (!_product) {
//         this.goBack("")
//     }
//     this.product = _product
//     this.productId$ = of(_product.id)
//     this.oldProduct = Object.assign({}, _product)
//     this.initProduct()
//     if (fromService) {
//         this.cdr.detectChanges()
//     }
// }

// // If product didn't find in store
// loadProductFromService(productId) {
//     this.productService.getProductById(productId).subscribe((res) => {
//         this.loadProduct(res, true)
//     })
// }

/**
 * On destroy
 */
ngOnDestroy() {
    if (this.componentSubscriptions) {
        this.componentSubscriptions.unsubscribe()
    }
}

/**
 * Init product
 */
onchangename(){
  const controlsX  = this.formX.controls
  const controls1 = this.providerForm.controls;
  const controls = this.addressForm.controls;
  
  let name = controlsX.ad_name.value.substring(0,3)
  this.isExist = false
  this.addressService
        .getBy({ad_type:'vendor'}).subscribe((response: any) => {
            
            if (response.data.length != 0) {
                
                 
                controls.ad_line1.enable()
               
                controls.ad_country.enable()
                controls.ad_state.enable()
                controls.ad_city.enable()
                controls.ad_zip.enable()
                
                
                controlsX.ad_temp.enable()
                controls.ad_phone.enable()
                controls.ad_phone2.enable()
                controls.ad_ext.enable()
                controls.ad_ext2.enable()
                controls.ad_fax.enable()
                controls.ad_fax2.enable()
                controls.ad_attn.enable()
                controls.ad_attn2.enable()
                controls.ad_taxable.enable()
                controls.ad_tax_zone.enable()
                controls.ad_taxc.enable()
                controls.ad_tax_usage.enable()
                controls.ad_tax_in.enable()
                controls.ad_gst_id.enable()
                controls.ad_pst_id.enable()
                controls.ad_misc1_id.enable()
                controls.ad_misc2_id.enable()
                controls1.vd_seq.enable()
                controls1.vd_sort.enable()
                controls1.vd_type.enable()
                controls1.vd_act_acct.enable()
                controls1.vd_act_sub.enable()
                controls1.vd_act_cc.enable()
                controls1.vd_ap_acct.enable()
                controls1.vd_ap_sub.enable()
                controls1.vd_ap_cc.enable()
                controls1.vd_shipvia.enable()
                controls1.vd_bank.enable()
                controls1.vd_ckfrm.enable()
                controls1.vd_curr.enable()
                controls1.vd_lang.enable()
                // controls1.vd_pur_cntct.enable()
                // controls1.vd_ap_cntct.enable()
                controls1.vd_misc_cr.enable()
                controls1.vd_carrier_id.enable()
                controls1.vd_promo.enable()
                controls1.vd_kanban_supplier.enable()
                controls1.vd_cr_terms.enable()
                controls1.vd_disc_pct.enable()
                controls1.vd_prepay.enable()
                controls1.vd_debtor.enable()
                controls1.vd_partial.enable()
                controls1.vd_hold.enable()
                controls1.vd_pay_spec.enable()
                controls1.vd_db.enable()
                controlsX.ad_addr.setValue('FOUR-' + name + String('000'+ String(Number(response.data.length) + Number(1))).slice(-3))  
               
                document.getElementById("ad_line1").focus(); 
            } 
            else{ 
              
            controls.ad_line1.enable()
           
            controls.ad_country.enable()
            controls.ad_state.enable()
            controls.ad_city.enable()
            controls.ad_zip.enable()
            
            
            controlsX.ad_temp.enable()
            controls.ad_phone.enable()
            controls.ad_phone2.enable()
            controls.ad_ext.enable()
            controls.ad_ext2.enable()
            controls.ad_fax.enable()
            controls.ad_fax2.enable()
            controls.ad_attn.enable()
            controls.ad_attn2.enable()
            controls.ad_taxable.enable()
            controls.ad_tax_zone.enable()
            controls.ad_taxc.enable()
            controls.ad_tax_usage.enable()
            controls.ad_tax_in.enable()
            controls.ad_gst_id.enable()
            controls.ad_pst_id.enable()
            controls.ad_misc1_id.enable()
            controls.ad_misc2_id.enable()
            controls1.vd_seq.enable()
            controls1.vd_sort.enable()
            controls1.vd_type.enable()
            controls1.vd_act_acct.enable()
            controls1.vd_act_sub.enable()
            controls1.vd_act_cc.enable()
            controls1.vd_ap_acct.enable()
            controls1.vd_ap_sub.enable()
            controls1.vd_ap_cc.enable()
            controls1.vd_shipvia.enable()
            controls1.vd_bank.enable()
            controls1.vd_ckfrm.enable()
            controls1.vd_curr.enable()
            controls1.vd_lang.enable()
            // controls1.vd_pur_cntct.enable()
            // controls1.vd_ap_cntct.enable()
            controls1.vd_misc_cr.enable()
            controls1.vd_carrier_id.enable()
            controls1.vd_promo.enable()
            controls1.vd_kanban_supplier.enable()
            controls1.vd_cr_terms.enable()
            controls1.vd_disc_pct.enable()
            controls1.vd_prepay.enable()
            controls1.vd_debtor.enable()
            controls1.vd_partial.enable()
            controls1.vd_hold.enable()
            controls1.vd_pay_spec.enable()
            controls1.vd_db.enable()
            controlsX.ad_addr.setValue('FOUR-' + name + String('000'+ String(1)).slice(-3)) 
            document.getElementById("ad_line1").focus(); 
            }
            
     })
     
}
init() {
    this.createFormX()
    this.createAddressForm()
    this.createProviderForm()
    const controls = this.providerForm.controls;
    const controlsa = this.addressForm.controls;

    this.deviseService.getBy({ cu_active:  true }).subscribe(
      (response: any) => {
    controls.vd_curr.setValue(response.data.cu_curr)
      })
      this.taxService.getBy({ tx2_default: true}).subscribe(
        (respo: any) => {
        // this.site = res.data.si_site
        
        controlsa.ad_taxc.setValue(respo.data.tx2_tax_code );
        controlsa.ad_taxable.setValue(true );
      //  controls.tr_ref_site.setValue(this.site );
    
      })
    
    
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
createFormX(){
  this.address = new Address()
  this.formX = this.formBuilder.group({
    ad_addr: [this.address.ad_addr, Validators.required],
    ad_name: [this.address.ad_name, Validators.required],
    ad_temp: [{ value: this.address.ad_temp, disabled: !this.isExist }],
  })
 
}
createAddressForm() {
  
    this.addressForm = this.formBuilder.group({
      
        ad_line1:  [{ value: this.address.ad_line1, disabled: !this.isExist }],
        ad_city: [{ value: this.address.ad_city, disabled: !this.isExist }],
        ad_state: [{ value: this.address.ad_state, disabled: !this.isExist }],
        ad_zip: [{ value: this.address.ad_zip, disabled: !this.isExist }],
        ad_format: [{ value: this.address.ad_format, disabled: !this.isExist }],
        ad_county: [{ value: this.address.ad_county, disabled: !this.isExist }],
        ad_country: [{ value: this.address.ad_country, disabled: !this.isExist }],
        
        ad_phone: [{ value: this.address.ad_phone, disabled: !this.isExist }],
        ad_phone2: [{ value: this.address.ad_phone, disabled: !this.isExist }],
        ad_ext: [{ value: this.address.ad_ext, disabled: !this.isExist }],
        ad_ext2: [{ value: this.address.ad_ext2, disabled: !this.isExist }],
        ad_fax: [{ value: this.address.ad_fax, disabled: !this.isExist }],
        ad_fax2: [{ value: this.address.ad_fax2, disabled: !this.isExist }],
        ad_attn: [{ value: this.address.ad_attn, disabled: !this.isExist }],
        ad_attn2: [{ value: this.address.ad_attn2, disabled: !this.isExist }],
        ad_taxable: [{ value: this.address.ad_taxable, disabled: !this.isExist }],
        ad_tax_zone: [{ value: this.address.ad_tax_zone, disabled: !this.isExist }],
        ad_taxc: [{ value: this.address.ad_taxc, disabled: !this.isExist }],
        ad_tax_usage: [{ value: this.address.ad_tax_usage, disabled: !this.isExist }],
        ad_tax_in: [{ value: this.address.ad_tax_in, disabled: !this.isExist }],
        ad_gst_id: [{ value: this.address.ad_gst_id, disabled: !this.isExist }],
        ad_pst_id: [{ value: this.address.ad_pst_id, disabled: !this.isExist }],
        ad_misc1_id: [{ value: this.address.ad_misc1_id, disabled: !this.isExist }],
        ad_misc2_id: [{ value: this.address.ad_misc2_id, disabled: !this.isExist }],
    })
}
createProviderForm() {
    this.provider = new Provider()
    this.providerForm = this.formBuilder.group({
        vd_sort: [{ value: this.provider.vd_sort, disabled: !this.isExist }],
        vd_type: [{ value: this.provider.vd_type, disabled: !this.isExist }],
        vd_seq: [{ value: this.provider.vd_seq, disabled: !this.isExist }],
        vd_act_acct: [{ value: this.provider.vd_act_acct, disabled: !this.isExist }],
        vd_act_sub: [{ value: this.provider.vd_act_sub, disabled: !this.isExist }],
        vd_act_cc: [{ value: this.provider.vd_act_cc, disabled: !this.isExist }],
        vd_ap_acct: [{ value: this.provider.vd_ap_acct, disabled: !this.isExist }],
        vd_ap_sub: [{ value: this.provider.vd_ap_sub, disabled: !this.isExist }],
        vd_ap_cc: [{ value: this.provider.vd_ap_cc, disabled: !this.isExist }],
        vd_shipvia: [{ value: this.provider.vd_shipvia, disabled: !this.isExist }],
        vd_bank: [{ value: this.provider.vd_bank, disabled: !this.isExist }],
        vd_ckfrm: [{ value: this.provider.vd_ckfrm, disabled: !this.isExist }],
        vd_curr: [{ value: this.provider.vd_curr, disabled: !this.isExist }],
        vd_lang: [{ value: this.provider.vd_lang, disabled: !this.isExist }],
        // vd_pur_cntct: [{ value: this.provider.vd_pur_cntct, disabled: !this.isExist }],
        // vd_ap_cntct: [{ value: this.provider.vd_ap_cntct, disabled: !this.isExist }],
        vd_misc_cr: [{ value: this.provider.vd_misc_cr, disabled: !this.isExist }],
        vd_carrier_id: [{ value: this.provider.vd_carrier_id, disabled: !this.isExist }],
        vd_promo: [{ value: this.provider.vd_promo, disabled: !this.isExist }],
        vd_kanban_supplier: [{ value: this.provider.vd_kanban_supplier, disabled: !this.isExist }],
        vd_cr_terms: [{ value: this.provider.vd_cr_terms, disabled: !this.isExist }],
        vd_disc_pct: [{ value: this.provider.vd_disc_pct, disabled: !this.isExist }],
        vd_prepay: [{ value: this.provider.vd_prepay, disabled: !this.isExist }],
        vd_debtor: [{ value: this.provider.vd_debtor, disabled: !this.isExist }],
        vd_partial: [{ value: this.provider.vd_partial, disabled: !this.isExist }],
        vd_hold: [{ value: this.provider.vd_hold, disabled: !this.isExist }],
        vd_pay_spec: [{ value: this.provider.vd_pay_spec, disabled: !this.isExist }],
        vd_db: [{ value: this.provider.vd_db, disabled: !this.isExist }],
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
onchangeckfrm() {
  const controls  = this.providerForm.controls

  this.codeService
      .getBy({ code_fldname: "vd_cr_terms", code_desc: controls.vd_ckfrm.value })
      .subscribe((response: any) => {(this.cr_terms = response.data)
      console.log(response.data)})    
}

onChangeCode() {
    const controlsX  = this.formX.controls
    const controls  = this.addressForm.controls
    const controls1 = this.providerForm.controls
    this.addressService
        .getBy({
              ad_addr: controlsX.ad_addr.value,
        })
        .subscribe((response: any) => {
            
            if (response.data.length != 0) {
                this.isExist = true
                console.log(response.data)
               
            } else {
                
                controlsX.ad_name.enable()
                controls.ad_line1.enable()
               
                controls.ad_country.enable()
                controls.ad_state.enable()
                controls.ad_city.enable()
                controls.ad_zip.enable()
                
                
                controlsX.ad_temp.enable()
                controls.ad_phone.enable()
                controls.ad_phone2.enable()
                controls.ad_ext.enable()
                controls.ad_ext2.enable()
                controls.ad_fax.enable()
                controls.ad_fax2.enable()
                controls.ad_attn.enable()
                controls.ad_attn2.enable()
                controls.ad_taxable.enable()
                controls.ad_tax_zone.enable()
                controls.ad_taxc.enable()
                controls.ad_tax_usage.enable()
                controls.ad_tax_in.enable()
                controls.ad_gst_id.enable()
                controls.ad_pst_id.enable()
                controls.ad_misc1_id.enable()
                controls.ad_misc2_id.enable()
                controls1.vd_seq.enable()
                controls1.vd_sort.enable()
                controls1.vd_type.enable()
                controls1.vd_act_acct.enable()
                controls1.vd_act_sub.enable()
                controls1.vd_act_cc.enable()
                controls1.vd_ap_acct.enable()
                controls1.vd_ap_sub.enable()
                controls1.vd_ap_cc.enable()
                controls1.vd_shipvia.enable()
                controls1.vd_bank.enable()
                controls1.vd_ckfrm.enable()
                controls1.vd_curr.enable()
                controls1.vd_lang.enable()
                // controls1.vd_pur_cntct.enable()
                // controls1.vd_ap_cntct.enable()
                controls1.vd_misc_cr.enable()
                controls1.vd_carrier_id.enable()
                controls1.vd_promo.enable()
                controls1.vd_kanban_supplier.enable()
                controls1.vd_cr_terms.enable()
                controls1.vd_disc_pct.enable()
                controls1.vd_prepay.enable()
                controls1.vd_debtor.enable()
                controls1.vd_partial.enable()
                controls1.vd_hold.enable()
                controls1.vd_pay_spec.enable()
                controls1.vd_db.enable()
                document.getElementById("ad_name").focus(); 
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
    const url = `/providers`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

goBackWithoutId() {
    this.router.navigateByUrl("/providers", {
        relativeTo: this.activatedRoute,
    })
}

/**
 * Refresh product
 *
 * @param isNew: boolean
 * @param id: number
 */
refreshProduct(isNew: boolean = false, id = 0) {
    this.loadingSubject.next(false)
    let url = this.router.url
    if (!isNew) {
        this.router.navigate([url], { relativeTo: this.activatedRoute })
        return
    }

    url = `/ecommerce/products/edit/${id}`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

/**
 * Reset
 */
reset() {
    this.address = new Address()
    this.provider = new Provider()
    this.createFormX()
    this.createAddressForm()
    this.createProviderForm()
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
    const controls_ = this.providerForm.controls
    const controlsX = this.formX.controls
    /** check form */
    if (this.formX.invalid) {
      Object.keys(controlsX).forEach((controlName) =>
          controlsX[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      this.selectedTab = 0
      return
  }
  
    if (this.addressForm.invalid) {
        Object.keys(controls).forEach((controlName) =>
            controls[controlName].markAsTouched()
        )

        this.hasFormErrors = true
        this.selectedTab = 0
        return
    }
    if (this.providerForm.invalid) {
        Object.keys(controls_).forEach((controlName) =>
            controls[controlName].markAsTouched()
        )

        this.hasProviderFormErrors = true
        return
    }
this.printpdf()
    let address = this.prepareAddress()
    this.addAddress(address)
}

/**
 * Returns object for saving
 */
prepareAddress(): Address {
    const controls = this.addressForm.controls
    const controls1 = this.formX.controls

    const _address = new Address()
    console.log(controls1.ad_temp.value)
    _address.ad_addr = controls1.ad_addr.value
    _address.ad_name = controls1.ad_name.value
    _address.ad_line1 = controls.ad_line1.value
    _address.ad_city = controls.ad_city.value
    _address.ad_state = controls.ad_state.value
    _address.ad_zip = controls.ad_zip.value
    _address.ad_country = controls.ad_country.value
    _address.ad_temp = controls1.ad_temp.value
    _address.ad_phone = controls.ad_phone.value
    _address.ad_phone2 = controls.ad_phone2.value
    _address.ad_ext = controls.ad_ext.value
    _address.ad_ext2 = controls.ad_ext2.value
    _address.ad_type = "vendor"
    _address.ad_fax = controls.ad_fax.value
    _address.ad_fax2 = controls.ad_fax2.value
    _address.ad_attn = controls.ad_attn.value
    _address.ad_attn2 = controls.ad_attn2.value
    _address.ad_taxable = controls.ad_taxable.value
    _address.ad_tax_zone = controls.ad_tax_zone.value
    _address.ad_taxc = controls.ad_taxc.value
    _address.ad_tax_usage = controls.ad_tax_usage.value
    _address.ad_tax_in = controls.ad_tax_in.value
    _address.ad_gst_id = controls.ad_gst_id.value
    _address.ad_pst_id = controls.ad_pst_id.value
    _address.ad_misc1_id = controls.ad_misc1_id.value
    _address.ad_misc2_id = controls.ad_misc2_id.value
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
            let provider = this.prepareProvider()
            this.addProvider(provider)
        }
    )
}

/**
 * Returns object for saving
 */
prepareProvider(): Provider {
    const controls = this.providerForm.controls
    const _provider = new Provider()
    _provider.vd_addr = this.address.ad_addr
    _provider.vd_seq = controls.vd_seq.value
    _provider.vd_sort = controls.vd_sort.value
    _provider.vd_type = controls.vd_type.value
    _provider.vd_act_acct = controls.vd_act_acct.value
    _provider.vd_act_sub = controls.vd_act_sub.value
    _provider.vd_act_cc = controls.vd_act_cc.value
    _provider.vd_ap_acct = controls.vd_ap_acct.value
    _provider.vd_ap_sub = controls.vd_ap_sub.value
    _provider.vd_ap_cc = controls.vd_ap_cc.value
    _provider.vd_shipvia = controls.vd_shipvia.value
    // _provider.vd_rmks = controls.vd_rmks.value
    _provider.vd_bank = controls.vd_bank.value
    _provider.vd_ckfrm = controls.vd_ckfrm.value
    _provider.vd_curr = controls.vd_curr.value
    _provider.vd_lang = controls.vd_lang.value
    // _provider.vd_pur_cntct = controls.vd_pur_cntct.value
    _provider.vd_misc_cr = controls.vd_misc_cr.value
    // _provider.vd_ap_cntct = controls.vd_ap_cntct.value
    _provider.vd_carrier_id = controls.vd_carrier_id.value
    _provider.vd_promo = controls.vd_promo.value
    _provider.vd_kanban_supplier = controls.vd_kanban_supplier.value
    _provider.vd_cr_terms = controls.vd_cr_terms.value
    _provider.vd_disc_pct = controls.vd_disc_pct.value
    _provider.vd_prepay = controls.vd_prepay.value
    _provider.vd_debtor = controls.vd_debtor.value
    _provider.vd_partial = controls.vd_partial.value
    _provider.vd_hold = controls.vd_hold.value
    _provider.vd_pay_spec = controls.vd_pay_spec.value
    _provider.vd_db = controls.vd_db.value
    return _provider
}

/**
 * Add product
 *
 * @param _product: ProductModel
 */
addProvider(_provider: Provider) {
    this.loadingSubject.next(true)
    this.providerService.add(_provider).subscribe(
        (reponse) => console.log("response", Response),
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
            this.router.navigateByUrl("/providers/list")
        }
    )
    // this.store.dispatch(new ProductOnServerCreated({ product: _product }))
    // this.componentSubscriptions = this.store
    //     .pipe(delay(1000), select(selectLastCreatedProductId))
    //     .subscribe((newId) => {
    //         if (!newId) {
    //             return
    //         }

    //         this.loadingSubject.next(false)
    //         if (withBack) {
    //             this.goBack(newId)
    //         } else {
    //             const message = `New product successfully has been added.`
    //             this.layoutUtilsService.showActionNotification(
    //                 message,
    //                 MessageType.Create,
    //                 10000,
    //                 true,
    //                 true
    //             )
    //             this.refreshProduct(true, newId)
    //         }
    //     })
}

// /**
//  * Update product
//  *
//  * @param _product: ProductModel
//  * @param withBack: boolean
//  */
// updateProduct(_product: ProductModel, withBack: boolean = false) {
//     this.loadingSubject.next(true)

//     const updateProduct: Update<ProductModel> = {
//         id: _product.id,
//         changes: _product,
//     }

//     this.store.dispatch(
//         new ProductUpdated({
//             partialProduct: updateProduct,
//             product: _product,
//         })
//     )

//     of(undefined)
//         .pipe(delay(3000))
//         .subscribe(() => {
//             // Remove this line
//             if (withBack) {
//                 this.goBack(_product.id)
//             } else {
//                 const message = `Product successfully has been saved.`
//                 this.layoutUtilsService.showActionNotification(
//                     message,
//                     MessageType.Update,
//                     10000,
//                     true,
//                     true
//                 )
//                 this.refreshProduct(false)
//             }
//         }) // Remove this line
// }

/**
 * Returns component title
 */
getComponentTitle() {
    let result = "Ajouter Fournisseur"
    // if (!this.product || !this.product.id) {
    //     return result
    // }

    // result = `Modifier Fournisseur - `
    return result
}

/**
 * Close alert
 *
 * @param $event
 */
onAlertClose($event) {
    this.hasFormErrors = false
}

onchangetax(){
  const controls = this.addressForm.controls 
  this.taxService.getBy({ tx2_tax_code: controls.ad_taxc.value}).subscribe(
    (respo: any) => {
    // this.site = res.data.si_site
    console.log(respo.data)
    if(respo.data == null) {
   
      alert("Taxe N'existe pas")
      controls.ad_taxc.setValue(null)
      
      document.getElementById("ad_taxc").focus();
  //  controls.tr_ref_site.setValue(this.site );
    }
  })
}

changeAcct (field){

    const controls1 = this.providerForm.controls 
    let ac_code : any
    if (field=="vd_act_acct") {
       ac_code  = controls1.vd_act_acct.value
    
    }
    if (field=="vd_ap_acct") {
        ac_code  = controls1.vd_ap_acct.value
     
     }
    
  this.accountService.getBy({ac_code}).subscribe((res:any)=>{
      const {data} = res
      console.log(res)
      if (!data){ this.layoutUtilsService.showActionNotification(
          "ce compte n'existe pas!",
          MessageType.Create,
          10000,
          true,
          true
      )
      if (field=="vd_act_acct") {
        controls1.vd_act_acct.setValue(null)
        document.getElementById("vd_act_acct").focus();
     
     }
     if (field=="vd_ap_acct") {
      controls1.vd_act_acct.setValue(null)
      document.getElementById("vd_ap_acct").focus();
      
      }
      this.error = true}
      else {
          this.error = false
      }


  },error=>console.log(error))
}



handleSelectedRowsChanged3(e, args) {
    const controls1 = this.providerForm.controls
    

    if (Array.isArray(args.rows) && this.gridObj3) {
        args.rows.map((idx) => {
            const item = this.gridObj3.getDataItem(idx)
            // TODO : HERE itterate on selected field and change the value of the selected field
            switch (this.selectedField) {
              case "vd_act_acct": {
                  controls1.vd_act_acct.setValue(item.ac_code || "")
                  break
              }    
              case "vd_ap_acct": {
                  controls1.vd_ap_acct.setValue(item.ac_code || "")
                  break
              }
                default:
                    break
            }
        })
    }
}
  angularGridReady3(angularGrid: AngularGridInstance) {
    this.angularGrid3 = angularGrid
    this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid3() {
    this.columnDefinitions3 = [
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
            id: "ac_code",
            name: "Compte",
            field: "ac_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "ac_desc",
            name: "Designation",
            field: "ac_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "ac_type",
            name: "Type",
            field: "ac_type",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "ac_curr",
          name: "Devise",
          field: "ac_curr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "ac_stat_acc",
          name: "Compte Statique",
          field: "ac_stat_acc",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },

    ]

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
        },
        multiSelect: false,
        rowSelectionOptions: {
            selectActiveRow: true,
        },
    }

    // fill the dataset with your data
    this.accountService
        .getAll()
        .subscribe((response: any) => (this.data = response.data))
}
open3(content, field) {
    this.selectedField = field
    this.prepareGrid3()
    this.modalService.open(content, { size: "lg" })
}

handleSelectedRowsChangedtax(e, args) {
    const controls = this.addressForm.controls
    if (Array.isArray(args.rows) && this.gridObjtax) {
        args.rows.map((idx) => {
            const item = this.gridObjtax.getDataItem(idx)
            controls.ad_taxc.setValue(item.tx2_tax_code || "")
        })
    }
}

  angularGridReadytax(angularGrid: AngularGridInstance) {
    this.angularGridtax = angularGrid
    this.gridObjtax = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridtax() {
    this.columnDefinitionstax = [
        {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
        },
        {
            id: "tx2_tax_code",
            name: "code ",
            field: "tx2_tax_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "tx2_tax_pct",
          name: "Taux Taxe ",
          field: "tx2_tax_pct",
          sortable: true,
          filterable: true,
          type: FieldType.float,
      },
        {
            id: "tx2_desc",
            name: "Designation",
            field: "tx2_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "tx2_tax_type",
            name: "Type Taxe",
            field: "tx2_tax_type",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
    ]

    this.gridOptionstax = {
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
    }

    // fill the dataset with your data
    this.taxService
        .getAll()
        .subscribe((response: any) => (this.datatax = response.data))
}
opentax(contenttax) {
    this.prepareGridtax()
    this.modalService.open(contenttax, { size: "lg" })
}


handleSelectedRowsChanged4(e, args) {
    const controls1 = this.providerForm.controls;
    
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        switch (this.selectedField) {
          case "vd_cr_terms": {
            controls1.vd_cr_terms.setValue(item.code_value || "");
            break;
          }
          case "vd_ckfrm": {
            controls1.vd_ckfrm.setValue(item.code_value || "");
            break;
          }
         
          default:
            break;
        }
      });
    }
}
angularGridReady4(angularGrid: AngularGridInstance) {
    this.angularGrid4 = angularGrid;
    this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid4() {
    this.columnDefinitions4 = [
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
        id: "code_fldname",
        name: "Champs",
        field: "code_fldname",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "code_value",
        name: "Code",
        field: "code_value",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "code_cmmt",
        name: "Description",
        field: "code_cmmt",
        sortable: true,
        width: 200,
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
      checkboxSelector: {},
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };

    if (this.selectedField == "vd_ckfrm") {

        this.fldname = "check_form"
      }
      else {
        this.fldname = this.selectedField
      }
  
    // fill the dataset with your data
    this.codeService
      .getBy({ code_fldname: this.fldname })
      .subscribe((response: any) => (this.datacode = response.data));
  }

  open4(content, field) {
    this.selectedField = field;
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }
  onchangebank (){

    const controls = this.providerForm.controls 
    const bk_code  = controls.vd_bank.value
   
    
  this.bankService.getBy({bk_code}).subscribe((res:any)=>{
      //const {data} = res.data.bank
      //console.log(res.data.bank)
      if (res.data.bank == null){ 
        alert("Banque n'existe pas")
        controls.vd_bank.setValue(null)
        document.getElementById("vd_bank").focus();
      }
      else {
          this.error = false
  
          
      }


  },error=>console.log(error))
} 

  handleSelectedRowsChangedbank(e, args) {
    const controls = this.providerForm.controls;
    if (Array.isArray(args.rows) && this.gridObjbank) {
      args.rows.map((idx) => {
        const item = this.gridObjbank.getDataItem(idx);
        controls.vd_bank.setValue(item.bk_code || "");
            
      });
    }
  }
  
  angularGridReadybank(angularGrid: AngularGridInstance) {
    this.angularGridbank = angularGrid;
    this.gridObjbank = (angularGrid && angularGrid.slickGrid) || {};
  }
  
  prepareGridbank() {
    this.columnDefinitionsbank = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "bk_code",
        name: "code",
        field: "bk_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "address.ad_name",
        name: "Designation",
        field: "address.ad_name",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "bk_curr",
        name: "Devise",
        field: "bk_curr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "bk_entity",
        name: "Entité",
        field: "bk_entity",
        sortable: true,
        filterable: true,
        type: FieldType.boolean,
      },
    ];
  
    this.gridOptionsbank = {
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
    this.bankService
      .getAll()
      .subscribe((response: any) => (this.banks = response.data));
  }
  openbank(content) {
    this.prepareGridbank();
    this.modalService.open(content, { size: "lg" });
  }
  handleSelectedRowsChanged2(e, args) {
    const controls = this.providerForm.controls;
    if (Array.isArray(args.rows) && this.gridObj2) {
      args.rows.map((idx) => {
        const item = this.gridObj2.getDataItem(idx);
        controls.vd_curr.setValue(item.cu_curr || "");
      });
    }
  }

  angularGridReady2(angularGrid: AngularGridInstance) {
    this.angularGrid2 = angularGrid;
    this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid2() {
    this.columnDefinitions2 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "cu_curr",
        name: "code",
        field: "cu_curr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "cu_desc",
        name: "Designation",
        field: "cu_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "cu_rnd_mthd",
        name: "Methode Arrondi",
        field: "cu_rnd_mthd",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "cu_active",
        name: "Actif",
        field: "cu_active",
        sortable: true,
        filterable: true,
        type: FieldType.boolean,
      },
      {
        id: "cu_iso_curr",
        name: "Devise Iso",
        field: "cu_iso_curr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptions2 = {
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
    this.deviseService
      .getAll()
      .subscribe((response: any) => (this.devises = response.data));
  }
  open2(content) {
    this.prepareGrid2();
    this.modalService.open(content, { size: "lg" });
  }
  onChangeSeq() {
    const controls = this.providerForm.controls
    console.log(this.user.usrd_profile)
    this.sequenceService
        .getBy({seq_seq: controls.vd_seq.value, seq_type: 'PO'})
        .subscribe((response: any) => {
            console.log(response)
            if (response.data.length == 0) {
                alert("Sequence nexiste pas")
                controls.vd_seq.setValue("")
                console.log(response.data.length)
                document.getElementById("SEQUENCE").focus();
            } 
        })
}
  handleSelectedRowsChanged(e, args) {
    const controls = this.providerForm.controls
    if (Array.isArray(args.rows) && this.gridObj1) {
        args.rows.map((idx) => {
            const item = this.gridObj1.getDataItem(idx)
            controls.vd_seq.setValue(item.seq_seq || "")
        })
    }
}

angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid1 = angularGrid
    this.gridObj1 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid1() {
    this.columnDefinitions1 = [
        {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
        },
        {
            id: "seq_seq",
            name: "code sequence",
            field: "seq_seq",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "seq_desc",
            name: "description",
            field: "seq_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "seq_appr1",
            name: "approbateur 1",
            field: "seq_appr1",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "seq_appr2",
            name: "approbateur 2",
            field: "seq_appr2",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "seq_appr3",
            name: "approbateur 3",
            field: "seq_appr3",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
    ]

    this.gridOptions1 = {
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
    }

    // fill the dataset with your data
   
    this.sequenceService
        .getBy({seq_type: 'PO'})
        .subscribe((response: any) => (this.sequences = response.data))
       
}
open1(content) {
    this.prepareGrid1()
    this.modalService.open(content, { size: "lg" })
}

printpdf() {
          const controls = this.providerForm.controls;
          const controlsa = this.addressForm.controls;
          const controlsx = this.formX.controls;
          var doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            //format: [100,150]
            })
            let initialY = 25;
            doc.setLineWidth(0.2);
          
          var img = new Image();
          // img.src = "companylogo.png";
          // doc.addImage(img, "png", 150, 5, 50, 30);
          doc.setFontSize(14);
    
        
          const date = new Date()
          doc.setFontSize(14);
    
          
          doc.setFont("Times-Roman");
    
          doc.text("Code Fournisseur : " + controlsx.ad_addr.value, 40, initialY + 5);
    
          doc.setFontSize(10);
          doc.text("Nom Fournisseur: " + controlsx.ad_name.value, 5, initialY + 15);
          doc.text("Activité: " + controls.vd_sort.value, 55, initialY + 15);
          
          doc.text("Addresse: " + controlsa.ad_line1.value, 5, initialY + 20);
          doc.text("Pays: " + controlsa.ad_country.value, 5, initialY + 25);
          doc.text("Tel: " + controlsa.ad_phone.value, 5, initialY + 30);
          doc.text("Email: " + controlsa.ad_ext.value, 55, initialY + 30);
          doc.text("Taxable: " + controlsa.ad_taxable.value, 5, initialY + 45);
          doc.text("Taux de taxe: " + controlsa.ad_taxc.value, 55, initialY + 45);
          // doc.text("DA Obligatoire: " + controls.pt_plan_ord.value, 5, initialY + 45);
          // doc.text("Achat: " + controls.pt_dea.value, 55, initialY + 45);
          doc.text("RC N°: " + controlsa.ad_gst_id.value, 5, initialY + 55);
          doc.text("NIF: " + controlsa.ad_misc2_id.value, 55, initialY + 55);
          doc.text("AI: " + controlsa.ad_pst_id.value, 5, initialY + 60);
          doc.text("NIS: " + controlsa.ad_misc1_id.value, 55, initialY + 60);
          
          // doc.text("Fournisseur: " + controls.pt_vend.value, 5, initialY + 80);
          doc.text("Type: " + controls.vd_type.value, 5, initialY + 70);
          doc.text("Séquence: " + controls.vd_seq.value, 55, initialY + 70);
          doc.text("Modalité de transport: " + controls.vd_shipvia.value, 5, initialY + 75);
          doc.text("Banque: " + controls.vd_bank.value, 5, initialY + 80);
          doc.text("Méthode de paiement: " + controls.vd_ckfrm.value, 55, initialY + 80);
          doc.text("Délai: " + controls.vd_cr_terms.value, 105, initialY + 80);
          doc.text("Devise: " + controls.vd_curr.value, 5, initialY + 85);
          doc.text("RIB: " + controls.vd_db.value, 55, initialY + 85);
          doc.text("Compte: " + controls.vd_debtor.value, 5, initialY + 90);
          
    
        
      
          doc.setFontSize(9);
    
     var i = 35
    
        
    
          
            var blob = doc.output("blob");
            window.open(URL.createObjectURL(blob));   
          }
}
