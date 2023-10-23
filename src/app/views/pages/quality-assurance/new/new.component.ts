import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import { Column, GridOption, Formatter, Editor, Editors, FieldType, OnEventArgs, AngularGridInstance } from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
// Layout
import { SubheaderService, LayoutConfigService } from "../../../../core/_base/layout";
// CRUD
import { LayoutUtilsService, TypesUtilsService, MessageType } from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";

import { User, UsersService, SiteService, ProjectService, EmployeService, LocationService, AffectEmpService } from "../../../../core/erp";
import { MenuConfig } from "../../../../core/_config/menu.config";
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Sensibilisation } from "../../../../core/erp";
@Component({
  selector: "kt-new",
  templateUrl: "./new.component.html",
  styleUrls: ["./new.component.scss"],
})
export class NewComponent implements OnInit {
  user: User;
  userForm: FormGroup;
  hasFormErrors = false;
  isExist = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  projects: [];
  employees: [];
  educators: [];
  locations: [];
  specificationDetails: [];
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  columnDefinitionsEmployees: Column[] = [];
  gridOptionsEmployees: GridOption = {};
  columnDefinitionsEducator: Column[] = [];
  gridOptionsEducator: GridOption = {};
  columnDefinitionsLocation: Column[] = [];
  gridOptionsLocation: GridOption = {};
  gridObj: any;
  angularGrid: AngularGridInstance;
  checkedMpd: any[] = [];
  selectedTitle: any;
  message: any;

  gridObjEmployees: any;
  angularGridEmployees: AngularGridInstance;
  gridObjEducator: any;
  angularGridEducator: AngularGridInstance;
  gridObjLocation: any;
  angularGridLocation: AngularGridInstance;
  error = false;

  constructor(config: NgbDropdownConfig, private userFB: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog, private layoutUtilsService: LayoutUtilsService, private projectService: ProjectService, private employeesService: EmployeService, private locationService: LocationService, private affectEmployees: AffectEmpService, private modalService: NgbModal) {
    config.autoClose = true;
    console.log(new MenuConfig().defaults);
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.projectService.getSpecificationDetails({ mpd_nbr: "E-07.12" }).subscribe((res: any) => {
      this.specificationDetails = res.data.map((item) => {
        return item;
      });
    });

    this.createForm();
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);

