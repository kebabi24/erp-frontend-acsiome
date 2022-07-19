import { Component, OnInit } from "@angular/core"
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
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid"
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
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap"
import { ProductLine,  AccountService, CodeService, ProductLineService,TaxeService} from "../../../../core/erp"
@Component({
  selector: 'kt-product-ligne',
  templateUrl: './product-ligne.component.html',
  styleUrls: ['./product-ligne.component.scss'],
  providers: [NgbDropdownConfig, NgbTabsetConfig],

})
export class ProductLigneComponent implements OnInit {


  productligneForm: FormGroup;
  stockForm: FormGroup;
  achatForm: FormGroup;
  venteForm: FormGroup;
  prodForm : FormGroup;
  productLine: ProductLine
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

  angularGrid: AngularGridInstance
  grid: any
  gridService: GridService
  dataView: any
  columnDefinitions: Column[]
  gridOptions: GridOption
  dataset: any[]
  
  selectedField = ""

accounts: []
  columnDefinitions3: Column[] = []
  gridOptions3: GridOption = {}
  gridObj3: any
  angularGrid3: AngularGridInstance

  datatax: []
  columnDefinitionstax: Column[] = []
  gridOptionstax: GridOption = {}
  gridObjtax: any
  angularGridtax: AngularGridInstance

  row_number


