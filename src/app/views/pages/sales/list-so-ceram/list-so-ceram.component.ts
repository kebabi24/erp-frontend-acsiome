import { Component, OnInit } from "@angular/core";
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

import { SaleOrderService, CustomerService, DeviseService, PsService } from "../../../../core/erp";
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";


const defaultPageSize = 100;
@Component({
  selector: 'kt-list-so-ceram',
  templateUrl: './list-so-ceram.component.html',
  styleUrls: ['./list-so-ceram.component.scss']
})
export class ListSoCeramComponent implements OnInit {

 
// slick grid
selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
gridObj: any;
dataviewObj: any;
angularGrid: AngularGridInstance;
draggableGroupingPlugin: any;    
columnDefinitions: Column[] = [];
gridOptions: GridOption = {};
dataset: any[] = [];
customer: any;
so: any;
sodataset: any[] = [];
curr : any;
domain
user
constructor(
  private activatedRoute: ActivatedRoute,
  private router: Router,
  public dialog: MatDialog,
  private layoutUtilsService: LayoutUtilsService,
  private soService: SaleOrderService,
  private customersService: CustomerService,
  private deviseService: DeviseService,
  private psService: PsService,
) {
  this.prepareGrid();
}

ngOnInit(): void {

  this.user =  JSON.parse(localStorage.getItem('user'))
      this.domain =  JSON.parse(localStorage.getItem('domain'))
}
angularGridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
  this.gridObj = angularGrid.slickGrid; // grid object
  this.dataviewObj = angularGrid.dataView;
}

