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
  EditorValidator,
  EditorArgs,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators, NgControlStatus } from "@angular/forms";
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
  ItemService,
  AddressService,
  SequenceService,
  InventoryTransaction,
  InventoryTransactionService,
  InventoryStatusService,
  SiteService,  
  LocationService,
  LocationDetailService,
  CostSimulationService,
  CodeService,
  MesureService,
  WorkOrderService,
  Label,
  LabelService,  
  SaleOrderService,
  Daybook,
} from "../../../../core/erp";

const statusValidator: EditorValidator = (value: any, args: EditorArgs) => {
  // you can get the Editor Args which can be helpful, e.g. we can get the Translate Service from it
  const grid = args && args.grid;
  const gridOptions = (grid && grid.getOptions) ? grid.getOptions() : {};
  const translate = gridOptions.i18n;

  // to get the editor object, you'll need to use "internalColumnEditor"
  // don't use "editor" property since that one is what SlickGrid uses internally by it's editor factory
  const columnEditor = args && args.column && args.column.internalColumnEditor;

  if (value == null || value == undefined || !value.length) {
    return { valid: false, msg: 'This is a required field' };
  } 
  return { valid: true, msg: '' };
};

@Component({
  selector: 'kt-worct-entry',
  templateUrl: './worct-entry.component.html',
  styleUrls: ['./worct-entry.component.scss']
})
export class WorctEntryComponent implements OnInit {
  inventoryTransaction: InventoryTransaction;
  trForm: FormGroup;
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
  provider: any;
  
 
  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

  wos: [];
  columnDefinitions5: Column[] = [];
  gridOptions5: GridOption = {};
  gridObj5: any;
  angularGrid5: AngularGridInstance;

 
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
  statuss: [];
  columnDefinitionsstatus: Column[] = [];
  gridOptionsstatus: GridOption = {};
  gridObjstatus: any;
  angularGridstatus: AngularGridInstance;

  ums: [];
  columnDefinitionsum: Column[] = [];
  gridOptionsum: GridOption = {};
  gridObjum: any;
  angularGridum: AngularGridInstance;

  adresses: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;

