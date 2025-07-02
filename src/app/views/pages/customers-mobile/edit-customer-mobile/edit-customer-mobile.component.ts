import { Component, ChangeDetectorRef, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Column, GridOption, AngularGridInstance, FieldType } from "angular-slickgrid";
import { ActivatedRoute, Router } from "@angular/router";
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { SubheaderService, LayoutConfigService } from "../../../../core/_base/layout";

import { LayoutUtilsService, TypesUtilsService, MessageType } from "../../../../core/_base/crud";

import { CodeService, CustomerMobile, CustomerMobileService, MobileSettingsService, AddresseMobile } from "../../../../core/erp";
import { config } from "process";
export type ControlPosition = keyof typeof google.maps.ControlPosition;

@Component({
  selector: "kt-edit-customer-mobile",
  templateUrl: "./edit-customer-mobile.component.html",
  styleUrls: ["./edit-customer-mobile.component.scss"],
})
export class EditCustomerMobileComponent implements OnInit {
  customerMobile: CustomerMobile;
  addresseMobile: AddresseMobile;
  customerMobileForm: FormGroup;
  addresseForm: FormGroup;
  hasFormErrors = false;
  hasaddresseFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  ad_country: any[] = [];
  ad_state: any[] = [];
  ad_city: any[] = [];
  isExist = false;

  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  gridObj: any;
  angularGrid: AngularGridInstance;

  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;

  columnDefinitions3: Column[] = [];
  gridOptions3: GridOption = {};
  gridObj3: any;
  angularGrid3: AngularGridInstance;

  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

  columnDefinitions5: Column[] = [];
  gridOptions5: GridOption = {};
  gridObj5: any;
  angularGrid5: AngularGridInstance;

