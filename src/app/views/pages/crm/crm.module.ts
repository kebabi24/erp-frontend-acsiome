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

// Material
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

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



import { AgendaComponent } from './agenda/agenda.component';
import { CRMComponent } from './crm.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AddresseMobileService, CustomerMobileService ,CustomerService, PosCategoryService,CRMService,CodeService,ItemService,LocationDetailService } from '../../../core/erp';
import { FullCalendarModule,CalendarOptions } from '@fullcalendar/angular';
import { CategoryAddComponent } from './param-add/param-add.component';
import { PopulationAddComponent } from './population-add/population-add.component';
import { ListEventsComponent } from './list-events/list-events.component';


const routes: Routes = [
        {
            path: "agenda",
            component: AgendaComponent,
        },
        {
          path: "param-add",
          component: CategoryAddComponent,
        },
        {
          path: "population-add",
          component: PopulationAddComponent,
        },
 {
          path: "list-events",
          component: ListEventsComponent,
        },
        
          
]
@NgModule({
  declarations: [
        CRMComponent,  
        AgendaComponent,
        CategoryAddComponent,
        PopulationAddComponent,
        ListEventsComponent,
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
        MatButtonModule,
        RouterModule.forChild(routes),
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        FullCalendarModule,
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
    PosCategoryService,
    CRMService,
    CodeService,
    ItemService,
    LocationDetailService,
    CustomerService,
  ],
  entryComponents: [
        ActionNotificationComponent,
        DeleteEntityDialogComponent,
        FetchEntityDialogComponent,
        UpdateStatusDialogComponent,
  ],
})
export class CRMModule { }
