import {Component, OnDestroy, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {
  ActionReportApiData,
  ActionReportData,
  AverageDailyActionReport,
  HighChartType,
  Report
} from 'src/app/models/analyticsReport/reports.model';
import {AnalyticsReportService} from 'src/app/features/adminControl/modules/analyticsReport/services/analyticsReport.service';
import {SubSink} from 'subsink';
import * as Highcharts from 'highcharts';
import {HighchartService} from '../../../../../../services/common/highchart/highchart.service';
import * as moment from 'moment';
import {time} from 'highcharts';
import {timestamp} from 'rxjs/operators';
import {Time} from '@angular/common';

@Component({
  selector: 'app-averageDailyActionsReport',
  templateUrl: './averageDailyActionsReport.component.html',
  styleUrls: ['./averageDailyActionsReport.component.scss']
})
export class AverageDailyActionsReportComponent implements OnInit, OnDestroy {
  averageActionObj: Report = <Report>{};
  private subs = new SubSink();
  week = 7;

  constructor(public helperService: HelperService,
              public formBuilder: FormBuilder,
              public memberService: MemberCenterService,
              public compiler: CompilerProvider,
              private navService: NavigationService,
              private highChartSettings: HighchartService,
              public analyticsService: AnalyticsReportService) {
    this.initialize();
    this.setEntityName();
    this.getAllUsers();
    this.getFilters()

  }

  ngOnInit() {
    this.makeReport(7, null, null, null)
  }

  initialize() {
    this.averageActionObj.averageActionForm = this.formBuilder.group({
      filter: [''],
      entityName: ['', Validators.required],
      dateTo: [],
      dateFrom: [],
      user: ['']
    });
    this.averageActionObj.entityId = this.helperService.getEntityId();
    this.averageDailyActionsValidations[this.helperService.appConstants.dateFrom].disable();
    this.averageDailyActionsValidations[this.helperService.appConstants.dateTo].disable();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  setEntityName() {
    this.subs.add(
      this.navService.selectedEntityData.subscribe((res) => {
        if (res !== 1) {
          this.averageActionObj.entityName = res.entityInfo.name;
          this.averageDailyActionsValidations['entityName'].setValue(this.averageActionObj.entityName);
          this.averageDailyActionsValidations['entityName'].disable();
        }
      }));
  }

  getFilters() {
    this.subs.add(
      this.analyticsService.filter().subscribe((res) => {
        if (res) {
          this.averageActionObj.filters = res;
          this.averageActionObj.lastWeekObj = this.helperService.find(this.averageActionObj.filters, function (obj) {
            return obj.name === 'Last Week';
          });
          this.averageDailyActionsValidations['filter'].setValue(this.averageActionObj.lastWeekObj.id);
        }
      }));
  }

  getAllUsers() {
    let data = {
      entityId: this.helperService.getEntityId()
    };
    this.subs.add(
      this.memberService.allEntityUsers(data).subscribe((res) => {
        if (res) {
          this.averageActionObj.entityUsers = this.compiler.constructDataForTeams(res.data);
        }
      }, (error) => {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
      }));
  }

  averageActionSubmit({value, valid}: { value: ActionReportApiData; valid: boolean; }) {
    console.log(value);
    if (!valid) {
      return;
    }
    this.averageActionObj.days = this.helperService.find(this.averageActionObj.filters, function (obj) {
      return obj.id === value.filter;
    });
    this.makeReport(this.averageActionObj.days.days, value.dateTo, value.dateFrom, value.user);
  }

  get averageDailyActionsValidations() {
    return this.averageActionObj.averageActionForm.controls;
  }

  enableDates(value: any) {
    this.averageActionObj.dateEnableObj = this.helperService.find(this.averageActionObj.filters, function (obj) {
      return obj.name === 'Choose a Range';
    });
    if (value === this.averageActionObj.dateEnableObj.id) {
      this.averageDailyActionsValidations[this.helperService.appConstants.dateFrom].enable();
      this.averageDailyActionsValidations[this.helperService.appConstants.dateTo].enable();
    } else {
      this.averageDailyActionsValidations[this.helperService.appConstants.dateFrom].disable();
      this.averageDailyActionsValidations[this.helperService.appConstants.dateTo].disable();
    }
  }

  makeReport(days, dateTo, dateFrom, user) {
    this.averageActionObj.loading = true;
    let data = {
      'entityId': this.averageActionObj.entityId,
      'dateTo': dateTo,
      'dateFrom': dateFrom,
      'days': days,
      'user': user
    };
    this.subs.add(
      this.analyticsService.averageDailyActionsReport(data).subscribe((res) => {
        if (res && res.responseDetails.code === 100) {
          this.averageActionObj.averageActionReportData = res.data;
          let chartType: HighChartType = {
            type: 'columnrange',
            title: 'Average Daily Action Report',
            subtitle: '',
            inverted: true
          };
          let data = this.highChartSettings.reportSettings(chartType, [],
            this.generateCharSeries(this.averageActionObj.averageActionReportData));
          this.averageActionObj.containerDiv = document.getElementById('avgAction');
          if (this.averageActionObj.containerDiv) {
            Highcharts.chart(this.averageActionObj.containerDiv, data);
          }
          this.averageActionObj.loading = false;
        } else {
          this.averageActionObj.loading = false;
        }
      }));
  }

  generateCharSeries(reportData: any) {
    let users = [];
    let avgCheckInsCheckOuts = [];
    this.helperService.iterations(reportData, function (avgActionReport: AverageDailyActionReport) {
      let checkInTime = avgActionReport.averageCheckIn
      let checkOutTime = avgActionReport.averageCheckOut
      avgCheckInsCheckOuts.push([checkInTime, checkOutTime]);
      users.push(avgActionReport.user);
    });
    let charSeries = [{
      name: 'Time',
      data: avgCheckInsCheckOuts,
    }];
    let data = {
      charSeries: charSeries,
      categories: users,
      title: 'Users Average Check-in time and Average Check-out Time'
    };
    return data;
  }
}
