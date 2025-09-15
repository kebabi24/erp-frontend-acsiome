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
    CustomerService,
} from "../../../../core/erp"

import { jsPDF } from "jspdf";

@Component({
  selector: 'kt-edit-std-provider',
  templateUrl: './edit-std-provider.component.html',
  styleUrls: ['./edit-std-provider.component.scss']
})
export class EditStdProviderComponent implements OnInit {

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


customers: [];
    columnDefinitions5: Column[] = [];
    gridOptions5: GridOption = {};
    gridObj5: any;
    angularGrid5: AngularGridInstance;

pays:any;
vdtype:any;
seq:any;
shipvia:any;
banque:any;
ckfrm:any;
crterms:any;
devise:any;
docs:any[]=[];
exist:any;
providerEdit: any
    addressEdit: any
    title: String = 'Modifier Fournisseur - '

    trangularGrid: AngularGridInstance;
trgrid: any;
trgridService: GridService;
trdataView: any;
trcolumnDefinitions: Column[];
trgridOptions: GridOption;
trdataset: any[];
row_number : any
dataAct: any[]
columnDefinitionsAct: Column[] = []
gridOptionsAct: GridOption = {}
gridObjAct: any
angularGridAct: AngularGridInstance
dataclas: any[]
columnDefinitionsclas: Column[] = []
gridOptionsclas: GridOption = {}
gridObjclas: any
angularGridclas: AngularGridInstance
selectedIndexes2: any[];
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
    private customerService: CustomerService,
    config: NgbDropdownConfig
) {
    config.autoClose = true
    
    this.codeService
        .getBy({ code_fldname: "ad_state" })
        .subscribe((response: any) => (this.ad_state = response.data))
        this.codeService
        .getBy({ code_fldname: "ad_country" })
        .subscribe((response: any) => (this.ad_country = response.data))
    // this.codeService
    //     .getBy({ code_fldname: "ad_city" })
    //     .subscribe((response: any) => (this.ad_city = response.data))
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
        this.codeService
        .getBy({ code_fldname: "pt_draw" })
        .subscribe((response: any) => (this.dataAct = response.data)) 
        this.codeService
        .getBy({ code_fldname: "pt_group" })
        .subscribe((response: any) => (this.dataclas = response.data))          
}

/**
 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
 */

/**
 * On init
 */
