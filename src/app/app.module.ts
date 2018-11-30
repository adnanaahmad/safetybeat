import { NgModule } from '@angular/core';
// app modules
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// material modules
import {
  MatCardModule,
  MatToolbarModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatProgressSpinnerModule
} from '@angular/material';

// app components
import { AppComponent } from './app.component';
import { LoginComponent } from '../components/login/login.component';
import { LoginService } from '../services/login/login.service';
import { RegistrationComponent } from '../components/registration/registration.component';
import { AuthGuard } from '../services/auth/auth.guard';
import { TokenInterceptorService } from '../services/auth/token-interceptor';

// app services
import { RegistrationService } from '../services/registration/registration.service';
import { ForgotpasswordComponent } from '../components/forgotpassword/forgotpassword.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { HeaderComponent } from '../components/header/header.component';
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


  ],
  providers: [
    LoginService,
    RegistrationService,
    AuthGuard,
    TokenInterceptorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
