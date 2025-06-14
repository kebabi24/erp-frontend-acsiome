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
    Formatters,
    Editor,
    Editors,
    Filters,
    AngularGridInstance,
    FieldType, GridService,
    OnEventArgs
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

import { LocationService,Location,Site, SiteService, ProjectService,QualityControlService, EmployeService,AffectEmpService, AffectEmp,Item,
  ItemService,} from "../../../../core/erp"
import jsPDF from "jspdf"
import { head } from "lodash"
import * as _ from "lodash"
import html2canvas from "html2canvas" 
import { preserveWhitespacesDefault } from "@angular/compiler"

@Component({
  selector: 'kt-training-hot-eval', 
  templateUrl: './training-hot-eval.component.html',
  styleUrls: ['./training-hot-eval.component.scss']
})
export class TrainingHotEvalComponent implements OnInit {
    site: Site
    accidentForm: FormGroup
    hasFormErrors = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    isExist = false
    error = false;
    msg: String;
    row_number;
    // NEW 
    doc_code : String ;
    doc_desc : String ;
    quantitytypesList = [
      { value: 0, label: 'Très insatisfait' },
      { value: 1, label: 'Insatisfait' },
      { value: 2, label: 'satisfait moyennement' },
      { value: 3, label: 'satisfait' },
      { value: 4, label: 'Très satisfait' },
    ];
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
    
  datasets: []
  columnDefinitionss: Column[] = []
  gridOptionss: GridOption = {}
  gridObjs: any
  angularGrids: AngularGridInstance

  // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];

  new_even_time = { hour: 13, minute: 30 };

