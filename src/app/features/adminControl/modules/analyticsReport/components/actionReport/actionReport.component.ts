import {Component, OnDestroy, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {ActionReport, ActionReportApiData, ActionReportData, HighChartType} from 'src/app/models/analyticsReport/actionReports.model';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {AnalyticsReportService} from 'src/app/features/adminControl/modules/analyticsReport/services/analyticsReport.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {HighchartService} from 'src/app/services/common/highchart/highchart.service';
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
    this.initialize()
    this.setEntityName();
    this.getFilters();
  }

  ngOnInit() {
    this.makeReport(0, null, null);
  }

  get actionFormValidations() {
    return this.actionReportObj.actionReportForm.controls;
  }

  initialize() {
    this.actionReportObj.noSites = false;
    this.actionReportObj.actionReportForm = this.formBuilder.group({
      filter: [''],
      entityName: ['', Validators.required],
      dateTo: ['', Validators.required],
      dateFrom: ['', Validators.required]
    });
    this.actionReportObj.entityId = this.helperService.getEntityId();
    console.log(this.actionReportObj.entityId);
    this.actionFormValidations[this.helperService.appConstants.dateFrom].disable();
    this.actionFormValidations[this.helperService.appConstants.dateTo].disable();
  }

  setEntityName() {
    this.actionReportObj.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res !== 1) {
        this.actionReportObj.entityName = res.entityInfo.name;
        this.actionFormValidations['entityName'].setValue(this.actionReportObj.entityName);
        this.actionFormValidations['entityName'].disable();
      }
    });
  }

  getFilters() {
    this.analyticsService.filter().subscribe((res) => {
      if (res) {
        this.actionReportObj.filters = res;
        this.actionReportObj.lifetimeObj = this.helperService.find(this.actionReportObj.filters, function (obj) {
          return obj.name === 'Lifetime';
        });
        this.actionFormValidations['filter'].setValue(this.actionReportObj.lifetimeObj.id);
      }
    });
  }

  makeReport(days, dateTo, dateFrom) {
    let data = {
      'entityId': this.actionReportObj.entityId,
      'dateTo': dateTo,
      'dateFrom': dateFrom,
      'days': days,
    };
    this.analyticsService.actionReport(data).subscribe((res) => {
      if (res && res.responseDetails.code === 100) {
        this.actionReportObj.actionReportData = res.data.checkInList;
        console.log(this.actionReportObj.actionReportData);
        let chartType: HighChartType = {
          type: 'column',
          title: 'Action Report',
          subtitle: ''
        };
        let data = this.highChartSettings.reportSettings(chartType, [], this.generateCharSeries(this.actionReportObj.actionReportData));
        Highcharts.chart('container', data);
      } else {
        this.actionReportObj.noSites = true;
      }
    });
  }

  generateCharSeries(reportData: any) {
    let charSeries = [];
    this.helperService.iterations(reportData, function (actionReport: ActionReportData) {
      let checkIn = {
        name: actionReport.date,
        data: [actionReport.checkins, actionReport.checkouts, actionReport.pulse]
      };
      charSeries.push(checkIn);

    });
    let data = {
      charSeries: charSeries,
      categories: ['Check In', 'CheckOut', 'Pulse'],
      title: 'No of Check In and Check out'
    }
    return data;
  }

  actionReportFormSubmit({value, valid}: { value: ActionReportApiData; valid: boolean; }) {
    if (!valid) {
      return;
    }
    this.actionReportObj.days = this.helperService.find(this.actionReportObj.filters, function (obj) {
      return obj.id === value.filter;
    });
    this.makeReport(this.actionReportObj.days.days, value.dateTo, value.dateFrom)
  }

  ngOnDestroy() {
    this.actionReportObj.subscription.unsubscribe();
  }

  enableDates(value: any) {
    this.actionReportObj.dateEnableObj = this.helperService.find(this.actionReportObj.filters, function (obj) {
      return obj.name === 'Choose a Range';
    });
    if (value === this.actionReportObj.dateEnableObj.id) {
      this.actionFormValidations[this.helperService.appConstants.dateFrom].enable();
      this.actionFormValidations[this.helperService.appConstants.dateTo].enable();
    } else {
      this.actionFormValidations[this.helperService.appConstants.dateFrom].disable();
      this.actionFormValidations[this.helperService.appConstants.dateTo].disable();
    }
  }
}
