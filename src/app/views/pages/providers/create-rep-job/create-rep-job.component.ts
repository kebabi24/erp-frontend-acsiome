import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { HttpClient } from "@angular/common/http";
import { HttpUtilsService } from "../../../../core/_base/crud";
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
import { RepertoryService, ProviderService,JobService} from "../../../../core/erp";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";

import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY } from "@angular/cdk/overlay/overlay-directives";
const myCustomStringFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>{
  if (value!= null){
    return `<div class="text"  aria-hidden="${value}" style="font-size:14px;" >${value}</div>`
  }
}
@Component({
  selector: 'kt-create-rep-job',
  templateUrl: './create-rep-job.component.html',
  styleUrls: ['./create-rep-job.component.scss']
})
export class CreateRepJobComponent implements OnInit {


  
  repForm: FormGroup;
  row_number;

  isExist = false

  
    

  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  message = "";
  user
    
    datacust: []
    columnDefinitionscust: Column[] = []
    gridOptionscust: GridOption = {}
    gridObjcust: any
    angularGridcust: AngularGridInstance

  columnDefinitions: Column[];
  gridOptions: GridOption;
  gridObj: any;
  dataView: any;
  grid: any;
  gridService: GridService;
  angularGrid: AngularGridInstance;
 
  columnDefinitionsJob: Column[];
  gridOptionsJob: GridOption;
  gridObjJob: any;
  dataViewJob: any;
  gridJob: any;
  gridServiceJob: GridService;
  angularGridJob: AngularGridInstance;

  datajob: [];
  columnDefinitionsj: Column[] = [];
  gridOptionsj: GridOption = {};
  gridObjj: any;
  angularGridj: AngularGridInstance;

