import {Component, OnDestroy, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {ActionReportApiData, ActionReportData, HighChartType, Report} from 'src/app/models/analyticsReport/reports.model';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {AnalyticsReportService} from 'src/app/features/adminControl/modules/analyticsReport/services/analyticsReport.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {HighchartService} from 'src/app/services/common/highchart/highchart.service';
import * as Highcharts from 'highcharts';
import {SubSink} from 'subsink';

@Component({
  selector: 'app-action-report',
  templateUrl: './actionReport.component.html',
  styleUrls: ['./actionReport.component.scss']
})
export class ActionReportComponent implements OnInit, OnDestroy {

  actionReportObj: Report = <Report>{};
  private subs = new SubSink();

  constructor(
    public helperService: HelperService,
    public formBuilder: FormBuilder,
    private navService: NavigationService,
    public analyticsService: AnalyticsReportService,
    public compiler: CompilerProvider,
    private highChartSettings: HighchartService
  ) {
    this.initialize();
    this.getFilters();
  }

  ngOnInit() {
    this.subs.add(
      this.navService.selectedEntityData.subscribe((res) => {
        if (res !== 1) {
          this.actionReportObj.entityId = res.entityInfo.id;
          this.actionReportObj.entityName = res.entityInfo.name;
          this.actionFormValidations['entityName'].setValue(this.actionReportObj.entityName);
          this.actionFormValidations['entityName'].disable();
          this.makeReport(7, null, null);
        }
      }));
  }

  get actionFormValidations() {
    return this.actionReportObj.actionReportForm.controls;
  }

  initialize() {
    this.actionReportObj.loading = false;
    this.actionReportObj.actionReportForm = this.formBuilder.group({
      filter: [''],
      entityName: ['', Validators.required],
      dateTo: ['', Validators.required],
      dateFrom: ['', Validators.required]
    });
    this.actionFormValidations[this.helperService.appConstants.dateFrom].disable();
    this.actionFormValidations[this.helperService.appConstants.dateTo].disable();
    this.actionReportObj.maxDate = new Date();
    this.actionReportObj.minDate = null;
  }

  getFilters() {
    this.subs.add(
      this.analyticsService.filter().subscribe((res) => {
        if (res) {
          this.actionReportObj.filters = res;
          this.actionReportObj.lastWeekObj = this.helperService.find(this.actionReportObj.filters, function (obj) {
            return obj.name === 'Last Week';
          });
          this.actionFormValidations['filter'].setValue(this.actionReportObj.lastWeekObj.id);
        }
      }));
  }

  makeReport(days, dateTo, dateFrom) {
    this.actionReportObj.loading = true;
    let data = {
      'entityId': this.actionReportObj.entityId,
      'dateTo': dateTo,
      'dateFrom': dateFrom,
      'days': days,
    };
    this.subs.add(
      this.analyticsService.actionReport(data).subscribe((res) => {
        if (res && res.responseDetails.code === 100) {
          this.actionReportObj.actionReportData = res.data.checkInList;
          let chartType: HighChartType = {
            type: 'column',
            title: 'Action Report',
            subtitle: '',
            inverted: false
          };
          let data = this.highChartSettings.reportSettings(chartType, [], this.generateCharSeries(this.actionReportObj.actionReportData));
          this.actionReportObj.containerDiv = document.getElementById('action');
          if (this.actionReportObj.containerDiv) {
            Highcharts.chart(this.actionReportObj.containerDiv, data);
          }
          this.actionReportObj.loading = false;
        } else {
          this.actionReportObj.loading = false;
        }
      }));
  }

  generateCharSeries(reportData: any) {
    let dates = [];
    let checkIns = [];
    let checkOuts = [];
    let pulse = [];
    this.helperService.iterations(reportData, function (actionReport: ActionReportData) {
      checkIns.push(actionReport.checkins);
      checkOuts.push(actionReport.checkouts);
      pulse.push(actionReport.pulse);
      dates.push(actionReport.date);
    });
    let charSeries = [{
      name: 'CheckIns',
      data: checkIns
    }, {
      name: 'CheckOuts',
      data: checkOuts
    }, {
      name: 'Pulse',
      data: pulse
    }];
    let data = {
      charSeries: charSeries,
      categories: dates,
      title: 'No of Check In, Check out and Pulse'
    };
    return data;
  }

  actionReportFormSubmit({value, valid}: { value: ActionReportApiData; valid: boolean; }) {
    console.log(value);
    if (!valid) {
      return;
    }
    this.actionReportObj.days = this.helperService.find(this.actionReportObj.filters, function (obj) {
      return obj.id === value.filter;
    });
    this.makeReport(this.actionReportObj.days.days, value.dateTo, value.dateFrom);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  enableDates(value: any) {
    this.actionReportObj.dateEnableObj = this.helperService.find(this.actionReportObj.filters, function (obj) {
      return obj.name === 'Choose a Range';
    });
    if (value === this.actionReportObj.dateEnableObj.id) {
      this.actionFormValidations[this.helperService.appConstants.dateFrom].enable();
    } else {
      this.actionFormValidations[this.helperService.appConstants.dateFrom].disable();
      this.actionFormValidations[this.helperService.appConstants.dateTo].disable();
    }
  }

  enableDateFrom() {
    this.actionFormValidations[this.helperService.appConstants.dateTo].enable();
    this.actionReportObj.minDate = this.actionFormValidations[this.helperService.appConstants.dateFrom].value;
  }

}