ngOnInit() {
  this.loading$ = this.loadingSubject.asObservable()
  this.loadingSubject.next(true)
  this.user =  JSON.parse(localStorage.getItem('user'))
  this.activatedRoute.params.subscribe((params) => {
      const id = params.id
      this.providerService.getOne(id).subscribe((response: any)=>{
        console.log(response.data) 
        if(response.data != null) {
        this.providerEdit = response.data
          this.addressEdit = response.data.address
          console.log(this.providerEdit)
          console.log(this.addressEdit)
         this.trdataset = response.data.providerBanks
        this.initCode()
        this.inittrGrid()
        window.onload = () => {
          const style = getComputedStyle(document.getElementById("kt_header"))
          this.headerMargin = parseInt(style.height, 0)
      }
        this.loadingSubject.next(false)
        this.title = this.title + this.providerEdit.vd_addr
    }  })

      })

}
initCode() {
  this.createFormX()
  this.createAddressForm()
  this.createProviderForm()
  
  this.loadingSubject.next(false)
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
                controls.ad_user1.enable()
                controls.ad_user2.enable()
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
                controls1.vd_remit.enable()
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
                controls1.vd_vt_id.enable()
                controls1.vd_db.enable()
                controlsX.ad_addr.setValue('FOUR-' + name + String('000'+ String(Number(response.data.length) + Number(1))).slice(-3))  
               
                // document.getElementById("ad_line1").focus(); 
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
            controls.ad_user1.enable()
            controls.ad_user2.enable()
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
            controls1.vd_remit.enable()
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
            controls1.vd_vt_id.enable()
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
    this.devise = response.data.cu_desc
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
    ad_addr: [this.addressEdit.ad_addr, Validators.required],
    ad_name: [this.addressEdit.ad_name, Validators.required],
    ad_temp: [this.addressEdit.ad_temp],
  })
  console.log(" this.addressEdit.ad_state.", this.addressEdit.ad_state)
  if(this.addressEdit.ad_state != null) {
  this.codeService
    .getBy({ code_fldname: "ad_city", chr01: this.addressEdit.ad_state.substring(0, 2) })
    .subscribe((response: any) => {
      if(response.data.length != 0) { (this.ad_city = response.data)
    console.log(response.data) }
      })
    }
    this.codeService
    .getBy({ code_fldname: "bank", code_value: this.providerEdit.vd_bank })
    .subscribe((respo: any) => { if(respo.data.length != 0) {this.banque = respo.data[0].code_cmmt} else {this.banque = ''}
    })
    this.deviseService
    .getBy({ cu_curr:  this.providerEdit.vd_curr })
    .subscribe((resp: any) => { if(resp.data!= null) {this.devise = resp.data.cu_desc} else {this.devise = ''}
    })
}
createAddressForm() {
  
    this.addressForm = this.formBuilder.group({
      
        ad_line1:  [this.addressEdit.ad_line1],
        ad_city: [this.addressEdit.ad_city],
        ad_state: [this.addressEdit.ad_state],
        ad_zip: [this.addressEdit.ad_zip],
        ad_format: [this.addressEdit.ad_format],
        // ad_county: [addressEdit.ad_county],
        ad_country: [this.addressEdit.ad_country],
        
        ad_phone: [this.addressEdit.ad_phone],
        ad_phone2: [this.addressEdit.ad_phone],
        ad_ext: [this.addressEdit.ad_ext],
        ad_ext2: [this.addressEdit.ad_ext2],
        ad_fax: [this.addressEdit.ad_fax],
        ad_fax2: [this.addressEdit.ad_fax2],
        ad_attn: [this.addressEdit.ad_attn],
        ad_user1: [this.addressEdit.ad_user1],
        ad_user2: [this.addressEdit.ad_user2],
        ad_attn2: [this.addressEdit.ad_attn2],
        ad_taxable: [this.addressEdit.ad_taxable],
        ad_tax_zone: [this.addressEdit.ad_tax_zone],
        ad_taxc: [this.addressEdit.ad_taxc],
        ad_tax_usage: [this.addressEdit.ad_tax_usage],
        ad_tax_in: [this.addressEdit.ad_tax_in],
        ad_gst_id: [this.addressEdit.ad_gst_id],
        ad_pst_id: [this.addressEdit.ad_pst_id],
        ad_misc1_id: [this.addressEdit.ad_misc1_id],
        ad_misc2_id: [this.addressEdit.ad_misc2_id],
    })
   
}
createProviderForm() {
    this.provider = new Provider()
    this.providerForm = this.formBuilder.group({
        vd_sort: [this.providerEdit.vd_sort],
        vd_remit: [this.providerEdit.vd_remit],
        vd_type: [this.providerEdit.vd_type],
        vd_seq: [this.providerEdit.vd_seq],
        vd_act_acct: [this.providerEdit.vd_act_acct],
        vd_act_sub: [this.providerEdit.vd_act_sub],
        vd_act_cc: [this.providerEdit.vd_act_cc],
        vd_ap_acct: [this.providerEdit.vd_ap_acct],
        vd_ap_sub: [this.providerEdit.vd_ap_sub],
        vd_ap_cc: [this.providerEdit.vd_ap_cc],
        vd_shipvia: [this.providerEdit.vd_shipvia],
        vd_bank: [this.providerEdit.vd_bank],
        vd_ckfrm: [this.providerEdit.vd_ckfrm],
        vd_curr: [this.providerEdit.vd_curr],
        vd_lang: [this.providerEdit.vd_lang],
        // vd_pur_cntct: [this.providerEdit.vd_pur_cntct],
        // vd_ap_cntct: [this.providerEdit.vd_ap_cntct],
        vd_misc_cr: [this.providerEdit.vd_misc_cr],
        vd_carrier_id: [this.providerEdit.vd_carrier_id],
        vd_promo: [this.providerEdit.vd_promo],
        vd_kanban_supplier: [this.providerEdit.vd_kanban_supplier],
        vd_cr_terms: [this.providerEdit.vd_cr_terms],
        vd_disc_pct: [this.providerEdit.vd_disc_pct],
        vd_prepay: [this.providerEdit.vd_prepay],
        vd_debtor: [this.providerEdit.vd_debtor],
        vd_partial: [this.providerEdit.vd_partial],
        vd_hold: [this.providerEdit.vd_hold],
        vd_pay_spec: [this.providerEdit.vd_pay_spec],
        vd_vt_id: [this.providerEdit.vd_vt_id],
        vd_db: [this.providerEdit.vd_db],
    })
}

