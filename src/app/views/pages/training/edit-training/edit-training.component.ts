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
  JobService
  
} from "../../../../core/erp";
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
  selector: 'kt-edit-training',
  templateUrl: './edit-training.component.html',
  styleUrls: ['./edit-training.component.scss']
})
export class EditTrainingComponent implements OnInit {

  item: Item;
  hasFormErrors1 = false;
 

  formX: FormGroup;
  

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
  pt_draw: any[] = [];
  pt_group: any[] = [];

  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];
  row_number;
  error = false;
  msg: String;

  isExist = false;

  jobs: [];
  columnDefinitions1: Column[] = [];
  gridOptions1: GridOption = {};
  gridObj1: any;
  angularGrid1: AngularGridInstance;

  title: String = 'Modifier Formation - '
  itemEdit: any
  ad_country: any[] = []
  pt_bom_code: any[] = []
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
    private jobService:JobService
  ) {
    config.autoClose = true;
    // this.prepareGrid();
   
    this.codeService
      .getBy({ code_fldname: "pt_draw" })
      .subscribe((response: any) => (this.pt_draw = response.data));
    
   
  }
  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.activatedRoute.params.subscribe((params) => {
      const id = params.id
      this.itemService.getOneDet(id).subscribe((response: any)=>{
        console.log(response.data)
        this.itemEdit = response.data
        this.mvdataset = response.data.itemDetails
       
         console.log(this.itemEdit)
         
         this.codeService
         .getBy({ code_fldname: "ad_country" })
         .subscribe((response: any) => (this.ad_country = response.data))
       this.codeService
         .getBy({ code_fldname: "pt_draw" })
         .subscribe((response: any) => (this.pt_draw = response.data));
         this.codeService
         .getBy({ code_fldname: "pt_group" })
         .subscribe((response: any) => (this.pt_group = response.data));
       this.codeService
         .getBy({ code_fldname: "pt_bom_code" })
         .subscribe((response: any) => (this.pt_bom_code = response.data));  
      
        this.initCode()
        this.loadingSubject.next(false)
        this.title = this.title + this.itemEdit.pt_part + " " + this.itemEdit.pt_desc1
       })
  })
  this.initmvGrid()

  }
  initCode() {
    this.createForm()
    this.loadingSubject.next(false)
}
  //create form
  createForm() {
    this.loadingSubject.next(false);
   
    this.formX = this.formBuilder.group({
      pt_part: [{value:this.itemEdit.pt_part,disabled:true },Validators.required],
      pt_desc1: [this.itemEdit.pt_desc1,Validators.required],
      pt_draw: [this.itemEdit.pt_draw, Validators.required],
      pt_group: [this.itemEdit.pt_group],
      pt_iss_pol: [this.itemEdit.pt_iss_pol],
      pt_critical: [this.itemEdit.pt_critical],
      pt_rollup: [this.itemEdit.pt_rollup],
      pt_phantom: [this.itemEdit.pt_phantom],
      pt_insp_rqd: [this.itemEdit.pt_insp_rqd],
      
      pt_origin: [this.itemEdit.pt_origin],
      pt_bom_code: [this.itemEdit.pt_bom_code],
      pt_shelflife: [this.itemEdit.pt_shelflife],
      pt_price: [this.itemEdit.pt_price],
      
     
      
    })
  
  }


  


