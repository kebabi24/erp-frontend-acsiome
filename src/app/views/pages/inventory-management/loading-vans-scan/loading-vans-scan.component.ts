import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig,NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"


// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  EditorValidator,
  EditorArgs,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of, Observer } from "rxjs"
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

import { InventoryManagementService, printInventory  , InventoryTransactionService, ItemService, LoadRequestService} from "../../../../core/erp"
import * as _ from "lodash";
import jsPDF from "jspdf";
import { toJSDate } from "@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar";

@Component({
  selector: 'kt-loading-vans',
  templateUrl: './loading-vans-scan.component.html',
  styleUrls: ['./loading-vans-scan.component.scss']
})
export class LoadingVansScanComponent implements OnInit {

  chargeForm: FormGroup
  productLotForm:FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

  
  role : any
  load_request_code : any
  roles: any[] = []
  loadRequests: any[] = []
  loadRequestData: any[] = []
  loadRequest : any 
  lots: any[] = []
  selectedLotsIndexes: any[] = []
  selected_lot_code :any 
  scanned_codes  : any[] = []
  filteredData: any[] = []

  printLines:any[] = []

  


  // GRID
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  showSpinner : Boolean =  false;
  loadRequestInfo : any;
  userInfo : any;
  role_code:any ="";
  username : any ="";
  


  constructor(
      config: NgbDropdownConfig,
      private tagFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private inventoryManagementService: InventoryManagementService,
      private inventoryTransactionService: InventoryTransactionService,
      private loadRequestService: LoadRequestService,
      private itemService : ItemService,
      private modalService: NgbModal
  ) {
      config.autoClose = true
      this.prepareGrid()
  }
  ngOnInit(): void {
      this.loading$ = this.loadingSubject.asObservable()
      this.loadingSubject.next(false)
      this.createForm()
  }

  //create form
  createForm() {
      this.loadingSubject.next(false)

      this.chargeForm = this.tagFB.group({
        load_request_code:[this.load_request_code],
        pal :[],
        print: [true],
      })
  }

  time = new Observable<string>((observer: Observer<string>) => {
    setInterval(() => {
      observer.next("");
    }, 1000);
  });


  //reste form
  reset() {
      this.createForm()
      this.hasFormErrors = false
  }
  // save data
  onSubmit() {
     const details = []
     const lines = []


     const data= _.mapValues(_.groupBy(this.dataset, 'code_prod'));
     for (const [key, value] of Object.entries(data)) {
     this.filteredData.push({
          prod: key , 
          rows : value 
      })
     }
     this.filteredData.forEach(product => {

        
      const filteredByLot= _.mapValues(_.groupBy(product.rows, 'lot'));
      for (const [key, value] of Object.entries(filteredByLot)) {

        details.push({
          product_code:value[0].code_prod,
          load_request_code :this.load_request_code, 
          lot : key,
          qt_effected : value.length,
          pt_price :value[0].price,
        })
      }

      
          product.rows.forEach(lot =>{

           lines.push({
            "product_code":product.prod,
            "load_request_code":this.load_request_code,
            "qt_effected": product.rows.length 
          })
          
        }) 
       
     })
      
      

    this.inventoryManagementService.createLoadRequestDetails(details,lines).subscribe(

       (response: any) => {
        const controls = this.chargeForm.controls;
        if(controls.print.value == true){
          this.printpdf()
        }
         
         this.loadRequestData = []
         this.dataset = []
         this.username =""
         this.load_request_code = ""
         this.role_code = ""
       },
       (error) => {
         // this.loadRequestData = []
         console.log(error)
       },
       () => {
         this.layoutUtilsService.showActionNotification(
             "Load Request Details Updated",
             MessageType.Create,
             10000,
             true,
             true
         )
         this.loadingSubject.next(false)
         // this.router.navigateByUrl("/customers-mobile/cluster-create")
     }
     )
     
  }

