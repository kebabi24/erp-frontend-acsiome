import { Component, OnInit, NgZone } from '@angular/core';
// Lodash
import { shuffle } from 'lodash';
// Services
// Widgets model
import { LayoutConfigService, SparklineChartOptions } from '../../../../core/_base/layout';
import { Widget4Data } from '../../../partials/content/widgets/widget4/widget4.component';
import { Widget1Data } from '../../../partials/content/widgets/widget1/widget1.component';

import {InventoryTransactionService} from "../../../../core/erp"


import am4themes_spiritedaway from "@amcharts/amcharts4/themes/spiritedaway";
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  GridService,
  FieldType,
  Formatters,
  OnEventArgs,
} from "angular-slickgrid";

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);

import { replaceAll } from "chartist";

import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud"

import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import * as _ from 'lodash';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { FormBuilder, FormGroup } from '@angular/forms';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'kt-mfg-dashboard',
  templateUrl: './mfg-dashboard.component.html',
  styleUrls: ['./mfg-dashboard.component.scss']
})
export class MfgDashboardComponent implements OnInit {
  dashboardForm: FormGroup;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  
 dashbordReportsData: any;

 

 Gachat : any = []
 GAtype : any = []
 GPtype : any = []
 

 

 



 data: [];
 columnDefinitions3: Column[] = [];
 gridOptions3: GridOption = {};
 gridObj3: any;
 angularGrid3: AngularGridInstance;
 dataView3: any;
 gridService3: GridService;

 Prod_amt : any
 Prodamt: any
 Achatamt : any
 Prodqty : any
 Achatqty: any
 Prod_qty : any
 Achat_amt : any
 Achat_qty : any
GProd_amt:any
GProd_qty: any
ProdamtMG: any
ProdqtyMG: any
ProdamtLOTUS: any
ProdqtyLOTUS: any

Prod_amt_MG : any
Prod_amt_LOTUS : any
Prod_qty_MG : any
Prod_qty_LOTUS : any
 //private chart: am4charts.XYChart;

AALotus: any = 0
AAMagic : any = 0
AQLotus : any = 0
AQMagic: any = 0
AARam: any = 0
AQRam:any = 0
PALotus: any = 0
PQLotus: any = 0
PAMg: any = 0
PQMg: any = 0
TAP:any=0
TQP: any=0
AG: any = 0
QG: any = 0
TAPP:any=0
TQPP: any=0
 constructor(
   private zone: NgZone,
   private fb: FormBuilder,
   private layoutConfigService: LayoutConfigService,
   private itService : InventoryTransactionService,
   private layoutUtilsService: LayoutUtilsService,
   private modalService: NgbModal,
 ) {
 }

