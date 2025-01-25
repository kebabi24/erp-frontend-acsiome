import { ChangeDetectorRef,Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
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
  GridStateChange,
  GridStateService,
  GroupTotalFormatters,
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
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import {
   SiteService, WorkOrderService, WorkRoutingService,CodeService,AddressService
} from "../../../../core/erp";

@Component({
  selector: 'kt-rp-broyage',
  templateUrl: './rp-broyage.component.html',
  styleUrls: ['./rp-broyage.component.scss']
})
export class RpBroyageComponent implements OnInit {

  woForm: FormGroup;
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

  // grid options
  domain: any;
  provider: any;
  gamme: any;
  gammes: [];
  columnDefinitionsgamme: Column[] = [];
  gridOptionsgamme: GridOption = {};
  gridObjgamme: any;
  angularGridgamme: AngularGridInstance;

  datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;
  user;
  row_number;
  message = "";
  
  constructor(
    private cd: ChangeDetectorRef,
    config: NgbDropdownConfig,
    private woFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private siteService: SiteService,
    private workOrderService: WorkOrderService,
    private workRoutingService: WorkRoutingService,
    private codeService: CodeService,
    private addressService:AddressService,
  ) {
    config.autoClose = true;
    
   
    //  this.initGrid();
    //  this.initmvGrid();

  }
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  initGrid() {
    this.columnDefinitions = [
     

      {
        id: "id",
        name: "ID",
        field: "id",
        sortable: true,
        width: 60,
        filterable: false,   
        columnGroup:  'OF',
        
      },
      {
        id: "date",
        name: "Date",
        field: "date",
        sortable: true,
        width: 60,
        filterable: false,
        formatter: Formatters.dateIso,   
        columnGroup:  'OF',
        
      },
      
      {
        id: "equipe",
        name: "Equipe",
        field: "equipe",
        sortable: true,
        width: 60,
        filterable: false,   
        columnGroup:  'OF',
        
      },
      
      {
        id: "gamme",
        name: "Ligne",
        field: "gamme",
        sortable: true,
        width: 60,
        filterable: false,   
        columnGroup:  'OF',
        
      },
      {
        id: "nbr",
        name: "N° OF",
        field: "nbr",
        sortable: true,
        width: 60,
        filterable: false,   
        columnGroup:  'OF',
        
      },
     
      
      
      {
        id: "isspal",
        name: "N° BIG BAG",
        field: "isspal",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'ENTREE',
      },
      {
        id: "issserial",
        name: "Lot",
        field: "issserial",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'ENTREE',
      },
      {
        id: "issorigin",
        name: "Origin",
        field: "issorigin",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'ENTREE',
      },
      {
        id: "isspart",
        name: "Article",
        field: "isspart",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'ENTREE',
      },
      {
        id: "isscolor",
        name: "Couleur",
        field: "isscolor",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'ENTREE',
      },
      {
        id: "issqty",
        name: "QTE",
        field: "issqty",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        columnGroup: 'ENTREE',
      },
      {
        id: "isstime",
        name: "Heure",
        field: "isstime",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'ENTREE',
      },
      
      
      {
        id: "rctpart",
        name: "Article",
        field: "rctpart",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'SORTIE',
      },
      {
        id: "rctcolor",
        name: "Couleur",
        field: "rctcolor",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'SORTIE',
      },
      {
        id: "rctqty",
        name: "QTE",
        field: "rctqty",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        columnGroup: 'SORTIE',
      },
      {
        id: "rctserial",
        name: "Lot",
        field: "rctserial",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'SORTIE',
      },
      
      {
        id: "rctpal",
        name: "N° BIG BAG",
        field: "rctpal",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        columnGroup: 'SORTIE',
      },
      
    ];
    this.gridOptions = {
      formatterOptions: {
           
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: false,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
        maxDecimal:2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
      rowSelectionOptions: {
         
        selectActiveRow: false
      },
      enableCellNavigation: true,
      asyncEditorLoading: false,
      editable: false,
      enableCheckboxSelector:true,
      enableAutoSizeColumns: true,
      enableAutoResize: true,
      showCustomFooter: true,
      enableExcelExport: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 28,
      excelExportOptions: {
        exportWithFormatter: false
      },
      // registerExternalResources: [new ExcelExportService(), this.compositeEditorInstance],
      enableFiltering: true,
      // enableCompositeEditor: true,
     // when using the cellMenu, you can change some of the default options and all use some of the callback methods
      enableCellMenu: true,
    };
  }
  ngOnInit(): void {
    
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(true);
    this.user =  JSON.parse(localStorage.getItem('user'))
    this.domain = JSON.parse(localStorage.getItem("domain"));
    console.log(this.user)
    this.createForm();
    this.initGrid();
   
  }


 /*for (var i= 0; i < this.dataset.length ; i++){
   console.log("here")
    this.gridService.addItem(
      {
        id: i + 1,
        part: this.dataset[i].part,
        desc: this.dataset[i].desc,
        qty_ord : this.dataset[i].qty_ord,
        um : this.dataset[i].um,
        vend : this.dataset[i].vend ,
      },
      { position: "bottom" }
    );
 }*/
 

  
 
 
  //create form
  createForm() {
    this.loadingSubject.next(false);
    const date = new Date;
    let site = this.user.usrd_site
    if (site == "*") { site = null }

    this.woForm = this.woFB.group({
     // po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],
      site:[site,Validators.required],
      wo_routing:[''],
      date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: 1
      }],
      date1: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }], 
      start_time: [''],
      end_time: [''],
    });

   /* this.sequenceService.getBy({ seq_type: "PO", seq_profile: this.user.usrd_profile }).subscribe(
      (res: any) => {
        this.seq = res.data[0].seq_seq
        console.log(this.seq)
        controls.po_category.setValue(this.seq);
    
    })
    */

  }
  wolist() {
    this.dataset = []
   
    const controls = this.woForm.controls
    const site = controls.site.value
    const gamme = controls.wo_routing.value
    const start_time = controls.start_time.value
    const end_time = controls.end_time.value
    const date = controls.date.value
    ? `${controls.date.value.year}/${controls.date.value.month}/${controls.date.value.day}`
    : null;
  
    const date1 = controls.date1.value
    ? `${controls.date1.value.year}/${controls.date1.value.month}/${controls.date1.value.day}`
    : null;
    if(site != null) {
    this.workOrderService.getBrRep({site,gamme,date,date1,start_time,end_time}).subscribe(
      (response: any) => {   
       // this.sos = response.data.soss
        this.dataset = response.data
       console.log('RAPPORT',this.dataset)
       this.dataView.setItems(this.dataset);
        
         },
      (error) => {
          this.dataset = []
      },
      () => {}
  )
    }
    else {
      alert ("Site erronée")
      controls.site.setValue(null);
      document.getElementById("site").focus();
      this.dataset = []
      this.dataView.setItems(this.dataset)
    }
  }

  //reste form
  reset() {
    // this.purchaseOrder = new PurchaseOrder();
    this.createForm();
    this.hasFormErrors = false;
  }

  /**
   *
   * Returns object for saving
   */
  /**
   * Add po
   *
   * @param _po: po
   */

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
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  onChangesite() {
    const controls = this.woForm.controls;
    const si_site = controls.site.value;
    
    this.siteService.getByOne({ si_site }).subscribe(
      (res: any) => {
  
        if (!res.data) {
  
            alert("Site n'existe pas  ")
            controls.site.setValue(null);
            document.getElementById("site").focus();
          } 
      
      });
  }
  
 
  handleSelectedRowsChangedsite(e, args) {
    const controls = this.woForm.controls;
      if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);
        console.log(item);
        
       controls.site.setValue(item.si_site);
        
    
     
      });

    }
  }
  angularGridReadysite(angularGrid: AngularGridInstance) {
    this.angularGridsite = angularGrid;
    this.gridObjsite = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridsite() {
    this.columnDefinitionssite = [
      
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "si_site",
        name: "Site",
        field: "si_site",
        sortable: true,
        filterable: false,
        type: FieldType.string,
      },
      {
        id: "si_desc",
        name: "Designation",
        field: "si_desc",
        sortable: true,
        filterable: false,
        type: FieldType.string,
      },
    ];

    this.gridOptionssite = {
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
      };
    // fill the dataset with your data
    if(this.user.usrd_site == "*") {
    this.siteService
      .getAll()
      .subscribe((response: any) => (this.datasite = response.data));
    }
    else {
      this.siteService
      .getBy({si_site : this.user.usrd_site})
      .subscribe((response: any) => (this.datasite = response.data));
  
    }
  }
  opensite(contentsite) {
    this.prepareGridsite();
    this.modalService.open(contentsite, { size: "lg" });
  }

  onSubmit() {
    const controls = this.woForm.controls;
    const date1 = controls.date.value
    ? `${controls.date.value.year}/${controls.date.value.month}/${controls.date.value.day}`
    : null;
  
    const date2 = controls.date1.value ? `${controls.date1.value.year}/${controls.date1.value.month}/${controls.date1.value.day}`
    : null;

  this.printpdf(controls.wo_routing.value,date1,date2,controls.start_time.value,controls.end_time.value) 
    
  
  

}
printpdf(gamme,date1,date2,time1,time2) {
  // const controls = this.totForm.controls
  const controlss = this.woForm.controls;
  console.log("pdf");
  var doc = new jsPDF("l");

  // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
  var img = new Image();
  img.src = "./assets/media/logos/companyentete.png";
  doc.addImage(img, "png", 200, 5, 50, 30);
  doc.setFontSize(9);
  if (this.domain.dom_name != null) {
    doc.text(this.domain.dom_name, 10, 10);
  }
  if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
  if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
  if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
  doc.setFontSize(14);
  let date = new Date()
  doc.line(10, 35, 300, 35);
  doc.setFontSize(12);
  doc.text("Etat Des Broyages" , 130, 45);
  doc.text("Date: " + date.toLocaleDateString() , 250, 45);
  doc.text("Heure: " + new Date().toLocaleTimeString(), 250, 50);
  doc.text("Edité par: " + this.user.usrd_code, 250, 55);
  
  
  doc.setFontSize(8);
  //console.log(this.provider.ad_misc2_id)
  doc.text("Broyeur : " + this.provider.ad_addr, 20, 50);
  doc.text("Nom             : " + this.provider.ad_name, 20, 55);
  doc.text("Adresse       : " + this.provider.ad_line1, 20, 60);
  doc.text("Date debut : " + String(date1) + "A " + String(time1), 20, 65);
  doc.text("Date Fin : " + String(date2) + "A " + String(time2), 20, 70);
  doc.line(10, 85, 300, 85);
  doc.line(10, 90, 300, 90);
  doc.line(10, 85, 10, 90);
  doc.text("LN", 12.5, 88.5);
  doc.line(20, 85, 20, 90);
  doc.text("DATE", 22, 88.5);
  doc.line(35, 85, 35, 90);
  doc.text("OF", 37, 88.5);
  doc.line(50, 85, 50, 90);
  doc.text("BIGBAG", 52, 88.5);
  doc.line(65, 85, 65, 90);
  doc.text("LOT", 67, 88.5);
  doc.line(80, 85, 80, 90);
  doc.text("ORIGINE", 82, 88.5);
  doc.line(95, 85, 95, 90);
  doc.text("BROYE", 97, 88.5);
  doc.line(120, 85, 120, 90);
  doc.text("COULEUR", 122, 88.5);
  doc.line(155, 85, 155, 90);
  doc.text("QTE", 157, 88.5);
  doc.line(165, 85, 165, 90);
  doc.text("HEURE", 167, 88.5);
  doc.line(185, 85, 185, 90);
  doc.text("CONSOMME", 187, 88.5);
  doc.line(210, 85, 210, 90);
  doc.text("COULEUR", 212, 88.5);
  doc.line(245, 85, 245, 90);
  doc.text("QTE", 247, 88.5);
  doc.line(255, 85, 255, 90);
  doc.text("BIGBAG", 257, 88.5);
  doc.line(270, 85, 270, 90);
  doc.text("LOT", 272, 88.5);
  doc.line(300, 85, 300, 90);
  var i = 95;
  doc.setFontSize(6);
  let total = 0;
  for (let j = 0; j < this.dataset.length; j++) {
    total = total + Number(this.dataset[j].tr_price) * Number(this.dataset[j].tr_qty_loc);

    if (j % 20 == 0 && j != 0) {
      doc.addPage();
      img.src = "./assets/media/logos/companyentete.png";
      doc.addImage(img, "png", 200, 5, 50, 30);
      doc.setFontSize(9);
      if (this.domain.dom_name != null) {
        doc.text(this.domain.dom_name, 10, 10);
      }
      if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
      if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
      if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
      doc.setFontSize(14);
      doc.line(10, 35, 300, 35);

      doc.setFontSize(12);
      doc.text("Etat des Broyages " , 130, 40);
      doc.text("Date: " + date.toLocaleDateString() , 250, 40);
  doc.text("Heure: " + new Date().toLocaleTimeString(), 250, 50);
  doc.text("Edité par: " + this.user.usrd_code, 250, 55);
 
      doc.setFontSize(8);
      console.log(this.provider.ad_misc2_id);
      doc.text("Broyeur : " + this.provider.ad_addr, 20, 50);
      doc.text("Nom             : " + this.provider.ad_name, 20, 55);
      doc.text("Adresse       : " + this.provider.ad_line1, 20, 60);
      doc.text("Date debut : " + String(date1) + "A " + String(time1), 20, 65);
      doc.text("Date Fin : " + String(date2) + "A " + String(time2), 20, 70);
      
      doc.line(10, 85, 300, 85);
  doc.line(10, 90, 300, 90);
  doc.line(10, 85, 10, 90);
  doc.text("LN", 12.5, 88.5);
  doc.line(20, 85, 20, 90);
  doc.text("DATE", 22, 88.5);
  doc.line(35, 85, 35, 90);
  doc.text("OF", 37, 88.5);
  doc.line(50, 85, 50, 90);
  doc.text("BIGBAG", 52, 88.5);
  doc.line(65, 85, 65, 90);
  doc.text("LOT", 67, 88.5);
  doc.line(80, 85, 80, 90);
  doc.text("ORIGINE", 82, 88.5);
  doc.line(95, 85, 95, 90);
  doc.text("BROYE", 97, 88.5);
  doc.line(120, 85, 120, 90);
  doc.text("COULEUR", 122, 88.5);
  doc.line(155, 85, 155, 90);
  doc.text("QTE", 157, 88.5);
  doc.line(165, 85, 165, 90);
  doc.text("HEURE", 167, 88.5);
  doc.line(185, 85, 185, 90);
  doc.text("CONSOMME", 187, 88.5);
  doc.line(210, 85, 210, 90);
  doc.text("COULEUR", 212, 88.5);
  doc.line(245, 85, 245, 90);
  doc.text("QTE", 247, 88.5);
  doc.line(255, 85, 255, 90);
  doc.text("BIGBAG", 257, 88.5);
  doc.line(270, 85, 270, 90);
  doc.text("LOT", 272, 88.5);
  doc.line(300, 85, 300, 90);
          i = 95;
      doc.setFontSize(6);
    }

    
    doc.setFontSize(6);
      doc.line(10, i - 5, 10, i);
      doc.text(String("000" + this.dataset[j].id).slice(-3), 12.5, i - 1);
      doc.line(20, i - 5, 20, i);
      if(this.dataset[j].date!= ""){doc.text(String(new Date(this.dataset[j].date).toLocaleDateString()), 22, i - 1);}
     
      
      doc.line(35, i - 5, 35, i);
      doc.text(this.dataset[j].nbr, 37, i - 1);
      doc.line(50, i - 5, 50, i);
      doc.text(String(this.dataset[j].isspal), 52, i - 1);
      doc.line(65, i - 5, 65, i);
      doc.text(String(this.dataset[j].issserial), 67, i - 1);
      doc.line(80, i - 5, 80, i);
      if(this.dataset[j].issorigin != null){doc.text(String(this.dataset[j].issorigin), 82, i - 1);}
      doc.line(95, i - 5, 95, i);
      doc.text(String(this.dataset[j].isspart), 97, i - 1);
      doc.line(120, i - 5, 120, i);
      if(this.dataset[j].isscolor!=null){doc.text(this.dataset[j].isscolor, 122, i - 1);}
      doc.line(155, i - 5, 155, i);
      
      doc.text(String(this.dataset[j].issqty), 157, i - 1);
      
      doc.line(165, i - 5, 165, i);
      doc.text(String(this.dataset[j].isstime), 167, i - 1);
      doc.line(185, i - 5, 185, i);
      
      doc.text(String(this.dataset[j].rctpart), 187, i - 1);
      doc.line(210, i - 5, 210, i);
      doc.text(String(this.dataset[j].rctcolor), 212, i - 1);
      doc.line(245, i - 5, 245, i);
      doc.text(String(this.dataset[j].rctqty), 247, i - 1);
      doc.line(255, i - 5, 255, i);
      doc.text(String(this.dataset[j].rctpal), 257, i - 1);
      doc.line(270, i - 5, 270, i);
      doc.text(this.dataset[j].rctserial, 272, i - 1);
      doc.line(300, i - 5, 300, i);
      // doc.line(10, i, 200, i );

      
      

      i = i + 5;
     
  }

  // doc.line(10, i - 5, 200, i - 5);

  // doc.line(130, i + 7, 205, i + 7);
  // doc.line(130, i + 14, 205, i + 14);
  // //  doc.line(130, i + 21, 200, i + 21 );
  // //  doc.line(130, i + 28, 200, i + 28 );
  // //  doc.line(130, i + 35, 200, i + 35 );
  // doc.line(130, i + 7, 130, i + 14);
  // doc.line(160, i + 7, 160, i + 14);
  // doc.line(205, i + 7, 205, i + 14);
  // doc.setFontSize(10);

  // doc.text("Total HT", 140, i + 12, { align: "left" });
  // doc.text("Validé par: " , 20, 235);
  // doc.text("Note: " , 20, 250);
  
  //  doc.text('TVA', 140 ,  i + 19 , { align: 'left' });
  //  doc.text('Timbre', 140 ,  i + 26 , { align: 'left' });
  //  doc.text('Total TC', 140 ,  i + 33 , { align: 'left' });

  // doc.text(String(Number(total).toFixed(2)), 198, i + 12, { align: "right" });
  //  doc.text(String(Number(controls.tva.value).toFixed(2)), 198 ,  i + 19 , { align: 'right' });
  //  doc.text(String(Number(controls.timbre.value).toFixed(2)), 198 ,  i + 26 , { align: 'right' });
  //  doc.text(String(Number(controls.ttc.value).toFixed(2)), 198 ,  i + 33 , { align: 'right' });

  
  // let mt = NumberToLetters(Number(total).toFixed(2), "Dinars Algerien");

  // if (mt.length > 95) {
  //   let mt1 = mt.substring(90);
  //   let ind = mt1.indexOf(" ");

  //   mt1 = mt.substring(0, 90 + ind);
  //   let mt2 = mt.substring(90 + ind);

  //   doc.text("Arretée la présente Commande a la somme de :" + mt1, 20, i + 53);
  //   doc.text(mt2, 20, i + 60);
  // } else {
  //   doc.text("Arretée la présente Commande a la somme de :" + mt, 20, i + 53);
  // }
  // window.open(doc.output('bloburl'), '_blank');
  //window.open(doc.output('blobUrl'));  // will open a new tab
  doc.save('BRB-' + date1 + '-' + date2 + '.pdf')
  var blob = doc.output("blob");
  window.open(URL.createObjectURL(blob));
}
handleSelectedRowsChangedgamme(e, args) {
  const controls = this.woForm.controls;
  if (Array.isArray(args.rows) && this.gridObjgamme) {
    args.rows.map((idx) => {
      const item = this.gridObjgamme.getDataItem(idx);
      console.log(item);
      controls.wo_routing.setValue(item.ro_routing || "");
      this.gamme = item.ro_routing
      this.addressService.getBy({ad_addr:item.ro_routing}).subscribe((resaddr: any) => {
        console.log(resaddr.data);
        this.provider = resaddr.data[0];
      });
    });
  }
}

