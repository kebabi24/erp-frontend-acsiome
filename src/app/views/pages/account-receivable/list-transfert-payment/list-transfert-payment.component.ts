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

import { BankService} from "../../../../core/erp"

import { jsPDF } from "jspdf";
import { isNull } from "lodash"

const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';

@Component({
  selector: 'kt-list-transfert-payment',
  templateUrl: './list-transfert-payment.component.html',
  styleUrls: ['./list-transfert-payment.component.scss']
})
export class ListTransfertPaymentComponent implements OnInit {

 
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  dataView: any;
  
  angularGrid: AngularGridInstance;

  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  gridObj: any;
  //dataviewObj: any;
soForm: FormGroup;
  tr:any
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private soFB: FormBuilder,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private bankService: BankService,
      
  ) {
      //this.prepareGrid()
  }

  ngOnInit(): void {
    this.createForm();
    this.prepareGrid()
    this.solist();
  }

  createForm() {
    // this.loadingSubject.next(false);
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
    this.bankService.getBKHRCTBy(obj).subscribe(
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
          // {
          //   id: "bkh_num_doc",
          //   name: "N° Document",
          //   field: "bkh_num_doc",
          //   sortable: true,
          //   filterable: true,
          //   type: FieldType.string,
          // },
          {
            id: "bkh_code",
            name: "N° Bon",
            field: "bkh_code",
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
          },
          {
            id: "bkh_bank",
            name: "Code Banque",
            field: "bkh_bank",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "bkh_effdate",
            name: "Date Effet",
            field: "bkh_effdate",
            sortable: true,
            filterable: true,
            type: FieldType.dateIso,
            
          }, 
         
          {
            id: "bkh_balance",
            name: "Balance",
            field: "bkh_balance",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.decimal,
            params: { minDecimal: 2, maxDecimal: 2 }, 
            
          }, 
         
          {
            id: "bkh_amt",
            name: "Montant",
            field: "bkh_amt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.decimal,
            params: { minDecimal: 2, maxDecimal: 2 }, 
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
            
            
          }, 
          {
            id: "bkh_0500",
            name: "Billet 500",
            field: "bkh_0500",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          }, 
          {
            id: "bkh_0200",
            name: "Billet 200",
            field: "bkh_0200",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          },
          {
            id: "bkh_p200",
            name: "Piéce 200",
            field: "bkh_p200",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          },
          {
            id: "bkh_p100",
            name: "Piéce 100",
            field: "bkh_p100",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          },
          {
            id: "bkh_p050",
            name: "Piéce 50",
            field: "bkh_p050",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          },
          {
            id: "bkh_p020",
            name: "Piéce 20",
            field: "bkh_p020",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          },
          {
            id: "bkh_p010",
            name: "Piéce 10",
            field: "bkh_p010",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          },
          {
            id: "bkh_p005",
            name: "Piéce 5",
            field: "bkh_p005",
            sortable: true,
            filterable: true,
            type: FieldType.number,

            
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
            params: { minDecimal: 2, maxDecimal: 2 }, 
          },
          {
            id: "chr03",
            name: "Récap",
            field: "chr03",
            sortable: true,
            filterable: true,
            type: FieldType.number,
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
              this.bankService.getBKHBy({bkh_code:index,bkh_type : "RCT"}).subscribe(
                          (response: any) => (this.tr = response.data[0],
                            
                            this.printpdf()
                            ),
                          (error) => {
                             this.tr=null
                          },
                          () => {}
                      )
             
                
            }
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
            
            
          }, 
          {
            id: "bkh_0500",
            name: "Billet 500",
            field: "bkh_0500",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          }, 
          {
            id: "bkh_0200",
            name: "Billet 200",
            field: "bkh_0200",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          },
          {
            id: "bkh_p200",
            name: "Piéce 200",
            field: "bkh_p200",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          },
          {
            id: "bkh_p100",
            name: "Piéce 100",
            field: "bkh_p100",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          },
          {
            id: "bkh_p050",
            name: "Piéce 50",
            field: "bkh_p050",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          },
          {
            id: "bkh_p020",
            name: "Piéce 20",
            field: "bkh_p020",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          },
          {
            id: "bkh_p010",
            name: "Piéce 10",
            field: "bkh_p010",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          },
          {
            id: "bkh_p005",
            name: "Piéce 5",
            field: "bkh_p005",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          },
          {
            id: "bkh_bon",
            name: "Bon",
            field: "bkh_bon",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
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
            type: FieldType.number,
          },
          {
            id: "chr03",
            name: "Récap",
            field: "chr03",
            sortable: true,
            filterable: true,
            type: FieldType.number,
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
              this.bankService.getBKHBy({bkh_code:index,bkh_type : "RCT"}).subscribe(
                          (response: any) => (this.tr = response.data[0],
                            
                            this.printpdf()
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
        
          createPreHeaderPanel: true,
          showPreHeaderPanel: true,
          preHeaderPanelHeight: 40,
          enableAutoResizeColumnsByCellContent:true,
          enableAutoSizeColumns:true,
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
//       this.bankService.getTransfertBy().subscribe(
//           (response: any) => (this.dataset = response.data),
//           (error) => {
//               this.dataset = []
//           },
//           () => {}
//       )
// console.log(this.dataset)
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

    
      const date = new Date(this.tr.bkh_effdate)
      doc.setFontSize(14);

      
      doc.setFont("Times-Roman");

      doc.text("Bon N° : " + this.tr.bkh_code + "   " + "Duplicata", 20, initialY + 5);

      doc.setFontSize(9);
      doc.text("Caisse    : " + this.tr.chr02 + " "  , 5, initialY + 10);
      doc.text("A           : " + this.tr.bkh_bank + " "  , 5 , initialY + 15);
      doc.text("Vider Le  : " + String(date.getFullYear())+"/" + String(date.getMonth() + 1) + "/" + String(date.getDate()) + " " +  date.toLocaleTimeString(), 5, initialY + 20);
      if(this.tr.chr03 != null) {
      doc.text("Récap    : " + this.tr.chr03  , 5, initialY + 25);
      }
      // doc.text("Vendeur : " + this.tr.user_mobile_code + " - " + this.tr.username, 5, initialY + 20);
  //    doc.text("Valeur : " + Number(total * 1.2019).toFixed(2) + " DZD", 65, initialY + 20);
      doc.setFontSize(9);

 var i = 40

    

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
         doc.text("Total Transfert"  , 4, i+95 ) ; doc.text( String(Number(this.tr.bkh_amt).toFixed(2)),45,i+ 95); 
         
        //  doc.text("Nouveau Solde Caisse"  , 4, i+80 ) ; doc.text( String(Number((Number(this.solde) - Number(this.tr.montant_tr))).toFixed(2)),45,i+ 80); 
         

        var blob = doc.output("blob");
        window.open(URL.createObjectURL(blob));   
      }
}
