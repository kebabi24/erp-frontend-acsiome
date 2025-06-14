import { array } from "@amcharts/amcharts4/core";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"  
import { LayoutUtilsService, MessageType } from "src/app/core/_base/crud";
import { MobileServiceService, MobileService, RoleService,LocationDetailService, ItineraryService, LoadRequestService, UsersMobileService } from "../../../../core/erp";
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
  selector: 'kt-list-inventory-role',
  templateUrl: './list-inventory-role.component.html',
  styleUrls: ['./list-inventory-role.component.scss']
})
export class ListInventoryRoleComponent implements OnInit {

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
    this.loadRequestService.getRoles(this.user.usrd_code).subscribe(
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
console.log(this.roles[index])
    this.locationDetailService.getByPrice({ ld_loc: this.roles[index].role_loc, ld_site:this.roles[index].role_site }).subscribe((response: any) => {
        this.dataset = response.data;
        
        this.dataview.setItems(this.dataset)
        this.dataset.map((element) => {
          this.total = Number(this.total) + Number(element.amt) ;
          this.totalCartons = this.totalCartons + Number(element.qty);
          
        });
        controls.qty.setValue(this.totalCartons)
        controls.amt.setValue(this.total.toFixed(2))
        console.log(response.data);
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
            grouping: {
              getter: 'part',
              formatter: (g) => `Article: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('qty'),
                new Aggregators.Sum('amt'),
                ],
              aggregateCollapsed: false,
          
              collapsed: false,
            }
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
            id: "lot",
            name: "Lot",
            field: "lot",
            sortable: true,
            filterable: true,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            type: FieldType.string,
            grouping: {
              getter: 'lot',
              formatter: (g) => `Lot: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('qty'),
                new Aggregators.Sum('amt'),
                ],
              aggregateCollapsed: false,
              collapsed: false,
            }
          },
          
          {
            id: "qty",
            name: "Quantité",
            field: "qty",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
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
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
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
        enableDraggableGrouping: true,
        createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        preHeaderPanelHeight: 40,
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
        dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
          var val = undefined;
          try {
            val = eval("item." + column.field);
          } catch (e) {
            // ignore
          }
          return val;
        },

     
        gridMenu: {
          onCommand: (e, args) => {
            if (args.command === 'toggle-preheader') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
              this.clearGrouping();
            }
          },
        },
        draggableGrouping: {
          dropPlaceHolderText: 'Drop a column header here to group by the column',
          // groupIconCssClass: 'fa fa-outdent',
          deleteIconCssClass: 'fa fa-times',
          onGroupChanged: (e, args) => this.onGroupChanged(args),
          onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
      
      },

  
      

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
    var doc = new jsPDF();
    let initialY = 65;
    let valueToAddToX = 5;
    const date = new Date();
    this.total = 0,
    this.totalCartons= 0,
    console.log(this.printLines)
    this.printLines.map((element) => {
      if(element.product_code != null) {
      this.total = Number(this.total) + Number(element.pt_price) * Number(element.qt_validated);
      this.totalCartons = this.totalCartons + Number(element.qt_validated);
      }
    });

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
    doc.text("Date     : " + + String(date.getFullYear())+"/" + String(date.getMonth() + 1) + "/" + String(date.getDate()) + " " +  date.toLocaleTimeString(), 20, initialY + 10);
    doc.text("Role    : " + this.role_code, 20, initialY + 15);
    // doc.text("Date    : " + this.load_request_header.date_creation, 20, initialY + 15);
    doc.text("Vendeur : " + this.user_mobile.user_mobile_code + " - " + this.user_mobile.username, 20, initialY + 20);
    doc.setFontSize(9);
    doc.setFontSize(9);

    doc.line(10, initialY + 25, 195, initialY + 25); // 85
    doc.line(10, initialY + 30, 195, initialY + 30); // 90
    doc.line(10, initialY + 25, 10, initialY + 30); // 90
    doc.text("N", 12.5, initialY + 28.5); // 88.5
    doc.line(20, initialY + 25, 20, initialY + 30); // 90
    doc.text("Code Article", 25, initialY + 28.5); // 88.5
    doc.line(45, initialY + 25, 45, initialY + 30); // 90
    doc.text("Désignation", 67.5, initialY + 28.5); // 88.5
    // doc.line(100, initialY + 25, 100, initialY + 30); // 90
    // doc.text("Prix", 107, initialY + 28.5); // 88.5
    // doc.line(120, initialY + 25, 120, initialY + 30); // 90
    // doc.text("QTE Demandée", 123, initialY + 28.5); // 88.5
    doc.line(145, initialY + 25, 145, initialY + 30); // 90
    doc.text("QTE Validée", 148, initialY + 28.5); // 88.5
    doc.line(170, initialY + 25, 170, initialY + 30); // 90
    doc.text("QTE Chargée", 173, initialY + 28.5); // 88.5
    doc.line(195, initialY + 25, 195, initialY + 30); // 90
    var i = 95 + valueToAddToX;
    doc.setFontSize(10);

