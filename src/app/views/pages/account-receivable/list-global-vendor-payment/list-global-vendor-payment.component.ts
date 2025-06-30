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
import { replaceAll } from "chartist"
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';

@Component({
  selector: 'kt-list-global-vendor-payment',
  templateUrl: './list-global-vendor-payment.component.html',
  styleUrls: ['./list-global-vendor-payment.component.scss']
})
export class ListGlobalVendorPaymentComponent implements OnInit {

  draggableGroupingPlugin: any;
  
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];

  draggableGroupingPluginp: any;
  
  selectedGroupingFieldsp: Array<string | GroupingGetterFunction> = ['', '', ''];
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  dataView: any;
  
  angularGrid: AngularGridInstance;

  
  gridObj: any;
  dataviewObj: any;
  soForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;
  user: any;
  domain:any;
  tr:any;
  role:any;
  data: any[] = []
  MntCheque : Number
  MntDep : Number
  banks: [];
  columnDefinitionsbank: Column[] = [];
  gridOptionsbank: GridOption = {};
  gridObjbank: any;
  angularGridbank: AngularGridInstance;
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
      bank : ["", Validators.required],
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
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
  
    const date1 = controls.calc_date1.value
    ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
    : null;
   const bank = controls.bank.value
    let obj= {bank,date,date1}
    this.bankService.getBKHGrpTrBy(obj).subscribe(
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
            id: "bkh_effdate",
            name: "Date Effet",
            field: "bkh_effdate",
            sortable: true,
            filterable: true,
            width:120,
            type: FieldType.dateIso,
            
          }, 
          {
            id: "bkh_amt",
            name: "Montant",
            field: "bkh_amt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.decimal,
            minWidth: 100,
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
            
          }, 
          {
            id: "bkh_1000",
            name: "Billet 1000",
            field: "bkh_1000",
            sortable: true,
            filterable: true,
            type: FieldType.number,
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
            params: { minDecimal: 2, maxDecimal: 2 }, 
            headerCssClass: 'text-right',
            cssClass: 'text-right'
          },
         
          {
            id: "bkh_cheque",
            name: "Cheque",
            field: "bkh_cheque",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.decimal,
            params: { minDecimal: 2, maxDecimal: 2 }, 
            headerCssClass: 'text-right',
            cssClass: 'text-right'
          },
         
      ]

      this.gridOptions = {
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
    
   
  
      handleSelectedRowsChangedbank(e, args) {
        const controls = this.soForm.controls;
        if (Array.isArray(args.rows) && this.gridObjbank) {
          args.rows.map((idx) => {
            const item = this.gridObjbank.getDataItem(idx);
            controls.bank.setValue(item.bk_code || "");
                  
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

        console.log(this.MntCheque,this.MntDep)
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
        doc.addImage(img, "png", 165, 1, 50, 30);
        doc.setFontSize(9);
        if (this.domain.dom_name != null) {
          doc.text(this.domain.dom_name, 10, 10);
        }
        if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
        if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
        if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
        doc.setFontSize(14);
        doc.text("Recette de la Caisse   :" + controls.bank.value , 70, 40);
        doc.setFontSize(12);
        
        doc.text("Date Début : " + date,30, 50);
        doc.text("Date Fin      : " + date1, 100, 50);
        
        doc.setFontSize(10);
       
    doc.setFontSize(10);
    doc.line(5, 55, 205, 55);
    // doc.line(5, 55, 205, 55);
    // doc.line(5, 55, 205, 55);
    doc.line(5, 60, 205, 60);
    doc.line(5, 55, 5, 60);
    doc.text("Date", 7.5, 58.5);
    doc.line(27, 55, 27, 60);
    doc.text("Recette", 44, 58.5);
    doc.line(80, 55, 80, 60);
    doc.text("Bon", 90, 58.5);
    doc.line(120, 55, 120, 60);
    doc.text("Chèque", 133, 58.5);
    doc.line(160, 55, 160, 60);
    doc.text("Montant Espece", 173, 58.5);
    doc.line(205, 55, 205, 60);
    

    doc.line(295, 55, 295, 60);
       
        var i = 65;
        doc.setFontSize(10);
        let total = 0
        let te = 0
        let m =1
        let bool = false
        for (let j = 0; j < this.dataset.length; j++) {
          let esp = this.dataset[j].bkh_amt - this.dataset[j].bkh_cheque - this.dataset[j].bkh_bon
          let tesp =  String(  Number(esp).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }))
       //   console.log(mts)
          let ttesp = replaceAll(tesp,","," ")
        
          let mts =  String(  Number(this.dataset[j].bkh_amt).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }))
       //   console.log(mts)
          let mnt = replaceAll(mts,","," ")
         // console.log(mnsolde)
        //  m = m + 1
        
          if (j % 45 == 0 && j != 0) {
         
            doc.addPage();
             img.src = "./assets/media/logos/companylogo.png";
            doc.addImage(img, "png", 165, 1, 50, 30);
            doc.setFontSize(10);
            if (this.domain.dom_name != null) {
              doc.text(this.domain.dom_name, 10, 10);
            }
            if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
            if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
            if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
       
            i = 55;
            doc.setFontSize(10);
         
        }
        
         
            doc.line(5, i - 5, 5, i);
            doc.text(String(this.dataset[j].bkh_effdate), 7.5, i - 1);
            doc.line(27, i - 5, 27, i);
            doc.text(mnt, 78, i - 1,{ align: "right" });
            doc.line(80, i - 5, 80, i);
            
            doc.text(String(this.dataset[j].bkh_bon), 118, i - 1,{ align: "right" });
            doc.line(120, i - 5, 120, i);
            doc.text(String(this.dataset[j].bkh_cheque), 158, i - 1,{ align: "right" });
            doc.line(160, i - 5, 160, i);
            doc.text(ttesp, 203, i - 1,{ align: "right" });
            doc.line(205, i - 5, 205, i);
          
             
            i = i + 5;
            total = total + Number(this.dataset[j].bkh_amt)
            te = te + esp
           }
           doc.line(5, i-5, 205, i-5);

           let ttecq =  String(  Number(te).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }))
          let ttespece = replaceAll(ttecq,","," ")
       //   console.log(mts)



       //   console.log(mts)


            doc.line(120, i - 5, 120, i);
            doc.text("Total ", 158, i - 1,{ align: "right" });
            doc.line(160, i - 5, 160, i);
            doc.text(ttespece, 203, i - 1,{ align: "right" });
            doc.line(205, i - 5, 205, i);
            doc.line(120, i, 205, i);
            i = i + 5;
    

        var blob = doc.output("blob");
        window.open(URL.createObjectURL(blob));
      }
  
}