  reps: any[] = [];
  jobs: any[] = [];
  httpOptions = this.httpUtils.getHTTPHeaders();
  contact:any;
  constructor(
    
    config: NgbDropdownConfig,
    private repFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private httpUtils: HttpUtilsService,
    private router: Router,
    public  dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private providerService: ProviderService,
    private jobService: JobService,
    private repertoryService: RepertoryService,
   
  ) {
    config.autoClose = true;
    
  }

 
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();

    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))       
    
    
    this.createForm();
    this.initGrid();
   this.initGridJob();
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = (angularGrid && angularGrid.slickGrid) || {};
    this.dataView = angularGrid.dataView;
    this.gridService = angularGrid.gridService;
  }

  initGrid() {
    this.reps = [];
    this.columnDefinitions = [
      {
        id: 'delete',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
           let ids=[]
           for(let da of this.jobs) {
            if (da.repd_contact == args.dataContext.rep_contact){
              console.log("da.id",da.id)
              ids.push(da.id)
            
            }
           }
           this.playAudio();
           this.gridServiceJob.deleteItemByIds(ids)
           this.gridService.deleteItem(args.dataContext);
          }
        
        }
        
      },
      // {
      //   id: "id",
      //   name: "id",
      //   field: "id",
      //   sortable: true,
      //   minWidth: 50,
      //   maxWidth: 50,
      //   filterable: true,
        
      // },
      {
        id: "rep_contact",
        name: "Contact",
        field: "rep_contact",
        sortable: true,
        width: 80,
        filterable: true,
        formatter:myCustomStringFormatter,
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
        formatter:myCustomStringFormatter,
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
        formatter:myCustomStringFormatter,
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
        formatter:myCustomStringFormatter,
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
        formatter:myCustomStringFormatter,
        editor: {
          model: Editors.text,
        }

      },
      {
        id: "mod",
        name: "Edit",
        field: "id",
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
       // formatter: Formatters.editIcon,
        formatter: (row, cell, value, columnDef, dataContext) => {
          // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
          return `
               <a class="btn btn-sm btn-clean btn-icon mr-2" title="Modifier Formation">
               <i class="flaticon2-plus"></i>
           </a>
           `;
        },
        minWidth: 50,
        maxWidth: 50,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id
          this.contact = args.dataContext.rep_contact
                // if( args.dataContext.po.po_stat == "V" ||  args.dataContext.po.po_stat == "P" || args.dataContext.po.po_stat == null) {
          // this.router.navigateByUrl(`/purchasing/edit-po/${id}`)
     
          // }
          // else {
          //   alert("Modification Impossible pour ce Status")
          // }
          this.addNewJob(this.contact)
        // })
        },
      },
    ];

    this.gridOptions = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      editable: true,
      autoHeight: false,
      autoCommitEdit:true,
      rowHeight:40,
      
    };

    // fill the dataset with your data
   
  }

  angularGridReadyJob(angularGrid: AngularGridInstance) {
    this.angularGridJob = angularGrid;
    this.gridObjJob = (angularGrid && angularGrid.slickGrid) || {};
    this.dataViewJob = angularGrid.dataView;
    this.gridServiceJob = angularGrid.gridService;
  }

  initGridJob() {
    this.jobs = [];
    this.columnDefinitionsJob = [
      {
        id: 'delete',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.gridServiceJob.deleteItem(args.dataContext);
          }
        
        }
        
      },
      // {
      //   id: "id",
      //   name: "id",
      //   field: "id",
      //   sortable: true,
      //   minWidth: 50,
      //   maxWidth: 50,
      //   filterable: true,
        
      // },
      {
        id: "repd_contact",
        name: "Code Contact",
        field: "repd_contact",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        formatter:myCustomStringFormatter,
    },
    {
      id: "repd_job",
      name: "Code Métier",
      field: "repd_job",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      formatter:myCustomStringFormatter,
      editor: {
        model: Editors.text,
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
        let element: HTMLElement = document.getElementById("openJobsGrid") as HTMLElement;
        element.click();
      },
    }, 
    {
      id: "desc",
      name: "Designation Job",
      field: "desc",
      sortable: true,
      width: 200,
      filterable: true,
      type: FieldType.string,
      formatter:myCustomStringFormatter,
  },
    
   
     
    ];

    this.gridOptionsJob = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      editable: true,
      autoHeight: false,
      autoCommitEdit:true,
      rowHeight:40,
    
      
    };

    // this.jobService.getAllwithDetail().subscribe(
        
    //   (response: any) => {
    //   //  console.log(response.data),
    //     this.jobs = response.data,
    //     this.dataViewJob.setItems(this.jobs)
    //   },
    //   (error) => {
    //       this.jobs = []
    //   },
    //   () => {}
    //   )
   
  }
  getRep() {
    this.reps = []
   
    const controls = this.repForm.controls
    this.providerService.getBy({vd_addr:controls.four.value}).subscribe((respo: any)=>{
      if(respo.data != null) {
        controls.name.setValue(respo.data.address.ad_name)
      }
  
   
    this.repertoryService.getBy({ rep_type: "Provider",rep_code : controls.four.value}).subscribe(
      (response: any) => {   
        this.reps = response.data
       console.log(this.reps)
       this.dataView.setItems(this.reps);
        
         },
      (error) => {
          this.reps = []
      },
      () => {}
  )
  this.repertoryService.getByJob({ repd_code : controls.four.value}).subscribe(
    (respo: any) => {   
      this.jobs = respo.data
     console.log(this.jobs)
     this.dataViewJob.setItems(this.jobs);
      
       },
    (error) => {
        this.jobs = []
    },
    () => {}
)
    })
  }
  onSubmit() {
    const controls = this.repForm.controls
  
    for (let data of this.reps) {
      delete data.id;
    
    }
    for (let data of this.jobs) {
      delete data.id;
    
    }
    this.repertoryService.addJob({addr: controls.four.value,repDetails: this.reps,jobDetails: this.jobs }).subscribe(
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
        this.reps=[]
        this.reset()
        this.loadingSubject.next(false);
      }
    );
  }
  createForm() {
    this.loadingSubject.next(false)
  //create form
  
  this.repForm = this.repFB.group({
      four: [null],
      name: [null]
  
  })
}

// prepareCode(): any {
//   const controls = this.empForm.controls
//   const _addReport = nchnagedew AddReport()
//   _addReport.pmr_pm_code = controls.pmr_pm_code.value
//   _addReport.pmr_inst = controls.pmr_inst.value
//   _addReport.pmr_task = controls.pmr_task.value
//   _addReport.pmr_task_status = controls.pmr_task_status.value
//   _addReport.pmr_close = controls.pmr_close.value
 
  
//   return _addReport
// }


  
  //reste form
  reset() {
    
    this.createForm();
    this.hasFormErrors = false;
    this.reps = []; 
    this.jobs = []; 
  }
  // save data
//   onSubmit() {
//     console.log("haha")
//     this.hasFormErrors = false;
//     const controls = this.empForm.controls;
//     /** check form */
//     if (this.empForm.invalid) {
//       Object.keys(controls).forEach((controlName) =>
//         controls[controlName].markAsTouched()
//       );
//       this.message = "Modifiez quelques éléments et réessayez de soumettre.";
//       this.hasFormErrors = true;
//       return;
//     }

//           let pme = this.prepareCode()
//           console.log(pme)
//           this.addDet(pme, this.emps, );
   
   
// /*
//   console.log("hhhhhhhjssfffjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
//   let pme = this.prepareCode()
//   console.log(pme)
//   this.addDet(pme, this.mvdataset);
//   console.log("jjjj")*/
//   }

  
  
//   addDet( _addReport: any ,detail: any) {
//     console.log("here")
//     for (let data of detail) {
//       delete data.id;
//       delete data.cmvid;
     
//     }
//     let emp = null;
//   //  const controls = this.empForm.controls // chof le champs hada wesh men form rah
//    // emp = controls.pmr_addr.value
//     for (let data of detail) {
//       delete data.id;
//       delete data.cmvid;
     
//     }
//     this.loadingSubject.next(true);
  
   
// }


  
  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  
  handleSelectedRowsChangedcust(e, args) {
    const controls = this.repForm.controls
   
    if (Array.isArray(args.rows) && this.gridObjcust) {
        args.rows.map((idx) => {
            const item = this.gridObjcust.getDataItem(idx)
            // TODO : HERE itterate on selected field and change the value of the selected field
            
                    controls.four.setValue(item.vd_addr || "")
                    controls.name.setValue(item.address.ad_name || "")
                    this.getRep()
            
        })
    }
}
angularGridReadycust(angularGrid: AngularGridInstance) {
    this.angularGridcust = angularGrid
    this.gridObjcust = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridcust() {
    this.columnDefinitionscust = [
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
        name: "Client",
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
      {
        id: "ad_taxable",
        name: "A Taxer",
        field: "address.ad_taxable",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_taxc",
        name: "Taxe",
        field: "address.ad_taxc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },    ]

    this.gridOptionscust = {
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
        dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
          var val = undefined;
          try {
            val = eval("item." + column.field);
          } catch (e) {
            // ignore
          }
          return val;
        },



    }

    // fill the dataset with your data
    this.providerService
        .getAll()
        .subscribe((response: any) => (this.datacust = response.data))
}
open(content) {
    
    this.prepareGridcust()
    this.modalService.open(content, { size: "lg" })
}
 
addNewItem() {
  const newId = this.reps.length+1;

  const newItem = {
    id: newId,
    rep_contact:null,
    rep_post: null,
    rep_tel: null,
    rep_tel2: null,
    rep_email: null,
    rep_type: "Provider",
  };
  this.gridService.addItem(newItem, { position: "bottom" });
}
addNewJob(contact) {
  const newId = this.jobs.length+1;

  const newItem = {
    id: newId,
    repd_contact:contact,
    repd_job: null,
    desc: null,
   
  };
  this.gridServiceJob.addItem(newItem, { position: "bottom" });
}

handleSelectedRowsChangedj(e, args) {
  let updateItem = this.gridServiceJob.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObjj) {
    args.rows.map((idx) => {
      const item = this.gridObjj.getDataItem(idx);
    console.log(item)
          updateItem.repd_job = item.jb_code;
          updateItem.desc= item.jb_desc;
          
          this.gridServiceJob.updateItem(updateItem);
         
    
});

  }
}
angularGridReadyj(angularGrid: AngularGridInstance) {
  this.angularGridj = angularGrid;
  this.gridObjj = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridj() {
  this.columnDefinitionsj = [
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
      id: "jb_code",
      name: "Code",
      field: "jb_code",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "jb_desc",
      name: "Designation",
      field: "jb_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    
  ];

  this.gridOptionsj = {
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
    // let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  
  // fill the dataset with your data
  this.jobService
    .getAll()
    .subscribe((response: any) => (this.datajob = response.data));
}
openjob(contenttask) {
  this.prepareGridj();
  this.modalService.open(contenttask, { size: "lg" });
}
playAudio(){
  let audio = new Audio();
  audio.src = "../../../assets/media/error/error.mp3";
  audio.load();
  audio.play();
}

}
