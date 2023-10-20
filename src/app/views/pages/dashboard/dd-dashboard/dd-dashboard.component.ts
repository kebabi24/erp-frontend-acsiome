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
  selector: 'kt-dd-dashboard',
  templateUrl: './dd-dashboard.component.html',
  styleUrls: ['./dd-dashboard.component.scss']
})

export class DdDashboardComponent implements OnInit {
  dashboardForm: FormGroup;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  
 dashbordReportsData: any;



//  orders=[]
//  order_by_shop =[]
//  data_01 = [] 
//  orders_dates : any =[]
//  meat_types : any = []
//  bread_types : any = []
//  sizes : any = []
//  form_types : any = []
//  platform_types : any = []
//  customer_types : any = []
//  shops : any = []
 

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

 ca_itin_data : any = []

 ca_visit : any 

 ca_new_client_data : any = []
 ca_new_clients : any 
 ca_clusters_data : any = []
 products_data : any = []

 integration_data : any = []

 recovery_rate_data : any = []





 

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
  this.getDashboarData(startDate,endDate )
    
       



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
    .getDdDashboardData(startDate,endDate)

    .subscribe(
      
      (res: any) => {
        this.visit_rate = res.visit_rate
        this.visit_rate_data = res.visit_rate_data
        this.success_rate_visit = res.success_rate_visit
        this.success_rate_itin = res.success_rate_itin
        this.sucess_rate_data = res.sucess_rate_data
        this.distribution_rate =  res.distribution_rate
        this.distribution_rate_data =  res.distribution_rate_data
        this.ca_itin_data = res.ca_itin
        this.ca_visit = res.ca_visit
        this.ca_new_client_data = res.ca_new_client_data 
        this.ca_new_clients = res.ca_new_clients
        this.ca_clusters_data = res.ca_clusters_data 
        this.products_data = res.products_data
        this.integration_data = res.integration_data
        this.recovery_rate_data = res.recovery_rate_data

        this.createVisitRateChart()
        this.createSuccessRateChart()
        this.createDistributionRateChart()
        this.createCaItinChart()
        this.createCaNewClientChart()
        this.createCaClusterChart()
        this.createProductsChart()
        this.createIntegrationChart()
        this.createRecoveryRateChart
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


getDashboarData(startDate: any , endDate:any){
  
  this.dashboardComService
    .getDdDashboardData(startDate,endDate)

    .subscribe(
      
      (res: any) => {
        this.visit_rate = res.visit_rate
        this.visit_rate_data = res.visit_rate_data
        this.success_rate_visit = res.success_rate_visit
        this.success_rate_itin = res.success_rate_itin
        this.sucess_rate_data = res.sucess_rate_data
        this.distribution_rate =  res.distribution_rate
        this.distribution_rate_data =  res.distribution_rate_data
        this.ca_itin_data = res.ca_itin
        this.ca_visit = res.ca_visit
        this.ca_new_client_data = res.ca_new_client_data 
        this.ca_new_clients = res.ca_new_clients
        this.ca_clusters_data = res.ca_clusters_data 
        this.products_data = res.products_data
        this.integration_data = res.integration_data
        this.recovery_rate_data = res.recovery_rate_data

        this.createVisitRateChart()
        this.createSuccessRateChart()
        this.createDistributionRateChart()
        this.createCaItinChart()
        this.createCaNewClientChart()
        this.createCaClusterChart()
        this.createProductsChart()
        this.createIntegrationChart()
        this.createRecoveryRateChart()
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

createVisitRateChart(){
  am4core.useTheme(am4themes_animated);
  let chart = am4core.create("chartdiv10", am4charts.XYChart);
  chart.data = this.visit_rate_data

  let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = "role_code";
  categoryAxis.renderer.grid.template.location = 0;


  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.renderer.inside = true;
  valueAxis.renderer.labels.template.disabled = true;
  valueAxis.min = 0;

  this.createSeries("visit_rate", "Visite" ,chart);
  this.createSeries("unvisited_rate", "Reste a visiter",chart);

  // Legend
  chart.legend = new am4charts.Legend();
  
}

createSuccessRateChart(){
  am4core.useTheme(am4themes_animated);
  let chart = am4core.create('chartdivN5', am4charts.XYChart)
  chart.colors.step = 2;

  chart.legend = new am4charts.Legend()
  chart.legend.position = 'top'
  chart.legend.paddingBottom = 20
  chart.legend.labels.template.maxWidth = 95

  let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
  xAxis.dataFields.category = 'role_code'
  xAxis.renderer.cellStartLocation = 0.1
  xAxis.renderer.cellEndLocation = 0.9
  xAxis.renderer.grid.template.location = 0;
  let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
  yAxis.min = 0;

  chart.data = this.sucess_rate_data;

  this.createSeries2('nb_clients', 'Client visite',chart);
  this.createSeries2('nb_invoice', 'Client facturee',chart);
  this.createSeries2('nb_visits', 'Client tournee',chart);
}

createDistributionRateChart(){
  am4core.useTheme(am4themes_animated);
  let chart = am4core.create('chartdivN6', am4charts.XYChart)
  chart.colors.step = 2;

  chart.legend = new am4charts.Legend()
  chart.legend.position = 'top'
  chart.legend.paddingBottom = 20
  chart.legend.labels.template.maxWidth = 95

  let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
  xAxis.dataFields.category = 'role_code'
  xAxis.renderer.cellStartLocation = 0.1
  xAxis.renderer.cellEndLocation = 0.9
  xAxis.renderer.grid.template.location = 0;
  let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
  yAxis.min = 0;

  chart.data = this.distribution_rate_data;

  this.createSeries3('nb_products_sold', 'Produit vendues',chart);
  this.createSeries3('nb_products_loaded', 'Produit charges',chart);
  this.createSeries3('nb_products', 'Nombre total de produits',chart);
}

createCaItinChart(){
  let chart = am4core.create("chartdivN9", am4charts.XYChart);
  chart.data = this.ca_itin_data
  chart.padding(40, 40, 40, 40);

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
  let series = chart.series.push(new am4charts.ColumnSeries());
  series.sequencedInterpolation = true;
  series.dataFields.valueY = "ca_iti";
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
  chart.cursor = new am4charts.XYCursor();
}

createCaNewClientChart(){
  let chart = am4core.create("chartdivN10", am4charts.XYChart);
  chart.data = this.ca_new_client_data
  chart.padding(40, 40, 40, 40);

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
  let series = chart.series.push(new am4charts.ColumnSeries());
  series.sequencedInterpolation = true;
  series.dataFields.valueY = "ca_new_client";
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
  chart.cursor = new am4charts.XYCursor();
}

createCaClusterChart(){
  let chartr = am4core.create("chartdivN11", am4charts.PieChart);	
  chartr.data = this.ca_clusters_data ;

  // Add and configure Series
  let pieSeries = chartr.series.push(new am4charts.PieSeries());
  pieSeries.dataFields.value = "amount";
  pieSeries.dataFields.category = "cluster_code";
  pieSeries.slices.template.stroke = am4core.color("#fff");
  pieSeries.slices.template.strokeWidth = 2;
  pieSeries.slices.template.strokeOpacity = 1;
  
  // This creates initial animation
  pieSeries.hiddenState.properties.opacity = 1;
  pieSeries.hiddenState.properties.endAngle = -90;
  pieSeries.hiddenState.properties.startAngle = -90;

}

// createProductsChart(){
//   let chart = am4core.create("chartdivN12", am4core.Container);
//   chart.width = am4core.percent(100);
//   chart.height = am4core.percent(100);
//   chart.layout = "horizontal";
//   let columnChart = chart.createChild(am4charts.XYChart);

//   // Create axes
//   let categoryAxis = columnChart.yAxes.push(new am4charts.CategoryAxis());
//   categoryAxis.dataFields.category = "product_code";
//   categoryAxis.renderer.grid.template.location = 0;
//   categoryAxis.renderer.inversed = true;

//   let valueAxis = columnChart.xAxes.push(new am4charts.ValueAxis());

//   // Create series
//   let columnSeries = columnChart.series.push(new am4charts.ColumnSeries());
//   columnSeries.dataFields.valueX = "sum";
//   columnSeries.dataFields.categoryY = "product_code";
//   columnSeries.columns.template.strokeWidth = 0;

//   /**
//    * Pie chart
//    */

//   // Create chart instance
//   let pieChart = chart.createChild(am4charts.PieChart);
//   pieChart.data = this.products_data;
//   pieChart.innerRadius = am4core.percent(50);

//   // Add and configure Series
//   let pieSeries = pieChart.series.push(new am4charts.PieSeries());
//   pieSeries.dataFields.value = "sum";
//   pieSeries.dataFields.category = "product_code";
//   pieSeries.slices.template.propertyFields.fill = "color";
//   pieSeries.labels.template.disabled = true;

//   // Set up labels
//   let label1 = pieChart.seriesContainer.createChild(am4core.Label);
//   label1.text = "";
//   label1.horizontalCenter = "middle";
//   label1.fontSize = 20;

//   let label2 = pieChart.seriesContainer.createChild(am4core.Label);
//   label2.text = "";
//   label2.horizontalCenter = "middle";
//   label2.fontSize = 12;
//   label2.dy = 20;

//   // Auto-select first slice on load
//   pieChart.events.on("ready", function(ev) {
//     pieSeries.slices.getIndex(0).isActive = true;
//   });
//   pieSeries.slices.template.events.on("toggled", (ev)=> {
//     if (ev.target.isActive) {
//       pieSeries.slices.each(function(slice) {
//         if (slice != ev.target) {
//           slice.isActive = false;
//         }
//       });
//     }

//     columnSeries.appeared = false;
//     columnChart.data = ev.target.dataItem.dataContext['breakdown'];
//     columnSeries.fill = ev.target.fill;
//     columnSeries.reinit();
//     label1.text = pieChart.numberFormatter.format(ev.target.dataItem.values.value.percent, "#.'%'");
//     label1.fill = ev.target.fill;
    
//     label2.text = ev.target.dataItem['category'];
//   });
 
  
// }

createProductsChart(){
  // Create chart instance
  let chart = am4core.create("chartdivN12", am4core.Container);
  chart.width = am4core.percent(100);
  chart.height = am4core.percent(100);
  chart.layout = "horizontal";
  
  
  /**
   * Column chart
   */
  
  // Create chart instance
  let columnChart = chart.createChild(am4charts.XYChart);
  
  // Create axes
  let categoryAxis = columnChart.yAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = "product_code";
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.renderer.inversed = true;
  
  let valueAxis = columnChart.xAxes.push(new am4charts.ValueAxis());
  
  // Create series
  let columnSeries = columnChart.series.push(new am4charts.ColumnSeries());
  columnSeries.dataFields.valueX = "sum";
  columnSeries.dataFields.categoryY = "product_code";
  columnSeries.columns.template.strokeWidth = 0;
  
  /**
   * Pie chart
   */
  
  // Create chart instance
  let pieChart = chart.createChild(am4charts.PieChart);
  pieChart.data = this.products_data;;
  pieChart.innerRadius = am4core.percent(50);
  
  // Add and configure Series
  let pieSeries = pieChart.series.push(new am4charts.PieSeries());
  pieSeries.dataFields.value = "sum";
  pieSeries.dataFields.category = "product_code";
  pieSeries.slices.template.propertyFields.fill = "color";
  pieSeries.labels.template.disabled = true;

  // Set up labels
  let label1 = pieChart.seriesContainer.createChild(am4core.Label);
  label1.text = "";
  label1.horizontalCenter = "middle";
  label1.dy = 30;
  label1.fontSize = 20;
  
  let label2 = pieChart.seriesContainer.createChild(am4core.Label);
  label2.text = "";
  label2.horizontalCenter = "middle";
  label2.fontSize = 20;
  label2.dy = 20;
  
  // Auto-select first slice on load
  pieChart.events.on("ready", function(ev) {
    pieSeries.slices.getIndex(0).isActive = true;
  });

  // Set up toggling events
pieSeries.slices.template.events.on("toggled", (ev) =>{
  if (ev.target.isActive) {
    
    // Untoggle other slices
    pieSeries.slices.each(function(slice) {
      if (slice != ev.target) {
        slice.isActive = false;
      }
    });
    
    // Update column chart
    columnSeries.appeared = false;
    columnChart.data = ev.target.dataItem.dataContext['breakdown'];
    columnSeries.fill = ev.target.fill;
    columnSeries.reinit();
    
    // Update labels
    label1.text = pieChart.numberFormatter.format(ev.target.dataItem.values.value.percent, "#.'%'");
    label1.fill = ev.target.fill;
    
    label2.text = ev.target.dataItem['product_code'];
  }
})
 
}

createIntegrationChart(){
  let chart = am4core.create("chartdivN7", am4charts.XYChart);
chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
chart.data = this.integration_data;

let dateAxis = chart.xAxes.push(new am4charts.DateAxis());

let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.tooltip.disabled = true;

let series = chart.series.push(new am4charts.LineSeries());
series.dataFields.dateX = "day";
series.dataFields.openValueY = "nb_clients_itin";
series.dataFields.valueY = "total";
series.tooltipText = "nb_clients_itin: {openValueY.value} total: {valueY.value}";
series.sequencedInterpolation = true;
series.fillOpacity = 0.3;
series.defaultState.transitionDuration = 1000;
series.tensionX = 0.8;

let series2 = chart.series.push(new am4charts.LineSeries());
series2.dataFields.dateX = "day";
series2.dataFields.valueY = "nb_clients_itin";
series2.sequencedInterpolation = true;
series2.defaultState.transitionDuration = 1500;
series2.stroke = chart.colors.getIndex(6);
series2.tensionX = 0.8;

chart.cursor = new am4charts.XYCursor();
chart.cursor.xAxis = dateAxis;
chart.scrollbarX = new am4core.Scrollbar();


}

createRecoveryRateChart(){
  let chart = am4core.create("chartdivN30", am4core.Container);
 chart.width = am4core.percent(100);
 chart.height = am4core.percent(100);
 chart.layout = "horizontal";
 
 
 /**
  * Column chart
  */
 
 // Create chart instance
 let columnChart = chart.createChild(am4charts.XYChart);
 
 // Create axes
 let categoryAxis = columnChart.yAxes.push(new am4charts.CategoryAxis());
 categoryAxis.dataFields.category = "cluster";
 categoryAxis.renderer.grid.template.location = 0;
 categoryAxis.renderer.inversed = true;
 
 let valueAxis = columnChart.xAxes.push(new am4charts.ValueAxis());
 
 // Create series
 let columnSeries = columnChart.series.push(new am4charts.ColumnSeries());
 columnSeries.dataFields.valueX = "sum";
 columnSeries.dataFields.categoryY = "cluster";
 columnSeries.columns.template.strokeWidth = 0;
 
 /**
  * Pie chart
  */
 
 // Create chart instance
 let pieChart = chart.createChild(am4charts.PieChart);
 pieChart.data = this.recovery_rate_data;;
 pieChart.innerRadius = am4core.percent(50);
 
 // Add and configure Series
 let pieSeries = pieChart.series.push(new am4charts.PieSeries());
 pieSeries.dataFields.value = "sum";
 pieSeries.dataFields.category = "cluster";
 pieSeries.slices.template.propertyFields.fill = "color";
 pieSeries.labels.template.disabled = true;

 // Set up labels
 let label1 = pieChart.seriesContainer.createChild(am4core.Label);
 label1.text = "";
 label1.horizontalCenter = "middle";
 label1.dy = 30;
 label1.fontSize = 20;
 
 let label2 = pieChart.seriesContainer.createChild(am4core.Label);
 label2.text = "";
 label2.horizontalCenter = "middle";
 label2.fontSize = 20;
 label2.dy = 20;
 
 // Auto-select first slice on load
 pieChart.events.on("ready", function(ev) {
   pieSeries.slices.getIndex(0).isActive = true;
 });

 // Set up toggling events
pieSeries.slices.template.events.on("toggled", (ev) =>{
 if (ev.target.isActive) {
   
   // Untoggle other slices
   pieSeries.slices.each(function(slice) {
     if (slice != ev.target) {
       slice.isActive = false;
     }
   });
   
   // Update column chart
   columnSeries.appeared = false;
   columnChart.data = ev.target.dataItem.dataContext['breakdown'];
   columnSeries.fill = ev.target.fill;
   columnSeries.reinit();
   
   // Update labels
   label1.text = pieChart.numberFormatter.format(ev.target.dataItem.values.value.percent, "#.'%'");
   label1.fill = ev.target.fill;
   
   label2.text = ev.target.dataItem['cluster'];
 }
})
}










//******************************  CREATE SERIES ***********************************
createSeries(field, name , chart) {
  
  // Set up series
  let series = chart.series.push(new am4charts.ColumnSeries());
  series.name = name;
  series.dataFields.valueY = field;
  series.dataFields.categoryX = "role_code";
  series.sequencedInterpolation = true;
  
  // Make it stacked
  series.stacked = true;
  
  // Configure columns
  series.columns.template.width = am4core.percent(60);
  series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";
  
  // Add label
  let labelBullet = series.bullets.push(new am4charts.LabelBullet());
  labelBullet.label.text = "{valueY}";
  labelBullet.locationY = 0.5;
  labelBullet.label.hideOversized = true;
  
  return series;
}

createSeries2(value, name, chart) {
  let series = chart.series.push(new am4charts.ColumnSeries())
  series.dataFields.valueY = value
  series.dataFields.categoryX = 'role_code'
  series.name = name

  // series.events.on("hidden", arrangeColumns);
  // series.events.on("shown", arrangeColumns);

  let bullet = series.bullets.push(new am4charts.LabelBullet())
  bullet.interactionsEnabled = false
  bullet.dy = 30;
  bullet.label.text = '{valueY}'
  bullet.label.fill = am4core.color('#ffffff')

  return series;
}

createSeries3(value, name, chart) {
  let series = chart.series.push(new am4charts.ColumnSeries())
  series.dataFields.valueY = value
  series.dataFields.categoryX = 'role_code'
  series.name = name

  // series.events.on("hidden", arrangeColumns);
  // series.events.on("shown", arrangeColumns);

  let bullet = series.bullets.push(new am4charts.LabelBullet())
  bullet.interactionsEnabled = false
  bullet.dy = 30;
  bullet.label.text = '{valueY}'
  bullet.label.fill = am4core.color('#ffffff')

  return series;
}

// arrangeColumns() {

//   let series = chart.series.getIndex(0);

//   let w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
//   if (series.dataItems.length > 1) {
//       let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
//       let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
//       let delta = ((x1 - x0) / chart.series.length) * w;
//       if (am4core.isNumber(delta)) {
//           let middle = chart.series.length / 2;

//           let newIndex = 0;
//           chart.series.each(function(series) {
//               if (!series.isHidden && !series.isHiding) {
//                   series.dummyData = newIndex;
//                   newIndex++;
//               }
//               else {
//                   series.dummyData = chart.series.indexOf(series);
//               }
//           })
//           let visibleCount = newIndex;
//           let newMiddle = visibleCount / 2;

//           chart.series.each(function(series) {
//               let trueIndex = chart.series.indexOf(series);
//               let newIndex = series.dummyData;

//               let dx = (newIndex - trueIndex + middle - newMiddle) * delta

//               series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
//               series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
//           })
//       }
//   }
// }

}