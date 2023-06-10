import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { Role, RoleService, ItineraryService, Itinerary  } from "../../../../core/erp";
import * as os from 'os';
import {
  AngularGridInstance,
  Column,
  FieldType,
  Filters,
  Formatters,
  GridOption,
  GridStateChange,
  GridService,
}  from 'angular-slickgrid';
import { AnyCnameRecord } from 'dns';

@Component({
  selector: 'kt-create-new-roles',
  templateUrl: './create-new-roles.component.html',
  styleUrls: ['./create-new-roles.component.scss']
})
export class CreateNewRolesComponent implements OnInit {
    role: Role
    roleForm: FormGroup
    hasFormErrors = false
    isExist = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    users: []
    itinerary: any []
    its: []
    selectedItinerary: number[] = []
    columnDefinitions: Column[] = []
    columnDefinitionsit: Column[] = []
    columnDefinitions2: Column[] = []
    gridOptions: GridOption = {}
    gridOptions2: GridOption = {}
    gridOptionsit: GridOption = {}
    gridObj: any
    angularGrid: AngularGridInstance
    gridObj2: any
    angularGrid2: AngularGridInstance
    gridObjit: any
    angularGridit: AngularGridInstance
    selectedTitle: any
    message: any
    //selectedGrid2IDs!: number[];
    selectedTriggersIndexes : any[]
    selected_doc_row_number;
    dataViewit: any
    gridServiceit: GridService
    selectedIndexes : any[]
    selectedIndexes2 : any[]
    d: Array<number> = []
  constructor(
        config: NgbDropdownConfig,
        private roleF : FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private roleService: RoleService,
        private itineraryService: ItineraryService,
        private modalService: NgbModal,
        private cd: ChangeDetectorRef
  ) {
        config.autoClose = true
        this.prepareGrid2()
  }

  ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.createForm()
        
  }

  createForm() {
    this.loadingSubject.next(false)

    this.role = new Role()
    this.roleForm = this.roleF.group({
        role_code: [this.role.role_code, Validators.required],
        role_name: [this.role.role_name, Validators.required],
        user_mobile_code: [{value: this.role.user_mobile_code, disabled: !this.isExist}, Validators.required],
        device_id : [this.role.device_id , Validators.required],
    })
  }

  prepareGrid2(){
    this.columnDefinitions2 = [
      // {
      //     id: "id",
      //     name: "id",
      //     field: "id",
      //     sortable: true,
      //     minWidth: 80,
      //     maxWidth: 80,
      // },
      {
        id: "itinerary_code",
        name: "Code de l'itinéraire",
        field: "itinerary_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
          id: "itinerary_name",
          name: "Nom de l'itinéraire",
          field: "itinerary_name",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "itinerary_type",
          name: "Type de l'itinéraire",
          field: "itinerary_type",
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
      // frozenColumn: 0,
      // frozenBottom: true,
      enableRowSelection: false,
      // rowSelectionOptions: {
      //   // True (Single Selection), False (Multiple Selections)
      //   selectActiveRow: false
      //   },
      // enableCheckboxSelector: true,
      // checkboxSelector: {
      //     // optionally change the column index position of the icon (defaults to 0)
      //     // columnIndexPosition: 1,

      //     // remove the unnecessary "Select All" checkbox in header when in single selection mode
      //     hideSelectAllCheckbox: true,

      //     // you can override the logic for showing (or not) the expand icon
      //     // for example, display the expand icon only on every 2nd row
      //     // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
      // },
      // multiSelect: false,
  }

  this.itinerary = []
  // fill the dataset with your data
  // this.itineraryService
  //     .getAllItinerary()
  //     .subscribe((response: any) => (this.itinerary = response.data))
    
  }

  onChangeCode() {
    const controls = this.roleForm.controls
    
    this.roleService.getByOne({role_code: controls.role_code.value }).subscribe(
        (res: any) => {
          //console.log("aa", res.data);
       
          if (res.data) {
            alert("Ce role exist déja")
            this.isExist = true
            document.getElementById("role").focus(); 

          } else { 
            controls.role_name.enable()
            controls.userMobile_code.enable()
            
        }
               
    })

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
            id: "username",
            name: "Nom d'utilisateur",
            field: "username",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "user_mobile_code",
          name: "code d'utilisateur",
          field: "user_mobile_code",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
        {
          id: "fullname",
          name: "Nom complet",
          field: "fullname",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "profile_code",
          name: "code profil",
          field: "profile_code",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "hold",
          name: "status",
          field: "hold",
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
    this.roleService
        .getAllUsers()
        .subscribe((response: any) => (this.users = response.data))
  }
  onChangeRole() {
    const controls = this.roleForm.controls
    
    this.roleService.getByOne({role_code: controls.role_code.value }).subscribe(
        (res: any) => {
          //console.log("aa", res.data);
       
          if (res.data) {
            //console.log("here")
            this.router.navigateByUrl(`/roles/edit-role/${res.data.id}`)
            //console.log(res.data.id)
          }
               
    })

  }

  onDeviceIdChange() {
    const controls = this.roleForm.controls
    //console.log("hello")
    
    this.roleService.getOneByDeviceId(controls.device_id.value).subscribe(
        (res: any) => {
          //console.log("aa", res.data);
          alert("Cet identifiant d'appareil existe")
          controls.device_id.setValue(null) 
          document.getElementById("device").focus();            
    })
  }

  open(content) {
    this.prepareGrid()
    this.modalService.open(content, { size: "lg" })
  }
  openit(content) {
   let dd = []
    for(let it of this.itinerary){
      //console.log(it)
      //this.selectedIndexes2.push(1)
      var i = it.id
      dd.push(i)
     // console.log("i",i)
    }
   // console.log(this.selectedIndexes2)
   // console.log(dd)
    this.selectedIndexes2 = dd
    this.prepareGridit()
    this.modalService.open(content, { size: "lg" })
  }
  reset() {
    this.role = new Role()
    this.createForm()
    this.hasFormErrors = false
}
// save data
  onSubmit() {
    this.hasFormErrors = false
    const controls = this.roleForm.controls
    /** check form */
    if (this.roleForm.invalid) {
        Object.keys(controls).forEach((controlName) =>
            controls[controlName].markAsTouched()
        )

        this.hasFormErrors = true
        return
    }
  

    // tslint:disable-next-line:prefer-const
    let role = this.prepareRole()
    //console.log(this.selectedItinerary)
    this.addRole(role, this.selectedItinerary)
    const hostname = os.networkInterfaces()
    //console.log(hostname)
  }
  prepareRole(): Role {
    const controls = this.roleForm.controls
    const _role = new Role()
    _role.role_code = controls.role_code.value
    _role.role_name = controls.role_name.value
    _role.user_mobile_code = controls.user_mobile_code.value
    _role.device_id = controls.device_id.value

    return _role
  }

  /**
     * Add role
     *
     * @param _role: RoleModel
     */
   addNewItem(content){

    this.openit(content)
   }
   addRole(_role: Role, _itinerary : any) {
    this.loadingSubject.next(true)
    this.roleService.addRole({role: _role, itinerary: _itinerary}).subscribe(
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
        this.router.navigateByUrl("/itinerary/list-itinerary")

    
    }
    )
  }



  goBack() {
    this.loadingSubject.next(false)
    const url = `/roles/list-all-roles`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
  handleSelectedRowsChanged(e, args) {
    const controls = this.roleForm.controls
    if (Array.isArray(args.rows) && this.gridObj) {
        args.rows.map((idx) => {
            const item = this.gridObj.getDataItem(idx)
            controls.user_mobile_code.setValue(item.user_mobile_code || "")
        })
    }
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid
    this.gridObj = (angularGrid && angularGrid.slickGrid) || {}
  }


  // handleSelectedRowsChanged2(e, args) {
  //   if (Array.isArray(args.rows) && this.gridObj2) {

  //     this.selectedItinerary = args.rows.map((idx: number) => {
  //       const item = this.gridObj2.getDataItem(idx);
  //       return item.itinerary_code;
  //     });
 
  // }
  //console.log(this.selectedItinerary)
  //}
  angularGridReady2(angularGrid: AngularGridInstance) {
    this.angularGrid2 = angularGrid
    this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {}
  }

  onChange(e){
    console.log(e)     
  }
  


  
  angularGridReadyit(angularGrid: AngularGridInstance) {
    this.angularGridit = angularGrid
    this.gridObjit = (angularGrid && angularGrid.slickGrid) || {}
  
    this.gridServiceit = angularGrid.gridService;
     this.dataViewit = angularGrid.dataView;
  
  }




  prepareGridit() {
    this.columnDefinitionsit = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
    },
    {
      id: "itinerary_code",
      name: "Code de l'itinéraire",
      field: "itinerary_code",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
        id: "itinerary_name",
        name: "Nom de l'itinéraire",
        field: "itinerary_name",
        sortable: true,
        filterable: true,
        type: FieldType.string,
    },
    {
        id: "itinerary_type",
        name: "Type de l'itinéraire",
        field: "itinerary_type",
        sortable: true,
        filterable: true,
        type: FieldType.string,
    },
    ]

    this.gridOptionsit = {
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
      presets:{
        sorters:  [ { columnId: 'id', direction: 'ASC' }],
        rowSelection: {
          // gridRowIndexes: [2],           // the row position of what you see on the screen (UI)
          gridRowIndexes: this.selectedIndexes2  // (recommended) select by your data object IDs
          //dataContextIds
      }
     
    }
  }

    // fill the dataset with your data
    this.itineraryService
        .getAllItinerary()
        .subscribe((response: any) => (this.its = response.data))
  }

  handleSelectedRowsChangedit(e, args) {
    this.selectedIndexes =[]
  this.selectedIndexes = args.rows;
    // const selected_trigger_code = this.gridService5.getDataItemByRowIndex(this.selectedTriggersIndexes[0]).code_value
    
    // (this.itinerary[this.selected_doc_row_number] as any).itinerary_code = this.gridServiceit.getDataItemByRowIndex(this.selectedTriggersIndexes[0]).itinerary_code
    // // this.specifications[this.selected_doc_row_number].pjd_trigger = selected_trigger_code
  
    // this.dataViewit.setItems(this.itinerary)
   // console.log(this.selectedIndexes)
  }
  addit(){
   // this.itinerary.push({})
   var l : any[] = []
   this.selectedIndexes.forEach(index => {
     l.push({
       id: index,
       itinerary_code : this.its[index]['itinerary_code'],
       itinerary_name : this.its[index]['itinerary_name'],
       itinerary_type : this.its[index]['itinerary_type'],
       //trigger : this.itinerary[index]['pjd_trigger']
     })
   });
  // console.log("lllllllll",l)
   this.itinerary = l
  
   this.dataViewit.setItems(this.itinerary)
  }
}
