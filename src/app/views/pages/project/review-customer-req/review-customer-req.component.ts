import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import { Column, GridOption, Formatter, EditorValidator, EditorArgs, Editor, Editors, AngularGridInstance, GridService, FieldType, Formatters, OnEventArgs } from "angular-slickgrid";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { FormGroup, FormBuilder, Validators, NgControlStatus } from "@angular/forms";
import { EmployeService, CodeService, ProjectService, TaskService, ProviderService, AddReportService, AddReport, SequenceService, ItemService, LocationService, CostSimulationService, LocationDetailService, InventoryStatusService, MesureService, SiteService, InventoryTransactionService, Project } from "../../../../core/erp";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { LayoutUtilsService, TypesUtilsService, MessageType } from "../../../../core/_base/crud";
import { HttpUtilsService } from "../../../../core/_base/crud";
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY } from "@angular/cdk/overlay/overlay-directives";
const statusValidator: EditorValidator = (value: any, args: EditorArgs) => {
  // you can get the Editor Args which can be helpful, e.g. we can get the Translate Service from it
  const grid = args && args.grid;
  const gridOptions = grid && grid.getOptions ? grid.getOptions() : {};
  const translate = gridOptions.i18n;

  // to get the editor object, you'll need to use "internalColumnEditor"
  // don't use "editor" property since that one is what SlickGrid uses internally by it's editor factory
  const columnEditor = args && args.column && args.column.internalColumnEditor;

  if (value == null || value == undefined || !value.length) {
    return { valid: false, msg: "This is a required field" };
  }
  return { valid: true, msg: "" };
};

@Component({
  selector: "kt-review-customer-req",
  templateUrl: "./review-customer-req.component.html",
  styleUrls: ["./review-customer-req.component.scss"],
})
export class ReviewCustomerReqComponent implements OnInit {
  addReport: AddReport;
  empForm: FormGroup;
  row_number;

  isExist = false;

  datasetpm: [];
  columnDefinitionspm: Column[] = [];
  gridOptionspm: GridOption = {};
  gridObjpm: any;
  angularGridpm: AngularGridInstance;

  dataset: [];
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  gridObj: any;
  angularGrid: AngularGridInstance;

  dataset2: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;

  dataset3: [];
  columnDefinitions3: Column[] = [];
  gridOptions3: GridOption = {};
  gridObj3: any;
  angularGrid3: AngularGridInstance;

  dataset4: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

  mvdataset: any[];

  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  message = "";
  job: String;
  level: String;
  seq: any;
  nbr: string;
  user;

  location: any;
  sct: any;
  lddet: any;
  trlot: string;
  datasetPrint = [];
  stat: String;

  loc: String;
  site: String;
  pmcode: string;
  alertWarning: any;

  constructor(config: NgbDropdownConfig, private empFB: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog, private layoutUtilsService: LayoutUtilsService, private modalService: NgbModal, private employeService: EmployeService, private addReportService: AddReportService, private sequenceService: SequenceService, private projectService: ProjectService, private providerService: ProviderService, private inventoryTransactionService: InventoryTransactionService, private sctService: CostSimulationService, private itemsService: ItemService, private locationService: LocationService, private codeService: CodeService, private inventoryStatusService: InventoryStatusService, private siteService: SiteService, private mesureService: MesureService, private locationDetailService: LocationDetailService) {
    config.autoClose = true;
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();

    this.loadingSubject.next(false);
    this.user = JSON.parse(localStorage.getItem("user"));
    this.createForm();
    this.prepareGrid();
    this.prepareGrid2();
    this.prepareGrid3();
    this.prepareGrid4();
  }
  createForm() {
    this.loadingSubject.next(false);
    //create form
    this.addReport = new AddReport();

    this.empForm = this.empFB.group({
      pmr_pm_code: [this.addReport.pmr_pm_code, Validators.required],
      pmdesc: [{ value: "", disabled: true }],
      pmtype: [{ value: "", disabled: true }],
      pmcust: [{ value: "", disabled: true }],
      pmsite: [{ value: "", disabled: true }],
      pmdate: [{ value: "", disabled: true }],
      pmr_inst: [this.addReport.pmr_inst, Validators.required],
      pmr_task: [this.addReport.pmr_task, Validators.required],
      taskdesc: [{ value: "", disabled: true }],

      pmr_task_status: [this.addReport.pmr_task_status, Validators.required],
      pmr_close: [false],
    });
  }

