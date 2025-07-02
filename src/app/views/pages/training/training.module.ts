import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingComponent } from './training.component';
import { CreateTrainingComponent } from './create-training/create-training.component';
import { ListTrainingComponent } from './list-training/list-training.component';
import { EditTrainingComponent } from './edit-training/edit-training.component';
import { CreateTrainingDomainComponent } from './create-training-domain/create-training-domain.component';
import { CreateTrainingSectionComponent } from './create-training-section/create-training-section.component';
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

import { AngularSlickgridModule } from 'angular-slickgrid';

import {CodeService,
         ItemService,
         PsService,
         ItemModelService,
         SiteService, 
         SequenceService,
         LocationService,
         CustomerService,
         FinancialchargeService, 
         AccountUnplanifedService,
         ProviderService ,
         ProductLineService, 
         MesureService, 
         CostSimulationService, 
         InventoryStatusService,
         TaxeService,
         JobService,
         Quote,
         QuoteService,
         SaleOrder,
         UsersService,
         EmployeService,
         RequisitionService,
         ReasonService,
         PopulationemployeService,
         TrainingcalenderService,
         ProjectService,AddReportService,AddReport, AffectEmp,AffectEmpService,
         InventoryTransactionService,LocationDetailService,
         QualityControlService,
         AccountShiperService,
         PayMethService,
         LabelService,
         DomainService,
         PrintersService,
         SaleOrderService,
         PricelistService,
         InvoiceOrder,
         InvoiceOrderService,
         SaleShiperService,
         InvoiceOrderTemp,
         InvoiceOrderTempService,
         ConfigService,
         AccountReceivableService,
         CRMService
        } from '../../../core/erp';
import { UpdateTrainingComponent } from './update-training/update-training.component';
import { ListSectionComponent } from './list-section/list-section.component';
import { ListDomainComponent } from './list-domain/list-domain.component';
import { CreateTrainingRequestComponent } from './create-training-request/create-training-request.component';
import { CreateRequestGroupComponent } from './create-request-group/create-request-group.component';
import { CreateReqTrainingComponent } from './create-req-training/create-req-training.component';
import { ApprovalReqComponent } from './approval-req/approval-req.component';
import { CreateTrainingCalanderComponent } from './create-training-calander/create-training-calander.component';
import { CreatePopulationComponent } from './create-population/create-population.component';
import { EditPopulationComponent } from './edit-population/edit-population.component';
import { UpdatePopulationComponent } from './update-population/update-population.component';
import { ListPopulationComponent } from './list-population/list-population.component';
import { CreateTrainingSessionComponent } from './create-training-session/create-training-session.component';
import { LaunchTrainingSessionComponent } from './launch-training-session/launch-training-session.component';
import { TrainingReportComponent } from './training-report/training-report.component';
import { TrainingHotEvalComponent } from './training-hot-eval/training-hot-eval.component';
import { TrainingColdEvalComponent } from './training-cold-eval/training-cold-eval.component';
import { CreateTrainingTypeComponent } from './create-training-type/create-training-type.component';
import { TrainingSessionListComponent } from './training-session-list/training-session-list.component';
import { TrainingReportListComponent } from './training-report-list/training-report-list.component';
import { TrainingEvalListComponent } from './training-eval-list/training-eval-list.component';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { GestionDeFormationComponent } from './gestion-de-formation/gestion-de-formation.component';
import { LocationFilterService } from 'src/app/core/erp/_services/location-filter.service';
import { GestionCommercialeComponent } from './gestion-commerciale/gestion-commerciale.component';
import { GestionMoyensGenerauxComponent } from './gestion-moyens-generaux/gestion-moyens-generaux.component';
import { EnqueteSatisfactionComponent } from './enquete-satisfaction/enquete-satisfaction.component';

    const routes: Routes = [
     
          
              {
                  path: "list-training",
                  component: ListTrainingComponent,
              },
              {
                  path: "create-training",
                  component: CreateTrainingComponent,
              },
              
              {
                  path: "edit-training/:id",
                  component: EditTrainingComponent,
              },
              {
                path: "edit-student/:id",
                component: EditStudentComponent,
            },
              {
                path: "create-training-type",
                component: CreateTrainingTypeComponent,
              },
              {
                path: "gestion-de-formation",
                component: GestionDeFormationComponent,
              },
              {
                path: "gestion-commerciale",
                component: GestionCommercialeComponent,
              },
              {
                path: "gestion-moyens-generaux",
                component: GestionMoyensGenerauxComponent,
              },
              {
                path: "create-training-domain",
                component: CreateTrainingDomainComponent,
              },
              {
                path: "create-training-section",
                component: CreateTrainingSectionComponent,
              },
              {
                path: "list-domain",
                component: ListDomainComponent,
              },
              {
                path: "list-section",
                component: ListSectionComponent,
              },
              {
                path: "update-training",
                component: UpdateTrainingComponent,
              },
              {
                path: "create-training-request",
                component: CreateTrainingRequestComponent,
              },     
              {
                path: "create-request-group",
                component: CreateRequestGroupComponent,
              }, 
              {
                path: "create-req-training",
                component: CreateReqTrainingComponent,
              },     
              {
                path: "approval-req",
                component: ApprovalReqComponent,
              },    
              {
                path: "list-population",
                component: ListPopulationComponent,
              },
              {
                path: "create-population",
                component: CreatePopulationComponent,
              },
              {
                path: "edit-population/:id",
                component: EditPopulationComponent,
              },
              {
                path: "update-population",
                component: UpdatePopulationComponent,
              }, 
              {
                path: "create-training-calander",
                component: CreateTrainingCalanderComponent,
              },
              {
                path: "create-training-session",
                component: CreateTrainingSessionComponent,
              },
              {
                path: "training-session-list",
                component: TrainingSessionListComponent,
              },
              {
                path: "launch-training-session",
                component: LaunchTrainingSessionComponent,
              },
              {
                path: "training-report",
                component: TrainingReportComponent,
              },
              {
                path: "training-report-list",
                component: TrainingReportListComponent,
              },
              {
                path: "training-hot-eval",
                component: TrainingHotEvalComponent,
              },
              {
                path: "enquete-satisfaction",
                component: EnqueteSatisfactionComponent,
              },
              {
                path: "training-cold-eval",
                component: TrainingColdEvalComponent,
              },
              {
                path: "training-eval-list",
                component: TrainingEvalListComponent,
              },
  ]
  


