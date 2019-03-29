import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRegisterRoutingModule } from './loginRegister-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { LoginRegistrationService } from './services/LoginRegistrationService';
import { AuthGuard } from 'src/app/core/services/guards/auth.guard';
import { TokenInterceptorService } from 'src/app/core/services/interceptors/tokenInterceptor';
import { ToastrModule } from 'ng6-toastr-notifications';
import { VerificationComponent } from './components/verification/verification.component';
import { CompilerProvider } from 'src/app/shared/compiler/compiler';
import { ForgotPasswordComponent } from './components/forgotPassword/forgotPassword.component';
import { ParticleContainerComponent } from './components/particleContainer/particleContainer.component';
import { PasswordRecoveryComponent } from './components/passwordRecovery/passwordRecovery.component';
import { LandingComponent } from './components/landing/landing.component';

@NgModule({
  imports: [
    CommonModule,
    LoginRegisterRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
  ],
  declarations: [
    LoginComponent,
    RegistrationComponent,
    ForgotPasswordComponent,
    ParticleContainerComponent,
    PasswordRecoveryComponent,
    LandingComponent
  ],
  providers: [
    LoginRegistrationService,
    CompilerProvider,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    }
  ],
  exports: [
    LoginComponent,
    RegistrationComponent,
    ForgotPasswordComponent
  ]
})
export class LoginRegisterModule { }
