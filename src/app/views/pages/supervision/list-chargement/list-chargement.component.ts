import { Component, OnInit } from "@angular/core"
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
  GridService
 
} from "angular-slickgrid"

import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
// Layout
import {
    SubheaderService,
    LayoutConfigService,
} from "../../../../core/_base/layout"
// CRUD
import {
    LayoutUtilsService,
    TypesUtilsService,
    MessageType,
} from "../../../../core/_base/crud"
import { MatDialog } from "@angular/material/dialog"

import { BankService,LoadRequestService,RoleService} from "../../../../core/erp"
import { jsPDF } from "jspdf";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';


@Component({
  selector: 'kt-list-chargement',
  templateUrl: './list-chargement.component.html',
  styleUrls: ['./list-chargement.component.scss']
})
export class ListChargementComponent implements OnInit {

  draggableGroupingPlugin: any;
  
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];

  draggableGroupingPluginp: any;
  
  selectedGroupingFieldsp: Array<string | GroupingGetterFunction> = ['', '', ''];
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  dataView: any;
  gridService: GridService;
  
  angularGrid: AngularGridInstance;

  
  gridObj: any;
  dataviewObj: any;
  soForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;
  user: any;
  tr:any
  
  domain: any
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private soFB: FormBuilder,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
     
      private loadRequestService : LoadRequestService,
      private modalService: NgbModal,
      
  ) {
     // this.prepareGrid()
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    this.domain = JSON.parse(localStorage.getItem("domain"));
    console.log(this.user)
    this.createForm();
    this.prepareGrid()
    this.solist();
  }

  createForm() {
    this.loadingSubject.next(false);
    const date = new Date;
    
    this.soForm = this.soFB.group({
     
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
  solist() {
    this.dataset = []
   
    const controls = this.soForm.controls
    const date = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day} 00:00:00`
    : null;
  
    const date1 = controls.calc_date1.value
    ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day} 00:00:00`
    : null;
   
    let obj= {date,date1}
    this.loadRequestService.getLoad(obj).subscribe(
      (response: any) => {   
        this.dataset = response.data
       console.log(this.dataset)
       this.dataView.setItems(this.dataset);
        
         },
      (error) => {
          this.dataset = []
      },
      () => {}
  )
  }
  
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid; // grid object
    this.dataView = angularGrid.dataView;
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
            id: "product_code",
            name: "Code Produit",
            field: "product_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            width:120,
            grouping: {
              getter: 'product_code',
              formatter: (g) => `Code Produit: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
              new Aggregators.Sum('qty'),  
              new Aggregators.Sum('amt'),
                                       
                  
              
              ],
                aggregateCollapsed: false,
                collapsed: false,
              }
            
          },
          
          {
            id: "designation",
            name: "Désignatione",
            field: "designation",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'designation',
              formatter: (g) => `Désignation: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
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
            type: FieldType.float,
            formatter: Formatters.decimal,
            minWidth: 100,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
          },
          {
            id: "amt",
            name: "Montant",
            field: "amt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.decimal,
            minWidth: 100,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
          },
          
      ]

      this.gridOptions = {
        enableDraggableGrouping: true,
        createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        preHeaderPanelHeight: 40,
          enableFiltering: true,
          enableSorting: true,
          enableAutoResize:true,
          
          autoHeight:false,
          exportOptions: {
            sanitizeDataExport: true
          },
         
          formatterOptions: {
        
            // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
            displayNegativeNumberWithParentheses: true,
      
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
    
        
      }

      // fill the dataset with your data
      this.dataset = []
//       this.bankService.getBKHBy({bkh_type : "P"}).subscribe(
//           (response: any) => (this.dataset = response.data),
//           (error) => {
//               this.dataset = []
//           },
//           () => {}
//       )
// console.log(this.dataset)
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
      this.dataView.collapseAllGroups();
    }
  
    expandAllGroups() {
      this.dataView.expandAllGroups();
    }
    clearGrouping() {
      if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
        this.draggableGroupingPlugin.clearDroppedGroups();
      }
      this.gridObj.invalidate(); // invalidate all rows and re-render
    }
   
    
    printpdf() {
     
        
      const controls = this.soForm.controls;
        
      const date = controls.calc_date.value
    ? `${String("0" + controls.calc_date.value.day).slice(-2)}-${String("0" + controls.calc_date.value.month).slice(-2)}-${controls.calc_date.value.year}`
    : null;
    const date1 = controls.calc_date1.value
    ? `${String("0" + controls.calc_date1.value.day).slice(-2)}-${String("0" + controls.calc_date1.value.month).slice(-2)}-${controls.calc_date1.value.year}`
    : null;
      console.log("pdf");
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
      doc.setFontSize(14);
      doc.text("Liste des Chargement   " , 70, 40);
      doc.setFontSize(12);
      
      doc.text("Date Début : " + date, 20, 60);
      doc.text("Date Fin      : " + date1, 20, 65);
      
      doc.setFontSize(10);
      doc.line(10, 85, 110, 85);
          doc.line(10, 85, 190, 85);
          doc.line(10, 90, 190, 90);
          doc.line(10, 85, 10, 90);
          doc.text("LN", 12.5, 88.5);
          doc.line(20, 85, 20, 90);
          doc.text("Code Produit", 22, 88.5);
          doc.line(50, 85, 50, 90);
          doc.text("Désignation", 65, 88.5);
          doc.line(110, 85, 110, 90);
          doc.text("Quantité", 122, 88.5);
          doc.line(150, 85, 150, 90);
          doc.text("Montant", 162, 88.5);
          doc.line(190, 85, 190, 90);
     
      var i = 95;
      doc.setFontSize(10);
      let total = 0
      let totalqty = 0
      for (let j = 0; j < this.dataset.length; j++) {
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
          doc.text("Liste des Chargements   " , 70, 40);
          doc.setFontSize(12);
          
          doc.text("Date Début : " + date, 20, 60);
          doc.text("Date Fin      : " + date1, 20, 65);
          
          doc.setFontSize(10);
          doc.line(10, 85, 190, 85);
          doc.line(10, 90, 190, 90);
          doc.line(10, 85, 10, 90);
          doc.text("LN", 12.5, 88.5);
          doc.line(20, 85, 20, 90);
          doc.text("Code Produit", 22, 88.5);
          doc.line(50, 85, 50, 90);
          doc.text("Désignation", 52, 88.5);
          doc.line(110, 85, 110, 90);
          doc.text("Quantité", 112, 88.5);
          doc.line(150, 85, 150, 90);
          doc.text("Montant", 152, 88.5);
          doc.line(190, 85, 190, 90);
          i = 95;
          doc.setFontSize(10);
        }
  
       
          doc.line(10, i - 5, 10, i);
          doc.text(String("00" + j).slice(-2), 12.5, i - 1);
          doc.line(20, i - 5, 20, i);
          doc.text(this.dataset[j].product_code, 25, i - 1);
          doc.line(50, i - 5, 50, i);
          doc.text(String(this.dataset[j].designation), 52, i - 1);
          doc.line(110, i - 5, 110, i);
          doc.text(String(Number(this.dataset[j].qty).toFixed(2)) , 148, i - 1,{ align: "right" });
          doc.line(150, i - 5, 150, i);
          doc.text(String(Number(this.dataset[j].amt).toFixed(2)) , 188, i - 1,{ align: "right" });
          doc.line(190, i - 5, 190, i);
          doc.line(10, i , 190, i);
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
          total = total + Number(this.dataset[j].amt)
          totalqty = totalqty + Number(this.dataset[j].qty)
         }
        // doc.line(10, i-5, 190, i-5);
         
        

         doc.line(50, i - 5, 50, i);
         
          
          doc.text("Total", 52, i - 1);
          doc.line(110, i - 5, 110, i);
          doc.text(String(Number(totalqty).toFixed(2)), 148, i - 1,{ align: "right" });
          doc.line(150, i - 5, 150, i);
          doc.text(String(Number(total).toFixed(2)), 188, i - 1,{ align: "right" });
          doc.line(190, i - 5, 190, i);
          doc.line(50, i, 190, i);
          i = i + 5;
  
      // doc.line(10, i - 5, 200, i - 5);
  
      // window.open(doc.output('bloburl'), '_blank');
      //window.open(doc.output('blobUrl'));  // will open a new tab
      var blob = doc.output("blob");
      window.open(URL.createObjectURL(blob));
   
    }
}
