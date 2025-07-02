import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

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
import { FormGroup, FormBuilder, Validators, NgControlStatus } from "@angular/forms";
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
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import {
  ItemService,
  AddressService,
  InventoryTransaction,
  InventoryTransactionService,
  LocationService,
  SiteService,
  RequisitionService,
  CostSimulationService,
  LocationDetailService,
  InventoryStatusService,
  CodeService,
  SequenceService,
  printBc,
  MesureService,
  printTR,
} from "../../../../core/erp";
import { exit } from "process";
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";


const statusValidator: EditorValidator = (value: any, args: EditorArgs) => {
  // you can get the Editor Args which can be helpful, e.g. we can get the Translate Service from it
  const grid = args && args.grid;
  const gridOptions = (grid && grid.getOptions) ? grid.getOptions() : {};
  const translate = gridOptions.i18n;

  // to get the editor object, you'll need to use "internalColumnEditor"
  // don't use "editor" property since that one is what SlickGrid uses internally by it's editor factory
  const columnEditor = args && args.column && args.column.internalColumnEditor;

  if (value == null || value == undefined || !value.length) {
    return { valid: false, msg: 'This is a required field' };
  } 
  return { valid: true, msg: '' };
};


@Component({
  selector: 'kt-update-price-unp',
  templateUrl: './update-price-unp.component.html',
  styleUrls: ['./update-price-unp.component.scss']
})
export class UpdatePriceUnpComponent implements OnInit {
  inventoryTransaction: InventoryTransaction;
  trForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  user
  
  alertWarning: any;
 
  
  
  
  selectedField = "";
  fieldcode = "";
  sit : string ;
  stat : String;
  expire;
  row_number;
  message = "";
  site: any;
  location: any;
  sct: any;
  seq : any;
  trServer;
  trlot: string;
  datasetPrint = [];
  lddet: any;
  rqm: boolean;
  statusref: any;
  transactions: [];
  columnDefinitions5: Column[] = [];
  gridOptions5: GridOption = {};
  gridObj5: any;
  angularGrid5: AngularGridInstance;
  requistionServer;
  domain: any;
  provider;
  constructor(
    config: NgbDropdownConfig,
    private trFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public  dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private inventoryTransactionService: InventoryTransactionService,
    private sctService: CostSimulationService,  
    private itemsService: ItemService,
    private locationService: LocationService,
    private siteService: SiteService,
    private inventoryStatusService: InventoryStatusService,
    private mesureService: MesureService,
    private codeService: CodeService,
    private requisitionService: RequisitionService,
    private sequenceService: SequenceService,
    private addressService: AddressService
  ) {
    config.autoClose = true;
    this.initGrid();
  }
  GridReady(angularGrid: AngularGridInstance) {
      this.angularGrid = angularGrid
      this.dataView = angularGrid.dataView
      this.grid = angularGrid.slickGrid
      this.gridService = angularGrid.gridService
  }
  ngOnInit(): void {
    
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(true)
      this.user =  JSON.parse(localStorage.getItem('user'))       
      this.domain = JSON.parse(localStorage.getItem("domain"));
      console.log("hna user",this.user)
      
         this.createForm()
         this.loadingSubject.next(false)
      
  }
  

  createForm() {
    this.loadingSubject.next(false);
    this.inventoryTransaction = new InventoryTransaction();
  
   // console.log(this.site)  
   

    this.trForm = this.trFB.group({
      tr_lot: [this.inventoryTransaction.tr_lot],
      tr_addr: [this.inventoryTransaction.tr_addr],
      name: [null],
      tr_effdate:  [this.inventoryTransaction.tr_effdate],
      tr_rmks: [this.inventoryTransaction.tr_rmks],    
      //tr_site:  [this.inventoryTransaction.tr_site],
      tr_site:  [this.inventoryTransaction.tr_site],
      tr_loc: [this.inventoryTransaction.tr_loc],
      print:[false],
    })    
  }
    
    //reste form
    reset() {
      this.inventoryTransaction = new InventoryTransaction();
      this.createForm();
      this.dataset = []
      this.hasFormErrors = false;
    }
    // save data
    onSubmit() {
      this.hasFormErrors = false;
      const controls = this.trForm.controls;
      /** check form */
      if (this.trForm.invalid) {
        Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
        );
        this.message = "Modifiez quelques éléments et réessayez de soumettre.";
        this.hasFormErrors = true;
  
        return;
      }
  
