import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

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
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
// Layout
import {
  SubheaderService,
  LayoutConfigService,
} from "../../../../core/_base/layout";
// CRUD
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import {
  PurchaseOrderService,
  RequisitionService,
  SequenceService,
  ProviderService,
  UsersService,
  ItemService,
  PurchaseOrder,
  VendorProposalService,
  TaxeService,
  DeviseService,
  VendorProposal,
  CodeService,
  SiteService,
  LocationService,
  MesureService,
  printBc,
  TimbreService,
  EmployeService,
} from "../../../../core/erp";
import { round } from 'lodash';
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Console } from "console";


@Component({
  selector: "kt-create-po",
  templateUrl: "./create-po.component.html",
  styleUrls: ["./create-po.component.scss"],
})
export class CreatePoComponent implements OnInit {
  purchaseOrder: PurchaseOrder;
  poForm: FormGroup;
  totForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
error = false;
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  providers: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;

  users: [];
  columnDefinitions3: Column[] = [];
  gridOptions3: GridOption = {};
  gridObj3: any;
  angularGrid3: AngularGridInstance;

  requisitions: [];
  columnDefinitions5: Column[] = [];
  gridOptions5: GridOption = {};
  gridObj5: any;
  angularGrid5: AngularGridInstance;

  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

  ums: [];
  columnDefinitionsum: Column[] = [];
  gridOptionsum: GridOption = {};
  gridObjum: any;
  angularGridum: AngularGridInstance;


  datatax: [];
  columnDefinitionstax: Column[] = [];
  gridOptionstax: GridOption = {};
  gridObjtax: any;
  angularGridtax: AngularGridInstance;


  devises: [];
  columnDefinitionscurr: Column[] = [];
  gridOptionscurr: GridOption = {};
  gridObjcurr: any;
  angularGridcurr: AngularGridInstance;

  datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;
  dataloc: [];
  columnDefinitionsloc: Column[] = [];
  gridOptionsloc: GridOption = {};
  gridObjloc: any;
  angularGridloc: AngularGridInstance;
  seq;
  user;
  row_number;
  message = "";
  requistionServer;
  vpServer;
  provider;
  curr
  site:String;
  datasetPrint = [];
  date: String;
  po_cr_terms: any[] = [];
  domain : any;
  prov:any;
  constructor(
    config: NgbDropdownConfig,
    private poFB: FormBuilder,
    private totFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private requisitonService: RequisitionService,
    private providersService: ProviderService,
    private userService: UsersService,
    private requisitionService: RequisitionService,
    private sequenceService: SequenceService,
    private vendorProposalService: VendorProposalService,
    private purchaseOrderService: PurchaseOrderService,
    private itemsService: ItemService,
    private codeService: CodeService,
    private deviseService: DeviseService,
    private siteService: SiteService,
    private locationService: LocationService,
    private mesureService: MesureService,
    private taxService: TaxeService,
    private timbreService: TimbreService,
    private employeService: EmployeService
  ) {
    config.autoClose = true;
    this.codeService
      .getBy({ code_fldname: "vd_cr_terms" })
      .subscribe((response: any) => (this.po_cr_terms = response.data));
    this.initGrid();

  }
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  initGrid() {
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
        id: "pod_line",
        name: "Ligne",
        field: "pod_line",
        minWidth: 50,
        maxWidth: 50,
        selectable: true,
      },
      {
        id: "pod_req_nbr",
        name: "N Demande",
        field: "pod_req_nbr",
        // minWidth: 50,
        // maxWidth: 120,
        selectable: true,
      },
      {
        id: "pod_part",
        name: "Article",
        field: "pod_part",
        sortable: true,
        // width: 50,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.pod_part)
          const controls = this.poForm.controls 
          this.itemsService.getByOne({pt_part: args.dataContext.pod_part }).subscribe((resp:any)=>{
console.log(resp.data)
            if (resp.data) {
        console.log(resp.data.pt_plan_ord,controls.po_req_id.value)

              if (resp.data.pt_plan_ord && controls.po_req_id.value == null) {
                alert("Article Doit passer par une demande d Achat")
                this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , pod_part: null })


              } else {

              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , pod_site:resp.data.pt_site, pod_loc: resp.data.pt_loc,
                pod_um:resp.data.pt_um,pod_price:resp.data.pt_pur_price, pod_tax_code: resp.data.pt_taxc, pod_taxc: resp.data.taxe.tx2_tax_pct, pod_taxable: resp.data.pt_taxable})

              }
      
      
         }  else {
            alert("Article Nexiste pas")
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , pod_part: null })
         }
          
          });

           
         
         
        }
      },
      {
        id: "mvid",
        field: "cmvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.row_number = args.row;
          let element: HTMLElement = document.getElementById(
            "openItemsGrid"
          ) as HTMLElement;
          element.click();
        },
      },
      {
        id: "desc",
        name: "Description",
        field: "desc",
        sortable: true,
        width: 300,
        filterable: false,
      },
      {
        id: "pod_qty_ord",
        name: "QTE",
        field: "pod_qty_ord",
        sortable: true,
        // width: 80,
        filterable: false,
        type: FieldType.float,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 }
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
  
        

          this.calculatetot();
      }
      
      },
      {
        id: "pod_um",
        name: "UM",
        field: "pod_um",
        sortable: true,
        // width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.pod_part)
          this.itemsService.getByOne({pt_part: args.dataContext.pod_part }).subscribe((resp:any)=>{
            console.log(args.dataContext.pod_part, resp.data.pt_um )
          if   (args.dataContext.pod_um == resp.data.pt_um )  {
            
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , pod_um_conv: 1, pod_price: resp.data.pt_pur_price })
            this.calculatetot();
          } else { 
            //console.log(resp.data.pt_um)



              this.mesureService.getBy({um_um: args.dataContext.pod_um, um_alt_um: resp.data.pt_um, um_part: args.dataContext.pod_part  }).subscribe((res:any)=>{
              console.log(res)
              const { data } = res;
    
            if (data) {
              //alert ("Mouvement Interdit Pour ce Status")
              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , pod_um_conv: res.data.um_conv, pod_price: args.dataContext.pod_price * res.data.um_conv })
              this.angularGrid.gridService.highlightRow(1, 1500);
              this.calculatetot();
            } else {
              this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: args.dataContext.pod_um, um_part: args.dataContext.pod_part  }).subscribe((res:any)=>{
                console.log(res)
                const { data } = res;
                if (data) {
                  //alert ("Mouvement Interdit Pour ce Status")
                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , pod_um_conv: res.data.um_conv, pod_price: args.dataContext.pod_price / res.data.um_conv })
                  this.calculatetot();
                } else {
                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , pod_um_conv: "1" , pod_um: null});
           
                  alert("UM conversion manquante")
                  
                }  
              })

            }
              })

            }
            })
  
          }
      },
      {
        id: "mvid",
        field: "cmvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.row_number = args.row;
          let element: HTMLElement = document.getElementById(
            "openUmsGrid"
          ) as HTMLElement;
          element.click();
        },
      },
      {
        id: "pod_price",
        name: "Prix unitaire",
        field: "pod_price",
        sortable: true,
        // width: 80,
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
        id: "pod_disc_pct",
        name: "Remise",
        field: "pod_disc_pct",
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
        id: "pod_site",
        name: "Site",
        field: "pod_site",
        sortable: true,
        // width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {

          if(this.site == null) {
            this.siteService.getByOne({ si_site: args.dataContext.pod_site,}).subscribe(
              (response: any) => {
              
               console.log(response.data)

                if (response.data) {
                  
               
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , pod_site: response.data.si_site})
               
                }
                else {
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  , pod_site: null});
    
                     // this.gridService.onItemUpdated;
                      alert("Site N'existe pas")
                }
            }); 
          }
          else {
            if(args.dataContext.pod_site != this.site) {

              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , pod_site: this.site})
              alert("Accés refusé à ce site")
          


            }
          }
      }
      },
      {
        id: "mvids",
        field: "cmvids",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
            this.row_number = args.row;
            let element: HTMLElement = document.getElementById(
            "openSitesGrid"
            ) as HTMLElement;
            element.click();
        },
      },
      {
        id: "pod_loc",
        name: "Emplacement",
        field: "pod_loc",
        sortable: true,
        // width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.tr_loc)
          
            
            this.locationService.getByOne({ loc_loc: args.dataContext.pod_loc, loc_site: args.dataContext.pod_site }).subscribe(
              (response: any) => {
                if (!response.data) {

                      alert("Emplacement Nexiste pas")
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , pod_loc: null, })
                    }
                     
        });

      }
      },
      {
        id: "mvidl",
        field: "cmvidl",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
            this.row_number = args.row;
            let element: HTMLElement = document.getElementById(
            "openLocsGrid"
            ) as HTMLElement;
            element.click();
        },
      },       
    
      {
        id: "pod_type",
        name: "Type",
        field: "pod_type",
        sortable: true,
        // width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "pod_cc",
        name: "Centre de cout",
        field: "pod_cc",
        sortable: true,
        // width: 80,
        filterable: false,
        
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "pod_taxable",
        name: "Taxable",
        field: "pod_taxable",
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
        id: "pod_tax_code",
        name: "Code de Taxe",
        field: "pod_tax_code",
        sortable: true,
        // width: 80,
        filterable: false,
        
      },  
      {
        id: "pod_taxc",
        name: "Taux de Taxe",
        field: "pod_taxc",
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
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      autoFitColumnsOnFirstLoad: false,
      enableAutoSizeColumns: false,
      // then enable resize by content with these 2 flags
      autosizeColumnsByCellContentOnFirstLoad: true,
      enableAutoResizeColumnsByCellContent: true,
      enableAutoResize:true,
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
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.domain = JSON.parse(localStorage.getItem("domain"));
    this.user =  JSON.parse(localStorage.getItem('user'))
   if (this.user.usrd_site == "*") {this.site = null} else {this.site = this.user.usrd_site }
   console.log(this.site,this.user.usrd_site)
    this.createForm();
    this.createtotForm();
    this.activatedRoute.params.subscribe((params) => {
      const id = params.id;
      if (id) {
        const controls = this.poForm.controls;

        this.vendorProposalService.findByOne({ id }).subscribe(
          (res: any) => {
            console.log("aa", res.data);
            const { vendorProposal, details } = res.data;
            this.vpServer = vendorProposal;
console.log(this.vpServer)
            controls.po_vend.setValue(this.vpServer.vp_vend);
            controls.po_req_id.setValue(this.vpServer.vp_rqm_nbr);
            controls.po_curr.setValue(this.vpServer.vp_curr);
           
            this.providersService
                  .getBy({ vd_addr: this.vpServer.vp_vend })
                  .subscribe((resprov: any) => {
                    
                    this.provider = resprov.data.address
                    this.prov = resprov.data
                    console.log("this.provider", this.provider)
                    controls.po_taxable.setValue(this.provider.ad_taxable)
                    controls.po_taxc.setValue(this.provider.ad_taxc)
                    controls.po_cr_terms.setValue(this.prov.vd_cr_terms || "");
                  this.deviseService.getBy({cu_curr:this.prov.vd_curr}).subscribe((resc:any)=>{  
                    this.curr = resc.data

                    if (this.prov.vd_curr == 'DA'){
                      controls.po_ex_rate.setValue(1)
                      controls.po_ex_rate2.setValue(1)
            
                    } else {
                      const date = new Date()
                      this.date = controls.po_ord_date.value
                      ? `${controls.po_ord_date.value.year}/${controls.po_ord_date.value.month}/${controls.po_ord_date.value.day}`
                      : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
                
                      this.deviseService.getExRate({exr_curr1:this.prov.vd_curr, exr_curr2:'DA', date: this.date}).subscribe((resdev:any)=>{  
                       controls.po_ex_rate.setValue(resdev.data.exr_rate)
                       controls.po_ex_rate2.setValue(resdev.data.exr_rate2)
                      
                      })
                    }
            
                 })
                
            for (const object in details) {
              const detail = details[object];
              this.gridService.addItem(
                {
                  id: this.dataset.length + 1,
                  pod_line: this.dataset.length + 1,
                  pod_req_nbr: this.vpServer.vp_rqm_nbr,
                  pod_part: detail.vpd_part,
                  cmvid: "",
                  desc: detail.item.pt_desc1,
                  pod_qty_ord: detail.vpd_q_qty,
                  pod_um: detail.vpd_um,
                  pod_price: detail.vpd_q_price,
                  pod_disc_pct: 0,
                  pod_site: this.site,
                  pod_loc: detail.item.pt_loc,
                  pod_type: detail.item.pt_type,
                  pod_cc: "",
                  pod_taxable: detail.item.pt_taxable,
                  pod_tax_code: detail.item.pt_taxc,
                  pod_taxc: detail.item.taxe.tx2_tax_pct,

                },
                { position: "bottom" }
              );
              this.datasetPrint.push({
                id: this.dataset.length + 1,
                pod_line: this.dataset.length + 1,
                pod_req_nbr: this.vpServer.vp_rqm_nbr,
                pod_part: detail.vpd_part,
                cmvid: "",
                desc: detail.item.pt_desc1,
                pod_qty_ord: detail.vpd_q_qty,
                pod_um: detail.vpd_um,
                pod_price: detail.vpd_q_price,
                pod_disc_pct: 0,
                pod_site: this.site,
                pod_loc: detail.item.pt_loc,
                pod_type: detail.item.pt_type,
                pod_cc: "",
                pod_taxable: detail.item.pt_taxable,
                pod_tax_code: detail.item.pt_taxc,
                pod_taxc: detail.item.taxe.tx2_tax_pct,
                taxe: detail.item.taxe.tx2_tax_pct,
              });
            }
            this.calculatetot() 
          })
        
        },
          (error) => {
            this.message = ` ce numero ${id} n'existe pas`;
            this.hasFormErrors = true;
          },
          () => {}
        );
      }
    });
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.purchaseOrder = new PurchaseOrder();
    const date = new Date;
    
    this.poForm = this.poFB.group({
      po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],

      po_vend: [this.purchaseOrder.po_vend],
      po_ord_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      po_due_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      
      po_taxable: [this.purchaseOrder.po_taxable],
      po_taxc: [this.purchaseOrder.po_taxc],
      po_buyer: [this.purchaseOrder.po_buyer],
      po_req_id: [this.purchaseOrder.po_req_id],
      po_rmks: [this.purchaseOrder.po_rmks],
      po_curr: [this.purchaseOrder.po_curr],
      po_ex_rate: [this.purchaseOrder.po_ex_rate],
      po_ex_rate2: [this.purchaseOrder.po_ex_rate2],
      po_cr_terms: [this.purchaseOrder.po_cr_terms],
      print:[false]
    });

    const controls = this.poForm.controls
    this.sequenceService.getBy({ seq_type: "PO", seq_profile: this.user.usrd_profile }).subscribe(
      (res: any) => {
        this.seq = res.data[0].seq_seq
        console.log(this.seq)
        controls.po_category.setValue(this.seq);
    
    })
    

  }
  createtotForm() {
    this.loadingSubject.next(false);
    //this.saleOrder = new SaleOrder();
   // const date = new Date;
    
    this.totForm = this.totFB.group({
  //    so__chr01: [this.saleOrder.so__chr01],
      tht: [{value: 0.00 , disabled: true}],
      tva: [{value: 0.00 , disabled: true}],
      timbre: [{value: 0.00 , disabled: true}],
      ttc: [{value: 0.00 , disabled: true}],
    });

    
    

  }
  //reste form
  reset() {
    this.purchaseOrder = new PurchaseOrder();
    this.createForm();
    this.dataset=[];
    this.createtotForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.poForm.controls;
    /** check form */
    if (this.poForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }

    if (!this.dataset.length) {
      this.message = "La liste des article ne peut pas etre vide";
      this.hasFormErrors = true;

      return;
    }
    if (controls.po_cr_terms.value.startsWith("ES" ) && (controls.po_buyer.value == null || controls.po_buyer.value == "" )) {
      this.message = "Acheteur Obligatoire pour le mode Espece"
      this.hasFormErrors = true

      return
  }
    // tslint:disable-next-line:prefer-const
    let po = this.preparePo();
    
    this.addPo(po, this.dataset);
  }

  /**
   *
   * Returns object for saving
   */
  preparePo(): any {
    const controls = this.poForm.controls;
    const controls1 = this.totForm.controls;
    const _po = new PurchaseOrder();
    _po.po_vend = controls.po_vend.value;
    _po.po_ord_date = controls.po_ord_date.value
      ? `${controls.po_ord_date.value.year}/${controls.po_ord_date.value.month}/${controls.po_ord_date.value.day}`
      : null;
    _po.po_due_date = controls.po_due_date.value
      ? `${controls.po_due_date.value.year}/${controls.po_due_date.value.month}/${controls.po_due_date.value.day}`
      : null;
    _po.po_taxable = controls.po_taxable.value;
    _po.po_taxc = controls.po_taxc.value;
    _po.po_buyer = controls.po_buyer.value;
    _po.po_req_id = controls.po_req_id.value;
    
    _po.po_rmks = controls.po_rmks.value;
    _po.po_curr = controls.po_curr.value;
    _po.po_ex_rate = controls.po_ex_rate.value;
    _po.po_ex_rate2 = controls.po_ex_rate2.value;
    _po.po_cr_terms = controls.po_cr_terms.value;
    _po.po_category = controls.po_category.value;
    
    _po.po_amt = controls1.tht.value
    _po.po_tax_amt = controls1.tva.value
    _po.po_trl1_amt = controls1.timbre.value
       
    return _po;
  
  }
  /**
   * Add po
   *
   * @param _po: po
   */
  addPo(_po: any, detail: any) {
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
    }
    this.loadingSubject.next(true);
    let po = null;
    const controls = this.poForm.controls;

    this.purchaseOrderService
      .add({ purchaseOrder: _po, purchaseOrderDetail: detail })
      .subscribe(
        (reponse: any) => {
          po = reponse.data
        //  const arrayOctet = new Uint8Array(reponse.pdf.data)
        //  const file = new Blob([arrayOctet as BlobPart], {type : 'application/pdf'})
        //  const fileUrl = URL.createObjectURL(file);
        //  window.open(fileUrl)
        },
        (error) => {
          this.layoutUtilsService.showActionNotification(
            "Erreur verifier les informations",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.loadingSubject.next(false);
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
          console.log(this.provider, po, this.dataset);
          if(controls.print.value == true) this.printpdf(po.po_nbr) //printBc(this.provider, this.dataset, po, this.curr);
          this.router.navigateByUrl(`purchasing/po-list/${po.po_nbr}`)
          this.reset()
        }
      );
  }

  onChangeEmp() {
    const controls = this.poForm.controls;
      
    this.employeService.getBy({ emp_addr: controls.po_buyer.value }).subscribe((response: any) => {
      //   const { data } = response;
      
      if (response.data.length == 0 ) {
        alert("Employe n'exist pas")
        controls.po_buyer.setValue(null)
        document.getElementById("po_buyer").focus();
      } 
    });
}
  onChangeReqNbr() {
    const controls = this.poForm.controls;
    const rqm_nbr = controls.po_req_id.value;
    const vp_vend = controls.po_vend.value;
this.dataset=[]
    this.requisitonService.findBy({ rqm_nbr }).subscribe(
      (res: any) => {
       
        const { requisition, details } = res.data;
        if  (requisition != null) {
        const det1 = details;
        this.requistionServer = requisition;
        const {
          sequence: { seq_appr3_lev },
          rqm_aprv_stat,
        } = this.requistionServer;
        console.log(
          seq_appr3_lev,
          rqm_aprv_stat,
          rqm_aprv_stat !== `${seq_appr3_lev}`
        );
        if (rqm_aprv_stat !== `${seq_appr3_lev}`) {
          this.hasFormErrors = true;
          this.message = "cette demande d'achat n'est pas encore validee";
          return;
        }
       
                controls.po_vend.setValue(this.requistionServer.rqm_vend);
                this.providersService
                  .getBy({ vd_addr: this.requistionServer.rqm_vend })
                  .subscribe((res: any) => (this.provider = res.data[0]));

                  this.deviseService.getBy({cu_curr:this.provider.vd_curr}).subscribe((resc:any)=>{  
                    this.curr = resc.data
                 })
          
                for (const object in det1) {
                  console.log(details[object]);
                  const detail = details[object];
                  this.gridService.addItem(
                    {
                      id: this.dataset.length + 1,
                      pod_line: this.dataset.length + 1,
                      pod_req_nbr: rqm_nbr,
                      pod_part: detail.rqd_part,
                      cmvid: "",
                      desc: detail.rqd_desc,
                      pod_qty_ord: 0,
                      pod_um: detail.item.pt_um,
                      pod_price: 0,
                      pod_disc_pct: 0,
                      pod_site: this.site,
                      pod_loc: detail.item.pt_loc,
                      pod_type: detail.item.pt_type,
                      pod_cc: "",
                      pod_taxable: detail.item.pt_taxable,
                      pod_taxc: detail.item.taxe.tx2_tax_pct,
                    },
                    { position: "bottom" }
                  );
                  this.datasetPrint.push({
                    id: this.dataset.length + 1,
                    pod_line: this.dataset.length + 1,
                    pod_req_nbr: rqm_nbr,
                    pod_part: detail.rqd_part,
                    cmvid: "",
                    desc: detail.rqd_desc,
                    pod_qty_ord: 0,
                    pod_um: detail.item.pt_um,
                    pod_price: 0,
                    pod_disc_pct: 0,
                    pod_site: detail.item.pt_site,
                    pod_loc: detail.item.pt_loc,
                    pod_type: detail.item.pt_type,
                    pod_cc: "",
                    pod_taxable: detail.item.pt_taxable,
                    pod_tax_code: detail.item.pt_taxc,
                    pod_taxc: detail.item.taxe.tx2_tax_pct,
                    
                  });
                }
              }
             else {
              alert("Demande n'exist pas")
              controls.po_req_id.setValue(null)
              document.getElementById("po_req_id").focus();
            }  
  });
    /*HERE*/ 
          
    this.calculatetot();
  }

  
  changeCurr(){
    const controls = this.poForm.controls // chof le champs hada wesh men form rah
    const cu_curr  = controls.po_curr.value

    const date = new Date()

    this.date = controls.po_ord_date.value
      ? `${controls.po_ord_date.value.year}/${controls.po_ord_date.value.month}/${controls.po_ord_date.value.day}`
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
              controls.po_ex_rate.setValue(1)
              controls.po_ex_rate2.setValue(1)

            } else {

            this.deviseService.getExRate({exr_curr1:cu_curr, exr_curr2:'DA', date: this.date /* `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`*/ }).subscribe((res:any)=>{
               controls.po_ex_rate.setValue(res.data.exr_rate)
               controls.po_ex_rate2.setValue(res.data.exr_rate2)
              })
     
              }
             
     
        }


    },error=>console.log(error))
}
changeRateCurr(){
  const controls = this.poForm.controls // chof le champs hada wesh men form rah
  const cu_curr  = controls.po_curr.value

  const date = new Date()

  this.date = controls.po_ord_date.value
    ? `${controls.po_ord_date.value.year}/${controls.po_ord_date.value.month}/${controls.po_ord_date.value.day}`
    : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

    if (cu_curr == 'DA'){
      controls.po_ex_rate.setValue(1)
      controls.po_ex_rate2.setValue(1)

    } else {
          this.deviseService.getExRate({exr_curr1:cu_curr, exr_curr2:'DA', date: this.date /* `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`*/ }).subscribe((res:any)=>{
            

             controls.po_ex_rate.setValue(res.data.exr_rate)
             controls.po_ex_rate2.setValue(res.data.exr_rate2)
            })
   
    }
           
          
  
}
onChangeTAX() {
  const controls = this.poForm.controls;
  const tax = controls.po_taxable.value;

    for (var i = 0; i < this.dataset.length; i++) {
      let updateItem = this.gridService.getDataItemByRowIndex(i);
    //  console.log(this.dataset[i].qty_oh)
          updateItem.pod_taxable = tax ;
      
          this.gridService.updateItem(updateItem);
       
    };
  
  
 
  this.calculatetot();
}

