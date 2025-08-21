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
  FieldType,
  Formatters,
  OnEventArgs,
} from "angular-slickgrid"
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
import {
    NgbModal,
    NgbActiveModal,
    ModalDismissReasons,
    NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap"

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
import { SequenceService, Sequence, UsersService ,CodeService} from "../../../../core/erp"

@Component({
  selector: 'kt-create-seq-req',
  templateUrl: './create-seq-req.component.html',
  styleUrls: ['./create-seq-req.component.scss']
})
export class CreateSeqReqComponent implements OnInit {
  sequence: Sequence
    seqForm: FormGroup
    hasFormErrors = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>

    profiles: []
    columnDefinitions: Column[] = []
    gridOptions: GridOption = {}
    gridObj: any
    angularGrid: AngularGridInstance
    isExist = false
    users: []
    columnDefinitions1: Column[] = []
    gridOptions1: GridOption = {}
    gridObj1: any
    angularGrid1: AngularGridInstance

    mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];
  row_number;

  transacts: []
  columnDefinitions4: Column[] = []
  gridOptions4: GridOption = {}
  gridObj4: any
  angularGrid4: AngularGridInstance


    level = 1
    constructor(
        config: NgbDropdownConfig,
        private seqFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private sequenceService: SequenceService,
        private userService: UsersService,
        private modalService: NgbModal,
        private codeService: CodeService,
    ) {
        config.autoClose = true
    }
    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.createForm()
        this.initmvGrid();
    }

    handleSelectedRowsChanged(e, args) {
        const controls = this.seqForm.controls
        if (Array.isArray(args.rows) && this.gridObj) {
            args.rows.map((idx) => {
                const item = this.gridObj.getDataItem(idx)
                controls.seq_profile.setValue(item.usrg_code || "")
            })
        }
    }

    angularGridReady(angularGrid: AngularGridInstance) {
        this.angularGrid = angularGrid
        this.gridObj = (angularGrid && angularGrid.slickGrid) || {}
    }
    handleSelectedRowsChanged1(e, args) {
        const controls = this.seqForm.controls
        if (Array.isArray(args.rows) && this.gridObj1) {
            args.rows.map((idx) => {
                const item = this.gridObj1.getDataItem(idx)
                this.level == 1
                    ? controls.seq_appr1.setValue(item.usrd_code || "")
                    : this.level == 2
                    ? controls.seq_appr2.setValue(item.usrd_code || "")
                    : controls.seq_appr3.setValue(item.usrd_code || "")
            })
        }
    }

    angularGridReady1(angularGrid: AngularGridInstance) {
        this.angularGrid1 = angularGrid
        this.gridObj1 = (angularGrid && angularGrid.slickGrid) || {}
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
                id: "usrg_code",
                name: "code profil",
                field: "usrg_code",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "usrg_description",
                name: "description",
                field: "usrg_description",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
        ]

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
        this.userService
            .getAllProfiles()
            .subscribe((response: any) => (this.profiles = response.data))
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
                id: "usrd_code",
                name: "code user",
                field: "usrd_code",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "usrd_name",
                name: "nom",
                field: "usrd_name",
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
        this.userService
            .getAllUsers()
            .subscribe((response: any) => (this.users = response.data))
    }
    open(content) {
        this.prepareGrid()
        this.modalService.open(content, { size: "lg" })
    }

    open1(content) {
        this.prepareGrid1()
        this.level = 1
        this.modalService.open(content, { size: "lg" })
    }
    open2(content) {
        this.prepareGrid1()
        this.level = 2
        this.modalService.open(content, { size: "lg" })
    }
    open3(content) {
        this.prepareGrid1()
        this.level = 3
        this.modalService.open(content, { size: "lg" })
    }
    //create form
    createForm() {
        this.loadingSubject.next(false)
        this.sequence = new Sequence()
        this.seqForm = this.seqFB.group({
            seq_seq: [this.sequence.seq_seq, Validators.required],
            seq_desc: [this.sequence.seq_desc, Validators.required],
            
            // seq_profile: [this.sequence.seq_profile, Validators.required],
            seq_appr1: [{ value:this.sequence.seq_appr1,  disabled: !this.isExist},Validators.required],
          
            // seq_appr1_thr: [this.sequence.seq_appr1_thr,   Validators.required],
            seq_appr2: [this.sequence.seq_appr2,  Validators.required],
            // seq_appr2_thr: [this.sequence.seq_appr2_thr, Validators.required],
            seq_appr3: [this.sequence.seq_appr3, Validators.required],
            // seq_appr3_thr: [this.sequence.seq_appr3_thr, Validators.required],
            seq_valid_date_start: [this.sequence.seq_valid_date_start, Validators.required],
            seq_valid_date_end: [this.sequence.seq_valid_date_end, Validators.required],
            seq_prefix: [this.sequence.seq_prefix, Validators.required],
            seq_dig_range_inf: [this.sequence.seq_dig_range_inf, Validators.required],
            seq_dig_range_sup: [this.sequence.seq_dig_range_sup, Validators.required],
        })
    }

    onChangeCode() {
        const controls = this.seqForm.controls
        
        this.sequenceService
        .getByOne({
            seq_seq: controls.seq_seq.value,
        })
        .subscribe((response: any) => {
        console.log(response.data)
            if (response.data) {
              controls.seq_seq.setValue(null);
              document.getElementById("seq_seq").focus();
             alert("Code Existe Déja")

            }
        })     
    }
    onChangePrefix() {
      const controls = this.seqForm.controls
      
      this.sequenceService
      .getByOne({
          seq_prefix: controls.seq_prefix.value,
          seq_type: "RQ"
      })
      .subscribe((response: any) => {
      console.log(response.data)
          if (response.data) {
            controls.seq_prefix.setValue(null);
            document.getElementById("seq_prefix").focus();
           alert("Préfixe Déja Utilisé")

          }
      })     
  }
    //reste form
    reset() {
        this.sequence = new Sequence()
        this.createForm()
        this.hasFormErrors = false
    }
    // save data
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.seqForm.controls
        /** check form */
        if (this.seqForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )

            this.hasFormErrors = true
            return
        }

        // tslint:disable-next-line:prefer-const
        for(let data of this.mvdataset) {delete data.id}
        let seq = this.prepareSeq()
        this.addSeq(seq,this.mvdataset)
    }
    /**
     * Returns object for saving
     */
    prepareSeq(): any {
        const controls = this.seqForm.controls
        const _sequence = new Sequence()
        
        _sequence.seq_seq = controls.seq_seq.value
        _sequence.seq_desc = controls.seq_desc.value
        _sequence.seq_type = "RQ"
       
        _sequence.seq_appr1 = controls.seq_appr1.value
        _sequence.seq_appr1_lev = 1
        // _sequence.seq_appr1_thr = controls.seq_appr1_thr.value
        _sequence.seq_appr2 = controls.seq_appr2.value
        _sequence.seq_appr2_lev = 2
        // _sequence.seq_appr2_thr = controls.seq_appr2_thr.value
        _sequence.seq_appr3 = controls.seq_appr3.value
        _sequence.seq_appr3_lev = 3
        // _sequence.seq_appr3_thr = controls.seq_appr3_thr.value
        _sequence.seq_valid_date_start = controls.seq_valid_date_start.value
            ? `${controls.seq_valid_date_start.value.year}/${controls.seq_valid_date_start.value.month}/${controls.seq_valid_date_start.value.day}`
            : null
        _sequence.seq_valid_date_end = controls.seq_valid_date_end.value
            ? `${controls.seq_valid_date_end.value.year}/${controls.seq_valid_date_end.value.month}/${controls.seq_valid_date_end.value.day}`
            : null
        _sequence.seq_prefix = controls.seq_prefix.value
        _sequence.seq_dig_range_inf = controls.seq_dig_range_inf.value
        _sequence.seq_dig_range_sup = controls.seq_dig_range_sup.value
        _sequence.seq_curr_val = Number( controls.seq_dig_range_inf.value)  - 1

        return _sequence
    }
    /**
     * Add seq
     *
     * @param _Seq: seqModel
     */
    addSeq(_seq: Sequence,detail:any) {
        this.loadingSubject.next(true)
        this.sequenceService.addS({seq:_seq,details:detail}).subscribe(
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
    addNewItem() {
      const controls = this.seqForm.controls
      this.mvgridService.addItem(
        {
          id: this.mvdataset.length + 1,
          usgseq_code: controls.seq_seq.value,
          usgseq_service: null,
          chr01: null,
          
        },
        { position: "bottom" }
      );
      this.row_number = this.mvdataset.length - 1;
            // this.row_number = args.row
            let element: HTMLElement = document.getElementById(
              "openItemsGrid"
          ) as HTMLElement
          element.click()
    }
    mvGridReady(angularGrid: AngularGridInstance) {
      this.mvangularGrid = angularGrid;
      this.mvdataView = angularGrid.dataView;
      this.mvgrid = angularGrid.slickGrid;
      this.mvgridService = angularGrid.gridService;
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
        id: "usgseq_service",
        name: "Service",
        field: "usgseq_service",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.text,
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
          this.row_number = args.row;
          let element: HTMLElement = document.getElementById(
            "openItemsGrid"
          ) as HTMLElement;
          element.click();
        },
      },
      {
        id: "chr01",
        name: "Description",
        field: "chr01",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        editor: {
          model: Editors.text,
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
  handleSelectedRowsChanged4(e, args) {
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        const index = this.mvdataset.findIndex(detaill=>{
          return detaill.usgseq_service == item.code_value
       })
       if (index == -1) {
        console.log(item);
        updateItem.usgseq_service = item.code_value;
        updateItem.chr01 = item.code_cmmt;
        
        this.mvgridService.updateItem(updateItem);
       } 
       else {
        alert("Service déja affecté")
       }
      });
    }
  }
  angularGridReady4(angularGrid: AngularGridInstance) {
    this.angularGrid4 = angularGrid
    this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {}
}


prepareGrid4() {
    this.columnDefinitions4 = [
        // {
        //     id: "id",
        //     field: "id",
        //     excludeFromColumnPicker: true,
        //     excludeFromGridMenu: true,
        //     excludeFromHeaderMenu: true,

        //     minWidth: 50,
        //     maxWidth: 50,
        // },
        // {
        //     id: "id",
        //     name: "id",
        //     field: "id",
        //     sortable: true,
        //     minWidth: 80,
        //     maxWidth: 80,
        // },
        // {
        //     id: "code_fldname",
        //     name: "Champs",
        //     field: "code_fldname",
        //     sortable: true,
        //     filterable: true,
        //     type: FieldType.string,
        // },
     
        {
            id: "code_value",
            name: "Code",
            field: "code_value",
            sortable: true,
            width: 80,
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
        },
        multiSelect: false,
        rowSelectionOptions: {
            selectActiveRow: true,
        },
    }

    // fill the dataset with your data
    this.codeService
        .getBy({ code_fldname: "emp_job" })
        .subscribe((response: any) => (this.transacts = response.data))
}
open4(content) {
   
    this.prepareGrid4()
    this.modalService.open(content, { size: "lg" })
}
}
