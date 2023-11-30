import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { QualityAssuranceComponent } from "./quality-assurance.component";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
// Fake API Angular-in-memory
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
// Translate Module
import { TranslateModule } from "@ngx-translate/core";
// NGRX
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
// UI
import { PartialsModule } from "../../partials/partials.module";
// Core
import { FakeApiService } from "../../../core/_base/layout";
// Auth
import { ModuleGuard } from "../../../core/auth";
import { MatRadioModule } from "@angular/material/radio";
// Core => Utils
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService } from "../../../core/_base/crud";
// Shared

import { ActionNotificationComponent, DeleteEntityDialogComponent, FetchEntityDialogComponent, UpdateStatusDialogComponent } from "../../partials/content/crud";

// Material
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
//bootsrap
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { environment } from "../../../../environments/environment";
import { NgbProgressbarModule, NgbProgressbarConfig } from "@ng-bootstrap/ng-bootstrap";
import { NgxPermissionsModule } from "ngx-permissions";
import { AngularSlickgridModule } from "angular-slickgrid";

import {ProjectService, TaskService, ItemService,ProviderService,WorkOrderService, CustomerService,BomService, CostSimulationService,
  LocationDetailService,InventoryStatusService,MesureService, SiteService, LocationService, InventoryTransactionService,
        PsService,SaleOrderService,PurchaseOrderService, RequisitionService, EmployeService,AddReportService, SequenceService, DeviseService, 
        QualityControlService, AffectEmpService, DealService,ToolService,WorkCenterService
      } 
from '../../../core/erp';


import { ControlResultsEntryComponent } from "./control-results-entry/control-results-entry.component";
import { AddControlParamaterComponent } from "./add-control-param/add-control-param.component";
import { CreateGammeComponent } from "./create-gamme/create-gammme.component";

const routes: Routes = [
 
 
 
  {
    path: "control-results-entry",
    component: ControlResultsEntryComponent,
  },
  {
    path: "add-control-parameter",
    component: AddControlParamaterComponent,

  },
  {
    path: "create-gamme",
    component: CreateGammeComponent,
  }
  
  // 


   
 
  
];

@NgModule({
  declarations: [QualityAssuranceComponent,  ControlResultsEntryComponent , AddControlParamaterComponent ,CreateGammeComponent],

  imports: [
    CommonModule,
    HttpClientModule,
    PartialsModule,
    NgxPermissionsModule.forChild(),
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    AngularSlickgridModule.forRoot(),
    MatMenuModule,
    MatTabsModule,
    NgbModule,
    MatRadioModule,
    MatButtonModule,
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService, {
          passThruUnknownUrl: true,
          dataEncapsulation: false,
        })
      : [],
  ],
  providers: [
    ModuleGuard,
    InterceptService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true,
    },

    TypesUtilsService,
    LayoutUtilsService,
    HttpUtilsService,
    ProjectService,
    TaskService,
    ItemService,
    CustomerService,
    ProviderService,
    BomService,
    PsService,
    EmployeService,
    AffectEmpService,
    DealService,
    AddReportService,
    SaleOrderService,
    QualityControlService,
    SequenceService,
    RequisitionService,
    CostSimulationService,
    LocationDetailService,
    InventoryStatusService,
    LocationService,
    MesureService,
    SiteService,
    DeviseService,
    WorkOrderService,
    InventoryTransactionService,
    TypesUtilsService,
    LayoutUtilsService,
    QualityControlService,
    PurchaseOrderService,
    ToolService,
    WorkCenterService,
  ],
  entryComponents: [ActionNotificationComponent, DeleteEntityDialogComponent, FetchEntityDialogComponent, UpdateStatusDialogComponent],
})
export class QualityAssuranceModule {}
