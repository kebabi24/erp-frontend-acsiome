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
  EditorValidator,
  EditorArgs,
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
  
  ItemService,
  WorkOrderDetail,
  WorkOrderDetailService,
  WorkOrderService,
  LocationService,
  SiteService,
  SequenceService,
  LocationDetailService,
  PsService,
  BomService,
  printLp
} from "../../../../core/erp";

import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
@Component({
  selector: 'kt-release-wo',
  templateUrl: './release-wo.component.html',
  styleUrls: ['./release-wo.component.scss']
})
export class ReleaseWoComponent implements OnInit {


  wodForm: FormGroup;
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

  datalocdet: [];
  columnDefinitionslocdet: Column[] = [];
  gridOptionslocdet: GridOption = {};
  gridObjlocdet: any;
  angularGridlocdet: AngularGridInstance;
  ums: [];
  columnDefinitionsum: Column[] = [];
  gridOptionsum: GridOption = {};
  gridObjum: any;
  angularGridum: AngularGridInstance;


  row_number;
  message = "";
  woServer;
  location: any;
  datasetPrint = [];
  seq: any;
  user;
  lpnbr: String;
  stat: String;
  details: any;
  ld: any;
  bom: any;
  domain: any;
  constructor(
    config: NgbDropdownConfig,
    private wodFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private workOrderService: WorkOrderService,
    private workOrderDetailService: WorkOrderDetailService,
    private psService: PsService,
    private itemsService: ItemService,
    private bomService: BomService,
    private locationDetailService: LocationDetailService,
    private sequenceService: SequenceService,

    private locationService: LocationService,
  ) {
    config.autoClose = true;
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
        
      },
     

