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
import { FormGroup, FormBuilder, Validators, NgControlStatus, FormControl } from "@angular/forms"
import { EmployeService, CodeService , ProjectService, TaskService,ProviderService,AddReportService,AddReport,SequenceService,ItemService, LocationService,
  CostSimulationService,LocationDetailService,InventoryStatusService,MesureService, SiteService,InventoryTransactionService} from "../../../../core/erp";
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
  selector: 'kt-launch-project',
  templateUrl: './launch-project.component.html',
  styleUrls: ['./launch-project.component.scss']
})
export class LaunchProjectComponent implements OnInit {

  addReport: AddReport;
  empForm: FormGroup;
  row_number;

  isExist = false

  emps: []
  columnDefinitionsemp: Column[] = []
  gridOptionsemp: GridOption = {}
  gridObjemp: any
  angularGridemp: AngularGridInstance
  
 

  dataset: []
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  gridObj: any
  angularGrid: AngularGridInstance
  
  
  
  

  details: any;
  // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];
  


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
  

  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  message = "";
  job: String;
  level: String;
  seq : any;
  nbr: string;
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


    pm_doc_list_code : String;
    project_code : String;
    specificationHeader :any 
    specificationDetails :any 
    validationForm: FormGroup;
    customeControls: Object = {};
    checkedValues = [];

    trigger_documents = [];

  constructor(
    
    config: NgbDropdownConfig,
    private empFB: FormBuilder,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public  dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private employeService: EmployeService,
    private addReportService: AddReportService,
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
    private locationDetailService: LocationDetailService
  ) {
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
   // this.initmvGrid();
    this.initcnsGrid();
  }
  createForm() {
    this.loadingSubject.next(false)
  //create form
  this.addReport = new AddReport()
  
  this.empForm = this.empFB.group({
      pmr_pm_code: [this.addReport.pmr_pm_code, Validators.required],
      pmdesc :  [{value: "", disabled: true}],

  })
}

// prepareCode(): any {
//   const controls = this.empForm.controls
//   const _addReport = new AddReport()
//   _addReport.pmr_pm_code = controls.pmr_pm_code.value
//   _addReport.pmr_inst = controls.pmr_inst.value
//   _addReport.pmr_task = controls.pmr_task.value
//   _addReport.pmr_task_status = controls.pmr_task_status.value
//   _addReport.pmr_close = controls.pmr_close.value
 
  
//   return _addReport
// }


  onChangeCode() {
    this.mvdataset = [];
    const controls = this.empForm.controls
    this.projectService
        .getBy({
              pmr_pm_code: controls.pmr_addr.value
        })
        .subscribe((response: any) => {
         // console.log(response.data)
          if (response.data.length == 0) {

            controls.pmr_addr.setValue(null);
            document.getElementById("pmr_pm_code").focus();
          } else {
            controls.pmdesc.setValue(response.data[0].pm_desc || "");
            this.getProjectEmployees(controls.pmr_addr.value)
          }
      
     })
  }
  //reste form
  reset() {
    
    this.createForm();
    this.hasFormErrors = false;
    this.mvdataset = []; 
  }
  // save data
  onSubmit() {
    let testsHistory = []
    let totalDetailsNB = 0;
    this.trigger_documents.forEach(doc=>{
      doc.spec_details.forEach(detail=>{
        totalDetailsNB +=1 
        console.log(detail)
        const index = this.checkedValues.findIndex(detaill=>{
          return detaill == detail.mpd_label
       })

       if(index == -1){
        testsHistory.push({
         mph_test : detail.mpd_label,
         mph_rsult : "false"
        })
      }else{
       testsHistory.push({
         mph_test : detail.mpd_label,
         mph_rsult : "true"
        })
      }


      })
    })
    
    let update_project_status = false
    if (totalDetailsNB == this.checkedValues.length){
      update_project_status = true
    }
    

    this.projectService
      .createTestsHistoryUpdateStatus(testsHistory,update_project_status,this.project_code)
      .subscribe(
        (reponse) => {

          this.createForm();
          this.mvdataset = []
          
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
          this.createForm();
          this.layoutUtilsService.showActionNotification(
            "résultats enregistr avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.loadingSubject.next(false);
          // this.router.navigateByUrl("/customers-mobile/cluster-create")
        }
      );

  }

  
  
  addDet( _addReport: any ,detail: any, cnsdetail: any, nbr : any) {
    console.log("here")
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
     
    }
    for (let data of cnsdetail) {
      delete data.id;
      delete data.cmvid;
     
    }
    let emp = null;
  //  const controls = this.empForm.controls // chof le champs hada wesh men form rah
   // emp = controls.pmr_addr.value
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
     
    }
    this.loadingSubject.next(true);
  
