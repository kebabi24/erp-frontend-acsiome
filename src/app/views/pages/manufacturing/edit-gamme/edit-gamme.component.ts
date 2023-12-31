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

import {WorkRouting, WorkRoutingService, WorkCenter, WorkCenterService,ProviderService } from "../../../../core/erp"

@Component({
  selector: 'kt-edit-gamme',
  templateUrl: './edit-gamme.component.html',
  styleUrls: ['./edit-gamme.component.scss']
})
export class EditGammeComponent implements OnInit {

  workRouting: WorkRouting;
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  isExist = false 

    
  columnDefinitionsM: Column[] = [];
  gridOptionsM: GridOption = {};
  dataViewM: any
  angularGridM: AngularGridInstance;
  gridObjM: any;
  machinesData :  [];
  gammeForm: FormGroup;
  hasFormErrors: boolean = false;
  
  vends: [];
  columnDefinitionsvend: Column[] = [];
  gridOptionsvend: GridOption = {};
  gridObjvend: any;
  angularGridvend: AngularGridInstance;
  gammeEdit: any
  title: String = 'Modifier Gamme - '
  datestart: any;
  dateend : any;
  constructor(
    config: NgbDropdownConfig,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private gammeFB: FormBuilder,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private workroutingService: WorkRoutingService,
    private modalService: NgbModal,
    private workCenterService : WorkCenterService,
    private providerService : ProviderService,
    ) { config.autoClose = true}
    
    
     
      
  
  
  ngOnInit() {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
   // this.createForm();
    this.activatedRoute.params.subscribe((params) => {
      const id = params.id
      this.workroutingService.getOne(id).subscribe((response: any)=>{
        this.gammeEdit = response.data
        this.datestart = new Date(this.gammeEdit.ro_start)
        this.dateend = new Date(this.gammeEdit.ro_end)
        this.datestart.setDate(this.datestart.getDate() )
        this.dateend.setDate(this.dateend.getDate() )
        this.initCode()
        this.loadingSubject.next(false)
        this.title = this.title + this.gammeEdit.ro_routing
      })
  })
  }
  // init code
  initCode() {
    this.createForm()
    this.loadingSubject.next(false)
  }
  
  //create form
  createForm() {
    this.loadingSubject.next(false)
    
    this.gammeForm = this.gammeFB.group({
      ro_routing: [{value:this.gammeEdit.ro_routing, disabled: true}],
      ro_op    : [{value:this.gammeEdit.ro_op, disabled:true}],
      ro_rollup: [ this.gammeEdit.ro_rollup ],
      ro_wkctr: [this.gammeEdit.ro_wkctr, Validators.required ],
      ro_mch: [this.gammeEdit.ro_mch, Validators.required],
      
      ro_desc: [this.gammeEdit.ro_desc, Validators.required ],
      ro_mch_op: [this.gammeEdit.ro_mch_op],
      ro_queue:  [this.gammeEdit.ro_queue ],
      ro_wait: [this.gammeEdit.ro_wait ],
      ro_tran_qty: [this.gammeEdit.ro_tran_qty ],
      ro_setup: [this.gammeEdit.ro_setup ],
      ro_setup_men: [this.gammeEdit.ro_setup_men ],
      ro_men_mch: [this.gammeEdit.ro_men_mch ],
      ro_batch: [this.gammeEdit.ro_batch ],
      ro_run:  [this.gammeEdit.ro_run ],
      ro_move: [this.gammeEdit.ro_move ],
     
      ro_yield_pct: [this.gammeEdit.ro_yield_pct ],
      ro_milestone: [this.gammeEdit.ro_milestone ],
      ro_tool: [this.gammeEdit.ro_tool ],
      ro_vend: [this.gammeEdit.ro_vend ],
      ro_inv_value: [this.gammeEdit.ro_inv_value ],
      ro_sub_cost: [this.gammeEdit.ro_sub_cost ],

     
      ro_start: [{
        year: this.datestart.getFullYear(),
        month: this.datestart.getMonth()+1,
        day: this.datestart.getDate()
      }],
      ro_end: [{
        year: this.dateend.getFullYear(),
        month: this.dateend.getMonth()+1,
        day: this.dateend.getDate()
      }], 
    })
  }
  
    //reste form
    reset() {
      this.workRouting = new WorkRouting();
      this.createForm();
      this.hasFormErrors = false;
    }
   
// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.gammeForm.controls
  /** check form */
  if (this.gammeForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      return
  }