  user: any
  trlot: string
  row_number;
  message = "";
  prhServer;
  location: any;
  sct: any;
  datasetPrint = [];
  stat: String;
  seq: any;
  woServer;
  umd;
  qtycart;
  uniquelot;
  site;
  loc;
  rctwostat;
  address: any;
  product : any;
  emp_shift: any[] = [];
  constructor(
    config: NgbDropdownConfig,
    private trFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private inventoryTransactionService: InventoryTransactionService,
    private sctService: CostSimulationService,  
    private itemsService: ItemService,
    private siteService: SiteService,
    private addressService: AddressService,
    private locationService: LocationService,
    private locationDetailService: LocationDetailService,
    private codeService: CodeService,
    private mesureService: MesureService,
    private sequenceService: SequenceService,
    private inventoryStatusService : InventoryStatusService,
    private workOrderService: WorkOrderService,
    private labelService: LabelService,
    private saleOrderService : SaleOrderService,
  ) {
    config.autoClose = true;
    this.codeService
    .getBy({ code_fldname: "emp_shift" })
    .subscribe((response: any) => (this.emp_shift = response.data));
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
        id: "tr_line",
        name: "Ligne",
        field: "tr_line",
        minWidth: 50,
        maxWidth: 50,
        selectable: true,
      },
      {
        id: "tr_qty_loc",
        name: "QTE",
        field: "tr_qty_loc",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 }
        },
      },
      {
        id: "tr_um",
        name: "UM",
        field: "tr_um",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
            model: Editors.text,
            required: true,
            validator: statusValidator,

        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.tr_um)
          this.itemsService.getBy({pt_part: args.dataContext.tr_part }).subscribe((resp:any)=>{
            
          if   (args.dataContext.tr_um == resp.data.pt_um )  {
            
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: 1 })
          } else { 
            //console.log(resp.data.pt_um)



              this.mesureService.getBy({um_um: args.dataContext.tr_um, um_alt_um: resp.data.pt_um, um_part: args.dataContext.tr_part  }).subscribe((res:any)=>{
              console.log(res)
              const { data } = res;
    
            if (data) {
              //alert ("Mouvement Interdit Pour ce Status")
              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: res.data.um_conv })
              this.angularGrid.gridService.highlightRow(1, 1500);
            } else {
              this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: args.dataContext.tr_um, um_part: args.dataContext.tr_part  }).subscribe((res:any)=>{
                console.log(res)
                const { data } = res;
                if (data) {
                  //alert ("Mouvement Interdit Pour ce Status")
                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: res.data.um_conv })
                  
                } else {
                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: "1" , tr_um: null});
           
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
      id: "mvidlot",
      field: "cmvidlot",
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
      id: "tr_um_conv",
      name: "Conv UM",
      field: "tr_um_conv",
      sortable: true,
      width: 80,
      filterable: false,
     // editor: {
     //     model: Editors.float,
      //},
      
    },
    
     
      {
        id: "tr_site",
        name: "Site",
        field: "tr_site",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
        const controls = this.trForm.controls
          this.siteService.getByOne({ si_site: args.dataContext.tr_site,}).subscribe(
            (response: any) => {
              
      console.log(response.data)

                if (response.data) {
                  
                    



                    this.sctService.getByOne({ sct_site: response.data.si_site, sct_part: controls.tr_part.value, sct_sim: 'STDCG' }).subscribe(
                      (resp: any) => {
                        this.sct = resp.data
                        this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_site: response.data.si_site, tr_price:this.sct.sct_cst_tot })
                        
                      })

                }
                else {
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  , tr_site: null});
    
                     // this.gridService.onItemUpdated;
                      alert("Site N'existe pas")
                }
          });     
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
        id: "tr_loc",
        name: "Emplacement",
        field: "tr_loc",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.tr_loc)
          
            
            this.locationService.getByOne({ loc_loc: args.dataContext.tr_loc, loc_site: args.dataContext.tr_site }).subscribe(
              (response: any) => {
                this.location = response.data
                if (response.data) {

                    
                        this.inventoryStatusService.getAllDetails({isd_status: this.location.loc_status, isd_tr_type: "RCT-UNP" }).subscribe((resstat:any)=>{
                          console.log(resstat)
                          const { data } = resstat;
  
                          if (data) {
                            this.stat = null
                          } else {
                            this.stat = this.location.loc_status
                          }
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,   tr_status: this.stat})
                        });     
     
                    }
                    else {
                      alert("Emplacement Nexiste pas")
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_loc: null, tr_status: null })
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
        id: "tr_serial",
        name: "Lot/Serie",
        field: "tr_serial",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },  
        onCellChange: (e: Event, args: OnEventArgs) => {
          
          this.locationDetailService.getBy({ld_site: args.dataContext.tr_site, ld_loc: args.dataContext.tr_loc, ld_part: args.dataContext.tr_part, ld_lot: args.dataContext.tr_serial
          } ).subscribe(
            (response: any) => {
              console.log(response.data)
          if (response.data.length != 0) {

            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_status: response.data[0].ld_status, tr_expire: response.data[0].ld_expire })
          

          }


            })     



        },

      },
      
      {
        id: "tr_status",
        name: "Status",
        field: "tr_status",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
          required: true,
          validator: statusValidator,

        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.tr_status)
         
          this.inventoryStatusService.getBy({is_status: args.dataContext.tr_status }).subscribe((ress:any)=>{
            console.log(ress.data.inventoryStatus) 
    if (ress.data.inventoryStatus) {


          this.inventoryStatusService.getAllDetails({isd_status: args.dataContext.tr_status, isd_tr_type: "RCT-WO" }).subscribe((res:any)=>{
          console.log(res)
          const { data } = res;

        if (data) {
          alert ("Mouvement Interdit Pour ce Status")
          this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_status: null })
          
         } else {

          let obj = {}
          obj = {
             ld_site: args.dataContext.tr_site, ld_loc: args.dataContext.tr_loc, ld_part: args.dataContext.tr_part, ld_lot: args.dataContext.tr_serial
            }
            status = args.dataContext.tr_status
          console.log(status)
          this.locationDetailService.getByStatus({obj, status} ).subscribe(
            (response: any) => {
             console.log(response.data.length != 0   )
              if (response.data.length != 0) {
                this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_status: null })
                  alert("lot existe avec un autre status")

              }  else { console.log("here") }



        
      })
        }
  
      })
    } else {

      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_status: null })
      alert("Status N' existe pas")


    }
  })
  }
  
      },
      {
        id: "mvidlot",
        field: "cmvidlot",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
            this.row_number = args.row;
            let element: HTMLElement = document.getElementById(
            "openStatussGrid"
            ) as HTMLElement;
            element.click();
        },
      },
      {
        id: "tr_expire",
        name: "Expire",
        field: "tr_expire",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.dateIso,
        editor: {
          model: Editors.date,
        },
      },
      {
        id: "tr_price",
        name: "Prix unitaire",
        field: "tr_price",
        sortable: true,
        width: 80,
        filterable: false,
        //type: FieldType.float,
       
        formatter: Formatters.decimal,
       
      },
      {
        id: "tr_ref",
        name: "N° PAL",
        field: "tr_ref",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
       
        
       
      },
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: (row, cell, value, columnDef, dataContext) => {
          // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
          return `
          <a class="btn btn-sm btn-clean btn-icon mr-2" title="Impression Etiquette">
               <i class="flaticon2-printer"></i>
               
           </a>
           `;
        },
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          // if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          //   this.angularGrid.gridService.deleteItem(args.dataContext);
          // }
          const controls = this.trForm.controls
         
          if(controls.tr_part.value != null ) {
          const _lb = new Label();
              _lb.lb_site =args.dataContext.tr_site
              _lb.lb_loc = args.dataContext.tr_loc
              _lb.lb_part = controls.tr_part.value
              _lb.lb_nbr = controls.tr_nbr.value
              _lb.lb_lot = args.dataContext.tr_serial
              _lb.lb_date = controls.tr_effdate.value
                  ? `${controls.tr_effdate.value.year}/${controls.tr_effdate.value.month}/${controls.tr_effdate.value.day}`
                  : null
              _lb.lb_qty = args.dataContext.tr_qty_loc
              _lb.lb_ld_status = args.dataContext.tr_status
              _lb.lb_desc = this.product.pt_desc2
              _lb.lb_cust = this.address.ad_addr
              _lb.lb_addr = this.address.ad_line1
              _lb.lb_rmks = controls.emp_shift.value
              _lb.lb_tel  = this.address.ad_phone
              _lb.int01   = this.product.int01
              _lb.int02   = this.product.int02
    
              let lab = null

              this.labelService.addProd(_lb).subscribe(
                (reponse: any) => (lab = reponse.data),
                (error) => {
                 alert("Erreur Impression Etiquette")   },
                () => {
         
                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_ref: lab.lb_ref})
                }
            )
              }
              else {
                alert ("Veuillez verifier les informations")
              }
        },
      },
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      autoHeight:true,
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
    this.createForm();
    this.user =  JSON.parse(localStorage.getItem('user'))
   
    
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.inventoryTransaction = new InventoryTransaction();
    const date = new Date;
    this.trForm = this.trFB.group({
      tr_effdate: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      tr_lot : [this.inventoryTransaction.tr_lot],
      tr_nbr:  [{value: this.inventoryTransaction.tr_nbr,disabled:true}],
     
      tr_part:  [{value:this.inventoryTransaction.tr_part, disabled: true}],
      desc:  [{value:"", disabled: true}],

      tr_so_job: [this.inventoryTransaction.tr_so_job],
      emp_shift: [this.inventoryTransaction.tr_addr],
      
      tr_rmks: [this.inventoryTransaction.tr_rmks],
      });
  }

  onChangeJob() {
  const controls = this.trForm.controls
    if (controls.tr_so_job.value != null && controls.tr_so_job.value != "") {
      this.saleOrderService.getBy({ so_nbr : controls.tr_so_job.value}).subscribe(
        (res: any) => {
        console.log(res.data)
          if (res.data.saleOrder != null) { 
            this.addressService.getBy({ ad_addr : res.data.saleOrder.so_cust}).subscribe(
              (resaddr: any) => {
                console.log(resaddr.data)
                this.address = resaddr.data
                
            })
          }
          else {
            alert("Commande n'existe pas")
            controls.tr_so_job.setValue(null);
            document.getElementById("sojob").focus();
          }  
      })
    } else {
      this.addressService.getBy({ ad_addr : "1000"}).subscribe(
        (resaddr: any) => {
          console.log(resaddr.data)
          this.address = resaddr.data
          
      })
    }  console.log(this.address)
  }
  onChangeOA() {
    this.dataset=[]
    const controls = this.trForm.controls;
    const id = controls.tr_lot.value;
    
    this.workOrderService.getByOne({ id }).subscribe(
      (res: any) => {
      
          if(res.data.wo_status == "R") {      
        this.woServer = res.data;
        
        controls.tr_lot.setValue(this.woServer.id);
        controls.tr_nbr.setValue(this.woServer.wo_nbr);
        controls.tr_part.setValue(this.woServer.wo_part);
        controls.tr_so_job.setValue(this.woServer.wo_so_job)
        controls.desc.setValue(this.woServer.item.pt_desc1)
        this.product = this.woServer.item
        this.umd = this.woServer.item.pt_um
        this.qtycart = (this.woServer.item.int03 != null) ? this.woServer.item.int03 : 0
        this.uniquelot = this.woServer.item.pt_lot_ser
        this.site = this.woServer.item.pt_site
        this.loc = this.woServer.item.pt_loc
        if (this.woServer.item.pt_rctwo_active) { 
          this.rctwostat = this.woServer.item.pt_rctwo_status 
        } else {
          this.locationService
          .getByOne({
                loc_loc: this.loc,
          })
          .subscribe((resp: any) => {
              console.log(resp.data, resp.data.length)
              this.rctwostat = resp.data.loc_status
          })
        
        
        }  
        
        if (this.woServer.wo_so_job != null && this.woServer.wo_so_job != "") {
          this.saleOrderService.getBy({ so_nbr : this.woServer.wo_so_job}).subscribe(
            (res: any) => {
            console.log(res.data)
              if (res.data.saleOrder != null) { 
                this.addressService.getBy({ ad_addr : res.data.saleOrder.so_cust}).subscribe(
                  (resaddr: any) => {
                    console.log(resaddr.data)
                    this.address = resaddr.data
                    
                })
              }
             
          })
        } else {
          this.addressService.getBy({ ad_addr : "1000"}).subscribe(
            (resaddr: any) => {
              console.log(resaddr.data)
              this.address = resaddr.data
              
          })
        }  console.log(this.address)
        console.log(this.site)
        this.sctService.getByOne({ sct_site: this.site, sct_part: this.woServer.wo_part, sct_sim: 'STDCG' }).subscribe(
          (resp: any) => {
            this.sct = resp.data
            console.log(this.sct)
      
      });
          }
          else {

            alert("OF n'existe pas ou status <> 'R' ")
            controls.tr_lot.setValue(null);
            document.getElementById("id").focus();
          }
       
        
      
      });

    
  }

  //reste form
  reset() {
    this.inventoryTransaction = new InventoryTransaction();
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    
    

    this.hasFormErrors = false;
    const controls = this.trForm.controls;
    /** check form */
    if (this.trForm.invalid) {
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
    for (var i = 0; i < this.dataset.length; i++) {
      console.log(this.dataset[i]  )
     if (this.dataset[i].tr_site == "" || this.dataset[i].tr_site == null  ) {
      this.message = "Le Site ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].tr_loc == "" || this.dataset[i].tr_loc == null  ) {
      this.message = "L' Emplacement ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].tr_um == "" || this.dataset[i].tr_um == null  ) {
      this.message = "L' UM ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].tr_status == "" || this.dataset[i].tr_status == null  ) {
      this.message = "Le Status ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].tr_qty_loc == 0 ) {
      this.message = "La Quantite ne peut pas etre 0";
      this.hasFormErrors = true;
      return;
 
     }

    }
  
          let tr = this.prepare()
    this.addIt( this.dataset,tr);
        
      // tslint:disable-next-line:prefer-const
    
    
      
  }

  prepare(){
    const controls = this.trForm.controls;
    const _tr = new InventoryTransaction();
    _tr.tr_nbr = controls.tr_nbr.value
    _tr.tr_lot = controls.tr_lot.value
    _tr.tr_part = controls.tr_part.value
  
    
    _tr.tr_effdate = controls.tr_effdate.value
    ? `${controls.tr_effdate.value.year}/${controls.tr_effdate.value.month}/${controls.tr_effdate.value.day}`
    : null
    _tr.tr_so_job = controls.tr_so_job.value
    
    _tr.tr_rmks = controls.tr_rmks.value
    _tr.tr_addr = controls.emp_shift.value
    return _tr
  }
  /**
   *
   * Returns object for saving
   */
  /**
   * Add po
   *
   * @param _it: it
   */
  addIt( detail: any, it) {
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
    }
    this.loadingSubject.next(true);
    const controls = this.trForm.controls;


    this.inventoryTransactionService
      .addRCTWO({detail, it})
      .subscribe(
       (reponse: any) => console.log(reponse),
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
      //    console.log(this.provider, po, this.dataset);
         
      
          this.router.navigateByUrl("/");
        }
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
    const controls = this.trForm.controls
    const eff_date = `${controls.tr_effdate.value.year}/${controls.tr_effdate.value.month}/${controls.tr_effdate.value.day}`
    const effdate  = new Date(eff_date)
    
    var year     = effdate.getFullYear();
    var month    = effdate.getMonth()+1;
    var day      = effdate.getDate();
    var days : String
    var months : String
    if (day < 9) { days = "0"+ String(day) } else { days =  String(day)}; 
    if (month < 12) { months = "0"+ String(month) } else { months =  String(month)}; 
    
    console.log(days,months,year)
    this.gridService.addItem(
      {
        id: this.dataset.length + 1,
        tr_line: this.dataset.length + 1,
        tr_qty_loc: this.qtycart,
        tr_um: this.umd,
        tr_um_conv: 1,
        tr_price: this.sct.sct_cst_tot,
        tr_site: this.site,
        tr_loc: this.loc,
        tr_ref:null,
        tr_serial: (this.uniquelot == "L") ? `${this.product.pt_article}${this.product.pt_break_cat}${this.product.pt_net_wt}/${days}.${months}.${year}`   : null,
        tr_status: this.rctwostat,
        tr_expire: null,
      },
      { position: "bottom" }
    );
  }
  
  
  onAlertClose($event) {
    this.hasFormErrors = false;
  }





  handleSelectedRowsChangedsite(e, args) {
      let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
      const controls = this.trForm.controls 
      if (Array.isArray(args.rows) && this.gridObjsite) {
        args.rows.map((idx) => {
          const item = this.gridObjsite.getDataItem(idx);
          console.log(item);
  
          this.sctService.getByOne({ sct_site: item.si_site, sct_part: controls.tr_part.value, sct_sim: 'STDCG' }).subscribe(
            (resp: any) => {
              this.sct = resp.data
        
          updateItem.tr_site  = item.si_site;
          updateItem.tr_price = this.sct.sct_cst_tot;
          
          
          this.gridService.updateItem(updateItem);
       
        });
    
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
        checkboxSelector: {},
        multiSelect: false,
        rowSelectionOptions: {
          selectActiveRow: true,
        },
      };
  
      // fill the dataset with your data
      if(this.user.usrd_site == "*") {
        this.siteService
          .getAll()
          .subscribe((response: any) => (this.datasite = response.data));
      }else {
        this.siteService
          .getBy({si_site: this.user.usrd_site})
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
  

          this.locationService.getByOne({ loc_loc: item.loc_loc, loc_site: updateItem.tr_site }).subscribe(
            (response: any) => {
              this.location = response.data
              if (response.data) {

                 
             
                      this.inventoryStatusService.getAllDetails({isd_status: this.location.loc_status, isd_tr_type: "RCT-WO" }).subscribe((resstat:any)=>{
                        console.log(resstat)
                        const { data } = resstat;

                        if (data) {
                          this.stat = null
                        } else {
                          this.stat = this.location.loc_status
                        }
                        
                        updateItem.tr_loc = item.loc_loc
                        updateItem.tr_status = this.stat
                        this.gridService.updateItem(updateItem);
                      });     
   
                    
                  }
                  else {
                    alert("Emplacement Nexiste pas")
                    updateItem.tr_loc = null
                    updateItem.tr_status = null
                    this.gridService.updateItem(updateItem);
                  }
                   
      });
     })
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
        .getBy({ loc_site:  updateItem.tr_site })
        .subscribe((response: any) => (this.dataloc = response.data));
    }
    openloc(contentloc) {
      this.prepareGridloc();
      this.modalService.open(contentloc, { size: "lg" });
    }

    handleSelectedRowsChangedum(e, args) {
      const controls = this.trForm.controls
      let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
      if (Array.isArray(args.rows) && this.gridObjum) {
        args.rows.map((idx) => {
          const item = this.gridObjum.getDataItem(idx);
          updateItem.tr_um = item.code_value;
       
          this.gridService.updateItem(updateItem);

/*********/


        this.itemsService.getBy({pt_part: controls.tr_part.value }).subscribe((resp:any)=>{
                        
          if   (updateItem.tr_um == resp.data.pt_um )  {
            
            updateItem.tr_um_conv = 1
          } else { 
            //console.log(resp.data.pt_um)



              this.mesureService.getBy({um_um: updateItem.tr_um, um_alt_um: resp.data.pt_um, um_part: controls.tr_part.value  }).subscribe((res:any)=>{
              console.log(res)
              const { data } = res;

            if (data) {
              //alert ("Mouvement Interdit Pour ce Status")
              updateItem.tr_um_conv = res.data.um_conv 
              this.angularGrid.gridService.highlightRow(1, 1500);
            } else {
              this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: updateItem.tr_um, um_part: controls.tr_part.value  }).subscribe((res:any)=>{
                console.log(res)
                const { data } = res;
                if (data) {
                  //alert ("Mouvement Interdit Pour ce Status")
                  updateItem.tr_um_conv = res.data.um_conv
                  
                } else {
                  updateItem.tr_um_conv = 1
                  updateItem.tr_um = this.umd
          
                  alert("UM conversion manquante")
                  
                }  
              })

            }
              })

            }
            })


/***********/








        });
      }
    }
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


  handleSelectedRowsChangedstatus(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjstatus) {
      args.rows.map((idx) => {
        const item = this.gridObjstatus.getDataItem(idx);

        this.inventoryStatusService.getAllDetails({isd_status: item.is_status, isd_tr_type: "RCT-WO" }).subscribe((res:any)=>{
          console.log(res)
          const { data } = res;

        if (data) {
          alert ("Mouvement Interdit Pour ce Status")
        }else {
          updateItem.tr_status = item.is_status;
     
          this.gridService.updateItem(updateItem);

        }
          
        })

                });
    }
  }


