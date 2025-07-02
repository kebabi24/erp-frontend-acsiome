import { Component, OnInit } from '@angular/core';

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
  EditorValidator,
  EditorArgs,
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
import { PayMethService,EmployeService, CodeService , ProjectService, TaskService,ProviderService,AffectEmpService, AffectEmp ,SequenceService,ItemService, LocationService,
  CostSimulationService,LocationDetailService,InventoryStatusService,MesureService, SiteService,InventoryTransactionService,TrainingcalenderService,RepertoryService} from "../../../../core/erp";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog"; 
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
import { HttpUtilsService } from "../../../../core/_base/crud"
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY } from "@angular/cdk/overlay/overlay-directives";
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
  selector: 'kt-create-training-session',
  templateUrl: './create-training-session.component.html',
  styleUrls: ['./create-training-session.component.scss']
})

export class CreateTrainingSessionComponent implements OnInit {

  affectEmp: AffectEmp;
  empForm: FormGroup;
  row_number;

  isExist = false
  weekdays: any[] = [];
  emps: []
  columnDefinitionsemp: Column[] = []
  gridOptionsemp: GridOption = {}
  gridObjemp: any
  angularGridemp: AngularGridInstance
  dataViewemp: any;
  gridServiceemp: GridService;

  pays: []
  columnDefinitionspay: Column[] = []
  gridOptionspay: GridOption = {}
  gridObjpay: any
  angularGridpay: AngularGridInstance
  dataViewpay: any;
  gridServicepay: GridService;

  providers: []
  columnDefinitionsprov: Column[] = []
  gridOptionsprov: GridOption = {}
  gridObjprov: any
  angularGridprov: AngularGridInstance

  dataset: []
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  gridObj: any
  angularGrid: AngularGridInstance

  datasets: []
  columnDefinitionss: Column[] = []
  gridOptionss: GridOption = {}
  gridObjs: any
  angularGrids: AngularGridInstance
  
  datasetinst: []
  columnDefinitionsinst: Column[] = []
  gridOptionsinst: GridOption = {}
  gridObjinst: any
  angularGridinst: AngularGridInstance
  
  datasettask: []
  columnDefinitionstask: Column[] = []
  gridOptionstask: GridOption = {}
  gridObjtask: any
  angularGridtask: AngularGridInstance

  datasetform: []
  columnDefinitionsform: Column[] = []
  gridOptionsform: GridOption = {}
  gridObjform: any
  angularGridform: AngularGridInstance

  details: any;
  // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any; 
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];
  
  empsreq: [];
  columnDefinitionsempreq: Column[] = [];
  gridOptionsempreq: GridOption = {};
  gridObjempreq: any;
  angularGridempreq: AngularGridInstance;
  dataViewempreq: any;
  gridServiceempreq: GridService;
  selectedIndexes: any[];
  index: any;

  items: [];
    columnDefinitions4: Column[] = [];
    gridOptions4: GridOption = {};
    gridObj4: any;
    angularGrid4: AngularGridInstance;
  
    
    datalocdet: [];
    columnDefinitionslocdet: Column[] = [];
    gridOptionslocdet: GridOption = {};
    gridObjlocdet: any;
    angularGridlocdet: AngularGridInstance;
    ums: [];
    columnDefinitionsum: Column[] = [];
    gridOptionsum: GridOption = {};
    gridObjum: any;
    angularGridum: AngularGridInstance;
  

    datasite: []
    columnDefinitionssite: Column[] = []
    gridOptionssite: GridOption = {}
    gridObjsite: any
    angularGridsite: AngularGridInstance

  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  message = "";
  job: String;
  level: String;
  seq : any;
  nbr: string;
  domaine:any;
  user
    angularGridcns: AngularGridInstance;
    gridcns: any;
    gridServicecns: GridService;
    dataViewcns: any;
    columnDefinitionscns: Column[];
    gridOptionscns: GridOption;
    cnsdataset: any[];
    
    location: any;
    sct: any;
    lddet: any;
    trlot: string;
    datasetPrint = [];
    stat: String;

    loc: String;
    site: String;

    alertWarning: any;

  constructor(
    
    config: NgbDropdownConfig,
    private empFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public  dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private employeService: EmployeService,
    private affectEmpService: AffectEmpService,
    private sequenceService: SequenceService,
    private projectService: ProjectService,
    private providerService: ProviderService,
    private inventoryTransactionService: InventoryTransactionService,
    private sctService: CostSimulationService,  
    private itemsService: ItemService,
    private locationService: LocationService,
    private codeService: CodeService,
    private inventoryStatusService: InventoryStatusService,
    private siteService: SiteService,
    private mesureService: MesureService,
    private locationDetailService: LocationDetailService,
    private TrainingCalendarService: TrainingcalenderService,
    private payMethService: PayMethService,
  private RepertoryService: RepertoryService  ) {
    config.autoClose = true;
  }

  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  gridReadycns(angularGrid: AngularGridInstance) {
    this.angularGridcns = angularGrid;
    this.dataViewcns = angularGrid.dataView;
    this.gridcns = angularGrid.slickGrid;
    this.gridServicecns = angularGrid.gridService;
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();

    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))       
    this.createForm();
    this.initmvGrid();
    this.initcnsGrid();
    this.getweekdays();
  }
  createForm() {
    this.loadingSubject.next(false)
  //create form
  this.affectEmp = new AffectEmp();
  const date = new Date;
  this.empForm = this.empFB.group({
      pme_pm_code: [this.affectEmp.pme_pm_code],
      pme_nbr:[this.affectEmp.pme_nbr],
      pme_var:[this.affectEmp.int01],
      pmdesc :  [{value: "", disabled: true}],
     
      pme_inst: [
        this.affectEmp.pme_inst, 
          Validators.required,
      ],
      pme_duration: [
        this.affectEmp.pme_duration,
        
    ],
    pme_task: [
      this.affectEmp.pme_task,
      
  ],
  pme_site: [
    this.affectEmp.pme_site,
    
],
pme_task_status: [
  this.affectEmp.pme_task_status,
  
],
pme_start_date: [{
  year:date.getFullYear(),
  month: date.getMonth()+1,
  day: date.getDate()
}],
pme_end_date: [{
  year:date.getFullYear(),
  month: date.getMonth()+1,
  day: date.getDate()
}],
tr_user1:  [{value: ""}],  
start_time:[],
weekday: [""],  


  })
}

