import { array } from "@amcharts/amcharts4/core";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { AngularGridInstance, Column, FieldType, GridOption, OnEventArgs, GridService, Editors, thousandSeparatorFormatted, Formatters } from "angular-slickgrid";

import { BehaviorSubject, Observable } from "rxjs";
import { LayoutUtilsService, MessageType } from "src/app/core/_base/crud";
import { MobileServiceService, MobileService, RoleService, ItineraryService, LoadRequestService, UsersMobileService } from "../../../../core/erp";
import { MobileSettingsService } from "../../../../core/erp";
import jsPDF from "jspdf";
@Component({
  selector: "kt-validate-charge-demande",
  encapsulation: ViewEncapsulation.None,
  templateUrl: "./validate-charge-demande.component.html",
  styleUrls: ["./validate-charge-demande.component.scss"],
})
export class ValidateChargeDemandeComponent implements OnInit {
  service: MobileService;
  validationForm: FormGroup;
  hasFormErrors = false;
  isExist = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;

  role_code: any;
  load_request_code: any;
  roles: any[] = [];
  loadRequests: any[] = [];
  loadRequestData: any[] = [];

  printLines: any[] = [];
  ld: [];
  columnDefinitionsld: Column[] = [];
  gridOptionsld: GridOption = {};
  gridObjld: any;
  saved_data: any;
  user_mobile: any;
  load_request_header: any;
  user;
  domain;
  angularGridld: AngularGridInstance;
  constructor(config: NgbDropdownConfig, private profileFB: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog, private modalService: NgbModal, private loadRequestService: LoadRequestService, private layoutUtilsService: LayoutUtilsService, private userMobileService: UsersMobileService) {
    config.autoClose = true;
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user = JSON.parse(localStorage.getItem("user"));
    this.domain = JSON.parse(localStorage.getItem("domain"));
    this.prepareRoles();
    this.createForm();
  }

  onSubmit() {
    let i = 1;
    // this.loadRequestData.forEach((page) => {
    //   for (const product of page.products) {
    //     if (product.qt_validated > 0) {
    //       this.printLines.push({ ...product, line: i });
    //       i++;
    //     }
    //   }
    // });
    // console.log(this.loadRequestData);
    this.loadRequestData.forEach((page) => {
      for (const product of page.productPageDetails) {
        if (product.item.loadRequestLine.qt_request > 0) {
          console.log(product.item.loadRequestLine.qt_request);
          this.printLines.push({ ...product, line: i });
          i++;
        }
      }
    });
    console.log(this.printLines);
    this.printpdf();
    this.loadRequestService.updateLoadRequestStatus10(this.load_request_code, this.loadRequestData).subscribe(
      (response: any) => {
        const controls = this.validationForm.controls;

        if (controls.print.value == true) {
          this.printpdf();
        }
        this.loadRequestData = [];
        this.load_request_code = "";
        this.role_code = "";
        this.createForm();
      },
      (error) => {
        // this.loadRequestData = []
        console.log(error);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Load Request updated", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        this.router.navigateByUrl("/supervision/validate-charge-demande");
      }
    );
  }

