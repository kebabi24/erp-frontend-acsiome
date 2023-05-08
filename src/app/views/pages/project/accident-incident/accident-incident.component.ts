import { Component, OnInit } from "@angular/core"
import autoTable from 'jspdf-autotable'
import {
    NgbDropdownConfig,
    NgbTabChangeEvent,
    NgbTabsetConfig,
    NgbModal,
} from "@ng-bootstrap/ng-bootstrap"

// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Editor,
    Editors,
    AngularGridInstance,
    FieldType, GridService
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

import { Site, SiteService, ProjectService,QualityControlService, EmployeService} from "../../../../core/erp"
import jsPDF from "jspdf"
import { head } from "lodash"
import * as _ from "lodash"

@Component({
    selector: "kt-accident-incident",
    templateUrl: "./accident-incident.component.html",
    styleUrls: ["./accident-incident.component.scss"],
    providers: [NgbDropdownConfig],
})
export class AccidentIncidentComponent implements OnInit {
    site: Site
    accidentForm: FormGroup
    hasFormErrors = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    isExist = false
    error = false;
    msg: String;

    // NEW 
    doc_code : String ;
    doc_desc : String ;
  
    // GRID 
  columnDefinitions: Column[] = []
  columnDefinitions2: Column[] = []
  gridOptions: GridOption = {}
  gridOptions2: GridOption = {}
  gridObj: any
  angularGrid: AngularGridInstance
  gridService: GridService
  gridService3: GridService
  gridService4: GridService
  message: any
  column : Column
  grid: any
  dataView: any

  data: any = []; // dataset
  defaultData: any = []; // dataset
  tableBody = [];

  site_code: any;
  emp_code: any;

  columnDefinitions3: Column[] = [];
  gridOptions3: GridOption = {};
  gridObj3: any;
  angularGrid3: AngularGridInstance;
  selectedIndexesSite : any[]
  sites : any[]

  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;
  selectedIndexesEmp : any[]
  emps : any[]
    
  new_even_time = { hour: 13, minute: 30 };
    


