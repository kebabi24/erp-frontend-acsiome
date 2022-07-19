import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateNewMenuComponent } from './create-new-menu/create-new-menu.component';
import { RouterModule, Routes } from '@angular/router';
import { AgmCoreModule } from '@agm/core';



import { ActionNotificationComponent, DeleteEntityDialogComponent, FetchEntityDialogComponent, UpdateStatusDialogComponent } from '../../partials/content/crud';
import { ModuleGuard } from "../../../core/auth"
import { HttpUtilsService, InterceptService, LayoutUtilsService, TypesUtilsService } from 'src/app/core/_base/crud';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PartialsModule } from '../../partials/partials.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TreeModule } from '@circlon/angular-tree-component';
import { environment } from 'src/environments/environment';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeApiService } from 'src/app/core/_base/layout';
import { MobileMenuService } from 'src/app/core/erp';

const routes: Routes = [
  {
      path: "create-new-menu",
      component: CreateNewMenuComponent,
  },
]

@NgModule({
  declarations: [CreateNewMenuComponent],
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
    AgmCoreModule.forRoot({
      apiKey: ''
    }),
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
    MobileMenuService,
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
export class MobileMenuModule { }
