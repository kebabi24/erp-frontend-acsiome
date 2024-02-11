import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDropdownConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AngularGridInstance, FieldType, GridOption, Column, GridService } from "angular-slickgrid";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { ItineraryService, Role, RoleService, UsersMobileService, TokenSerieService, LocationService, UsersService,MobileSettingsService } from "src/app/core/erp";
import { LayoutUtilsService, MessageType } from "src/app/core/_base/crud";

@Component({
  selector: "kt-edit-role",
  templateUrl: "./edit-role.component.html",
  styleUrls: ["./edit-role.component.scss"],
})
export class EditRoleComponent implements OnInit {
  role: Role;
  roleForm: FormGroup;
  hasFormErrors = false;
  isExist = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  users: [];
  itinerary: any[] = [];
  selectedItinerary: number[] = [];
  columnDefinitions: Column[] = [];
  columnDefinitions2: Column[] = [];
  gridOptions: GridOption = {};
  gridOptions2: GridOption = {};
  gridObj: any;
  angularGrid: AngularGridInstance;
  gridObj2: any;
  angularGrid2: AngularGridInstance;
  selectedTitle: any;
  message: any;
  roleEdit: any;
  title: String = "Modifier role - ";
  user_mobile_code: String;
  device_id: String;
  role_code: any;
  gridOptions3: GridOption = {};
  columnDefinitions3: Column[] = [];
  gridObj3: any;
  angularGrid3: AngularGridInstance;
  dataView3: any;
  gridService3: GridService;
  roles: [];

  gridOptions4: GridOption = {};
  columnDefinitions4: Column[] = [];
  gridObj4: any;
  angularGrid4: AngularGridInstance;
  dataView4: any;
  gridService4: GridService;
  tokens: [];

  gridOptions5: GridOption = {};
  columnDefinitions5: Column[] = [];
  gridObj5: any;
  angularGrid5: AngularGridInstance;
  dataView5: any;
  gridService5: GridService;
  locs: [];

  gridOptions6: GridOption = {};
  columnDefinitions6: Column[] = [];
  gridObj6: any;
  angularGrid6: AngularGridInstance;
  dataView6: any;
  gridService6: GridService;
  sites: [];

  gridOptions7: GridOption = {};
  columnDefinitions7: Column[] = [];
  gridObj7: any;
  angularGrid7: AngularGridInstance;
  dataView7: any;
  gridService7: GridService;
  usrds: [];
  selectedItineray: any[] = [];
  selectedItinerariesIds: any;
  param: any;
  dataView: any;
  grid: any;
  gridOptionspl: GridOption = {};
  columnDefinitionspl: Column[] = [];
  gridObjpl: any;
  angularGridpl: AngularGridInstance;
  dataViewpl: any;
  gridServicepl: GridService;
  pls: [];
  constructor(config: NgbDropdownConfig, private roleF: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog, private layoutUtilsService: LayoutUtilsService, private modalService: NgbModal, private roleService: RoleService, private itineraryService: ItineraryService, private locationService: LocationService, private tokenSerieService: TokenSerieService, private usersService: UsersService, private mobileSettingsService : MobileSettingsService) {
    config.autoClose = true;
    this.activatedRoute.params.subscribe((params) => {
      const id = params.role_code;
      this.param = id;
    });
    this.itineraryService.getBySomething({ role_code: this.param }).subscribe((res: any) => {
      this.selectedItineray = res.data.map((item) => {
        return item;
      });
    });
    console.log("constructor", this.selectedItineray);
    // // this.createForm();
    // this.roleService.getByOne({ role_code: this.param }).subscribe((response: any) => {
    //   this.roleEdit = response.data;
    //   this.initCode()
    //   this.loadingSubject.next(false)
    // })
     this.prepareGrid2();
  }