 ngOnInit(): void {
  this.loading$ = this.loadingSubject.asObservable();
  this.loadingSubject.next(false);
  this.createForm()
  

  let date = new Date();
  let startDate = date.getFullYear() +'-'+(date.getMonth()+1).toString().padStart(2, '0')+'-'+"01"
  let endDate = date.getFullYear() +'-'+(date.getMonth()+1).toString().padStart(2, '0')+'-'+date.getDate()
  // startDate ="2023-5-28"
  // endDate ="2023-6-10"
  this.updateData()
    
       



}

// time = new Observable<string>((observer: Observer<string>) => {
//   setInterval(() => {
//     observer.next("");
//   }, 1000);
// });

createForm() {
  this.loadingSubject.next(false);
  const date = new Date;
  
  this.dashboardForm = this.fb.group({
  
  //  site:[this.user.usrd_site,Validators.required],
    selected_shop : [''],
    start_date: [{
      year:date.getFullYear(),
      month: date.getMonth()+1,
      day: 1
    }],
    end_date: [{
      year:date.getFullYear(),
      month: date.getMonth()+1,
      day: date.getDate()
    }],
  });
}

updateData(){
  
  const controls = this.dashboardForm.controls
  const date = controls.start_date.value
  const date2 = controls.end_date.value
  const startDate = date.year+'-'+date.month+'-'+date.day
  const endDate = date2.year+'-'+date2.month+'-'+date2.day

  this.itService
    .getmfgDashboardData(startDate,endDate)

    .subscribe(
      
      (res: any) => {
        this.Prodamt = res.data.Prod_amt
        this.Prodqty = res.data.Prod_qty
        this.Achatamt = res.data.Achat_amt
        this.Achatqty = res.data.Achat_qty
        this.Gachat = res.data.Gachat
        this.GAtype = res.data.GAtype
        this.GPtype = res.data.GPtype

        this.ProdamtMG = res.data.Prod_amt_MG
        this.ProdqtyMG = res.data.Prod_qty_MG

        this.ProdamtLOTUS = res.data.Prod_amt_LOTUS
        this.ProdqtyLOTUS = res.data.Prod_qty_LOTUS

        let gprodamt = Number(res.data.Prod_amt) + Number(res.data.Achat_amt)
        let gprodqty = Number(res.data.Prod_qty) + Number(res.data.Achat_qty)
        console.log(res.data)
        let gpamt =  String(  Number(gprodamt).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        this.GProd_amt = replaceAll(gpamt,","," ")

        let gpqty =  String(  Number(gprodqty).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        this.GProd_qty = replaceAll(gpqty,","," ")

        let pamt =  String(  Number(this.Prodamt).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        this.Prod_amt = replaceAll(pamt,","," ")

        let aamt =  String(  Number(this.Achatamt).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        this.Achat_amt = replaceAll(aamt,","," ")

        let pqty =  String(  Number(this.Prodqty).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        this.Prod_qty = replaceAll(pqty,","," ")

        let aqty =  String(  Number(this.Achatqty).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        this.Achat_qty = replaceAll(aqty,","," ")


        let pamtmg =  String(  Number(this.ProdamtMG).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        this.Prod_amt_MG = replaceAll(pamtmg,","," ")

        let pamtlotus =  String(  Number(this.ProdamtLOTUS).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        this.Prod_amt_LOTUS = replaceAll(pamtlotus,","," ")

        let pqtymg =  String(  Number(this.ProdqtyMG).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        this.Prod_qty_MG = replaceAll(pqtymg,","," ")

        let pqtylotus =  String(  Number(this.ProdqtyLOTUS).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        this.Prod_qty_LOTUS = replaceAll(pqtylotus,","," ")

for (let a of this.Gachat) {
if(a.tr_addr =="C0000002") {
  this.AALotus = Number.parseFloat(a.amt).toFixed(2);
  this.AQLotus = a.qty
}else {
  if(a.tr_addr =="C0000009") {
  this.AAMagic =  Number.parseFloat(a.amt).toFixed(2);
  this.AQMagic = a.qty
  } else {
    this.AARam =  Number.parseFloat(a.amt).toFixed(2);
    this.AQRam = a.qty

  }
}
console.log(Number.parseFloat(this.Prod_amt).toFixed(2) , Number.parseFloat(this.AALotus).toFixed(2) , Number.parseFloat(this.AAMagic).toFixed(2) , Number.parseFloat(this.AARam).toFixed(2))
this.TAP = Number.parseFloat(String(Number(this.Prodamt) + Number(this.AALotus) + Number(this.AAMagic) + Number(this.AARam))).toFixed(2)
this.TQP = Number(this.Prodqty) + Number(this.AQLotus) + Number(this.AQMagic) + Number(this.AQRam)

for (let a of this.GPtype) {
  if(a.pt_rev =="LOTUS") {
    this.PALotus =  Number.parseFloat(a.amt).toFixed(2);
    this.PQLotus = a.qty
  }else {
   
      this.PAMg =  Number.parseFloat(a.amt).toFixed(2);
      this.PQMg = a.qty
  
    }
  }
}
this.TAPP = Number(this.PALotus) + Number(this.PAMg) 
this.TQPP = Number(this.PQLotus) + Number(this.PQMg)



for (let g of this.GAtype) {

  if (g.pt_part_type = '02') {

    this.AG = Number.parseFloat(g.amt).toFixed(2);
    this.QG =  g.qty
  }
}

        this.createCAVendchartPie()
        
        this.createQtyVendchartPie()

        this.createCATypechartPie()
        this.createQtyTypechartPie()
        this.createCAProdchartPie()
        this.createQtyProdchartPie()
        // this.qty_type_data = res.typegros
        // this.amt_type_data = res.typegros 
        // this.ddqty_type_data = res.typedd
        // this.ddamt_type_data = res.typedd
        // this.ca_zone_data = res.ca_zone_data
        // this.ca_cust = res.ca_bill
        // this.ca_role = res.ca_role
        // this.qty_role = res.qty_role
        // this.qty_cust = res.qty_cust
        // this.credit_role = res.credit_role
        // this.credit_Cust = res.credit_Cust
        // this.data =  res.credit_Cust
        // this.dataView3.setItems(this.data)
        // let cadd =  String(  Number(res.ca_dd).toLocaleString("en-US", {
        //   minimumFractionDigits: 2,
        //   maximumFractionDigits: 2,
        // }))
        
        // let cadds = replaceAll(cadd,","," ")
      
        // this.ca_dd = cadds
        // let cadist =  String(  Number(res.ca_dist).toLocaleString("en-US", {
        //   minimumFractionDigits: 2,
        //   maximumFractionDigits: 2,
        // }))
        // let cadists = replaceAll(cadist,","," ")
        // this.ca_dist = cadists
        // let rvdd =  String(  Number(res.rv_dd).toLocaleString("en-US", {
        //   minimumFractionDigits: 2,
        //   maximumFractionDigits: 2,
        // }))
        
        // let rvdds = replaceAll(rvdd,","," ")
      
        // this.rv_dd = rvdds
        // let rvdist =  String(  Number(res.rv_dist).toLocaleString("en-US", {
        //   minimumFractionDigits: 2,
        //   maximumFractionDigits: 2,
        // }))
        // let rvdists = replaceAll(rvdist,","," ")
        // this.rv_dist = rvdists

        
        // let cred_dd =  String(  Number(res.credit_dd).toLocaleString("en-US", {
        //   minimumFractionDigits: 2,
        //   maximumFractionDigits: 2,
        // }))
        
        // let cred_dds = replaceAll(cred_dd,","," ")
      
        // this.credit_dd = cred_dds
        // let cred_gros =  String(  Number(res.credit_gros).toLocaleString("en-US", {
        //   minimumFractionDigits: 2,
        //   maximumFractionDigits: 2,
        // }))
        // let cred_gross = replaceAll(cred_gros,","," ")
        // this.credit_gros = cred_gross
        
        // // let qtyd =  String(  Number(res.qtydd).toLocaleString("en-US", {
        // //   minimumFractionDigits: 0,
        // //   maximumFractionDigits: 0,
        // // }))
        
        // // let qtyddd = replaceAll(qtyd,",","")
        // this.qtydd = res.qtydd

        // // let qtyg =  String(  Number(res.qtygros).toLocaleString("en-US", {
        // //   minimumFractionDigits: 0,
        // //   maximumFractionDigits: 0,
        // // }))
        
        // // let qtygr= replaceAll(qtyg,",","")
        // this.qtygros = res.qtygros
        // this.createQtyTypeChart()
        // this.createCATypeChart()

        // this.createDDQtyTypeChart()
        // this.createDDCATypeChart()
        // // this.createCaZoneChart()
        // this.createCaCustChart()
        // this.createCAZonechartPie()
        //  this.createCaRoleChart()
        // this.createQtyRoleChart()
        // this.createQtyCustChart()
        // this.createCreditRoleChart()
        // this.createCreditCustChart()
     
      },
      (err) =>
        this.layoutUtilsService.showActionNotification(
          err,
          MessageType.Create,
          10000,
          true,
          true
        ),
        ()=>{}
    );
  
}


getSalesDashboarData(startDate: any , endDate:any){
  
  this.itService
    .getmfgDashboardData(startDate,endDate)

    .subscribe(
      
      (res: any) => {
        
          this.Prod_amt = res.Prod_amt
          this.Prod_qty = res.Prod_qty
      },
      (err) =>
        this.layoutUtilsService.showActionNotification(
          err,
          MessageType.Create,
          10000,
          true,
          true
        ),
        ()=>{}
    );
}

createCAVendchartPie(){
  let chart = am4core.create("chartdivN1", am4charts.PieChart);

  // let chart = am4core.create("chartdivN5", am4charts.PieChart3D);
  chart.data = this.Gachat;
  
// Add and configure Series
let pieSeries = chart.series.push(new am4charts.PieSeries());
pieSeries.dataFields.value = "amt";
pieSeries.dataFields.category = "ad_name";

// Let's cut a hole in our Pie chart the size of 30% the radius
chart.innerRadius = am4core.percent(30);

// Put a thick white border around each Slice
pieSeries.slices.template.stroke = am4core.color("#fff");
pieSeries.slices.template.strokeWidth = 2;
pieSeries.slices.template.strokeOpacity = 1;
pieSeries.slices.template
  // change the cursor on hover to make it apparent the object can be interacted with
  .cursorOverStyle = [
    {
      "property": "cursor",
      "value": "pointer"
    }
  ];

pieSeries.alignLabels = false;
pieSeries.labels.template.bent = true;
pieSeries.labels.template.radius = 3;
pieSeries.labels.template.padding(0,0,0,0);

pieSeries.ticks.template.disabled = true;

// Create a base filter effect (as if it's not there) for the hover to return to
let shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
shadow.opacity = 0;

// Create hover state
let hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists

// Slightly shift the shadow and make it more prominent on hover
let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
hoverShadow.opacity = 0.7;
hoverShadow.blur = 5;

// Add a legend
chart.legend = new am4charts.Legend();


}
createQtyVendchartPie(){
  let chart = am4core.create("chartdivN2", am4charts.PieChart);

  // let chart = am4core.create("chartdivN5", am4charts.PieChart3D);
  chart.data = this.Gachat;
  
// Add and configure Series
let pieSeries = chart.series.push(new am4charts.PieSeries());
pieSeries.dataFields.value = "qty";
pieSeries.dataFields.category = "ad_name";

// Let's cut a hole in our Pie chart the size of 30% the radius
chart.innerRadius = am4core.percent(30);

// Put a thick white border around each Slice
pieSeries.slices.template.stroke = am4core.color("#fff");
pieSeries.slices.template.strokeWidth = 2;
pieSeries.slices.template.strokeOpacity = 1;
pieSeries.slices.template
  // change the cursor on hover to make it apparent the object can be interacted with
  .cursorOverStyle = [
    {
      "property": "cursor",
      "value": "pointer"
    }
  ];

pieSeries.alignLabels = false;
pieSeries.labels.template.bent = true;
pieSeries.labels.template.radius = 3;
pieSeries.labels.template.padding(0,0,0,0);

pieSeries.ticks.template.disabled = true;

// Create a base filter effect (as if it's not there) for the hover to return to
let shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
shadow.opacity = 0;

// Create hover state
let hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists

// Slightly shift the shadow and make it more prominent on hover
let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
hoverShadow.opacity = 0.7;
hoverShadow.blur = 5;

// Add a legend
chart.legend = new am4charts.Legend();


}

createCATypechartPie(){
  let chart = am4core.create("chartdivN3", am4charts.PieChart);

  // let chart = am4core.create("chartdivN5", am4charts.PieChart3D);
  chart.data = this.GAtype;
  
// Add and configure Series
let pieSeries = chart.series.push(new am4charts.PieSeries());
pieSeries.dataFields.value = "amt";
pieSeries.dataFields.category = "code_cmmt";

// Let's cut a hole in our Pie chart the size of 30% the radius
chart.innerRadius = am4core.percent(30);

// Put a thick white border around each Slice
pieSeries.slices.template.stroke = am4core.color("#fff");
pieSeries.slices.template.strokeWidth = 2;
pieSeries.slices.template.strokeOpacity = 1;
pieSeries.slices.template
  // change the cursor on hover to make it apparent the object can be interacted with
  .cursorOverStyle = [
    {
      "property": "cursor",
      "value": "pointer"
    }
  ];

pieSeries.alignLabels = false;
pieSeries.labels.template.bent = true;
pieSeries.labels.template.radius = 3;
pieSeries.labels.template.padding(0,0,0,0);

pieSeries.ticks.template.disabled = true;

// Create a base filter effect (as if it's not there) for the hover to return to
let shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
shadow.opacity = 0;

// Create hover state
let hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists

// Slightly shift the shadow and make it more prominent on hover
let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
hoverShadow.opacity = 0.7;
hoverShadow.blur = 5;

// Add a legend
chart.legend = new am4charts.Legend();


}
createQtyTypechartPie(){
  let chart = am4core.create("chartdivN4", am4charts.PieChart);

  // let chart = am4core.create("chartdivN5", am4charts.PieChart3D);
  chart.data = this.GAtype;
  
// Add and configure Series
let pieSeries = chart.series.push(new am4charts.PieSeries());
pieSeries.dataFields.value = "qty";
pieSeries.dataFields.category = "code_cmmt";

// Let's cut a hole in our Pie chart the size of 30% the radius
chart.innerRadius = am4core.percent(30);

// Put a thick white border around each Slice
pieSeries.slices.template.stroke = am4core.color("#fff");
pieSeries.slices.template.strokeWidth = 2;
pieSeries.slices.template.strokeOpacity = 1;
pieSeries.slices.template
  // change the cursor on hover to make it apparent the object can be interacted with
  .cursorOverStyle = [
    {
      "property": "cursor",
      "value": "pointer"
    }
  ];

pieSeries.alignLabels = false;
pieSeries.labels.template.bent = true;
pieSeries.labels.template.radius = 3;
pieSeries.labels.template.padding(0,0,0,0);

pieSeries.ticks.template.disabled = true;

// Create a base filter effect (as if it's not there) for the hover to return to
let shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
shadow.opacity = 0;

// Create hover state
let hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists

// Slightly shift the shadow and make it more prominent on hover
let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
hoverShadow.opacity = 0.7;
hoverShadow.blur = 5;

// Add a legend
chart.legend = new am4charts.Legend();


}







createCAProdchartPie(){
  let chart = am4core.create("chartdivN5", am4charts.PieChart);

  // let chart = am4core.create("chartdivN5", am4charts.PieChart3D);
  chart.data = this.GPtype;
  
// Add and configure Series
chart.radius = am4core.percent(70);
chart.innerRadius = am4core.percent(40);
chart.startAngle = 180;
chart.endAngle = 360;  

let series = chart.series.push(new am4charts.PieSeries());
series.dataFields.value = "amt";
series.dataFields.category = "code_cmmt";

series.slices.template.cornerRadius = 10;
series.slices.template.innerCornerRadius = 7;
series.slices.template.draggable = true;
series.slices.template.inert = true;
series.alignLabels = false;

series.hiddenState.properties.startAngle = 90;
series.hiddenState.properties.endAngle = 90;

chart.legend = new am4charts.Legend();
}
createQtyProdchartPie(){
  let chart = am4core.create("chartdivN6", am4charts.PieChart);

  // let chart = am4core.create("chartdivN5", am4charts.PieChart3D);
  chart.data = this.GPtype;
  
// Add and configure Series
chart.radius = am4core.percent(70);
chart.innerRadius = am4core.percent(40);
chart.startAngle = 180;
chart.endAngle = 360;  

let series = chart.series.push(new am4charts.PieSeries());
series.dataFields.value = "qty";
series.dataFields.category = "code_cmmt";

series.slices.template.cornerRadius = 10;
series.slices.template.innerCornerRadius = 7;
series.slices.template.draggable = true;
series.slices.template.inert = true;
series.alignLabels = false;

series.hiddenState.properties.startAngle = 90;
series.hiddenState.properties.endAngle = 90;

chart.legend = new am4charts.Legend();
}
}