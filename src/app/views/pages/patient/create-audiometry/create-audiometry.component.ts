import { Component, OnInit, AfterViewInit, NgZone, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { Audiometry, AudiometryService, PatientService, SequenceService, /*DataSharingService*/  } from "../../../../core/erp"
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { DatePipe } from '@angular/common';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';


import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { NgbModal, NgbActiveModal, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { NgbDateCustomParserFormatter } from '../../../../dateformat';

import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";

@Component({
  selector: 'kt-create-audiometry',
  templateUrl: './create-audiometry.component.html',
  styleUrls: ['./create-audiometry.component.scss']
})
export class CreateAudiometryComponent implements OnInit {
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

 
  loading: boolean = false;
  audForm: FormGroup;
  datapat: []
  columnDefinitionspat: Column[] = []
  gridOptionspat: GridOption = {}
  gridObjpat: any
  angularGridpat: AngularGridInstance

  seq: any
  audiograms = [
    {
      audiometry_id: null,
      frequency: 125,
      right_ear_os: null,
      left_ear_os: null,
      right_ear_ar: null,
      left_ear_ar: null,
      // created_ip_address : getRequiredFields().local_ip,
      // last_updated_ip_address : getRequiredFields().local_ip,
      // created_user_id : getRequiredFields().user_id,
      // last_modified_user_id : getRequiredFields().user_id
    },
    {
      audiometry_id: null,
      frequency: 250,
      right_ear_os: null,
      left_ear_os: null,
      right_ear_ar: null,
      left_ear_ar: null,
      // created_ip_address : getRequiredFields().local_ip,
      // last_updated_ip_address : getRequiredFields().local_ip,
      // created_user_id : getRequiredFields().user_id,
      // last_modified_user_id : getRequiredFields().user_id
    },
    {
      audiometry_id: null,
      frequency: 500,
      right_ear_os: null,
      left_ear_os: null,
      right_ear_ar: null,
      left_ear_ar: null,
      // created_ip_address : getRequiredFields().local_ip,
      // last_updated_ip_address : getRequiredFields().local_ip,
      // created_user_id : getRequiredFields().user_id,
      // last_modified_user_id : getRequiredFields().user_id
    },
    {
      audiometry_id: null,
      frequency: 1000,
      right_ear_os: null,
      left_ear_os: null,
      right_ear_ar: null,
      left_ear_ar: null,
      // created_ip_address : getRequiredFields().local_ip,
      // last_updated_ip_address : getRequiredFields().local_ip,
      // created_user_id : getRequiredFields().user_id,
      // last_modified_user_id : getRequiredFields().user_id
    },
    {
      audiometry_id: null,
      frequency: 2000,
      right_ear_os: null,
      left_ear_os: null,
      right_ear_ar: null,
      left_ear_ar: null,
      // created_ip_address : getRequiredFields().local_ip,
      // last_updated_ip_address : getRequiredFields().local_ip,
      // created_user_id : getRequiredFields().user_id,
      // last_modified_user_id : getRequiredFields().user_id
    },
    {
      audiometry_id: null,
      frequency: 4000,
      right_ear_os: null,
      left_ear_os: null,
      right_ear_ar: null,
      left_ear_ar: null,
      // created_ip_address : getRequiredFields().local_ip,
      // last_updated_ip_address : getRequiredFields().local_ip,
      // created_user_id : getRequiredFields().user_id,
      // last_modified_user_id : getRequiredFields().user_id
    },
    {
      audiometry_id: null,
      frequency: 8000,
      right_ear_os: null,
      left_ear_os: null,
      right_ear_ar: null,
      left_ear_ar: null,
      // created_ip_address : getRequiredFields().local_ip,
      // last_updated_ip_address : getRequiredFields().local_ip,
      // created_user_id : getRequiredFields().user_id,
      // last_modified_user_id : getRequiredFields().user_id
    }
  ];
  audiometry: Audiometry;
  
  patient_name = '';
  patient_id: any;
  aud_pat_code = '';
  patient_fname = "";
  patient_lname = ""; 
  private chart_left: am4charts.XYChart;
  private chart_right: am4charts.XYChart;
  message = "";
  nbr : any
  constructor(
    private patientService: PatientService,
    private audiometryService: AudiometryService,
    private sequenceService: SequenceService,
    private layoutUtilsService: LayoutUtilsService,
    private audFB: FormBuilder,
    private modalService: NgbModal,
   // private data: DataSharingService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router,
    private zone: NgZone) { }

  ngOnInit() {

    this.initChartLeft();
    this.initChartRight();
   // this.createForm()
  }
  initChartLeft() {
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("audiogram_left", am4charts.XYChart);
      chart.data = this.audiograms


      // Create axes
      let xAxes = chart.xAxes.push(new am4charts.CategoryAxis());
      xAxes.dataFields.category = "frequency";
      xAxes.title.text = "Frequence";
      xAxes.renderer.opposite = true;
      xAxes.renderer.grid.template.location = 0;
      xAxes.renderer.minGridDistance = 30;


      // Create value axis
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.inversed = true
      valueAxis.renderer.minGridDistance = 10
      valueAxis.min = 0
      valueAxis.max = 105

      let range = valueAxis.axisRanges.create();
      range.value = 0;
      range.endValue = 20;
      range.axisFill.fill = am4core.color("#BEFFC0");
      range.axisFill.fillOpacity = 0.8;
      range.grid.strokeOpacity = 0;
      range.label.inside = true;
      range.label.text = 'Audition normale';
      range.label.fill = am4core.color('#000000');
      range.label.fillOpacity = 0.4;
      range.label.align = 'left';


      let range1 = valueAxis.axisRanges.create();
      range1.value = 20;
      range1.endValue = 40;
      range1.axisFill.fill = am4core.color("#DFFFBE");
      range1.axisFill.fillOpacity = 0.8;
      range1.grid.strokeOpacity = 0;
      range1.label.inside = true;
      range1.label.text = 'perte auditive légère';
      range1.label.fill = am4core.color('#000000');
      range1.label.fillOpacity = 0.4;
      range1.label.align = 'left';


      let range2 = valueAxis.axisRanges.create();
      range2.value = 40;
      range2.endValue = 60;
      range2.axisFill.fill = am4core.color("#FFFFBF");
      range2.axisFill.fillOpacity = 0.8;
      range2.grid.strokeOpacity = 0;
      range2.label.inside = true;
      range2.label.text = 'perte auditive modérée';
      range2.label.fill = am4core.color('#000000');
      range2.label.fillOpacity = 0.4;
      range2.label.align = 'left';


      let range3 = valueAxis.axisRanges.create();
      range3.value = 60;
      range3.endValue = 80;
      range3.axisFill.fill = am4core.color("#FCE0BD");
      range3.axisFill.fillOpacity = 0.8;
      range3.grid.strokeOpacity = 0;
      range3.label.inside = true;
      range3.label.align = 'left';
      range3.label.text = 'perte auditive sévère';
      range3.label.fill = am4core.color('#000000');
      range3.label.fillOpacity = 0.4;

      let range4 = valueAxis.axisRanges.create();
      range4.value = 80;
      range4.endValue = 100;
      range4.axisFill.fill = am4core.color("#FCBEBE");
      range4.axisFill.fillOpacity = 0.8;
      range4.grid.strokeOpacity = 0;
      range4.label.inside = true;
      range4.label.text = 'surdité';
      range4.label.align = 'left';
      range4.label.fill = am4core.color('#000000');
      range4.label.fillOpacity = 0.4;

      // Create series
      let lineSeries = chart.series.push(new am4charts.LineSeries());
      lineSeries.dataFields.valueY = "left_ear_ar";
      lineSeries.dataFields.categoryX = "frequency";
      lineSeries.name = "Oreille Gauche aerienne";
      lineSeries.strokeWidth = 3;
      lineSeries.stroke = am4core.color('#0000FF');

      let lineSeries1 = chart.series.push(new am4charts.LineSeries());
      lineSeries1.dataFields.valueY = "left_ear_os";
      lineSeries1.dataFields.categoryX = "frequency";
      lineSeries1.name = "Oreille Gauche osseuse";
      lineSeries1.strokeWidth = 3;
      lineSeries1.stroke = am4core.color('#0000FF');

      // Add simple bullet
      let bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
      bullet.circle.radius = 6;
      bullet.circle.fill = am4core.color("#fff");
      bullet.circle.strokeWidth = 3;

      // Add simple bullet
      let bullet1 = lineSeries1.bullets.push(new am4charts.CircleBullet());
      bullet1.circle.radius = 6;
      bullet1.circle.fill = am4core.color("#000");
      bullet1.circle.strokeWidth = 3;


      chart.legend = new am4charts.Legend()

      this.chart_left = chart;
    });
  }

  initChartRight() {
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("audiogram_right", am4charts.XYChart);
      chart.data = this.audiograms


      // Create axes
      let xAxes = chart.xAxes.push(new am4charts.CategoryAxis());
      xAxes.dataFields.category = "frequency";
      xAxes.title.text = "Frequence";
      xAxes.renderer.opposite = true;
      xAxes.renderer.grid.template.location = 0;
      xAxes.renderer.minGridDistance = 30;


      // Create value axis
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.inversed = true
      valueAxis.renderer.minGridDistance = 10
      valueAxis.min = 0
      valueAxis.max = 105

      let range = valueAxis.axisRanges.create();
      range.value = 0;
      range.endValue = 20;
      range.axisFill.fill = am4core.color("#BEFFC0");
      range.axisFill.fillOpacity = 0.8;
      range.grid.strokeOpacity = 0;
      range.label.inside = true;
      range.label.text = 'Audition normale';
      range.label.fill = am4core.color('#000000');
      range.label.fillOpacity = 0.4;
      range.label.align = 'left';


      let range1 = valueAxis.axisRanges.create();
      range1.value = 20;
      range1.endValue = 40;
      range1.axisFill.fill = am4core.color("#DFFFBE");
      range1.axisFill.fillOpacity = 0.8;
      range1.grid.strokeOpacity = 0;
      range1.label.inside = true;
      range1.label.text = 'perte auditive légère';
      range1.label.fill = am4core.color('#000000');
      range1.label.fillOpacity = 0.4;
      range1.label.align = 'left';


      let range2 = valueAxis.axisRanges.create();
      range2.value = 40;
      range2.endValue = 60;
      range2.axisFill.fill = am4core.color("#FFFFBF");
      range2.axisFill.fillOpacity = 0.8;
      range2.grid.strokeOpacity = 0;
      range2.label.inside = true;
      range2.label.text = 'perte auditive modérée';
      range2.label.fill = am4core.color('#000000');
      range2.label.fillOpacity = 0.4;
      range2.label.align = 'left';


      let range3 = valueAxis.axisRanges.create();
      range3.value = 60;
      range3.endValue = 80;
      range3.axisFill.fill = am4core.color("#FCE0BD");
      range3.axisFill.fillOpacity = 0.8;
      range3.grid.strokeOpacity = 0;
      range3.label.inside = true;
      range3.label.align = 'left';
      range3.label.text = 'perte auditive sévère';
      range3.label.fill = am4core.color('#000000');
      range3.label.fillOpacity = 0.4;

      let range4 = valueAxis.axisRanges.create();
      range4.value = 80;
      range4.endValue = 100;
      range4.axisFill.fill = am4core.color("#FCBEBE");
      range4.axisFill.fillOpacity = 0.8;
      range4.grid.strokeOpacity = 0;
      range4.label.inside = true;
      range4.label.text = 'surdité';
      range4.label.align = 'left';
      range4.label.fill = am4core.color('#000000');
      range4.label.fillOpacity = 0.4;

      // Create series
      let lineSeries = chart.series.push(new am4charts.LineSeries());
      lineSeries.dataFields.valueY = "right_ear_ar";
      lineSeries.dataFields.categoryX = "frequency";
      lineSeries.name = "Oreille Droite aerienne";
      lineSeries.strokeWidth = 3;
      lineSeries.stroke = am4core.color('#D7786B');

      let lineSeries1 = chart.series.push(new am4charts.LineSeries());
      lineSeries1.dataFields.valueY = "right_ear_os";
      lineSeries1.dataFields.categoryX = "frequency";
      lineSeries1.name = "Oreille Droite osseuse";
      lineSeries1.strokeWidth = 3;
      lineSeries1.stroke = am4core.color('#D7786B');


      let bullet = lineSeries.bullets.push(new am4charts.Bullet());
      let square = bullet.createChild(am4core.Rectangle);
      square.width = 10;
      square.height = 10;
      square.horizontalCenter = "middle";
      square.verticalCenter = "middle";

      let bullet1 = lineSeries1.bullets.push(new am4charts.Bullet());
      let square1 = bullet1.createChild(am4core.Rectangle);
      square1.width = 10;
      square1.height = 10;
      square1.horizontalCenter = "middle";
      square1.verticalCenter = "middle";

      chart.legend = new am4charts.Legend()

      this.chart_right = chart;
    });
  }
  // getPatient() {
  //   var result
  //   this.patientService.getBy({ full_name: this.patient_name }).subscribe(
  //     res => result = res['data'],
  //     err => this.layoutUtilsService.showActionNotification('PATIENT avec ce nom n\'existe pas', MessageType.Delete, 5000, true, true),
  //     () => {
  //       if (result != null) {
  //         this.patient_id = result['id']
  //         this.patient_code = result['patient_code']
  //       } else {
  //         this.layoutUtilsService.showActionNotification('Patient avec ce nom n\'existe pas', MessageType.Delete, 5000, true, true)
  //       }
  //     }
  //   )
  // }
  
   createForm() {
      this.loadingSubject.next(false)
    
      this.audiometry = new Audiometry()
      this.aud_pat_code = null
      this.patient_fname = null
      this.patient_lname = null
      this.audForm = this.audFB.group({
          aud_pat_code: [this.audiometry.aud_pat_code, Validators.required],
          patient_fname: [
              { value: null, disabled: true },
          ],
          patient_lname: [
            { value: null, disabled: true },
        ],
        })

  }
  reset() {
    this.audiometry = new Audiometry()
    this.createForm()
   // this.hasFormErrors = false
    
  }
  printAudiogram() {
    let left_chart, right_chart;
    let popupWin;
    left_chart = document.getElementById('print-section-left').innerHTML;
    right_chart = document.getElementById('print-section-right').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto')
    popupWin.document.open()
    popupWin.document.write(`
    <html lang="en">

<head>
  <title></title>
  <style>
    @import url("https://fonts.googleapis.com/css?family=Open+Sans:400,400italic,600,700&subset=cyrillic,cyrillic-ext,latin,greek-ext,greek,latin-ext,vietnamese");

    html,
    body,
    div,
    span,
    applet,
    object,
    iframe,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    blockquote,
    pre,
    a,
    abbr,
    acronym,
    address,
    big,
    cite,
    code,
    del,
    dfn,
    em,
    img,
    ins,
    kbd,
    q,
    s,
    samp,
    small,
    strike,
    strong,
    sub,
    sup,
    tt,
    var,
    b,
    u,
    i,
    center,
    dl,
    dt,
    dd,
    ol,
    ul,
    li,
    fieldset,
    form,
    label,
    legend,
    table,
    caption,
    tbody,
    tfoot,
    thead,
    tr,
    th,
    td,
    article,
    aside,
    canvas,
    details,
    embed,
    figure,
    figcaption,
    footer,
    header,
    hgroup,
    menu,
    nav,
    output,
    ruby,
    section,
    summary,
    time,
    mark,
    audio,
    video {
      margin: 0;
      padding: 0;
      border: 0;
      font: inherit;
      font-size: 100%;
      vertical-align: baseline;
    }


    ol,
    ul {
      list-style: none;
    }

    table {
      border-collapse: collapse;
      border-spacing: 0;
    }

    caption,
    th,
    td {
      text-align: left;
      font-weight: normal;
      vertical-align: middle;
    }

    q,
    blockquote {
      quotes: none;
    }

    q:before,
    q:after,
    blockquote:before,
    blockquote:after {
      content: "";
      content: none;
    }

    a img {
      border: none;
    }

    article,
    aside,
    details,
    figcaption,
    figure,
    footer,
    header,
    hgroup,
    main,
    menu,
    nav,
    section,
    summary {
      display: block;
    }

    /* Invoice styles */
    /**
 * DON'T override any styles for the <html> and <body> tags, as this may break the layout.
 * Instead wrap everything in one main <div id="container"> element where you may change
 * something like the font or the background of the qo
 */
    html,
    body {
      /* MOVE ALONG, NOTHING TO CHANGE HERE! */
    }

    /** 
 * IMPORTANT NOTICE: DON'T USE '!important' otherwise this may lead to broken print layout.
 * Some browsers may require '!important' in oder to work properly but be careful with it.
 */
    .clearfix {
      display: block;
      clear: both;
    }

    .hidden {
      display: none;
    }

    b,
    strong,
    .bold {
      font-weight: bold;
    }

    .bold-client {
      font-weight: bold;
      font-size: 20px;
    }
    #container {
      font: normal 12px/1.2em 'Open Sans', Sans-serif;
      margin: 0 auto;

    }

    #memo .company-name {
      background: #8BA09E url("../img/arrows.png") 560px center no-repeat;
      background-size: 100px auto;
      padding: 10px 20px;
      position: relative;
      margin-bottom: 15px;
    }

    #memo .company-name span {
      color: white;
      display: inline-block;
      min-width: 20px;
      font-size: 36px;
      font-weight: bold;
      line-height: 1em;
    }

    #memo .company-name .right-arrow {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100px;
      background: url("../img/right-arrow.png") right center no-repeat;
      background-size: auto 60px;
    }

    #memo .logo {
      float: left;
      clear: left;
      margin-left: 20px;
    }

    #memo .logo img {
      width: 150px;
      height: 100px;
    }

    #memo .company-info {
      margin-left: 20px;
      float: left;
      font-size: 12px;
      color: #8b8b8b;
    }

    #memo .company-info div {
      margin-bottom: 3px;
      min-width: 20px;
    }

    #memo .company-info span {
      display: inline-block;
      min-width: 20px;
    }

    #memo:after {
      content: '';
      display: block;
      clear: both;
    }

    #invoice-info {
      float: right;
    }

    #invoice-info>div {
      float: right;
    }

    #invoice-info>div>span {
      display: block;
      min-width: 20px;
      min-height: 18px;

    }

    #invoice-info>div:last-child {
      margin-left: 20px;
    }

    #invoice-info:after {
      content: '';
      display: block;
      clear: both;
    }

    #client-info {
      float: left;
      min-width: 220px;
      text-align: left;
      margin-left: 10px;
      margin-right:10px;
    }

    #client-info>div {
      margin-bottom: 3px;
    }

    #client-info span {
      display: block;
      min-width: 20px;
    }

    #invoice-title-number {
      text-align: center;
      margin: 20px 0;
    }

    #invoice-title-number span {
      display: inline-block;
      min-width: 20px;
    }

    #invoice-title-number #title {
      margin-right: 15px;
      text-align: right;
      font-size: 20px;
      font-weight: bold;
    }

    #invoice-title-number #number {
      font-size: 15px;
      text-align: left;
    }

    .center{
      margin:auto;
      width:50%;
      padding:10px;
    }
    .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col,
    .col-auto, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm,
    .col-sm-auto, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md,
    .col-md-auto, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg,
    .col-lg-auto, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl,
    .col-xl-auto {
      position: relative;
      width: 100%;
      padding-right: 10px;
      padding-left: 10px; }
    .col-lg-6 {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 40%;
      flex: 0 0 40%;
      max-width: 40%; }
    .row {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      margin-right: -10px;
      margin-left: -10px; }
    .table {
      border-collapse: collapse !important; }
      .table td,
      .table th {
        background-color: #fff !important; }
    .table-bordered th,
    .table-bordered td {
      border: 1px solid #dee2e6 !important; }
    .table-dark {
      color: inherit; }
      .table-dark th,
      .table-dark td,
      .table-dark thead th,
      .table-dark tbody + tbody {
        border-color: #ebedf2; }
    .table .thead-dark th {
      color: inherit;
      border-color: #ebedf2; } 
    #items {
      margin: 20px 0 35px 0;
    }

    #items .first-cell,
    #items table th:first-child,
    #items table td:first-child {
      width: 18px;
      text-align: left;
    }

    #items table {
      border-collapse: separate;
      width: 100%;
    }

    #items table th {
      padding: 12px 10px;
      background: #E6E7E7;
      border-bottom: 4px solid #487774;
    }
    #items table th:nth-child(1) {
      text-align: left;
    }
    #items table th:nth-child(2) {
      text-align: left;
    }
    #items table th:nth-child(3) {
      text-align: left;
      width: 40%;
    }
    #items table th:nth-child(4) {
      text-align: right;
    }

    #items table th:nth-child(5) {
      text-align: right;
    }

    #items table th:last-child {
      text-align: right;
      padding-right: 20px !important;
    }

    #items table td {
      padding: 15px 10px;
      border-right: 1px solid #CCCCCF;
    }
    #items table td:nth-child(1) {
      text-align: left;
    }
    #items table td:nth-child(2) {
      text-align: left;
    }
    #items table td:nth-child(3) {
      text-align: left;
      width: 40%;
    }
    #items table td:nth-child(4) {
      text-align: right;
    }

    #items table td:nth-child(5) {
      text-align: right;
    }

    #items table td:last-child {
      text-align: right;
      padding-right: 20px !important;
    }
    #items table td:first-child {
      text-align: left;
      border-right: 0 !important;
    }

    #items table td:nth-child(2) {
      text-align: left;
    }

    #items table td:last-child {
      border-right: 0 !important;
      padding-right: 20px !important;
    }

    .currency {
      border-bottom: 4px solid #487774;
      padding: 0 20px;
    }

    .currency span {
      font-size: 11px;
      font-style: italic;
      color: #8b8b8b;
      display: inline-block;
      min-width: 20px;
    }

    #sums {
      float: right;
      background: #8BA09E url("../img/left-arrow.png") -17px bottom no-repeat;
      background-size: auto 100px;
      color: white;
    }

    #sums table tr th,
    #sums table tr td {
      min-width: 100px;
      padding: 8px 20px 8px 35px;
      text-align: right;
      font-weight: 600;
    }

    #sums table tr th {
      text-align: left;
      padding-right: 25px;
    }

    #sums table tr.amount-total th {
      text-transform: uppercase;
    }

    #sums table tr.amount-total th,
    #sums table tr.amount-total td {
      font-size: 16px;
      font-weight: bold;
    }

    #sums table tr:last-child th {
      text-transform: uppercase;
    }

    #sums table tr:last-child th,
    #sums table tr:last-child td {
      font-size: 16px;
      font-weight: bold;
      padding-top: 20px !important;
      padding-bottom: 40px !important;
    }

    #terms {
      margin: 50px 20px 10px 20px;
    }

    #terms>span {
      display: inline-block;
      min-width: 20px;
      font-weight: bold;
    }

    #terms>div {
      margin-top: 10px;
      min-height: 50px;
      min-width: 50px;
    }

    .payment-info {
      margin: 0 20px;
    }

    .payment-info span {
      display: inline-block;
      min-width: 20px;
      font-weight: bold;
    }

    .payment-info div {
      font-size: 12px;
      color: #8b8b8b;
      display: inline-block;
      min-width: 20px;
    }

    .ib_bottom_row_commands {
      margin: 10px 0 0 20px !important;
    }

    .ibcl_tax_value:before {
      color: white !important;
    }
    #footer {
      position: absolute;
      bottom: 1;
      width: 100%;
      height: 4 rem;            /* Footer height */
    }
    hr {
      border: 3px solid #8BA09E;
      }
    @media print {
      @page {size: A4 ; }
      html, body {
          height: 100%;
          page-break-after: avoid;
          page-break-before: avoid;
      }
      @import url("https://fonts.googleapis.com/css?family=Open+Sans:400,400italic,600,700&subset=cyrillic,cyrillic-ext,latin,greek-ext,greek,latin-ext,vietnamese");

    html,
    body,
    div,
    span,
    applet,
    object,
    iframe,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    blockquote,
    pre,
    a,
    abbr,
    acronym,
    address,
    big,
    cite,
    code,
    del,
    dfn,
    em,
    img,
    ins,
    kbd,
    q,
    s,
    samp,
    small,
    strike,
    strong,
    sub,
    sup,
    tt,
    var,
    b,
    u,
    i,
    center,
    dl,
    dt,
    dd,
    ol,
    ul,
    li,
    fieldset,
    form,
    label,
    legend,
    table,
    caption,
    tbody,
    tfoot,
    thead,
    tr,
    th,
    td,
    article,
    aside,
    canvas,
    details,
    embed,
    figure,
    figcaption,
    footer,
    header,
    hgroup,
    menu,
    nav,
    output,
    ruby,
    section,
    summary,
    time,
    mark,
    audio,
    video {
      margin: 0;
      padding: 0;
      border: 0;
      font: inherit;
      font-size: 100%;
      vertical-align: baseline;
    }


    ol,
    ul {
      list-style: none;
    }

    table {
      border-collapse: collapse;
      border-spacing: 0;
    }

    caption,
    th,
    td {
      text-align: left;
      font-weight: normal;
      vertical-align: middle;
    }

    q,
    blockquote {
      quotes: none;
    }

    q:before,
    q:after,
    blockquote:before,
    blockquote:after {
      content: "";
      content: none;
    }

    a img {
      border: none;
    }

    article,
    aside,
    details,
    figcaption,
    figure,
    footer,
    header,
    hgroup,
    main,
    menu,
    nav,
    section,
    summary {
      display: block;
    }

    /* Invoice styles */
    /**
 * DON'T override any styles for the <html> and <body> tags, as this may break the layout.
 * Instead wrap everything in one main <div id="container"> element where you may change
 * something like the font or the background of the qo
 */
    html,
    body {
      /* MOVE ALONG, NOTHING TO CHANGE HERE! */
    }

    /** 
 * IMPORTANT NOTICE: DON'T USE '!important' otherwise this may lead to broken print layout.
 * Some browsers may require '!important' in oder to work properly but be careful with it.
 */
    .clearfix {
      display: block;
      clear: both;
    }

    .hidden {
      display: none;
    }

    b,
    strong,
    .bold {
      font-weight: bold;
    }

    .bold-client {
      font-weight: bold;
      font-size: 20px;
    }
    #container {
      font: normal 12px/1.2em 'Open Sans', Sans-serif;
      margin: 0 auto;

    }

  
   
   
    #client-info {
      float: left;
      min-width: 220px;
      text-align: left;
      margin-left: 10px;
      margin-right:10px;
    }

    #client-info>div {
      margin-bottom: 3px;
    }

    #client-info span {
      display: block;
      min-width: 20px;
    }

    #aud-info {
      float: left;
      min-width: 320px;
      text-align: left;
      margin-left: 5px;
      margin-right:5px;
    }

   

   
    .center{
      margin:auto;
      width:50%;
      padding:10px;
    }
    .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col,
    .col-auto, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm,
    .col-sm-auto, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md,
    .col-md-auto, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg,
    .col-lg-auto, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl,
    .col-xl-auto {
      position: relative;
      width: 100%;
      padding-right: 10px;
      padding-left: 10px; }
    .col-lg-6 {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 40%;
      flex: 0 0 40%;
      max-width: 40%; }
    .row {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      margin-right: -10px;
      margin-left: -10px; }
    .table {
      border-collapse: collapse !important; }
      .table td,
      .table th {
        background-color: #fff !important; }
    .table-bordered th,
    .table-bordered td {
      border: 1px solid #dee2e6 !important; }
    .table-dark {
      color: inherit; }
      .table-dark th,
      .table-dark td,
      .table-dark thead th,
      .table-dark tbody + tbody {
        border-color: #ebedf2; }
    .table .thead-dark th {
      color: inherit;
      border-color: #ebedf2; } 
    #items {
      margin: 20px 0 35px 0;
    }

    #items .first-cell,
    #items table th:first-child,
    #items table td:first-child {
      width: 18px;
      text-align: left;
    }

    #items table {
      border-collapse: separate;
      width: 100%;
    }

    #items table th {
      padding: 12px 10px;
      background: #E6E7E7;
      border-bottom: 4px solid #487774;
    }
    #items table th:nth-child(1) {
      text-align: left;
    }
    #items table th:nth-child(2) {
      text-align: left;
    }
    #items table th:nth-child(3) {
      text-align: left;
      width: 40%;
    }
    #items table th:nth-child(4) {
      text-align: right;
    }

    #items table th:nth-child(5) {
      text-align: right;
    }

    #items table th:last-child {
      text-align: right;
      padding-right: 20px !important;
    }

    #items table td {
      padding: 15px 10px;
      border-right: 1px solid #CCCCCF;
    }
    #items table td:nth-child(1) {
      text-align: left;
    }
    #items table td:nth-child(2) {
      text-align: left;
    }
    #items table td:nth-child(3) {
      text-align: left;
      width: 40%;
    }
    #items table td:nth-child(4) {
      text-align: right;
    }

    #items table td:nth-child(5) {
      text-align: right;
    }

    #items table td:last-child {
      text-align: right;
      padding-right: 20px !important;
    }
    #items table td:first-child {
      text-align: left;
      border-right: 0 !important;
    }

    #items table td:nth-child(2) {
      text-align: left;
    }

    #items table td:last-child {
      border-right: 0 !important;
      padding-right: 20px !important;
    }

    .currency {
      border-bottom: 4px solid #487774;
      padding: 0 20px;
    }

    

    
   

    
    #footer {
      position: absolute;
      bottom: 1;
      width: 100%;
      height: 4 rem;            /* Footer height */
    }
    hr {
      border: 3px solid #8BA09E;
      }
  }

</style>
</head>

<body >
  <div id="container">
    <section id="memo">

      <div class="logo">
      <img src="../../../assets/media/logos/companylogo.png"  >
      </div>

      <div class="company-info">

      </div>

    </section>


    <section id="client-info">
      <div>
        <span class="bold-client">LE CLIENT : ${this.patient_lname}  ${this.patient_fname} </span>
      </div>

      <!--div>
        <span>Code Client : ${this.aud_pat_code}</span>
      </div-->

    </section>

    <section id="invoice-info">
    <div>
      <span class="bold-client">LE:  ${this.datePipe.transform(new Date(), 'dd-MM-yyy')}</span>

    </div>

  </section>

    <div class="clearfix"></div>

    <section id="invoice-title-number">

      <span id="title">Audiometrie</span>

    </section>

    <div class="clearfix"></div>

    <section id="client-info">
    <div class="row">
    <table class="col-lg-3 table table-bordered table-hover">
    <thead>
      <tr>
        <th>Frequence</th>
        <th>125 Hz</th>
        <th>250 Hz</th>
        <th>500 Hz</th>
        <th>1000 Hz</th>
        <th>2000 Hz</th>
        <th>4000 Hz</th>
        <th>8000 Hz</th>

      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Oreille droite</th>
        <td>${this.audiograms[0]['right_ear_os']}</td>
        <td>${this.audiograms[1]['right_ear_os']}</td>
        <td>${this.audiograms[2]['right_ear_os']}</td>
        <td>${this.audiograms[3]['right_ear_os']}</td>
        <td>${this.audiograms[4]['right_ear_os']}</td>
        <td>${this.audiograms[5]['right_ear_os']}</td>
        <td>${this.audiograms[6]['right_ear_os']}</td>

      </tr>
      <tr>
        <th scope="row">Oreille gauche</th>
        <td>${this.audiograms[0]['left_ear_os']}</td>
        <td>${this.audiograms[1]['left_ear_os']}</td>
        <td>${this.audiograms[2]['left_ear_os']}</td>
        <td>${this.audiograms[3]['left_ear_os']}</td>
        <td>${this.audiograms[4]['left_ear_os']}</td>
        <td>${this.audiograms[5]['left_ear_os']}</td>
        <td>${this.audiograms[6]['left_ear_os']}</td>
      </tr>
    </tbody>
  </table>
  <div class="col-lg-2 space"></div>
  <table class="col-lg-3 table table-bordered table-hover">
    <thead>
      <tr>
        <th>Frequence</th>
        <th>125 Hz</th>
        <th>250 Hz</th>
        <th>500 Hz</th>
        <th>1000 Hz</th>
        <th>2000 Hz</th>
        <th>4000 Hz</th>
        <th>8000 Hz</th>

      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Oreille droite</th>
        <td>${this.audiograms[0]['right_ear_ar']}</td>
        <td>${this.audiograms[1]['right_ear_ar']}</td>
        <td>${this.audiograms[2]['right_ear_ar']}</td>
        <td>${this.audiograms[3]['right_ear_ar']}</td>
        <td>${this.audiograms[4]['right_ear_ar']}</td>
        <td>${this.audiograms[5]['right_ear_ar']}</td>
        <td>${this.audiograms[6]['right_ear_ar']}</td>

      </tr>
      <tr>
        <th scope="row">Oreille gauche</th>
        <td>${this.audiograms[0]['left_ear_ar']}</td>
        <td>${this.audiograms[1]['left_ear_ar']}</td>
        <td>${this.audiograms[2]['left_ear_ar']}</td>
        <td>${this.audiograms[3]['left_ear_ar']}</td>
        <td>${this.audiograms[4]['left_ear_ar']}</td>
        <td>${this.audiograms[5]['left_ear_ar']}</td>
        <td>${this.audiograms[6]['left_ear_ar']}</td>
      </tr>
    </tbody>
  </table>
    </div>
    <section id="aud-info">
    <div>
    ${left_chart}
    </div>
  <br>
  <div>
  ${right_chart}
  </div>

</section>

    </section>
    
  </div>

</body>
<script>
setTimeout(function(){window.print();window.close()},2000)
</script>
</html>
    `
    );
    popupWin.document.close();


  }
  // addVisit() {
  //   this.loading = true;
  //   this.audiometry = new Audiometry();
  //   this.audiometry.clear()
  //   this.audiometry.patient_id = this.patient_id;
  //   this.audiometry.audiometry_date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  //   // this.audiometry.created_ip_address = getRequiredFields().local_ip;
  //   // this.audiometry.last_updated_ip_address = getRequiredFields().local_ip;
  //   // this.audiometry.created_user_id = getRequiredFields().user_id;
  //   // this.audiometry.last_modified_user_id = getRequiredFields().user_id;
  //   const message = `La visite est ajoutée avec succés.`;
  //   this.patientService.addVisit({ audiometry: this.audiometry, audiograms: this.audiograms }).subscribe(
  //     res => console.log(res),
  //     err => {
  //       this.layoutUtilsService.showActionNotification('erreur', MessageType.Delete, 5000, true, true);
  //       this.loading = false
  //     },
  //     () => {
  //       setTimeout(() => {
  //         this.printAudiogram();
  //         this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
  //         this.loading = false;
  //         this.addAudiometryInvoice();
  //         this.router.navigateByUrl('/demo1/index');
  //       }, 0);
  //     }
  //   )
  // }
  // addAudiometryInvoice() {
  //   let result;
  //   this.invoicingService.getProductByCode('AUDIOMETRIE').subscribe(
  //     res => result = res['data'],
  //     err => this.layoutUtilsService.showActionNotification('Produit avec ce code n\'existe pas', MessageType.Delete, 5000, true, true),
  //     () => {
  //       if (result != null) {
  //         this.invoice = new DailySale();
  //         this.invoice.clear();
  //         this.invoice.patient_id = this.patient_id;
  //         this.invoice.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  //         this.invoice.total_price_ht = result['unit_price']
  //         this.invoice.created_ip_address = getRequiredFields().local_ip;
  //         this.invoice.last_updated_ip_address = getRequiredFields().local_ip;
  //         this.invoice.created_user_id = getRequiredFields().user_id;
  //         this.invoice.last_modified_user_id = getRequiredFields().user_id;
  //         let detail = [];
  //         let item = {}
  //         item['line_number'] = 1;
  //         item['daily_sale_id'] = null;
  //         item['product_id'] = result['id'];
  //         item['serial_number'] = '';
  //         item['quantity'] = 1;
  //         item['discount'] = 0;
  //         item['total_price'] = result['unit_price'];
  //         item['created_ip_address'] = getRequiredFields().local_ip;
  //         item['last_updated_ip_address'] = getRequiredFields().local_ip;
  //         item['created_user_id'] = getRequiredFields().user_id;
  //         item['last_modified_user_id'] = getRequiredFields().user_id;

  //         detail.push(item);
  //         this.invoicingService.addDailySale({ daily_sale: this.invoice, details: detail, delivery_form: false }).subscribe(
  //           res => result = res,
  //           err => {
  //             this.loading = false
  //           },
  //           () => {
  //             this.loading = false;
  //           }
  //         )

  //       } else {
  //         this.layoutUtilsService.showActionNotification('Produit avec ce code n\'existe pas', MessageType.Delete, 5000, true, true)
  //       }
  //     }
  //   )
  // }
 

  refreshData() {
    this.chart_left.data = this.audiograms;
    this.chart_right.data = this.audiograms;
  }
  goBack() {
    this.loadingSubject.next(false)
    const url = `/patient/create-audiometry`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

  onChangePatient() {
   
    const pat_code = this.aud_pat_code;
    
    this.patientService.getBy({ pat_code }).subscribe(
      (res: any) => {
  console.log(res.data)
        if (res.data.length == 0) {
  
            alert("Patient n'existe pas  ")
            this.aud_pat_code = null;
            document.getElementById("aud_pat_code").focus();
          } else {
            this.patient_fname = res.data[0].pat_fname 
            this.patient_lname = res.data[0].pat_lname 

          }
      
      });
  }
  
  handleSelectedRowsChangedpat(e, args) {
   // const controls = this.audForm.controls;
    if (Array.isArray(args.rows) && this.gridObjpat) {
        args.rows.map((idx) => {
            const item = this.gridObjpat.getDataItem(idx)
            console.log(item)
            // TODO : HERE itterate on selected field and change the value of the selected field
            this.aud_pat_code = item.pat_code        
            this.patient_fname = item.pat_fname 
            this.patient_lname = item.pat_lname

        })
    }
}
  angularGridReadypat(angularGrid: AngularGridInstance) {
    this.angularGridpat = angularGrid
    this.gridObjpat = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridpat() {
  
  this.columnDefinitionspat= [
            
      {
        id: "id",
        field: "id",
        name:"id",
        minWidth: 50,
        maxWidth: 50,
      },
      
      {
          id: "pat_code",
          name: "Code Patient",
          field: "pat_code",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "pat_fname",
        name: "Nom",
        field: "pat_fname",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pat_lname",
        name: "Prénom",
        field: "pat_lname",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pat_birth_date",
        name: "Date Naissance",
        field: "pat_birth_date",
        sortable: true,
        filterable: true,
        type: FieldType.dateIso,
      },
      {
        id: "int01",
        name: "Age",
        field: "int01",
        sortable: true,
        filterable: true,
        type: FieldType.integer,
      },

      {
        id: "pat_sex",
        name: "Sexe",
        field: "pat_sex",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pat_blood",
        name: "Groupe Sangun",
        field: "pat_blood",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pat_phone",
        name: "Tel",
        field: "pat_phone",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pat_fax",
        name: "Fax",
        field: "pat_fax",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pat_email",
        name: "Email",
        field: "pat_email",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pat_city",
        name: "commune",
        field: "pat_city",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pat_state",
        name: "Wilaya",
        field: "pat_state",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    
      {
          id: "pat_contact_fname",
          name: "Contact Nom",
          field: "pat_contact_fname",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "pat_contact_lname",
        name: "Contact Prenom",
        field: "pat_contact_lname",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pat_contact_tel",
        name: "Contact Tél",
        field: "pat_contact_tel",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pat_parent_liaison",
        name: "Lien",
        field: "pat_parent_liaison",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      
        
    ]

    this.gridOptionspat = {
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
      checkboxSelector: {
        // optionally change the column index position of the icon (defaults to 0)
        // columnIndexPosition: 1,

        // remove the unnecessary "Select All" checkbox in header when in single selection mode
        hideSelectAllCheckbox: true,

        // you can override the logic for showing (or not) the expand icon
        // for example, display the expand icon only on every 2nd row
        // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
      },
      multiSelect: false,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true,
      },
    }  

    // fill the dataset with your data
    this.patientService
        .getAll()
        .subscribe((response: any) => {this.datapat = response.data
        console.log(response.data)})
}
openpat(content) {
   
    this.prepareGridpat()
    this.modalService.open(content, { size: "xl" })
}


  onSubmit() {
    this.loading = true;
    this.audiometry = new Audiometry();
  
    this.audiometry.aud_pat_code = this.aud_pat_code;
    this.audiometry.aud_date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  
    console.log(this.audiograms)
    for (let data of this.audiograms) {
    
      delete data.audiometry_id;
    
     
    }
    this.sequenceService.getByOne({ seq_type: "LP" }).subscribe(
      (response: any) => {
    this.seq = response.data
    console.log(this.seq)   
        if (this.seq) {
         this.nbr = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`
         console.log(this.seq.seq_prefix)
         console.log(this.seq.seq_curr_val)
         
        console.log(this.nbr)
         const id = Number(this.seq.id)
      let obj = { }
      obj = {
        seq_curr_val: Number(this.seq.seq_curr_val )+1
      }
      this.sequenceService.update(id , obj ).subscribe(
        (reponse) => console.log("response", Response),
        (error) => {
          this.message = "Erreur modification Sequence";
          return;
     
        
        },
        )
      }else {
        this.message = "Parametrage Monquant pour la sequence";
      
        return;
   
       }

   let audiometry =  this.prepareAudiometry()
    this.addAudiometry(audiometry,this.audiograms)
    })
  }

  
  prepareAudiometry(): Audiometry {
   
    const _audiometry = new Audiometry()
     _audiometry.aud_code = this.nbr
    _audiometry.aud_pat_code = this.aud_pat_code
   

    return _audiometry
}
  addAudiometry( _audiometry: Audiometry,details: any) {
   // const controls = this.audForm.controls
    this.loadingSubject.next(true)
    console.log(details)
    this.audiometryService.add({ audiometry:_audiometry,audiogram: details }).subscribe(
        (reponse) => console.log("response", Response),
        (error) => {
            this.layoutUtilsService.showActionNotification(
                "Erreur verifier les informations",
                MessageType.Create,
                10000,
                true,
                true
            )
            this.loadingSubject.next(false)
        },
        () => {
            this.layoutUtilsService.showActionNotification(
                "Ajout avec succès",
                MessageType.Create,
                10000,
                true,
                true
            )
            this.printAudiogram();
            this.loadingSubject.next(false)
            this.reset()
            this.router.navigateByUrl("/patient/create-audiometry")
            this.reset()
        }
    )
}

}

