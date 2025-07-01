import { array } from '@amcharts/amcharts4/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import { AngularGridInstance, Column, FieldType, GridOption, OnEventArgs, GridService, Editors, thousandSeparatorFormatted, Formatters } from 'angular-slickgrid';

import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { UnloadRequestService, MobileService, RoleService, ItineraryService,LoadRequestService } from "../../../../core/erp"
import {   MobileSettingsService} from "../../../../core/erp"
import jsPDF from "jspdf";

@Component({
  selector: 'kt-validate-charge-demande',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './validate-decharge-demande.component.html',
  styleUrls: ['./validate-decharge-demande.component.scss']
})
export class ValidateDeChargeDemandeComponent implements OnInit {
  service: MobileService
  validationForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  
  role_code : any
  load_request_code : any
  unload_request_code : any

  roles: any[] = []
  loadRequests: any[] = []
  unloadRequests: any[] = []
  loadRequestData: any[] = []
  unloadRequestData: any[] = []
  displayData : any = false
  user;
  domain;
  total: number = 0;
  totalCartons: number = 0;
  constructor(
    config: NgbDropdownConfig,
        private profileFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private loadRequestService : LoadRequestService,
        private unloadRequestService : UnloadRequestService,
        private layoutUtilsService: LayoutUtilsService,
        private roleService: RoleService,
  ) { 
        config.autoClose = true   
  }
 

  ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.domain = JSON.parse(localStorage.getItem("domain"));
        this.prepareRoles()
        this.createForm()
        
  }

  onSubmit() {

    this.unloadRequestService.updateUnloadRequestStatus10(this.unload_request_code, this.unloadRequestData).subscribe(

      (response: any) => {
        this.printpdf();
        console.log(response)
        this.unloadRequestData = []
        this.unload_request_code = ""
        this.role_code = ""
        this.createForm()
        this.displayData = false
      },
      (error) => {
        // this.loadRequestData = []
        console.log(error)
      },
      () => {
        this.layoutUtilsService.showActionNotification(
            "unload Request updated",
            MessageType.Create,
            10000,
            true,
            true
        )
        this.loadingSubject.next(false)
        this.router.navigateByUrl("/supervision/validate-decharge-demande")
    }
    )

  }

  goBack() {
    this.loadingSubject.next(false)
    const url = `/service`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

// GET ROLES OF THE SUPERVISOR
prepareRoles() {
  this.roleService.getAllRoles().subscribe(
    (response: any) => {
      this.roles = response.data;
      console.log(this.roles);
    },
    (error) => {
      this.roles = [];
    },
    () => {}
  );
}

// GET LOAD REQUESTS STATUS 0 OF THE SELECTED ROLE
prepareunLoadRequets(role_code){
  this.unloadRequestService.getUnloadRequests(role_code).subscribe(
      
      (response: any) => {
        this.unloadRequests = response.data
       
      },
      (error) => {
          this.unloadRequests = []
      },
      () => {}
  )
}

// GET DATA OF THE SELECTED LOADREQUEST
prepareLoadRequestData(unload_request_data){
  this.unloadRequestService.getUnloadRequestData(unload_request_data).subscribe(

      (response: any) => {
        this.unloadRequestData = response.unloadRequestData
        this.displayData = true
      },
      (error) => {
        this.unloadRequestData = []
      },
      () => {}
  )
}



onSelectRole(role_code){
  this.prepareunLoadRequets(role_code)
}

onSelectLoadRequest(unload_request_code){
  this.prepareLoadRequestData(unload_request_code)
  this.unload_request_code = unload_request_code
}

onInputChanged(p_code, lot,value){
  console.log('value:' + value)
  const indexProduct = this.unloadRequestData.findIndex(detail=>{
    return detail.product_code  === p_code && detail.lot === lot
  })
  this.unloadRequestData[indexProduct].qt_effected = value
  console.log(this.unloadRequestData[indexProduct])
}

createForm() {
  this.loadingSubject.next(false)
  this.validationForm = this.profileFB.group({
    role_code :[this.role_code],
    unload_request_code:[this.unload_request_code]
  })
}

printpdf() {
  console.log(this.unloadRequestData);
  // const controls = this.totForm.controls
  const controlss = this.validationForm.controls;
  console.log("pdf");
  var doc = new jsPDF();
  const date = new Date();
  let initialY = 65;
  let valueToAddToX = 5;
  
  this.total = 0,
  this.totalCartons= 0,
  console.log(this.unloadRequestData)
  this.unloadRequestData.map((element) => {
    if(element.product_code != null) {
    this.total = Number(this.total) + Number(element.pt_price) * Number(element.qt_effected);
    this.totalCartons = this.totalCartons + Number(element.qt_effected);
    }
  });

  var img = new Image();
  img.src = "./assets/media/logos/companylogo.png";

  doc.addImage(img, "png", 150, 5, 50, 30);
  doc.setFontSize(9);
  if (this.domain.dom_name != null) {
    doc.text(this.domain.dom_name, 10, 10);
  }
  if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
  if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
  if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
  doc.setFontSize(14);
  doc.line(10, 35, 200, 35);
  doc.setFontSize(12);
  doc.barcode(this.unload_request_code, {
    fontSize: 70,
    textColor: "#000000",
    x: 100,
    y: 60,
    textOptions: { align: "center" }, // optional text options
  });
  doc.setFont("Times-Roman");
  doc.setFontSize(12);
  doc.text("Demande de Déchargement : " + this.unload_request_code, 70, initialY + 5);
  doc.setFontSize(10);
  doc.text("Date     : " + + String(date.getFullYear())+"/" + String(date.getMonth() + 1) + "/" + String(date.getDate()) + " " +  date.toLocaleTimeString(), 20, initialY + 10);
  doc.text("Role    : " + this.role_code, 20, initialY + 15);
  // doc.text("Date    : " + this.load_request_header.date_creation, 20, initialY + 15);
 // doc.text("Vendeur : " + this.user_mobile.user_mobile_code + " - " + this.user_mobile.username, 20, initialY + 20);
  doc.setFontSize(9);
  doc.setFontSize(9);
  //  initialY+20
  doc.line(10, initialY + 25, 195, initialY + 25); // 85
  doc.line(10, initialY + 30, 195, initialY + 30); // 90
  doc.line(10, initialY + 25, 10, initialY + 30); // 90
  doc.text("N", 12.5, initialY + 28.5); // 88.5
  doc.line(20, initialY + 25, 20, initialY + 30); // 90
  doc.text("Code Article", 25, initialY + 28.5); // 88.5
  doc.line(45, initialY + 25, 45, initialY + 30); // 90
  doc.text("Désignation", 67.5, initialY + 28.5); // 88.5
  // doc.line(100, initialY + 25, 100, initialY + 30); // 90
  // doc.text("Prix", 107, initialY + 28.5); // 88.5
  // doc.line(120, initialY + 25, 120, initialY + 30); // 90
  // doc.text("QTE Demandée", 123, initialY + 28.5); // 88.5
  doc.line(145, initialY + 25, 145, initialY + 30); // 90
  doc.text("Lot", 155, initialY + 28.5); // 88.5
  doc.line(170, initialY + 25, 170, initialY + 30); // 90
  doc.text("QTE Déchargée", 173, initialY + 28.5); // 88.5
  doc.line(195, initialY + 25, 195, initialY + 30); // 90
  var i = 95 + valueToAddToX;
  doc.setFontSize(10);
  for (let j = 0; j < this.unloadRequestData.length; j++) {
    
   if(this.unloadRequestData[j].qt_effected != 0) { 
    if (j % 38 == 0 && j != 0) {
      doc.addPage();
      img.src = "./assets/media/logos/companylogo.png";
      doc.addImage(img, "png", 150, 5, 50, 30);
      doc.setFontSize(9);
      if (this.domain.dom_name != null) {
        doc.text(this.domain.dom_name, 10, 10);
      }
      if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
      if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
      if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
      doc.setFontSize(14);
      doc.line(10, 35, 200, 35);
      doc.setFontSize(12);
      doc.barcode(this.unload_request_code, {
        fontSize: 70,
        textColor: "#000000",
        x: 100,
        y: 60,
        textOptions: { align: "center" }, // optional text options
      });
      doc.setFont("Times-Roman");
      doc.setFontSize(12);
      doc.text("Demande de Déchargement : " + this.unload_request_code, 70, initialY + 5);
      doc.setFontSize(10);
      doc.text("Date     : " + + String(date.getFullYear())+"/" + String(date.getMonth() + 1) + "/" + String(date.getDate()) + " " +  date.toLocaleTimeString(), 20, initialY + 10);
 
      doc.text("Role    : " + this.role_code, 20, initialY + 15);
      // doc.text("Date    : " + this.load_request_header.date_creation, 20, initialY + 15);
     // doc.text("Vendeur : " + this.user_mobile.user_mobile_code + " - " + this.user_mobile.username, 20, initialY + 20);
      doc.setFontSize(9);
      doc.setFontSize(9);
      //  initialY+20
      doc.line(10, initialY + 25, 195, initialY + 25); // 85
      doc.line(10, initialY + 30, 195, initialY + 30); // 90
      doc.line(10, initialY + 25, 10, initialY + 30); // 90
      doc.text("N", 12.5, initialY + 28.5); // 88.5
      doc.line(20, initialY + 25, 20, initialY + 30); // 90
      doc.text("Code Article", 25, initialY + 28.5); // 88.5
      doc.line(45, initialY + 25, 45, initialY + 30); // 90
      doc.text("Désignation", 67.5, initialY + 28.5); // 88.5
      // doc.line(100, initialY + 25, 100, initialY + 30); // 90
      // doc.text("Prix", 107, initialY + 28.5); // 88.5
      // doc.line(120, initialY + 25, 120, initialY + 30); // 90
      // doc.text("QTE Demandée", 123, initialY + 28.5); // 88.5
      doc.line(145, initialY + 25, 145, initialY + 30); // 90
      doc.text("Lot", 155, initialY + 28.5); // 88.5
      doc.line(170, initialY + 25, 170, initialY + 30); // 90
      doc.text("QTE Déchargée", 173, initialY + 28.5); // 88.5
      doc.line(195, initialY + 25, 195, initialY + 30); // 90
      var i = 95 + valueToAddToX;
      doc.setFontSize(14);
    }
    if (this.unloadRequestData[j].product_desc.length > 25) {
      doc.setFontSize(10);
      let line = this.unloadRequestData[j];
      let desc1 = line.product_desc.substring(0, 20);
      let ind = desc1.lastIndexOf(" ");
      desc1 = line.product_desc.substring(0, ind);
      let desc2 = line.product_desc.substring(ind + 1);
      console.log(desc1,desc2)
      doc.line(10, i - 5, 10, i);
      doc.text(String(this.unloadRequestData[j].line), 12.5, i - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(line.product_code, 25, i - 1);
      doc.line(45, i - 5, 45, i);
      doc.setFontSize(14);
      doc.text(desc1, 47, i - 1);
      doc.setFontSize(10);
    
      // doc.line(100, i - 5, 100, i);
      // doc.text(String(this.unloadRequestData[j].item.loadRequestLines[0].pt_price), 118, i - 1, { align: "right" });
      // doc.line(120, i - 5, 120, i);
      // doc.text(String(this.unloadRequestData[j].item.loadRequestLines[0].qt_request), 143, i - 1, { align: "right" });
      doc.line(145, i - 5, 145, i);
      doc.text(String(this.unloadRequestData[j].lot), 168, i - 1, { align: "right" });
      doc.line(170, i - 5, 170, i);
      doc.text(String(this.unloadRequestData[j].qty_effected), 1193, i - 1, { align: "right" });
      doc.line(195, i - 5, 195, i);
      i = i + 5;
      doc.text(desc2, 47, i - 1);
      doc.line(10, i - 5, 10, i);
      doc.line(20, i - 5, 20, i);
      doc.line(45, i - 5, 45, i);
      // doc.line(100, i - 5, 100, i);
      // doc.line(120, i - 5, 120, i);
      doc.line(145, i - 5, 145, i);
      doc.line(170, i - 5, 170, i);
      doc.line(195, i - 5, 195, i);
      i = i + 5;
    } else {
      doc.setFontSize(10);
      let line = this.unloadRequestData[j];
      doc.line(10, i - 5, 10, i);
      doc.text(String(this.unloadRequestData[j].line), 12.5, i - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.unloadRequestData[j].product_code, 25, i - 1);
      doc.line(45, i - 5, 45, i);
      doc.setFontSize(14);
      doc.text(this.unloadRequestData[j].product_desc, 47, i - 1);
      doc.setFontSize(10);
      // doc.line(100, i - 5, 100, i);
      // doc.text(String(this.unloadRequestData[j].item.loadRequestLines[0].pt_price), 118, i - 1, { align: "right" });
      // doc.line(120, i - 5, 120, i);
      // doc.text(String(this.unloadRequestData[j].item.loadRequestLines[0].qt_request), 143, i - 1, { align: "right" });
      doc.line(145, i - 5, 145, i);
      doc.text(String(this.unloadRequestData[j].lot), 168, i - 1, { align: "right" });
      doc.line(170, i - 5, 170, i);
      doc.text(String(this.unloadRequestData[j].qt_effected), 193, i - 1, { align: "right" });
      doc.line(195, i - 5, 195, i);
      i = i + 5;
    }
    doc.line(10, i - 5, 195, i - 5);

  }
  }/*for*/
  doc.line(10, i - 5, 195, i - 5);
  doc.setFontSize(14);
  doc.text("Total cartons    : " + this.totalCartons, 130, i + 5);
  doc.text("Valeur : " + Number(this.total * 1.2138).toFixed(2) + " DZD", 130, i + 10);
  doc.setFontSize(10);
  var blob = doc.output("blob");
  window.open(URL.createObjectURL(blob));
}
}
