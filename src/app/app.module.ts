import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MaterialModule } from './shared/material/material.module';
import {
  TranslateModule,
  TranslateLoader,
  TranslateService
} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthGuard } from './core/services/guards/auth.guard';
import { TokenInterceptorService } from './core/services/interceptors/tokenInterceptor';
import { ToastrModule } from 'ng6-toastr-notifications';
import { NotifierModule } from 'angular-notifier';
import { CoreService } from './core/services/authorization/core.service';
import { CookieService } from 'ngx-cookie-service';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { CreateEntityComponent } from './pages/adminControl/components/createEntityModal/createEntity.component';
import { ModalDialogComponent } from './pages/profile/components/changePasswordModal/changePasswordModal.component';
import { OrgRegistrationComponent } from './pages/loginRegistration/components/orgRegistrationModal/orgRegistration.component';
import { JoinEntityModalComponent } from './pages/adminControl/components/joinEntityModal/joinEntityModal.component';
import { InviteUserModalComponent } from './pages/navigation/components/inviteUserModal/inviteUserModal.component';
import { AlertModalComponent } from './pages/adminControl/components/entityCodeModal/entityCodeModal.component';
import { VerificationComponent } from './pages/loginRegistration/components/verification/verification.component';
import { CompilerProvider } from './shared/compiler/compiler';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ModalDialogComponent, // this need to be remove after profile page is done 
    OrgRegistrationComponent,
    CreateEntityComponent,
    JoinEntityModalComponent,
    AlertModalComponent,
    InviteUserModalComponent,
    VerificationComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    NotifierModule
  ],
  providers: [
    TranslateService,
    CoreService,
    AuthGuard,
    CookieService,
    CompilerProvider,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {
        duration: 3000,
      }
    }
  ],

  bootstrap: [AppComponent],
  entryComponents: [
    ModalDialogComponent, // this need to be remove after profile page is done 
    OrgRegistrationComponent,
    CreateEntityComponent,
    JoinEntityModalComponent,
    AlertModalComponent,
    InviteUserModalComponent,
    CreateEntityComponent,
    VerificationComponent
  ]
})
export class AppModule { }
