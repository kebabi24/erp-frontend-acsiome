import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
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
import { AngularSlickgridModule } from 'angular-slickgrid';

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

import { ListCustomerMobileComponent } from './list-customer-mobile/list-customer-mobile.component';
import { CreateCustomerMobileComponent } from './create-customer-mobile/create-customer-mobile.component';
import { CustomersMobileComponent } from './customers-mobile.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AddresseMobileService, CustomerMobileService , MobileSettingsService,} from '../../../core/erp';
import { EditCustomerMobileComponent } from './edit-customer-mobile/edit-customer-mobile.component';
import { ClusterCreateComponent } from './cluster-create/cluster-create.component';
import { CategoryCreateComponent } from './category-create/category-create.component';
import { SubClusterCreateComponent } from './cluster-sub-create/cluster-sub-create.component';
import { CategoryTypeCreateComponent } from './category-type-create/category-type-create.component';
import { SalesChannelCreateComponent } from './sales-channel-create/sales-channel-create.component';

const routes: Routes = [
          {
              path: "list-customer-mobile",
              component: ListCustomerMobileComponent,
          },
          {
              path: "create-customer-mobile",
              component: CreateCustomerMobileComponent,
          },
          {
            path: "edit-customer-mobile/:id",
            component: EditCustomerMobileComponent,
          },
          {
              path :"cluster-create",
              component : ClusterCreateComponent,
            },
            {
              path :"category-create",
              component : CategoryCreateComponent,
            },
            {
              path :"cluster-sub-create",
              component : SubClusterCreateComponent,
            },
            {
              path :"category-type-create",
              component : CategoryTypeCreateComponent,
            },
            {
              path :"sales-channels-create",
              component : SalesChannelCreateComponent,
            }
]
@NgModule({
  declarations: [
        CustomersMobileComponent,
        ListCustomerMobileComponent,
        CreateCustomerMobileComponent,
        EditCustomerMobileComponent,
        ClusterCreateComponent,
        CategoryCreateComponent,
        SubClusterCreateComponent,
        CategoryTypeCreateComponent,
        SalesChannelCreateComponent,
        
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
    CustomerMobileService,
    AddresseMobileService,
    MobileSettingsService,
  ],
  entryComponents: [
        ActionNotificationComponent,
        DeleteEntityDialogComponent,
        FetchEntityDialogComponent,
        UpdateStatusDialogComponent,
  ],
})
export class CustomersMobileModule { }