angularGridReadystatus(angularGrid: AngularGridInstance) {
    this.angularGridstatus = angularGrid
    this.gridObjstatus = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridstatus() {
    this.columnDefinitionsstatus = [
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
        id: "is_status",
        name: "Status",
        field: "is_status",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "is_desc",
        name: "Designation",
        field: "is_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "is_avail",
        name: "Disponible",
        field: "is_avail",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "is_nettable",
        name: "Gerer MRP",
        field: "is_nettable",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "is_overissue",
        name: "Sortie Excedent",
        field: "is_overissue",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
  
  
    ];
  
    this.gridOptionsstatus = {
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
    this.inventoryStatusService
      .getAll()
      .subscribe((response: any) => (this.statuss = response.data));
      console.log(this.statuss)
}
openstatus(content) {
    this.prepareGridstatus()
    this.modalService.open(content, { size: "lg" })
}

handleSelectedRowsChanged2(e, args) {
  const controls = this.trForm.controls;
  if (Array.isArray(args.rows) && this.gridObj2) {
    args.rows.map((idx) => {
      const item = this.gridObj2.getDataItem(idx);
     
      this.provider = item
      controls.tr_addr.setValue(item.ad_addr || "");
     


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
      id: "ad_addr",
      name: "code",
      field: "ad_addr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_name",
      name: "Nom",
      field: "ad_name",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_phone",
      name: "Numero telephone",
      field: "ad_phone",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxable",
      name: "A Taxer",
      field: "ad_taxable",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxc",
      name: "Taxe",
      field: "ad_taxc",
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
  this.addressService
    .getAll()
    .subscribe((response: any) => (this.adresses = response.data));
}
open2(content) {
  this.prepareGrid2();
  this.modalService.open(content, { size: "lg" });
}

handleSelectedRowsChanged5(e, args) {
  const controls = this.trForm.controls;

  this.dataset=[]
  
  if (Array.isArray(args.rows) && this.gridObj5) {
    args.rows.map((idx) => {
      const item = this.gridObj5.getDataItem(idx);
      controls.tr_lot.setValue(item.id || "");
     
      controls.tr_nbr.setValue(item.wo_nbr);
      controls.tr_part.setValue(item.wo_part);
      controls.tr_so_job.setValue(item.wo_so_job)
      controls.desc.setValue(item.item.pt_desc1)
      this.product = item.item
      this.umd = item.item.pt_um
      this.qtycart = (item.item.int03 != null) ? item.item.int03 : 0
      this.uniquelot = item.item.pt_lot_ser
      this.site = item.item.pt_site
      this.loc = item.item.pt_loc
      console.log("item.item.pt_loc",item.item.pt_loc)
      if (item.item.pt_rctwo_active) { 
        this.rctwostat = item.item.pt_rctwo_status 
      } else {
        this.locationService
        .getByOne({
              loc_loc: this.loc,
        })
        .subscribe((resp: any) => {
            console.log(resp.data, resp.data.length)
            this.rctwostat = resp.data.loc_status
        })
      
      
      }  
      
      console.log(this.site)
      this.sctService.getByOne({ sct_site: this.site, sct_part: controls.tr_part.value, sct_sim: 'STDCG' }).subscribe(
        (resp: any) => {
          this.sct = resp.data
          console.log("sct",this.sct)
    
    });
        }
      );



    
  }
  if (controls.tr_so_job.value != null && controls.tr_so_job.value != "") {
    this.saleOrderService.getBy({ so_nbr : controls.tr_so_job.value}).subscribe(
      (res: any) => {
      console.log(res.data)
        if (res.data.saleOrder != null) { 
          this.addressService.getBy({ ad_addr : res.data.saleOrder.so_cust}).subscribe(
            (resaddr: any) => {
              console.log(resaddr.data)
              this.address = resaddr.data
              
          })
        }
       
    })
  } else {
    this.addressService.getBy({ ad_addr : "1000"}).subscribe(
      (resaddr: any) => {
        console.log(resaddr.data)
        this.address = resaddr.data
        
    })
  }  console.log(this.address)
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
      id: "wo_nbr",
      name: "N° OF",
      field: "wo_nbr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "wo_ord_date",
      name: "Date",
      field: "wo_ord_date",
      sortable: true,
      filterable: true,
      type: FieldType.date,
    },
    {
      id: "wo_part",
      name: "Article",
      field: "wo_part",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "wo_status",
      name: "status",
      field: "wo_status",
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
  this.workOrderService
    .getBy({wo_status: "R"})
    .subscribe((response: any) => {
     // console.log(response.data)
      this.wos = response.data });
    
    
    
  }
open5(content) {
  this.prepareGrid5();
  this.modalService.open(content, { size: "lg" });
}
}
