// Angular
import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
// Material
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
// Translate
import { TranslateModule } from "@ngx-translate/core";
// NGRX
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
// CRUD
import { InterceptService } from "../../../core/_base/crud/";
// Module components
import { AuthComponent } from "./auth.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { AuthNoticeComponent } from "./auth-notice/auth-notice.component";
// Auth
import {
  AuthEffects,
  AuthGuard,
  authReducer,
  AuthService,
} from "../../../core/auth";
import { NewCustomerComponent } from "./new-customer/new_customer.component";
import { NewShop } from "./new-shop/new_shop.component";
import { PatientLoginComponent } from "./patient-login/patient-login.component";
import { PatientService } from "src/app/core/erp";
import { PatientSignupComponent } from "./patient-signup/patient-signup.component";
import { RdvPickComponent } from "./rdv-pick/rdv-pick.component";

const routes: Routes = [
  {
    path: "",
    component: AuthComponent,
    children: [
      {
        path: "",
        redirectTo: "login",
        pathMatch: "full",
      },
      {
        path: "login",
        component: LoginComponent,
        data: { returnUrl: window.location.pathname },
      },
      {
        path: "register",
        component: RegisterComponent,
      },
      {
        path: "forgot-password",
        component: ForgotPasswordComponent,
      },
      {
        path: "new-customer/:promo_code",
        component: NewCustomerComponent,
      },
      {
        path: "new-shop",
        component: NewShop,
      },
      {
        path: "patient-login",
        component: PatientLoginComponent,
      },
      {
        path: "patient-signup/:phone",
        component: PatientSignupComponent,
      },
      {
        path: "rdv-pick/",
        component: RdvPickComponent, // add phone as a param
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    TranslateModule.forChild(),
    StoreModule.forFeature("auth", authReducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
  providers: [
    InterceptService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true,
    },
  ],
  exports: [AuthComponent],
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    AuthNoticeComponent,
    NewCustomerComponent,
    NewShop,
    PatientLoginComponent,
    PatientSignupComponent,
    RdvPickComponent,
  ],
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [AuthService, AuthGuard,PatientService],
    };
  }
}
