import { array } from "@amcharts/amcharts4/core";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"  
import { LayoutUtilsService, MessageType } from "src/app/core/_base/crud";
import { MobileServiceService, MobileService, RoleService,LocationDetailService, ItineraryService, LoadRequestService, UsersMobileService, LocationService } from "../../../../core/erp";
import { MobileSettingsService } from "../../../../core/erp";
import jsPDF from "jspdf";
import { NumberToLetters } from "src/app/core/erp/helpers/numberToString";
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
} from "angular-slickgrid"
import "jspdf-barcode";
@Component({
  selector: 'kt-print-inventory-role',
  templateUrl: './print-inventory-role.component.html',
  styleUrls: ['./print-inventory-role.component.scss']
})
export class PrintInventoryRoleComponent implements OnInit {

 
  service: MobileService;
  ldForm: FormGroup;
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
  total: number = 0;
  totalCartons: number = 0;
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  draggableGroupingPlugin: any;
  angularGrid: AngularGridInstance;
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  grid: any;
  gridService: GridService;
  dataview: any;
role_name: any
  constructor(config: NgbDropdownConfig, 
              private profileFB: FormBuilder, 
              private activatedRoute: ActivatedRoute, 
              private router: Router, 
              private modalService: NgbModal, 
              public dialog: MatDialog, 
              private loadRequestService: LoadRequestService, 
              private layoutUtilsService: LayoutUtilsService, 
              private userMobileService: UsersMobileService, 
              private locationDetailService : LocationDetailService,
              private roleService: RoleService,
              private locationService : LocationService,
              private sanitizer: DomSanitizer) {
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
    this.prepareGrid();
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
    this.total = 0
    this.totalCartons = 0
    const controls = this.ldForm.controls
    this.role_code = role_code;
    let index = this.roles.findIndex((role) => {
      return role.role_code === role_code;
    });
    this.role_name = this.roles[index].role_name
console.log(this.roles[index])
    this.locationDetailService.getByPriceRole({ ld_loc: this.roles[index].role_loc, ld_site:this.roles[index].role_site }).subscribe((response: any) => {
        this.dataset = response.data;
        
        this.dataview.setItems(this.dataset)
        this.dataset.map((element) => {
          this.total = Number(this.total) + ( Number(element.amt) * Number(element.qty) * 1.2138);
          this.totalCartons = this.totalCartons + Number(element.qty);
          
        });
        controls.qty.setValue(this.totalCartons)
        controls.amt.setValue(this.total.toFixed(2))
        console.log(response.data);
        this.locationService.getByOne({ loc_loc: this.roles[index].role_loc, loc_site:this.roles[index].role_site }).subscribe((respo: any) => {
         if(respo.data != null) {
          controls.matricule.setValue(respo.data.loc_phys_addr)
         }
        });
      },
      (error) => {
        this.loadRequestData = [];
      },
      () => {}
    );
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.grid = angularGrid.slickGrid; // grid object
    this.dataview = angularGrid.dataView;
    this.gridService = angularGrid.gridService;
  }
  prepareGrid() {


   
      this.columnDefinitions = [
          
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
            id: "part",
            name: "Article",
            field: "part",
            sortable: true,
            filterable: true,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            type: FieldType.string,
          }, 
          {
            id: "desc",
            name: "Description",
            field: "desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          },          
          {
            id: "qty",
            name: "Quantité",
            field: "qty",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.decimal,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
          },
         
          
          {
            id: "amt",
            name: "Prix",
            field: "amt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.decimal,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
          },
         

      ]

      this.gridOptions = {
      /*  autoResize: {
          containerId: 'demo-container',
          sidePadding: 10
        },*/
        enableFiltering: true,
        autoHeight: false,
        enableSorting: true,
        exportOptions: {
          sanitizeDataExport: true
        },
        formatterOptions: {
        
          // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
          displayNegativeNumberWithParentheses: false,
    
          // Defaults to undefined, minimum number of decimals
          minDecimal:2,
          maxDecimal:2,
    
          // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
          thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
        },
        // presets: {
        //   filters: [
           
        //     // { columnId: 'complete', searchTerms: ['5'], operator: '>' },
        //     { columnId: 'tr_effdate', operator: '>=', searchTerms: [this.datefilter] },
        //     // { columnId: 'effort-driven', searchTerms: [true] },
        //   ],
        //   // sorters: [
        //   //   { columnId: 'duration', direction: 'DESC' },
        //   //   { columnId: 'complete', direction: 'ASC' }
        //   // ],
        // },

    }

    // fill the dataset with your data
    this.dataset = []
    // this.inventoryTransactionService.getAll().subscribe(
      
    //     (response: any) => {this.dataset = response.data
    //       this.dataview.setItems(this.dataset)},
        
    //     (error) => {
    //         this.dataset = []
    //     },
    //     () => {}
        
    // )
    // console.log(this.dataset)
}
  createForm() {
    this.loadingSubject.next(false);
    this.ldForm = this.profileFB.group({
      role_code: [this.role_code],
      qty:[0],
      amt:[0],
      matricule:[""]
    
    });
  }
  onGroupChanged(change: { caller?: string; groupColumns: Grouping[] }) {
    // the "caller" property might not be in the SlickGrid core lib yet, reference PR https://github.com/6pac/SlickGrid/pull/303
    const caller = change && change.caller || [];
    const groups = change && change.groupColumns || [];

    if (Array.isArray(this.selectedGroupingFields) && Array.isArray(groups) && groups.length > 0) {
      // update all Group By select dropdown
      this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = groups[i] && groups[i].getter || '');
    } else if (groups.length === 0 && caller === 'remove-group') {
      this.clearGroupingSelects();
    }
  }
  clearGroupingSelects() {
    this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = '');
  }
  
  collapseAllGroups() {
    this.dataview.collapseAllGroups();
  }

  expandAllGroups() {
    this.dataview.expandAllGroups();
  }
  clearGrouping() {
    if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
      this.draggableGroupingPlugin.clearDroppedGroups();
    }
    this.grid.invalidate(); // invalidate all rows and re-render
  }



 
  printpdf() {
     const controls = this.ldForm.controls;
    // const controlss = this.soForm.controls;
    console.log("pdf");
    var doc = new jsPDF();
    const date = new Date();
    // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
    var img = new Image();
    img.src = "./assets/media/logos/companylogo.png";
    doc.addImage(img, "png", 150, 2, 50, 25);
    doc.setFontSize(9);
    if (this.domain.dom_name != null) {
      doc.text(this.domain.dom_sname, 10, 10);
    }
    if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr + " " +this.domain.dom_city + " " + this.domain.dom_country, 10, 15);
    //if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
    if (this.domain.dom_tel1 != null) doc.text("Tel : " + this.domain.dom_tel1 + " / " + this.domain.dom_tel2 + " " + "FAX : " + this.domain.dom_fax, 10, 20);
    doc.setFontSize(12);
    const nbr = Math.floor(Math.random() * (1365 - 1000 + 1) ) + 1000;
    doc.text("Facture N° : " + String(date.getFullYear()).substring(2,4) + "-" + String(nbr), 70, 40);
    doc.text("Date     : " + + String(date.getFullYear())+"/" + String(date.getMonth() + 1) + "/" + String(date.getDate()) + " " , 150, 40);
    
    doc.setFontSize(8);
    // console.log(this.customer.address.ad_misc2_id);
    doc.text("Client : " + this.role_code, 20, 50);
    doc.text("Nom    : " + this.role_name, 20, 55);
    doc.text("Matricule    : " + controls.matricule.value, 20, 60);
    // doc.text("Adresse       : " + this.customer.address.ad_line1, 20, 60);
    doc.line(8, 25, 200, 25);
    doc.line(8, 32, 200, 32);
    if (this.domain.dom_nif != null) {
      doc.text("MF  : " + this.domain.dom_nif, 10, 30);
    }
    if (this.domain.dom_rc != null) {
      doc.text("RC  : " + this.domain.dom_rc, 60, 30);
    }
    if (this.domain.dom_ai) {
      doc.text("AI  : " + this.domain.dom_ai, 110, 30);
    }
    if (this.domain.dom_nis != null) {
      doc.text("NIS : " + this.domain.dom_nis, 160, 30);
    }
    doc.line(10, 85, 200, 85);
    doc.line(10, 90, 200, 90);
    doc.line(10, 85, 10, 90);
    doc.text("LN", 12.5, 88.5);
    doc.line(20, 85, 20, 90);
    doc.text("Code Article", 25, 88.5);
    doc.line(45, 85, 45, 90);
    doc.text("Désignation", 67.5, 88.5);
    doc.line(100, 85, 100, 90);
    doc.text("QTE", 107, 88.5);
    doc.line(120, 85, 120, 90);
    doc.text("UM", 123, 88.5);
    doc.line(130, 85, 130, 90);
    doc.text("PU", 138, 88.5);
    doc.line(150, 85, 150, 90);
    doc.text("TVA", 152, 88.5);
    doc.line(160, 85, 160, 90);
    doc.text("REM", 162, 88.5);
    doc.line(170, 85, 170, 90);
    doc.text("THT", 181, 88.5);
    doc.line(200, 85, 200, 90);
    var i = 95;
    doc.setFontSize(6);
    for (let j = 0; j < this.dataset.length; j++) {
      if (j % 30 == 0 && j != 0) {
        doc.addPage();
        // img.src = "./assets/media/logos/companylogo.png";
        doc.addImage(img, "png", 150, 2, 50, 30);
        doc.setFontSize(9);
        if (this.domain.dom_name != null) {
          doc.text(this.domain.dom_sname, 10, 10);
        }
        if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr + " " +this.domain.dom_city + " " + this.domain.dom_country, 10, 15);
        //if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
        if (this.domain.dom_tel1 != null) doc.text("Tel : " + this.domain.dom_tel1 + " / " + this.domain.dom_tel2 + " " + "FAX : " + this.domain.dom_fax, 10, 20);
        doc.setFontSize(12);
       // const nbr = Math.floor(Math.random() * (1365 - 1000 + 1) ) + 1000;
        doc.text("Facture N° : " + String(date.getFullYear()).substring(2,4) + "-" + String(nbr), 70, 40);
        doc.text("Date     : " + + String(date.getFullYear())+"/" + String(date.getMonth() + 1) + "/" + String(date.getDate()) + " " , 150, 40);
        
        doc.setFontSize(8);
        // console.log(this.customer.address.ad_misc2_id);
        doc.text("Client : " + this.role_code, 20, 50);
        doc.text("Nom    : " + this.role_name, 20, 55);
        doc.text("Matricule    : " + controls.matricule.value, 20, 60);
        // doc.text("Adresse       : " + this.customer.address.ad_line1, 20, 60);
        doc.line(8, 25, 200, 25);
        doc.line(8, 32, 200, 32);
        if (this.domain.dom_nif != null) {
          doc.text("MF  : " + this.domain.dom_nif, 10, 30);
        }
        if (this.domain.dom_rc != null) {
          doc.text("RC  : " + this.domain.dom_rc, 60, 30);
        }
        if (this.domain.dom_ai) {
          doc.text("AI  : " + this.domain.dom_ai, 110, 30);
        }
        if (this.domain.dom_nis != null) {
          doc.text("NIS : " + this.domain.dom_nis, 160, 30);
        }
        doc.line(10, 85, 200, 85);
        doc.line(10, 90, 200, 90);
        doc.line(10, 85, 10, 90);
        doc.text("LN", 12.5, 88.5);
        doc.line(20, 85, 20, 90);
        doc.text("Code Article", 25, 88.5);
        doc.line(45, 85, 45, 90);
        doc.text("Désignation", 67.5, 88.5);
        doc.line(100, 85, 100, 90);
        doc.text("QTE", 107, 88.5);
        doc.line(120, 85, 120, 90);
        doc.text("UM", 123, 88.5);
        doc.line(130, 85, 130, 90);
        doc.text("PU", 138, 88.5);
        doc.line(150, 85, 150, 90);
        doc.text("TVA", 152, 88.5);
        doc.line(160, 85, 160, 90);
        doc.text("REM", 162, 88.5);
        doc.line(170, 85, 170, 90);
        doc.text("THT", 181, 88.5);
        doc.line(200, 85, 200, 90);
        i = 95;
        doc.setFontSize(6);
      }

      if (this.dataset[j].desc.length > 35) {
        let desc1 = this.dataset[j].desc.substring(35);
        let ind = desc1.indexOf(" ");
        desc1 = this.dataset[j].desc.substring(0, 35 + ind);
        let desc2 = this.dataset[j].desc.substring(35 + ind);

        doc.line(10, i - 5, 10, i);
        doc.text(String("000" + this.dataset[j].id).slice(-3), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.dataset[j].part, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(desc1, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(this.dataset[j].qty.toFixed(2)), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text("UN", 123, i - 1);
        doc.line(130, i - 5, 130, i);
        doc.text(String(Number(this.dataset[j].amt).toFixed(2)), 148, i - 1, { align: "right" });
        doc.line(150, i - 5, 150, i);
        doc.text(String(19.00) + "%", 153, i - 1);
        doc.line(160, i - 5, 160, i);
        doc.text(String(0.00) + "%", 163, i - 1);
        doc.line(170, i - 5, 170, i);
        doc.text(String((this.dataset[j].amt *  this.dataset[j].qty).toFixed(2)), 198, i - 1, { align: "right" });
        doc.line(200, i - 5, 200, i);
        // doc.line(10, i, 200, i );

        i = i + 5;

        doc.text(desc2, 47, i - 1);

        doc.line(10, i - 5, 10, i);
        doc.line(20, i - 5, 20, i);
        doc.line(45, i - 5, 45, i);
        doc.line(100, i - 5, 100, i);
        doc.line(120, i - 5, 120, i);
        doc.line(130, i - 5, 130, i);
        doc.line(150, i - 5, 150, i);
        doc.line(160, i - 5, 160, i);
        doc.line(170, i - 5, 170, i);
        doc.line(200, i - 5, 200, i);
        doc.line(10, i, 200, i);

        i = i + 5;
      } else {
        doc.line(10, i - 5, 10, i);
        doc.text(String("000" + this.dataset[j].id).slice(-3), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.dataset[j].part, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(this.dataset[j].desc, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(this.dataset[j].qty.toFixed(2)), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text("UN", 123, i - 1);
        doc.line(130, i - 5, 130, i);
        doc.text(String(Number(this.dataset[j].amt).toFixed(2)), 148, i - 1, { align: "right" });
        doc.line(150, i - 5, 150, i);
        doc.text(String(19.00) + "%", 153, i - 1);
        doc.line(160, i - 5, 160, i);
        doc.text(String(0.00) + "%", 163, i - 1);
        doc.line(170, i - 5, 170, i);
        doc.text(String((this.dataset[j].amt  * this.dataset[j].qty).toFixed(2)), 198, i - 1, { align: "right" });
        doc.line(200, i - 5, 200, i);
        doc.line(10, i, 200, i);
        i = i + 5;
      }
    }

    // doc.line(10, i - 5, 200, i - 5);

    doc.line(130, i + 7, 200, i + 7);
    doc.line(130, i + 14, 200, i + 14);
    doc.line(130, i + 21, 200, i + 21);
    doc.line(130, i + 28, 200, i + 28);
    doc.line(130, i + 35, 200, i + 35);
    doc.line(130, i + 7, 130, i + 35);
    doc.line(160, i + 7, 160, i + 35);
    doc.line(200, i + 7, 200, i + 35);
    doc.setFontSize(10);

    doc.text("Total HT", 140, i + 12, { align: "left" });
    doc.text("TVA", 140, i + 19, { align: "left" });
    doc.text("Timbre", 140, i + 26, { align: "left" });
    doc.text("Total TC", 140, i + 33, { align: "left" });

    doc.text(String((Number(controls.amt.value) / 1.2138).toFixed(2)), 198, i + 12, { align: "right" });
    doc.text(String(((Number(controls.amt.value) / 1.2138) * 0.19).toFixed(2)), 198, i + 19, { align: "right" });
    doc.text(String((Number(controls.amt.value) - (Number(controls.amt.value) / 1.2138) - ((Number(controls.amt.value) / 1.2138) * 0.19)).toFixed(2)), 198, i + 26, { align: "right" });
    doc.text(String((Number(controls.amt.value)).toFixed(2)), 198, i + 33, { align: "right" });

    doc.setFontSize(10);
    let mt = NumberToLetters(Number(controls.amt.value).toFixed(2), "dinars");

    if (mt.length > 75) {
      let mt1 = mt.substring(0,75);
      let ind = mt1.lastIndexOf(" ");
      console.log(ind)
      
      mt1 = mt.substring(0,  ind);
      let mt2 = mt.substring(ind);
      
      doc.text("Arretée la présente Facture a la somme de : " + mt1, 20, i + 53);
      doc.text(mt2, 20, i + 60);
    } else {
      doc.text("Arretée la présente Facture a la somme de : " + mt, 20, i + 53);
    }
    // window.open(doc.output('bloburl'), '_blank');
    //window.open(doc.output('blobUrl'));  // will open a new tab
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
  }
}

