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
  selector: 'kt-edit-price-quantity',
  templateUrl: './edit-price-quantity.component.html',
  styleUrls: ['./edit-price-quantity.component.scss']
})
export class EditPriceQuantityComponent implements OnInit {

  
  
  plForm: FormGroup;
  row_number;

  isExist = false

  
itemss: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;
  
  
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
  title: String = 'Modifier Liste  - '
  plqEdit: any
  selectedItem:  any[] = [];
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
   
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    
    
    this.activatedRoute.params.subscribe((params) => {
      const id = params.id
      this.priceListQuantityService.getOne(id).subscribe((response: any)=>{
        console.log("hhhhhhhhhhhhhhhhhhhhhhhh",response.data)
        this.plqEdit = response.data.plq
        this.mvdataset = response.data.details
       
         console.log(this.plqEdit)
       
        this.initCode()
        
        this.loadingSubject.next(false)
        this.title = this.title + this.plqEdit.plq_code
      })
  })
  this.initmvGrid();
}
  initCode() {
    this.createForm()
    this.loadingSubject.next(false)
}
  //create form
  createForm() {
    this.loadingSubject.next(false);
    
    this.plForm = this.plFB.group({
      plq_code: [this.plqEdit.plq_code, Validators.required],
      plq_desc: [this.plqEdit.plq_desc,Validators.required],
      plq_min_qty: [this.plqEdit.plq_min_qty,  Validators.required],
      plq_max_qty: [this.plqEdit.plq_max_qty,  Validators.required],
    });
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
    .update( {PriceListQuantity:_plq, details}, this.plqEdit.id).subscribe(
     
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
          this.router.navigateByUrl("price-setting/list-price-quantity");
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
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        minWidth: 30,
        maxWidth: 100,
        
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
    // this.itemsService.getBy({pt_salable : true}).subscribe((response: any) => {
    //   this.items = response.data
    // let i = 1
    // for (let item of this.items) {
    //   this.mvdataset.push({id:i, plqd_part:item.pt_part,plqd_desc:item.pt_desc1,plqd_salesprice:0,plqd_returnprice:0})
    //   i++
    // }
    // this.mvdataView.setItems(this.mvdataset)
    // });
    
   
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


handleSelectedRowsChanged4(e, args) {

  const controls = this.plForm.controls
  if (Array.isArray(args.rows) && this.gridObj4) {
    this.selectedItem = args.rows.map((idx: number) => {
      const item = this.gridObj4.getDataItem(idx);
      return item;
    });
  }


}

angularGridReady4(angularGrid: AngularGridInstance) {
this.angularGrid4 = angularGrid;
this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGrid4() {
this.columnDefinitions4 = [
  {
    id: "id",
    name: "id",
    field: "id",
    sortable: true,
    minWidth: 80,
    maxWidth: 80,
  },
  {
    id: "pt_part",
    name: "code ",
    field: "pt_part",
    sortable: true,
    filterable: true,
    type: FieldType.string,
  },
  {
    id: "pt_desc1",
    name: "desc",
    field: "pt_desc1",
    sortable: true,
    filterable: true,
    type: FieldType.string,
  },
  {
    id: "pt_um",
    name: "UM",
    field: "pt_um",
    sortable: true,
    filterable: true,
    type: FieldType.string,
  },
  {
    id: "pt_ord_max",
    name: "QTE",
    field: "pt_ord_max",
    sortable: true,
    filterable: true,
    type: FieldType.float,
  },
];

this.gridOptions4 = {
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
  editable: true,
  checkboxSelector: {
    // optionally change the column index position of the icon (defaults to 0)
    // columnIndexPosition: 1,

    // remove the unnecessary "Select All" checkbox in header when in single selection mode
    hideSelectAllCheckbox: true,

    // you can override the logic for showing (or not) the expand icon
    // for example, display the expand icon only on every 2nd row
    // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
  },
  multiSelect: true,
  rowSelectionOptions: {
    // True (Single Selection), False (Multiple Selections)
    selectActiveRow: false,
  },
};

// fill the dataset with your data
this.itemsService.getStk({}).subscribe((response: any) => (this.items = response.data));
}
open4(content) {
this.prepareGrid4();
this.modalService.open(content, { size: "lg" });
}

additems(){

  const controls = this.plForm.controls
  //this.dataset= []
//this.data=[]
      //console.log(this.dataset.length)
   let ids=[] 
   for(let d of this.mvdataset) {
    ids.push(d.id)
   }
   let i = Math.max(...ids) + 1
      console.log(this.selectedItem)
//let i = this.mvdataset.length + 1
      for(let d of this.selectedItem) {
          let index = this.mvdataset.findIndex((element) => {
            return element.plqd_part === d.pt_part;
          });
          console.log(index)
          if(index<0) {
        this.mvdataset.push({
          id: i,
          plqd_part: d.pt_part,
          plqd_desc: d.pt_desc1,
          plqd_salesprice: 0,
          plqd_returnprice: 0,
      })
      i++
    }
      }
 console.log(this.mvdataset)
 this.mvdataView.setItems(this.mvdataset)

// this.updateItemMetadata(this.dataView.getItemMetadata);
 this.mvgrid.invalidate();
 this.mvgrid.render();
 this.modalService.dismissAll()


}
largest(arr) {
  return Math.max(...arr);
}

// Driver Code
}
