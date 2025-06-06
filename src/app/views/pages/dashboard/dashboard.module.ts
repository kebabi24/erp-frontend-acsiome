// Angular
import { NgModule } from '@angular/core';
// Core Module
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';

// Angular


import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from "@angular/router"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
// Fake API Angular-in-memory
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api"
// Translate Module
import { TranslateModule } from "@ngx-translate/core"
// NGRX
import { StoreModule } from "@ngrx/store"
import { EffectsModule } from "@ngrx/effects"
// UI

// Core
import { FakeApiService } from "../../../core/_base/layout"
// Auth
import { ModuleGuard } from "../../../core/auth"

// Core => Utils
import {
    HttpUtilsService,
    TypesUtilsService,
    InterceptService,
    LayoutUtilsService,
} from "../../../core/_base/crud"
// Shared
import {
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
} from "../../partials/content/crud"

// Material
import { MatMenuModule } from "@angular/material/menu"
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from "@angular/material/tabs"
//bootsrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from "../../../../environments/environment"
import {
    NgbProgressbarModule,
    NgbProgressbarConfig,
} from "@ng-bootstrap/ng-bootstrap"
import { NgxPermissionsModule } from "ngx-permissions"
import { AngularSlickgridModule } from 'angular-slickgrid'
import { CRMDashboardComponent } from './crm-dashboard/crm-dashboard.component';
import { CommercialDashboardComponent } from './commercial-dashboard/commercial-dashboard.component';

import { CRMService ,DashboardCommercialService } from '../../../core/erp';
import { DdDashboardComponent } from './dd-dashboard/dd-dashboard.component';
import { SalesDashboardComponent } from './sales-dashboard/sales-dashboard.component';



const routes: Routes = [
  {
    path: 'manager-dashboard',
    component: ManagerDashboardComponent
  },
  {
    path: 'crm-dashboard',
    component: CRMDashboardComponent
  },
  {
    path: 'commercial-dashboard',
    component: CommercialDashboardComponent
  },
  {
    path: 'dd-dashboard',
    component: DdDashboardComponent
  },
  {
    path: 'sales-dashboard',
    component: SalesDashboardComponent
  },
  
] 
@NgModule({
  declarations: [
    DashboardComponent, 
    ManagerDashboardComponent,
    CRMDashboardComponent,
    CommercialDashboardComponent,
    DdDashboardComponent,
    SalesDashboardComponent
  ],
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
    MatButtonModule,
    NgbModule,
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
    TypesUtilsService,
    LayoutUtilsService,
    CRMService,
    DashboardCommercialService
],
 
})
export class DashboardModule {
}
