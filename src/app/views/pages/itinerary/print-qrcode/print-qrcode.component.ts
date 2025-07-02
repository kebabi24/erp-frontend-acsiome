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
import { jsPDF } from "jspdf";
import "jspdf-barcode";
// import QRCode from 'qrcodejs2';
import { config } from "process";
@Component({
  selector: 'kt-print-qrcode',
  templateUrl: './print-qrcode.component.html',
  styleUrls: ['./print-qrcode.component.scss']
})
export class PrintQrcodeComponent implements OnInit {

  @ViewChild("map", { static: true }) map: AgmMap;
  
  itinerary: Itinerary;
  itineraryForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  isExist = false;
  customers: any[] = [];
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
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private typesUtilsService: TypesUtilsService, private formBuilder: FormBuilder, public dialog: MatDialog, private subheaderService: SubheaderService, private layoutUtilsService: LayoutUtilsService, private layoutConfigService: LayoutConfigService, private modalService: NgbModal, private itineraryService: ItineraryService, private customerMobileService: CustomerMobileService, private codeMobileService: CodeMobileService, private roleService: RoleService, config: NgbDropdownConfig) {
    config.autoClose = true;
    this.codeMobileService.getBy({ code_name: "week_days" }).subscribe((response: any) => (this.week_days = response.data));
    this.codeMobileService.getBy({ code_name: "itinerary_type" }).subscribe((response: any) => (this.itinerary_type = response.data));
    this.prepareGrid();
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.createForm();
  }

  createForm() {
    this.loadingSubject.next(false);
    this.itinerary = new Itinerary();
    this.itineraryForm = this.formBuilder.group({
      itinerary_code: [this.itinerary.itinerary_code, Validators.required],
      itinerary_name: [this.itinerary.itinerary_name],
    });
  }
  onChangeCode() {
    const controls = this.itineraryForm.controls;

    this.itineraryService.getItineraryCustomer({itinerary_code:controls.itinerary_code.value}).subscribe((res: any) => {
      console.log("aa", res.data);

      if (res.data.itn) {
        controls.itinerary_name.setValue(res.data.itn.itinerary_name)
     this.dataset = res.data.result
    
        //console.log(res.data.id)
      } else {
        alert('Tournée n existe pas')
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
        id: "customer_code",
        name: "Code Client",
        field: "customer_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "customer_name",
        name: "Nom Complet",
        field: "customer_name",
        sortable: true,
        width: 100,
        filterable: true,
        type: FieldType.string,
      },

      {
        id: "bare_code",
        name: "Code Bare",
        field: "bare_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },

      // {
      //   id: "cluster_code",
      //   name: "Code cluster",
      //   field: "cluster_code",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.string,
      // },
      // {
      //   id: "sub_cluster_code",
      //   name: "Code sous-cluster",
      //   field: "sub_cluster_code",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.string,
      // },

      // {
      //   id: "category_code",
      //   name: "Code catégorie",
      //   field: "category_code",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.string,
      // },

      // {
      //   id: "category_type_code",
      //   name: "Type catégorie",
      //   field: "category_type_code",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.string,
      // },

      // {
      //   id: "sales_channel_code",
      //   name: "Code canal de vente",
      //   field: "sales_channel_code",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.string,
      // },
    ];

    this.gridOptions = {
      enableAutoResize: true,
      enableCellNavigation: true,
      enableFiltering: true,
      enableCheckboxSelector: true,
      enableRowSelection: true,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false,
      },
      frozenColumn: 0,
      frozenBottom: true,
      //multiSelect: false,
    };

    // fill the dataset with your data
    
  }

  reset() {
    this.itinerary = new Itinerary();
    this.createForm();
    this.dataset= []
    this.hasFormErrors = false;
  }
  
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
    // let itn = this.prepareItinerary();
    // this.addItinerary(itn, this.customers);
    this.printpdf()
  }

  
  goBack() {
    this.loadingSubject.next(false);
    const url = `/itinerary/print-qrcode`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  handleSelectedRowsChanged(e, args) {
    if (Array.isArray(args.rows) && this.gridObj) {
      // console.log("log")
      this.customers = args.rows.map((idx: number) => {
        const item = this.gridObj.getDataItem(idx);
// console.log(item)
        return item;
      });
    }
    console.log(this.customers);
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = (angularGrid && angularGrid.slickGrid) || {};
  }

  // mapOptions: any = {
  //   zoom: 10,
  //   center: { lat: this.lat, lng: this.lng },
  // };
  // onMapReady(map: any) {
  //   const bounds = new google.maps.LatLngBounds();
  //   this.customers.forEach((marker: any) => {
  //     console.log(marker);
  //     bounds.extend(new google.maps.LatLng(marker.latitude, marker.longitude));
  //   });

  //   // Step 4: Set map options
  //   this.map.map.fitBounds(bounds);
  //   this.mapOptions = {
  //     zoom: map.fitBounds(bounds),
  //     center: bounds.getCenter(),
  //   };
  // }

  // new() {
  //   setTimeout(() => {
  //     this.onMapReady(map);
  //   }, 1000);
  // }



  printpdf() {
    console.log("pdf")
    var doc = new jsPDF('l', 'mm', [100, 70]);
    var img = new Image();
    img.src = "./assets/media/logos/companylogo.png";
    doc.addImage(img, 'png', 15, 1, 70, 30)
    
      doc.setFontSize(9);
//     var qrcode = new QRCode("qr_code", {
//       text: "https://cravecookie.com/",
//       width: 128,
//       height: 128,
//       colorDark : "#000000",
//       colorLight : "#ffffff",
//       correctLevel : QRCode.CorrectLevel.H
//   });
//     var pdf = new jsPDF({
//       orientation: "landscape",
//       unit: "mm",
//       format: [84, 40]
//   });

//   pdf.setFontSize(15);
//   pdf.text('CraveCookie', 43, 20);

//   pdf.setFontSize(10);
//   pdf.text('Scan For Menu', 43, 25);
//   const qrCodeElement = document.getElementById('qr_code');
//         const qrCodeImage = qrCodeElement.firstChild as HTMLImageElement;
//         const qrCodeBase64 = qrCodeImage.src;

//   pdf.addImage(qrCodeBase64, 'png', 0, 0, 40, 40);
//   pdf.save('generated.pdf');
// } 
    let bool = false
    for (let j = 0; j < this.customers.length  ; j++) {
      if (j!= 0) { bool = true}
      if (bool) {
      doc.addPage();
      doc.addImage(img, 'png', 15, 1, 70, 30)
      }
      doc.barcode(this.customers[j].bare_code, {
        fontSize: 95,
        textColor: "#000000",
        x: 50,
        y: 60,
        textOptions: { align: "center" }, // optional text options
      });
      doc.setFont("Times-Roman");
        doc.setFontSize(12);
        doc.text( this.customers[j].bare_code, 47, 65);
        // const qrCodeElement = document.getElementById('qr_code');
        // let qrtext = decodeURIComponent(this.customers[j].bare_code);
        // var qrcode =  new QRCode('qr_code', {
        //   text: this.customers[j].bare_code ,
        //   width: 60,
        //   height: 60,
        //   colorDark: '#000000',
        //   colorLight: '#ffffff',
        //   correctLevel : QRCode.CorrectLevel.H
        //  });
  
     
        // const qrCodeImage = qrCodeElement.firstChild as HTMLImageElement;
        // const qrCodeBase64 = qrCodeImage.src;
        //  let qrCodeBase64 = $('#qr_code img').attr('src');
         
      //  doc.addImage(qrCodeBase64, 'png', 10, 10, 50, 50);
    
     }
    
    
      // window.open(doc.output('bloburl'), '_blank');
      //window.open(doc.output('blobUrl'));  // will open a new tab
      var blob = doc.output("blob");
      window.open(URL.createObjectURL(blob));
  
    }
  
  
}
