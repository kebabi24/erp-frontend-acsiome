import { Component, OnInit , ViewEncapsulation} from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"

// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Editor,
    Editors,
    AngularGridInstance,
    GridService,
    Formatters,
    FieldType,
    OnEventArgs,
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
import {
    NgbModal,
    NgbActiveModal,
    ModalDismissReasons,
    NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap"
import { Requisition, RequisitionService, SequenceService, ProviderService, UsersService, ItemService,EmployeService } from "../../../../core/erp"
import { Reason, ReasonService} from "../../../../core/erp"
import { AlertComponent } from "../../../partials/content/crud"
import { sequence } from "@angular/animations"

@Component({
  selector: 'kt-create-req-training',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './create-req-training.component.html',
  styleUrls: ['./create-req-training.component.scss']
})
export class CreateReqTrainingComponent implements OnInit {

  requisition: Requisition
  reqForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

  angularGrid: AngularGridInstance
  grid: any
  gridService: GridService
  dataView: any
  columnDefinitions: Column[]
  gridOptions: GridOption
  dataset: any[]

  sequences: []
  columnDefinitions1: Column[] = []
  gridOptions1: GridOption = {}
  gridObj1: any
  angularGrid1: AngularGridInstance

  providers: []
  columnDefinitions2: Column[] = []
  gridOptions2: GridOption = {}
  gridObj2: any
  angularGrid2: AngularGridInstance

  users: []
  columnDefinitions3: Column[] = []
  gridOptions3: GridOption = {}
  gridObj3: any
  angularGrid3: AngularGridInstance

  items: []
  columnDefinitions4: Column[] = []
  gridOptions4: GridOption = {}
  gridObj4: any
  angularGrid4: AngularGridInstance
  
  causes: []
  columnDefinitions6: Column[] = []
  gridOptions6: GridOption = {}
  gridObj6: any
  angularGrid6: AngularGridInstance
  
  row_number;
  user
  message=''
employe: any
seq:any
selectedJob: any[] = [];
datasetemps: any[]
data: any[]
un: any
  constructor(
      config: NgbDropdownConfig,
      private reqFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private modalService: NgbModal,
      private layoutUtilsService: LayoutUtilsService,
      private requisitonService: RequisitionService,
      private providersService: ProviderService,
      private userService: UsersService,
      private sequencesService: SequenceService,
      private itemsService: ItemService,
      private reasonService: ReasonService,
      private employeService: EmployeService
  ) {
      config.autoClose = true
      this.initGrid()
  }
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;

    // if you want to change background color of Duration over 50 right after page load,
    // you would put the code here, also make sure to re-render the grid for the styling to be applied right away
    this.dataView.getItemMetadata = this.updateItemMetadata(this.dataView.getItemMetadata);
    this.grid.invalidate();
    this.grid.render();
     
  }
  updateItemMetadata(previousItemMetadata: any) {
    const newCssClass = "highlight-bg";
    // console.log(this.dataView);
    return (rowNumber: number) => {
      const item = this.dataView.getItem(rowNumber);
      let meta = {
        cssClasses: "",
      };
      if (typeof previousItemMetadata === "object") {
        meta = previousItemMetadata(rowNumber);
      }

     
      if (meta && item && item.rqd_insp_rqd) {

        const state = item.rqd_insp_rqd;
       
        if (state === true) {
         
          meta.cssClasses = (meta.cssClasses || "") + " " + newCssClass;
        }
      }

      return meta;
    };
  }
  handleSelectedRowsChangedS(e, args) {
    if (Array.isArray(args.rows) && this.grid) {
      args.rows.map((idx) => {
        const item = this.grid.getDataItem(idx);
        // this.itinerary = this.services[idx].role_itineraries
      
        // console.log(this.itinerary);
      });
    }
   
  }
  initGrid() {
      this.columnDefinitions = [
          {
              id: "id",
              field: "id",
              excludeFromHeaderMenu: true,
              formatter: Formatters.deleteIcon,
              minWidth: 30,
              maxWidth: 30,
              onCellClick: (e: Event, args: OnEventArgs) => {
                  if (confirm('Êtes-vous sûr de supprimer cette ligne?')) {
                      this.angularGrid.gridService.deleteItem(args.dataContext);
                    }
                }
          },
          
          {
              id: "rqd_line",
              name: "Ligne",
              field: "rqd_line",
              minWidth: 50,
              maxWidth: 50,
              selectable: true,
          },
          {
              id: "rqd_part",
              name: "Article",
              field: "rqd_part",
              sortable: true,
              width: 50,
              filterable: false,
            
          },
         
          {
              id: "rqd_desc",
              name: "Description",
              field: "rqd_desc",
              sortable: true,
              width: 80,
              filterable: false,
              
          },
          {
              id: "rqd_rqby_userid",
              name: "Employe",
              field: "rqd_rqby_userid",
              sortable: true,
              width: 80,
              filterable: false,
              type: FieldType.string,
             
          },
          {
            id: "chr01",
            name: "Nom ",
            field: "chr01",
            sortable: true,
            width: 80,
            filterable: false,
            type: FieldType.float,
           
        },
          {
            id: "rqd_need_date",
            name: "Date Début",
            field: "rqd_need_date",
            sortable: true,
            width: 80,
            filterable: false,
            type: FieldType.dateIso,
            formatter: Formatters.dateIso,
            editor: {
                model: Editors.date,
               
            },
        },
        {
          id: "rqd_expire",
          name: "Date Fin",
          field: "rqd_expire",
          sortable: true,
          width: 80,
          filterable: false,
          type: FieldType.dateIso,
          formatter: Formatters.dateIso,
          editor: {
              model: Editors.date,
             
          },
        },
        
        {
          id: "rqd_insp_rqd",
          name: "Déja Faite",
          field: "rqd_insp_rqd",
          type: FieldType.boolean,
          formatter: Formatters.checkmark,
          filterable:true,
          sortable: true,
         
        },      

          
      ]

      this.gridOptions = {
          asyncEditorLoading: false,
          editable: true,
          enableColumnPicker: true,
          enableCellNavigation: true,
          enableRowSelection: true,
      }

      this.dataset = []
  }
  ngOnInit(): void {
      this.loading$ = this.loadingSubject.asObservable()
      this.loadingSubject.next(false)
      this.user =  JSON.parse(localStorage.getItem('user'))
      this.createForm()
      
  }

  //create form
  createForm() {
      this.loadingSubject.next(false)
      this.requisition = new Requisition()
      const date = new Date;
      this.reqForm = this.reqFB.group({
        // rqm_category: [this.requisition.rqm_category , Validators.required],
        // rqm_nbr: [this.requisition.rqm_nbr ],
        // rqm_vend: [this.requisition.rqm_vend ],
        
        rqm_req_date:[{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }],
        rqm_need_date: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }], 
        rqm_due_date: [{
          year:date.getFullYear(),
          month: date.getMonth()+2,
          day: date.getDate() 
        }], 
        
        rqm_rqby_userid: [this.requisition.rqm_rqby_userid],
        rqm_end_userid: [this.requisition.rqm_end_userid],
        part: [null],
        desc:[null],
        rqm_rmks: [this.requisition.rqm_rmks ],
      })
      const controls = this.reqForm.controls
      console.log(this.user.usrd_code)
      this.employeService
      .getByOne({emp_userid: this.user.usrd_code})
      .subscribe((response: any) => {
          //console.log(response)
          if (response.data != null) {
           this.employe = (response.data.emp_addr)
          controls.rqm_rqby_userid.setValue(this.user.usrd_code)
       
          } else {
            alert("Vous n'etes pas affecter à un employé")
          }
      })
      this.sequencesService
      .getByOne({ seq_type: 'RQ', seq_profile: this.user.usrd_profile})
      .subscribe((response: any) => {
         // console.log(response)
          if (response.data == null) {
              alert("Sequence nexiste pas")
              
          } else {
            this.seq = response.data.seq_seq
          //  alert(this.seq)
          }
      })
  }


  onChangeSeq() {
      const controls = this.reqForm.controls
      this.sequencesService
          .getBy({seq_seq: controls.rqm_category.value, seq_type: 'RQ', seq_profile: this.user.usrd_profile})
          .subscribe((response: any) => {
             // console.log(response)
              if (response.data.length == 0) {
                  alert("Sequence nexiste pas")
                  controls.rqm_category.setValue("")
                 // console.log(response.data.length)
                  document.getElementById("SEQUENCE").focus();
              } 
          })
  }
  onchangePart() {
    const controls = this.reqForm.controls;
  
    this.itemsService
      .getByOne({
        pt_part: controls.part.value,
      })
      .subscribe((response: any) => {
      //  console.log(response.data, response.data.length);
        if (response.data!= null) {
         
          controls.part.setValue(response.data.pt_part);
          controls.desc.setValue(response.data.pt_desc1);
          this.un = response.data.pt_um
        
        } 
      });
  }
  //reste form
  reset() {
      this.requisition = new Requisition()
      this.createForm()
      this.hasFormErrors = false
  }
  
  // save data
  onSubmit() {
      this.hasFormErrors = false
      const controls = this.reqForm.controls
      /** check form */
      if (this.reqForm.invalid) {
          Object.keys(controls).forEach((controlName) =>
              controls[controlName].markAsTouched()
          )
          this.message = 'Modifiez quelques éléments et réessayez de soumettre.'
          this.hasFormErrors = true

          return
      }

      if (!this.dataset.length){
          this.message = 'La liste des article ne peut pas etre vide'
          this.hasFormErrors = true

          return
      }
      // tslint:disable-next-line:prefer-const
      let req = this.prepareReq()
      for(let data of this.dataset){
        delete data.id
        delete data.cmvid
      
      }
      this.addReq(req, this.dataset)
  }
  
  /**
   *
   * Returns object for saving
   */
  prepareReq(): any {
      const controls = this.reqForm.controls
      const _req = new Requisition()
      _req.rqm_category =  this.seq
     //   _req.rqm_nbr=  controls.rqm_nbr.value
       
        _req.rqm_type =  "P"
        _req.rqm_req_date=  controls.rqm_req_date.value ? `${controls.rqm_req_date.value.year}/${controls.rqm_req_date.value.month}/${controls.rqm_req_date.value.day}`: null
        _req.rqm_need_date=  controls.rqm_need_date.value ? `${controls.rqm_need_date.value.year}/${controls.rqm_need_date.value.month}/${controls.rqm_need_date.value.day}`: null
        _req.rqm_due_date=  controls.rqm_due_date.value ? `${controls.rqm_due_date.value.year}/${controls.rqm_due_date.value.month}/${controls.rqm_due_date.value.day}`: null
        _req.rqm_rqby_userid=  controls.rqm_rqby_userid.value
        _req.rqm_end_userid=  controls.rqm_end_userid.value
        // _req.rqm_reason=  controls.rqm_reason.value
        // _req.rqm_status=  controls.rqm_status.value
        _req.rqm_rmks=  controls.rqm_rmks.value
        _req.rqm_open= true
        _req.rqm_aprv_stat = '0'
      return _req
  }
  /**
   * Add req
   *
   * @param _req: req
   */
  addReq(_req: any, detail:any) {
      this.loadingSubject.next(true)
      this.requisitonService.add({ requisition: _req, requisitionDetail: detail }).subscribe(
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
              this.router.navigateByUrl("/")
          }
      )
  }

  /**
   * Go back to the list
   *
   */
  goBack() {
      this.loadingSubject.next(false)
      const url = `/`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }

  // add new Item to Datatable
  addNewItem() {
      this.angularGrid.gridService.addItem({
          id:  1,
          rqd_line: this.dataset.length + 1,
          rqd_part: "",
          cmvid: "",
        //  rqd_rqby_userid:req,
          rqd_req_qty: 0,
          rqd_um: "",
          rqd_cc: "",
          rqd_desc: "",
      },{position:"bottom"})
  }

  handleSelectedRowsChanged(e, args) {
      const controls = this.reqForm.controls
      if (Array.isArray(args.rows) && this.gridObj1) {
          args.rows.map((idx) => {
              const item = this.gridObj1.getDataItem(idx)
              controls.rqm_category.setValue(item.seq_seq || "")
          })
      }
  }

  angularGridReady(angularGrid: AngularGridInstance) {
      this.angularGrid1 = angularGrid
      this.gridObj1 = (angularGrid && angularGrid.slickGrid) || {}
  }

  prepareGrid1() {
      this.columnDefinitions1 = [
          {
              id: "id",
              name: "id",
              field: "id",
              sortable: true,
              minWidth: 80,
              maxWidth: 80,
          },
          {
              id: "seq_seq",
              name: "code sequence",
              field: "seq_seq",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
              id: "seq_desc",
              name: "description",
              field: "seq_desc",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
              id: "seq_appr1",
              name: "approbateur 1",
              field: "seq_appr1",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
              id: "seq_appr2",
              name: "approbateur 2",
              field: "seq_appr2",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
              id: "seq_appr3",
              name: "approbateur 3",
              field: "seq_appr3",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
      ]

      this.gridOptions1 = {
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
      }

      // fill the dataset with your data
     
      this.sequencesService
          .getBy({seq_type: 'RQ', seq_profile: this.user.usrd_profile})
          .subscribe((response: any) => (this.sequences = response.data))
         
  }
  open(content) {
      this.prepareGrid1()
      this.modalService.open(content, { size: "lg" })
  }
  handleSelectedRowsChanged2(e, args) {
      const controls = this.reqForm.controls
      if (Array.isArray(args.rows) && this.gridObj2) {
          args.rows.map((idx) => {
              const item = this.gridObj2.getDataItem(idx)
              controls.rqm_vend.setValue(item.vd_addr || "")
          })
      }
  }

  angularGridReady2(angularGrid: AngularGridInstance) {
      this.angularGrid2 = angularGrid
      this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {}
  }

  prepareGrid2() {
      this.columnDefinitions2 = [
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
              field: 'address.ad_name',
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
              id: "ad_phone",
              name: "Numero telephone",
              field: 'address.ad_phone',
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          
      ]

      this.gridOptions2 = {
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
            }
      }

      // fill the dataset with your data
      this.providersService
          .getAll()
          .subscribe((response: any) => (this.providers = response.data))
  }
  open2(content) {
      this.prepareGrid2()
      this.modalService.open(content, { size: "lg" })
  }

  // handleSelectedRowsChanged3(e, args) {
  //     const controls = this.reqForm.controls
  //     if (Array.isArray(args.rows) && this.gridObj3) {
  //         args.rows.map((idx) => {
  //             const item = this.gridObj3.getDataItem(idx)
  //        this.list.push(item.emp_addr)//     console.log(item)
  //             controls.rqm_rqby_userid.setValue(item.usrd_code || "")
  //         })
  //     }
  // }
  handleSelectedRowsChanged3(e, args) {
    const controls = this.reqForm.controls
    if (Array.isArray(args.rows) && this.gridObj3) {
      this.selectedJob = args.rows.map((idx: number) => {
        const item = this.gridObj3.getDataItem(idx);
        return item.emp_addr;
      });
    }
   // console.log(this.selectedJob)
   let enduser = ""
   for (let d of this.selectedJob) {
    enduser =enduser + d + ","  
   }
    controls.rqm_end_userid.setValue(enduser)
  }
  angularGridReady3(angularGrid: AngularGridInstance) {
      this.angularGrid3 = angularGrid
      this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {}
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
              id: "emp_addr",
              name: "code Employe",
              field: "emp_addr",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
              id: "emp_fname",
              name: "nom",
              field: "emp_fname",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
      ]

      this.gridOptions3 = {
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
      }

      // fill the dataset with your data
   //   console.log(this.user)
      this.employeService
      .getByOne({emp_userid: this.user.usrd_code})
      .subscribe((respo: any) => {
         // console.log(respo)
          if (respo.data != null) {
           this.employe = (respo.data.emp_addr)
           this.employeService
           .getChild({emp_addr: this.employe})
           .subscribe((response: any) => (this.users = response.data))
       
          } else {
            alert("Vous n'etes pas affecter à un employé")
          }
      })
    
  }
  open3(content) {
      this.prepareGrid3()
      this.modalService.open(content, { size: "lg" })
  }
  getTraining(){
    const controls = this.reqForm.controls
    this.dataset= []
  this.data=[]
        //console.log(this.dataset.length)
        this.employeService
        .getBy({emp_addr:this.selectedJob})
        .subscribe((response: any) => {this.datasetemps = response.data
       // console.log(this.datasetemps)
      
         let  id = 0
          for (let dat of this.datasetemps){
            let bool = false
            this.employeService
            .getTrBy({empf_code:dat.emp_addr,empf_part: controls.part.value})
            .subscribe((respo: any) => {
              if (respo.data!= null) {
                bool = true
              }
            //  console.log(dat)
       //      this.dataset.push({
        this.angularGrid.gridService.addItem({
                id:  id + 1,
                rqd_line: id + 1,
                rqd_part: controls.part.value,
                rqd_desc: controls.desc.value,
                rqd_um: this.un,
                rqd_rqby_userid: dat.emp_addr,
                rqd_need_date: `${controls.rqm_need_date.value.year}-${controls.rqm_need_date.value.month}-${controls.rqm_need_date.value.day}`,
                rqd_expire: `${controls.rqm_due_date.value.year}-${controls.rqm_due_date.value.month}-${controls.rqm_due_date.value.day}`,
                chr01: dat.emp_fname + ' ' + dat.emp_lname,
                rqd_req_qty: 1,
                rqd_insp_rqd: bool,
                rqd_status: bool ? "X" : null,
                rqd_aprv_stat: 0,
              },
              { position: "bottom" });
              id++
            })
          }

        });
   console.log(this.dataset)
   this.dataView.setItems(this.dataset)
 
  // this.updateItemMetadata(this.dataView.getItemMetadata);
   this.grid.invalidate();
   this.grid.render();
   this.modalService.dismissAll()
  }

 
  handleSelectedRowsChanged6(e, args) {
      const controls = this.reqForm.controls
      if (Array.isArray(args.rows) && this.gridObj6) {
          args.rows.map((idx) => {
              const cause = this.gridObj6.getDataItem(idx)
              //console.log(cause)
              controls.rqm_reason.setValue(cause.rsn_ref || "")

          })
      }
  }
  angularGridReady6(angularGrid: AngularGridInstance) {
      this.angularGrid6 = angularGrid
      this.gridObj6 = (angularGrid && angularGrid.slickGrid) || {}
  }
  prepareGrid6() {
      const controls = this.reqForm.controls
      this.columnDefinitions6 = [
          {
              id: "id",
              name: "id",
              field: "id",
              sortable: true,
              minWidth: 80,
              maxWidth: 80,
          },
         
         
          {
            id: "rsn_ref",
            name: "Code",
            field: "rsn_ref",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        
          {
              id: "rsn_desc",
              name: "Designation",
              field: "rsn_desc",
              sortable: true,
              width: 200,
              filterable: true,
              type: FieldType.string,
          },
      ]

      this.gridOptions6 = {
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
      }

      // fill the dataset with your data
      
      this.reasonService
          .getBy ({rsn_type: 'REQUISITION' })
          .subscribe((response: any) => (this.causes = response.data))
       
  }
  open6(content) {
      this.prepareGrid6()
      this.modalService.open(content, { size: "lg" })
  }
  onAlertClose($event) {
      this.hasFormErrors = false
  }
  handleSelectedRowsChanged4(e, args) {
    const controls = this.reqForm.controls; 
    //let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
      if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
     
        controls.part.setValue(item.pt_part || ""); 
        controls.desc.setValue(item.pt_desc1 || ""); 
        this.un = item.pt_um
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
      field: "pt_origin",
      type: FieldType.string,
      filterable:true,
      sortable: true,
     
    },      
    {
      id: "pt_meter_um",
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
    this.itemsService
      .getBy({pt_part_type : "FORMATION"})
      .subscribe((response: any) => (this.items = response.data));
  }
  openpart(content) {
    this.prepareGrid4();
    this.modalService.open(content, { size: "xl" });
  }
  
}
