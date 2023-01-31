import { Component, OnInit, NgZone } from '@angular/core';
// Lodash
import { shuffle } from 'lodash';
// Services
import {CRMService} from "../../../../core/erp"
// Widgets model
import { LayoutConfigService, SparklineChartOptions } from '../../../../core/_base/layout';
import { Widget4Data } from '../../../partials/content/widgets/widget4/widget4.component';
import { Widget1Data } from '../../../partials/content/widgets/widget1/widget1.component';
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud"




import am4themes_spiritedaway from "@amcharts/amcharts4/themes/spiritedaway";
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";

am4core.useTheme(am4themes_animated);
//am4core.useTheme(am4themes_spiritedaway);
// Themes end

//let chart = am4core.create("chartdiv", am4charts.PieChart);

@Component({
  selector: 'kt-crm-dashboard',
  templateUrl: './crm-dashboard.component.html',
  styleUrls: ['./crm-dashboard.component.scss']
})
export class CRMDashboardComponent implements OnInit {


 dashbordReportsData: any;

 data1: Widget1Data[];
 data2: Widget1Data[];

 dashboard_data: any = [];
 
 product_sorted_data;
 
 data_01 = []  // EVENTS / CATEGORIES
 data_02 = []  // EVENTS / ACTIONS
 data_03 = []  // EVENTS / METHODS
 data_04 = []  // EVENTS / EVENTS RESULTS
 data_05 = []  // RATE



 constructor(
   private zone: NgZone,
   private crmService : CRMService,
   private layoutConfigService: LayoutConfigService,
   private layoutUtilsService: LayoutUtilsService,
 ) {
 }

