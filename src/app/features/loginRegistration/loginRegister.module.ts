import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginRegisterRoutingModule} from './loginRegister-routing.module';
import {LoginComponent} from './components/login/login.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {MaterialModule} from 'src/app/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {LoginRegistrationService} from './services/LoginRegistrationService';
import {AuthGuard} from 'src/app/services/core/guards/auth.guard';
import {TokenInterceptorService} from 'src/app/services/core/interceptors/tokenInterceptor';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {ForgotPasswordComponent} from './components/forgotPassword/forgotPassword.component';
import {ParticleContainerComponent} from './components/particleContainer/particleContainer.component';
import {PasswordRecoveryComponent} from './components/passwordRecovery/passwordRecovery.component';
import {PackageDetailsComponent} from './components/packageDetails/packageDetails.component';
import { UpdateprofileComponent } from './components/updateprofile/updateprofile.component';

@NgModule({
  imports: [
    CommonModule,
    LoginRegisterRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoginComponent,
    RegistrationComponent,
    ForgotPasswordComponent,
    ParticleContainerComponent,
    PasswordRecoveryComponent,
    PackageDetailsComponent,
    UpdateprofileComponent
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
    ParticleContainerComponent
  ],
})
export class LoginRegisterModule {
}
