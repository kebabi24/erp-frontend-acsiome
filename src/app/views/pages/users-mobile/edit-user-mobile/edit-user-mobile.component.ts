import { Component, OnInit } from '@angular/core';
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
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud"
import { MatDialog } from "@angular/material/dialog"

import { UserMobile, UsersMobileService } from "../../../../core/erp"
import { MenuConfig } from '../../../../core/_config/menu.config'
import { MenuMobileConfig } from '../../../../core/_config/menuMobile.config'
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap"

@Component({
  selector: 'kt-edit-user-mobile',
  templateUrl: './edit-user-mobile.component.html',
  styleUrls: ['./edit-user-mobile.component.scss']
})
export class EditUserMobileComponent implements OnInit {
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
  usersMobile: any;
  message: string;
  user_pwd_new: String;
  user_pwd_before: string;
  userMobileEdit: any
  title: String = 'Modifier utilisateur - '
  profile_id : Number
  constructor(
      
      config: NgbDropdownConfig,
      private userFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private modalService: NgbModal,
      private userMobileService : UsersMobileService
      
  ) { }

      ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(true)
        this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.userMobileService.getOne(id).subscribe((response: any)=>{
        this.userMobileEdit = response.data
        this.initCode()
        this.loadingSubject.next(false)
        this.title = this.title + this.userMobileEdit.username
          })
      })
      }
      initCode() {
        this.createForm()
        this.loadingSubject.next(false)
      }

      createForm() {
        this.loadingSubject.next(false)
        this.userForm = this.userFB.group({

            username: [{value: this.userMobileEdit.username, disabled : false}, Validators.required],
            fullname: [{value: this.userMobileEdit.fullname, disabled : true}],
            email: [{value: this.userMobileEdit.email, disabled : false}],
            profile_name: [this.userMobileEdit.profile_name, Validators.required],
            hold: [this.userMobileEdit.hold],
            init: [ false],
    
        })
      
      }
      
      

      reset() {
        this.userMobile = new UserMobile()
        this.createForm()
        this.hasFormErrors = false
      }

      onSubmit() {
        this.hasFormErrors = false
        const controls = this.userForm.controls
        /** check form */
        if (this.userForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )

            this.message = "Modifiez quelques éléments et réessayez de soumettre.";
            this.hasFormErrors = true;
      
            return
        }

        

        // tslint:disable-next-line:prefer-const
        const id =  this.userMobileEdit.id
    
        let address = this.prepareUser()
        this.addUser(id, address)
      }


      prepareUser(): UserMobile {
        const controls = this.userForm.controls
        const _userMobile = new UserMobile()
        _userMobile.username =   controls.username.value
        _userMobile.fullname = controls.fullname.value
        _userMobile.profileId =   this.profile_id
        _userMobile.email =   controls.email.value 
        _userMobile.hold =   controls.hold.value
        if (controls.init.value == true ) {_userMobile.password = this.userMobileEdit.username}
        return _userMobile
      }


      addUser(id ,_user: UserMobile) {
        this.loadingSubject.next(true)
        this.userMobileService.updated(id,_user).subscribe(
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
      goBack() {
        this.loadingSubject.next(false)
        const url = `/users/users-list`
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
      }

      handleSelectedRowsChanged(e, args) {
        const controls = this.userForm.controls
        if (Array.isArray(args.rows) && this.gridObj) {
            args.rows.map((idx) => {
                const item = this.gridObj.getDataItem(idx)
                this.profile_id = item.id
                controls.profile_name.setValue(item.profile_name || "")
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
                id: "profile_name",
                name: "Nom profil",
                field: "profile_name",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "profile_valid_date",
                name: "Date de début",
                field: "profile_valid_date",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
              id: "profile_exp_date",
              name: "Date de fin",
              field: "profile_exp_date",
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
}
