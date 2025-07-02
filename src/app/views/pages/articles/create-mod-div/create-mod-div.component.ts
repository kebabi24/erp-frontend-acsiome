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
  selector: 'kt-create-mod-div',
  templateUrl: './create-mod-div.component.html',
  styleUrls: ['./create-mod-div.component.scss']
})

export class CreateModDivComponent implements OnInit {

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
      .getBy({ code_fldname: "pt_prod_line",code_desc:'INTRANT' })
      .subscribe((response: any) => (this.mod_prod_line = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_part_type",code_desc:'INTRANT' })
      .subscribe((response: any) => (this.mod_part_type = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_draw",code_desc:'INTRANT' })
      .subscribe((response: any) => (this.mod_draw = response.data));
     
    this.codeService
      .getBy({ code_fldname: "pt_dsgn_grp",code_desc:'INTRANT' })
      .subscribe((response: any) => (this.mod_dsgn_grp = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_origin",code_desc:'INTRANT' })
      .subscribe((response: any) => (this.mod_origin = response.data));  
    this.codeService
      .getBy({ code_fldname: "pt_drwg_loc",code_desc:'INTRANT' })
      .subscribe((response: any) => (this.mod_drwg_loc = response.data));
      
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))   
    this.createForm();
  }
  reset() {
    this.itemModel = new ItemModel();
    this.createForm();
    this.hasFormErrors1 = false;
  
  }
  goBack() {
    this.loadingSubject.next(false);
    const url = `/articles/create-mod-div`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  
  createForm() {
    this.loadingSubject.next(false);
    this.itemModel = new ItemModel();
    this.code = new Code();
    this.form1 = this.formBuilder.group({
      mod_prod_line: [{value :this.itemModel.mod_prod_line },Validators.required ],
      mod_part_type: [{value :this.itemModel.mod_part_type }, Validators.required ],
      mod_draw: [{value :this.itemModel.mod_draw }, Validators.required],
      
      mod_code: [{value :this.itemModel.mod_code,disabled: !this.isExist }],
      mod_desc: [{value :this.itemModel.mod_desc,disabled: !this.isExist }, ],
      mod_um: [{value :this.itemModel.mod_um,disabled: !this.isExist },],
      
      
      
      
      
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
  //           
  //           controls.int01.setValue(response.data.int01)
  //           controls.int02.setValue(response.data.int02)
  //           controls.mod_desc.enable()
  //           controls.mod_um.enable()
  //           controls.mod_part_type.enable()
  //           
  //           controls.int01.enable()
  //           controls.int02.enable()
            
  //         } else {

  //             controls.mod_desc.enable()
  //             controls.mod_um.enable()
  //             controls.mod_part_type.enable()
  //             
  //             controls.int01.enable()
  //             controls.int02.enable()
  //         }
      
  //    })
  // }
  onChangegroup() {
  
    
    const controls = this.form1.controls
    
    
    this.itemModelService
        .getByOne({
              mod_prod_line: controls.mod_prod_line.value,
              mod_part_type : controls.mod_part_type.value,
              mod_draw: controls.mod_draw.value,
              
        })
        .subscribe((response: any) => {
         console.log(response.data)
          if (response.data != null) {
            
            this.message = 'un modèle existe pour cette configuration'
            this.hasFormErrors1 = true
            return
            
          } else {
            let code_draw : any;
            let code_type : any;
            
            this.codeService.getBy({ code_fldname: 'pt_draw',code_value: controls.mod_draw.value }).subscribe((drawresponse: any) => {code_draw = drawresponse.data[0].chr01
              this.codeService.getBy({ code_fldname: 'pt_part_type',code_value: controls.mod_part_type.value }).subscribe((typeresponse: any) => {code_type = typeresponse.data[0].chr01
                
                controls.mod_code.setValue(controls.mod_prod_line.value + code_type + code_draw   )
                  controls.mod_desc.setValue(controls.mod_draw.value + ' ' + controls.mod_part_type.value )
                  controls.mod_um.setValue('KG')
              });
            });
            
            
              
              
              
             
          }
      
     })
  }
  onChangedraw() {
  
    
    const controls = this.form1.controls
    
    
    this.itemModelService
        .getByOne({
              mod_prod_line: controls.mod_prod_line.value,
              mod_part_type : controls.mod_part_type.value,
              mod_draw: controls.mod_draw.value,
              
        })
        .subscribe((response: any) => {
         console.log(response.data)
          if (response.data != null) {
            
            this.message = 'un modèle existe pour cette configuration'
            this.hasFormErrors1 = true
            return
            
          } else {
            
            let code_draw : any;
            let code_type : any;
            
            this.codeService.getBy({ code_fldname: 'pt_draw',code_value: controls.mod_draw.value }).subscribe((drawresponse: any) => {code_draw = drawresponse.data[0].chr01
              this.codeService.getBy({ code_fldname: 'pt_part_type',code_value: controls.mod_part_type.value }).subscribe((typeresponse: any) => {code_type = typeresponse.data[0].chr01
                
                controls.mod_code.setValue(controls.mod_prod_line.value + code_type + code_draw  )
                  controls.mod_desc.setValue(controls.mod_draw.value + ' ' + controls.mod_part_type.value )
                  controls.mod_um.setValue('KG')
              });
            });
              
          }
      
     })
  }
  onChangetype() {
  
    
    const controls = this.form1.controls
    
    
    this.itemModelService
        .getByOne({
              mod_prod_line: controls.mod_prod_line.value,
              mod_part_type : controls.mod_part_type.value,
              mod_draw: controls.mod_draw.value,
              
        })
        .subscribe((response: any) => {
         console.log(response.data)
          if (response.data != null) {
            
            this.message = 'un modèle existe pour cette configuration'
            this.hasFormErrors1 = true
            return
            
          } else {
            let code_draw : any;
            let code_type : any;
            
            this.codeService.getBy({ code_fldname: 'pt_draw',code_value: controls.mod_draw.value }).subscribe((drawresponse: any) => {code_draw = drawresponse.data[0].chr01
              this.codeService.getBy({ code_fldname: 'pt_part_type',code_value: controls.mod_part_type.value }).subscribe((typeresponse: any) => {code_type = typeresponse.data[0].chr01
                
                controls.mod_code.setValue(controls.mod_prod_line.value + code_type + code_draw  )
                  controls.mod_desc.setValue(controls.mod_draw.value + ' ' + controls.mod_part_type.value )
                  controls.mod_um.setValue('KG')
              });
            });
              
             
          }
      
     })
  }
  onChangepl() {
  
    
    const controls = this.form1.controls
    
    
    this.itemModelService
        .getByOne({
              mod_prod_line: controls.mod_prod_line.value,
              mod_part_type : controls.mod_part_type.value,
              mod_draw: controls.mod_draw.value,
              
        })
        .subscribe((response: any) => {
         console.log(response.data)
          if (response.data != null) {
            
            this.message = 'un modèle existe pour cette configuration'
            this.hasFormErrors1 = true
            return
            
          } else {
            let code_draw : any;
            let code_type : any;
            
            this.codeService.getBy({ code_fldname: 'pt_draw',code_value: controls.mod_draw.value }).subscribe((drawresponse: any) => {code_draw = drawresponse.data[0].chr01
              this.codeService.getBy({ code_fldname: 'pt_part_type',code_value: controls.mod_part_type.value }).subscribe((typeresponse: any) => {code_type = typeresponse.data[0].chr01
                
                controls.mod_code.setValue(controls.mod_prod_line.value + code_type + code_draw  )
                controls.mod_desc.setValue(controls.mod_draw.value + ' ' + controls.mod_part_type.value )
                controls.mod_um.setValue('KG')
              });
            });
            
              
             
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
    _itemModel.mod_prod_line = controls1.mod_prod_line.value;
    _itemModel.mod_part_type = controls1.mod_part_type.value;
    _itemModel.mod_draw = controls1.mod_draw.value;
    
    _itemModel.mod_dsgn_grp = '';
    _itemModel.mod_origin = 'ACH';
    _itemModel.mod_drwg_loc = 'INTERNE';
    _itemModel.mod_status = 'MP-ACTIF';
    _itemModel.mod_abc = 'C';
    _itemModel.mod_site = '1000';
    _itemModel.mod_loc = 'EMPL PLAST2';
    _itemModel.mod_iss_pol = true;
   
    return _itemModel;
  }
  prepareCode(): Code {
    const controls = this.form1.controls
    const _code = new Code()
    _code.code_fldname = 'pt_article'
    _code.code_value = controls.mod_code.value
   _code.code_desc = 'INTRANT'
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
    
    
    if(controls1.mod_part_type.value == null){
      this.message = 'Veuillez choisir un type article'
      this.hasFormErrors1 = true
      return;
    }
    if(controls1.mod_prod_line.value == null){
      this.message = 'Veuillez choisir une famille'
      this.hasFormErrors1 = true
      return;
    }
    if(controls1.mod_draw.value == null){
      this.message = 'Veuillez choisir une sous famille'
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
                this.router.navigateByUrl("/articles/create-mod-div");
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
}
