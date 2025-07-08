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

import {Code,
  CodeService,
  ItemModel,
  ItemModelService,
  LocationService,
  SiteService,
  ProductLineService,
  SequenceService,
  
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
  selector: 'kt-create-mod-bobine',
  templateUrl: './create-mod-bobine.component.html',
  styleUrls: ['./create-mod-bobine.component.scss']
})

export class CreateModBobineComponent implements OnInit {

  itemModel: ItemModel;
  hasFormErrors1 = false;
  code: Code
  form1: FormGroup;
  message = "";

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
  mic_inf:any;
  mic_sup:any;
  lai_inf:any;
  lai_sup:any;
  
  data: [];
  columnDefinitions3: Column[] = [];
  gridOptions3: GridOption = {};
  gridObj3: any;
  angularGrid3: AngularGridInstance;
  selectedField = "";
  fieldcode = "";
  sequences: [];
  columnDefinitionsseq: Column[] = [];
  gridOptionsseq: GridOption = {};
  gridObjseq: any;
  angularGridseq: AngularGridInstance;
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
    private sequenceService:SequenceService,
   
  ) {
    config.autoClose = true;
    
    this.codeService
      .getBy({ code_fldname: "pt_prod_line" })
      .subscribe((response: any) => (this.mod_prod_line = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_part_type",code_desc:'BOBINE' })
      .subscribe((response: any) => (this.mod_part_type = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_draw" })
      .subscribe((response: any) => (this.mod_draw = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_group", code_desc: 'cyl' })
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
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))   
    this.createForm();
    this.codeService
      .getBy({ code_fldname: 'MIC_INF' })
      .subscribe((response: any) => (this.mic_inf = Number(response.data[0].code_cmmt)));
      this.codeService
      .getBy({ code_fldname: 'MIC_SUP' })
      .subscribe((response: any) => (this.mic_sup = Number(response.data[0].code_cmmt)));
      this.codeService
      .getBy({ code_fldname: 'LAI_INF' })
      .subscribe((response: any) => (this.lai_inf = Number(response.data[0].code_cmmt)));
      this.codeService
      .getBy({ code_fldname: 'LAI_SUP' })
      .subscribe((response: any) => (this.lai_sup = Number(response.data[0].code_cmmt)));
  }
  reset() {
    this.itemModel = new ItemModel();
    this.createForm();
    this.hasFormErrors1 = false;
  
  }
  goBack() {
    this.loadingSubject.next(false);
    const url = `/articles/create-mod-bobine`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  
  createForm() {
    this.loadingSubject.next(false);
    this.itemModel = new ItemModel();
    this.code = new Code();
    this.form1 = this.formBuilder.group({
      mod_prod_line: [{value :'SF',disabled: true }, ],
      mod_part_type: [{value :this.itemModel.mod_part_type }, Validators.required ],
      // mod_group: [{value :this.itemModel.mod_group,disabled: !this.isExist }, Validators.required],
      int01: [{value :this.itemModel.int01},Validators.required],
      int02: [{value :this.itemModel.int02},Validators.required],
      mod_code: [{value :this.itemModel.mod_code,disabled: !this.isExist }],
      mod_desc: [{value :this.itemModel.mod_desc,disabled: !this.isExist }, ],
      mod_um: [{value :this.itemModel.mod_um,disabled: !this.isExist },],
      mod_buyer: [this.itemModel.mod_buyer],
      
      
      
    });
  }
  // onChangeCode() {
  
  //   const controls = this.form1.controls
    
  //   this.itemModelService
  //       .getByOne({
  //             mod_code:  controls.mod_code.value
  //       })
  //       .subscribe((response: any) => {
  //        console.log(response.data)
  //         if (response.data) {
  //           if()
  //           controls.mod_desc.setValue(response.data.mod_desc)
  //           controls.mod_um.setValue(response.data.mod_um)
  //           controls.mod_part_type.setValue(response.data.mod_part_type)
  //           // controls.mod_group.setValue(response.data.mod_group)
  //           controls.int01.setValue(response.data.int01)
  //           controls.int02.setValue(response.data.int02)
  //           controls.mod_desc.enable()
  //           controls.mod_um.enable()
  //           controls.mod_part_type.enable()
  //           // controls.mod_group.enable()
  //           controls.int01.enable()
  //           controls.int02.enable()
            
  //         } else {

  //             controls.mod_desc.enable()
  //             controls.mod_um.enable()
  //             controls.mod_part_type.enable()
  //             // controls.mod_group.enable()
  //             controls.int01.enable()
  //             controls.int02.enable()
  //         }
      
  //    })
  // }
  onChangemic() {
  
    const controls = this.form1.controls
    console.log(controls.int01.value)
    if(controls.int01.value < this.mic_inf || controls.int01.value > this.mic_sup )
    {
      controls.int01.setValue(0)
      this.message = 'la valeur Micronage est hors limite'
      this.hasFormErrors1 = true
      return
    }
  }
  onChangelai() {
  
    
    const controls = this.form1.controls
    console.log(controls.int02.value)
    
    if(controls.int02.value < this.lai_inf || controls.int02.value > this.lai_sup )
    {
      controls.int02.setValue(0)
      this.message = 'la valeur laise est hors limite'
      this.hasFormErrors1 = true
      return
    }
    this.itemModelService
        .getByOne({
              int01:  controls.int01.value,
              int02: controls.int02.value,
              mod_part_type : controls.mod_part_type.value
        })
        .subscribe((response: any) => {
         console.log(response.data)
          if (response.data != null) {
            controls.int02.setValue(0)
            this.message = 'un modèle existe pour cette configuration'
            this.hasFormErrors1 = true
            return
            
          } else {
              controls.mod_code.setValue('BOB-' + controls.mod_part_type.value + '-' + controls.int01.value + '/' + controls.int02.value )
              controls.mod_desc.setValue('BOBINE ' + controls.mod_part_type.value + ' ' + controls.int01.value + ' ' + controls.int02.value)
              controls.mod_um.setValue('KG')
              
             
          }
      
     })
  }
  // changePl() {
  //   const controls = this.form1.controls; // chof le champs hada wesh men form rah
  //   const pl_prod_line = controls.pt_prod_line.value;
  //   this.productLineService.getBy({ pl_prod_line }).subscribe(
  //     (res: any) => {
  //       const { data } = res;
  //       if (!data) {
  //         this.layoutUtilsService.showActionNotification(
  //           "cette Ligne de Produit n'existe pas!",
  //           MessageType.Create,
  //           10000,
  //           true,
  //           true
  //         );
  //         this.error = true;
  //       } else {
  //         this.error = false;
  //       }
  //     },
  //     (error) => console.log(error)
  //   );
  // }
 
  // changeSite() {
  //   const controls = this.form1.controls; // chof le champs hada wesh men form rah
  //   const si_site = controls.mod_site.value;
  //   this.siteService.getBy({ si_site }).subscribe(
  //     (res: any) => {
  //       const { data } = res;

  //       if (!data) {
  //         this.layoutUtilsService.showActionNotification(
  //           "ce Site n'existe pas!",
  //           MessageType.Create,
  //           10000,
  //           true,
  //           true
  //         );
  //         this.error = true;
  //       } else {
  //         this.error = false;
  //       }
  //     },
  //     (error) => console.log(error)
  //   );
  // }

  prepareItem(): ItemModel {
    const controls1 = this.form1.controls;
   

    const _itemModel = new ItemModel();
    _itemModel.mod_code = controls1.mod_code.value;
    _itemModel.mod_desc = controls1.mod_desc.value;
    _itemModel.mod_um = controls1.mod_um.value;
    _itemModel.mod_prod_line = 'SF';
    _itemModel.mod_part_type = controls1.mod_part_type.value;
    _itemModel.mod_draw = 'BOBINE';
    // _itemModel.mod_group = controls1.mod_group.value;
    _itemModel.mod_dsgn_grp = 'N/BROY';
    _itemModel.mod_origin = 'EXTRUSION';
    _itemModel.mod_drwg_loc = 'INTERNE';
    _itemModel.mod_status = 'SF-ACTIF';
    _itemModel.mod_abc = 'C';
    _itemModel.mod_site = '1000';
    _itemModel.mod_loc = 'EMPL PLAST2';
    _itemModel.mod_iss_pol = true;
    _itemModel.int01 = controls1.int01.value;
    _itemModel.int02 = controls1.int02.value;
    _itemModel.mod_buyer = controls1.mod_buyer.value;
    return _itemModel;
  }
  prepareCode(): Code {
    const controls = this.form1.controls
    const _code = new Code()
    _code.code_fldname = 'pt_article'
    _code.code_value = controls.mod_code.value
   _code.code_desc = 'DIMENSION'
    _code.code_cmmt = controls.mod_desc.value
    
    return _code
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

    // if(controls1.mod_site.value == "*") {
    //   alert("Site Erroné")
    //   return;

    // }
    if(controls1.mod_code.value == null){
      this.message = 'Veuillez saisir le code du modele'
      this.hasFormErrors1 = true
      return;
    }
    if(controls1.mod_um.value == null){
      this.message = 'Veuillez choisir une Unite de mesure'
      this.hasFormErrors1 = true
      return;
    }
    // if(controls1.mod_group.value == null){
    //   this.message = 'Veuillez choisir la quantite de silicone'
    //   this.hasFormErrors1 = true
    //   return;
    // }
    if(controls1.mod_part_type.value == null){
      this.message = 'Veuillez choisir un type article'
      this.hasFormErrors1 = true
      return;
    }
    if(controls1.int01.value == null){
      this.message = 'Veuillez saisir le micronage'
      this.hasFormErrors1 = true
      return;
    }
    if(controls1.int02.value == null){
      this.message = 'Veuillez saisir la laise'
      this.hasFormErrors1 = true
      return;
    }
    // tslint:disable-next-line:prefer-const
    let itemModel = this.prepareItem();
    this.addItem(itemModel);
    this.itemModelService
        .getByOne({
              mod_code:  controls1.mod_code.value
        })
        .subscribe((response: any) => {
         console.log(response.data)
          if (response.data) {
            console.log('code existe')
           
            
          } else {
            let address = this.prepareCode()
            this.addCode(address)
             
          }
      
     })
    
  }
  
  addItem(item: ItemModel) {
    this.loadingSubject.next(true);
    this.itemModelService.add(item).subscribe(
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
                this.reset()
                this.router.navigateByUrl("/articles/create-mod-bobine");
              }
            );
        
    
    
  }

   /**
     * Add code
     *
     * @param _code: CodeModel
     */
   addCode(_code: Code) {
    this.loadingSubject.next(true)
    this.codeService.add(_code).subscribe(
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
            // this.router.navigateByUrl("/code-mstr/codes-list")
            //this.reset()
        }
    )
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
  onAlertClose($event) {
    this.hasFormErrors1 = false;
   
  }
  handleSelectedRowsChangedseq(e, args) {
    const controls = this.form1.controls;
    if (Array.isArray(args.rows) && this.gridObjseq) {
      args.rows.map((idx) => {
        const item = this.gridObjseq.getDataItem(idx);
        controls.mod_buyer.setValue(item.seq_seq || "");
      });
    }
  }

  angularGridReadyseq(angularGrid: AngularGridInstance) {
    this.angularGridseq = angularGrid;
    this.gridObjseq = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridseq() {
    this.columnDefinitionsseq = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "seq_seq",
        name: "Code Sequence",
        field: "seq_seq",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "seq_desc",
        name: "Description",
        field: "seq_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "seq_appr1",
        name: "Approbateur 1",
        field: "seq_appr1",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "seq_appr2",
        name: "Approbateur 2",
        field: "seq_appr2",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "seq_appr3",
        name: "Approbateur 3",
        field: "seq_appr3",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionsseq = {
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
    this.sequenceService
      .getBy({seq_type:"RQ"})
      .subscribe((response: any) => (this.sequences = response.data));
  }
  openseq(content) {
    this.prepareGridseq();
    this.modalService.open(content, { size: "lg" });
  }
  changeSeq() {
    const controls = this.form1.controls; // chof le champs hada wesh men form rah
    const seq_seq = controls.mod_buyer.value;
    this.sequenceService.getBy({ seq_seq }).subscribe(
      (res: any) => {
        console.log(res.data)
        const { data } = res;
        if (res.data.length == 0) {
          controls.mod_buyer.setValue(null);
          document.getElementById("mod_buyer").focus();
         alert("Cette Sequence n'existe pas")
          this.error = true;
        } else {
          this.error = false;
        }
      },
      (error) => console.log(error)
    );
  }
}
