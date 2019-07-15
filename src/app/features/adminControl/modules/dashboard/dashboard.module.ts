import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {MaterialModule} from 'src/app/material.module';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthGuard} from 'src/app/services/core/guards/auth.guard';
import {TokenInterceptorService} from 'src/app/services/core/interceptors/tokenInterceptor';
import {AnalyticsReportModule} from 'src/app/features/adminControl/modules/analyticsReport/analyticsReport.module';

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
