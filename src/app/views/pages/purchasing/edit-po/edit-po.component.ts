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
import {
    PurchaseOrder,
    PurchaseOrderService,
    ProviderService,
    UsersService,
    AddressService,
    ItemService,
    RequisitionService,
    SequenceService,
    VendorProposalService,
    TaxeService,
    DeviseService,
    VendorProposal,
    CodeService,
    SiteService,
    LocationService,
    MesureService,
    EmployeService,
} from "../../../../core/erp"
import { round } from 'lodash';
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Console } from "console";

@Component({
  selector: 'kt-edit-po',
  templateUrl: './edit-po.component.html',
  styleUrls: ['./edit-po.component.scss']
})
export class EditPoComponent implements OnInit {

  purchaseOrder: PurchaseOrder
  poForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

  angularGrid: AngularGridInstance
  grid: any
  gridService: GridService
  dataView: any
  columnDefinitions: Column[]
  gridOptions: GridOption
  dataset: any[]

  pos: []
  columnDefinitions5: Column[] = []
  gridOptions5: GridOption = {}
  gridObj5: any
  angularGrid5: AngularGridInstance

  items: []
  columnDefinitions4: Column[] = []
  gridOptions4: GridOption = {}
  gridObj4: any
  angularGrid4: AngularGridInstance

  row_number
  message = ""
  poServer
 provider: any
  res : any
  user;
  orddate: any;
  duedate: any;
  poEdit: any;
  addressEdit: any;
  title: String = "Modifier BC - "
  site:String;
  datasetPrint = [];
  date: String;
  po_cr_terms: any[] = [];
  domain : any;
  totForm: FormGroup;

  ums: [];
  columnDefinitionsum: Column[] = [];
  gridOptionsum: GridOption = {};
  gridObjum: any;
  angularGridum: AngularGridInstance;