  initCode() {
    this.createForm()
   
    this.loadingSubject.next(false)
  }
  ngOnInit(): void {
    this.getRoles();
    this.getTokens();
    this.prepareGrid();
    this.getLocations();
    this.getSites();
    this.getUsersd();




    // this.activatedRoute.params.subscribe((params) => {
    //   const id = params.role_code;
    //   this.param = id;
    // });
    // this.itineraryService.getBySomething({ role_code: this.param }).subscribe((res: any) => {
    //   this.selectedItineray = res.data.map((item) => {
    //     return item;
    //   });
    // });
    console.log("constructor", this.selectedItineray);
    // this.createForm();
    this.roleService.getByOne({ role_code: this.param }).subscribe((response: any) => {
      this.roleEdit = response.data;
      this.title = this.title + this.roleEdit.role_name;
      this.initCode()
      this.loadingSubject.next(false)
    })
    // this.prepareGrid2();
    // setTimeout(() => {
    //   this.createForm();
    // }, 500);
    // setTimeout(() => {
    //   this.setData();
    // }, 2000);
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(true);
  }
  time = new Observable<string>((observer: Observer<string>) => {
    setInterval(() => {
      observer.next("");
    }, 1000);
  });
  // setData() {
  //   const controls = this.roleForm.controls;
  //   this.activatedRoute.params.subscribe((params) => {
  //     const id = params.role_code;
  //     console.log(id);
  //     this.roleService.getByOne({ role_code: id }).subscribe((response: any) => {
  //       this.roleEdit = response.data;
  //       console.log(this.roleEdit.role_code);
  //       this.role_code = this.roleEdit.role_code;
  //       controls.role_code.setValue(this.roleEdit.role_code);
  //       controls.role_name.setValue(this.roleEdit.role_name);
  //       controls.user_mobile_code.setValue(this.roleEdit.user_mobile_code);
  //       controls.device_id.setValue(this.roleEdit.device_id);

  //       controls.controller_role.setValue(this.roleEdit.controller_role);
  //       controls.upper_role_code.setValue(this.roleEdit.upper_role_code);
  //       controls.token_serie_code.setValue(this.roleEdit.token_serie_code);
  //       controls.role_loc.setValue(this.roleEdit.role_loc);
  //       controls.role_site.setValue(this.roleEdit.role_site);
  //       controls.role_loc_from.setValue(this.roleEdit.role_loc_from);
  //       controls.printer_adress.setValue(this.roleEdit.printer_adress);

  //       this.loadingSubject.next(false);
  //       this.title = this.title + this.roleEdit.role_name;
  //     });
  //   });
  // }
  createForm() {
    this.loadingSubject.next(false);
    this.role = new Role();
    this.roleForm = this.roleF.group({
      role_code: [{ value: this.roleEdit.role_code, disabled: true }],
      role_name: [ this.roleEdit.role_name , Validators.required],
      user_mobile_code: [this.roleEdit.user_mobile_code, Validators.required],
      device_id: [this.roleEdit.device_id, Validators.required],

      controller_role: [this.roleEdit.controller_role, Validators.required],
      upper_role_code: [this.roleEdit.upper_role_code, Validators.required],

      token_serie_code: [this.roleEdit.token_serie_code, Validators.required],

      role_loc: [this.roleEdit.role_loc, Validators.required],
      role_site: [this.roleEdit.role_site, Validators.required],
      role_loc_from: [this.roleEdit.role_loc_from, Validators.required],

      printer_adress: [this.roleEdit.printer_adress, Validators.required],
      pricelist_code: [this.roleEdit.pricelist_code],
      //init: [false],
    });

    
  }

  open(content) {
    this.prepareGrid();
    this.modalService.open(content, { size: "lg" });
  }

