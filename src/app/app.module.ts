import { NgModule } from '@angular/core';
// app modules
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// material modules
import {
  MatCardModule,
  MatToolbarModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatStepperModule,
  MatSelectModule
} from '@angular/material';

// app components
import { AppComponent } from './app.component';
import { LoginComponent } from '../components/login/login.component';
import { ForgotpasswordComponent } from '../components/forgotpassword/forgotpassword.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { HeaderComponent } from '../components/header/header.component';
import { RegistrationComponent } from '../components/registration/registration.component';

// app services
import { RegistrationService } from '../services/registration/registration.service';
import { LoginService } from '../services/login/login.service';
import { AuthGuard } from '../services/auth/auth.guard';
import { TokenInterceptorService } from '../services/auth/token-interceptor';
import { JwtInterceptor } from '../services/auth/JWT.interceptor';
import { ErrorInterceptor } from '../services/auth/error.interceptor';
import { CookieService } from 'ngx-cookie-service';

// import { LogoutComponent } from '../components/logout/logout.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotpasswordComponent,
    RegistrationComponent,
    DashboardComponent,
    HeaderComponent,
    // LogoutComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatStepperModule,
    MatSelectModule
  ],
  providers: [
    LoginService,
    RegistrationService,
    AuthGuard,
    ErrorInterceptor,
    JwtInterceptor,
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