    constructor(
        config: NgbDropdownConfig,
        private siteFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private qualityControlService : QualityControlService,
        private projectService: ProjectService,
        private modalService: NgbModal,
        private employeService: EmployeService,
    ) {
        config.autoClose = true
    }

    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.getSpecificationDetails()
        this.createForm()
        this.prepareGrid()
    }
    //create form
    createForm() {
      this.loadingSubject.next(false)
        const date = new Date()
        this.accidentForm = this.siteFB.group({
            name: [this.doc_code, Validators.required],
            description: [this.doc_code],
            accident_date: [{
              year:date.getFullYear(),
              month: date.getMonth()+1,
              day: date.getDate()
            }],
            site_code: [this.site_code ],
            emp_code: [this.emp_code ],
            

        })
    }
    
      onChangeCode() {
          // const controls = this.specificationForm.controls
          // this.qualityControlService
          //     .findSpecificationByCode(
          //       controls.doc_code.value
          //     )
          //     .subscribe((response: any) => {
          //         if (response.data.length) {
          //             this.isExist = true
          //             console.log(response.data.length)
          //         } else {
          //             controls.doc_desc.enable()
          //             controls.validity_date.enable()
          //         }
                
          //  })
        
        }

      onChangeSite(){

      }

      getSpecificationDetails(){
         this.qualityControlService.findSpecificationWithDetails(
          "E-09.01"
         ).subscribe((response: any) => {
            this.data = response.data.specificationDetails 
            this.defaultData = response.data.specificationDetails 
            const fileterd = _.mapValues(_.groupBy(this.data, 'mpd_chr01'));  
            const filtered_elements = [];
            for (const [key, value] of Object.entries(fileterd)) {
              filtered_elements.push({
                groupe_titel: key,
                elements: value,
              });
            }
            this.data = filtered_elements
            console.log(this.data)
         })
      }

      
    
    //reste form
    reset() {
        this.site = new Site()
        this.createForm()
        this.hasFormErrors = false
    }
    // save data
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.accidentForm.controls
        /** check form */
        if (this.accidentForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )

            this.hasFormErrors = true
            return
        }

      
        let accident_date = controls.accident_date.value
        const date = accident_date.year + '-' + accident_date.month + '-' + accident_date.day


        let lines = []
        this.defaultData.forEach(element => {
          // this.tableBody.push([element.asset_desc,element.asset_serial,element.asset_comment])
          lines.push({
            //down_date : date,
            mph_routing : element.mpd_nbr, // code specification 
            mph_test : element.mpd_label,

          })
        });


        
        
        this.qualityControlService.createTestHistory(lines).subscribe(
          (reponse) => console.log("response", Response),
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
              this.layoutUtilsService.showActionNotification(
                  "Ajout avec succès",
                  MessageType.Create,
                  10000,
                  true,
                  true
              )
              this.loadingSubject.next(false)
              // this.router.navigateByUrl("/")
              // this.data=[]
              this.createForm()
              // this.printpdf(144)
          }
      )
    }
   

    goBack() {
        this.loadingSubject.next(false)
        const url = `/`
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
    }


    gridReady(angularGrid: AngularGridInstance) {
      this.angularGrid = angularGrid;
      this.dataView = angularGrid.dataView;
      this.grid = angularGrid.slickGrid;
      this.gridService = angularGrid.gridService;
    }
    
    angularGridReady(angularGrid: AngularGridInstance) {
        this.angularGrid = angularGrid;
        this.dataView = angularGrid.dataView;
        this.grid = angularGrid.slickGrid;
        this.gridService = angularGrid.gridService;
        this.dataView.getItemMetadata = this.updateItemMetadata(this.dataView.getItemMetadata);
        this.grid.invalidate();
        this.grid.render();
    }
    
    updateItemMetadata(previousItemMetadata: any) {
      const newCssClass = 'highlight-bg';
      return (rowNumber: number) => {
        const item = this.dataView.getItem(rowNumber);
        let meta = {
          cssClasses: ''
        };
        if (typeof previousItemMetadata === 'object') {
          meta = previousItemMetadata(rowNumber);
        }
    
        if (meta && item && item.etat_service) {
          const state = item.etat_service;
          if (state === "true") {
            meta.cssClasses = (meta.cssClasses || '') + ' ' + newCssClass;
          }
        }
    
        return meta;
      };
    }
    
    prepareGrid() {
      this.columnDefinitions = [
                {
                    id: "asset_desc",
                    name: "Désignation équipement",
                    field: "asset_desc",
                    sortable: true,
                    minWidth: 100,
                    maxWidth: 300,
                    filterable: true,
                    type: FieldType.string,
                    editor: {model: Editors.text}
    
                },
    
                {
                    id: "asset_serial",
                    name: "Numéro de série",
                    field: "asset_serial",
                    sortable: true,
                    minWidth: 100,
                    maxWidth: 300,
                    filterable: true,
                    type: FieldType.string, 
                    editor: {model: Editors.text}
                },
                {
                  id: "asset_down_type",
                  name: "Type de panne",
                  field: "asset_down_type",
                  sortable: true,
                  minWidth: 100,
                  maxWidth: 300,
                  filterable: true,
                  type: FieldType.string, 
                  editor: {model: Editors.text}
                },
    
                
                {
                    id: "asset_comment",
                    name: "Commentaire",
                    field: "asset_comment",
                    sortable: true,
                    minWidth: 100,
                    maxWidth: 300,
                    filterable: true,
                    type: FieldType.string, 
                    editor: {model: Editors.text}
                },
                {
                  id: "asset_down_duration",
                  name: "Durée de panne",
                  field: "asset_down_duration",
                  sortable: true,
                  minWidth: 100,
                  maxWidth: 300,
                  filterable: true,
                  type: FieldType.string, 
                  editor: {model: Editors.integer}
                },   
          ]
    
          this.gridOptions = {
            asyncEditorLoading: false,
            editable: true,
            enableAddRow:true,
            enableColumnPicker: true,
            enableCellNavigation: true,
            enableRowSelection: true,
            enableCheckboxSelector: true,
            rowSelectionOptions: {
              selectActiveRow: false
            }
          };
    
    
    
    }
    
    addNewItem( ) {
      this.gridService.addItem(
        {
          id: this.data.length + 1,
    
          // nb_line: "",
          // code_param: "",
          // measure_unit: "",
          // test_method: "",
          // val_type: "",
          // max: "",
          // min: "",
          
        },
        { position: "bottom" }
      );
    }

      printpdf(nbr) {
      // printpdf(nbr,wodlot,wodnbr,part,descr,routing,gamme,qte) {
    //   //const controls = this.totForm.controls 
    //   const controlss = this.wodForm.controls 
     console.log("pdf")
       var doc = new jsPDF();
     
      // var img = new Image()
      // img.src = "./assets/media/logos/company.png";
      // doc.addImage(img, 'png', 5, 5, 210, 30)
      // doc.setFontSize(12);
      // doc.text( 'LP N° : ' + nbr  , 70, 40);

      // HEADER 
      doc.line(10, 10, 60, 10); 
      doc.line(10, 10, 10, 50); 
      doc.line(10, 50, 60, 50);
      doc.line(60, 10, 60, 50); 
      
      doc.line(60, 10, 200, 10); 
      doc.line(10, 50, 200, 50);
      doc.line(200, 10, 200, 50); 

      doc.line(60, 40, 200, 40); 


      doc.line(106, 40, 106, 50); 
      doc.line(106, 40, 106, 50); 
      doc.line(152, 40, 152, 50); 

      // INFO
      // HZ LINES 
      // doc.line(10,60,200,60);
      // doc.line(10,70,200,70);
      // doc.line(10,80,200,80);
      // doc.line(10,90,200,90);
      // // VR LINES
      // doc.line(10,60,10,90);
      // doc.line(60,60,60,90);
      // doc.line(200,60,200,90);

      // ASSET DOWN TABLE 
      // HEADER
      // doc.line(10,100,200,100);
      // doc.line(10,110,200,110);
      // doc.line(10,100,10,110);
      // doc.line(200,100,200,110);
      // HEADER SPLIT
      // doc.line(60,100,60,110);
      // doc.line(120,100,120,110);
      
      // TABLE ROW 
      // doc.line(10,100,200,100);  // 10,200 fixed ,  100 + nb row * cell height  

      autoTable(doc, {
        body: [
          ['Nature des travaux ( activité (s))',''],
          ['Chantier ',''],
          ['Période ',''],
        ],
        startY : 60,
        theme: 'grid',
      }
      )
      
      // autoTable()
      autoTable(doc, {
        
        head: [['Désignation équipement ', 'Numéro de série  ', 'Description de la Panne ']],
        body: this.tableBody,
        startY : 100,
        theme: 'grid',
      }
      )

      autoTable(doc, {
        
        head: [['Superviseur (s)', 'Signature']],
        body: [['','']],
        // startY : 100,
        theme: 'grid',

      }
      )
      


      doc.save("a4.pdf");
    //   doc.setFontSize(8);
      
    //       doc.text('Id OF       : ' + wodlot, 20 , 50 )
    //       doc.text('N° OF       : ' + wodnbr, 20 , 55)
    //       doc.text('Article     : ' + part, 20 , 60)
    //       doc.text('Designation : ' + descr, 20 , 65)
  
    //       doc.text('Nomenclature: ' + routing, 20 , 70)
  
    //       doc.text('Gamme       : ' + gamme, 20 , 75)
    //       doc.text('Quantité    : ' + qte, 20 , 80)
  
        
    //   doc.line(10, 85, 200, 85);
    //   doc.line(10, 90, 200, 90);
    //   doc.line(10, 85, 10, 90);
    //   doc.text('LN', 12.5 , 88.5);
    //   doc.line(20, 85, 20, 90);
    //   doc.text('Code Article', 25 , 88.5);
    //   doc.line(45, 85, 45, 90);
    //   doc.text('Désignation', 67.5 , 88.5);
    //   doc.line(100, 85, 100, 90);
    //   doc.text('QTE', 107 , 88.5);
    //   doc.line(120, 85, 120, 90);
    //   doc.text('UM', 123 , 88.5);
    //   doc.line(130, 85, 130, 90);
    //   doc.text('Site', 132 , 88.5);
    //   doc.line(140, 85, 140, 90);
    //   doc.text('Empl', 142 , 88.5);
    //   doc.line(153, 85, 153, 90);
    //   doc.text('Lot/Serie', 158 , 88.5);
    //   doc.line(180, 85, 180, 90);
    //   doc.text('Réference', 182 , 88.5);
    //   doc.line(200, 85, 200, 90);
    //   var i = 95;
    //   doc.setFontSize(6);
    //   for (let j = 0; j < this.dataset.length  ; j++) {
        
    //     if ((j % 35 == 0) && (j != 0) ) {
    // doc.addPage();
    //       doc.addImage(img, 'png', 5, 5, 210, 30)
    //       doc.setFontSize(12);
    //       doc.text( 'LP N° : ' + nbr  , 70, 40);
    //       doc.setFontSize(8);
       
    //       doc.text('Id OF       : ' + wodlot, 20 , 50 )
    //       doc.text('N° OF       : ' + wodnbr, 20 , 55)
    //       doc.text('Article     : ' + part, 20 , 60)
    //       doc.text('Designation : ' + descr, 20 , 65)
  
    //       doc.text('Nomenclature: ' + routing, 20 , 70)
  
    //       doc.text('Gamme       : ' + gamme, 20 , 75)
    //       doc.text('Quantité    : ' + qte, 20 , 80)
  
  
        
  
  
  
    //       doc.line(10, 85, 200, 85);
    //       doc.line(10, 90, 200, 90);
    //       doc.line(10, 85, 10, 90);
    //       doc.text('LN', 12.5 , 88.5);
    //       doc.line(20, 85, 20, 90);
    //       doc.text('Code Article', 25 , 88.5);
    //       doc.line(45, 85, 45, 90);
    //       doc.text('Désignation', 67.5 , 88.5);
    //       doc.line(100, 85, 100, 90);
    //       doc.text('QTE', 107 , 88.5);
    //       doc.line(120, 85, 120, 90);
    //       doc.text('UM', 123 , 88.5);
    //       doc.line(130, 85, 130, 90);
    //       doc.text('Site', 132 , 88.5);
    //       doc.line(140, 85, 140, 90);
    //       doc.text('Empl', 142 , 88.5);
    //       doc.line(153, 85, 153, 90);
    //       doc.text('Lot/Série', 152 , 88.5);
    //       doc.line(180, 85, 180, 90);
    //       doc.text('Réf', 182 , 88.5);
    //       doc.line(200, 85, 200, 90);
    //       i = 95;
    //       doc.setFontSize(6);
    
    //     }
    
    
    
    //     if (this.dataset[j].desc.length > 35) {
    //       let desc1 = this.dataset[j].desc.substring(35)
    //       let ind = desc1.indexOf(' ')
    //       desc1 = this.dataset[j].desc.substring(0, 35  + ind)
    //       let desc2 = this.dataset[j].desc.substring(35+ind)
    
    //       doc.line(10, i - 5, 10, i );
    //       doc.text(String(("000"+ this.dataset[j].wod_line)).slice(-3), 12.5 , i  - 1);
    //       doc.line(20, i - 5, 20, i);
    //       doc.text(this.dataset[j].wod_part, 25 , i  - 1);
    //       doc.line(45, i - 5 , 45, i );
    //       doc.text(desc1, 47 , i  - 1);
    //       doc.line(100, i - 5, 100, i );
    //       doc.text( String(Number(this.dataset[j].wod_qty_req).toFixed(2)), 118 , i  - 1 , { align: 'right' });
    //       doc.line(120, i - 5 , 120, i );
    //       doc.text(this.dataset[j].wod_um, 123 , i  - 1);
    //       doc.line(130, i - 5, 130, i );
    //       doc.text( String((this.dataset[j].wod_site)), 132 , i  - 1 );
    //       doc.line(140, i - 5, 140, i );
    //       doc.text(String(this.dataset[j].wod_loc)  , 141 , i  - 1);
    //       doc.line(153, i - 5 , 153, i );
    //      if(this.dataset[j].wod_serial != null) { doc.text(String(this.dataset[j].wod_serial)  , 156 , i  - 1)};
    //       doc.line(180, i - 5 , 180, i );
    //       if(this.dataset[j].wod_ref != null) {doc.text(String(this.dataset[j].wod_ref ), 182 , i  - 1)};
    //       doc.line(200, i-5 , 200, i );
    //      // doc.line(10, i, 200, i );
    
    //       i = i + 5;
    
    //       doc.text(desc2, 47 , i  - 1);
          
    //       doc.line(10, i - 5, 10, i );
    //       doc.line(20, i - 5, 20, i);
    //       doc.line(45, i - 5 , 45, i );
    //       doc.line(100, i - 5, 100, i );
    //       doc.line(120, i - 5 , 120, i );
    //       doc.line(130, i - 5, 130, i );
    //       doc.line(140, i - 5, 140, i );
    //       doc.line(153, i - 5 , 153, i );
    //       doc.line(180, i - 5 , 180, i );
    //       doc.line(200, i-5 , 200, i );
    //       doc.line(10, i, 200, i );
    
    //       i = i + 5 ;
          
    //     } else {
    
    
        
    //     doc.line(10, i - 5, 10, i );
    //     doc.text(String(("000"+ this.dataset[j].wod_line)).slice(-3), 12.5 , i  - 1);
    //     doc.line(20, i - 5, 20, i);
    //     doc.text(this.dataset[j].wod_part, 25 , i  - 1);
    //     doc.line(45, i - 5 , 45, i );
    //     doc.text(this.dataset[j].desc, 47 , i  - 1);
    //     doc.line(100, i - 5, 100, i );
    //     doc.text( String(Number(this.dataset[j].wod_qty_req).toFixed(2)), 118 , i  - 1 , { align: 'right' });
    //     doc.line(120, i - 5 , 120, i );
    //     doc.text(this.dataset[j].wod_um, 123 , i  - 1);
    //     doc.line(130, i - 5, 130, i );
    //     doc.text( String(this.dataset[j].wod_site), 132 , i  - 1 );
    //     doc.line(140, i - 5, 140, i );
    //     doc.text(String(this.dataset[j].wod_loc)  , 141 , i  - 1);
    //     doc.line(153, i - 5 , 153, i );
    //     if(this.dataset[j].wod_serial != null) {doc.text(String(this.dataset[j].wod_serial) , 156 , i  - 1)};
    //     doc.line(180, i - 5 , 180, i );
    //     if (this.dataset[j].wod_ref) {doc.text(String(this.dataset[j].wod_ref ), 182 , i  - 1)};
    //     doc.line(200, i-5 , 200, i );
    //     doc.line(10, i, 200, i );
    //     i = i + 5;
    //     }
    //   }
      
    //  // doc.line(10, i - 5, 200, i - 5);
    
    //  doc.setFontSize(10);
     
     
    //        // window.open(doc.output('bloburl'), '_blank');
    //     //window.open(doc.output('blobUrl'));  // will open a new tab
    //     var blob = doc.output("blob");
    //     window.open(URL.createObjectURL(blob));
    
    //   }
    
   }
    

   open3(content) {
    this.prepareGrid3();
    this.modalService.open(content, { size: "lg" });
  }

  open4(content) {
    this.prepareGrid4(this.site_code);
    this.modalService.open(content, { size: "lg" });
  }

  prepareGrid3() {
    this.columnDefinitions3 = [
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
        name: "code specification",
        field: "si_site",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "si_desc",
        name: "description",
        field: "si_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
     
    ];
  
    this.gridOptions3 = {
        enableSorting: true,
        enableCellNavigation: true,
        enableExcelCopyBuffer: true,
        enableFiltering: true,
        autoEdit: false,
        autoHeight: true,
        frozenColumn: 0,
        frozenBottom: true,
        enableRowSelection: true,
        enableCheckboxSelector: true,
        multiSelect: false,
        // rowSelectionOptions: {selectActiveRow: false}
    };
  
    // fill the dataset with your data
    this.projectService
      .getAllSites()
      .subscribe((response: any) => {
        console.log(response.data)
        this.sites = response.data});
  }

  prepareGrid4(site_code : any) {
    this.columnDefinitions4 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "emp_fname",
        name: "Nom",
        field: "emp_fname",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "emp_lname",
        name: "Prenom",
        field: "emp_lname",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
     
    ];
  
    this.gridOptions4 = {
        enableSorting: true,
        enableCellNavigation: true,
        enableExcelCopyBuffer: true,
        enableFiltering: true,
        autoEdit: false,
        autoHeight: true,
        frozenColumn: 0,
        frozenBottom: true,
        enableRowSelection: true,
        enableCheckboxSelector: true,
        multiSelect: true,
        rowSelectionOptions: {selectActiveRow: false}
    };
  
    // fill the dataset with your data
    this.employeService
      .getBy({emp_site : site_code})
      .subscribe((response: any) => {
        console.log(response.data)
        this.emps = response.data});
  }

  angularGridReady3(angularGrid: AngularGridInstance) {
    this.angularGrid3 = angularGrid;
    this.gridService3 = angularGrid.gridService;
    this.gridObj3 = (angularGrid && angularGrid.slickGrid && angularGrid.gridService) || {};
  }

  angularGridReady4(angularGrid: AngularGridInstance) {
    this.angularGrid4 = angularGrid;
    this.gridService4 = angularGrid.gridService;
    this.gridObj4 = (angularGrid && angularGrid.slickGrid && angularGrid.gridService) || {};
  }

  handleSelectedRowsChanged3(e, args) {
    this.selectedIndexesSite =[]
    this.selectedIndexesSite = args.rows;
    this.site_code = this.gridService3.getDataItemByRowIndex(this.selectedIndexesSite[0]).si_site
    this.prepareGrid4(this.site_code)
    console.log(this.site_code)

  }

}
