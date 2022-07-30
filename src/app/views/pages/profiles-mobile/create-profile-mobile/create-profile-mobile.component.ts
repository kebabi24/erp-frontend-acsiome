import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"

// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Editor,
    Editors,
} from "angular-slickgrid"
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
import { MenuMobileConfig } from '../../../../core/_config/menuMobile.config'

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
import { IActionMapping, ITreeOptions, TREE_ACTIONS } from '@circlon/angular-tree-component';


import { ProfileMobile , UsersMobileService, MobileMenuService, MenuMobile } from "../../../../core/erp"
import { takeUntil } from "rxjs/operators"

const actionMapping: IActionMapping = {
    mouse: {
      click: (tree, node, $event) => {
        console.log(node);
        $event.shiftKey
          ? TREE_ACTIONS.TOGGLE_ACTIVE_MULTI(tree, node, $event)
          : TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
      }
    }
  };
@Component({
    selector: "kt-create-profile-mobile",
    templateUrl: "./create-profile-mobile.component.html",
    styleUrls: ["./create-profile-mobile.component.scss"],
})
export class CreateProfileMobileComponent implements OnInit {
    profile: ProfileMobile
    profileForm: FormGroup
    hasFormErrors = false
    isExist = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    selectedMenus: number[] = []
    public nodes = [
      
    ];
    //public menus = []
    options: ITreeOptions = {
      useCheckbox: true,
      actionMapping

    };

    constructor(
        config: NgbDropdownConfig,
        private profileFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private profileService: UsersMobileService,
        private menuService: MobileMenuService
    ) {
        config.autoClose = true
         
        this.menuService.getAllMenu().subscribe((response: any) => {
            this.nodes = response.data
            //console.log(this.nodes)
        })
       
            
        // const menus = new MenuMobileConfig().defaults
        // menus.aside.items.map(obj=>{
        //     if(obj.title){
        //         const node : any = {}
                
        //         node.name = obj.title
        //         node.children = []
        //         if(obj.submenu){
        //             obj.submenu.map(value=>{
        //                 let item :any
        //                 item = {name: value.title,children:[]}
        //                 if(value.submenu) {
        //                     value.submenu.map(v=>{
        //                         item.children.push({name: v.title})
        //                     })
        //                 }
        //                 node.children.push(item)
        //             })

        //         }
                
                
                
        //         this.nodes.push(node)
        //     }
        // })
        //  console.log(this.nodes)
    }
    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(true)
        this.createForm()
        //console.log(this.selectedMenus)
    }
 

    //create form
    createForm() {
        this.loadingSubject.next(false)

        this.profile = new ProfileMobile()
        this.profileForm = this.profileFB.group({
          profile_code: [this.profile.profile_code, Validators.required],
          profile_name: [this.profile.profile_name, Validators.required],
          profile_valid_date: [this.profile.profile_valid_date],
          profile_exp_date: [this.profile.profile_exp_date],
        })
       //console.log(this.nodes)
    }
  
    reset() {
        this.profile = new ProfileMobile()
        this.createForm()
        this.hasFormErrors = false
    }
    onChangeCode() {
        const controls = this.profileForm.controls
        
        this.profileService.getByOneP({profile_code: controls.profile_code.value }).subscribe(
            (res: any) => {
              console.log("aa");
           
              if (res.data) {
                alert("Ce code profile existe déjà")
                this.isExist = true
                document.getElementById("profile").focus();
                controls.profile_name.disable()
              } else { 
                controls.profile_name.enable()
                controls.profile_valid_date.enable()
                controls.profile_exp_date.enable()
            }
                   
        })
    
      }
      onChangeProfile() {
        const controls = this.profileForm.controls
        
        this.profileService.getByOneP({profile_code: controls.profile_code.value }).subscribe(
            (res: any) => {
              //console.log("aa", res.data);
           
              if (res.data) {
                this.router.navigateByUrl(`/profiles-mobile/edit-profile-mobile/${res.data.profile_code}`)
                //console.log(res.data.id)
              }
                   
        })

    }
    // save data
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.profileForm.controls
        /** check form */
        if (this.profileForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )

            this.hasFormErrors = true
            return
        }

        // tslint:disable-next-line:prefer-const
        let profile = this.prepareProfile()
        //console.log(this.selectedMenus)
        this.addProfile(profile, this.selectedMenus)
    }
    /**
     * Returns object for saving
     */
    prepareProfile(): ProfileMobile {
        const controls = this.profileForm.controls
        const _profile = new ProfileMobile()
        _profile.profile_code = controls.profile_code.value
        _profile.profile_name = controls.profile_name.value
        _profile.profile_valid_date = controls.profile_valid_date.value
        ? `${controls.profile_valid_date.value.year}/${controls.profile_valid_date.value.month}/${controls.profile_valid_date.value.day}`
        : null
        _profile.profile_exp_date = controls.profile_exp_date.value
        ? `${controls.profile_exp_date.value.year}/${controls.profile_exp_date.value.month}/${controls.profile_exp_date.value.day}`
        : null

        return _profile
    }
    /**
     * Add profile
     *
     * @param _profile: ProfileMobileModel
     */
    addProfile(_profile: ProfileMobile, _selectedMenu: any) {
        this.loadingSubject.next(true)
        this.profileService.addProfile({profile: _profile, menus: _selectedMenu}).subscribe(
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
                this.router.navigateByUrl("/profiles-mobile/profiles-list-mobile")
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
    onSelect(event) {
      console.log(event)
      const {node:{data:id}} = event
      this.selectedMenus.push(id.id)
      //console.log(this.selectedMenus)
      if(!this.selectedMenus.includes(event.node.parent.data.id)) this.selectedMenus.push(event.node.parent.data.id)
    }
    onDeselect(event) {
      const {node:{data:id}} = event
      const index = this.selectedMenus.indexOf(id.id)
      this.selectedMenus.splice(index,1)
      //console.log(this.selectedMenus)
    }
    
}
