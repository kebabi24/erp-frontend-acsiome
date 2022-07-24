import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
} from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { MenuMobileConfig } from "../../../../core/_config/menuMobile.config";

// Layout
import {
  SubheaderService,
  LayoutConfigService,
} from "../../../../core/_base/layout";
// CRUD
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";
import {
  IActionMapping,
  ITreeOptions,
  TREE_ACTIONS,
} from "@circlon/angular-tree-component";

import { MobileMenuService, ProfileMobile, UsersMobileService } from "../../../../core/erp";

const actionMapping: IActionMapping = {
  mouse: {
    click: (tree, node, $event) => {
      console.log(node);
      $event.shiftKey
        ? TREE_ACTIONS.TOGGLE_ACTIVE_MULTI(tree, node, $event)
        : TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
    },
  },
};
@Component({
  selector: "kt-edit-profile-mobile",
  templateUrl: "./edit-profile-mobile.component.html",
  styleUrls: ["./edit-profile-mobile.component.scss"],
})
export class EditProfileMobileComponent implements OnInit {
  profile: ProfileMobile;
  profileForm: FormGroup;
  hasFormErrors = false;
  isExist = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  selectedMenus = [];
  nodes = [];
  prf: any;
  profileMobileEdit: any
  options: ITreeOptions = {
    useCheckbox: true,
    actionMapping,
  };
  roles = null
  id
  constructor(
    config: NgbDropdownConfig,
    private profileFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private profileMobileService: UsersMobileService,
    private menuService: MobileMenuService
  ) {
    config.autoClose = true;
    // this.createForm();
    this.menuService.getAllMenu().subscribe((response: any) => {
      this.nodes = response.data
      //console.log(this.nodes)
    })
    // this.activatedRoute.params.subscribe((params) => {
    //   this.id = params.id;
    //   if (this.id) {
    //     const controls = this.profileForm.controls;
    //     const menus = new MenuMobileConfig().defaults;
    //     menus.aside.items.map(obj=>{
    //       if(obj.title){
    //           const node : any = {}
    //           node.name = obj.title
    //           node.children = []
    //           if(obj.submenu){
    //               obj.submenu.map(value=>{
    //                   let item :any
    //                   item = {name: value.title,checked:true,children:[]}
    //                   if(value.submenu) {
    //                       value.submenu.map(v=>{
    //                           item.children.push({name: v.title, checked:true})
    //                       })
    //                   }
    //                   node.children.push(item)
    //               })

    //           }
              
              
              
    //           this.nodes.push(node)
    //       }
    //   })
    //     this.profileMobileService.getProfile(this.id).subscribe(
    //       (res: any) => {
    //         console.log("aa", res.data);
    //         this.prf = res.data
    //         controls.profile_code.setValue(this.prf.profile_code)
    //         controls.profile_name.setValue(this.prf.profile_name)
    //         const d1 = new Date(this.prf.profile_valid_date)
    //         d1.setDate(d1.getDate() )
    //         const d2 = new Date(this.prf.profile_exp_date)
    //         d2.setDate(d2.getDate() )
    //         controls.profile_valid_date.setValue({year: d1.getFullYear, month: d1.getMonth()+1, day: d1.getDate()})
    //         controls.profile_exp_date.setValue({year: d2.getFullYear, month: d2.getMonth()+1, day: d2.getDate()})
    //         //this.roles = JSON.parse(res.data.usrg_menus)
    //         //const menus = new MenuMobileConfig().defaults;
    //         //this.selectedMenus = this.roles
            
    //         // controls.usrd_code.setValue(this.users.usrd_code);
    //         // controls.usrd_name.setValue(this.users.usrd_name);
    //         // controls.usrd_user_name.setValue(this.users.usrd_user_name);
    //         // controls.usrd_profile.setValue(this.users.usrd_profile);
            
    //       },
    //       (error) => {
    //         this.hasFormErrors = true;
    //       },
    //       () => {}
    //     );
    //   }
    // });    
    
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(true)
        this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.profileMobileService.getOne(id).subscribe((response: any)=>{
        this.profileMobileEdit = response.data
        this.initCode()
        this.loadingSubject.next(false)
        //this.title = this.title + this.userMobileEdit.username
          })
      })
    
  }

  initCode() {
    this.createForm()
    this.loadingSubject.next(false)
  }
  onInitTree(event){
    while (this.roles == null){
      console.log('aaa')
    }
    event.treeModel.nodes.map(node=>{
      if(this.roles.filter(elem=>elem==node.name)[0]){
        const node_ = event.treeModel.getNodeById(node.id)
        node_.setIsSelected(true)
      }
      node.children.map(node=>{
        if(this.roles.filter(elem=>elem==node.name)[0]){
          const node_ = event.treeModel.getNodeById(node.id)
          node_.setIsSelected(true)
        }
  
      })

    })
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);

    this.profile = new ProfileMobile();
    this.profileForm = this.profileFB.group({
      profile_code: [this.profileMobileEdit.profile_code, Validators.required],
      profile_name: [this.profileMobileEdit.profile_name, Validators.required],
      profile_valid_date: [this.profileMobileEdit.profile_valid_date],
      profile_exp_date: [this.profileMobileEdit.profile_exp_date],
    });
  }

  //reste form
  reset() {
    this.profile = new ProfileMobile();
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    console.log('aaa')

    this.hasFormErrors = false;
    const controls = this.profileForm.controls;
    /** check form */
   
    const id =  this.profileMobileEdit.id
    // tslint:disable-next-line:prefer-const
    let profile = this.prepareProfile();
    this.addProfile(id, profile);
  }
  /**
   * Returns object for saving
   */
  prepareProfile(): ProfileMobile {
    console.log('aaa')

    const controls = this.profileForm.controls;
    const _profile = new ProfileMobile();
    _profile.profile_name = controls.profile_name.value;
    _profile.profile_valid_date = controls.profile_valid_date.value
      ? `${controls.profile_valid_date.value.year}/${controls.profile_valid_date.value.month}/${controls.profile_valid_date.value.day}`
      : null;
    _profile.profile_exp_date = controls.profile_exp_date.value
      ? `${controls.profile_exp_date.value.year}/${controls.profile_exp_date.value.month}/${controls.profile_exp_date.value.day}`
      : null;
    

    return _profile;
  }
  /**
   * Add profile
   *
   * @param _profile: ProfileMobileModel
   */
  addProfile(id, _profile: ProfileMobile) {
    this.loadingSubject.next(true);
    this.profileMobileService.updatedP(id, _profile).subscribe(
      (reponse) => console.log("response", Response),
      (error) => {
        this.layoutUtilsService.showActionNotification(
          "Erreur verifier les informations",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.loadingSubject.next(false);
      },
      () => {
        this.layoutUtilsService.showActionNotification(
          "modifié avec succès",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.loadingSubject.next(false);
        this.router.navigateByUrl("/");
      }
    );
  }

  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  onSelect(event) {
    const {
      node: { data: name },
    } = event;
    if (!this.selectedMenus.includes(name.name)) this.selectedMenus.push(name.name);
     if (!this.selectedMenus.includes(event.node.parent.data.name))
       this.selectedMenus.push(event.node.parent.data.name);
  }
  onDeselect(event) {
    const {
      node: { data: name },
    } = event;
    const index = this.selectedMenus.indexOf(name.name);
    this.selectedMenus.splice(index, 1);
  }



 
}
