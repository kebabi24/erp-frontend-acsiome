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
  selector: 'kt-create-spec',
  templateUrl: './create-spec.component.html',
  styleUrls: ['./create-spec.component.scss']
})
export class CreateSpecComponent implements OnInit {

  item: Item;
  hasFormErrors1 = false;
  hasFormErrors2 = false;
  hasFormErrors3 = false;
  hasFormErrors4 = false;
  hasFormErrors5 = false;

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

  // selects
  pt_article: any[] = [];
  pt_break_cat: any[] = [];
  pt_promo: any[] = [];
  pt_rev: any[] = [];

  row_number;
  error = false;
  msg: String;

  isExist = false;
  user: any
  sct1: CostSimulation;
  sct2: CostSimulation;

  
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
    private inventoryStatusService: InventoryStatusService
  ) {
    config.autoClose = true;
    
    this.codeService
      .getBy({ code_fldname: "pt_article" })
      .subscribe((response: any) => (this.pt_article = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_break_cat" })
      .subscribe((response: any) => (this.pt_break_cat = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_promo" })
      .subscribe((response: any) => (this.pt_promo = response.data));
      this.codeService
      .getBy({ code_fldname: "pt_rev" })
      .subscribe((response: any) => (this.pt_rev = response.data));  
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))   
    this.createForm();
  }
  reset() {
    this.item = new Item();
    this.createForm();
    this.hasFormErrors1 = false;
  
  }
  goBack() {
    this.loadingSubject.next(false);
    const url = `/articles/list`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  
  createForm() {
    this.loadingSubject.next(false);
    this.item = new Item();
    this.form1 = this.formBuilder.group({
      pt_article: [this.item.pt_article ,Validators.required],
      pt_break_cat: [this.item.pt_break_cat, Validators.required],
      pt_promo: [this.item.pt_promo ,Validators.required],
      pt_rev: [this.item.pt_rev ,Validators.required],
      pt_net_wt: [this.item.pt_net_wt ,Validators.required],
      pt_prod_line: [{ value: this.item.pt_prod_line, disabled: true }],
      pt_part_type: [{ value: this.item.pt_part_type, disabled: true }],
      pt_draw: [{ value: this.item.pt_draw, disabled: true }],
      pt_group: [{ value: this.item.pt_group, disabled: true }],
      pt_site: [this.user.usrd_site, Validators.required],

      pt_part: [{ value: this.item.pt_part, disabled: true }],
      pt_desc1: [{ value: this.item.pt_desc1, disabled: true }],
      pt_upc: [{ value: this.item.pt_upc, disabled: true }],
      pt_desc2: [{ value: this.item.pt_desc2, disabled: true }],

   
    });
  }
  onChangeCode() {
  
    const controls = this.form1.controls
    console.log(controls.pt_article.value)
    this.codeService
        .getBy({
              code_fldname:"pt_article", code_value: controls.pt_article.value
        })
        .subscribe((response: any) => {
         console.log(response.data)
          if (response.data.length == 0) {

            alert("Modele n'existe pas  ")
            controls.pt_prod_line.setValue(null);
            controls.pt_part_type.setValue(null);
            controls.pt_draw.setValue(null); 
            controls.pt_group.setValue(null);
          
          } else {

            controls.pt_prod_line.setValue(response.data[0].chr01 || "");
            controls.pt_part_type.setValue(response.data[0].chr02 || "");
            controls.pt_draw.setValue(response.data[0].chr03 || ""); 
            controls.pt_group.setValue(response.data[0].chr04 || "");
          }
      
     })
  }
  Valider() {
    const controls = this.form1.controls

    this.codeService
    .getBy({
          code_fldname:"pt_article", code_value: controls.pt_article.value
    })
    .subscribe((article: any) => {

      this.codeService
      .getBy({
            code_fldname:"pt_break_cat", code_value: controls.pt_break_cat.value
      })
      .subscribe((breakcat: any) => {
        this.codeService
        .getBy({
              code_fldname:"pt_promo", code_value: controls.pt_promo.value
        })
        .subscribe((promo: any) => {
          this.codeService
          .getBy({
                code_fldname:"pt_rev", code_value: controls.pt_rev.value
          })
          .subscribe((rev: any) => {
      
            controls.pt_part.setValue(controls.pt_article.value+controls.pt_break_cat.value+controls.pt_net_wt.value+controls.pt_promo.value+controls.pt_rev.value)  
            controls.pt_desc1.setValue(article.data[0].code_cmmt+ " " + breakcat.data[0].code_cmmt + " " + controls.pt_net_wt.value + promo.data[0].code_cmmt + " " + rev.data[0].code_cmmt)  
          
            controls.pt_upc.setValue(controls.pt_article.value+controls.pt_break_cat.value+controls.pt_promo.value)  
            controls.pt_desc2.setValue(article.data[0].code_cmmt+ " " + breakcat.data[0].code_cmmt + " " + promo.data[0].code_cmmt )  
          })

        })
      })  
    })
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

  prepareItem(): Item {
    const controls1 = this.form1.controls;
   

    const _item = new Item();
    _item.pt_part = controls1.pt_part.value;
    _item.pt_desc1 = controls1.pt_desc1.value;
    _item.pt_desc2 = controls1.pt_desc2.value;
    _item.pt_upc = controls1.pt_upc.value;
    _item.pt_prod_line = controls1.pt_prod_line.value;
    _item.pt_part_type = controls1.pt_part_type.value;
    _item.pt_draw = controls1.pt_draw.value;
    _item.pt_rev = controls1.pt_rev.value;
    _item.pt_group = controls1.pt_group.value;
    _item.pt_promo = controls1.pt_promo.value;
    _item.pt_break_cat = controls1.pt_break_cat.value;
    _item.pt_article = controls1.pt_article.value;
    _item.pt_net_wt = controls1.pt_net_wt.value;
    _item.pt_site = controls1.pt_site.value;

    return _item;
  }


  onSubmit() {
    this.hasFormErrors1 = false;
    this.hasFormErrors2 = false;
    this.hasFormErrors3 = false;
    this.hasFormErrors4 = false;

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

    if(controls1.pt_site.value == "*") {
      alert("Site Erroné")
      return;

    }
    // tslint:disable-next-line:prefer-const
    let item = this.prepareItem();
    let sct1 = this.prepareSct1();
    let sct2 = this.prepareSct2()
    this.addItem(item, sct1, sct2);
  }
  
  addItem(item: Item, sct1: CostSimulation, sct2: CostSimulation) {
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
                this.layoutUtilsService.showActionNotification(
                  "Ajout avec succès",
                  MessageType.Create,
                  10000,
                  true,
                  true
                );
                this.loadingSubject.next(false);
                this.router.navigateByUrl("/articles/list");
              }
            );
          }
        );
      }
    );
  }

  prepareSct1(): CostSimulation {
   
    const control1 = this.form1.controls;
    const _sct = new CostSimulation();
    
    _sct.sct_sim = 'STD-CG'
    _sct.sct_part = control1.pt_part.value;
    _sct.sct_mtl_tl = 0;
    _sct.sct_mtl_ll = 0;
    _sct.sct_lbr_tl = 0;
    _sct.sct_lbr_ll = 0;
    _sct.sct_bdn_tl = 0;
    _sct.sct_bdn_ll = 0;
    _sct.sct_ovh_tl = 0;
    _sct.sct_ovh_ll = 0;
    _sct.sct_sub_tl = 0;
    _sct.sct_sub_ll = 0;
    _sct.sct_cst_tot  = 0
    _sct.sct_site = control1.pt_site.value;

    return _sct;
  }

  prepareSct2(): CostSimulation {
    
    const controls = this.form1.controls;
    const _sct = new CostSimulation();
    _sct.sct_sim = 'STD-CR'
    _sct.sct_part   = controls.pt_part.value
    _sct.sct_mtl_tl = 0;
    _sct.sct_mtl_ll = 0;
    _sct.sct_lbr_tl = 0;
    _sct.sct_lbr_ll = 0;
    _sct.sct_bdn_tl = 0;
    _sct.sct_bdn_ll = 0;
    _sct.sct_ovh_tl = 0;
    _sct.sct_ovh_ll = 0;
    _sct.sct_sub_tl = 0;
    _sct.sct_sub_ll = 0;
    _sct.sct_cst_tot  = 0;
    _sct.sct_site = controls.pt_site.value;
    return _sct;
  }




  handleSelectedRowsChangedsite(e, args) {
    const controls1 = this.form1.controls;
  

    if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
      
            controls1.pt_site.setValue(item.si_site || "");
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
 
}