prepareCode(): any {
  const controls = this.empForm.controls
  const _affectEmp = new AffectEmp()
  _affectEmp.pme_pm_code = controls.pme_pm_code.value
  _affectEmp.pme_nbr = controls.pme_nbr.value
  _affectEmp.int01 = controls.pme_var.value
  _affectEmp.pme_inst = controls.pme_inst.value
  _affectEmp.pme_task = controls.pme_task.value
  _affectEmp.pme_task_status = controls.pme_task_status.value
  _affectEmp.pme_site = controls.pme_site.value
  _affectEmp.pme_duration = controls.pme_duration.value
  _affectEmp.pme_start_date = controls.pme_start_date.value ? `${controls.pme_start_date.value.year}/${controls.pme_start_date.value.month}/${controls.pme_start_date.value.day}`   : null;
  _affectEmp.pme_end_date = controls.pme_end_date.value  ? `${controls.pme_end_date.value.year}/${controls.pme_end_date.value.month}/${controls.pme_end_date.value.day}` : null;
  _affectEmp.pme_start_time = controls.start_time.value
  _affectEmp.chr04 = controls.weekday.value
  return _affectEmp
}


  // onChangeCode() {
  //   this.mvdataset = [];
  //   const controls = this.empForm.controls
  //   this.projectService
  //       .getBy({
  //             pme_pm_code: controls.pme_addr.value
  //       })
  //       .subscribe((response: any) => {
  //        // console.log(response.data)
  //         if (response.data.length == 0) {

  //           alert("Projet n'existe pas  ")
  //           controls.pme_addr.setValue(null);
  //           document.getElementById("pme_pm_code").focus();
  //         } else {

  //           controls.pmdesc.setValue(response.data[0].pm_desc || "");
         
  //         }
      
  //    })
  // }
  //reste form
  reset() {
    
    this.createForm();
    this.hasFormErrors = false;
    this.mvdataset = []; 
    this.getweekdays();
  }
  getweekdays() {
    this.codeService
      .getBy({
        code_fldname: "weekdays",
      })
      .subscribe((response: any) => {
        const { data } = response;
        this.weekdays = data;
        if (!data) {
          this.message = "veuillez verifier votre connexion";
          this.hasFormErrors = true;
          return;
          // controls.wo_site.setValue("");
        }
      });
  }
  // save data
  onSubmit() {
    
    this.hasFormErrors = false;
    const controls = this.empForm.controls;
    /** check form */
    if (this.empForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;
      return;
    }

    if (!this.mvdataset.length) {
      this.message = "La liste des employés peut pas etre vide ";
      this.hasFormErrors = true;

      return;
    }

    for (var i = 0; i < this.mvdataset.length; i++) {
      
     if (this.mvdataset[i].pme_employe == "" || this.mvdataset[i].pme_employe == null  ) {
      this.message = "L' employé ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     

    }
    
    
      let pme = this.prepareCode()
              console.log(pme)
              this.addDet(pme, this.mvdataset, this.cnsdataset, this.nbr);
    
/*
  console.log("hhhhhhhjssfffjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
  let pme = this.prepareCode()
  console.log(pme)
  this.addDet(pme, this.mvdataset);
  console.log("jjjj")*/
  }

  
  
  addDet( _affectEmp: any ,detail: any, cnsdetail: any, nbr : any) {
    
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
     
    }
    for (let data of cnsdetail) {
      delete data.id;
      delete data.cmvid;
     
    }
    let emp = null;
 
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
     
    }
    this.loadingSubject.next(true);
    console.log(this.nbr,detail)
    this.affectEmpService
      .add({ affectEmp : _affectEmp,empDetail:detail,nbr:this.nbr})
      .subscribe(
        (reponse: any) => (emp = reponse.data),
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
            )
            this.loadingSubject.next(false)
            this.reset()
            this.router.navigateByUrl("/training/create-training-session")
            this.reset()
        }
    )
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
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.mvangularGrid.gridService.deleteItem(args.dataContext);
          }
        },
      },
      

      {
        id: "pme_internal",
        name: "Interne",
        field: "pme_internal",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.checkbox
        },
        formatter: Formatters.checkmark,
        cannotTriggerInsert: false,
      },
      {
        id: "pme_employe",
        name: "Employé/Fournisseur",
        field: "pme_employe",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
                editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvid",
        field: "cmvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (args.dataContext.pme_internal) {
            this.row_number = args.row
            let element: HTMLElement = document.getElementById(
                "openEmpsGrid"
            ) as HTMLElement
            element.click()
          }
           else {

         
            this.row_number = args.row
            let element: HTMLElement = document.getElementById(
                "openProvsGrid"
            ) as HTMLElement
            element.click()
            }  
        },
      },
      {
        id: "fname",
        name: "Nom",
        field: "fname",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
      },
      {
        id: "lname",
        name: "Prénom",
        field: "lname",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
      },
      {
        id: "methode",
        name: "Mode Paiement",
        field: "methode",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
      },
      {
        id: "pvid",
        field: "pmvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          
            this.row_number = args.row
            let element: HTMLElement = document.getElementById(
                "openpayGrid"
            ) as HTMLElement
            element.click()
          
        },
      },
      {
        id: "livre",
        name: "livre",
        field: "livre",
        sortable: true,
        width: 80,
        filterable: false,

        editor: {
          model: Editors.checkbox
        },
        formatter: Formatters.checkmark,
      },

      // {
      //   id: "pme_start_date",
      //   name: "Date Début",
      //   field: "pme_start_date",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      //   type: FieldType.dateIso,
      //           editor: {
      //     model: Editors.date,
      //   },
      // },
      // {
      //   id: "pme_end_date",
      //   name: "Date Fin",
      //   field: "pme_end_date",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      //   type: FieldType.dateIso,
      //           editor: {
      //     model: Editors.date,
      //   },
      // },
      // {
      //   id: "pme_duration",
      //   name: "Durée",
      //   field: "pme_duration",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      //   type: FieldType.float,
      //           editor: {
      //     model: Editors.float,
      //     params: { decimalPlaces: 2 }
      //   },
      // },

      {
        id: "chr01",
        name: "Observation",
        field: "chr01",
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
    };

    this.mvdataset = [];
  }


  initcnsGrid() {
    this.columnDefinitionscns = [
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
        id: "tr_line",
        name: "Ligne",
        field: "tr_line",
        minWidth: 50,
        maxWidth: 50,
        selectable: true,
      },
      {
        id: "tr_part",
        name: "Article",
        field: "tr_part",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.text,
          required: true,
          validator: statusValidator,

        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.tr_part)
          this.itemsService.getByOne({pt_part: args.dataContext.tr_part }).subscribe((resp:any)=>{

            if (resp.data) {
              console.log(resp.data)

             
                this.sctService.getByOne({ sct_site: this.site, sct_part: resp.data.pt_part, sct_sim: 'STD-CG' }).subscribe(
                  (response: any) => {
                    this.sct = response.data
           
                    this.locationDetailService.getByOne({ ld_site: this.site, ld_loc:this.loc, ld_part: resp.data.pt_part, ld_lot: null }).subscribe(
                      (response: any) => {
                        this.lddet = response.data
                        console.log(this.lddet.ld_qty_oh)
                        if (this.lddet != null) {
                        this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "ISS-CNS" }).subscribe((resstat:any)=>{
                       //   console.log(resstat)
                          const { data } = resstat;
  
                          if (data) {
                            this.stat = null
                          } else {
                            this.stat = this.lddet.ld_status
                          }
                    this.gridServicecns.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , tr_site:this.site, tr_loc:this.loc,
                      tr_um:resp.data.pt_um, tr_um_conv: 1,  tr_status: this.stat, tr_price: this.sct.sct_mtl_tl, qty_oh: this.lddet.ld_qty_oh, tr_expire: this.lddet.ld_expire})
                        });
                      }
                      else {
                        this.gridServicecns.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , tr_site:this.site, tr_loc:this.loc,
                          tr_um:resp.data.pt_um, tr_um_conv: 1,  tr_status: null, tr_price: this.sct.sct_mtl_tl, qty_oh: 0, tr_expire: null})
                      

                      }     
     
                      });     
                });  
            
          }



    


          else {
            alert("Article Nexiste pas")
            this.gridServicecns.updateItemById(args.dataContext.id,{...args.dataContext , tr_part: null })
          }
          
          });

           
         
         
        }
      },
      {
        id: "mvid",
        field: "cmvid",
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
        id: "desc",
        name: "Description",
        field: "desc",
        sortable: true,
        width: 180,
        filterable: false,
      },
      
        
      {
        id: "tr_serial",
        name: "Lot/Serie",
        field: "tr_serial",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {

            this.locationDetailService.getByOne({ ld_site: this.site, ld_loc: this.loc, ld_part: args.dataContext.tr_part, ld_lot: args.dataContext.tr_serial }).subscribe(
              (response: any) => {
                this.lddet = response.data
                
       // console.log(response.data.length)
                  if (this.lddet != null) {
                    
                      this.gridServicecns.updateItemById(args.dataContext.id,{...args.dataContext ,   qty_oh: this.lddet.ld_qty_oh, tr_status: this.lddet.ld_status, tr_expire: this.lddet.tr_expire})
                  }
                  else {
                        this.gridServicecns.updateItemById(args.dataContext.id,{...args.dataContext  , tr_serial: null, qty_0h: 0, tr_expire: null});
      
                        alert("Lot N' existe pas")
                  }
            });     
        }

      },
      {
          id: "mvidlot",
          field: "cmvidlot",
          excludeFromHeaderMenu: true,
          formatter: Formatters.infoIcon,
          minWidth: 30,
          maxWidth: 30,
          onCellClick: (e: Event, args: OnEventArgs) => {
              this.row_number = args.row;
              let element: HTMLElement = document.getElementById(
              "openLocdetsGrid"
              ) as HTMLElement;
              element.click();
          },
      },
      {
          id: "qty_oh",
          name: "QTE Stock",
          field: "qty_oh",
          sortable: true,
          width: 80,
          filterable: false,
          type: FieldType.float,
          
      },
      {
          id: "tr_qty_loc",
          name: "QTE",
          field: "tr_qty_loc",
          sortable: true,
          width: 80,
          filterable: false,
          type: FieldType.float,
          editor: {
              model: Editors.float,
              params: { decimalPlaces: 2 },
              required: true,
              
              
          },
      
        onCellChange: (e: Event, args: OnEventArgs) => {
              console.log(args.dataContext.tr_qty_loc)
              console.log(args.dataContext.tr_um_conv)
              
              if (args.dataContext.tr_qty_loc * args.dataContext.tr_um_conv   > args.dataContext.qty_oh) {
                  console.log('here')
               alert ("Qte Manquante")
               this.gridServicecns.updateItemById(args.dataContext.id,{...args.dataContext , tr_qty_loc: null })
            //  this.alertWarning = `Updated Title: ${args.dataView.tr_qty_loc}`;
           
             
          }
      
           // meta.cssClasses = (meta.cssClasses || '') + ' ' + newCssClass;
          }
          
      },
      
        {
          id: "tr_um",
          name: "UM",
          field: "tr_um",
          sortable: true,
          width: 80,
          filterable: false,
          editor: {
              model: Editors.text,
              required: true,
              validator: statusValidator,

          },
          onCellChange: (e: Event, args: OnEventArgs) => {
            console.log(args.dataContext.tr_um)
            this.itemsService.getBy({pt_part: args.dataContext.tr_part }).subscribe((resp:any)=>{
              
            if   (args.dataContext.tr_um == resp.data.pt_um )  {
              
              this.gridServicecns.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: 1 })
            } else { 
              //console.log(resp.data.pt_um)



                this.mesureService.getBy({um_um: args.dataContext.tr_um, um_alt_um: resp.data.pt_um, um_part: args.dataContext.tr_part  }).subscribe((res:any)=>{
                console.log(res)
                const { data } = res;
      
              if (data) {
                //alert ("Mouvement Interdit Pour ce Status")
                this.gridServicecns.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: res.data.um_conv })
                this.angularGrid.gridService.highlightRow(1, 1500);

                if (args.dataContext.tr_qty_loc * Number(res.data.um_conv) >  args.dataContext.qty_oh) {
                  console.log('here')
                  alert ("Qte Manquante")
                  this.gridServicecns.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: "1" , tr_um: null});
                  
              
                } else {
              
                  this.gridServicecns.updateItemById(args.dataContext.id,{...args.dataContext , tr_um: null })

                }




              } else {
                this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: args.dataContext.tr_um, um_part: args.dataContext.tr_part  }).subscribe((res:any)=>{
                  console.log(res)
                  const { data } = res;
                  if (data) {
                    if (args.dataContext.tr_qty_loc * Number(res.data.um_conv) >  args.dataContext.qty_oh) {
                      console.log('here')
                      alert ("Qte Manquante")
                      this.gridServicecns.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: "1" , tr_um: null});
                      
                  
                    } else {
                  
                      this.gridServicecns.updateItemById(args.dataContext.id,{...args.dataContext , tr_um: null })
    
                    }
          
                  } else {
                    this.gridServicecns.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: "1" , tr_um: null});
              
                    alert("UM conversion manquante")
                    
                  }  
                })

              }
                })

              }
              })
    
            }

          
      },
    
     
      {
        id: "mvidlot",
        field: "cmvidlot",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
            this.row_number = args.row;
            let element: HTMLElement = document.getElementById(
            "openUmsGrid"
            ) as HTMLElement;
            element.click();
        },
      },
      {
        id: "tr_um_conv",
        name: "Conv UM",
        field: "tr_um_conv",
        sortable: true,
        width: 80,
        filterable: false,
       // editor: {
       //     model: Editors.float,
        //},
        
      },
              
      
    ];

    this.gridOptionscns = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      formatterOptions: {
        
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: true,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
    };

    this.cnsdataset = [];
  }
  addNewItem() {
    const controls = this.empForm.controls;
    if(controls.pme_nbr.value == null)
      {console.log('seq')
          this.sequenceService.getByOne({ seq_type: "PM" }).subscribe(
            (response: any) => {
            this.seq = response.data 
              
              if (this.seq) {
              this.nbr =   `${new Date().getFullYear()}-${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`
  
              this.sequenceService.update(this.seq.id,{ seq_curr_val: Number(this.seq.seq_curr_val )+1 }).subscribe(
                (reponse) => console.log("response", Response),
                (error) => {
                  this.message = "Erreur modification Sequence";
                  this.hasFormErrors = true;
                  return;
            
                
                },
                )
                controls.pme_nbr.setValue(this.nbr)
                controls.pme_var.setValue(1)
              }

              else {
                this.message = "Parametrage Manquant pour la sequence";
                this.hasFormErrors = true;
                return;
          
              }
  
  
            })
      }
    const newId = this.mvdataset.length+1;

    const newItem = {
      id: newId,
      pme_internal: true,
      pme_affectEmp : "",
      fname: null,
      lname: null,
      job  : null,
      level: null,
    };
    this.mvgridService.addItem(newItem, { position: "bottom" });
  }
  addNewcnsItem() {
    this.gridServicecns.addItem(
      {
        id: this.cnsdataset.length + 1,
        tr_line: this.cnsdataset.length + 1,
        tr_part: "",
        cmvid: "",
        desc: "",
        tr_qty_loc: 0,
        tr_um: "",
        tr_um_conv: 1,
        tr_price: 0,
        tr_site: this.site,
        cmvids: "",
        tr_loc: this.loc,
        tr_serial: null,
        tr_status: null,
        tr_expire: null,
      },
      { position: "bottom" }
    );
  }