    this.userForm = this.userFB.group({
      project_code: ["", Validators.required],
      employees: ["", Validators.required],
      educator: ["", Validators.required],
      duration: ["", [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      formation_date: ["this.user.formation_date"],
      location: ["", Validators.required],
    });
  }

  prepareGrid() {
    this.columnDefinitions = [
      // {
      //   id: "id",
      //   name: "id",
      //   field: "id",
      //   sortable: true,
      //   minWidth: 80,
      //   maxWidth: 80,
      // },
      {
        id: "pm_code",
        name: "code projet",
        field: "pm_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pm_desc",
        name: "description projet",
        field: "pm_desc",
        sortable: true,
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
    this.projectService.getAll().subscribe((response: any) => (this.projects = response.data));
  }

  prepareGridEmployees() {
    this.columnDefinitionsEmployees = [
      // {
      //   id: "id",
      //   name: "id",
      //   field: "id",
      //   sortable: true,
      //   minWidth: 80,
      //   maxWidth: 80,
      // },
      {
        id: "pme_employe",
        name: "code employe",
        field: "pme_employe",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pme_inst",
        name: "emp inst",
        field: "pme_inst",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pme_start_date",
        name: "emp start date",
        field: "pme_start_date",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pme_end_date",
        name: "Site",
        field: "pme_end_date",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionsEmployees = {
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
    const controls = this.userForm.controls;
    this.affectEmployees.getBy({ pme_pm_code: controls.project_code.value }).subscribe((response: any) => (this.employees = response.data));
  }

  prepareGridEducator() {
    this.columnDefinitionsEducator = [
      // {
      //   id: "id",
      //   name: "id",
      //   field: "id",
      //   sortable: true,
      //   minWidth: 80,
      //   maxWidth: 80,
      // },
      {
        id: "emp_fname",
        name: "Educator name",
        field: "emp_fname",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "emp_lname",
        name: "educator last name",
        field: "emp_lname",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionsEducator = {
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
    this.employeesService.getAll().subscribe((response: any) => (this.educators = response.data));
  }

  prepareGridLocation() {
    this.columnDefinitionsLocation = [
      // {
      //   id: "id",
      //   name: "id",
      //   field: "id",
      //   sortable: true,
      //   minWidth: 80,
      //   maxWidth: 80,
      // },
      {
        id: "loc_loc",
        name: "location code",
        field: "loc_loc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "loc_site",
        name: "site location",
        field: "loc_site",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "loc_desc",
        name: "descrption location",
        field: "loc_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionsLocation = {
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
    this.locationService.getAll().subscribe((response: any) => (this.locations = response.data));
  }

  open(content) {
    this.prepareGrid();
    this.modalService.open(content, { size: "lg" });
  }
  handleSelectedRowsChanged(e, args) {
    const controls = this.userForm.controls;
    if (Array.isArray(args.rows) && this.gridObj) {
      args.rows.map((idx) => {
        const item = this.gridObj.getDataItem(idx);
        controls.project_code.setValue(item.pm_code || "");
      });
    }
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = (angularGrid && angularGrid.slickGrid) || {};
  }
  openEmployees(content) {
    this.prepareGridEmployees();
    this.modalService.open(content, { size: "lg" });
  }
  handleSelectedRowsChangedEmployees(e, args) {
    const controls = this.userForm.controls;
    if (Array.isArray(args.rows) && this.gridObjEmployees) {
      args.rows.map((idx) => {
        const item = this.gridObjEmployees.getDataItem(idx);
        controls.usrd_profile.setValue(item.usrg_code || "");
      });
    }
  }
  angularGridReadyEmployees(angularGrid: AngularGridInstance) {
    this.angularGridEmployees = angularGrid;
    this.gridObjEmployees = (angularGrid && angularGrid.slickGrid) || {};
  }

  openEducator(content) {
    this.prepareGridEducator();
    this.modalService.open(content, { size: "lg" });
  }
  handleSelectedRowsChangedEducator(e, args) {
    const controls = this.userForm.controls;
    if (Array.isArray(args.rows) && this.gridObjEducator) {
      args.rows.map((idx) => {
        const item = this.gridObjEducator.getDataItem(idx);
        controls.usrd_profile.setValue(item.usrg_code || "");
      });
    }
  }
  angularGridReadyEducator(angularGrid: AngularGridInstance) {
    this.angularGridEducator = angularGrid;
    this.gridObjEducator = (angularGrid && angularGrid.slickGrid) || {};
  }

  openLocation(content) {
    this.prepareGridLocation();
    this.modalService.open(content, { size: "lg" });
  }
  handleSelectedRowsChangedLocation(e, args) {
    const controls = this.userForm.controls;
    if (Array.isArray(args.rows) && this.gridObjLocation) {
      args.rows.map((idx) => {
        const item = this.gridObjLocation.getDataItem(idx);
        controls.usrd_profile.setValue(item.usrg_code || "");
      });
    }
  }
  angularGridReadyLocation(angularGrid: AngularGridInstance) {
    this.angularGridLocation = angularGrid;
    this.gridObjLocation = (angularGrid && angularGrid.slickGrid) || {};
  }

  goBack() {
    this.loadingSubject.next(false);
    const url = `/user-mstr/users-list`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  reset() {
    this.createForm();
    this.hasFormErrors = false;
  }

  /**
   * Returns object for saving
   */
  prepareData(): Sensibilisation {
    const controls = this.userForm.controls;
    const _sensibilisation_data = new Sensibilisation();
    _sensibilisation_data.code_project = controls.project_code.value;

    _sensibilisation_data.code_employee = controls.employees.value;
    _sensibilisation_data.code_educator = controls.educator.value;
    _sensibilisation_data.date = controls.formation_date.value ? `${controls.formation_date.value.year}/${controls.formation_date.value.month}/${controls.formation_date.value.day}` : null;

    _sensibilisation_data.duration = controls.duration.value;

    _sensibilisation_data.location = controls.location.value;

    return _sensibilisation_data;
  }

  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.userForm.controls;
    /** check form */
    if (this.userForm.invalid) {
      Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());

      this.hasFormErrors = true;
      return;
    }

    // tslint:disable-next-line:prefer-const
    let sensibilisation_data = this.prepareData();
    this.addData(sensibilisation_data);
  }

  addData(data: Sensibilisation) {
    this.loadingSubject.next(true);
    this.projectService.addSensibilisationData({ data, mpd: this.checkedMpd }).subscribe(
      (reponse) => console.log("response", Response),
      (error) => {
        this.layoutUtilsService.showActionNotification("Erreur verifier les informations", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        this.router.navigateByUrl("/");
      }
    );
  }

  onChange(event: Event, mpd: any) {
    const isChecked = (event.target as HTMLInputElement).checked;
    // Handle the checkbox change event here
    if (isChecked) {
      this.checkedMpd.push(mpd);
    } else {
      this.checkedMpd = this.checkedMpd.filter((s) => s !== mpd);
    }
    console.log(this.checkedMpd);
  }

  test(){
    
  }
}
