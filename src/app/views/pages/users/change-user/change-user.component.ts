import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import { Column, GridOption, Formatter, Editor, Editors, FieldType, OnEventArgs, AngularGridInstance } from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
// Layout
import { SubheaderService, LayoutConfigService } from "../../../../core/_base/layout";
// CRUD
import { LayoutUtilsService, TypesUtilsService, MessageType } from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";

import { User, UsersService, SiteService, PrintersService } from "../../../../core/erp";
import { MenuConfig } from "../../../../core/_config/menu.config";
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../../../../core/auth";
@Component({
  selector: "kt-change-user",
  templateUrl: "./change-user.component.html",
  styleUrls: ["./change-user.component.scss"],
})
export class ChangeUserComponent implements OnInit {
  user: User;
  userForm: FormGroup;
  hasFormErrors = false;
  isExist = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  profiles: [];
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  gridObj: any;
  angularGrid: AngularGridInstance;
  selectedTitle: any;
  users: any;
  message: string;
  usrd_pwd_new: String;
  usrd_pwd_before: string;
  userEdit: any;
  title: String = "Modifier Utilisateur - ";
  datasite: [];
  dataprinter: [];
  columnDefinitionssite: Column[] = [];
  columnDefinitionsprinter: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;
  gridOptionsprinter: GridOption = {};
  gridObjprinter: any;
  angularGridprinter: AngularGridInstance;
  error = false;
  constructor(config: NgbDropdownConfig, private userFB: FormBuilder, private activatedRoute: ActivatedRoute, private auth: AuthService, private siteService: SiteService, private router: Router, public dialog: MatDialog, private layoutUtilsService: LayoutUtilsService, private userService: UsersService, private printerService: PrintersService, private modalService: NgbModal) {
    config.autoClose = true;
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(true);
    this.activatedRoute.params.subscribe((params) => {
      const id = params.id;
      this.userService.getOne(id).subscribe((response: any) => {
        this.userEdit = response.data;
        this.initCode();
        this.loadingSubject.next(false);
        this.title = this.title + this.userEdit.usrd_code;
      });
    });
  }
  // init code
  initCode() {
    this.createForm();
    this.loadingSubject.next(false);
  }
  /*onChangeCode() {
      const controls = this.userForm.controls
      
          
      this.userService.getBy({usrd_user_name: controls.usrd_user_name.value }).subscribe(
        (res: any) => {
          console.log("aa", res.data);
         this.users = res.data;
         
              console.log(this.users)
              if (res.data) {

                      const authData = {
                        userName: controls.usrd_user_name.value ,
                        password: controls.usrd_pwd_before.value,
                    }
                    console.log(authData.userName)
                this.auth
                  .login(authData.userName, authData.password)

                  .subscribe(
                      (resuser: any) => {
            
                        console.log( authData.password)
                        console.log(resuser)
                      
                        
                          controls.usrd_pwd.enable()
                          controls.usrd_pwd_new.enable()

                      

                          this.isExist = true
                    
                        
                    }, 

                    (err) =>
                       alert  ("Ancien Mot de Passe Erronee") 
                    ),
                  
                        this.loadingSubject.next(false)
        
                   //   controls.usrd_pwd.disable()
                   //   controls.usrd_pwd_new.disable()

                  }
                
              })
    }*/
  changeSite() {
    const controls = this.userForm.controls; // chof le champs hada wesh men form rah
    const si_site = controls.usrd_site.value;
    if (si_site != "*") {
      this.siteService.getByOne({ si_site }).subscribe(
        (res: any) => {
          console.log(res);
          const { data } = res;

          if (!data) {
            this.layoutUtilsService.showActionNotification("ce Site n'existe pas!", MessageType.Create, 10000, true, true);
            this.error = true;
          } else {
            this.error = false;
          }
        },
        (error) => console.log(error)
      );
    }
  }

  //create form

  createForm() {
    this.loadingSubject.next(false);

    this.userForm = this.userFB.group({
      usrd_code: [{ value: this.userEdit.usrd_code, disabled: true }],
      usrd_name: [this.userEdit.usrd_name, Validators.required],
      usrd_user_name: [{ value: this.userEdit.usrd_user_name, disabled: true }],
      usrd_profile: [this.userEdit.usrd_profile, Validators.required],
      usrd_site: [this.userEdit.usrd_site, Validators.required],
      usrd_domain: [this.userEdit.usrd_domain],
      usrd_email: [this.userEdit.usrd_email],
      usrd_dft_printer: [this.userEdit.usrd_dft_printer],
      usrd_phone: [this.userEdit.usrd_phone],
      // usrd_pwd: [{value: "", disabled: !this.isExist}],
      // usrd_pwd_before: [this.usrd_pwd_before, Validators.required],
      // usrd_pwd_new: [{value: "", disabled: !this.isExist}],
      usrd_active: [this.userEdit.usrd_active],
      init: [false],
    });
  }

