import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateSequenceComponent } from "./create-sequence/create-sequence.component";
import { PurchasingComponent } from "./purchasing.component";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
// Fake API Angular-in-memory
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
// Translate Module
import { TranslateModule } from "@ngx-translate/core";
// NGRX
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
// UI
import { PartialsModule } from "../../partials/partials.module";
// Core
import { FakeApiService } from "../../../core/_base/layout";
// Auth
import { ModuleGuard } from "../../../core/auth";

// Core => Utils
import {
  HttpUtilsService,
  TypesUtilsService,
  InterceptService,
  LayoutUtilsService,
} from "../../../core/_base/crud";
// Shared
import {
  ActionNotificationComponent,
  DeleteEntityDialogComponent,
  FetchEntityDialogComponent,
  UpdateStatusDialogComponent,
} from "../../partials/content/crud";

// Material
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
//bootsrap
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { environment } from "../../../../environments/environment";
import {
  NgbProgressbarModule,
  NgbProgressbarConfig,
} from "@ng-bootstrap/ng-bootstrap";

import { NgxPermissionsModule } from "ngx-permissions";
import { AngularSlickgridModule } from "angular-slickgrid";
import {
  SequenceService,
  RequisitionService,
  UsersService,
  ItemService,
  MesureService,
  CodeService,
  VendorProposalService,
  PurchaseOrderService,
  SiteService,
  LocationService,
  AddressService,
  TaxeService,
  DeviseService,
  PsService,
  PosCategoryService,
  InventoryTransactionService,
  AccountUnplanifedService,
  ReasonService,
  EmployeService,
  TimbreService,
} from "../../../core/erp";
import { CreatePurchaseOrderComponent } from "./create-purchase-order/create-purchase-order.component";
import { PurchaseOrderApprovalComponent } from "./purchase-order-approval/purchase-order-approval.component";
import { CreateVendorProposalComponent } from "./create-vendor-proposal/create-vendor-proposal.component";
import { VendorProposalComparisonComponent } from "./vendor-proposal-comparison/vendor-proposal-comparison.component";
import { CreatePoComponent } from "./create-po/create-po.component";
import { RequisitionsListComponent } from "./requisitions-list/requisitions-list.component";
import { VendorProposalListComponent } from "./vendor-proposal-list/vendor-proposal-list.component";
import { PurchaseOrderListComponent } from "./purchase-order-list/purchase-order-list.component";
import { RowDetailViewComponent } from "./rowDetails/rowdetail-view.component";
import { RowDetailPreloadComponent } from "./rowDetails/row-details-preload.component";
import { RowDetailViewVpComponent } from './rowDetails/rowdetail-view-vp.component';
import { RowDetailViewPoComponent } from './rowDetails/rowdetail-view-po.component';
import { EditStatusPoComponent } from './edit-status-po/edit-status-po.component';
import { PurchaseListComponent } from './purchase-list/purchase-list.component';
import { PrintPoComponent } from './print-po/print-po.component';
import { EditRequisitionComponent } from './edit-requisition/edit-requisition.component';
import { ListSequenceComponent } from './list-sequence/list-sequence.component';
import { EditSequenceComponent } from './edit-sequence/edit-sequence.component';
import { CreateOaComponent } from './create-oa/create-oa.component';
import { EditPoComponent } from './edit-po/edit-po.component';
import { CreateOaEmComponent } from './create-oa-em/create-oa-em.component';
import { ListApprovalComponent } from './list-approval/list-approval.component';
import { PaymentAuComponent } from './payment-au/payment-au.component';
import { ListAuComponent } from './list-au/list-au.component';
import { EpiCreateOaComponent } from './epi-create-oa/epi-create-oa.component';
import { ListReqUserComponent } from './list-req-user/list-req-user.component';
import { ReqApprovalComponent } from './req-approval/req-approval.component';