handleSelectedRowsChanged(e, args) {
  this.mvdataset = [];
  const controls = this.empForm.controls // chof le champs hada wesh men form rah
  if (Array.isArray(args.rows) && this.gridObj) {
    args.rows.map((idx) => {
      const item = this.gridObj.getDataItem(idx);
      console.log(item);
      controls.pme_pm_code.setValue(item.tc_year + '-' + item.tc_service + '-' + item.tc_site || "");
      controls.pme_inst.setValue(item.tc_part || "");
      
      controls.pmdesc.setValue(item.tc_desc)
      this.site = item.tc_site
      this.itemsService.getByOne({pt_part:item.tc_part}).subscribe((response: any) => (this.domaine = response.data.pt_draw));
    
  })
 }
}
angularGridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid
  this.gridObj = (angularGrid && angularGrid.slickGrid) || {}
}


prepareGrid() {
  this.columnDefinitions = [
      {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
      },
      {
          id: "tc_year",
          name: "Année",
          field: "tc_year",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "tc_site",
          name: "site",
          field: "tc_site",
          sortable: true,
          width: 120,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "tc_service",
        name: "Service",
        field: "tc_service",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
    },
    {
      id: "tc_desc",
      name: "formation",
      field: "tc_desc",
      sortable: true,
      width: 80,
      filterable: true,
      type: FieldType.string,
  },
    
      
  ];

  this.gridOptions = {
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
  if(this.user.usrd_site == '*')
  {this.TrainingCalendarService
  // {pm_status: ""}
      .getAll()
      .subscribe((response: any) =>{ 
        this.dataset = response.data
        
      })}
      else{
        this.TrainingCalendarService
  // {pm_status: ""}
      .getBy({tc_site:this.user.usrd_site})
      .subscribe((response: any) =>{ 
        this.dataset = response.data
        
      })
      }
}
open(content) {
 
  this.prepareGrid()
  this.modalService.open(content, { size: "lg" })
}

handleSelectedRowsChangeds(e, args) {
  this.mvdataset = [];
  const controls = this.empForm.controls // chof le champs hada wesh men form rah
  if (Array.isArray(args.rows) && this.gridObjs) {
    args.rows.map((idx) => {
      const item = this.gridObjs.getDataItem(idx);
      
      
      controls.pme_start_date.setValue({year: new Date(item.pme_start_date).getFullYear(),
      month: new Date(item.pme_start_date).getMonth() + 1,
      day: new Date(item.pme_start_date).getDate(),}
)
      controls.start_time.setValue(item.pme_start_time)
      controls.pme_end_date.setValue({year: new Date(item.pme_end_date).getFullYear(),
        month: new Date(item.pme_end_date).getMonth() + 1,
        day: new Date(item.pme_end_date).getDate(),})
      controls.pme_nbr.setValue(item.pme_nbr)
      controls.pme_var.setValue(item.int01)
      controls.pme_site.setValue(item.pme_site)
      controls.pme_inst.setValue(item.pme_inst)
      this.itemsService.getBy({pt_part:item.pme_inst}).subscribe((pt: any) =>{console.log(pt.data[0]);controls.pmdesc.setValue(pt.data[0].pt_desc1)
      })
      controls.pme_site.setValue(item.pme_site)
      controls.pme_duration.setValue(item.pme_duration)
      controls.pme_task.setValue(item.pme_task)
      controls.pme_task_status.setValue(item.pme_task_status)
      
      let weekdays =  item.chr04.split(",");
      controls.weekday.setValue(weekdays)
      this.affectEmpService.getBy({pme_nbr:controls.pme_nbr.value,int01:controls.pme_var.value}).subscribe((response: any) =>{ 
        const datas = response.data
       
        for (let items of datas)
        {
          const newId = this.mvdataset.length+1;
          this.employeService.getByOne({emp_addr:items.pme_employe}).subscribe((emp: any) =>{let employe = emp.data
            console.log(employe)
            this.mvgridService.addItem(
              {id:newId,
                
                pme_employe:items.pme_employe,
               fname:employe.emp_fname,
               lname:employe.emp_lname,
               methode:items.chr05,
               livre:items.log01,
               pme_cmmt:items.pme_cmmt, 
               pme_internal: true,
               pme_affectEmp : "",
                    }, { position: "bottom" });
                    
          })
         
        
        };
       
        
      })
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
        id: "int01",
        name: "configuration groupe",
        field: "int01",
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
  const controls = this.empForm.controls
  console.log(controls.pme_pm_code.value)
  if(this.user.usrd_site == '*')
  {this.affectEmpService
    // {pm_status: ""}
        .getByGlobal({pme_pm_code:controls.pme_pm_code.value,pme_task_status:null})
        .subscribe((response: any) =>{ 
          this.datasets = response.data
          
        })}
  else
  {this.affectEmpService
  // {pm_status: ""}
      .getByGlobal({pme_pm_code:controls.pme_pm_code.value,pme_task_status:null})
      .subscribe((response: any) =>{ 
        this.datasets = response.data
        
      })}
}
opens(contents) {
 
  this.prepareGrids()
  this.modalService.open(contents, { size: "lg" })
}

handleSelectedRowsChangedinst(e, args) {
  this.mvdataset = [];
  const controls = this.empForm.controls // chof le champs hada wesh men form rah
  if (Array.isArray(args.rows) && this.gridObjinst) {
    args.rows.map((idx) => {
      const item = this.gridObjinst.getDataItem(idx);
      console.log(item);
      controls.pme_inst.setValue(item.pt_part || "");
      controls.pmdesc.setValue(item.pt_desc1)
      this.itemsService.getByOne({pt_part:item.pt_part}).subscribe((response: any) => (console.log(response.data.pt_draw),this.domaine = response.data.pt_draw));
    });
  }
}
angularGridReadyinst(angularGrid: AngularGridInstance) {
  this.angularGridinst = angularGrid
  this.gridObjinst = (angularGrid && angularGrid.slickGrid) || {}
}


prepareGridinst() {
  const controls = this.empForm.controls 
  this.columnDefinitionsinst = [
    {
        id: "id",
        name: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        minWidth: 40,
        maxWidth: 60,
        sortable:true,
    },
    {
        id: "pt_part",
        name: "Code Formation",
        field: "pt_part",
        sortable: true,
        minWidth: 70,
        maxWidth: 120,          
        type: FieldType.string,
        filterable:true,
    },
    {
        id: "pt_desc1",
        name: "Désignation",
        field: "pt_desc1",
        sortable: true,
        minWidth: 100,
        maxWidth: 350,
        type: FieldType.string,
        filterable:true,
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
       
    ];

    this.gridOptionsinst = {
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
    if(this.user.usrd_site == '*')
    {this.itemsService
      .getBy({pt_part_type : "FORMATION"})
      .subscribe((response: any) => (this.datasetinst = response.data));
  }
  else{
    this.itemsService
      .getBy({pt_site:this.user.usrd_site,pt_part_type : "FORMATION"})
      .subscribe((response: any) => (this.datasetinst = response.data));
  }
    

 

}
openinst(content) {
 
  this.prepareGridinst()
  this.modalService.open(content, { size: "lg" })
}


handleSelectedRowsChangedtask(e, args) {
  this.mvdataset = [];
  const controls = this.empForm.controls // chof le champs hada wesh men form rah
  if (Array.isArray(args.rows) && this.gridObjtask) {
    args.rows.map((idx) => {
      const item = this.gridObjtask.getDataItem(idx);
     // console.log(item);
      controls.pme_task.setValue(item.loc_loc || "");
      
      
    });
  }
}
angularGridReadytask(angularGrid: AngularGridInstance) {
  this.angularGridtask = angularGrid
  this.gridObjtask = (angularGrid && angularGrid.slickGrid) || {}
}


prepareGridtask() {
  const controls = this.empForm.controls 
  this.columnDefinitionstask = [
      {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 40,
          maxWidth: 40,
      },
      {
        id: "loc_loc",
        name: "loc",
        field: "loc_loc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "loc_desc",
        name: "Designation",
        field: "loc_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      
  ]

  this.gridOptionstask = {
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
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true,
      },
    }
  // fill the dataset with your data
  if(this.user.usrd_site == '*')
 
 { this.locationService
      .getBy({ loc_site: this.site })
      .subscribe((response: any) => (this.datasettask = response.data))}
      else{this.locationService
        .getBy({})
        .subscribe((response: any) => (this.datasettask = response.data))}
}
opentask(content) {
 
  this.prepareGridtask()
  this.modalService.open(content, { size: "lg" })
}

handleSelectedRowsChangedform(e, args) {
  this.mvdataset = [];
  const controls = this.empForm.controls // chof le champs hada wesh men form rah
  if (Array.isArray(args.rows) && this.gridObjform) {
    args.rows.map((idx) => {
      const item = this.gridObjform.getDataItem(idx);
     // console.log(item);
      controls.pme_site.setValue(item.rep_contact || "");
      
      
    });
  }
}
angularGridReadyform(angularGrid: AngularGridInstance) {
  this.angularGridform = angularGrid
  this.gridObjform = (angularGrid && angularGrid.slickGrid) || {}
}


prepareGridform() {
  const controls = this.empForm.controls 
  this.columnDefinitionsform = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 50,
      maxWidth: 50,
      filterable: true,
      
    },
    {
      id: "rep_contact",
      name: "Contact",
      field: "rep_contact",
      sortable: true,
      width: 80,
      filterable: true,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      }
    },
    {
      id: "rep_code",
      name: "Organisme",
      field: "rep_code",
      sortable: true,
      width: 80,
      filterable: true,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      }
    },
    {
      id: "rep_post",
      name: "Poste",
      field: "rep_post",
      sortable: true,
      width: 80,
      filterable: true,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      }
    },
    
    
    {
      id: "rep_tel",
      name: "TEL Mobile",
      field: "rep_tel",
      sortable: true,
      width: 80,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      }

    },
    {
      id: "rep_tel2",
      name: "TEL Fix",
      field: "rep_tel2",
      sortable: true,
      width: 80,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      }

    },
    {
      id: "rep_email",
      name: "Email",
      field: "rep_email",
      sortable: true,
      width: 80,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      }

    },
  ]

  this.gridOptionsform = {
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
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true,
      },
    }
  // fill the dataset with your data
  console.log(this.domaine)
  if(this.user.usrd_site == '*')
  {this.RepertoryService.getBy({rep_type:'Trainor'}).subscribe(
    (response: any) => (this.datasetform = response.data)
      
)}
else
  {this.RepertoryService.getBy({chr03:this.user.usrd_site,rep_type:'Trainor'}).subscribe(
    (response: any) => (this.datasetform = response.data)
      
)}
}
openform(content) {
 
  this.prepareGridform()
  this.modalService.open(content, { size: "lg" })
}