onchangeRC(){
  const controls = this.addressForm.controls
  if(controls.ad_country.value == 'DZ') {
    console.log("controls.ad_gst_id.value.length",controls.ad_gst_id.value.length)
    if(controls.ad_gst_id.value.length != 15) {
      alert("RC n'est pas conforme au réglementation")
      document.getElementById("ad_gst_id").focus(); 
    }
  }
}
onchangeMF(){
  const controls = this.addressForm.controls
  if(controls.ad_country.value == 'DZ') {
    console.log("controls.ad_misc2_id.value.length",controls.ad_misc2_id.value.length)
    if(controls.ad_misc2_id.value.length != 15) {
      alert("MF n'est pas conforme au réglementation")
      document.getElementById("ad_misc2_id").focus(); 
    }
  }
}
onchangeAI(){
  const controls = this.addressForm.controls
  if(controls.ad_country.value == 'DZ') {
    console.log("controls.ad_pst_id.value.length",controls.ad_pst_id.value.length)
    if(controls.ad_pst_id.value.length != 15) {
      alert("AI n'est pas conforme au réglementation")
      document.getElementById("ad_pst_id").focus(); 
    }
  }
}
onchangeNIS(){
  const controls = this.addressForm.controls
  if(controls.ad_country.value == 'DZ') {
    console.log("controls.ad_misc1_id.value.length",controls.ad_misc1_id.value.length)
    if(controls.ad_misc1_id.value.length != 15) {
      alert("NIS n'est pas conforme au réglementation")
      document.getElementById("ad_misc1_id").focus(); 
    }
  }
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
                controls.ad_user1.enable()
                controls.ad_user2.enable()
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
                controls1.vd_remit.enable()
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
                controls1.vd_vt_id.enable()
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
this.codeService
      .getBy({ code_fldname: 'check_form',code_value:controls_.vd_ckfrm.value })
      .subscribe((response: any) => (
        this.ckfrm = response.data[0].code_cmmt,
        
        this.codeService.getBy({ code_fldname: 'vd_cr_terms',code_value:controls_.vd_cr_terms.value })
        .subscribe((response1: any) => (this.crterms = response1.data[0].code_cmmt,
          this.codeService.getBy({ code_fldname: 'vd_type',code_value:controls_.vd_type.value })
          .subscribe((response2: any) => (this.vdtype = response2.data[0].code_cmmt,
            this.codeService.getBy({ code_fldname: 'ad_country',code_value:controls.ad_country.value })
            .subscribe((response3: any) => (this.pays = response3.data[0].code_cmmt,
              this.codeService.getBy({ code_fldname: 'vd_shipvia',code_value:controls_.vd_shipvia.value })
              .subscribe((response4: any) => (this.shipvia = response4.data[0].code_cmmt,
                
                      this.printpdf()
              ))             
            ))
          ))    
        ))
      ));

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
    _address.ad_user1 = controls.ad_user1.value
    _address.ad_user2 = controls.ad_user2.value
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
          let provider = this.prepareProvider()
          for (let tr of this.trdataset ) {
            delete tr.id
            delete tr.cmvid
          }
          this.addProvider(provider,this.trdataset)
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
    _provider.vd_remit = controls.vd_remit.value
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
    _provider.vd_vt_id = controls.vd_vt_id.value
    _provider.vd_db = controls.vd_db.value
    return _provider
}

