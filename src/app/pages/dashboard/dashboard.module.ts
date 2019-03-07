import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from 'src/app/core/services/guards/auth.guard';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { TokenInterceptorService } from 'src/app/core/services/interceptors/tokenInterceptor';

declare var require: any;
export function HighchartsFactory() {
  const hc = require('highcharts/highstock');
  const hd = require('highcharts/modules/exporting');
  let expdt = require('highcharts/modules/export-data');
  hd(hc);
  expdt(hc);
  return hc;
}

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    ChartModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    {
      provide: HighchartsStatic,
      useFactory: HighchartsFactory
    }
  ]
})
export class DashboardModule { }