  //reste form
  reset() {
    this.user = new User();
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.userForm.controls;
    /** check form */
    if (this.userForm.invalid) {
      Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());

      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }

    /*if (controls.usrd_pwd.value  !== controls.usrd_pwd_new.value) {
          alert  ("Mot de passe saisi n'est pas egale au nouveau mot de passe veuillez resaisir") 
          this.message = "Mot de passe erronee";
          this.hasFormErrors = true;
    
          return
         

        }*/

    // tslint:disable-next-line:prefer-const
    const id = this.userEdit.id;

    let address = this.prepareUser();
    this.addUser(id, address);
  }
  /**
   * Returns object for saving
   */
  prepareUser(): User {
    const controls = this.userForm.controls;
    const _user = new User();
    _user.usrd_name = controls.usrd_name.value;
    _user.usrd_profile = controls.usrd_profile.value;
    _user.usrd_phone = controls.usrd_phone.value;
    _user.usrd_email = controls.usrd_email.value;
    _user.usrd_site = controls.usrd_site.value;
    _user.usrd_dft_printer = controls.usrd_dft_printer.value;
    _user.usrd_active = controls.usrd_active.value;
    if (controls.init.value == true) {
      _user.usrd_pwd = this.userEdit.usrd_user_name;
    }
    return _user;
  }
  /**
     * Add user
     
     * @param _user: UserModel
     */
  addUser(id, _user: User) {
    this.loadingSubject.next(true);
    this.userService.updated(id, _user).subscribe(
      (reponse) => console.log("response", Response),
      (error) => {
        alert("Erreur, vérifier les informations");
        this.loadingSubject.next(false);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        this.router.navigateByUrl("/user-mstr/users-list");
      }
    );
  }

  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/users/users-list`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  handleSelectedRowsChanged(e, args) {
    const controls = this.userForm.controls;
    if (Array.isArray(args.rows) && this.gridObj) {
      args.rows.map((idx) => {
        const item = this.gridObj.getDataItem(idx);
        controls.usrd_profile.setValue(item.usrg_code || "");
      });
    }
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = (angularGrid && angularGrid.slickGrid) || {};
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
    ];

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
    };

    // fill the dataset with your data
    this.userService.getAllProfiles().subscribe((response: any) => (this.profiles = response.data));
  }
  open(content) {
    this.prepareGrid();
    this.modalService.open(content, { size: "lg" });
  }
  handleSelectedRowsChangedsite(e, args) {
    const controls = this.userForm.controls;

    if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        controls.usrd_site.setValue(item.si_site || "");
      });
    }
  }

  handleSelectedRowsChangedprinter(e, args) {
    const controls = this.userForm.controls;

    if (Array.isArray(args.rows) && this.gridObjprinter) {
      args.rows.map((idx) => {
        const item = this.gridObjprinter.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        controls.usrd_dft_printer.setValue(item.printer_code || "");
      });
    }
  }

  angularGridReadysite(angularGrid: AngularGridInstance) {
    this.angularGridsite = angularGrid;
    this.gridObjsite = (angularGrid && angularGrid.slickGrid) || {};
  }
  angularGridReadyprinter(angularGrid: AngularGridInstance) {
    this.angularGridprinter = angularGrid;
    this.gridObjprinter = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridsite() {
    this.columnDefinitionssite = [
      {
        id: "id",
        field: "id",
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,

        minWidth: 50,
        maxWidth: 50,
      },
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "si_site",
        name: "Site",
        field: "si_site",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "si_desc",
        name: "Designation",
        field: "si_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionssite = {
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
      checkboxSelector: {},
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };

    // fill the dataset with your data
    this.siteService.getAll().subscribe((response: any) => (this.datasite = response.data));
  }

  prepareGridprinter() {
    this.columnDefinitionsprinter = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "printer_code",
        name: "Code",
        field: "printer_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "printer_desc",
        name: "Designation",
        field: "printer_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionsprinter = {
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
      checkboxSelector: {},
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };

    // fill the dataset with your data
    this.printerService.getAll().subscribe((response: any) => (this.dataprinter = response.data));
  }
  opensite(contentsite) {
    this.prepareGridsite();
    this.modalService.open(contentsite, { size: "lg" });
  }

  openprinter(contentprinter) {
    this.prepareGridprinter();
    this.modalService.open(contentprinter, { size: "lg" });
  }
}
