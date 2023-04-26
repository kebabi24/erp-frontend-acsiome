import { Component, OnInit } from "@angular/core";
// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Formatters,
  Editor,
  Editors,
  AngularGridInstance,
  GridService,
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

import { PurchaseOrderService, SiteService,AddressService } from "../../../../core/erp";
import { RowDetailViewPoComponent } from "../rowDetails/rowdetail-view-po.component";
import { RowDetailPreloadComponent } from '../rowDetails/row-details-preload.component';
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
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
  ) {
   
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
        
        po_stat: [
            { value: this.poedit.po_stat },
        ],
        po_rmks: [{ value: this.poedit.po_rmks, disabled: true }],
        
    })
}
  ngOnInit(): void {
    this.user =  JSON.parse(localStorage.getItem('user'))
   if (this.user.usrd_site == "*") {this.site = null} else {this.site = this.user.usrd_site }
   this.prepareGrid();
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
          if( args.dataContext.po.po_stat == "V" ||  args.dataContext.po.po_stat == "P" || args.dataContext.po.po_stat == null) {
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
        selectable: true,
      },
      {
        id: "po_vend",
        name: "Fournisseur",
        field: "po.po_vend",
        sortable: true,
        width: 50,
        filterable: false,
      },

      {
        id: "po_ord_date",
        name: "Date de creation",
        field: "po.po_ord_date",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.dateIso,
      },
      {
        id: "po_stat",
        name: "Status",
        field: "po.po_stat",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
      },
      {
        id: "po_site",
        name: "Status",
        field: "po.po_site",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
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
               <svg class="svg-iconkamel" svg-icon-md viewBox="0 0 20 20">
							<path d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"></path>
						</svg>
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
                (resp: any) => {this.address = resp.data
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
                 <a class="btn btn-sm btn-clean btn-icon mr-2" title="Réception">
                 <svg class="svg-iconkamel" svg-icon-md viewBox="0 0 20 20">
							<path d="M17.35,2.219h-5.934c-0.115,0-0.225,0.045-0.307,0.128l-8.762,8.762c-0.171,0.168-0.171,0.443,0,0.611l5.933,5.934c0.167,0.171,0.443,0.169,0.612,0l8.762-8.763c0.083-0.083,0.128-0.192,0.128-0.307V2.651C17.781,2.414,17.587,2.219,17.35,2.219M16.916,8.405l-8.332,8.332l-5.321-5.321l8.333-8.332h5.32V8.405z M13.891,4.367c-0.957,0-1.729,0.772-1.729,1.729c0,0.957,0.771,1.729,1.729,1.729s1.729-0.772,1.729-1.729C15.619,5.14,14.848,4.367,13.891,4.367 M14.502,6.708c-0.326,0.326-0.896,0.326-1.223,0c-0.338-0.342-0.338-0.882,0-1.224c0.342-0.337,0.881-0.337,1.223,0C14.84,5.826,14.84,6.366,14.502,6.708"></path>
						</svg>
             </a>
             `;
          },
        
        minWidth: 50,
        maxWidth: 50,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (e: Event, args: OnEventArgs) => {
           const id = args.dataContext.id
           console.log(args.dataContext.po.po_stat)
           this.router.navigateByUrl(`/inventory-transaction/po-receip-id/${id}`)
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
      },
      presets: {
        sorters: [
          { columnId: 'po_ord_date', direction: 'DESC' },
         ],
      },
    };

    // fill the dataset with your data
    this.dataset = [];
    if (this.site== null) {
    this.poService.getAll().subscribe(
      (response: any) => {this.dataset = response.data
        this.dataView.setItems(this.dataset) },
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
    this.modalService.open(contentvend, { size: "lg" });
  }


  onSubmit() {
    this.hasFormErrors = false
    const controls = this.poForm.controls
    /** check form */
   
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
              // this.router.navigateByUrl("/purchasing/edit-status-po")
            
          }
      )


          //  const url = `/`
            //this.router.navigateByUrl(url, {
              //  relativeTo: this.activatedRoute,
            //})
       // })
}

}
