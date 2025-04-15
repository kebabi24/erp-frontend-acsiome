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

import { BankService,RoleService} from "../../../../core/erp"
import { jsPDF } from "jspdf";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { replaceAll } from "chartist";

const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';

@Component({
  selector: 'kt-bank-journal',
  templateUrl: './bank-journal.component.html',
  styleUrls: ['./bank-journal.component.scss']
})
export class BankJournalComponent implements OnInit {

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
  role:any
  banks: [];
  columnDefinitionsbank: Column[] = [];
  gridOptionsbank: GridOption = {};
  gridObjbank: any;
  angularGridbank: AngularGridInstance;
  domain: any
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private soFB: FormBuilder,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private bankService: BankService,
      private roleService : RoleService,
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
      bank_code : ["", Validators.required],
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
    const bank = controls.bank_code.value
    const date = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
  
    const date1 = controls.calc_date1.value
    ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
    : null;
   
    let obj= {bank,date,date1}
    this.bankService.getBKTr(obj).subscribe(
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
            id: "bkh_code",
            name: "N° Verssement",
            field: "bkh_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            width:120,
          },
          {
            id: "bkh_num_doc",
            name: "N° Document",
            field: "bkh_num_doc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "bkh_addr",
            name: "Adresse",
            field: "bkh_addr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'bkh_addr',
              formatter: (g) => `Vendeur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('bkh_amt'),  
                new Aggregators.Sum('bkh_2000'),
                new Aggregators.Sum('bkh_1000'),
                new Aggregators.Sum('bkh_0500'),
                new Aggregators.Sum('bkh_0200'),    
                new Aggregators.Sum('bkh_p200'),    
                new Aggregators.Sum('bkh_p100'),
                new Aggregators.Sum('bkh_p050'),
                new Aggregators.Sum('bkh_p020'),
                new Aggregators.Sum('bkh_p010'),
                new Aggregators.Sum('bkh_p005'),
                new Aggregators.Sum('bkh_bon'),
                new Aggregators.Sum('bkh_cheque'),             
              
              ],
                aggregateCollapsed: false,
                collapsed: false,
              }
    
          },
          {
            id: "bkh_effdate",
            name: "Date Effet",
            field: "bkh_effdate",
            sortable: true,
            filterable: true,
            width:120,
            type: FieldType.dateIso,
            grouping: {
              getter: 'bkh_effdate',
              formatter: (g) => `Date Effet: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('bkh_amt'),  
              new Aggregators.Sum('bkh_2000'),
              new Aggregators.Sum('bkh_1000'),
              new Aggregators.Sum('bkh_0500'),
              new Aggregators.Sum('bkh_0200'),    
              new Aggregators.Sum('bkh_p200'),    
              new Aggregators.Sum('bkh_p100'),
              new Aggregators.Sum('bkh_p050'),
              new Aggregators.Sum('bkh_p020'),
              new Aggregators.Sum('bkh_p010'),
              new Aggregators.Sum('bkh_p005'),
              new Aggregators.Sum('bkh_bon'),
              new Aggregators.Sum('bkh_cheque'),             
              
              ],
                aggregateCollapsed: false,
                collapsed: false,
              }
            
          }, 
          {
            id: "chr01",
            name: "Role",
            field: "chr01",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'chr01',
              formatter: (g) => `Role: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
              new Aggregators.Sum('bkh_amt'),  
              new Aggregators.Sum('bkh_2000'),
              new Aggregators.Sum('bkh_1000'),
              new Aggregators.Sum('bkh_0500'),
              new Aggregators.Sum('bkh_0200'),    
              new Aggregators.Sum('bkh_p200'),    
              new Aggregators.Sum('bkh_p100'),
              new Aggregators.Sum('bkh_p050'),
              new Aggregators.Sum('bkh_p020'),
              new Aggregators.Sum('bkh_p010'),
              new Aggregators.Sum('bkh_p005'),
              new Aggregators.Sum('bkh_bon'),
              new Aggregators.Sum('bkh_cheque'),                            
                  
              
              ],
                aggregateCollapsed: false,
                collapsed: false,
              }
            
          }, 
          {
            id: "bkh_type",
            name: "Type Transaction",
            field: "bkh_type",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'bkh_type',
              formatter: (g) => `Type: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
              new Aggregators.Sum('bkh_amt'),  
              new Aggregators.Sum('bkh_2000'),
              new Aggregators.Sum('bkh_1000'),
              new Aggregators.Sum('bkh_0500'),
              new Aggregators.Sum('bkh_0200'),    
              new Aggregators.Sum('bkh_p200'),    
              new Aggregators.Sum('bkh_p100'),
              new Aggregators.Sum('bkh_p050'),
              new Aggregators.Sum('bkh_p020'),
              new Aggregators.Sum('bkh_p010'),
              new Aggregators.Sum('bkh_p005'),
              new Aggregators.Sum('bkh_bon'),
              new Aggregators.Sum('bkh_cheque'),                            
                  
              
              ],
                aggregateCollapsed: false,
                collapsed: false,
              }
            
          }, 
         
          {
            id: "bkh_balance",
            name: "Balance",
            field: "bkh_balance",
            sortable: true,
            filterable: true,
            minWidth:120,
            type: FieldType.float,
            formatter: Formatters.decimal,
            params: { minDecimal: 2, maxDecimal: 2 }, 
            headerCssClass: 'text-right',
            cssClass: 'text-right'
            
          }, 
         
          {
            id: "bkh_amt",
            name: "Montant",
            field: "bkh_amt",
            sortable: true,
            filterable: true,
            minWidth: 100,
            type: FieldType.float,
            formatter: Formatters.decimal,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            params: { minDecimal: 2, maxDecimal: 2 }, 
            headerCssClass: 'text-right',
            cssClass: 'text-right'

          },
          {
            id: "bkh_2000",
            name: "Billet 2000",
            field: "bkh_2000",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            headerCssClass: 'text-right',
            cssClass: 'text-right'
            
          }, 
          {
            id: "bkh_1000",
            name: "Billet 1000",
            field: "bkh_1000",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            headerCssClass: 'text-right',
            cssClass: 'text-right'
            
          }, 
          {
            id: "bkh_0500",
            name: "Billet 500",
            field: "bkh_0500",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            headerCssClass: 'text-right',
            cssClass: 'text-right'

          }, 
          {
            id: "bkh_0200",
            name: "Billet 200",
            field: "bkh_0200",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            headerCssClass: 'text-right',
            cssClass: 'text-right'

          },
          {
            id: "bkh_p200",
            name: "Piéce 200",
            field: "bkh_p200",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            headerCssClass: 'text-right',
            cssClass: 'text-right'

          },
          {
            id: "bkh_p100",
            name: "Piéce 100",
            field: "bkh_p100",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            headerCssClass: 'text-right',
            cssClass: 'text-right'

          },
          {
            id: "bkh_p050",
            name: "Piéce 50",
            field: "bkh_p050",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            headerCssClass: 'text-right',
            cssClass: 'text-right'

          },
          {
            id: "bkh_p020",
            name: "Piéce 20",
            field: "bkh_p020",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            headerCssClass: 'text-right',
            cssClass: 'text-right'

          },
          {
            id: "bkh_p010",
            name: "Piéce 10",
            field: "bkh_p010",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            headerCssClass: 'text-right',
            cssClass: 'text-right'

          },
          {
            id: "bkh_p005",
            name: "Piéce 5",
            field: "bkh_p005",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            headerCssClass: 'text-right',
            cssClass: 'text-right'
          },
          {
            id: "bkh_bon",
            name: "Bon",
            field: "bkh_bon",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.decimal,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            params: { minDecimal: 2, maxDecimal: 2 }, 
            headerCssClass: 'text-right',
            cssClass: 'text-right'
          },
          {
            id: "bkh_rmks",
            name: "Motif",
            field: "bkh_rmks",
            sortable: true,
            filterable: true,
            type: FieldType.text,
            
          },
          {
            id: "bkh_cheque",
            name: "Cheque",
            field: "bkh_cheque",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.decimal,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            params: { minDecimal: 2, maxDecimal: 2 }, 
            headerCssClass: 'text-right',
            cssClass: 'text-right'
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
   
    handleSelectedRowsChangedbank(e, args) {
      const controls = this.soForm.controls;
      if (Array.isArray(args.rows) && this.gridObjbank) {
        args.rows.map((idx) => {
          const item = this.gridObjbank.getDataItem(idx);
          controls.bank_code.setValue(item.bk_code || "");
                
        });
      }
    }
    
    angularGridReadybank(angularGrid: AngularGridInstance) {
      this.angularGridbank = angularGrid;
      this.gridObjbank = (angularGrid && angularGrid.slickGrid) || {};
    }
    
    prepareGridbank() {
      this.columnDefinitionsbank = [
        {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
        },
        {
          id: "bk_code",
          name: "code",
          field: "bk_code",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "address.ad_name",
          name: "Designation",
          field: "address.ad_name",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "bk_curr",
          name: "Devise",
          field: "bk_curr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "bk_entity",
          name: "Entité",
          field: "bk_entity",
          sortable: true,
          filterable: true,
          type: FieldType.boolean,
        },
      ];
    
      this.gridOptionsbank = {
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
        dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
          var val = undefined;
          try {
            val = eval("item." + column.field);
          } catch (e) {
            // ignore
          }
          return val;
        },
      };
      // fill the dataset with your data
      this.bankService
        .getAll()
        .subscribe((response: any) => {
          console.log(response.data)
          this.banks = response.data});
    }
    openbank(content) {
      this.prepareGridbank();
      this.modalService.open(content, { size: "lg" });
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
      doc.text("Journal de Caisse  : " + controls.bank_code.value, 70, 40);
      doc.setFontSize(12);
      
      doc.text("Date Début : " + date, 20, 60);
      doc.text("Date Fin   : " + date1, 20, 65);
      
      doc.setFontSize(8);
      doc.line(10, 85, 205, 85);
      doc.line(10, 85, 205, 85);
      doc.line(10, 90, 205, 90);
      doc.line(10, 85, 10, 90);
      doc.text("LN", 12.5, 88.5);
      doc.line(20, 85, 20, 90);
      doc.text("N° Transaction", 22, 88.5);
      doc.line(45, 85, 45, 90);
      doc.text("N° Document", 50, 88.5);
      doc.line(70, 85, 70, 90);
      doc.text("Adresse", 72, 88.5);
      doc.line(95, 85, 95, 90);
      doc.text("Role", 100, 88.5);
      doc.line(120, 85, 120, 90);
      doc.text("Type", 122, 88.5);
      doc.line(130, 85, 130, 90);
      doc.text("Date", 135, 88.5);
      doc.line(155, 85, 155, 90);
      doc.text("Cheque", 158, 88.5);
      doc.line(180, 85, 180, 90);
      doc.text("Montant", 182, 88.5);
      doc.line(205, 85, 205, 90);
      var i = 95;
      doc.setFontSize(8);
      for (let j = 0; j < this.dataset.length; j++) {


        let amt = Number(this.dataset[j].bkh_amt) - Number(this.dataset[j].bkh_cheque)
        let ccamt =  String(  Number(amt).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        
        let camt = replaceAll(ccamt,","," ")

        let chek = Number(this.dataset[j].bkh_cheque)
        let ccchek =  String(  Number(chek).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        
        let cheque = replaceAll(ccchek,","," ")

        if (j % 38 == 0 && j != 0) {
          doc.addPage();
          // img.src = "./assets/media/logos/companylogo.png";
          doc.addImage(img, "png", 160, 5, 50, 30);
          doc.setFontSize(9);
          if (this.domain.dom_name != null) {
            doc.text(this.domain.dom_name, 10, 10);
          }
          if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
          if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
          if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
          doc.setFontSize(14);
          doc.text("Journal de Caisse  : " + controls.bank_code.value, 70, 40);
          doc.setFontSize(12);
          
          doc.text("Date Début : " + date, 20, 60);
          doc.text("Date Fin   : " + date1, 20, 65);
          
          doc.setFontSize(8);
          doc.line(10, 85, 205, 85);
          doc.line(10, 85, 205, 85);
          doc.line(10, 90, 205, 90);
          doc.line(10, 85, 10, 90);
          doc.text("LN", 12.5, 88.5);
          doc.line(20, 85, 20, 90);
          doc.text("N° Transaction", 22, 88.5);
          doc.line(45, 85, 45, 90);
          doc.text("N° Document", 50, 88.5);
          doc.line(70, 85, 70, 90);
          doc.text("Adresse", 72, 88.5);
          doc.line(95, 85, 95, 90);
          doc.text("Role", 100, 88.5);
          doc.line(120, 85, 120, 90);
          doc.text("Type", 122, 88.5);
          doc.line(130, 85, 130, 90);
          doc.text("Date", 135, 88.5);
          doc.line(155, 85, 155, 90);
          doc.text("Cheque", 158, 88.5);
          doc.line(180, 85, 180, 90);
          doc.text("Montant", 182, 88.5);
          
          doc.line(205, 85, 205, 90);
          i = 95;
          doc.setFontSize(8);
        }
  
       
          doc.line(10, i - 5, 10, i);
          doc.text(String("000" + j).slice(-3), 12.5, i - 1);
          doc.line(20, i - 5, 20, i);
          doc.text(this.dataset[j].bkh_code, 25, i - 1);
          doc.line(45, i - 5, 45, i);
         if(this.dataset[j].bkh_num_doc!= null) {doc.text(String(this.dataset[j].bkh_num_doc), 47, i - 1);}
          doc.line(70, i - 5, 70, i);
          doc.text(String(this.dataset[j].bkh_addr), 72, i - 1);
          doc.line(95, i - 5, 95, i);
         if(this.dataset[j].chr01 != null) { doc.text(this.dataset[j].chr01, 97, i - 1);} else {doc.text(this.dataset[j].bkh_addr, 97, i - 1)}
          doc.line(120, i - 5, 120, i);
          doc.text(String((this.dataset[j].bkh_type)), 122, i - 1 );
          doc.line(130, i - 5, 130, i);
          doc.text(String(this.dataset[j].bkh_effdate) , 153, i - 1, { align: "right" });
          doc.line(155, i - 5, 155, i);
          doc.text(cheque , 178, i - 1,{ align: "right" });
          doc.line(180, i - 5, 180, i);
          doc.text(camt, 203, i - 1, { align: "right" });
          doc.line(205, i - 5, 205, i);
          doc.line(10, i, 205, i);
          i = i + 5;
         }
  
      // doc.line(10, i - 5, 200, i - 5);
  
      // window.open(doc.output('bloburl'), '_blank');
      //window.open(doc.output('blobUrl'));  // will open a new tab
      var blob = doc.output("blob");
      window.open(URL.createObjectURL(blob));
    }
}
