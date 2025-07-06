import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import { jsPDF } from "jspdf";
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
import { Requisition, RequisitionService, SequenceService, ProviderService, UsersService, ItemService, EmployeService } from "../../../../core/erp"
import { Reason, ReasonService} from "../../../../core/erp"
import { AlertComponent } from "../../../partials/content/crud"
import { sequence } from "@angular/animations"

@Component({
    selector: "kt-create-purchase-order",
    templateUrl: "./create-purchase-order.component.html",
    styleUrls: ["./create-purchase-order.component.scss"],
})
export class CreatePurchaseOrderComponent implements OnInit {
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
    domain: any;
    message='';
    nbr:any;

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
        private providerService: ProviderService,
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
          
                        this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data[0].pt_desc1 , rqd_um:resp.data[0].pt_um})
          
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
        this.user =  JSON.parse(localStorage.getItem('user'))
        this.domain = JSON.parse(localStorage.getItem("domain"));
        this.createForm()
        
    }

    //create form
    createForm() {
        this.loadingSubject.next(false)
        this.requisition = new Requisition()
        const date = new Date;
        this.reqForm = this.reqFB.group({
          rqm_category: [this.requisition.rqm_category , Validators.required],
          seqname: [null],
          rqm_nbr: [this.requisition.rqm_nbr ],
          rqm_vend: [this.requisition.rqm_vend ],
          name: [null],
          rqm_type: "P",
          
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
          
          
          rqm_rqby_userid: [this.requisition.rqm_rqby_userid, Validators.required],
          empname: [null],
          rqm_reason: [this.requisition.rqm_reason ],
        //   rqm_status: [this.requisition.rqm_status ],
          rqm_rmks: [this.requisition.rqm_rmks ],
        })

        const controls = this.reqForm.controls
        this.sequencesService
            .getBy({ seq_type: 'RQ', seq_profile: this.user.usrd_profile})
            .subscribe((response: any) => {
                console.log(response.data)
controls.rqm_category.setValue(response.data[0].seq_seq)
controls.seqname.setValue(response.data[0].seq_desc)

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
                    controls.rqm_category.setValue(null)
                    controls.seqname.setValue(null)
                    console.log(response.data.length)
                    document.getElementById("SEQUENCE").focus();
                } else {
                    controls.seqname.setValue(response.data[0].seq_desc)
                }
              
            })
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
        this.sequencesService
        .getBy({seq_seq: controls.rqm_category.value, seq_type: 'RQ', seq_profile: this.user.usrd_profile})
        .subscribe((response: any) => {
            console.log(response)
            if (response.data.length == 0) {
                alert("Sequence n existe pas")
                controls.rqm_category.setValue("")
                console.log(response.data.length)
                document.getElementById("SEQUENCE").focus();
            }
            this.nbr = `${response.data[0].seq_prefix}${Number(response.data[0].seq_curr_val)+1}`
console.log(this.nbr)
this.addReq(req, this.dataset)
        })
       
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
          _req.rqm_type =  controls.rqm_type.value
          _req.rqm_req_date=  controls.rqm_req_date.value ? `${controls.rqm_req_date.value.year}/${controls.rqm_req_date.value.month}/${controls.rqm_req_date.value.day}`: null
          _req.rqm_need_date=  controls.rqm_need_date.value ? `${controls.rqm_need_date.value.year}/${controls.rqm_need_date.value.month}/${controls.rqm_need_date.value.day}`: null
          _req.rqm_rqby_userid=  controls.rqm_rqby_userid.value
          _req.rqm_reason=  controls.rqm_reason.value
        //   _req.rqm_status=  controls.rqm_status.value
          _req.rqm_rmks=  controls.rqm_rmks.value
          _req.rqm_open= true
          _req.rqm_aprv_stat = '0'
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
                this.printpdf(this.nbr);
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
            
            rqd_req_qty: 0,
            rqd_um: "",
            rqd_cc: "",
            rqd_desc: "",
            rqd_vpart:""
        },{position:"bottom"})
    }

    handleSelectedRowsChanged(e, args) {
        const controls = this.reqForm.controls
        if (Array.isArray(args.rows) && this.gridObj1) {
            args.rows.map((idx) => {
                const item = this.gridObj1.getDataItem(idx)

                controls.rqm_category.setValue(item.seq_seq || "")
                controls.seqname.setValue(item.seq_desc)
                this.sequencesService
//             .getBy({seq_seq: item.seq_seq, seq_type: 'RQ', seq_profile: this.user.usrd_profile})
//             .subscribe((response: any) => {
//                 console.log(response)
//                 if (response.data.length == 0) {
//                     alert("Sequence nexiste pas")
//                     controls.rqm_category.setValue("")
//                     console.log(response.data.length)
//                     document.getElementById("SEQUENCE").focus();
//                 }
// //                 this.nbr = `${response.data[0].seq_prefix}-${Number(response.data[0].seq_curr_val)+1}`
// // console.log(this.nbr)
//             })
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
        this.providerService.getBy({ vd_addr: controls.rqm_vend.value }).subscribe((response: any) => {
          //   const { data } = response;
          console.log(response.data);
          if (response.data == null ) {
            alert("Fournisseur n'exist pas")
            controls.rqm_vend.setValue(null)
            controls.name.setValue(null)
            document.getElementById("rqm_vend").focus();
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
                name: "desc",
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
            .getBy ({pt_buyer:controls.rqm_category.value })
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
    printpdf(nbr) {
        console.log(this.nbr,nbr)
        // const controls = this.totForm.controls
        const controlss = this.reqForm.controls;
        console.log("pdf");
        var doc = new jsPDF();
        let date = new Date()
       // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
        var img = new Image()
        img.src = "./assets/media/logos/companyentete.png";
        doc.addImage(img, 'png', 5, 5, 200, 30)
        doc.setFontSize(9);
        // if (this.domain.dom_name != null) {
        //   doc.text(this.domain.dom_name, 10, 10);
        // }
        // if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
        // if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
        // if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
        doc.setFontSize(14);
    
        // doc.line(10, 35, 200, 35);
        doc.setFontSize(12);
        doc.text("DEMANDE D'APPROVISIONNEMENT N° : " + nbr, 40, 45);
        doc.text("Date: " + date.toLocaleDateString() , 160, 45);
        
          doc.text("A: " + new Date().toLocaleTimeString(), 160, 50);
          doc.text("Edité par: " + this.user.usrd_code, 160, 55);
          
         
          doc.setFontSize(8);
          //console.log(this.provider.ad_misc2_id)
          doc.text("Demandeur   : " + controlss.rqm_rqby_userid.value + " " + controlss.empname.value, 20, 55);
         ( controlss.rqm_vend.value!=null &&  controlss.rqm_vend.value != "") ? doc.text("Fournisseur : " + controlss.rqm_vend.value + " " + controlss.name.value, 20, 60) : doc.text("Fournisseur : " , 20, 60) ;
          
       
    
        doc.line(10, 85, 185, 85);
        doc.line(10, 90, 185, 90);
        doc.line(10, 85, 10, 90);
        doc.text("LN", 12.5, 88.5);
        doc.line(20, 85, 20, 90);
        doc.text("Code Article", 22, 88.5);
        doc.line(60, 85, 60, 90);
        doc.text("Désignation", 67.5, 88.5);
        doc.line(110, 85, 110, 90);
        doc.text("QTE", 117, 88.5);
        doc.line(125, 85, 125, 90);
        doc.text("UM", 127, 88.5);
        doc.line(135, 85, 135, 90);
        doc.text("OBSERVATION", 137, 88.5);
        doc.line(185, 85, 185, 90);
        var i = 95;
        doc.setFontSize(6);
        let total = 0
        for (let j = 0; j < this.dataset.length  ; j++) {
          total = total + Number(this.dataset[j].tr_qty_loc)
          
          if ((j % 20 == 0) && (j != 0) ) {
            doc.addPage();
            img.src = "./assets/media/logos/companyentete.png";
            doc.addImage(img, 'png', 5, 5, 200, 30)
            doc.setFontSize(9);
            // if (this.domain.dom_name != null) {
            //   doc.text(this.domain.dom_name, 10, 10);
            // }
            // if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
            // if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
            // if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
            doc.setFontSize(14);
            // doc.line(10, 35, 200, 35);
    
            doc.setFontSize(12);
            doc.text("DEMANDE D'APPROVISIONNEMENT N° : " + nbr, 40, 45);
            doc.text("Date: " + date.toLocaleDateString() , 160, 45);
            
            doc.text("A: " + new Date().toLocaleTimeString(), 160, 50);
            doc.text("Edité par: " + this.user.usrd_code, 160, 55);
          
          
            doc.setFontSize(8);
            //console.log(this.provider.ad_misc2_id)
            doc.text("Demandeur   : " + controlss.rqm_rqby_userid.value + " " + controlss.empname.value, 20, 55);
            ( controlss.rqm_vend.value!=null &&  controlss.rqm_vend.value != "") ? doc.text("Fournisseur : " + controlss.rqm_vend.value + " " + controlss.name.value, 20, 60) : doc.text("Fournisseur : " , 20, 60) ;
            
        doc.line(10, 85, 185, 85);
        doc.line(10, 90, 185, 90);
        doc.line(10, 85, 10, 90);
        doc.text("LN", 12.5, 88.5);
        doc.line(20, 85, 20, 90);
        doc.text("Code Article", 22, 88.5);
        doc.line(60, 85, 60, 90);
        doc.text("Désignation", 67.5, 88.5);
        doc.line(110, 85, 110, 90);
        doc.text("QTE", 117, 88.5);
        doc.line(125, 85, 125, 90);
        doc.text("UM", 127, 88.5);
        doc.line(135, 85, 135, 90);
        doc.text("OBSERVATION", 137, 88.5);
        doc.line(185, 85, 185, 90);
            i = 95;
            doc.setFontSize(8);
          }
    
          if (this.dataset[j].rqd_desc.length > 35) {
            let desc1 = this.dataset[j].rqd_desc.substring(35);
            let ind = desc1.indexOf(" ");
            desc1 = this.dataset[j].rqd_desc.substring(0, 35 + ind);
            let desc2 = this.dataset[j].rqd_desc.substring(35 + ind);
    
            doc.line(10, i - 5, 10, i);
            doc.text(String("000" + Number(j + 1)).slice(-3), 12.5, i - 1);
            doc.line(20, i - 5, 20, i);
            doc.text(this.dataset[j].rqd_part, 22, i - 1);
            doc.line(60, i - 5, 60, i);
            doc.text(desc1, 62, i - 1);
            doc.line(110, i - 5, 110, i);
            doc.text(String(Number(this.dataset[j].rqd_req_qty)), 123, i - 1, { align: "right" });
            doc.line(125, i - 5, 125, i);
            doc.text(this.dataset[j].rqd_um, 127, i - 1);
            doc.line(135, i - 5, 135, i);
            doc.text(String(this.dataset[j].rqd_vpart), 137, i - 1);
            doc.line(185, i - 5, 185, i);
            // doc.line(10, i, 200, i );
    
            i = i + 5;
    
            doc.text(desc2, 62, i - 1);
    
            doc.line(10, i - 5, 10, i);
            doc.line(20, i - 5, 20, i);
            doc.line(60, i - 5, 60, i);
            doc.line(110, i - 5, 110, i);
            doc.line(125, i - 5, 125, i);
            doc.line(135, i - 5, 135, i);
            doc.line(185, i - 5, 185, i);
            doc.line(10, i, 185, i);
    
            i = i + 5;
          } else {
            doc.line(10, i - 5, 10, i);
            doc.text(String("000" + Number(j + 1)).slice(-3), 12.5, i - 1);
            doc.line(20, i - 5, 20, i);
            doc.text(this.dataset[j].rqd_part, 22, i - 1);
            doc.line(60, i - 5, 60, i);
            doc.text(this.dataset[j].rqd_desc, 62, i - 1);
            doc.line(110, i - 5, 110, i);
            doc.text(String(Number(this.dataset[j].rqd_req_qty)), 123, i - 1, { align: "right" });
            doc.line(125, i - 5, 125, i);
            doc.text(this.dataset[j].rqd_um, 127, i - 1);
            doc.line(135, i - 5, 135, i);
            doc.text(String(this.dataset[j].rqd_vpart), 137, i - 1,);
            doc.line(185, i - 5, 185, i);
            doc.line(10, i, 185, i);
            i = i + 5;
          }
        }
        // doc.text("NOMBRE DE BIG BAG    " + String(this.dataset.length) + "    ,TOTAL POIDS:   " + String(Number(total)), 40, i + 12, { align: "left" });
        doc.setFontSize(12);
        doc.text("Validé par: " , 20, i + 22);
        doc.text("Note: " , 20, i + 32);
        // doc.line(10, i - 5, 200, i - 5);
    /*
        doc.line(130, i + 7, 205, i + 7);
        doc.line(130, i + 14, 205, i + 14);
        //  doc.line(130, i + 21, 200, i + 21 );
        //  doc.line(130, i + 28, 200, i + 28 );
        //  doc.line(130, i + 35, 200, i + 35 );
        doc.line(130, i + 7, 130, i + 14);
        doc.line(160, i + 7, 160, i + 14);
        doc.line(205, i + 7, 205, i + 14);
        doc.setFontSize(10);
    
        doc.text("Total HT", 140, i + 12, { align: "left" });
        //  doc.text('TVA', 140 ,  i + 19 , { align: 'left' });
        //  doc.text('Timbre', 140 ,  i + 26 , { align: 'left' });
        //  doc.text('Total TC', 140 ,  i + 33 , { align: 'left' });
    
        doc.text(String(Number(total).toFixed(2)), 198, i + 12, { align: "right" });
        //  doc.text(String(Number(controls.tva.value).toFixed(2)), 198 ,  i + 19 , { align: 'right' });
        //  doc.text(String(Number(controls.timbre.value).toFixed(2)), 198 ,  i + 26 , { align: 'right' });
        //  doc.text(String(Number(controls.ttc.value).toFixed(2)), 198 ,  i + 33 , { align: 'right' });
    
        doc.setFontSize(8);
        let mt = NumberToLetters(Number(total).toFixed(2), "Dinars Algerien");
    
        if (mt.length > 95) {
          let mt1 = mt.substring(90);
          let ind = mt1.indexOf(" ");
    
          mt1 = mt.substring(0, 90 + ind);
          let mt2 = mt.substring(90 + ind);
    
          doc.text("Arretée la présente Commande a la somme de :" + mt1, 20, i + 53);
          doc.text(mt2, 20, i + 60);
        } else {
          doc.text("Arretée la présente Commande a la somme de :" + mt, 20, i + 53);
        }
        */
        // window.open(doc.output('bloburl'), '_blank');
        //window.open(doc.output('blobUrl'));  // will open a new tab
        doc.save('DEMANDE-' + nbr + '.pdf')
        var blob = doc.output("blob");
        window.open(URL.createObjectURL(blob));
      }
}
