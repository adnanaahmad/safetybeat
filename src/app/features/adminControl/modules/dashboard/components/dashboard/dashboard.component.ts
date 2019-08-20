import {Component, OnInit} from '@angular/core';
import {Translation} from 'src/app/models/translate.model';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {HighchartService} from 'src/app/services/common/highchart/highchart.service';
import {
  ActionReportData,
  HazardReportByStatusData,
  HazardReportData,
  HighChartType,
  Report, SiteReportData
} from 'src/app/models/analyticsReport/reports.model';
import * as Highcharts from 'highcharts';
import {AnalyticsReportService} from 'src/app/features/adminControl/modules/analyticsReport/services/analyticsReport.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  translated: Translation;
  dashboardObj: Report = <Report>{};

  constructor(
    public helperService: HelperService,
    private highChartSettings: HighchartService,
    public analyticsService: AnalyticsReportService
  ) {

  }

  ngOnInit() {
    this.dashboardObj.loading = false;
    this.dashboardObj.entityId = this.helperService.getEntityId();
    this.makeReport(7, null, null)
    this.makeHazardReport(7, null, null, null)
    this.makeSiteReport(7, null, null, null)
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
        Highcharts.chart('container', data);
      } else {
        this.dashboardObj.loading = false;
      }
    }, (error) => {
      this.dashboardObj.loading = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

  makeHazardReport(days, dateTo, dateFrom, user) {
    let data = {
      'entityId': this.dashboardObj.entityId,
      'dateTo': dateTo,
      'dateFrom': dateFrom,
      'days': days,
      'user': user
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
    Highcharts.chart('severityReport', reportBySeverityData);
  }

  reportByStatus(hazardStatusData) {
    let chartTypeForStatus: HighChartType = {
      type: 'column',
      title: 'Hazard Report with Status',
      subtitle: ''
    };
    let reportByStatusData = this.highChartSettings.reportSettings(chartTypeForStatus,
      [], this.generateHazardStatusData(hazardStatusData));
    Highcharts.chart('statusReport', reportByStatusData);
  }

  makeSiteReport(days, dateTo, dateFrom, site) {
    let data = {
      'entityId': this.dashboardObj.entityId,
      'dateTo': dateTo,
      'dateFrom': dateFrom,
      'days': days,
      'site': site
    };
    this.analyticsService.siteActivityReport(data).subscribe((res) => {
      if (res && res.responseDetails.code === 100) {
        this.dashboardObj.loading = false;
        this.dashboardObj.siteReportData = res.data.siteActivityReport;
        let chartType: HighChartType = {
          type: 'column',
          title: 'All Sites Activity',
          subtitle: ''
        };
        let siteActivityReportData = this.highChartSettings.reportSettings(chartType,
          [], this.generateCharSiteSeries(this.dashboardObj.siteReportData));
        Highcharts.chart('siteReport', siteActivityReportData);
      } else {
        this.dashboardObj.loading = false;
      }
    }, (error) => {
      this.dashboardObj.loading = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

  generateCharSiteSeries(reportData: any) {
    let charSeries = [];
    this.helperService.iterations(reportData, function (siteReport: SiteReportData) {
      let pulse = {
        name: siteReport.siteName,
        data: [siteReport.siteCheckIns, siteReport.siteCheckOuts]
      };
      charSeries.push(pulse);
    });
    let data = {
      charSeries: charSeries,
      categories: ['CheckIns', 'CheckOuts'],
      title: 'No of CheckIns and CheckOuts'
    };
    return data;
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