 ngOnInit(): void {
  this.getCRMDashboarData()

   
       this.data1 = [
         {
           title: 'Nbre de vente Journalier',
           desc: 'Nombre de Vente Ajourdhui',
           value: "5",
           valueClass: 'kt-font-brand'
         },
         {
           title: 'Nbre Vente Mensuel',
           desc: 'Nbre Vente Mensuel',
           value: "129",
           valueClass: 'kt-font-danger'
         }
       ];

       

am4core.useTheme(am4themes_animated);



}


getCRMDashboarData(){
  this.crmService
    .getCRMDashboardData()

    .subscribe(
      (res: any) => {
        // this.eventsData = res.data
        // this.getCategoriesDisplay(this.eventsData)
        this.dashboard_data = res.data
        this.data_01 = this.dashboard_data.events_categories
        this.data_02 = this.dashboard_data.actions
        this.data_03 = this.dashboard_data.methods
        this.data_04 = this.dashboard_data.event_results
        this.data_05 = this.dashboard_data.rate
        this.createEventsCategoriesChart()
        this.createEventsActionsChart()
        this.createEventsMethodsChart()
        this.createEventsRestultsChart()
        this.createEventsCategoriesChartPie()
        this.createEventsActionsChartPie()
        this.createEventsMethodsChartPie()
        this.createEventsResultsChartPie()
        this.createRateChart()
      },
      (err) =>
        this.layoutUtilsService.showActionNotification(
          "Erreur lors de l'ajout de la catégorie",
          MessageType.Create,
          10000,
          true,
          true
        ),
        ()=>{}
    );
}

createRateChart(){
  let chart100 = am4core.create("chartdivN6", am4charts.XYChart);
  chart100.data =this.data_05;
  
  
  // Create axes
  let categoryAxis100 = chart100.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis100.dataFields.category = "day";
  categoryAxis100.renderer.grid.template.location = 0;
  categoryAxis100.renderer.minGridDistance = 30;
  
  let valueAxis100 = chart100.yAxes.push(new am4charts.ValueAxis());
  valueAxis100.title.text = "taux de satisfaction ";
  valueAxis100.axisRanges
  valueAxis100.renderer.labels.template.adapter.add("text", function(text) {
    // return text + "M";
    return text;
  });
  
  // Create series
  let series100 = chart100.series.push(new am4charts.ColumnSeries());
  series100.dataFields.valueY = "percentage";
  series100.dataFields.categoryX = "day";
  series100.name = "percentage";
  series100.clustered = false;
  series100.columns.template.tooltipText = "prct: [bold]{valueY}[/]";
  series100.columns.template.fillOpacity = 0.9;
}

createEventsCategoriesChart(){
  let chart100 = am4core.create("chartdivN1", am4charts.XYChart);
  chart100.data =this.data_01;
  
  
  // Create axes
  let categoryAxis100 = chart100.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis100.dataFields.category = "category_label";
  categoryAxis100.renderer.grid.template.location = 0;
  categoryAxis100.renderer.minGridDistance = 30;
  
  let valueAxis100 = chart100.yAxes.push(new am4charts.ValueAxis());
  valueAxis100.title.text = "Nombre d'événements ";
  valueAxis100.axisRanges
  valueAxis100.renderer.labels.template.adapter.add("text", function(text) {
    // return text + "M";
    return text;
  });
  
  // Create series
  let series100 = chart100.series.push(new am4charts.ColumnSeries());
  series100.dataFields.valueY = "nb_events";
  series100.dataFields.categoryX = "category_label";
  series100.name = "nb_events";
  series100.clustered = false;
  series100.columns.template.tooltipText = "nbr: [bold]{valueY}[/]";
  series100.columns.template.fillOpacity = 0.9;
}

createEventsActionsChart(){
  let chart100 = am4core.create("chartdivN2", am4charts.XYChart);
  chart100.data =this.data_02;
  
  
  // Create axes
  let categoryAxis100 = chart100.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis100.dataFields.category = "action_label";
  categoryAxis100.renderer.grid.template.location = 0;
  categoryAxis100.renderer.minGridDistance = 30;
  
  let valueAxis100 = chart100.yAxes.push(new am4charts.ValueAxis());
  valueAxis100.title.text = "Nombre d'actions ";
  valueAxis100.axisRanges
  valueAxis100.renderer.labels.template.adapter.add("text", function(text) {
    // return text + "M";
    return text;
  });
  
  // Create series
  let series100 = chart100.series.push(new am4charts.ColumnSeries());
  series100.dataFields.valueY = "action_nb";
  series100.dataFields.categoryX = "action_label";
  series100.name = "action_nb";
  series100.clustered = false;
  series100.columns.template.tooltipText = "nbr: [bold]{valueY}[/]";
  series100.columns.template.fillOpacity = 0.9;
}

createEventsMethodsChart(){
  let chart100 = am4core.create("chartdivN3", am4charts.XYChart);
  chart100.data =this.data_03;
  
  
  // Create axes
  let categoryAxis100 = chart100.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis100.dataFields.category = "method_label";
  categoryAxis100.renderer.grid.template.location = 0;
  categoryAxis100.renderer.minGridDistance = 30;
  
  let valueAxis100 = chart100.yAxes.push(new am4charts.ValueAxis());
  valueAxis100.title.text = "Nombre de méthodes ";
  valueAxis100.axisRanges
  valueAxis100.renderer.labels.template.adapter.add("text", function(text) {
    // return text + "M";
    return text;
  });
  
  // Create series
  let series100 = chart100.series.push(new am4charts.ColumnSeries());
  series100.dataFields.valueY = "method_nb";
  series100.dataFields.categoryX = "method_label";
  series100.name = "method_nb";
  series100.clustered = false;
  series100.columns.template.tooltipText = "nbr: [bold]{valueY}[/]";
  series100.columns.template.fillOpacity = 0.9;
}

createEventsRestultsChart(){
  let chart100 = am4core.create("chartdivN4", am4charts.XYChart);
  chart100.data =this.data_04;
  
  
  // Create axes
  let categoryAxis100 = chart100.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis100.dataFields.category = "event_result_label";
  categoryAxis100.renderer.grid.template.location = 0;
  categoryAxis100.renderer.minGridDistance = 30;
  
  let valueAxis100 = chart100.yAxes.push(new am4charts.ValueAxis());
  valueAxis100.title.text = "nombre de résultats d'événement ";
  valueAxis100.axisRanges
  valueAxis100.renderer.labels.template.adapter.add("text", function(text) {
    // return text + "M";
    return text;
  });
  
  // Create series
  let series100 = chart100.series.push(new am4charts.ColumnSeries());
  series100.dataFields.valueY = "event_result_nb";
  series100.dataFields.categoryX = "event_result_label";
  series100.name = "event_result_nb";
  series100.clustered = false;
  series100.columns.template.tooltipText = "nbr: [bold]{valueY}[/]";
  series100.columns.template.fillOpacity = 0.9;
}

createEventsCategoriesChartPie(){
   let chartr = am4core.create("chartdivN5", am4charts.PieChart);	
       chartr.data = this.data_01 ;
  
       // Add and configure Series
       let pieSeries = chartr.series.push(new am4charts.PieSeries());
       pieSeries.dataFields.value = "nb_events";
       pieSeries.dataFields.category = "category_label";
       pieSeries.slices.template.stroke = am4core.color("#fff");
       pieSeries.slices.template.strokeWidth = 2;
       pieSeries.slices.template.strokeOpacity = 1;
       
       // This creates initial animation
       pieSeries.hiddenState.properties.opacity = 1;
       pieSeries.hiddenState.properties.endAngle = -90;
       pieSeries.hiddenState.properties.startAngle = -90;
}

createEventsActionsChartPie(){
  let chartr = am4core.create("chartdivN2Pie", am4charts.PieChart);	
      chartr.data = this.data_02 ;
 
      // Add and configure Series
      let pieSeries = chartr.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "action_nb";
      pieSeries.dataFields.category = "action_label";
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      
      // This creates initial animation
      pieSeries.hiddenState.properties.opacity = 1;
      pieSeries.hiddenState.properties.endAngle = -90;
      pieSeries.hiddenState.properties.startAngle = -90;
}

createEventsMethodsChartPie(){
  let chartr = am4core.create("chartdivN3Pie", am4charts.PieChart);	
      chartr.data = this.data_03 ;
 
      // Add and configure Series
      let pieSeries = chartr.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "method_nb";
      pieSeries.dataFields.category = "method_label";
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      
      // This creates initial animation
      pieSeries.hiddenState.properties.opacity = 1;
      pieSeries.hiddenState.properties.endAngle = -90;
      pieSeries.hiddenState.properties.startAngle = -90;
}

createEventsResultsChartPie(){
  let chartr = am4core.create("chartdivN4Pie", am4charts.PieChart);	
      chartr.data = this.data_04 ;
 
      // Add and configure Series
      let pieSeries = chartr.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "event_result_nb";
      pieSeries.dataFields.category = "event_result_label";
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      
      // This creates initial animation
      pieSeries.hiddenState.properties.opacity = 1;
      pieSeries.hiddenState.properties.endAngle = -90;
      pieSeries.hiddenState.properties.startAngle = -90;
}













}