import {Component, OnDestroy, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {AnalyticsReportService} from 'src/app/features/adminControl/modules/analyticsReport/services/analyticsReport.service';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {
  ActionReportApiData,
  ActivityData,
  HighChartType,
  Report
} from 'src/app/models/analyticsReport/reports.model';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';
import * as Highcharts from 'highcharts';
import {HighchartService} from 'src/app/services/common/highchart/highchart.service';

@Component({
  selector: 'app-checkinActivityReport',
  templateUrl: './checkinActivityReport.component.html',
  styleUrls: ['./checkinActivityReport.component.scss']
})
export class CheckInActivityReportComponent implements OnInit, OnDestroy {
  checkInActivityObj: Report = <Report>{};

  constructor(public helperService: HelperService,
              public formBuilder: FormBuilder,
              public compiler: CompilerProvider,
              private navService: NavigationService,
              private memberService: MemberCenterService,
              public analyticsService: AnalyticsReportService,
              private highChartSettings: HighchartService) {
    this.initialize()
    this.setEntityName();
    this.getFilters();
    this.getAllUsers();
  }

  ngOnInit() {
    this.checkInActivityObj.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res && res !== 1) {
        this.makeReport(7, null, null, null, false)
      }
    });
  }

  initialize() {
    this.checkInActivityObj.loading = false
    this.checkInActivityObj.checkInActivityForm = this.formBuilder.group({
      filter: [''],
      user: [''],
      entityName: ['', Validators.required],
      dateTo: [],
      dateFrom: [],
      archive: [false]
    });
    this.checkInActivityFormValidations[this.helperService.appConstants.dateFrom].disable();
    this.checkInActivityFormValidations[this.helperService.appConstants.dateTo].disable();
    this.checkInActivityObj.maxDate = new Date();
    this.checkInActivityObj.minDate = null;
  }

  setEntityName() {
    this.checkInActivityObj.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res && res !== 1) {
        this.checkInActivityObj.entityId = res.entityInfo.id;
        this.checkInActivityObj.entityName = res.entityInfo.name;
        this.checkInActivityFormValidations['entityName'].setValue(this.checkInActivityObj.entityName);
        this.checkInActivityFormValidations['entityName'].disable();
      }
    });
  }

  getFilters() {
    this.analyticsService.filter().subscribe((res) => {
      if (res) {
        this.checkInActivityObj.filters = res;
        this.checkInActivityObj.lastWeekObj = this.helperService.find(this.checkInActivityObj.filters, function (obj) {
          return obj.name === 'Last Week';
        });
        this.checkInActivityFormValidations['filter'].setValue(this.checkInActivityObj.lastWeekObj.id);
      }
    });
  }

  get checkInActivityFormValidations() {
    return this.checkInActivityObj.checkInActivityForm.controls;
  }

  getAllUsers() {
    let data = {
      entityId: this.helperService.getEntityId()
    };
    this.memberService.allEntityUsers(data).subscribe((res) => {
      if (res) {
        this.checkInActivityObj.entityUsers = this.compiler.constructDataForTeams(res.data);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

  enableDates(value: any) {
    this.checkInActivityObj.dateEnableObj = this.helperService.find(this.checkInActivityObj.filters, function (obj) {
      return obj.name === 'Choose a Range';
    });
    if (value === this.checkInActivityObj.dateEnableObj.id) {
      this.checkInActivityFormValidations[this.helperService.appConstants.dateFrom].enable();
    } else {
      this.checkInActivityFormValidations[this.helperService.appConstants.dateFrom].disable();
      this.checkInActivityFormValidations[this.helperService.appConstants.dateTo].disable();
    }
  }

  makeReport(days, dateTo, dateFrom, userId, archive) {
    this.checkInActivityObj.loading = true
    let data = {
      'entityId': this.checkInActivityObj.entityId,
      'dateTo': dateTo,
      'dateFrom': dateFrom,
      'days': days,
      'user': userId,
      'archive': archive
    };
    this.analyticsService.checkInByActivityReport(data).subscribe((res) => {
      if (res && res.responseDetails.code === 100) {
        this.checkInActivityObj.checkInByActivityReportData = res.data.checkInByActivity;
        let chartType: HighChartType = {
          type: 'column',
          title: 'Check In By Activity Report',
          subtitle: ''
        };
        let data = this.highChartSettings.reportSettings(chartType,
          [], this.generateCharSeries(this.checkInActivityObj.checkInByActivityReportData));
        this.checkInActivityObj.containerDiv = document.getElementById('container')
        if (this.checkInActivityObj.containerDiv) {
          Highcharts.chart('container', data);
        }
        this.checkInActivityObj.loading = false;
      } else {
        this.checkInActivityObj.loading = false;
      }
    });
  }

  generateCharSeries(reportData: any) {
    let dates = [];
    let charSeries = [];
    let data = [];
    let self = this;
    let pieChart = [];
    self.helperService.iterations(reportData, function (checkIns: ActivityData) {
      dates = []
      data = []
      self.helperService.iterations(checkIns.result, function (checkInByActivityReport: Report) {
        dates.push(checkInByActivityReport.date)
        data.push(checkInByActivityReport.count)
      });
      charSeries.push({
        type: 'column',
        name: checkIns.type,
        data: data
      });
      let index = self.helperService.findIndex(checkIns)
      pieChart.push({
        name: checkIns.type,
        y: checkIns.totalCount,
        color: Highcharts.getOptions().colors[index]
      })
    });
    charSeries.push({
      type: 'pie',
      name: 'Total CheckIns',
      data: pieChart,
      center: [50, -10],
      size: 100,
      showInLegend: false,
      dataLabels: {
        enabled: false
      }
    });
    let result = {
      charSeries: charSeries,
      categories: dates,
      title: 'No of Check In By Activity'
    }
    return result;
  }

  checkInActivityFormSubmit({value, valid}: { value: ActionReportApiData; valid: boolean; }) {
    if (!valid) {
      return;
    }
    this.checkInActivityObj.days = this.helperService.find(this.checkInActivityObj.filters, function (obj) {
      return obj.id === value.filter;
    });
    this.makeReport(this.checkInActivityObj.days.days, value.dateTo, value.dateFrom, value.user, value.archive)
  }

  enableDateFrom() {
    this.checkInActivityFormValidations[this.helperService.appConstants.dateTo].enable();
    this.checkInActivityObj.minDate = this.checkInActivityFormValidations[this.helperService.appConstants.dateFrom].value;
  }

  ngOnDestroy() {
    if (this.checkInActivityObj.subscription !== null && this.checkInActivityObj.subscription !== undefined) {
      this.checkInActivityObj.subscription.unsubscribe();
    }
  }

}
