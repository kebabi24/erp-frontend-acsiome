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
  selector: 'kt-commercial-dashboard',
  templateUrl: './commercial-dashboard.component.html',
  styleUrls: ['./commercial-dashboard.component.scss']
})

export class CommercialDashboardComponent implements OnInit {
  dashboardForm: FormGroup;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  
 dashbordReportsData: any;

 data1: Widget1Data[];
 data2: Widget1Data[];

 orders=[]
 order_by_shop =[]
 data_01 = [] 
 orders_dates : any =[]
 meat_types : any = []
 bread_types : any = []
 sizes : any = []
 form_types : any = []
 platform_types : any = []
 customer_types : any = []
 shops : any = []
 

 product_sorted_data;
 

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
  this.getDashboarData("2023-3-1","2023-3-31","")
    
       



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
  const shop = controls.selected_shop.value
  const startDate = date.year+'-'+date.month+'-'+date.day
  const endDate = date2.year+'-'+date2.month+'-'+date2.day

  console.log(shop)
  this.dashboardComService
    .getAllPosOrders(startDate,endDate,shop)

    .subscribe(
      
      (res: any) => {
        this.orders = res.data.orders
        this.order_by_shop = res.data.order_by_shop
        this.meat_types = res.data.meat_types
        this.bread_types = res.data.bread_types
        this.sizes = res.data.sizes_types
        this.form_types = res.data.form_types
        this.platform_types  = res.data.platform_types
        this.customer_types  = res.data.customer_types

        let dates = _.mapValues(_.groupBy(this.orders, 'created_date'));
        for(const key in dates){
          this.orders_dates.push(key)
        }
        console.log(this.orders_dates)
        const shops_groups = _.mapValues(_.groupBy(this.orders, 'usrd_site'));

    
        this.createChar1()
        this.createMeatTypesChartPie()
        this.createBreadTypesChartPie()
        this.createSizesChartPie()
        this.createFormChartPie()
        this.createPaltformChartPie()
        this.createPaltCustomerChartPie()
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

getDashboarData(startDate: any , endDate:any , shop:any){
  
  this.dashboardComService
    .getAllPosOrders(startDate,endDate,shop)

    .subscribe(
      
      (res: any) => {
        this.orders = res.data.orders
        this.order_by_shop = res.data.order_by_shop
        this.meat_types = res.data.meat_types
        this.bread_types = res.data.bread_types
        this.sizes = res.data.sizes_types
        this.form_types = res.data.form_types
       

        this.platform_types  = res.data.platform_types
        const  indexNullPlatform = res.data.platform_types.findIndex(platform =>{
          return platform.type == "null"
        })
        
        if (indexNullPlatform > -1) { // only splice array when item is found
          this.platform_types.splice(indexNullPlatform, 1); // 2nd parameter means remove one item only
        }

        this.customer_types  = res.data.customer_types
        this.order_by_shop.forEach(shop=>{
          this.shops.push({code : shop.shop , label : shop.shop_name })
        })
        console.log(this.shops)   

        let dates = _.mapValues(_.groupBy(this.orders, 'created_date'));
        for(const key in dates){
          this.orders_dates.push(key)
        }
        
        const shops_groups = _.mapValues(_.groupBy(this.orders, 'usrd_site'));

    
        this.createChar1()
        this.createMeatTypesChartPie()
        this.createBreadTypesChartPie()
        this.createSizesChartPie()
        this.createFormChartPie()
        this.createPaltformChartPie()
        this.createPaltCustomerChartPie()
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

createBreadTypesChartPie(){
  let chartr = am4core.create("chartdivN6", am4charts.PieChart);	
      chartr.data = this.bread_types ;
 
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

createSizesChartPie(){
  let chartr = am4core.create("chartdivN7", am4charts.PieChart);	
      chartr.data = this.sizes ;
 
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

createFormChartPie(){
  let chartr = am4core.create("chartdivN8", am4charts.PieChart);	
      chartr.data = this.form_types ;
 
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

createPaltformChartPie(){
  let chartr = am4core.create("chartdivN9", am4charts.PieChart);	
      chartr.data = this.platform_types ;
 
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

createPaltCustomerChartPie(){
  let chartr = am4core.create("chartdivN10", am4charts.PieChart);	
      chartr.data = this.customer_types ;
 
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