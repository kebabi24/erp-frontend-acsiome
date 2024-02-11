import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { BehaviorSubject, Observable } from "rxjs";
import { LayoutUtilsService, MessageType } from "src/app/core/_base/crud";
import { Role, RoleService, ItineraryService, UsersService, TokenSerieService, LocationService, MobileSettingsService} from "../../../../core/erp";
import * as os from "os";
import { AngularGridInstance, Column, FieldType, Filters, Formatters, GridOption, GridStateChange, GridService } from "angular-slickgrid";
import { AnyCnameRecord } from "dns";

@Component({
  selector: "kt-create-new-roles",
  templateUrl: "./create-new-roles.component.html",
  styleUrls: ["./create-new-roles.component.scss"],
})
export class CreateNewRolesComponent implements OnInit {
  role: Role;
  roleForm: FormGroup;
  hasFormErrors = false;
  isExist = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  users: [];
  itinerary: any[];
  its: [];
  selectedItinerary: number[] = [];

  columnDefinitions: Column[] = [];
  columnDefinitionsit: Column[] = [];
  columnDefinitions2: Column[] = [];
  gridOptions: GridOption = {};
  gridOptions2: GridOption = {};
  gridOptionsit: GridOption = {};
  gridObj: any;
  angularGrid: AngularGridInstance;
  gridObj2: any;

  angularGrid2: AngularGridInstance;
  gridObjit: any;
  angularGridit: AngularGridInstance;
  selectedTitle: any;
  message: any;
  dataViewit: any;
  gridServiceit: GridService;
  selectedIndexes: any[];
  selectedIndexes2: any[];
  d: Array<number> = [];

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

  gridOptionspl: GridOption = {};
  columnDefinitionspl: Column[] = [];
  gridObjpl: any;
  angularGridpl: AngularGridInstance;
  dataViewpl: any;
  gridServicepl: GridService;
  pls: [];

  constructor(config: NgbDropdownConfig, private roleF: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog, private layoutUtilsService: LayoutUtilsService, private roleService: RoleService, private itineraryService: ItineraryService, private locationService: LocationService, private modalService: NgbModal, private cd: ChangeDetectorRef, private tokenSerieService: TokenSerieService, private usersService: UsersService, private mobileSettingsService : MobileSettingsService) {
    config.autoClose = true;
    this.prepareGrid2();
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.getRoles();
    this.getTokens();
    this.prepareGrid();
    this.getLocations();
    this.getSites();
    this.getUsersd();
    this.createForm();
  }

  createForm() {
    this.loadingSubject.next(false);

    this.role = new Role();
    this.roleForm = this.roleF.group({
      role_code: [this.role.role_code, Validators.required],
      role_name: [this.role.role_name, Validators.required],
      user_mobile_code: [{ value: this.role.user_mobile_code, disabled: !this.isExist }, Validators.required],
      device_id: [this.role.device_id, Validators.required],

      controller_role: [this.role.controller_role, Validators.required],
      upper_role_code: [this.role.upper_role_code, Validators.required],

      token_serie_code: [this.role.token_serie_code, Validators.required],

      role_loc: [this.role.role_loc, Validators.required],
      role_site: [this.role.device_id, Validators.required],
      role_loc_from: [this.role.role_loc_from, Validators.required],

      printer_adress: [this.role.printer_adress, Validators.required],
      pricelist_code: [this.role.pricelist_code],
    });
  }

