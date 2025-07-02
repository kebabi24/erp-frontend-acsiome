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
  Formatters,
  FieldType,
  GridService,
} from "angular-slickgrid";

import {
  CodeService,
  Item,
  ItemService,
  LocationService,
  SiteService,
  SequenceService,
  ProductLineService,
  ProviderService,
  MesureService,
  CostSimulation,
  CostSimulationService,
  InventoryStatusService,
  TaxeService,
  ItemModelService,
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
  selector: 'kt-create-Bobine-mod',
  templateUrl: './create-Bobine-mod.component.html',
  styleUrls: ['./create-Bobine-mod.component.scss']
})
export class CreateBobineModComponent implements OnInit {

  item: Item;
  hasFormErrors1 = false;
  

  form1: FormGroup;
  

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
  pt_part_type: any;
  pt_break_cat: any;
  pt_draw: any;
  pt_rev: any;
  pt_group: any;
  pt_drwg_loc: any[] = [];
  pt_drwg_size: any[] = [];
  pt_abc: any[] = [];
  pt_loc_type: any[] = [];
  pt_ship_wt_um: any[] = [];
  pt_net_wt_um: any[] = [];
  pt_fr_class: any[] = [];
  pt_size_um: any[] = [];

  pt_pm_code: any[] = [];
  pt_run_seq1: any[] = [];
  pt_run_seq2: any[] = [];
  pt_promo: any[] = [];

  data: [];
  columnDefinitions3: Column[] = [];
  gridOptions3: GridOption = {};
  gridObj3: any;
  angularGrid3: AngularGridInstance;
  selectedField = "";
  fieldcode = "";

  datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;

  datatax: []
  columnDefinitionstax: Column[] = []
  gridOptionstax: GridOption = {}
  gridObjtax: any
  angularGridtax: AngularGridInstance


  dataloc: [];
  columnDefinitionsloc: Column[] = [];
  gridOptionsloc: GridOption = {};
  gridObjloc: any;
  angularGridloc: AngularGridInstance;

  datastatus: [];
  columnDefinitionsstatus: Column[] = [];
  gridOptionsstatus: GridOption = {};
  gridObjstatus: any;
  angularGridstatus: AngularGridInstance;

  datapl: [];
  columnDefinitionspl: Column[] = [];
  gridOptionspl: GridOption = {};
  gridObjpl: any;
  gridServicepl: GridService;
  angularGridpl: AngularGridInstance;

  datamod: [];
  columnDefinitionsmod: Column[] = [];
  gridOptionsmod: GridOption = {};
  gridObjmod: any;
  angularGridmod: AngularGridInstance;

  row_number;
  error = false;
  msg: String;

  isExist = false;
  codedesc: any;
  sct1: CostSimulation;
  sct2: CostSimulation;

  sctForm: FormGroup;
  sctForm1: FormGroup;