changeTax(){
  const controls = this.poForm.controls // chof le champs hada wesh men form rah
  const tx2_tax_code  = controls.po_taxc.value
  this.taxService.getBy({tx2_tax_code}).subscribe((res:any)=>{
      const {data} = res
      console.log(res)
      if (!data){ this.layoutUtilsService.showActionNotification(
          "cette Taxe n'existe pas!",
          MessageType.Create,
          10000,
          true,
          true
      )
  this.error = true}
      else {
          this.error = false
      }


  },error=>console.log(error))
}


  onChangeVend() {
      const controls = this.poForm.controls; // chof le champs hada wesh men form rah
      const vd_addr = controls.po_vend.value;
      const date = new Date()

      this.date = controls.po_ord_date.value
      ? `${controls.po_ord_date.value.year}/${controls.po_ord_date.value.month}/${controls.po_ord_date.value.day}`
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
            controls.po_vend.setValue(data.vd_addr || "");
            controls.po_curr.setValue(data.vd_curr || "");
            controls.po_taxable.setValue(data.address.ad_taxable || "");
            controls.po_taxc.setValue(data.address.ad_taxc || "");
            this.deviseService.getBy({cu_curr:data.vd_curr}).subscribe((resc:any)=>{  
              this.curr = resc.data
           })
            if (data.vd_curr == 'DA'){
              controls.po_ex_rate.setValue(1)
              controls.po_ex_rate2.setValue(1)

            } else {

            this.deviseService.getExRate({exr_curr1:data.vd_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
              
               controls.po_ex_rate.setValue(res.data.exr_rate)
               controls.po_ex_rate2.setValue(res.data.exr_rate2)
              })

              }

          }
           
        },
        (error) => console.log(error)
      );
    }
  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  // add new Item to Datatable
  addNewItem() {
    this.gridService.addItem(
      {
        id: this.dataset.length + 1,
        pod_line: this.dataset.length + 1,
        pod_req_nbr: "",
        pod_part: "",
        cmvid: "",
        desc: "",
        pod_qty_ord: 0,
        pod_um: "",
        pod_price: 0,
        pod_disc_pct: 0,
        pod_site: this.site,
        pod_loc: "",
        pod_type: "",
        pod_cc: "",
        pod_taxable: true,
        pod_tax_code: "",
        pod_taxc: "",
      },
      { position: "bottom" }
    );
  }
  handleSelectedRowsChanged2(e, args) {
    const controls = this.poForm.controls;
    if (Array.isArray(args.rows) && this.gridObj2) {
      args.rows.map((idx) => {
        const item = this.gridObj2.getDataItem(idx);
        console.log(item)
        const date = new Date()

        this.date = controls.po_ord_date.value
        ? `${controls.po_ord_date.value.year}/${controls.po_ord_date.value.month}/${controls.po_ord_date.value.day}`
        : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
  

        this.provider = item.address;
        controls.po_vend.setValue(item.vd_addr || "");
        controls.po_curr.setValue(item.vd_curr || "");
        controls.po_taxable.setValue(item.address.ad_taxable || false);
        controls.po_taxc.setValue(item.address.ad_taxc || "");
        controls.po_cr_terms.setValue(item.vd_cr_terms || "");
        this.deviseService.getBy({cu_curr:item.vd_curr}).subscribe((res:any)=>{  
          this.curr = res.data
       })
 
       
        if (item.vd_curr == 'DA'){
          controls.po_ex_rate.setValue(1)
          controls.po_ex_rate2.setValue(1)

        } else {
         
          this.deviseService.getExRate({exr_curr1:item.vd_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{  
           controls.po_ex_rate.setValue(res.data.exr_rate)
           controls.po_ex_rate2.setValue(res.data.exr_rate2)
          
        })
            }


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
    this.providersService
      .getAll()
      .subscribe((response: any) => (this.providers = response.data));
  }
  open2(content) {
    this.prepareGrid2();
    this.modalService.open(content, { size: "lg" });
  }

  handleSelectedRowsChanged3(e, args) {
    const controls = this.poForm.controls;
    if (Array.isArray(args.rows) && this.gridObj3) {
      args.rows.map((idx) => {
        const item = this.gridObj3.getDataItem(idx);
        console.log(item);
        controls.po_buyer.setValue(item.emp_addr || "");
      });
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
        id: "emp_addr",
        name: "Code Employé",
        field: "emp_addr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "emp_fname",
        name: "Nom",
        field: "emp_fname",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
      },
     
     
      {
        id: "emp_job",
        name: "Service",
        field: "emp_job",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "occ",
        name: "Nombre des Achats",
        field: "occ",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.integer,
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
    };

    // fill the dataset with your data
    this.employeService.getByPo({}).subscribe((response: any) => (this.users = response.data));
  }
  open3(content) {
    this.prepareGrid3();
    this.modalService.open(content, { size: "lg" });
  }

  handleSelectedRowsChanged4(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    const controls = this.poForm.controls;
    
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {

        
        const item = this.gridObj4.getDataItem(idx);
        console.log(item);
        if (item.pt_plan_ord && controls.po_req_id.value == null) {

          alert("Article Doit passer pas une Demande D achat")
          this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , pod_part: null })


        } else {

        
        updateItem.pod_part = item.pt_part;
        updateItem.desc = item.pt_desc1;
        updateItem.pod_um = item.pt_um;
        updateItem.pod_site = this.site;
        updateItem.pod_loc = item.pt_loc
        updateItem.pod_taxable = item.pt_taxable
        updateItem.pod_tax_code = item.pt_taxc
        updateItem.pod_price = item.pt_pur_price
        updateItem.pod_taxc = item.taxe.tx2_tax_pct
        this.gridService.updateItem(updateItem);
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
        name: "desc",
        field: "pt_um",
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
    // let obj = {pt_dea:true,pt_pm_code:'P'}
    this.itemsService
      .getByPurchase()
      .subscribe((response: any) => (this.items = response.data));
  }
  open4(content) {
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  handleSelectedRowsChanged5(e, args) {
    const controls = this.poForm.controls;

    const rqm_nbr = controls.po_req_id.value;
    const vp_vend = controls.po_vend.value;

    if (Array.isArray(args.rows) && this.gridObj5) {
      this.dataset = []
      args.rows.map((idx) => 
      {
        const item = this.gridObj5.getDataItem(idx);
        controls.po_req_id.setValue(item.rqm_nbr || "");


        this.requisitonService.findBy({ rqm_nbr: item.rqm_nbr }).subscribe(
          (res: any) => {
            const { requisition, details } = res.data;
            console.log(res.data)
            const det1 = details;
            this.requistionServer = requisition;
            const {
              sequence: { seq_appr3_lev },
              rqm_aprv_stat,
            } = this.requistionServer;
            console.log(
              seq_appr3_lev,
              rqm_aprv_stat,
              rqm_aprv_stat !== `${seq_appr3_lev}`
            );
            if (rqm_aprv_stat !== `${seq_appr3_lev}`) {
              this.hasFormErrors = true;
              this.message = "cette demande d'Achat n'est pas encore validée";
              return;
            }
           
                    for (const object in det1) {
                      console.log("hna",details[object]);
                      const detail = details[object];
                      this.gridService.addItem(
                        {
                          id: this.dataset.length + 1,
                          pod_line: this.dataset.length + 1,
                          pod_req_nbr: item.rqm_nbr,
                          pod_part: detail.rqd_part,
                          cmvid: "",
                          desc: detail.rqd_desc,
                          pod_qty_ord: detail.rqd_req_qty,
                          pod_um: detail.item.pt_um,
                          pod_price: 0,
                          pod_disc_pct: 0,
                          pod_site: this.site,
                          pod_loc: detail.item.pt_loc,
                          pod_type: detail.item.pt_type,
                          pod_cc: "",
                          pod_taxable: detail.item.pt_taxable,
                          pod_tax_code: detail.item.pt_taxc,
                          pod_taxc: detail.item.taxe.tx2_tax_pct,
                        },
                        { position: "bottom" }
                      );
                      this.datasetPrint.push({
                        id: this.dataset.length + 1,
                        pod_line: this.dataset.length + 1,
                        pod_req_nbr: item.rqm_nbr,
                        pod_part: detail.rqd_part,
                        cmvid: "",
                        desc:  detail.rqd_desc,
                        pod_qty_ord: 0,
                        pod_um: detail.item.pt_um,
                        pod_price: 0,
                        pod_disc_pct: 0,
                        pod_site: this.site,
                        pod_loc: detail.item.pt_part,
                        pod_type: detail.item.pt_type,
                        pod_cc: "",
                        pod_taxable: detail.item.pt_taxable,
                        pod_tax_code: detail.item.pt_taxc,
                        pod_taxc: detail.item.taxe.tx2_tax_pct,
                        
                      });
                    }
                    this.calculatetot()
                  })
                
               
          },
          (error) => {
            this.message = `Demande avec ce numero ${rqm_nbr} n'existe pas`;
            this.hasFormErrors = true;
          },
          () => {}
        );
    
      
    }
    this.calculatetot();
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
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "rqm_category",
        name: "Sequence",
        field: "rqm_category",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "rqm_nbr",
        name: "N° Demande",
        field: "rqm_nbr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "seq_desc",
        name: "Description",
        field: "sequence.seq_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "rqm_req_date",
        name: "Date",
        field: "rqm_req_date",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "rqm_vend",
        name: "Fournisseur",
        field: "rqm_vend",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
       {
        id: "chr01",
        name: "Nom Fournisseur",
        field: "chr01",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "rqm_status",
        name: "status",
        field: "rqm_status",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "rqm_aprv_stat",
        name: "Approbation",
        field: "rqm_aprv_stat",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "created_by",
        name: "Utilisateur",
        field: "created_by",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "rqm_rqby_userid",
        name: "Demandeur",
        field: "rqm_rqby_userid",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "chr02",
        name: "Nom Demandeur",
        field: "chr02",
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
    };

    // fill the dataset with your data
    this.requisitionService
      .getByAll({ rqm_aprv_stat: "3", rqm_open: true })
      .subscribe((response: any) => (this.requisitions = response.data));
  }
  open5(content) {
    this.prepareGrid5();
    this.modalService.open(content, { size: "xl" });
  }
  handleSelectedRowsChangedtax(e, args) {
    const controls = this.poForm.controls;
    if (Array.isArray(args.rows) && this.gridObjtax) {
      args.rows.map((idx) => {
        const item = this.gridObjtax.getDataItem(idx);
        controls.po_taxc.setValue(item.tx2_tax_code || "");
      });
    }
  }

  angularGridReadytax(angularGrid: AngularGridInstance) {
    this.angularGridtax = angularGrid;
    this.gridObjtax = (angularGrid && angularGrid.slickGrid) || {};
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
    ];

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
    };

    // fill the dataset with your data
    this.taxService
      .getAll()
      .subscribe((response: any) => (this.datatax = response.data));
  }
  opentax(contenttax) {
    this.prepareGridtax();
    this.modalService.open(contenttax, { size: "lg" });
  }


  handleSelectedRowsChangedcurr(e, args) {
    const controls = this.poForm.controls;
    if (Array.isArray(args.rows) && this.gridObjcurr) {
      args.rows.map((idx) => {
        const item = this.gridObjcurr.getDataItem(idx);
        controls.po_curr.setValue(item.cu_curr || "");
        if(item.cu_curr == 'DA'){
            controls.po_ex_rate.setValue(1)
            controls.po_ex_rate2.setValue(1)

          } else {
            const date = new Date()
            this.date = controls.po_ord_date.value
            ? `${controls.po_ord_date.value.year}/${controls.po_ord_date.value.month}/${controls.po_ord_date.value.day}`
            : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
          
            this.deviseService.getExRate({exr_curr1:item.cu_curr,exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
            
             controls.po_ex_rate.setValue(res.data.exr_rate)
             controls.po_ex_rate2.setValue(res.data.exr_rate2)
            
          })
        
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



  handleSelectedRowsChangedum(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjum) {
      args.rows.map((idx) => {
        const item = this.gridObjum.getDataItem(idx);
        updateItem.pod_um = item.code_value;
     
        this.gridService.updateItem(updateItem);

/*********/
console.log(updateItem.pod_part)

      this.itemsService.getBy({pt_part: updateItem.pod_part }).subscribe((resp:any)=>{
                      
        if   (updateItem.pod_um == resp.data.pt_um )  {
          
          updateItem.pod_um_conv = 1
          updateItem.pod_price = resp.data.pt_pur_price
          this.calculatetot();
        } else { 
          //console.log(resp.data.pt_um)



            this.mesureService.getBy({um_um: updateItem.pod_um, um_alt_um: resp.data.pt_um, um_part: updateItem.pod_part  }).subscribe((res:any)=>{
            console.log(res)
            const { data } = res;

          if (data) {
            //alert ("Mouvement Interdit Pour ce Status")
            updateItem.pod_um_conv = res.data.um_conv 
            updateItem.pod_price = updateItem.pod_price * res.data.um_conv
            this.calculatetot();
            this.angularGrid.gridService.highlightRow(1, 1500);
          } else {
            this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: updateItem.pod_um, um_part: updateItem.pod_part  }).subscribe((res:any)=>{
              console.log(res)
              const { data } = res;
              if (data) {
                //alert ("Mouvement Interdit Pour ce Status")
                updateItem.pod_um_conv = res.data.um_conv
                updateItem.pod_price = updateItem.pod_price / res.data.um_conv
                this.calculatetot();
              } else {
                updateItem.pod_um_conv = 1
                updateItem.pod_um = null
        
                alert("UM conversion manquante")
                
              }  
            })

          }
            })

          }
          })



      });
    } 
  
  }
  // handleSelectedRowsChangedum(e, args) {
  //   let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
  //   if (Array.isArray(args.rows) && this.gridObjum) {
  //     args.rows.map((idx) => {
  //       const item = this.gridObjum.getDataItem(idx);
  //       updateItem.pod_um = item.code_value;
     
  //       this.gridService.updateItem(updateItem);
  //     });
  //   }}
angularGridReadyum(angularGrid: AngularGridInstance) {
    this.angularGridum = angularGrid
    this.gridObjum = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridum() {
    this.columnDefinitionsum = [
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
    ]

    this.gridOptionsum = {
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
    this.codeService
        .getBy({ code_fldname: "pt_um" })
        .subscribe((response: any) => (this.ums = response.data))
}
openum(content) {
    this.prepareGridum()
    this.modalService.open(content, { size: "lg" })
}
handleSelectedRowsChangedsite(e, args) {
  let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObjsite) {
    args.rows.map((idx) => {
      const item = this.gridObjsite.getDataItem(idx);
      console.log(item);

          
      updateItem.pod_site = item.si_site;
      
      this.gridService.updateItem(updateItem);
   
});

  }
}
angularGridReadysite(angularGrid: AngularGridInstance) {
  this.angularGridsite = angularGrid;
  this.gridObjsite = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridsite() {
  this.columnDefinitionssite = [
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
      id: "si_site",
      name: "Site",
      field: "si_site",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "si_desc",
      name: "Designation",
      field: "si_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptionssite = {
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
 if(this.site == null) {
      this.siteService
        .getAll()
        .subscribe((response: any) => (this.datasite = response.data));
    }else {
      this.siteService
        .getBy({si_site: this.site})
        .subscribe((response: any) => (this.datasite = response.data));
      
   }
  }

opensite(contentsite) {
  this.prepareGridsite();
  this.modalService.open(contentsite, { size: "lg" });
}


handleSelectedRowsChangedloc(e, args) {
  let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObjloc) {
    args.rows.map((idx) => {
      const item = this.gridObjloc.getDataItem(idx);
          
      updateItem.pod_loc = item.loc_loc;
      
      this.gridService.updateItem(updateItem);
   
});

  }
}
angularGridReadyloc(angularGrid: AngularGridInstance) {
  this.angularGridloc = angularGrid;
  this.gridObjloc = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridloc() {
  this.columnDefinitionsloc = [
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
      id: "loc_site",
      name: "Site",
      field: "loc_site",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "loc_loc",
      name: "Emplacement",
      field: "loc_loc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "loc_desc",
      name: "Designation",
      field: "loc_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "loc_status",
      name: "Status",
      field: "loc_status",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "loc_perm",
      name: "Permanent",
      field: "loc_perm",
      sortable: true,
      filterable: true,
      type: FieldType.boolean,
      formatter: Formatters.yesNo,
    },
  ];

  this.gridOptionsloc = {
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
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
  
  // fill the dataset with your data
  this.locationService
    .getBy({ loc_site:  updateItem.pod_site })
    .subscribe((response: any) => (this.dataloc = response.data));
}
openloc(contentloc) {
  this.prepareGridloc();
  this.modalService.open(contentloc, { size: "lg" });
}
calculatetot(){
  const controls = this.totForm.controls 
   const controlsso = this.poForm.controls 
   let tht = 0
   let tva = 0
   let timbre = 0
   let ttc = 0
   for (var i = 0; i < this.dataset.length; i++) {
     console.log(this.dataset[i]  )
     tht += round((this.dataset[i].pod_price * ((100 - this.dataset[i].pod_disc_pct) / 100 ) *  this.dataset[i].pod_qty_ord),2)
     if(controlsso.po_taxable.value == true) tva += round((this.dataset[i].pod_price * ((100 - this.dataset[i].pod_disc_pct) / 100 ) *  this.dataset[i].pod_qty_ord) * (this.dataset[i].pod_taxc ? this.dataset[i].pod_taxc / 100 : 0),2)
    
  
     

     console.log(tva)
     if(controlsso.po_cr_terms.value == "ES") { if((tht + tva) <= 30000){timbre = round((tht + tva) / 100, 2)}
     else{
       if((tht + tva) > 30000 && (tht + tva) <= 100000){timbre = round((tht + tva) * 1.5 / 100 , 2)}
       else{timbre = round((tht + tva) * 2 / 100 , 2)}
     };
     
     if (timbre < 5) {
       timbre = 5;
     } } 
  
   }
 ttc = round(tht + tva + timbre,2)
console.log(tht,tva,timbre,ttc)
controls.tht.setValue(tht.toFixed(2));
controls.tva.setValue(tva.toFixed(2));
controls.timbre.setValue(timbre.toFixed(2));
controls.ttc.setValue(ttc.toFixed(2));
 this.timbreService.getTimbreValue({ code: controlsso.po_cr_terms.value, amt: round(tht + tva )}).subscribe(
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

printpdf(nbr) {
  const controls = this.totForm.controls 
  const controlss = this.poForm.controls 
  console.log("pdf",this.provider)
  var doc = new jsPDF();
 
 // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
 var img = new Image();
 img.src = "./assets/media/logos/companylogo.png";
 doc.addImage(img, "png", 160, 5, 50, 30);
  doc.setFontSize(9);
  if (this.domain.dom_name != null) {
    doc.text(this.domain.dom_name, 10, 10);
  }
  if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
  if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
  if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
  doc.line(10, 32, 200, 32);
  doc.text( 'RC : ' + this.domain.dom_rc + "          NIF : " + this.domain.dom_nif +  "          AI : " + this.domain.dom_ai  , 60, 37);
  doc.line(10, 40, 200, 40);
  doc.setFontSize(12);
    doc.setFontSize(12);
    doc.text( 'Bon Commande N° : ' + nbr  , 70, 50);
    doc.setFontSize(8);
    
    doc.text('Code Fournisseur : ' + this.provider.ad_addr, 20 , 60 )
    doc.text('Nom             : ' + this.provider.ad_name, 20 , 65)
    doc.text('Adresse       : ' + this.provider.ad_line1, 20 , 70)
    if (this.provider.ad_misc2_id != null) {doc.text('MF          : ' + this.provider.ad_misc2_id, 20 , 75)}
        if (this.provider.ad_gst_id != null) {doc.text('RC          : ' + this.provider.ad_gst_id, 20 , 80)}
        if (this.provider.ad_pst_id) {doc.text('AI            : ' + this.provider.ad_pst_id, 20 , 85)}
        if (this.provider.ad_misc1_id != null) {doc.text('NIS         : ' + this.provider.ad_misc1_id, 20 , 90)}
   
 
    
        doc.line(10, 95, 200, 95);
        doc.line(10, 100, 200, 100);
        doc.line(10, 95, 10, 100);
        doc.text('LN', 12.5 , 98.5);
        doc.line(20, 95, 20, 100);
        doc.text('Code Article', 22 , 98.5);
        doc.line(60, 95, 60, 100);
        doc.text('Désignation', 67.5 , 98.5);
        doc.line(110, 95, 110, 100);
        doc.text('QTE', 117 , 98.5);
        doc.line(125, 95, 125, 100);
        doc.text('UM', 128 , 98.5);
        doc.line(135, 95, 135, 100);
        doc.text('PU', 138 , 98.5);
        doc.line(150, 95, 150, 100);
        doc.text('TVA', 152 , 98.5);
        doc.line(160, 95, 160, 100);
        doc.text('REM', 162 , 98.5);
        doc.line(170, 95, 170, 100);
        doc.text('THT', 181 , 98.5);
        doc.line(200, 95, 200, 100);
  var i = 105;
  doc.setFontSize(6);
  for (let j = 0; j < this.dataset.length  ; j++) {
    
    if ((j % 20 == 0) && (j != 0) ) {
doc.addPage();
if (this.domain.dom_name != null) {
  doc.text(this.domain.dom_name, 10, 10);
}
if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
doc.line(10, 32, 200, 32);
doc.text( 'RC : ' + this.domain.dom_rc + "          NIF : " + this.domain.dom_nif +  "          AI : " + this.domain.dom_ai  , 60, 37);
doc.line(10, 40, 200, 40);
doc.setFontSize(12);
  doc.setFontSize(12);
  doc.text( 'Bon Commande N° : ' + nbr  , 70, 50);
  doc.setFontSize(8);
  
  doc.text('Code Fournisseur : ' + this.provider.ad_addr, 20 , 60 )
  doc.text('Nom             : ' + this.provider.ad_name, 20 , 65)
  doc.text('Adresse       : ' + this.provider.ad_line1, 20 , 70)
  if (this.provider.ad_misc2_id != null) {doc.text('MF          : ' + this.provider.ad_misc2_id, 20 , 75)}
      if (this.provider.ad_gst_id != null) {doc.text('RC          : ' + this.provider.ad_gst_id, 20 , 80)}
      if (this.provider.ad_pst_id) {doc.text('AI            : ' + this.provider.ad_pst_id, 20 , 85)}
      if (this.provider.ad_misc1_id != null) {doc.text('NIS         : ' + this.provider.ad_misc1_id, 20 , 90)}
 
   
    
      doc.line(10, 95, 200, 95);
      doc.line(10, 100, 200, 100);
      doc.line(10, 95, 10, 100);
      doc.text('LN', 12.5 , 98.5);
      doc.line(20, 95, 20, 100);
      doc.text('Code Article', 22 , 98.5);
      doc.line(60, 95, 60, 100);
      doc.text('Désignation', 67.5 , 98.5);
      doc.line(110, 95, 110, 100);
      doc.text('QTE', 117 , 98.5);
      doc.line(125, 95, 125, 100);
      doc.text('UM', 128 , 98.5);
      doc.line(135, 95, 135, 100);
      doc.text('PU', 138 , 98.5);
      doc.line(150, 95, 150, 100);
      doc.text('TVA', 152 , 98.5);
      doc.line(160, 95, 160, 100);
      doc.text('REM', 162 , 98.5);
      doc.line(170, 95, 170, 100);
      doc.text('THT', 181 , 98.5);
      doc.line(200, 95, 200, 100);
      i = 105;
      doc.setFontSize(6);

    }



    if (this.dataset[j].desc.length > 35) {
      let desc1 = this.dataset[j].desc.substring(35)
      let ind = desc1.indexOf(' ')
      desc1 = this.dataset[j].desc.substring(0, 35  + ind)
      let desc2 = this.dataset[j].desc.substring(35+ind)

      doc.line(10, i - 5, 10, i );
      doc.text(String(("000"+ this.dataset[j].pod_line)).slice(-3), 12.5 , i  - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.dataset[j].pod_part, 22 , i  - 1);
      doc.line(60, i - 5 , 60, i );
      doc.text(desc1, 62 , i  - 1);
      doc.line(110, i - 5, 110, i );
      doc.text( String(Number(this.dataset[j].pod_qty_ord).toFixed(2)), 123 , i  - 1 , { align: 'right' });
      doc.line(125, i - 5 , 125, i );
      doc.text(this.dataset[j].pod_um, 127 , i  - 1);
      doc.line(135, i - 5, 135, i );
      doc.text( String(Number(this.dataset[j].pod_price).toFixed(2)), 148 , i  - 1 , { align: 'right' });
      doc.line(150, i - 5, 150, i );
      doc.text(String(this.dataset[j].pod_taxc) + "%" , 153 , i  - 1);
      doc.line(160, i - 5 , 160, i );
      doc.text(String(Number(this.dataset[j].pod_disc_pct).toFixed(2)) + "%" , 163 , i  - 1);
      doc.line(170, i - 5 , 170, i );
      doc.text(String((this.dataset[j].pod_price *
              ((100 - Number(this.dataset[j].pod_disc_pct)) / 100) *
              this.dataset[j].pod_qty_ord).toFixed(2)), 198 , i  - 1,{ align: 'right' });
      doc.line(200, i-5 , 200, i );
     // doc.line(10, i, 200, i );

      i = i + 5;

      doc.text(desc2, 62 , i  - 1);
      
      doc.line(10, i - 5, 10, i );
      doc.line(20, i - 5, 20, i);
      doc.line(60, i - 5 , 60, i );
      doc.line(110, i - 5, 110, i );
      doc.line(125, i - 5 , 125, i );
      doc.line(135, i - 5, 135, i );
      doc.line(150, i - 5, 150, i );
      doc.line(160, i - 5 , 160, i );
      doc.line(170, i - 5 , 170, i );
      doc.line(200, i-5 , 200, i );
      doc.line(10, i, 200, i );

      i = i + 5 ;
      
    } else {


    
    doc.line(10, i - 5, 10, i );
    doc.text(String(("000"+ this.dataset[j].pod_line)).slice(-3), 12.5 , i  - 1);
    doc.line(20, i - 5, 20, i);
    doc.text(this.dataset[j].pod_part, 22 , i  - 1);
    doc.line(60, i - 5 , 60, i );
    doc.text(this.dataset[j].desc, 62 , i  - 1);
    doc.line(110, i - 5, 110, i );
    doc.text( String(Number(this.dataset[j].pod_qty_ord).toFixed(2)), 123 , i  - 1 , { align: 'right' });
    doc.line(125, i - 5 , 125, i );
    doc.text(this.dataset[j].pod_um, 127 , i  - 1);
    doc.line(135, i - 5, 135, i );
    doc.text( String(Number(this.dataset[j].pod_price).toFixed(2)), 148 , i  - 1 , { align: 'right' });
    doc.line(150, i - 5, 150, i );
    doc.text(String(this.dataset[j].pod_taxc) + "%" , 153 , i  - 1);
    doc.line(160, i - 5 , 160, i );
    doc.text(String(Number(this.dataset[j].pod_disc_pct).toFixed(2)) + "%" , 163 , i  - 1);
    doc.line(170, i - 5 , 170, i );
    doc.text(String((this.dataset[j].pod_price *
      ((100 - Number(this.dataset[j].pod_disc_pct)) / 100) *
      this.dataset[j].pod_qty_ord).toFixed(2)), 198 , i  - 1,{ align: 'right' });
    doc.line(200, i-5 , 200, i );
    doc.line(10, i, 200, i );
    i = i + 5;
    }
  }
  
 // doc.line(10, i - 5, 200, i - 5);

 doc.line(130, i + 7,  200, i + 7  );
 doc.line(130, i + 14, 200, i + 14 );
 doc.line(130, i + 21, 200, i + 21 );
 doc.line(130, i + 28, 200, i + 28 );
 doc.line(130, i + 35, 200, i + 35 );
 doc.line(130, i + 7,  130, i + 35  );
 doc.line(160, i + 7,  160, i + 35  );
 doc.line(200, i + 7,  200, i + 35  );
 doc.setFontSize(10);
 
 doc.text('Total HT', 140 ,  i + 12 , { align: 'left' });
 doc.text('TVA', 140 ,  i + 19 , { align: 'left' });
 doc.text('Timbre', 140 ,  i + 26 , { align: 'left' });
 doc.text('Total TC', 140 ,  i + 33 , { align: 'left' });

 
 doc.text(String(Number(controls.tht.value).toFixed(2)), 198 ,  i + 12 , { align: 'right' });
 doc.text(String(Number(controls.tva.value).toFixed(2)), 198 ,  i + 19 , { align: 'right' });
 doc.text(String(Number(controls.timbre.value).toFixed(2)), 198 ,  i + 26 , { align: 'right' });
 doc.text(String(Number(controls.ttc.value).toFixed(2)), 198 ,  i + 33 , { align: 'right' });

 doc.setFontSize(8);
    let mt = NumberToLetters(
      Number(controls.ttc.value).toFixed(2),this.curr.cu_desc)

      if (mt.length > 95) {
        let mt1 = mt.substring(90)
        let ind = mt1.indexOf(' ')
       
        mt1 = mt.substring(0, 90  + ind)
        let mt2 = mt.substring(90+ind)
   
        doc.text( "Arretée la présente Commande a la somme de : " + mt1  , 20, i + 53)
        doc.text(  mt2  , 20, i + 60)
      } else {
        doc.text( "Arretée la présente Commande a la somme de : " + mt  , 20, i + 53)

      }
    // window.open(doc.output('bloburl'), '_blank');
    //window.open(doc.output('blobUrl'));  // will open a new tab
    doc.save('BC-' + nbr + '.pdf')
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));

  }

}