      if (!this.dataset.length) {
        this.message = "La liste des article ne peut pas etre vide";
        this.hasFormErrors = true;
  
        return;
      }


      for (var i = 0; i < this.dataset.length; i++) {
        console.log(this.dataset[i]  )
       if (this.dataset[i].tr_price == 0 ) {
        this.message = "Le Prix ne peut pas etre 0";
        this.hasFormErrors = true;
        return;
   
       }

      }
this.addIt(this.dataset)


     
      // tslint:disable-next-line:prefer-const
     
    }
  
    /**
     *
     * Returns object for saving
     */
    /**
     * Add po
     *
     * @param _it: it
     */
    addIt( detail: any) {
     
      this.loadingSubject.next(true);
      const controls = this.trForm.controls;

  
      this.inventoryTransactionService
        .updatePrice(detail)
        .subscribe(
         (reponse: any) => {
          // console.log(reponse)
          // const arrayOctet = new Uint8Array(reponse.pdf.data)
          // const file = new Blob([arrayOctet as BlobPart], {type : 'application/pdf'})
          // const fileUrl = URL.createObjectURL(file);
          // window.open(fileUrl)
        },
          (error) => {
            this.layoutUtilsService.showActionNotification(
              "Erreur verifier les informations",
              MessageType.Create,
              10000,
              true,
              true
            );
            this.loadingSubject.next(false);
          },
          () => {
            this.layoutUtilsService.showActionNotification(
              "Ajout avec succès",
              MessageType.Create,
              10000,
              true,
              true
            );
            this.loadingSubject.next(false);
        
        if (controls.print.value == true) this.printpdf(controls.tr_lot.value);
          this.reset()
          this.router.navigateByUrl("/inventory-transaction/update-price-unp");
          }
        );
    }
    
    /**
     * Go back to the list
     *
     */
    goBack() {
      this.loadingSubject.next(false);
      const url = `/`;
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
    }
  



    
    // add new Item to Datatable
    // addNewItem() {
    //   this.gridService.addItem(
    //     {
    //       id: this.dataset.length + 1,
    //       tr_line: this.dataset.length + 1,
    //       tr_part: "",
    //       cmvid: "",
    //       desc: "",
    //       tr_qty_loc: 0,
    //       tr_um: "",
    //       tr_price: 0,
    //       cmvids: "",
    //       tr_serial: null,
    //       tr_status: null,
    //       tr_expire: null,
    //     },
    //     { position: "bottom" }
    //   );
    // }

  
    onChangeCC() {
      const controls = this.trForm.controls;
      //const rqm_nbr = controls.tr_so_job.value;
     
      this.dataset = [];
          this.inventoryTransactionService.getByNbr({ tr_lot: controls.tr_lot.value, tr_type:"RCT-PO" }).subscribe(
            (res: any) => {
              console.log(res)
             this.dataset = res.data;
             if (this.dataset.length > 0) {
              this.dataView.setItems(this.dataset)
         
              this.inventoryTransactionService.getByRef({ tr_lot: controls.tr_lot.value, tr_type:"RCT-PO" }).subscribe(
                (resp: any) => {
                  console.log(resp)
                  controls.tr_lot.setValue(resp.data[0].tr_lot || "");
                  controls.tr_effdate.setValue(resp.data[0].tr_effdate);
                  controls.tr_site.setValue(resp.data[0].tr_site || "");
                  controls.tr_loc.setValue(resp.data[0].tr_loc || "");
                  controls.tr_rmks.setValue(resp.data[0].tr_rmks || "");
                  controls.tr_addr.setValue(resp.data[0].tr_addr || "");
                  this.addressService.getBy({ad_name: resp.data[0].tr_addr}).subscribe((response: any)=>{
                
                
                    this.provider = response.data[0]
            
                  controls.name.setValue(this.provider.ad_name);
                  }) 

                })
  
        }else {
          alert("Récéption n'existe pas ")
          controls.tr_lot.setValue(null)
          //console.log(response.data.length)
          document.getElementById("tr_lot").focus();
        }
        })    
      

      
    }



  initGrid() {
      this.columnDefinitions = [
        {
          id: "id",
          field: "id",
          name: "id",
      
          //formatter: Formatters.,
          minWidth: 30,
          maxWidth: 30,
         
        },
  
        // {
        //   id: "tr_line",
        //   name: "Ligne",
        //   field: "tr_line",
        //   minWidth: 50,
        //   maxWidth: 50,
        //   selectable: true,
        // },
        {
          id: "tr_part",
          name: "Article",
          field: "tr_part",
          sortable: true,
          minWidth: 80,
          filterable: false,
        },

        {
          id: "desc",
          name: "Description",
          field: "desc",
          sortable: true,
          width: 180,
          filterable: false,
        },
        
        
        {
            id: "qty",
            name: "QTE",
            field: "qty",
            sortable: true,
            width: 80,
            filterable: false,
            formatter: Formatters.decimal,
     
            type: FieldType.float,  
        },
        {
          id: "tr_um",
          name: "UM",
          field: "tr_um",
          sortable: true,
          width: 80,
          filterable: false,
           
        }, 
        {
            id: "tr_price",
            name: "Prix unitaire",
            field: "tr_price",
            sortable: true,
            width: 80,
            filterable: false,
            //type: FieldType.float,
            formatter: Formatters.decimal,
     
            editor: {
              model: Editors.float,
            },
       
        },
                
             ];
  
      this.gridOptions = {
        asyncEditorLoading: false,
        editable: true,
        enableColumnPicker: true,
        enableCellNavigation: true,
        enableRowSelection: true,
        autoHeight:false,
        autoCommitEdit:true,
        enableAutoResize:true,
        formatterOptions: {
          
          
          // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
          displayNegativeNumberWithParentheses: true,
    
          // Defaults to undefined, minimum number of decimals
          minDecimal: 2,
    
          // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
          thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      }
    }
      this.dataset = [];
   
  }


  

  