  constructor(
    config: NgbDropdownConfig,
    private productlineFB: FormBuilder,
    private stockFB: FormBuilder,
    private achatFB: FormBuilder,
    private venteFB: FormBuilder,
    private prodFB: FormBuilder, 
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private productlineService: ProductLineService,
    private codeService: CodeService,
    private accountService: AccountService,
    private taxService: TaxeService
    ) {
     config.autoClose = true
     
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.createForm()
  }
    //create form
    createForm() {
      this.loadingSubject.next(false)

      this.productLine = new ProductLine()
      this.productligneForm = this.productlineFB.group({
        pl_prod_line: [this.productLine.pl_prod_line, Validators.required],
        pl_desc:      [{ value: this.productLine.pl_desc, disabled: !this.isExist },Validators.required],
       
        pl_taxable:    [{ value: this.productLine.pl_taxable, disabled: !this.isExist }],
        pl_taxc:       [{ value: this.productLine.pl_taxc, disabled: !this.isExist }],
        
      })
      this.stockForm = this.stockFB.group({
        pl_inv_acct:   [{ value: this.productLine.pl_inv_acct, disabled: !this.isExist }],
        pl_inv_sub:    [{ value: this.productLine.pl_inv_sub, disabled: !this.isExist }],
        pl_inv_cc:     [{ value: this.productLine.pl_inv_cc, disabled: !this.isExist }],
        pl_dscr_acct:  [{ value: this.productLine.pl_dscr_acct, disabled: !this.isExist }],
        pl_dscr_sub:   [{ value: this.productLine.pl_dscr_sub, disabled: !this.isExist }],
        pl_dscr_cc:    [{ value: this.productLine.pl_dscr_cc, disabled: !this.isExist }],
        pl_scrp_acct:  [{ value: this.productLine.pl_scrp_acct, disabled: !this.isExist }],
        pl_scrp_sub:   [{ value: this.productLine.pl_scrp_sub, disabled: !this.isExist }],
        pl_scrp_cc:    [{ value: this.productLine.pl_scrp_cc, disabled: !this.isExist }],
        pl_cchg_acct:  [{ value: this.productLine.pl_cchg_acct, disabled: !this.isExist }],
        pl_cchg_sub:   [{ value: this.productLine.pl_cchg_sub, disabled: !this.isExist }],
        pl_cchg_cc:    [{ value: this.productLine.pl_cchg_cc, disabled: !this.isExist }],
        pl_xfer_acct:  [{ value: this.productLine.pl_xfer_acct, disabled: !this.isExist }],
        pl_xfer_sub:   [{ value: this.productLine.pl_xfer_sub, disabled: !this.isExist }],
        pl_xfer_cc:    [{ value: this.productLine.pl_xfer_cc, disabled: !this.isExist }],
        
      })
      this.venteForm = this.venteFB.group({
       
        pl_sls_acct:  [{ value: this.productLine.pl_sls_acct, disabled: !this.isExist }],
        pl_sls_sub:   [{ value: this.productLine.pl_sls_sub, disabled: !this.isExist }],
        pl_sls_cc:    [{ value: this.productLine.pl_sls_cc, disabled: !this.isExist }],

        pl_dsc_acct:  [{ value: this.productLine.pl_dsc_acct, disabled: !this.isExist }],
        pl_dsc_sub:   [{ value: this.productLine.pl_dsc_sub, disabled: !this.isExist }],
        pl_dsc_cc:    [{ value: this.productLine.pl_dsc_cc, disabled: !this.isExist }],

        pl_cmtl_acct:  [{ value: this.productLine.pl_cmtl_acct, disabled: !this.isExist }],
        pl_cmtl_sub:   [{ value: this.productLine.pl_cmtl_sub, disabled: !this.isExist }],
        pl_cmtl_cc:    [{ value: this.productLine.pl_cmtl_cc, disabled: !this.isExist }],

        pl_clbr_acct:  [{ value: this.productLine.pl_clbr_acct, disabled: !this.isExist }],
        pl_clbr_sub:   [{ value: this.productLine.pl_clbr_sub, disabled: !this.isExist }],
        pl_clbr_cc:    [{ value: this.productLine.pl_clbr_cc, disabled: !this.isExist }],

        pl_cbdn_acct:  [{ value: this.productLine.pl_cbdn_acct, disabled: !this.isExist }],
        pl_cbdn_sub:   [{ value: this.productLine.pl_cbdn_sub, disabled: !this.isExist }],
        pl_cbdn_cc:    [{ value: this.productLine.pl_cbdn_cc, disabled: !this.isExist }],
        
        pl_covh_acct:  [{ value: this.productLine.pl_covh_acct, disabled: !this.isExist }],
        pl_covh_sub:   [{ value: this.productLine.pl_covh_sub, disabled: !this.isExist }],
        pl_covh_cc:    [{ value: this.productLine.pl_covh_cc, disabled: !this.isExist }],

        pl_csub_acct:  [{ value: this.productLine.pl_csub_acct, disabled: !this.isExist }],
        pl_csub_sub:   [{ value: this.productLine.pl_csub_sub, disabled: !this.isExist }],
        pl_csub_cc:    [{ value: this.productLine.pl_csub_cc, disabled: !this.isExist }],
      })
      this.achatForm = this.achatFB.group({
     
        pl_pur_acct:  [{ value: this.productLine.pl_pur_acct, disabled: !this.isExist }],
        pl_pur_sub:   [{ value: this.productLine.pl_pur_sub, disabled: !this.isExist }],
        pl_pur_cc:    [{ value: this.productLine.pl_pur_cc, disabled: !this.isExist }],

        pl_rcpt_acct:  [{ value: this.productLine.pl_rcpt_acct, disabled: !this.isExist }],
        pl_rcpt_sub:   [{ value: this.productLine.pl_rcpt_sub, disabled: !this.isExist }],
        pl_rcpt_cc:    [{ value: this.productLine.pl_rcpt_cc, disabled: !this.isExist }],

        pl_ovh_acct:  [{ value: this.productLine.pl_ovh_acct, disabled: !this.isExist }],
        pl_ovh_sub:   [{ value: this.productLine.pl_ovh_sub, disabled: !this.isExist }],
        pl_ovh_cc:    [{ value: this.productLine.pl_ovh_cc, disabled: !this.isExist }],
        
        pl_ppv_acct:  [{ value: this.productLine.pl_ppv_acct, disabled: !this.isExist }],
        pl_ppv_sub:   [{ value: this.productLine.pl_ppv_sub, disabled: !this.isExist }],
        pl_ppv_cc:    [{ value: this.productLine.pl_ppv_cc, disabled: !this.isExist }],

        pl_apvu_acct:  [{ value: this.productLine.pl_apvu_acct, disabled: !this.isExist }],
        pl_apvu_sub:   [{ value: this.productLine.pl_apvu_sub, disabled: !this.isExist }],
        pl_apvu_cc:    [{ value: this.productLine.pl_apvu_cc, disabled: !this.isExist }],
      
        pl_apvr_acct:  [{ value: this.productLine.pl_apvr_acct, disabled: !this.isExist }],
        pl_apvr_sub:   [{ value: this.productLine.pl_apvr_sub, disabled: !this.isExist }],
        pl_apvr_cc:    [{ value: this.productLine.pl_apvr_cc, disabled: !this.isExist }],
      })
      this.prodForm = this.prodFB.group({
     
        pl_flr_acct:  [{ value: this.productLine.pl_flr_acct, disabled: !this.isExist }],
        pl_flr_sub:   [{ value: this.productLine.pl_flr_sub, disabled: !this.isExist }],
        pl_flr_cc:    [{ value: this.productLine.pl_flr_cc, disabled: !this.isExist }],

        pl_mvar_acct:  [{ value: this.productLine.pl_mvar_acct, disabled: !this.isExist }],
        pl_mvar_sub:   [{ value: this.productLine.pl_mvar_sub, disabled: !this.isExist }],
        pl_mvar_cc:    [{ value: this.productLine.pl_mvar_cc, disabled: !this.isExist }],

        pl_mvrr_acct:  [{ value: this.productLine.pl_mvrr_acct, disabled: !this.isExist }],
        pl_mvrr_sub:   [{ value: this.productLine.pl_mvrr_sub, disabled: !this.isExist }],
        pl_mvrr_cc:    [{ value: this.productLine.pl_mvrr_cc, disabled: !this.isExist }],

        pl_xvar_acct:  [{ value: this.productLine.pl_xvar_acct, disabled: !this.isExist }],
        pl_xvar_sub:   [{ value: this.productLine.pl_xvar_sub, disabled: !this.isExist }],
        pl_xvar_cc:    [{ value: this.productLine.pl_xvar_cc, disabled: !this.isExist }],

        pl_cop_acct:  [{ value: this.productLine.pl_cop_acct, disabled: !this.isExist }],
        pl_cop_sub:   [{ value: this.productLine.pl_cop_sub, disabled: !this.isExist }],
        pl_cop_cc:    [{ value: this.productLine.pl_cop_cc, disabled: !this.isExist }],

        pl_svar_acct:  [{ value: this.productLine.pl_svar_acct, disabled: !this.isExist }],
        pl_svar_sub:   [{ value: this.productLine.pl_svar_sub, disabled: !this.isExist }],
        pl_svar_cc:    [{ value: this.productLine.pl_svar_cc, disabled: !this.isExist }],

        pl_svrr_acct:  [{ value: this.productLine.pl_svrr_acct, disabled: !this.isExist }],
        pl_svrr_sub:   [{ value: this.productLine.pl_svrr_sub, disabled: !this.isExist }],
        pl_svrr_cc:    [{ value: this.productLine.pl_svrr_cc, disabled: !this.isExist }],

        pl_wip_acct:  [{ value: this.productLine.pl_wip_acct, disabled: !this.isExist }],
        pl_wip_sub:   [{ value: this.productLine.pl_wip_sub, disabled: !this.isExist }],
        pl_wip_cc:    [{ value: this.productLine.pl_wip_cc, disabled: !this.isExist }],

        pl_wvar_acct:  [{ value: this.productLine.pl_wvar_acct, disabled: !this.isExist }],
        pl_wvar_sub:   [{ value: this.productLine.pl_wvar_sub, disabled: !this.isExist }],
        pl_wvar_cc:    [{ value: this.productLine.pl_wvar_cc, disabled: !this.isExist }],

      })
  }
  onChangeCode() {
    const controls = this.productligneForm.controls
    const controlstk = this.stockForm.controls
    const controlsv = this.venteForm.controls
    const controlsa= this.achatForm.controls
    const controlsp = this.prodForm.controls
    this.productlineService
        .getBy({
           pl_prod_line: controls.pl_prod_line.value,
            
        })
        .subscribe((response: any) => {
            if (response.data.length) {
                this.isExist = true
                console.log(response.data.length)
            } else {
                
                controls.pl_desc.enable() 
                controls. pl_taxable.enable() 
                controls. pl_taxc.enable() 
                
                controlstk.pl_inv_acct.enable()
                controlstk.pl_inv_sub.enable()
                controlstk.pl_inv_cc.enable()
                controlstk.pl_dscr_acct.enable()
                controlstk.pl_dscr_sub.enable()
                controlstk.pl_dscr_cc.enable()
                controlstk.pl_scrp_acct.enable()
                controlstk.pl_scrp_sub.enable()
                controlstk.pl_scrp_cc.enable()
                controlstk.pl_cchg_acct.enable()
                controlstk.pl_cchg_sub.enable()
                controlstk.pl_cchg_cc.enable()

                controlstk.pl_xfer_acct.enable()
                controlstk.pl_xfer_sub.enable()
                controlstk.pl_xfer_cc.enable()

                                
                controlsv.pl_sls_acct.enable()
                controlsv.pl_sls_sub.enable()
                controlsv.pl_sls_cc.enable()	
                controlsv.pl_dsc_acct.enable()
                controlsv.pl_dsc_sub.enable()
                controlsv.pl_dsc_cc.enable()
                controlsv.pl_cmtl_acct.enable()
                controlsv.pl_cmtl_sub.enable()
                controlsv.pl_cmtl_cc.enable()	
                controlsv.pl_clbr_acct.enable()
                controlsv.pl_clbr_sub.enable()
                controlsv.pl_clbr_cc.enable()	
                controlsv.pl_cbdn_acct.enable()
                controlsv.pl_cbdn_sub.enable()
                controlsv.pl_cbdn_cc.enable()	
                controlsv.pl_covh_acct.enable()
                controlsv.pl_covh_sub.enable()
                controlsv.pl_covh_cc.enable()	
                controlsv.pl_csub_acct.enable()
                controlsv.pl_csub_sub.enable()
                controlsv.pl_csub_cc.enable()
                
                controlsa.pl_pur_acct.enable()
                controlsa.pl_pur_sub.enable()
                controlsa.pl_pur_cc.enable()	
                controlsa.pl_rcpt_acct.enable()
                controlsa.pl_rcpt_sub.enable()
                controlsa.pl_rcpt_cc.enable()	
                controlsa.pl_ovh_acct.enable()
                controlsa.pl_ovh_sub.enable()
                controlsa.pl_ovh_cc.enable()	
                controlsa.pl_ppv_acct.enable()
                controlsa.pl_ppv_sub.enable()
                controlsa.pl_ppv_cc.enable()	
                controlsa.pl_apvu_acct.enable()
                controlsa.pl_apvu_sub.enable()
                controlsa.pl_apvu_cc.enable()     	
                controlsa.pl_apvr_acct.enable()
                controlsa.pl_apvr_sub.enable()
                controlsa.pl_apvr_cc.enable()

                controlsp.pl_flr_acct.enable()
                controlsp.pl_flr_sub.enable()
                controlsp.pl_flr_cc.enable()
                controlsp.pl_mvar_acct.enable()
                controlsp.pl_mvar_sub.enable()
                controlsp.pl_mvar_cc.enable()	
                controlsp.pl_mvrr_acct.enable()
                controlsp.pl_mvrr_sub.enable()
                controlsp.pl_mvrr_cc.enable()	
                controlsp.pl_xvar_acct.enable()
                controlsp.pl_xvar_sub.enable()
                controlsp.pl_xvar_cc.enable()	
                controlsp.pl_cop_acct.enable()
                controlsp.pl_cop_sub.enable()
                controlsp.pl_cop_cc.enable()	
                controlsp.pl_svar_acct.enable()
                controlsp.pl_svar_sub.enable()
                controlsp.pl_svar_cc.enable()	
                controlsp.pl_svrr_acct.enable()
                controlsp.pl_svrr_sub.enable()
                controlsp.pl_svrr_cc.enable()	
                controlsp.pl_wip_acct.enable()
                controlsp.pl_wip_sub.enable()
                controlsp.pl_wip_cc.enable()	
                controlsp.pl_wvar_acct.enable()
                controlsp.pl_wvar_sub.enable()
                controlsp.pl_wvar_cc.enable()
            }
        })
  }