    this.addReportService
      .add({ addReport : _addReport, empDetail: detail, cnsDetail: cnsdetail,  nbr })
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
            this.router.navigateByUrl("/project/add-report")
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
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  // initmvGrid() {
  //   this.mvcolumnDefinitions = [
    
      

  //     {
  //       id: "pme_employe",
  //       name: "Code employé",
  //       field: "pme_employe",
  //       sortable: true,
  //       width: 80,
  //       filterable: false,
  //       type: FieldType.string,
  //     },
  //     {
  //       id: "emp_lname",
  //       name: "Nom",
  //       field: "emp_lname",
  //       sortable: true,
  //       width: 80,
  //       filterable: false,
  //       type: FieldType.string,
  //     },
  //     {
  //       id: "emp_fname",
  //       name: "Prénom",
  //       field: "emp_fname",
  //       sortable: true,
  //       width: 80,
  //       filterable: false,
  //       type: FieldType.string,
  //     },
  //     {
  //       id: "pme_start_date",
  //       name: "Date Début",
  //       field: "pme_start_date",
  //       sortable: true,
  //       width: 80,
  //       filterable: false,
  //       type: FieldType.dateIso,
  //               editor: {
  //         model: Editors.date,
  //       },
  //     },
  //     {
  //       id: "pme_end_date",
  //       name: "Date Fin",
  //       field: "pme_end_date",
  //       sortable: true,
  //       width: 80,
  //       filterable: false,
  //       type: FieldType.dateIso,
  //               editor: {
  //         model: Editors.date,
  //       },
  //     },
    
  //     {
  //       id: "pme_inst",
  //       name: "Instruction",
  //       field: "pme_inst",
  //       sortable: true,
  //       width: 80,
  //       filterable: false,
        
  //   },
  //   {
  //     id: "pme_task",
  //     name: "Tâche",
  //     field: "pme_task",
  //     sortable: true,
  //     width: 80,
  //     filterable: false,
      
  //    },


     
  //   ];

  //   this.mvgridOptions = {
  //     asyncEditorLoading: false,
  //     editable: true,
  //     enableColumnPicker: true,
  //     enableCellNavigation: true,
  //     enableRowSelection: true,
  //   };

  //   this.mvdataset = [];
  // }


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
               alert ("Qte monquante")
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
                  alert ("Qte monquante")
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
                      alert ("Qte monquante")
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
    const newId = this.mvdataset.length+1;

    const newItem = {
      id: newId,
      pmr_internal: true,
      pmr_addReport : "",
      fname: null,
      lname: null,
      job  : null,
      level: null,
    };
    this.mvgridService.addItem(newItem, { position: "bottom" });
  }

 

