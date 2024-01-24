import { array } from '@amcharts/amcharts4/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"

import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { MobileServiceService, MobileService, RoleService, ItineraryService,LoadRequestService, UsersMobileService } from "../../../../core/erp"
import {   MobileSettingsService} from "../../../../core/erp"
import jsPDF from 'jspdf';
import { NumberToLetters } from 'src/app/core/erp/helpers/numberToString';
import {
  Column,
  GridOption,
  Formatter,
  Formatters,
  Editor,
  Editors,
  FieldType,
  OnEventArgs,
  FilterMultiplePassType,
  FilterMultiplePassTypeString,
  Filters,
  OperatorType,
  CaseType,
  CompoundDateFilter
} from "angular-slickgrid"
@Component({
  selector: 'kt-list-diff-loadrequest',
  templateUrl: './list-diff-loadrequest.component.html',
  styleUrls: ['./list-diff-loadrequest.component.scss']
})
export class ListDiffLoadrequestComponent implements OnInit {
  soForm: FormGroup;
  // slick grid
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;
  user;
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private soFB: FormBuilder,
      private layoutUtilsService: LayoutUtilsService,
      private loadRequestService: LoadRequestService,
  ) {
      
  }

  ngOnInit(): void {
    this.user =  JSON.parse(localStorage.getItem('user'))
    console.log(this.user)
    this.createForm();
    this.prepareGrid()
    this.solist();
  }
  solist() {
    this.dataset = []
   
    const controls = this.soForm.controls
    const date = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
  
    const date1 = controls.calc_date1.value
    ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
    : null;
    
    let obj= {date,date1}
    this.loadRequestService.getLoadRequestsLineDiff(obj).subscribe(
      (response: any) => {this.dataset = response.data
      console.log(response.data)
      },
      (error) => {
          this.dataset = []
      },
      () => {}
  )
  }
  createForm() {
    this.loadingSubject.next(false);
    const date = new Date;
    
    this.soForm = this.soFB.group({
     // po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],
    
     
      calc_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: 1
      }],
      calc_date1: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
    });
  }
 
  prepareGrid() {
      this.columnDefinitions = [
        {
          id: "date_creation",
          name: "Date creation",
          field: "date_creation",
          sortable: true,
          minWidth: 100,
          maxWidth: 300,
          filterable: true,
          type: FieldType.date,
      },
     
      
      {
          id: "line",
          name: "Ligne",
          field: "line",
          sortable: true,
          minWidth: 100,
          maxWidth: 300,
          filterable: true,
          type: FieldType.string, 
      },
      {
        id: "product_code",
        name: "Code produit",
        field: "product_code",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string, 
      },


      // 
      {
          id: "product_desc",
          name: "Desc produit",
          field: "product_desc",
          sortable: true,
          minWidth: 100,
          maxWidth: 300,
          filterable: true,
          type: FieldType.string, 
      },

      {
        id: "role_code",
        name: "Role",
        field: "role_code",
        sortable: true,
       
        filterable: true,
        type: FieldType.string, 
      },
      {
        id: "user_mobile_code",
        name: "Vendeur",
        field: "user_mobile_code",
        sortable: true,
       
        filterable: true,
        type: FieldType.string, 
      },
      {
        id: "role_loc",
        name: "Camion",
        field: "role_loc",
        sortable: true,
       
        filterable: true,
        type: FieldType.string, 
      },
      {
        id: "qt_request",
        name: "QTE demandee",
        field: "qt_request",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.integer, 
      },

      {
        id: "qt_validated",
        name: "QTE valide",
        field: "qt_validated",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.integer, 
      },

      {
        id: "qt_effected",
        name: "QTE Effectuée",
        field: "qt_effected",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.integer, 
      },

    

]

      this.gridOptions = {
          enableSorting: true,
          enableCellNavigation: true,
          enableExcelCopyBuffer: true,
          enableFiltering: true,
          autoEdit: false,
          autoHeight: true,
          enableAutoResize:true,
       
          
      }

      // fill the dataset with your data
      this.dataset = []
      console.log(this.user)
    const controls = this.soForm.controls
    const date = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
  
    const date1 = controls.calc_date1.value
    ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
    : null;
    console.log(date,controls.calc_date.value,date1)
   
    let obj= {date,date1}
      this.loadRequestService.getLoadRequestsLineDiff(obj).subscribe(
          (response: any) => {this.dataset = response.data
          console.log(response.data)
          },
          (error) => {
              this.dataset = []
          },
          () => {}
      )
  }
}
