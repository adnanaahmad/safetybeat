import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {MaterialModule} from 'src/app/shared/material/material.module';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthGuard} from 'src/app/core/services/guards/auth.guard';
import {TokenInterceptorService} from 'src/app/core/services/interceptors/tokenInterceptor';
import {AnalyticsReportModule} from 'src/app/pages/analyticsReport/analyticsReport.module';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    AnalyticsReportModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    }

  ]
})
export class DashboardModule {
}