      {
        id: "wod_line",
        name: "Ligne",
        field: "wod_line",
        minWidth: 50,
        maxWidth: 50,
        selectable: true,
      },
      {
        id: "wod_part",
        name: "Article",
        field: "wod_part",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "desc",
        name: "Description",
        field: "desc",
        sortable: true,
        width: 180,
        filterable: false,
      },
      {
        id: "wod_qty_req",
        name: "QTE Requise",
        field: "wod_qty_req",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        
      },
      {
        id: "wod_um",
        name: "UM",
        field: "wod_um",
        sortable: true,
        width: 80,
        filterable: false,
        
      },

      
      {
        id: "wod_serial",
        name: "Lot/Serie",
        field: "wod_serial",
        sortable: true,
        width: 80,
        filterable: false,
      },
      {
        id: "wod_ref",
        name: "Réference",
        field: "wod_ref",
        sortable: true,
        width: 80,
        filterable: false,
      },
      
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
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
    this.user =  JSON.parse(localStorage.getItem('user'))
    this.domain = JSON.parse(localStorage.getItem("domain"));
    this.createForm();
    
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    
    const date = new Date()
    this.wodForm = this.wodFB.group({
      wod_lot: "",
      wod_nbr: [{value:"", disabled: true}],
      part: [{value:"", disabled: true}],
      descr: [{value:"", disabled: true}],
      wod__qadt01: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      routing: "",
      site: [{value:"", disabled: true}],
      bom: "",
      qte: 0,
      batch: [{value:0, disabled: true}],
      
    });
  }
  //reste form
  reset() {
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.wodForm.controls;
    if (this.wodForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }

    if (!this.dataset.length) {
      this.message = "La liste des article ne peut pas etre vide ";
      this.hasFormErrors = true;

      return;
    }



      
     
    // tslint:disable-next-line:prefer-const
   
    let wod = this.prepare()
    this.addIt( wod,this.dataset,);
    // tslint:disable-next-line:prefer-const
   // let pr = this.prepare()
    //this.addIt( this.dataset,pr);
  }

  prepare(){
    const controls = this.wodForm.controls;
    const _wod = new WorkOrderDetail();
    _wod.wod_nbr = controls.wod_nbr.value
    _wod.wod_lot = controls.wod_lot.value
    _wod.wod__qadt01 = controls.wod__qadt01.value
    ? `${controls.wod__qadt01.value.year}/${controls.wod__qadt01.value.month}/${controls.wod__qadt01.value.day}`
    : null
    return _wod
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
  addIt( _wod: any, detail: any) {
    console.log("kamel",detail)
    for (let data in detail) {
      delete this.dataset[data].id;
   //   delete this.dataset[data].cmvid;
    }
    this.loadingSubject.next(true);
    
    const controls = this.wodForm.controls
   

    const wodnbr   = controls.wod_nbr.value
    const wodlot  = controls.wod_lot.value
    const part    = controls.part.value
    const descr   = controls.descr.value
    const routing = controls.bom.value
    const gamme   = controls.routing.value
    const qte     = controls.qte.value     

    this.workOrderDetailService
      .Release({ _wod, detail})
      .subscribe(
       (reponse: any) => ( _wod = reponse.data),
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
        // console.log(this.provider, poNbr, this.dataset);
         // if(controls.print.value == true) printReceive(this.provider, this.dataset, poNbr);
       
        // printLp( this.dataset, lpnbr,wodnbr,wodlot,part,descr,routing,gamme,qte );
          this.router.navigateByUrl("/");
        }
      );
  }
  onChangeOA() {
    this.dataset=[]
    const controls = this.wodForm.controls;
    const id = controls.wod_lot.value;
    
    this.workOrderService.getByOne({ id }).subscribe(
      (res: any) => {
      
                
        this.woServer = res.data;
        
        controls.wod_lot.setValue(this.woServer.id);
        controls.wod_nbr.setValue(this.woServer.wo_nbr);
        controls.part.setValue(this.woServer.wo_part);
        controls.descr.setValue(this.woServer.item.pt_desc1)
        controls.site.setValue(this.woServer.wo_site);
        controls.routing.setValue(this.woServer.wo_routing);
        controls.bom.setValue(this.woServer.wo_bom_code);
        const bom_parent = this.woServer.wo_bom_code;
        
        this.bomService.getBy({bom_parent}).subscribe((response: any)=>{
        console.log(response.data)
        
          controls.batch.setValue(response.data.bom_batch);
        })
       
        
      /*  this.psService.getBy({ps_parent}).subscribe((response: any)=>{
                
          this.details  = response.data;
         
          console.log(this.details);

          for (var object = 0; object < this.details.length; object++) {
            // console.log(this.details[object]);
             // const detail = this.details[object];
             
            var qty = Number(this.details[object].ps_qty_per) * Number () ;
            let obj = {}
            obj = {ld_part:this.details[object].ps_comp}
             this.locationDetailService.getByFifo({ obj, qty  }).subscribe((resp: any)=>{
             
              console.log(resp.data)
  
              this.ld  = resp.data;
           
              for (var object = 0; object < this.ld.length; object++) {
                 this.gridService.addItem(
                    {
        
                      
                      id: this.dataset.length + 1,
                      wod_line: this.dataset.length + 1,
                      wod_part: this.ld[object].ld_part,
                      desc: this.ld[object].pt_desc1,
                      wod_um: this.ld[object].pt_um,
                      wod_qty_req: this.ld[object].ld_qty_oh,
                      
                      wod_site: this.ld[object].ld_site,
                      wod_loc: this.ld[object].ld_loc,
                      wod_serial: this.ld[object].ld_lot,
                      wod_ref: this.ld[object].ld_ref,                 
                    },
                    { position: "bottom" }
                  );
                  }
         
         
                })
                  }
        }); */
      });
  }

  
 


  onChangeqte() {
    this.dataset=[]
    const controls = this.wodForm.controls;
    const qte = controls.qte.value;
    
       
       
    const ps_parent = controls.bom.value;
    
    this.psService.getBy({ps_parent}).subscribe((response: any)=>{
            
      this.details  = response.data;
    
      console.log(this.details);

      //for (var object = 0; object < this.details.length; object++) {
      // console.log(this.details[object]);
        // const detail = this.details[object];
        for (let object of this.details) {  
        var qty = Number(object.ps_qty_per) * Number (qte) / Number(controls.batch.value) ;
            this.gridService.addItem(
              {
  
                
                id: this.dataset.length + 1,
                wod_line: this.dataset.length + 1,
                wod_part: object.ps_comp,
                desc: object.item.pt_desc1,
                wod_um: object.item.pt_um,
                wod_qty_req: qty,
                wod_site: controls.site.value,
                wod_loc: object.item.pt_loc,
                
              },
              { position: "bottom" }
            );
          }
    
    
        })
      
   
      
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
  
  
  
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  handleSelectedRowsChanged5(e, args) {
    const controls = this.wodForm.controls;

    this.dataset=[]
    
    if (Array.isArray(args.rows) && this.gridObj5) {
      args.rows.map((idx) => {
        const item = this.gridObj5.getDataItem(idx);
        controls.wod_lot.setValue(item.id || "");
       
        controls.wod_nbr.setValue(item.wo_nbr);
        controls.part.setValue(item.wo_part);
        controls.descr.setValue(item.item.pt_desc1)

        controls.site.setValue(item.wo_site);
        controls.routing.setValue(item.wo_routing);
        controls.bom.setValue(item.wo_bom_code);
        const bom_parent = item.wo_bom_code;
        console.log(bom_parent)
        
        this.bomService.getBy({bom_parent}).subscribe((response: any)=>{
        console.log(response.data)
        
          controls.batch.setValue(response.data.bom_batch);
        })
          /*  this.psService.getBy({ps_parent}).subscribe((response: any)=>{
                    
                    
              this.details = response.data;
            //const det1 = this.details[object]s;
            
console.log(this.details)

            this.details  = response.data;
         
            for (var object = 0; object < this.details.length; object++) {
          // console.log(this.details[object]);
           // const detail = this.details[object];
           
          var qty = this.details[object].ps_qty_per;
          let obj = {}
          obj = {ld_part:this.details[object].ps_comp}
           this.locationDetailService.getByFifo({ obj, qty  }).subscribe((resp: any)=>{
           
            console.log(resp.data)

            this.ld  = resp.data;
         
            for (var object = 0; object < this.ld.length; object++) {
               this.gridService.addItem(
                  {
      
                    
                    id: this.dataset.length + 1,
                    wod_line: this.dataset.length + 1,
                    wod_part: this.ld[object].ld_part,
                    desc: this.ld[object].pt_desc1,
                    wod_um: this.ld[object].pt_um,
                    wod_qty_req: this.ld[object].ld_qty_oh,
                    
                    wod_site: this.ld[object].ld_site,
                    wod_loc: this.ld[object].ld_loc,
                    wod_serial: this.ld[object].ld_lot,
                    wod_ref: this.ld[object].ld_ref,                 
                  },
                  { position: "bottom" }
                );
                }
       
       
              })
                }
          //  
        }
      
        ); */
       
          }
        );



      
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
      .getBy({wo_status: "F"})
      .subscribe((response: any) => {
       // console.log(response.data)
        this.wos = response.data });
      
      
      
    }
  open5(content) {
    this.prepareGrid5();
    this.modalService.open(content, { size: "lg" });
  }



  
}
