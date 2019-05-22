import {Injectable} from '@angular/core';
import * as Highcharts from 'highcharts';

@Injectable({
  providedIn: 'root'
})
export class HighchartService {

  constructor() {
  }

  reportSettings(chartType: any, charSeries: any) {
    this.pieChartWithNoData();
    let highChartReport = {
      chart: {
        type: chartType.type,
        zoomType: 'x',
        animation: true,
      },
      title: {
        text: chartType.title
      },
      subtitle: {
        text: chartType.subtitle
      },
      xAxis: {
        gridLineWidth: 1,
        gridZIndex: 4,
        labels: {
          autoRotation: [-90]
        }
      },

      yAxis: {
        min: 0,
        title: {
          text: 'y-axis',
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
          stacking: 'normal',
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
