import { Component, OnInit } from "@angular/core";
// Angular slickgrid
import {
  Formatter,
  Editor,
  Editors,
  OnEventArgs,
  AngularGridInstance,
  Aggregators,
  Column,
  DelimiterType,
  FieldType,
  FileType,
  Filters,
  Formatters,
  FlatpickrOption,
  GridService,
  GridOption,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
  ColumnFilter,
  Filter,
  FilterArguments,
  FilterCallback,
  MultipleSelectOption,
  OperatorType,
  OperatorString,
  SearchTerm,
  
} from "angular-slickgrid"
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

import { PurchaseOrderService, SiteService,AddressService, ConfigService } from "../../../../core/erp";
import { RowDetailViewPoComponent } from "../rowDetails/rowdetail-view-po.component";
import { RowDetailPreloadComponent } from '../rowDetails/row-details-preload.component';
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { round } from 'lodash';
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>{
  if (value=="V"){
    return `<div class="text"  aria-hidden="Validé">Validé</div>`
  }
  if (value=="I"){
    return `<div class="text"  aria-hidden="Imprimé">Imprimé</div>`
  }
  if (value=="E"){
    return `<div class="text"  aria-hidden="Envoyé">Envoyé</div>`
  }
  if (value=="X"){
    return `<div class="text"  aria-hidden="Suprimé">Suprimé</div>`
  }
  if (value=="C"){
    return `<div class="text"  aria-hidden="Cloturé">Cloturé</div>`
  }
 
  }
@Component({
  selector: "kt-purchase-order-list",
  templateUrl: "./purchase-order-list.component.html",
  styleUrls: ["./purchase-order-list.component.scss"],
})
export class PurchaseOrderListComponent implements OnInit {


 
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>


