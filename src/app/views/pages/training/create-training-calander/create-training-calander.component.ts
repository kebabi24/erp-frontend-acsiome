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
import { TrainingcalenderService, Trainingcalender, CodeService , SiteService,ProviderService, ItemService,PopulationemployeService,} from "../../../../core/erp";
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

  vends: [];
  columnDefinitionsvend: Column[] = [];
  gridOptionsvend: GridOption = {};
  gridObjvend: any;
  gridServicevend: GridService;
  angularGridvend: AngularGridInstance;
  year:any[] = [];
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
    private populationemployeService: PopulationemployeService,
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
      
      tc_site: [this.trainingcalender.tc_site,  Validators.required],
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
              tc_site:controls.tc_site.value
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
    const code_value  = controls.tc_site.value
    this.codeService.getBy({code_fldname:"pt_draw",code_value:code_value}).subscribe((res:any)=>{
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
changeSite() {
  const controls = this.trainingForm.controls;
  const si_site = controls.tc_site.value;
  
  this.siteService.getByOne({ si_site }).subscribe(
    (res: any) => {

      if (!res.data) {

          alert("Site n'existe pas  ")
          controls.tc_site.setValue(null);
          document.getElementById("tc_site").focus();
        }
    
    });
}
  
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
    _trainingcalender.tc_site = controls.tc_site.value;
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
    const url = `/`;
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
               tc_site: controls.tc_site.value,
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

      {
        id: "tc_pop",
        name: "Population",
        field: "tc_pop",
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
            "openPopsGrid"
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
        name: "Fournisseur",
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
  

    if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
      
            controls.tc_site.setValue(item.si_site || "");
            this.onChangeCode()
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
        id: "pt_rollup",
        name: "Fidélité",
        field: "pt_rollup",
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

       
          updateItem.tc_pop = item.pop_code;
        
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
        id: "pop_code",
        name: "Code Population",
        field: "pop_code",
        sortable: true,
        minWidth: 70,
        resizeExtraWidthPadding: 20,
        filterable: true,
        type: FieldType.string,
        
    },
    {
        id: "pop_desc",
        name: "Désignation",
        field: "pop_desc",
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
    this.populationemployeService.getAll().subscribe((response: any) => (this.pops = response.data));
  }
  openpop(content) {
    this.prepareGridpop();
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
      name: "Fournisseur",
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






}
