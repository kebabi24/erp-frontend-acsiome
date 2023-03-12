import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ProfilesMobileComponent } from "./profiles-mobile.component"
import { CreateProfileMobileComponent } from "./create-profile-mobile/create-profile-mobile.component"
import { ProfilesMobileListComponent } from "./profiles-list-mobile/profiles-list-mobile.component"

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
import { MatButtonModule } from "@angular/material/button"
import { MatTabsModule } from "@angular/material/tabs"
//bootsrap
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"

import { environment } from "../../../../environments/environment"
import {
    NgbProgressbarModule,
    NgbProgressbarConfig,
} from "@ng-bootstrap/ng-bootstrap"
import { NgxPermissionsModule } from "ngx-permissions"
import { AngularSlickgridModule } from "angular-slickgrid"
import { UsersMobileService } from "../../../core/erp"
import { TreeModule } from '@circlon/angular-tree-component';
import { EditProfileMobileComponent } from './edit-profile-mobile/edit-profile-mobile.component';
import { MobileMenuService,ItemService } from 'src/app/core/erp';
import { ProfileProductsPagesAssignComponent } from "./profile-ppage-assign/profile-ppages-assign.component"

const routes: Routes = [
    {
        path: "create-profile-mobile",
        component: CreateProfileMobileComponent,
    },
    {
        path: "profiles-list-mobile",
        component: ProfilesMobileListComponent,
    },
    {
        path: "edit-profile-mobile/:id",
        component: EditProfileMobileComponent,
    },
    {
        path: "assign-profile-products-pages",
        component: ProfileProductsPagesAssignComponent,
    },
]

@NgModule({
    declarations: [
        ProfilesMobileComponent,
        CreateProfileMobileComponent,
        ProfilesMobileListComponent,
        EditProfileMobileComponent,
        ProfileProductsPagesAssignComponent
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
        TreeModule,
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
        UsersMobileService,
        MobileMenuService,
        ItemService,
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
export class ProfilesModule {}
