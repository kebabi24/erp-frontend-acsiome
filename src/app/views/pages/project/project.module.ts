import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProjectComponent } from "./project.component";
import { CreateProjectComponent } from "./create-project/create-project.component";
import { ListProjectComponent } from "./list-project/list-project.component";
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

import {  WorkCenterService,ProjectService, TaskService, ItemService, ProviderService, CustomerService, BomService, CostSimulationService, LocationDetailService, InventoryStatusService, MesureService, SiteService, LocationService, InventoryTransactionService, PsService, SaleOrderService, RequisitionService, EmployeService, AddReportService, SequenceService, DeviseService, QualityControlService, AffectEmpService, DealService } from "../../../core/erp";

import { ListPmComponent } from "./list-pm/list-pm.component";
import { AddReportComponent } from "./add-report/add-report.component";
import { SensibilisationComponent } from "./sensibilisation/sensibilisation.component";
import { IdentificationComponent } from "./identification/identification.component";

import { AssignEmployeeComponent } from "./assign-employee/assign-employee.component";
import { LaunchProjectComponent } from "./launch-project/launch-project.component";
import { EmpTempComponent } from "./emp-temp/emp-temp.component";
import { AssetDownComponent } from "./asset-down/asset-down.component";
import { AccidentIncidentComponent } from "./accident-incident/accident-incident.component";
import { UpdateProjectComponent } from "./update-project/update-project.component";
import { ListEmpTempComponent } from "./list-emp-temp/list-emp-temp.component";
import { UpdateStatusProjectComponent } from './update-status-project/update-status-project.component';
import { EditProjectComponent } from "./edit-project/edit-project.component";
import { ReviewCustomerReqComponent } from "./review-customer-req/review-customer-req.component";
import { BusinessMonitoringSheetComponent } from "./business-monitoring-sheet/business-monitoring-sheet.component";

const routes: Routes = [
  {
    path: "create-project",
    component: CreateProjectComponent,
  },
  {
    path: "list-project",
    component: ListProjectComponent,
  },
  {
    path: "update-project",
    component: UpdateProjectComponent,
  },
  {
    path: "list-pm",
    component: ListPmComponent,
  },
  {
    path: "edit-project/:id",
    component: EditProjectComponent,
  },
  {
    path: "list-emp-temp",
    component: ListEmpTempComponent,
  },
  {
    path: "emp-temp",
    component: EmpTempComponent,
  },
  {
    path: "add-report",
    component: AddReportComponent,
  },
  {
    path: "sensibilisation",
    component: SensibilisationComponent,
  },
  {
    path: "identification",
    component: IdentificationComponent,
  },
  {
    path: "launch-project",
    component: LaunchProjectComponent,
  },
  {
    path: "asset-down",
    component: AssetDownComponent,
  },
  {
    path: "accident-incident",
    component: AccidentIncidentComponent,
  },
  {
    path: "update-status-project",
    component: UpdateStatusProjectComponent,
  },

  {    path: "review-customer-req",
  component: ReviewCustomerReqComponent,
},
{
  path: "business-monitoring-sheet",
  component: BusinessMonitoringSheetComponent,
},
];

@NgModule({
  declarations: [ ProjectComponent, CreateProjectComponent, ListProjectComponent, AccidentIncidentComponent, AssetDownComponent, ListPmComponent, AddReportComponent, AssignEmployeeComponent, LaunchProjectComponent, EmpTempComponent, UpdateProjectComponent, SensibilisationComponent, IdentificationComponent, ListEmpTempComponent, EditProjectComponent, UpdateStatusProjectComponent,ReviewCustomerReqComponent, BusinessMonitoringSheetComponent],

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
    WorkCenterService,
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
    InventoryTransactionService,
    TypesUtilsService,
    LayoutUtilsService,
  ],
  entryComponents: [ActionNotificationComponent, DeleteEntityDialogComponent, FetchEntityDialogComponent, UpdateStatusDialogComponent],
})
export class ProjectModule {}
