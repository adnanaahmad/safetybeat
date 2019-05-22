import {Injectable} from '@angular/core';
import * as Highcharts from 'highcharts';
import {ActionReportData, HighChartType} from '../../models/analyticsReport/actionReports.model';
import {HelperService} from '../helperService/helper.service';

@Injectable({
  providedIn: 'root'
})
export class HighchartService {

  constructor(public helperService: HelperService) {
  }

  generateCharSeries(reportData: ActionReportData[]) {
    let charSeries = [];
    let self = this;
    this.helperService.iterations(reportData, function (actionReport: ActionReportData) {
        let checkIn = {
          name: actionReport.site,
          data: [actionReport.CheckIns.numberOfCheckIn, actionReport.CheckOuts.numberOfCheckOut]
        };
        charSeries.push(checkIn);
    });
    return charSeries;
  }

  reportSettings(chartType: HighChartType, data: any, reportData?: ActionReportData[]) {
    this.pieChartWithNoData();
    let charSeries = (data.length === 0) ? this.generateCharSeries(reportData) : data;
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
        categories: ['Check In', 'CheckOut'],
        gridLineWidth: 1,
        gridZIndex: 4,
        labels: {
          autoRotation: [-90]
        }
      },

      yAxis: {
        min: 0,
        title: {
          text: 'No of Check In and Check out',
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
      series: charSeries
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
