import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { AngularGridInstance, Column, FieldType, GridOption, OnEventArgs, GridService } from "angular-slickgrid";

import { BehaviorSubject, Observable } from "rxjs";
import { LayoutUtilsService, MessageType } from "src/app/core/_base/crud";
import { MobileServiceService, PrinterModel, RoleService, ItineraryService, PrintersService, UsersService } from "../../../../core/erp";

@Component({
  selector: "kt-set-printer",
  templateUrl: "./set-printer.component.html",
  styleUrls: ["./set-printer.component.scss"],
})
export class SetPrinterComponent implements OnInit {
  options = [{ id: "true", label: "true" }];
  printersForm: FormGroup;
  printer: PrinterModel;
  hasFormErrors = false;
  selectedOptions: string;
  isExist = false;
  message: any;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  gridObj: any;
  angularGrid: AngularGridInstance;
  users: [];
  allPrinters: [];
  printersAffected: any[] = [];
  constructor(
    config: NgbDropdownConfig,
    private printerForm: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private printerService: PrintersService,
    private userService: UsersService,
    // private gridService: GridService,
    private modalService: NgbModal
  ) {
    config.autoClose = true;
    this.printerService.getAll().subscribe((response: any) => {
      this.allPrinters = response.data.map((item) => {
        return item;
      });
    });
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.createForm();
  }

  createForm() {
    this.loadingSubject.next(false);
    this.printer = new PrinterModel();
    this.printersForm = this.printerForm.group({
      usrd_code: ["", Validators.required],
      printer_desc: ["", Validators.required],
      printer_type: ["", Validators.required],
      printer_path: ["", Validators.required],
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
        id: "usrd_code",
        name: "code utilisateur",
        field: "usrd_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "usrd_name",
        name: "description",
        field: "usrd_name",
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
    this.userService.getAllUsers().subscribe((response: any) => (this.users = response.data));
  }

  openUsers(content) {
    this.prepareGrid();
    this.modalService.open(content, { size: "lg" });
  }

  handleSelectedRowsChanged(e, args) {
    const controls = this.printersForm.controls;
    if (Array.isArray(args.rows) && this.gridObj) {
      args.rows.map((idx) => {
        const item = this.gridObj.getDataItem(idx);
        controls.usrd_code.setValue(item.usrd_code || "");
      });
    }
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = (angularGrid && angularGrid.slickGrid) || {};
  }

  reset() {
    this.printer = new PrinterModel();
    this.createForm();
    this.hasFormErrors = false;
  }
  goBack() {
    this.loadingSubject.next(false);
    const url = ``;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.printersForm.controls;
    /** check form */
    // if (this.printersForm.invalid) {
    //   Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());

    //   this.hasFormErrors = true;
    //   return;
    // }

    // tslint:disable-next-line:prefer-const
    let printer = this.preparePrinter();

    this.addPrinter(printer);
  }

  preparePrinter(): PrinterModel {
    const controls = this.printersForm.controls;
    const _printer = new PrinterModel();
    _printer.printer_code = controls.usrd_code.value;
    _printer.printer_desc = controls.printer_desc.value;
    _printer.printer_path = controls.printer_path.value;
    _printer.printer_type = controls.printer_type.value;

    return _printer;
  }

  addPrinter(_printer: PrinterModel) {
    this.loadingSubject.next(true);
    this.printerService.add(_printer).subscribe(
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

  addListPrinters(printer, i) {
    if (printer.isChecked === true) {
      printer.isChecked = false;
      const l = document.getElementById(i);
      l.classList.add("selected");
      this.printersAffected.push(printer);
    } else {
      printer.isChecked = true;
      const l = document.getElementById(i);
      l.classList.remove("selected");
      this.printersAffected = this.printersAffected.filter((s) => s !== printer);
    }
  }
}
