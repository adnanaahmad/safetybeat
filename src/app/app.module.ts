import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MaterialModule } from './shared/material/material.module';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthGuard } from './core/services/guards/auth.guard';
import { TokenInterceptorService } from './core/services/interceptors/tokenInterceptor';
import { ToastrModule } from 'ng6-toastr-notifications';
import { NotifierModule } from 'angular-notifier';
import { CoreService } from './core/services/authorization/core.service';
import { PageNotFoundComponent } from './core/components/pageNotFound/pageNotFound.component';
import { ModalDialogComponent } from './pages/modalDialog/components/modalDialog/modalDialog.component';
import { CookieService } from 'ngx-cookie-service';
import { ChartModule } from 'angular-highcharts';
import { Chart } from 'highcharts';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ModalDialogComponent,
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],

  bootstrap: [AppComponent],
  entryComponents: [ModalDialogComponent]
})
export class AppModule { }
