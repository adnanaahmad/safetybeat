import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {Translation} from 'src/app/models/translate.model';
import * as Highcharts from 'highcharts';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {HighchartService} from '../../../../shared/highchart/highchart.service';

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
  mockData: any [] = [];
  translated: Translation;

  constructor(
    public helperService: HelperService,
    private highChartSettings: HighchartService
  ) {
    this.translated = this.helperService.translated;
    this.helperService.appLoggerDev(
      this.helperService.constants.status.SUCCESS,
      this.translated.LOGGER.MESSAGES.DASHBOARD_COMPONENT
    );
    let charSeries = [{
      name: 'Brands',
      colorByPoint: true,
      data: [{
        name: 'Anthony',
        y: 61.41,
        sliced: true,
        selected: true
      }, {
        name: 'Michael',
        y: 11.84
      }, {
        name: 'John',
        y: 10.85
      }, {
        name: 'Ibrahim',
        y: 4.67
      }, {
        name: 'David',
        y: 4.18
      }, {
        name: 'Sogou Jain',
        y: 1.64
      }, {
        name: 'Colling',
        y: 1.6
      }, {
        name: 'Jame',
        y: 1.2
      }]
    }];
    this.option1 = {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45,
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      title: {
        text: 'Bluesky softwares and hardwares'
      },
      subtitle: {
        text: 'Work Report 2017'
      },
      plotOptions: {
        pie: {
          innerSize: 100,
          depth: 45,
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          }
        }
      },
      series: [{
        name: 'Delivered amount',
        data: [
          ['software installation', 8],
          ['hardware installation', 3],
          ['software issues resolving', 1],
          ['hardware services', 6],
          ['proton settings', 8],
          ['safetybeat installation', 4],
          ['optergy app installation', 4],
        ]
      }]
    };

    this.option2 = {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45,
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      title: {
        text: 'Contents of Highsoft\'s weekly Services delivery'
      },
      subtitle: {
        text: 'Work Report 2017'
      },
      plotOptions: {
        pie: {
          innerSize: 100,
          depth: 45,
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          }
        }
      },
      series: [{
        name: 'Delivered amount',
        data: [
          ['software installation', 8],
          ['hardware installation', 3],
          ['software issues resolving', 1],
          ['hardware services', 6],
          ['proton settings', 8],
          ['safetybeat installation', 4],
          ['optergy app installation', 4],
        ]
      }]
    };

    this.option3 = {
      title: {
        text: 'Combination chart'
      },
      xAxis: {
        categories: ['Installation', 'Reparing', 'Hardware Fixing', 'Software Fixing']
      },
      labels: {
        items: [{
          html: 'Total Working hours consumption',
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
        type: 'pie',
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
          enabled: true
        }
      }]
    };
    this.option4 = {
      chart: {
        type: 'area'
      },
      title: {
        text: 'Area chart with employess availability values'
      },
      xAxis: {
        categories: ['For Software Installation', 'For Hardware Installation',
          'For Fixing Softwares', 'For Fixing Hardware', 'For Meeting with clients']
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

  ngOnInit() {
    this.mockData = [{containerId: 'option1', data: this.option1},
      {containerId: 'option2', data: this.option2},
      {containerId: 'option3', data: this.option3},
      {containerId: 'option4', data: this.option4}
    ];
  }

  ngAfterViewInit() {
    this.helperService.iterations(this.mockData, function (chart) {
      Highcharts.chart(chart.containerId, chart.data);
    });
  }

  ngOnDestroy() {
    this.helperService.hideLoggers();
  }

}
