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
import { LabelService,QuoteService, UsersService, ItemService, CodeService, TaxeService, SaleOrderService, ProductLineService,
         SaleShiperService,CustomerService,SequenceService, SiteService,LocationService, MesureService,
         LocationDetailService, InventoryTransactionService, DeviseService, InventoryStatusService,
         PricelistService,InvoiceOrderService,AccountShiperService, BankService, ProjectService, 
         ConfigService, PayMethService, InvoiceOrderTempService, PosCategoryService, PsService,MobileSettingsService,
         EntityService,AccountReceivableService,RoleService,
         CostlistService, CustomerMobileService,ItineraryService,UsersMobileService, AccountOrderService,
         PriceListQuantityService,BarecodeinfosService, TimbreService ,  AddressService, AccountService,LoadRequestService, AffectEquipementService
        } from '../../../core/erp';
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
import { ReqListComponent } from './req-list/req-list.component';
import { PaymentPshEmployeComponent } from './payment-psh-employe/payment-psh-employe.component';
import { ListInvoicesDetailComponent } from './list-invoices-detail/list-invoices-detail.component';
import { PshListComponent } from './psh-list/psh-list.component';
import { CreateSoImmobilierComponent } from './create-so-immobilier/create-so-immobilier.component';
import { CreatePvReceptionComponent } from './create-pv-reception/create-pv-reception.component';
import { CreateSatisfactionComponent } from './create-satisfaction/create-satisfaction.component';
import { RemiseDesClesComponent } from './remise-des-cles/remise-des-cles.component';
import { ControleActeComponent } from './controle-acte/controle-acte.component';
import { DecisionAffectationComponent } from './decision-affectation/decision-affectation.component';
import { ClotureSoldeComponent } from './cloture-solde/cloture-solde.component';
import { AttestationReservationComponent } from './attestation-reservation/attestation-reservation.component';
import { ListCaDdComponent } from './list-ca-dd/list-ca-dd.component';
import { PaymentSoComponent } from './payment-so/payment-so.component';
import { ListSalesRoleComponent } from './list-sales-role/list-sales-role.component';
import { ListSalesTypeComponent } from './list-sales-type/list-sales-type.component';
import { CreateSoPlqComponent } from './create-so-plq/create-so-plq.component';
import { CreatePshPlqComponent } from './create-psh-plq/create-psh-plq.component';
import { CreateSoBcComponent } from './create-so-bc/create-so-bc.component';
import { ListPshComponent } from './list-psh/list-psh.component';
import { ReprintInvoiceComponent } from './reprint-invoice/reprint-invoice.component';
import { ListRolesSalesComponent } from './list-roles-sales/list-roles-sales.component';
import { CreateAccountingInvComponent } from './create-accounting-inv/create-accounting-inv.component';
import { ListInvoiceAccComponent } from './list-invoice-acc/list-invoice-acc.component';
import { ListSalesAccComponent } from './list-sales-acc/list-sales-acc.component';
import { ListCreditRoleComponent } from './list-credit-role/list-credit-role.component';
import { ListCreditDdComponent } from './list-credit-dd/list-credit-dd.component';
import { AffectEquipementComponent } from './affect-equipement/affect-equipement.component';
import { ListAffectEquipementComponent } from './list-affect-equipement/list-affect-equipement.component';
import { UndoInvoiceComponent } from './undo-invoice/undo-invoice.component';
import { ListCaTypeComponent } from './list-ca-type/list-ca-type.component';
import { ListSoCeramComponent } from './list-so-ceram/list-so-ceram.component';
import { ListSoDetComponent } from './list-so-det/list-so-det.component';

import { RowDetailViewComponent } from "./rowDetails/rowdetail-view.component";
import { RowDetailPreloadComponent } from "./rowDetails/row-details-preload.component";
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
            path: "create-so-immobilier",
          component: CreateSoImmobilierComponent,
      },
      {
        path: "create-pv-reception",
      component: CreatePvReceptionComponent,
  },
  {
    path: "create-satisfaction",
  component: CreateSatisfactionComponent,
},
{
  path: "remise-des-cles",
component: RemiseDesClesComponent,
},
{
  path: "controle-acte",
component: ControleActeComponent,
},
{
  path: "decision-affectation",
component: DecisionAffectationComponent,
},
{
  path: "cloture-solde",
component: ClotureSoldeComponent,
},
{
  path: "attestation-reservation",
component: AttestationReservationComponent,
},
          {
              path: "so-list",
            component: SoListComponent,
          },
          {
            path: "psh-list",
          component: PshListComponent,
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
            path: "list-invoices-detail",
            component: ListInvoicesDetailComponent,
          },
          {
            path: "req-list",
            component: ReqListComponent,
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
          {
            path: "list-ca-dd",
            component: ListCaDdComponent,
          },
          {
            path: "payment-so",
          component: PaymentSoComponent,
        },
          
          
          {
            path: "list-sales-role",
            component: ListSalesRoleComponent,
          },
          {
            path: "list-sales-type",
            component: ListSalesTypeComponent,
          },
          {
            path: "create-so-plq",
            component: CreateSoPlqComponent,
          },
          {
            path: "create-psh-plq",
            component: CreatePshPlqComponent,
          },
          {
            path: "create-so-bc",
            component: CreateSoBcComponent,
          },
          {
            path: "list-psh",
            component: ListPshComponent,
          },
          {
            path: "reprint-invoice",
            component: ReprintInvoiceComponent,
          },
          {
            path: "list-roles-sales",
            component: ListRolesSalesComponent,
          },
          {
            path: "create-accounting-inv",
            component: CreateAccountingInvComponent,
          },
          {
            path: "list-invoice-acc",
            component: ListInvoiceAccComponent,
          },
          {
            path: "list-sales-acc",
            component: ListSalesAccComponent,
          },
          {
            path: "list-credit-role",
            component: ListCreditRoleComponent,
          },
          {
            path: "list-credit-dd",
            component: ListCreditDdComponent,
          },
          {
            path: "affect-equipement",
            component: AffectEquipementComponent,
          },
          {
            path: "list-affect-equipement",
            component: ListAffectEquipementComponent,
          },
          {
            path: "undo-invoice",
            component: UndoInvoiceComponent,
          },
          {
            path: "list-ca-type",
            component: ListCaTypeComponent,
          },
          {
            path: "list-so-ceram",
            component: ListSoCeramComponent,
          },
          {
            path: "list-so-det",
            component: ListSoDetComponent,
          }
        ],
    },
]

