import { Component, OnInit } from "@angular/core"

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
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
// Layout
import {
    SubheaderService,
    LayoutConfigService,
} from "../../../../core/_base/layout"
// CRUD
import {
    LayoutUtilsService,
    TypesUtilsService,
    MessageType,
} from "../../../../core/_base/crud"
import { MatDialog } from "@angular/material/dialog"
import {
  NgbDropdownConfig,
  NgbTabChangeEvent,
  NgbTabsetConfig,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";

import { ForcastService, CodeService ,SiteService,ItemService,CustomerService} from "../../../../core/erp"


@Component({
  selector: 'kt-create-forcast',
  templateUrl: './create-forcast.component.html',
  styleUrls: ['./create-forcast.component.scss']
})
export class CreateForcastComponent implements OnInit {

  forcastForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

  // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];
  datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;

  items: []
  columnDefinitions4: Column[] = []
  gridOptions4: GridOption = {}
  gridObj4: any
  angularGrid4: AngularGridInstance

  customers: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;
  
  frc_part_type: any[] = [];
  frc_dsgn_grp: any[] = [];
  frc_type: any[] = [];
  frc_part_group: any[] = [];
  frc_promo: any[] = [];
  year:any[] = [];
  new: boolean = true;
  constructor(
      config: NgbDropdownConfig,
      private forcastFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private modalService: NgbModal,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private forcastService: ForcastService,
      private codeService: CodeService,
      private siteService: SiteService,
      private itemService: ItemService,
      private customersService: CustomerService,
  ) {
      config.autoClose = true,
      this.codeService
      .getBy({ code_fldname: "fc_type" })
      .subscribe((response: any) => (this.frc_type = response.data));
      this.codeService
      .getBy({ code_fldname: "pt_part_type" })
      .subscribe((response: any) => (this.frc_part_type = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_dsgn_grp" })
      .subscribe((response: any) => (this.frc_dsgn_grp = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_group" })
      .subscribe((response: any) => (this.frc_part_group = response.data));  
    this.codeService
      .getBy({ code_fldname: "pt_promo" })
      .subscribe((response: any) => (this.frc_promo = response.data));
      var y : Number
      for(var i=2023; i <= 2099;i++) {
        y = i
        this.year.push({y})
      }
  }
  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.createForm();
    this.initmvGrid();
}
initmvGrid() {
  this.mvcolumnDefinitions = [
    // {
    //   id: "id",
    //   field: "id",
    //   excludeFromHeaderMenu: true,
    //   formatter: Formatters.deleteIcon,
    //   minWidth: 30,
    //   maxWidth: 30,
    //   onCellClick: (e: Event, args: OnEventArgs) => {
    //     if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
    //       this.mvangularGrid.gridService.deleteItem(args.dataContext);
    //     }
    //   },
    // },
    {
      id: "frc_date",
      name: "Date",
      field: "frc_date",
      sortable: true,
      width: 50,
      filterable: false,
      formatter:Formatters.dateIso,
      type: FieldType.date,
    
    },
    {
      id: "frc_dayname",
      name: "Jour",
      field: "frc_dayname",
      sortable: true,
      width: 50,
      filterable: false,
      type: FieldType.string,
    
    },
    {
      id: "frc_qty",
      name: "QTE",
      field: "frc_qty",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.float,
      editor: {
        model: Editors.text,
      },
    },
    {
      id: "frc_amt",
      name: "Montant",
      field: "frc_amt",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.float,
      editor: {
        model: Editors.text,
      },
    },
  ];

  this.mvgridOptions = {
    asyncEditorLoading: false,
    editable: true,
    enableColumnPicker: true,
    enableCellNavigation: true,
    enableRowSelection: true,
  };

 
}
//create form
createForm() {
  this.loadingSubject.next(false)

 
  this.forcastForm = this.forcastFB.group({
      frc_year:  ["", Validators.required],
      frc_month: ["", Validators.required],
      frc_site:  ["", Validators.required],
      frc_type:  ["", Validators.required],
      frc_cust: [null],
      frc_part: [null],
      desc: [null],
      frc_part_type: [null],
      frc_dsgn_grp: [null],
      frc_part_group: [null],
      frc_promo: [null],
  })
}
onChangeCode(){
  //const controls = this.forcastForm.controls
 // console.log(controls.frc_month.value)

  //console.log(this.getDays(Number(controls.frc_year.value),Number(controls.frc_month.value)))
  this.onChargeDataset()
}
getDays = (year, month) => {
  return new Date(year, month, 0).getDate();
 
};
//reste form
reset() {

  this.createForm()
  this.mvdataset = []
  this.hasFormErrors = false
}
// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.forcastForm.controls
  /** check form */
  if (this.forcastForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      return
  }
console.log("herrrrrrrrrrrrrrrrrrrrrrrrrrrrrre",this.hasFormErrors)
  // tslint:disable-next-line:prefer-const
  // let address = this.prepareCode()
  this.addForcast(this.mvdataset)
}
/**
     * Returns object for saving
     */
  //   prepareCode(): Devise {
  //     const controls = this.forcastForm.controls
  //     const _devise = new Devise()
  //     _devise.frc_curr = controls.frc_curr.value
  //     _devise.frc_desc = controls.frc_desc.value
  //     _devise.frc_rnd_mthd = controls.frc_rnd_mthd.value
  //     _devise.frc_active = controls.frc_active.value
  //     _devise.frc_iso_curr = controls.frc_iso_curr.value
  //     return _devise
  // }
/**
     * Add code
     *
     * @param _devise: DeviseModel
     */
 addForcast(details: any) {
  this.loadingSubject.next(true);
console.log(details)
  if(this.new == true) {
    for (let data of this.mvdataset) {
      delete data.id;
    
    }

    this.forcastService.add( {Details: details} )
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
        this.loadingSubject.next(false);
        this.reset()
        this.router.navigateByUrl("/forcast/create-forcast");
      }
    );
  } else {

    this.forcastService.update( {Details: details} )
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
        this.loadingSubject.next(false);
        this.reset()
        this.router.navigateByUrl("/forcast/create-forcast");
      }
    );

  }    

}



 /**
     * Go back to the list
     *
     */
    goBack() {
      this.loadingSubject.next(false)
      const url = `/forcast/create-forcast`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }

