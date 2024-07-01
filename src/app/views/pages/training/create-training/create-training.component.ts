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
  selector: 'kt-create-training',
  templateUrl: './create-training.component.html',
  styleUrls: ['./create-training.component.scss']
})
export class CreateTrainingComponent implements OnInit {
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
    this.createForm();
    this.initmvGrid();
  }
  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.item = new Item();
    this.formX = this.formBuilder.group({
      pt_part: [this.item.pt_part,Validators.required],
      pt_desc1: [{ value: this.item.pt_desc1, disabled: !this.isExist },Validators.required],
      pt_draw: [{ value: this.item.pt_draw, disabled: !this.isExist },Validators.required],
      pt_group: [{ value: this.item.pt_group, disabled: !this.isExist },Validators.required],
      pt_formula: [{ value: false, disabled: !this.isExist }],
    })
  
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
              controls.pt_formula.enable()
              document.getElementById("pt_desc1").focus();

            }
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
    _item.pt_formula = controls.pt_formula.value;
    

    return _item;
  }
  /**
   * Add item
   *
   * @param _item: ItemModel
   */
  
    addItem(_item: any, detail: any) {
      for (let data of detail) {
        delete data.id;
        delete data.cmvid;
       
      }
      this.loadingSubject.next(true);
      let so = null;
      const controls = this.formX.controls;
  
      this.itemService
        .adddetail({ item: _item, itemDetail: detail })
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
            this.layoutUtilsService.showActionNotification(
              "Ajout avec succès",
              MessageType.Create,
              10000,
              true,
              true
            );
            this.loadingSubject.next(false);
            console.log(this.dataset);
          
            this.reset();
            this.loadingSubject.next(true);
            this.router.navigateByUrl("/training/create-training");
            
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
    const url = `/articles/list`;
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
    document.getElementById("pt_group").focus();
  
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
      },
    ];

    this.mvgridOptions = {
      asyncEditorLoading: false,
      editable: true,
      autoCommitEdit:true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
    };

    this.mvdataset = [];
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

}
