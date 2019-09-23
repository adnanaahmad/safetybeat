import {Component, OnDestroy, OnInit} from '@angular/core';
import {Translation} from 'src/app/models/translate.model';
import {Router} from '@angular/router';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {HighchartService} from 'src/app/services/common/highchart/highchart.service';
import {ActivityData} from 'src/app/models/analyticsReport/reports.model';
import {
  ActionReportData,
  HazardReportByStatusData,
  HazardReportData,
  HighChartType,
  Report
} from 'src/app/models/analyticsReport/reports.model';
import * as Highcharts from 'highcharts';
import {AnalyticsReportService} from 'src/app/features/adminControl/modules/analyticsReport/services/analyticsReport.service';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy, OnInit {
  translated: Translation;
  dashboardObj: Report = <Report>{};

  constructor(
    public helperService: HelperService,
    private highChartSettings: HighchartService,
    public analyticsService: AnalyticsReportService,
    private navigationService: NavigationService,
    private router: Router
  ) {
    this.dashboardObj.loading = false;
  }

  ngOnInit() {
    this.dashboardObj.subscription = this.navigationService.selectedEntityData.subscribe((res) => {
      if (res && res !== 1) {
        this.dashboardObj.entityId = res.entityInfo.id;
        this.makeReport(7, null, null);
        this.makeHazardReport(7, null, null, null, false);
        this.makePulseReport(7, null, null, null, false);
      }
    })
  }

  ngOnDestroy(): void {
    if (this.dashboardObj.subscription !== null && this.dashboardObj.subscription !== undefined) {
      this.dashboardObj.subscription.unsubscribe();
    }
  }

  makeReport(days, dateTo, dateFrom) {
    this.dashboardObj.loading = true;
    let data = {
      'entityId': this.dashboardObj.entityId,
      'dateTo': dateTo,
      'dateFrom': dateFrom,
      'days': days,
    };
    this.analyticsService.actionReport(data).subscribe((res) => {
      if (res && res.responseDetails.code === 100) {
        this.dashboardObj.actionReportData = res.data.checkInList;
        let chartType: HighChartType = {
          type: 'column',
          title: 'Action Report',
          subtitle: ''
        };
        let data = this.highChartSettings.reportSettings(chartType, [], this.generateCharSeries(this.dashboardObj.actionReportData));
        this.dashboardObj.containerDiv = document.getElementById('actionReport')
        if (this.dashboardObj.containerDiv) {
          Highcharts.chart(this.dashboardObj.containerDiv, data);
        }
      } else {
        this.dashboardObj.loading = false;
      }
    }, (error) => {
      this.dashboardObj.loading = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

  makeHazardReport(days, dateTo, dateFrom, user, archive) {
    let data = {
      'entityId': this.dashboardObj.entityId,
      'dateTo': dateTo,
      'dateFrom': dateFrom,
      'days': days,
      'user': user,
      'archive': archive
    };
    this.analyticsService.getHazardReport(data).subscribe((res) => {
      if (res && res.responseDetails.code === 100) {
        this.dashboardObj.hazardReportData = res.data.hazardReportBySeverity;
        this.dashboardObj.resolvedHazards = res.data.resolvedHazard;
        this.dashboardObj.unResolvedHazards = res.data.unResolvedHazard;
        this.dashboardObj.hazardReportByStatusData = res.data.hazardReportByStatus;
        this.reportBySeverity(this.dashboardObj.hazardReportData);
        this.reportByStatus(this.dashboardObj.hazardReportByStatusData);
      } else {
        this.dashboardObj.loading = false;
      }
    }, (error) => {
      this.dashboardObj.loading = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

  reportBySeverity(hazardSeverityData) {
    let chartType: HighChartType = {
      type: 'column',
      title: 'Hazard Report with Severity',
      subtitle: ''
    };
    let reportBySeverityData = this.highChartSettings.reportSettings(chartType,
      [], this.generateCharHazardSeries(hazardSeverityData));
    this.dashboardObj.severityDiv = document.getElementById('severityReport')
    if (this.dashboardObj.severityDiv) {
      Highcharts.chart(this.dashboardObj.severityDiv, reportBySeverityData);
    }
  }

  reportByStatus(hazardStatusData) {
    let chartTypeForStatus: HighChartType = {
      type: 'column',
      title: 'Hazard Report with Status',
      subtitle: ''
    };
    let reportByStatusData = this.highChartSettings.reportSettings(chartTypeForStatus,
      [], this.generateHazardStatusData(hazardStatusData));
    this.dashboardObj.statusDiv = document.getElementById('statusReport')
    if (this.dashboardObj.statusDiv) {
      Highcharts.chart(this.dashboardObj.statusDiv, reportByStatusData);
    }
  }

  makePulseReport(days, dateTo, dateFrom, userId, archive) {
    let data = {
      'entityId': this.dashboardObj.entityId,
      'dateTo': dateTo,
      'dateFrom': dateFrom,
      'days': days,
      'user': userId,
      'archive': archive
    };
    this.analyticsService.pulseByEntity(data).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.dashboardObj.pulseByEntityReportData = res.data.pulseByEntity;
        let chartType: HighChartType = {
          type: 'column',
          title: 'Pulse Report',
          subtitle: ''
        };
        let data = this.highChartSettings.reportSettings(chartType,
          [], this.generatePulseCharSeries(this.dashboardObj.pulseByEntityReportData));
        this.dashboardObj.pulseDiv = document.getElementById('pulseReport')
        if (this.dashboardObj.pulseDiv) {
          Highcharts.chart(this.dashboardObj.pulseDiv, data);
        }
        this.dashboardObj.loading = false;
      } else {
        this.dashboardObj.loading = false;
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

  generatePulseCharSeries(reportData: any) {
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

  generateCharHazardSeries(reportData: any) {
    let charSeries = [];
    let dates = [];
    let minor = [];
    let moderate = [];
    let major = [];
    let extreme = [];
    this.helperService.iterations(reportData, function (hazardReport: HazardReportData) {
      dates.push(hazardReport.date);
      minor.push(hazardReport.minor);
      moderate.push(hazardReport.moderate);
      major.push(hazardReport.major);
      extreme.push(hazardReport.extreme);
    });
    charSeries.push({
      name: 'Minor',
      data: minor
    });
    charSeries.push({
      name: 'Moderate',
      data: moderate
    });
    charSeries.push({
      name: 'Major',
      data: major
    });
    charSeries.push({
      name: 'Extreme',
      data: extreme
    });
    let data = {
      charSeries: charSeries,
      categories: dates,
      title: 'No of Hazard with Severity'
    };
    return data;
  }

  generateHazardStatusData(reportData: HazardReportByStatusData) {
    let charSeries = [{
      name: 'Minor',
      data: [reportData.minorResolved, reportData.minorUnResolved]
    },
      {
        name: 'Moderate',
        data: [reportData.moderateResolved, reportData.moderateUnResolved]
      }, {
        name: 'Major',
        data: [reportData.majorResolved, reportData.majorUnResolved]
      }, {
        name: 'Extreme',
        data: [reportData.extremeResolved, reportData.extremeUnResolved]
      }];
    let data = {
      charSeries: charSeries,
      categories: ['Resolved', 'UnResolved'],
      title: 'No of Hazard with Status'
    };
    return data;
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

}
