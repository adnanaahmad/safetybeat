import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AppComponent} from './app.component';
import {MaterialModule} from './material.module';
import {
  TranslateModule,
  TranslateLoader,
  TranslateService
} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AuthGuard} from './services/core/guards/auth.guard';
import {TokenInterceptorService} from './services/core/interceptors/tokenInterceptor';
import {NotifierModule} from 'angular-notifier';
import {CoreService} from './services/core/authorization/core.service';
import {CookieService} from 'ngx-cookie-service';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {CreateEntityComponent} from './features/adminControl/modules/entityControl/dialogs/createEntityModal/createEntity.component';
import {JoinEntityModalComponent} from './features/adminControl/modules/entityControl/dialogs/joinEntityModal/joinEntityModal.component';
import {InviteUserModalComponent} from './dialogs/inviteUserModal/inviteUserModal.component';
import {CompilerProvider} from './services/common/compiler/compiler';
import {InviteTeamModalComponent} from './features/adminControl/modules/entityControl/dialogs/inviteTeamModal/inviteTeamModal.component';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatDatepickerModule, MatInputModule, MatNativeDateModule} from '@angular/material';
import {ToasterComponent} from './components/toaster/toaster.component';
import {ArchivedSitesComponent} from 'src/app/features/adminControl/modules/siteCenter/dialogs/archivedSites/archivedSites.component';
import {ArchivedHazardsComponent} from 'src/app/features/adminControl/modules/hazardCenter/dialogs/archived-hazards/archived-hazards.component';
import {ArchivedTeamComponent} from 'src/app/features/adminControl/modules/myTeam/dialogs/archived-team/archived-team.component';
import {AddSiteModalComponent} from './features/adminControl/modules/siteCenter/dialogs/addSiteModal/addSiteModal.component';
import {ImportSiteModalComponent} from './features/adminControl/modules/siteCenter/dialogs/ImportSiteModal/ImportSiteModal.component';
import {ConfirmationModalComponent} from './dialogs/conformationModal/confirmationModal.component';
import {ChangeAccessLevelComponent} from './features/adminControl/modules/memberCenter/dialogs/changeAccessLevel/changeAccessLevel.component';
import {EntityCodeModalComponent} from './features/adminControl/modules/entityControl/dialogs/entityCodeModal/entityCodeModal.component';
import {AddHazardComponent} from './features/adminControl/modules/siteCenter/dialogs/addHazard/addHazard.component';
import {HazardDetailsComponent} from './features/adminControl/modules/hazardCenter/dialogs/hazardDetails/hazardDetails.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {GeneralComponent} from './features/settings/components/general/general.component';
import {SecurityComponent} from './features/settings/components/security/security.component';
import {AddQuestionComponent} from './features/adminControl/modules/questionCenter/dialogs/addQuestion/addQuestion.component';
import {CreateFolderComponent} from 'src/app/features/adminControl/modules/documents/dialogs/createFolder/createFolder.component';
import {UploadDocComponent} from 'src/app/features/adminControl/modules/documents/dialogs/uploadDoc/uploadDoc.component';
import {SiteMapComponent} from './features/adminControl/modules/siteCenter/dialogs/siteMap/siteMap.component';
import {ViewDocComponent} from 'src/app/features/adminControl/modules/documents/dialogs/viewDoc/viewDoc.component';
import {RegisterTeamComponent} from './features/adminControl/modules/myTeam/dialogs/registerTeam/registerTeam.component';
import {ViewTeamComponent} from './features/adminControl/modules/myTeam/dialogs/viewTeam/viewTeam.component';
import {CreateQuestionComponent} from './features/adminControl/modules/questionCenter/dialogs/createQuestion/createQuestion.component';
import {MyTeamModule} from './features/adminControl/modules/myTeam/myTeam.module';
import {ProfileImagePipe} from './pipes/profileImage/profile-image.pipe';
import {AdvanceSearchComponent} from './features/adminControl/modules/siteCenter/dialogs/advanceSearch/advanceSearch.component';
import {ImageLightboxComponent} from './dialogs/imageLightbox/imageLightbox.component';
import {SendSiteCodeComponent} from './features/adminControl/modules/siteCenter/dialogs/sendEntityCode/sendSiteCode.component';
import {ShowSiteCodeComponent} from './features/adminControl/modules/siteCenter/dialogs/showSiteCode/showSiteCode.component';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {FileRenameComponent} from './features/adminControl/modules/documents/dialogs/fileRename/fileRename.component';
import {AddActionsComponent} from './features/adminControl/modules/siteCenter/dialogs/addActions/addActions.component';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {FlatpickrModule} from 'angularx-flatpickr';
import {AddleavesComponent} from './features/profile/dialogs/addLeaves/addleaves.component';
import {LeaveinfoComponent} from './features/profile/dialogs/leaveinfo/leaveinfo.component';
import {NoAuthGuard} from './services/core/restrict/restrict.service';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireMessagingModule} from '@angular/fire/messaging';
import {environment} from '../environments/environment';
import {FirebaseService} from './services/common/FirebaseNotification/firebase.service';
import { NotificationsComponent } from './components/notifications/notifications.component';
import {CheckInCategoryModalComponent} from './features/adminControl/modules/entityControl/dialogs/checkInCategoryModal/checkInCategoryModal.component';
import {ArchivedEntityComponent} from './features/adminControl/modules/entityControl/dialogs/archived-entity/archived-entity.component';
import {PulseCategoyModalComponent} from './features/adminControl/modules/entityControl/dialogs/pulseCategoyModal/pulseCategoyModal.component';
import {NgxStripeModule} from 'ngx-stripe';
import {UpdatepackgaeComponent} from './features/loginRegistration/dialogs/updatepackgae/updatepackgae.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ArchivedEntityComponent,
    ArchivedSitesComponent,
    ArchivedHazardsComponent,
    AddActionsComponent,
    CreateEntityComponent,
    JoinEntityModalComponent,
    CheckInCategoryModalComponent,
    PulseCategoyModalComponent,
    EntityCodeModalComponent,
    InviteUserModalComponent,
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
    CreateFolderComponent,
    ViewDocComponent,
    ViewDocComponent,
    RegisterTeamComponent,
    ViewTeamComponent,
    CreateQuestionComponent,
    ProfileImagePipe,
    AdvanceSearchComponent,
    ImageLightboxComponent,
    SendSiteCodeComponent,
    ShowSiteCodeComponent,
    FileRenameComponent,
    AddleavesComponent,
    LeaveinfoComponent,
    NotificationsComponent,
    UpdatepackgaeComponent
  ],
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
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
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    AppRoutingModule,
    NotifierModule,
    DragDropModule,
    MyTeamModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    NgxStripeModule.forRoot('pk_test_Lb57rKyiksjzP2bgLisJ9ZZH00VjtkbY9Y')
  ],
  providers: [
    MatDatepickerModule,
    TranslateService,
    CoreService,
    AuthGuard,
    NoAuthGuard,
    CookieService,
    CompilerProvider,
    FirebaseService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {
        duration: 2000,
      }
    },
  ],

  bootstrap: [AppComponent],
  exports: [],
  entryComponents: [
    ArchivedEntityComponent,
    ArchivedSitesComponent,
    ArchivedHazardsComponent,
    ArchivedTeamComponent,
    AdvanceSearchComponent,
    AddActionsComponent,
    CreateEntityComponent,
    JoinEntityModalComponent,
    CheckInCategoryModalComponent,
    PulseCategoyModalComponent,
    EntityCodeModalComponent,
    InviteUserModalComponent,
    CreateEntityComponent,
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
    CreateFolderComponent,
    ViewDocComponent,
    CreateQuestionComponent,
    ViewDocComponent,
    RegisterTeamComponent,
    ViewTeamComponent,
    AdvanceSearchComponent,
    ImageLightboxComponent,
    SendSiteCodeComponent,
    ShowSiteCodeComponent,
    FileRenameComponent,
    AddleavesComponent,
    LeaveinfoComponent,
    NotificationsComponent,
    UpdatepackgaeComponent
  ]
})
export class AppModule {
}