@NgModule({
  declarations: [TrainingComponent, CreateTrainingComponent, ListTrainingComponent, EditTrainingComponent, CreateTrainingDomainComponent, CreateTrainingSectionComponent, UpdateTrainingComponent, ListSectionComponent, ListDomainComponent, CreateTrainingRequestComponent, CreateRequestGroupComponent, CreateReqTrainingComponent, ApprovalReqComponent, CreateTrainingCalanderComponent, CreatePopulationComponent, EditPopulationComponent, UpdatePopulationComponent, ListPopulationComponent, CreateTrainingSessionComponent, LaunchTrainingSessionComponent, TrainingReportComponent, TrainingHotEvalComponent, TrainingColdEvalComponent, CreateTrainingTypeComponent, TrainingSessionListComponent, TrainingReportListComponent, TrainingEvalListComponent, EditStudentComponent, GestionDeFormationComponent, GestionCommercialeComponent, GestionMoyensGenerauxComponent, EnqueteSatisfactionComponent],
  
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

    TypesUtilsService,
    LayoutUtilsService,
    HttpUtilsService,
    TypesUtilsService,
    LayoutUtilsService,
    CodeService,
    SiteService,
    LocationService,
    LocationFilterService,
    FinancialchargeService,
    AccountUnplanifedService,
    ProductLineService,
    SequenceService,
    ProviderService,
    ItemService,
    PsService,
    MesureService,
    TaxeService,
    InventoryStatusService,
    CostSimulationService,
    CustomerService,
    LabelService,
    PrintersService,
    DomainService,
    ItemModelService,
    JobService,
    UsersService,
    EmployeService,
    RequisitionService,
    ReasonService,
    PopulationemployeService,
    TrainingcalenderService,
    AddReportService,
    AffectEmpService,
    ProjectService,
    InventoryTransactionService,LocationDetailService,
    QualityControlService,
    AccountShiperService,
    PayMethService,
   QuoteService,
   SaleOrderService,
   PricelistService,
   InvoiceOrder,
   InvoiceOrderService,
   ProductLineService,
   SaleShiperService,
   InvoiceOrderTemp,
   InvoiceOrderTempService,
   ConfigService,
   AccountReceivableService,
   CRMService,
],

entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
],
})
export class TrainingModule { }