const routes: Routes = [
  {
    path: "",
    component: PurchasingComponent,
    // canActivate: [ModuleGuard],
    // data: { moduleName: 'ecommerce' },
    children: [
      {
        path: "req-list",
        component: RequisitionsListComponent,
      },
      {
        path: "vp-list",
        component: VendorProposalListComponent,
      },
      {
        path: "po-list",
        component: PurchaseOrderListComponent,
      },
      {
        path: "create-sequence",
        component: CreateSequenceComponent,
      },
      {
        path: "list-sequence",
        component: ListSequenceComponent,
      },
      {
        path: "edit-sequence/:id",
        component: EditSequenceComponent,
      },
      {
        path: "create-req",
        component: CreatePurchaseOrderComponent,
      },
      {
        path: "purchase-order-approval",
        component: PurchaseOrderApprovalComponent,
      },
      {
        path: "purchase-order-approval/:id",
        component: PurchaseOrderApprovalComponent,
      },
      {
        path: "create-vendor-proposal/:id",
        component: CreateVendorProposalComponent,
      },
      {
        path: "create-vendor-proposal",
        component: CreateVendorProposalComponent,
      },
      {
        path: "vendor-propsal-comparaison",
        component: VendorProposalComparisonComponent,
      },
      {
        path: "vendor-propsal-comparaison/:id",
        component: VendorProposalComparisonComponent,
      },
      {
        path: "create-po",
        component: CreatePoComponent,
      },
      {
        path: "create-oa",
        component: CreateOaComponent,
      },
      {
        path: "epi-create-oa",
        component: EpiCreateOaComponent,
      },
      {
        path: "create-oa-em",
        component: CreateOaEmComponent,
      },
      {
        path: "print-po",
        component: PrintPoComponent,
      },
      {
        path: "create-po/:id",
        component: CreatePoComponent,
      },
      {
        path: "po-list/:id",
        component: PurchaseOrderListComponent,
      },
      {
        path: "edit-status-po",
        component: EditStatusPoComponent,
      },
      {
        path: "edit-po/:id",
        component: EditPoComponent,
      },
      {
        path: "purchase-list",
        component: PurchaseListComponent,
      },
      {
        path: "edit-requisition/:id",
        component: EditRequisitionComponent,
      },
      {
        path: "list-approval",
        component: ListApprovalComponent,
      },
      {
        path: "payment-au",
        component: PaymentAuComponent,
      },
      {
        path: "list-au",
        component: ListAuComponent,
      },
      {
        path: "list-req-user",
        component: ListReqUserComponent,
      },
      {
        path: "req-approval",
        component: ReqApprovalComponent,
      },
      
    ],
  },
];

@NgModule({
  declarations: [
    CreateSequenceComponent,
    PurchasingComponent,
    CreatePurchaseOrderComponent,
    PurchaseOrderApprovalComponent,
    CreateVendorProposalComponent,
    VendorProposalComparisonComponent,
    CreatePoComponent,
    RequisitionsListComponent,
    VendorProposalListComponent,
    PurchaseOrderListComponent,
    RowDetailPreloadComponent,
    RowDetailViewComponent,
    RowDetailViewVpComponent,
    RowDetailViewPoComponent,
    EditStatusPoComponent,
    PurchaseListComponent,
    PrintPoComponent,
    EditRequisitionComponent,
    ListSequenceComponent,
    EditSequenceComponent,
    CreateOaComponent,
    EditPoComponent,
    CreateOaEmComponent,
    ListApprovalComponent,
    PaymentAuComponent,
    ListAuComponent,
    EpiCreateOaComponent,
    ListReqUserComponent,
    ReqApprovalComponent
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
    SequenceService,
    RequisitionService,
    ItemService,
    MesureService,
    CodeService,
    TimbreService,
    AddressService,
    DeviseService,
    SiteService,
    LocationService,
    VendorProposalService,
    PurchaseOrderService,
    TaxeService,
    PsService,
    InventoryTransactionService,
    PosCategoryService,
    AccountUnplanifedService,
    ReasonService,
    EmployeService,
  ],

  entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
    RowDetailPreloadComponent,
    RowDetailViewComponent,
    RowDetailViewVpComponent,
    RowDetailViewPoComponent
  ],
})
export class PurchasingModule {}