handleSelectedRowsChanged(e, args) {
  this.mvdataset = [];
  const controls = this.empForm.controls // chof le champs hada wesh men form rah
  if (Array.isArray(args.rows) && this.gridObj) {
    args.rows.map((idx) => {
      const item = this.gridObj.getDataItem(idx);
      controls.pmr_pm_code.setValue(item.pm_code || "");
      controls.pmdesc.setValue(item.pm_desc || "");
      this.pm_doc_list_code = item.pm_doc_list_code
      this.getProjectInsts(item.pm_code)
      this.getLaunchSpecifications(item.pm_code)
      this.project_code = item.pm_code
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
          id: "pm_code",
          name: "Code Projet",
          field: "pm_code",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "pm_desc",
          name: "Designation",
          field: "pm_desc",
          sortable: true,
          width: 120,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "pm_cust",
        name: "Client",
        field: "pm_cust",
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
  this.projectService
  // {pm_status: ""}
      .getByAll({})
      .subscribe((response: any) =>{ 
        this.dataset = response.data
      })
}

open(content) {
 
  this.prepareGrid()
  this.modalService.open(content, { size: "lg" })
}

handleSelectedRowsChangedemp(e, args) {
  const controls = this.empForm.controls
  let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number)
  if (Array.isArray(args.rows) && this.gridObjemp) {
      args.rows.map((idx) => {
          const item = this.gridObjemp.getDataItem(idx)
          console.log(item)
     if (item.emp_job != this.job || item.emp_level != this.level) {

      alert("Métier ou Niveai de maitrise ne correspond pas a cet employé")
      updateItem.pmr_employe = null
      this.mvgridService.updateItem(updateItem)
    } else {   
          updateItem.pmr_employe = item.emp_addr
          updateItem.fname = item.emp_fname
          updateItem.lname = item.emp_lname
          updateItem.job = item.emp_job
          updateItem.level = item.emp_level
          
          this.mvgridService.updateItem(updateItem)
     }
      })
  }
}

angularGridReadyemp(angularGrid: AngularGridInstance) {
  this.angularGridemp = angularGrid
  this.gridObjemp = (angularGrid && angularGrid.slickGrid) || {}
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
    name: "Métier",
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
      },
      multiSelect: false,
      rowSelectionOptions: {
          selectActiveRow: true,
      },
  }

  // fill the dataset with your data
  this.employeService
      .getAll()
      .subscribe((response: any) => (this.emps = response.data))
}

openemp(content) {
 
  this.prepareGridemp()
  this.modalService.open(content, { size: "lg" })
}


onAlertClose($event) {
  this.hasFormErrors = false
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

openDocumentListPopup(content100){
    this.projectService
    .getSpecificationData(this.pm_doc_list_code)
    .subscribe((response: any) => {
      console.log(response.data)
      this.specificationHeader = response.data.specification
      this.specificationDetails = response.data.specificationDetails

      this.specificationDetails.forEach((detail) => {
        this.customeControls[detail.mpd_type] = new FormControl("");
        this.customeControls[detail.mpd_type + "text-area"] =
          new FormControl("");
      });

      // console.log(this.customeControls)

    })
    this.modalService.open(content100, { size: "lg" })

}

showInstructionsPopup(content101){
  this.modalService.open(content101, { size: "lg" })
}

// mvdataset
getProjectEmployees(project_code){
  this.projectService
      .getEmpProject(project_code)
      .subscribe((response: any) =>{ 
        console.log(response.data)
        this.mvdataset = response.data
        this.mvdataView.setItems(response.data)
      })
}

getProjectInsts(project_code){
  this.projectService
      .getBy({pm_code: project_code})
      .subscribe((response: any) =>{ 
        console.log(response.data.details)
        this.mvdataset = response.data.details
      //  this.mvdataView.setItems(response.data)
      })
}
getLaunchSpecifications(project_code){
  this.projectService
      .getLaunchSpecifications(project_code)
      .subscribe((response: any) =>{ 
        console.log(response.data)
        this.trigger_documents = response.data
      })
}

onCheckClick(val){
  console.log(val)
  const index = this.checkedValues.findIndex(detail=>{
    return detail == val
  })
  if(index == -1){this.checkedValues.push(val)}
  else{
    this.checkedValues.splice(index, 1);
  }
    console.log(this.checkedValues)
}

}