@NgModule({
    declarations: [SalesComponent, CreateQuoteComponent, CreatesaleorderComponent, CreatesaleorderComponent, CreatePshComponent, CreateInvoiceComponent, CreateDirectInvoiceComponent, PrintInvoiceComponent, PaymentPshComponent, UnblockSoComponent, SoListComponent, ConfirmSoComponent, EditSoComponent, CreateProjectInvoiceComponent, InputInvoiceComponent, DaylySiteTransComponent, ListSalesComponent, ListPosComponent, ListCaisseComponent, ListSiteCaComponent, ListInvoiceMobComponent, ListSoEditComponent,ListInvoicesComponent, ListPaiementMobComponent, ListVisitMobComponent, ImputProjectInvoiceComponent, CreateCeramSoComponent, CreatePaymentCustComponent, ListSalesDdComponent, CreateInvMobComponent, ListCaDdComponent, PaymentSoComponent, ListSalesRoleComponent, ListSalesTypeComponent, CreateSoPlqComponent, CreatePshPlqComponent, CreateSoBcComponent, ListPshComponent, ReprintInvoiceComponent, ListRolesSalesComponent,
       CreatesaleorderComponent, CreatePshComponent, CreateInvoiceComponent, CreateDirectInvoiceComponent, PrintInvoiceComponent, PaymentPshComponent, UnblockSoComponent, SoListComponent, ConfirmSoComponent, EditSoComponent, CreateProjectInvoiceComponent, InputInvoiceComponent, DaylySiteTransComponent, ListSalesComponent, ListPosComponent, ListCaisseComponent, ListSiteCaComponent, ListInvoiceMobComponent, ListSoEditComponent,ListInvoicesComponent, ListPaiementMobComponent, ListVisitMobComponent, ImputProjectInvoiceComponent, CreateCeramSoComponent, CreatePaymentCustComponent, ListSalesDdComponent, CreateInvMobComponent, ReqListComponent, PaymentPshEmployeComponent
     ,ListCaDdComponent, PaymentSoComponent, ListInvoicesDetailComponent, PshListComponent, CreateSoImmobilierComponent, CreatePvReceptionComponent, CreateSatisfactionComponent, RemiseDesClesComponent, ControleActeComponent, DecisionAffectationComponent, ClotureSoldeComponent, AttestationReservationComponent,ConfirmSoComponent, EditSoComponent, CreateProjectInvoiceComponent, InputInvoiceComponent, DaylySiteTransComponent, ListSalesComponent, ListPosComponent, ListCaisseComponent, ListSiteCaComponent, ListInvoiceMobComponent, ListSoEditComponent,ListInvoicesComponent, ListPaiementMobComponent, ListVisitMobComponent, ImputProjectInvoiceComponent, CreateCeramSoComponent, CreatePaymentCustComponent, ListSalesDdComponent, CreateInvMobComponent, ListCaDdComponent, PaymentSoComponent, ListSalesRoleComponent, ListSalesTypeComponent, CreateSoPlqComponent, CreatePshPlqComponent, CreateSoBcComponent, ListPshComponent, ReprintInvoiceComponent, ListRolesSalesComponent, CreateAccountingInvComponent, ListInvoiceAccComponent, ListSalesAccComponent, ListCreditRoleComponent, ListCreditDdComponent, AffectEquipementComponent, ListAffectEquipementComponent, UndoInvoiceComponent, ListCaTypeComponent, ListSoCeramComponent, ListSoDetComponent,    RowDetailPreloadComponent,
     RowDetailViewComponent,],
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
        LabelService,
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
        UsersMobileService,
        AccountOrderService,
        AccountReceivableService,
        EntityService,
        RoleService,
        PriceListQuantityService,
        BarecodeinfosService,
        TimbreService,
        LoadRequestService,        
        AddressService,
       AffectEquipementService,
        AccountService,
       
        

    ],

    entryComponents: [
        ActionNotificationComponent,
        DeleteEntityDialogComponent,
        FetchEntityDialogComponent,
        UpdateStatusDialogComponent,
        RowDetailPreloadComponent,
        RowDetailViewComponent,
    ],
})
export class SalesModule {}
