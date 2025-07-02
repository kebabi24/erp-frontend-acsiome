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

import { RequisitionService, ItemService,
  SequenceService, } from "../../../../core/erp";
import { addDays,addMs } from "@fullcalendar/angular";
import { HttpClient } from "@angular/common/http";

import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>{
  if (value=="-1"){
    return `<div class="text"  aria-hidden="-1">Refusé</div>`
  }
  if (value=="0"){
    return `<div class="text"  aria-hidden="0">Non traité</div>`
  }
  if (value=="1"){
    return `<div class="text"  aria-hidden="1">Validation service</div>`
  }
  if (value=="2"){
    return `<div class="text"  aria-hidden="2">Validation Structure</div>`
  }
  if (value=="3"){
    return `<div class="text"  aria-hidden="3">Validation DRH</div>`
  }
  }
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
  reqpart:any;
  reqdesc:any;
  row_number: any;
  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

    constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private requisitionService: RequisitionService,
      private itemsService: ItemService,
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
      const newCssClassdf = "highlight-df";
      const newCssClassfd = "highlight-fd";
      const newCssClassfc = "highlight-fc";
      const newCssClassdc = "highlight-dc";
      // console.log(this.dataView);
      return (rowNumber: number) => {
        const item = this.dataView.getItem(rowNumber);
        let meta = {
          cssClasses: "",
        };
        if (typeof previousItemMetadata === "object") {
          meta = previousItemMetadata(rowNumber);
        }
        if (meta && item ) {
  
          const state = addMs(new Date(item.emp_last_date),90)
          if (state < new Date()) {
           
            meta.cssClasses = (meta.cssClasses || "") + " " + newCssClassfc;
          }
        }
        if (meta && item && item.pt_phantom ) {
  
          const state = item.pt_phantom;
          const control = item.emp_loyalty
         
          if (state === true && state != control) {
           
            meta.cssClasses = (meta.cssClasses || "") + " " + newCssClassfd;
          }
        }
        if (meta && item && item.rqd_insp_rqd) {
  
          const state = item.rqd_insp_rqd;
         
          if (state === true) {
           
            meta.cssClasses = (meta.cssClasses || "") + " " + newCssClassdf;
          }
        }
       
        if (meta && item ) {
  
          const state = item.emp_conf_date;
         
          if (state != null && state > new Date()) {
           
            meta.cssClasses = (meta.cssClasses || "") + " " + newCssClassdc;
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
        // {
        //   id: "rqd_need_date",
        //   name: "Date Debut",
        //   field: "rqd_need_date",
        //   sortable: true,
        //   filterable: true,
        //   type: FieldType.dateIso,
        // },
        // {
        //   id: "rqd_expire",
        //   name: "Date Fin",
        //   field: "rqd_expire",
        //   sortable: true,
        //   filterable: true,
        //   type: FieldType.dateIso,
        // },
        {
          id: "chr02",
          name: "Periode",
          field: "chr02",
          sortable: true,
          filterable: true,
          type: FieldType.string,
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
          id: "mvid",
          name: "Article",
          field: "cmvid",
          excludeFromHeaderMenu: true,
          formatter: Formatters.infoIcon,
          minWidth: 30,
          maxWidth: 30,
          onCellClick: (e: Event, args: OnEventArgs) => {
           
              this.row_number = args.row;
              let element: HTMLElement = document.getElementById("openItemsGrid") as HTMLElement;
              element.click();
            
          },
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
          name: "Deja Faite",
          field: "rqd_insp_rqd",
          sortable: true,
          filterable: true,
          type: FieldType.boolean,
          formatter: Formatters.checkmark,
        },
        
        {
          id: "pt_phantom",
          name: "Necessite Contrat de Fidelité",
          field: "pt_phantom",
          sortable: true,
          filterable: true,
          type: FieldType.boolean,
          formatter: Formatters.checkmark,
        },
        {
          id: "emp_loyalty",
          name: "Contrat de fidelité employé",
          field: "emp_loyalty",
          sortable: true,
          filterable: true,
          type: FieldType.boolean,
          formatter: Formatters.checkmark,
        },
        {
          id: "emp_last_date",
          name: "Fin Contrat",
          field: "emp_last_date",
          sortable: true,
          filterable: true,
          type: FieldType.date,
          
        },
        {
          id: "emp_conf_date",
          name: "Date Confirmation",
          field: "emp_conf_date",
          sortable: true,
          filterable: true,
          type: FieldType.date,
         
        },
        
        {
          id: "rqd_aprv_stat",
          name: "Approbation",
          field: "rqd_aprv_stat",
          sortable: true,
          filterable: true,
          type: FieldType.string,
          formatter: myCustomCheckboxFormatter,
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
          id: "chr03",
          name: "Observation",
          field: "chr03",
          sortable: true,
          filterable: true,
          type: FieldType.string,
          editor: {
            model: Editors.longText,
          },
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
            this.reqpart = args.dataContext.rqd_part
            this.reqdesc = args.dataContext.rqd_desc
            
            const id = args.dataContext.id
            console.log(this.dataset)
            console.log(args.dataContext.rqd_aprv_stat)
            
              let element: HTMLElement = document.getElementById(
                "openDaGrid"
              ) as HTMLElement;
              element.click();
            
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
        editable:true,
        rowHeight: 40,
        rowSelectionOptions: {
          selectActiveRow: true,
        },
        
      };
  
      // fill the dataset with your data
      this.dataset = [];
      this.requisitionService.getAllAppDet().subscribe(
        (response: any) => {this.dataset = response.data
        this.dataView.setItems(this.dataset)
        },
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
        .updaterqd({ rqd_aprv_stat: value,rqd_part:this.reqpart,rqd_desc:this.reqdesc }, this.reqid)
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
handleSelectedRowsChanged4(e, args) {
  let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObj4) {
    args.rows.map((idx) => {
      const item = this.gridObj4.getDataItem(idx);
      console.log(item);

      
          updateItem.rqd_part = item.pt_part;
          updateItem.rqd_desc = item.pt_desc1;
          this.gridService.updateItem(updateItem);
        });
        //});
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
  
  
    this.itemsService.getAll().subscribe((response: any) => (this.items = response.data));
  
}
open4(content) {
  this.prepareGrid4();
  this.modalService.open(content, { size: "lg" });
}
createsession() {
  this.loadingSubject.next(false)
  const url = `/training/create-training-session`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
listesession() {
  this.loadingSubject.next(false)
  const url = `/training/create-req-training`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
  }
  