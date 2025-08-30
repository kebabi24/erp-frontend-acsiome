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
import { FormGroup, FormBuilder, Validators, NgControlStatus } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
import { round } from 'lodash';
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
import {
   
    SequenceService,
    ProviderService,
    UsersService,
    ItemService,
    VendorProposalService,
    CodeService,
    DeviseService,
    VoucherProformaService,
    VoucherProforma,
    PurchaseOrderService,
    TimbreService,
} from "../../../../core/erp"
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY } from "@angular/cdk/overlay/overlay-directives"

@Component({
  selector: 'kt-edit-proforma',
  templateUrl: './edit-proforma.component.html',
  styleUrls: ['./edit-proforma.component.scss']
})
export class EditProformaComponent implements OnInit {

  voucherProforma: VoucherProforma
    vpForm: FormGroup
    totForm: FormGroup;
    hasFormErrors = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>

    error = false
    angularGrid: AngularGridInstance
    grid: any
    gridService: GridService
    dataView: any
    columnDefinitions: Column[]
    gridOptions: GridOption
    dataset: any[]

    sequences: []
    columnDefinitions1: Column[] = []
    gridOptions1: GridOption = {}
    gridObj1: any
    angularGrid1: AngularGridInstance

    providers: []
    columnDefinitions2: Column[] = []
    gridOptions2: GridOption = {}
    gridObj2: any
    angularGrid2: AngularGridInstance

    users: []
    columnDefinitions3: Column[] = []
    gridOptions3: GridOption = {}
    gridObj3: any
    angularGrid3: AngularGridInstance

    items: []
    columnDefinitions4: Column[] = []
    gridOptions4: GridOption = {}
    gridObj4: any
    angularGrid4: AngularGridInstance

    devises: [];
    columnDefinitionscurr: Column[] = [];
    gridOptionscurr: GridOption = {};
    gridObjcurr: any;
    angularGridcurr: AngularGridInstance;

    requisitions: [];
    columnDefinitions5: Column[] = [];
    gridOptions5: GridOption = {};
    gridObj5: any;
    angularGrid5: AngularGridInstance;
    row_number
    message = ""
    date: string;