  onSaveCharge(){ 
    const details = []
     const lines = []


     const data= _.mapValues(_.groupBy(this.dataset, 'code_prod'));
     for (const [key, value] of Object.entries(data)) {
     this.filteredData.push({
          prod: key , 
          rows : value 
      })
     }
     this.filteredData.forEach(product => {

        
      const filteredByLot= _.mapValues(_.groupBy(product.rows, 'lot'));
      for (const [key, value] of Object.entries(filteredByLot)) {

        details.push({
          product_code:value[0].code_prod,
          load_request_code :this.load_request_code, 
          lot : key,
          qt_effected : value.length,
          pt_price :value[0].price,
        })
      }

      
          product.rows.forEach(lot =>{

           lines.push({
            "product_code":product.prod,
            "load_request_code":this.load_request_code,
            "qt_effected": product.rows.length 
          })
          
        }) 
       
     })
  
     this.inventoryManagementService.createLoadRequestDetailsUpdateStatus(details,lines, this.load_request_code).subscribe(

      (response: any) => {
        const controls = this.chargeForm.controls;
        if(controls.print.value == true){
          this.printpdf()
        }
        this.loadRequestData = []
        this.dataset = []
        this.username =""
        this.load_request_code = ""
        this.role_code = ""

      },
      (error) => {
        // this.loadRequestData = []
        console.log(error)
      },
      () => {
        this.layoutUtilsService.showActionNotification(
            "Load Request Details Updated",
            MessageType.Create,
            10000,
            true,
            true
        )
        this.loadingSubject.next(false)
        // this.router.navigateByUrl("/customers-mobile/cluster-create")
    }
    ) 
    
  }
  
  goBack() {
      this.loadingSubject.next(false)
      const url = `/`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
  


  // GRID FUNCTIONS
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  prepareGrid() {
    this.columnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
         onCellClick: (e: Event, args: OnEventArgs) => {
           if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
             this.angularGrid.gridService.deleteItem(args.dataContext);
           }
         },
      },
      {
        id: "line",
        name: "Ligne",
        field: "line",
        minWidth: 80,
        maxWidth: 80,
        type: FieldType.number,
      },

      {
        id: "code_prod",
        name: "Code produit",
        field: "code_prod",
        minWidth: 100,
        maxWidth: 100,
        type: FieldType.text,
      },
     
