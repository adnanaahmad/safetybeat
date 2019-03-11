import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Translation } from 'src/app/models/translate.model';
import { TranslateService } from '@ngx-translate/core';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { Chart } from 'angular-highcharts'
import * as Highcharts from 'highcharts';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { OrgRegistrationComponent } from 'src/app/pages/loginRegistration/components/orgRegistrationModal/orgRegistration.component';
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
  translated: Translation
  constructor(
    private route: Router,
    public translate: TranslateService,
    private logging: LoggingService,
    public dialog: MatDialog,
  ) {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER'])
      .subscribe(values => {
        this.translated = values;
        this.logging.appLogger(
          this.translated.LOGGER.STATUS.SUCCESS,
          this.translated.LOGGER.MESSAGES.DASHBOARD_COMPONENT
        );
      });
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.closeOnNavigation = false;
        this.dialog.open(OrgRegistrationComponent);
    this.option1 = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
      },
      title: {
        text: 'People working on the bluesky site for installation'
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
  ngOnInit() { }
  ngAfterViewInit() { }
  ngOnDestroy() {
    this.logging.hideAllAppLoggers();
  }

}
