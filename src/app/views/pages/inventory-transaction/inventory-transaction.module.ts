import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InventoryTransactionComponent } from "./inventory-transaction.component";
import { TransferComponent } from "./transfer/transfer.component";
import { UnplanifiedIssueComponent } from "./unplanified-issue/unplanified-issue.component";

import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
// Fake API Angular-in-memory
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
// Translate Module
import { TranslateModule } from "@ngx-translate/core";
// import {} from "ngx-extended-pdf-viewer"
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
import { UnplanifiedReceptComponent } from "./unplanified-recept/unplanified-recept.component";
import { InventoryListComponent } from "./inventory-list/inventory-list.component";
import { DomainService, LocationDetailService, SequenceService, InventoryManagementService, UnloadRequestService, LoadRequestService, RoleService, ReasonService } from "../../../core/erp";
import { PoReceipComponent } from "./po-receip/po-receip.component";

import { TransactionListComponent } from "./transaction-list/transaction-list.component";
import { EditStatusComponent } from "./edit-status/edit-status.component";
import { TransListGrpComponent } from "./trans-list-grp/trans-list-grp.component";
import { ListInvComponent } from "./list-inv/list-inv.component";
import { ListRctComponent } from "./list-rct/list-rct.component";
import { ConsoReportComponent } from "./conso-report/conso-report.component";
import { LabelCreateComponent } from "./label-create/label-create.component";
import { PoReceipIdComponent } from "./po-receip-id/po-receip-id.component";
import { PoReceipCabComponent } from "./po-receip-cab/po-receip-cab.component";
import { EditStatusRefComponent } from "./edit-status-ref/edit-status-ref.component";
import { PoReceipCabIdComponent } from "./po-receip-cab-id/po-receip-cab-id.component";
import { PurchaseOrderService, TransferService, PurchaseReceiveService, InventoryTransactionService, DeviseService, ProviderService, CostSimulationService, SiteService, LocationService, InventoryStatusService, RequisitionService, MesureService, UsersService, ItemService, LabelService, PrintersService, EmployeService, ProductLineService } from "../../../core/erp";
import { UnplanifiedReceiptCabComponent } from "./unplanified-receipt-cab/unplanified-receipt-cab.component";
import { PoReceiptDetComponent } from "./po-receipt-det/po-receipt-det.component";
import { LoadingVansV2Component } from "./loading-vans-v2/loading-vans-v2.component";
import { EditLdStatusComponent } from './edit-ld-status/edit-ld-status.component';
import { UpdatePriceUnpComponent } from './update-price-unp/update-price-unp.component';
import { BobineReceiptCabComponent } from './bobine-receipt-cab/bobine-receipt-cab.component';
import { EditTransactionListComponent } from './edit-transaction-list/edit-transaction-list.component';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { ReprintCabComponent } from './reprint-cab/reprint-cab.component';
import { ReturnCabComponent } from './return-cab/return-cab.component';
import { RemodifyCabComponent } from './remodify-cab/remodify-cab.component';
// import { CreateComponent } from "../articles/create/create.component";

const routes: Routes = [
  {
    path: "transfer",
    component: TransferComponent,
  },
  {
    path: "unplanified-issue",
    component: UnplanifiedIssueComponent,
  },
  {
    path: "unplanified-recept",
    component: UnplanifiedReceptComponent,
  },
  {
    path: "unplanified-receipt-cab",
    component: UnplanifiedReceiptCabComponent,
  },
  {
    path: "bobine-receipt-cab",
    component: BobineReceiptCabComponent,
  },
  {
    path: "inventory-list",
    component: InventoryListComponent,
  },
  {
    path: "transaction-list",
    component: TransactionListComponent,
  },
  {
    path: "edit-transaction-list",
    component: EditTransactionListComponent,
  },
  {
    path: "conso-report",
    component: ConsoReportComponent,
  },
  {
    path: "trans-list-grp",
    component: TransListGrpComponent,
  },
  {
    path: "po-receip",
    component: PoReceipComponent,
  },
  {
    path: "edit-status",
    component: EditStatusComponent,
  },
  {
    path: "reprint-cab",
    component: ReprintCabComponent,
  },
  {
    path: "remodify-cab",
    component: RemodifyCabComponent,
  },
  {
    path: "return-cab",
    component: ReturnCabComponent,
  },
  {
    path: "edit-status-ref",
    component: EditStatusRefComponent,
  },
  {
    path: "list-inv",
    component: ListInvComponent,
  },
  {
    path: "list-rct",
    component: ListRctComponent,
  },
  {
    path: "label-create",
    component: LabelCreateComponent,
  },
  {
    path: "po-receip-id/:id",
    component: PoReceipIdComponent,
  },
  {
    path: "po-receip-cab",
    component: PoReceipCabComponent,
  },
  {
    path: "po-receip-cab-id/:id",
    component: PoReceipCabIdComponent,
  },
  {
    path: "po-receipt-det",
    component: PoReceiptDetComponent,
  },
  {
    path: "loading-vans-v2",
    component: LoadingVansV2Component,
  },
  {
    path: "edit-ld-status",
    component: EditLdStatusComponent,
  },
  {
    path: "update-price-unp",
    component: UpdatePriceUnpComponent,
  },
];

@NgModule({
  declarations: [InventoryTransactionComponent, TransferComponent, UnplanifiedIssueComponent, UnplanifiedReceptComponent, InventoryListComponent, PoReceipComponent, TransactionListComponent, EditStatusComponent, TransListGrpComponent, ListInvComponent, ListRctComponent, ConsoReportComponent, LabelCreateComponent, PoReceipIdComponent, PoReceipCabComponent, EditStatusRefComponent, PoReceipCabIdComponent, UnplanifiedReceiptCabComponent, PoReceiptDetComponent, LoadingVansV2Component, EditLdStatusComponent, UpdatePriceUnpComponent, BobineReceiptCabComponent, EditTransactionListComponent, ActivityListComponent, ReprintCabComponent, ReturnCabComponent, RemodifyCabComponent],
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
  // entryComponents: [
  //   CreateComponent
  // ],
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
    TransferService,
    TypesUtilsService,
    LayoutUtilsService,
    LocationDetailService,
    PurchaseOrderService,
    InventoryTransactionService,
    PurchaseReceiveService,
    DeviseService,
    ProviderService,
    CostSimulationService,
    ItemService,
    SiteService,
    LocationService,
    MesureService,
    SequenceService,
    LocationDetailService,
    InventoryStatusService,
    RequisitionService,
    UsersService,
    LabelService,
    DomainService,
    PrintersService,
    EmployeService,
    ProductLineService,
    InventoryManagementService,
    InventoryTransactionService,
    UnloadRequestService,
    LoadRequestService,
    RoleService,
    ReasonService,
  ],
})
export class InventoryTransactionModule {}
