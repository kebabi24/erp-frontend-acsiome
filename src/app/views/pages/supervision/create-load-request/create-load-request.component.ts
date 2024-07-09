import { array } from "@amcharts/amcharts4/core";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { AngularGridInstance, Column, FieldType, GridOption, OnEventArgs, GridService, Editors, thousandSeparatorFormatted, Formatters } from "angular-slickgrid";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { BehaviorSubject, Observable } from "rxjs";
import { LayoutUtilsService, MessageType } from "src/app/core/_base/crud";
import { MobileServiceService, MobileService, RoleService, ItineraryService, LoadRequestService, UsersMobileService } from "../../../../core/erp";
import { MobileSettingsService } from "../../../../core/erp";
import jsPDF from "jspdf";
import { NumberToLetters } from "src/app/core/erp/helpers/numberToString";

import "jspdf-barcode";
@Component({
  selector: "kt-create-load-request",
  encapsulation: ViewEncapsulation.None,

  templateUrl: "./create-load-request.component.html",
  styleUrls: ["./create-load-request.component.scss"],
})
export class CreateLoadRequestComponent implements OnInit {
  service: MobileService;
  validationForm: FormGroup;
  hasFormErrors = false;
  isExist = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  sum: string = "";
  role_code: any;
  load_request_code: any;
  roles: any[] = [];
  loadRequests: any[] = [];
  loadRequestData: any[] = [];
  printLines: any[] = [];
  qty: number = 0;
  saved_data: any;
  user_mobile: any;
  user;
  domain;
  ld: [];
  columnDefinitionsld: Column[] = [];
  gridOptionsld: GridOption = {};
  gridObjld: any;
  angularGridld: AngularGridInstance;
  constructor(config: NgbDropdownConfig, private profileFB: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal, public dialog: MatDialog, private loadRequestService: LoadRequestService, private layoutUtilsService: LayoutUtilsService, private userMobileService: UsersMobileService, private sanitizer: DomSanitizer,private roleService: RoleService) {
    config.autoClose = true;
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user = JSON.parse(localStorage.getItem("user"));
    this.domain = JSON.parse(localStorage.getItem("domain"));
    this.prepareRoles();
    // this.getLoadRequestCreationData();
    this.createForm();
  }

  onSubmit() {
    let lines = [],
      i = 1;

    let loadRequest = {
      role_code: this.role_code,
      date_creation: new Date(),
      status: 10,
    };

    for (const page of this.loadRequestData) {
      for (const product of page.productPageDetails) {
        if (product.item.pt_ord_min > 0 && product.item.pt_ord_min > 0) {
          lines.push({
            date_creation: new Date(),
            line: i,
            product_code: product.item.pt_part,
            qt_request: 0,
            qt_validated: product.item.pt_ord_min,
            qt_effected: 0,
            pt_price: product.item.priceLists.length > 0 ? product.item.priceLists[0].salesprice : product.item.pt_price,
          });
          this.printLines.push({
            line: i,
            product_code: product.item.pt_part,
            product_name: product.item.pt_desc1,
            qt_request: 0,
            qt_validated: product.item.pt_ord_min,
            qt_effected: 0,
            pt_price: product.item.priceLists.length > 0 ? product.item.priceLists[0].salesprice : product.item.pt_price,
          });
          i++;
        }
      }
    }
    console.log("liiiines", lines);
    this.loadRequestService.createLoadRequestAndLines(loadRequest, lines).subscribe(
      (response: any) => {
        const controls = this.validationForm.controls;
        this.saved_data = response.data;
        if (controls.print.value == true) {
          this.printpdf();
        }
        this.resetData();
        this.createForm();
        // this.role_code = "";
        this.printLines = [];
      },
      (error) => {
        console.log(error);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Load Request created", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        this.router.navigateByUrl("/supervision/create-load-request");
      }
    );
  }

