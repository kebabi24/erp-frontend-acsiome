import { Component, OnInit } from "@angular/core";
import { NgbModal} from "@ng-bootstrap/ng-bootstrap";
// Angular slickgrid
import {
  Column,
  GridOption,
  AngularGridInstance,
  GridService,
  Formatter,
  Formatters,
  Editor,
  Editors,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
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
import { MatDialog } from "@angular/material/dialog";

import { Item, ItemService } from "../../../../core/erp";

@Component({
  selector: 'kt-update-price-dd',
  templateUrl: './update-price-dd.component.html',
  styleUrls: ['./update-price-dd.component.scss']
})
export class UpdatePriceDdComponent implements OnInit {
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  soForm: FormGroup;
  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;
  selectedItem:  any[] = [];
  user:any
  domain:any
  message = "";
  hasFormErrors = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private soFB: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private itemService: ItemService
  ) {
    this.prepareGrid();
  }

  ngOnInit(): void {

    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user = JSON.parse(localStorage.getItem("user"));
    this.domain = JSON.parse(localStorage.getItem("domain"));
    this.createForm();
  }

  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  prepareGrid() {
    this.columnDefinitions = [
     
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 50,
      },
      {
        id: "part",
        name: "Code Produit",
        field: "part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
      },
     
      {
        id: "desc",
        name: "Description ",
        field: "desc",
        sortable: true,
        filterable: true,
        minWidth: 250,
        type: FieldType.string,
      },
     
      {
        id: "um",
        name: "UM",
        field: "um",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 80,
      },
      {
        id: "old_price",
        name: "Ancien Prix Vente",
        field: "old_price",
        sortable: true,
        filterable: true,
        type: FieldType.number,
        minWidth: 80,
      },
      {
        id: "new_price",
        name: "Nouveau Prix",
        field: "new_price",
        sortable: true,
        filterable: true,
        type: FieldType.number,
        minWidth: 80,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
        formatter: Formatters.decimal,
      },
    ];

    this.gridOptions = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      editable:true,
      autoEdit: false,
      enableAutoResize: true,

      autoFitColumnsOnFirstLoad: true,
      // autosizeColumnsByCellContentOnFirstLoad: true,
      enableAutoSizeColumns: true,
      syncColumnCellResize: true,

      formatterOptions: {
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: true,

        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,

        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: " ", // can be any of ',' | '_' | ' ' | ''
      },
  
    };

    // fill the dataset with your data
    this.dataset = [];
    // this.itemService.getAll().subscribe(
    //   (response: any) => {
    //     this.dataset = response.data;
    //     this.dataView.setItems(this.dataset);
    //   },

    //   (error) => {
    //     this.dataset = [];
    //   },
    //   () => {}
    // );
  }
  addNewItem(content4) {
   
    this.prepareGrid4();
    this.modalService.open(content4, { size: "lg" });
  }
  handleSelectedRowsChanged4(e, args) {

    const controls = this.soForm.controls
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
      id: "pt_part_type",
      name: "Type",
      field: "pt_part_type",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "pt_draw",
      name: "Classe",
      field: "pt_draw",
      sortable: true,
      filterable: true,
      type: FieldType.string,
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
      hideSelectAllCheckbox: false,

      // you can override the logic for showing (or not) the expand icon
      // for example, display the expand icon only on every 2nd row
      // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
    },
    multiSelect: true,
    rowSelectionOptions: {
      // True (Single Selection), False (Multiple Selections)
      selectActiveRow: false,
    },
    presets: {
      sorters: [{ columnId: "pt_part", direction: "ASC" }],
    },
  };

  // fill the dataset with your data
  this.itemService.getAll().subscribe((response: any) => (this.items = response.data));
}
open4(content) {
  this.prepareGrid4();
  this.modalService.open(content, { size: "lg" });
}
additems(){

  const controls = this.soForm.controls
 // this.dataset= []

      //console.log(this.dataset.length)
    this.dataset = []
      console.log(this.selectedItem)
     let i = 1
      for(let d of this.selectedItem) {
   
        this.dataset.push({
          id: i,
          part: d.pt_part,
          desc : d.pt_desc1,
          um: d.pt_um,
          old_price : d.pt_price,
          new_price : 0,
          diff : 0,
        
      })

      i++
    }
    console.log(this.dataset)
 this.dataView.setItems(this.dataset)

// this.updateItemMetadata(this.dataView.getItemMetadata);
 this.grid.invalidate();
 this.grid.render();
 this.modalService.dismissAll()


}

createForm() {
  this.loadingSubject.next(false);
  const date = new Date();

  this.soForm = this.soFB.group({
    //    so__chr01: [this.saleOrder.so__chr01],
  });
}

// save data
onSubmit() {
  this.hasFormErrors = false;
  const controls = this.soForm.controls;

  /** check form */
  const input = document.getElementById('submit') as HTMLInputElement | null;


input?.setAttribute('disabled', '');
//  document.getElementById("submit").setAttribute('disabled', '');
  if (!this.dataset.length) {
    this.message = "La liste des article ne peut pas etre vide";
    this.hasFormErrors = true;

    return;
  }
  for (let data of this.dataset) {
   if (data.new_price == 0) { 
    this.message = "Le Prix ne doit pas etre 0";
    this.hasFormErrors = true;
    return}
  }
  for (let data of this.dataset) {
    data.diff = (Number(data.new_price) - Number(data.old_price)).toFixed(2) 
  }
  // tslint:disable-next-line:prefer-const
  

  this.UpdatePrice( this.dataset);
}
UpdatePrice(detail: any) {
  for (let data of detail) {
    delete data.id;
    delete data.cmvid;
  }
  this.loadingSubject.next(true);
  let so = null;
  const controls = this.soForm.controls;

  this.itemService.UpdatePrice({Details: detail }).subscribe(
    (reponse: any) => {
      so = reponse.data;
      // const arrayOctet = new Uint8Array(reponse.pdf.data)
      // const file = new Blob([arrayOctet as BlobPart], {type : 'application/pdf'})
      // const fileUrl = URL.createObjectURL(file);
      // window.open(fileUrl)
    },
    (error) => {
      alert("Erreur, vérifier les informations");
      this.loadingSubject.next(false);
    },
    () => {
      this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
      this.loadingSubject.next(false);
      console.log(this.dataset);
    this.reset()
    this.router.navigateByUrl("/articles/update-price-dd");

    
    }
  );
}
reset() {
  //alert("é")
  const input = document.getElementById('submit') as HTMLInputElement | null;

input.removeAttribute("disabled");

  
  this.dataset = []
  this.createForm();
  this.hasFormErrors = false;
  
}

}
