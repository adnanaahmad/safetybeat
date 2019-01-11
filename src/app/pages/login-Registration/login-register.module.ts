import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRegisterRoutingModule } from './login-register-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { LoginRegistrationService } from './services/LoginRegistrationService';
import { AuthGuard } from 'src/app/core/services/guards/auth.guard';
import { TokenInterceptorService } from 'src/app/core/services/interceptors/token-interceptor';
import { ToastrModule } from 'ng6-toastr-notifications';
import { ParticleContainerComponent } from './components/particle-container/particle-container.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/app.module';
import { VerificationComponent } from './components/verification/verification.component';
import { CompilerProvider } from 'src/app/shared/compiler/compiler';
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
    VerificationComponent,
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
    ForgotPasswordComponent,
    ParticleContainerComponent,
  ]
})
export class LoginRegisterModule { }
