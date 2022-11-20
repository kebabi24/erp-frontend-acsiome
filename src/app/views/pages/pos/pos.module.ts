import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PosComponent } from "./pos.component";
import { RouterModule, Routes } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { PartialsModule } from "../../partials/partials.module";
import { NgxPermissionsModule } from "ngx-permissions";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { AngularSlickgridModule } from "angular-slickgrid";
import { MatMenuModule } from "@angular/material/menu";
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TreeModule } from "angular-tree-component";
import { environment } from "src/environments/environment";
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { FakeApiService } from "src/app/core/_base/layout";
import { ModuleGuard } from "src/app/core/auth";
import {
  HttpUtilsService,
  InterceptService,
  LayoutUtilsService,
  TypesUtilsService,
} from "src/app/core/_base/crud";
import {
  ActionNotificationComponent,
  DeleteEntityDialogComponent,
  FetchEntityDialogComponent,
  UpdateStatusDialogComponent,
} from "../../partials/content/crud";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  EmployeService,
  MobileServiceService,
  PosCategoryService,
} from "../../../core/erp";

const routes: Routes = [
  {
    path: "",
    component: PosComponent,
  },
];

@NgModule({
  declarations: [PosComponent],
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
    PosCategoryService,
    MobileServiceService,
    EmployeService,
    TypesUtilsService,
    LayoutUtilsService,
    HttpUtilsService,
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
export class PosModule {}
