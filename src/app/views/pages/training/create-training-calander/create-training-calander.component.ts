import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  GridService,
  FieldType,
  Formatters,
  OnEventArgs,
} from "angular-slickgrid";
import { BehaviorSubject, Observable } from "rxjs";
import { FormGroup, FormBuilder, Validators, NgControlStatus } from "@angular/forms"
import { TrainingcalenderService, Trainingcalender, CodeService , SiteService,ProviderService, ItemService,CRMService,} from "../../../../core/erp";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud"


@Component({
  selector: 'kt-create-training-calander',
  templateUrl: './create-training-calander.component.html',
  styleUrls: ['./create-training-calander.component.scss']
})
export class CreateTrainingCalanderComponent implements OnInit {

  
  trainingForm: FormGroup;
  row_number;

  isExist = false

  
  data: [];
  columnDefinitions3: Column[] = [];
  gridOptions3: GridOption = {};
  gridObj3: any;
  angularGrid3: AngularGridInstance;
  error = false;

  
  datajob: [];
  columnDefinitionsjob: Column[] = [];
  gridOptionsjob: GridOption = {};
  gridObjjob: any;
  angularGridjob: AngularGridInstance;

  datalevel: [];
  columnDefinitionslevel: Column[] = [];
  gridOptionslevel: GridOption = {};
  gridObjlevel: any;
  angularGridlevel: AngularGridInstance;

  datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;

  domains: [];
  columnDefinitionsdomain: Column[] = [];
  gridOptionsdomain: GridOption = {};
  gridObjdomain: any;
  angularGriddomain: AngularGridInstance;

  // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];
  trainingcalender: Trainingcalender;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;

  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  gridService4: GridService;
  angularGrid4: AngularGridInstance;

  pops: [];
  columnDefinitionspop: Column[] = [];
  gridOptionspop: GridOption = {};
  gridObjpop: any;
  gridServicepop: GridService;
  angularGridpop: AngularGridInstance;

  params: [];
  columnDefinitionsparam: Column[] = [];
  gridOptionsparam: GridOption = {};
  gridObjparam: any;
  gridServiceparam: GridService;
  angularGridparam: AngularGridInstance;
  
  selectedTypes:any;
  types: [];
  columnDefinitionstype: Column[] = [];
  gridOptionstype: GridOption = {};
  gridObjtype: any;
  gridServicetype: GridService;
  angularGridtype: AngularGridInstance;

  activitys: [];
  columnDefinitionsactivity: Column[] = [];
  gridOptionsactivity: GridOption = {};
  gridObjactivity: any;
  gridServiceactivity: GridService;
  angularGridactivity: AngularGridInstance;

  metiers: [];
  columnDefinitionsmetier: Column[] = [];
  gridOptionsmetier: GridOption = {};
  gridObjmetier: any;
  gridServicemetier: GridService;
  angularGridmetier: AngularGridInstance;

  wilayas: [];
  columnDefinitionswilaya: Column[] = [];
  gridOptionswilaya: GridOption = {};
  gridObjwilaya: any;
  gridServicewilaya: GridService;
  angularGridwilaya: AngularGridInstance;

  vends: [];
  columnDefinitionsvend: Column[] = [];
  gridOptionsvend: GridOption = {};
  gridObjvend: any;
  gridServicevend: GridService;
  angularGridvend: AngularGridInstance;
  year:any[] = [];
  selectedT:  any[] = [];
  selectedA:  any[] = [];
  selectedM:  any[] = [];
  selectedW:  any[] = [];
  selectedActivitys:any;
  selectedMetiers:any;
  selectedWilayas:any;
  