   //reste form
   reset() {
    this.productLine = new ProductLine()
    this.createForm()
    this.hasFormErrors = false
 
}
onSubmit() {
  this.hasFormErrors = false
  const controls = this.productligneForm.controls
  /** check form */
  if (this.productligneForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      return
  }

  // tslint:disable-next-line:prefer-const
  let address = this.prepareCode()
  this.addCode(address)
}

prepareCode(): ProductLine {
  const controls = this.productligneForm.controls
  const controlstk = this.stockForm.controls
  const controlsv = this.venteForm.controls
  const controlsa= this.achatForm.controls
  const controlsp = this.prodForm.controls

  const _productLine = new ProductLine()
  _productLine.pl_prod_line = controls.pl_prod_line.value
  _productLine.pl_desc = controls.pl_desc.value
  _productLine.pl_taxable = controls.pl_taxable.value
  _productLine.pl_taxc = controls.pl_taxc.value
  _productLine.pl_inv_acct = controlstk.pl_inv_acct.value
  _productLine.pl_inv_sub = controlstk.pl_inv_sub.value
  _productLine.pl_inv_cc = controlstk.pl_inv_cc.value
  _productLine.pl_dscr_acct = controlstk.pl_dscr_acct.value
  _productLine.pl_dscr_sub = controlstk.pl_dscr_sub.value
  _productLine.pl_dscr_cc = controlstk.pl_dscr_cc.value
  _productLine.pl_scrp_acct = controlstk.pl_scrp_acct.value
  _productLine.pl_scrp_sub = controlstk.pl_scrp_sub.value
  _productLine.pl_scrp_cc = controlstk.pl_scrp_cc.value
  _productLine.pl_cchg_acct = controlstk.pl_cchg_acct.value
  _productLine.pl_cchg_sub = controlstk.pl_cchg_sub.value
  _productLine.pl_cchg_cc = controlstk.pl_cchg_cc.value
  _productLine.pl_xfer_acct = controlstk.pl_xfer_acct.value
  _productLine.pl_xfer_sub = controlstk.pl_xfer_sub.value
  _productLine.pl_xfer_cc = controlstk.pl_xfer_cc.value

  _productLine.pl_sls_acct = controlsv.pl_sls_acct.value
  _productLine.pl_sls_sub = controlsv.pl_sls_sub.value
  _productLine.pl_sls_cc = controlsv.pl_sls_cc.value
  _productLine.pl_dsc_acct = controlsv.pl_dsc_acct.value
  _productLine.pl_dsc_sub = controlsv.pl_dsc_sub.value
  _productLine.pl_dsc_cc = controlsv.pl_dsc_cc.value
  _productLine.pl_cmtl_acct = controlsv.pl_cmtl_acct.value
  _productLine.pl_cmtl_sub = controlsv.pl_cmtl_sub.value
  _productLine.pl_cmtl_cc = controlsv.pl_cmtl_cc.value
  _productLine.pl_clbr_acct = controlsv.pl_clbr_acct.value
  _productLine.pl_clbr_sub = controlsv.pl_clbr_sub.value
  _productLine.pl_clbr_cc = controlsv.pl_clbr_cc.value
  _productLine.pl_cbdn_acct = controlsv.pl_cbdn_acct.value
  _productLine.pl_cbdn_sub = controlsv.pl_cbdn_sub.value
  _productLine.pl_cbdn_cc = controlsv.pl_cbdn_cc.value
  _productLine.pl_covh_acct = controlsv.pl_covh_acct.value
  _productLine.pl_covh_sub = controlsv.pl_covh_sub.value
  _productLine.pl_covh_cc = controlsv.pl_covh_cc.value
  _productLine.pl_csub_acct = controlsv.pl_csub_acct.value
  _productLine.pl_csub_sub = controlsv.pl_csub_sub.value
  _productLine.pl_csub_cc = controlsv.pl_csub_cc.value
  _productLine.pl_pur_acct = controlsa.pl_pur_acct.value
  _productLine.pl_pur_sub = controlsa.pl_pur_sub.value
  _productLine.pl_pur_cc = controlsa.pl_pur_cc.value
  _productLine.pl_rcpt_acct = controlsa.pl_rcpt_acct.value
  _productLine.pl_rcpt_sub = controlsa.pl_rcpt_sub.value
  _productLine.pl_rcpt_cc = controlsa.pl_rcpt_cc.value
  _productLine.pl_ovh_acct = controlsa.pl_ovh_acct.value
  _productLine.pl_ovh_sub = controlsa.pl_ovh_sub.value
  _productLine.pl_ovh_cc = controlsa.pl_ovh_cc.value
  _productLine.pl_ppv_acct = controlsa.pl_ppv_acct.value
  _productLine.pl_ppv_sub = controlsa.pl_ppv_sub.value
  _productLine.pl_ppv_cc = controlsa.pl_ppv_cc.value
  _productLine.pl_apvu_acct = controlsa.pl_apvu_acct.value
  _productLine.pl_apvu_sub = controlsa.pl_apvu_sub.value
  _productLine.pl_apvu_cc = controlsa.pl_apvu_cc.value
  _productLine.pl_apvr_acct = controlsa.pl_apvr_acct.value
  _productLine.pl_apvr_sub = controlsa.pl_apvr_sub.value
  _productLine.pl_apvr_cc = controlsa.pl_apvr_cc.value
  _productLine.pl_flr_acct = controlsp.pl_flr_acct.value
  _productLine.pl_flr_sub = controlsp.pl_flr_sub.value
  _productLine.pl_flr_cc = controlsp.pl_flr_cc.value
  _productLine.pl_mvar_acct = controlsp.pl_mvar_acct.value
  _productLine.pl_mvar_sub = controlsp.pl_mvar_sub.value
  _productLine.pl_mvar_cc = controlsp.pl_mvar_cc.value
  _productLine.pl_mvrr_acct = controlsp.pl_mvrr_acct.value
  _productLine.pl_mvrr_sub = controlsp.pl_mvrr_sub.value
  _productLine.pl_mvrr_cc = controlsp.pl_mvrr_cc.value
  _productLine.pl_xvar_acct = controlsp.pl_xvar_acct.value
  _productLine.pl_xvar_sub = controlsp.pl_xvar_sub.value
  _productLine.pl_xvar_cc = controlsp.pl_xvar_cc.value
  _productLine.pl_cop_acct = controlsp.pl_cop_acct.value
  _productLine.pl_cop_sub = controlsp.pl_cop_sub.value
  _productLine.pl_cop_cc = controlsp.pl_cop_cc.value
  _productLine.pl_svar_acct = controlsp.pl_svar_acct.value
  _productLine.pl_svar_sub = controlsp.pl_svar_sub.value
  _productLine.pl_svar_cc = controlsp.pl_svar_cc.value
  _productLine.pl_svrr_acct = controlsp.pl_svrr_acct.value
  _productLine.pl_svrr_sub = controlsp.pl_svrr_sub.value
  _productLine.pl_svrr_cc = controlsp.pl_svrr_cc.value
  _productLine.pl_wip_acct = controlsp.pl_wip_acct.value
  _productLine.pl_wip_sub = controlsp.pl_wip_sub.value
  _productLine.pl_wip_cc = controlsp.pl_wip_cc.value
  _productLine.pl_wvar_acct = controlsp.pl_wvar_acct.value
  _productLine.pl_wvar_sub = controlsp.pl_wvar_sub.value
  _productLine.pl_wvar_cc = controlsp.pl_wvar_cc.value
 return _productLine
}

/**
     * Add code
     *
     * @param _code: CodeModel
     */
    addCode(_productLine: ProductLine) {
      this.loadingSubject.next(true)
      this.productlineService.add(_productLine).subscribe(
          (reponse) => console.log("response", Response),
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
                  "Ajout avec succès",
                  MessageType.Create,
                  10000,
                  true,
                  true
              )
              this.loadingSubject.next(false)
              this.router.navigateByUrl("/code-mstr/codes-list")
          }
      )
  }

  /**
   * Go back to the list
   *
   */
  goBack() {
      this.loadingSubject.next(false)
      const url = `/accounting-setting/taxes-list`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }

  handleSelectedRowsChangedtax(e, args) {
    const controls = this.productligneForm.controls
    if (Array.isArray(args.rows) && this.gridObjtax) {
        args.rows.map((idx) => {
            const item = this.gridObjtax.getDataItem(idx)
            controls.pl_taxc.setValue(item.tx2_tax_code || "")
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



handleSelectedRowsChanged3(e, args) {
  const controls1 = this.stockForm.controls
  const controls2 = this.venteForm.controls
  const controls3 = this.achatForm.controls
  const controls4 = this.prodForm.controls

  if (Array.isArray(args.rows) && this.gridObj3) {
      args.rows.map((idx) => {
          const item = this.gridObj3.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
          switch (this.selectedField) {
            case "pl_xfer_acct": {

              controls1.pl_xfer_acct.setValue(item.ac_code || "")
              break
            } 
              case "pl_inv_acct": {
                  controls1.pl_inv_acct.setValue(item.ac_code || "")
                  break
              }    
              case "pl_dscr_acct": {
                controls1.pl_dscr_acct.setValue(item.ac_code || "")
                break
              } 
              case "pl_cchg_acct": {
                controls1.pl_cchg_acct.setValue(item.ac_code || "")
                break
              } 
             
              case "pl_scrp_acct": {
                controls1.pl_scrp_acct.setValue(item.ac_code || "")
                break
              } 

              case "pl_sls_acct": {
                controls2.pl_sls_acct.setValue(item.ac_code || "")
                break
              } 

              case "pl_dsc_acct": {
                controls2.pl_dsc_acct.setValue(item.ac_code || "")
                break
              } 

              case "pl_cmtl_acct": {
                controls2.pl_cmtl_acct.setValue(item.ac_code || "")
                break
              } 

              case "pl_clbr_acct": {
                controls2.pl_clbr_acct.setValue(item.ac_code || "")
                break
              } 

              case "pl_cbdn_acct": {
                controls2.pl_cbdn_acct.setValue(item.ac_code || "")
                break
              } 
              case "pl_covh_acct": {
                controls2.pl_covh_acct.setValue(item.ac_code || "")
                break
              } 
              case "pl_csub_acct": {
                controls2.pl_csub_acct.setValue(item.ac_code || "")
                break
              } 
              case "pl_pur_acct": {
                controls3.pl_pur_acct.setValue(item.ac_code || "")
                break
              } 
              case "pl_rcpt_acct": {
                controls3.pl_rcpt_acct.setValue(item.ac_code || "")
                break
              } 
              case "pl_ovh_acct": {
                controls3.pl_ovh_acct.setValue(item.ac_code || "")
                break
              } 
              case "pl_ppv_acct": {
                controls3.pl_ppv_acct.setValue(item.ac_code || "")
                break
              }
              case "pl_apvu_acct": {
                controls3.pl_apvu_acct.setValue(item.ac_code || "")
                break
              } 
              case "pl_apvr_acct": {
                controls3.pl_apvr_acct.setValue(item.ac_code || "")
                break
              }

              case "pl_flr_acct": {
                controls4.pl_flr_acct.setValue(item.ac_code || "")
                break
              }
              case "pl_mvar_acct": {
                controls4.pl_mvar_acct.setValue(item.ac_code || "")
                break
              }
              case "pl_mvrr_acct": {
                controls4.pl_mvrr_acct.setValue(item.ac_code || "")
                break
              }
              case "pl_xvar_acct": {
                controls4.pl_xvar_acct.setValue(item.ac_code || "")
                break
              }
              case "pl_cop_acct": {
                controls4.pl_cop_acct.setValue(item.ac_code || "")
                break
              }
              case "pl_svar_acct": {
                controls4.pl_svar_acct.setValue(item.ac_code || "")
                break
              }
              case "pl_svrr_acct": {
                controls4.pl_svrr_acct.setValue(item.ac_code || "")
                break
              }
              case "pl_wip_acct": {
                controls4.pl_wip_acct.setValue(item.ac_code || "")
                break
              }
              case "pl_wvar_acct": {
                controls4.pl_wvar_acct.setValue(item.ac_code || "")
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
          name: "Code Compte",
          field: "ac_code",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "ac_desc",
          name: "Description",
          field: "ac_desc",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "ac_stat_acc",
          name: "Compte Statique",
          field: "ac_stat_acc",
          sortable: true,
          width: 200,
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
      .subscribe((response: any) => (this.accounts = response.data))
}
open3(content, field) {
  this.selectedField = field
  this.prepareGrid3()
  this.modalService.open(content, { size: "lg" })
}



}