handleSelectedRowsChangedprov(e, args) {
  let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number)
  if (Array.isArray(args.rows) && this.gridObjprov) {
      args.rows.map((idx) => {
          const item = this.gridObjprov.getDataItem(idx)
          console.log(item)
          updateItem.pme_employe = item.vd_addr
          updateItem.fname   = item.address.ad_name
          
          this.mvgridService.updateItem(updateItem)
      })
  }
}


angularGridReadyprov(angularGrid: AngularGridInstance) {
  this.angularGridprov = angularGrid
  this.gridObjprov = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridprov() {
  this.columnDefinitionsprov = [
      {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
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
          id: "ad_phone",
          name: "Numero telephone",
          field: "address.ad_phone",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
  ]

  this.gridOptionsprov = {
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
      dataItemColumnValueExtractor: function getItemColumnValue(
          item,
          column
      ) {
          var val = undefined
          try {
              val = eval("item." + column.field)
          } catch (e) {
              // ignore
          }
          return val
      },
  }

  // fill the dataset with your data
  this.providerService
      .getAll()
      .subscribe((response: any) => (this.providers = response.data))
}
openprov(content) {
  this.prepareGridprov()
  this.modalService.open(content, { size: "lg" })
}

onAlertClose($event) {
  this.hasFormErrors = false
}




handleSelectedRowsChanged4(e, args) {
  let updateItem = this.gridServicecns.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObj4) {
    args.rows.map((idx) => {
      const item = this.gridObj4.getDataItem(idx);
      console.log(item);

     
      
          this.sctService.getByOne({ sct_site: this.site, sct_part: item.pt_part, sct_sim: 'STD-CG' }).subscribe(
            (response: any) => {
              this.sct = response.data
          
              this.locationDetailService.getByOne({ ld_site: this.site, ld_loc: this.loc, ld_part: item.pt_part, ld_lot: null }).subscribe(
                (response: any) => {
                  this.lddet = response.data
                  //console.log(this.lddet.ld_qty_oh)
         if (this.lddet != null)
             {     this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "ISS-CNS" }).subscribe((resstat:any)=>{
                    console.log(resstat)
                    const { data } = resstat;

                    if (data) {
                      this.stat = null
                    } else {
                      this.stat = this.lddet.ld_status
                    }
          
            updateItem.tr_part = item.pt_part;
            updateItem.desc = item.pt_desc1;
            updateItem.tr_um = item.pt_um;
            updateItem.tr_conv_um = 1;
            
            updateItem.tr_site = this.site;
            updateItem.tr_loc = this.loc;
            updateItem.tr_price = this.sct.sct_mtl_tl;
            
            updateItem.qty_oh =  this.lddet.ld_qty_oh;
            
            updateItem.tr_status =  this.stat;
            updateItem.tr_expire =  this.lddet.ld_expire;
            this.gridServicecns.updateItem(updateItem);
         });
        }
        else {
          updateItem.tr_part = item.pt_part;
          updateItem.desc = item.pt_desc1;
          updateItem.tr_um = item.pt_um;
          updateItem.tr_conv_um = 1;
          
          updateItem.tr_site = this.site;
          updateItem.tr_loc = this.loc;
          updateItem.tr_price = this.sct.sct_mtl_tl;
          
          updateItem.qty_oh =  0;
          
          updateItem.tr_status =  null;
          updateItem.tr_expire =  null;
          this.gridServicecns.updateItem(updateItem);


        }
        });  
      });  
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
      id: "pt_um",
      name: "desc",
      field: "pt_um",
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
  if(this.user.usrd_site == '*')
  {this.itemsService
    .getAll()
    .subscribe((response: any) => (this.items = response.data));}
    else{this.itemsService
      .getBy({pt_site:this.user.usrd_site})
      .subscribe((response: any) => (this.items = response.data));}
}
open4(content) {
  this.prepareGrid4();
  this.modalService.open(content, { size: "lg" });
}


 

  handleSelectedRowsChangedlocdet(e, args) {
    let updateItem = this.gridServicecns.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjlocdet) {
      args.rows.map((idx) => {
        const item = this.gridObjlocdet.getDataItem(idx);
        console.log(item);

            

        this.inventoryStatusService.getAllDetails({isd_status: item.ld_status, isd_tr_type: "ISS-CNS" }).subscribe((res:any)=>{
          console.log(res)
          const { data } = res;

        if (data) {
          alert ("Mouvement Interdit Pour ce Status")
          updateItem.tr_serial = null;
          updateItem.tr_expire = null;
          updateItem.qty_oh = 0;

        }else {
          updateItem.tr_serial = item.ld_lot;
          updateItem.tr_status = item.ld_status;
          updateItem.tr_expire = item.ld_expire;
          updateItem.qty_oh = item.ld_qty_oh;
          
          this.gridServicecns.updateItem(updateItem);

        }
          
        })

  


        
        
        this.gridServicecns.updateItem(updateItem);
        
  });

    }
  }
  angularGridReadylocdet(angularGrid: AngularGridInstance) {
    this.angularGridlocdet = angularGrid;
    this.gridObjlocdet = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridlocdet() {
    this.columnDefinitionslocdet = [
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
        id: "ld_site",
        name: "Site",
        field: "ld_site",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_loc",
        name: "Emplacement",
        field: "ld_loc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_part",
        name: "Article",
        field: "ld_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_lot",
        name: "Lot",
        field: "ld_lot",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_qty_oh",
        name: "Qte",
        field: "ld_qty_oh",
        sortable: true,
        filterable: true,
        type: FieldType.float,
      },
      {
        id: "ld_status",
        name: "Status",
        field: "ld_status",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_expire",
        name: "Expire",
        field: "ld_expire",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionslocdet = {
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
      let updateItem = this.gridServicecns.getDataItemByRowIndex(this.row_number);
    
    // fill the dataset with your data
    this.locationDetailService
      .getBy({ ld_site:  this.site , ld_loc:  this.loc, ld_part:  updateItem.tr_part })
      .subscribe((response: any) => (this.datalocdet = response.data));
  }
  openlocdet(contentlocdet) {
    this.prepareGridlocdet();
    this.modalService.open(contentlocdet, { size: "lg" });
  }

  handleSelectedRowsChangedum(e, args) {
    let updateItem = this.gridServicecns.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjum) {
      args.rows.map((idx) => {
        const item = this.gridObjum.getDataItem(idx);
        updateItem.tr_um = item.code_value;
     
        this.gridServicecns.updateItem(updateItem);

/*********/
console.log(updateItem.tr_part)

      this.itemsService.getBy({pt_part: updateItem.tr_part }).subscribe((resp:any)=>{
                      
        if   (updateItem.tr_um == resp.data.pt_um )  {
          
          updateItem.tr_um_conv = 1
        } else { 
          //console.log(resp.data.pt_um)



            this.mesureService.getBy({um_um: updateItem.tr_um, um_alt_um: resp.data.pt_um, um_part: updateItem.tr_part  }).subscribe((res:any)=>{
            console.log(res)
            const { data } = res;

          if (data) {
            //alert ("Mouvement Interdit Pour ce Status")
            updateItem.tr_um_conv = res.data.um_conv 
            this.angularGrid.gridService.highlightRow(1, 1500);
          } else {
            this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: updateItem.tr_um, um_part: updateItem.tr_part  }).subscribe((res:any)=>{
              console.log(res)
              const { data } = res;
              if (data) {
                //alert ("Mouvement Interdit Pour ce Status")
                updateItem.tr_um_conv = res.data.um_conv
                
              } else {
                updateItem.tr_um_conv = 1
                updateItem.tr_um = null
        
                alert("UM conversion manquante")
                
              }  
            })

          }
            })

          }
          })


/***********/








      });
    }
  }
angularGridReadyum(angularGrid: AngularGridInstance) {
    this.angularGridum = angularGrid
    this.gridObjum = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridum() {
    this.columnDefinitionsum = [
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
            id: "code_fldname",
            name: "Champs",
            field: "code_fldname",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "code_value",
            name: "Code",
            field: "code_value",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "code_cmmt",
            name: "Description",
            field: "code_cmmt",
            sortable: true,
            width: 200,
            filterable: true,
            type: FieldType.string,
        },
    ]

    this.gridOptionsum = {
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
    this.codeService
        .getBy({ code_fldname: "pt_um" })
        .subscribe((response: any) => (this.ums = response.data))
}
openum(content) {
    this.prepareGridum()
    this.modalService.open(content, { size: "lg" })
}
handleSelectedRowsChangedsite(e, args) {
  const controls = this.empForm.controls
 
  if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
          const item = this.gridObjsite.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
          
                  controls.site.setValue(item.si_site || "")
          
      })
  }
}
angularGridReadysite(angularGrid: AngularGridInstance) {
  this.angularGridsite = angularGrid
  this.gridObjsite = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridsite() {
  this.columnDefinitionssite = [
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
      
  ]

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
      },
      multiSelect: false,
      rowSelectionOptions: {
          selectActiveRow: true,
      },
  }

  // fill the dataset with your data
  this.siteService
      .getAll()
      .subscribe((response: any) => (this.datasite = response.data))
}
opensite(contentsite) {
  
  this.prepareGridsite()
  this.modalService.open(contentsite, { size: "lg" })
}
addempreq() {
    // this.itinerary.push({})
    const controls = this.empForm.controls;
    var l: String;
    l = "";
    console.log(l.length);
    if(controls.pme_nbr.value == null)
      {console.log('seq')
          this.sequenceService.getByOne({ seq_type: "PM" }).subscribe(
            (response: any) => {
            this.seq = response.data 
              
              if (this.seq) {
              this.nbr = `${new Date().getFullYear()}-${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`
  
              this.sequenceService.update(this.seq.id,{ seq_curr_val: Number(this.seq.seq_curr_val )+1 }).subscribe(
                (reponse) => console.log("response", Response),
                (error) => {
                  this.message = "Erreur modification Sequence";
                  this.hasFormErrors = true;
                  return;
            
                
                },
                )
                controls.pme_nbr.setValue(this.nbr)
                controls.pme_var.setValue(1)
              }

              else {
                this.message = "Parametrage Manquant pour la sequence";
                this.hasFormErrors = true;
                return;
          
              }
  
  
            })
      }
    this.selectedIndexes.forEach((index) => {
      const newId = this.mvdataset.length+1;
      const newItem = {
        id: newId,
        pme_employe:this.empsreq[index]["emp_addr"],
        pme_internal: true,
        pme_affectEmp : "",
        fname:this.empsreq[index]["emp_fname"],
        lname: this.empsreq[index]["emp_lname"],
        job  : this.empsreq[index]["emp_job"],
        level: this.empsreq[index]["emp_level"],
      };
      this.mvgridService.addItem(newItem, { position: "bottom" });
    });

    console.log(l);
    controls.tr_user1.setValue(l);
    
  }
