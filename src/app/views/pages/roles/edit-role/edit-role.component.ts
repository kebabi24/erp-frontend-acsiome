import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularGridInstance, FieldType, GridOption, Column } from 'angular-slickgrid';
import { BehaviorSubject, Observable } from 'rxjs';
import { ItineraryService, Role, RoleService, UsersMobileService } from 'src/app/core/erp';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';

@Component({
  selector: 'kt-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {
  role: Role
  roleForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  users: []
  itinerary: []
  selectedItinerary: number[] = []
  columnDefinitions: Column[] = []
  columnDefinitions2: Column[] = []
  gridOptions: GridOption = {}
  gridOptions2: GridOption = {}
  gridObj: any
  angularGrid: AngularGridInstance
  gridObj2: any
  angularGrid2: AngularGridInstance
  selectedTitle: any
  message: any
  roleEdit: any
  title: String = 'Modifier role - '
  user_mobile_code : String
  constructor(
      config: NgbDropdownConfig,
      private roleF: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private modalService: NgbModal,
      private roleService : RoleService,
      private itineraryService: ItineraryService,
  ) { 
      config.autoClose = true
      this.prepareGrid2()
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(true)
        this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.roleService.getOne(id).subscribe((response: any)=>{
        this.roleEdit = response.data
        this.initCode()
        this.loadingSubject.next(false)
        this.title = this.title + this.roleEdit.role_code
          })
      })
  }

  initCode() {
    this.createForm()
    this.loadingSubject.next(false)
  }

  createForm() {
    this.loadingSubject.next(false)
    this.roleForm = this.roleF.group({

        role_code: [{value: this.roleEdit.role_code, disabled : false}, Validators.required],
        role_name: [{value: this.roleEdit.role_name, disabled : true}],
        user_mobile_code: [this.roleEdit.user_mobile_code, Validators.required],
        init: [ false],

    })
  
  }

  open(content) {
    this.prepareGrid()
    this.modalService.open(content, { size: "lg" })
  }

  reset() {
    this.role = new Role()
    this.createForm()
    this.hasFormErrors = false
  }

  onSubmit() {
    this.hasFormErrors = false
    const controls = this.roleForm.controls
    /** check form */
    if (this.roleForm.invalid) {
        Object.keys(controls).forEach((controlName) =>
            controls[controlName].markAsTouched()
        )

        this.message = "Modifiez quelques éléments et réessayez de soumettre.";
        this.hasFormErrors = true;
  
        return
    }

    

    // tslint:disable-next-line:prefer-const
    const id =  this.roleEdit.id

    let role = this.prepareRole()
    this.addRole(role, this.selectedItinerary)
  }

  prepareRole(): Role {
    const controls = this.roleForm.controls
    const _role = new Role()
    _role.role_code =   controls.role_code.value
    _role.role_name = controls.fullname.value
    _role.user_mobile_code =   this.user_mobile_code

    return _role
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
        this.router.navigateByUrl("/roles/list-all-roles")

    
    }
    )
  }


  goBack() {
    this.loadingSubject.next(false)
    const url = `/roles/list-all-roles`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }

  prepareGrid2(){
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
      frozenColumn: 0,
      frozenBottom: true,
      enableRowSelection: true,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false
        },
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
  }

  // fill the dataset with your data
  this.itineraryService
      .getAllItinerary()
      .subscribe((response: any) => (this.itinerary = response.data))
    
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
            id: "user_mobile_code",
            name: "Code d'utilisateur",
            field: "user_mobile_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
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
          id: "profile_name",
          name: "code profil",
          field: "profile_name",
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

  onChangeCode() {
    const controls = this.roleForm.controls
    
    this.roleService.getByOne({role_code: controls.role_code.value }).subscribe(
        (res: any) => {
          console.log("aa", res.data);
       
          if (res.data) {
            alert("Ce role exist déja")
            controls.role_code.setValue(null) 
            document.getElementById("role").focus(); 

          } else { 
            controls.role_name.enable()
            controls.userMobile_code.enable()
            
        }
               
    })

  }

  handleSelectedRowsChanged(e, args) {
    const controls = this.roleForm.controls
    if (Array.isArray(args.rows) && this.gridObj) {
        args.rows.map((idx) => {
            const item = this.gridObj.getDataItem(idx)
            this.user_mobile_code = item.user_mobile_code
            controls.user_mobile_code.setValue(item.user_mobile_code || "")
        })
    }
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid
    this.gridObj = (angularGrid && angularGrid.slickGrid) || {}
  }

  handleSelectedRowsChanged2(e, args) {
    if (Array.isArray(args.rows) && this.gridObj2) {

      this.selectedItinerary = args.rows.map((idx: number) => {
        const item = this.gridObj2.getDataItem(idx);
        return item.itinerary_code;
      });
 
  }
  //console.log(this.selectedItinerary)
  }
  angularGridReady2(angularGrid: AngularGridInstance) {
    this.angularGrid2 = angularGrid
    this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {}
  }
  




}
