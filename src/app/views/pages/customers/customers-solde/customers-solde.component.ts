import { Component, OnInit } from "@angular/core";
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
  GridOption,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
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
  Customer,
  CustomerService,
  Address,
  AddressService,
} from "../../../../core/erp";
import { jsPDF } from "jspdf";
import { replace } from "lodash";
import { replaceAll } from "chartist";
const myCustomCheckboxFormatter: Formatter = (
  row: number,
  cell: number,
  value: any,
  columnDef: Column,
  dataContext: any,
  grid?: any
) =>
  value
    ? `<div class="text"  aria-hidden="true">Oui</div>`
    : '<div class="text"  aria-hidden="true">Non</div>';


@Component({
  selector: 'kt-customers-solde',
  templateUrl: './customers-solde.component.html',
  styleUrls: ['./customers-solde.component.scss']
})
export class CustomersSoldeComponent implements OnInit {

  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  draggableGroupingPlugin: any;
  angularGrid: AngularGridInstance;
  dataview: any;
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ["", "", ""];
  gridObj: any;
  dataviewObj: any;
user: any
domain: any
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private addressService: AddressService,
    private customerService: CustomerService
  ) {
    this.prepareGrid();
  }

  ngOnInit(): void {
    this.user =  JSON.parse(localStorage.getItem('user'))
    this.domain = JSON.parse(localStorage.getItem("domain"));
    console.log(this.user)
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid; // grid object
    this.dataview = angularGrid.dataView;
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
        id: "ad_line1",
        name: "Adresse",
        field: "address.ad_line1",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_line2",
        name: "Adresse",
        field: "address.ad_line2",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },

      {
        id: "ad_city",
        name: "Wilaya",
        field: "address.ad_city",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },

      {
        id: "cm_class",
        name: "Classe",
        field: "cm_class",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        grouping: {
          getter: "cm_class",
          formatter: (g) =>
            `Classe: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        },
      },
      {
        id: "cm_curr",
        name: "Devise",
        field: "cm_curr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "cm_hold",
        name: "Bloc",
        field: "cm_hold",
        sortable: true,
        filterable: true,
        formatter: myCustomCheckboxFormatter,

        type: FieldType.boolean,
        grouping: {
          getter: "cm_hold",
          formatter: (g) =>
            `Bloc: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        },
      },
      {
        id: "ad_misc2_id",
        name: "Matricule Fiscal",
        field: "address.ad_misc2_id",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      

      {
        id: "ad_pst_id",
        name: "Article Imposition",
        field: "address.ad_pst_id",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },

      {
        id: "ad_gst_id",
        name: "Registre Commerce",
        field: "address.ad_gst_id",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "cm_balance",
        name: "Solde",
        field: "cm_balance",
        sortable: true,
        filterable: true,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
        headerCssClass: 'text-right',
        cssClass: 'text-right'
        

      },
    ];

    this.gridOptions = {
      
      enableDraggableGrouping: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 40,
      enableFiltering: true,
      enableAutoResize: true,
     
      enableSorting: true,
      exportOptions: {
        sanitizeDataExport: true
      },
      formatterOptions: {
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: false,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
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


      dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
        var val = undefined;
        try {
          val = eval("item." + column.field);
        } catch (e) {
          // ignore
        }
        return val;
      },


  }


    // fill the dataset with your data
    this.dataset = [];
    this.customerService.getAll().subscribe(
      (response: any) => {
        this.dataset = response.data;
        this.dataview.setItems(this.dataset);
      },
      (error) => {
        this.dataset = [];
      },
      () => {}
    );
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
    this.dataviewObj.collapseAllGroups();
  }

  expandAllGroups() {
    this.dataviewObj.expandAllGroups();
  }
  clearGrouping() {
    if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
      this.draggableGroupingPlugin.clearDroppedGroups();
    }
    this.gridObj.invalidate(); // invalidate all rows and re-render
  }

  printpdf() {
     
        
    
    console.log("pdf");
    var doc = new jsPDF();
const date = new Date()
    // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
    var img = new Image();
    img.src = "./assets/media/logos/companylogo.png";
    doc.addImage(img, "png", 160, 5, 50, 30);
    doc.setFontSize(9);
    if (this.domain.dom_name != null) {
      doc.text(this.domain.dom_name, 10, 10);
    }
    if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
    if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
    if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
    doc.setFontSize(14);
    doc.text("Liste Soldes Clients  Au  " + String(date.getFullYear())+"/" + String(date.getMonth() + 1) + "/" + String(date.getDate()) + " "  , 70, 40);
    doc.setFontSize(12);
    
    
    doc.setFontSize(10);
    doc.line(10, 55, 205, 55);
    doc.line(10, 60, 205, 60);
    
    doc.line(10, 55, 10, 60);
    doc.text("LN", 12.5, 58.5);
    doc.line(20, 55, 20, 60);
    doc.text("Code Client", 22, 58.5);
    doc.line(50, 55, 50, 60);
    doc.text("Nom Client", 52, 58.5);
    doc.line(130, 55, 130, 60);
    doc.text("Classe", 134, 58.5);
    doc.line(150, 55, 150, 60);
    doc.text("Solde", 172, 58.5);
    doc.line(205, 55, 205, 60);
   
    var i = 65;
    doc.setFontSize(10);
    let total = 0
    let totalqty = 0
    for (let j = 0; j < this.dataset.length; j++) {
   let mts =  String(  Number(this.dataset[j].cm_balance).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }))
      console.log(mts)
      let mnsolde = replaceAll(mts,","," ")
      console.log(mnsolde)
      if (j % 38 == 0 && j != 0) {
        doc.addPage();
        // img.src = "./assets/media/logos/companylogo.png";
        doc.addImage(img, "png", 160, 5, 50, 30);
        doc.setFontSize(10);
        if (this.domain.dom_name != null) {
          doc.text(this.domain.dom_name, 10, 10);
        }
        if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
        if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
        if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
        doc.setFontSize(14);
        doc.text("Liste Soldes Clients  Au  " + String(date.getFullYear())+"/" + String(date.getMonth() + 1) + "/" + String(date.getDate()) + " "  , 70, 40);
  
        doc.setFontSize(12);
        
        
        doc.setFontSize(10);
        doc.line(10, 55, 205, 55);
        doc.line(10, 60, 205, 60);
        
        doc.line(10, 55, 10, 60);
        doc.text("LN", 12.5, 58.5);
        doc.line(20, 55, 20, 60);
        doc.text("Code Client", 22, 58.5);
        doc.line(50, 55, 50, 60);
        doc.text("Nom Client", 52, 58.5);
        doc.line(130, 55, 130, 60);
        doc.text("Classe", 134, 58.5);
        doc.line(150, 55, 150, 60);
        doc.text("Solde", 172, 58.5);
        doc.line(205, 55, 205, 60);
       
        var i = 65;
        
        doc.setFontSize(10);
      }

     
        doc.line(10, i - 5, 10, i);
        doc.text(String("00" + Number(j+1)).slice(-2), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.dataset[j].cm_addr, 25, i - 1);
        doc.line(50, i - 5, 50, i);
        doc.text(String(this.dataset[j].address.ad_name), 52, i - 1);
        doc.line(130, i - 5, 130, i);
        doc.text(String(this.dataset[j].cm_class) , 134, i - 1);
        doc.line(150, i - 5, 150, i);
        doc.text(mnsolde , 204, i - 1,{ align: "right" });
        doc.line(205, i - 5, 205, i);
        doc.line(10, i , 205, i);
      //   doc.text(String(this.dataset[j].bkh_addr), 72, i - 1);
      //   doc.line(95, i - 5, 95, i);
      //  if(this.dataset[j].chr01 != null) { doc.text(this.dataset[j].chr01, 97, i - 1);} else {doc.text(this.dataset[j].bkh_addr, 97, i - 1)}
      //   doc.line(120, i - 5, 120, i);
      //   doc.text(String((this.dataset[j].bkh_type)), 122, i - 1 );
      //   doc.line(130, i - 5, 130, i);
      //   doc.text(String(this.dataset[j].bkh_effdate) , 153, i - 1, { align: "right" });
      //   doc.line(155, i - 5, 155, i);
      //   doc.text(String(Number(this.dataset[j].bkh_balance).toFixed(2)) , 178, i - 1,{ align: "right" });
      //   doc.line(180, i - 5, 180, i);
      //   doc.text(String(Number(this.dataset[j].bkh_amt).toFixed(2)), 203, i - 1, { align: "right" });
      //   doc.line(205, i - 5, 205, i);
         
        i = i + 5;
        total = total + Number(this.dataset[j].cm_balance)
       }
      // doc.line(10, i-5, 205, i-5);
       
      

      

       doc.line(50, i - 5, 50, i);
       let nbm =  + Number(total).toFixed(2)
    
        doc.text("Total", 52, i - 1);
        // doc.line(110, i - 5, 110, i);
        // doc.text(String(Number(totalqty).toFixed(2)), 148, i - 1,{ align: "right" });
        doc.line(150, i - 5, 150, i);
        let nb =  String(nbm.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        let ttsolde = replaceAll(nb,","," ")
        doc.text(ttsolde, 204, i - 1,{ align: "right" });
        doc.line(205, i - 5, 205, i);
        doc.line(50, i, 205, i);
        i = i + 5;

    // doc.line(10, i - 5, 200, i - 5);

    // window.open(doc.output('bloburl'), '_blank');
    //window.open(doc.output('blobUrl'));  // will open a new tab
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
 
  }

}