  constructor(
    config: NgbDropdownConfig,
    private trainingFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public  dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private trainingcalenderService: TrainingcalenderService,
    private codeService: CodeService,
    private siteService: SiteService,
    private providerService: ProviderService,
    private itemsService: ItemService,
    private crmService: CRMService,
  ) {
    config.autoClose = true;
    var y : Number
    for(var i=2023; i <= 2099;i++) {
      y = i
      this.year.push({y})
    }
  }

  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  ngOnInit(): void {
    this.reset();
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.createForm();
    this.initmvGrid();
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.trainingcalender = new Trainingcalender();
    this.trainingForm = this.trainingFB.group({
    
      tc_year: [this.trainingcalender.tc_year ,  Validators.required],
      
      // tc_site: [this.trainingcalender.tc_site,  Validators.required],
      tc_service: [this.trainingcalender.tc_service,  Validators.required],

     
    });
  }

 
  onChangeCode() {
    this.mvdataset=[]
    const controls = this.trainingForm.controls
    this.trainingcalenderService
        .getBy({
             
              tc_year:controls.tc_year.value,
              tc_service:controls.tc_service.value,
              //tc_site:controls.tc_site.value
        })
        .subscribe((response: any) => {
         
            if (response.data ) {
              console.log(response.data)
                
              this.mvdataset = response.data
              this.mvdataView.setItems(this.mvdataset)
              
            } 
     })
  }
  changeService(){
    const controls = this.trainingForm.controls // chof le champs hada wesh men form rah
    // const code_value  = controls.tc_site.value
    this.codeService.getBy({code_fldname:"pt_draw"}).subscribe((res:any)=>{
        const {data} = res
        console.log(res)
        if (!data){ 
          alert("Ce Service n' existe pas")
          controls.tc_service.setValue(null);
          document.getElementById("tc_service").focus();

    this.error = true}
        else {
            this.error = false
        }


    },error=>console.log(error))
}
// changeSite() {
//   const controls = this.trainingForm.controls;
//   // const si_site = controls.tc_site.value;
  
//   this.siteService.getByOne({ si_site }).subscribe(
//     (res: any) => {

//       if (!res.data) {

//           alert("Site n'existe pas  ")
//           controls.tc_site.setValue(null);
//           document.getElementById("tc_site").focus();
//         }
    
//     });
// }
  
