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
import { ListInvBobineComponent } from './list-inv-bobine/list-inv-bobine.component';
import { RctUnpPrintComponent } from './rct-unp-print/rct-unp-print.component';
import { RctTrPrintComponent } from './rct-tr-print/rct-tr-print.component';
import { IssUnpPrintComponent } from './iss-unp-print/iss-unp-print.component';
import { PurchaseReceiptCabComponent } from './purchase-receipt-cab/purchase-receipt-cab.component';
import { RctPoPrintComponent } from './rct-po-print/rct-po-print.component';
import { MachineActivityPrintComponent } from './machine-activity-print/machine-activity-print.component';
import { RctUnpGlobalprintComponent } from './rct-unp-globalprint/rct-unp-globalprint.component';
import { RctTrGlobalprintComponent } from './rct-tr-globalprint/rct-tr-globalprint.component';
import { RctPoGlobalprintComponent } from './rct-po-globalprint/rct-po-globalprint.component';
import { IssUnpGlobalprintComponent } from './iss-unp-globalprint/iss-unp-globalprint.component';
import { AssetReceiveCabComponent } from './asset-receive-cab/asset-receive-cab.component';
import { EchantillonReceiptCabComponent } from './echantillon-receipt-cab/echantillon-receipt-cab.component';
import { InventoryDetailComponent } from './inventory-detail/inventory-detail.component';
import { PurchaseReceiptColorantComponent } from './purchase-receipt-colorant/purchase-receipt-colorant.component';
import { EpiInventoryTransactionComponent } from './epi-inventory-transaction/epi-inventory-transaction.component';
import { EpiIssueComponent } from './epi-issue/epi-issue.component';
import { EpiReceiptComponent } from './epi-receipt/epi-receipt.component';
import { EpiMonthlyDistributionComponent } from './epi-monthly-distribution/epi-monthly-distribution.component';
import { EpiInventoryReportComponent } from './epi-inventory-report/epi-inventory-report.component';
import { PoUnreceipCabComponent } from './po-unreceip-cab/po-unreceip-cab.component';
import { PoReceipCabIdLabComponent } from './po-receip-cab-id-lab/po-receip-cab-id-lab.component';
import { PoUnreceipVendComponent } from './po-unreceip-vend/po-unreceip-vend.component';

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
    path: "epi-issue",
    component: EpiIssueComponent,
  },
  {
    path: "unplanified-recept",
    component: UnplanifiedReceptComponent,
  },
  {
    path: "epi-receipt",
    component: EpiReceiptComponent,
  },
  {
    path: "rct-tr-print",
    component: RctTrPrintComponent,
  },
  {
    path: "iss-unp-print",
    component: IssUnpPrintComponent,
  },
  {
    path: "rct-tr-globalprint",
    component: RctTrGlobalprintComponent,
  },
  {
    path: "iss-unp-globalprint",
    component: IssUnpGlobalprintComponent,
  },
  {
    path: "machine-activity-print",
    component: MachineActivityPrintComponent,
  },
  {
    path: "rct-unp-print",
    component: RctUnpPrintComponent,
  },
  {
    path: "rct-po-print",
    component: RctPoPrintComponent,
  },
  {
    path: "rct-unp-globalprint",
    component: RctUnpGlobalprintComponent,
  },
  {
    path: "rct-po-globalprint",
    component: RctPoGlobalprintComponent,
  },
  {
    path: "unplanified-receipt-cab",
    component: UnplanifiedReceiptCabComponent,
  },
  {
    path: "purchase-receipt-cab",
    component: PurchaseReceiptCabComponent,
  },
  {
    path: "purchase-receipt-colorant",
    component: PurchaseReceiptColorantComponent,
  },
  {
    path: "echantillon-receipt-cab",
    component: EchantillonReceiptCabComponent,
  },
  {
    path: "asset-receive-cab",
    component: AssetReceiveCabComponent,
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
    path: "epi-inventory-transaction",
    component: EpiInventoryTransactionComponent,
  },
  {
    path: "epi-inventory-report",
    component: EpiInventoryReportComponent,
  },
  {
    path: "epi-monthly-distribution",
    component: EpiMonthlyDistributionComponent,
  },
  {
    path: "inventory-detail",
    component: InventoryDetailComponent,
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
    path: "list-inv-bobine",
    component: ListInvBobineComponent,
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
  {
    path: "po-unreceip-cab",
    component: PoUnreceipCabComponent,
  },
  {
    path: "po-receip-cab-id-lab/:id",
    component: PoReceipCabIdLabComponent,
  },
  {
    path: "po-unreceip-vend",
    component: PoUnreceipVendComponent,
  },
];

@NgModule({
  declarations: [InventoryTransactionComponent, TransferComponent, UnplanifiedIssueComponent, UnplanifiedReceptComponent, InventoryListComponent, PoReceipComponent, TransactionListComponent, EditStatusComponent, TransListGrpComponent, ListInvComponent, ListRctComponent, ConsoReportComponent, LabelCreateComponent, PoReceipIdComponent, PoReceipCabComponent, EditStatusRefComponent, PoReceipCabIdComponent, UnplanifiedReceiptCabComponent, PoReceiptDetComponent, LoadingVansV2Component, EditLdStatusComponent, UpdatePriceUnpComponent, BobineReceiptCabComponent, EditTransactionListComponent, ActivityListComponent, ReprintCabComponent, ReturnCabComponent, RemodifyCabComponent, ListInvBobineComponent, RctUnpPrintComponent, RctTrPrintComponent, IssUnpPrintComponent, PurchaseReceiptCabComponent, RctPoPrintComponent, MachineActivityPrintComponent, RctUnpGlobalprintComponent, RctTrGlobalprintComponent, RctPoGlobalprintComponent, IssUnpGlobalprintComponent, AssetReceiveCabComponent, EchantillonReceiptCabComponent, InventoryDetailComponent, PurchaseReceiptColorantComponent, EpiInventoryTransactionComponent, EpiIssueComponent, EpiReceiptComponent, EpiMonthlyDistributionComponent, EpiInventoryReportComponent, PoUnreceipCabComponent, PoReceipCabIdLabComponent, PoUnreceipVendComponent],
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