  goBack() {
    this.loadingSubject.next(false);
    const url = `/service`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  // GET ROLES OF THE SUPERVISOR
  prepareRoles() {
    this.loadRequestService.getRoles(this.user.usrd_code).subscribe(
      (response: any) => {
        this.roles = response.data;
      },
      (error) => {
        this.roles = [];
      },
      () => {}
    );
  }

  // GET LOAD REQUESTS STATUS 0 OF THE SELECTED ROLE
  prepareLoadRequets(role_code) {
    this.loadRequestService.getLoadRequests(role_code).subscribe(
      (response: any) => {
        this.loadRequests = response.data;
      },
      (error) => {
        this.loadRequests = [];
      },
      () => {}
    );
  }
  getSum(column): number {
    let sum = 0;
    column.forEach((element) => {
      sum = Number(sum) + Number(element.ld_qty_oh);
    });
    return sum;
  }
  getValue(value): number {
    let val = 0;
    value !== null ? (val = value.qt_request) : (val = 0);
    return val;
  }
  // GET DATA OF THE SELECTED LOADREQUEST
  prepareLoadRequestData(load_request_data) {
    this.loadRequestService.getLoadRequestsLineWithCode({ role_code: this.role_code, load_request_code: load_request_data }).subscribe(
      (response: any) => {
        this.loadRequestData = response.loadRequestData;
        this.loadRequestData.forEach((page) => {
          for (const product of page.productPageDetails) {
            if (product.item.loadRequestLine == null) {
              product.item.loadRequestLine = { qt_request: 0, pt_price: 0 };
              // this.printLines.push({ ...product, line: i });
              // i++;
            }
          }
        });
        console.log(this.loadRequestData);
        this.load_request_header = response.data;
      },
      (error) => {
        this.loadRequestData = [];
      },
      () => {}
    );
  }

  onSelectRole(role_code) {
    this.prepareLoadRequets(role_code);
    this.role_code = role_code;
    let index = this.roles.findIndex((role) => {
      return role.role_code === role_code;
    });

    this.userMobileService.getByOne({ user_mobile_code: this.roles[index].user_mobile_code }).subscribe((response: any) => {
      this.user_mobile = response.data;
    });
  }

  onSelectLoadRequest(load_request_code) {
    this.prepareLoadRequestData(load_request_code);
    this.load_request_code = load_request_code;
  }

  // onInputChanged(pageCode, prodCode, value) {
  //   console.log("value:" + value);
  //   const indexPage = this.loadRequestData.findIndex((loadRequest) => {
  //     return loadRequest.page_code === pageCode;
  //   });
  //   console.log("pageCodeIndex:" + indexPage);
  //   const indexProduct = this.loadRequestData[indexPage].products.findIndex((product) => {
  //     return product.product_code === prodCode;
  //   });
  //   console.log("prodCodeIndex:" + indexProduct);
  //   this.loadRequestData[indexPage].products[indexProduct].qt_validated = +value;
  //   console.log(this.loadRequestData[indexPage].products[indexProduct]);
  // }
  onInputChanged(pageCode, prodCode, value) {
    const indexPage = this.loadRequestData.findIndex((loadRequest) => {
      return loadRequest.product_page_code === pageCode;
    });

    const indexProduct = this.loadRequestData[indexPage].productPageDetails.findIndex((product) => {
      return product.product_code === prodCode;
    });

    this.loadRequestData[indexPage].productPageDetails[indexProduct].item.loadRequestLine.qt_request = +value;
    this.loadRequestData[indexPage].productPageDetails[indexProduct].item.loadRequestLine.pt_price = this.loadRequestData[indexPage].productPageDetails[indexProduct].item.pt_price;
    // this.loadRequestData[indexPage].products[indexProduct].qt_request = this.loadRequestData[indexPage].products[indexProduct].qt_validated;
  }

  createForm() {
    this.loadingSubject.next(false);
    this.validationForm = this.profileFB.group({
      role_code: [this.role_code],
      load_request_code: [this.load_request_code],
      print: [true],
    });
  }
  prepareGridld() {
    this.columnDefinitionsld = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "ld_lot",
        name: "lot",
        field: "ld_lot",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "ld_qty_oh",
        name: "Quantité stock",
        field: "ld_qty_oh",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_expire",
        name: "Date d'expiration",
        field: "ld_expire",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionsld = {
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
  }
  openld(content, ld) {
    console.log(ld);
    this.ld = ld;
    this.prepareGridld();
    this.modalService.open(content, { size: "lg" });
  }
  angularGridReadysite(angularGrid: AngularGridInstance) {
    this.angularGridld = angularGrid;
    this.gridObjld = (angularGrid && angularGrid.slickGrid) || {};
  }
  printpdf() {
    console.log(this.printLines);
    // const controls = this.totForm.controls
    const controlss = this.validationForm.controls;
    console.log("pdf");
    var doc = new jsPDF();
    let initialY = 65;
    let valueToAddToX = 5;
    var img = new Image();
    img.src = "./assets/media/logos/companylogo.png";
    doc.addImage(img, "png", 150, 5, 50, 30);
    doc.setFontSize(9);
    if (this.domain.dom_name != null) {
      doc.text(this.domain.dom_name, 10, 10);
    }
    if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
    if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
    if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
    doc.setFontSize(14);
    doc.line(10, 35, 200, 35);
    doc.setFontSize(12);
    doc.barcode(this.load_request_code, {
      fontSize: 70,
      textColor: "#000000",
      x: 100,
      y: 60,
      textOptions: { align: "center" }, // optional text options
    });
    doc.setFont("Times-Roman");
    doc.setFontSize(12);
    doc.text("Demande de chargement : " + this.load_request_code, 70, initialY + 5);
    doc.setFontSize(10);
    doc.text("Role    : " + this.role_code, 20, initialY + 10);
    // doc.text("Date    : " + this.load_request_header.date_creation, 20, initialY + 15);
    doc.text("Vendeur : " + this.user_mobile.user_mobile_code + " - " + this.user_mobile.username, 20, initialY + 20);
    doc.setFontSize(9);
    doc.setFontSize(9);
    //  initialY+20
    doc.line(10, initialY + 25, 195, initialY + 25); // 85
    doc.line(10, initialY + 30, 195, initialY + 30); // 90
    doc.line(10, initialY + 25, 10, initialY + 30); // 90
    doc.text("N", 12.5, initialY + 28.5); // 88.5
    doc.line(20, initialY + 25, 20, initialY + 30); // 90
    doc.text("Code Article", 25, initialY + 28.5); // 88.5
    doc.line(45, initialY + 25, 45, initialY + 30); // 90
    doc.text("Désignation", 67.5, initialY + 28.5); // 88.5
    doc.line(100, initialY + 25, 100, initialY + 30); // 90
    doc.text("Prix", 107, initialY + 28.5); // 88.5
    doc.line(120, initialY + 25, 120, initialY + 30); // 90
    doc.text("QTE Demandée", 123, initialY + 28.5); // 88.5
    doc.line(145, initialY + 25, 145, initialY + 30); // 90
    doc.text("QTE Validée", 148, initialY + 28.5); // 88.5
    doc.line(170, initialY + 25, 170, initialY + 30); // 90
    doc.text("QTE Chargée", 173, initialY + 28.5); // 88.5
    doc.line(195, initialY + 25, 195, initialY + 30); // 90
    var i = 95 + valueToAddToX;
    doc.setFontSize(10);
    for (let j = 0; j < this.printLines.length; j++) {
      if (j % 30 == 0 && j != 0) {
        doc.addPage();
        img.src = "./assets/media/logos/companylogo.png";
        doc.addImage(img, "png", 150, 5, 50, 30);
        doc.setFontSize(9);
        if (this.domain.dom_name != null) {
          doc.text(this.domain.dom_name, 10, 10);
        }
        if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
        if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
        if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
        doc.setFontSize(14);
        doc.line(10, 35, 200, 35);
        doc.setFontSize(12);
        doc.text(this.saved_data.load_request_code, 70, 40);
        doc.setFontSize(8);
        doc.setFontSize(12);
        doc.text("Demande de chargement : " + this.load_request_code, 70, 60);
        doc.setFontSize(8);
        doc.setFontSize(8);
        doc.text("Role    : " + this.role_code, 20, 70);
        doc.text("Date    : " + this.load_request_header.date_creation, 20, 75);
        doc.text("Vendeur : " + this.user_mobile.user_mobile_code + " - " + this.user_mobile.username, 20, 80);
        doc.line(10, initialY + 25, 195, initialY + 25); // 85
        doc.line(10, initialY + 30, 195, initialY + 30); // 90
        doc.line(10, initialY + 25, 10, initialY + 30); // 90
        doc.text("N", 12.5, initialY + 28.5); // 88.5
        doc.line(20, initialY + 25, 20, initialY + 30); // 90
        doc.text("Code Article", 25, initialY + 28.5); // 88.5
        doc.line(45, initialY + 25, 45, initialY + 30); // 90
        doc.text("Désignation", 67.5, initialY + 28.5); // 88.5
        doc.line(100, initialY + 25, 100, initialY + 30); // 90
        doc.text("Prix", 107, initialY + 28.5); // 88.5
        doc.line(120, initialY + 25, 120, initialY + 30); // 90
        doc.text("QTE Demandée", 123, initialY + 28.5); // 88.5
        doc.line(145, initialY + 25, 145, initialY + 30); // 90
        doc.text("QTE Validée", 148, initialY + 28.5); // 88.5
        doc.line(170, initialY + 25, 170, initialY + 30); // 90
        doc.text("QTE Chargée", 173, initialY + 28.5); // 88.5
        doc.line(195, initialY + 25, 195, initialY + 30); // 90
        var i = 95 + valueToAddToX;
      }
      if (this.printLines[j].item.pt_desc1.length > 35) {
        doc.setFontSize(10);
        let line = this.printLines[j].item;
        let desc1 = line.pt_desc1.substring(0, 34);
        let ind = desc1.lastIndexOf(" ");
        desc1 = line.pt_desc1.substring(0, ind);
        let desc2 = line.pt_desc1.substring(ind + 1);
        doc.line(10, i - 5, 10, i);
        doc.text(String(this.printLines[j].line), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.printLines[j].item.pt_part, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(this.printLines[j].item.pt_desc1, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(this.printLines[j].item.loadRequestLine.pt_price), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(String(this.printLines[j].item.loadRequestLine.qt_request), 143, i - 1, { align: "right" });
        doc.line(145, i - 5, 145, i);
        doc.text(String(this.printLines[j].item.loadRequestLine.qt_request), 168, i - 1, { align: "right" });
        doc.line(170, i - 5, 170, i);
        doc.text("", 193, i - 1, { align: "right" });
        doc.line(195, i - 5, 195, i);
        i = i + 5;
        doc.text(this.printLines[j].item.pt_desc1, 47, i - 1);
        doc.line(10, i - 5, 10, i);
        doc.line(20, i - 5, 20, i);
        doc.line(45, i - 5, 45, i);
        doc.line(100, i - 5, 100, i);
        doc.line(120, i - 5, 120, i);
        doc.line(145, i - 5, 145, i);
        doc.line(170, i - 5, 170, i);
        doc.line(195, i - 5, 195, i);
        i = i + 5;
      } else {
        doc.setFontSize(8);
        let line = this.printLines[j];
        doc.line(10, i - 5, 10, i);
        doc.text(String(this.printLines[j].line), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.printLines[j].item.pt_part, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(this.printLines[j].item.pt_desc1, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(this.printLines[j].item.loadRequestLine.pt_price), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(String(this.printLines[j].item.loadRequestLine.qt_request), 143, i - 1, { align: "right" });
        doc.line(145, i - 5, 145, i);
        doc.text(String(this.printLines[j].item.loadRequestLine.qt_request), 168, i - 1, { align: "right" });
        doc.line(170, i - 5, 170, i);
        doc.text("", 193, i - 1, { align: "right" });
        doc.line(195, i - 5, 195, i);
        i = i + 5;
      }
      doc.line(10, i - 5, 195, i - 5);
    }
    doc.line(10, i - 5, 195, i - 5);
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
  }
}
