// Angular
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
// Partials
import { PartialsModule } from "../partials/partials.module";
// Pages
import { CoreModule } from "../../core/core.module";
import { MailModule } from "./apps/mail/mail.module";
import { ProvidersModule } from "./providers/providers.module";
import { ECommerceModule } from "./apps/e-commerce/e-commerce.module";
import { UserManagementModule } from "./user-management/user-management.module";
import { MyPageComponent } from "./my-page/my-page.component";
import { AngularSlickgridModule } from "angular-slickgrid";
import { TreeModule } from "@circlon/angular-tree-component";
import { ServicesComponent } from "./services/services.component";
import { MobileMenuComponent } from "./mobile-menu/mobile-menu.component";
import { PosComponent } from "./pos/pos.component";
import { PosVisitorComponent } from "./pos-visitor/pos-visitor.component";
import { RevenueTransferComponent } from "./revenue-transfer/revenue-transfer.component";
import { PosCafetteComponent } from "./pos-cafette/pos-cafette.component";
import { MobileSettingsComponent } from "./mobile-settings/mobile-settings.component";
import { SupervisionComponent } from "./supervision/supervision.component";
import { SettingPrintersComponent } from './setting-printers/setting-printers.component';


@NgModule({
  declarations: [MyPageComponent, ServicesComponent, MobileMenuComponent, MobileSettingsComponent, SupervisionComponent, SettingPrintersComponent],
  exports: [],
  imports: [CommonModule, HttpClientModule, FormsModule, CoreModule, PartialsModule, AngularSlickgridModule.forRoot(), MailModule, ECommerceModule, UserManagementModule, ProvidersModule, /*TreeModule*/],
  providers: [],
})
export class PagesModule {}
