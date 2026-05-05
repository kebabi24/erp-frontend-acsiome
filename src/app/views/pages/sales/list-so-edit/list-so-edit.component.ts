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
import { replaceAll } from "chartist"

const defaultPageSize = 100;
@Component({
  selector: 'kt-list-so-edit',
  templateUrl: './list-so-edit.component.html',
  styleUrls: ['./list-so-edit.component.scss']
})
export class ListSoEditComponent implements OnInit {

 
// slick grid
selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];

columnDefinitions: Column[] = []
gridOptions: GridOption = {}
dataset: any[] = []
draggableGroupingPlugin: any;
angularGrid: AngularGridInstance;

grid: any;
gridService: GridService;

dataView: any;
//dataset: any[] = [];
customer: any;
so: any;
sodataset: any[] = [];
curr : any;
domain
user
hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;
  soForm: FormGroup;
  dataviewObj: any;
constructor(
  private activatedRoute: ActivatedRoute,
  private router: Router,
  public dialog: MatDialog,
  private layoutUtilsService: LayoutUtilsService,
  private soService: SaleOrderService,
  private customersService: CustomerService,
  private deviseService: DeviseService,
  private psService: PsService,
  private soFB: FormBuilder,
) {
  // this.prepareGrid();
}
solist() {
  this.dataset = []
 
  const controls = this.soForm.controls
  const date = controls.calc_date.value
  ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
  : null;

  const date1 = controls.calc_date1.value
  ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
  : null;
 
  
  let obj= {date,date1}
  this.soService.getAllwithDetailObj(obj).subscribe(
    (response: any) => {   
      this.dataset = response.data
      // console.log(this.dataset)
       this.dataView.setItems(this.dataset);
    
       },
    (error) => {
        this.dataset = []
    },
    () => {}
)
}

ngOnInit(): void {
  this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
  this.user =  JSON.parse(localStorage.getItem('user'))
      this.domain =  JSON.parse(localStorage.getItem('domain'))
      this.createForm();
      this.prepareGrid()
      //this.initGrid();
      this.solist();
     
    }
