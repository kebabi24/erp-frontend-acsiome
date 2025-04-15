import { Component, OnInit, NgZone } from '@angular/core';
// Lodash
import { shuffle } from 'lodash';
// Services
// Widgets model
import { LayoutConfigService, SparklineChartOptions } from '../../../../core/_base/layout';
import { Widget4Data } from '../../../partials/content/widgets/widget4/widget4.component';
import { Widget1Data } from '../../../partials/content/widgets/widget1/widget1.component';

import {DashboardCommercialService} from "../../../../core/erp"


import am4themes_spiritedaway from "@amcharts/amcharts4/themes/spiritedaway";
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";


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
  selector: 'kt-sales-dashboard',
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.scss']
})
export class SalesDashboardComponent implements OnInit {
  dashboardForm: FormGroup;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  
 dashbordReportsData: any;

 product_sorted_data;

 // NEW DATA
 services : any = []

 visit_rate : any 
 visit_rate_data : any = []
 
 success_rate_visit : any 
 success_rate_itin : any 
 sucess_rate_data : any = []

 distribution_rate: any 
 distribution_rate_data: any = []

 ca_zone_data : any = []

 ca_visit : any 

 ca_new_client_data : any = []
 ca_new_clients : any 
 qty_type_data : any = []
 amt_type_data : any = []
 ca_cust : any = []

 integration_data : any = []

 recovery_rate_data : any = []


ca_dist : any
ca_dd : any
rv_dist : any
rv_dd : any

ddqty_type_data : any = []
ddamt_type_data : any = []
ca_role : any = []

 //private chart: am4charts.XYChart;


 constructor(
   private zone: NgZone,
   private fb: FormBuilder,
   private layoutConfigService: LayoutConfigService,
   private dashboardComService : DashboardCommercialService,
   private layoutUtilsService: LayoutUtilsService,
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
  this.getSalesDashboarData(startDate,endDate )
    
       



}

time = new Observable<string>((observer: Observer<string>) => {
  setInterval(() => {
    observer.next("");
  }, 1000);
});

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

  this.dashboardComService
    .getSalesDashboardData(startDate,endDate)

