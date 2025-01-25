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
import { EmployeService, CodeService , ProjectService, TaskService,ProviderService,AddReportService,AddReport,AffectEmp,AffectEmpService,SequenceService,ItemService, LocationService,
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
  selector: 'kt-launch-training-session',
  templateUrl: './launch-training-session.component.html',
  styleUrls: ['./launch-training-session.component.scss']
})
export class LaunchTrainingSessionComponent implements OnInit {

  addReport: AddReport; 
  affectEmp : AffectEmp;
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
  
  datasets: []
  columnDefinitionss: Column[] = []
  gridOptionss: GridOption = {}
  gridObjs: any
  angularGrids: AngularGridInstance
  
  

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
    selected_doc : any ; 
    selected_doc_index: any ; 
    total_nb_details = 0 ; 
    showAlert = false 

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
    private affectEmpService: AffectEmpService,
    private projectService: ProjectService,
    private itemsService: ItemService,
    private codeService: CodeService,
    private mesureService: MesureService,
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
  }
  createForm() {
    this.loadingSubject.next(false)
  //create form
  this.affectEmp = new AffectEmp()
  
  this.empForm = this.empFB.group({
      pme_nbr: [this.affectEmp.pme_nbr, Validators.required],
      pmdesc :  [{value: "", disabled: true}],

  })
}

// prepareCode(): any {
//   const controls = this.empForm.controls
//   const _addReport = new AddReport()
//   _addReport.pmr_nbr = controls.pmr_nbr.value
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
              pme_pm_code: controls.pmr_addr.value
        })
        .subscribe((response: any) => {
         // console.log(response.data)
          if (response.data.length == 0) {

            controls.pmr_addr.setValue(null);
            document.getElementById("pmr_nbr").focus();
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

    if(this.checkedValues.length < this.total_nb_details ){
      console.log("nope")
      this.showAlert = true
      return 
    }
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
            "résultats enregistrés avec succès",
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
 


 

handleSelectedRowsChanged(e, args) {
  this.mvdataset = [];
  const controls = this.empForm.controls // chof le champs hada wesh men form rah
  if (Array.isArray(args.rows) && this.gridObj) {
    args.rows.map((idx) => {
      const item = this.gridObj.getDataItem(idx);
      controls.pmr_nbr.setValue(item.pm_code || "");
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

      alert("Compétence ou Niveai de maitrise ne correspond pas a cet employé")
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

handleSelectedRowsChangeds(e, args) {
  this.mvdataset = [];
  const controls = this.empForm.controls // chof le champs hada wesh men form rah
  if (Array.isArray(args.rows) && this.gridObjs) {
    args.rows.map((idx) => {
      const item = this.gridObjs.getDataItem(idx);
      
      
//       controls.pme_start_date.setValue({year: new Date(item.pme_start_date).getFullYear(),
//       month: new Date(item.pme_start_date).getMonth() + 1,
//       day: new Date(item.pme_start_date).getDate(),}
// )
//       controls.pme_end_date.setValue({year: new Date(item.pme_end_date).getFullYear(),
//         month: new Date(item.pme_end_date).getMonth() + 1,
//         day: new Date(item.pme_end_date).getDate(),})
      controls.pme_nbr.setValue(item.pme_nbr)
      controls.pmdesc.setValue(item.pme_inst)
      this.project_code = item.pme_nbr
      // controls.pme_site.setValue(item.pme_site)
      // controls.pme_duration.setValue(item.pme_duration)
      // controls.pme_task.setValue(item.pme_task)
      // this.affectEmpService.getBy({pme_pm_code:controls.pme_pm_code.value,pme_nbr:item.pme_nbr}).subscribe((response: any) =>{ 
      //   const datas = response.data
       
      //   for (let items of datas)
      //   {
      //     const newId = this.mvdataset.length+1;
      //     this.employeService.getByOne({emp_addr:items.pme_employe}).subscribe((emp: any) =>{let employe = emp.data
      //       console.log(employe)
      //       this.mvgridService.addItem(
      //         {id:newId,
      //           pme_employe:items.pme_employe,
      //          fname:employe.emp_fname,
      //          lname:employe.emp_lname,
      //          pme_cmmt:items.pme_cmmt, 
        
      //               }, { position: "bottom" });
      //     })
        
      //   };
        
      // })
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
  const controls = this.empForm.controls
 
  this.affectEmpService
  // {pm_status: ""}
      .getBy({pme_task_status:null})
      .subscribe((response: any) =>{ 
        this.datasets = response.data
        
      })
}
opens(contents) {
 
  this.prepareGrids()
  this.modalService.open(contents, { size: "lg" })
}




openDocumentListPopup(content100){
  const controls = this.empForm.controls
  this.affectEmpService.getBy({pme_nbr:controls.pme_nbr.value}).subscribe((response: any) =>{ 
        this.mvdataset = response.data
        this.mvdataView.setItems(response.data)
        console.log(this.mvdataset)
      })

      // console.log(this.customeControls)

    
    this.modalService.open(content100, { size: "lg" })

}

openTestPopup(content , index){
  this.selected_doc = this.trigger_documents[index]
  this.selected_doc_index = index

  this.modalService.open(content, { size: "lg" })

}

showInstructionsPopup(content101){
  this.modalService.open(content101, { size: "lg" })
}

// mvdataset
getProjectEmployees(project_code){
  // this.projectService
  //     .getEmpProject(project_code)
  //     .subscribe((response: any) =>{ 
  //       this.mvdataset = response.data
  //       this.mvdataView.setItems(response.data)
  //       console.log(this.mvdataset)
  //     })
  const controls = this.empForm.controls

  this.affectEmpService.getBy({pme_nbr:controls.pme_nbr.value}).subscribe((response: any) =>{ 
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
               pme_cmmt:items.pme_cmmt, 
        
                    }, { position: "bottom" });
          })
        
        };
        
      })
}

getProjectInsts(project_code){
  const controls = this.empForm.controls
  this.affectEmpService.getBy({pme_nbr:controls.pme_nbr.value}).subscribe((response: any) =>{ 
        this.mvdataset = response.data
        this.mvdataView.setItems(response.data)
        console.log(this.mvdataset)
      })
  // this.projectService
  //     .getBy({pm_code: project_code})
  //     .subscribe((response: any) =>{ 
  //       this.mvdataset = response.data.details
  //     //  this.mvdataView.setItems(response.data)
  //     })
}

getLaunchSpecifications(project_code){
  const controls = this.empForm.controls
  this.affectEmpService.getBy({pme_nbr:controls.pme_nbr.value}).subscribe((response: any) =>{ 
        this.mvdataset = response.data
        this.mvdataView.setItems(response.data)
        console.log(this.mvdataset)
      })
}

onCheckClick(val){
  if(this.checkedValues.length == 0){
    this.checkedValues.push(val)
    this.trigger_documents[this.selected_doc_index].count_checked = 1 
    return
  }else{
      const index = this.checkedValues.findIndex(detail=>{
        return detail == val
      })
      if(index == -1){
        this.checkedValues.push(val)
        this.trigger_documents[this.selected_doc_index].count_checked += 1 
      }
      else{
        this.checkedValues.splice(index, 1);
        this.trigger_documents[this.selected_doc_index].count_checked = -1 
      } 
  }
}

}