  error = false;
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
  requistionServer;
  vpServer;
  curr
  users: [];
  columnDefinitions3: Column[] = [];
  gridOptions3: GridOption = {};
  gridObj3: any;
  angularGrid3: AngularGridInstance;
  constructor(
      config: NgbDropdownConfig,
      private poFB: FormBuilder,
      private totFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private modalService: NgbModal,
      private layoutUtilsService: LayoutUtilsService,
      private purchaseOrderService: PurchaseOrderService,
      private providersService: ProviderService,
      private userService: UsersService,
      private addressService: AddressService,
      private itemsService: ItemService,
      private codeService: CodeService,
      private deviseService: DeviseService,
      private siteService: SiteService,
      private locationService: LocationService,
      private mesureService: MesureService,
      private employeService: EmployeService,
      
      private taxService: TaxeService
  ) {
      config.autoClose = true
      this.codeService
      .getBy({ code_fldname: "vd_cr_terms" })
      .subscribe((response: any) => (this.po_cr_terms = response.data));
  }
  gridReady(angularGrid: AngularGridInstance) {
      this.angularGrid = angularGrid
      this.dataView = angularGrid.dataView
      this.grid = angularGrid.slickGrid
      this.gridService = angularGrid.gridService
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
          name: "N demande",
          field: "pod_req_nbr",
          minWidth: 50,
          maxWidth: 50,
          selectable: true,
        },
        {
          id: "pod_part",
          name: "Article",
          field: "pod_part",
          sortable: true,
          width: 50,
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
          width: 80,
          filterable: false,
        },
        {
          id: "pod_qty_ord",
          name: "QTE",
          field: "pod_qty_ord",
          sortable: true,
          width: 80,
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
          width: 80,
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
          width: 80,
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
          width: 40,
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
          width: 80,
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
          width: 80,
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
          width: 80,
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
          width: 80,
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
          width: 80,
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
          width: 80,
          filterable: false,
          
        },  
        {
          id: "pod_taxc",
          name: "taux de taxe",
          field: "pod_taxc",
          sortable: true,
          width: 80,
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
        //autoEdit:true,
        enableColumnPicker: false,
        enableCellNavigation: true,
        enableAutoResize: true,
        enableRowSelection: false,
        autoHeight: true,
        formatterOptions: {
          
          // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
          displayNegativeNumberWithParentheses: false,
    
          // Defaults to undefined, minimum number of decimals
          minDecimal: 2,
          maxDecimal:2,
          
          // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
          thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
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

      this.dataset = []
  }
  ngOnInit(): void {
      
      this.loading$ = this.loadingSubject.asObservable()
      this.loadingSubject.next(false)
  //     this.domain = JSON.parse(localStorage.getItem("domain"));
  //   this.user =  JSON.parse(localStorage.getItem('user'))
  //  if (this.user.usrd_site == "*") {this.site = null} else {this.site = this.user.usrd_site }
  //  console.log(this.site,this.user.usrd_site)
      this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        
        this.purchaseOrderService.getOne(id).subscribe((response: any)=>{
          console.log(response.data.purchaseOrder)
          this.poEdit = response.data.purchaseOrder
        
          this.dataset = response.data.details
          // this.addressService.getBy({ad_addr: this.poEdit.po_vend}).subscribe((res: any)=>{
          //   this.addressEdit = res.data
        
          this.orddate = new Date(this.poEdit.po_ord_date)
          this.duedate = new Date(this.poEdit.po_due_date)
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
         this.title = this.title + this.poEdit.po_nbr
          // })
        })
      })
      //this.createForm()
      this.initGrid()
  }

  initCode() {
    this.createForm()
    this.createtotForm()
    this.loadingSubject.next(false)
}
  //create form
  createForm() {
      this.loadingSubject.next(false)
    
           
      this.poForm = this.poFB.group({
          po_nbr:  [this.poEdit.po_nbr, Validators.required],
          po_vend: [{ value:  this.poEdit.po_vend, disabled: true }],
          // name: [{value: this.addressEdit.ad_name, disabled: true}],
          po_ord_date:[{
            year: this.orddate.getFullYear(),
            month: this.orddate.getMonth() + 1,
            day: this.orddate.getDate() ,
            
          }],
          
          po_stat: [
              { value: this.poEdit.po_stat , disabled: true},
          ],
          po_rmks: [{ value: this.poEdit.po_rmks, disabled: true }],
          
          
         
          po_due_date: [{
            year:this.duedate.getFullYear(),
            month: this.duedate.getMonth()+1,
            day: this.duedate.getDate()
          }],
          
          po_taxable: [this.poEdit.po_taxable],
          po_taxc: [this.poEdit.po_taxc],
          po_buyer: [this.poEdit.po_buyer],
          po_req_id: [this.poEdit.po_req_id],
          po_curr: [this.poEdit.po_curr],
          po_ex_rate: [this.poEdit.po_ex_rate],
          po_ex_rate2: [this.poEdit.po_ex_rate2],
          po_cr_terms: [this.poEdit.po_cr_terms],
          print:[false]
      })
  }
  createtotForm() {
    this.loadingSubject.next(false);
    //this.saleOrder = new SaleOrder();
   // const date = new Date;
    
    this.totForm = this.totFB.group({
  //    so__chr01: [this.saleOrder.so__chr01],
      tht: [{value: this.poEdit.po_amt , disabled: true}],
      tva: [{value: this.poEdit.po_tax_amt , disabled: true}],
      timbre: [{value: this.poEdit.po_trl1_amt , disabled: true}],
      ttc: [{value: Number(this.poEdit.po_amt) + Number(this.poEdit.po_tax_amt) + Number(this.poEdit.po_trl1_amt) , disabled: true}],
    });

    
    

  }
  //reste form
  reset() {
      this.purchaseOrder = new PurchaseOrder()
      this.createForm()
      this.hasFormErrors = false
  }
  // save data
  onSubmit() {
      this.hasFormErrors = false
      const controls = this.poForm.controls
      /** check form */
      if (this.poForm.invalid) {
          Object.keys(controls).forEach((controlName) =>
              controls[controlName].markAsTouched()
          )
          this.message =
              "Modifiez quelques éléments et réessayez de soumettre."
          this.hasFormErrors = true

          return
      }

      if (!this.dataset.length) {
          this.message = "La liste des article ne peut pas etre vide"
          this.hasFormErrors = true

          return
      }
      if (controls.po_cr_terms.value.startsWith("ES" ) && (controls.po_buyer.value == null || controls.po_buyer.value == "" )) {
        this.message = "Acheteur Obligatoire pour le mode Espece"
        this.hasFormErrors = true

        return
    }
      let po = this.preparePo();
      this.addPo(po, this.dataset);
      

            //  const url = `/`
              //this.router.navigateByUrl(url, {
                //  relativeTo: this.activatedRoute,
              //})
         // })
  }


  addPo(_po: any, detail: any) {
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
    }
    this.purchaseOrderService
          .updatedet({ purchaseOrder: _po, detail: this.dataset}, this.poEdit.id)
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
                this.router.navigateByUrl("/purchasing/po-list")
              
            }
        )

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
    
    
    _po.po_amt = controls1.tht.value
    _po.po_tax_amt = controls1.tva.value
    _po.po_trl1_amt = controls1.timbre.value
       
    return _po;
  
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
  handleSelectedRowsChanged3(e, args) {
    const controls = this.poForm.controls;
    if (Array.isArray(args.rows) && this.gridObj3) {
      args.rows.map((idx) => {
        const item = this.gridObj3.getDataItem(idx);
        console.log(item);
        controls.po_buyer.setValue(item.usrd_code || "");
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

  onAlertClose($event) {
      this.hasFormErrors = false
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
    this.itemsService
      .getAll()
      .subscribe((response: any) => (this.items = response.data));
  }
  open4(content) {
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }
  onChangePoNbr() {
      const controls = this.poForm.controls
      const po_nbr = controls.po_nbr.value
      this.purchaseOrderService.findBy({ po_nbr }).subscribe(
          (res: any) => {
              const { purchaseOrder, details } = res.data
              this.poServer = purchaseOrder
              this.dataset = details
              const ad_addr = this.poServer.po_vend;
              console.log(ad_addr)
              this.addressService.getBy({ad_addr: ad_addr}).subscribe((response: any)=>{
                          
                          
                    this.provider = response.data
          
                    controls.name.setValue(this.provider.ad_name);
                
                    controls.po_vend.setValue(purchaseOrder.po_vend)
                    const date = new Date(purchaseOrder.po_ord_date)
                    date.setDate(date.getDate() )

                    controls.po_ord_date.setValue({
                        year: date.getFullYear(),
                        month: date.getMonth() ,
                        day: date.getDate(),
                    })
                  
                    controls.po_stat.setValue(purchaseOrder.po_stat)
                    controls.po_rmks.setValue(purchaseOrder.po_rmks)
              })
            },
          
            (error) => {
              this.message = `BC avec ce numero ${po_nbr} n'existe pas`
              this.hasFormErrors = true
          },
          () => {}
      )
  }
  
  

  handleSelectedRowsChanged5(e, args) {
      const controls = this.poForm.controls
     
      if (Array.isArray(args.rows) && this.gridObj5) {
          args.rows.map((idx) => {
              const item = this.gridObj5.getDataItem(idx)
              
              
              controls.po_nbr.setValue(item.po.po_nbr || "")

              //const controls = this.poForm.controls
              const po_nbr = controls.po_nbr.value
              console.log(po_nbr)
              this.purchaseOrderService.findBy({ po_nbr }).subscribe(
                  (res: any) => {
                      const { purchaseOrder, details } = res.data
                      this.poServer = purchaseOrder
                      this.dataset = details
                      const ad_addr = this.poServer.po_vend;
                      console.log(ad_addr)
                      this.addressService.getBy({ad_addr: ad_addr}).subscribe((response: any)=>{
                                  
                                  
                            this.provider = response.data
                  
                            controls.name.setValue(this.provider.ad_name);
                      
                      controls.po_vend.setValue(purchaseOrder.po_vend)
                    
                    const date = new Date(purchaseOrder.po_ord_date)
                      date.setDate(date.getDate() )

                    controls.po_ord_date.setValue({
                        year: date.getFullYear(),
                        month: date.getMonth() + 1,
                        day: date.getDate(),
                    })
                  
                      controls.po_stat.setValue(purchaseOrder.po_stat)
                      controls.po_rmks.setValue(purchaseOrder.po_rmks)
                    })
                  },
                  (error) => {
                      this.message = `BC avec ce numero ${po_nbr} n'existe pas`
                      this.hasFormErrors = true
                  },
                  () => {}
              )





//                controls.po_rqby_userid.setValue(item.po_rqby_userid || "")
//              controls.po_category.setValue(item.po_category || "")

  //            controls.po_ord_date.setValue({
   //               year: new Date(item.po_ord_date).getFullYear(),
    //              month: new Date(item.po_ord_date).getMonth() + 1,
    //             day: new Date(item.po_ord_date).getDate(),
     //        }|| "")
      //        controls.po_need_date.setValue({
      //            year: new Date(item.po_need_date).getFullYear(),
       //           month: new Date(item.po_need_date).getMonth() + 1,
       //           day: new Date(item.po_need_date).getDate(),
        //      }|| "")
              
       //       controls.po_reason.setValue(item.po_reason || "")
        //      controls.po_status.setValue(item.po_status || "")
         //     controls.po_rmks.setValue(item.po_rmks || "")
          



          })
      }
  }

  angularGridReady5(angularGrid: AngularGridInstance) {
      this.angularGrid5 = angularGrid
      this.gridObj5 = (angularGrid && angularGrid.slickGrid) || {}
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
        field: "po.po_nbr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "po_ord_date",
        name: "Date",
        field: "po.po_ord_date",
        sortable: true,
        filterable: true,
        type: FieldType.date,
      },
      {
        id: "po_vend",
        name: "Fournisseur",
        field: "po.po_vend",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "po_stat",
        name: "status",
        field: "po_stat",
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
    this.purchaseOrderService
      .getAll()
      .subscribe((response: any) => {
        console.log(response.data)
        this.pos = response.data });
      
      
      
    }
  open5(content) {
    this.prepareGrid5();
    this.modalService.open(content, { size: "lg" });
  }
  
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
       if(controlsso.po_cr_terms.value == "ES") { timbre = round((tht + tva) / 100,2);
         if (timbre > 10000) { timbre = 10000} } 
    
     }
   ttc = round(tht + tva + timbre,2)
  console.log(tht,tva,timbre,ttc)
  controls.tht.setValue(tht.toFixed(2));
  controls.tva.setValue(tva.toFixed(2));
  controls.timbre.setValue(timbre.toFixed(2));
  controls.ttc.setValue(ttc.toFixed(2));
  
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
}