  goBack() {
    this.loadingSubject.next(false);
    const url = `/service`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  getSum(column): number {
    let sum = 0;
    column.forEach((element) => {
      sum = Number(sum) + Number(element.ld_qty_oh);
    });
    return sum;
  }
  returnData(column): string {
    this.sum = "";
    column.forEach((element) => {
      this.sum += `Code lot : ${element.ld_lot}: Quantité :${element.ld_qty_oh} ||  `;
    });
    return this.sum;
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
  resetData() {
    for (const page of this.loadRequestData) {
      for (const product of page.products) {
        product.qt_request = 0;
        product.qt_validated = 0;
      }
    }
  }

  // GET ROLES OF THE SUPERVISOR
  prepareRoles() {
    this.roleService.getAllRoles().subscribe(
      (response: any) => {
        this.roles = response.data;
        console.log(this.roles);
      },
      (error) => {
        this.roles = [];
      },
      () => {}
    );
  }

  // GET DATA OF THE SELECTED LOADREQUEST
  // getLoadRequestCreationData() {
  //   this.loadRequestService.getLoadRequestCreationData().subscribe(
  //     (response: any) => {
  //       this.loadRequestData = response.loadRequestData;
  //       console.log(response.loadRequestData);
  //     },
  //     (error) => {
  //       this.loadRequestData = [];
  //     },
  //     () => {}
  //   );
  // }

  onSelectRole(role_code) {
    this.role_code = role_code;
    let index = this.roles.findIndex((role) => {
      return role.role_code === role_code;
    });

    this.userMobileService.getByOne({ user_mobile_code: this.roles[index].user_mobile_code }).subscribe((response: any) => {
      this.user_mobile = response.data;

      console.log(this.user_mobile);
      // let profile_code = this.user_mobile.profile_code
      //this.getLoadRequestCreationData(profile_code)
    });
    this.loadRequestService.getLoadRequestDataByRole(this.role_code).subscribe(
      (response: any) => {
        this.loadRequestData = response.loadRequestData;
        console.log(response.loadRequestData);
      },
      (error) => {
        this.loadRequestData = [];
      },
      () => {}
    );
  }

  onInputChanged(pageCode, prodCode, value) {
    const indexPage = this.loadRequestData.findIndex((loadRequest) => {
      return loadRequest.product_page_code === pageCode;
    });

    const indexProduct = this.loadRequestData[indexPage].productPageDetails.findIndex((product) => {
      return product.product_code === prodCode;
    });

    this.loadRequestData[indexPage].productPageDetails[indexProduct].item.pt_ord_min = +value;
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

  printpdf() {
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

    doc.barcode(this.saved_data.load_request_code, {
      fontSize: 70,
      textColor: "#000000",
      x: 100,
      y: 60,
      textOptions: { align: "center" }, // optional text options
    });

    doc.setFont("Times-Roman");

    doc.setFontSize(12);
    doc.text("Demande de chargement : " + this.saved_data.load_request_code, 70, initialY + 5);

    doc.setFontSize(10);
    doc.text("Role    : " + this.saved_data.role_code, 20, initialY + 10);
    doc.text("Date    : " + this.saved_data.date_creation.split("T")[0], 20, initialY + 15);
    doc.text("Vendeur : " + this.user_mobile.user_mobile_code + " - " + this.user_mobile.username, 20, initialY + 20);
    doc.setFontSize(9);

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
        doc.text("Demande de chargement : " + this.saved_data.load_request_code, 70, 60);
        doc.setFontSize(8);

        doc.setFontSize(8);
        doc.text("Role    : " + this.saved_data.role_code, 20, 70);
        doc.text("Date    : " + this.saved_data.date_creation.split("T")[0], 20, 75);
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

      if (this.printLines[j].product_name.length > 35) {
        doc.setFontSize(8);

        let line = this.printLines[j];

        let desc1 = line.product_name.substring(0, 34);
        let ind = desc1.lastIndexOf(" ");
        desc1 = line.product_name.substring(0, ind);
        let desc2 = line.product_name.substring(ind + 1);

        doc.line(10, i - 5, 10, i);
        doc.text(String(line.line), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(line.product_code, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(desc1, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(line.pt_price), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(String(line.qt_request), 143, i - 1, { align: "right" });
        doc.line(145, i - 5, 145, i);
        doc.text(String(line.qt_validated), 168, i - 1, { align: "right" });
        doc.line(170, i - 5, 170, i);
        doc.text(String(line.qt_effected), 193, i - 1, { align: "right" });
        doc.line(195, i - 5, 195, i);

        i = i + 5;

        doc.text(desc2, 47, i - 1);

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
        doc.text(String(line.line), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(line.product_code, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(line.product_name, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(line.pt_price), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(String(line.qt_request), 143, i - 1, { align: "right" });
        doc.line(145, i - 5, 145, i);
        doc.text(String(line.qt_validated), 168, i - 1, { align: "right" });
        doc.line(170, i - 5, 170, i);
        doc.text(String(line.qt_effected), 193, i - 1, { align: "right" });
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
