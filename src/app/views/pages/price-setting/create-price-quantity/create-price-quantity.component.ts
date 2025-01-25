import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";

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
import { BehaviorSubject, Observable } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { PriceListQuantityService, PriceListQuantity,ItemService } from "../../../../core/erp";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud"

@Component({
  selector: 'kt-create-price-quantity',
  templateUrl: './create-price-quantity.component.html',
  styleUrls: ['./create-price-quantity.component.scss']
})
export class CreatePriceQuantityComponent implements OnInit {

  
  plForm: FormGroup;
  row_number;

  isExist = false

  

  
  
  // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];
  items: any[];
  priceListQuantity: PriceListQuantity;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;

  constructor(
    config: NgbDropdownConfig,
    private plFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private priceListQuantityService: PriceListQuantityService,
    private itemsService: ItemService,
  ) {
    config.autoClose = true;
  }

  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  ngOnInit(): void {
    this.reset();
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.reset();
    this.createForm();
    this.initmvGrid();

  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.priceListQuantity = new PriceListQuantity();
    this.plForm = this.plFB.group({
      plq_code: [this.priceListQuantity.plq_code, Validators.required],
      plq_desc: [{ value: this.priceListQuantity.plq_desc, disabled: !this.isExist },  Validators.required],
      plq_min_qty: [{ value: this.priceListQuantity.plq_min_qty, disabled: !this.isExist }, Validators.required],
      plq_max_qty: [{ value: this.priceListQuantity.plq_max_qty, disabled: !this.isExist }, Validators.required],
    });
  }


  onChangeCode() {
    const controls = this.plForm.controls
    this.priceListQuantityService
        .getBy({
              plq_code: controls.plq_code.value
        })
        .subscribe((response: any) => {
          console.log(response.data.job)
            if (response.data.job ) {
                this.isExist = true
                console.log(response.data.length)
              
            } else {
                controls.plq_desc.enable()
                controls.plq_min_qty.enable()
                controls.plq_max_qty.enable()
              
                
            }
     })
  }
  //reste form
  reset() {
    this.priceListQuantity = new PriceListQuantity();
    this.mvdataset = []
    this.createForm();
    this.hasFormErrors = false;

  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.plForm.controls;
    /** check form */
    if (this.plForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    // tslint:disable-next-line:prefer-const
    let plq = this.prepareplq();
    for (let data of this.mvdataset) {
      delete data.id;
      delete data.cmvid;
    }
    this.addplq(plq, this.mvdataset);
  }
  /**
   * Returns object for saving
   */
  prepareplq(): PriceListQuantity {
    const controls = this.plForm.controls;
    const _plq = new PriceListQuantity();
    _plq.plq_code = controls.plq_code.value;
    _plq.plq_desc = controls.plq_desc.value;
    _plq.plq_min_qty = controls.plq_min_qty.value;
    _plq.plq_max_qty = controls.plq_max_qty.value;
    return _plq;
  }
  /**
   * Add code
   *
   * @param _plq: JobModel
   */
  addplq(_plq: PriceListQuantity, details: any) {
    this.loadingSubject.next(true);
    this.priceListQuantityService
      .add({ PriceListQuantity: _plq, PriceListQuantityDetails: details })
      .subscribe(
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
          this.reset();
          this.loadingSubject.next(false);
          this.router.navigateByUrl("/price-setting/create-price-quantity");
        }
      );
  }

  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
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
        id: "plqd_part",
        name: "Code Produit",
        field: "plqd_part",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "plqd_desc",
        name: "Description",
        field: "plqd_desc",
        sortable: true,
        width: 200,
        filterable: false,
        type: FieldType.string,
        
      },
      {
        id: "plqd_salesprice",
        name: "Prix de Vente",
        field: "plqd_salesprice",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.number,
        editor: {
          model: Editors.float,
        },
      }, 
      {
        id: "plqd_returnprice",
        name: "Prix de Retour",
        field: "plqd_returnprice",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.number,
        editor: {
          model: Editors.float,
        },
      }
      
    ];

    this.mvgridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      autoHeight:false,
    };
    this.itemsService.getBy({pt_salable : true}).subscribe((response: any) => {
      this.items = response.data
    let i = 1
    for (let item of this.items) {
      this.mvdataset.push({id:i, plqd_part:item.pt_part,plqd_desc:item.pt_desc1,plqd_salesprice:0,plqd_returnprice:0})
      i++
    }
    this.mvdataView.setItems(this.mvdataset)
    });
   
  }
  addNewItem() {
    const newId = this.mvdataset.length+1;

    const newItem = {
      id: newId,
      plqd_part: null,
      plqd_desc: null,
      plqd_min_qty: 0,
      plqd_max_qty: 0,
    };
    this.mvgridService.addItem(newItem, { position: "bottom" });
  }
onAlertClose($event) {
  this.hasFormErrors = false
}
}