angularGridReadygamme(angularGrid: AngularGridInstance) {
  this.angularGridgamme = angularGrid;
  this.gridObjgamme = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridgamme() {
  this.columnDefinitionsgamme = [
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
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "ro_routing",
      name: "Gamme",
      field: "ro_routing",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ro_desc",
      name: "Designation",
      field: "ro_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptionsgamme = {
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
  };

  // fill the dataset with your data
  this.workRoutingService.getAllDistinct().subscribe((response: any) => (this.gammes = response.data));
}
opengamme(content) {
  this.codeService.getByOne({ code_fldname: this.user.usrd_code }).subscribe(
    (reponse: any) => {
      if (reponse.data == null) {
        this.prepareGridgamme();
        this.modalService.open(content, { size: "lg" });
      }
      console.log(reponse.data);
    },
    (error) => {
      this.prepareGridgamme();
      this.modalService.open(content, { size: "lg" });
    }
    
  );
}
onChangeGamme() {
  const controls = this.woForm.controls;
  this.workRoutingService.getByOne({ ro_routing: controls.wo_routing.value }).subscribe((response: any) => {
    //   const { data } = response;
    console.log(response.data);
    this.gamme = controls.wo_routing.value;
    if (response.data == null) {
  
      controls.wo_routing.setValue(null);
      document.getElementById("wo_routing").focus();
    }
  });
}
}
