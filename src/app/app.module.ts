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
import { CreateEntityComponent } from './pages/adminControl/modules/entityControl/dialogs/createEntityModal/createEntity.component';
import { JoinEntityModalComponent } from './pages/adminControl/modules/entityControl/dialogs/joinEntityModal/joinEntityModal.component';
import { InviteUserModalComponent } from './Dialogs/inviteUserModal/inviteUserModal.component';
import { VerificationComponent } from './Dialogs/verification/verification.component';
import { CompilerProvider } from './shared/compiler/compiler';
import { InviteTeamModalComponent } from './pages/adminControl/modules/entityControl/dialogs/inviteTeamModal/inviteTeamModal.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';
import { ToasterComponent } from './common/toaster/toaster.component';
import { AddSiteModalComponent } from './pages/adminControl/modules/siteCenter/dialogs/addSiteModal/addSiteModal.component';
import { ImportSiteModalComponent } from './pages/adminControl/modules/siteCenter/dialogs/ImportSiteModal/ImportSiteModal.component';
import { ConfirmationModalComponent } from './Dialogs/conformationModal/confirmationModal.component';
import { ChangeAccessLevelComponent } from './pages/adminControl/modules/memberCenter/dialogs/changeAccessLevel/changeAccessLevel.component';
import { EntityCodeModalComponent } from './pages/adminControl/modules/entityControl/dialogs/entityCodeModal/entityCodeModal.component';
import { AddHazardComponent } from './pages/adminControl/modules/siteCenter/dialogs/addHazard/addHazard.component';
import { HazardDetailsComponent } from './pages/adminControl/modules/hazardCenter/dialogs/hazardDetails/hazardDetails.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GeneralComponent } from './pages/settings/components/general/general.component';
import { SecurityComponent } from './pages/settings/components/security/security.component';
import { AddQuestionComponent } from './pages/adminControl/modules/questionCenter/dialogs/addQuestion/addQuestion.component';
import { CreateFolderComponent } from './pages/navigation/dialogs/createFolder/createFolder.component';
import { UploadDocComponent } from './pages/navigation/dialogs/uploadDoc/uploadDoc.component';
import { SiteMapComponent } from './pages/adminControl/modules/siteCenter/dialogs/siteMap/siteMap.component';
import { ViewDocComponent } from './pages/navigation/dialogs/viewDoc/viewDoc.component';
import { RegisterTeamComponent } from './pages/adminControl/modules/myTeam/dialogs/registerTeam/registerTeam.component';
import { ViewTeamComponent } from './pages/adminControl/modules/myTeam/dialogs/viewTeam/viewTeam.component';
import { CreateQuestionComponent } from './pages/adminControl/modules/questionCenter/dialogs/createQuestion/createQuestion.component';
import { UploadFolderDocComponent } from './pages/navigation/dialogs/uploadFolderDoc/uploadFolderDoc.component';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    CreateEntityComponent,
    JoinEntityModalComponent,
    EntityCodeModalComponent,
    InviteUserModalComponent,
    VerificationComponent,
    InviteTeamModalComponent,
    ToasterComponent,
    AddSiteModalComponent,
    ImportSiteModalComponent,
    ConfirmationModalComponent,
    ChangeAccessLevelComponent,
    AddHazardComponent,
    HazardDetailsComponent,
    GeneralComponent,
    SecurityComponent,
    AddQuestionComponent,
    SiteMapComponent,
    UploadDocComponent,
    UploadFolderDocComponent,
    CreateFolderComponent,
    ViewDocComponent,
    ViewDocComponent,
    RegisterTeamComponent,
    ViewTeamComponent,
    CreateQuestionComponent
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
    NotifierModule,
    DragDropModule
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
  exports: [],
  entryComponents: [
    CreateEntityComponent,
    JoinEntityModalComponent,
    EntityCodeModalComponent,
    InviteUserModalComponent,
    CreateEntityComponent,
    VerificationComponent,
    InviteTeamModalComponent,
    ToasterComponent,
    AddSiteModalComponent,
    ImportSiteModalComponent,
    ConfirmationModalComponent,
    ChangeAccessLevelComponent,
    AddHazardComponent,
    HazardDetailsComponent,
    GeneralComponent,
    SecurityComponent,
    AddHazardComponent,
    AddQuestionComponent,
    SiteMapComponent,
    UploadDocComponent,
    UploadFolderDocComponent,
    CreateFolderComponent,
    ViewDocComponent,
    CreateQuestionComponent,
    ViewDocComponent,
    RegisterTeamComponent,
    ViewTeamComponent    
  ]
})
export class AppModule {
}
