import { array } from '@amcharts/amcharts4/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import { AngularGridInstance, Column, FieldType, GridOption, OnEventArgs, GridService, Editors, thousandSeparatorFormatted, Formatters } from 'angular-slickgrid';

import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { MobileServiceService, MobileService, RoleService, ItineraryService,LoadRequestService, UsersMobileService } from "../../../../core/erp"
import {   MobileSettingsService} from "../../../../core/erp"
import jsPDF from 'jspdf';
import { NumberToLetters } from 'src/app/core/erp/helpers/numberToString';

import "jspdf-barcode";
@Component({
  selector: 'kt-create-load-request',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './create-load-request.component.html',
  styleUrls: ['./create-load-request.component.scss']
})
export class CreateLoadRequestComponent implements OnInit {
  service: MobileService
  validationForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  
  role_code : any
  load_request_code : any
  roles: any[] = []
  loadRequests: any[] = []
  loadRequestData: any[] = []
  printLines:any[] = []

  saved_data : any
  user_mobile : any

  constructor(
    config: NgbDropdownConfig,
        private profileFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private loadRequestService : LoadRequestService,
        private layoutUtilsService: LayoutUtilsService,
        private userMobileService : UsersMobileService,
  ) { 
        config.autoClose = true   
  }
 

  ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.prepareRoles()
        this.getLoadRequestCreationData()
        this.createForm()
        
  }

  onSubmit() {
    let lines = [] , i = 1;

    let loadRequest = {
      role_code : this.role_code, 
      date_creation : new Date(),
      status : 10 
    }
    
    for(const page of this.loadRequestData ){
      for(const product of page.products){
        if(product.qt_request > 0 && product.qt_request  > 0 ){
          lines.push({
            date_creation : new Date(),
            line : i , 
            product_code : product.product_code , 
            qt_request : product.qt_request,
            qt_validated :product.qt_validated,
            qt_effected : 0,
            pt_price : product.pt_price
          })
          this.printLines.push({
            line : i , 
            product_code : product.product_code ,
            product_name: product.pt_desc1, 
            qt_request : product.qt_request,
            qt_validated :product.qt_validated,
            qt_effected : 0,
            pt_price : product.pt_price
          })
          i++;
        }

      }
    }
    

     this.loadRequestService.createLoadRequestAndLines(loadRequest, lines).subscribe(

       (response: any) => {
         const controls = this.validationForm.controls;
         this.saved_data = response.data
         if(controls.print.value == true){
           this.printpdf()
         }
         this.resetData()
         this.createForm()
         this.role_code = ""
       },
       (error) => {
         console.log(error)
       },
       () => {
         this.layoutUtilsService.showActionNotification(
             "Load Request created",
             MessageType.Create,
             10000,
             true,
             true
         )
         this.loadingSubject.next(false)
         this.router.navigateByUrl("/supervision/create-load-request")
     }
     )

  }

  goBack() {
    this.loadingSubject.next(false)
    const url = `/service`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

resetData(){
  for(const page of this.loadRequestData ){
    for(const product of page.products){
       product.qt_request= 0 
      product.qt_validated = 0
    }
  }
}

// GET ROLES OF THE SUPERVISOR
prepareRoles(){
  this.loadRequestService.getRoles('administrateur').subscribe(
      
      (response: any) => {
        this.roles = response.data
        console.log(this.roles)
      },
      (error) => {
        this.roles = []
      },
      () => {}
  )
}



// GET DATA OF THE SELECTED LOADREQUEST
getLoadRequestCreationData(){
  this.loadRequestService.getLoadRequestCreationData().subscribe(

      (response: any) => {
        this.loadRequestData = response.loadRequestData
        console.log(response.loadRequestData)
      },
      (error) => {
        this.loadRequestData = []
      },
      () => {}
  )
}



onSelectRole(role_code){
  this.role_code = role_code
  let index = this.roles.findIndex((role)=>{return role.role_code === role_code})
  
  this.userMobileService.getByOne({user_mobile_code :this.roles[index].user_mobile_code }).subscribe(

    (response: any) => {
      this.user_mobile = response.data
    },)
}



onInputChanged(pageCode,prodCode,value){
  console.log('value:' + value)
  const indexPage = this.loadRequestData.findIndex(loadRequest=>{
    return loadRequest.page_code  === pageCode
  })
  console.log('pageCodeIndex:' + indexPage)
  const indexProduct = this.loadRequestData[indexPage].products.findIndex(product=>{
    return product.product_code === prodCode
  })
  console.log('prodCodeIndex:' + indexProduct)
  this.loadRequestData[indexPage].products[indexProduct].qt_validated = +value
  this.loadRequestData[indexPage].products[indexProduct].qt_request = this.loadRequestData[indexPage].products[indexProduct].qt_validated
  console.log(this.loadRequestData[indexPage].products[indexProduct])
  
 
}

createForm() {
  this.loadingSubject.next(false)
  this.validationForm = this.profileFB.group({
    role_code :[this.role_code],
    load_request_code:[this.load_request_code],
    print: [true],
  })
}


printpdf() {
  
  var doc = new jsPDF();
  

  var img = new Image()
  img.src = "./assets/media/logos/companylogo.png";
  doc.addImage(img, 'png', 150, 5, 50, 30)
  doc.setFontSize(9);

  // if (this.domain.dom_name != null) {
  //   doc.text(this.domain.dom_name, 10, 10);
  // }
  // if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
  // if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
  // if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
  doc.setFontSize(14);

  doc.line(10, 35, 200, 35);
  doc.setFontSize(12);


       doc.barcode(this.saved_data.load_request_code, {
        fontSize: 30,
        textColor: "#000000",
        x: 100,
        y: 50,
        textOptions: { align: "center" } // optional text options
      })

      doc.setFont("Times-Roman");
       
       

       doc.setFontSize(12);
       doc.text("Demande de chargement : " + this.saved_data.load_request_code, 70, 60);
       doc.setFontSize(8);

       doc.setFontSize(8);
       doc.text("Role    : " + this.saved_data.role_code, 20, 70);
       doc.text("Date    : " + this.saved_data.date_creation.split("T")[0], 20, 75);
       doc.text("Vendeur : " + this.user_mobile.user_mobile_code +' - '+this.user_mobile.username, 20, 80);
  
  

       doc.line(10, 85, 195, 85);
       doc.line(10, 90, 195, 90);
       doc.line(10, 85, 10, 90);
       doc.text("N", 12.5, 88.5);
       doc.line(20, 85, 20, 90);
       doc.text("Code Article", 25, 88.5);
       doc.line(45, 85, 45, 90);
       doc.text("Désignation", 67.5, 88.5);
       doc.line(100, 85, 100, 90);
       doc.text("Prix", 107, 88.5);
       doc.line(120, 85, 120, 90);
       doc.text("QTE Demandée", 123, 88.5);
       doc.line(145, 85, 145, 90);
       doc.text("QTE Validée", 148, 88.5 );
       doc.line(170, 85, 170, 90);
       doc.text("QTE Chargée", 173, 88.5 );
       doc.line(195, 85, 195, 90);
       var i = 95;
       doc.setFontSize(6);
       let total = 0

   for (let j = 0; j < this.printLines.length  ; j++) {
    
    
     if ((j % 30 == 0) && (j != 0) ) {
       doc.addPage();
       img.src = "./assets/media/logos/companylogo.png";
       doc.addImage(img, 'png', 150, 5, 50, 30)
       doc.setFontSize(9);
      //  if (this.domain.dom_name != null) {
      //    doc.text(this.domain.dom_name, 10, 10);
      //  }
      //  if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
      //  if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
      //  if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
       doc.setFontSize(14);
       doc.line(10, 35, 200, 35);

       
       
       doc.setFontSize(12);
       doc.text(this.saved_data.load_request_code, 70, 40);
       doc.setFontSize(8);

      
       doc.setFontSize(12);
       doc.text("Demande de chargement : " + this.saved_data.load_request_code, 70, 60);
       doc.setFontSize(8);

       doc.setFontSize(8);
       doc.text("Role    : " + this.saved_data.role_code, 20, 70);
       doc.text("Date    : " + this.saved_data.date_creation.split("T")[0], 20, 75);
       doc.text("Vendeur : " + this.user_mobile.user_mobile_code +' - '+this.user_mobile.username, 20, 80);

       doc.line(10, 85, 195, 85);
       doc.line(10, 90, 195, 90);
       doc.line(10, 85, 10, 90);
       doc.text("N", 12.5, 88.5);
       doc.line(20, 85, 20, 90);
       doc.text("Code Article", 25, 88.5);
       doc.line(45, 85, 45, 90);
       doc.text("Désignation", 67.5, 88.5);
       doc.line(100, 85, 100, 90);
       doc.text("Prix", 107, 88.5);
       doc.line(120, 85, 120, 90);
       doc.text("QTE Demandée", 123, 88.5);
       doc.line(145, 85, 145, 90);
       doc.text("QTE Validée", 148, 88.5 );
       doc.line(170, 85, 170, 90);
       doc.text("QTE Chargée", 173, 88.5 );
       doc.line(195, 85, 195, 90);
       i = 95;
     }

     if (this.printLines[j].product_name.length > 35) {
       doc.setFontSize(8);


        let line = this.printLines[j]

        let desc1 = line.product_name.substring(0,34);
        let ind = desc1.lastIndexOf(" ");
        desc1 = line.product_name.substring(0,ind);
        let desc2 = line.product_name.substring(ind +1);

       
        doc.line(10, i - 5, 10, i);
        doc.text(String(line.line), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(line.product_code, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(desc1, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(line.pt_price), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(String(line.qt_request), 143, i - 1 , { align: "right" });
        doc.line(145, i - 5, 145, i);
        doc.text(String(line.qt_validated), 168, i - 1, { align: "right" });
        doc.line(170, i - 5, 170, i);
        doc.text(String(line.qt_effected), 193, i - 1, { align: "right" });
        doc.line(195, i - 5, 195, i);
        

        i = i + 5;

        doc.text(desc2, 47, i - 1);

        doc.line(10, i - 5, 10, i);
        doc.line(20, i - 5, 20, i);
        doc.line(45, i - 5, 45, i);
        doc.line(100, i - 5, 100, i);
        doc.line(120, i - 5, 120, i);
        doc.line(145, i - 5, 145, i);
        doc.line(170, i - 5, 170, i);
        doc.line(195, i - 5, 195, i);
  
        i = i + 5;
     } else {
        doc.setFontSize(8);
        let line = this.printLines[j]
        doc.line(10, i - 5, 10, i);
        doc.text(String(line.line), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(line.product_code, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(line.product_name, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(line.pt_price), 118, i - 1 , { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(String(line.qt_request), 143, i - 1 , { align: "right" });
        doc.line(145, i - 5, 145, i);
        doc.text(String(line.qt_validated), 168, i - 1 , { align: "right" });
        doc.line(170, i - 5, 170, i);
        doc.text(String(line.qt_effected), 193, i - 1 , { align: "right" });
        doc.line(195, i - 5, 195, i);
        i = i + 5;
      }
      doc.line(10, i - 5, 195, i - 5);
   }

    doc.line(10, i - 5, 195, i - 5);
  
   
  
  var blob = doc.output("blob");
  window.open(URL.createObjectURL(blob));
}





}
