import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AnalyticsReportRoutingModule} from './analyticsReport-routing.module';
import {ActionAlertsReportsComponent} from './components/actionAlertsReport/actionAlertsReport.component';
import {ActionReportComponent} from './components/actionReport/actionReport.component';
import {AlertsPersonReportComponent} from './components/alertsPersonReport/alertsPersonReport.component';
import {AverageDailyActionsReportComponent} from './components/averageDailyActionsReport/averageDailyActionsReport.component';
import {CheckInActivityReportComponent} from './components/checkinActivityReport/checkinActivityReport.component';
import {EntityPulseReportComponent} from './components/entityPulseReport/entityPulseReport.component';
import {PersonPulseReportComponent} from './components/personPulseReport/personPulseReport.component';
import {CompliantCheckoutReportComponent} from './components/compliantCheckoutReport/compliantCheckoutReport.component';
import {SiteActivityReportComponent} from './components/siteActivityReport/siteActivityReport.component';
import {HazardReportComponent} from './components/hazardReport/hazardReport.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'src/app/shared/material/material.module';

@NgModule({
  imports: [
    CommonModule,
    AnalyticsReportRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    ActionReportComponent,
    AverageDailyActionsReportComponent,
    CheckInActivityReportComponent,
    AlertsPersonReportComponent,
    ActionAlertsReportsComponent,
    EntityPulseReportComponent,
    PersonPulseReportComponent,
    CompliantCheckoutReportComponent,
    SiteActivityReportComponent,
    HazardReportComponent],
  exports: [
    SiteActivityReportComponent
  ]
})
export class AnalyticsReportModule {
}