  //reste form
  reset() {
    this.trainingcalender = new Trainingcalender();
    this.mvdataset=[]
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.trainingForm.controls;
    /** check form */
    if (this.trainingForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    // tslint:disable-next-line:prefer-const
    let tr = this.preparetraining();
    for (let data of this.mvdataset) {
      delete data.id;
      delete data.cmvid;
    }
    this.addtraining(tr, this.mvdataset);
  }
  /**
   * Returns object for saving
   */
  preparetraining(): Trainingcalender {
    const controls = this.trainingForm.controls;
    const _trainingcalender = new Trainingcalender();
    
    _trainingcalender.tc_year = controls.tc_year.value;
    // _trainingcalender.tc_site = controls.tc_site.value;
    _trainingcalender.tc_service = controls.tc_service.value;
    return _trainingcalender;
  }
  /**
   * Add code
   *
   * @param _trainingcalender: TaskModel
   */
  addtraining(_trainingcalender: Trainingcalender, details: any) {
    this.loadingSubject.next(true);
    this.trainingcalenderService
      .add({ Trainingcalender: _trainingcalender, TrainingcalenderDetails: details })
      .subscribe(
        (reponse) => console.log("response", Response),
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
          this.reset();
          this.router.navigateByUrl("/training/create-training-calander");
        }
      );
  }

  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/training/training-session-list`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  initmvGrid() {
    this.mvcolumnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          const controls = this.trainingForm.controls;
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.trainingcalenderService.deletes(
              {tc_year: controls.tc_year.value,
              //  tc_site: controls.tc_site.value,
               tc_service: controls.tc_service.value,
               tc_part: args.dataContext.tc_part,
               tc_pop: args.dataContext.tc_pop,
               tc_session_nbr: args.dataContext.tc_session_nbr,
               tc_vend: args.dataContext.tc_vend, 
             
              }
              ).subscribe(
              (response: any) => {
                 console.log(response.data)
               
                this.layoutUtilsService.showActionNotification(
                  "Supression avec succès",
                  MessageType.Create,
                  10000,
                  true,
                  true
                );
                this.loadingSubject.next(false);
              },
              (error) => {
                  console.log(error)
              },
            )
            this.mvangularGrid.gridService.deleteItem(args.dataContext);

          }
        },
      },
      {
        id: "tc_site",
        name: "Site",
        field: "tc_site",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "svidl",
        field: "sitevidl",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
            this.row_number = args.row;
            let element: HTMLElement = document.getElementById(
            "openSiteGrid"
            ) as HTMLElement;
            element.click();
        },
      }, 
      {
        id: "tc_part",
        name: "Code Formation",
        field: "tc_part",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvidl",
        field: "cmvidl",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
            this.row_number = args.row;
            let element: HTMLElement = document.getElementById(
            "openItemsGrid"
            ) as HTMLElement;
            element.click();
        },
      },  
      {
        id: "tc_desc",
        name: "Description",
        field: "tc_desc",
        sortable: true,
        width: 200,
        filterable: false,
        type: FieldType.string,
      
      },

      // {
      //   id: "tc_pop",
      //   name: "Population",
      //   field: "tc_pop",
      //   sortable: true,
      //   width: 50,
      //   filterable: false,
      //   type: FieldType.string,
      //   editor: {
      //     model: Editors.text,
      //   },
      // },
      // {
      //   id: "mvidl",
      //   field: "cmvidl",
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.infoIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //       this.row_number = args.row;
      //       let element: HTMLElement = document.getElementById(
      //       "openPopsGrid"
      //       ) as HTMLElement;
      //       element.click();
      //   },
      // },
      {
        id: "chr02",
        name: "Type",
        field: "chr02",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvidl3",
        field: "cmvidl3",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
            this.row_number = args.row;
            let element: HTMLElement = document.getElementById(
            "openTypesGrid"
            ) as HTMLElement;
            element.click();
        },
      }, 
      {
        id: "chr03",
        name: "Activité",
        field: "chr03",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvidl4",
        field: "cmvidl4",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
            this.row_number = args.row;
            let element: HTMLElement = document.getElementById(
            "openactivitysGrid"
            ) as HTMLElement;
            element.click();
        },
      },
      {
        id: "chr04",
        name: "Metier",
        field: "chr04",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvidl5",
        field: "cmvidl5",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
            this.row_number = args.row;
            let element: HTMLElement = document.getElementById(
            "openMetiersGrid"
            ) as HTMLElement;
            element.click();
        },
      },
      {
        id: "chr05",
        name: "Wilaya",
        field: "chr05",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvidl6",
        field: "cmvidl6",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
            this.row_number = args.row;
            let element: HTMLElement = document.getElementById(
            "openWilayasGrid"
            ) as HTMLElement;
            element.click();
        },
      },    
      {
        id: "tc_session_nbr",
        name: "N° Session",
        field: "tc_session_nbr",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.integer,
        editor: {
          model: Editors.integer,
        },
      },
     
      {
        id: "tc_vend",
        name: "Organisme de formation",
        field: "tc_vend",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvidl",
        field: "cmvidl",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
            this.row_number = args.row;
            let element: HTMLElement = document.getElementById(
            "openVendsGrid"
            ) as HTMLElement;
            element.click();
        },
      },    
      
      {
        id: "tc_start_date",
        name: "Date Début",
        field: "tc_start_date",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.dateIso,
        editor: {
          model: Editors.date,
        },
      },
      {
        id: "tc_end_date",
        name: "Date Fin",
        field: "tc_end_date",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.dateIso,
        editor: {
          model: Editors.date,
        },
      },
      
    ];

    this.mvgridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      rowHeight:40,
    };

    this.mvdataset = [];
  }
  addNewItem() {
    const newId = this.mvdataset.length+1;

    const newItem = {
      id: newId,
      tc_part : null,
      tc_desc: null,
      tc_session_nbr: 0,
      tc_pop: null,
      tc_vend:null,
      tc_start_date:null,
      tc_end_date:null
    };
    this.mvgridService.addItem(newItem, { position: "bottom" });
  }



  handleSelectedRowsChangeddomain(e, args) {
    const controls = this.trainingForm.controls;
    if (Array.isArray(args.rows) && this.gridObjdomain) {
      args.rows.map((idx) => {
        const item = this.gridObjdomain.getDataItem(idx);
        controls.tc_service.setValue(item.code_value || "");
        this.onChangeCode()
      });
    }
  }

  angularGridReadydomain(angularGrid: AngularGridInstance) {
    this.angularGriddomain = angularGrid;
    this.gridObjdomain = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGriddomain() {
    this.columnDefinitionsdomain = [
     
      {
        id: "code_value",
        name: "Code Domaine",
        field: "code_value",
        sortable: true,
        minWidth: 70,
        maxWidth: 100,
        filterable: true,
        type: FieldType.string,
      
    },
    {
        id: "code_cmmt",
        name: "Désignation",
        field: "code_cmmt",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
        
    },   
    ];

    this.gridOptionsdomain = {
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
    this.codeService
      .getBy({code_fldname:"pt_draw"})
      .subscribe((response: any) => (this.domains = response.data));
  }
  openservice(content) {
    this.prepareGriddomain();
    this.modalService.open(content, { size: "lg" });
  }


  handleSelectedRowsChangedsite(e, args) {
    const controls = this.trainingForm.controls;
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);
        console.log(item);

       
          updateItem.tc_site = item.si_site;
          // updateItem.tc_desc = item.pt_desc1;
          
          this.mvgridService.updateItem(updateItem);
       
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
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "si_desc",
        name: "Designation",
        field: "si_desc",
        sortable: true,
        filterable: true,
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
      checkboxSelector: {},
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };

    // fill the dataset with your data
    this.siteService
      .getAll()
      .subscribe((response: any) => (this.datasite = response.data));
  }
  opensite(contentsite) {
    this.prepareGridsite();
    this.modalService.open(contentsite, { size: "lg" });
  }

  handleSelectedRowsChanged4(e, args) {
    const controls = this.trainingForm.controls;
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        console.log(item);

       
          updateItem.tc_part = item.pt_part;
          updateItem.tc_desc = item.pt_desc1;
          
          this.mvgridService.updateItem(updateItem);
       
      });
    }
  }
  angularGridReady4(angularGrid: AngularGridInstance) {
    this.angularGrid4 = angularGrid;
    this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid4() {
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
        id: "pt_part",
        name: "code ",
        field: "pt_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pt_desc1",
        name: "desc",
        field: "pt_desc1",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pt_draw",
        name: "Domaine",
        field: "pt_draw",
        type: FieldType.string,
        sortable: true,
        filterable:true,
      },     
      {
        id: "pt_group",
        name: "Rubrique",
        field: "pt_group",
        type: FieldType.string,
        sortable: true,
       
      },     
      {
        id: "pt_formula",
        name: "Ext / Int",
        field: "pt_formula",
        type: FieldType.boolean,
        formatter: Formatters.checkmark,
        filterable:true,
        sortable: true,
       
      },      
      {
        id: "pt_ms",
        name: "Certification",
        field: "pt_ms",
        type: FieldType.boolean,
        formatter: Formatters.checkmark,
        filterable:true,
        sortable: true,
       
      },      
      {
        id: "pt_phantom",
        name: "Fidélité",
        field: "pt_phantom",
        type: FieldType.boolean,
        formatter: Formatters.checkmark,
        filterable:true,
        sortable: true,
       
      },    
      {
        id: "pt_origin",
        name: "Pays",
        field: "pt_origin",
        type: FieldType.string,
        filterable:true,
        sortable: true,
       
      },      
      {
        id: "pt_meter_um",
        name: "Mesure d'accompagnement",
        field: "pt_meter_um",
        type: FieldType.string,
        filterable:true,
        sortable: true,
       
      },      
     
    ];

    this.gridOptions4 = {
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
    const controls = this.trainingForm.controls
     this.itemsService.getBy(
      {pt_part_type:"FORMATION"}).subscribe((response: any) => (this.items = response.data));
  }
  open4(content) {
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }



  handleSelectedRowsChangedpop(e, args) {
    const controls = this.trainingForm.controls;
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjpop) {
      args.rows.map((idx) => {
        const item = this.gridObjpop.getDataItem(idx);
        console.log(item);

       
          updateItem.tc_pop = item.population_code;
        
          this.mvgridService.updateItem(updateItem);
       
      });
    }
  }
  angularGridReadypop(angularGrid: AngularGridInstance) {
    this.angularGridpop = angularGrid;
    this.gridObjpop = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridpop() {
    this.columnDefinitionspop = [
      {
        id: "id",
        name: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        minWidth: 40,
        maxWidth: 50,
        sortable:true,
    },
    {
        id: "population_code",
        name: "Code Population",
        field: "population_code",
        sortable: true,
        minWidth: 70,
        resizeExtraWidthPadding: 20,
        filterable: true,
        type: FieldType.string,
        
    },
    {
        id: "population_desc",
        name: "Désignation",
        field: "population_desc",
        sortable: true,
        minWidth: 100,
        filterable: true,
        type: FieldType.string,
    },
     
    ];

    this.gridOptionspop = {
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
     this.crmService.getPopulations().subscribe((response: any) => (this.pops = response["data"]));
  }
  openpop(content) {
    this.prepareGridpop();
    this.modalService.open(content, { size: "lg" });
  }
handleSelectedRowsChangedparam(e, args) {
    const controls = this.trainingForm.controls;
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjparam) {
      args.rows.map((idx) => {
        const item = this.gridObjparam.getDataItem(idx);
        console.log(item);

       
          updateItem.chr01 = item.param_code;
        
          this.mvgridService.updateItem(updateItem);
       
      });
    }
  }
  angularGridReadyparam(angularGrid: AngularGridInstance) {
    this.angularGridparam = angularGrid;
    this.gridObjparam = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridparam() {
    this.columnDefinitionsparam = [
      {
        id: "id",
        name: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        minWidth: 40,
        maxWidth: 50,
        sortable:true,
    },
    {
        id: "param_code",
        name: "Code Paramètre",
        field: "param_code",
        sortable: true,
        minWidth: 70,
        resizeExtraWidthPadding: 20,
        filterable: true,
        type: FieldType.string,
        
    },
    {
        id: "description",
        name: "Désignation",
        field: "description",
        sortable: true,
        minWidth: 100,
        filterable: true,
        type: FieldType.string,
    },
     
    ];

    this.gridOptionsparam = {
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
     this.crmService.getParams().subscribe((response: any) => (this.params = response["data"]));
  }
  openparam(content) {
    this.prepareGridparam();
    this.modalService.open(content, { size: "lg" });
  }
  handleSelectedRowsChangedtype(e, args) {
    this.selectedT = [];
     this.selectedT = args.rows;
  }
  angularGridReadytype(angularGrid: AngularGridInstance) {
    this.angularGridtype = angularGrid;
    this.gridObjtype = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridtype() {
    this.columnDefinitionstype = [
      {
        id: "id",
        name: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        minWidth: 40,
        maxWidth: 50,
        sortable:true,
    },
    {
        id: "code_value",
        name: "type",
        field: "code_value",
        sortable: true,
        minWidth: 70,
        resizeExtraWidthPadding: 20,
        filterable: true,
        type: FieldType.string,
        
    },
    {
        id: "code_cmmt",
        name: "Désignation",
        field: "code_cmmt",
        sortable: true,
        minWidth: 100,
        filterable: true,
        type: FieldType.string,
    },
     
    ];

    this.gridOptionstype = {
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
      multiSelect: true,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false,
      },
      presets: {
        sorters: [{ columnId: "id", direction: "ASC" }],
        rowSelection: {
          // gridRowIndexes: [2],           // the row position of what you see on the screen (UI)
          gridRowIndexes: this.selectedT, // (recommended) select by your data object IDs
          //dataContextIds
        },
      },
    };

    // fill the dataset with your data
     this.codeService.getBy({code_fldname:'cm_type'}).subscribe((response: any) => (this.types = response["data"]));
  }
  opentype(content) {
    this.prepareGridtype();
    this.modalService.open(content, { size: "lg" });
  }
  handleSelectedRowsChangedactivity(e, args) {
    this.selectedA = [];
     this.selectedA = args.rows;
  }
  angularGridReadyactivity(angularGrid: AngularGridInstance) {
    this.angularGridactivity = angularGrid;
    this.gridObjactivity = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridactivity() {
       this.columnDefinitionsactivity = [
      {
        id: "id",
        name: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        minWidth: 40,
        maxWidth: 50,
        sortable:true,
    },
    {
        id: "code_value",
        name: "type",
        field: "code_value",
        sortable: true,
        minWidth: 70,
        resizeExtraWidthPadding: 20,
        filterable: true,
        type: FieldType.string,
        
    },
    {
        id: "code_cmmt",
        name: "Désignation",
        field: "code_cmmt",
        sortable: true,
        minWidth: 100,
        filterable: true,
        type: FieldType.string,
    },
     
    ];

    this.gridOptionsactivity = {
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
      multiSelect: true,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false,
      },
      presets: {
        sorters: [{ columnId: "id", direction: "ASC" }],
        rowSelection: {
          // gridRowIndexes: [2],           // the row position of what you see on the screen (UI)
          gridRowIndexes: this.selectedA, // (recommended) select by your data object IDs
          //dataContextIds
        },
      },
    };

    // fill the dataset with your data
     this.codeService.getBy({code_fldname:'cm_class'}).subscribe((response: any) => (this.activitys = response["data"]));
  }
  openactivity(content) {
    this.prepareGridactivity();
    this.modalService.open(content, { size: "lg" });
  }
  handleSelectedRowsChangedmetier(e, args) {
    this.selectedM = [];
     this.selectedM = args.rows;
  }
  angularGridReadymetier(angularGrid: AngularGridInstance) {
    this.angularGridmetier = angularGrid;
    this.gridObjmetier = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridmetier() {
      this.columnDefinitionsmetier = [
      {
        id: "id",
        name: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        minWidth: 40,
        maxWidth: 50,
        sortable:true,
    },
    {
        id: "code_value",
        name: "metier",
        field: "code_value",
        sortable: true,
        minWidth: 70,
        resizeExtraWidthPadding: 20,
        filterable: true,
        type: FieldType.string,
        
    },
    {
        id: "code_cmmt",
        name: "Désignation",
        field: "code_cmmt",
        sortable: true,
        minWidth: 100,
        filterable: true,
        type: FieldType.string,
    },
     
    ];

    this.gridOptionsmetier = {
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
      multiSelect: true,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false,
      },
      presets: {
        sorters: [{ columnId: "id", direction: "ASC" }],
        rowSelection: {
          // gridRowIndexes: [2],           // the row position of what you see on the screen (UI)
          gridRowIndexes: this.selectedM, // (recommended) select by your data object IDs
          //dataContextIds
        },
      },
    };

    // fill the dataset with your data
     this.codeService.getBy({code_fldname:'rep_job'}).subscribe((response: any) => (this.metiers = response["data"]));
  }
  openmetier(content) {
    this.prepareGridmetier();
    this.modalService.open(content, { size: "lg" });
  }
  handleSelectedRowsChangedwilaya(e, args) {
     this.selectedW = [];
     this.selectedW = args.rows;
  }
  angularGridReadywilaya(angularGrid: AngularGridInstance) {
    this.angularGridwilaya = angularGrid;
    this.gridObjwilaya = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridwilaya() {
      this.columnDefinitionswilaya = [
      {
        id: "id",
        name: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        minWidth: 40,
        maxWidth: 50,
        sortable:true,
    },
    {
        id: "code_value",
        name: "type",
        field: "code_value",
        sortable: true,
        minWidth: 70,
        resizeExtraWidthPadding: 20,
        filterable: true,
        type: FieldType.string,
        
    },
    {
        id: "code_cmmt",
        name: "Désignation",
        field: "code_cmmt",
        sortable: true,
        minWidth: 100,
        filterable: true,
        type: FieldType.string,
    },
     
    ];

    this.gridOptionswilaya = {
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
      multiSelect: true,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false,
      },
      presets: {
        sorters: [{ columnId: "id", direction: "ASC" }],
        rowSelection: {
          // gridRowIndexes: [2],           // the row position of what you see on the screen (UI)
          gridRowIndexes: this.selectedW, // (recommended) select by your data object IDs
          //dataContextIds
        },
      },
    };

    // fill the dataset with your data
     this.codeService.getBy({code_fldname:'ad_state'}).subscribe((response: any) => (this.wilayas = response["data"]));
  }
  openwilaya(content) {
    this.prepareGridwilaya();
    this.modalService.open(content, { size: "lg" });
  }

  handleSelectedRowsChangedvend(e, args) {
    const controls = this.trainingForm.controls;
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjvend) {
      args.rows.map((idx) => {
        const item = this.gridObjvend.getDataItem(idx);
        console.log(item);

       
          updateItem.tc_vend = item.vd_addr;
        
          this.mvgridService.updateItem(updateItem);
       
      });
    }
  }
  angularGridReadyvend(angularGrid: AngularGridInstance) {
    this.angularGridvend = angularGrid;
    this.gridObjvend = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridvend() {
    this.columnDefinitionsvend = [
      {
        id: "id",
        name: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        minWidth: 40,
        maxWidth: 50,
        sortable:true,
    },
    {
      id: "vd_addr",
      name: "code",
      field: "vd_addr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_name",
      name: "Formateur",
      field: "address.ad_name",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_line1",
      name: "Adresse",
      field: "address.ad_line1",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_line2",
      name: "Adresse",
      field: "address.ad_line2",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },

    {
      id: "ad_city",
      name: "City",
      field: "address.ad_city",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_ctry",
      name: "Pays",
      field: "address.ad_country",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "vd_rmks",
      name: "Matricule Fiscal",
      field: "vd_rmks",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    
    {
      id: "ad_pst_id",
      name: "Article Imposition",
      field: "address.ad_pst_id",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    
    {
      id: "ad_gst_id",
      name: "Registre Commerce",
      field: "address.ad_gst_id",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "vd_type",
      name: "Type",
      field: "vd_type",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    }, 
    {
      id: "vd_sequence",
      name: "Sequence",
      field: "vd_seq",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
     
    ];

    this.gridOptionsvend = {
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
    this.providerService.getAll().subscribe((response: any) => (this.vends = response.data));
  }
  openvend(content) {
    this.prepareGridvend();
    this.modalService.open(content, { size: "lg" });
  }

  onAlertClose($event) {
  this.hasFormErrors = false
}

getType(){
  let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  var l: String;
  l = "";
  console.log(l.length);
    
  this.selectedT.forEach((index) => {
    console.log(l)
    if(l==""){l = this.types[index]["code_value"]}
    else{l = l + ',' + this.types[index]["code_value"]}
      
    });

  updateItem.chr02 = l;
  this.mvgridService.updateItem(updateItem);  
  this.modalService.dismissAll()
  // let element: HTMLElement = document.getElementById('openTrsGrid') as HTMLElement;
  // element.click();
}

getActivity(){
 let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  var l: String;
  l = "";
  console.log(l.length);
    
  this.selectedA.forEach((index) => {
    if(l==""){l = this.activitys[index]["code_value"]}
    else{l = l + ',' + this.activitys[index]["code_value"]}
      
    });

  updateItem.chr03 = l;
  this.mvgridService.updateItem(updateItem);  
  this.modalService.dismissAll()
  
}

getMetier(){
   let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  var l: String;
  l = "";
  console.log(l.length);
    
  this.selectedM.forEach((index) => {
    if(l==""){l = this.metiers[index]["code_value"]}
    else{l = l + ',' + this.metiers[index]["code_value"]}
      
    });

  updateItem.chr04 = l;
  this.mvgridService.updateItem(updateItem);  
  this.modalService.dismissAll()
  
}

getWilaya(){
  let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  var l: String;
  l = "";
  console.log(l.length);
    
  this.selectedW.forEach((index) => {
    if(l==""){l = this.wilayas[index]["code_value"]}
    else{l = l + ',' + this.wilayas[index]["code_value"]}
      
    });

  updateItem.chr05 = l;
  this.mvgridService.updateItem(updateItem);  
  this.modalService.dismissAll()
  
}

}
