import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { AuthGuard } from '../../core/guards/auth.guard';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TokenInterceptorService } from '../../core/interceptors/token-interceptor';
import { ToastrManager, ToastrModule } from 'ng6-toastr-notifications';
@NgModule({

  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
    FormsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule
  ],
  declarations: [
    LoginComponent,
    RegistrationComponent,
    ForgotPasswordComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    }
  ]
})
export class AuthModule {
}