/*choisir demande achat*/
handleSelectedRowsChanged5(e, args) {
  const controls = this.trForm.controls;

  
  
  if (Array.isArray(args.rows) && this.gridObj5) {
    this.dataset = []
    args.rows.map((idx) => 
    {
      const item = this.gridObj5.getDataItem(idx);
      controls.tr_lot.setValue(item.tr_lot || "");
      controls.tr_effdate.setValue(item.tr_effdate);
      controls.tr_site.setValue(item.tr_site || "");
      controls.tr_loc.setValue(item.tr_loc || "");
      controls.tr_rmks.setValue(item.tr_rmks || "");
      controls.tr_addr.setValue(item.tr_addr || "");
      
      this.inventoryTransactionService.getByNbr({ tr_lot: item.tr_lot,tr_effdate:item.tr_effdate,tr_addr:item.tr_addr }).subscribe(
        (res: any) => {
          this.dataset = res.data
          this.dataView.setItems(this.dataset)
       
        },
        (error) => {
          this.message = `Récéption n'existe pas`;
          this.hasFormErrors = true;
        },
        () => {}
      );
  
      this.addressService.getBy({ad_addr: item.tr_addr}).subscribe((response: any)=>{
                
                
        this.provider = response.data[0]

      controls.name.setValue(this.provider.ad_name);
      })
    
      })
  }
 // this.calculatetot();
}

angularGridReady5(angularGrid: AngularGridInstance) {
  this.angularGrid5 = angularGrid;
  this.gridObj5 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGrid5() {
  this.columnDefinitions5 = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "tr_lot",
      name: "N° Récéption",
      field: "tr_lot",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "tr_addr",
      name: "Fournisseur",
      field: "tr_addr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "tr_effdate",
      name: "Date",
      field: "tr_effdate",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "tr_site",
      name: "Site",
      field: "tr_site",
      sortable: true,
      filterable: true,
      type: FieldType.float,
    },
    {
      id: "tr_loc",
      name: "Empl",
      field: "tr_loc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptions5 = {
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
    checkboxSelector: {},
    multiSelect: false,
    rowSelectionOptions: {
      selectActiveRow: true,
    },
  };

  // fill the dataset with your data
  this.inventoryTransactionService
    .getByGroup({ tr_type:"RCT-PO" })
    .subscribe((response: any) => (this.transactions = response.data));
}
open5(content) {
  this.prepareGrid5();
  this.modalService.open(content, { size: "lg" });
}

