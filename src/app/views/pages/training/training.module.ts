import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingComponent } from './training.component';
import { CreateTrainingComponent } from './create-training/create-training.component';
import { ListTrainingComponent } from './list-training/list-training.component';
import { EditTrainingComponent } from './edit-training/edit-training.component';
import { CreateTrainingDomainComponent } from './create-training-domain/create-training-domain.component';
import { CreateTrainingSectionComponent } from './create-training-section/create-training-section.component';
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
         JobService,
         CustomerMobileService
        } from '../../../core/erp';
import { UpdateTrainingComponent } from './update-training/update-training.component';
import { ListSectionComponent } from './list-section/list-section.component';
import { ListDomainComponent } from './list-domain/list-domain.component';

    const routes: Routes = [
     
          
              {
                  path: "list-training",
                  component: ListTrainingComponent,
              },
              {
                  path: "create-training",
                  component: CreateTrainingComponent,
              },
              
              {
                  path: "edit-training/:id",
                  component: EditTrainingComponent,
              },
              {
                path: "create-training-domain",
                component: CreateTrainingDomainComponent,
              },
              {
                path: "create-training-section",
                component: CreateTrainingSectionComponent,
              },
              {
                path: "list-domain",
                component: ListDomainComponent,
              },
              {
                path: "list-section",
                component: ListSectionComponent,
              },
              {
                path: "update-training",
                component: UpdateTrainingComponent,
            },
         
  ]
  


@NgModule({
  declarations: [TrainingComponent, CreateTrainingComponent, ListTrainingComponent, EditTrainingComponent, CreateTrainingDomainComponent, CreateTrainingSectionComponent, UpdateTrainingComponent, ListSectionComponent, ListDomainComponent],
  
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
    JobService,
],

entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
],
})
export class TrainingModule { }
