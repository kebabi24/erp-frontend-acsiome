// Angular
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
// Components
import { BaseComponent } from "./views/theme/base/base.component";
// Auth
import { AuthGuard } from "./core/auth";

const routes: Routes = [
  {
    path: "auth",
    loadChildren: () => import("./views/pages/auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "error",
    loadChildren: () => import("./views/pages/error/error.module").then((m) => m.ErrorModule),
  },
  {
    path: "",
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "code-mstr",
        loadChildren: () => import("./views/pages/code-mstr/code-mstr.module").then((m) => m.CodeMstrModule),
      },

      {
        path: "unit-mesure",
        loadChildren: () => import("./views/pages/unit-mesure/unit-mesure.module").then((m) => m.UnitMesureModule),
      },
      {
        path: "inventory-transaction",
        loadChildren: () => import("./views/pages/inventory-transaction/inventory-transaction.module").then((m) => m.InventoryTransactionModule),
      },
      {
        path: "purchasing",
        loadChildren: () => import("./views/pages/purchasing/purchasing.module").then((m) => m.PurchasingModule),
      },
      {
        path: "sales",
        loadChildren: () => import("./views/pages/sales/Sales.module").then((m) => m.SalesModule),
      },
      {
        path: "manufacturing",
        loadChildren: () => import("./views/pages/manufacturing/manufacturing.module").then((m) => m.ManufacturingModule),
      },

      {
        path: "devise",
        loadChildren: () => import("./views/pages/devise/devise.module").then((m) => m.DeviseModule),
      },
      {
        path: "providers",
        loadChildren: () => import("./views/pages/providers/providers.module").then((m) => m.ProvidersModule),
      },
      {
        path: "customers",
        loadChildren: () => import("./views/pages/customers/customers.module").then((m) => m.CustomersModule),
      },
      {
        path: "customers-mobile",
        loadChildren: () => import("./views/pages/customers-mobile/customers-mobile.module").then((m) => m.CustomersMobileModule),
      },
      {
        path: "itinerary",
        loadChildren: () => import("./views/pages/itinerary/itinerary.module").then((m) => m.ItineraryModule),
      },
      {
        path: "articles",
        loadChildren: () => import("./views/pages/articles/articles.module").then((m) => m.ArticlesModule),
      },
      {
        path: "profiles",
        loadChildren: () => import("./views/pages/profiles/profiles.module").then((m) => m.ProfilesModule),
      },
      {
        path: "profiles-mobile",
        loadChildren: () => import("./views/pages/profiles-mobile/profiles-mobile.module").then((m) => m.ProfilesModule),
      },
      {
        path: "roles",
        loadChildren: () => import("./views/pages/roles/roles.module").then((m) => m.RolesModule),
      },
      {
        path: "token-serie",
        loadChildren: () => import("./views/pages/token-serie/token-serie.module").then((m) => m.TokenSerieModule),
      },
      {
        path: "services",
        loadChildren: () => import("./views/pages/services/service.module").then((m) => m.ServiceModule),
      },
      {
        path: "mobile-menu",
        loadChildren: () => import("./views/pages/mobile-menu/mobile-menu.module").then((m) => m.MobileMenuModule),
      },
      {
        path: "users",
        loadChildren: () => import("./views/pages/users/users.module").then((m) => m.UsersModule),
      },
      {
        path: "users-mobile",
        loadChildren: () => import("./views/pages/users-mobile/user-mobile.module").then((m) => m.UsersModule),
      },
      {
        path: "inventory-settings",
        loadChildren: () => import("./views/pages/inventory-settings/inventory-settings.module").then((m) => m.InventorySettingsModule),
      },
      {
        path: "inventory-management",
        loadChildren: () => import("./views/pages/inventory-management/inventory-management.module").then((m) => m.InventoryManagementModule),
      },
      {
        path: "accounting-setting",
        loadChildren: () => import("./views/pages/accounting-setting/accounting-setting.module").then((m) => m.AccountingSettingModule),
      },
      {
        path: "dashboard",
        loadChildren: () => import("./views/pages/dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
      {
        path: "pos",
        loadChildren: () => import("./views/pages/pos/pos.module").then((m) => m.PosModule),
      },
      {
        path: "setting-printers",
        loadChildren: () => import("./views/pages/setting-printers/setting-printers.module").then((m) => m.SettingPrintersModule),
      },
      {
        path: "pos-cafette",
        loadChildren: () => import("./views/pages/pos-cafette/pos-cafette.module").then((m) => m.PosCafetteModule),
      },
      {
        path: "pos-visitor",
        loadChildren: () => import("./views/pages/pos-visitor/pos-visitor.module").then((m) => m.PosVisitorModule),
      },
      {
        path: "pos-settings",
        loadChildren: () => import("./views/pages/pos-settings/pos-settings.module").then((m) => m.PosSettingsModule),
      },
      {
        path: "crm",
        loadChildren: () => import("./views/pages/crm/crm.module").then((m) => m.CRMModule),
      },
      {
        path: "price-setting",
        loadChildren: () => import("./views/pages/price-setting/price-setting.module").then((m) => m.PriceSettingModule),
      },

      {
        path: "ecommerce",
        loadChildren: () => import("./views/pages/apps/e-commerce/e-commerce.module").then((m) => m.ECommerceModule),
      },
      {
        path: "account-receivable",
        loadChildren: () => import("./views/pages/account-receivable/account-receivable.module").then((m) => m.AccountReceivableModule),
      },
      {
        path: "account-payable",
        loadChildren: () => import("./views/pages/account-payable/account-payable.module").then((m) => m.AccountPayableModule),
      },
      {
        path: "general-accounting",
        loadChildren: () => import("./views/pages/general-accounting/general-accounting.module").then((m) => m.GeneralAccountingModule),
      },
      {
        path: "job",
        loadChildren: () => import("./views/pages/job/job.module").then((m) => m.JobModule),
      },
      {
        path: "tool",
        loadChildren: () => import("./views/pages/tool/tool.module").then((m) => m.ToolModule),
      },
      {
        path: "task",
        loadChildren: () => import("./views/pages/task/task.module").then((m) => m.TaskModule),
      },
      {
        path: "project",
        loadChildren: () => import("./views/pages/project/project.module").then((m) => m.ProjectModule),
      },
      {
        path: "weekly-inventory",
        loadChildren: () => import("./views/pages/weekly-inventory/weekly-inventory.module").then((m) => m.WeeklyInventoryModule),
      },
      {
        path: "revenue-transfer",
        loadChildren: () => import("./views/pages/revenue-transfer/revenue-transfer.module").then((m) => m.RevenueTransferModule),
      },

      // {
      //   path: 'config',
      //   loadChildren: () => import('./views/pages/config/config.module').then(m => m.ConfigModule),
      //   path: "code-mstr",
      //   loadChildren: () =>
      //     import("./views/pages/code-mstr/code-mstr.module").then(
      //       (m) => m.CodeMstrModule
      //     ),
      // },

      {
        path: "unit-mesure",
        loadChildren: () => import("./views/pages/unit-mesure/unit-mesure.module").then((m) => m.UnitMesureModule),
      },
      {
        path: "inventory-transaction",
        loadChildren: () => import("./views/pages/inventory-transaction/inventory-transaction.module").then((m) => m.InventoryTransactionModule),
      },
      {
        path: "purchasing",
        loadChildren: () => import("./views/pages/purchasing/purchasing.module").then((m) => m.PurchasingModule),
      },
      {
        path: "sales",
        loadChildren: () => import("./views/pages/sales/Sales.module").then((m) => m.SalesModule),
      },
      {
        path: "manufacturing",
        loadChildren: () => import("./views/pages/manufacturing/manufacturing.module").then((m) => m.ManufacturingModule),
      },

      {
        path: "devise",
        loadChildren: () => import("./views/pages/devise/devise.module").then((m) => m.DeviseModule),
      },
      {
        path: "providers",
        loadChildren: () => import("./views/pages/providers/providers.module").then((m) => m.ProvidersModule),
      },
      {
        path: "customers",
        loadChildren: () => import("./views/pages/customers/customers.module").then((m) => m.CustomersModule),
      },
      {
        path: "customers-mobile",
        loadChildren: () => import("./views/pages/customers-mobile/customers-mobile.module").then((m) => m.CustomersMobileModule),
      },
      {
        path: "itinerary",
        loadChildren: () => import("./views/pages/itinerary/itinerary.module").then((m) => m.ItineraryModule),
      },
      {
        path: "articles",
        loadChildren: () => import("./views/pages/articles/articles.module").then((m) => m.ArticlesModule),
      },
      {
        path: "profiles",
        loadChildren: () => import("./views/pages/profiles/profiles.module").then((m) => m.ProfilesModule),
      },
      {
        path: "profiles-mobile",
        loadChildren: () => import("./views/pages/profiles-mobile/profiles-mobile.module").then((m) => m.ProfilesModule),
      },
      {
        path: "roles",
        loadChildren: () => import("./views/pages/roles/roles.module").then((m) => m.RolesModule),
      },
      {
        path: "services",
        loadChildren: () => import("./views/pages/services/service.module").then((m) => m.ServiceModule),
      },
      {
        path: "mobile-menu",
        loadChildren: () => import("./views/pages/mobile-menu/mobile-menu.module").then((m) => m.MobileMenuModule),
      },
      {
        path: "users",
        loadChildren: () => import("./views/pages/users/users.module").then((m) => m.UsersModule),
      },
      {
        path: "users-mobile",
        loadChildren: () => import("./views/pages/users-mobile/user-mobile.module").then((m) => m.UsersModule),
      },
      {
        path: "inventory-settings",
        loadChildren: () => import("./views/pages/inventory-settings/inventory-settings.module").then((m) => m.InventorySettingsModule),
      },
      {
        path: "inventory-management",
        loadChildren: () => import("./views/pages/inventory-management/inventory-management.module").then((m) => m.InventoryManagementModule),
      },
      {
        path: "accounting-setting",
        loadChildren: () => import("./views/pages/accounting-setting/accounting-setting.module").then((m) => m.AccountingSettingModule),
      },
      {
        path: "dashboard",
        loadChildren: () => import("./views/pages/dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
      {
        path: "pos",
        loadChildren: () => import("./views/pages/pos/pos.module").then((m) => m.PosModule),
      },
      {
        path: "pos-visitor",
        loadChildren: () => import("./views/pages/pos-visitor/pos-visitor.module").then((m) => m.PosVisitorModule),
      },
      {
        path: "pos-settings",
        loadChildren: () => import("./views/pages/pos-settings/pos-settings.module").then((m) => m.PosSettingsModule),
      },
      {
        path: "price-setting",
        loadChildren: () => import("./views/pages/price-setting/price-setting.module").then((m) => m.PriceSettingModule),
      },

      {
        path: "ecommerce",
        loadChildren: () => import("./views/pages/apps/e-commerce/e-commerce.module").then((m) => m.ECommerceModule),
      },
      {
        path: "account-receivable",
        loadChildren: () => import("./views/pages/account-receivable/account-receivable.module").then((m) => m.AccountReceivableModule),
      },
      {
        path: "account-payable",
        loadChildren: () => import("./views/pages/account-payable/account-payable.module").then((m) => m.AccountPayableModule),
      },
      {
        path: "general-accounting",
        loadChildren: () => import("./views/pages/general-accounting/general-accounting.module").then((m) => m.GeneralAccountingModule),
      },
      {
        path: "job",
        loadChildren: () => import("./views/pages/job/job.module").then((m) => m.JobModule),
      },
      {
        path: "tool",
        loadChildren: () => import("./views/pages/tool/tool.module").then((m) => m.ToolModule),
      },
      {
        path: "task",
        loadChildren: () => import("./views/pages/task/task.module").then((m) => m.TaskModule),
      },
      {
        path: "project",
        loadChildren: () => import("./views/pages/project/project.module").then((m) => m.ProjectModule),
      },
      {
        path: "config",
        loadChildren: () => import("./views/pages/config/config.module").then((m) => m.ConfigModule),
      },
      {
        path: "forcast",
        loadChildren: () => import("./views/pages/forcast/forcast.module").then((m) => m.ForcastModule),
      },
      {
        path: "mobile-settings",
        loadChildren: () => import("./views/pages/mobile-settings/mobile-settings.module").then((m) => m.MobileSettingsModule),
      },
      {
        path: "supervision",
        loadChildren: () => import("./views/pages/supervision/supervision.module").then((m) => m.SupervisionModule),
      },
      {
        path: "domain",
        loadChildren: () => import("./views/pages/domain/domain.module").then((m) => m.DomainModule),
      },
      {
        path: "deal",
        loadChildren: () => import("./views/pages/deal/deal.module").then((m) => m.DealModule),
      },
      {
        path: "transport",
        loadChildren: () => import("./views/pages/transport/transport.module").then((m) => m.TransportModule),
      },
      {
        path: "promo",
        loadChildren: () => import("./views/pages/promotion/promotion.module").then((m) => m.PromotionModule),
      },
      {
        path: "patient",
        loadChildren: () => import("./views/pages/patient/patient.module").then((m) => m.PatientModule),
      },
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      { path: "**", redirectTo: "dashboard", pathMatch: "full" },
    ],
  },
  { path: "**", redirectTo: "error/403", pathMatch: "full" },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
