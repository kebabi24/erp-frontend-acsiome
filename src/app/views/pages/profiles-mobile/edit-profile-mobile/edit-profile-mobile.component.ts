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
  selectedMenus = []

  public nodes = [
      
    ];
  public menus = [];
  public test = []
  prf: any;
  message: string;
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
    this.createForm()
    this.prepareMenu()    
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(true)
        const controls = this.profileForm.controls;
        this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.profileMobileService.getOneProfile(id).subscribe((response: any)=>{
        this.prf = response.data
        controls.profile_code.setValue(this.prf.profile_code)
        controls.profile_name.setValue(this.prf.profile_name)
        const d1 = new Date(this.prf.profile_valid_date)
        d1.setDate(d1.getDate() )
        const d2 = new Date(this.prf.profile_exp_date)
        d2.setDate(d2.getDate() )
        controls.profile_valid_date.setValue({year: d1.getFullYear, month: d1.getMonth()+1, day: d1.getDate()})
        controls.profile_exp_date.setValue({year: d2.getFullYear, month: d2.getMonth()+1, day: d2.getDate()})
        this.initCode()
        this.loadingSubject.next(false)
          })
      })
    
  }

  initCode() {
    this.loadingSubject.next(false)
    this.profileMobileService
            .getMenuByProfile({ profile_code: this.prf.profile_code })
            .subscribe((response: any) => {
            this.test = response.data
            console.log(this.test)

            this.selectedMenus = this.test.map((item) => {
              return item.menu_code;
            });
            console.log(this.selectedMenus)
            this.roles = this.selectedMenus
            })
            
            
            
    
  }
  prepareMenu(){
         // fill the dataset with your data
         this.menuService.getAllMenu().subscribe(
            
          (response: any) => {
          this.menus = response.data
          this.nodes = this.menus.map((item) => {
              const node : any = {
                  id: item.id,
                  name: item.menu_name,
                  code: item.menu_code,
                  children: []
              };
              return node;
            });        
          },
          (error) => {
              this.menus = []
          },
          () => {}
      )
        
   

  }


  onInitTree(event){
    console.log(event)
    event.treeModel.nodes.map(node=>{
      if(this.roles.filter(elem=>elem==node.code)[0]){
        const node_ = event.treeModel.getNodeById(node.id)
        node_.setIsSelected(true)
      }
    })
   
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.profile = new ProfileMobile();
    this.profileForm = this.profileFB.group({
      profile_code: [{value: this.profile.profile_code, disabled : false}, Validators.required],
      profile_name: [{value: this.profile.profile_name, disabled : false}, Validators.required],
      profile_valid_date: [{value: this.profile.profile_valid_date, disabled : false}, Validators.required],
      profile_exp_date: [{value: this.profile.profile_exp_date, disabled : false}, Validators.required],
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
    this.hasFormErrors = false
    const controls = this.profileForm.controls
    /** check form */
    if (this.profileForm.invalid) {
        Object.keys(controls).forEach((controlName) =>
            controls[controlName].markAsTouched()
        )

        this.message = "Modifiez quelques éléments et réessayez de soumettre.";
        this.hasFormErrors = true;
  
        return
    }

    

    // tslint:disable-next-line:prefer-const
    const id =  this.prf.id
    console.log(id)
    let address = this.prepareProfile()
    this.addProfile(id, address, this.selectedMenus)
  }
  /**
   * Returns object for saving
   */
  prepareProfile(): ProfileMobile {
    console.log('aaa')

    const controls = this.profileForm.controls;
    const _profile = new ProfileMobile();
    _profile.profile_code = controls.profile_code.value;
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
  addProfile(id, _profile: ProfileMobile, selectedMenus: any[]) {
    //console.log(this.selectedMenus)
    this.loadingSubject.next(true);
    this.profileMobileService.updateP(id, {profile : _profile,menus: selectedMenus}).subscribe(
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
    if (!this.selectedMenus.includes(name.code)) this.selectedMenus.push(name.code);
    //  if (!this.selectedMenus.includes(event.node.data.name.code))
    //    this.selectedMenus.push(event.node.data.name.code);
      //  console.log(this.selectedMenus)
  }
  onDeselect(event) {
    const {
      node: { data: name },
    } = event;
    const index = this.selectedMenus.indexOf(name.code);
    this.selectedMenus.splice(index, 1);
    console.log(this.selectedMenus)
  }



 
}
