import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealComponent } from './deal.component';
import { CreateDealComponent } from './create-deal/create-deal.component';


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
import {CodeService, DealService} from '../../../core/erp';
import { ListDealComponent } from './list-deal/list-deal.component';








const routes: Routes = [
  {
    path: 'create-deal',
    component: CreateDealComponent
  },
  {
    path: 'list-deal',
    component: ListDealComponent
  },
  // {
  //   path: 'edit-devise/:id',
  //   component: EditDeviseComponent
  // },
  // {
  //   path: 'exchange-rate',
  //   component: ExchangeRateComponent
  // },
  
] 


@NgModule({
  declarations: [DealComponent, CreateDealComponent, ListDealComponent],
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
    DealService,
    CodeService,
    TypesUtilsService,
    LayoutUtilsService,
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
],
entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
],
})
export class DealModule { }
