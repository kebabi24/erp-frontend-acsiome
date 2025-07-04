import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceSettingComponent } from './price-setting.component';
import { CreatePriceComponent } from './create-price/create-price.component';
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
import { ListPriceComponent } from './list-price/list-price.component';
import { EditPriceComponent } from './edit-price/edit-price.component';
import { ItemService, CodeService, PriceListQuantityService,
  CustomerService, DeviseService, PricelistService,SiteService,LocationService} from '../../../core/erp';
import { CreatePriceImmobilierComponent } from './create-price-immobilier/create-price-immobilier.component';
  
import { CreatePriceQuantityComponent } from './create-price-quantity/create-price-quantity.component';
import { ListPriceQuantityComponent } from './list-price-quantity/list-price-quantity.component';
import { EditPriceQuantityComponent } from './edit-price-quantity/edit-price-quantity.component';

const routes: Routes = [
  {
    path: 'create-price',
    component: CreatePriceComponent
  },
  {
    path: 'create-price-immobilier',
    component: CreatePriceImmobilierComponent
  },
  {
    path: 'list-price',
    component: ListPriceComponent
  },
  {
    path: 'edit-price/:id',
    component: EditPriceComponent
  },
  {
    path: 'create-price-quantity',
    component: CreatePriceQuantityComponent
  },
  {
    path: 'list-price-quantity',
    component: ListPriceQuantityComponent
  },
  {
    path: 'edit-price-quantity/:id',
    component: EditPriceQuantityComponent
  },
] 

@NgModule({
  declarations: [PriceSettingComponent, CreatePriceComponent, ListPriceComponent, EditPriceComponent, CreatePriceImmobilierComponent, CreatePriceQuantityComponent, ListPriceQuantityComponent, EditPriceQuantityComponent],
  
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
  CodeService,
  ItemService,
  CustomerService,
  DeviseService,
  PricelistService,
  SiteService,
  LocationService,
  PriceListQuantityService,
],
})

export class PriceSettingModule { }