addemp() {
    // this.itinerary.push({})
    const controls = this.empForm.controls;
    var l: String;
    l = "";
    console.log(l.length);
    if(controls.pme_nbr.value == null)
      {console.log('seq')
          this.sequenceService.getByOne({ seq_type: "PM" }).subscribe(
            (response: any) => {
            this.seq = response.data 
              
              if (this.seq) {
              this.nbr = `${new Date().getFullYear()}-${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`
  
              this.sequenceService.update(this.seq.id,{ seq_curr_val: Number(this.seq.seq_curr_val )+1 }).subscribe(
                (reponse) => console.log("response", Response),
                (error) => {
                  this.message = "Erreur modification Sequence";
                  this.hasFormErrors = true;
                  return;
            
                
                },
                )
                controls.pme_nbr.setValue(this.nbr)
                controls.pme_var.setValue(1)
              }

              else {
                this.message = "Parametrage Manquant pour la sequence";
                this.hasFormErrors = true;
                return;
          
              }
  
  
            })
      }
    this.selectedIndexes.forEach((index) => {
      const newId = this.mvdataset.length+1;
      const newItem = {
        id: newId,
        pme_employe:this.emps[index]["emp_addr"],
        pme_internal: true,
        pme_affectEmp : "",
        fname:this.emps[index]["emp_fname"],
        lname: this.emps[index]["emp_lname"],
        job  : this.emps[index]["emp_job"],
        level: this.emps[index]["emp_level"],
      };
      this.mvgridService.addItem(newItem, { position: "bottom" });
    });

    console.log(l);
    
    
  }
  
  
  handleSelectedRowsChangedempreq(e, args) {
    this.selectedIndexes = [];
    this.selectedIndexes = args.rows;
  }
  angularGridReadyempreq(angularGrid: AngularGridInstance) {
    this.angularGridempreq = angularGrid;
    this.gridObjempreq = (angularGrid && angularGrid.slickGrid) || {};
  
    this.gridServiceempreq = angularGrid.gridService;
    this.dataViewempreq = angularGrid.dataView;
  }
  // GRID IN
  
  prepareGridempreq() {
    this.columnDefinitionsempreq = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "emp_addr",
        name: "Code Employé",
        field: "emp_addr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "emp_fname",
        name: "Nom",
        field: "emp_fname",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "emp_lname",
        name: "Prénom",
        field: "emp_lname",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "emp_line1",
        name: "Adresse",
        field: "emp_line1",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "emp_job",
        name: "Compétence",
        field: "emp_job",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "emp_level",
        name: "Niveau",
        field: "emp_level",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
      },
    ];
  
    this.gridOptionsempreq = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      autoEdit: false,
      autoHeight: false,
      // frozenColumn: 0,
      // frozenBottom: true,
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
          gridRowIndexes: this.selectedIndexes, // (recommended) select by your data object IDs
          //dataContextIds
        },
      },
    };
  
    // fill the dataset with your data
    const controls = this.empForm.controls;
    const training = controls.pme_inst.value
    if(this.user.usrd_site == '*')
    {this.employeService.getByReq({training}).subscribe((response: any) => (this.empsreq = response.data));}
    else {this.employeService.getByReq({emp_site:this.user.usrd_site,training}).subscribe((response: any) => (this.empsreq = response.data));}
  }
  openempreq(content) {
    this.prepareGridempreq();
    this.modalService.open(content, { size: "lg" });
  }

  
