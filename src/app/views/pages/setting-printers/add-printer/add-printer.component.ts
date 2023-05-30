import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { AngularGridInstance, Column, FieldType, GridOption, OnEventArgs, GridService } from "angular-slickgrid";

import { BehaviorSubject, Observable } from "rxjs";
import { LayoutUtilsService, MessageType } from "src/app/core/_base/crud";
import { MobileServiceService, PrinterModel, RoleService, ItineraryService, PrintersService } from "../../../../core/erp";

@Component({
  selector: "kt-add-printer",
  templateUrl: "./add-printer.component.html",
  styleUrls: ["./add-printer.component.scss"],
})
export class AddPrinterComponent implements OnInit {
  printersForm: FormGroup;
  printer: PrinterModel;
  hasFormErrors = false;
  isExist = false;
  message: any;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  constructor(
    config: NgbDropdownConfig,
    private printerForm: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private printerService: PrintersService,
    // private gridService: GridService,
    private modalService: NgbModal
  ) {
    config.autoClose = true;
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
      printer_code: ["", Validators.required],
      printer_desc: ["", Validators.required],
      printer_type: ["", Validators.required],
      printer_path: ["", Validators.required],
    });
  }

  onChangeCode() {
    const controls = this.printersForm.controls;

    this.printerService.getBy({ printer_code: controls.printer_code.value }).subscribe((res: any) => {
      console.log("aa", res.data);

      if (res.data) {
        this.isExist = true;
      } else {
        controls.printer_desc.enable();
        controls.printer_path.enable();

        controls.printer_type.enable();
      }
    });
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
    _printer.printer_code = controls.printer_code.value;
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
}
