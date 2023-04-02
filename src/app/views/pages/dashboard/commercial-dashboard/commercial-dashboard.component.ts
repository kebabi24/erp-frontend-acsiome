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
import { Observable, Observer } from 'rxjs';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'kt-commercial-dashboard',
  templateUrl: './commercial-dashboard.component.html',
  styleUrls: ['./commercial-dashboard.component.scss']
})

export class CommercialDashboardComponent implements OnInit {

  
 dashbordReportsData: any;

 data1: Widget1Data[];
 data2: Widget1Data[];

 orders=[]
 order_by_shop =[]
 data_01 = [] 
 orders_dates : any =[]
 meat_types : any = []
 

 product_sorted_data;
 

 //private chart: am4charts.XYChart;


 constructor(
   private zone: NgZone,
   private layoutConfigService: LayoutConfigService,
   private dashboardComService : DashboardCommercialService,
   private layoutUtilsService: LayoutUtilsService,
 ) {
 }

 ngOnInit(): void {
  this.getDashboarData()
       
       



}

time = new Observable<string>((observer: Observer<string>) => {
  setInterval(() => {
    observer.next("");
  }, 1000);
});

createChar1(){

  am4core.useTheme(am4themes_animated);

  let chart10 = am4core.create("chartdiv10", am4charts.XYChart3D);

  // Add data
  chart10.data = this.order_by_shop;

  // Create axes
  let categoryAxis10 = chart10.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis10.dataFields.category = "shop_name";
  categoryAxis10.renderer.grid.template.location = 0;
  categoryAxis10.renderer.minGridDistance = 30;

  let valueAxis10 = chart10.yAxes.push(new am4charts.ValueAxis());
  valueAxis10.title.text = "Total";
  valueAxis10.renderer.labels.template.adapter.add("text", function(text) {
    return text + "DA";
  });

  // Create series
  let series10 = chart10.series.push(new am4charts.ColumnSeries3D());
  series10.dataFields.valueY = "CA";
  series10.dataFields.categoryX = "shop_name";
  series10.name = "CA";
  series10.clustered = false;
  series10.columns.template.tooltipText = "CA: [bold]{valueY}[/]";
  series10.columns.template.fillOpacity = 0.9;

  let series20 = chart10.series.push(new am4charts.ColumnSeries3D());
  series20.dataFields.valueY = "Cout";
  series20.dataFields.categoryX = "shop_name";
  series20.name = "Cout";
  series20.clustered = false;
  series20.columns.template.tooltipText = "Cout: [bold]{valueY}[/]";
  am4core.useTheme(am4themes_animated);
}

getDashboarData(){
  
  this.dashboardComService
    .getAllPosOrders()

    .subscribe(
      
      (res: any) => {
        this.orders = res.data.orders
        this.order_by_shop = res.data.order_by_shop
        this.meat_types = res.data.meat_types
        let dates = _.mapValues(_.groupBy(this.orders, 'created_date'));
        for(const key in dates){
          this.orders_dates.push(key)
        }
        const shops_groups = _.mapValues(_.groupBy(this.orders, 'usrd_site'));

        // for(const key in shops_groups){
        //   let sum = 0 
        //   shops_groups[key].forEach(order=>{
        //     // console.log(parseFloat(order.total_price))
        //     sum += parseFloat(order.total_price)
        //   })
        //   this.sum_by_shop.push({shop:key , CA:sum , Cout : 20000  })
        //   console.log("key:\t"+key +"\t length:"+ shops_groups[key].length +"\t sum:"+ sum)
        //   sum = 0
        // }
        
        this.createChar1()
        this.createMeatTypesChartPie()
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


createMeatTypesChartPie(){
  let chartr = am4core.create("chartdivN5", am4charts.PieChart);	
      chartr.data = this.meat_types ;
 
      // Add and configure Series
      let pieSeries = chartr.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "CA";
      pieSeries.dataFields.category = "type";
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      
      // This creates initial animation
      pieSeries.hiddenState.properties.opacity = 1;
      pieSeries.hiddenState.properties.endAngle = -90;
      pieSeries.hiddenState.properties.startAngle = -90;
}

}