handleSelectedRowsChangedemp(e, args) {
  const controls = this.empForm.controls;
  let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObjemp) {
    args.rows.map((idx) => {
      const item = this.gridObjemp.getDataItem(idx);
      console.log(item);

     
        updateItem.pme_employe = item.emp_addr;
        updateItem.fname = item.emp_fname;
        updateItem.lname = item.emp_lname;
        
        this.mvgridService.updateItem(updateItem);
     
    });
  }
}
angularGridReadyemp(angularGrid: AngularGridInstance) {
  this.angularGridemp = angularGrid
  this.gridObjemp = (angularGrid && angularGrid.slickGrid) || {}
  this.gridServiceemp = angularGrid.gridService;
  this.dataViewemp = angularGrid.dataView;
}
prepareGridemp() {
  this.columnDefinitionsemp = [
      {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
      },
      {
          id: "emp_addr",
          name: "Code Employé",
          field: "emp_addr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "emp_fname",
          name: "Nom",
          field: "emp_fname",
          sortable: true,
          width: 80,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "emp_lname",
        name: "Prénom",
        field: "emp_lname",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
    },
    {
      id: "emp_line1",
      name: "Adresse",
      field: "emp_line1",
      sortable: true,
      width: 80,
      filterable: true,
      type: FieldType.string,
  },
  {
    id: "emp_job",
    name: "Compétence",
    field: "emp_job",
    sortable: true,
    width: 80,
    filterable: true,
    type: FieldType.string,
},
{
  id: "emp_level",
  name: "Niveau",
  field: "emp_level",
  sortable: true,
  width: 80,
  filterable: true,
  type: FieldType.string,
},
      
  ]

  this.gridOptionsemp = {
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
  if(this.user.usrd_site == '*')
  {this.employeService
      .getAll()
      .subscribe((response: any) => (this.emps = response.data))}
  else{this.employeService
    .getBy({emp_site:this.user.usrd_site})
    .subscribe((response: any) => (this.emps = response.data))}    
}
openemp(content) {
 
  this.prepareGridemp()
  this.modalService.open(content, { size: "lg" })
}

handleSelectedRowsChangedpay(e, args) {
  
  const controls = this.empForm.controls // chof le champs hada wesh men form rah
  let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  console.log(this.row_number)
  if (Array.isArray(args.rows) && this.gridObjpay) {
    args.rows.map((idx) => {
      const item = this.gridObjpay.getDataItem(idx);
      console.log(item,updateItem.id);

     
        updateItem.methode = item.ct_code;
        // updateItem.tc_desc = item.pt_desc1;
        
        this.mvgridService.updateItem(updateItem);
     
    });
  }
}

angularGridReadypay(angularGrid: AngularGridInstance) {
  this.angularGridpay = angularGrid
  this.gridObjpay = (angularGrid && angularGrid.slickGrid) || {}
  this.gridServicepay = angularGrid.gridService;
  this.dataViewpay = angularGrid.dataView;
}
prepareGridpay() {
  this.columnDefinitionspay = [
  
  {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
  },
 
  {
      id: "ct_code",
      name: "Code Méthode Paiement",
      field: "ct_code",
      sortable: true,
      filterable: true,
      type: FieldType.string,
  },
  {
    id: "ct_desc",
    name: "Designation Code",
    field: "ct_desc",
    sortable: true,
    width: 200,
    filterable: true,
    type: FieldType.string,
  },
  {
    id: "ctd_term",
    name: "Code Term",
    field: "ctd_term",
    sortable: true,
    filterable: true,
    type: FieldType.string,
},

  {
      id: "ctd_desc",
      name: "Designation",
      field: "ctd_desc",
      sortable: true,
      width: 200,
      filterable: true,
      type: FieldType.string,
  },
  {
    id: "ctd_due_day",
    name: "Echéance",
    field: "ctd_due_day",
    sortable: true,
    filterable: true,
    type: FieldType.string,
  },
      
  ]

  this.gridOptionspay = {
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

  this.dataset = []
      this.payMethService.getAll().subscribe(
        
          (response: any) => {
          //  console.log(response.data),
            (this.pays = response.data),
         
          (error) => {
              this.pays = []
          },
          () => {}
         } )  
}
openpay(content) {
 
  this.prepareGridpay()
  this.modalService.open(content, { size: "lg" })
}
}
