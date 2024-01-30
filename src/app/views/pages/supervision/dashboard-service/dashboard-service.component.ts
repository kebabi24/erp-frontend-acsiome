import { Component, OnInit, ViewChild } from "@angular/core";

import { NgbDropdownConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Column, GridOption, AngularGridInstance, FieldType } from "angular-slickgrid";
import { ActivatedRoute, Router } from "@angular/router";
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Observable, BehaviorSubject, Subscription, of, Observer } from "rxjs";
import { SubheaderService, LayoutConfigService } from "../../../../core/_base/layout";
import { AgmMap } from "@agm/core";
import { LayoutUtilsService, TypesUtilsService, MessageType } from "../../../../core/_base/crud";

import { Itinerary, ItineraryService, CustomerMobileService, CodeMobileService, RoleService, RoleItinerary } from "../../../../core/erp";

import { config } from "process";

@Component({
  selector: "kt-dashboard-service",
  templateUrl: "./dashboard-service.component.html",
  styleUrls: ["./dashboard-service.component.scss"],
})
export class DashboardServiceComponent implements OnInit {
  @ViewChild("map", { static: true }) map: AgmMap;
  lat = 36.73023411061217;
  lng = 3.17803021719537;
  zoom: number = 16;
  itinerary: Itinerary;
  itineraryForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  isExist = false;
  customers: number[] = [];
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  gridObj: any;
  angularGrid: AngularGridInstance;
  //selectedRows: any[] = []
  dataset: any[] = [];
  itinerary_type: any[] = [];
  week_days: any[] = [];
  // roles : any[] = []
  newMarker: boolean = false;
  markerLat: any = 0;
  markerLng: any = 0;
  customersSelected: any[] = [];
  serviceCode = [{ code_service: "02-000033" }, { code_service: "02-000033" }];
  mockCustomers: any[] = [];
  mockCustomers1 = [
    { id: 1, nom: "client 1", chiffre: 12000, nbr: 12, latitude: "36.73023411061217", longitude: "3.17803021719537" },
    { id: 2, nom: "client 2", chiffre: 90000, nbr: 3, latitude: "36.733667390282335", longitude: "3.1832876324023" },
    { id: 3, nom: "client 3", chiffre: 139000, nbr: 4, latitude: "36.73280834988108", longitude: "3.176377016351361" },
    { id: 4, nom: "client 4", chiffre: 122000, nbr: 11, latitude: "36.73202612582264", longitude: "3.173788803487979" },
    { id: 5, nom: "client 5", chiffre: 142000, nbr: 10, latitude: "36.72936510746935", longitude: "3.172359621946108" },
  ];
  mockCustomers2 = [
    { id: 1, nom: "client 6", chiffre: 12000, nbr: 12, latitude: "36.73023411061217", longitude: "3.17803021719537" },
    { id: 2, nom: "client 7", chiffre: 90000, nbr: 3, latitude: "36.733667390282335", longitude: "3.1832876324023" },
    { id: 3, nom: "client 8", chiffre: 139000, nbr: 4, latitude: "36.73280834988108", longitude: "3.176377016351361" },
    { id: 4, nom: "client 9", chiffre: 122000, nbr: 11, latitude: "36.73202612582264", longitude: "3.173788803487979" },
    { id: 5, nom: "client 10", chiffre: 142000, nbr: 10, latitude: "36.72936510746935", longitude: "3.172359621946108" },
  ];
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private typesUtilsService: TypesUtilsService, private formBuilder: FormBuilder, public dialog: MatDialog, private subheaderService: SubheaderService, private layoutUtilsService: LayoutUtilsService, private layoutConfigService: LayoutConfigService, private modalService: NgbModal, private itineraryService: ItineraryService, private customerMobileService: CustomerMobileService, private codeMobileService: CodeMobileService, private roleService: RoleService, config: NgbDropdownConfig) {
    config.autoClose = true;
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.createForm();
  }

  createForm() {
    this.loadingSubject.next(false);
    this.itinerary = new Itinerary();
    const date = new Date();
    this.itineraryForm = this.formBuilder.group({
      code_service: [this.itinerary.itinerary_type, Validators.required],
      calc_date: [
        {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        },
      ],
      // roles : [{value : this.itinerary.roles}, Validators.required]
    });
  }
  change() {
    const controls = this.itineraryForm.controls;
    // const date = new Date(`${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`)
    const date = controls.calc_date.value ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}` : null;
    console.log(date);
    this.itineraryService.getAllServices({ date: date }).subscribe((response: any) => (this.itinerary = response.data));
  }
  onChangeCode() {
    // const controls = this.itineraryForm.controls;

    // this.itineraryService.getOne(controls.itinerary_code.value).subscribe((res: any) => {
    //   console.log("aa", res.data);

    //   if (res.data) {
    //     console.log(res.data.itinerary_name);
    //     this.router.navigateByUrl(`/itinerary/edit-itinerary/${res.data.itinerary_code}`);
    //     //console.log(res.data.id)
    //   }
    // });
    const controls = this.itineraryForm.controls;
    if (controls.code_service.value == 1) {
      this.mockCustomers = this.mockCustomers1;
    } else {
      this.mockCustomers = this.mockCustomers2;
    }
  }

  reset() {
    this.itinerary = new Itinerary();
    this.createForm();
    this.hasFormErrors = false;
  }
  time = new Observable<string>((observer: Observer<string>) => {
    setInterval(() => {
      observer.next("");
    }, 1000);
  });
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.itineraryForm.controls;
    /** check form */
    // if (this.itineraryForm.invalid) {
    //   Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());

    //   this.hasFormErrors = true;
    //   return;
    // }

    // tslint:disable-next-line:prefer-const
    let itn = this.prepareItinerary();
    this.addItinerary(itn, this.customers);
  }

  prepareItinerary(): Itinerary {
    const controls = this.itineraryForm.controls;
    const _itinerary = new Itinerary();
    _itinerary.itinerary_code = controls.itinerary_code.value;
    _itinerary.itinerary_name = controls.itinerary_name.value;

    return _itinerary;
  }

  addItinerary(_itinerary: Itinerary, _customers: any) {
    this.loadingSubject.next(true);
    this.itineraryService.addItinerary({ itinerary: _itinerary, customers: _customers }).subscribe(
      (reponse) => console.log("response", Response),
      (error) => {
        this.layoutUtilsService.showActionNotification("Erreur verifier les informations", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        this.router.navigateByUrl("/itinerary/list-itinerary");
      }
    );
  }

  goBack() {
    this.loadingSubject.next(false);
    const url = `/itinerary/list-itinerary`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
}
