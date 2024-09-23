import { Component, OnInit , ViewEncapsulation} from "@angular/core";
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

import { HttpClient } from "@angular/common/http";

import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: 'kt-approval-req',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './approval-req.component.html',
  styleUrls: ['./approval-req.component.scss']
})
export class ApprovalReqComponent implements OnInit {

  requistionServer
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

    // slick grid
    columnDefinitions: Column[] = [];
    gridOptions: GridOption = {};
    dataset: any[] = [];
    grid: any;
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
     // this.gridObj = angularGrid.slickGrid; // grid object
      this.grid    = angularGrid.slickGrid;
      this.dataView = angularGrid.dataView;
      this.gridService = angularGrid.gridService;
      this.dataView.getItemMetadata = this.updateItemMetadata(this.dataView.getItemMetadata);
      this.grid.invalidate();
      this.grid.render();
    }
    updateItemMetadata(previousItemMetadata: any) {
      const newCssClass = "highlight-bg";
      // console.log(this.dataView);
      return (rowNumber: number) => {
        const item = this.dataView.getItem(rowNumber);
        let meta = {
          cssClasses: "",
        };
        if (typeof previousItemMetadata === "object") {
          meta = previousItemMetadata(rowNumber);
        }
  
       
        if (meta && item && item.rqd_insp_rqd) {
  
          const state = item.rqd_insp_rqd;
         
          if (state === true) {
           
            meta.cssClasses = (meta.cssClasses || "") + " " + newCssClass;
          }
        }
  
        return meta;
      };
    }
    prepareGrid() {
      this.columnDefinitions = [
        // {
        //   id: "id",
        //   name: "id",
        //   field: "id",
        //   sortable: true,
        //   filterable: true,
        // },
        
        {
          id: "rqd_nbr",
          name: "N° Demande",
          field: "rqd_nbr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "rqd_need_date",
          name: "Date Debut",
          field: "rqd_need_date",
          sortable: true,
          filterable: true,
          type: FieldType.dateIso,
        },
        {
          id: "rqd_expire",
          name: "Date Fin",
          field: "rqd_expire",
          sortable: true,
          filterable: true,
          type: FieldType.dateIso,
        },
        {
          id: "rqd_part",
          name: "Code Formation",
          field: "rqd_part",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "rqd_desc",
          name: "Designation",
          field: "rqd_desc",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        
        {
          id: "rqd_insp_rqd",
          name: "Deja Faire",
          field: "rqd_insp_rqd",
          sortable: true,
          filterable: true,
          type: FieldType.boolean,
          formatter: Formatters.checkmark,
        },
        {
          id: "rqd_aprv_stat",
          name: "Approbation",
          field: "rqd_aprv_stat",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "rqd_rqby_userid",
          name: "Demandeur",
          field: "rqd_rqby_userid",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "chr01",
          name: "Nom Et Prénom",
          field: "chr01",
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
         
          // use onCellClick OR grid.onClick.subscribe which you can see down below
          onCellClick: (e: Event, args: OnEventArgs) => {
            this.reqid = args.dataContext.id
            const id = args.dataContext.id
            console.log(this.dataset)
            console.log(args.dataContext.rqd_aprv_stat)
            if (args.dataContext.rqd_aprv_stat == "0") {
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
        autoHeight: false,
        enableAutoResize:true,
        rowHeight: 40,
        rowSelectionOptions: {
          selectActiveRow: true,
        },
        
      };
  
      // fill the dataset with your data
      this.dataset = [];
      this.requisitionService.getAllAppDet().subscribe(
        (response: any) => {this.dataset = response.data
        this.dataView.setItems(this.dataset)},
        (error) => {
          this.dataset = [];
        },
        () => {}
      );
    }
    
    openchange(content) {
      // this.prepareGridvend();
      
      this.requisitionService.findByDet({id: this.reqid }).subscribe(
        (res: any) => {
            //const { requisition } = res.data.requisition
            this.requistionServer = res.data
      this.createForm();
       this.modalService.open(content, { size: "lg" });
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
    console.log(this.requistionServer)
    const {seq_appr1,seq_appr2,seq_appr3, seq_appr1_lev,seq_appr2_lev,seq_appr3_lev} = this.requistionServer.sequence
    console.log(seq_appr1)
    const rqd_aprv_stat =this.requistionServer.requisition.rqd_aprv_stat
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
        if(rqd_aprv_stat == seq_appr2_lev) value = seq_appr1_lev
        if(rqd_aprv_stat == seq_appr3_lev) value = seq_appr2_lev
    }
    console.log(value)
    this.requisitionService
        .updaterqd({ rqd_aprv_stat: value }, this.reqid)
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
              this.reset()
               this.router.navigateByUrl("/training/approval-req")
            
          }
         
        )
}

reset(){
  this.dataset = [];
  this.requisitionService.getAllAppDet().subscribe(
    (response: any) => {this.dataset = response.data
    this.dataView.setItems(this.dataset)},
    (error) => {
      this.dataset = [];
    },
    () => {}
  );
 
}
  }
  