printpdf(nbr) {
  // const controls = this.totForm.controls
  const controlss = this.trForm.controls;
  console.log("pdf");
  var doc = new jsPDF();
  let date = new Date()
 // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
  var img = new Image()
  // img.src = "./assets/media/logos/update-price.png";
  img.src = "./assets/media/logos/companyentete.png";
    doc.addImage(img, 'png', 5, 5, 200, 30)
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
  doc.text("Bon Récéption N° : " + nbr, 70, 45);
  doc.text("Date: " + date.toLocaleDateString() , 160, 45);
      doc.text("A: " + new Date().toLocaleTimeString(), 160, 50);
      doc.text("Edité par: " + this.user.usrd_code, 160, 55);
      
     
  doc.setFontSize(8);
  //console.log(this.provider.ad_misc2_id)
  doc.text("Site Source : " + controlss.tr_site.value, 20, 60);
  doc.text("Magasin     : " + controlss.tr_loc.value, 100, 60);
  doc.text("Fournisseur : " + controlss.tr_addr.value, 20, 65);
  // doc.text( controlss.name.value, 50, 65);
 

  doc.line(10, 85, 205, 85);
  doc.line(10, 90, 205, 90);
  doc.line(10, 85, 10, 90);
  doc.text("LN", 12.5, 88.5);
  doc.line(20, 85, 20, 90);
  doc.text("Code Article", 25, 88.5);
  doc.line(45, 85, 45, 90);
  doc.text("Désignation", 67.5, 88.5);
  doc.line(130, 85, 130, 90);
  doc.text("QTE", 137, 88.5);
  doc.line(150, 85, 150, 90);
  doc.text("UM", 153, 88.5);
  doc.line(160, 85, 160, 90);
  doc.text("PU", 168, 88.5);
  doc.line(180, 85, 180, 90);
  doc.text("THT", 195, 88.5);
  doc.line(205, 85, 205, 90);
  var i = 95;
  doc.setFontSize(6);
  let total = 0
  for (let j = 0; j < this.dataset.length  ; j++) {
    total = total + Number(this.dataset[j].tr_price) * Number(this.dataset[j].qty)
    console.log("this.dataset[j].", this.dataset[j].id)
    if ((j % 20 == 0) && (j != 0) ) {
doc.addPage();
// img.src = "./assets/media/logos/update-price.png";
img.src = "./assets/media/logos/companyentete.png";
doc.addImage(img, 'png', 5, 5, 200, 30)
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
      doc.text("Bon Récéption N° : " + nbr, 70, 45);
      doc.text("imprimé Le: " + date.toLocaleDateString() , 160, 45);
      doc.text("A: " + new Date().toLocaleTimeString(), 160, 50);
      doc.text("Edité par: " + this.user.usrd_code, 160, 55);
      
      
      doc.setFontSize(8);
      //console.log(this.provider.ad_misc2_id)
      doc.text("Site Source : " + controlss.tr_site.value, 20, 60);
      doc.text("Magasin     : " + controlss.tr_loc.value, 100, 60);
      doc.text("Fournisseur : " + controlss.tr_addr.value, 20, 65);
      // doc.text( controlss.name.value, 50, 65);

      doc.line(10, 85, 205, 85);
      doc.line(10, 90, 205, 90);
      doc.line(10, 85, 10, 90);
      doc.text("LN", 12.5, 88.5);
      doc.line(20, 85, 20, 90);
      doc.text("Code Article", 25, 88.5);
      doc.line(45, 85, 45, 90);
      doc.text("Désignation", 67.5, 88.5);
      doc.line(130, 85, 130, 90);
      doc.text("QTE", 137, 88.5);
      doc.line(150, 85, 150, 90);
      doc.text("UM", 153, 88.5);
      doc.line(160, 85, 160, 90);
      doc.text("PU", 168, 88.5);
      doc.line(180, 85, 180, 90);
      doc.text("THT", 195, 88.5);
      doc.line(205, 85, 205, 90);
      i = 95;
      doc.setFontSize(6);
    }

    if (this.dataset[j].desc.length > 45) {
      let desc1 = this.dataset[j].desc.substring(45);
      let ind = desc1.indexOf(" ");
      desc1 = this.dataset[j].desc.substring(0, 45 + ind);
      let desc2 = this.dataset[j].desc.substring(45 + ind);

      doc.line(10, i - 5, 10, i);
      doc.text(String("000" + this.dataset[j].id).slice(-3), 12.5, i - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.dataset[j].tr_part, 25, i - 1);
      doc.line(45, i - 5, 45, i);
      doc.text(desc1, 47, i - 1);
      doc.line(130, i - 5, 130, i);
      doc.text(String(Number(this.dataset[j].qty.toFixed(2))), 148, i - 1, { align: "right" });
      doc.line(150, i - 5, 150, i);
      doc.text(this.dataset[j].tr_um, 153, i - 1);
      doc.line(160, i - 5, 160, i);
      doc.text(String(Number(this.dataset[j].tr_price).toFixed(2)), 178, i - 1, { align: "right" });
      doc.line(180, i - 5, 180, i);
      doc.text(String((this.dataset[j].tr_price * this.dataset[j].qty).toFixed(2)), 203, i - 1, { align: "right" });
      doc.line(205, i - 5, 205, i);
      // doc.line(10, i, 200, i );

      i = i + 5;

      doc.text(desc2, 47, i - 1);

      doc.line(10, i - 5, 10, i);
      doc.line(20, i - 5, 20, i);
      doc.line(45, i - 5, 45, i);
      doc.line(130, i - 5, 130, i);
      doc.line(150, i - 5, 150, i);
      doc.line(160, i - 5, 160, i);
      doc.line(180, i - 5, 180, i);
      doc.line(205, i - 5, 205, i);
      doc.line(10, i, 200, i);

      i = i + 5;
    } else {
      doc.line(10, i - 5, 10, i);
      doc.text(String("000" + this.dataset[j].id).slice(-3), 12.5, i - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.dataset[j].tr_part, 25, i - 1);
      doc.line(45, i - 5, 45, i);
      doc.text(this.dataset[j].desc, 47, i - 1);
      doc.line(130, i - 5, 130, i);
      doc.text(String(Number(this.dataset[j].qty).toFixed(2)), 148, i - 1, { align: "right" });
      doc.line(150, i - 5, 150, i);
      doc.text(this.dataset[j].tr_um, 153, i - 1);
      doc.line(160, i - 5, 160, i);
      doc.text(String(Number(this.dataset[j].tr_price).toFixed(2)), 178, i - 1, { align: "right" });
      doc.line(180, i - 5, 180, i);
     
      doc.text(String((this.dataset[j].tr_price * this.dataset[j].qty).toFixed(2)), 203, i - 1, { align: "right" });
      doc.line(205, i - 5, 205, i);
      doc.line(10, i, 205, i);
      i = i + 5;
    }
  }

  // doc.line(10, i - 5, 200, i - 5);

  doc.line(130, i + 7, 205, i + 7);
  doc.line(130, i + 14, 205, i + 14);
  //  doc.line(130, i + 21, 200, i + 21 );
  //  doc.line(130, i + 28, 200, i + 28 );
  //  doc.line(130, i + 35, 200, i + 35 );
  doc.line(130, i + 7, 130, i + 14);
  doc.line(160, i + 7, 160, i + 14);
  doc.line(205, i + 7, 205, i + 14);
  doc.setFontSize(10);

  doc.text("Total ", 140, i + 12, { align: "left" });
  //  doc.text('TVA', 140 ,  i + 19 , { align: 'left' });
  //  doc.text('Timbre', 140 ,  i + 26 , { align: 'left' });
  //  doc.text('Total TC', 140 ,  i + 33 , { align: 'left' });

  doc.text(String(Number(total).toFixed(2)), 198, i + 12, { align: "right" });
  doc.text("Validé par: " , 20, i + 22);
    doc.text("Note: " , 20, i + 32);
  //  doc.text(String(Number(controls.tva.value).toFixed(2)), 198 ,  i + 19 , { align: 'right' });
  //  doc.text(String(Number(controls.timbre.value).toFixed(2)), 198 ,  i + 26 , { align: 'right' });
  //  doc.text(String(Number(controls.ttc.value).toFixed(2)), 198 ,  i + 33 , { align: 'right' });

  doc.setFontSize(8);
  let mt = NumberToLetters(Number(total).toFixed(2), "Dinars Algerien");

  if (mt.length > 95) {
    let mt1 = mt.substring(90);
    let ind = mt1.indexOf(" ");

    mt1 = mt.substring(0, 90 + ind);
    let mt2 = mt.substring(90 + ind);

    doc.text("Arretée la présente Récéption a la somme de : " + mt1, 20, i + 53);
    doc.text(mt2, 20, i + 60);
  } else {
    doc.text("Arretée la présente Récéption a la somme de : " + mt, 20, i + 53);
  }
  
  // window.open(doc.output('bloburl'), '_blank');
  //window.open(doc.output('blobUrl'));  // will open a new tab
  doc.save('RUP-' + nbr + '.pdf')
  var blob = doc.output("blob");
  window.open(URL.createObjectURL(blob));
}

}
