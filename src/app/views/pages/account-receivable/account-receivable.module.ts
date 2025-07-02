import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountReceivableComponent } from './account-receivable.component';
import { CreateAccountReceivableComponent } from './create-account-receivable/create-account-receivable.component';

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
import { UsersService, CodeService, TaxeService, CustomerService, SequenceService, ConfigService,
  DeviseService,  InvoiceOrderService, BankService, AccountReceivableService,ProjectService, MobileServiceService, RoleService, UsersMobileService,MobileSettingsService, SiteService, LoadRequestService} from '../../../core/erp';
import { CreateNoteComponent } from './create-note/create-note.component';
import { EditPaymentComponent } from './edit-payment/edit-payment.component';
import { ListPaymentRapComponent } from './list-payment-rap/list-payment-rap.component';
import { ListPaymentComponent } from './list-payment/list-payment.component';
import { CreateProjectPaymentComponent } from './create-project-payment/create-project-payment.component';
import { CreateVendorPaymentComponent } from './create-vendor-payment/create-vendor-payment.component';
import { TransfertArComponent } from './transfert-ar/transfert-ar.component';
import { ListVendorPaymentComponent } from './list-vendor-payment/list-vendor-payment.component';
import { ListTransfertPaymentComponent } from './list-transfert-payment/list-transfert-payment.component';
import { CreateVendorPaymentDetailComponent } from './create-vendor-payment-detail/create-vendor-payment-detail.component';
import { CreateRolePaymentDetailComponent } from './create-role-payment-detail/create-role-payment-detail.component';
import { ListBankDetailComponent } from './list-bank-detail/list-bank-detail.component';
import { ListCaisseComponent } from './list-caisse/list-caisse.component';
import { TransfertCaisseComponent } from './transfert-caisse/transfert-caisse.component';
import { TransfertCaisseDetComponent } from './transfert-caisse-det/transfert-caisse-det.component';
import { EditJournalComponent } from './edit-journal/edit-journal.component';
import { BankJournalComponent } from './bank-journal/bank-journal.component';
import { ListGlobalVendorPaymentComponent } from './list-global-vendor-payment/list-global-vendor-payment.component';

  const routes: Routes = [
    {
        path: "",
        component: AccountReceivableComponent,
        // canActivate: [ModuleGuard],
        // data: { moduleName: 'ecommerce' },
        children: [
       
            {
                path: "create-account-receivable",
                component: CreateAccountReceivableComponent,
            },
            {
              path: "create-project-payment",
              component: CreateProjectPaymentComponent,
            },
            {
                path: "create-note",
                component: CreateNoteComponent,
            },
            {
                path: "list-payment-rap",
                component: ListPaymentRapComponent,
              },
              {
                path: "list-payment",
                component: ListPaymentComponent,
              },
              {
                path: "edit-payment/:id",
                component: EditPaymentComponent,
              },
              {
                path: "create-vendor-payment",
                component: CreateVendorPaymentComponent,
              },
              {
                path: "create-vendor-payment-detail",
                component: CreateVendorPaymentDetailComponent,
              },
              {
                path: "create-role-payment-detail",
                component: CreateRolePaymentDetailComponent,
              },
              {
                path: "transfert-ar",
                component: TransfertArComponent,
              },
              {
                path: "list-vendor-payment",
                component: ListVendorPaymentComponent,
              },
              {
                path: "list-transfert-payment",
                component: ListTransfertPaymentComponent,
              },
              {
                path: "list-bank-detail",
                component: ListBankDetailComponent,
              },
              {
                path: "list-caisse",
                component: ListCaisseComponent,
              },
              {
                path: "transfert-caisse",
                component: TransfertCaisseComponent,
              },
              {
                path: "transfert-caisse-det",
                component: TransfertCaisseDetComponent,
              },
              {
                path: "edit-journal",
                component: EditJournalComponent,
              },
              {
                path: "bank-journal",
                component: BankJournalComponent,
              },
              {
                path: "list-global-vendor-payment",
                component: ListGlobalVendorPaymentComponent,
              },
        ],
    },
]

@NgModule({
  declarations: [AccountReceivableComponent, CreateAccountReceivableComponent, CreateNoteComponent, EditPaymentComponent, ListPaymentRapComponent, ListPaymentComponent, CreateProjectPaymentComponent, CreateVendorPaymentComponent, TransfertArComponent, ListVendorPaymentComponent, ListTransfertPaymentComponent, CreateVendorPaymentDetailComponent, CreateRolePaymentDetailComponent, ListBankDetailComponent, ListCaisseComponent, TransfertCaisseComponent, TransfertCaisseDetComponent, EditJournalComponent, BankJournalComponent, ListGlobalVendorPaymentComponent],
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
    UsersService,
    TypesUtilsService,
    LayoutUtilsService,
    HttpUtilsService,
    TypesUtilsService,
    LayoutUtilsService,
    CodeService,
    SequenceService,
    CustomerService,
    TaxeService,
    DeviseService,
    BankService,
    ProjectService,
    AccountReceivableService,
    InvoiceOrderService,
    ConfigService,
    MobileServiceService,
    RoleService,
    UsersMobileService,
    MobileSettingsService,
    SiteService,
    LoadRequestService
],

entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
],
})
export class AccountReceivableModule { }
