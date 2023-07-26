import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransportComponent } from './transport.component';
import { CreateCostComponent } from './create-cost/create-cost.component';
import { ListCostComponent } from './list-cost/list-cost.component';
import { EditCostComponent } from './edit-cost/edit-cost.component';
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
import { PartialsModule } from "../../partials/partials.module"
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

import {AccountService, AddressService, CodeService, CostlistService, DeviseService, ProjectService, ProviderService, SiteService, TaxeService, TransportcostService} 
from '../../../core/erp';
import { ListEditCostComponent } from './list-edit-cost/list-edit-cost.component';


import { CreateCostlistComponent } from './create-costlist/create-costlist.component';
import { EditCostlistComponent } from './edit-costlist/edit-costlist.component';
import { ListCostlistComponent } from './list-costlist/list-costlist.component';
import { ListEditCostlistComponent } from './list-edit-costlist/list-edit-costlist.component';
import { CreateTransporterComponent } from './create-transporter/create-transporter.component';
import { EditTransporterComponent } from './edit-transporter/edit-transporter.component';
import { ListTransporterComponent } from './list-transporter/list-transporter.component';
import { ListEditTransporterComponent } from './list-edit-transporter/list-edit-transporter.component';
const routes: Routes = [
  {
    path: 'create-cost',
    component: CreateCostComponent
  },
  {
    path: 'list-cost',
    component: ListCostComponent
  },
  {
    path: 'list-edit-cost',
    component: ListEditCostComponent
  },
  {
    path: 'edit-cost/:id',
    component: EditCostComponent
  },

  {
    path: 'create-costlist',
    component: CreateCostlistComponent
  },
  {
    path: 'list-costlist',
    component: ListCostlistComponent
  },
  {
    path: 'list-edit-costlist',
    component: ListEditCostlistComponent
  },
  {
    path: 'edit-costlist/:id',
    component: EditCostlistComponent
  },

  {
    path: 'create-transporter',
    component: CreateTransporterComponent
  },
  {
    path: 'list-transporter',
    component: ListTransporterComponent
  },
  {
    path: 'list-edit-transporter',
    component: ListEditTransporterComponent
  },
  {
    path: 'edit-transporter/:id',
    component: EditTransporterComponent
  },
] 

@NgModule({
  declarations: [TransportComponent, CreateCostComponent, ListCostComponent, EditCostComponent, ListEditCostComponent, CreateCostlistComponent, ListCostlistComponent, ListEditCostlistComponent,EditCostlistComponent, CreateTransporterComponent, EditTransporterComponent, ListTransporterComponent, ListEditTransporterComponent],
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
  TransportcostService,
  CostlistService,
  TaxeService,
  ProjectService,
  AccountService,
  DeviseService,
  CodeService,
  SiteService,
  TypesUtilsService,
  LayoutUtilsService,
  AddressService,
  ProviderService
],
entryComponents: [
  ActionNotificationComponent,
  DeleteEntityDialogComponent,
  FetchEntityDialogComponent,
  UpdateStatusDialogComponent,
],
})
export class TransportModule { }
