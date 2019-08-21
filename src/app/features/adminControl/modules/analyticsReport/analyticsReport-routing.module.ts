import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActionAlertsReportsComponent } from './components/actionAlertsReport/actionAlertsReport.component';
import { ActionReportComponent } from './components/actionReport/actionReport.component';
import { AlertsPersonReportComponent } from './components/alertsPersonReport/alertsPersonReport.component';
import { AverageDailyActionsReportComponent } from './components/averageDailyActionsReport/averageDailyActionsReport.component';
import { CheckInActivityReportComponent } from './components/checkinActivityReport/checkinActivityReport.component';
import { CompliantCheckoutReportComponent } from './components/compliantCheckoutReport/compliantCheckoutReport.component';
import { EntityPulseReportComponent } from './components/entityPulseReport/entityPulseReport.component';
import { HazardReportComponent } from './components/hazardReport/hazardReport.component';
import { SiteActivityReportComponent } from './components/siteActivityReport/siteActivityReport.component';
import { NoAuthGuard } from 'src/app/services/core/restrict/restrict.service';

const routes: Routes = [
  {
    path: 'actionAlertsReport',
    component: ActionAlertsReportsComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'actionReport',
    component: ActionReportComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'alertsPersonReport',
    component: AlertsPersonReportComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'averageDailyActionsReport',
    component: AverageDailyActionsReportComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'checkInActivityReport',
    component: CheckInActivityReportComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'compliantCheckoutReport',
    component: CompliantCheckoutReportComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'entityPulseReport',
    component: EntityPulseReportComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'hazardReport',
    component: HazardReportComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'siteActivityReport',
    component: SiteActivityReportComponent,
    canActivate: [NoAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsReportRoutingModule { }
