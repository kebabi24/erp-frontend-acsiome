import { Component, OnInit } from "@angular/core"
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
import { AlertComponent } from "../../../partials/content/crud"
import { sequence } from "@angular/animations"
import { Reason, ReasonService} from "../../../../core/erp"

@Component({
  selector: 'kt-edit-requisition',
  templateUrl: './edit-requisition.component.html',
  styleUrls: ['./edit-requisition.component.scss']
})
export class EditRequisitionComponent implements OnInit {

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

reqEdit: any;
  row_number;
  user
  message=''
  reqdate: any;
  needdate: any;
  title: String = "Modifier Demamde d'achat - "
  empname: any
  vendname: any
  constructor(
      config: NgbDropdownConfig,
      private reqFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private modalService: NgbModal,
      private layoutUtilsService: LayoutUtilsService,
      private requisitionService: RequisitionService,
      private providersService: ProviderService,
      private userService: UsersService,
      private sequencesService: SequenceService,
      private itemsService: ItemService,
      private reasonService: ReasonService,
      private employeService : EmployeService,
  ) {
      config.autoClose = true
      this.initGrid()
  }
  gridReady(angularGrid: AngularGridInstance) {
      this.angularGrid = angularGrid
      this.dataView = angularGrid.dataView
      this.grid = angularGrid.slickGrid
      this.gridService = angularGrid.gridService
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
              editor: {
                  model: Editors.text,
              },
              onCellChange: (e: Event, args: OnEventArgs) => {
               
                  const controls = this.reqForm.controls 
                  this.itemsService.getBy({pt_part: args.dataContext.rqd_part }).subscribe((resp:any)=>{
                      
                    if (resp.data.length != 0) {
        
        
                      if (resp.data[0].pt_buyer !== controls.rqm_category.value ) {
                        alert("Access Interdit pour cet article")
                        this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , rqd_part: null })
        
        
                      } else {
        
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , rqd_desc: resp.data[0].pt_desc1 , rqd_um:resp.data[0].pt_um})
        
                      }
              
              
                 }  else {
                    alert("Article Nexiste pas")
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , rqd_part: null })
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
                  this.row_number = args.row
                  let element: HTMLElement = document.getElementById('openItemsGrid') as HTMLElement;
                  element.click();
                }
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
              id: "rqd_req_qty",
              name: "QTE",
              field: "rqd_req_qty",
              sortable: true,
              width: 80,
              filterable: false,
              type: FieldType.float,
              editor: {
                  model: Editors.float,
                  params:{decimalPlaces:2}
              },
          },
          {
              id: "rqd_um",
              name: "UM",
              field: "rqd_um",
              sortable: true,
              width: 80,
              filterable: false,
              
          },
          {
              id: "rqd_cc",
              name: "Centre de cout",
              field: "rqd_cc",
              sortable: true,
              width: 80,
              filterable: false,
              editor: {
                  model: Editors.text,
              },
              
          },
          {
              id: "rqd_vpart",
              name: "Observation",
              field: "rqd_vpart",
              sortable: true,
              width: 80,
              filterable: false,
              editor: {
                  model: Editors.longText,
              },
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
     // this.createForm()
      this.user =  JSON.parse(localStorage.getItem('user'))
      this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.requisitionService.getOne(id).subscribe((response: any)=>{
            console.log(response.data)
          this.reqEdit = response.data.requisition
          this.dataset = response.data.details
          this.reqdate = new Date(this.reqEdit.rqm_req_date)
          this.needdate = new Date(this.reqEdit.rqm_need_date)
          this.reqdate.setDate(this.reqdate.getDate() )
          this.needdate.setDate(this.needdate.getDate() )
          console.log(this.reqEdit)
         
         this.createForm()
         const controls = this.reqForm.controls
         this.employeService.getBy({ emp_addr: this.reqEdit.rqm_rqby_userid }).subscribe((respemp: any) => {
            console.log(respemp.data)
            this.empname = respemp.data[0].emp_fname
            controls.empname.setValue(this.empname)
         })
         if(this.reqEdit.rqm_vend != null && this.reqEdit.rqm_vend != "") {
         this.providersService.getBy({ vd_addr: this.reqEdit.rqm_vend }).subscribe((respvend: any) => {
            console.log(respvend.data)
            this.vendname = respvend.data.address.ad_name
            controls.name.setValue(this.vendname)
         })
        }
        //  for(var i=0; i< this.dataset.length; i++) {

        //   this.dataset[i].rqd_desc = this.dataset[i].item.pt_desc1
        //  }
          this.loadingSubject.next(false)
         this.title = this.title + this.reqEdit.rqm_nbr
         console.log(this.title)
        })
    })
    this.initGrid()
    
  }

  //create form
  createForm() {
      this.loadingSubject.next(false)
    //  this.requisition = new Requisition()
     // const date = new Date;
      this.reqForm = this.reqFB.group({
        rqm_nbr: [{value: this.reqEdit.rqm_nbr , disabled: true}],
        rqm_type: [this.reqEdit.rqm_type ],
        rqm_category: [{value: this.reqEdit.rqm_category , disabled: true}],
        seqname: [this.reqEdit.sequence.seq_desc],
        rqm_vend: [this.reqEdit.rqm_vend ],
        name: [null],
        rqm_req_date:[{
          year: this.reqdate.getFullYear(),
          month: this.reqdate.getMonth() + 1,
          day: this.reqdate.getDate() ,
          
        }],
        rqm_need_date: [{
          year: this.needdate.getFullYear(),
          month: this.needdate.getMonth() + 1,
          day: this.needdate.getDate() ,
          
        }], 
        
        rqm_rqby_userid: [this.reqEdit.rqm_rqby_userid],
        empname:[this.empname],
        rqm_reason: [this.reqEdit.rqm_reason ],
        // rqm_status: [this.reqEdit.rqm_status ],
        rqm_rmks: [this.reqEdit.rqm_rmks ],
      })
  }


  onChangeSeq() {
      const controls = this.reqForm.controls
      this.sequencesService
          .getBy({seq_seq: controls.rqm_category.value, seq_type: 'RQ', seq_profile: this.user.usrd_profile})
          .subscribe((response: any) => {
              console.log(response)
              if (response.data.length == 0) {
                  alert("Sequence nexiste pas")
                  controls.rqm_category.setValue("")
                  console.log(response.data.length)
                  document.getElementById("SEQUENCE").focus();
              } 
          })
  }
  
  //reste form
  reset() {
      this.requisition = new Requisition()
     // this.createForm()
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
        // delete data.desc
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
        _req.rqm_category =  controls.rqm_category.value
        _req.rqm_nbr=  controls.rqm_nbr.value
        _req.rqm_vend =  controls.rqm_vend.value
        _req.rqm_req_date=  controls.rqm_req_date.value ? `${controls.rqm_req_date.value.year}/${controls.rqm_req_date.value.month}/${controls.rqm_req_date.value.day}`: null
        _req.rqm_need_date=  controls.rqm_need_date.value ? `${controls.rqm_need_date.value.year}/${controls.rqm_need_date.value.month}/${controls.rqm_need_date.value.day}`: null
        _req.rqm_rqby_userid=  controls.rqm_rqby_userid.value
        _req.rqm_reason=  controls.rqm_reason.value
        // _req.rqm_status=  controls.rqm_status.value
        _req.rqm_rmks=  controls.rqm_rmks.value
        _req.rqm_open= true
        _req.rqm_aprv_stat = '0'
        _req.rqm_type =  controls.rqm_type.value
        _req.chr01= controls.name.value
        _req.chr02= controls.empname.value
      return _req
  }
  /**
   * Add req
   *
   * @param _req: req
   */
  addReq(_req: any, detail:any) {
      this.loadingSubject.next(true)
      this.requisitionService.updatedet({ requisition: _req, details: detail },this.reqEdit.id).subscribe(
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
              this.router.navigateByUrl("purchasing/list-req-user")
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
      this.gridService.addItem({
          id: this.dataset.length + 1,
          rqd_line: this.dataset.length + 1,
          rqd_part: "",
          cmvid: "",
          rqd_desc: "",
          rqd_req_qty: 0,
          rqd_um: "",
          rqd_cc: "",
          rqd_vpart: "",
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
  onChangeVend() {
    const controls = this.reqForm.controls;
console.log("controls.rqm_vend.value",controls.rqm_vend.value)
    if(controls.rqm_vend.value != null && controls.rqm_vend.value != "") {
    this.providersService.getBy({ vd_addr: controls.rqm_vend.value }).subscribe((response: any) => {
      //   const { data } = response;
      console.log(response.data);
      if (response.data == null ) {
        alert("Fournisseur n'exist pas")
        controls.rqm_vend.setValue(null)
        document.getElementById("name").focus();
      } else {
        
        controls.name.setValue(response.data[0].address.ad_name);
      }
    });
}
else { 
    controls.rqm_vend.setValue(null) 
    controls.name.setValue(null)
}
  }
  handleSelectedRowsChanged2(e, args) {
      const controls = this.reqForm.controls
      if (Array.isArray(args.rows) && this.gridObj2) {
          args.rows.map((idx) => {
            const item = this.gridObj2.getDataItem(idx)
            controls.rqm_vend.setValue(item.vd_addr || "")
            controls.name.setValue(item.address.ad_name)
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
  onChangeEmp() {
    const controls = this.reqForm.controls;
console.log("controls.rqm_vend.value",controls.rqm_rqby_userid.value)
    if(controls.rqm_rqby_userid.value != null && controls.rqm_rqby_userid.value != "") {
      
    this.employeService.getBy({ emp_addr: controls.rqm_rqby_userid.value }).subscribe((response: any) => {
      //   const { data } = response;
      
      if (response.data.length == 0 ) {
        alert("Employe n'exist pas")
        controls.rqm_rqby_userid.setValue(null)
        controls.empname.setValue(null)
        document.getElementById("empname").focus();
      } else {
        
        controls.empname.setValue(response.data.emp_fname);
      }
    });
}
else { 
    controls.rqm_vend.setValue(null) 
    controls.empname.setValue(null)
}
  }
  handleSelectedRowsChanged3(e, args) {
    const controls = this.reqForm.controls
    if (Array.isArray(args.rows) && this.gridObj3) {
        args.rows.map((idx) => {
            const item = this.gridObj3.getDataItem(idx)
            console.log(item)
            controls.rqm_rqby_userid.setValue(item.emp_addr || "")
            controls.empname.setValue(item.emp_fname || "")
        })
    }
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
        multiSelect: false,
        rowSelectionOptions: {
            // True (Single Selection), False (Multiple Selections)
            selectActiveRow: true,
        },
    }

    // fill the dataset with your data
    this.employeService.getAll().subscribe((response: any) => (this.users = response.data));
}
  open3(content) {
      this.prepareGrid3()
      this.modalService.open(content, { size: "lg" })
  }

  handleSelectedRowsChanged4(e, args) {
      let updateItem = this.gridService.getDataItemByRowIndex(this.row_number)
      if (Array.isArray(args.rows) && this.gridObj4) {
          args.rows.map((idx) => {
              const item = this.gridObj4.getDataItem(idx)
              console.log(item)
              updateItem.rqd_part = item.pt_part
              updateItem.rqd_desc = item.pt_desc1
              updateItem.rqd_um = item.pt_um
              this.gridService.updateItem(updateItem);

          })
      }
  }

  angularGridReady4(angularGrid: AngularGridInstance) {
      this.angularGrid4 = angularGrid
      this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {}
  }

  prepareGrid4() {
      const controls = this.reqForm.controls
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
              name: "UM",
              field: "pt_um",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
      ]

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
      }

      // fill the dataset with your data
      
      this.itemsService
          .getBy ({pt_buyer: controls.rqm_category.value })
          .subscribe((response: any) => (this.items = response.data))
       
  }
  open4(content) {
      this.prepareGrid4()
      this.modalService.open(content, { size: "lg" })
  }
  handleSelectedRowsChanged6(e, args) {
    const controls = this.reqForm.controls
    if (Array.isArray(args.rows) && this.gridObj6) {
        args.rows.map((idx) => {
            const cause = this.gridObj6.getDataItem(idx)
            console.log(cause)
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

}
