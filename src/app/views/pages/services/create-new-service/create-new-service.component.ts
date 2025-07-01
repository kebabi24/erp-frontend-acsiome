import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { AngularGridInstance, Column, FieldType, GridOption, OnEventArgs, GridService } from "angular-slickgrid";

import { BehaviorSubject, Observable } from "rxjs";
import { LayoutUtilsService, MessageType } from "src/app/core/_base/crud";
import { MobileServiceService, MobileService, RoleService, ItineraryService } from "../../../../core/erp";
@Component({
  selector: "kt-create-new-service",
  encapsulation: ViewEncapsulation.None,
  templateUrl: "./create-new-service.component.html",
  styleUrls: ["./create-new-service.component.scss"],
})
export class CreateNewServiceComponent implements OnInit {
  service: MobileService;
  serviceForm: FormGroup;
  createServiceForm: FormGroup;
  hasFormErrors = false;
  isExist = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  public services = [];
  public data = [];
  roles: string[] = [];
  itinerary: any[] = [];
  dataset: any[] = [];
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  gridObj: any;
  angularGrid: AngularGridInstance;
  gridService: GridService;
  message: any;
  column: Column;
  grid: any;
  dataView: any;
  selectedRow: any;
  isNotSelected = true;
  isClose = false;
  user_mobile_code: any
  site: any
  role: any
  constructor(
    config: NgbDropdownConfig,
    private serviceF: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private mobileService: MobileServiceService,
    private roleService: RoleService,
    private itineraryService: ItineraryService,
    // private gridService: GridService,
    private modalService: NgbModal
  ) {
    config.autoClose = true;
    this.prepareGrid();
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    // this.createForm()
  }

  open(content) {
    this.prepareItinirary(this.role)
    this.modalService.open(content, { size: "lg" });
  }

  open2(content,content2) {
    console.log(this.selectedRow)
    if (this.selectedRow.etat_service != null)
  { this.modalService.open(content, { size: "lg" }); }
    else {
      this.modalService.open(content2, { size: "lg" }); }
    }
  
  
  
  prepareGrid() {
    this.columnDefinitions = [
      {
        id: "role_code",
        name: "Code role",
        field: "role_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "role_name",
        name: "Nom role",
        field: "role_name",
        sortable: true,
        width: 100,
        filterable: true,
        type: FieldType.string,
      },

      {
        id: "user_mobile_code",
        name: "Code utilisateur",
        field: "user_mobile_code",
        sortable: true,
        width: 100,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "username",
        name: "Nom utilisateur",
        field: "username",
        sortable: true,
        width: 100,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "profile_code",
        name: "Code profile",
        field: "profile_code",
        sortable: true,
        width: 100,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "profile_name",
        name: "Nom profile",
        field: "profile_name",
        sortable: true,
        width: 100,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "code_service",
        name: "Code service",
        field: "code_service",
        sortable: true,
        width: 100,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "etat_service",
        name: "Ouvert",
        field: "etat_service",
        sortable: true,
        width: 100,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "service_period_activate_date",
        name: "Période service",
        field: "service_period_activate_date",
        sortable: true,
        width: 100,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "itinerary_code",
        name: "Code itinéraire ",
        field: "itinerary_code",
        sortable: true,
        width: 100,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "itinerary_name",
        name: "Nom itinéraire ",
        field: "itinerary_name",
        sortable: true,
        width: 100,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptions = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      autoEdit: false,
      autoHeight: false,
      enableAutoResize: true,
      frozenColumn: 0,
      frozenBottom: true,
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
        sorters: [
          { columnId: 'role_code', direction: 'ASC' }
        ],
      }
    };

    // fill the dataset with your data
    this.dataset = [];
    this.dataset = this.prepareDataset();
    // console.log(this.dataset);
  }

