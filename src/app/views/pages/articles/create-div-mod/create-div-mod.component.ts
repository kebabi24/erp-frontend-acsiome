// Angular
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
 import { jsPDF } from "jspdf";
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
  selector: 'kt-create-div-mod',
  templateUrl: './create-div-mod.component.html',
  styleUrls: ['./create-div-mod.component.scss']
})
export class CreateDivModComponent implements OnInit {

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
  pt_buyer :any;
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
      .getBy({ code_fldname: "pt_group", code_desc:'INTRANT' })
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
      pt_group: [{value: this.item.pt_group,disabled: true },Validators.required ],
      
      

      pt_part: [{value:this.item.pt_part, disabled:true},Validators.required],
      pt_desc1: [{ value: this.item.pt_desc1, disabled: !this.isExist },Validators.required],
      pt_um: [{ value: this.item.pt_um, disabled: !this.isExist },Validators.required],

      pt_desc2: [{ value: this.item.pt_desc2, disabled: !this.isExist }],
      pt_price: [{ value: this.item.pt_price }],
      pt_plan_ord: [{ value: this.item.pt_plan_ord, disabled: !this.isExist }],
      pt_dea: [{ value: this.item.pt_dea, disabled: !this.isExist }],
      pt_prod_line: [{ value: this.item.pt_prod_line, disabled: !this.isExist },Validators.required],
      pt_part_type: [{ value: this.item.pt_part_type, disabled: !this.isExist },Validators.required],
      pt_draw: [{ value: this.item.pt_draw, disabled: !this.isExist },Validators.required],
     
      pt_bom_code: [{ value: this.item.pt_bom_code, disabled: !this.isExist }],
      pt_origin: [{ value: this.item.pt_origin, disabled: !this.isExist }],
      
      pt_dsgn_grp: [{ value: this.item.pt_dsgn_grp, disabled: !this.isExist }],
      pt_status: [{ value: this.item.pt_status, disabled: !this.isExist },Validators.required],
      
      
      
     
         
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
    
    
    
    let index = this.pt_group.findIndex(x => x.code_value == controls1.pt_group.value); 
    console.log(controls1.pt_article.value)
    this.codedesc = this.pt_group[index].code_desc
    const codecmmt = this.pt_group[index].code_cmmt
    this.itemService
        .getByOne({
            pt_article: controls1.pt_article.value,
            pt_group: controls1.pt_group.value,
            
        })
        .subscribe((response: any) => {
        console.log(response.data)
            if (response.data != null) {
                this.isExist = true
                
            } else {
             
              controls1.pt_group.enable()
              controls1.pt_article.disable()
              

            }
        })
}
// onChangequality() {
//   const controls1 = this.form1.controls
  
//     controls1.pt_group.setValue(null)

//   let index = this.pt_rev.findIndex(x => x.code_value == controls1.pt_rev.value); 

//   this.codedesc = this.pt_rev[index].code_desc
//   const codecmmt = this.pt_rev[index].code_cmmt
//   this.itemService
//       .getByOne({
//         pt_article: controls1.pt_article.value,
//         
//         pt_rev:controls1.pt_rev.value,
//         pt_group:controls1.pt_group.value
//       })
//       .subscribe((response: any) => {
//       console.log(response.data)
//           if (response.data != null) {
//               this.isExist = true
//               console.log(response.data)
//           } else {
           
            
           
            
//             controls1.pt_group.enable()
//             
          
      