//reste form
  //reste form
  reset() {
    this.item = new Item();
    this.createForm();
    this.mvdataset= []
    this.hasFormErrors1 = false;
  }
  // save data
  onSubmit() {
    console.log("hhhhhhhhhhhhhhhhhhhhhffhefbhefbebfhebf")
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
    console.log(this.mvdataset)
    this.addItem(item,this.mvdataset);
  }
  /**
   *
   * Returns object for saving
   */
  prepareItem(): Item {
    const controls  = this.formX.controls;
    
    const _item = new Item();
    _item.pt_part = controls.pt_part.value;
    _item.pt_desc1 = controls.pt_desc1.value;
    _item.pt_draw = controls.pt_draw.value;
    _item.pt_group = controls.pt_group.value;
    _item.pt_iss_pol = controls.pt_iss_pol.value;
    _item.pt_critical = controls.pt_critical.value;
    _item.pt_phantom = controls.pt_phantom.value;
    _item.pt_insp_rqd = controls.pt_insp_rqd.value;
    _item.pt_rollup = controls.pt_rollup.value;
    _item.pt_origin = controls.pt_origin.value;
    _item.pt_bom_code = controls.pt_bom_code.value;
    _item.pt_shelflife = controls.pt_shelflife.value;
    _item.pt_price = controls.pt_price.value;
    _item.pt_taxable = true;
    _item.pt_taxc = '19A';
    _item.pt_part_type = "FORMATION";
    _item.pt_um= "UN"
    _item.pt_buyer = controls.pt_draw.value;
    
    

    return _item;
  }
  /**
   * Add item
   *
   * @param _item: ItemModel
   */
  
    addItem(_item: any, details: any) {
      for (let data of details) {
        delete data.id;
        delete data.cmvid;
       
      }
      console.log(details)
      this.loadingSubject.next(true);
      let so = null;
      const controls = this.formX.controls;
  
      this.itemService
      .updateDet( {item:_item, details}, this.itemEdit.id).subscribe(
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
            this.layoutUtilsService.showActionNotification(
              "Ajout avec succès",
              MessageType.Create,
              10000,
              true,
              true
            );
            this.loadingSubject.next(false);
           // console.log(this.dataset);
          
            this.reset();
            this.loadingSubject.next(true);
            this.router.navigateByUrl("/training/gestion-de-formation");
            
     //       this.dataset = [];
          }
        );
    }
 
    
  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/training/gestion-de-formation`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  onchangedesc() {
    const controls = this.formX.controls
    document.getElementById("pt_draw").focus();
  
  }

  onchangedomain() {
    const controls = this.formX.controls
    this.codeService
      .getBy({ code_fldname: "pt_group",chr01:controls.pt_draw.value })
      .subscribe((response: any) => (this.pt_group = response.data));
    //document.getElementById("pt_group").focus();
  
  }

  initmvGrid() {
    this.mvcolumnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.mvangularGrid.gridService.deleteItem(args.dataContext);
          }
        },
      },
      // {
      //   id: "id",
      //   field: "id",
      //   name:"id",
      //   excludeFromHeaderMenu: true,
      //   minWidth: 30,
      //   maxWidth: 30,
        
      // },
      {
        id: "ptd_desc",
        name: "Désignation",
        field: "ptd_desc",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
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
        onCellChange: (e: Event, args: OnEventArgs) => {
          this.jobService.getBy({jb_code: args.dataContext.ptd_gol }).subscribe((response: any) => {
            console.log(response.data.job)
            if (!response.data.job) {
              alert("Métier N'existe pas");
              this.mvgridService.updateItemById(args.dataContext.id, { ...args.dataContext, ptd_gol: null });
            }
          });
         
          // this.dataView.getItemById(args.dataContext.id).meta
          // console.log(Object.keys(this.dataView))
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

    this.mvgridOptions = {
      asyncEditorLoading: false,
      editable: true,
      autoCommitEdit:true,
      enableAutoResize:true,
      rowHeight:40,
      // enableColumnPicker: true,
      enableCellNavigation: true,
     // enableRowSelection: true,
      autoHeight:false
    };

   // this.mvdataset = [];
  }
  addNewItem() {
    const newId = this.mvdataset.length+1;

    const newItem = {
      id: newId,
      ptd_desc: null,
      ptd_gol: null,
    };
    this.mvgridService.addItem(newItem, { position: "bottom" });
  }


  handleSelectedRowsChanged1(e, args) {
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj1) {
      args.rows.map((idx) => {
        const item = this.gridObj1.getDataItem(idx);
        console.log(item);
        
       
        updateItem.ptd_gol = item.jb_code;
  
       this.mvgridService.updateItem(updateItem);
       
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
  
}