    .subscribe(
      
      (res: any) => {
        this.qty_type_data = res.qty_type_data 
        this.amt_type_data = res.amt_type_data 
        this.ddqty_type_data = res.ddqty_type_data 
        this.ddamt_type_data = res.ddamt_type_data 
        this.ca_zone_data = res.ca_zone_data
        this.ca_cust = res.ca_bill
        this.ca_role = res.ca_role
        let cadd =  String(  Number(res.ca_dd).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        
        let cadds = replaceAll(cadd,","," ")
      
        this.ca_dd = cadds
        let cadist =  String(  Number(res.ca_dist).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        let cadists = replaceAll(cadist,","," ")
        this.ca_dist = cadists
        let rvdd =  String(  Number(res.rv_dd).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        
        let rvdds = replaceAll(rvdd,","," ")
      
        this.rv_dd = rvdds
        let rvdist =  String(  Number(res.rv_dist).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        let rvdists = replaceAll(rvdist,","," ")
        this.rv_dist = rvdists

        this.createQtyTypeChart()
        this.createCATypeChart()

        this.createDDQtyTypeChart()
        this.createDDCATypeChart()
        // this.createCaZoneChart()
        this.createCaCustChart()
        this.createCAZonechartPie()
        this.createCaRoleChart()
     
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
  
  this.dashboardComService
    .getSalesDashboardData(startDate,endDate)

    .subscribe(
      
      (res: any) => {
        this.qty_type_data = res.qty_type_data 
        this.amt_type_data = res.amt_type_data 
        this.ddqty_type_data = res.ddqty_type_data 
        this.ddamt_type_data = res.ddamt_type_data 
        this.ca_zone_data = res.ca_zone_data
        this.ca_cust = res.ca_bill
        this.ca_role = res.ca_role
        let cadd =  String(  Number(res.ca_dd).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        
        let cadds = replaceAll(cadd,","," ")
      
        this.ca_dd = cadds
        let cadist =  String(  Number(res.ca_dist).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        let cadists = replaceAll(cadist,","," ")
        this.ca_dist = cadists
       

        let rvdd =  String(  Number(res.rv_dd).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        
        let rvdds = replaceAll(rvdd,","," ")
      
        this.rv_dd = rvdds
        let rvdist =  String(  Number(res.rv_dist).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        let rvdists = replaceAll(rvdist,","," ")
        this.rv_dist = rvdists

        this.createQtyTypeChart()
        this.createCATypeChart()
        this.createDDQtyTypeChart()
        this.createDDCATypeChart()
        // this.createCaZoneChart()
        this.createCaCustChart()
        this.createCAZonechartPie()
        this.createCaRoleChart()
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

createQtyTypeChart(){
  let chartr = am4core.create("chartdivN1", am4charts.PieChart);	
  chartr.data = this.qty_type_data ;

  // Add and configure Series
  let pieSeries = chartr.series.push(new am4charts.PieSeries());
  pieSeries.dataFields.value = "qty";
  pieSeries.dataFields.category = "type";
  pieSeries.slices.template.stroke = am4core.color("#fff");
  pieSeries.slices.template.strokeWidth = 2;
  pieSeries.slices.template.strokeOpacity = 1;
  
  // This creates initial animation
  pieSeries.hiddenState.properties.opacity = 1;
  pieSeries.hiddenState.properties.endAngle = -90;
  pieSeries.hiddenState.properties.startAngle = -90;

}
createCATypeChart(){
  let chartr = am4core.create("chartdivN2", am4charts.PieChart);	
  chartr.data = this.amt_type_data ;

  // Add and configure Series
  let pieSeries = chartr.series.push(new am4charts.PieSeries());
  pieSeries.dataFields.value = "amt";
  pieSeries.dataFields.category = "type";
  pieSeries.slices.template.stroke = am4core.color("#fff");
  pieSeries.slices.template.strokeWidth = 2;
  pieSeries.slices.template.strokeOpacity = 1;
  
  // This creates initial animation
  pieSeries.hiddenState.properties.opacity = 1;
  pieSeries.hiddenState.properties.endAngle = -90;
  pieSeries.hiddenState.properties.startAngle = -90;

}


createDDQtyTypeChart(){
  let chartr = am4core.create("chartdivN3", am4charts.PieChart);	
  chartr.data = this.ddqty_type_data ;

  // Add and configure Series
  let pieSeries = chartr.series.push(new am4charts.PieSeries());
  pieSeries.dataFields.value = "qty";
  pieSeries.dataFields.category = "type";
  pieSeries.slices.template.stroke = am4core.color("#fff");
  pieSeries.slices.template.strokeWidth = 2;
  pieSeries.slices.template.strokeOpacity = 1;
  
  // This creates initial animation
  pieSeries.hiddenState.properties.opacity = 1;
  pieSeries.hiddenState.properties.endAngle = -90;
  pieSeries.hiddenState.properties.startAngle = -90;

}
createDDCATypeChart(){
  let chartr = am4core.create("chartdivN4", am4charts.PieChart);	
  chartr.data = this.ddamt_type_data ;

  // Add and configure Series
  let pieSeries = chartr.series.push(new am4charts.PieSeries());
  pieSeries.dataFields.value = "amt";
  pieSeries.dataFields.category = "type";
  pieSeries.slices.template.stroke = am4core.color("#fff");
  pieSeries.slices.template.strokeWidth = 2;
  pieSeries.slices.template.strokeOpacity = 1;
  
  // This creates initial animation
  pieSeries.hiddenState.properties.opacity = 1;
  pieSeries.hiddenState.properties.endAngle = -90;
  pieSeries.hiddenState.properties.startAngle = -90;

}

// createCaZoneChart(){
//   let chart = am4core.create("chartdivN5", am4charts.XYChart);
//   chart.data = this.ca_zone_data
//   chart.padding(40, 40, 40, 40);

//   let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
//   categoryAxis.dataFields.category = "sup";
//   categoryAxis.renderer.grid.template.location = 0;
//   categoryAxis.renderer.minGridDistance = 30;
//   categoryAxis.renderer.labels.template.horizontalCenter = "right";
//   categoryAxis.renderer.labels.template.verticalCenter = "middle";
//   categoryAxis.renderer.labels.template.rotation = 270;
//   categoryAxis.tooltip.disabled = true;
//   categoryAxis.renderer.minHeight = 110;
//   let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
//   valueAxis.renderer.minWidth = 50;
//   let series = chart.series.push(new am4charts.ColumnSeries());
//   series.sequencedInterpolation = true;
//   series.dataFields.valueY = "ca";
//   series.dataFields.categoryX = "sup";
//   series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
//   series.columns.template.strokeWidth = 0;
//   series.tooltip.pointerOrientation = "vertical";

//   series.columns.template.column.cornerRadiusTopLeft = 10;
//   series.columns.template.column.cornerRadiusTopRight = 10;
//   series.columns.template.column.fillOpacity = 0.8;

//   // on hover, make corner radiuses bigger
//   let hoverState = series.columns.template.column.states.create("hover");
//   hoverState.properties.cornerRadiusTopLeft = 0;
//   hoverState.properties.cornerRadiusTopRight = 0;
//   hoverState.properties.fillOpacity = 1;
//   series.columns.template.adapter.add("fill", function(fill, target) {
//     return chart.colors.getIndex(target.dataItem.index);
//   });
//   chart.cursor = new am4charts.XYCursor();
// }



createCAZonechartPie(){
  let chart = am4core.create("chartdivN5", am4charts.PieChart);

  // let chart = am4core.create("chartdivN5", am4charts.PieChart3D);
  chart.data = this.ca_zone_data;
  
// Add and configure Series
let pieSeries = chart.series.push(new am4charts.PieSeries());
pieSeries.dataFields.value = "ca";
pieSeries.dataFields.category = "sup";

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
createCaCustChart(){
  console.log(this.ca_cust)
  let chart = am4core.create("chartdivN6", am4charts.XYChart);
  chart.data = this.ca_cust
  chart.padding(40, 40, 40, 40);

  let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = "name";
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.renderer.minGridDistance = 30;
  categoryAxis.renderer.labels.template.horizontalCenter = "right";
  categoryAxis.renderer.labels.template.verticalCenter = "middle";
  categoryAxis.renderer.labels.template.rotation = 270;
  categoryAxis.tooltip.disabled = true;
  categoryAxis.renderer.minHeight = 110;
  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.renderer.minWidth = 50;
  let series = chart.series.push(new am4charts.ColumnSeries());
  series.sequencedInterpolation = true;
  series.dataFields.valueY = "amt";
  series.dataFields.categoryX = "name";
  series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
  series.columns.template.strokeWidth = 0;
  series.tooltip.pointerOrientation = "vertical";

  series.columns.template.column.cornerRadiusTopLeft = 10;
  series.columns.template.column.cornerRadiusTopRight = 10;
  series.columns.template.column.fillOpacity = 0.8;

  // on hover, make corner radiuses bigger
  let hoverState = series.columns.template.column.states.create("hover");
  hoverState.properties.cornerRadiusTopLeft = 0;
  hoverState.properties.cornerRadiusTopRight = 0;
  hoverState.properties.fillOpacity = 1;
  series.columns.template.adapter.add("fill", function(fill, target) {
    return chart.colors.getIndex(target.dataItem.index);
  });
  chart.cursor = new am4charts.XYCursor();
}



createCaRoleChart(){
  let chart = am4core.create("chartdivN7", am4charts.XYChart);
chart.scrollbarX = new am4core.Scrollbar();

// Add data
chart.data = this.ca_role
console.log(this.ca_role)

// Create axes
let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "role_code";
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.minGridDistance = 30;
categoryAxis.renderer.labels.template.horizontalCenter = "right";
categoryAxis.renderer.labels.template.verticalCenter = "middle";
categoryAxis.renderer.labels.template.rotation = 270;
categoryAxis.tooltip.disabled = true;
categoryAxis.renderer.minHeight = 110;

let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.renderer.minWidth = 50;

// Create series
let series = chart.series.push(new am4charts.ColumnSeries());
series.sequencedInterpolation = true;
series.dataFields.valueY = "ca";
series.dataFields.categoryX = "role_code";
series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
series.columns.template.strokeWidth = 0;

series.tooltip.pointerOrientation = "vertical";

series.columns.template.column.cornerRadiusTopLeft = 10;
series.columns.template.column.cornerRadiusTopRight = 10;
series.columns.template.column.fillOpacity = 0.8;

// on hover, make corner radiuses bigger
let hoverState = series.columns.template.column.states.create("hover");
hoverState.properties.cornerRadiusTopLeft = 0;
hoverState.properties.cornerRadiusTopRight = 0;
hoverState.properties.fillOpacity = 1;

series.columns.template.adapter.add("fill", function(fill, target) {
  return chart.colors.getIndex(target.dataItem.index);
});

// Cursor
chart.cursor = new am4charts.XYCursor();
}
}