  emp_name :any ; 
  accident_date : any ; 
  site_name : any;
  pme_nbr:any;  
  pme_inst:any;
  domain:any;
  user:any;
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
        private affectEmpService: AffectEmpService,
        private locationService:LocationService,
        private itemService:ItemService,
    ) {
        config.autoClose = true
    }

    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.getSpecificationDetails()
        this.createForm()
        this.prepareGrid()
        this.initmvGrid();
        this.user = JSON.parse(localStorage.getItem("user"));
        this.domain = this.user.usrd_domain
        console.log(this.domain)
    }
    //create form
    createForm() {
      this.loadingSubject.next(false)
        const date = new Date()
        this.accidentForm = this.siteFB.group({
            name: [this.doc_code],
            description: [this.doc_code],
            accident_date: [{
              year:date.getFullYear(),
              month: date.getMonth()+1,
              day: date.getDate()
            }],
            pme_nbr:[this.pme_nbr],
            pme_inst:[this.pme_inst],
            site_code: [this.site_code ],
            emp_code: [this.emp_code ],
            pmdesc:[''],
            comment:[''],

        })

        const m = Number(date.getMonth())+ 1
        console.log(m)
        const date2 = date.getFullYear() + '-' + m + '-' + date.getDate()
        this.accident_date = date2
       
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
          "EVALUATION A CHAUD"
         ).subscribe((response: any) => {
            this.data = response.data.specificationDetails 
            this.defaultData = response.data.specificationDetails 
            this.data.forEach(element => {
              element.checked = false
            });

            const fileterd = _.mapValues(_.groupBy(this.data, 'mpd_chr01'));  
            const filtered_elements = [];
            for (const [key, value] of Object.entries(fileterd)) {
              filtered_elements.push({
                group_title: key,
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
        this.accident_date = date.toString()
        

        let lines = []
        this.mvdataset.forEach(element => {
          let pass = false;
          if(element.mpd_tol > 1){pass = true}
          // this.tableBody.push([element.asset_desc,element.asset_serial,element.asset_comment])
          lines.push({
            mph_part: controls.pme_inst.value,
            mph_routing : element.mpd_nbr, // code specification 
            mph_op: element.mpd_type,
            mph_procedure: element.mpd_chr01,
            mph_test : element.mpd_label,
            mph_date :date,
            mph_rsult:element.mpd_tol,
            mph_lot  :controls.pme_nbr.value, 
            mph_mch : this.emp_code,
            mph_pass : pass,  
            mph_cmt:element.mpd_chr02,
            mph_domain:this.domain,
            mph_chr01:controls.pmdesc.value,
            mph_chr03:controls.comment.value,
            mph_chr02:this.emp_name,
           
          })
          element.mpd_tol = null
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
              this.loadingSubject.next(true)
              this.router.navigateByUrl("/training/training-hot-eval");
              // this.data= this.default

                            
              
              this.emp_name = ""
              this.site_code = ""
              this.site_name = ""
              this.emp_code = ""
              this.doc_code = ""
              
              this.createForm()
              // this.savePdf()
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
        id: "loc_site",
        name: "code specification",
        field: "loc_site",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "loc_loc",
        name: "code emplacemnt",
        field: "loc_loc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "loc_desc",
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
    this.locationService.getBy({})
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
        id: "pme_employe",
        name: "Code",
        field: "pme_employe",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "chr02",
        name: "Nom",
        field: "chr02",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "chr03",
        name: "Prenom",
        field: "chr03",
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
    const controls = this.accidentForm.controls
    this.affectEmpService.getBy({pme_nbr:controls.pme_nbr.value})
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
    const controls = this.accidentForm.controls
    controls.site_code.setValue(this.site_code || "")
    
    this.site_name = this.gridService3.getDataItemByRowIndex(this.selectedIndexesSite[0]).si_desc

  }

  handleSelectedRowsChanged4(e, args) {
    this.selectedIndexesEmp =[]
    this.selectedIndexesEmp = args.rows;
    this.emp_code = this.gridService4.getDataItemByRowIndex(this.selectedIndexesEmp[0]).pme_employe
    // this.prepareGrid4(this.site_code)
    console.log(this.emp_code)
    const controls = this.accidentForm.controls
    controls.emp_code.setValue(this.emp_code || "")
    const empName = this.gridService4.getDataItemByRowIndex(this.selectedIndexesEmp[0]).chr02 +' '+this.gridService4.getDataItemByRowIndex(this.selectedIndexesEmp[0]).chr03
    this.emp_name = empName
    controls.name.setValue(empName || "")
  }

  savePdf(){
    let pdf = new jsPDF('p','mm','a4')
 
   var img = new Image()
   img.src = "./assets/media/logos/accident.png";
   pdf.addImage(img, 'png', 5, 5, 200, 30)
   var infoTableHeight;
   
   // INFO TABLE 
   html2canvas(document.getElementById("tablePdf"),{scale:1}).then(canvas =>{
    
     const tableInfoDataUrl = canvas.toDataURL('image/jpg', 0.1)
     var width = pdf.internal.pageSize.getWidth() - 20;
     var height = canvas.height * width / canvas.width;
     infoTableHeight = height;
     pdf.addImage(tableInfoDataUrl, 'JPG', 10, 40, width, height)
     
    })

    // PART 2
    html2canvas(document.getElementById("tablePdf2"),
    {
      scale: 1,
    }
    ).then(canvas =>{
      const tableInfoDataUrl = canvas.toDataURL('image/jpg',0.1)
      var width = pdf.internal.pageSize.getWidth() - 20;
      var height = canvas.height * width / canvas.width;
      infoTableHeight = height;
      pdf.addPage()
      pdf.addImage(tableInfoDataUrl, 'JPG', 10, 40, width, height)
      
      pdf.save('output.pdf');
     })
  
  }

  onCheckClick(label,tol,group_title){
    const groupIndex = this.data.findIndex(group =>{
      return group.group_title == group_title
   })
   const elementIndex = this.data[groupIndex].elements.findIndex(element =>{
    return element.mpd_label == label,element.mpd_tol == tol
   })
   this.data[groupIndex].elements[elementIndex].checked = !this.data[groupIndex].elements[elementIndex].checked

  }

  onDateUpdate(){
    console.log("date_ updated ")
    const controls = this.accidentForm.controls
        let accident_date = controls.accident_date.value
        const date = accident_date.year + '-' + accident_date.month + '-' + accident_date.day
        this.accident_date = date.toString()
        console.log(this.accident_date)
        console.log(date)
  }

  handleSelectedRowsChangeds(e, args) {
    
    const controls = this.accidentForm.controls // chof le champs hada wesh men form rah
    if (Array.isArray(args.rows) && this.gridObjs) {
      args.rows.map((idx) => {
        const item = this.gridObjs.getDataItem(idx);
        
        
        
        controls.pme_nbr.setValue(item.pme_nbr)
        controls.pme_inst.setValue(item.pme_inst)
        controls.site_code.setValue(item.pme_task)
        this.locationService.getByOne({loc_loc:item.pme_task}).subscribe((loc: any) => {
          console.log(loc.data)
          this.site_name = loc.data.loc_site});
        this.itemService.getByOne({pt_part:item.pme_inst}).subscribe((part: any) => {
            console.log(part.data)
            controls.pmdesc.setValue(part.data.pt_desc1)});
       
    })
   }
  }
  angularGridReadys(angularGrid: AngularGridInstance) {
    this.angularGrids = angularGrid
    this.gridObjs = (angularGrid && angularGrid.slickGrid) || {}
  }
  
  
  prepareGrids() {
    this.columnDefinitionss = [
        {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
        },
        {
            id: "pme_pm_code",
            name: "programme",
            field: "pme_pm_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "pme_nbr",
            name: "session/groupe",
            field: "pme_nbr",
            sortable: true,
            width: 120,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "pme_inst",
          name: "formation",
          field: "pme_inst",
          sortable: true,
          width: 80,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "pme_site",
        name: "formateur",
        field: "pme_site",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
    },
    {
      id: "pme_task",
      name: "salle de formation",
      field: "pme_task",
      sortable: true,
      width: 80,
      filterable: true,
      type: FieldType.string,
  },
  {
  id: "pme_duration",
  name: "Durée",
  field: "pme_duration",
  sortable: true,
  width: 80,
  filterable: true,
  type: FieldType.number,
  },
      
        
    ];
  
    this.gridOptionss = {
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
        },
        multiSelect: false,
        rowSelectionOptions: {
            selectActiveRow: true,
        },
    }
  
    // fill the dataset with your data
    const controls = this.accidentForm.controls
    
    this.affectEmpService
    // {pme_task_status:'C'}
        .getBy({})
        .subscribe((response: any) =>{ 
          this.datasets = response.data
          
        })
  }
  opens(contents) {
   
    this.prepareGrids()
    this.modalService.open(contents, { size: "lg" })
  }

  initmvGrid() {
    this.mvcolumnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        minWidth: 30,
        maxWidth: 30,
       
      },

      {
        id: "mpd_chr01",
        name: "Parametre",
        field: "mpd_chr01",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "mpd_type",
        name: "Ligne",
        field: "mpd_type",
        sortable: true,
        width: 80,
        filterable: false,
       
      },
      {
        id: "mpd_label",
        name: "Description",
        field: "mpd_label",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
      },
      {
        id: "mpd_tol",
        name: "Résultat",
        field: "mpd_tol",
        sortable: true,
        width: 80,
        filterable: false,
        formatter: (_row, _cell, value) => this.quantitytypesList[value]?.label,
        exportCustomFormatter: (_row, _cell, value) => this.quantitytypesList[value]?.label,
        filter: {
          model: Filters.multipleSelect,
          collection: this.quantitytypesList,
        },
        editor: {
          model: Editors.singleSelect,
          collection: this.quantitytypesList,
          
        },
      },
     
      {
        id: "mpd_chr02",
        name: "Observation",
        field: "mpd_chr02",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.longText,
        },
      },
    ];

    this.mvgridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      autoCommitEdit: true,
      autoEdit: true,
    };

    this.mvdataset = [];
     // fill the dataset with your data
     const controls = this.accidentForm.controls
    
     this.qualityControlService.findSpecificationWithDetails(
      "EVALUATION A CHAUD"
     ).subscribe((response: any) => {
        this.mvdataset = response.data.specificationDetails 
           
        
        
     })
  }
  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
}