/**
 * Add product
 *
 * @param _product: ProductModel
 */
addProvider(_provider: Provider,detail:any) {
  this.loadingSubject.next(true)
  this.providerService.update(this.providerEdit.id,{Provider:_provider, BankDetails:detail}).subscribe(
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
          this.router.navigateByUrl("/providers/list-std-provider")
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
  let updateItem = this.trgridService.getDataItemByRowIndex(this.row_number);
    const controls1 = this.providerForm.controls;
    
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        
            // controls1.vd_bank.setValue(item.code_value || "");
            updateItem.vdbk_bank = item.code_value
            updateItem.vdbk_desc = item.code_cmmt
            this.trgridService.updateItem(updateItem);
            this.banque = item.code_cmmt
         
        
      });
    }
}
angularGridReady4(angularGrid: AngularGridInstance) {
    this.angularGrid4 = angularGrid;
    this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid4() {
    this.columnDefinitions4 = [
      // {
      //   id: "id",
      //   field: "id",
      //   excludeFromColumnPicker: true,
      //   excludeFromGridMenu: true,
      //   excludeFromHeaderMenu: true,

      //   minWidth: 50,
      //   maxWidth: 50,
      // },
      // {
      //   id: "id",
      //   name: "id",
      //   field: "id",
      //   sortable: true,
      //   minWidth: 80,
      //   maxWidth: 80,
      // },
      // {
      //   id: "code_fldname",
      //   name: "Champs",
      //   field: "code_fldname",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.string,
      // },
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
        name: "Désignation",
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

  
    // fill the dataset with your data
    this.codeService
      .getBy({ code_fldname: "bank" })
      .subscribe((response: any) => {
        console.log(response.data)
        this.datacode = response.data})
    
  }

  open4(content) {
    
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }
  onchangebank (){

    const controls = this.providerForm.controls 
    const bk_code  = controls.vd_bank.value
   
    
  this.codeService.getBy({code_fldname:'bank', code_value:bk_code}).subscribe((res:any)=>{
      //const {data} = res.data.bank
      //console.log(res.data.bank)
      if (res.data.length == 0){ 
        alert("Banque n'existe pas")
        controls.vd_bank.setValue(null)
        document.getElementById("vd_bank").focus();
        
       
      }
      else {
          this.error = false
          this.banque = res.data[0].code_cmmt  
          // this.devise = res.data.bank.bk_curr  
          
      }


  },error=>console.log(error))
} 

  handleSelectedRowsChangedbank(e, args) {
    const controls = this.providerForm.controls;
    if (Array.isArray(args.rows) && this.gridObjbank) {
      args.rows.map((idx) => {
        const item = this.gridObjbank.getDataItem(idx);
        controls.vd_bank.setValue(item.bk_code || "");
        this.banque = item.address.ad_name  
        this.devise = item.bk_curr  
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
        this.devise = item.cu_desc
      });
    }
  }
  OnchangeCurr(){
    const controls = this.providerForm.controls
    
          this.deviseService
          .getBy({ cu_curr: controls.vd_curr.value })
          .subscribe((response: any) => {

            if (response.data == null){ 
              alert("Devise n'existe pas")
              controls.vd_curr.setValue(null)
              document.getElementById("vd_curr").focus();
            }
        })
         
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
            else{this.seq = response.data[0].seq_desc} 
        })
}
  handleSelectedRowsChanged(e, args) {
    const controls = this.providerForm.controls
    if (Array.isArray(args.rows) && this.gridObj1) {
        args.rows.map((idx) => {
            const item = this.gridObj1.getDataItem(idx)
            controls.vd_seq.setValue(item.seq_seq || "")
            this.seq = item.seq_desc
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
           img.src = "./assets/media/logos/companyentete.png";
           doc.addImage(img, "png", 5, 5, 200, 30);
          doc.setFontSize(8);
       if(this.exist == true){
    doc.text(this.docs[0].code_value, 160, 17); 
    doc.setFontSize(10);
    doc.text(this.docs[0].code_cmmt, 55, 22);
    doc.setFontSize(8);
    doc.text(this.docs[0].code_desc, 165, 12);
    doc.text(this.docs[0].chr01, 22, 27);
    doc.text(String(1), 22, 32);
    doc.text(this.docs[0].dec01, 170, 32);
    doc.text(this.docs[0].date01, 180, 22);
    doc.text(this.docs[0].date02, 180, 27);
  }
        
          const date = new Date()
          doc.setFontSize(16);
    
          
          doc.setFont("Times-Roman");
          doc.line(35,35,150,35)
          doc.text("Code Fournisseur : " + controlsx.ad_addr.value, 40, 40);
          doc.line(35,45,150,45)
          doc.setFontSize(12);
          
          doc.text("Nom Fournisseur: " + controlsx.ad_name.value, 7, 50);
          if(controls.vd_sort.value != null){doc.text("Sous-famille: " + controls.vd_sort.value, 7, 55);}
          else {doc.text("sous-famille: " , 7, 55);}
          if(controls.vd_remit.value != null){doc.text("Classe: " + controls.vd_remit.value, 7, 55);}
          else {doc.text("Classe: " , 67, 55);}
          doc.line(5,60,200,60)
          if(controlsa.ad_line1.value != null){doc.text("Addresse: " + controlsa.ad_line1.value, 7, 65);}
          else{doc.text("Addresse: ", 7, 65);}
          if(controlsa.ad_country.value != null){doc.text("Pays: " + controlsa.ad_country.value + ' ' + this.pays, 7, 70);}
          else{doc.text("Pays: ", 7, 70);}
          // doc.line(5,75,200,75)
          if(controlsa.ad_phone.value != null){doc.text("Tel: " + controlsa.ad_phone.value, 7, 80);}
          else{doc.text("Tel: ", 7, 80);}  
          if(controlsa.ad_ext.value != null){doc.text("Email: " + controlsa.ad_ext.value, 57, 80);}
          else{doc.text("Email: ", 57, 80)}  
          doc.line(5,85,200,85)
          if ( controlsa.ad_taxable.value == true) {
          doc.text("Taxable: " + "OUI", 7, 90); } else {
            doc.text("Taxable: " + "NON", 7, 90);
          }
          doc.text("Taux de taxe: " + controlsa.ad_taxc.value, 57, 90);
          // doc.line(5,85,200,85)
          // doc.text("DA Obligatoire: " + controls.pt_plan_ord.value, 5, initialY + 45);
          // doc.text("Achat: " + controls.pt_dea.value, 55, initialY + 45);
          if(controlsa.ad_gst_id.value != null){doc.text("RC N°: " + controlsa.ad_gst_id.value, 7, 95);}
          else{doc.text("RC N°: ", 7, 95)}
          if(controlsa.ad_misc2_id.value != null){doc.text("NIF: " + controlsa.ad_misc2_id.value, 57, 95);}
          else{doc.text("NIF: ", 57, 95)}
          if(controlsa.ad_pst_id.value != null){doc.text("AI: " + controlsa.ad_pst_id.value, 7, 100);}
          else{doc.text("AI: " , 7, 100)}
          if(controlsa.ad_misc1_id.value != null){doc.text("NIS: " + controlsa.ad_misc1_id.value, 57, 100);}
          {doc.text("NIS: ", 57, 100)}
          doc.line(5,105,200,105)
          
          if(controls.vd_type.value != null){doc.text("Type: " + controls.vd_type.value , 7, 110);}
          else{doc.text("Type: ", 7, 110)}
          if(controls.vd_seq.value!=null){doc.text("Séquence: " + controls.vd_seq.value + ' - ' + this.seq, 7, 115);}
          else{doc.text("Séquence: ", 7, 115)}
          if(controls.vd_shipvia.value!=null){doc.text("Modalité de transport: " + controls.vd_shipvia.value + ' - ' + this.shipvia, 7, 120);}
          else{doc.text("Modalité de transport: ", 7, 120)}
          doc.line(5,125,200,125)
          // if(controls.vd_bank.value!=null){doc.text("Banque: " + controls.vd_bank.value + ' - ' + this.banque, 7, 130);}
          // else{doc.text("Banque: ", 7, 130)}
          if(controls.vd_ckfrm.value!=null){doc.text("Méthode de paiement: " + controls.vd_ckfrm.value + ' - ' + this.ckfrm, 7, 130);}
          else{doc.text("Méthode de paiement: ", 7, 130)}
          if(controls.vd_cr_terms.value!=null){doc.text("Condition: " + controls.vd_cr_terms.value + ' -  ' + this.crterms, 7, 135);}
          else{doc.text("Condition: ", 7, 135)}
          if(controls.vd_curr.value!=null){doc.text("Devise: " + controls.vd_curr.value + ' - ' + this.devise, 7, 140);}
          else{doc.text("Devise: ", 7, 140)}
          // if(controls.vd_db.value!=null){doc.text("RIB: " + controls.vd_db.value, 7, 150);}
          // else{doc.text("RIB: ", 7, 150)}
          // if(controls.vd_debtor.value!=null){doc.text("Compte: " + controls.vd_debtor.value, 7, 155);}
          // else{doc.text("Compte: ", 7, 155)}
          doc.line(5,145,200,145)
          if(controlsa.ad_attn.value != null){doc.text("Contact 1: " + controlsa.ad_attn.value, 7, 150)}
          if(controlsa.ad_user1.value != null){doc.text("Poste: " + controlsa.ad_user1.value, 7, 155)}
          if(controlsa.ad_phone.value != null){doc.text("Téléphone: " + controlsa.ad_phone.value, 7, 160)}
          if(controlsa.ad_ext.value != null){doc.text("Email: " + controlsa.ad_ext.value, 7, 165)}
          if(controlsa.ad_fax.value != null){doc.text("Fax: " + controlsa.ad_fax.value, 7, 170)}

          if(controlsa.ad_attn2.value != null){doc.text("Contact 2: " + controlsa.ad_attn2.value, 7, 175)}
          if(controlsa.ad_user2.value != null){doc.text("Poste: " + controlsa.ad_user2.value, 7, 180)}
          if(controlsa.ad_phone2.value != null){doc.text("Téléphone: " + controlsa.ad_phone2.value, 7, 185)}
          if(controlsa.ad_ext2.value != null){doc.text("Email: " + controlsa.ad_ext2.value, 7, 190)}
          if(controlsa.ad_fax2.value != null){doc.text("Fax: " + controlsa.ad_fax2.value, 7, 195)}
          doc.line(5,200,200,200)
          {doc.text("Banques: " , 7, 205)}
          doc.setFontSize(9);
          doc.line(5, 210, 200, 210);
          doc.line(5, 215, 200, 215);
          doc.line(5, 210, 5, 215);
          doc.text('Banque', 15 , 213.5);
          doc.line(30, 210, 30, 215);
          doc.text('Désignation', 52 , 213.5);
          doc.line(110, 210, 110, 215);
          doc.text('RIB', 130 , 213.5);
          doc.line(155, 210, 155, 215);
          doc.text('N° Compte', 160 , 213.5);
          doc.line(200, 210, 200, 215);
          i = 220
          for (let tr of this.trdataset) {
            doc.line(5, i - 5, 5, i);
            doc.text( String(tr.vdbk_bank), 7,  i-1)
            doc.line(30, i - 5, 30, i);
            doc.text( String(tr.vdbk_desc), 32,  i-1)
            doc.line(110, i - 5, 110, i);
            doc.text( String(tr.vdbk_rib), 112,  i-1)
            doc.line(155, i - 5, 155, i);
            doc.text( String(tr.vdbk_num), 157,  i-1)
            doc.line(200, i - 5, 200, i);

            doc.line(5, i, 200, i );
            i = i + 5

          }
          doc.setFontSize(9);
    
     var i = 35
    
        
    
          
            var blob = doc.output("blob");
            window.open(URL.createObjectURL(blob));   
          }

          

  trGridReady(angularGrid: AngularGridInstance) {
    this.trangularGrid = angularGrid;
    this.trdataView = angularGrid.dataView;
    this.trgrid = angularGrid.slickGrid;
    this.trgridService = angularGrid.gridService;
  }
  inittrGrid() {
    this.trcolumnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.trangularGrid.gridService.deleteItem(args.dataContext);
          }
        },
      
      },
      {
        id: "vdbk_bank",
        name: "Code Banque",
        field: "vdbk_bank",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvid",
        field: "cmvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
        
         console.log(args.row)
           this.row_number = args.row
          let element: HTMLElement = document.getElementById(
              "openBanksGrid"
          ) as HTMLElement
          element.click()
          }  
        
      },
      {
        id: "vdbk_desc",
        name: "Designation",
        field: "vdbk_desc",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
      
      },
      {
        id: "vdbk_rib",
        name: "RIB",
        field: "vdbk_rib",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "vdbk_num",
        name: "N° Compte",
        field: "vdbk_num",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
     
    ];
  
    this.trgridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableAutoResize:true,
      autoHeight:false,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      rowHeight:40,
    };
   
  
  }
  
  addNewtrItem() {
    const controlsX = this.formX.controls
    this.trgridService.addItem(
      {
        id: this.trdataset.length + 1,
        vdbk_addr: controlsX.ad_addr.value,
        vdbk_bank: null,
        vdbk_rib: null,
        vdbk_num: null
      },
      { position: "bottom" }
    );
    this.row_number = this.trdataset.length - 1;
          // this.row_number = args.row
          let element: HTMLElement = document.getElementById(
            "openBanksGrid"
        ) as HTMLElement
        element.click()
  }

  onChangeCust() {
    const controls = this.providerForm.controls; // chof le champs hada wesh men form rah
    const cm_addr = controls.vd_vt_id.value;
   
    this.customerService.getBy({ cm_addr, cm_hold: false }).subscribe(
      (res: any) => {
        console.log(res);
        const { data } = res;
  
        if (!data) {
          alert( "ce client n'existe pas! ou bien bloqué")
          controls.vd_vt_id.setValue(null)
          document.getElementById("vd_vt_id").focus()
          this.error = true;
        } else {
          this.error = false;
        
         
         
        }
         
      },
      (error) => console.log(error)
    );
  }
  handleSelectedRowsChanged5(e, args) {
    const controls = this.providerForm.controls;
    if (Array.isArray(args.rows) && this.gridObj5) {
      args.rows.map((idx) => {
        const item = this.gridObj5.getDataItem(idx);
        console.log(item)
        const date = new Date()
  
  
        // this.customer = item;
        controls.vd_vt_id.setValue(item.cm_addr || "");
        
       
       
        
  
      });
    }
  }
  
  angularGridReady5(angularGrid: AngularGridInstance) {
    this.angularGrid5 = angularGrid;
    this.gridObj5 = (angularGrid && angularGrid.slickGrid) || {};
  }
  
  prepareGrid5() {
    this.columnDefinitions5 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "cm_addr",
        name: "code",
        field: "cm_addr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_name",
        name: "Client",
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
  
    this.gridOptions5 = {
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
    this.customerService
      .getByAll({ cm_hold: false })
      .subscribe((response: any) => (this.customers = response.data));
  }
  open5(content) {
    this.prepareGrid5();
    this.modalService.open(content, { size: "lg" });
  }
  handleSelectedRowsChangedAct(e, args) {
    const controls1 = this.providerForm.controls
    let act=''
  
    if (Array.isArray(args.rows) && this.gridObjAct) {
        args.rows.map((idx) => {
            const item = this.gridObjAct.getDataItem(idx)
            // TODO : HERE itterate on selected field and change the value of the selected field
           if(act =='') { act = item.code_value } else {
               act = act + "," +  item.code_value }
           
        })
    }
    controls1.vd_sort.setValue(act)
  }
  angularGridReadyAct(angularGrid: AngularGridInstance) {
    this.angularGridAct = angularGrid
    this.gridObjAct = (angularGrid && angularGrid.slickGrid) || {}
  }
  
  prepareGridAct() {
    this.columnDefinitionsAct = [
        
        {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
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
          name: "Designation",
          field: "code_cmmt",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
  
    ]
  
    this.gridOptionsAct = {
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
        multiSelect: true,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false,
      },
      presets: {
        sorters: [{ columnId: "id", direction: "ASC" }],
        rowSelection: {
          // gridRowIndexes: [2],           // the row position of what you see on the screen (UI)
          gridRowIndexes: this.selectedIndexes2, // (recommended) select by your data object IDs
          //dataContextIds
        },
      },
    }
  
    // fill the dataset with your data
    // this.codeService
    //     .getBy({code_fldname:"vd_sort"})
    //     .subscribe((response: any) => (this.dataAct = response.data))
  }
  openAct(content) {
    console.log(this.dataAct)
    const controls = this.providerForm.controls
    const myArray = controls.vd_sort.value.split(',');
    console.log(myArray)
    // let dd = myArray;
    let dd=[]
    console.log(dd.length)
    for (let i = 0; i < myArray.length; i++) {
     console.log(myArray[i])
      //this.selectedIndexes2.push(1)
    //   let index = this.dataAct.findIndex((service:any)=>{return service.code_value === dd[i]})
      let index = this.dataAct.findIndex(x => x.code_value == myArray[i]); 
      // console.log(index)
      if (index != -1) {
      dd.push(index);
      }
      // console.log("i",i)
    }
    console.log(dd)
    // console.log(this.selectedIndexes2)
    // console.log(dd)
    this.selectedIndexes2 = dd;
    this.prepareGridAct()
    this.modalService.open(content, { size: "lg" })
  }

  handleSelectedRowsChangedclas(e, args) {
    const controls1 = this.providerForm.controls
    let act=''
  
    if (Array.isArray(args.rows) && this.gridObjclas) {
        args.rows.map((idx) => {
            const item = this.gridObjclas.getDataItem(idx)
            // TODO : HERE itterate on selected field and change the value of the selected field
           if(act =='') { act = item.code_value } else {
               act = act + "," +  item.code_value }
           
        })
    }
    controls1.vd_remit.setValue(act)
  }
  angularGridReadyclas(angularGrid: AngularGridInstance) {
    this.angularGridclas = angularGrid
    this.gridObjclas = (angularGrid && angularGrid.slickGrid) || {}
  }
  
  prepareGridclas() {
    this.columnDefinitionsclas = [
        
        {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
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
          name: "Designation",
          field: "code_cmmt",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
  
    ]
  
    this.gridOptionsclas = {
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
        multiSelect: true,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false,
      },
      presets: {
        sorters: [{ columnId: "id", direction: "ASC" }],
        rowSelection: {
          // gridRowIndexes: [2],           // the row position of what you see on the screen (UI)
          gridRowIndexes: this.selectedIndexes2, // (recommended) select by your data object IDs
          //dataContextIds
        },
      },
    }
  
    // fill the dataset with your data
    // this.codeService
    //     .getBy({code_fldname:"vd_sort"})
    //     .subscribe((response: any) => (this.dataAct = response.data))
  }
  openclas(content) {
    console.log(this.dataclas)
    const controls = this.providerForm.controls
    const myArray = controls.vd_remit.value.split(',');
    console.log(myArray)
    // let dd = myArray;
    let dd=[]
    console.log(dd.length)
    for (let i = 0; i < myArray.length; i++) {
     console.log(myArray[i])
      //this.selectedIndexes2.push(1)
    //   let index = this.dataAct.findIndex((service:any)=>{return service.code_value === dd[i]})
      let index = this.dataclas.findIndex(x => x.code_value == myArray[i]); 
      // console.log(index)
      if (index != -1) {
      dd.push(index);
      }
      // console.log("i",i)
    }
    console.log(dd)
    // console.log(this.selectedIndexes2)
    // console.log(dd)
    this.selectedIndexes2 = dd;
    this.prepareGridclas()
    this.modalService.open(content, { size: "lg" })
  }
  
}
