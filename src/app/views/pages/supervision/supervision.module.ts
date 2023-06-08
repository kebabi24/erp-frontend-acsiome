// Angular
import { NgModule } from '@angular/core';
// Core Module
import { ValidateChargeDemandeComponent } from './validate-charge-demande/validate-charge-demande.component';
import { TransferChargeDemandeToDeliveryComponent } from './transfer-charge-demande-to-delivery/transfer-charge-demande-delivery.component';

// Angular


import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { SupervisionComponent } from './supervision.component';
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

import { ItineraryService, MobileServiceService, RoleService, UsersMobileService ,MobileSettingsService, LoadRequestService,
  UnloadRequestService } from "../../../core/erp"
import { ValidateDeChargeDemandeComponent } from './validate-decharge-demande/validate-decharge-demande.component';



const routes: Routes = [
  {
    path: 'validate-charge-demande',
    component: ValidateChargeDemandeComponent
  },
  {
    path: 'transfer-charge-demande-delivery',
    component: TransferChargeDemandeToDeliveryComponent
  },
  {
    path: 'validate-decharge-demande',
    component: ValidateDeChargeDemandeComponent
  },

  
  
] 
@NgModule({
  declarations: [ ValidateChargeDemandeComponent,TransferChargeDemandeToDeliveryComponent,ValidateDeChargeDemandeComponent],
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
    UsersMobileService,
    MobileServiceService,
    MobileSettingsService,
    RoleService,
    ItineraryService,
    TypesUtilsService,
    LayoutUtilsService,
    HttpUtilsService,
    TypesUtilsService,
    LayoutUtilsService,
    LoadRequestService,
    UnloadRequestService,
],
 
})
export class SupervisionModule {}
