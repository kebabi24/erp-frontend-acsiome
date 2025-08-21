import { Component, OnInit } from "@angular/core";
// Angular slickgrid
import {
  Column,
  GridOption,
  GridService,
  AngularGridInstance,
  Formatter,
  Formatters,
  Editor,
  Editors,
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

import { RequisitionService } from "../../../../core/erp";
import { RowDetailPreloadComponent } from "../rowDetails/row-details-preload.component";
import { RowDetailViewComponent } from "../rowDetails/rowdetail-view.component";
import { HttpClient } from "@angular/common/http";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap"
@Component({
  selector: 'kt-list-req-user',
  templateUrl: './list-req-user.component.html',
  styleUrls: ['./list-req-user.component.scss']
})
export class ListReqUserComponent implements OnInit {
  loadingSubject = new BehaviorSubject<boolean>(true)
   // slick grid
   columnDefinitions: Column[] = [];
   gridOptions: GridOption = {};
   dataset: any[] = [];
   gridObj: any;
   gridService: GridService;
   dataView: any;
   angularGrid: AngularGridInstance;
 draggableGroupingPlugin: any;    
 idreq:any
   constructor(
     private activatedRoute: ActivatedRoute,
     private router: Router,
     public dialog: MatDialog,
     private layoutUtilsService: LayoutUtilsService,
     private requisitionService: RequisitionService,
     private http: HttpClient,
     private modalService: NgbModal,
   ) {
     this.prepareGrid();
   }
 
   ngOnInit(): void {}
   angularGridReady(angularGrid: AngularGridInstance) {
     this.angularGrid = angularGrid;
     this.gridObj = angularGrid.slickGrid; // grid object
     this.dataView = angularGrid.dataView;
     this.gridService = angularGrid.gridService;
   }
   createCode() {
     this.router.navigateByUrl("purchasing/create-req");
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
           console.log(this.dataset)
           console.log(args.dataContext.req.rqm_aprv_stat)
           if (args.dataContext.req.rqm_aprv_stat == "0") {
           this.router.navigateByUrl(`/purchasing/edit-requisition/${id}`)
           } else {
 
             alert("Demande deja approuvee")
           }
       },
       },
       {
        id: "delete",
        field: "id",
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: (row, cell, value, columnDef, dataContext) => {
         // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
         return `
              <a class="btn btn-sm btn-clean btn-icon mr-2" title="Suprimer DA">
              <i class="flaticon-delete
              "></i>
          </a>
          `;
       },
        minWidth: 50,
        maxWidth: 50,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id
          console.log(id)
          console.log(args.dataContext.req.rqm_aprv_stat)
          if (args.dataContext.req.rqm_aprv_stat == "0") {
            this.idreq = args.dataContext.req.rqm_nbr
            console.log(this.idreq)
            let element: HTMLElement = document.getElementById('deleteDAGrid') as HTMLElement;
            element.click();
          } else {

            alert("Demande deja approuvee")
          }
      },
      },
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
         field: "req.rqm_category",
         sortable: true,
         filterable: true,
         type: FieldType.string,
       },
       {
         id: "rqm_nbr",
         name: "N° Demande",
         field: "req.rqm_nbr",
         sortable: true,
         filterable: true,
         type: FieldType.string,
       },
       {
         id: "seq_desc",
         name: "Description",
         field: "req.sequence.seq_desc",
         sortable: true,
         filterable: true,
         type: FieldType.string,
       },
       {
         id: "rqm_req_date",
         name: "Date",
         field: "req.rqm_req_date",
         sortable: true,
         filterable: true,
         type: FieldType.date,
       },
       {
        id: "rqm_vend",
        name: "Fournisseur",
        field: "req.rqm_vend",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
       {
        id: "chr01",
        name: "Nom Fournisseur",
        field: "req.chr01",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
       {
         id: "rqm_status",
         name: "Status",
         field: "req.rqm_status",
         sortable: true,
         filterable: true,
         type: FieldType.string,
       },
       {
         id: "rqm_aprv_stat",
         name: "Approbation",
         field: "req.rqm_aprv_stat",
         sortable: true,
         filterable: true,
         type: FieldType.string,
       },
       {
         id: "created_by",
         name: "Utilisateur",
         field: "req.created_by",
         sortable: true,
         filterable: true,
         type: FieldType.string,
       },
       {
        id: "chr04",
        name: "Service",
        field: "req.chr04",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
       {
         id: "rqm_rqby_userid",
         name: "Demandeur",
         field: "req.rqm_rqby_userid",
         sortable: true,
         filterable: true,
         type: FieldType.string,
       },
       {
        id: "chr02",
        name: "Nom Demandeur",
        field: "req.chr02",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
     ];
 
     this.gridOptions = {
       enableSorting: true,
       enableCellNavigation: true,
       enableExcelCopyBuffer: true,
       enableFiltering: true,
       autoEdit: false,
       autoHeight: true,
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
           // console.log(this.simulateServerAsyncCall(item));
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
         viewComponent: RowDetailViewComponent,
 
         // Optionally pass your Parent Component reference to your Child Component (row detail component)
         parent: this,
       },
       presets: {
        sorters: [
          { columnId: 'rqm_req_date', direction: 'DESC' },
         ],
      //    filters: [
      //  { columnId: 'po_nbr', searchTerms: [this.ponbr] }  ,
          
      //   ],
       
      },
     };
 
     // fill the dataset with your data
     this.dataset = [];
     this.requisitionService.getAllUser().subscribe(
       (response: any) => {this.dataset = response.data
         console.log(this.dataset)
       this.dataView.setItems(this.dataset)},
       (error) => {
         this.dataset = [];
       },
       () => {}
     );
   }
   simulateServerAsyncCall(item: any) {
     return new Promise((resolve) => {
       const itemDetail = item;
       resolve(itemDetail);
     });
   }

   open(content) {
    this.modalService.open(content, { size: "lg" })
}
deleteDA() {
  this.requisitionService.delete( this.idreq ).subscribe(
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
        this.modalService.dismissAll()
        window.location.reload()
    }
)
}
 }
 