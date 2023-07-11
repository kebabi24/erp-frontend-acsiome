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
  PsService,
  OperationHistoryService
} from "../../../../core/erp";
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY } from "@angular/cdk/overlay/overlay-directives";

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
  selector: 'kt-costprice-list',
  templateUrl: './costprice-list.component.html',
  styleUrls: ['./costprice-list.component.scss']
})
export class CostpriceListComponent implements OnInit {
  inventoryTransaction: InventoryTransaction;
  woForm: FormGroup;
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
  
  angularGridmp: AngularGridInstance;
  gridmp: any;
  gridServicemp: GridService;
  dataViewmp: any;
  columnDefinitionsmp: Column[];
  gridOptionsmp: GridOption;
  mpdataset: any[];
 
  angularGridop: AngularGridInstance;
  gridop: any;
  gridServiceop: GridService;
  dataViewop: any;
  columnDefinitionsop: Column[];
  gridOptionsop: GridOption;
  opdataset: any[];

  wos: [];
  columnDefinitions5: Column[] = [];
  gridOptions5: GridOption = {};
  gridObj5: any;
  angularGrid5: AngularGridInstance;

 
 

  

 

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
    private psService: PsService,
    private operationHistoryService : OperationHistoryService,
  ) {
    config.autoClose = true;
    this.codeService
    .getBy({ code_fldname: "emp_shift" })
    .subscribe((response: any) => (this.emp_shift = response.data));
    this.initGrid();
    this.initGridMP();
    this.initGridOP();
  }
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }
  gridReadymp(angularGrid: AngularGridInstance) {
    this.angularGridmp = angularGrid;
    this.dataViewmp = angularGrid.dataView;
    this.gridmp = angularGrid.slickGrid;
    this.gridServicemp = angularGrid.gridService;
  }
  gridReadyop(angularGrid: AngularGridInstance) {
    this.angularGridop = angularGrid;
    this.dataViewop = angularGrid.dataView;
    this.gridop = angularGrid.slickGrid;
    this.gridServiceop = angularGrid.gridService;
  }
  initGrid() {
    this.columnDefinitions = [
     

      
      {
        id: "tr_qty_loc",
        name: "QTE",
        field: "tr_qty_loc",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
       
      },
      {
        id: "tr_um",
        name: "UM",
        field: "tr_um",
        sortable: true,
        width: 80,
        filterable: false,
         
      },
    
   
     
      {
        id: "tr_site",
        name: "Site",
        field: "tr_site",
        sortable: true,
        width: 80,
        filterable: false,
        },
      {
        id: "tr_loc",
        name: "Emplacement",
        field: "tr_loc",
        sortable: true,
        width: 80,
        filterable: false,
   
      },
      {
        id: "tr_serial",
        name: "Lot/Serie",
        field: "tr_serial",
        sortable: true,
        width: 80,
        filterable: false,
      
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
        id: "tr_ref",
        name: "N° PAL",
        field: "tr_ref",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
       
      },
      {
        id: "tr_addr",
        name: "Equipe",
        field: "tr_addr",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
       
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
  initGridMP() {
    this.columnDefinitionsmp = [
     

       
      {
        id: "tr_part",
        name: "Code MP",
        field: "tr_part",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
       
      },
      
      {
        id: "tr_qty_loc",
        name: "QTE",
        field: "tr_qty_loc",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
       
      },
      {
        id: "tr_um",
        name: "UM",
        field: "tr_um",
        sortable: true,
        width: 80,
        filterable: false,
         
      },
    
   
     
      {
        id: "tr_site",
        name: "Site",
        field: "tr_site",
        sortable: true,
        width: 80,
        filterable: false,
        },
      {
        id: "tr_loc",
        name: "Emplacement",
        field: "tr_loc",
        sortable: true,
        width: 80,
        filterable: false,
   
      },
      {
        id: "tr_serial",
        name: "Lot/Serie",
        field: "tr_serial",
        sortable: true,
        width: 80,
        filterable: false,
      
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
        id: "tr_ref",
        name: "N° PAL",
        field: "tr_ref",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
       
      },
      {
        id: "tr__dec04",
        name: "Coût MP",
        field: "tr__dec04",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
       
      },
    ];

    this.gridOptionsmp = {
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

    this.mpdataset = [];
  }

  initGridOP() {
    this.columnDefinitionsop = [
     

     
      {
        id: "op_wkctr",
        name: "Centre de Charge",
        field: "op_wkctr",
        sortable: true,
        width: 50,
        filterable: false,
        
      },
      {
        id: "op_mch",
        name: "Machine",
        field: "op_mch",
        sortable: true,
        width: 50,
        filterable: false,
        
      },

      {
        id: "op_wo_op",
        name: "Opération",
        field: "op_wo_op",
        sortable: true,
        width: 50,
        filterable: false,
        
      },
      
      {
          id: "op_qty_comp",
          name: "QTE Terminée",
          field: "op_qty_comp",
          sortable: true,
          width: 80,
          filterable: false,
          type: FieldType.float,
        
          
      },
      
      {
        id: "op_act_setup",
        name: "Réglage",
        field: "op_act_setup",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
      
      },
    
      {
        id: "op_act_run",
        name: "Execution",
        field: "op_act_run",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
      
      },  
      

    ];

    this.gridOptionsop = {
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

    this.opdataset = [];
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
    this.woForm = this.trFB.group({
     
      wo_lot : [""],
      wo_nbr:  [""],
     
      part:  [{value:"", disabled: true}],
      desc:  [{value:"", disabled: true}],
      qtycomp:  [{value:0, disabled: true}],
      qtyrjct:  [{value:0, disabled: true}],
      unitcost:  [{value:0, disabled: true}],
      unitlbr:  [{value:0, disabled: true}],
      unitbdn:  [{value:0, disabled: true}],
      unittotalcost :  [{value:0, disabled: true}],

      unitlbrstd:  [{value:0, disabled: true}],
      unitbdnstd:  [{value:0, disabled: true}],
      coststd:  [{value:0, disabled: true}],
      
      });
  }

  
  onChangeOA() {
    this.dataset=[]
    const controls = this.woForm.controls;
    const id = controls.tr_lot.value;
    
    this.workOrderService.getByOne({ id }).subscribe(
      (res: any) => {
      
          if(res.data.wo_status == "R") {      
        this.woServer = res.data;
        
        controls.wo_lot.setValue(this.woServer.id);
        controls.wo_nbr.setValue(this.woServer.wo_nbr);
        controls.part.setValue(this.woServer.wo_part);
        controls.desc.setValue(this.woServer.item.pt_desc1)
        controls.qtycomp.setValue(this.woServer.wo_qty_comp);
        controls.qtyrjct.setValue(this.woServer.wo_qty_rjct);
      
        this.inventoryTransactionService.getBy({tr_lot:String(this.woServer.id),tr_nbr:this.woServer.wo_nbr,tr_type:"RCT-WO"}).subscribe(
          (res: any) => {
        
          //(response: any) => (this.dataset = response.data),
          console.log(res.data)
          this.dataset  = res.data;
          this.dataView.setItems(this.dataset)
            
        //this.dataset = res.data
        this.loadingSubject.next(false) 
      })
      


      
    
    this.inventoryTransactionService.getByCost({tr_lot:String(this.woServer.id),tr_nbr:this.woServer.wo_nbr,tr_type:"ISS-WO"}).subscribe(
      (resp: any) => {
    
      //(response: any) => (this.dataset = response.data),
     // console.log(resp.data)
      this.mpdataset  = resp.data;
      this.dataViewmp.setItems(this.mpdataset)
        
    //this.dataset = res.data
    let cost = 0
    for (let det of this.mpdataset) {
      console.log("herehere",det.tr__dec04)
      cost = cost + Number(det.tr__dec04)
    }

    controls.unitcost.setValue (Number((cost /  (Number(controls.qtycomp.value) + Number(controls.qtyrjct.value))).toFixed(2)))

   
    this.workOrderService.CalcCostWo({id:String(this.woServer.id)}).subscribe(
      (response: any) => {   
       
       const lbr = Number(response.data.lbr.toFixed(2))
       const bdn = Number(response.data.bdn.toFixed(2))
       controls.unitlbr.setValue(Number(lbr.toFixed(2)))
       controls.unitbdn.setValue(Number(bdn.toFixed(2)))
       console.log(controls.unitcost.value)
       const tot = Number((Number( controls.unitcost.value)+Number(lbr)+Number(bdn)).toFixed(2))
       controls.unittotalcost.setValue(Number(tot))
      })
  })
 
  this.operationHistoryService.getBy({op_wo_lot:String(this.woServer.id),op_type:"labor"}).subscribe(
    (res: any) => {
  
    //(response: any) => (this.dataset = response.data),
    console.log(res.data)
    this.opdataset  = res.data;
    this.dataViewop.setItems(this.opdataset)
      
  //this.dataset = res.data
 
})



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
    const controls = this.woForm.controls;
    /** check form */
    if (this.woForm.invalid) {
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
    const controls = this.woForm.controls;
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
    const controls = this.woForm.controls;


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
  
  
  
  onAlertClose($event) {
    this.hasFormErrors = false;
  }





  

handleSelectedRowsChanged5(e, args) {
  const controls = this.woForm.controls;

  this.dataset=[]
  this.mpdataset=[]
  
  if (Array.isArray(args.rows) && this.gridObj5) {
    args.rows.map((idx) => {
      const item = this.gridObj5.getDataItem(idx);
      controls.wo_lot.setValue(item.id || "");
     
      controls.wo_nbr.setValue(item.wo_nbr);
      controls.part.setValue(item.wo_part);
      controls.desc.setValue(item.item.pt_desc1)
      controls.qtycomp.setValue(item.wo_qty_comp);
      controls.qtyrjct.setValue(item.wo_qty_rjct);
        this.inventoryTransactionService.getBy({tr_lot:String(item.id),tr_nbr:item.wo_nbr,tr_type:"RCT-WO"}).subscribe(
          (res: any) => {
        
          //(response: any) => (this.dataset = response.data),
          console.log(res.data)
          this.dataset  = res.data;
          this.dataView.setItems(this.dataset)
            
        //this.dataset = res.data
       
      })
      
      this.inventoryTransactionService.getByCost({tr_lot:String(item.id),tr_nbr:item.wo_nbr,tr_type:"ISS-WO"}).subscribe(
        (resp: any) => {
      
        //(response: any) => (this.dataset = response.data),
       // console.log(resp.data)
        this.mpdataset  = resp.data;
        this.dataViewmp.setItems(this.mpdataset)
          
      //this.dataset = res.data
      let cost = 0
      for (let det of this.mpdataset) {
        console.log("herehere",det.tr__dec04)
        cost = cost + Number(det.tr__dec04)
      }

      controls.unitcost.setValue (Number((cost /  (Number(controls.qtycomp.value) + Number(controls.qtyrjct.value))).toFixed(2)))

     
      this.workOrderService.CalcCostWo({id:String(item.id)}).subscribe(
        (response: any) => {   
         
         const lbr = Number(response.data.lbr.toFixed(2))
         const bdn = Number(response.data.bdn.toFixed(2))
         controls.unitlbr.setValue(Number(lbr.toFixed(2)))
         controls.unitbdn.setValue(Number(bdn.toFixed(2)))

         const lbrstd = Number(response.data.lbrstd.toFixed(2))
         const bdnstd = Number(response.data.bdnstd.toFixed(2))
         controls.unitlbrstd.setValue(Number(lbrstd.toFixed(2)))
         controls.unitbdnstd.setValue(Number(bdnstd.toFixed(2)))

         console.log(controls.unitcost.value)
         const tot = Number((Number( controls.unitcost.value)+Number(lbr)+Number(bdn)).toFixed(2))
         controls.unittotalcost.setValue(Number(tot))

         this.psService.getPrice ({ps_parent: item.wo_bom_code}).subscribe(
          (respon: any) => {   
            const coststd = respon.data.price  
            console.log(coststd)
            controls.coststd.setValue(Number(coststd.toFixed(2)))



          })
        })
    })
   
    this.operationHistoryService.getBy({op_wo_lot:String(item.id),op_type:"labor"}).subscribe(
      (res: any) => {
    
      //(response: any) => (this.dataset = response.data),
      console.log(res.data)
      this.opdataset  = res.data;
      this.dataViewop.setItems(this.opdataset)
        
    //this.dataset = res.data
   
  })
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