    for (let j = 0; j < this.printLines.length; j++) {
      if (j % 38 == 0 && j != 0) {
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
        doc.text("Date     : " + + String(date.getFullYear())+"/" + String(date.getMonth() + 1) + "/" + String(date.getDate()) + " " +  date.toLocaleTimeString(), 20, initialY + 10);
        doc.text("Role    : " + this.role_code, 20, initialY + 15);
        // doc.text("Date    : " + this.load_request_header.date_creation, 20, initialY + 15);
        doc.text("Vendeur : " + this.user_mobile.user_mobile_code + " - " + this.user_mobile.username, 20, initialY + 20);
        doc.setFontSize(9);
        doc.setFontSize(9);
    
        doc.line(10, initialY + 25, 195, initialY + 25); // 85
        doc.line(10, initialY + 30, 195, initialY + 30); // 90
        doc.line(10, initialY + 25, 10, initialY + 30); // 90
        doc.text("N", 12.5, initialY + 28.5); // 88.5
        doc.line(20, initialY + 25, 20, initialY + 30); // 90
        doc.text("Code Article", 25, initialY + 28.5); // 88.5
        doc.line(45, initialY + 25, 45, initialY + 30); // 90
        doc.text("Désignation", 67.5, initialY + 28.5); // 88.5
        // doc.line(100, initialY + 25, 100, initialY + 30); // 90
        // doc.text("Prix", 107, initialY + 28.5); // 88.5
        // doc.line(120, initialY + 25, 120, initialY + 30); // 90
        // doc.text("QTE Demandée", 123, initialY + 28.5); // 88.5
        doc.line(145, initialY + 25, 145, initialY + 30); // 90
        doc.text("QTE Validée", 148, initialY + 28.5); // 88.5
        doc.line(170, initialY + 25, 170, initialY + 30); // 90
        doc.text("QTE Chargée", 173, initialY + 28.5); // 88.5
        doc.line(195, initialY + 25, 195, initialY + 30); // 90
        var i = 95 + valueToAddToX;
        doc.setFontSize(10);
      }

      if (this.printLines[j].product_name.length > 50) {
        doc.setFontSize(10);

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
        doc.setFontSize(14);
        doc.text(desc1, 47, i - 1);
        doc.setFontSize(10);
        // doc.line(100, i - 5, 100, i);
        // doc.text(String(line.pt_price), 118, i - 1, { align: "right" });
        // doc.line(120, i - 5, 120, i);
        // doc.text(String(line.qt_request), 143, i - 1, { align: "right" });
        doc.line(145, i - 5, 145, i);
        doc.text(String(line.qt_validated), 168, i - 1, { align: "right" });
        doc.line(170, i - 5, 170, i);
        doc.text(String(line.qt_effected), 193, i - 1, { align: "right" });
        doc.line(195, i - 5, 195, i);

        i = i + 5;
        doc.setFontSize(14);
        doc.text(desc2, 47, i - 1);
        doc.setFontSize(10);
        doc.line(10, i - 5, 10, i);
        doc.line(20, i - 5, 20, i);
        doc.line(45, i - 5, 45, i);
        // doc.line(100, i - 5, 100, i);
        // doc.line(120, i - 5, 120, i);
        doc.line(145, i - 5, 145, i);
        doc.line(170, i - 5, 170, i);
        doc.line(195, i - 5, 195, i);

        i = i + 5;
      } else {
        doc.setFontSize(10);
        let line = this.printLines[j];
        doc.line(10, i - 5, 10, i);
        doc.text(String(line.line), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(line.product_code, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(line.product_name, 47, i - 1);
        // doc.line(100, i - 5, 100, i);
        // doc.text(String(line.pt_price), 118, i - 1, { align: "right" });
        // doc.line(120, i - 5, 120, i);
        // doc.text(String(line.qt_request), 143, i - 1, { align: "right" });
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
    doc.setFontSize(14);
    doc.text("Total cartons    : " + this.totalCartons, 130, i + 5);
    doc.text("Valeur : " + Number(this.total * 1.2019).toFixed(2) + " DZD", 130, i + 10);
    doc.setFontSize(10);
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
  }
}

