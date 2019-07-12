import {Component, OnDestroy, OnInit} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {ActionReport, ActionReportApiData, HighChartType} from 'src/app/models/analyticsReport/actionReports.model';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {AnalyticsReportService} from 'src/app/pages/adminControl/modules/analyticsReport/services/analyticsReport.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {HighchartService} from 'src/app/shared/highchart/highchart.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-action-report',
  templateUrl: './actionReport.component.html',
  styleUrls: ['./actionReport.component.scss']
})
export class ActionReportComponent implements OnInit, OnDestroy {

  actionReportObj: ActionReport = <ActionReport>{};

  constructor(
    public helperService: HelperService,
    public formBuilder: FormBuilder,
    private navService: NavigationService,
    public analyticsService: AnalyticsReportService,
    public compiler: CompilerProvider,
    private highChartSettings: HighchartService
  ) {
    this.actionReportObj.filters = ['Choose a Range', 'weekly', 'monthly', 'yearly', 'Lifetime'];
    this.actionReportObj.noSites = false;
  }

  ngOnInit() {
    this.actionReportObj.actionReportForm = this.formBuilder.group({
      filter: [''],
      entityName: ['', Validators.required],
      dateTo: ['', Validators.required],
      dateFrom: ['', Validators.required]
    });
    this.actionReportObj.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res !== 1) {

        this.actionReportObj.allEntitiesData = res;
        this.actionReportObj.entityUserData = this.actionReportObj.allEntitiesData.entities;
        this.actionReportObj.entityId = res.entityInfo.id;
        this.actionReportObj.entityName = res.entityInfo.name;
        this.actionFormValidations['entityName'].setValue(this.actionReportObj.entityName);
        this.actionFormValidations['entityName'].disable();
      }
    });
    this.actionFormValidations[this.helperService.appConstants.filter].setValue(this.actionReportObj.filters[4]);
    this.actionReportObj.entityId = JSON.parse(this.helperService.decrypt
    (localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
      this.helperService.appConstants.key));
    this.defaultReport();
  }

  get actionFormValidations() {
    return this.actionReportObj.actionReportForm.controls;
  }

  defaultReport() {
    let data = {
      'entityId': this.actionReportObj.entityId,
      'dateTo': null,
      'dateFrom': null,
      'filter': null
    };
    this.makeReport(data);
  }

  makeReport(data) {
    this.analyticsService.actionReport(data).subscribe((res) => {
      if (res.responseDetails.code === 100) {
        this.actionReportObj.actionReportData = this.compiler.constructActionReportData(res.data);
        let chartType: HighChartType = {
          type: 'column',
          title: 'Action Report',
          subtitle: ''
        };
        let userChart = 0;
        let data = this.highChartSettings.reportSettings(chartType, [], this.actionReportObj.actionReportData, userChart);
        Highcharts.chart('container', data);
      } else {
        this.actionReportObj.noSites = true;
      }
    });
  }

  actionReportFormSubmit({value, valid}: { value: ActionReportApiData; valid: boolean; }) {
    if (!valid) {
      return;
    }
    let data;
    if (value.filter !== 'Choose a Range') {
      data = {
        'entityId': this.actionReportObj.entityId,
        'dateTo': null,
        'dateFrom': null,
        'filter': value.filter
      };
    } else {
      data = {
        'entityId': this.actionReportObj.entityId,
        'dateTo': value.dateTo,
        'dateFrom': value.dateFrom,
        'filter': null
      };
    }
    this.makeReport(data);
  }

  ngOnDestroy() {
    this.actionReportObj.subscription.unsubscribe();
  }

  filteredReport(value: any) {
    if (value !== 'Choose a Range') {
      this.actionFormValidations[this.helperService.appConstants.dateFrom].disable();
      this.actionFormValidations[this.helperService.appConstants.dateTo].disable();
    } else {
      this.actionFormValidations[this.helperService.appConstants.dateFrom].enable();
      this.actionFormValidations[this.helperService.appConstants.dateTo].enable();
    }
  }
}