prepareGrid() {
  this.columnDefinitions = [
    {
      id: "edit",
      field: "id",
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      formatter: (row, cell, value, columnDef, dataContext) => {
        // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
        return `
        <a class="btn btn-sm btn-clean btn-icon mr-2" title="Edit CMD">
             <i class="flaticon-edit"></i>
             
         </a>
         `;
      },
      minWidth: 50,
      maxWidth: 50,
      // use onCellClick OR grid.onClick.subscribe which you can see down below
      onCellClick: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.iid
          if(args.dataContext.so_stat == null) {
          this.router.navigateByUrl(`/sales/edit-so/${id}`)
          } else 
          {
            alert("Modification Impossible de cette commande")
          }
      },
  },
    {
      id: "id",
      name: "id",
      field: "id",
      resizable: false,
      sortable: false,
      minWidth: 50,
      maxWidth: 50
    },
    {
      id: "iid",
      name: "iid",
      field: "iid",
      resizable: false,
      sortable: false,
      minWidth: 50,
      maxWidth: 50
    },
    {
      id: "so_nbr",
      name: "Code",
      field: "so_nbr",
      minWidth: 100,
      maxWidth: 120,
      selectable: true,
      filterable: true,
      grouping: {
        getter: 'so_nbr',
        formatter: (g) => `N BC: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregateCollapsed: false,
        collapsed: false,
      }
    },
    {
      id: "so_cust",
      name: "Vendeur",
      field: "so_cust",
      sortable: true,
      width: 50,
      filterable: true,
      grouping: {
        getter: 'so_cust',
        formatter: (g) => `Vendeur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregateCollapsed: false,
        collapsed: false,
      }
    },
    {
      id: "chr01",
      name: "Client",
      field: "chr01",
      sortable: true,
      width: 50,
      filterable: true,
      grouping: {
        getter: 'chr01',
        formatter: (g) => `Client: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregateCollapsed: false,
        collapsed: false,
      }
    },
    {
      id: "chr02",
      name: "TEL",
      field: "chr02",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "so_ord_date",
      name: "Date de creation",
      field: "so_ord_date",
      sortable: true,
      width: 50,
      filterable: true,
      formatter: Formatters.dateIso,
      type: FieldType.dateIso,
      grouping: {
        getter: 'so_ord_date',
        formatter: (g) => `Date Creation: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregateCollapsed: false,
        collapsed: false,
      }
    },
    {
      id: "so_due_date",
      name: "Date d echeance",
      field: "so_due_date",
      sortable: true,
      width: 50,
      filterable: true,
      formatter: Formatters.dateIso,
      type: FieldType.dateIso,
      grouping: {
        getter: 'so_due_date',
        formatter: (g) => `Date echeance: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregateCollapsed: false,
        collapsed: false,
      }
    },
    {
      id: "so_stat",
      name: "Status",
      field: "so_stat",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.string,
    },
    
    {
      id: "so_po",
      name: "N° Projet ",
      field: "so_po",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "so_channel",
      name: "Lsite Frais ",
      field: "so_channel",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "sod_part",
      name: "Article",
      field: "sod_part",
      sortable: true,
      width: 50,
      filterable: true,
      grouping: {
        getter: 'sod_part',
        formatter: (g) => `Article: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('sod_qty_ord'),
          new Aggregators.Sum('sod_qty_rcvd')
        ],
        aggregateCollapsed: true,
    
        collapsed: false,
      }
    },
    {
      id: "pt_desc1",
      name: "Designation",
      field: "pt_desc1",
      sortable: true,
      width: 50,
      filterable: true,
    },
    {
      id: "sod_um",
      name: "UM",
      field: "sod_um",
      sortable: true,
      width: 30,
      filterable: true,
    },
    
    {
      id: "sod_qty_ord",
      name: "Quantite",
      field: "sod_qty_ord",
      sortable: true,
      width: 50,
      filterable: true,
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
      type: FieldType.float,

    },
    {
      id: "sod_qty_ship",
      name: "Quantite Livree",
      field: "sod_qty_ship",
      sortable: true,
      width: 50,
      filterable: true,
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
      type: FieldType.float,

    },
    
    {
      id: "sod_price",
      name: "Prix",
      field: "sod_price",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.float,
    },
    {
      id: "print",
      field: "print",

      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      formatter: (row, cell, value, columnDef, dataContext) => {
        // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
        return `
        <a class="btn btn-sm btn-clean btn-icon mr-2" title="Impression CMD Projet">
             <i class="flaticon2-printer"></i>
             
         </a>
         `;
      },
      minWidth: 50,
      maxWidth: 50,
      // use onCellClick OR grid.onClick.subscribe which you can see down below
      onCellClick: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id
          this.customersService
          .getBy({ cm_addr: args.dataContext.so_cust })
          .subscribe((res: any) => {this.customer = res.data

            this.soService
            .getBy({ so_nbr: args.dataContext.so_nbr })
            .subscribe((resp: any) => {
              this.so = resp.data.saleOrder
              this.sodataset = resp.data.details
              
             console.log(this.sodataset)
              this.deviseService.getBy({ cu_curr: this.so.so_curr }).subscribe(
                (respo: any) => {
                 
            this.curr = respo.data
              this.printpdf(args.dataContext.so_nbr)
              this.printpdf2(args.dataContext.so_nbr)
          
                })
        })
        })
      
      },
  },
    
  ];

  this.gridOptions = {
    
    enableAutoResize:true,
    autoHeight:true,
    enableDraggableGrouping: true,
    createPreHeaderPanel: true,
    showPreHeaderPanel: true,
    preHeaderPanelHeight: 40,
    enableFiltering: true,
    enableSorting: true,
    exportOptions: {
      sanitizeDataExport: true
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
    enablePagination: true, // you could optionally disable the Pagination
      pagination: {
      pageSizes: [20, 50, 100, 200, 300, 400, 500, 700, 1000],
      pageSize: defaultPageSize,
      totalItems: 0
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
this.dataset = []
this.soService.getAllwithDetailCeram().subscribe(
    (response: any) =>  ( this.dataset = response.data),
   
   

   (error) => {
    
        this.dataset = []
    },
    () => {}
   
)  

  // fill the dataset with your data
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

printpdf(nbr) {
  // const controls = this.totForm.controls;
  // const controlss = this.soForm.controls;
  console.log("pdf1");
  var doc = new jsPDF();

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
doc.line(10, 32, 200, 32);
doc.text( 'RC : ' + this.domain.dom_rc + "          NIF : " + this.domain.dom_nif +  "          AI : " + this.domain.dom_ai  , 60, 37);
doc.line(10, 40, 200, 40);
doc.barcode(nbr, {
  fontSize: 40,
  textColor: "#000000",
  x: 110,
  y: 55,
  textOptions: { align: "center" }, // optional text options
});
doc.setFont("Times-Roman");
doc.setFontSize(12);
doc.text("Commande N° : " + nbr, 87, 60);
doc.setFontSize(10);
//console.log(this.customer.address.ad_misc2_id);
doc.text("Code        : " + this.customer.cm_addr, 20, 65);
doc.text("Date        : " + this.so.so_ord_date, 150, 65);
doc.text("Nom         : " + this.customer.address.ad_name, 20, 70);
// doc.text("Adresse       : " + this.customer.address.ad_line1, 20, 75);
if(this.so.chr01!= null) {
doc.text("Client      : " + this.so.chr01, 20, 75); }
if(this.so.chr02 != null) {
doc.text("Tel         : " + this.so.chr02, 20, 80);}
if(this.so.so_rmks != null){
doc.text("Observation : " + this.so.so_rmks, 20, 85);}
// if(this.soo.so_rmks != null){doc.text("Observation       : " + this.soo.so_rmks, 20, 80);}
// if (this.customer.address.ad_misc2_id != null) {
//   doc.text("MF          : " + this.customer.address.ad_misc2_id, 20, 80);
// }
// if (this.customer.address.ad_gst_id != null) {
//   doc.text("RC          : " + this.customer.address.ad_gst_id, 20, 85);
// }
// if (this.customer.address.ad_pst_id) {
//   doc.text("AI            : " + this.customer.address.ad_pst_id, 20, 90);
// }
// if (this.customer.address.ad_misc1_id != null) {
//   doc.text("NIS         : " + this.customer.address.ad_misc1_id, 20, 95);
// }
doc.line(10, 100, 205, 100);
doc.line(10, 105, 205, 105);
doc.line(10, 100, 10, 105);
doc.text("LN", 12.5, 103.5);
doc.line(20, 100, 20, 105);
doc.text("Code Article", 22, 103.5);
doc.line(45, 100, 45, 105);
doc.text("Désignation", 67.5, 103.5);
doc.line(100, 100, 100, 105);
doc.text("QTE Metre", 103, 103.5);
doc.line(120, 100, 120, 105);
doc.text("Colis", 123, 103.5);
doc.line(135, 100, 135, 105);
doc.text("Piéce", 137, 103.5);
doc.line(148, 100, 148, 105);
doc.text("PU", 158, 103.5);
doc.line(170, 100, 170, 105);
doc.text("REM", 172, 103.5);
doc.line(181, 100, 181, 105);
doc.text("THT", 183, 103.5);
doc.line(205, 100, 205, 105);
  var i = 110;
  doc.setFontSize(8);
  for (let j = 0; j < this.sodataset.length; j++) {
    if (j % 20 == 0 && j != 0) {
      doc.addPage();
      // img.src = "./assets/media/logos/companyentete.png";
      img.src = "./assets/media/logos/companylogo.png";
doc.addImage(img, "png", 160, 5, 50, 30);
doc.setFontSize(9);
if (this.domain.dom_name != null) {
  doc.text(this.domain.dom_name, 10, 10);
}
if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
doc.line(10, 32, 200, 32);
doc.text( 'RC : ' + this.domain.dom_rc + "          NIF : " + this.domain.dom_nif +  "          AI : " + this.domain.dom_ai  , 60, 37);
doc.line(10, 40, 200, 40);
doc.barcode(nbr, {
  fontSize: 40,
  textColor: "#000000",
  x: 110,
  y: 55,
  textOptions: { align: "center" }, // optional text options
});
doc.setFont("Times-Roman");
doc.setFontSize(12);
doc.text("Commande N° : " + nbr, 87, 60);
doc.setFontSize(10);
//console.log(this.customer.address.ad_misc2_id);
doc.text("Code        : " + this.customer.cm_addr, 20, 65);
doc.text("Date        : " + this.so.so_ord_date, 150, 65);
doc.text("Nom         : " + this.customer.address.ad_name, 20, 70);
// doc.text("Adresse       : " + this.customer.address.ad_line1, 20, 75);
if(this.so.chr01!= null) {
doc.text("Client      : " + this.so.chr01, 20, 75); }
if(this.so.chr02 != null) {
doc.text("Tel         : " + this.so.chr02, 20, 80);}
if(this.so.so_rmks != null){
doc.text("Observation : " + this.so.so_rmks, 20, 85);}
// if (this.customer.address.ad_misc2_id != null) {
//   doc.text("MF          : " + this.customer.address.ad_misc2_id, 20, 80);
// }
// if (this.customer.address.ad_gst_id != null) {
//   doc.text("RC          : " + this.customer.address.ad_gst_id, 20, 85);
// }
// if (this.customer.address.ad_pst_id) {
//   doc.text("AI            : " + this.customer.address.ad_pst_id, 20, 90);
// }
// if (this.customer.address.ad_misc1_id != null) {
//   doc.text("NIS         : " + this.customer.address.ad_misc1_id, 20, 95);
// }
doc.line(10, 100, 200, 100);
doc.line(10, 105, 200, 105);
doc.line(10, 100, 10, 105);
doc.text("LN", 12.5, 103.5);
doc.line(20, 100, 20, 105);
doc.text("Code Article", 22, 103.5);
doc.line(45, 100, 45, 105);
doc.text("Désignation", 67.5, 103.5);
doc.line(100, 100, 100, 105);
doc.text("QTE Metre", 103, 103.5);
doc.line(120, 100, 120, 105);
doc.text("Colis", 123, 103.5);
doc.line(135, 100, 135, 105);
doc.text("Piéce", 137, 103.5);
doc.line(148, 100, 148, 105);
doc.text("PU", 158, 103.5);
doc.line(170, 100, 170, 105);
doc.text("REM", 172, 103.5);
doc.line(181, 100, 181, 105);
doc.text("THT", 183, 103.5);
doc.line(205, 100, 205, 105);
      i = 110;
      doc.setFontSize(8);
    }

    if (this.sodataset[j].sod_desc.length > 35) {
      let desc1 = this.sodataset[j].sod_desc.substring(35);
      let ind = desc1.indexOf(" ");
      desc1 = this.sodataset[j].sod_desc.substring(0, 35 + ind);
      let desc2 = this.dataset[j].sod_desc.substring(35 + ind);

      doc.line(10, i - 5, 10, i);
      doc.text(String("000" + this.sodataset[j].sod_line).slice(-3), 12.5, i - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.sodataset[j].sod_part, 22, i - 1);
      doc.line(45, i - 5, 45, i);
      doc.text(desc1, 47, i - 1);
      doc.line(100, i - 5, 100, i);
      doc.text(String(this.sodataset[j].sod_qty_ord.toFixed(2)), 118, i - 1, { align: "right" });
      doc.line(120, i - 5, 120, i);
      doc.text(String(this.sodataset[j].sod_qty_chg.toFixed(2)), 133, i - 1, { align: "right" });
      doc.line(135, i - 5, 135, i);
      doc.text(String(this.sodataset[j].sod_qty_qote.toFixed(2)), 146, i - 1, { align: "right" });
      doc.line(148, i - 5, 148, i);
      doc.text(String(Number(this.sodataset[j].sod_price).toFixed(2)), 168, i - 1, { align: "right" });
      
      doc.line(170, i - 5, 170, i);
      doc.text(String(this.sodataset[j].sod_disc_pct) + "%", 173, i - 1);
      doc.line(181, i - 5, 181, i);
      doc.text(String((this.sodataset[j].sod_price * ((100 - this.sodataset[j].sod_disc_pct) / 100) * this.sodataset[j].sod_qty_ord).toFixed(2)), 203, i - 1, { align: "right" });
      doc.line(205, i - 5, 205, i);
      // doc.line(10, i, 200, i );

      i = i + 5;

      doc.text(desc2, 47, i - 1);

      doc.line(10, i - 5, 10, i);
      doc.line(20, i - 5, 20, i);
      doc.line(45, i - 5, 45, i);
      doc.line(100, i - 5, 100, i);
      doc.line(120, i - 5, 120, i);
      doc.line(135, i - 5, 135, i);
      doc.line(148, i - 5, 148, i);
      doc.line(170, i - 5, 170, i);
      doc.line(181, i - 5, 181, i);
      doc.line(205, i - 5, 205, i);
      doc.line(10, i, 205, i);

      i = i + 5;
    } else {
      doc.line(10, i - 5, 10, i);
      doc.text(String("000" + this.sodataset[j].sod_line).slice(-3), 12.5, i - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.sodataset[j].sod_part, 22, i - 1);
      doc.line(45, i - 5, 45, i);
      doc.text(this.sodataset[j].sod_desc, 47, i - 1);
      doc.line(100, i - 5, 100, i);
      doc.text(String(Number(this.sodataset[j].sod_qty_ord).toFixed(2)), 118, i - 1, { align: "right" });
      doc.line(120, i - 5, 120, i);
      doc.text(String(Number(this.sodataset[j].sod_qty_chg).toFixed(2)), 133, i - 1, { align: "right" });
      doc.line(135, i - 5, 135, i);
      doc.text(String(Number(this.sodataset[j].sod_qty_qote).toFixed(2)), 146, i - 1, { align: "right" });
      doc.line(148, i - 5, 148, i);
      doc.text(String(Number(this.sodataset[j].sod_price).toFixed(2)), 168, i - 1, { align: "right" });
      
      doc.line(170, i - 5, 170, i);
      doc.text(String(this.sodataset[j].sod_disc_pct) + "%", 173, i - 1);
      doc.line(181, i - 5, 181, i);
      doc.text(String(Number((this.sodataset[j].sod_price * ((100 - this.sodataset[j].sod_disc_pct) / 100) * this.sodataset[j].sod_qty_ord)).toFixed(2)), 203, i - 1, { align: "right" });
      doc.line(205, i - 5, 205, i);
      doc.line(10, i, 205, i);
      i = i + 5;
    }
  }

  // doc.line(10, i - 5, 200, i - 5);

  doc.line(130, i + 7, 205, i + 7);
  doc.line(130, i + 14, 205, i + 14);
  // doc.line(130, i + 21, 200, i + 21);
  // doc.line(130, i + 28, 200, i + 28);
  // doc.line(130, i + 35, 200, i + 35);
  doc.line(130, i + 7, 130, i + 14);
  doc.line(160, i + 7, 160, i + 14);
  doc.line(205, i + 7, 205, i + 14);
  doc.setFontSize(10);

  doc.text("Total ", 140, i + 12, { align: "left" });
  // doc.text("TVA", 140, i + 19, { align: "left" });
  // doc.text("Timbre", 140, i + 26, { align: "left" });
  // doc.text("Total TC", 140, i + 33, { align: "left" });

  doc.text(String(Number(this.so.so_amt).toFixed(2)), 203, i + 12, { align: "right" });
  // doc.text(String(Number(controls.tva.value).toFixed(2)), 198, i + 19, { align: "right" });
  // doc.text(String(Number(controls.timbre.value).toFixed(2)), 198, i + 26, { align: "right" });
  // doc.text(String(Number(controls.ttc.value).toFixed(2)), 198, i + 33, { align: "right" });

  doc.setFontSize(8);
  let mt = NumberToLetters(Number(this.so.so_amt).toFixed(2), "Dinars Algérien");

  if (mt.length > 95) {
    let mt1 = mt.substring(90);
    let ind = mt1.indexOf(" ");

    mt1 = mt.substring(0, 90 + ind);
    let mt2 = mt.substring(90 + ind);

    doc.text("Arretée la présente Commande a la somme de : " + mt1, 20, i + 53);
    doc.text(mt2, 20, i + 60);
  } else {
    doc.text("Arretée la présente Commande a la somme de : " + mt, 20, i + 53);
  }
  // window.open(doc.output('bloburl'), '_blank');
  //window.open(doc.output('blobUrl'));  // will open a new tab
  var blob1 = doc.output("blob");
  window.open(URL.createObjectURL(blob1));
}
printpdf2(nbr) {
  // const controls = this.totForm.controls;
  // const controlss = this.soForm.controls;
  console.log("pdf2");
  var doc = new jsPDF();

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
doc.line(10, 32, 200, 32);
doc.text( 'RC : ' + this.domain.dom_rc + "          NIF : " + this.domain.dom_nif +  "          AI : " + this.domain.dom_ai  , 60, 37);
doc.line(10, 40, 200, 40);
doc.barcode(nbr, {
  fontSize: 40,
  textColor: "#000000",
  x: 110,
  y: 55,
  textOptions: { align: "center" }, // optional text options
});
doc.setFont("Times-Roman");
doc.setFontSize(12);
doc.text("Commande Bureau N° : " + nbr, 87, 60);
doc.setFontSize(10);
//console.log(this.customer.address.ad_misc2_id);
doc.text("Code Client : " + this.customer.cm_addr, 20, 65);
doc.text("Date : " + this.so.so_ord_date, 150, 65);
doc.text("Nom             : " + this.customer.address.ad_name, 20, 70);

if(this.so.chr01!= null) {
  doc.text("Client      : " + this.so.chr01, 20, 75); }
  if(this.so.chr02 != null) {
  doc.text("Tel         : " + this.so.chr02, 20, 80);}
  if(this.so.so_rmks != null){
  doc.text("Observation : " + this.so.so_rmks, 20, 85);}

// if (this.customer.address.ad_misc2_id != null) {
//   doc.text("MF          : " + this.customer.address.ad_misc2_id, 20, 80);
// }
// if (this.customer.address.ad_gst_id != null) {
//   doc.text("RC          : " + this.customer.address.ad_gst_id, 20, 85);
// }
// if (this.customer.address.ad_pst_id) {
//   doc.text("AI            : " + this.customer.address.ad_pst_id, 20, 90);
// }
// if (this.customer.address.ad_misc1_id != null) {
//   doc.text("NIS         : " + this.customer.address.ad_misc1_id, 20, 95);
// }
doc.line(10, 100, 200, 100);
doc.line(10, 105, 200, 105);
doc.line(10, 100, 10, 105);
doc.text("LN", 12.5, 103.5);
doc.line(20, 100, 20, 105);
doc.text("Code Article", 25, 103.5);
doc.line(45, 100, 45, 105);
doc.text("Désignation", 67.5, 103.5);
doc.line(100, 100, 100, 105);
doc.text("QTE", 107, 103.5);
doc.line(120, 100, 120, 105);
doc.text("UM", 123, 103.5);
doc.line(130, 100, 130, 105);
doc.text("PU", 138, 103.5);
doc.line(150, 100, 150, 105);
doc.text("TVA", 152, 103.5);
doc.line(160, 100, 160, 105);
doc.text("REM", 162, 103.5);
doc.line(170, 100, 170, 105);
doc.text("THT", 181, 103.5);
doc.line(200, 100, 200, 105);
  var i = 110;
  doc.setFontSize(6);
  for (let j = 0; j < this.sodataset.length; j++) {
    if (j % 20 == 0 && j != 0) {
      doc.addPage();
      // img.src = "./assets/media/logos/companyentete.png";
      img.src = "./assets/media/logos/companylogo.png";
doc.addImage(img, "png", 160, 5, 50, 30);
doc.setFontSize(9);
if (this.domain.dom_name != null) {
  doc.text(this.domain.dom_name, 10, 10);
}
if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
doc.line(10, 32, 200, 32);
doc.text( 'RC : ' + this.domain.dom_rc + "          NIF : " + this.domain.dom_nif +  "          AI : " + this.domain.dom_ai  , 60, 37);
doc.line(10, 40, 200, 40);
doc.barcode(nbr, {
  fontSize: 40,
  textColor: "#000000",
  x: 110,
  y: 55,
  textOptions: { align: "center" }, // optional text options
});
doc.setFont("Times-Roman");
doc.setFontSize(12);
doc.text("Commande Bureau N° : " + nbr, 87, 60);
doc.setFontSize(10);
//console.log(this.customer.address.ad_misc2_id);
doc.text("Code Client : " + this.customer.cm_addr, 20, 65);
doc.text("Date : " + this.so.so_ord_date, 150, 65);
doc.text("Nom             : " + this.customer.address.ad_name, 20, 70);

if(this.so.chr01!= null) {
  doc.text("Client      : " + this.so.chr01, 20, 75); }
  if(this.so.chr02 != null) {
  doc.text("Tel         : " + this.so.chr02, 20, 80);}
  if(this.so.so_rmks != null){
  doc.text("Observation : " + this.so.so_rmks, 20, 85);}
// if (this.customer.address.ad_misc2_id != null) {
//   doc.text("MF          : " + this.customer.address.ad_misc2_id, 20, 80);
// }
// if (this.customer.address.ad_gst_id != null) {
//   doc.text("RC          : " + this.customer.address.ad_gst_id, 20, 85);
// }
// if (this.customer.address.ad_pst_id) {
//   doc.text("AI            : " + this.customer.address.ad_pst_id, 20, 90);
// }
// if (this.customer.address.ad_misc1_id != null) {
//   doc.text("NIS         : " + this.customer.address.ad_misc1_id, 20, 95);
// }
doc.line(10, 100, 200, 100);
doc.line(10, 105, 200, 105);
doc.line(10, 100, 10, 105);
doc.text("LN", 12.5, 103.5);
doc.line(20, 100, 20, 105);
doc.text("Code Article", 25, 103.5);
doc.line(45, 100, 45, 105);
doc.text("Désignation", 67.5, 103.5);
doc.line(100, 100, 100, 105);
doc.text("QTE", 107, 103.5);
doc.line(120, 100, 120, 105);
doc.text("UM", 123, 103.5);
doc.line(130, 100, 130, 105);
doc.text("PU", 138, 103.5);
doc.line(150, 100, 150, 105);
doc.text("TVA", 152, 103.5);
doc.line(160, 100, 160, 105);
doc.text("REM", 162, 103.5);
doc.line(170, 100, 170, 105);
doc.text("THT", 181, 103.5);
doc.line(200, 100, 200, 105);
      i = 110;
      doc.setFontSize(6);
    }

    if (this.sodataset[j].sod_desc.length > 35) {
      let desc1 = this.sodataset[j].sod_desc.substring(35);
      let ind = desc1.indexOf(" ");
      desc1 = this.sodataset[j].sod_desc.substring(0, 35 + ind);
      let desc2 = this.sodataset[j].sod_desc.substring(35 + ind);

      doc.line(10, i - 5, 10, i);
      doc.text(String("000" + this.sodataset[j].sod_line).slice(-3), 12.5, i - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.sodataset[j].sod_part, 25, i - 1);
      doc.line(45, i - 5, 45, i);
      doc.text(desc1, 47, i - 1);
      doc.line(100, i - 5, 100, i);
      doc.text(String(Number(this.sodataset[j].sod_qty_ord).toFixed(2)), 118, i - 1, { align: "right" });
      doc.line(120, i - 5, 120, i);
      doc.text(this.sodataset[j].sod_um, 123, i - 1);
      doc.line(130, i - 5, 130, i);
      doc.text(String(Number(this.sodataset[j].sod_price).toFixed(2)), 148, i - 1, { align: "right" });
      doc.line(150, i - 5, 150, i);
      doc.text(String(this.sodataset[j].sod_taxc) + "%", 153, i - 1);
      doc.line(160, i - 5, 160, i);
      doc.text(String(this.sodataset[j].sod_disc_pct) + "%", 163, i - 1);
      doc.line(170, i - 5, 170, i);
      doc.text(String((this.sodataset[j].sod_price * ((100 - this.sodataset[j].sod_disc_pct) / 100) * this.sodataset[j].sod_qty_ord).toFixed(2)), 198, i - 1, { align: "right" });
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
      doc.text(String("000" + this.sodataset[j].sod_line).slice(-3), 12.5, i - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.sodataset[j].sod_part, 25, i - 1);
      doc.line(45, i - 5, 45, i);
      doc.text(this.sodataset[j].sod_desc, 47, i - 1);
      doc.line(100, i - 5, 100, i);
      doc.text(String(Number(this.sodataset[j].sod_qty_ord).toFixed(2)), 118, i - 1, { align: "right" });
      doc.line(120, i - 5, 120, i);
      doc.text(this.sodataset[j].sod_um, 123, i - 1);
      doc.line(130, i - 5, 130, i);
      doc.text(String(Number(this.sodataset[j].sod_price).toFixed(2)), 148, i - 1, { align: "right" });
      doc.line(150, i - 5, 150, i);
      doc.text(String(this.sodataset[j].sod_taxc) + "%", 153, i - 1);
      doc.line(160, i - 5, 160, i);
      doc.text(String(this.sodataset[j].sod_disc_pct) + "%", 163, i - 1);
      doc.line(170, i - 5, 170, i);
      doc.text(String((this.sodataset[j].sod_price * ((100 - this.sodataset[j].sod_disc_pct) / 100) * this.sodataset[j].sod_qty_ord).toFixed(2)), 198, i - 1, { align: "right" });
      doc.line(200, i - 5, 200, i);
      doc.line(10, i, 200, i);
      i = i + 5;
    }
  }

  // doc.line(10, i - 5, 200, i - 5);

  doc.line(130, i + 7, 200, i + 7);
  doc.line(130, i + 14, 200, i + 14);
  // doc.line(130, i + 21, 200, i + 21);
  // doc.line(130, i + 28, 200, i + 28);
  // doc.line(130, i + 35, 200, i + 35);
  doc.line(130, i + 7, 130, i + 35);
  doc.line(160, i + 7, 160, i + 35);
  doc.line(200, i + 7, 200, i + 35);
  doc.setFontSize(10);

  doc.text("Total ", 140, i + 12, { align: "left" });
  // doc.text("TVA", 140, i + 19, { align: "left" });
  // doc.text("Timbre", 140, i + 26, { align: "left" });
  // doc.text("Total TC", 140, i + 33, { align: "left" });

  doc.text(String(Number(this.so.so_amt).toFixed(2)), 198, i + 12, { align: "right" });
  // doc.text(String(Number(controls.tva.value).toFixed(2)), 198, i + 19, { align: "right" });
  // doc.text(String(Number(controls.timbre.value).toFixed(2)), 198, i + 26, { align: "right" });
  // doc.text(String(Number(controls.ttc.value).toFixed(2)), 198, i + 33, { align: "right" });

  doc.setFontSize(8);
  let mt = NumberToLetters(Number(this.so.so_amt).toFixed(2), "Dinars Algérien");

  if (mt.length > 95) {
    let mt1 = mt.substring(90);
    let ind = mt1.indexOf(" ");

    mt1 = mt.substring(0, 90 + ind);
    let mt2 = mt.substring(90 + ind);

    doc.text("Arretée la présente Commande a la somme de : " + mt1, 20, i + 53);
    doc.text(mt2, 20, i + 60);
  } else {
    doc.text("Arretée la présente Commande a la somme de : " + mt, 20, i + 53);
  }
  // window.open(doc.output('bloburl'), '_blank');
  //window.open(doc.output('blobUrl'));  // will open a new tab
  var blob = doc.output("blob");
  window.open(URL.createObjectURL(blob));
}
}
