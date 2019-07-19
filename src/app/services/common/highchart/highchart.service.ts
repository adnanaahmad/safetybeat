import {Injectable} from '@angular/core';
import * as Highcharts from 'highcharts';
import {
  ActionReportData,
  HighChartType,
  UserActionReportData,
  userCheckIn,
  userCheckOut
} from 'src/app/models/analyticsReport/actionReports.model';
import {HelperService} from '../helperService/helper.service';

@Injectable({
  providedIn: 'root'
})
export class HighchartService {

  constructor(public helperService: HelperService) {
  }

  generateCharSeries(reportData: any, userChart: number) {
    if (userChart === 0) {
      let charSeries = [];
      this.helperService.iterations(reportData, function (actionReport: ActionReportData) {
        let checkIn = {
          name: actionReport.site,
          data: [actionReport.CheckIns.numberOfCheckIn, actionReport.CheckOuts.numberOfCheckOut]
        };
        charSeries.push(checkIn);
      });
      let data = {
        charSeries: charSeries,
        categories: ['Check In', 'CheckOut'],
        title: 'No of Check In and Check out'
      }
      return data;
    } else if (userChart === 1) {
      return this.generateCheckInSeries(reportData)
    } else if (userChart === 2) {
      return this.generateCheckOutSeries(reportData)
    }
  }

  generateCheckInSeries(reportData: any) {
    let charSeries = [];
    this.helperService.iterations(reportData.CheckIns, function (actionReport: userCheckIn) {
      let checkIn = {
        name: actionReport.user,
        data: [actionReport.numberOfCheckIn]
      };
      charSeries.push(checkIn);
    });
    let data = {
      charSeries: charSeries,
      categories: ['Check In'],
      title: 'No of CheckIn'
    }
    return data;
  }

  generateCheckOutSeries(reportData: any) {
    let charSeries = [];
    this.helperService.iterations(reportData.CheckOuts, function (actionReport: userCheckOut) {
      let checkIn = {
        name: actionReport.user,
        data: [actionReport.numberOfCheckOut]
      };
      charSeries.push(checkIn);
    });
    let data = {
      charSeries: charSeries,
      categories: ['CheckOut'],
      title: 'No of CheckOut'
    }
    return data;
  }

  reportSettings(chartType: HighChartType, data: any, reportData?: any, userChart?: any) {
    this.pieChartWithNoData();
    let charSeries = (data.length === 0) ? this.generateCharSeries(reportData, userChart) : data;
    let highChartReport = {
      chart: {
        type: chartType.type,
        animation: true,
      },
      title: {
        text: chartType.title
      },
      subtitle: {
        text: chartType.subtitle
      },
      xAxis: {
        categories: charSeries.categories,
        gridLineWidth: 1,
        gridZIndex: 4,
        labels: {
          autoRotation: [-90]
        }
      },

      yAxis: {
        min: 0,
        title: {
          text: charSeries.title,
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          },
          showInLegend: true,
          animation: {
            duration: 2000
          },
          tooltip: {
            pointFormat: '{series.name}: {point.percentage:.0f}%',
          },
        },
        column: {
          // stacking: 'normal',
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      exporting: {
        showTable: true
      },
      credits: {
        enabled: false
      },
      series: charSeries.charSeries
    };
    return highChartReport;
  }

  pieChartWithNoData() {
    Highcharts.wrap(Highcharts.seriesType.prototype, 'render', function (proceed) {
      proceed.call(this);
      if (!this.circle) {
        this.circle = this.chart.renderer.circle(0, 0, 0).add(this.group);
      }
      if (this.total === 0) {
        this.circle.attr({
          cx: this.center[0],
          cy: this.center[1],
          r: this.center[2] / 2,
          fill: 'none',
          stroke: 'silver',
          'stroke-width': 1,
        });

      } else {
        this.circle.attr({
          'stroke-width': 0
        });
      }
    });
  }
}
