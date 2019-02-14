import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Translation } from 'src/app/models/translate.model';
import { TranslateService } from '@ngx-translate/core';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { Chart } from 'angular-highcharts'
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  option1: object;
  option2: object;
  option3: object;
  option4: object;
  constructor() {
    this.option1 = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Browser market shares in January, 2018'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          }
        }
      },
      series: [{
        name: 'Brands',
        colorByPoint: true,
        data: [{
          name: 'Chrome',
          y: 61.41,
          sliced: true,
          selected: true
        }, {
          name: 'Internet Explorer',
          y: 11.84
        }, {
          name: 'Firefox',
          y: 10.85
        }, {
          name: 'Edge',
          y: 4.67
        }, {
          name: 'Safari',
          y: 4.18
        }, {
          name: 'Sogou Explorer',
          y: 1.64
        }, {
          name: 'Opera',
          y: 1.6
        }, {
          name: 'QQ',
          y: 1.2
        }, {
          name: 'Other',
          y: 2.61
        }]
      }]
    };

    this.option2 = {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45
        }
      },
      title: {
        text: 'Contents of Highsoft\'s weekly fruit delivery'
      },
      subtitle: {
        text: '3D donut in Highcharts'
      },
      plotOptions: {
        pie: {
          innerSize: 100,
          depth: 45
        }
      },
      series: [{
        name: 'Delivered amount',
        data: [
          ['Bananas', 8],
          ['Kiwi', 3],
          ['Mixed nuts', 1],
          ['Oranges', 6],
          ['Apples', 8],
          ['Pears', 4],
          ['Clementines', 4],
          ['Reddish (bag)', 1],
          ['Grapes (bunch)', 1]
        ]
      }]
    };

    this.option3 = {
      title: {
        text: 'Combination chart'
      },
      xAxis: {
        categories: ['Apples', 'Oranges', 'Pears', 'Bananas', 'Plums']
      },
      labels: {
        items: [{
          html: 'Total fruit consumption',
          style: {
            left: '50px',
            top: '18px'
          }
        }]
      },
      series: [{
        type: 'column',
        name: 'Jane',
        data: [3, 2, 1, 3, 4]
      }, {
        type: 'column',
        name: 'John',
        data: [2, 3, 5, 7, 6]
      }, {
        type: 'column',
        name: 'Joe',
        data: [4, 3, 3, 9, 0]
      }, {
        type: 'spline',
        name: 'Average',
        data: [3, 2.67, 3, 6.33, 3.33],
        marker: {
          lineWidth: 2,
          lineColor: Highcharts.getOptions().colors[3],
          fillColor: 'white'
        }
      }, {
        type: 'pie',
        name: 'Total consumption',
        data: [{
          name: 'Jane',
          y: 13,
          color: Highcharts.getOptions().colors[0] // Jane's color
        }, {
          name: 'John',
          y: 23,
          color: Highcharts.getOptions().colors[1] // John's color
        }, {
          name: 'Joe',
          y: 19,
          color: Highcharts.getOptions().colors[2] // Joe's color
        }],
        center: [100, 80],
        size: 100,
        showInLegend: false,
        dataLabels: {
          enabled: false
        }
      }]
    };
    this.option4 = {
      chart: {
        type: 'area'
      },
      title: {
        text: 'Area chart with negative values'
      },
      xAxis: {
        categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'John',
        data: [5, 3, 4, 7, 2]
      }, {
        name: 'Jane',
        data: [2, -2, -3, 2, 1]
      }, {
        name: 'Joe',
        data: [3, 4, 4, -2, 5]
      }]
    };
  }
  ngOnInit() { }
  ngAfterViewInit() { }
  ngOnDestroy() { }

}