onChargeDataset(){
  const controls = this.forcastForm.controls
this.mvdataset= []

this.forcastService
  .getBy({frc_year : Number(controls.frc_year.value), 
          frc_month: Number(controls.frc_month.value),
          frc_site : controls.frc_site.value,
          frc_type : controls.frc_type.value,
          frc_cust : controls.frc_cust.value,
          frc_part : controls.frc_part.value,
          frc_dsgn_grp   : controls.frc_dsgn_grp.value, 
          frc_part_type  : controls.frc_part_type.value, 
          frc_part_group : controls.frc_part_group.value,
          frc_promo      : controls.frc_promo.value,
  })
  .subscribe((response: any) => {
     console.log(response)
    if (response.data.length == 0) {
      this.new =  true;
      var limit = this.getDays(Number(controls.frc_year.value),Number(controls.frc_month.value) )
      for(var i =1;i<= limit; i++ ){
         var date =  new Date(Number(controls.frc_year.value), Number(controls.frc_month.value) - 1, i)
        this.mvdataset.push({
          id:i,
          frc_dayname: date.toLocaleDateString('fr-FR', {weekday: 'long'}),
          frc_day: date.getDate(),
          frc_year: controls.frc_year.value, 
          frc_month:controls.frc_month.value, 
          frc_site: controls.frc_site.value,
          frc_part_type: controls.frc_part_type.value, 
          frc_dsgn_grp: controls.frc_dsgn_grp.value, 
          frc_type: controls.frc_type.value, 
          frc_part_group: controls.frc_part_group.value,
          frc_promo: controls.frc_promo.value,
          frc_part:  controls.frc_part.value,
          frc_cust:  controls.frc_cust.value,
          frc_date: date, 
          frc_qty:0, 
          frc_amt:0})
        
      }
      this.mvdataView.setItems(this.mvdataset)
    } else {
      this.new = false
      this.mvdataset = response.data
      this.mvdataView.setItems(this.mvdataset)
    }
  })  
}

handleSelectedRowsChangedsite(e, args) {
  const controls1 = this.forcastForm.controls;
 
  if (Array.isArray(args.rows) && this.gridObjsite) {
    args.rows.map((idx) => {
      const item = this.gridObjsite.getDataItem(idx);
      // TODO : HERE itterate on selected field and change the value of the selected field
          controls1.frc_site.setValue(item.si_site || "");
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

onChangePart(){
  const controls = this.forcastForm.controls
 if (controls.frc_part.value == null || controls.frc_part.value == "") {
  controls.frc_part_type.enable()
  controls.frc_dsgn_grp.enable()
  controls.frc_part_group.enable()
  controls.frc_promo.enable()
 }

}
handleSelectedRowsChanged4(e, args) {
  const controls = this.forcastForm.controls
 
  if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
          const item = this.gridObj4.getDataItem(idx)
          controls.frc_part.setValue(item.pt_part || "")
          controls.desc.setValue( item.pt_desc1 || "");
          controls.frc_part_type.setValue(item.pt_part_type || "")
          controls.frc_dsgn_grp.setValue(item.pt_dsgn_grp || "")
          controls.frc_part_group.setValue(item.pt_group || "")
          controls.frc_promo.setValue(item.pt_promo || "")
          
          controls.frc_part_type.disable()
          controls.frc_part_group.disable()
          controls.frc_promo.disable()

      })
  }
}

angularGridReady4(angularGrid: AngularGridInstance) {
  this.angularGrid4 = angularGrid
  this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {}
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
          name: "desc",
          field: "pt_um",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
  ]

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
  this.itemService
      .getAll()
      .subscribe((response: any) => (this.items = response.data))
}
openpart(content) {
  this.prepareGrid4()
  this.modalService.open(content, { size: "lg" })
}
handleSelectedRowsChanged2(e, args) {
  const controls = this.forcastForm.controls;
  if (Array.isArray(args.rows) && this.gridObj2) {
    args.rows.map((idx) => {
      const item = this.gridObj2.getDataItem(idx);
      controls.frc_cust.setValue(item.cm_addr || "")
      controls.name.setValue( item.address.ad_name || "");



    });
  }
}

angularGridReady2(angularGrid: AngularGridInstance) {
  this.angularGrid2 = angularGrid;
  this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGrid2() {
  this.columnDefinitions2 = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "cm_addr",
      name: "code",
      field: "cm_addr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_name",
      name: "Client",
      field: "address.ad_name",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_phone",
      name: "Numero telephone",
      field: "address.ad_phone",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxable",
      name: "A Taxer",
      field: "address.ad_taxable",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxc",
      name: "Taxe",
      field: "address.ad_taxc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptions2 = {
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
    dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
      var val = undefined;
      try {
        val = eval("item." + column.field);
      } catch (e) {
        // ignore
      }
      return val;
    },
  };

  // fill the dataset with your data
  this.customersService
    .getByAll({ cm_hold: false })
    .subscribe((response: any) => (this.customers = response.data));
}
open2(content) {
  this.prepareGrid2();
  this.modalService.open(content, { size: "lg" });
}
}
