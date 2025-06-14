import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ArticlesComponent } from "./articles.component"
import { ListComponent } from "./list/list.component"
import { CreateComponent } from "./create/create.component"
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
import { EditComponent } from "./edit/edit.component"
import { AngularSlickgridModule } from 'angular-slickgrid';

import {CodeService,
         ItemService,
         ItemModelService,
         SiteService, 
         SequenceService,
         LocationService, 
         ProviderService ,
         ProductLineService, 
         MesureService, 
         CostSimulationService, 
         InventoryStatusService,
         TaxeService,
         CustomerMobileService
        } from '../../../core/erp';
import { EditCostComponent } from './edit-cost/edit-cost.component'
import { ProductPageCreateComponent } from "./product-page-create/product-page-create.component";
import { CreateSpecComponent } from './create-spec/create-spec.component';
import { ListUpdateComponent } from './list-update/list-update.component';
import { UpdateComponent } from './update/update.component';
import { CreateModComponent } from './create-mod/create-mod.component';
import { ListModComponent } from './list-mod/list-mod.component';
import { EditModComponent } from './edit-mod/edit-mod.component';
import { UpdateModComponent } from './update-mod/update-mod.component';
import { CreateItemModComponent } from './create-item-mod/create-item-mod.component';
import { CreateStdItemComponent } from './create-std-item/create-std-item.component';
import { ListStdUpdateComponent } from './list-std-update/list-std-update.component';
import { EditStdItemComponent } from './edit-std-item/edit-std-item.component';
import { CreateModBobineComponent } from './create-mod-bobine/create-mod-bobine.component';
import { CreateBobineModComponent } from './create-bobine-mod/create-bobine-mod.component';
import { CreateModMpComponent } from './create-mod-mp/create-mod-mp.component';
import { CreateMpModComponent } from './create-mp-mod/create-mp-mod.component';
import { CreateModMaterielComponent } from './create-mod-materiel/create-mod-materiel.component';
import { CreateMaterielModComponent } from './create-materiel-mod/create-materiel-mod.component';
import { CreateModPfComponent } from './create-mod-pf/create-mod-pf.component';
import { CreatePfModComponent } from './create-pf-mod/create-pf-mod.component';
import { CreateModDivComponent } from './create-mod-div/create-mod-div.component';
import { CreateDivModComponent } from './create-div-mod/create-div-mod.component'
import { ListCopieComponent } from './list-copie/list-copie.component';
import { CopieArticleComponent } from './copie-article/copie-article.component';
import { EditProductpageComponent } from './edit-productpage/edit-productpage.component';
import { CreateModImmobilierComponent } from './create-mod-immobilier/create-mod-immobilier.component';
import { CreateImmobilierModComponent } from './create-immobilier-mod/create-immobilier-mod.component'


const routes: Routes = [
    {
        path: "",
        component: ArticlesComponent,
        // canActivate: [ModuleGuard],
        // data: { moduleName: 'ecommerce' },
        children: [
            {
                path: "list",
                component: ListComponent,
            },
            {
                path: "list-update",
                component: ListUpdateComponent,
            },
            {
                path: "add",
                component: CreateComponent,
            },
            {
                path: "create-spec",
                component: CreateSpecComponent,
            },
            {
                path: "edit/:id",
                component: EditComponent,
            },
            {
                path: "update/:id",
                component: UpdateComponent,
            },
            {
                path: "edit-cost",
                component: EditCostComponent,
            },
            {
                path: "page",
                component: ProductPageCreateComponent,
            },
            {
                path: "create-mod",
                component: CreateModComponent,
            },
            {
                path: "create-mod-bobine",
                component: CreateModBobineComponent,
            },
            {
                path: "create-mod-materiel",
                component: CreateModMaterielComponent,
            },
            {
                path: "create-mod-immobilier",
                component: CreateModImmobilierComponent,
            },
            {
                path: "create-mod-pf",
                component: CreateModPfComponent,
            },
            {
                path: "create-mod-mp",
                component: CreateModMpComponent,
            },
            {
                path: "create-mod-div",
                component: CreateModDivComponent,
            },
            {
                path: "list-mod",
                component: ListModComponent,
            },
            {
                path: "edit-mod/:id",
                component: EditModComponent,
            },
            {
                path: "update-mod",
                component: UpdateModComponent,
            },
            {
                path: "create-mp-mod",
                component: CreateMpModComponent,
            },
            
            {
                path: "create-div-mod",
                component: CreateDivModComponent,
            },
            {
                path: "create-materiel-mod",
                component: CreateMaterielModComponent,
            },
            {
                path: "create-immobilier-mod",
                component: CreateImmobilierModComponent,
            },
            {
                path: "create-pf-mod",
                component: CreatePfModComponent,
            },
            {
                path: "create-bobine-mod",
                component: CreateBobineModComponent,
            },
            {
                path: "create-std-item",
                component: CreateStdItemComponent,
            },
            {
                path: "edit-std-item/:id",
                component: EditStdItemComponent,
            },
            {
                path: "list-std-update",
                component: ListStdUpdateComponent,
            },
            {
                path: "list-copie",
                component: ListCopieComponent,
            },
            {
                path: "copie-article/:id",
                component: CopieArticleComponent,
            },
            {
                path: "edit-productpage/:product_page_code",
                component: EditProductpageComponent,
            },

        ],
    },
]

@NgModule({
    declarations: [
        ArticlesComponent,
        ListComponent,
        CreateComponent,
        EditComponent,
        EditCostComponent,
        ProductPageCreateComponent,
        CreateSpecComponent,
        ListUpdateComponent,
        UpdateComponent,
        CreateModComponent,
        ListModComponent,
        EditModComponent,
        UpdateModComponent,
        CreateItemModComponent,
        CreateStdItemComponent,
        ListStdUpdateComponent,
        EditStdItemComponent,
        CreateModBobineComponent,
        CreateBobineModComponent,
        CreateModMpComponent,
        CreateMpModComponent,
        CreateModMaterielComponent,
        CreateMaterielModComponent,
        CreateModPfComponent,
        CreatePfModComponent,
        CreateModDivComponent,
        CreateDivModComponent,
        ListCopieComponent,
        CopieArticleComponent,
        EditProductpageComponent,
        CreateModImmobilierComponent,
        CreateImmobilierModComponent,
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
        CodeService,
        SiteService,
        LocationService,
        ProductLineService,
        SequenceService,
        ProviderService,
        ItemService,
        MesureService,
        TaxeService,
        InventoryStatusService,
        CostSimulationService,
        CustomerMobileService,
        ItemModelService,
    ],

    entryComponents: [
        ActionNotificationComponent,
        DeleteEntityDialogComponent,
        FetchEntityDialogComponent,
        UpdateStatusDialogComponent,
    ],
})
export class ArticlesModule {}