  // slick grid
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  dataView: any;
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  user;
  site;
  poForm: FormGroup;
  poedit: any;
  address: any;
  ponbr : any;
  domain;
  podataset: any[] = [];
  puo:any
  cfg_po_threshold : number
  cfg_threshold_user : String
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private poFB: FormBuilder,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private poService: PurchaseOrderService,
    private siteService: SiteService,
    private addressService: AddressService,
    private modalService: NgbModal,
    private configService: ConfigService,
  ) {
    this.configService.getOne( 1 ).subscribe(
      (resp: any) => {
        console.log(resp.data)
        if (resp.data) { 
          this.cfg_po_threshold = resp.data.cfg_po_threshold
          this.cfg_threshold_user=resp.data.cfg_threshold_user
        }
       else {
        this.cfg_po_threshold = 0
        this.cfg_threshold_user=null
       }
        
      })  
  }

  createForm() {
    
    const date = new Date(this.poedit.po_ord_date)
    

    
  
    this.poForm = this.poFB.group({
        po_nbr: [this.poedit.po_nbr],
        po_vend: [{ value: this.poedit.po_vend, disabled: true }],
        name: [{value: this.address.ad_name, disabled: true}],
        po_ord_date: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }],
        po_amt: [this.poedit.po_amt],
        po_stat: [
            { value: this.poedit.po_stat },
        ],
        po_rmks: [{ value: this.poedit.po_rmks, disabled: true }],
        
    })
}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const id = params.id;
console.log("id",id)
      if (id) {
        this.ponbr = id
        this.domain = JSON.parse(localStorage.getItem("domain"));
        this.user =  JSON.parse(localStorage.getItem('user'))
   if (this.user.usrd_site == "*") {this.site = null} else {this.site = this.user.usrd_site }
   this.prepareGrid();
  //  this.setFiltersDefault()
      }
      else {
        this.ponbr=null
        this.domain = JSON.parse(localStorage.getItem("domain"));
        this.user =  JSON.parse(localStorage.getItem('user'))
        if (this.user.usrd_site == "*") {this.site = null} else {this.site = this.user.usrd_site }
        this.prepareGrid();
      }
    })
  }
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
   
  }

  createCode() {
    this.router.navigateByUrl("purchasing/create-po");
  }
  prepareGrid() {
    this.columnDefinitions = [
      {
        id: "edit",
        field: "id",
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: (row, cell, value, columnDef, dataContext) => {
          // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
          return `
               <a class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details">
               <span class="svg-icon svg-icon-md">
                   <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                       height="24px" viewBox="0 0 24 24" version="1.1">
                       <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                           <rect x="0" y="0" width="24" height="24"></rect>
                           <path
                               d="M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z"
                               fill="#000000" fill-rule="nonzero"
                               transform="translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) ">
                           </path>
                           <rect fill="#000000" opacity="0.3" x="5" y="20" width="15" height="2" rx="1"></rect>
                       </g>
                   </svg>
               </span>
           </a>
           `;
        },
        minWidth: 50,
        maxWidth: 50,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id
          console.log(args.dataContext.po.po_stat)
          if( args.dataContext.po.po_stat == "P" || args.dataContext.po.po_stat == null) {
          this.router.navigateByUrl(`/purchasing/edit-po/${id}`)
          }
          else {
            alert("Modification Impossible pour ce Status")
          }
        },
      },

      {
        id: "po_nbr",
        name: "Code",
        field: "po.po_nbr",
        minWidth: 80,
        maxWidth: 100,
        sortable:true,
        selectable: true,
        filterable: true,
      },
      {
        id: "po_vend",
        name: "Fournisseur",
        field: "po.po_vend",
        sortable: true,
        type: FieldType.string,
        filterable: true,
        filter: { model: Filters.compoundInputText },
        // filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
      },
      {
        id: "ad_name",
        name: "Nom ",
        field: "po.address.ad_name",
        sortable: true,
        type: FieldType.string,
        filterable: true,
        filter: { model: Filters.compoundInputText },
      },

      {
        id: "po_ord_date",
        name: "Date de creation",
        field: "po.po_ord_date",
        sortable: true,
    
        filterable: true,
        type: FieldType.dateIso,
      },
      {
        id: "po_stat",
        name: "Status",
        field: "po.po_stat",
        sortable: true,
        
        filterable: true,
        type: FieldType.string,
       formatter:myCustomCheckboxFormatter,
        filter: {
           collection: [ { value: '', label: '' }, { value: 'V', label: 'Validé' }, { value: 'I', label: 'Imprimé' }, { value: 'E', label: 'Envoyé' }, { value: 'X', label: 'Suprimé' }, { value: 'C', label: 'Cloturé' } ],
           model: Filters.multipleSelect,
    
           placeholder: 'choisir une option'
       }
      },
      {
        id: "po_amt",
        name: "Montant",
        field: "po.po_amt",
        sortable: true,
        
        filterable: true,
        type: FieldType.float,
        
        formatter:Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2, exportWithFormatter: true }, 
        headerCssClass: 'text-right',
        cssClass: 'text-right'
      },

      {
        id: "change",
        name: "Changer Status",
        field: "id",
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
       // formatter: Formatters.editIcon,
        formatter: (row, cell, value, columnDef, dataContext) => {
          // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
          return `
               <a class="btn btn-sm btn-clean btn-icon mr-2" title="Changer Status">
               <i class="flaticon2-pen"></i>
           </a>
           `;
        },
        minWidth: 50,
        maxWidth: 50,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (e: Event, args: OnEventArgs) => {
           const id = args.dataContext.id
           console.log(args.dataContext.po.po_stat)
           this.poService.getOne(id).subscribe(
            (respo: any) => {this.poedit = respo.data.purchaseOrder
              this.addressService.getBy({ad_addr: this.poedit.po_vend}).subscribe(
                (resp: any) => {this.address = resp.data[0]
                  console.log(this.address)
                  console.log(this.poedit)
          // if( args.dataContext.po.po_stat == "V" ||  args.dataContext.po.po_stat == "P" || args.dataContext.po.po_stat == null) {
          // this.router.navigateByUrl(`/purchasing/edit-po/${id}`)
          let element: HTMLElement = document.getElementById(
            "openVendsGrid"
          ) as HTMLElement;
          element.click();
          // }
          // else {
          //   alert("Modification Impossible pour ce Status")
          // }
            })
          })
        },
      },

      {
        id: "rct",
        name: "Réceptioner",
        field: "id",
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        
          //formatter: Formatters.editIcon,
          formatter: (row, cell, value, columnDef, dataContext) => {
            // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
            return `
            <a class="btn btn-sm btn-clean btn-icon mr-2" title="Réceptioner">
            <i class="flaticon2-arrow-up"></i>
        </a>
             `;
          },
        
        minWidth: 50,
        maxWidth: 80,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (e: Event, args: OnEventArgs) => {
           const id = args.dataContext.id
           console.log(args.dataContext.po.po_stat)
           if(args.dataContext.po.po_stat != 'V') { 
            alert("Bon de Commande doit etre Validé")
           } else {
           this.router.navigateByUrl(`/inventory-transaction/po-receip-id/${id}`)}
        },
      },
      {
        id: "rctcab",
        name: "Réceptioner CAB",
        field: "id",
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        
          //formatter: Formatters.editIcon,
          formatter: (row, cell, value, columnDef, dataContext) => {
            // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
            return `
            <a class="btn btn-sm btn-clean btn-icon mr-2" title="Réceptionner CAB">
            <i class="flaticon2-arrow-up"></i>
        </a>
             `;
          },
        
        minWidth: 50,
        maxWidth: 80,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (e: Event, args: OnEventArgs) => {
           const id = args.dataContext.id
           console.log(args.dataContext.po.po_stat)
           if(args.dataContext.po.po_stat != 'V') { 
            alert("Bon de Commande doit etre Validé")
           } else
                {  this.router.navigateByUrl(`/inventory-transaction/po-receip-cab-id/${id}`) }
        },
      },
      {
        id: "print",
        name: "Impression",
        field: "id",
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        
          //formatter: Formatters.editIcon,
          formatter: (row, cell, value, columnDef, dataContext) => {
            // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
            return `
            <a class="btn btn-sm btn-clean btn-icon mr-2" title="Impression BC">
            <i class="flaticon2-printer"></i>
        </a>
             `;
          },
        
        minWidth: 50,
        maxWidth: 80,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (e: Event, args: OnEventArgs) => {
           const id = args.dataContext.id
           
           
          // alert("print")
          this.poService
          .findBy({ po_nbr: args.dataContext.po.po_nbr })
          .subscribe( (res:any) => {
              console.log(res.data)
              this.puo = res.data.purchaseOrder
              this.podataset = res.data.details
              console.log(this.puo.po_nbr)
            this.printpdf()
          })
  
        },
      },
    ];

    this.gridOptions = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      
      autoEdit: false,
      enableAutoResize:true,
      autoFitColumnsOnFirstLoad: false,
      enableAutoSizeColumns: false,
      // then enable resize by content with these 2 flags
      autosizeColumnsByCellContentOnFirstLoad: true,
      enableAutoResizeColumnsByCellContent: true,
      //rowHeight: 500,
      dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
        var val = undefined;
        try {
          val = eval("item." + column.field);
        } catch (e) {
          // ignore
        }
        return val;
      },
      enableRowDetailView: true,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
      rowDetailView: {
        // We can load the "process" asynchronously in 2 different ways (httpClient OR even Promise)
        process: (item) => {
          return this.simulateServerAsyncCall(item);
        },

        // load only once and reuse the same item detail without calling process method
        loadOnce: true,

        // limit expanded row to only 1 at a time
        singleRowExpand: true,

        // false by default, clicking anywhere on the row will open the detail view
        // when set to false, only the "+" icon would open the row detail
        // if you use editor or cell navigation you would want this flag set to false (default)
        useRowClick: false,

        // how many grid rows do we want to use for the row detail panel (this is only set once and will be used for all row detail)
        // also note that the detail view adds an extra 1 row for padding purposes
        // so if you choose 4 panelRows, the display will in fact use 5 rows
        panelRows: 9,

        // you can override the logic for showing (or not) the expand icon
        // for example, display the expand icon only on every 2nd row
        // expandableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1),

        // Preload View Template
        preloadComponent: RowDetailPreloadComponent,

        // ViewModel Template to load when row detail data is ready
        viewComponent: RowDetailViewPoComponent,

        // Optionally pass your Parent Component reference to your Child Component (row detail component)
        parent: this,
        // columnIndexPosition: 1,
      },
      formatterOptions: {
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: true,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
        maxDecimal:2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
      presets: {
        sorters: [
          { columnId: 'po_ord_date', direction: 'DESC' },
         ],
      //    filters: [
      //  { columnId: 'po_nbr', searchTerms: [this.ponbr] }  ,
          
      //   ],
       
      },
     
    };

    // fill the dataset with your data
    this.dataset = [];
    if (this.site== null) {
    this.poService.getAll().subscribe(
      (response: any) => {this.dataset = response.data
        this.dataView.setItems(this.dataset) 
        if(this.ponbr!= null){this.setFiltersDefault()}
        },
      (error) => {
        this.dataset = [];
      },
      () => {}
    );
    }
    else {
      var site = this.site
      this.poService.getBySite({site}).subscribe(
        (response: any) => {this.dataset = response.data
          this.dataView.setItems(this.dataset) 
          
        },
        (error) => {
          this.dataset = [];
        },
        () => {}
      );
      

    }
  }
  simulateServerAsyncCall(item: any) {
    return new Promise((resolve) => {
      const itemDetail = item;
      console.log(itemDetail)
      resolve(itemDetail);
    });
  }


  openchange(contentvend) {
   // this.prepareGridvend();
   this.createForm();
    this.modalService.open(contentvend, { size: "xl" });
  }


  onSubmit() {
    this.hasFormErrors = false
    const controls = this.poForm.controls
    /** check form */
  
   if(Number(controls.po_amt.value) >= Number(this.cfg_po_threshold)) {

          if (this.cfg_threshold_user.indexOf(this.user.usrd_code) !== -1) {
            this.poService
            .update({ po_stat: controls.po_stat.value }, this.poedit.id)
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
                  window.location.reload();
                  // this.router.navigateByUrl(`purchasing/po-list/${this.ponbr}`)
                  // this.router.navigateByUrl("/purchasing/edit-status-po")
                
              }
          )
        } else {
         alert("Montant dépasse le seuil autorisé vous ne pouvez pas Valider ce bon de commande")
        }

   }
   else {
   
          this.poService
              .update({ po_stat: controls.po_stat.value }, this.poedit.id)
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
                    window.location.reload();
                    // this.router.navigateByUrl(`purchasing/po-list/${this.ponbr}`)
                    // this.router.navigateByUrl("/purchasing/edit-status-po")
                  
                }
            )

        }
          //  const url = `/`
            //this.router.navigateByUrl(url, {
              //  relativeTo: this.activatedRoute,
            //})
       // })
}
setFiltersDefault() {
  // we can Set Filters Dynamically (or different filters) afterward through the FilterService
  this.angularGrid.filterService.updateFilters([
    { columnId: 'po_nbr', searchTerms: [this.ponbr] },
   
  ]);
}
printpdf() {
  // const controls = this.totForm.controls 
  // const controlss = this.poForm.controls 
  console.log("pdf")
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
    doc.text( 'Bon Commande N° : ' + this.puo.po_nbr  , 70, 50);
    doc.setFontSize(8);
    
    doc.text('Code Fournisseur : ' + this.puo.address.ad_addr, 20 , 60 )
    doc.text('Nom             : ' + this.puo.address.ad_name, 20 , 65)
    doc.text('Adresse       : ' + this.puo.address.ad_line1, 20 , 70)
    if (this.puo.address.ad_misc2_id != null) {doc.text('MF          : ' + this.puo.address.ad_misc2_id, 20 , 75)}
        if (this.puo.address.ad_gst_id != null) {doc.text('RC          : ' + this.puo.address.ad_gst_id, 20 , 80)}
        if (this.puo.address.ad_pst_id) {doc.text('AI            : ' + this.puo.address.ad_pst_id, 20 , 85)}
        if (this.puo.addressad_misc1_id != null) {doc.text('NIS         : ' + this.puo.address.ad_misc1_id, 20 , 90)}
   
 
    
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
  for (let j = 0; j < this.podataset.length  ; j++) {
    
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
  doc.text( 'Bon Commande N° : ' + this.puo.po_nbr  , 70, 50);
  doc.setFontSize(8);
  
  doc.text('Code Fournisseur : ' + this.puo.address.ad_addr, 20 , 60 )
  doc.text('Nom             : ' + this.puo.address.ad_name, 20 , 65)
  doc.text('Adresse       : ' + this.puo.address.ad_line1, 20 , 70)
  if (this.puo.address.ad_misc2_id != null) {doc.text('MF          : ' + this.puo.address.ad_misc2_id, 20 , 75)}
      if (this.puo.address.ad_gst_id != null) {doc.text('RC          : ' + this.puo.address.ad_gst_id, 20 , 80)}
      if (this.puo.address.ad_pst_id) {doc.text('AI            : ' + this.puo.address.ad_pst_id, 20 , 85)}
      if (this.puo.addressad_misc1_id != null) {doc.text('NIS         : ' + this.puo.address.ad_misc1_id, 20 , 90)}
 
    
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



    if (this.podataset[j].item.pt_desc1.length > 35) {
      let desc1 = this.podataset[j].item.pt_desc1.substring(35)
      let ind = desc1.indexOf(' ')
      desc1 = this.podataset[j].item.pt_desc1.substring(0, 35  + ind)
      let desc2 = this.podataset[j].item.pt_desc1.substring(35+ind)

      doc.line(10, i - 5, 10, i );
      doc.text(String(("000"+ this.podataset[j].pod_line)).slice(-3), 12.5 , i  - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.podataset[j].pod_part, 22 , i  - 1);
      doc.line(60, i - 5 , 60, i );
      doc.text(desc1, 62 , i  - 1);
      doc.line(110, i - 5, 110, i );
      doc.text( String(Number(this.podataset[j].pod_qty_ord).toFixed(2)), 123 , i  - 1 , { align: 'right' });
      doc.line(125, i - 5 , 125, i );
      doc.text(this.podataset[j].pod_um, 127 , i  - 1);
      doc.line(135, i - 5, 135, i );
      doc.text( String(Number(this.podataset[j].pod_price).toFixed(2)), 148 , i  - 1 , { align: 'right' });
      doc.line(150, i - 5, 150, i );
      doc.text(String(this.podataset[j].pod_taxc) + "%" , 153 , i  - 1);
      doc.line(160, i - 5 , 160, i );
      doc.text(String(Number(this.podataset[j].pod_disc_pct).toFixed(2)) + "%" , 163 , i  - 1);
      doc.line(170, i - 5 , 170, i );
      doc.text(String((this.podataset[j].pod_price *
              ((100 - Number(this.podataset[j].pod_disc_pct)) / 100) *
              this.podataset[j].pod_qty_ord).toFixed(2)), 198 , i  - 1,{ align: 'right' });
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
    doc.text(String(("000"+ this.podataset[j].pod_line)).slice(-3), 12.5 , i  - 1);
    doc.line(20, i - 5, 20, i);
    doc.text(this.podataset[j].pod_part, 22 , i  - 1);
    doc.line(60, i - 5 , 60, i );
    doc.text(this.podataset[j].item.pt_desc1, 62 , i  - 1);
    doc.line(110, i - 5, 110, i );
    doc.text( String(Number(this.podataset[j].pod_qty_ord).toFixed(2)), 123 , i  - 1 , { align: 'right' });
    doc.line(125, i - 5 , 125, i );
    doc.text(this.podataset[j].pod_um, 127 , i  - 1);
    doc.line(135, i - 5, 135, i );
    doc.text( String(Number(this.podataset[j].pod_price).toFixed(2)), 148 , i  - 1 , { align: 'right' });
    doc.line(150, i - 5, 150, i );
    doc.text(String(this.podataset[j].pod_taxc) + "%" , 153 , i  - 1);
    doc.line(160, i - 5 , 160, i );
    doc.text(String(Number(this.podataset[j].pod_disc_pct).toFixed(2)) + "%" , 163 , i  - 1);
    doc.line(170, i - 5 , 170, i );
    doc.text(String((this.podataset[j].pod_price *
      ((100 - Number(this.podataset[j].pod_disc_pct)) / 100) *
      this.podataset[j].pod_qty_ord).toFixed(2)), 198 , i  - 1,{ align: 'right' });
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

 
 doc.text(String(Number(this.puo.po_amt).toFixed(2)), 198 ,  i + 12 , { align: 'right' });
 doc.text(String(Number(this.puo.po_tax_amt).toFixed(2)), 198 ,  i + 19 , { align: 'right' });
 doc.text(String(Number(this.puo.po_trl1_amt).toFixed(2)), 198 ,  i + 26 , { align: 'right' });
 doc.text(String(Number(Number(this.puo.po_amt) + Number(this.puo.po_tax_amt) +Number(this.puo.po_trl1_amt) ).toFixed(2)), 198 ,  i + 33 , { align: 'right' });

 doc.setFontSize(8);
    let mt = NumberToLetters(
      Number(Number(this.puo.po_amt) + Number(this.puo.po_tax_amt) +Number(this.puo.po_trl1_amt)).toFixed(2),'Dinars Algerien')

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
    doc.save('BC-' + this.puo.po_nbr + '.pdf')
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));

  }

}
