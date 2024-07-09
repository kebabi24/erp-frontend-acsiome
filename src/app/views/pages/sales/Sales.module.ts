import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { SalesComponent } from "./sales.component"
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
import { QuoteService, UsersService, ItemService, CodeService, TaxeService, SaleOrderService, ProductLineService,
         SaleShiperService,CustomerService,SequenceService, SiteService,LocationService, MesureService,
         LocationDetailService, InventoryTransactionService, DeviseService, InventoryStatusService,
         PricelistService,InvoiceOrderService,AccountShiperService, BankService, ProjectService, 
         ConfigService, PayMethService, InvoiceOrderTempService, PosCategoryService, PsService,MobileSettingsService,
         CostlistService, CustomerMobileService,ItineraryService} from '../../../core/erp';
import { CreateQuoteComponent } from './create-quote/create-quote.component';
import { CreatesaleorderComponent } from './create-so/create-so.component';
import { CreatePshComponent } from './create-psh/create-psh.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { CreateDirectInvoiceComponent } from './create-direct-invoice/create-direct-invoice.component';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';
import { PaymentPshComponent } from './payment-psh/payment-psh.component';
import { UnblockSoComponent } from './unblock-so/unblock-so.component';
import { SoListComponent } from './so-list/so-list.component';
import { ConfirmSoComponent } from './confirm-so/confirm-so.component';
import { EditSoComponent } from './edit-so/edit-so.component';
import { CreateProjectInvoiceComponent } from './create-project-invoice/create-project-invoice.component';
import { InputInvoiceComponent } from './input-invoice/input-invoice.component';
import { DaylySiteTransComponent } from './dayly-site-trans/dayly-site-trans.component';
import { ListSalesComponent } from './list-sales/list-sales.component';
import { ListPosComponent } from './list-pos/list-pos.component';
import { ListCaisseComponent } from './list-caisse/list-caisse.component';
import { ListSiteCaComponent } from './list-site-ca/list-site-ca.component';
import { ListInvoiceMobComponent } from './list-invoice-mob/list-invoice-mob.component';
import { ListSoEditComponent } from './list-so-edit/list-so-edit.component';
import { ListInvoicesComponent } from './list-invoices/list-invoices.component';
import { ListPaiementMobComponent } from './list-paiement-mob/list-paiement-mob.component';
import { ListVisitMobComponent } from './list-visit-mob/list-visit-mob.component';
import { ImputProjectInvoiceComponent } from './imput-project-invoice/imput-project-invoice.component';
import { CreateCeramSoComponent } from './create-ceram-so/create-ceram-so.component';
import { CreatePaymentCustComponent } from './create-payment-cust/create-payment-cust.component';
import { ListSalesDdComponent } from './list-sales-dd/list-sales-dd.component';
import { CreateInvMobComponent } from './create-inv-mob/create-inv-mob.component';


const routes: Routes = [
    {
        path: "",
        component: SalesComponent,
        // canActivate: [ModuleGuard],
        // data: { moduleName: 'ecommerce' },
        children: [
       
          {
              path: "create-quote",
              component: CreateQuoteComponent,
          },
          {
            path: "dayly-site-trans",
            component: DaylySiteTransComponent,
        },
          {
                path: "create-so",
              component: CreatesaleorderComponent,
          },
          {
              path: "so-list",
            component: SoListComponent,
          },
          {
            path: "list-so-edit",
          component: ListSoEditComponent,
        },
          {
            path: "edit-so/:id",
            component: EditSoComponent,
          },
          {
              path: "unblock-so",
            component: UnblockSoComponent,
          },
          {
              path: "confirm-so",
            component: ConfirmSoComponent,
          },
          {
              path: "create-psh",
            component: CreatePshComponent,
          },
          {
              path: "payment-psh",
            component: PaymentPshComponent,
          },
      
          {
              path: "create-invoice",
            component: CreateInvoiceComponent,
          },

          {
              path: "create-direct-invoice",
            component: CreateDirectInvoiceComponent,
          },
          {
            path: "create-project-invoice",
            component: CreateProjectInvoiceComponent,
          },
        
          {
              path: "print-invoice",
            component: PrintInvoiceComponent,
          },
          {
            path: "input-invoice",
          component: InputInvoiceComponent,
          },
          
          {
            path: "list-sales",
            component: ListSalesComponent,
          },
          {
            path: "list-pos",
            component: ListPosComponent,
          },
          {
            path: "list-caisse",
            component: ListCaisseComponent,
          },
          {
            path: "list-site-ca",
            component: ListSiteCaComponent,
          },
          {
            path: "list-invoice-mob",
            component: ListInvoiceMobComponent,
          },
          {
            path: "list-invoices",
            component: ListInvoicesComponent,
          },
          {
            path: "list-paiement-mob",
            component: ListPaiementMobComponent,
          },
          {
            path: "list-visit-mob",
            component: ListVisitMobComponent,
          },
          {
            path: "imput-project-invoice",
            component: ImputProjectInvoiceComponent,
          },
          {
            path: "create-ceram-so",
            component: CreateCeramSoComponent,
          },
          {
            path: "create-payment-cust",
            component: CreatePaymentCustComponent,
          },
          {
            path: "list-sales-dd",
            component: ListSalesDdComponent,
          },
          {
            path: "create-inv-mob",
            component: CreateInvMobComponent,
          },
          
        ],
    },
]

@NgModule({
    declarations: [SalesComponent, CreateQuoteComponent, CreatesaleorderComponent, CreatesaleorderComponent, CreatePshComponent, CreateInvoiceComponent, CreateDirectInvoiceComponent, PrintInvoiceComponent, PaymentPshComponent, UnblockSoComponent, SoListComponent, ConfirmSoComponent, EditSoComponent, CreateProjectInvoiceComponent, InputInvoiceComponent, DaylySiteTransComponent, ListSalesComponent, ListPosComponent, ListCaisseComponent, ListSiteCaComponent, ListInvoiceMobComponent, ListSoEditComponent,ListInvoicesComponent, ListPaiementMobComponent, ListVisitMobComponent, ImputProjectInvoiceComponent, CreateCeramSoComponent, CreatePaymentCustComponent, ListSalesDdComponent, CreateInvMobComponent],
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
        QuoteService,
        ItemService,
        CodeService,
        SequenceService,
        CustomerService,
        TaxeService,
        DeviseService,
        SaleOrderService,
        SaleShiperService,
        InventoryTransactionService,
        SiteService,
        LocationService,
        InventoryStatusService,
        LocationDetailService,
        AccountShiperService,
        MesureService,
        PricelistService,
        InvoiceOrderService,
        BankService,
        ConfigService,
        ProjectService,
        PayMethService,
        ProductLineService,
        InvoiceOrderTempService,
        PosCategoryService,
        PsService,
        CostlistService,
        MobileSettingsService,
        CustomerMobileService,
        ItineraryService,
    ],

    entryComponents: [
        ActionNotificationComponent,
        DeleteEntityDialogComponent,
        FetchEntityDialogComponent,
        UpdateStatusDialogComponent,
    ],
})
export class SalesModule {}
