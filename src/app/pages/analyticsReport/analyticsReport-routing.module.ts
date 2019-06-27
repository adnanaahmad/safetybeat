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
import { PersonPulseReportComponent } from './components/personPulseReport/personPulseReport.component';
import { SiteActivityReportComponent } from './components/siteActivityReport/siteActivityReport.component';

const routes: Routes = [
  {
    path: 'actionAlertsReport',
    component: ActionAlertsReportsComponent,
  },
  {
    path: 'actionReport',
    component: ActionReportComponent,
  },
  {
    path: 'alertsPersonReport',
    component: AlertsPersonReportComponent,
  },
  {
    path: 'averageDailyActionsReport',
    component: AverageDailyActionsReportComponent,
  },
  {
    path: 'checkInActivityReport',
    component: CheckInActivityReportComponent,
  },
  {
    path: 'compliantCheckoutReport',
    component: CompliantCheckoutReportComponent,
  },
  {
    path: 'entityPulseReport',
    component: EntityPulseReportComponent,
  },
  {
    path: 'hazardReport',
    component: HazardReportComponent,
  },
  {
    path: 'personPulseReport',
    component: PersonPulseReportComponent,
  },
  {
    path: 'siteActivityReport',
    component: SiteActivityReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsReportRoutingModule { }
