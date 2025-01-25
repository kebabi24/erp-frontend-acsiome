// Angular
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgbDropdownConfig,
  NgbTabChangeEvent,
  NgbTabsetConfig,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
// Material
import { MatDialog } from "@angular/material/dialog";
// RxJS
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { map, startWith, delay, first } from "rxjs/operators";
// NGRX
import { Store, select } from "@ngrx/store";
import { Dictionary, Update } from "@ngrx/entity";
import { AppState } from "../../../../core/reducers";
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
// Services and Models
import {
  selectLastCreatedProductId,
  selectProductById,
  SPECIFICATIONS_DICTIONARY,
  ProductModel,
  ProductOnServerCreated,
  ProductUpdated,
  ProductsService,
} from "../../../../core/e-commerce";

// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  GridService,
  FieldType,
  Formatters,
  OnEventArgs,
} from "angular-slickgrid";

import {
  CodeService,
  Item,
  ItemService,
  JobService,
  CostSimulation,
  CostSimulationService,
} from "../../../../core/erp";
import { jsPDF } from "jspdf";
import { _isNumberValue } from '@angular/cdk/coercion';

// create my custom Formatter with the Formatter type
const myCustomCheckmarkFormatter: Formatter = (
  row,
  cell,
  value,
  columnDef,
  dataContext
) => {
  // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
  return `
	<div class="form-group row">
        <div class="col-8">
            <span class="switch switch-icon">
                <label>
                    <input type="checkbox"
                        class="form-control form-control-sm form-control-solid"
                        name="select" />
                    <span></span>
                </label>
            </span>
        </div>
    </div>
	`;
};
 

@Component({
  selector: 'kt-create-training',  
  templateUrl: './create-training.component.html',
  styleUrls: ['./create-training.component.scss']
})
export class CreateTrainingComponent implements OnInit {
  item: Item;
  hasFormErrors1 = false;
 

  formX: FormGroup;
  