  //reste form
  reset() {
    this.createForm();
    this.hasFormErrors = false;
    this.mvdataset = [];
  }
  // save data
  onSubmit() {
    console.log("haha");
    this.hasFormErrors = false;
    const controls = this.empForm.controls;
    /** check form */

    console.log("hhhhhhhjssfffjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
    let pme = this.prepareCode();
    console.log(pme);
    this.addDet(pme);
    console.log("jjjj");
  }

  prepareCode(): any {
    const controls = this.empForm.controls;
    const _project = new Project();
    _project.pm_code = controls.pmr_pm_code.value;
    _project.pm_desc = controls.pmdesc.value;
    _project.pm_type = controls.pmtype.value;
    _project.pm_ord_date = controls.pmdate.value;
    _project.pm_cust = controls.pmcust.value;
    _project.pm_site = controls.pmsite.value;

    return _project;
  }

  addDet(pme: any) {
    console.log("1", this.dataset);
    console.log("2", this.dataset2);
    console.log("3", this.dataset3);
    console.log("4", this.dataset4);
    this.loadingSubject.next(true);

    this.projectService.sendDataToModelRevue({ pme: pme, dataset: this.dataset, dataset2: this.dataset2, dataset3: this.dataset3, dataset4: this.dataset4 }).subscribe(
      (reponse: any) => (error: any) => {
        this.layoutUtilsService.showActionNotification("Erreur verifier les informations", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        this.reset();
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

  handleSelectedRowsChanged(e, args) {
    this.mvdataset = [];
    const controls = this.empForm.controls; // chof le champs hada wesh men form rah
    if (Array.isArray(args.rows) && this.gridObjpm) {
      args.rows.map((idx) => {
        const item = this.gridObjpm.getDataItem(idx);
        console.log(item);
        this.pmcode = item.pm_code;
        this.projectService.getByTask({ pmt_code: this.pmcode }).subscribe((response: any) => ((this.dataset = response.data["details"]), console.log(this.dataset), (this.dataset3 = response.data["details2"]), (this.dataset4 = response.data["details3"])));
        this.projectService.getPs({ pmd_code: this.pmcode }).subscribe((response: any) => ((this.dataset2 = response.data), console.log(this.dataset2)));
        controls.pmr_pm_code.setValue(item.pm_code || "");
        controls.pmdesc.setValue(item.pm_desc || "");
        controls.pmtype.setValue(item.pm_type || "");
        controls.pmcust.setValue(item.pm_cust || "");
        controls.pmsite.setValue(item.pm_site || "");
        controls.pmdate.setValue(item.pm_ord_date || "");
        this.siteService.getByOne({ si_default: true }).subscribe((res: any) => {
          this.site = res.data.si_site;

          this.locationService.getByOne({ loc_site: this.site, loc_project: item.pm_code }).subscribe((resp: any) => {
            if (resp.data == null) {
              alert("projet n'est pas affecté à un emplacement ");

              controls.pmr_pm_code.setValue(null);
              controls.pmdesc.setValue(null);
            } else {
              console.log(resp.data);
              this.loc = resp.data.loc_loc;
              console.log(this.site, this.loc);
            }
          });
        });
      });
    }
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = (angularGrid && angularGrid.slickGrid) || {};
  }

  angularGridReady2(angularGrid: AngularGridInstance) {
    this.angularGrid2 = angularGrid;
    this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {};
  }
  angularGridReady3(angularGrid: AngularGridInstance) {
    this.angularGrid3 = angularGrid;
    this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {};
  }
  angularGridReady4(angularGrid: AngularGridInstance) {
    this.angularGrid4 = angularGrid;
    this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {};
  }
  angularGridReadypm(angularGrid: AngularGridInstance) {
    this.angularGridpm = angularGrid;
    this.gridObjpm = (angularGrid && angularGrid.slickGrid) || {};
  }
  prepareGrid() {
    this.columnDefinitions = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "pmt_code",
        name: "Code client",
        field: "pmt_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pmt_inst",
        name: "Designation",
        field: "pmt_inst",
        sortable: true,
        width: 120,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pmt_task",
        name: "tache",
        field: "pmt_task",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptions = {
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
    // this.projectService.getByTask({ pmt_code: this.pmcode }).subscribe((response: any) => (this.dataset = response.data));
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
        id: "ps_parent",
        name: "Code nomenclature",
        field: "ps_parent",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ps_comp",
        name: "Compo",
        field: "ps_comp",
        sortable: true,
        width: 120,
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
      checkboxSelector: {},
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };

    // fill the dataset with your data
    // this.projectService.getByAll({ pm_status: "R" }).subscribe((response: any) => (this.dataset = response.data));
  }
  prepareGrid3() {
    this.columnDefinitions3 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "tod_code",
        name: "Code outil",
        field: "tod_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "tod_desc",
        name: "Designation",
        field: "tod_desc",
        sortable: true,
        width: 120,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "tod_qty",
        name: "Quantité",
        field: "tod_qty",
        sortable: true,
        width: 120,
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
    // this.projectService.getByAll({ pm_status: "R" }).subscribe((response: any) => (this.dataset = response.data));
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
        id: "tkd_code",
        name: "Code",
        field: "tkd_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "tkd_job",
        name: "Métier",
        field: "tkd_job",
        sortable: true,
        width: 120,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "tkd_level",
        name: "Niveau",
        field: "tkd_level",
        sortable: true,
        width: 120,
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
      checkboxSelector: {},
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };

    // fill the dataset with your data
    // this.projectService.getByAll({ pm_status: "R" }).subscribe((response: any) => (this.dataset = response.data));
  }

  prepareGridpm() {
    this.columnDefinitionspm = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "pm_code",
        name: "Code project",
        field: "pm_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pm_desc",
        name: "Designation",
        field: "pm_desc",
        sortable: true,
        width: 120,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionspm = {
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
    this.projectService.getByAll({ pm_status: "R" }).subscribe((response: any) => (this.datasetpm = response.data));
  }

  open(content) {
    this.prepareGridpm();
    this.modalService.open(content, { size: "lg" });
  }
}