  // tslint:disable-next-line:prefer-const
  let gamme = this.prepareGamme()
  this.addGamme(gamme)
 
}
/**
* Returns object for saving
*/
prepareGamme(): WorkRouting {
  const controls = this.gammeForm.controls
  const _workrouting = new WorkRouting()
  _workrouting.ro_routing = controls.ro_routing.value
  _workrouting.ro_op = controls.ro_op.value
  _workrouting.ro_rollup = controls.ro_rollup.value
  _workrouting.ro_desc = controls.ro_desc.value
  _workrouting.ro_wkctr = controls.ro_wkctr.value
  _workrouting.ro_mch = controls.ro_mch.value
  _workrouting.ro_batch = controls.ro_batch.value
  _workrouting.ro_queue = controls.ro_queue.value
  _workrouting.ro_wait = controls.ro_wait.value
  _workrouting.ro_mch_op = controls.ro_mch_op.value
  _workrouting.ro_setup_men = controls.ro_setup_men.value
  _workrouting.ro_men_mch = controls.ro_men_mch.value
  _workrouting.ro_tran_qty = controls.ro_tran_qty.value
  _workrouting.ro_setup = controls.ro_setup.value
  _workrouting.ro_run = controls.ro_run.value
  _workrouting.ro_move = controls.ro_move.value
  _workrouting.ro_yield_pct = controls.ro_yield_pct.value
  _workrouting.ro_milestone = controls.ro_milestone.value
  _workrouting.ro_tool = controls.ro_tool.value
  _workrouting.ro_vend = controls.ro_vend.value
  _workrouting.ro_inv_value = controls.ro_inv_value.value
  _workrouting.ro_sub_cost = controls.ro_sub_cost.value

  _workrouting.ro_start = controls.ro_start.value
    ? `${controls.ro_start.value.year}/${controls.ro_start.value.month}/${controls.ro_start.value.day}`
    : null

    _workrouting.ro_end = controls.ro_end.value
    ? `${controls.ro_end.value.year}/${controls.ro_end.value.month}/${controls.ro_end.value.day}`
    : null  

  return _workrouting
}

/**
* Add code
*
* @param _workrouting: CodeModel
*/
addGamme(_workrouting: WorkRouting) {
  this.loadingSubject.next(true)
  this.workroutingService.update(this.gammeEdit.id, _workrouting).subscribe(
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
            "Modification avec succès",
            MessageType.Create,
            10000,
            true,
            true
        )
        this.loadingSubject.next(false)
        this.router.navigateByUrl("/manufacturing/list-gamme")
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



 // *********** GRID MACHINE START ********************
 prepareGridMachine() {
  this.columnDefinitionsM = [
  
    {
      id: "wc_wkctr",
      name: "Centre de Charge",
      field: "wc_wkctr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "wc_mch",
      name: "Code Machine",
      field: "wc_mch",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "wc_desc",
      name: "Description",
      field: "wc_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptionsM = {
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
    
      hideSelectAllCheckbox: true,

     
    },
    multiSelect: false,
    rowSelectionOptions: {
      // True (Single Selection), False (Multiple Selections)
      selectActiveRow: true,
    },
  };

  this.workCenterService.getAll().subscribe((response: any) => (this.machinesData = response.data));
 
}

handleSelectedRowsChangedM(e, args){
  const controls = this.gammeForm.controls;
  if (Array.isArray(args.rows) && this.gridObjM) {
    args.rows.map((idx) => {
      const machine = this.gridObjM.getDataItem(idx);
      controls.ro_wkctr.setValue(machine.wc_wkctr)
      controls.ro_mch.setValue(machine.wc_mch || "");
      
    });
  }
}

angularGridReadyM(angularGrid: AngularGridInstance) {
  this.angularGridM = angularGrid;
  this.gridObjM = (angularGrid && angularGrid.slickGrid) || {};
  this.dataViewM = angularGrid.dataView;
}

openMachineGrid(content){
  this.prepareGridMachine()
  this.modalService.open(content, { size: "lg" });
}
// *********** GRID MACHINE END ********************

onChangeWKCTR() {
  const controls  = this.gammeForm.controls
  this.workCenterService
      .getBy({
            wc_wkctr: controls.ro_wkctr.value,
            
      })
      .subscribe((response: any) => {
        //  const {data} = response.data;
         // console.log(response.data)
          if (response.data.length == 0) {
            alert("Centre de charge n'existe pas")

             controls.ro_wkctr.setValue(null) 
             document.getElementById("ro_wkctr").focus(); 
          }             
    })
}
onChangeMCH() {
  const controls  = this.gammeForm.controls
  this.workCenterService
      .getBy({
            wc_wkctr: controls.ro_wkctr.value,
            wc_mch: controls.ro_mch.value,
            
      })
      .subscribe((response: any) => {
        //  const {data} = response.data;
         // console.log(response.data)
          if (response.data.length == 0) {
            alert("Machine n'existe pas")

             controls.ro_mch.setValue(null) 
             document.getElementById("ro_mch").focus(); 
          }             
    })
}

handleSelectedRowsChangedvend(e, args) {
 const controls = this.gammeForm.controls
  if (Array.isArray(args.rows) && this.gridObjvend) {
    args.rows.map((idx) => {
      const item = this.gridObjvend.getDataItem(idx);

      controls.ro_vend.setValue(item.vd_addr);

      
    });
  }
}

angularGridReadyvend(angularGrid: AngularGridInstance) {
  this.angularGridvend = angularGrid;
  this.gridObjvend = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridvend() {
  this.columnDefinitionsvend = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "vd_addr",
      name: "code",
      field: "vd_addr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_name",
      name: "Fournisseur",
      field: "address.ad_name",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_phone",
      name: "Numero telephone",
      field: "address.ad_phone",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxable",
      name: "A Taxer",
      field: "address.ad_taxable",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxc",
      name: "Taxe",
      field: "address.ad_taxc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptionsvend = {
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
  this.providerService.getAll().subscribe((response: any) => (this.vends = response.data));
}
openvend(content) {
  this.prepareGridvend();
  this.modalService.open(content, { size: "lg" });
}

}