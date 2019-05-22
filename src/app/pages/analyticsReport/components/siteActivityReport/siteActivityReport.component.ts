import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionReport, ActionReportApiData, HighChartType} from '../../../../models/analyticsReport/actionReports.model';
import {HelperService} from '../../../../shared/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {NavigationService} from '../../../navigation/services/navigation.service';
import {AnalyticsReportService} from '../../services/analyticsReport.service';
import {CompilerProvider} from '../../../../shared/compiler/compiler';
import {HighchartService} from '../../../../shared/highchart/highchart.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-siteActivityReport',
  templateUrl: './siteActivityReport.component.html',
  styleUrls: ['./siteActivityReport.component.scss']
})
export class SiteActivityReportComponent implements OnInit, OnDestroy {

  siteActivityObj: ActionReport = <ActionReport>{};

  constructor(
    public helperService: HelperService,
    public formBuilder: FormBuilder,
    private navService: NavigationService,
    public analyticsService: AnalyticsReportService,
    public compiler: CompilerProvider,
    private highChartSettings: HighchartService
  ) {
  }

  ngOnInit() {
    this.siteActivityObj.actionReportForm = this.formBuilder.group({
      entityName: ['', Validators.required],
      dateTo: ['', Validators.required],
      dateFrom: ['', Validators.required]
    });
    this.siteActivityObj.subscription = this.navService.data.subscribe((res) => {
      if (res !== 1) {
        this.siteActivityObj.allEntitiesData = res;
        this.siteActivityObj.entityUserData = this.siteActivityObj.allEntitiesData.entities;
        this.siteActivityObj.entityName = this.siteActivityObj.entityUserData[0].entityInfo.name;
        this.actionFormValidations['entityName'].setValue(this.siteActivityObj.entityName);
        this.actionFormValidations['entityName'].disable();
      }
    });
  }

  get actionFormValidations() {
    return this.siteActivityObj.actionReportForm.controls;
  }

  actionReportFormSubmit({value, valid}: { value: ActionReportApiData; valid: boolean; }) {
    if (!valid) {
      return;
    }
    let data = {
      'entityId': this.siteActivityObj.entityUserData[0].entityInfo.id,
      'dateTo': value.dateTo,
      'dateFrom': value.dateFrom
    };
    this.analyticsService.actionReport(data).subscribe((res) => {
      this.siteActivityObj.actionReportData = this.compiler.constructActionReportData(res);

      let chartType: HighChartType = {
        type: 'column',
        title: 'Site Based Action Report',
        subtitle: ''
      };
      let userChart = 0;
      let data = this.highChartSettings.reportSettings(chartType, [], this.siteActivityObj.actionReportData, userChart);
      Highcharts.chart('container', data);
    });

  }

  ngOnDestroy() {
    this.siteActivityObj.subscription.unsubscribe();
  }
}