    paymentMethods: any[] = []
    vd_shipvia: any[] = []
    total:any = 0;
    vhpEdit: any
curr: String;
user: any
orddate: any;
duedate: any;
title: String = "Modifier Facture Proforma - "
    constructor(
        config: NgbDropdownConfig,
        private vpFB: FormBuilder,
        private totFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private modalService: NgbModal,
        private layoutUtilsService: LayoutUtilsService,
       
        private vendorProposalService: VendorProposalService,
        private providersService: ProviderService,
        private userService: UsersService,
        private seqeuncesService: SequenceService,
        private itemsService: ItemService,
        private deviseService: DeviseService,
        private codeService: CodeService,
        private voucherProformaService : VoucherProformaService,
        private purchaseOrderService :PurchaseOrderService,
        private timbreService: TimbreService,
    ) {
        config.autoClose = true
        this.initGrid()
        this.codeService
            .getBy({ code_fldname: "vd_cr_terms" })
            .subscribe((response: any) => (this.paymentMethods = response.data))
        this.codeService
            .getBy({ code_fldname: "vd_shipvia" })
            .subscribe((response: any) => (this.vd_shipvia = response.data))    
    }
    gridReady(angularGrid: AngularGridInstance) {
        this.angularGrid = angularGrid
        this.dataView = angularGrid.dataView
        this.grid = angularGrid.slickGrid
        this.gridService = angularGrid.gridService
    }
    initCode() {
      this.createForm()
      this.createtotForm()
      this.loadingSubject.next(false)
  }
    initGrid() {
       // const controls = this.vpForm.controls
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
                        this.angularGrid.gridService.deleteItem(
                            args.dataContext
                        )
                    }
                },
            },

            {
                id: "vdhp_line",
                name: "Ligne",
                field: "vdhp_line",
                minWidth: 50,
                maxWidth: 50,
                selectable: true,
            },
            {
                id: "vdhp_part",
                name: "Article",
                field: "vdhp_part",
                sortable: true,
                width: 50,
                filterable: false,
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
                    this.row_number = args.row
                    let element: HTMLElement = document.getElementById(
                        "openItemsGrid"
                    ) as HTMLElement
                    element.click()
                },
            },
            {
              id: "desc",
              name: "Désignation",
              field: "desc",
              sortable: true,
              width: 50,
              filterable: false,
            
          },
            {
                id: "vdhp_vend_part",
                name: "Description Fournisseur",
                field: "vdhp_vend_part",
                sortable: true,
                width: 80,
                filterable: false,
                editor: {
                    model: Editors.text,
                },
            },
            {
                id: "vdhp_qty_inv",
                name: "QTE",
                field: "vdhp_qty_inv",
                sortable: true,
                width: 80,
                filterable: false,
                type: FieldType.float,
                editor: {
                    model: Editors.float,
                    params:{decimalPlaces:2}

                },
                onCellChange: (e: Event, args: OnEventArgs) => {
  
                  this.calculatetot();
              }
                // onCellChange : (e: Event, args: OnEventArgs)=>{
                // //   this.total += (args.dataContext.vdhp_q_qty * args.dataContext.vdhp_q_price )
                // this.calculatetot()
                // }
            },
            {
                id: "vdhp_um",
                name: "UM",
                field: "vdhp_um",
                sortable: true,
                width: 80,
                filterable: false,
            },
            {
                id: "vdhp_price",
                name: "Prix offre",
                field: "vdhp_price",
                sortable: true,
                width: 80,
                filterable: false,
                type: FieldType.float,
                editor: {
                    model: Editors.float,
                    params:{decimalPlaces:2}

                },
                onCellChange: (e: Event, args: OnEventArgs) => {
  
        

                  this.calculatetot();
              }
                // onCellChange : (e: Event, args: OnEventArgs)=>{
                //     this.calculatetot()
                // }
            },
            {
              id: "vdhp_disc_pct",
              name: "Remise",
              field: "vdhp_disc_pct",
              sortable: true,
              // width: 40,
              filterable: false,
              //type: FieldType.float,
              editor: {
                model: Editors.float,
                params: { decimalPlaces: 2 }
              },
              formatter: Formatters.decimal,
              onCellChange: (e: Event, args: OnEventArgs) => {
        
              
      
                this.calculatetot();
            }
          },
          {
            id: "vdhp_taxable",
            name: "Taxable",
            field: "vdhp_taxable",
            sortable: true,
            // width: 80,
            filterable: false,
            editor: {
              model: Editors.checkbox
            },
            formatter: Formatters.checkmark,
            cannotTriggerInsert: true,
            onCellChange: (e: Event, args: OnEventArgs) => {
      
            
    
              this.calculatetot();
          }
          },
          {
            id: "vdhp_tax_code",
            name: "Code de Taxe",
            field: "vdhp_tax_code",
            sortable: true,
            // width: 80,
            filterable: false,
            
          },  
          {
            id: "vdhp_taxc",
            name: "Taux de Taxe",
            field: "vdhp_taxc",
            sortable: true,
            // width: 80,
            filterable: false,
            editor: {
              model: Editors.text,
            },
            formatter: Formatters.percentComplete,
            onCellChange: (e: Event, args: OnEventArgs) => {
      
            
    
              this.calculatetot();
          }
          },
        ]

        this.gridOptions = {
            asyncEditorLoading: false,
            editable: true,
            enableColumnPicker: true,
            enableCellNavigation: true,
            enableRowSelection: true,
            
        }

        this.dataset = []
    }
    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        
        this.activatedRoute.params.subscribe((params) => {
          const id = params.id
          
          this.voucherProformaService.getOne(id).subscribe((response: any)=>{
            console.log(response.data.voucherProforma)
            this.vhpEdit = response.data.voucherProforma
          
            this.dataset = response.data.details
            // this.addressService.getBy({ad_addr: this.poEdit.po_vend}).subscribe((res: any)=>{
            //   this.addressEdit = res.data
          
            this.orddate = new Date(this.vhpEdit.vhp_inv_date)
            this.duedate = new Date(this.vhpEdit.vhp_due_date)
            this.orddate.setDate(this.orddate.getDate() )
            this.duedate.setDate(this.duedate.getDate() )
            //console.log(this.reqdate)
                  
          
           this.initCode()
           this.loadingSubject.next(false)
           this.user = JSON.parse(localStorage.getItem('user'))
          //  const controls = this.poForm.controls
       
          //  controls.po_nbr.setValue(this.poEdit.po_nbr)
     
           for(var i=0; i< this.dataset.length; i++) {
  
            this.dataset[i].desc = this.dataset[i].item.pt_desc1
           }
            this.loadingSubject.next(false)
           this.title = this.title + this.vhpEdit.vhp_inv_nbr
            // })
          })
        })
        //this.createForm()
        this.initGrid()
    }

    //create form
    createForm() {
        this.loadingSubject.next(false)
        
        this.vpForm = this.vpFB.group({
            vhp_po_nbr: [this.vhpEdit.vhp_po_nbr],
            vhp_inv_nbr: [this.vhpEdit.vhp_inv_nbr, Validators.required],
            vhp_vend: [this.vhpEdit.vhp_vend],
            name:[this.vhpEdit.address.ad_name],
            vhp_curr: [this.vhpEdit.vhp_curr],

            vhp_ex_rate : [this.vhpEdit.vhp_ex_rate],
            vhp_ex_rate2: [this.vhpEdit.vhp_ex_rate2],

            vhp_inv_date:  [{
              year: this.orddate.getFullYear(),
              month: this.orddate.getMonth() + 1,
              day: this.orddate.getDate() ,
              
            }],
            vhp_due_date:  [{
              year:this.duedate.getFullYear(),
              month: this.duedate.getMonth()+1,
              day: this.duedate.getDate()
            }],
            vhp_cr_terms: [this.vhpEdit.vhp_cr_terms, Validators.required],
            vhp_shipvia: [this.vhpEdit.vhp_shipvia,Validators.required],
            vhp_taxable: [this.vhpEdit.vhp_taxable,Validators.required],
            vhp_rmks: [this.vhpEdit.vhp_rmks],
        })
    }
    createtotForm() {
      this.loadingSubject.next(false);
      //this.saleOrder = new SaleOrder();
     // const date = new Date;
      
      this.totForm = this.totFB.group({
    //    so__chr01: [this.saleOrder.so__chr01],
        tht: [{value: this.vhpEdit.vhp_amt , disabled: true}],
        tva: [{value: this.vhpEdit.vhp_tax_amt , disabled: true}],
        timbre: [{value: this.vhpEdit.vhp_trl1_amt , disabled: true}],
        ttc: [{value: this.vhpEdit.dec01 , disabled: true}],
      });
  
      
      
  
    }
    onChangePay() {
        const controls = this.vpForm.controls
      
                this.calculatetot()
      }

    //reste form
  
    reset() {
      this.voucherProforma = new VoucherProforma()
      this.createForm();
      this.dataset=[];
      this.createtotForm();
      this.hasFormErrors = false;
    }
    // save data
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.vpForm.controls
        /** check form */
        if (this.vpForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )
            this.message =
                "Modifiez quelques éléments et réessayez de soumettre."
            this.hasFormErrors = true

            return
        }

        if (!this.dataset.length) {
            this.message = "La liste des articles ne peut pas etre vide"
            this.hasFormErrors = true

            return
        }
        for (let data of this.dataset) {
          if(data.vdhp_price == "" || data.vdhp_price == null ) {
            this.message = "Le prix ne peut pas etre vide"
            this.hasFormErrors = true

            return
          }
        }
        for (let data of this.dataset) {
          console.log(data.vdhp_qty_inv)
          if(data.vdhp_qty_inv == "" || data.vdhp_qty_inv == null || data.vdhp_qty_inv == 0 ) {
            this.message = "Quantité ne peut pas etre 0"
            this.hasFormErrors = true

            return
          }
        }
        // tslint:disable-next-line:prefer-const
        let req = this.prepareReq()
        for (let data of this.dataset) {
            delete data.id
            delete data.cmvid
            delete data.desc
        }
        this.addVp(req, this.dataset)
    }

    onChangeVend() {
        const controls = this.vpForm.controls; // chof le champs hada wesh men form rah
        const vd_addr = controls.vhp_vend.value;
        const date = new Date()
  
        this.date = controls.vhp_due_date.value
        ? `${controls.vhp_due_date.value.year}/${controls.vhp_due_date.value.month}/${controls.vhp_due_date.value.day}`
        : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
  
  
        this.providersService.getBy({ vd_addr }).subscribe(
          (res: any) => {
            console.log(res);
            const { data } = res;
    
            if (!data) {
              this.layoutUtilsService.showActionNotification(
                "ce fournisseur n'existe pas!",
                MessageType.Create,
                10000,
                true,
                true
              );
              this.error = true;
            } else {
              this.error = false;
              controls.vhp_vend.setValue(data.vd_addr || "");
              controls.vhp_curr.setValue(data.vd_curr || "");
            
             
              this.deviseService.getBy({cu_curr:data.vd_curr}).subscribe((resc:any)=>{  
                this.curr = resc.data
             })
              if (data.vd_curr == 'DA'){
                controls.vhp_ex_rate.setValue(1)
                controls.vhp_ex_rate2.setValue(1)
  
              } else {
  
              this.deviseService.getExRate({exr_curr1:data.vd_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
                
                 controls.vhp_ex_rate.setValue(res.data.exr_rate)
                 controls.vhp_ex_rate2.setValue(res.data.exr_rate2)
                })
  
                }
  
            }
             
          },
          (error) => console.log(error)
        );
      }
    /**
     *
     * Returns object for saving
     */
    prepareReq(): any {
        const controls = this.vpForm.controls
        const controls1 = this.totForm.controls;
        const _vp = new VoucherProforma()
        this.calculatetot()
        _vp.vhp_po_nbr = controls.vhp_po_nbr.value
        _vp.vhp_inv_nbr = controls.vhp_inv_nbr.value
        _vp.vhp_vend = controls.vhp_vend.value
        _vp.vhp_inv_date = controls.vhp_inv_date.value
            ? `${controls.vhp_inv_date.value.year}/${controls.vhp_inv_date.value.month}/${controls.vhp_inv_date.value.day}`
            : null
        _vp.vhp_due_date = controls.vhp_due_date.value
            ? `${controls.vhp_due_date.value.year}/${controls.vhp_due_date.value.month}/${controls.vhp_due_date.value.day}`
            : null
        _vp.vhp_cr_terms = controls.vhp_cr_terms.value
        _vp.vhp_rmks = controls.vhp_rmks.value
        // _vp.vhp_total_price = this.calculatetot()
        _vp.vhp_curr = controls.vhp_curr.value
        _vp.vhp_ex_rate = controls.vhp_ex_rate.value
        _vp.vhp_ex_rate2 = controls.vhp_ex_rate2.value
        _vp.vhp_shipvia = controls.vhp_shipvia.value
        _vp.vhp_taxable = controls.vhp_taxable.value
        _vp.vhp_amt = controls1.tht.value
        _vp.vhp_tax_amt = controls1.tva.value
        _vp.vhp_trl1_amt = controls1.timbre.value
        _vp.dec01 = Number(controls1.ttc.value)
        return _vp
    }
    /**
     * Add req
     *
     * @param _vp: req
     */
    addVp(_vp: any, detail: any) {
      for (let data of detail) {
        delete data.id;
        delete data.cmvid;
      }
      this.voucherProformaService
            .updatedet({ voucherOrder: _vp, detail: this.dataset}, this.vhpEdit.id)
            .subscribe( //(res) => {
  
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
                      "Modification Status avec succès",
                      MessageType.Create,
                      10000,
                      true,
                      true
                  )
                  this.loadingSubject.next(false)
                  this.router.navigateByUrl("/purchasing/list-proforma")
                
              }
          )
  
    }
    onChangeTAX() {
      const controls = this.vpForm.controls;
      const tax = controls.vhp_taxable.value;
    
        for (var i = 0; i < this.dataset.length; i++) {
          let updateItem = this.gridService.getDataItemByRowIndex(i);
        //  console.log(this.dataset[i].qty_oh)
              updateItem.vdhp_taxable = tax ;
          
              this.gridService.updateItem(updateItem);
           
        };
      
      
     
      this.calculatetot();
    }
    changeCurr(){
        const controls = this.vpForm.controls // chof le champs hada wesh men form rah
        const cu_curr  = controls.vhp_curr.value
    
        const date = new Date()
    
        this.date = controls.vhp_due_date.value
          ? `${controls.vhp_due_date.value.year}/${controls.vhp_due_date.value.month}/${controls.vhp_due_date.value.day}`
          : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    
         
        this.deviseService.getBy({cu_curr}).subscribe((res:any)=>{
            const {data} = res
            console.log(res)
            if (!data){ this.layoutUtilsService.showActionNotification(
                "cette devise n'existe pas!",
                MessageType.Create,
                10000,
                true,
                true
            )
        this.error = true}
            else {
              this.curr = res.data
                this.error = false;
         
                if (cu_curr == 'DA'){
                  controls.vhp_ex_rate.setValue(1)
                  controls.vhp_ex_rate2.setValue(1)
    
                } else {
    
                this.deviseService.getExRate({exr_curr1:cu_curr, exr_curr2:'DA', date: this.date /* `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`*/ }).subscribe((res:any)=>{
                   controls.vhp_ex_rate.setValue(res.data.exr_rate)
                   controls.vhp_ex_rate2.setValue(res.data.exr_rate2)
                  })
         
                  }
                 
         
            }
    
    
        },error=>console.log(error))
    }

    changeRateCurr(){
        const controls = this.vpForm.controls // chof le champs hada wesh men form rah
        const cu_curr  = controls.vhp_curr.value
      
        const date = new Date()
      
        this.date = controls.vhp_due_date.value
          ? `${controls.vhp_due_date.value.year}/${controls.vhp_due_date.value.month}/${controls.vhp_due_date.value.day}`
          : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
      
          if (cu_curr == 'DA'){
            controls.vhp_ex_rate.setValue(1)
            controls.vhp_ex_rate2.setValue(1)
      
          } else {
                this.deviseService.getExRate({exr_curr1:cu_curr, exr_curr2:'DA', date: this.date /* `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`*/ }).subscribe((res:any)=>{
                  
      
                   controls.vhp_ex_rate.setValue(res.data.exr_rate)
                   controls.vhp_ex_rate2.setValue(res.data.exr_rate2)
                  })
         
          }
                 
                
        
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

    // add new Item to Datatable
    addNewItem() {
        this.gridService.addItem(
            {
                id: this.dataset.length + 1,
                vdhp_line: this.dataset.length + 1,
                vdhp_part: "",
                cmvid: "",
                vdhp_vend_part: "",
                vdhp_inv_qty: 0,
                vdhp_um: "",
                vdhp_price: "",
                vdhp_disc_pct: 0,
            },
            { position: "bottom" }
        )
    }

    handleSelectedRowsChanged2(e, args) {
        const controls = this.vpForm.controls;
        if (Array.isArray(args.rows) && this.gridObj2) {
          args.rows.map((idx) => {
            const item = this.gridObj2.getDataItem(idx);
            console.log(item)
            const date = new Date()
    
            this.date = controls.vhp_due_date.value
            ? `${controls.vhp_due_date.value.year}/${controls.vhp_due_date.value.month}/${controls.vhp_due_date.value.day}`
            : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
      
    
            controls.vhp_vend.setValue(item.vd_addr || "");
            controls.name.setValue(item.address.ad_name || "");
            controls.vhp_curr.setValue(item.vd_curr || "");
            controls.vhp_pay_meth.setValue(item.vd_cr_terms || "");
            this.codeService
            .getBy({code_fldname: "vd_cr_terms",  code_value: item.vd_cr_terms})
            .subscribe((response: any) => {
                console.log(response.data)
                if (response.data.length != 0) {
                    controls.dec01.setValue(response.data[0].dec01)
                    
                }
            })
            this.deviseService.getBy({cu_curr:item.vd_curr}).subscribe((res:any)=>{  
              this.curr = res.data
           })
     
           
            if (item.vd_curr == 'DA'){
              controls.vhp_ex_rate.setValue(1)
              controls.vhp_ex_rate2.setValue(1)
    
            } else {
             
              this.deviseService.getExRate({exr_curr1:item.vd_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{  
               controls.vhp_ex_rate.setValue(res.data.exr_rate)
               controls.vhp_ex_rate2.setValue(res.data.exr_rate2)
              
            })
                }
    
    
          });
        }
      }
    
    angularGridReady2(angularGrid: AngularGridInstance) {
        this.angularGrid2 = angularGrid
        this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {}
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
        ]

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
            dataItemColumnValueExtractor: function getItemColumnValue(
                item,
                column
            ) {
                var val = undefined
                try {
                    val = eval("item." + column.field)
                } catch (e) {
                    // ignore
                }
                return val
            },
        }

        // fill the dataset with your data
        this.providersService
            .getAll()
            .subscribe((response: any) => (this.providers = response.data))
    }
    open2(content) {
        this.prepareGrid2()
        this.modalService.open(content, { size: "lg" })
    }

    handleSelectedRowsChanged4(e, args) {
        let updateItem = this.gridService.getDataItemByRowIndex(this.row_number)
        if (Array.isArray(args.rows) && this.gridObj4) {
            args.rows.map((idx) => {
                const item = this.gridObj4.getDataItem(idx)
                console.log(item)
                updateItem.vdhp_part = item.pt_part
                updateItem.desc = item.pt_desc1
                updateItem.vdhp_um = item.pt_um
                
                updateItem.vdhp_taxable = item.pt_taxable
                updateItem.vdhp_tax_code = item.pt_taxc
                updateItem.vdhp_price = item.pt_pur_price
                updateItem.vdhp_taxc = item.taxe.tx2_tax_pct
                this.gridService.updateItem(updateItem)
            })
        }
    }

    angularGridReady4(angularGrid: AngularGridInstance) {
        this.angularGrid4 = angularGrid
        this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {}
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
        this.itemsService
            .getAll()
            .subscribe((response: any) => (this.items = response.data))
    }
    open4(content) {
        this.prepareGrid4()
        this.modalService.open(content, { size: "lg" })
    }
    onAlertClose($event) {
        this.hasFormErrors = false
    }
    onChange() {
        const controls = this.vpForm.controls
        const po_nbr = controls.vhp_po_nbr.value
        this.purchaseOrderService.findBy({ po_nbr }).subscribe(
            (res: any) => {
                const { purchaseOrder, details } = res.data
                // controls.vhp_vend.setValue(requisition.vhp_vend) 
                if(purchaseOrder.provider ) {
                  controls.vhp_vend.setValue(purchaseOrder.po_vend) 
                  controls.name.setValue(purchaseOrder.provider.address.ad_name)
                  controls.vhp_cr_terms.setValue(purchaseOrder.provider.vd_cr_terms)
                  controls.vhp_curr.setValue(purchaseOrder.provider.vd_curr)
                  controls.vhp_ex_rate.setValue(purchaseOrder.po_ex_rate)
                  controls.vhp_ex_rate2.setValue(purchaseOrder.po_ex_rate2)
                  controls.vhp_taxable.setValue(purchaseOrder.po_taxable)
                }
                details.map((value) => {
                    this.gridService.addItem(
                        {
                            id: this.dataset.length + 1,
                            vdhp_line: this.dataset.length + 1,
                            vdhp_part: value.pod_part,
                            desc:value.item.pt_desc1,
                            cmvid: "",
                            
                            vdhp_inv_qty: value.pod_qty_ord,
                            vdhp_um: value.pod_um,
                            vdhp_price: value.pod_price,
                          
                            vdhp_taxable : value.pod_taxable,
                            vdhp_tax_code : value.pod_tax_code,
                            vdhp_disc_pct: value.pod_disc_pct,
                            vdhp_taxc : value.pod_taxc,
                        },
                        { position: "bottom" }
                    )
                })
                this.calculatetot()
            },
            (error) => {
                this.message = `BC avec ce numero ${po_nbr} n'existe pas`
                this.hasFormErrors = true
            },
            () => {}
        )
    }

   

    handleSelectedRowsChanged5(e, args) {
        this.dataset=[]
        this.reset()
        const controls = this.vpForm.controls;
        if (Array.isArray(args.rows) && this.gridObj5) {
          args.rows.map((idx) => {
            const item = this.gridObj5.getDataItem(idx);
            controls.vhp_po_nbr.setValue(item.po_nbr || "");
            const po_nbr = item.po_nbr
            this.purchaseOrderService.findBy({ po_nbr }).subscribe(
                (res: any) => {
                    console.log(res.data)
                    const { purchaseOrder, details } = res.data
                    if(purchaseOrder.provider ) {
                    controls.vhp_vend.setValue(purchaseOrder.po_vend) 
                    controls.name.setValue(purchaseOrder.address.ad_name)
                    controls.vhp_cr_terms.setValue(purchaseOrder.provider.vd_cr_terms)
                    controls.vhp_curr.setValue(purchaseOrder.provider.vd_curr)
                    controls.vhp_ex_rate.setValue(purchaseOrder.po_ex_rate)
                    controls.vhp_ex_rate2.setValue(purchaseOrder.po_ex_rate2)
                    controls.vhp_taxable.setValue(purchaseOrder.po_taxable)
                  }
                    details.map((value) => {
                        this.gridService.addItem(
                            {
                                id: this.dataset.length + 1,
                                vdhp_line: this.dataset.length + 1,
                                vdhp_part: value.pod_part,
                                desc:value.item.pt_desc1,
                                cmvid: "",
                                vdhp_vend_part: "",
                                vdhp_inv_qty: value.pod_qty_ord,
                                vdhp_um: value.pod_um,
                                vdhp_price: value.pod_price,
                                vdhp_taxable : value.pod_taxable,
                                vdhp_tax_code : value.pod_tax_code,
                                vdhp_disc_pct: value.pod_disc_pct,
                                vdhp_taxc : value.pod_taxc,
                                
                            },
                            { position: "bottom" }
                        )
                    })
                    this.calculatetot()
                },
                (error) => {
                    this.message = `BC avec ce numero ${po_nbr} n'existe pas`
                    this.hasFormErrors = true
                },
                () => {}
            )
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
            id: "po_nbr",
            name: "N° BC",
            field: "po_nbr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "po_ord_date",
            name: "Date",
            field: "po_ord_date",
            sortable: true,
            filterable: true,
            type: FieldType.date,
          },
          {
            id: "po_vend",
            name: "Fournisseur",
            field: "po_vend",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ad_name",
            name: "Nom",
            field: "address.ad_name",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
     
            
        ];
    
        this.gridOptions5 = {
          enableSorting: true,
          enableCellNavigation: true,
          enableExcelCopyBuffer: true,
          autoFitColumnsOnFirstLoad: false,
          enableAutoSizeColumns: false,
          // then enable resize by content with these 2 flags
          autosizeColumnsByCellContentOnFirstLoad: true,
          enableAutoResizeColumnsByCellContent: true,
          enableFiltering: true,
          autoEdit: false,
          enableAutoResize:true,
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
          dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
            var val = undefined;
            try {
              val = eval("item." + column.field);
            } catch (e) {
              // ignore
            }
            return val;
          },
          multiSelect: false,
          rowSelectionOptions: {
            // True (Single Selection), False (Multiple Selections)
            selectActiveRow: true,
          },
        };
    
        // fill the dataset with your data
        this.purchaseOrderService
          .getByAll({ po_stat: 'V'})
          .subscribe((response: any) => (this.requisitions = response.data));
      }
      open5(content) {
        this.prepareGrid5();
        this.modalService.open(content, { size: "lg" });
      }

      handleSelectedRowsChangedcurr(e, args) {
        const controls = this.vpForm.controls;
        if (Array.isArray(args.rows) && this.gridObjcurr) {
          args.rows.map((idx) => {
            const item = this.gridObjcurr.getDataItem(idx);
            controls.vhp_curr.setValue(item.cu_curr || "");
            if(item.cu_curr != 'DA'){
              const date = new Date()
              this.date = controls.vhp_due_date.value
              ? `${controls.vhp_due_date.value.year}/${controls.vhp_due_date.value.month}/${controls.vhp_due_date.value.day}`
              : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
              if (item.cu_curr == 'DA'){
                controls.vhp_ex_rate.setValue(1)
                controls.vhp_ex_rate2.setValue(1)
    
              } else {
              this.deviseService.getExRate({exr_curr1:item.cu_curr,exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
                
                 controls.vhp_ex_rate.setValue(res.data.exr_rate)
                 controls.vhp_ex_rate2.setValue(res.data.exr_rate2)
                
              })
            }
            }
          });
        }
      }
    
    angularGridReadycurr(angularGrid: AngularGridInstance) {
        this.angularGridcurr = angularGrid;
        this.gridObjcurr = (angularGrid && angularGrid.slickGrid) || {};
      }
    
      prepareGridcurr() {
        this.columnDefinitionscurr = [
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
    
        this.gridOptionscurr = {
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
      opencurr(content) {
        this.prepareGridcurr();
        this.modalService.open(content, { size: "lg" });
      }
    
      calculatetot(){
        const controls = this.totForm.controls 
         const controlsso = this.vpForm.controls 
         let tht = 0
         let tva = 0
         let timbre = 0
         let ttc = 0
         for (var i = 0; i < this.dataset.length; i++) {
           console.log(this.dataset[i]  )
           tht += round((this.dataset[i].vdhp_price * ((100 - this.dataset[i].vdhp_disc_pct) / 100 ) *  this.dataset[i].vdhp_qty_inv),2)
           if(controlsso.vhp_taxable.value == true) tva += round((this.dataset[i].vdhp_price * ((100 - this.dataset[i].vdhp_disc_pct) / 100 ) *  this.dataset[i].vdhp_qty_inv) * (this.dataset[i].vdhp_taxc ? this.dataset[i].vdhp_taxc / 100 : 0),2)
          
        
         }
      
      // controls.tht.setValue(tht.toFixed(2));
      // controls.tva.setValue(tva.toFixed(2));
      // controls.timbre.setValue(timbre.toFixed(2));
      // controls.ttc.setValue(ttc.toFixed(2));
       this.timbreService.getTimbreValue({ code: controlsso.vhp_cr_terms.value, amt: round(tht + tva )}).subscribe(
          (response: any) => {
          //  console.log(response.data.value)
           if(response.data != null) {
      
            timbre = Math.floor((tht + tva) * Number(response.data.value)/ 100)   
            console.log("timbre",timbre)
            if (timbre < 5) { timbre = 5}            
           }else { timbre = 0}
      
           ttc = round(tht + tva + timbre,2)
      
            controls.tht.setValue(tht.toFixed(2));
            controls.tva.setValue(tva.toFixed(2));
            controls.timbre.setValue(timbre.toFixed(2));
            controls.ttc.setValue(ttc.toFixed(2));
           })
      
      }
      
      
    }

