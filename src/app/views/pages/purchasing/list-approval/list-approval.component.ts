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

import { RequisitionService,
  SequenceService, } from "../../../../core/erp";
import { RowDetailPreloadComponent } from "../rowDetails/row-details-preload.component";
import { RowDetailViewComponent } from "../rowDetails/rowdetail-view.component";
import { HttpClient } from "@angular/common/http";

import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: 'kt-list-approval',
  templateUrl: './list-approval.component.html',
  styleUrls: ['./list-approval.component.scss']
})
export class ListApprovalComponent implements OnInit {
  requistionServer
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

    // slick grid
    columnDefinitions: Column[] = [];
    gridOptions: GridOption = {};
    dataset: any[] = [];
    gridObj: any;
    gridService: GridService;
    dataView: any;
    angularGrid: AngularGridInstance;
  draggableGroupingPlugin: any;    
  daForm: FormGroup;
  user: any;
  reqid: any;
    constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private requisitionService: RequisitionService,
      private http: HttpClient,
      private daFB: FormBuilder,
      private modalService: NgbModal,
      private seqeuncesService: SequenceService,
    ) {
      this.prepareGrid();
      this.user = JSON.parse(localStorage.getItem('user'))
    }
  
    ngOnInit(): void {}
    angularGridReady(angularGrid: AngularGridInstance) {
      this.angularGrid = angularGrid;
      this.gridObj = angularGrid.slickGrid; // grid object
      this.dataView = angularGrid.dataView;
      this.gridService = angularGrid.gridService;
    }
    
    prepareGrid() {
      this.columnDefinitions = [
        {
          id: "id",
          name: "id",
          field: "req.id",
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
          type: FieldType.string,
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
          name: "status",
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
        {
          id: "edit",
          name: "Approuver",
          field: "id",
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,
          formatter: (row, cell, value, columnDef, dataContext) => {
            // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
            return `
            <a class="btn btn-sm btn-clean btn-icon mr-2" title="Approuver DA">
                 <i class="flaticon2-check-mark"></i>
                 
             </a>
             `;
          },
          minWidth: 50,
          maxWidth: 50,
          // use onCellClick OR grid.onClick.subscribe which you can see down below
          onCellClick: (e: Event, args: OnEventArgs) => {
            this.reqid = args.dataContext.id
            const id = args.dataContext.id
            console.log(this.dataset)
            console.log(args.dataContext.req.rqm_aprv_stat)
            if (args.dataContext.req.rqm_aprv_stat == "0") {
              let element: HTMLElement = document.getElementById(
                "openDaGrid"
              ) as HTMLElement;
              element.click();
            } else {
  
              alert("Demande deja approuvee")
            }
        },
        },
      ];
  
      this.gridOptions = {
        enableSorting: true,
        enableCellNavigation: true,
        enableExcelCopyBuffer: true,
        enableFiltering: true,
        autoEdit: false,
        autoHeight: true,
        presets: {
        sorters: [
          { columnId: 'rqm_req_date', direction: 'ASC' }
        ],
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
        enableRowDetailView: true,
        rowSelectionOptions: {
          selectActiveRow: true,
        },
        rowDetailView: {
          // We can load the "process" asynchronously in 2 different ways (httpClient OR even Promise)
          process: (item) => {
            console.log(this.simulateServerAsyncCall(item));
            return this.simulateServerAsyncCall(item);
          },
  
          // load only once and reuse the same item detail without calling process method
          loadOnce: false,
  
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
      };
  
      // fill the dataset with your data
      this.dataset = [];
      this.requisitionService.getAllApp().subscribe(
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

    openchange(content) {
      // this.prepareGridvend();
      console.log("this.reqid",this.reqid)
      this.requisitionService.findBy({id: this.reqid }).subscribe(
        (res: any) => {
            const { requisition, details } = res.data
            console.log(res.data)
            this.requistionServer = requisition
           // this.dataset = details
      this.createForm();
       this.modalService.open(content, { size: "md" });
        })
     }
   
     createForm() {
       
    
      this.daForm = this.daFB.group({
  
        appr : ['0']
      
          
      })
  }
  onSubmit() {
   // this.hasFormErrors = false
    const controls = this.daForm.controls
    /** check form */
    
   
    let value = ''
    const appr = controls.appr.value
    const {sequence:{seq_appr1,seq_appr2,seq_appr3, seq_appr1_lev,seq_appr2_lev,seq_appr3_lev},rqm_aprv_stat} = this.requistionServer

    if(appr=='1'){
        const {usrd_code} = this.user
        if(usrd_code == seq_appr1) value = seq_appr1_lev
        if(usrd_code == seq_appr2) value = seq_appr2_lev
        if(usrd_code == seq_appr3) value = seq_appr3_lev

    }
    if(appr=='2'){
        value = '-1'
    }
    if(appr=='3'){
        if(rqm_aprv_stat == seq_appr2_lev) value = seq_appr1_lev
        if(rqm_aprv_stat == seq_appr3_lev) value = seq_appr2_lev
    }
    console.log("value",value)
    this.requisitionService
        .update({ rqm_aprv_stat: value }, this.requistionServer.id)
        .subscribe(
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
                  "Demande Approuvée avec succès",
                  MessageType.Create,
                  10000,
                  true,
                  true
              )
              this.loadingSubject.next(false)
              window.location.reload();
              //  this.router.navigateByUrl("/purchasing/list-approval")
            
          }
         
        )
}

  }
  