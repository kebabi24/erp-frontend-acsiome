import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientComponent } from './patient.component';
import { CreatePatientComponent } from './create-patient/create-patient.component';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { ListPatientComponent } from './list-patient/list-patient.component';
import { UpdatePatientComponent } from './update-patient/update-patient.component';

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
import {CodeService,PatientService,SiteService,UsersService,AssociationService, DoctorService} from '../../../core/erp';
import { CreateAssComponent } from './create-ass/create-ass.component';
import { ListAssComponent } from './list-ass/list-ass.component';
import { UpdateAssComponent } from './update-ass/update-ass.component';
import { EditAssComponent } from './edit-ass/edit-ass.component';
import { CreateDoctorComponent } from './create-doctor/create-doctor.component';
import { EditDoctorComponent } from './edit-doctor/edit-doctor.component';
import { ListDoctorComponent } from './list-doctor/list-doctor.component'
import { UpdateDoctorComponent } from './update-doctor/update-doctor.component'

const routes: Routes = [
  {
      path: "create-patient",
      component: CreatePatientComponent,
  },
  {
      path: "edit-patient/:id",
      component: EditPatientComponent,
  },
  {
      path: "list-patient",
      component: ListPatientComponent,
  },
  {
    path: "update-patient",
    component: UpdatePatientComponent,
  },
  {
    path: "create-ass",
    component: CreateAssComponent,
  },
  {
    path: "edit-ass/:id",
    component: EditAssComponent,
  },
  {
    path: "list-ass",
    component: ListAssComponent,
  },
  {
    path: "update-ass",
    component: UpdateAssComponent,
  },

  {
    path: "create-doctor",
    component: CreateDoctorComponent,
  },
  {
    path: "edit-doctor/:id",
    component: EditDoctorComponent,
  },
  {
    path: "list-doctor",
    component: ListDoctorComponent,
  },
  {
    path: "update-doctor",
    component: UpdateDoctorComponent,
  },
]
@NgModule({
  declarations: [PatientComponent, CreatePatientComponent, EditPatientComponent, ListPatientComponent, UpdatePatientComponent, CreateAssComponent, ListAssComponent, UpdateAssComponent, EditAssComponent, CreateDoctorComponent, EditDoctorComponent, ListDoctorComponent,UpdateDoctorComponent],
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
    PatientService,
    SiteService,
    UsersService,
    AssociationService,
    DoctorService,
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

export class PatientModule { }