  prepareItinirary(role) {
    this.mobileService.getItinirary({role_code: role}).subscribe(
      (response: any) => {
        

this.itinerary = response.data
console.log("heeeeeeeeeeeeeeeeee"),this.itinerary
      })
    }
  prepareDataset() {
    this.mobileService.getAllService().subscribe(
      (response: any) => {
        this.data = response.data;
         //console.log(this.data);
        this.dataset = this.data.map((item) => {
          this.services.push(item);
          // console.log(item);
          const itineraries = item.role_itineraries;
          // console.log(itineraries);
          const tab = [];
          tab.push(itineraries);
          // console.log(tab)
          const itn = itineraries.filter((item_itinerary) => item.service != null && item_itinerary.itinerary.itinerary_code === item.service.itinerary_code);
          console.log(itn);
          // console.log(itineraries)
          if (item.service == null) {
            const node: any = {
              id: Math.random() * 100,
              role_code: item.role_code,
              role_name: item.role_name,
              user_mobile_code: item.user_mobile_code,
              username: item.userMobile.username,
              profile_code: item.userMobile.profileMobile.profile_code,
              profile_name: item.userMobile.profileMobile.profile_name,
              code_service: null,
              etat_service: null,
              service_period_activate_date: null,
              itinerary_code: null,
              itinerary_name: null,
              role_site: item.role_site
            };
            return node;
          } else {
            const node: any = {
              id: Math.random() * 100,
              role_code: item.role_code,
              role_name: item.role_name,
              user_mobile_code: item.user_mobile_code,
              username: item.userMobile.username,
              profile_code: item.userMobile.profileMobile.profile_code,
              profile_name: item.userMobile.profileMobile.profile_name,
              code_service: item.service.service_code,
              etat_service: "Oui",
              service_period_activate_date: item.service.service_period_activate_date,
              itinerary_code: item.service.itinerary_code,
              itinerary_name: (itn.length != 0) ? itn[0].itinerary.itinerary_name : null,
              role_site: item.role_site
            };
            return node;
          }
        });
        // console.log(this.dataset);
      },
      (error) => {
        this.dataset = [];
      },
      () => {}
    );
    // console.log(this.services);
    return this.dataset;
  }

  // onChangeCode() {
  //   const controls = this.serviceForm.controls
  //   const _service = new MobileService()
  //   const role_code = controls.role_code.value
  //   this.itineraryService.getItineraryByRole({role_code: role_code}).subscribe(

  //     (response: any) => {
  //     this.itinerary = response.data
  //     console.log(response.data)
  //     }
  // )

  // }

  // reset() {
  //   this.service = new MobileService()
  //   this.createForm()
  //   this.hasFormErrors = false
  // }

  onSubmit() {
    // console.log(this.selectedRow.role_code)
    // tslint:disable-next-line:prefer-const
    // let service = this.prepareService()
    // this.addItinerary(service)
  }

  prepareService(): MobileService {
    const controls = this.createServiceForm.controls;
    const _service = new MobileService();

    // _service.service_code = controls.service_code.value;
    // _service.service_creation_date = controls.service_creation_date.value;
    // console.log(controls.service_creation_date.value.year);
    const year = controls.service_creation_date.value.year;
    const month = controls.service_creation_date.value.month;
    const day = controls.service_creation_date.value.day;
  
    _service.service_period_activate_date = `${year}/${month}/${day}`;
    //_service.service_closing_date = controls.service_closing_date.value
    _service.role_code = controls.role_code.value;
    _service.itinerary_code = controls.itinerary_code.value;
    _service.user_mobile_code = this.user_mobile_code;
    _service.service_site = this.site;
    
    // _service.service_open = controls.service_open.value
    return _service;
  }

  addItinerary(_service: MobileService) {
    // console.log(_service);
    this.loadingSubject.next(true);
    this.mobileService.addService(_service).subscribe(
      (reponse) => console.log("response", Response),
      (error) => {
        alert("Erreur, vérifier les informations");
        this.loadingSubject.next(false);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        this.dataset = this.prepareDataset();
        this.router.navigateByUrl("/services/create-new-service");
      }
    );
  }