  ad_country: any[] = []
  pt_network:any[] = []
  pt_bom_code: any[] = []
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  // slick grid
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];

  sequences: [];
  columnDefinitionsseq: Column[] = [];
  gridOptionsseq: GridOption = {};
  gridObjseq: any;
  angularGridseq: AngularGridInstance;

  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  dataset2: any[] = [];

  providers: [];
  columnDefinitionsprov: Column[] = [];
  gridOptionsprov: GridOption = {};
  gridObjprov: any;
  angularGridprov: AngularGridInstance;

  // selects
  pt_dsgn_grp: any[]=[];
  pt_draw: any[] = [];
  pt_group: any[] = [];

  methangularGrid: AngularGridInstance;
  methgrid: any;
  methgridService: GridService;
  methdataView: any;
  methcolumnDefinitions: Column[];
  methgridOptions: GridOption;
  methdataset: any[];

  progangularGrid: AngularGridInstance;
  proggrid: any;
  proggridService: GridService;
  progdataView: any;
  progcolumnDefinitions: Column[];
  proggridOptions: GridOption;
  progdataset: any[];

  objeangularGrid: AngularGridInstance;
  objegrid: any;
  objegridService: GridService;
  objedataView: any;
  objecolumnDefinitions: Column[];
  objegridOptions: GridOption;
  objedataset: any[];


  row_number;
  error = false;
  msg: String;

  isExist = false;

  jobs: [];
  columnDefinitions1: Column[] = [];
  gridOptions1: GridOption = {};
  gridObj1: any;
  angularGrid1: AngularGridInstance;
  domain    : any;  
  user:any;
  part:any;

  sct1: CostSimulation;
  sct2: CostSimulation;
 
  sctForm: FormGroup;
  sctForm1: FormGroup;

  constructor(
    config: NgbDropdownConfig,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private codeService: CodeService,
    private itemService: ItemService,
    private jobService:JobService,
    private sctService: CostSimulationService,
  ) {
    config.autoClose = true;
    // this.prepareGrid();
     
    this.codeService
      .getBy({ code_fldname: "pt_origin" })
      .subscribe((response: any) => (this.ad_country = response.data))
      this.codeService
      .getBy({ code_fldname: "pt_network" })
      .subscribe((response: any) => (this.pt_network = response.data))
    // this.codeService
    //   .getBy({ code_fldname: "pt_draw" })
    //   .subscribe((response: any) => (this.pt_draw = response.data));
      this.codeService
      .getBy({ code_fldname: "pt_dsgn_grp" })
      .subscribe((response: any) => (this.pt_dsgn_grp = response.data));  
    this.codeService
      .getBy({ code_fldname: "pt_bom_code" })
      .subscribe((response: any) => (this.pt_bom_code = response.data));  
      this.codeService
      .getBy({ code_fldname: "pt_draw" })
      .subscribe((response: any) => (console.log(response.data), this.pt_draw = response.data));
    
   
  }
  
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user = JSON.parse(localStorage.getItem("user"));
    this.domain = JSON.parse(localStorage.getItem("domain"));
    this.createForm();
    this.initmethGrid();
    this.initprogGrid();
    this.initobjeGrid();
  }
  methGridReady(angularGrid: AngularGridInstance) {
    this.methangularGrid = angularGrid;
    this.methdataView = angularGrid.dataView;
    this.methgrid = angularGrid.slickGrid;
    this.methgridService = angularGrid.gridService;
  }
  objeGridReady(angularGrid: AngularGridInstance) {
    this.objeangularGrid = angularGrid;
    this.objedataView = angularGrid.dataView;
    this.objegrid = angularGrid.slickGrid;
    this.objegridService = angularGrid.gridService;
  }
  progGridReady(angularGrid: AngularGridInstance) {
    this.progangularGrid = angularGrid;
    this.progdataView = angularGrid.dataView;
    this.proggrid = angularGrid.slickGrid;
    this.proggridService = angularGrid.gridService;
  }
  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.item = new Item();
    this.formX = this.formBuilder.group({
      pt_dsgn_grp:[{ value: this.item.pt_dsgn_grp},Validators.required],
      pt_draw: [{ value: this.item.pt_draw },Validators.required],
      pt_group: [{ value: this.item.pt_group}],
      pt_part: [this.item.pt_part],
      pt_desc1: [{ value: this.item.pt_desc1, disabled: !this.isExist },Validators.required],
      
      pt_iss_pol: [{ value: false, disabled: !this.isExist }],
      pt_rollup: [{ value: false, disabled: !this.isExist }],
      pt_phantom: [{ value: false, disabled: !this.isExist }],
      pt_insp_rqd: [{ value: false, disabled: !this.isExist }],
      pt_critical: [{ value: false, disabled: !this.isExist }],
      pt_network: [{ value: this.item.pt_network, disabled: !this.isExist }],
      pt_origin: [{ value: this.item.pt_origin, disabled: !this.isExist }],
      pt_bom_code: [{ value: this.item.pt_bom_code, disabled: !this.isExist }],
      pt_shelflife: [{ value: this.item.pt_shelflife, disabled: !this.isExist }],
      pt_price: [{ value: this.item.pt_price, disabled: !this.isExist }],
      pt_pur_price: [{ value: this.item.pt_pur_price, disabled: !this.isExist }],
      
    })
    this.sct1 = new CostSimulation();
  }


  

  onChangeCode() {
    const controls = this.formX.controls
  
    this.itemService
        .getByOne({
            pt_part: controls.pt_part.value,
        })
        .subscribe((response: any) => {
        
            if (response.data) {
                this.isExist = true
                console.log(response.data)
            } else {
             
              controls.pt_desc1.enable()
              controls.pt_draw.enable()
              controls.pt_group.enable()
              controls.pt_iss_pol.enable()
              controls.pt_rollup.enable()
              controls.pt_phantom.enable()
              controls.pt_insp_rqd.enable()
              controls.pt_critical.enable()
              controls.pt_network.enable()
              controls.pt_origin.enable()  
              controls.pt_bom_code.enable() 
              controls.pt_shelflife.enable() 
              controls.pt_price.enable() 
              controls.pt_pur_price.enable() 

              document.getElementById("pt_desc1").focus();

            }
        })
}
//reste form
  //reste form
  reset() {
    this.item = new Item();
    this.createForm();
    this.methdataset= []
    this.progdataset= []
    this.objedataset= []
    this.hasFormErrors1 = false;
  }
  // save data
  onSubmit() {
   
    this.hasFormErrors1 = false;
    const controls = this.formX.controls;
    /** check form */
    if (this.formX.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors1 = true;
      return;
    }
    if (this.error) {
      this.hasFormErrors1 = true;
      return;
    }
    // tslint:disable-next-line:prefer-const
    let item = this.prepareItem();
    let sct1 = this.prepareSct1();
    let sct2 = this.prepareSct2()
    this.addItem(item,sct1,sct2,this.methdataset,this.objedataset,this.progdataset);
    this.printpdf(controls.pt_part.value); 
  }
  /**
   *
   * Returns object for saving
   */
  prepareItem(): Item {
    const controls  = this.formX.controls;
    let site: any;
    if(this.user.usrd_site == '*'){site = 'ECOLE'} else{site = this.user.usrd_site}
    const _item = new Item();
    _item.pt_part = controls.pt_part.value;
    _item.pt_desc1 = controls.pt_desc1.value;
    _item.pt_dsgn_grp = controls.pt_dsgn_grp.value;
    _item.pt_draw = controls.pt_draw.value;
    _item.pt_group = controls.pt_group.value;
    _item.pt_iss_pol = controls.pt_iss_pol.value;
    _item.pt_critical = controls.pt_critical.value;
    _item.pt_phantom = controls.pt_phantom.value;
    _item.pt_insp_rqd = controls.pt_insp_rqd.value;
    _item.pt_rollup = controls.pt_rollup.value;
    _item.pt_network = controls.pt_network.value;
    _item.pt_origin = controls.pt_origin.value;
    _item.pt_bom_code = controls.pt_bom_code.value;
    _item.pt_shelflife = controls.pt_shelflife.value;
    _item.pt_price = controls.pt_price.value;
    _item.pt_pur_price = controls.pt_pur_price.value;
    _item.pt_taxable = true;
    _item.pt_taxc = '19A';
    _item.pt_part_type = "FORMATION";
    _item.pt_um= "UN"
    _item.pt_buyer = controls.pt_draw.value;
    _item.pt_site = site; 
    

    return _item;
  }
  /**
   * Add item
   *
   * @param _item: ItemModel
   */
  
    addItem(_item: any,sct1:CostSimulation,sct2:CostSimulation, detail1: any,detail2: any,detail3: any) {
      for (let data1 of detail1) {
        delete data1.id;
        delete data1.cmvid;
       
      }
      for (let data2 of detail2) {
        delete data2.id;
        delete data2.cmvid;
       
      }
      for (let data3 of detail3) {
        delete data3.id;
        delete data3.cmvid;
       
      }
      this.loadingSubject.next(true);
      let so = null;
      const controls = this.formX.controls;
  
      this.itemService
        .adddetail({ item: _item, itemmethode: detail1,itemobjectif: detail2,itemprogram: detail3})
        .subscribe(
          (reponse: any) => (so = reponse.data),
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

            this.sctService.add(sct1).subscribe(
              (reponse) => console.log("response", Response),
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
                this.sctService.add(sct2).subscribe(
                  (reponse) => console.log("response", Response),
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
                    this.router.navigateByUrl("/training/list-training");
                  }
                );
              }
            );
          }
        );
    }
 
    
  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/training/training-session-list`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  prepareSct1(): CostSimulation {
    // const controls = this.sctForm.controls;
    const control1 = this.formX.controls;
    const _sct = new CostSimulation();
    let site: any;
    if(this.user.usrd_site == '*'){site = 'ECOLE'} else{site = this.user.usrd_site}
    _sct.sct_sim      = 'STD-CG'
    _sct.sct_part     = control1.pt_part.value;
    _sct.sct_mtl_tl   = 0;
    _sct.sct_mtl_ll   = 0;
    _sct.sct_lbr_tl   = 0;
    _sct.sct_lbr_ll   = 0;
    _sct.sct_bdn_tl   = 0;
    _sct.sct_bdn_ll   = 0;
    _sct.sct_ovh_tl   = 0;
    _sct.sct_ovh_ll   = 0;
    _sct.sct_sub_tl   = 0;
    _sct.sct_sub_ll   = 0;
    _sct.sct_cst_tot  = 0;
    _sct.sct_site     = site;

    return _sct;
  }

  prepareSct2(): CostSimulation {
    // const controls = this.sctForm1.controls;
    let site: any;
    if(this.user.usrd_site == '*'){site = 'ECOLE'} else{site = this.user.usrd_site}
    const control1 = this.formX.controls;
    const _sct = new CostSimulation();
    _sct.sct_sim     = 'STD-CR'
    _sct.sct_part    = control1.pt_part.value
    _sct.sct_mtl_tl  = 0;
    _sct.sct_mtl_ll  = 0;
    _sct.sct_lbr_tl  = 0;
    _sct.sct_lbr_ll  = 0;
    _sct.sct_bdn_tl  = 0;
    _sct.sct_bdn_ll  = 0;
    _sct.sct_ovh_tl  = 0;
    _sct.sct_ovh_ll  = 0;
    _sct.sct_sub_tl  = 0;
    _sct.sct_sub_ll  = 0;
    _sct.sct_cst_tot = 0;
    _sct.sct_site    = site;
    return _sct;
  }
  onchangedesc() {
    const controls = this.formX.controls
    document.getElementById("pt_draw").focus();
  
  }
  onchangetype() {
    const controls = this.formX.controls
    this.part = controls.pt_dsgn_grp.value
    controls.pt_draw.setValue(null)
    controls.pt_group.setValue(null)
    controls.pt_part.setValue(this.part)
    
    this.codeService
      .getBy({ code_fldname: "pt_draw" })
      .subscribe((response: any) => (console.log(response.data), this.pt_draw = response.data));
   // document.getElementById("pt_group").focus();
  
  }
  onchangedomain() {
    const controls = this.formX.controls
    this.part = controls.pt_dsgn_grp.value + '-' + controls.pt_draw.value + '-'
       let nbr: any;
    this.itemService
      .getBy({ pt_part_type:'FORMATION',pt_dsgn_grp: controls.pt_dsgn_grp.value,pt_draw:controls.pt_draw.value,})
      .subscribe((response: any) => (nbr = response.data.length + 1,
        this.part = this.part + nbr,
        controls.pt_part.setValue(this.part)
        
      ));
   
    this.codeService
      .getBy({ code_fldname: "pt_group",chr01:controls.pt_draw.value })
      .subscribe((response: any) => (this.pt_group = response.data));
   // document.getElementById("pt_group").focus();
   controls.pt_desc1.enable()
   controls.pt_iss_pol.enable()
              controls.pt_rollup.enable()
              controls.pt_phantom.enable()
              controls.pt_insp_rqd.enable()
              controls.pt_critical.enable()
              controls.pt_network.enable()
              controls.pt_origin.enable()  
              controls.pt_bom_code.enable() 
              controls.pt_shelflife.enable() 
              controls.pt_price.enable() 
              controls.pt_pur_price.enable()

  
  }
  onchangegroup() {
    
    
  
  }

  initprogGrid() {
    this.progcolumnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.progangularGrid.gridService.deleteItem(args.dataContext);
          }
        },
      },
      {
        id: "ptd_desc",
        name: "Programme de formation",
        field: "ptd_desc",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      
     
     
    ];

    this.proggridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableAutoResize: true,
      autoHeight:false,
      rowHeight:40,
      autoCommitEdit:true,
      
     // enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
    };

    this.progdataset = [];
  }
  initobjeGrid() {
    this.objecolumnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.objeangularGrid.gridService.deleteItem(args.dataContext);
          }
        },
      },
     
      {
        id: "ptd_gol",
        name: "Objectif",
        field: "ptd_gol",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
       
      },
      {
        id: "mvid",
        field: "cmvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.row_number = args.row;
          let element: HTMLElement = document.getElementById("openJobsGrid") as HTMLElement;
          element.click();
        },
      }, 
      {
        id: "ptd_level",
        name: "Niveau Maitrise",
        field: "ptd_level",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
       
      },
    ];

    this.objegridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableAutoResize: true,
      autoHeight:false,
      rowHeight:40,
      autoCommitEdit:true,
      
     // enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
    };

    this.objedataset = [];
  }
  initmethGrid() {
    this.methcolumnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.methangularGrid.gridService.deleteItem(args.dataContext);
          }
        },
      },
      {
        id: "ptd_desc",
        name: "Méthode de formation",
        field: "ptd_desc",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      
      
     
    ];

    this.methgridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableAutoResize: true,
      autoHeight:false,
      rowHeight:40,
      autoCommitEdit:true,
      
     // enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
    };

    this.methdataset = [];
  }
  addNewprog() {
    const newId = this.progdataset.length+1;

    const newItem = {
      id: newId,
      ptd_desc: null,
      
    };
    this.proggridService.addItem(newItem, { position: "bottom" });
  }
  addNewobje() {
    const newId = this.objedataset.length+1;

    const newItem = {
      id: newId,
      ptd_desc: null,
     
    };
    this.objegridService.addItem(newItem, { position: "bottom" });
  }
  addNewmeth() {
    const newId = this.methdataset.length+1;

    const newItem = {
      id: newId,
      ptd_desc: null,
     
    };
    this.methgridService.addItem(newItem, { position: "bottom" });
  }


  handleSelectedRowsChanged1(e, args) {
    let updateItem = this.objegridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj1) {
      args.rows.map((idx) => {
        const item = this.gridObj1.getDataItem(idx);
        console.log(item);
        
       
        updateItem.ptd_gol = item.jb_code;
  
       this.objegridService.updateItem(updateItem);
       
      });
    }
  
  
  
  }
  
  angularGridReady1(angularGrid: AngularGridInstance) {
    this.angularGrid1 = angularGrid;
    this.gridObj1 = (angularGrid && angularGrid.slickGrid) || {};
  }
  
  prepareGrid1() {
    this.columnDefinitions1 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "jb_code",
        name: "code Compétence",
        field: "jb_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "jb_desc",
        name: "Désignation",
        field: "jb_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      
    ];
  
    this.gridOptions1 = {
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
  
    this.jobService.getAll().subscribe((response: any) => (this.jobs = response.data));
  }
  openJob(content) {
    this.prepareGrid1();
    this.modalService.open(content, { size: "lg" });
  }
  printpdf(nbr) {
    // const controls = this.totForm.controls
    const controls = this.formX.controls
    console.log("pdf");
    var doc = new jsPDF();
    let date = new Date()
   // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
    var img = new Image()
    img.src = "./assets/media/logos/companyentete.png";
    doc.addImage(img, 'png', 150, 5, 50, 30)
    doc.setFontSize(9);
    
    doc.setFontSize(14);
  
    doc.line(10, 35, 200, 35);
    doc.setFontSize(12);
    doc.text(nbr, 70, 45);
    doc.text("Date: " + this.dataset[0].tr_effdate, 160, 45);
    doc.text("imprimé Le: " + date.toLocaleDateString() , 160, 40);
    doc.text("A: " + new Date().toLocaleTimeString(), 160, 50);
    doc.text("Edité par: " + this.user.usrd_code, 160, 55);
    
    doc.setFontSize(8);
    //console.log(this.provider.ad_misc2_id)
    
  
    doc.line(10, 85, 205, 85);
    doc.line(10, 90, 205, 90);
    doc.line(10, 85, 10, 90);
    doc.text("LN", 12.5, 88.5);
    doc.line(20, 85, 20, 90);
    doc.text("Code Article", 25, 88.5);
    doc.line(45, 85, 45, 90);
    doc.text("Désignation", 67.5, 88.5);
    doc.line(100, 85, 100, 90);
    doc.text("QTE", 107, 88.5);
    doc.line(120, 85, 120, 90);
    doc.text("UM", 123, 88.5);
    doc.line(130, 85, 130, 90);
    doc.text("PU", 138, 88.5);
    doc.line(150, 85, 150, 90);
    doc.text("Lot/Série", 152, 88.5);
    doc.line(170, 85, 170, 90);
    doc.text("N PAL", 172, 88.5);
    doc.line(185, 85, 185, 90);
    doc.text("THT", 195, 88.5);
    doc.line(205, 85, 205, 90);
    var i = 95;
    doc.setFontSize(6);
    let total = 0
    for (let j = 0; j < this.dataset.length  ; j++) {
      total = total - Number(this.dataset[j].tr_qty_loc)
      if (this.dataset[j].tr_desc.length > 40) {
        let desc1 = this.dataset[j].tr_desc.substring(40);
        let ind = desc1.indexOf(" ");
        desc1 = this.dataset[j].tr_desc.substring(0, 40 + ind);
        let desc2 = this.dataset[j].tr_desc.substring(40 + ind);
  
        doc.line(10, i - 5, 10, i);
        doc.text(String("000" + Number(j + 1) ).slice(-3), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.dataset[j].tr_part, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(desc1, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(Number(this.dataset[j].tr_qty_loc) * (-1)), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(this.dataset[j].tr_um, 123, i - 1);
        doc.line(130, i - 5, 130, i);
        doc.text(String(Number(this.dataset[j].tr_price)), 148, i - 1, { align: "right" });
        doc.line(150, i - 5, 150, i);
        doc.text(String(this.dataset[j].tr_serial), 168, i - 1, { align: "right" });
        doc.line(170, i - 5, 170, i);
        doc.text(String(this.dataset[j].tr_ref), 183, i - 1, { align: "right" });
        doc.line(185, i - 5, 185, i);
        doc.text(String(Number((Number(this.dataset[j].tr_price) * (-1) * Number((this.dataset[j].tr_qty_loc))))), 203, i - 1, { align: "right" });
        doc.line(205, i - 5, 205, i);
        // doc.line(10, i, 200, i );
  
        i = i + 5;
  
        doc.text(desc2, 47, i - 1);
  
        doc.line(10, i - 5, 10, i);
        doc.line(20, i - 5, 20, i);
        doc.line(45, i - 5, 45, i);
        doc.line(100, i - 5, 100, i);
        doc.line(120, i - 5, 120, i);
        doc.line(130, i - 5, 130, i);
        doc.line(150, i - 5, 150, i);
        doc.line(170, i - 5, 170, i);
        doc.line(185, i - 5, 185, i);
        doc.line(205, i - 5, 205, i);
        doc.line(10, i, 200, i);
  
        i = i + 5;
      } else {
        doc.line(10, i - 5, 10, i);
        doc.text(String("000" + Number(j+1)).slice(-3), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.dataset[j].tr_part, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(this.dataset[j].tr_desc, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(Number(this.dataset[j].tr_qty_loc) * (-1)), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(this.dataset[j].tr_um, 123, i - 1);
        doc.line(130, i - 5, 130, i);
        doc.text(String(Number(this.dataset[j].tr_price)), 148, i - 1, { align: "right" });
        doc.line(150, i - 5, 150, i);
        doc.text(String(this.dataset[j].tr_serial), 168, i - 1, { align: "right" });
        doc.line(170, i - 5, 170, i);
        doc.text(String(this.dataset[j].tr_ref), 183, i - 1, { align: "right" });
        doc.line(185, i - 5, 185, i);
        doc.text(String(Number(Number((this.dataset[j].tr_price)) * (-1) * Number((this.dataset[j].tr_qty_loc)))), 203, i - 1, { align: "right" });
        doc.line(205, i - 5, 205, i);
        doc.line(10, i, 205, i);
        i = i + 5;
      }
    }
  
    // doc.line(10, i - 5, 200, i - 5);
  
    // doc.line(130, i + 7, 205, i + 7);
    // doc.line(130, i + 14, 205, i + 14);
    // //  doc.line(130, i + 21, 200, i + 21 );
    // //  doc.line(130, i + 28, 200, i + 28 );
    // //  doc.line(130, i + 35, 200, i + 35 );
    // doc.line(130, i + 7, 130, i + 14);
    // doc.line(160, i + 7, 160, i + 14);
    // doc.line(205, i + 7, 205, i + 14);
    // doc.setFontSize(10);
  
    
    doc.setFontSize(8);
    
    doc.save('FT-' + nbr + '.pdf')
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
  }
  createtraining() {
    this.loadingSubject.next(false)
    const url = `/training/list-training`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
students() {
  this.loadingSubject.next(false)
  const url = `/accounting-setting/list-employe`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
createsession() {
  this.loadingSubject.next(false)
  const url = `/training/create-training-session`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
approverequest() {
  this.loadingSubject.next(false)
  const url = `/training/approval-req`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
createTrainor() {
  this.loadingSubject.next(false)
  const url = `/providers/create-rep-job`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
createlocation() {
  this.loadingSubject.next(false)
  const url = `/inventory-settings/list-loc`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
}