//           }
//       })
// }
onChangecolor() {
  const controls1 = this.form1.controls
  
 controls1.pt_article.disable()
  
  this.itemService
      .getByOne({
        pt_article: controls1.pt_article.value,
        pt_group: controls1.pt_group.value,
       
      })
      .subscribe((itemresponse: any) => {
      console.log(itemresponse.data)
          if (itemresponse.data != null) {
              this.isExist = true
              console.log('article existe')
              controls1.pt_group.setValue(null)
              controls1.pt_group.enable()
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
            this.codeService.getBy({ code_fldname: 'pt_group',code_value: controls1.pt_group.value }).subscribe((coderesponse: any) => 
              { code_couleur = coderesponse.data[0].code_value, vitesse=Number(coderesponse.data[0].dec01)
                controls1.pt_um.setValue(modeleresponse.data.mod_um)
                controls1.pt_prod_line.setValue(modeleresponse.data.mod_prod_line)
                controls1.pt_part_type.setValue(modeleresponse.data.mod_part_type)
                controls1.pt_price.setValue(0)
                controls1.pt_draw.setValue(modeleresponse.data.mod_draw)
                controls1.pt_origin.setValue(modeleresponse.data.mod_origin)
                controls1.pt_bom_code.setValue('PF')
                controls1.pt_dsgn_grp.setValue(modeleresponse.data.mod_dsgn_grp)
                controls1.pt_status.setValue(modeleresponse.data.mod_status)
           this.pt_buyer = modeleresponse.data.mod_buyer
                controls1.pt_part.setValue(controls1.pt_article.value + code_couleur )
                controls1.pt_desc1.setValue(controls1.pt_draw.value + " "  + controls1.pt_group.value )
                controls1.pt_desc2.setValue(controls1.pt_draw.value +  " " + controls1.pt_group.value )
                controls1.pt_plan_ord.enable()
                controls1.pt_dea.enable()
                
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
    this.printpdf()
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
    
    _item.pt_dsgn_grp = controls1.pt_dsgn_grp.value;
    _item.pt_plan_ord = controls1.pt_plan_ord.value;
    _item.pt_dea = controls1.pt_dea.value;
    _item.pt_group = controls1.pt_group.value;
   _item.pt_buyer = this.pt_buyer;
    _item.pt_abc = 'C';
    _item.pt_site = '1000';
    _item.pt_loc = 'EMPL PLAST2';
    _item.pt_article = controls1.pt_article.value;
    _item.pt_price = controls1.pt_price.value;
    _item.pt_origin = controls1.pt_origin.value;
    _item.pt_bom_code = controls1.pt_bom_code.value;
    _item.pt_iss_pol = true;
    _item.pt_taxable = true;
    _item.pt_taxc = '19A';
    _item.pt_pm_code = 'P';
    _item.pt_ord_qty = 1;
    _item.pt_drwg_loc = 'INTERNE'
    _item.pt_added = new Date()

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
          controls.pt_group.setValue(null)
          controls.pt_group.enable()
          controls.pt_um.setValue(null)
          controls.pt_prod_line.setValue(null)
          controls.pt_part_type.setValue(null)
          controls.pt_price.setValue(0)
         
          controls.pt_draw.setValue(null)
            controls.pt_origin.setValue(null)
            controls.pt_bom_code.setValue(null)
            controls.pt_dsgn_grp.setValue(null)
            controls.pt_status.setValue(null)
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
      
      controls1.pt_group.setValue(null)
          controls1.pt_group.enable()
          controls1.pt_rev.disable()
          
            controls1.pt_um.setValue(null)
            controls1.pt_prod_line.setValue(null)
            controls1.pt_part_type.setValue(null)
            controls1.pt_price.setValue(0)
            controls1.pt_draw.setValue(null)
            controls1.pt_origin.setValue(null)
            controls1.pt_bom_code.setValue(null)
            controls1.pt_dsgn_grp.setValue(null)
            controls1.pt_status.setValue(null)
            controls1.int01.setValue(null)
            controls1.int02.setValue(null)
           controls1.int03.setValue(0)
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
      .getBy({mod_prod_line:'INTRANT'})
      .subscribe((response: any) => (this.datamod = response.data))
}
openmod(content) {
  this.prepareGridmod()
  this.modalService.open(content, { size: "lg" })
}
printpdf() {
          const controls = this.form1.controls;
          var doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            //format: [100,150]
            })
            let initialY = 25;
            doc.setLineWidth(0.2);
          
          var img = new Image();
          // img.src = "companylogo.png";
          // doc.addImage(img, "png", 150, 5, 50, 30);
          doc.setFontSize(14);
    
        
          const date = new Date()
doc.setFontSize(14);
    
          
          doc.setFont("Times-Roman");
          doc.line(35, 25, 150, 25);
          doc.line(35, 25, 35, 35);
          doc.text("Code Article : " + controls.pt_part.value, 40, initialY + 5);
          doc.line(35, 35, 150, 35);
          doc.line(150, 25, 150, 35); 
          
          doc.setFontSize(10);
          doc.line(5, 45, 200, 45);
          doc.line(5, 45, 5, 62);
          doc.text("Description: " + controls.pt_desc1.value, 7, initialY + 25);
          doc.text("Modèle: " + controls.pt_article.value, 7, initialY + 30);
          // doc.text("Couleur: " + controls.pt_break_cat.value, 55, initialY + 30);
          doc.text("Unité de mesure: " + controls.pt_um.value, 7, initialY + 35);
          doc.line(5, 62, 200, 62);
          doc.line(200, 45, 200, 62);
          
          // doc.text("Qualité: " + controls.pt_rev.value, 5, initialY + 25);
          doc.line(5, 65, 200, 65);
          doc.line(5, 65, 5, 82);
          
          doc.text("Categorie: " + controls.pt_prod_line.value, 7, initialY + 45);
          doc.text("Type: " + controls.pt_part_type.value, 55, initialY + 45);
          doc.text("Famille: " + controls.pt_draw.value, 7, initialY + 50);
          doc.text("Sous-Famille: " + controls.pt_group.value, 55, initialY + 50);
          doc.line(5, 82, 200, 82);
          doc.line(200, 65, 200, 82);
          
          // doc.text("Prix: " + controls.pt_price.value, 55, initialY + 30);
          doc.line(5, 85, 200, 85);
          doc.line(5, 85, 5, 102);
          
          doc.text("Formule: " + controls.pt_bom_code.value, 7, initialY + 65);
          doc.text("Origine: " + controls.pt_origin.value, 55, initialY + 65);
          // doc.text("Fournisseur: " + controls.pt_vend.value, 7, initialY + 70);
          // doc.text("Réference: " + controls.pt_model.value, 55, initialY + 70);
          doc.line(5, 102, 200, 102);
          doc.line(200, 85, 200, 102);
          
          // doc.text("Fournisseur: " + controls.pt_vend.value, 5, initialY + 80);
          doc.line(5, 105, 200, 105);
          doc.line(5, 105, 5, 122);
          
          doc.text("Forme: " + controls.pt_dsgn_grp.value, 7, initialY + 85);
          doc.text("Statut: " + controls.pt_status.value, 55, initialY + 85);
          doc.text("DA Obligatoire: " + controls.pt_plan_ord.value, 7, initialY + 90);
          doc.text("Achat: " + controls.pt_dea.value, 55, initialY + 90);
          doc.line(5, 122, 200, 122);
          doc.line(200, 105, 200, 122);
          
          // doc.text("Vitesse: " + controls.int03.value, 5, initialY + 55);
          // doc.text("Poids: " + controls.dec01.value, 55, initialY + 55);
      
      
          doc.setFontSize(9);
          
          doc.setFontSize(9);
    
     var i = 35
    
        
    
          
            var blob = doc.output("blob");
            window.open(URL.createObjectURL(blob));   
          }
}
