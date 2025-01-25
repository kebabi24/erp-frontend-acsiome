// Angular
import { NgModule } from "@angular/core";
import { AgmCoreModule } from "@agm/core";
// Core Module
import { ValidateChargeDemandeComponent } from "./validate-charge-demande/validate-charge-demande.component";
import { TransferChargeDemandeToDeliveryComponent } from "./transfer-charge-demande-to-delivery/transfer-charge-demande-delivery.component";

// Angular

import { CommonModule } from "@angular/common";
import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
// Core Module
import { CoreModule } from "../../../core/core.module";
import { PartialsModule } from "../../partials/partials.module";
import { SupervisionComponent } from "./supervision.component";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
// Fake API Angular-in-memory
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
// Translate Module
import { TranslateModule } from "@ngx-translate/core";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
// NGRX
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
// UI

// Core
import { FakeApiService } from "../../../core/_base/layout";
// Auth
import { ModuleGuard } from "../../../core/auth";

// Core => Utils
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService } from "../../../core/_base/crud";
// Shared
import { ActionNotificationComponent, DeleteEntityDialogComponent, FetchEntityDialogComponent, UpdateStatusDialogComponent } from "../../partials/content/crud";

// Material
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
//bootsrap
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { environment } from "../../../../environments/environment";
import { NgbProgressbarModule, NgbProgressbarConfig } from "@ng-bootstrap/ng-bootstrap";
import { NgxPermissionsModule } from "ngx-permissions";
import { AngularSlickgridModule } from "angular-slickgrid";

import { ItineraryService, MobileServiceService, RoleService, UsersMobileService,LocationDetailService, MobileSettingsService, LoadRequestService, UnloadRequestService, MessageService, CustomerMobileService, CodeMobileService, DecompteService, SiteService, LocationService } from "../../../core/erp";
import { ValidateDeChargeDemandeComponent } from "./validate-decharge-demande/validate-decharge-demande.component";
import { CreateLoadRequestComponent } from "./create-load-request/create-load-request.component";
import { ListDiffLoadrequestComponent } from "./list-diff-loadrequest/list-diff-loadrequest.component";
import { CreateMessageComponent } from "./create-message/create-message.component";
import { DashboardServiceComponent } from "./dashboard-service/dashboard-service.component";
import { MatRadioModule } from "@angular/material/radio";
import { ValidateLrSupComponent } from './validate-lr-sup/validate-lr-sup.component';
import { CreateLrSupComponent } from './create-lr-sup/create-lr-sup.component';
import { DecompteRoleComponent } from './decompte-role/decompte-role.component';
import { ListInventoryRoleComponent } from './list-inventory-role/list-inventory-role.component';
import { ListInvoiceRoleComponent } from './list-invoice-role/list-invoice-role.component';
import { ListPaymentRoleComponent } from './list-payment-role/list-payment-role.component';
import { ListVisiteRoleComponent } from './list-visite-role/list-visite-role.component';
import { ListSalesRoleComponent } from './list-sales-role/list-sales-role.component';
import { PrintInventoryRoleComponent } from './print-inventory-role/print-inventory-role.component';
import { ExportLrComponent } from './export-lr/export-lr.component';

const routes: Routes = [
  {
    path: "validate-charge-demande",
    component: ValidateChargeDemandeComponent,
  },
  {
    path: "transfer-charge-demande-delivery",
    component: TransferChargeDemandeToDeliveryComponent,
  },
  {
    path: "validate-decharge-demande",
    component: ValidateDeChargeDemandeComponent,
  },

  {
    path: "create-load-request",
    component: CreateLoadRequestComponent,
  },
  {
    path: "create-lr-sup",
    component: CreateLrSupComponent,
  },
  {
    path: "list-diff-loadrequest",
    component: ListDiffLoadrequestComponent,
  },
  {
    path: "create-message",
    component: CreateMessageComponent,
  },
  {
    path: "dashboard-service",
    component: DashboardServiceComponent,
  },
  {
    path: "validate-lr-sup",
    component: ValidateLrSupComponent,
  },
  {
    path: "decompte-role",
    component: DecompteRoleComponent,
  },
  {
    path: "list-inventory-role",
    component: ListInventoryRoleComponent,
  },
  {
    path: "list-invoice-role",
    component: ListInvoiceRoleComponent,
  },
  {
    path: "list-payment-role",
    component: ListPaymentRoleComponent,
  },
  {
    path: "list-visite-role",
    component: ListVisiteRoleComponent,
  },
  {
    path: "list-sales-role",
    component: ListSalesRoleComponent,
  },
  {
    path: "print-inventory-role",
    component: PrintInventoryRoleComponent,
  },
  {
    path: "export-lr",
    component: ExportLrComponent,
  },
];
@NgModule({
  declarations: [CreateLoadRequestComponent, ValidateChargeDemandeComponent, TransferChargeDemandeToDeliveryComponent, ValidateDeChargeDemandeComponent, ListDiffLoadrequestComponent, CreateMessageComponent, DashboardServiceComponent, ValidateLrSupComponent, CreateLrSupComponent, DecompteRoleComponent, ListInventoryRoleComponent, ListInvoiceRoleComponent, ListPaymentRoleComponent, ListVisiteRoleComponent, ListSalesRoleComponent, PrintInventoryRoleComponent, ExportLrComponent],
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
      apiKey: "AIzaSyDjO63_DbdKo_1MAT3LaN9Wgpslpp0_OnQ",
    }),
    MatMenuModule,
    MatTabsModule,
    MatButtonModule,
    NgbModule,
    MatRadioModule,
    NgbPopoverModule,
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
    UsersMobileService,
    MobileServiceService,
    MobileSettingsService,
    RoleService,
    ItineraryService,
    TypesUtilsService,
    LayoutUtilsService,
    CustomerMobileService,
    CodeMobileService,
    HttpUtilsService,
    TypesUtilsService,
    LayoutUtilsService,
    LoadRequestService,
    UnloadRequestService,
    LocationDetailService,
    MessageService,
    DecompteService,
    SiteService,
    LocationService,
  ],
})
export class SupervisionModule {}