      {
        id: "desc_prod",
        name: "Description",
        field: "desc_prod",
        minWidth: 200,
        maxWidth: 200,
        type: FieldType.text,
      },
      {
        id: "lot",
        name: "N° Lot",
        field: "lot",
        minWidth: 100,
        maxWidth: 100,
        type: FieldType.text,
      },
      {
        id: "quantity",
        name: "Quantité",
        field: "quantity",
        minWidth: 100,
        maxWidth: 100,
        type: FieldType.text,
      },
      {
        id: "serie",
        name: "N° série",
        field: "serie",
        minWidth: 100,
        maxWidth: 100,
        type: FieldType.text,
      },
   
    ];

    this.gridOptions = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      autoEdit: false,
      autoHeight: true,
      frozenColumn: 0,
      frozenBottom: true,
      enableAutoResize :true,
      // enableRowSelection: true,
      enableCheckboxSelector: true,
    };

    
    this.dataset = [];
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
    this.grid.invalidate();
    this.grid.render();
  }

  onScanLoadRequest(){
    const controls = this.chargeForm.controls;
    this.load_request_code = controls.load_request_code.value
    this.loadRequestService.getLoadRequestInfo(this.load_request_code).subscribe(

      (response: any) => {
        console.log(response)
        this.loadRequestInfo = response.data.loadRequest
        this.userInfo = response.data.userMobile
        this.role_code  = response.data.loadRequest.role_code
        this.username  = response.data.userMobile.username
        
      },)
  }

  onScanPal(){
    const controls = this.chargeForm.controls;
    if(controls.load_request_code.value ===""){
      alert("Scannez une demande de chargement et réessayez")
      return
    }
    let code_start_pos = 0 , code_length = 6 ; 
    let lot_start_pos = 6 , lot_length= 3; 
    let serie_start_pos = 9, serie_length = 5 ; 
    let pal = controls.pal.value

    
    // CHECK IF THE CODE WAS SCANNED BEFORE 
    let index = this.scanned_codes.indexOf(pal)
    if(index != -1){
      alert("Cette palette a déjà été scannée")
      controls.pal.setValue("")
      return;
    }
    
    this.scanned_codes.push(pal)
    let prod = pal.substring(code_start_pos , code_start_pos+code_length  )
    let lot = pal.substring(lot_start_pos , lot_start_pos+lot_length  ) // stop at 8 
    let serie = pal.substring(serie_start_pos , serie_start_pos+serie_length )
    
    this.itemService.getByOne({pt_part :prod }).subscribe((response: any) => {
      let desc = response.data.pt_desc1
      let price = response.data.pt_price
      this.gridService.addItem(
        {
          id: this.dataset.length + 1,
          line: this.dataset.length + 1,
          code_prod: prod,
          desc_prod:desc,
          lot: lot,
          quantity:1,
          serie :serie,
          price:price,
        },
        { position: "bottom" }
      );

      this.printLines.push({
        id: this.dataset.length + 1,
        code_prod: prod,
        desc_prod:desc,
        price:price,
        quantity:1,
      })
    });
    controls.pal.setValue("")
  }


  printpdf() {
    let filteredData = []
    const data = _.mapValues(_.groupBy(this.printLines, 'code_prod'));
    for (const [key, value] of Object.entries(data)) {
      filteredData.push({
          prod: key , 
          occurences : value 
      })
    } 
    this.printLines = []
    let k = 1 
    filteredData.forEach(prod=>{
      this.printLines.push({
        line : k , 
        product_code : prod.prod,
        product_name:prod.occurences[0].desc_prod,
        pt_price:prod.occurences[0].price,
        qt_request:prod.occurences.length,
        qt_validated:prod.occurences.length,
        qt_effected:prod.occurences.length,

      })
      k++;
    })

    
  
  
    var doc = new jsPDF();
    let initialY = 65
    let valueToAddToX = 5
  
    var img = new Image()
    img.src = "./assets/media/logos/companylogo.png";
    doc.addImage(img, 'png', 150, 5, 50, 30)
    doc.setFontSize(9);
  
    // if (this.domain.dom_name != null) {
    //   doc.text(this.domain.dom_name, 10, 10);
    // }
    // if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
    // if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
    // if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
    doc.setFontSize(14);
  
    doc.line(10, 35, 200, 35);
    doc.setFontSize(12);
  
  
         doc.barcode(this.load_request_code, {
          fontSize: 70,
          textColor: "#000000",
          x: 100,
          y: 60,
          textOptions: { align: "center" } // optional text options
        })
  
        doc.setFont("Times-Roman");
         
         
  
         doc.setFontSize(12);
         doc.text("Demande de chargement : " + this.load_request_code, 70, initialY+5);
         
  
         doc.setFontSize(10);
         doc.text("Role    : " + this.role_code, 20, initialY+10);
         doc.text("Date    : " + this.loadRequestInfo.date_creation, 20,initialY+15);
         doc.text("Vendeur : " + this.userInfo.user_mobile_code +' - '+this.username, 20, initialY+20);
         doc.setFontSize(9);
    
  
         doc.line(10, initialY+25, 195, initialY+25 ); // 85
         doc.line(10, initialY+30, 195, initialY+30);  // 90
         doc.line(10, initialY+25, 10,initialY+30);  // 90 
         doc.text("N", 12.5,initialY+28.5);  // 88.5
         doc.line(20, initialY+25, 20, initialY+30);  // 90
         doc.text("Code Article", 25, initialY+28.5); // 88.5
         doc.line(45, initialY+25, 45, initialY+30); // 90
         doc.text("Désignation", 67.5, initialY+28.5); // 88.5
         doc.line(100, initialY+25, 100, initialY+30); // 90
         doc.text("Prix", 107, initialY+28.5); // 88.5
         doc.line(120, initialY+25, 120, initialY+30);  // 90
         doc.text("QTE Demandée", 123, initialY+28.5); // 88.5
         doc.line(145, initialY+25, 145, initialY+30); // 90
         doc.text("QTE Validée", 148, initialY+28.5 );// 88.5
         doc.line(170, initialY+25, 170,initialY+30);// 90
         doc.text("QTE Chargée", 173, initialY+28.5 );// 88.5
         doc.line(195, initialY+25, 195, initialY+30);// 90
         var i = 95 + valueToAddToX;
         doc.setFontSize(10);
  
     for (let j = 0; j < this.dataset.length  ; j++) {
      
      
       if ((j % 30 == 0) && (j != 0) ) {
         doc.addPage();
         img.src = "./assets/media/logos/companylogo.png";
         doc.addImage(img, 'png', 150, 5, 50, 30)
         doc.setFontSize(9);
        //  if (this.domain.dom_name != null) {
        //    doc.text(this.domain.dom_name, 10, 10);
        //  }
        //  if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
        //  if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
        //  if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
         doc.setFontSize(14);
         doc.line(10, 35, 200, 35);
  
         
         
         doc.setFontSize(12);
         doc.text(this.load_request_code, 70, 40);
         doc.setFontSize(8);
  
        
         doc.setFontSize(12);
         doc.text("Demande de chargement : " + this.load_request_code, 70, 60);
         doc.setFontSize(8);
  
         doc.setFontSize(8);
         doc.text("Role    : " + this.role_code, 20, 70);
         doc.text("Date    : " + this.loadRequestInfo.date_creation, 20, 75);
         doc.text("Vendeur : " + this.userInfo.user_mobile_code +' - '+this.username, 20, 80);
  
         doc.line(10, initialY+25, 195, initialY+25 ); // 85
         doc.line(10, initialY+30, 195, initialY+30);  // 90
         doc.line(10, initialY+25, 10,initialY+30);  // 90 
         doc.text("N", 12.5,initialY+28.5);  // 88.5
         doc.line(20, initialY+25, 20, initialY+30);  // 90
         doc.text("Code Article", 25, initialY+28.5); // 88.5
         doc.line(45, initialY+25, 45, initialY+30); // 90
         doc.text("Désignation", 67.5, initialY+28.5); // 88.5
         doc.line(100, initialY+25, 100, initialY+30); // 90
         doc.text("Prix", 107, initialY+28.5); // 88.5
         doc.line(120, initialY+25, 120, initialY+30);  // 90
         doc.text("QTE Demandée", 123, initialY+28.5); // 88.5
         doc.line(145, initialY+25, 145, initialY+30); // 90
         doc.text("QTE Validée", 148, initialY+28.5 );// 88.5
         doc.line(170, initialY+25, 170,initialY+30);// 90
         doc.text("QTE Chargée", 173, initialY+28.5 );// 88.5
         doc.line(195, initialY+25, 195, initialY+30);// 90
         var i = 95 + valueToAddToX;
       }
  
       if (this.printLines[j].product_name.length > 35) {
         doc.setFontSize(8);
  
  
          let line = this.printLines[j]
  
          let desc1 = line.product_name.substring(0,34);
          let ind = desc1.lastIndexOf(" ");
          desc1 = line.product_name.substring(0,ind);
          let desc2 = line.product_name.substring(ind +1);
  
         
          doc.line(10, i - 5, 10, i);
          doc.text(String(line.line), 12.5, i - 1);
          doc.line(20, i - 5, 20, i);
          doc.text(line.product_code, 25, i - 1);
          doc.line(45, i - 5, 45, i);
          doc.text(desc1, 47, i - 1);
          doc.line(100, i - 5, 100, i);
          doc.text(String(line.pt_price), 118, i - 1, { align: "right" });
          doc.line(120, i - 5, 120, i);
          doc.text(String(line.qt_request), 143, i - 1 , { align: "right" });
          doc.line(145, i - 5, 145, i);
          doc.text(String(line.qt_validated), 168, i - 1, { align: "right" });
          doc.line(170, i - 5, 170, i);
          doc.text(String(line.qt_effected), 193, i - 1, { align: "right" });
          doc.line(195, i - 5, 195, i);
          
  
          i = i + 5;
  
          doc.text(desc2, 47, i - 1);
  
          doc.line(10, i - 5, 10, i);
          doc.line(20, i - 5, 20, i);
          doc.line(45, i - 5, 45, i);
          doc.line(100, i - 5, 100, i);
          doc.line(120, i - 5, 120, i);
          doc.line(145, i - 5, 145, i);
          doc.line(170, i - 5, 170, i);
          doc.line(195, i - 5, 195, i);
    
          i = i + 5;
       } else {
          doc.setFontSize(8);
          let line = this.printLines[j]
          doc.line(10, i - 5, 10, i);
          doc.text(String(line.line), 12.5, i - 1);
          doc.line(20, i - 5, 20, i);
          doc.text(line.product_code, 25, i - 1);
          doc.line(45, i - 5, 45, i);
          doc.text(line.product_name, 47, i - 1);
          doc.line(100, i - 5, 100, i);
          doc.text(String(line.pt_price), 118, i - 1 , { align: "right" });
          doc.line(120, i - 5, 120, i);
          doc.text(String(line.qt_request), 143, i - 1 , { align: "right" });
          doc.line(145, i - 5, 145, i);
          doc.text(String(line.qt_validated), 168, i - 1 , { align: "right" });
          doc.line(170, i - 5, 170, i);
          doc.text(String(line.qt_effected), 193, i - 1 , { align: "right" });
          doc.line(195, i - 5, 195, i);
          i = i + 5;
        }
        doc.line(10, i - 5, 195, i - 5);
     }
  
      doc.line(10, i - 5, 195, i - 5);
    
     
    
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
  }
  
}