  prepareGrid2() {
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
    ];

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
    };

    this.itinerary = [];
    // fill the dataset with your data
    // this.itineraryService
    //     .getAllItinerary()
    //     .subscribe((response: any) => (this.itinerary = response.data))
  }

  onChangeCode() {
    const controls = this.roleForm.controls;

    this.roleService.getByOne({ role_code: controls.role_code.value }).subscribe((res: any) => {
      //console.log("aa", res.data);

      if (res.data) {
        alert("Ce role exist déja");
        this.isExist = true;
        document.getElementById("role").focus();
      } else {
        controls.role_name.enable();
        controls.userMobile_code.enable();
      }
    });
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
        name: "code d'utilisateur",
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
      // {
      //   id: "fullname",
      //   name: "Nom complet",
      //   field: "fullname",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.string,
      // },
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
  onChangeRole() {
    const controls = this.roleForm.controls;

    this.roleService.getByOne({ role_code: controls.role_code.value }).subscribe((res: any) => {
      //console.log("aa", res.data);

      if (res.data) {
        //console.log("here")
        this.router.navigateByUrl(`/roles/edit-role/${res.data.role_code}`);
        //console.log(res.data.id)
      }
    });
  }

  onDeviceIdChange() {
    const controls = this.roleForm.controls;
    //console.log("hello")

    this.roleService.getOneByDeviceId(controls.device_id.value).subscribe((res: any) => {
      //console.log("aa", res.data);
      alert("Cet identifiant d'appareil existe");
      controls.device_id.setValue(null);
      document.getElementById("device").focus();
    });
  }

  open(content) {
    this.prepareGrid();
    this.modalService.open(content, { size: "lg" });
  }
  openit(content) {
    let dd = [];
    for (let it of this.itinerary) {
      //console.log(it)
      //this.selectedIndexes2.push(1)
      var i = it.id;
      dd.push(i);
      // console.log("i",i)
    }
    // console.log(this.selectedIndexes2)
    // console.log(dd)
    this.selectedIndexes2 = dd;
    this.prepareGridit();
    this.modalService.open(content, { size: "lg" });
  }
  reset() {
    this.role = new Role();
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.roleForm.controls;
    /** check form */
    if (this.roleForm.invalid) {
      Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());

      this.hasFormErrors = true;
      return;
    }

    // tslint:disable-next-line:prefer-const
    let role = this.prepareRole();
    //console.log(this.selectedItinerary)
    this.addRole(role, this.itinerary);
    // const hostname = os.networkInterfaces()
    //console.log(hostname)
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
    _role.role_loc = controls.role_loc.value;
    _role.role_site = controls.role_site.value;
    _role.role_loc_from = controls.role_loc_from.value;
    _role.token_serie_code = controls.token_serie_code.value;
    _role.printer_adress = controls.printer_adress.value;
    _role.pricelist_code = controls.pricelist_code.value;
    return _role;
  }

  /**
   * Add role
   *
   * @param _role: RoleModel
   */
  addNewItem(content) {
    this.openit(content);
  }
  addRole(_role: Role, _itinerary: any) {
    this.loadingSubject.next(true);
    this.roleService.addRole({ role: _role, itinerary: _itinerary }).subscribe(
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

  handleSelectedRowsChanged(e, args) {
    const controls = this.roleForm.controls;
    if (Array.isArray(args.rows) && this.gridObj) {
      args.rows.map((idx) => {
        const item = this.gridObj.getDataItem(idx);
        controls.user_mobile_code.setValue(item.user_mobile_code || "");
      });
    }
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = (angularGrid && angularGrid.slickGrid) || {};
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
    this.angularGrid2 = angularGrid;
    this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {};
  }

  onChange(e) {
    console.log(e);
  }

  angularGridReadyit(angularGrid: AngularGridInstance) {
    this.angularGridit = angularGrid;
    this.gridObjit = (angularGrid && angularGrid.slickGrid) || {};

    this.gridServiceit = angularGrid.gridService;
    this.dataViewit = angularGrid.dataView;
  }

  // GRID IN
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
    ];

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
      multiSelect: false,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true,
      },
      presets: {
        sorters: [{ columnId: "id", direction: "ASC" }],
        rowSelection: {
          // gridRowIndexes: [2],           // the row position of what you see on the screen (UI)
          gridRowIndexes: this.selectedIndexes2, // (recommended) select by your data object IDs
          //dataContextIds
        },
      },
    };

    // fill the dataset with your data
    this.itineraryService.getAllItinerary().subscribe((response: any) => (this.its = response.data));
  }

  handleSelectedRowsChangedit(e, args) {
    this.selectedIndexes = [];
    this.selectedIndexes = args.rows;
  }

  addit() {
    // this.itinerary.push({})
    var l: any[] = [];
    this.selectedIndexes.forEach((index) => {
      l.push({
        id: index,
        itinerary_code: this.its[index]["itinerary_code"],
        itinerary_name: this.its[index]["itinerary_name"],
        itinerary_type: this.its[index]["itinerary_type"],
        //trigger : this.itinerary[index]['pjd_trigger']
      });
    });
    // console.log("lllllllll",l)
    this.itinerary = l;

    this.dataViewit.setItems(this.itinerary);
  }

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
      autoHeight: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      multiSelect: false,
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
    this.angularGrid = angularGrid;
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
