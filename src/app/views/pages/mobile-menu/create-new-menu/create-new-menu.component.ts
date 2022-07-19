import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Column, GridOption, AngularGridInstance, FieldType} from "angular-slickgrid"
import { ActivatedRoute, Router } from "@angular/router"
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MatDialog } from "@angular/material/dialog"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import {
  SubheaderService,
  LayoutConfigService,
} from "../../../../core/_base/layout"

import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud"

import {

  MenuMobile,
  MobileMenuService

} from "../../../../core/erp"
@Component({
  selector: 'kt-create-new-menu',
  templateUrl: './create-new-menu.component.html',
  styleUrls: ['./create-new-menu.component.scss']
})
export class CreateNewMenuComponent implements OnInit {
    menu: MenuMobile
    menuForm: FormGroup
    hasFormErrors= false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$ : Observable<boolean>
    isExist = false
    //customers: string[] = []
    columnDefinitions: Column[] = []
    gridOptions: GridOption = {}
    gridObj: any
    angularGrid: AngularGridInstance
    //selectedRows: any[] = []
    dataset: any[] = []
    menu_type : any[] = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private typesUtilsService: TypesUtilsService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private layoutConfigService: LayoutConfigService,
    private modalService: NgbModal,
    private menuMobileService: MobileMenuService,
    config: NgbDropdownConfig
  ) {
    config.autoClose = true
    //this.prepareGrid()
   }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.createForm()
  }

  createForm(){
    this.loadingSubject.next(false)
    this.menu = new MenuMobile()
    this.menuForm = this.formBuilder.group({
      name : [this.menu.name, Validators.required],
      menu_description : [{value : this.menu.menu_description, disabled: !this.isExist}, Validators.required],
      menu_type : [{value : this.menu.menu_type, disabled: !this.isExist}],
      menu_active : [{value : this.menu.menu_active, disabled: !this.isExist}, Validators.required],
      menu_goto : [{value : this.menu.menu_goto, disabled: !this.isExist}, Validators.required],
      menu_image : [{value : this.menu.menu_image, disabled: !this.isExist}],
    })
  }

  onChangeCode() {
    const controls = this.menuForm.controls
    
    this.menuMobileService.getByOne({name: controls.name.value }).subscribe(
        (res: any) => {
          //console.log("aa", res.data);
       
          if (res.data) {
            this.isExist = true
            document.getElementById("menu").focus();
          } else { 
            this.isExist = false
            controls.menu_description.enable()
            controls.menu_active.enable()
            controls.menu_image.enable()
            controls.menu_type.enable()
            controls.menu_goto.enable()
        }
               
    })

  }

  onSubmit() {
    this.hasFormErrors = false
    const controls = this.menuForm.controls
    /** check form */
    if (this.menuForm.invalid) {
        Object.keys(controls).forEach((controlName) =>
            controls[controlName].markAsTouched()
        )

        this.hasFormErrors = true
        return
    }
    

    // tslint:disable-next-line:prefer-const
    let menu = this.prepareMenu()
    this.addMenu(menu)
    }

  prepareMenu() : MenuMobile{

    const controls = this.menuForm.controls
    const _menu = new MenuMobile()

    _menu.name = controls.name.value
    _menu.menu_description = controls.menu_description.value
    _menu.menu_type = controls.menu_type.value
    _menu.menu_active = controls.menu_active.value
    _menu.menu_goto = controls.menu_goto.value
    _menu.menu_image = controls.menu_image.value

    return _menu

  }

  addMenu(_menu: MenuMobile){
    this.loadingSubject.next(true)
        this.menuMobileService.addMenu(_menu).subscribe(
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
            this.router.navigateByUrl("/mobile-menu/create-new-menu")

        
        }
        )
    }


  reset() {
    this.menu = new MenuMobile()
    this.createForm()
    this.hasFormErrors = false
  }

  

    goBack() {
      this.loadingSubject.next(false)
      const url = `/mobile-menu/create-new-menu`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }

}