  reset() {
    this.role = new Role();
    this.createForm();
    this.hasFormErrors = false;
  }

  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.roleForm.controls;
    /** check form */
    if (this.roleForm.invalid) {
      Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());

      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }

    // tslint:disable-next-line:prefer-const
    const id = this.roleEdit.id;

    let role = this.prepareRole();
    console.log(role);
    this.addRole(role, this.selectedItinerary);
  }

  prepareRole(): Role {
    const controls = this.roleForm.controls;
    const _role = new Role();
    _role.role_code = controls.role_code.value;
    _role.role_name = controls.role_name.value;
    _role.user_mobile_code = controls.user_mobile_code.value;
    _role.device_id = controls.device_id.value;
    _role.controller_role = controls.controller_role.value;
    _role.upper_role_code = controls.upper_role_code.value;
    _role.token_serie_code = controls.token_serie_code.value;
    _role.role_loc = controls.role_loc.value;
    _role.role_site = controls.role_site.value;
    _role.role_loc_from = controls.role_loc_from.value;
    _role.printer_adress = controls.printer_adress.value;
    _role.pricelist_code = controls.pricelist_code.value;

    return _role;
  }

  addRole(_role: Role, _itinerary: any) {
    this.loadingSubject.next(true);
    this.roleService.updated(this.roleEdit.id, { role: _role, itinerary: _itinerary }).subscribe(
      (reponse) => console.log("response", Response),
      (error) => {
        this.layoutUtilsService.showActionNotification("Erreur verifier les informations", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        this.router.navigateByUrl("/roles/list-all-roles");
      }
    );
  }

  goBack() {
    this.loadingSubject.next(false);
    const url = `/roles/list-all-roles`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  prepareGrid2() {
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
    ];

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
        selectActiveRow: false,

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
      multiSelect: true,
    };

    // fill the dataset with your data
    this.itineraryService.getAllItinerary().subscribe((response: any) => (this.itinerary = response.data));
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
        id: "profile_code",
        name: "code profile",
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
    this.roleService.getAllUsers().subscribe((response: any) => (this.users = response.data));
  }

  onChangeCode() {
    const controls = this.roleForm.controls;

    this.roleService.getByOne({ role_code: controls.role_code.value }).subscribe((res: any) => {
      console.log("aa", res.data);

      if (res.data) {
        alert("Ce role exist déja");
        controls.role_code.setValue(null);
        document.getElementById("role").focus();
      } else {
        controls.role_name.enable();
        controls.userMobile_code.enable();
      }
    });
  }

  handleSelectedRowsChanged(e, args) {
    const controls = this.roleForm.controls;
    if (Array.isArray(args.rows) && this.gridObj) {
      args.rows.map((idx) => {
        const item = this.gridObj.getDataItem(idx);
        this.user_mobile_code = item.user_mobile_code;
        controls.user_mobile_code.setValue(item.user_mobile_code || "");
      });
    }
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    console.log("***********************************************");
    this.angularGrid = angularGrid;
    this.gridObj = (angularGrid && angularGrid.slickGrid) || {};
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
    let items: any[] = [];
    let selectedRowss;
    console.log("***************************************");
    this.angularGrid2 = angularGrid;
    this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {};
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.itinerary.forEach((element) => {
      this.selectedItineray.forEach((element2) => {
        if (element.itinerary_code === element2.itinerary_code) {
          items.push(this.dataView.getIdxById(element.id));
        }
      });
    });

    this.grid.setSelectedRows(items);
  }

  /// ***************
  // CONTROLLER ROLE GRID
  prepareGridRoleController() {
    this.columnDefinitions3 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "role_code",
        name: "Code",
        field: "role_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "role_name",
        name: "Nom",
        field: "role_name",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "user_mobile_code",
        name: "Utilisateur mobile",
        field: "user_mobile_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptions3 = {
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
        hideSelectAllCheckbox: true,
      },
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };
  }

  getRoles() {
    // fill the dataset with your data
    this.roleService.getAllRoles().subscribe((response: any) => {
      this.roles = response.data;
      this.dataView3.setItems(response.data);
    });

    //  this.usersService
    //  .getAllUsers()
    //  .subscribe((response: any) => {
    //   console.log(response)
    //   //  this.roles = response.data
    //   //  this.dataView3.setItems(response.data)
    //  })
  }
  gridReady3(angularGrid: AngularGridInstance) {
    this.angularGrid3 = angularGrid;
    this.dataView3 = angularGrid.dataView;
    this.gridObj3 = angularGrid.slickGrid;
    this.gridService3 = angularGrid.gridService;
  }

  angularGridReady3(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView3 = angularGrid.dataView;
    this.gridObj3 = angularGrid.slickGrid;
    this.gridService3 = angularGrid.gridService;
  }

  open3(content) {
    this.prepareGrid();
    this.modalService.open(content, { size: "lg" });
  }

  handleSelectedRoleController(e, args) {
    const controls = this.roleForm.controls
    if (Array.isArray(args.rows) && this.gridObj) {
      args.rows.map((idx) => {
        const item = this.gridObj.getDataItem(idx);
        //const role = this.gridObj3.getDataItem(index);
      controls.controller_role.setValue(item.user_mobile_code);
    });
  }
}
  // controls.so_cust.setValue(saleOrder.so_cust)

  open4(content) {
    //  this.prepareGridRoleController()
    this.prepareGridUsers();
    this.modalService.open(content, { size: "lg" });
  }

  handleSelectedUpperRole(e, args) {
    const controls = this.roleForm.controls;
    if (args.rows.length > 0) {
      let index = args.rows[0];
      const user = this.gridObj7.getDataItem(index);
      controls.upper_role_code.setValue(user.usrd_code);
    }
  }

  // TOKEN SERIE GRID
  prepareGridTokenSerie() {
    this.columnDefinitions4 = [
      {
        id: "token_code",
        name: "Code token",
        field: "token_code",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
      },

      {
        id: "token_name",
        name: "Nom token ",
        field: "token_name",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "token_digitcount",
        name: "Nombre de chiffres",
        field: "token_digitcount",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.integer,
      },

      {
        id: "service_prefix",
        name: "Service préfixe",
        field: "service_prefix",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "service_next_number ",
        name: "Numéro suivant",
        field: "service_next_number ",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.integer,
      },

      //
      {
        id: "visit_prefix",
        name: "Visit préfixe",
        field: "visit_prefix",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "visit_next_number",
        name: "Numéro suivant",
        field: "visit_next_number",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.integer,
      },

      // ***
      {
        id: "customer_prefix",
        name: "Client préfixe",
        field: "customer_prefix",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "customer_next_number",
        name: "Numéro suivant",
        field: "customer_next_number",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.integer,
      },

      // ***
      {
        id: "load_request_prefix",
        name: "Demande de chargement préfixe",
        field: "load_request_prefix",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "load_request_next_number",
        name: "Numéro suivant",
        field: "load_request_next_number",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.integer,
      },

      // ***
      {
        id: "inventory_prefix",
        name: "Inventaire préfixe",
        field: "inventory_prefix",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "inventory_next_number",
        name: "Numéro suivant",
        field: "inventory_next_number",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.integer,
      },
    ];

    this.gridOptions4 = {
      asyncEditorLoading: false,
      editable: false,
      enableAddRow: true,
      enableAutoResize: true,
      autoHeight: false,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };
  }

  getTokens() {
    this.tokenSerieService.getAllTokens().subscribe(
      (response: any) => {
        this.tokens = response.data;
        this.dataView4.setItems(this.tokens);
      },
      (error) => {
        this.tokens = [];
      },
      () => {}
    );
  }

  gridReady4(angularGrid: AngularGridInstance) {
    this.angularGrid4 = angularGrid;
    this.dataView4 = angularGrid.dataView;
    this.gridObj4 = angularGrid.slickGrid;
    this.gridService4 = angularGrid.gridService;
  }

  angularGridReady4(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView4 = angularGrid.dataView;
    this.gridObj4 = angularGrid.slickGrid;
    this.gridService4 = angularGrid.gridService;
  }

  open5(content) {
    this.prepareGridTokenSerie();
    this.modalService.open(content, { size: "lg" });
  }

  handleSelectedToken(e, args) {
    const controls = this.roleForm.controls;
    if (args.rows.length > 0) {
      let index = args.rows[0];
      const item = this.gridObj4.getDataItem(index);
      controls.token_serie_code.setValue(item.token_code);
    }
  }

  // LOCATION GRID
  prepareGridLocation() {
    this.columnDefinitions5 = [
      {
        id: "loc_loc",
        name: "Code token",
        field: "loc_loc",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
      },

      {
        id: "loc_desc",
        name: "Description",
        field: "loc_desc",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "loc_status",
        name: "Status",
        field: "loc_status",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.integer,
      },
    ];

    this.gridOptions5 = {
      asyncEditorLoading: false,
      editable: false,
      enableAddRow: true,
      enableAutoResize: true,
      autoHeight: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };
  }

  getLocations() {
    this.roleService.getAllLocations().subscribe(
      (response: any) => {
        this.locs = response.data;
        this.dataView5.setItems(this.locs);
      },
      (error) => {
        this.locs = [];
      },
      () => {}
    );
  }

  getSites() {
    this.roleService.getAllSites().subscribe(
      (response: any) => {
        this.sites = response.data;
        this.dataView6.setItems(this.sites);
      },
      (error) => {
        this.sites = [];
      },
      () => {}
    );
  }

  gridReady5(angularGrid: AngularGridInstance) {
    this.angularGrid5 = angularGrid;
    this.dataView5 = angularGrid.dataView;
    this.gridObj5 = angularGrid.slickGrid;
    this.gridService5 = angularGrid.gridService;
  }

  angularGridReady5(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView5 = angularGrid.dataView;
    this.gridObj5 = angularGrid.slickGrid;
    this.gridService5 = angularGrid.gridService;
  }

  open6(content) {
    this.prepareGridLocation();
    this.modalService.open(content, { size: "lg" });
  }

  open7(content) {
    this.prepareGridLocation();
    this.modalService.open(content, { size: "lg" });
  }

  handleSelectedLoc(e, args) {
    const controls = this.roleForm.controls;
    if (args.rows.length > 0) {
      let index = args.rows[0];
      const item = this.gridObj5.getDataItem(index);
      controls.role_loc.setValue(item.loc_loc);
    }
  }
  handleSelectedLocFrom(e, args) {
    const controls = this.roleForm.controls;
    if (args.rows.length > 0) {
      let index = args.rows[0];
      const item = this.gridObj5.getDataItem(index);
      controls.role_loc_from.setValue(item.loc_loc);
    }
  }

  // SITE GRID
  // TOKEN SERIE GRID
  prepareGridSite() {
    this.columnDefinitions6 = [
      {
        id: "si_site",
        name: "Code site",
        field: "si_site",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
      },

      {
        id: "si_desc",
        name: "Description",
        field: "si_desc",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "si_status",
        name: "Status",
        field: "si_status",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.integer,
      },
    ];

    this.gridOptions6 = {
      asyncEditorLoading: false,
      editable: false,
      enableAddRow: true,
      enableAutoResize: true,
      autoHeight: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };
  }

  gridReady6(angularGrid: AngularGridInstance) {
    this.angularGrid6 = angularGrid;
    this.dataView6 = angularGrid.dataView;
    this.gridObj6 = angularGrid.slickGrid;
    this.gridService6 = angularGrid.gridService;
  }

  angularGridReady6(angularGrid: AngularGridInstance) {
    this.angularGrid6 = angularGrid;
    this.dataView6 = angularGrid.dataView;
    this.gridObj6 = angularGrid.slickGrid;
    this.gridService6 = angularGrid.gridService;
  }

  open8(content) {
    this.prepareGridSite();
    this.modalService.open(content, { size: "lg" });
  }

  handleSelectedSite(e, args) {
    const controls = this.roleForm.controls;
    if (args.rows.length > 0) {
      let index = args.rows[0];
      const item = this.gridObj6.getDataItem(index);

      controls.role_site.setValue(item.si_site);
      this.locationService.getBy({ loc_site: item.si_site }).subscribe(
        (response: any) => {
          this.locs = response.data;
          console.log(this.locs);
          // this.dataView6.setItems(this.sites)
        },
        (error) => {
          this.sites = [];
        },
        () => {}
      );
    }
  }

  // USRD GRID
  prepareGridUsers() {
    this.columnDefinitions7 = [
      {
        id: "usrd_code",
        name: "Code",
        field: "usrd_code",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
      },

      {
        id: "usrd_name",
        name: "Nom",
        field: "usrd_name",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptions7 = {
      asyncEditorLoading: false,
      editable: false,
      enableAddRow: true,
      enableAutoResize: true,
      autoHeight: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };
  }

  gridReady7(angularGrid: AngularGridInstance) {
    this.angularGrid7 = angularGrid;
    this.dataView7 = angularGrid.dataView;
    this.gridObj7 = angularGrid.slickGrid;
    this.gridService7 = angularGrid.gridService;
  }

  angularGridReady7(angularGrid: AngularGridInstance) {
    this.angularGrid7 = angularGrid;
    this.dataView7 = angularGrid.dataView;
    this.gridObj7 = angularGrid.slickGrid;
    this.gridService7 = angularGrid.gridService;
  }

  getUsersd() {
    this.usersService.getAllUsers().subscribe(
      (response: any) => {
        this.usrds = response.data;
        this.dataView7.setItems(this.usrds);
      },
      (error) => {
        this.users = [];
      },
      () => {}
    );
  }
  openpl(content) {
    this.prepareGridpl();
    this.modalService.open(content, { size: "lg" });
  }
  prepareGridpl() {
    this.columnDefinitionspl = [
      {
        id: "id",
        name: "Id",
        field: "id",
        sortable: true,
        minWidth: 30,
        maxWidth: 50,
        filterable: true,
        type: FieldType.string,
      },

      {
        id: "pricelist_code",
        name: "Code Liste des Prix",
        field: "pricelist_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },

      {
        id: "description",
        name: "Description",
        field: "description",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
      },
    
    ];

    this.gridOptionspl = {
      asyncEditorLoading: false,
      editable: false,
      enableAddRow: true,
      enableAutoResize: true,
      autoHeight: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };
    this.mobileSettingsService
    .getAllPriceList()
    .subscribe((response: any) => (this.pls = response.data))
  }
  angularGridReadypl(angularGrid: AngularGridInstance) {
    this.angularGridpl = angularGrid;
    this.dataViewpl = angularGrid.dataView;
    this.gridObjpl = angularGrid.slickGrid;
    this.gridServicepl = angularGrid.gridService;
  }
  handleSelectedpl(e, args) {
    const controls = this.roleForm.controls
    if (Array.isArray(args.rows) && this.gridObjpl) {
        args.rows.map((idx) => {
            const item = this.gridObjpl.getDataItem(idx)
            controls.pricelist_code.setValue(item.pricelist_code || "")
        })
    }
  }

}
