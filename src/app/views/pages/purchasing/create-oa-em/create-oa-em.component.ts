import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
// Angular slickgrid
import {
  Formatter,
  Editor,
  Editors,
  OnEventArgs,
  AngularGridInstance,
  Aggregators,
  Column,
  DelimiterType,
  FieldType,
  FileType,
  Filters,
  Formatters,
  FlatpickrOption,
  GridService,
  GridOption,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
  ColumnFilter,
  Filter,
  FilterArguments,
  FilterCallback,
  MultipleSelectOption,
  OperatorType,
  OperatorString,
  SearchTerm,
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
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import {
  PurchaseOrderService,
  RequisitionService,
  SequenceService,
  ProviderService,
  UsersService,
  ItemService,
  PurchaseOrder,
  VendorProposalService,
  TaxeService,
  DeviseService,
  VendorProposal,
  CodeService,
  SiteService,
  LocationService,
  PsService,
  PosCategoryService,
  InventoryTransactionService,
  printBc,
} from "../../../../core/erp";
import { round } from "lodash";
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
import thId from "src/assets/plugins/formvalidation/src/js/validators/id/thId";

@Component({
  selector: "kt-create-oa-em",
  templateUrl: "./create-oa-em.component.html",
  styleUrls: ["./create-oa-em.component.scss"],
})
export class CreateOaEmComponent implements OnInit {
  purchaseOrder: PurchaseOrder;
  poForm: FormGroup;
  totForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  nmdataset: any[];

  // grid options

  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];

  users: [];
  columnDefinitions3: Column[] = [];
  gridOptions3: GridOption = {};
  gridObj3: any;
  angularGrid3: AngularGridInstance;

  requisitions: [];
  columnDefinitions5: Column[] = [];
  gridOptions5: GridOption = {};
  gridObj5: any;
  angularGrid5: AngularGridInstance;

  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

  providers: [];
  columnDefinitionsvend: Column[] = [];
  gridOptionsvend: GridOption = {};
  gridObjvend: any;
  angularGridvend: AngularGridInstance;

  ums: [];
  columnDefinitionsum: Column[] = [];
  gridOptionsum: GridOption = {};
  gridObjum: any;
  angularGridum: AngularGridInstance;

  datatax: [];
  columnDefinitionstax: Column[] = [];
  gridOptionstax: GridOption = {};
  gridObjtax: any;
  angularGridtax: AngularGridInstance;

  devises: [];
  columnDefinitionscurr: Column[] = [];
  gridOptionscurr: GridOption = {};
  gridObjcurr: any;
  angularGridcurr: AngularGridInstance;

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
  seq;
  user;
  row_number;
  message = "";
  requistionServer;
  vpServer;
  provider;
  curr;
  details: any[];
  datasetPrint = [];
  date: String;
  po_cr_terms: any[] = [];
  constructor(
    config: NgbDropdownConfig,
    private poFB: FormBuilder,
    private totFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private requisitonService: RequisitionService,
    private providerService: ProviderService,
    private userService: UsersService,
    private requisitionService: RequisitionService,
    private sequenceService: SequenceService,
    private vendorProposalService: VendorProposalService,
    private purchaseOrderService: PurchaseOrderService,
    private itemsService: ItemService,
    private codeService: CodeService,
    private deviseService: DeviseService,
    private siteService: SiteService,
    private psService: PsService,
    private taxService: TaxeService,
    private posCategoryService: PosCategoryService,
    private inventoryTransactionService: InventoryTransactionService
  ) {
    config.autoClose = true;

    this.codeService
      .getBy({ code_fldname: "vd_cr_terms" })
      .subscribe((response: any) => (this.po_cr_terms = response.data));
    //  this.initGrid();
    //  this.initmvGrid();
  }
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  mvGridReady(mvangularGrid: AngularGridInstance) {
    this.mvangularGrid = mvangularGrid;
    this.mvdataView = mvangularGrid.dataView;
    this.mvgrid = mvangularGrid.slickGrid;
    this.mvgridService = mvangularGrid.gridService;
  }
  initGrid() {
    this.columnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.angularGrid.gridService.deleteItem(args.dataContext);
          }
        },
      },

      {
        id: "id",
        name: "Ligne",
        field: "id",
        minWidth: 50,
        maxWidth: 50,
      },
      {
        id: "part",
        name: "Article",
        field: "part",
        sortable: true,
        width: 50,
        filterable: false,
      },
      {
        id: "desc",
        name: "Description",
        field: "desc",
        sortable: true,
        width: 80,
        filterable: false,
      },
      {
        id: "um",
        name: "UM",
        field: "um",
        sortable: true,
        width: 80,
        filterable: false,
      },

      {
        id: "qty",
        name: "QTE Demandée",
        field: "qty",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        formatter: Formatters.decimal,
      },
      {
        id: "qtyoh",
        name: "Qte Stock",
        field: "qtyoh",
        sortable: true,
        width: 80,
        filterable: false,
        formatter: Formatters.decimal,
      },
      {
        id: "sftystk",
        name: "Stock Sécurité",
        field: "sftystk",
        sortable: true,
        width: 80,
        filterable: false,
        formatter: Formatters.decimal,
      },
      {
        id: "qtycom",
        name: "Qte à Commander",
        field: "qtycom",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.float,
        formatter: Formatters.decimal,
      },
      {
        id: "qtyval",
        name: "Qte Validée",
        field: "qtyval",
        sortable: true,
        width: 80,
        filterable: true,
        //type: FieldType.float,
        formatter: Formatters.decimal,
        type: FieldType.float,
        editor: {
          model: Editors.float,
          params: { minDecimal: 0, maxDecimal: 0 },
        },
        //params: { minDecimal: 2, maxDecimal: 2 },
      },

      {
        id: "vend",
        name: "Fournisseur",
        field: "vend",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvid",
        field: "cmvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.row_number = args.row;
          let element: HTMLElement = document.getElementById(
            "openVendsGrid"
          ) as HTMLElement;
          element.click();
        },
      },
    ];
    this.gridOptions = {
      // if you want to disable autoResize and use a fixed width which requires horizontal scrolling
      // it's advised to disable the autoFitColumnsOnFirstLoad as well
      // enableAutoResize: false,
      // autoFitColumnsOnFirstLoad: false,
      autoFitColumnsOnFirstLoad: false,

      //fullWidthRows:false,

      // enable the filtering but hide the user filter row since we use our own single filter
      enableFiltering: false,
      showHeaderRow: false, // hide the filter row (header row)

      autoEdit: true,
      editable: true,
      autoCommitEdit: true,
      enableCellNavigation: true,
      formatterOptions: {
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: false,

        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
        maxDecimal: 2,

        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: " ", // can be any of ',' | '_' | ' ' | ''
      },
    };
    // this.gridOptions = {
    //   enableAutoResize: false,
    //   // autoResize: {
    //   //   containerId: 'demo-container',
    //   //   bottomPadding:10,

    //   // },
    //   autoEdit:true,
    //   editable: true,
    //   autoCommitEdit:true,
    //   enableFiltering: false,
    //   enableCellNavigation: true,
    //   formatterOptions: {

    //     // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
    //     displayNegativeNumberWithParentheses: false,

    //     // Defaults to undefined, minimum number of decimals
    //     minDecimal: 2,
    //     maxDecimal:2,

    //     // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
    //     thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
    //   },
    // };

    this.dataset = [];
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(true);
    this.user = JSON.parse(localStorage.getItem("user"));
    console.log(this.user);
    this.createForm();
    this.initmvGrid();
    this.initGrid();
  }

  addNewItem() {
    const controls = this.poForm.controls;
    this.dataset = [];

    for (let data of this.mvdataset) {
      console.log(data);
    }
    console.log("allllo");
    var site = controls.site.value;
    var detail = this.mvdataset;
    this.inventoryTransactionService
      .getBySpec({ site, detail })
      .subscribe((response: any) => {
        this.dataset = response.data;
        this.dataView.setItems(this.dataset);

        // for (let data of this.dataset) {

        //   this.gridService.addItem(
        //     {
        //       id: data.id,
        //       part: data.part,
        //       desc: data.desc,
        //       qty : data.qty,
        //       qtyoh: data.qtyoh,
        //       qtycom: data.qtycom,
        //       um : data.um,
        //       vend : data.vend ,
        //     },
        //     { position: "bottom" }
        //   );

        //   }
      });
  }

  /*for (var i= 0; i < this.dataset.length ; i++){
   console.log("here")
    this.gridService.addItem(
      {
        id: i + 1,
        part: this.dataset[i].part,
        desc: this.dataset[i].desc,
        qty_ord : this.dataset[i].qty_ord,
        um : this.dataset[i].um,
        vend : this.dataset[i].vend ,
      },
      { position: "bottom" }
    );
 }*/

  initmvGrid() {
    this.mvcolumnDefinitions = [
      /*    {
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
      },*/
      /* {
        id: "ids",
        name: "ids",
        field: "id",
        excludeFromHeaderMenu: true,
      
        minWidth: 30,
        maxWidth: 30,
        
      },*/
      {
        id: "part",
        name: "Code Produit",
        field: "part",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
      },
      {
        id: "desc1",
        name: "Description",
        field: "desc1",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
      },
      {
        id: "um",
        name: "UM",
        field: "um",
        sortable: true,
        width: 50,
        filterable: false,
        // type: FieldType.text,
      },
      {
        id: "qty",
        name: "Qte Consomée",
        field: "prod_qty",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
      },
      {
        id: "add_qty",
        name: "Qte Ajoutée",
        field: "add_qty",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
        editor: {
          model: Editors.float,
        },
        // onCellChange: (e: Event, args: OnEventArgs) => {
        //   this.mvgridService.updateItemById(args.dataContext.id,{...args.dataContext , prod_qty: Number(args.dataContext.ord_qty) + Number(args.dataContext.add_qty) })

        // }
      },
      {
        id: "prod_qty",
        name: "Qte Prévu",
        field: "prod_qty",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
      },
    ];

    this.mvgridOptions = {
      // if you want to disable autoResize and use a fixed width which requires horizontal scrolling
      // it's advised to disable the autoFitColumnsOnFirstLoad as well
      // enableAutoResize: false,
      // autoFitColumnsOnFirstLoad: false,

      //fullWidthRows:false,

      // enable the filtering but hide the user filter row since we use our own single filter
      enableFiltering: false,
      showHeaderRow: false, // hide the filter row (header row)
      autoFitColumnsOnFirstLoad: false,

      enableCellNavigation: true,
      formatterOptions: {
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: false,

        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
        maxDecimal: 2,

        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: " ", // can be any of ',' | '_' | ' ' | ''
      },
    };

    this.mvdataset = [];

    /* console.log(this.user)
    const controls = this.poForm.controls
    
    const date = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
   // const date = new Date(`${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`)
    console.log(date,controls.calc_date.value)
    this.posCategoryService.getSumeQtyPs({usrd_site: controls.site.value, created_date: date}).subscribe(
      (response: any) => {   
        this.mvdataset = response.data
       console.log(this.mvdataset)
       this.mvdataView.setItems(this.mvdataset);
        
         },
      (error) => {
          this.mvdataset = []
      },
      () => {}
  )*/
  }
  change() {
    this.mvdataset = [];
    this.dataset = [];
    const controls = this.poForm.controls;
    const date = controls.calc_date.value
      ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
      : null;
    const date1 = controls.calc_date1.value
      ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
      : null;
    console.log(date, date1, controls.calc_date.value);
    this.inventoryTransactionService
      .getConsoRange({
        usrd_site: controls.site.value,
        date: date,
        date1: date1,
      })
      .subscribe(
        (response: any) => {
          this.mvdataset = response.data;
          console.log(this.mvdataset);
          this.mvdataView.setItems(this.mvdataset);
        },
        (error) => {
          this.mvdataset = [];
        },
        () => {}
      );
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.purchaseOrder = new PurchaseOrder();
    const date = new Date();

    this.poForm = this.poFB.group({
      // po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],
      site: [this.user.usrd_site, Validators.required],
      calc_date: [
        {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate() - 7,
        },
      ],
      calc_date1: [
        {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        },
      ],
    });

    /* this.sequenceService.getBy({ seq_type: "PO", seq_profile: this.user.usrd_profile }).subscribe(
      (res: any) => {
        this.seq = res.data[0].seq_seq
        console.log(this.seq)
        controls.po_category.setValue(this.seq);
    
    })
    */
  }
  //reste form
  reset() {
    this.purchaseOrder = new PurchaseOrder();
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.poForm.controls;
    /** check form */
    if (this.poForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }

    if (!this.dataset.length) {
      this.message = "La liste des article ne peut pas etre vide";
      this.hasFormErrors = true;

      return;
    }
    // tslint:disable-next-line:prefer-const
    var val = 0;
    var array = [];
    var result = [];
    var array = this.dataset;
    array.reduce(function (res, value) {
      //console.log('aaa',res[value.prod_line])
      if (!res[value.vend]) {
        res[value.vend] = { vend: value.vend, qty: 0 };
        result.push(res[value.vend]);
      }
      res[value.vend].qty += value.qty;
      return res;
    }, {});
    console.log("array", result);

    this.addPo(controls.site.value, result, this.dataset);
  }

  /**
   *
   * Returns object for saving
   */
  /**
   * Add po
   *
   * @param _po: po
   */
  addPo(site: any, pos: any, detail: any) {
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
    }
    this.loadingSubject.next(true);
    let po = null;
    const controls = this.poForm.controls;

    this.purchaseOrderService
      .addPos({ Site: site, purchaseOrder: pos, purchaseOrderDetail: detail })
      .subscribe(
        (reponse: any) => (po = reponse.data),
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
          //console.log(this.provider, po, this.dataset);
          this.router.navigateByUrl("/purchasing/po-list");
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

  // add new Item to Datatable
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  onChangesite() {
    const controls = this.poForm.controls;
    const si_site = controls.site.value;

    this.siteService.getByOne({ si_site }).subscribe((res: any) => {
      if (!res.data) {
        alert("Site n'existe pas  ");
        controls.site.setValue(null);
        document.getElementById("site").focus();
      } else {
        if (this.user.usrd_site != "*" && si_site != this.user.usrd_site) {
          alert("Site n'est pas autorisé pour cet utilisateur ");
          controls.site.setValue(null);
          document.getElementById("site").focus();
        }
      }
    });
  }

  handleSelectedRowsChangedsite(e, args) {
    const controls = this.poForm.controls;
    if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);
        console.log(item);

        controls.site.setValue(item.si_site);
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
    if (this.user.usrd_site == "*") {
      this.siteService
        .getAll()
        .subscribe((response: any) => (this.datasite = response.data));
    } else {
      this.siteService
        .getBy({ si_site: this.user.usrd_site })
        .subscribe((response: any) => (this.datasite = response.data));
    }
  }
  opensite(contentsite) {
    this.prepareGridsite();
    this.modalService.open(contentsite, { size: "lg" });
  }

  /*vendor*/
  handleSelectedRowsChangedvend(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);

    if (Array.isArray(args.rows) && this.gridObjvend) {
      args.rows.map((idx) => {
        const item = this.gridObjvend.getDataItem(idx);
        updateItem.vend = item.vd_addr;
        this.gridService.updateItem(updateItem);
      });
    }
  }

  angularGridReadyvend(angularGrid: AngularGridInstance) {
    this.angularGridvend = angularGrid;
    this.gridObjvend = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridvend() {
    this.columnDefinitionsvend = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "vd_addr",
        name: "code",
        field: "vd_addr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_name",
        name: "Fournisseur",
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

    this.gridOptionsvend = {
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
    this.providerService
      .getAll()
      .subscribe((response: any) => (this.providers = response.data));
  }
  openvend(contentvend) {
    this.prepareGridvend();
    this.modalService.open(contentvend, { size: "lg" });
  }
}
