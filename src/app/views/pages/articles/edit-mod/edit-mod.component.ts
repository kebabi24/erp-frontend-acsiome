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
  FieldType,
  GridService,
} from "angular-slickgrid";

import {
  CodeService,
  ItemModel,
  ItemModelService,
  LocationService,
  SiteService,
  ProductLineService,
  
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
  selector: 'kt-edit-mod',
  templateUrl: './edit-mod.component.html',
  styleUrls: ['./edit-mod.component.scss']
})
export class EditModComponent implements OnInit {

  
  itemModel: ItemModel;
  hasFormErrors1 = false;

  form1: FormGroup;
  

  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  // slick grid
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];

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
  datapl: [];
  columnDefinitionspl: Column[] = [];
  gridOptionspl: GridOption = {};
  gridObjpl: any;
  gridServicepl: GridService;
  angularGridpl: AngularGridInstance;
  mod_prod_line: any[] = [];
  mod_part_type: any[] = [];
  mod_draw: any[] = [];
  mod_group: any[] = [];
  mod_dsgn_grp: any[] = [];
  mod_origin: any[] = [];
  mod_drwg_loc: any[] = [];
  
  row_number;
  error = false;
  msg: String;

  isExist = false;
  user: any
  
  
  data: [];
  columnDefinitions3: Column[] = [];
  gridOptions3: GridOption = {};
  gridObj3: any;
  angularGrid3: AngularGridInstance;
  selectedField = "";
  fieldcode = "";

  itemModelEdit: any
  title: String = 'Modifier Modele - '

  constructor(
    config: NgbDropdownConfig,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private codeService: CodeService,
    private siteService: SiteService,
    private locationService: LocationService,
    private itemModelService: ItemModelService,
    private productLineService: ProductLineService,
   
  ) {
    config.autoClose = true;
    
    this.codeService
      .getBy({ code_fldname: "pt_prod_line" })
      .subscribe((response: any) => (this.mod_prod_line = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_part_type" })
      .subscribe((response: any) => (this.mod_part_type = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_draw" })
      .subscribe((response: any) => (this.mod_draw = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_group" })
      .subscribe((response: any) => (this.mod_group = response.data));  
    this.codeService
      .getBy({ code_fldname: "pt_dsgn_grp" })
      .subscribe((response: any) => (this.mod_dsgn_grp = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_origin" })
      .subscribe((response: any) => (this.mod_origin = response.data));  
    this.codeService
      .getBy({ code_fldname: "pt_drwg_loc" })
      .subscribe((response: any) => (this.mod_drwg_loc = response.data));
      
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(true)
    this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.itemModelService.getOne(id).subscribe((response: any)=>{
          this.itemModelEdit = response.data
                  console.log(this.itemModelEdit.mod_code)
          //this.sctService.getByOne({sct_part: this.itemEdit.pt_part, sct_sim: 'STD-CG'}).subscribe((response: any)=>{
            //this.sct1Edit = response.data
                
           
            
          
           // this.sctService.getByOne({sct_part: this.itemEdit.pt_part, sct_sim: 'STD-CR'}).subscribe((response: any)=>{
           //       this.sct2Edit = response.data         
            
            this.initCode()
            this.loadingSubject.next(false)
            this.title = this.title + this.itemModelEdit.mod_code + " : "+ this.itemModelEdit.mod_desc
            console.log(this.title)
          //  })
          //})

        })
    })
  
  }
  initCode() {
    this.createForm()
    this.loadingSubject.next(false)
  }
  reset() {
    this.itemModel = new ItemModel();
    this.createForm();
    this.hasFormErrors1 = false;
  
  }
  goBack() {
    this.loadingSubject.next(false);
    const url = `/articles/update-mod`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  
  createForm() {
    this.loadingSubject.next(false);
   
    this.form1 = this.formBuilder.group({
      mod_code: [this.itemModelEdit.mod_code ,Validators.required],
      mod_desc: [this.itemModelEdit.mod_desc, Validators.required],
      mod_um: [this.itemModelEdit.mod_um, Validators.required],
      
      mod_prod_line: [this.itemModelEdit.mod_prod_line, Validators.required],
      mod_part_type: [this.itemModelEdit.mod_part_type, Validators.required],
      mod_draw: [this.itemModelEdit.mod_draw, Validators.required],
      mod_group: [this.itemModelEdit.mod_group, Validators.required],
      mod_dsgn_grp: [this.itemModelEdit.mod_dsgn_grp, Validators.required],
      mod_origin: [this.itemModelEdit.mod_origin, Validators.required],
      mod_drwg_loc: [this.itemModelEdit.mod_drwg_loc, Validators.required],
      mod_status: [this.itemModelEdit.mod_status, Validators.required],
      mod_abc: [this.itemModelEdit.mod_abc, Validators.required],
      mod_site: [this.itemModelEdit.mod_site, Validators.required],
      mod_loc: [this.itemModelEdit.mod_loc, Validators.required],
      mod_iss_pol: [this.itemModelEdit.mod_iss_pol],

      
    });
  }
  changePl() {
    const controls = this.form1.controls; // chof le champs hada wesh men form rah
    const pl_prod_line = controls.pt_prod_line.value;
    this.productLineService.getBy({ pl_prod_line }).subscribe(
      (res: any) => {
        const { data } = res;
        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "cette Ligne de Produit n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
        } else {
          this.error = false;
        }
      },
      (error) => console.log(error)
    );
  }
 
  changeSite() {
    const controls = this.form1.controls; // chof le champs hada wesh men form rah
    const si_site = controls.mod_site.value;
    this.siteService.getBy({ si_site }).subscribe(
      (res: any) => {
        const { data } = res;

        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "ce Site n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
        } else {
          this.error = false;
        }
      },
      (error) => console.log(error)
    );
  }

  prepareItem(): ItemModel {
    const controls1 = this.form1.controls;
   

    const _itemModel = new ItemModel();
    _itemModel.mod_code = controls1.mod_code.value;
    _itemModel.mod_desc = controls1.mod_desc.value;
    _itemModel.mod_um = controls1.mod_um.value;
    _itemModel.mod_prod_line = controls1.mod_prod_line.value;
    _itemModel.mod_part_type = controls1.mod_part_type.value;
    _itemModel.mod_draw = controls1.mod_draw.value;
    _itemModel.mod_group = controls1.mod_group.value;
    _itemModel.mod_dsgn_grp = controls1.mod_dsgn_grp.value;
    _itemModel.mod_origin = controls1.mod_origin.value;
    _itemModel.mod_drwg_loc = controls1.mod_drwg_loc.value;
    _itemModel.mod_status = controls1.mod_status.value;
    _itemModel.mod_abc = controls1.mod_abc.value;
    _itemModel.mod_site = controls1.mod_site.value;
    _itemModel.mod_loc = controls1.mod_loc.value;
    _itemModel.mod_iss_pol = controls1.mod_iss_pol.value;

    return _itemModel;
  }


  onSubmit() {
    this.hasFormErrors1 = false;
    
    const controls1 = this.form1.controls;


    /** check form */
    if (this.form1.invalid) {
      Object.keys(controls1).forEach((controlName) =>
        controls1[controlName].markAsTouched()
      );

      this.hasFormErrors1 = true;
      return;
    }
    if (this.error) {
      this.hasFormErrors1 = true;
      return;
    }

    if(controls1.mod_site.value == "*") {
      alert("Site Erroné")
      return;

    }
    // tslint:disable-next-line:prefer-const
    let itemModel = this.prepareItem();
    this.addItem(itemModel);
  }
  
  addItem(item: ItemModel) {
    this.loadingSubject.next(true);
    this.itemModelService.update(this.itemModelEdit.id, item).subscribe(
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
                  "Modification avec succès",
                  MessageType.Create,
                  10000,
                  true,
                  true
                );
                this.loadingSubject.next(false);
                this.reset()
                this.router.navigateByUrl("/articles/update-mod");
              }
            );
        
    
    
  }

  

  handleSelectedRowsChangedsite(e, args) {
    const controls1 = this.form1.controls;
  

    if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
      
            controls1.mod_site.setValue(item.si_site || "");
      });
    }
  }
  angularGridReadysite(angularGrid: AngularGridInstance) {
    this.angularGridsite = angularGrid;
    this.gridObjsite = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridsite() {
    this.columnDefinitionssite = [
      {
        id: "id",
        field: "id",
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,

        minWidth: 50,
        maxWidth: 50,
      },
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "si_site",
        name: "Site",
        field: "si_site",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "si_desc",
        name: "Designation",
        field: "si_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionssite = {
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
      checkboxSelector: {},
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };

    // fill the dataset with your data
    this.siteService
      .getAll()
      .subscribe((response: any) => (this.datasite = response.data));
  }
  opensite(contentsite) {
    this.prepareGridsite();
    this.modalService.open(contentsite, { size: "lg" });
  }
 
  handleSelectedRowsChanged3(e, args) {
    const controls1 = this.form1.controls;
    
    if (Array.isArray(args.rows) && this.gridObj3) {
      args.rows.map((idx) => {
        const item = this.gridObj3.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        switch (this.selectedField) {
          case "pt_status": {
            controls1.mod_status.setValue(item.code_value || "");
            break;
          }
          case "pt_um": {
            controls1.mod_um.setValue(item.code_value || "");
            break;
          }
         
          default:
            break;
        }
      });
    }
  }

  angularGridReady3(angularGrid: AngularGridInstance) {
    this.angularGrid3 = angularGrid;
    this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid3() {
    this.columnDefinitions3 = [
      {
        id: "id",
        field: "id",
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,

        minWidth: 50,
        maxWidth: 50,
      },
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "code_fldname",
        name: "Champs",
        field: "code_fldname",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "code_value",
        name: "Code",
        field: "code_value",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "code_cmmt",
        name: "Description",
        field: "code_cmmt",
        sortable: true,
        width: 200,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptions3 = {
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
      checkboxSelector: {},
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };

    // fill the dataset with your data
    this.codeService
      .getBy({ code_fldname: this.selectedField })
      .subscribe((response: any) => (this.data = response.data));
  }
  open3(content, field) {
    this.selectedField = field;
    this.prepareGrid3();
    this.modalService.open(content, { size: "lg" });
  }

  changeLoc() {
    const controls = this.form1.controls; // chof le champs hada wesh men form rah
    const loc_loc = controls.mod_loc.value;
    const loc_site = controls.mod_site.value;

    this.locationService.getBy({ loc_loc, loc_site }).subscribe(
      (res: any) => {
        const { data } = res;

        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "cet Emplacement n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
        } else {
          this.error = false;
        }
      },
      (error) => console.log(error)
    );
  }

  handleSelectedRowsChangedloc(e, args) {
    const controls1 = this.form1.controls;

    if (Array.isArray(args.rows) && this.gridObjloc) {
      args.rows.map((idx) => {
        const item = this.gridObjloc.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
            controls1.mod_loc.setValue(item.loc_loc || "");
      })   
    }
  }
  angularGridReadyloc(angularGrid: AngularGridInstance) {
    this.angularGridloc = angularGrid;
    this.gridObjloc = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridloc() {
    const controls1 = this.form1.controls;
    this.columnDefinitionsloc = [
      {
        id: "id",
        field: "id",
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,

        minWidth: 50,
        maxWidth: 50,
      },
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },

      {
        id: "loc_loc",
        name: "loc",
        field: "loc_loc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "loc_desc",
        name: "Designation",
        field: "loc_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionsloc = {
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
      checkboxSelector: {},
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };

    // fill the dataset with your data
    this.locationService
      .getBy({ loc_site: controls1.mod_site.value })
      .subscribe((response: any) => (this.dataloc = response.data));
  }
  openloc(contentloc) {
   
    this.prepareGridloc();
    this.modalService.open(contentloc, { size: "lg" });
  }

  changeStatus() {
    const controls = this.form1.controls; // chof le champs hada wesh men form rah

    let obj = {};
      
      const code_value = controls.mod_status.value;
      obj = {
        code_value,
        code_fldname: "pt_status",
      };
    
    this.codeService.getBy(obj).subscribe(
      (res: any) => {
        const { data } = res;
        const message = "Ce Status n'existe pas!";
        if (!data.length) {
          this.layoutUtilsService.showActionNotification(
            message,
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
        } else {
          this.error = false;
        }
      },
      (error) => console.log(error)
    );
  }
  changeUm() {
    const controls = this.form1.controls; // chof le champs hada wesh men form rah
    const code_fldname = controls.mod_um.value;
    this.codeService.getBy({ code_fldname }).subscribe(
      (res: any) => {
        const { data } = res;
        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "cette unite de mesure n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
        } else {
          this.error = false;
        }
      },
      (error) => console.log(error)
    );
  }




  handleSelectedRowsChangedpl(e, args) {
    const controls1 = this.form1.controls;
    if (Array.isArray(args.rows) && this.gridObjpl) {
      args.rows.map((idx) => {
        const item = this.gridObjpl.getDataItem(idx);
        controls1.mod_prod_line.setValue(item.pl_prod_line || "");
      });
    }
  }
  angularGridReadypl(angularGrid: AngularGridInstance) {
    this.angularGridpl = angularGrid;
    this.gridObjpl = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridpl() {
    this.columnDefinitionspl = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "pl_prod_line",
        name: "code ",
        field: "pl_prod_line",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pl_desc",
        name: "desc",
        field: "pl_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pl_taxc",
        name: "Taxe",
        field: "pl_taxc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionspl = {
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
    this.productLineService
      .getAll()
      .subscribe((response: any) => (this.datapl = response.data));
  }
  openpl(contentpl) {
    this.prepareGridpl();
    this.modalService.open(contentpl, { size: "lg" });
  }
}
