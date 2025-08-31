import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ProvidersComponent } from "./providers.component"
import { ProvidersListComponent } from "./providers-list/providers-list.component"
import { ProvidersEditComponent } from "./providers-edit/providers-edit.component"
import { ProvidersCreateComponent } from "./providers-create/providers-create.component"
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
import {
    NgbProgressbarModule,
    NgbProgressbarConfig,
} from "@ng-bootstrap/ng-bootstrap"
import { NgxPermissionsModule } from "ngx-permissions"

//Service 

import {PurchaseOrderService, AddressService, CodeService, ProviderService, AccountService, TaxeService, DeviseService, SequenceService, RepertoryService, JobService,SiteService, CustomerService} from '../../../core/erp';
import { ItempurchasebyproviderListComponent } from './itempurchasebyprovider-list/itempurchasebyprovider-list.component';
import { ProviderActivitylistComponent } from './provider-activitylist/provider-activitylist.component';
import { ProviderCAlistComponent } from './provider-calist/provider-calist.component'

import {BankService} from '../../../core/erp';
import { BalanceGeneraleComponent } from './balance-generale/balance-generale.component';
import { CreateRepComponent } from './create-rep/create-rep.component';
import { ListRepComponent } from './list-rep/list-rep.component';
import { CreateStdProviderComponent } from './create-std-provider/create-std-provider.component';
import { CreateRepJobComponent } from './create-rep-job/create-rep-job.component';
import { ProviderActivitiesComponent } from './provider-activities/provider-activities.component';
import { ProviderSettingsComponent } from './provider-settings/provider-settings.component';
import { ProviderSettingsListComponent } from './provider-settings-list/provider-settings-list.component';
import { ProviderSettingsEditComponent } from './provider-settings-edit/provider-settings-edit.component';
import { EditStdProviderComponent } from './edit-std-provider/edit-std-provider.component';
import { ListStdProviderComponent } from './list-std-provider/list-std-provider.component'


const routes: Routes = [
    {
        path: "",
        component: ProvidersComponent,
        // canActivate: [ModuleGuard],
        // data: { moduleName: 'ecommerce' },
        children: [
            {
                path: "list",
                component: ProvidersListComponent,
            },
            {
                path: "add",
                component: ProvidersCreateComponent,
            },
            {
                path: "edit/:id",
                component: ProvidersEditComponent,
            },
            {
	            path: "itembyproviderlist",
	            component: ItempurchasebyproviderListComponent,
            },
            {
	            path: "provider-activitylist",
	            component: ProviderActivitylistComponent,
            },
            {
	            path: "provider-calist",
	            component: ProviderCAlistComponent,
            },
            {
	            path: "provider-balancelist",
	            component: BalanceGeneraleComponent,
            },
            {
	            path: "create-rep",
	            component: CreateRepComponent,
            },
            {
	            path: "list-rep",
	            component: ListRepComponent,
            },
            {
	            path: "create-std-provider",
	            component: CreateStdProviderComponent,
            },
            {
	            path: "create-rep-job",
	            component: CreateRepJobComponent,
            },
            {
	            path: "provider-activities",
	            component: ProviderActivitiesComponent,
            },
            {
	            path: "provider-settings",
	            component: ProviderSettingsComponent,
            },
            {
	            path: "provider-settings-list",
	            component: ProviderSettingsListComponent,
            },
            {
	            path: "provider-settings-edit/:id",
	            component: ProviderSettingsEditComponent,
            },
            {
                path: "edit-std-provider/:id",
                component: EditStdProviderComponent,
            },
            {
	            path: "list-std-provider",
	            component: ListStdProviderComponent,
            },
        ],
    },
]

@NgModule({
    declarations: [
        ProvidersComponent,
        ProvidersListComponent,
        ProvidersEditComponent,
        ProvidersCreateComponent,
        ItempurchasebyproviderListComponent,
        ProviderActivitylistComponent,
        ProviderCAlistComponent,
        BalanceGeneraleComponent,
        CreateRepComponent,
        ListRepComponent,
        CreateStdProviderComponent,
        CreateRepJobComponent,
        ProviderActivitiesComponent,
        ProviderSettingsComponent,
        ProviderSettingsListComponent,
        ProviderSettingsEditComponent,
        EditStdProviderComponent,
        ListStdProviderComponent,
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
        AddressService,
        TaxeService,
        CodeService,
        AccountService,
        ProviderService,
        PurchaseOrderService,
        BankService,
        DeviseService,
        SequenceService,
        RepertoryService,
        JobService,
        SiteService,
        CustomerService,
    ],
    entryComponents: [
        ActionNotificationComponent,
        DeleteEntityDialogComponent,
        FetchEntityDialogComponent,
        UpdateStatusDialogComponent,
    ],
})
export class ProvidersModule {}