createForm() {
  this.loadingSubject.next(false);
  const date = new Date;
  
  this.soForm = this.soFB.group({
   // po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],
   
    calc_date: [{
      year:date.getFullYear(),
      month: date.getMonth()+1,
      day: 1
    }],
    calc_date1: [{
      year:date.getFullYear(),
      month: date.getMonth()+1,
      day: date.getDate()
    }],
  });



}
angularGridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
  this.dataView = angularGrid.dataView;
  this.grid = angularGrid.slickGrid;
  this.gridService = angularGrid.gridService;
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
          const id = args.dataContext.id
          if(args.dataContext.so_stat == null) {
          this.router.navigateByUrl(`/sales/edit-so-plq/${id}`)
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
      id: "so_nbr",
      name: "Code CMD",
      field: "so_nbr",
      minWidth: 100,
      maxWidth: 120,
      selectable: true,
      filterable: true,
      grouping: {
        getter: 'so_nbr',
        formatter: (g) => `N CC: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
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
      name: "Date de création",
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
      name: "Date d écheance",
      field: "so_due_date",
      sortable: true,
      width: 50,
      filterable: true,
      formatter: Formatters.dateIso,
      type: FieldType.dateIso,
      grouping: {
        getter: 'so_due_date',
        formatter: (g) => `Date écheance: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
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
   
    // {
    //   id: "sod_part",
    //   name: "Article",
    //   field: "sod_part",
    //   sortable: true,
    //   width: 50,
    //   filterable: true,
    //   grouping: {
    //     getter: 'sod_part',
    //     formatter: (g) => `Article: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
    //     aggregators: [
    //       // (required), what aggregators (accumulator) to use and on which field to do so
    //      // new Aggregators.Avg('tr_qty_loc'),
    //       new Aggregators.Sum('sod_qty_ord'),
    //       new Aggregators.Sum('sod_qty_rcvd')
    //     ],
    //     aggregateCollapsed: true,
    
    //     collapsed: false,
    //   }
    // },
    // {
    //   id: "pt_desc1",
    //   name: "Designation",
    //   field: "pt_desc1",
    //   sortable: true,
    //   width: 50,
    //   filterable: true,
    // },
    // {
    //   id: "sod_um",
    //   name: "UM",
    //   field: "sod_um",
    //   sortable: true,
    //   width: 30,
    //   filterable: true,
    // },
    
    // {
    //   id: "sod_qty_ord",
    //   name: "Quantite",
    //   field: "sod_qty_ord",
    //   sortable: true,
    //   width: 50,
    //   filterable: true,
    //   groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
    //   type: FieldType.float,

    // },
    // {
    //   id: "sod_qty_ship",
    //   name: "Quantite Livree",
    //   field: "sod_qty_ship",
    //   sortable: true,
    //   width: 50,
    //   filterable: true,
    //   groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
    //   type: FieldType.float,

    // },
    
    // {
    //   id: "sod_price",
    //   name: "Prix",
    //   field: "sod_price",
    //   sortable: true,
    //   width: 50,
    //   filterable: true,
    //   type: FieldType.float,
    // },
      {
      id: "so_amt",
      name: "Montant HT",
      field: "so_amt",
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
    // enablePagination: true, // you could optionally disable the Pagination
    //   pagination: {
    //   pageSizes: [20, 50, 100, 200, 300, 400, 500, 700, 1000],
    //   pageSize: defaultPageSize,
    //   totalItems: 0
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


}

// fill the dataset with your data
this.dataset = []
// this.soService.getAllwithDetail().subscribe(
    // (response: any) =>  ( this.dataset = response.data),
   
   

//    (error) => {
    
//         this.dataset = []
//     },
//     () => {}
   
// )  

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
  this.grid.invalidate(); // invalidate all rows and re-render
}

printpdf(nbr) {
 // const controlss = this.soForm.controls 
  
  var doc = new jsPDF();
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
  doc.text("Code Client : " + this.customer.cm_addr, 20, 65);
  doc.text("Date : " + this.so.so_ord_date, 150, 65);
  doc.text("Nom             : " + this.customer.address.ad_name, 20, 70);
  doc.text("Adresse       : " + this.customer.address.ad_line1, 20, 75);
  if (this.customer.address.ad_misc2_id != null) {
    doc.text("MF          : " + this.customer.address.ad_misc2_id, 20, 80);
  }
  if (this.customer.address.ad_gst_id != null) {
    doc.text("RC          : " + this.customer.address.ad_gst_id, 20, 85);
  }
  if (this.customer.address.ad_pst_id) {
    doc.text("AI            : " + this.customer.address.ad_pst_id, 20, 90);
  }
  if (this.customer.address.ad_misc1_id != null) {
    doc.text("NIS         : " + this.customer.address.ad_misc1_id, 20, 95);
  }

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
  for (let j = 0; j < this.sodataset.length  ; j++) {
    
    if ((j % 20 == 0) && (j != 0) ) {
doc.addPage();
doc.addImage(img, "png", 160, 5, 50, 30);
doc.setFontSize(12);
if (this.domain.dom_name != null) {
  doc.text(this.domain.dom_name, 10, 10);
}
if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
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
doc.text("Code Client : " + this.customer.cm_addr, 20, 65);
doc.text("Date : " + this.so.so_ord_date, 150, 65);
doc.text("Nom             : " + this.customer.address.ad_name, 20, 70);
doc.text("Adresse       : " + this.customer.address.ad_line1, 20, 75);
if (this.customer.address.ad_misc2_id != null) {
doc.text("MF          : " + this.customer.address.ad_misc2_id, 20, 80);
}
if (this.customer.address.ad_gst_id != null) {
doc.text("RC          : " + this.customer.address.ad_gst_id, 20, 85);
}
if (this.customer.address.ad_pst_id) {
doc.text("AI            : " + this.customer.address.ad_pst_id, 20, 90);
}
if (this.customer.address.ad_misc1_id != null) {
doc.text("NIS         : " + this.customer.address.ad_misc1_id, 20, 95);
}

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
doc.setFontSize(10);
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

  
  printpdf2() {

    console.log(this.dataView.getFilteredItems())
    const data = this.dataView.getFilteredItems()
    const controls = this.soForm.controls;
    
    const date = controls.calc_date.value
      ? `${String("0" + controls.calc_date.value.day).slice(-2)}-${String("0" + controls.calc_date.value.month).slice(-2)}-${controls.calc_date.value.year}`
      : null;
     const date1 = controls.calc_date1.value
      ? `${String("0" + controls.calc_date1.value.day).slice(-2)}-${String("0" + controls.calc_date1.value.month).slice(-2)}-${controls.calc_date1.value.year}`
      : null;
    console.log("pdf");
    var doc = new jsPDF({orientation:'p'});

    // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
    var img = new Image();
    img.src = "./assets/media/logos/companylogo.png";
    doc.addImage(img, "png", 160, 2, 50, 30);
    doc.setFontSize(9);
    if (this.domain.dom_name != null) {
      doc.text(this.domain.dom_name, 10, 10);
    }

    // fill the dataset with your data
  
    if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
    if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
    if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
    doc.setFontSize(14);
    doc.text("Liste des Factures    " , 80, 40);
    doc.setFontSize(12);
    
    doc.text("Date Début : " + date, 40, 50);
    doc.text("Date Fin      : " + date1, 110, 50);

    doc.setFontSize(10);
    doc.line(5, 55, 205, 55);
    doc.line(5, 55, 205, 55);
    doc.line(5, 55, 205, 55);
    doc.line(5, 60, 205, 60);
    doc.line(5, 55, 5, 60);
    doc.text("Code Cient", 7.5, 58.5);
    doc.line(27, 55, 27, 60);
    doc.text("Nom Client", 40, 58.5);
    doc.line(80, 55, 80, 60);
    doc.text("Date", 82, 58.5);
    doc.line(102, 55, 102, 60);
    doc.text("N° Facture", 104, 58.5);
    doc.line(130, 55, 130, 60);
    doc.text("Devise", 132, 58.5);
    doc.line(145, 55, 145, 60);
    doc.text("Montant", 160, 58.5);
    doc.line(205, 55, 205, 60);
       
   
    var i = 65;
    doc.setFontSize(10);
    let total = 0
    let encaisse = 0
    let credits = 0
    for (let j = 0; j < data.length; j++) {
      let mts =  String(  Number(data[j].so_tot_amt).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }))
   //   console.log(mts)
      let mnt = replaceAll(mts,","," ")
      

     // console.log(mnsolde)
      if (j % 44 == 0 && j != 0) {
        doc.addPage();
        // img.src = "./assets/media/logos/companylogo.png";
        doc.addImage(img, "png", 160, 2, 50, 30);
        doc.setFontSize(10);
        if (this.domain.dom_name != null) {
          doc.text(this.domain.dom_name, 10, 10);
        }
        if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
        if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
        if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
        doc.setFontSize(14);
        doc.text("Liste des Crédits    " , 80, 40);
        doc.setFontSize(12);
        
        doc.text("Date Début : " + date, 40, 50);
        doc.text("Date Fin      : " + date1, 110, 50);
      
        
        doc.setFontSize(10);
        doc.line(5, 55, 205, 55);
        doc.line(5, 55, 205, 55);
        doc.line(5, 55, 205, 55);
        doc.line(5, 60, 205, 60);
        doc.line(5, 55, 5, 60);
        doc.text("Code Cient", 7.5, 58.5);
        doc.line(27, 55, 27, 60);
        doc.text("Nom Client", 40, 58.5);
        doc.line(80, 55, 80, 60);
        doc.text("Date", 82, 58.5);
        doc.line(102, 55, 102, 60);
        doc.text("N° Commande", 104, 58.5);
        doc.line(130, 55, 130, 60);
        doc.text("Devise", 132, 58.5);
        doc.line(145, 55, 145, 60);
        doc.text("Montant", 160, 58.5);
        doc.line(205, 55, 205, 60);
                   
        i = 65;
        doc.setFontSize(10);
      }

     
        doc.line(5, i - 5, 5, i);
        doc.text(data[j].so_cust, 7, i - 1);
        doc.line(27, i - 5, 27, i);
        doc.text(data[j].customer.cm_sort, 29, i - 1);
        doc.line(80, i - 5, 80, i);
        doc.text(data[j].so_ord_date, 82, i - 1);
        doc.line(102, i - 5, 102, i);
        doc.text(data[j].so_nbr, 104, i - 1);
        doc.line(130, i - 5, 130, i);
        doc.text(data[j].so_curr, 132, i - 1);
        doc.line(145, i - 5, 145, i);
        doc.text(mnt, 203, i - 1,{ align: "right" });
        doc.line(205, i - 5, 205, i);
        
        i = i + 5;
        total = total + Number(data[j].ar_base_amt)
       }
               doc.line(5, i - 5, 205, i - 5);

      //  doc.line(30, i-5, 110, i-5);

       let tt =  String(  Number(total).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }))
      let ttc = replaceAll(tt,","," ")

       
       doc.line(130, i - 5, 130, i);
       
        // doc.line(40, i - 5, 40, i);
        doc.text("Totaux", 143, i - 1,{ align: "right" });
        doc.line(145, i - 5, 145, i);
        doc.text(ttc, 203, i - 1,{ align: "right" });
        doc.line(205, i - 5, 205, i);
        doc.line(130, i, 205, i);
        i = i + 5;


    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
  }
}
