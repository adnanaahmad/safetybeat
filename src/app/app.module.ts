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
import { NotifierModule } from 'angular-notifier';
import { CoreService } from './core/services/authorization/core.service';
import { CookieService } from 'ngx-cookie-service';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { CreateEntityComponent } from './Dialogs/createEntityModal/createEntity.component';
import { JoinEntityModalComponent } from './Dialogs/joinEntityModal/joinEntityModal.component';
import { InviteUserModalComponent } from './Dialogs/inviteUserModal/inviteUserModal.component';
import { AlertModalComponent } from './Dialogs/entityCodeModal/entityCodeModal.component';
import { VerificationComponent } from './Dialogs/verification/verification.component';
import { CompilerProvider } from './shared/compiler/compiler';
import { InviteTeamModalComponent } from './Dialogs/inviteTeamModal/inviteTeamModal.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';
import { ToasterComponent } from './common/toaster/toaster.component';
import { AddSiteModalComponent } from './Dialogs/addSiteModal/addSiteModal.component';

import {ImportSiteModalComponent} from './pages/adminControl/components/ImportSiteModal/ImportSiteModal.component';
import {ConfirmationModalComponent} from './Dialogs/conformationModal/confirmationModal.component';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    CreateEntityComponent,
    JoinEntityModalComponent,
    AlertModalComponent,
    InviteUserModalComponent,
    VerificationComponent,
    InviteTeamModalComponent,
    ToasterComponent,
    AddSiteModalComponent,
    ImportSiteModalComponent,
    ConfirmationModalComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
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
        duration: 10000,
      }
    }
  ],

  bootstrap: [AppComponent],
  entryComponents: [
    CreateEntityComponent,
    JoinEntityModalComponent,
    AlertModalComponent,
    InviteUserModalComponent,
    CreateEntityComponent,
    VerificationComponent,
    InviteTeamModalComponent,
    ToasterComponent,
    AddSiteModalComponent,
    ImportSiteModalComponent,
    ConfirmationModalComponent
  ]
})
export class AppModule { }