  data: any = [];
  clusters: any = [];
  sub_clusters: any = [];
  categories: any = [];
  ad_geoarea: any[] = [];
  categories_types: any = [];
  sales_channels: any = [];
  formReady: boolean = false;
  oneCustomer: any = [];
  customerEdit: any[] = [];
  customer_code: any;
  payment_method : any = []
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
    private customerMobileService: CustomerMobileService,
    // private adresseMobileService: AddresseMobileService,
    private mobileSettingsService : MobileSettingsService,
    private codeService: CodeService,
    private cdr: ChangeDetectorRef,
    config: NgbDropdownConfig
  ) {
    config.autoClose = true;
    this.activatedRoute.params.subscribe((params) => {
      const id = params.id;
      this.customer_code = id;
      this.customerMobileService.getOne(id).subscribe((response: any) => {
        this.oneCustomer.push(response.data);
        this.customerEdit = this.oneCustomer.map((item) => {
          return item;
        });
      });
    });
    this.codeService.getBy({ code_fldname: "ad_country" }).subscribe((response: any) => (this.ad_country = response.data));
    this.codeService.getBy({ code_fldname: "ad_city" }).subscribe((response: any) => (this.ad_city = response.data));
    this.codeService.getBy({ code_fldname: "ad_state" }).subscribe((response: any) => (this.ad_state = response.data));
    this.codeService.getBy({ code_fldname: "geoarea_code" }).subscribe((response: any) => (this.ad_geoarea = response.data));
    this.codeService.getBy({ code_fldname: "ad_country" }).subscribe((response: any) => (this.ad_country = response.data));
    this.mobileSettingsService.getAllPaymentMethods().subscribe((response: any) => (this.payment_method = response.paymenetMethods))

  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    setTimeout(() => {
      this.init();
    }, 1000);
  }

  init() {
    this.getData();

    this.createCustomerForm();
    // this.createAddresseMobileForm()
    this.loadingSubject.next(false);
  }

  createCustomerForm() {
    //  this.loadingSubject.next(false)
    this.customerMobile = new CustomerMobile();
    this.formReady = true;
    this.customerMobileForm = this.formBuilder.group({
      customer_code: [this.customerEdit[0].customer_code, Validators.required],
      customer_name: [this.customerEdit[0].customer_name, Validators.required],
      customer_name2: [this.customerEdit[0].customer_name2],
      customer_arabic_name: [this.customerEdit[0].customer_arabic_name],
      customer_contact: [this.customerEdit[0].customer_contact, Validators.required],
      addresse_one: [this.customerEdit[0].addresse_one],
      addresse_two: [this.customerEdit[0].addresse_two],
      addresse_extended: [this.customerEdit[0].addresse_extended],
      city: [this.customerEdit[0].city],
      state: [this.customerEdit[0].state],
      postal_code: [this.customerEdit[0].postal_code],
      country: [this.customerEdit[0].country],
      geoarea_code: [this.customerEdit[0].geoarea_code],
      longitude: [this.customerEdit[0].longitude],
      latitude: [this.customerEdit[0].latitude],
      customer_phone_one: [this.customerEdit[0].customer_phone_one],
      customer_phone_two: [this.customerEdit[0].customer_phone_two],
      customer_email: [this.customerEdit[0].customer_email],
      customer_fax: [this.customerEdit[0].customer_fax],
      customer_web_adr: [this.customerEdit[0].customer_web_adr],
      customer_barcode: [this.customerEdit[0].customer_barcode],
      payment_method_code: [this.customerEdit[0].payment_method_code],
      cluster_code: [this.customerEdit[0].cluster_code],
      sub_cluster_code: [this.customerEdit[0].sub_cluster_code],
      category_code: [this.customerEdit[0].category_code],
      category_type_code: [this.customerEdit[0].category_type_code],
      sales_channel_code: [this.customerEdit[0].sales_channel_code],

      rc:  [this.customerEdit[0].rc],
      ai:  [this.customerEdit[0].ai],
      nif: [this.customerEdit[0].nif],
      nis: [this.customerEdit[0].nis],
    });
  }

  // createAddresseMobileForm(){
  //   // this.loadingSubject.next(false)
  //    this.addresseMobile = new AddresseMobile()
  //    this.addresseForm = this.formBuilder.group({
  //      //customer_id : [{value : this.addresseMobile.customer_id }],
  //  addresse_one : [{value : this.addresseMobile.addresse_one, disabled : !this.isExist}],
  //  addresse_two: [{value : this.addresseMobile.addresse_two, disabled: !this.isExist}],
  //  addresse_extended: [{value : this.addresseMobile.addresse_extended, disabled: !this.isExist}],
  //  city: [{value : this.addresseMobile.city, disabled: !this.isExist}],
  //  state: [{value : this.addresseMobile.state, disabled: !this.isExist}],
  //  postal_code: [{value : this.addresseMobile.postal_code, disabled: !this.isExist}],
  //  country: [{value : this.addresseMobile.country, disabled: !this.isExist}],
  //  geoarea_code: [{value : this.addresseMobile.geoarea_code, disabled: !this.isExist}],
  //  longitude: [{value : this.addresseMobile.longitude, disabled: !this.isExist}],
  //  latitude: [{value : this.addresseMobile.latitude, disabled: !this.isExist}],
  //    })
  //  }

  // onChangeCode() {
  //   const controls = this.customerMobileForm.controls;
  //   // const controls1 = this.addresseForm.controls
  //   this.customerMobileService.getByOne({ customer_code: controls.customer_code.value }).subscribe((res: any) => {
  //     //console.log("aa", res.data);

  //     if (res.data) {
  //       alert("Ce client exist déja");
  //       controls.customer_code.setValue(null);
  //       document.getElementById("code").focus();
  //       this.router.navigateByUrl(`/customers-mobile/edit-customer-mobile/${res.data.customer_code}`);
  //     } else {
  //       controls.customer_name.enable();
  //       controls.customer_name2.enable();
  //       controls.customer_contact.enable();
  //       controls.customer_arabic_name.enable();
  //       controls.customer_contact.enable();
  //       controls.customer_phone_one.enable();
  //       controls.customer_phone_two.enable();
  //       controls.customer_email.enable();
  //       controls.customer_fax.enable();
  //       controls.customer_web_adr.enable();
  //       controls.customer_barcode.enable();
  //       //addresse
  //       controls.addresse_one.enable();
  //       controls.addresse_two.enable();
  //       controls.addresse_extended.enable();
  //       controls.city.enable();
  //       controls.state.enable();
  //       controls.postal_code.enable();
  //       controls.country.enable();
  //       controls.geoarea_code.enable();
  //       controls.longitude.enable();
  //       controls.latitude.enable();
  //     }
  //   });
  // }

  // onChangeCustomer() {
  //   const controls = this.customerMobileForm.controls;

  //   this.customerMobileService.getByOne({ customer_code: controls.customer_code.value }).subscribe((res: any) => {
  //     //console.log("aa", res.data);

  //     if (res.data) {
  //       this.router.navigateByUrl(`/customers-mobile/edit-customer-mobile/${res.data.id}`);
  //       //console.log(res.data.id)
  //     }
  //   });
  // }
  goBack() {
    //this.loadingSubject.next(false)
    const url = `/customers-mobile`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  reset() {
    this.customerMobile = new CustomerMobile();
    // this.addresseMobile = new AddresseMobile()
    this.createCustomerForm();
    // this.createAddresseMobileForm()
    this.hasFormErrors = false;
  }

  /**
   * Save data
   *
   * @param withBack: boolean
   */
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.customerMobileForm.controls;
    // const controls_ = this.addresseForm.controls

    /** check form */
    if (this.customerMobileForm.invalid) {
      Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());

      this.hasFormErrors = true;
      //this.selectedTab = 0
      return;
    }

    let customer = this.prepareCustomerMobile();
    //console.log(this.selectedMenus)
    // let addresse = this.prepareAddresseCustomerMobile()
    this.updateCustomerMobile(customer);
  }

  // prepareAddresseCustomerMobile(){
  //   const _controls = this.addresseForm.controls
  //   const _addresseMobile = new AddresseMobile()
  //   const controls = this.customerMobileForm.controls

  //   _addresseMobile.addresse_one = _controls.addresse_one.value
  //   _addresseMobile.addresse_two = _controls.addresse_two.value
  //   _addresseMobile.addresse_extended = _controls.addresse_extended.value
  //   _addresseMobile.city = _controls.city.value
  //   _addresseMobile.state = _controls.state.value
  //   _addresseMobile.postal_code = _controls.postal_code.value
  //   _addresseMobile.country = _controls.country.value
  //   _addresseMobile.geoarea_code = _controls.geoarea_code.value

  //   return _addresseMobile
  // }

  // addAddresseCustomerMobile(_addresseMobile: AddresseMobile) {
  //   //  console.log(_addresseMobile)
  //   this.loadingSubject.next(true)
  //   this.adresseMobileService.addAddress(_addresseMobile).subscribe(
  //       (reponse) => console.log("response", Response),
  //       (error) => {
  //           this.layoutUtilsService.showActionNotification(
  //               "Erreur verifier les informations",
  //               MessageType.Create,
  //               10000,
  //               true,
  //               true
  //           )
  //           //this.loadingSubject.next(false)
  //       },
  //       () =>  {
  //         this.layoutUtilsService.showActionNotification(
  //             "Ajout avec succès",
  //             MessageType.Create,
  //             10000,
  //             true,
  //             true
  //         )
  //         this.loadingSubject.next(false)
  //         this.router.navigateByUrl("/customers-mobile/list-customer-mobile")
  //     }

  //   )
  //   }

  prepareCustomerMobile() {
    const controls = this.customerMobileForm.controls;
    const _customerMobile = new CustomerMobile();
    _customerMobile.customer_code = controls.customer_code.value;
    _customerMobile.customer_name = controls.customer_name.value;
    _customerMobile.customer_name2 = controls.customer_name2.value;
    _customerMobile.customer_arabic_name = controls.customer_arabic_name.value;
    _customerMobile.customer_contact = controls.customer_contact.value;
    _customerMobile.customer_email = controls.customer_email.value;
    _customerMobile.customer_phone_one = controls.customer_phone_one.value;
    _customerMobile.customer_phone_two = controls.customer_phone_two.value;
    _customerMobile.customer_fax = controls.customer_fax.value;
    _customerMobile.customer_web_adr = controls.customer_web_adr.value;
    _customerMobile.customer_barcode = controls.customer_barcode.value;
    _customerMobile.addresse_one = controls.addresse_one.value;
    _customerMobile.addresse_two = controls.addresse_two.value;
    _customerMobile.addresse_extended = controls.addresse_extended.value;
    _customerMobile.city = controls.city.value;
    _customerMobile.state = controls.state.value;
    _customerMobile.postal_code = controls.postal_code.value;
    _customerMobile.country = controls.country.value;
    _customerMobile.geoarea_code = controls.geoarea_code.value;

    _customerMobile.cluster_code = controls.cluster_code.value;
    _customerMobile.sub_cluster_code = controls.sub_cluster_code.value;
    _customerMobile.category_code = controls.category_code.value;
    _customerMobile.category_type_code = controls.category_type_code.value;
    _customerMobile.sales_channel_code = controls.sales_channel_code.value;
    _customerMobile.payment_method_code = controls.payment_method_code.value;
    _customerMobile.rc = controls.rc.value;
    _customerMobile.ai = controls.ai.value;
    _customerMobile.nis = controls.nis.value;
    _customerMobile.nif = controls.nif.value;
    return _customerMobile;
  }

  updateCustomerMobile(customer_mobile: CustomerMobile) {
    this.loadingSubject.next(true);
    this.customerMobileService.update(this.customer_code, customer_mobile).subscribe(
      (reponse) => console.log("response", Response),
      (error) => {
        alert("Erreur, vérifier les informations");
        this.loadingSubject.next(false);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        this.router.navigateByUrl("/customers-mobile/list-customer-mobile");
      }
    );
  }
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  // GRIDS

  getData() {
    this.customerMobileService.getCreateCustomerData().subscribe((response: any) => {
      this.data = response.data;
      this.clusters = this.data.clusters;
      this.categories = this.data.categories;
      this.sales_channels = this.data.sales_channels;
    });
  }

  open(content) {
    this.prepareGrid();
    this.modalService.open(content, { size: "lg" });
  }

  open2(content) {
    this.prepareGrid2();
    this.modalService.open(content, { size: "lg" });
  }

  open3(content) {
    this.prepareGrid3();
    this.modalService.open(content, { size: "lg" });
  }

  open4(content) {
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }

  open5(content) {
    this.prepareGrid5();
    this.modalService.open(content, { size: "lg" });
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
        id: "cluster_code",
        name: "Code cluster",
        field: "cluster_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "description",
        name: "Designation",
        field: "description",
        sortable: true,
        width: 120,
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
      checkboxSelector: {},
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };
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
        id: "sub_cluster_code",
        name: "Code sous-cluster",
        field: "sub_cluster_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "description",
        name: "Designation",
        field: "description",
        sortable: true,
        width: 120,
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
      enableCheckboxSelector: true,
      checkboxSelector: {},
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };
  }

  prepareGrid3() {
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
        id: "category_code",
        name: "Code cluster",
        field: "category_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "description",
        name: "Designation",
        field: "description",
        sortable: true,
        width: 120,
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
      checkboxSelector: {},
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };
  }

  prepareGrid4() {
    this.columnDefinitions4 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "category_type_code",
        name: "Code categorie type",
        field: "category_type_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "description",
        name: "Designation",
        field: "description",
        sortable: true,
        width: 120,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptions4 = {
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
  }

  prepareGrid5() {
    this.columnDefinitions5 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "sales_channel_code",
        name: "Code canal de vente",
        field: "sales_channel_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "description",
        name: "Designation",
        field: "description",
        sortable: true,
        width: 120,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "rank",
        name: "Rang",
        field: "rank",
        sortable: true,
        width: 120,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptions5 = {
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
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = (angularGrid && angularGrid.slickGrid) || {};
  }

  angularGridReady2(angularGrid: AngularGridInstance) {
    this.angularGrid2 = angularGrid;
    this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {};
  }

  angularGridReady3(angularGrid: AngularGridInstance) {
    this.angularGrid3 = angularGrid;
    this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {};
  }

  angularGridReady4(angularGrid: AngularGridInstance) {
    this.angularGrid4 = angularGrid;
    this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {};
  }

  angularGridReady5(angularGrid: AngularGridInstance) {
    this.angularGrid5 = angularGrid;
    this.gridObj5 = (angularGrid && angularGrid.slickGrid) || {};
  }

  handleSelectedRowsChanged(e, args) {
    // this.mvdataset = [];
    const controls = this.customerMobileForm.controls; // chof le champs hada wesh men form rah
    if (Array.isArray(args.rows) && this.gridObj) {
      args.rows.map((idx) => {
        const item = this.gridObj.getDataItem(idx);
        controls.cluster_code.setValue(item.cluster_code || "");
        const index = this.clusters.findIndex((cluster) => {
          return item.cluster_code == cluster.cluster_code;
        });
        this.sub_clusters = this.clusters[index].subClusters;
      });
    }
  }

  handleSelectedRowsChanged2(e, args) {
    const controls = this.customerMobileForm.controls; // chof le champs hada wesh men form rah
    if (Array.isArray(args.rows) && this.gridObj2) {
      args.rows.map((idx) => {
        const item = this.gridObj2.getDataItem(idx);
        controls.sub_cluster_code.setValue(item.sub_cluster_code || "");
      });
    }
  }

  handleSelectedRowsChanged3(e, args) {
    // this.mvdataset = [];
    const controls = this.customerMobileForm.controls; // chof le champs hada wesh men form rah
    if (Array.isArray(args.rows) && this.gridObj3) {
      args.rows.map((idx) => {
        const item = this.gridObj3.getDataItem(idx);
        controls.category_code.setValue(item.category_code || "");
        const index = this.categories.findIndex((category) => {
          return item.category_code == category.category_code;
        });
        this.categories_types = this.categories[index].categoryTypes;
      });
    }
  }

  handleSelectedRowsChanged4(e, args) {
    const controls = this.customerMobileForm.controls;
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        controls.category_type_code.setValue(item.category_type_code || "");
      });
    }
  }

  handleSelectedRowsChanged5(e, args) {
    const controls = this.customerMobileForm.controls;
    if (Array.isArray(args.rows) && this.gridObj5) {
      args.rows.map((idx) => {
        const item = this.gridObj5.getDataItem(idx);
        controls.sales_channel_code.setValue(item.sales_channel_code || "");
      });
    }
  }
}
