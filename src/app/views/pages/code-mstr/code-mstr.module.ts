import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { CodeMstrComponent } from "./code-mstr.component"
import { CreateComponent } from "./create/create.component"
import { ListComponent } from "./list/list.component"
import { EditComponent } from "./edit/edit.component"
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
import {CodeService} from '../../../core/erp';
import { CreateDocComponent } from './create-doc/create-doc.component';
import { ListDocComponent } from './list-doc/list-doc.component';
import { EditDocComponent } from './edit-doc/edit-doc.component';
import { EpiCreateClassificationComponent } from './epi-create-classification/epi-create-classification.component';
import { EpiListClassificationComponent } from './epi-list-classification/epi-list-classification.component';
import { EpiEditClassificationComponent } from './epi-edit-classification/epi-edit-classification.component'

const routes: Routes = [
    {
        path: "create-code",
        component: CreateComponent,
    },
    {
        path: "edit-code/:id",
        component: EditComponent,
    },
    {
        path: "codes-list",
        component: ListComponent,
    },
    {
        path: "create-doc",
        component: CreateDocComponent,
    },
    {
        path: "edit-doc/:id",
        component: EditDocComponent,
    },
    {
        path: "list-doc",
        component: ListDocComponent,
    },
    {
        path: "epi-create-classification",
        component: EpiCreateClassificationComponent,
    },
    {
        path: "epi-edit-classification/:id",
        component: EpiEditClassificationComponent,
    },
    {
        path: "epi-list-classification",
        component: EpiListClassificationComponent,
    },
]

@NgModule({
    declarations: [
        CodeMstrComponent,
        CreateComponent,
        ListComponent,
        EditComponent,
        CreateDocComponent,
        ListDocComponent,
        EditDocComponent,
        EpiCreateClassificationComponent,
        EpiListClassificationComponent,
        EpiEditClassificationComponent,
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
        CodeService,
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
export class CodeMstrModule {}