  model : any
  constructor(
    config: NgbDropdownConfig,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private codeService: CodeService,
    private sctService: CostSimulationService,
    private siteService: SiteService,
    private locationService: LocationService,
    private productLineService: ProductLineService,
    private providerService: ProviderService,
    private itemService: ItemService,
    private sequenceService: SequenceService,
    private mesureService: MesureService,
    private taxService: TaxeService,
    private inventoryStatusService: InventoryStatusService,
    private itemModelService: ItemModelService,
  ) {
    config.autoClose = true;
    this.prepareGrid();
    this.prepareGrid2();
    this.codeService
      .getBy({ code_fldname: "pt_break_cat" })
      .subscribe((response: any) => (this.pt_break_cat = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_rev" })
      .subscribe((response: any) => (this.pt_rev = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_group", code_desc:'cyl' })
      .subscribe((response: any) => (this.pt_group = response.data));

  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.createForm();
  }
  prepareGrid() {
    this.columnDefinitions = [
      {
        id: "elemet",
        name: "Element",
        field: "element",
        sortable: true,
        editor: {
          model: Editors.text,
          required: true,
        },
      },
      {
        id: "this_level",
        name: "Ce niveau",
        field: "thisLevel",
        sortable: true,
      },
      {
        id: "inf_level",
        name: "Niveau inf",
        field: "infLevel",
        sortable: true,
      },
      { id: "total", name: "Total", field: "Total" },
      {
        id: "pri",
        name: "Pri",
        field: "pri",
        formatter: myCustomCheckmarkFormatter,
      },
      { id: "cate", name: "Categorie", field: "category" },
      {
        id: "sur",
        name: "Sur",
        field: "sur",
        formatter: myCustomCheckmarkFormatter,
      },
    ];

    this.gridOptions = {
      enableSorting: true,
      editable: true,
      enableCellNavigation: true,
      asyncEditorLoading: false,
      autoEdit: true,
    };

    // fill the dataset with your data
    this.dataset = [
      // {
      //     id: 1,
      //     element: "aa",
      //     thisLevel: "0.0",
      //     infLevel: "1",
      //     total: "1",
      //     pri: "",
      //     category: "",
      //     sur: "",
      // },
    ];
  }
  prepareGrid2() {
    this.columnDefinitions2 = [
      {
        id: "Matiere",
        name: "Matiere",
        field: "matiere",
        sortable: true,
        editor: {
          model: Editors.text,
          required: true,
        },
      },
      {
        id: "Main d'œuvre",
        name: "Main d'œuvre",
        field: "oeuvre",
        sortable: true,
      },
      {
        id: "FG variable",
        name: "FG variable",
        field: "fg_v",
        sortable: true,
      },
      { id: "FG Fixes", name: "FG Fixes", field: "fg_f" },
      {
        id: "SS-trail",
        name: "SS-trail",
        field: "SS-trail",
      },
    ];

    this.gridOptions2 = {
      enableSorting: true,
      editable: true,
      enableCellNavigation: true,
      asyncEditorLoading: false,
      autoEdit: true,
    };

    // fill the dataset with your data
    this.dataset2 = [];
  }
  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.item = new Item();
    this.form1 = this.formBuilder.group({
      pt_article: [ this.item.pt_article, Validators.required],
      pt_break_cat: [{value: this.item.pt_break_cat,disabled: true },Validators.required ],
      pt_rev: [{ value: this.item.pt_rev, disabled: !this.isExist }],
      pt_group: [{ value: this.item.pt_group, disabled: !this.isExist }],

      pt_part: [{value:this.item.pt_part, disabled:true}],
      pt_desc1: [{ value: this.item.pt_desc1, disabled: !this.isExist },Validators.required],
      pt_um: [{ value: this.item.pt_um, disabled: !this.isExist },Validators.required],

      pt_desc2: [{ value: this.item.pt_desc2, disabled: !this.isExist }],
      pt_price: [{ value: this.item.pt_price }],
      pt_plan_ord: [{ value: this.item.pt_plan_ord, disabled: !this.isExist }],
      pt_dea: [{ value: this.item.pt_dea, disabled: !this.isExist }],
      
      pt_prod_line: [{ value: this.item.pt_prod_line, disabled: !this.isExist },Validators.required],
      pt_part_type: [{ value: this.item.pt_part_type, disabled: !this.isExist },Validators.required],
      pt_draw: [{ value: 'BOBINE', disabled: !this.isExist },Validators.required],
      pt_bom_code: [{ value: this.item.pt_bom_code, disabled: !this.isExist }],
      pt_origin: [{ value: this.item.pt_origin, disabled: !this.isExist }],
      pt_vend: [{ value: this.item.pt_vend, disabled: !this.isExist }],
      pt_dsgn_grp: [{ value: this.item.pt_dsgn_grp, disabled: !this.isExist }],
      pt_status: [{ value: this.item.pt_status, disabled: !this.isExist },Validators.required],
      int01: [{ value: this.item.int01, disabled: !this.isExist }],
      int02: [{ value: this.item.int02, disabled: !this.isExist }],
      int03: [{ value: this.item.int03, disabled: !this.isExist }],
      dec01:[{ value: this.item.dec01, disabled: !this.isExist }],
      
     
         
    });
    
   
   

    
   
    this.sct1 = new CostSimulation();
    // this.sctForm = this.formBuilder.group({
    //   sct_mtl_tl: [0],
    //   sct_mtl_ll: [0],
    //   sct_lbr_tl: [0],
    //   sct_lbr_ll: [0],
    //   sct_bdn_tl: [0],
    //   sct_bdn_ll: [0],
    //   sct_ovh_tl: [0],
    //   sct_ovh_ll: [0],
    //   sct_sub_tl: [0],
    //   sct_sub_ll: [0],
    // });
    // this.sctForm1 = this.formBuilder.group({
    //   sct_mtl_tl: [0],
    //   sct_mtl_ll: [0],
    //   sct_lbr_tl: [0],
    //   sct_lbr_ll: [0],
    //   sct_bdn_tl: [0],
    //   sct_bdn_ll: [0],
    //   sct_ovh_tl: [0],
    //   sct_ovh_ll: [0],
    //   sct_sub_tl: [0],
    //   sct_sub_ll: [0],
    // });
  }




  onChangeCode() {
    const controls1 = this.form1.controls
    
    controls1.pt_rev.setValue(null)
    controls1.pt_group.setValue(null)
    let index = this.pt_break_cat.findIndex(x => x.code_value == controls1.pt_break_cat.value); 
console.log(controls1.pt_article.value)
    this.codedesc = this.pt_break_cat[index].code_desc
    const codecmmt = this.pt_break_cat[index].code_cmmt
    this.itemService
        .getByOne({
            pt_article: controls1.pt_article.value,
            pt_break_cat: controls1.pt_break_cat.value,
            pt_rev:controls1.pt_rev.value,
            pt_group:controls1.pt_group.value
        })
        .subscribe((response: any) => {
        console.log(response.data)
            if (response.data != null) {
                this.isExist = true
                
            } else {
             
              controls1.pt_rev.enable()
              controls1.pt_article.disable()
              

            }
        })
}
onChangequality() {
  const controls1 = this.form1.controls
  
    controls1.pt_group.setValue(null)

  let index = this.pt_rev.findIndex(x => x.code_value == controls1.pt_rev.value); 

  this.codedesc = this.pt_rev[index].code_desc
  const codecmmt = this.pt_rev[index].code_cmmt
  this.itemService
      .getByOne({
        pt_article: controls1.pt_article.value,
        pt_break_cat: controls1.pt_break_cat.value,
        pt_rev:controls1.pt_rev.value,
        pt_group:controls1.pt_group.value
      })
      .subscribe((response: any) => {
      console.log(response.data)
          if (response.data != null) {
              this.isExist = true
              console.log(response.data)
          } else {
           
            
           
            
            controls1.pt_group.enable()
            controls1.pt_break_cat.disable()
          
      

          }
      })
}
onChangesilicone() {
  const controls1 = this.form1.controls
  
 controls1.pt_rev.disable()
  
  this.itemService
      .getByOne({
        pt_article: controls1.pt_article.value,
        pt_break_cat: controls1.pt_break_cat.value,
        pt_rev:controls1.pt_rev.value,
        pt_group:controls1.pt_group.value
      })
      .subscribe((itemresponse: any) => {
      console.log(itemresponse.data)
          if (itemresponse.data != null) {
              this.isExist = true
              console.log('article existe')
              controls1.pt_group.setValue(null)
              controls1.pt_rev.setValue(null)
              controls1.pt_break_cat.setValue(null)
              controls1.pt_break_cat.enable()
          } else {
            this.itemModelService
        .getByOne({
              mod_code:  controls1.pt_article.value
        })
        .subscribe((modeleresponse: any) => {
         console.log(modeleresponse.data)
          if (modeleresponse.data) {
            console.log(modeleresponse.data.mod_part_type)
            let code_couleur:any;
            let code_silicone:any;
            let vitesse:any;
           
            this.codeService.getBy({ code_fldname: 'pt_break_cat',code_value: controls1.pt_break_cat.value }).subscribe((coderesponse: any) => 
              { code_couleur = coderesponse.data[0].code_desc, vitesse=Number(coderesponse.data[0].dec01)
                this.codeService.getBy({ code_fldname: 'pt_group',code_value: controls1.pt_group.value }).subscribe((coderesponse: any) => {code_silicone = coderesponse.data[0].chr01
                  console.log(code_couleur, code_silicone)
            controls1.pt_um.setValue(modeleresponse.data.mod_um)
            controls1.pt_prod_line.setValue(modeleresponse.data.mod_prod_line)
            controls1.pt_part_type.setValue(modeleresponse.data.mod_part_type)
            controls1.pt_price.setValue(0)
            controls1.pt_draw.setValue('BOBINE')
            controls1.pt_origin.setValue('EXTRUSION')

            controls1.pt_bom_code.setValue('F' + controls1.pt_rev.value)
            controls1.pt_dsgn_grp.setValue(modeleresponse.data.mod_dsgn_grp)
            controls1.pt_status.setValue('SF-ACTIF')
            controls1.int01.setValue(modeleresponse.data.int01)
            controls1.int02.setValue(modeleresponse.data.int02)
            if(Number(modeleresponse.data.int01) == 110 || Number(modeleresponse.data.int01) == 152){vitesse = 380}
            controls1.int03.setValue(vitesse)
            controls1.dec01.setValue(700)
            controls1.pt_part.setValue(controls1.pt_article.value + '-F' + controls1.pt_rev.value + "-" + code_couleur + "-" + code_silicone)
            controls1.pt_desc1.setValue(modeleresponse.data.mod_desc + " QUALITE " + controls1.pt_rev.value + " " + controls1.pt_break_cat.value + " " + controls1.pt_group.value)
            controls1.pt_desc2.setValue(controls1.pt_draw.value + " " + controls1.pt_part_type.value + " " + controls1.pt_article.value + " " + controls1.pt_break_cat.value + " " + controls1.pt_group.value)
            controls1.pt_part.enable()
            controls1.pt_desc1.enable()
            controls1.pt_desc2.enable()
            controls1.pt_plan_ord.enable()
            controls1.pt_dea.enable()
            
            
                });
              });
            
  
          } else {

            console.log ('code modele existe pas')
          }
      
     })
           
           
            
           
            
            
         
          
      

          }
      })
}
onAlertClose($event) {
  this.hasFormErrors1 = false;
  this.isExist = false;
}

  //reste form
  reset() {
    this.item = new Item();
    this.createForm();
    this.hasFormErrors1 = false;
    
  }
  // save data
  onSubmit() {
    this.hasFormErrors1 = false;
    ;
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
    // tslint:disable-next-line:prefer-const
    let item = this.prepareItem();
    
    let sct1 = this.prepareSct1();
    let sct2 = this.prepareSct2();
    let sct3 = this.prepareSct3()
    
    this.addItem(item, sct1, sct2, sct3);
   
  }
  /**
   *
   * Returns object for saving
   */
  prepareItem(): Item {
    const controls1 = this.form1.controls;
    

    const _item = new Item();
    _item.pt_part = controls1.pt_part.value;
    _item.pt_desc1 = controls1.pt_desc1.value;
    _item.pt_desc2 = controls1.pt_desc2.value;
    _item.pt_um = controls1.pt_um.value;
    _item.pt_prod_line = controls1.pt_prod_line.value;
    _item.pt_part_type = controls1.pt_part_type.value;
    _item.pt_draw = controls1.pt_draw.value;
    _item.pt_status = controls1.pt_status.value;
    _item.pt_rev = controls1.pt_rev.value;
    _item.pt_dsgn_grp = controls1.pt_dsgn_grp.value;
    _item.pt_group = controls1.pt_group.value;
    _item.pt_break_cat = controls1.pt_break_cat.value;
    _item.pt_abc = 'C';
    _item.pt_site = '1000';
    _item.pt_loc = 'EMPL PLAST2';
    _item.pt_article = controls1.pt_article.value;
    _item.pt_price = controls1.pt_price.value;
    _item.pt_plan_ord = controls1.pt_plan_ord.value;
    _item.pt_dea = controls1.pt_dea.value;
    _item.pt_origin = controls1.pt_origin.value;
    _item.pt_vend = controls1.pt_vend.value;
    _item.pt_bom_code = controls1.pt_bom_code.value;
    _item.int01 = controls1.int01.value;
    _item.int02 = controls1.int02.value;
    _item.int03 = controls1.int03.value;
    _item.dec01 = controls1.dec01.value;
    _item.pt_iss_pol = true;
    _item.pt_taxable = true;
    _item.pt_taxc = '19A';
    _item.pt_pm_code = 'M';


    return _item;
  }
  
  /**
   * Add item
   *
   * @param _item: ItemModel
   */
  addItem(item: Item, sct1: CostSimulation, sct2: CostSimulation,sct3:CostSimulation) {
    this.loadingSubject.next(true);
    this.itemService.add(item).subscribe(
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
                this.sctService.add(sct3).subscribe(
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
                  this.router.navigateByUrl("/articles/list");
                })
              }
            );
          }
        );
      }
    );
  }

  prepareSct1(): CostSimulation {
    // const controls = this.sctForm.controls;
    const control1 = this.form1.controls;
    const _sct = new CostSimulation();
    
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
    _sct.sct_site     = '1000';

    return _sct;
  }

  prepareSct2(): CostSimulation {
    // const controls = this.sctForm1.controls;
    const control1 = this.form1.controls;
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
    _sct.sct_site    = '1000';
    return _sct;
  }
  prepareSct3(): CostSimulation {
    // const controls = this.sctForm.controls;
    const control1 = this.form1.controls;
    const _sct = new CostSimulation();
    
    _sct.sct_sim      = 'init'
    _sct.sct_part     = control1.pt_part.value ;
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
    _sct.sct_site     = '1000';

    return _sct;
  }

 

  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/articles/list`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  changeUm() {
    const controls = this.form1.controls; // chof le champs hada wesh men form rah
    const um_um = controls.pt_um.value;
    this.mesureService.getBy({ um_um }).subscribe(
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
  changemod() {
    const controls = this.form1.controls; // chof le champs hada wesh men form rah
    const mod_code = controls.pt_article.value;
    this.itemModelService.getBy({ mod_code}).subscribe(
      (res: any) => {
        const { data } = res;
        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "ce Modèle n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
        } else {
          this.error = false;
          this.model = data
          console.log(this.model,'model')
          controls.pt_break_cat.setValue(null)
          controls.pt_break_cat.enable()
          controls.pt_rev.disable()
          controls.pt_group.disable()
            controls.pt_um.setValue(null)
            controls.pt_prod_line.setValue(null)
            controls.pt_part_type.setValue(null)
            controls.pt_price.setValue(0)
            controls.pt_draw.setValue('BOBINE')
            controls.pt_origin.setValue('EXTRUSION')
            controls.pt_bom_code.setValue(null)
            controls.pt_dsgn_grp.setValue(null)
            controls.pt_status.setValue('SF-ACTIF')
            controls.int01.setValue(null)
            controls.int02.setValue(null)
           controls.int03.setValue(0)
           controls.dec01.setValue(0)
            controls.pt_part.setValue(null)
            controls.pt_desc1.setValue(null)
            controls.pt_desc2.setValue(null)
            controls.pt_part.disable()
            controls.pt_desc1.disable()
            controls.pt_desc2.disable()
        }
      },
      (error) => console.log(error)
    );
  }
  
  changeCode(field) {
    const controls = this.form1.controls; // chof le champs hada wesh men form rah

    let obj = {};
    if (field == "pt_status") {
      this.msg = " Status ";
      const code_value = controls.pt_status.value;
      obj = {
        code_value,
        code_fldname: field,
      };
    }
    if (field == "pt_dsgn_grp") {
      this.msg = " Groupe Etude ";
      const code_value = controls.pt_dsgn_grp.value;
      obj = {
        code_value,
        code_fldname: field,
      };
    }

    this.codeService.getBy(obj).subscribe(
      (res: any) => {
        const { data } = res;
        const message = "Ce code" + this.msg + " n'existe pas!";
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

  changeStatus(field) {
    const controls = this.form1.controls; // chof le champs hada wesh men form rah

    let is_status: any;
    if (field == "pt_rctpo_status") {
      this.msg = " Status reception OA ";
       is_status = controls.pt_rctpo_status.value;
      
    }
    if (field == "pt_rctwo_status") {
      this.msg = " Status Reception WO ";
       is_status = controls.pt_rctwo_status.value;
      
    }

    this.inventoryStatusService.getBy({is_status}).subscribe(
      (res: any) => {
        const { data } = res;
        const message = "Ce code" + this.msg + " n'existe pas!";
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

  changeSite() {
    const controls = this.form1.controls; // chof le champs hada wesh men form rah
    const si_site = controls.pt_site.value;
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

 

  changeLoc() {
    const controls = this.form1.controls; // chof le champs hada wesh men form rah
    const loc_loc = controls.pt_loc.value;
    const loc_site = controls.pt_site.value;

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

  handleSelectedRowsChanged3(e, args) {
    const controls1 = this.form1.controls;
    

    if (Array.isArray(args.rows) && this.gridObj3) {
      args.rows.map((idx) => {
        const item = this.gridObj3.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        switch (this.selectedField) {
          case "pt_status": {
            controls1.pt_status.setValue(item.code_value || "");
            break;
          }
          case "pt_dsgn_grp": {
            controls1.pt_dsgn_grp.setValue(item.code_value || "");
            break;
          }
          case "pt_um": {
            controls1.pt_um.setValue(item.code_value || "");
            break;
          }
          
          default:
            break;
        }
      });
    }
  }


  handleSelectedRowsChangedstatus(e, args) {
    const controls1 = this.form1.controls;
    
    if (Array.isArray(args.rows) && this.gridObjstatus) {
      args.rows.map((idx) => {
        const item = this.gridObjstatus.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        switch (this.selectedField) {
          case "pt_rctpo_status": {
            controls1.pt_rctpo_status.setValue(item.is_status || "");
            break;
          }
          case "pt_rctwo_status": {
            controls1.pt_rctwo_status.setValue(item.is_status || "");
            break;
          }
          
          default:
            break;
        }
      });
    }
  }

  handleSelectedRowsChangedsite(e, args) {
    const controls1 = this.form1.controls;
    

    if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        switch (this.selectedField) {
          case "pt_site": {
            controls1.pt_site.setValue(item.si_site || "");
            break;
          }
          
          default:
            break;
        }
      });
    }
  }
  handleSelectedRowsChangedpl(e, args) {
    const controls1 = this.form1.controls;
    if (Array.isArray(args.rows) && this.gridObjpl) {
      args.rows.map((idx) => {
        const item = this.gridObjpl.getDataItem(idx);
        controls1.pt_prod_line.setValue(item.pl_prod_line || "");
      });
    }
  }
  handleSelectedRowsChangedloc(e, args) {
    const controls1 = this.form1.controls;

    if (Array.isArray(args.rows) && this.gridObjloc) {
      args.rows.map((idx) => {
        const item = this.gridObjloc.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        switch (this.selectedField) {
          case "pt_loc": {
            controls1.pt_loc.setValue(item.loc_loc || "");
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
  opensite(contentsite, field) {
    this.selectedField = field;
    this.prepareGridsite();
    this.modalService.open(contentsite, { size: "lg" });
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
      .getBy({ loc_site: controls1.pt_site.value })
      .subscribe((response: any) => (this.dataloc = response.data));
  }
  openloc(contentloc, field) {
    this.selectedField = field;
    this.prepareGridloc();
    this.modalService.open(contentloc, { size: "lg" });
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

  angularGridReadystatus(angularGrid: AngularGridInstance) {
    this.angularGridstatus = angularGrid;
    this.gridObjstatus = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridstatus() {
    this.columnDefinitionsstatus = [
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
        id: "is_status",
        name: "Status",
        field: "is_status",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "is_desc",
        name: "Designation",
        field: "is_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "is_avail",
        name: "Disponible",
        field: "is_avail",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "is_nettable",
        name: "Gerer MRP",
        field: "is_nettable",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "is_overissue",
        name: "Sortie Excedent",
        field: "is_overissue",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },


    ];

    this.gridOptionsstatus = {
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
    this.inventoryStatusService
      .getAll()
      .subscribe((response: any) => (this.datastatus = response.data));
  }
  openstatus(content, field) {
    this.selectedField = field;
    this.prepareGridstatus();
    this.modalService.open(content, { size: "lg" });
  }




handleSelectedRowsChangedmod(e, args) {
  const controls1 = this.form1.controls;
  if (Array.isArray(args.rows) && this.gridObjmod) {
    args.rows.map((idx) => {
      const item = this.gridObjmod.getDataItem(idx);
      
      controls1.pt_article.setValue(item.mod_code || "");
      this.model = item
      console.log(controls1.pt_article.value)
      
      controls1.pt_break_cat.setValue(null)
          controls1.pt_break_cat.enable()
          controls1.pt_rev.disable()
          controls1.pt_group.disable()
            controls1.pt_um.setValue(null)
            controls1.pt_prod_line.setValue(null)
            controls1.pt_part_type.setValue(null)
            controls1.pt_price.setValue(0)
            controls1.pt_draw.setValue('BOBINE')
            controls1.pt_origin.setValue('EXTRUSION')
            controls1.pt_bom_code.setValue(null)
            controls1.pt_dsgn_grp.setValue(null)
            controls1.pt_status.setValue('SF-ACTIF')
            controls1.int01.setValue(null)
            controls1.int02.setValue(null)
           controls1.int03.setValue(0)
           controls1.dec01.setValue(0)
            controls1.pt_part.setValue(null)
            controls1.pt_desc1.setValue(null)
            controls1.pt_desc2.setValue(null)
            controls1.pt_part.disable()
            controls1.pt_desc1.disable()
            controls1.pt_desc2.disable()
    });
  }
}


angularGridReadymod(angularGrid: AngularGridInstance) {
  this.angularGridmod = angularGrid
  this.gridObjmod = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridmod() {
  this.columnDefinitionsmod = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 30,
    },
    {
      id: "mod_code",
      name: "Code Model",
      field: "mod_code",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      minWidth: 100,
    },
   
    {
      id: "mod_desc",
      name: "Description",
      field: "mod_desc",
      sortable: true,
      filterable: true,
      minWidth: 250,
      type: FieldType.string,
    },
    {
      id: "mod_um",
      name: "UM",
      field: "mod_um",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      minWidth: 80,
    },
    {
      id: "mod_prod_line",
      name: "Famille",
      field: "mod_prod_line",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      minWidth: 100,
    },
    {
      id: "mod_part_type",
      name: "Type ",
      field: "mod_part_type",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      minWidth: 100,
    },
    {
      id: "mod_draw",
      name: "Catégorie",
      field: "mod_draw",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      minWidth: 100,
    },

    {
      id: "mod_group",
      name: "Groupe",
      field: "mod_group",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      minWidth: 100,
    },
    
    {
      id: "mod_dsgn_grp",
      name: "Forme Géometrique",
      field: "mod_dsgn_grp",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      minWidth: 80,
    },
    {
      id: "mod_origin",
      name: "Origin",
      field: "mod_origin",
      sortable: true,
      filterable: true,
      // type: FieldType.text,
      minWidth: 80,
    },
    
         {
      id: "mod_drwg_loc",
      name: "Source",
      field: "mod_drwg_loc",
      sortable: true,
      filterable: true,
      // type: FieldType.text,
      minWidth: 80,
    },

    {
      id: "mod_status",
      name: "Statut",
      field: "mod_status",
      sortable: true,
      filterable: true,
      // type: FieldType.text,
      minWidth: 80,
    },
    {
      id: "mod_abc",
      name: "Classe ABC",
      field: "mod_abc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      minWidth: 80,
    },
   
    {
      id: "mod_site",
      name: "Site",
      field: "mod_site",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      minWidth: 80,
    },
    {
      id: "mod_loc",
      name: "Emplacement",
      field: "mod_loc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      minWidth: 80,
    },
    
    {
      id: "mod_iss_pol",
      name: "Scan",
      field: "mod_iss_pol",
      sortable: true,
      filterable: true,
      type: FieldType.boolean,
      formatter: Formatters.checkmark,
      minWidth: 80,
    },
  ]

  this.gridOptionsmod = {
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
  }

  // fill the dataset with your data
  this.itemModelService
      .getBy({mod_draw:'BOBINE'})
      .subscribe((response: any) => (this.datamod = response.data))
}
openmod(content) {
  this.prepareGridmod()
  this.modalService.open(content, { size: "lg" })
}

}
