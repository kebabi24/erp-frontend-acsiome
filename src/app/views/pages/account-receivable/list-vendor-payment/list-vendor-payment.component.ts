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

const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';

@Component({
  selector: 'kt-list-vendor-payment',
  templateUrl: './list-vendor-payment.component.html',
  styleUrls: ['./list-vendor-payment.component.scss']
})
export class ListVendorPaymentComponent implements OnInit {

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
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private soFB: FormBuilder,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private bankService: BankService,
      private roleService : RoleService,
      
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
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
  
    const date1 = controls.calc_date1.value
    ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
    : null;
   
    let obj= {date,date1}
    this.bankService.getBKHTrBy(obj).subscribe(
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
            name: "Vendeur",
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
            id: "bkh_bank",
            name: "Code Banque",
            field: "bkh_bank",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'bkh_bank',
              formatter: (g) => `Caisse: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
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
            id: "bkh_balance",
            name: "Balance",
            field: "bkh_balance",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.decimal,
            minWidth:120,
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
            type: FieldType.float,
            formatter: Formatters.decimal,
            minWidth: 100,
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
          {
            id: "id",
            field: "id",
            excludeFromHeaderMenu: true,
            formatter: (row, cell, value, columnDef, dataContext) => {
              // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
              return `
                <a class="btn btn-sm btn-clean btn-icon mr-2" title="Impression Etiquette">
                     <i class="flaticon2-printer"></i>
                     
                 </a>
                 `;
            },
            minWidth: 30,
            maxWidth: 30,
            onCellClick: (e: Event, args: OnEventArgs) => {
              const index = args.dataContext.bkh_code;
              console.log(index)
              this.bankService.getBKHBy({bkh_code:index,bkh_type : "P"}).subscribe(
                          (response: any) => (this.tr = response.data[0],
                            this.roleService.getByOne({ role_code: this.tr.chr01 }).subscribe((res: any) => {
                              this.role = res.data
                            
                            this.printpdf()
                             })
                            ),
                          (error) => {
                             this.tr=null
                          },
                          () => {}
                      )
             
                
            }
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
   
    printpdf() {
     
      var doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [100,150]
        })
        let initialY = 5;
        doc.setLineWidth(0.2);
      
      var img = new Image();
      // img.src = "companylogo.png";
      // doc.addImage(img, "png", 150, 5, 50, 30);
      doc.setFontSize(14);

      const date1 = new Date(this.tr.bkh_effdate)
      const date = new Date()
      doc.setFontSize(14);

      
      doc.setFont("Times-Roman");

      doc.text("Bon N° : " + this.tr.bkh_code + "   " + "Duplicata", 20, initialY + 5);

      doc.setFontSize(9);
      doc.text("Role    : " + this.tr.chr01 + " "+ this.role.role_name, 5, initialY + 10);
      doc.text("Date Effet    : " + String(date1.getFullYear())+"/" + String(date1.getMonth() + 1) + "/" + String(date1.getDate()) , 5, initialY + 15);
      doc.text("Date Impression  : " + String(date.getFullYear())+"/" + String(date.getMonth() + 1) + "/" + String(date.getDate()) + " " +  date.toLocaleTimeString(), 5, initialY + 20);
   //   doc.text("Vendeur : " + controls.user_mobile_code.value + " - " + controls.username.value, 5, initialY + 20);
  //    doc.text("Valeur : " + Number(total * 1.2138).toFixed(2) + " DZD", 65, initialY + 20);
      doc.setFontSize(9);

 var i = 35

    

      //   doc.line(2, i - 5, 2, i);
         doc.text("Billet 2000"  , 4, i ); doc.text( String(Number(this.tr.bkh_2000)),20,i); doc.text( String(Number(this.tr.bkh_2000)* 2000),40,i); 
         doc.text("Billet 1000"  , 4, i+5 ); doc.text( String(Number(this.tr.bkh_1000)),20,i+5); doc.text( String(Number(this.tr.bkh_1000)* 1000),40,i+5);              
         doc.text("Billet 500"   , 4, i+10 ); doc.text( String(Number(this.tr.bkh_0500)),20,i+10); doc.text( String(Number(this.tr.bkh_0500)* 500),40,i+10);
         doc.text("Billet 200"  , 4, i+15 ); doc.text( String(Number(this.tr.bkh_0200)),20,i+15); doc.text( String(Number(this.tr.bkh_0200)* 200),40,i+ 15); 

         doc.text("Total Billet "  , 4, i+25 ); doc.text( String(Number(this.tr.bkh_2000)* 2000 + Number(this.tr.bkh_1000)* 1000+ Number(this.tr.bkh_0500)* 500 + Number(this.tr.bkh_0200)* 200),40,i+ 25); 

         doc.text("Piéce  200"  , 4, i +35  ); doc.text( String(Number(this.tr.bkh_p200)),20,i+35); doc.text( String(Number(this.tr.bkh_p200)* 200),40,i+35); 
         doc.text("Piéce  100"  , 4, i+40 ); doc.text( String(Number(this.tr.bkh_p100)),20,i+40); doc.text( String(Number(this.tr.bkh_p100)* 100),40,i+40);              
         doc.text("Piéce  50"   , 4, i+45 ); doc.text( String(Number(this.tr.bkh_p050)),20,i+45); doc.text( String(Number(this.tr.bkh_p050)* 50),40,i+45);
         doc.text("Piéce  20"  , 4, i+50 ); doc.text( String(Number(this.tr.bkh_p020)),20,i+50); doc.text( String(Number(this.tr.bkh_p020)* 20),40,i+ 50); 
         doc.text("Piéce  10"  , 4, i+55 ); doc.text( String(Number(this.tr.bkh_p010)),20,i+55); doc.text( String(Number(this.tr.bkh_p010)* 10),40,i+ 55); 
         doc.text("Piéce  5"  , 4, i+60 ); doc.text( String(Number(this.tr.bkh_p005)),20,i+60); doc.text( String(Number(this.tr.bkh_p005)* 5),40,i+ 60); 
         
         doc.text("Total Monnaie "  , 4, i+70 ); doc.text( String(Number(this.tr.bkh_p200)* 200 + Number(this.tr.bkh_p100)* 100 + Number(this.tr.bkh_p050)* 50 + Number(this.tr.bkh_p020)* 20 + Number(this.tr.bkh_p010)* 10 + Number(this.tr.bkh_p005)* 5 ),40,i+ 70); 

         
         doc.text("Bon"  , 4, i+80 ) ; doc.text( String(Number(this.tr.bkh_bon)),40,i+ 80); 

         doc.text("Cheque"  , 4, i+85 ) ; doc.text( String(Number(this.tr.bkh_cheque)),40,i+ 85); 
         
         doc.setFontSize(14);
         doc.setFont("Times-Roman-bold");
         doc.text("Total Versement"  , 4, i+95 ) ; doc.text( String(Number(this.tr.bkh_amt).toFixed(2)),45,i+ 95); 
      
         
         doc.text("Nouveau Solde"  , 4, i+100 ) ; doc.text( String(Number(this.role.solde).toFixed(2)),45,i+ 100); 
         

        var blob = doc.output("blob");
        window.open(URL.createObjectURL(blob));   
      }


      bkhlist() {
        this.data = []
   
    const controls = this.soForm.controls
    const date = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
  
    const date1 = controls.calc_date1.value
    ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
    : null;
   
    let obj= {date,date1}
    this.bankService.getBKHTrGrp(obj).subscribe(
      (response: any) => {   
        this.data = response.data.bkhs
        this.MntCheque = Number(response.data.cheque)
        this.MntDep = Number(response.data.depence)
       console.log(this.MntCheque,this.MntDep)
      this.printpdf2()  
         },
      (error) => {
          this.data = []
      },
      () => {}
  )
      }
      printpdf2() {

        console.log(this.MntCheque,this.MntDep)
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
        doc.text("Transaction de Caisse   " , 70, 40);
        doc.setFontSize(12);
        
        doc.text("Date Début : " + date, 20, 60);
        doc.text("Date Fin      : " + date1, 20, 65);
        
        doc.setFontSize(10);
        doc.line(30, 85, 110, 85);
        doc.line(30, 85, 110, 85);
        doc.line(30, 90, 110, 90);
        doc.line(30, 85, 30, 90);
        doc.text("LN", 32.5, 88.5);
        doc.line(40, 85, 40, 90);
        doc.text("Role", 42, 88.5);
        doc.line(70, 85, 70, 90);
        doc.text("Montant", 72, 88.5);
        doc.line(110, 85, 110, 90);
       
        var i = 95;
        doc.setFontSize(10);
        let total = 0
        for (let j = 0; j < this.data.length; j++) {
          let mts =  String(  Number(this.data[j].Montant).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }))
       //   console.log(mts)
          let mnt = replaceAll(mts,","," ")
         // console.log(mnsolde)
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
            doc.text("Transaction de Caisse   " , 70, 40);
            doc.setFontSize(12);
            
            doc.text("Date Début : " + date, 20, 60);
            doc.text("Date Fin      : " + date1, 20, 65);
            
            doc.setFontSize(10);
            doc.line(30, 85, 110, 85);
            doc.line(30, 85, 110, 85);
            doc.line(30, 90, 110, 90);
            doc.line(30, 85, 30, 90);
            doc.text("LN", 32.5, 88.5);
            doc.line(40, 85, 40, 90);
            doc.text("Role", 42, 88.5);
            doc.line(70, 85, 70, 90);
            doc.text("Montant", 72, 88.5);
            doc.line(110, 85, 110, 90);
           
            i = 95;
            doc.setFontSize(10);
          }
    
         
            doc.line(30, i - 5, 30, i);
            doc.text(String("00" + j).slice(-2), 32.5, i - 1);
            doc.line(40, i - 5, 40, i);
            doc.text(this.data[j].chr01, 45, i - 1);
            doc.line(70, i - 5, 70, i);
            doc.text(mnt, 108, i - 1,{ align: "right" });
            doc.line(110, i - 5, 110, i);
          //   doc.text(String(this.data[j].bkh_addr), 72, i - 1);
          //   doc.line(95, i - 5, 95, i);
          //  if(this.data[j].chr01 != null) { doc.text(this.data[j].chr01, 97, i - 1);} else {doc.text(this.data[j].bkh_addr, 97, i - 1)}
          //   doc.line(120, i - 5, 120, i);
          //   doc.text(String((this.data[j].bkh_type)), 122, i - 1 );
          //   doc.line(130, i - 5, 130, i);
          //   doc.text(String(this.data[j].bkh_effdate) , 153, i - 1, { align: "right" });
          //   doc.line(155, i - 5, 155, i);
          //   doc.text(String(Number(this.data[j].bkh_balance).toFixed(2)) , 178, i - 1,{ align: "right" });
          //   doc.line(180, i - 5, 180, i);
          //   doc.text(String(Number(this.data[j].bkh_amt).toFixed(2)), 203, i - 1, { align: "right" });
          //   doc.line(205, i - 5, 205, i);
             
            i = i + 5;
            total = total + Number(this.data[j].Montant)
           }
           doc.line(30, i-5, 110, i-5);

           let ttecq =  String(  Number(total).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }))
       //   console.log(mts)



          let ttec = replaceAll(ttecq,","," ")

           
let tes =  Number(total)  - Number(this.MntCheque)
           let ttes =  String(  Number(tes).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }))
       //   console.log(mts)



          let ttespece = replaceAll(ttes,","," ")

          console.log("this.MntCheque",this.MntCheque)
          let ttch =  String(  Number(this.MntCheque).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }))
       //   console.log(mts)



          let ttcheque = replaceAll(ttch,","," ")


          let ttdep =  String(  Number(this.MntDep).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }))
       //   console.log(mts)



          let ttdepence = replaceAll(ttdep,","," ")

          let ttg = Number(total) - Number(this.MntDep)
          let ttge =  String(  Number(ttg).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }))
       //   console.log(mts)



          let ttgen = replaceAll(ttge,","," ")

          //      let tt =  String(  Number(total).toLocaleString("en-US", {
      //       minimumFractionDigits: 2,
      //       maximumFractionDigits: 2,
      //     }))
      //  //   console.log(mts)



      //     let ttc = replaceAll(tt,","," ")

           doc.line(30, i - 5, 30, i);
           
            // doc.line(40, i - 5, 40, i);
            doc.text("Recette Espece", 35, i - 1);
            doc.line(70, i - 5, 70, i);
            doc.text(ttespece, 108, i - 1,{ align: "right" });
            doc.line(110, i - 5, 110, i);
            doc.line(30, i, 110, i);
            i = i + 5;
    

            doc.line(30, i - 5, 30, i);
           
            //doc.line(40, i - 5, 40, i);
            doc.text("Recette Cheque", 35, i - 1);
            doc.line(70, i - 5, 70, i);
            doc.text(ttcheque, 108, i - 1,{ align: "right" });
            doc.line(110, i - 5, 110, i);
            doc.line(30, i, 110, i);
            i = i + 5;

            doc.line(30, i - 5, 30, i);
           
           // doc.line(40, i - 5, 40, i);
            doc.text("Total Espece/ cheque", 35, i - 1);
            doc.line(70, i - 5, 70, i);
            doc.text(ttecq, 108, i - 1,{ align: "right" });
            doc.line(110, i - 5, 110, i);
            doc.line(30, i, 110, i);
            i = i + 5;

            doc.line(30, i - 5, 30, i);
           
            //doc.line(40, i - 5, 40, i);
            doc.text("Total Depence", 35, i - 1);
            doc.line(70, i - 5, 70, i);
            doc.text(ttdepence, 108, i - 1,{ align: "right" });
            doc.line(110, i - 5, 110, i);
            doc.line(30, i, 110, i);
            i = i + 5;

            doc.line(30, i - 5, 30, i);
           
            //doc.line(40, i - 5, 40, i);
            doc.text("Total Caisse", 35, i - 1);
            doc.line(70, i - 5, 70, i);
            doc.text(ttgen, 108, i - 1,{ align: "right" });
            doc.line(110, i - 5, 110, i);
            doc.line(30, i, 110, i);
            i = i + 5;


            // doc.line(10, i - 5, 200, i - 5);
    
        // window.open(doc.output('bloburl'), '_blank');
        //window.open(doc.output('blobUrl'));  // will open a new tab
        var blob = doc.output("blob");
        window.open(URL.createObjectURL(blob));
      }
  
}
