import { Component, OnInit } from "@angular/core";
// Angular slickgrid
import {
  Column,
  GridOption,
  GridService,
  AngularGridInstance,
  Formatter,
  Formatters,
  Editor,
  Editors,
  FieldType,
  OnEventArgs,
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

import { SaleOrderService , CustomerService, DeviseService} from "../../../../core/erp";
import { RowDetailPreloadComponent } from "../rowDetails/row-details-preload.component";
import { RowDetailViewComponent } from "../rowDetails/rowdetail-view.component";
import { HttpClient } from "@angular/common/http";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap"
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";


@Component({
  selector: 'kt-list-so-ceram',
  templateUrl: './list-so-ceram.component.html',
  styleUrls: ['./list-so-ceram.component.scss']
})
export class ListSoCeramComponent implements OnInit {

 
  loadingSubject = new BehaviorSubject<boolean>(true)
   // slick grid
   columnDefinitions: Column[] = [];
   gridOptions: GridOption = {};
   dataset: any[] = [];
   gridObj: any;
   gridService: GridService;
   dataView: any;
   angularGrid: AngularGridInstance;
 draggableGroupingPlugin: any;    
 idreq:any
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
     private saleOrderService: SaleOrderService,
     private http: HttpClient,
     private modalService: NgbModal,
     private soService: SaleOrderService,
  private customersService: CustomerService,
  private deviseService: DeviseService,
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
     this.dataView = angularGrid.dataView;
     this.gridService = angularGrid.gridService;
   }
   createCode() {
     this.router.navigateByUrl("purchasing/create-req");
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
               <a class="btn btn-sm btn-clean btn-icon mr-2" title="Changer Status">
               <i class="flaticon2-pen"></i>
           </a>
           `;
        },
         minWidth: 50,
         maxWidth: 50,
         // use onCellClick OR grid.onClick.subscribe which you can see down below
         onCellClick: (e: Event, args: OnEventArgs) => {
           const id = args.dataContext.id
           console.log(this.dataset)
       
           this.router.navigateByUrl(`/sales/edit-so/${id}`)
          //  } else {
 
          //    alert("Demande deja approuvee")
          //  }
       },
       },
       {
        id: "delete",
        field: "id",
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: (row, cell, value, columnDef, dataContext) => {
         // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
         return `
              <a class="btn btn-sm btn-clean btn-icon mr-2" title="Suprimer Commande">
              <i class="flaticon-delete
              "></i>
          </a>
          `;
       },
        minWidth: 50,
        maxWidth: 50,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id
        
            this.idreq = args.dataContext.so.so_nbr
            console.log(this.idreq)
            let element: HTMLElement = document.getElementById('deleteDAGrid') as HTMLElement;
            element.click();
        
      },
      },
       {
         id: "id",
         name: "id",
         field: "id",
         sortable: true,
         filterable: true,
         type: FieldType.string,
       },
       
       {
         id: "so_nbr",
         name: "N° Commande",
         field: "so.so_nbr",
         sortable: true,
         filterable: true,
         type: FieldType.string,
       },
       {
         id: "so_ord_date",
         name: "Date Effet",
         field: "so.so_ord_date",
         sortable: true,
         filterable: true,
         type: FieldType.date,
       },
       {
        id: "so_cust",
        name: "Vendeur",
        field: "so.so_cust",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
       {
        id: "chr01",
        name: "Client",
        field: "so.chr01",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
       {
         id: "chr02",
         name: "Tel",
         field: "so.chr01",
         sortable: true,
         filterable: true,
         type: FieldType.string,
       },
       {
         id: "so_amt",
         name: "Montant",
         field: "so.so_amt",
         sortable: true,
         filterable: true,
         type: FieldType.string,
       },
       {
        id: "dec01",
        name: "Montant Versé",
        field: "so.dec01",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "dec02",
        name: "Reste",
        field: "so.dec02",
        sortable: true,
        filterable: true,
        type: FieldType.string,
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
            .getBy({ cm_addr: args.dataContext.so.so_cust })
            .subscribe((res: any) => {this.customer = res.data
  
              this.soService
              .getBy({ so_nbr: args.dataContext.so.so_nbr })
              .subscribe((resp: any) => {
                this.so = resp.data.saleOrder
                this.sodataset = resp.data.details
                
               console.log(this.sodataset)
                this.deviseService.getBy({ cu_curr: this.so.so_curr }).subscribe(
                  (respo: any) => {
                   
              this.curr = respo.data
                this.printpdf(args.dataContext.so.so_nbr)
               
                  })
          })
          })
        
        },
    },
     ];
 
     this.gridOptions = {
       enableSorting: true,
       enableCellNavigation: true,
       enableExcelCopyBuffer: true,
       enableFiltering: true,
       autoEdit: false,
       autoHeight: true,
       dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
         var val = undefined;
         try {
           val = eval("item." + column.field);
         } catch (e) {
           // ignore
         }
         return val;
       },
       enableRowDetailView: true,
       rowSelectionOptions: {
         selectActiveRow: true,
       },
       rowDetailView: {
         // We can load the "process" asynchronously in 2 different ways (httpClient OR even Promise)
         process: (item) => {
           // console.log(this.simulateServerAsyncCall(item));
           return this.simulateServerAsyncCall(item);
         },
 
         // load only once and reuse the same item detail without calling process method
         loadOnce: true,
 
         // limit expanded row to only 1 at a time
         singleRowExpand: true,
 
         // false by default, clicking anywhere on the row will open the detail view
         // when set to false, only the "+" icon would open the row detail
         // if you use editor or cell navigation you would want this flag set to false (default)
         useRowClick: false,
 
         // how many grid rows do we want to use for the row detail panel (this is only set once and will be used for all row detail)
         // also note that the detail view adds an extra 1 row for padding purposes
         // so if you choose 4 panelRows, the display will in fact use 5 rows
         panelRows: 9,
 
         // you can override the logic for showing (or not) the expand icon
         // for example, display the expand icon only on every 2nd row
         // expandableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1),
 
         // Preload View Template
         preloadComponent: RowDetailPreloadComponent,
 
         // ViewModel Template to load when row detail data is ready
         viewComponent: RowDetailViewComponent,
 
         // Optionally pass your Parent Component reference to your Child Component (row detail component)
         parent: this,
       },
       presets: {
        sorters: [
          { columnId: 'so_ord_date', direction: 'DESC' },
         ],
      //    filters: [
      //  { columnId: 'po_nbr', searchTerms: [this.ponbr] }  ,
          
      //   ],
       
      },
     };
 
     // fill the dataset with your data
     this.dataset = [];
     this.saleOrderService.getAllCeram().subscribe(
       (response: any) => {this.dataset = response.data
         console.log(this.dataset)
       this.dataView.setItems(this.dataset)},
       (error) => {
         this.dataset = [];
       },
       () => {}
     );
   }
   simulateServerAsyncCall(item: any) {
     return new Promise((resolve) => {
       const itemDetail = item;
       resolve(itemDetail);
     });
   }

   open(content) {
    this.modalService.open(content, { size: "lg" })
}
deleteDA() {
  let so = null
  this.saleOrderService.delete( this.idreq ).subscribe(
    (reponse: any) => (so = reponse.data),
    
    (error) => {
        this.layoutUtilsService.showActionNotification(
            "Erreur verifier les informations",
            MessageType.Create,
            10000,
            true,
            true
        )
        this.loadingSubject.next(false)
    },
    () => {
      if (so == true) {
        this.layoutUtilsService.showActionNotification(
            "Supression avec succès",
            MessageType.Create,
            10000,
            true,
            true
        )
        this.loadingSubject.next(false)
        this.modalService.dismissAll()
        window.location.reload()
      }
      else {
        alert ("Commande déja Livrée")
      }
      
    }
)
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




  doc.addPage();
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

  doc.text(String(Number(this.so.so_amt).toFixed(2)), 198, i + 12, { align: "right" });
  // doc.text(String(Number(controls.tva.value).toFixed(2)), 198, i + 19, { align: "right" });
  // doc.text(String(Number(controls.timbre.value).toFixed(2)), 198, i + 26, { align: "right" });
  // doc.text(String(Number(controls.ttc.value).toFixed(2)), 198, i + 33, { align: "right" });

  doc.setFontSize(12);
  let mta = NumberToLetters(Number(this.so.so_amt).toFixed(2), "Dinars Algérien");

  if (mt.length > 95) {
    let mt1 = mta.substring(90);
    let ind = mt1.indexOf(" ");

    mt1 = mta.substring(0, 90 + ind);
    let mt2 = mta.substring(90 + ind);

    doc.text("Arretée la présente Commande a la somme de : " + mt1, 20, i + 53);
    doc.text(mt2, 20, i + 60);
  } else {
    doc.text("Arretée la présente Commande a la somme de : " + mta, 20, i + 53);
  }

  // window.open(doc.output('bloburl'), '_blank');
  //window.open(doc.output('blobUrl'));  // will open a new tab
  var blob1 = doc.output("blob");
  window.open(URL.createObjectURL(blob1));
}
 }
 