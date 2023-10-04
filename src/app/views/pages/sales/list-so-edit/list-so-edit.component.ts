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
  selector: 'kt-list-so-edit',
  templateUrl: './list-so-edit.component.html',
  styleUrls: ['./list-so-edit.component.scss']
})
export class ListSoEditComponent implements OnInit {

 
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
      name: "Client",
      field: "so_cust",
      sortable: true,
      width: 50,
      filterable: true,
      grouping: {
        getter: 'so_cust',
        formatter: (g) => `Client: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregateCollapsed: false,
        collapsed: false,
      }
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
              
              for (let sod of this.sodataset) {

               
                  this.psService.getBy({ps_parent: sod.sod__chr02}).subscribe((Response: any) => {
                    let des = null   
                       
                    if (Response.data.length > 0){
                      for(let obj of Response.data) {
                        if(obj.ps__qad01) {
                           
                          if(des == null) {
                            des = obj.item.pt_desc1
                          } else {
                            des = des + ", " + obj.item.pt_desc1
                          }
                        }
                      }
                      sod.sod__chr03 = des
                    }
                  })
   
              }
              this.deviseService.getBy({ cu_curr: this.so.so_curr }).subscribe(
                (respo: any) => {
                 
            this.curr = respo.data
              this.printpdf(args.dataContext.so_nbr)
          
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
this.soService.getAllwithDetail().subscribe(
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
 // const controlss = this.soForm.controls 
  
  var doc = new jsPDF();
 
 // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
  var img = new Image()
  img.src = "./assets/media/logos/companylogo.png";
  doc.addImage(img, 'png', 150, 5, 50, 30)
  doc.setFontSize(9);
  if(this.domain.dom_name != null) {doc.text(this.domain.dom_name, 10 , 10 )};
  if(this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10 , 15 );
  if(this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10 , 20 );
  if(this.domain.dom_tel != null) doc.text('Tel : ' + this.domain.dom_tel, 10 , 30 );
  doc.setFontSize(12);
  doc.text( 'Commande N° : ' + nbr  , 70, 40);
  doc.setFontSize(8);
  
  doc.text('Code Client : ' + this.customer.cm_addr, 20 , 50 )
  doc.text('Nom             : ' + this.customer.address.ad_name, 20 , 55)
  doc.text('Adresse       : ' + this.customer.address.ad_line1, 20 , 60)
  if (this.customer.address.ad_misc2_id != null) {doc.text('MF          : ' + this.customer.address.ad_misc2_id, 20 , 65)}
      if (this.customer.address.ad_gst_id != null) {doc.text('RC          : ' + this.customer.address.ad_gst_id, 20 , 70)}
      if (this.customer.address.ad_pst_id) {doc.text('AI            : ' + this.customer.address.ad_pst_id, 20 , 75)}
      if (this.customer.address.ad_misc1_id != null) {doc.text('NIS         : ' + this.customer.address.ad_misc1_id, 20 , 80)}
    
  doc.line(10, 85, 200, 85);
  doc.line(10, 90, 200, 90);
  doc.line(10, 85, 10, 90);
  doc.text('LN', 12.5 , 88.5);
  doc.line(20, 85, 20, 90);
  doc.text('Code Article', 25 , 88.5);
  doc.line(45, 85, 45, 90);
  doc.text('Désignation', 67.5 , 88.5);
  doc.line(100, 85, 100, 90);
  doc.text('QTE', 107 , 88.5);
  doc.line(120, 85, 120, 90);
  doc.text('UM', 123 , 88.5);
  doc.line(130, 85, 130, 90);
  doc.text('PU', 138 , 88.5);
  doc.line(150, 85, 150, 90);
  doc.text('TVA', 152 , 88.5);
  doc.line(160, 85, 160, 90);
  doc.text('REM', 162 , 88.5);
  doc.line(170, 85, 170, 90);
  doc.text('THT', 181 , 88.5);
  doc.line(200, 85, 200, 90);
  var i = 95;
  doc.setFontSize(6);
  for (let j = 0; j < this.sodataset.length  ; j++) {
    
    if ((j % 30 == 0) && (j != 0) ) {
doc.addPage();
doc.addImage(img, 'png', 150, 5, 50, 30)
doc.setFontSize(9);
      if(this.domain.dom_name != null) {doc.text(this.domain.dom_name, 10 , 10 )};
      if(this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10 , 15 );
      if(this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10 , 20 );
      if(this.domain.dom_tel != null) doc.text('Tel : ' + this.domain.dom_tel, 10 , 30 );
      doc.setFontSize(12);
      doc.text( 'Commande N° : ' + nbr  , 70, 40);
      doc.setFontSize(8);
      
      doc.text('Code Client : ' + this.customer.cm_addr, 20 , 50 )
      doc.text('Nom             : ' + this.customer.address.ad_name, 20 , 55)
      doc.text('Adresse       : ' + this.customer.address.ad_line1, 20 , 60)
      if (this.customer.address.ad_misc2_id != null) {doc.text('MF          : ' + this.customer.address.ad_misc2_id, 20 , 65)}
      if (this.customer.address.ad_gst_id != null) {doc.text('RC          : ' + this.customer.address.ad_gst_id, 20 , 70)}
      if (this.customer.address.ad_pst_id) {doc.text('AI            : ' + this.customer.address.ad_pst_id, 20 , 75)}
      if (this.customer.address.ad_misc1_id != null) {doc.text('NIS         : ' + this.customer.address.ad_misc1_id, 20 , 80)}
    
      doc.line(10, 85, 200, 85);
      doc.line(10, 90, 200, 90);
      doc.line(10, 85, 10, 90);
      doc.text('LN', 12.5 , 88.5);
      doc.line(20, 85, 20, 90);
      doc.text('Code Article', 25 , 88.5);
      doc.line(45, 85, 45, 90);
      doc.text('Désignation', 67.5 , 88.5);
      doc.line(100, 85, 100, 90);
      doc.text('QTE', 107 , 88.5);
      doc.line(120, 85, 120, 90);
      doc.text('UM', 123 , 88.5);
      doc.line(130, 85, 130, 90);
      doc.text('PU', 138 , 88.5);
      doc.line(150, 85, 150, 90);
      doc.text('TVA', 152 , 88.5);
      doc.line(160, 85, 160, 90);
      doc.text('REM', 162 , 88.5);
      doc.line(170, 85, 170, 90);
      doc.text('THT', 181 , 88.5);
      doc.line(200, 85, 200, 90);
      i = 95;
      doc.setFontSize(6);

    }



    if (this.sodataset[j].item.pt_desc1.length > 42) {
      let desc1 = this.sodataset[j].item.pt_desc1.substring(42)
      let ind = desc1.indexOf(' ')
      desc1 = this.sodataset[j].item.pt_desc1.substring(0, 42  + ind)
      let desc2 = this.sodataset[j].item.pt_desc1.substring(42+ind)

      doc.line(10, i - 5, 10, i );
      doc.text(String(("000"+ this.sodataset[j].sod_line)).slice(-3), 12.5 , i  - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.sodataset[j].sod_part, 25 , i  - 1);
      doc.line(45, i - 5 , 45, i );
      doc.text(desc1, 47 , i  - 1);
      doc.line(100, i - 5, 100, i );
      doc.text( String(Number(this.sodataset[j].sod_qty_ord).toFixed(2)), 118 , i  - 1 , { align: 'right' });
      doc.line(120, i - 5 , 120, i );
      doc.text(this.sodataset[j].sod_um, 123 , i  - 1);
      doc.line(130, i - 5, 130, i );
      doc.text( String(Number(this.sodataset[j].sod_price).toFixed(2)), 148 , i  - 1 , { align: 'right' });
      doc.line(150, i - 5, 150, i );
      doc.text(String(this.sodataset[j].sod_taxc) + "%" , 153 , i  - 1);
      doc.line(160, i - 5 , 160, i );
      doc.text(String(this.sodataset[j].sod_disc_pct) + "%" , 163 , i  - 1);
      doc.line(170, i - 5 , 170, i );
      doc.text(String((this.sodataset[j].sod_price *
              ((100 - this.sodataset[j].sod_disc_pct) / 100) *
              this.sodataset[j].sod_qty_ord).toFixed(2)), 198 , i  - 1,{ align: 'right' });
      doc.line(200, i-5 , 200, i );
     // doc.line(10, i, 200, i );

      i = i + 5;

      doc.text(desc2, 47 , i  - 1);
      
      doc.line(10, i - 5, 10, i );
      doc.line(20, i - 5, 20, i);
      doc.line(45, i - 5 , 45, i );
      doc.line(100, i - 5, 100, i );
      doc.line(120, i - 5 , 120, i );
      doc.line(130, i - 5, 130, i );
      doc.line(150, i - 5, 150, i );
      doc.line(160, i - 5 , 160, i );
      doc.line(170, i - 5 , 170, i );
      doc.line(200, i-5 , 200, i );
      
      if (this.sodataset[j].sod__chr03 != null){

        if (this.sodataset[j].sod__chr03.length > 42) {
          let psdesc = this.sodataset[j].sod__chr03.substring(35)
         
          let ind = psdesc.indexOf(' ')
         
          if (ind == -1) { ind = this.sodataset[j].sod__chr03.length - 42}
          psdesc = this.sodataset[j].sod__chr03.substring(0, 42  + ind)
          let psdesc2 = this.sodataset[j].sod__chr03.substring(42+ind)

        i = i + 5

        doc.text(String(psdesc), 47 , i  - 1);
        
        doc.line(10, i - 5, 10, i );
        doc.line(20, i - 5, 20, i);
        doc.line(45, i - 5 , 45, i );
        doc.line(100, i - 5, 100, i );
        doc.line(120, i - 5 , 120, i );
        doc.line(130, i - 5, 130, i );
        doc.line(150, i - 5, 150, i );
        doc.line(160, i - 5 , 160, i );
        doc.line(170, i - 5 , 170, i );
        doc.line(200, i-5 , 200, i );
        
        i = i + 5

        doc.text(String(psdesc2), 47 , i  - 1);
        
        doc.line(10, i - 5, 10, i );
        doc.line(20, i - 5, 20, i);
        doc.line(45, i - 5 , 45, i );
        doc.line(100, i - 5, 100, i );
        doc.line(120, i - 5 , 120, i );
        doc.line(130, i - 5, 130, i );
        doc.line(150, i - 5, 150, i );
        doc.line(160, i - 5 , 160, i );
        doc.line(170, i - 5 , 170, i );
        doc.line(200, i-5 , 200, i );

        doc.line(10, i, 200, i );

        i = i + 5 ;
      } else {

        doc.text(String(this.sodataset[j].sod__chr03), 47 , i  - 1);
      
        doc.line(10, i - 5, 10, i );
        doc.line(20, i - 5, 20, i);
        doc.line(45, i - 5 , 45, i );
        doc.line(100, i - 5, 100, i );
        doc.line(120, i - 5 , 120, i );
        doc.line(130, i - 5, 130, i );
        doc.line(150, i - 5, 150, i );
        doc.line(160, i - 5 , 160, i );
        doc.line(170, i - 5 , 170, i );
        doc.line(200, i-5 , 200, i );
        doc.line(10, i, 200, i );
       // doc.line(10, i, 200, i );
        i = i + 5;
      }
  
   
   
    
      }
      else{
        doc.line(10, i, 200, i );
        i = i + 5
      }
      
    } else {


    
    doc.line(10, i - 5, 10, i );
    doc.text(String(("000"+ this.sodataset[j].sod_line)).slice(-3), 12.5 , i  - 1);
    doc.line(20, i - 5, 20, i);
    doc.text(this.sodataset[j].sod_part, 25 , i  - 1);
    doc.line(45, i - 5 , 45, i );
    doc.text(this.sodataset[j].item.pt_desc1, 47 , i  - 1);
    doc.line(100, i - 5, 100, i );
    doc.text( String(Number(this.sodataset[j].sod_qty_ord).toFixed(2)), 118 , i  - 1 , { align: 'right' });
    doc.line(120, i - 5 , 120, i );
    doc.text(this.sodataset[j].sod_um, 123 , i  - 1);
    doc.line(130, i - 5, 130, i );
    doc.text( String(Number(this.sodataset[j].sod_price).toFixed(2)), 148 , i  - 1 , { align: 'right' });
    doc.line(150, i - 5, 150, i );
    doc.text(String(this.sodataset[j].sod_taxc) + "%" , 153 , i  - 1);
    doc.line(160, i - 5 , 160, i );
    doc.text(String(this.sodataset[j].sod_disc_pct) + "%" , 163 , i  - 1);
    doc.line(170, i - 5 , 170, i );
    doc.text(String((this.sodataset[j].sod_price *
      ((100 - this.sodataset[j].sod_disc_pct) / 100) *
      this.sodataset[j].sod_qty_ord).toFixed(2)), 198 , i  - 1,{ align: 'right' });
    doc.line(200, i-5 , 200, i );
   

      if (this.sodataset[j].sod__chr03 != null){

        if (this.sodataset[j].sod__chr03.length > 42) {
          let psdesc = this.sodataset[j].sod__chr03.substring(42)
         
          let ind = psdesc.indexOf(' ')
          
          if (ind == -1) { ind = this.sodataset[j].sod__chr03.length - 42}
          psdesc = this.sodataset[j].sod__chr03.substring(0, 42  + ind)
          let psdesc2 = this.sodataset[j].sod__chr03.substring(42+ind)

        i = i + 5

        doc.text(String(psdesc), 47 , i  - 1);
       
        doc.line(10, i - 5, 10, i );
        doc.line(20, i - 5, 20, i);
        doc.line(45, i - 5 , 45, i );
        doc.line(100, i - 5, 100, i );
        doc.line(120, i - 5 , 120, i );
        doc.line(130, i - 5, 130, i );
        doc.line(150, i - 5, 150, i );
        doc.line(160, i - 5 , 160, i );
        doc.line(170, i - 5 , 170, i );
        doc.line(200, i-5 , 200, i );
        
        i = i + 5

        doc.text(String(psdesc2), 47 , i  - 1);
       
        doc.line(10, i - 5, 10, i );
        doc.line(20, i - 5, 20, i);
        doc.line(45, i - 5 , 45, i );
        doc.line(100, i - 5, 100, i );
        doc.line(120, i - 5 , 120, i );
        doc.line(130, i - 5, 130, i );
        doc.line(150, i - 5, 150, i );
        doc.line(160, i - 5 , 160, i );
        doc.line(170, i - 5 , 170, i );
        doc.line(200, i-5 , 200, i );

        doc.line(10, i, 200, i );

        i = i + 5 ;
      } else {

        doc.text(String(this.sodataset[j].sod__chr03), 47 , i  - 1);
       
        doc.line(10, i - 5, 10, i );
        doc.line(20, i - 5, 20, i);
        doc.line(45, i - 5 , 45, i );
        doc.line(100, i - 5, 100, i );
        doc.line(120, i - 5 , 120, i );
        doc.line(130, i - 5, 130, i );
        doc.line(150, i - 5, 150, i );
        doc.line(160, i - 5 , 160, i );
        doc.line(170, i - 5 , 170, i );
        doc.line(200, i-5 , 200, i );
        doc.line(10, i, 200, i );
       // doc.line(10, i, 200, i );
        i = i + 5;
      }
  
   
   
    
      }
      else{
        doc.line(10, i, 200, i );
        i = i + 5
      }
      
      // doc.line(10, i, 200, i );
      // i = i + 5;
  }
  }
  
 // doc.line(10, i - 5, 200, i - 5);

 doc.line(130, i + 7,  200, i + 7  );
 doc.line(130, i + 14, 200, i + 14 );
 doc.line(130, i + 21, 200, i + 21 );
 doc.line(130, i + 28, 200, i + 28 );
 doc.line(130, i + 35, 200, i + 35 );
 doc.line(130, i + 7,  130, i + 35  );
 doc.line(160, i + 7,  160, i + 35  );
 doc.line(200, i + 7,  200, i + 35  );
 doc.setFontSize(10);
 
 doc.text('Total HT', 140 ,  i + 12 , { align: 'left' });
 doc.text('TVA', 140 ,  i + 19 , { align: 'left' });
 doc.text('Timbre', 140 ,  i + 26 , { align: 'left' });
 doc.text('Total TC', 140 ,  i + 33 , { align: 'left' });

 
 doc.text(String(Number(this.so.so_amt).toFixed(2)), 198 ,  i + 12 , { align: 'right' });
 doc.text(String(Number(this.so.so_tax_amt).toFixed(2)), 198 ,  i + 19 , { align: 'right' });
 doc.text(String(Number(this.so.so_trl1_amt).toFixed(2)), 198 ,  i + 26 , { align: 'right' });
 doc.text(String(Number(Number(this.so.so_amt)+ Number(this.so.so_tax_amt)+ Number(this.so.so_trl1_amt)).toFixed(2)), 198 ,  i + 33 , { align: 'right' });

 doc.setFontSize(8);
    let mt = NumberToLetters(
      Number(Number(this.so.so_amt)+ Number(this.so.so_tax_amt)+ Number(this.so.so_trl1_amt)).toFixed(2),this.curr.cu_desc)

      if (mt.length > 95) {
        let mt1 = mt.substring(90)
        let ind = mt1.indexOf(' ')
       
        mt1 = mt.substring(0, 90  + ind)
        let mt2 = mt.substring(90+ind)
   
        doc.text( "Arretée la présente Commande a la somme de : " + mt1  , 20, i + 53)
        doc.text(  mt2  , 20, i + 60)
      } else {
        doc.text( "Arretée la présente Commande a la somme de : " + mt  , 20, i + 53)

      }
    // window.open(doc.output('bloburl'), '_blank');
    //window.open(doc.output('blobUrl'));  // will open a new tab
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));

  }
}