  goBack() {
    this.loadingSubject.next(false);
    const url = `/service`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  handleSelectedRowsChanged(e, args) {
    if (Array.isArray(args.rows) && this.grid) {
      args.rows.map((idx) => {
        const item = this.grid.getDataItem(idx);
        // this.itinerary = this.services[idx].role_itineraries
        this.user_mobile_code = item.user_mobile_code
        // console.log( item.role_site)
        this.site = item.role_site
        this.role= item.role_code
        // this.itinerary = [];
        // console.log(this.services[idx]);
        const newItem = [];
        newItem.push(this.services[idx].role_itineraries);

        // newItem.map((item: any) => {
        //   item.map((element: any) => {
        //   // console.log(element)
        //   this.itinerary.push({ itinerary_code: element.itinerary.itinerary_code, itinerary_name: element.itinerary.itinerary_name });
        //   })
        // });
        // console.log(this.itinerary);
        this.selectedRow = item;
      });
    }
    if (this.selectedRow.etat_service === null) {
      this.isNotSelected = false;
      this.createForm(this.selectedRow);
      // this.createService();
      
      this.isClose = true;
    } else {
      // this.closeService();
      this.isClose = false;
      this.isNotSelected = false;
    }
  }
  closeServices() {
    this.hasFormErrors = false

        
    // let service = this.prepareService();
    const service_code = this.selectedRow.code_service
    this.mobileService.closeService({service_code}, service_code).subscribe(
      (reponse) => console.log("response", Response),
      (error) => {
        this.layoutUtilsService.showActionNotification("Erreur verifier les informations", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Fermeture avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        this.dataset = this.prepareDataset();
        this.router.navigateByUrl("/services/create-new-service");
      }
    );
    this.modalService.dismissAll()
  
  }
    
    
  // closeSer(_service: any) {
  //   console.log(_service);
  //   this.loadingSubject.next(true);
  //   this.mobileService.closeService(service_code: _service).subscribe(
  //     (reponse) => console.log("response", Response),
  //     (error) => {
  //       this.layoutUtilsService.showActionNotification("Erreur verifier les informations", MessageType.Create, 10000, true, true);
  //       this.loadingSubject.next(false);
  //     },
  //     () => {
  //       this.layoutUtilsService.showActionNotification("Fermeture avec succès", MessageType.Create, 10000, true, true);
  //       this.loadingSubject.next(false);
  //       this.dataset = this.prepareDataset();
  //       this.router.navigateByUrl("/services/create-new-service");
  //     }
  //   );
  // }

  createService() {
    this.hasFormErrors = false
    const controls = this.createServiceForm.controls
    /** check form */
    if (this.createServiceForm.invalid) {
        Object.keys(controls).forEach((controlName) =>
            controls[controlName].markAsTouched()
        )

        this.hasFormErrors = true
        return
    }

    let service = this.prepareService();
    this.addItinerary(service);
    this.modalService.dismissAll()
  }
  onAlertClose($event) {
    this.hasFormErrors = false
  }
  createForm(row) {
    // console.log(row)
    this.loadingSubject.next(false);
    this.service = new MobileService();
    const date = new Date();
     console.log("Date",date);
     console.log("heure",date.getHours());
    this.createServiceForm = this.serviceF.group({
      // service_code: [{value: row.service_code, disabled: true}],
    //  service_creation_date: [ this.service.service_creation_date , Validators.required],
      service_creation_date: [
        {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: (date.getHours() > 13) ? date.getDate() + 1: date.getDate(),
        },
      ],
      // service_closing_date: [{ value: this.service.service_closing_date }, Validators.required],
      role_code: [row.role_code, Validators.required],
      role_name: [row.role_name, Validators.required],
      itinerary_code: [row.itinerary_code, Validators.required],
      // service_open: [{value: this.service.service_open}, Validators.required],
    });
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;

    // if you want to change background color of Duration over 50 right after page load,
    // you would put the code here, also make sure to re-render the grid for the styling to be applied right away
    this.dataView.getItemMetadata = this.updateItemMetadata(this.dataView.getItemMetadata);
    this.grid.invalidate();
    this.grid.render();
  }

  updateItemMetadata(previousItemMetadata: any) {
    const newCssClass = "highlight-bg";
    // console.log(this.dataView);
    return (rowNumber: number) => {
      const item = this.dataView.getItem(rowNumber);
      let meta = {
        cssClasses: "",
      };
      if (typeof previousItemMetadata === "object") {
        meta = previousItemMetadata(rowNumber);
      }

      if (meta && item && item.etat_service) {
        const state = item.etat_service;
        if (state === "Oui") {
          meta.cssClasses = (meta.cssClasses || "") + " " + newCssClass;
        }
      }

      return meta;
    };
  }
}
