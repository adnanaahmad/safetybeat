import {Component, OnDestroy, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {AnalyticsReportService} from 'src/app/features/adminControl/modules/analyticsReport/services/analyticsReport.service';
import {
  ActionReportApiData,
  ActivityData,
  HighChartType,
  Report
} from 'src/app/models/analyticsReport/reports.model';
import {HighchartService} from 'src/app/services/common/highchart/highchart.service';
import * as Highcharts from 'highcharts';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';

@Component({
  selector: 'app-entityPulseReport',
  templateUrl: './entityPulseReport.component.html',
  styleUrls: ['./entityPulseReport.component.scss']
})
export class EntityPulseReportComponent implements OnInit, OnDestroy {
  pulseEntityObj: Report = <Report>{};


  constructor(public helperService: HelperService,
              public formBuilder: FormBuilder,
              public compiler: CompilerProvider,
              private navService: NavigationService,
              public analyticsService: AnalyticsReportService,
              private memberService: MemberCenterService,
              private highChartSettings: HighchartService) {
    this.initialize();
    this.getFilters();
    this.getAllUsers();
  }

  ngOnInit() {
    this.pulseEntityObj.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res && res !== 1) {
        this.pulseEntityObj.entityId = res.entityInfo.id;
        this.pulseEntityObj.entityName = res.entityInfo.name;
        this.pulseEntityFormValidations['entityName'].setValue(this.pulseEntityObj.entityName);
        this.pulseEntityFormValidations['entityName'].disable();
        this.makeReport(7, null, null, null, false);
      }
    });
  }

  initialize() {
    this.pulseEntityObj.loading = false;
    this.pulseEntityObj.pulseEntityForm = this.formBuilder.group({
      filter: [''],
      entityName: ['', Validators.required],
      user: [''],
      dateTo: [],
      dateFrom: [],
      archive: [false],
    });
    this.pulseEntityFormValidations[this.helperService.appConstants.dateFrom].disable();
    this.pulseEntityFormValidations[this.helperService.appConstants.dateTo].disable();
    this.pulseEntityObj.maxDate = new Date();
    this.pulseEntityObj.minDate = null;
  }

  get pulseEntityFormValidations() {
    return this.pulseEntityObj.pulseEntityForm.controls;
  }

  getFilters() {
    this.analyticsService.filter().subscribe((res) => {
      if (res) {
        this.pulseEntityObj.filters = res;
        this.pulseEntityObj.lastWeekObj = this.helperService.find(this.pulseEntityObj.filters, function (obj) {
          return obj.name === 'Last Week';
        });
        this.pulseEntityFormValidations['filter'].setValue(this.pulseEntityObj.lastWeekObj.id);
      }
    });
  }

  enableDates(value: any) {
    this.pulseEntityObj.dateEnableObj = this.helperService.find(this.pulseEntityObj.filters, function (obj) {
      return obj.name === 'Choose a Range';
    });
    if (value === this.pulseEntityObj.dateEnableObj.id) {
      this.pulseEntityFormValidations[this.helperService.appConstants.dateFrom].enable();
    } else {
      this.pulseEntityFormValidations[this.helperService.appConstants.dateFrom].disable();
      this.pulseEntityFormValidations[this.helperService.appConstants.dateTo].disable();
    }
  }

  makeReport(days, dateTo, dateFrom, userId, archive) {
    this.pulseEntityObj.loading = true;
    let data = {
      'entityId': this.pulseEntityObj.entityId,
      'dateTo': dateTo,
      'dateFrom': dateFrom,
      'days': days,
      'user': userId,
      'archive': archive
    };
    this.analyticsService.pulseByEntity(data).subscribe((res) => {
      if (res && res.responseDetails.code === 100) {
        this.pulseEntityObj.pulseByEntityReportData = res.data.pulseByEntity;
        let chartType: HighChartType = {
          type: 'column',
          title: 'Pulse Report',
          subtitle: ''
        };
        let data = this.highChartSettings.reportSettings(chartType,
          [], this.generateCharSeries(this.pulseEntityObj.pulseByEntityReportData));
        this.pulseEntityObj.containerDiv = document.getElementById('container')
        if (this.pulseEntityObj.containerDiv) {
          Highcharts.chart('container', data);
        }
        this.pulseEntityObj.loading = false;
      } else {
        this.pulseEntityObj.loading = false;
      }
    });
  }

  getAllUsers() {
    let data = {
      entityId: this.helperService.getEntityId()
    };
    this.memberService.allEntityUsers(data).subscribe((res) => {
      if (res) {
        this.pulseEntityObj.entityUsers = this.compiler.constructDataForTeams(res.data);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

  generateCharSeries(reportData: any) {
    let dates = [];
    let data = [];
    let charSeries = [];
    let self = this;
    let pieChart = [];
    self.helperService.iterations(reportData, function (pulseReport: ActivityData) {
      dates = [];
      data = [];
      self.helperService.iterations(pulseReport.result, function (pulse: Report) {
        dates.push(pulse.date);
        data.push(pulse.count)
      });
      charSeries.push({
        name: pulseReport.type,
        data: data
      });
      let index = self.helperService.findIndex(pulseReport)
      pieChart.push({
        name: pulseReport.type,
        y: pulseReport.totalCount,
        color: Highcharts.getOptions().colors[index]
      });
    });
    charSeries.push({
      type: 'pie',
      name: 'Total Pulse',
      data: pieChart,
      center: [50, -10],
      size: 100,
      showInLegend: false,
      dataLabels: {
        enabled: false
      }
    })
    let pulseData = {
      charSeries: charSeries,
      categories: dates,
      title: 'No of Pulse with Type'
    }
    return pulseData;
  }

  formSubmit({value, valid}: { value: ActionReportApiData; valid: boolean; }) {
    if (!valid) {
      return;
    }
    this.pulseEntityObj.days = this.helperService.find(this.pulseEntityObj.filters, function (obj) {
      return obj.id === value.filter;
    });
    this.makeReport(this.pulseEntityObj.days.days, value.dateTo, value.dateFrom, value.user, value.archive)
  }

  enableDateFrom() {
    this.pulseEntityFormValidations[this.helperService.appConstants.dateTo].enable();
    this.pulseEntityObj.minDate = this.pulseEntityFormValidations[this.helperService.appConstants.dateFrom].value;
  }

  ngOnDestroy() {
    if (this.pulseEntityObj.subscription !== null && this.pulseEntityObj.subscription !== undefined) {
      this.pulseEntityObj.subscription.unsubscribe();
    }
  }
}
