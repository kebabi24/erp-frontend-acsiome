import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"

// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Editor,
    Editors,
    FieldType,
    OnEventArgs,
    AngularGridInstance,
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

import { User, UserMobile, UsersMobileService, UsersService } from "../../../../core/erp"
import { MenuConfig } from '../../../../core/_config/menu.config'
import { MenuMobileConfig } from '../../../../core/_config/menuMobile.config'
import {
    NgbModal,
    NgbActiveModal,
    ModalDismissReasons,
    NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap"

@Component({
    selector: "kt-create-user-mobile",
    templateUrl: "./create-user-mobile.component.html",
    styleUrls: ["./create-user-mobile.component.scss"],
})
export class CreateUserMobileComponent implements OnInit {
    userMobile: UserMobile
    userForm: FormGroup
    hasFormErrors = false
    isExist = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    profiles: []
    columnDefinitions: Column[] = []
    gridOptions: GridOption = {}
    gridObj: any
    angularGrid: AngularGridInstance
    selectedTitle: any
    message: any
    profile_code : String
    constructor(
        config: NgbDropdownConfig,
        private userFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private userMobileService: UsersMobileService,
        private modalService: NgbModal
    ) {
        config.autoClose = true
        console.log(new MenuMobileConfig().defaults)
    }
    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.createForm()
    }

    //create form
    createForm() {
        this.loadingSubject.next(false)

        this.userMobile = new UserMobile()
        this.userForm = this.userFB.group({
            user_mobile_code: [this.userMobile.user_mobile_code, Validators.required],
            username: [this.userMobile.username, Validators.required],
            //fullname: [{value: this.userMobile.fullname, disabled: !this.isExist}, Validators.required],
            password: [{value: this.userMobile.password, disabled: true}, Validators.required],
            new_password: [{value: "", disabled: true}],
            // email: [{value: this.userMobile.email, disabled: !this.isExist}],
            profile_code: [{value: this.userMobile.profile_code, disabled: !this.isExist}, Validators.required],
            hold: [{value: this.userMobile.hold}, Validators.required],


        })
    }

    onChangeCode() {
        const controls = this.userForm.controls
        
        this.userMobileService.getByOne({user_mobile_code: controls.user_mobile_code.value }).subscribe(
            (res: any) => {
              console.log("aa", res.data);
           
              if (res.data) {
                alert("Ce nom d'utilisateur existe déjà")
                this.isExist = true
                document.getElementById("user").focus();
                controls.username.disable()
                //controls.fullname.disable()
                // controls.email.disable()
                controls.password.disable()
                controls.new_password.disable()
                controls.profile_code.disable()
           
              } else { 
                this.isExist = false
                controls.username.enable()
                //controls.fullname.enable()
                // controls.email.enable()
                controls.password.enable()
                controls.new_password.enable()
                controls.profile_code.enable()
            
            }
                   
        })

    }
    onChangeUser() {
        const controls = this.userForm.controls
        
        this.userMobileService.getByOne({user_mobile_code: controls.user_mobile_code.value }).subscribe(
            (res: any) => {
              console.log("aa", res.data);
           
              if (res.data) {
                console.log(res.data.user_mobile_code)
                this.router.navigateByUrl(`/users-mobile/edit-user-mobile/${res.data.user_mobile_code}`)
                //console.log(res.data.id)
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
                id: "profile_name",
                name: "code profil",
                field: "profile_name",
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
        this.userMobileService
            .getAllProfiles()
            .subscribe((response: any) => (this.profiles = response.data))
    }

    open(content) {
        this.prepareGrid()
        this.modalService.open(content, { size: "lg" })
    }
    reset() {
        this.userMobile = new UserMobile()
        this.createForm()
        this.hasFormErrors = false
    }
    // save data
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.userForm.controls
        /** check form */
        if (this.userForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )

            this.hasFormErrors = true
            return
        }
        if (controls.password.value  !== controls.new_password.value) {
            alert  ("Mot de passe saisi n'est pas egale au nouveau mot de passe veuillez resaisir") 
            this.message = "Mot de passe erronee";
            this.hasFormErrors = true;
      
            return
           
  
          }

        // tslint:disable-next-line:prefer-const
        let address = this.prepareUser()
        this.addUser(address)
    }

    prepareUser(): UserMobile {
        const controls = this.userForm.controls
        const _user = new UserMobile()
        _user.user_mobile_code = controls.user_mobile_code.value
        _user.username = controls.username.value
        //_user.fullname = controls.fullname.value
        _user.password = controls.password.value
        // _user.email = controls.email.value
        console.log(this.profile_code)
        _user.profile_code = this.profile_code
        _user.hold = controls.hold.value

        return _user
    }

    /**
     * Add user
     *
     * @param _user: UserMobileModel
     */
     addUser(_user: UserMobile) {
        this.loadingSubject.next(true)
        this.userMobileService.addUser(_user).subscribe(
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
                this.router.navigateByUrl("/users-mobile/list-user-mobile")
            }
        )
    }

    /**
     * Go back to the list
     *
     */
     goBack() {
        this.loadingSubject.next(false)
        const url = `/users-mobile/list-user-mobile`
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
    }
    handleSelectedRowsChanged(e, args) {
        const controls = this.userForm.controls
        if (Array.isArray(args.rows) && this.gridObj) {
            args.rows.map((idx) => {
                const item = this.gridObj.getDataItem(idx)
                //console.log(item.id)
                this.profile_code = item.profile_code
                controls.profile_code.setValue(item.profile_code || "")
                //console.log(item.profile_name)
            })
        }
    }
    angularGridReady(angularGrid: AngularGridInstance) {
        this.angularGrid = angularGrid
        this.gridObj = (angularGrid && angularGrid.slickGrid) || {}
    }

   
}
