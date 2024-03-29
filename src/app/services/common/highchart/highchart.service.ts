import {Injectable, OnDestroy} from '@angular/core';
import * as Highcharts from 'highcharts';
import {HighChartType} from 'src/app/models/analyticsReport/reports.model';
import {HelperService} from '../helperService/helper.service';
import exporting from 'highcharts/modules/exporting';
import {SettingService} from '../settings/setting.service';
import {Subscription} from 'rxjs';
import more from 'highcharts/highcharts-more'


exporting(Highcharts);
more(Highcharts);


@Injectable({
  providedIn: 'root'
})
export class HighchartService implements OnDestroy {
  theme: any = null;
  subscription: Subscription;

  constructor(public helperService: HelperService,
              public settings: SettingService) {

  }

  reportSettings(chartType: HighChartType, data: any, reportData?: any) {

    this.subscription = this.settings.getActiveTheme().subscribe((val) => {
      this.theme = this.setLightThemes();
      Highcharts.setOptions(this.theme);
      if (val && val === 'dark-theme') {
        this.theme = this.setDarkTheme();
        Highcharts.setOptions(this.theme);
      }
    });

    this.pieChartWithNoData();
    let charSeries = (data.length === 0) ? reportData : data;
    let highChartReport = {
      chart: {

        type: chartType.type,
        inverted: chartType.inverted,
        animation: true,

      },
      title: {
        text: chartType.title,

        style: {
          color: '#000',
          font: '500 16px "Roboto", sans-serif'
        },
        position: {
          align: 'left',
        }
      },
      subtitle: {
        text: chartType.subtitle,
        style: {
          floating: true,
          align: 'left',
          font: '500 14px "Roboto", sans-serif'
        }
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
          pointPadding: 0.2,
          borderWidth: 0
        },
        columnrange: {
          dataLabels: {
            enabled: true,
            // format: '{y}°C'
          }
        }
      },
      series: charSeries.charSeries,
      exporting: {
        buttons: {
          contextButton: {
            menuItems: ['downloadJPEG', 'downloadPDF', 'downloadPNG', 'downloadSVG']
          }
        }
      },
      credits: {
        enabled: false
      },

    };
    return highChartReport;
  }

  setDarkTheme() {
    this.theme = {
      colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
        '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
      chart: {
        backgroundColor: {
          linearGradient: {x1: 0, y1: 0, x2: 1, y2: 1},
          stops: [
            [0, '#0d1317'],
            [1, '#171f24']
          ]
        },
        style: {
          fontFamily: '\'Unica One\', sans-serif'
        },
        plotBorderColor: '#263238'
      },
      title: {
        style: {
          color: '#fff',
          textTransform: 'uppercase',
          font: '500 16px "Roboto", sans-serif'
        }
      },
      subtitle: {
        style: {
          color: '#E0E0E3'
        }
      },
      xAxis: {
        gridLineColor: '#707073',
        labels: {
          style: {
            color: '#E0E0E3'
          }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        title: {
          style: {
            color: '#A0A0A3'

          }
        }
      },
      yAxis: {
        gridLineColor: '#707073',
        labels: {
          style: {
            color: '#E0E0E3'
          }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        tickWidth: 1,
        title: {
          style: {
            color: '#A0A0A3'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
          color: '#F0F0F0'
        }
      },
      plotOptions: {
        series: {
          dataLabels: {
            color: '#F0F0F3',
            style: {
              fontSize: '13px'
            }
          },
          marker: {
            lineColor: '#333'
          }
        },
        boxplot: {
          fillColor: '#505053'
        },
        candlestick: {
          lineColor: 'white'
        },
        errorbar: {
          color: 'white'
        }
      },
      legend: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        itemStyle: {
          color: '#E0E0E3'
        },
        itemHoverStyle: {
          color: '#FFF'
        },
        itemHiddenStyle: {
          color: '#606063'
        },
        title: {
          style: {
            color: '#C0C0C0'
          }
        }
      },
      credits: {
        style: {
          color: '#666'
        }
      },
      labels: {
        style: {
          color: '#707073'
        }
      },

      drilldown: {
        activeAxisLabelStyle: {
          color: '#F0F0F3'
        },
        activeDataLabelStyle: {
          color: '#F0F0F3'
        }
      },

      navigation: {
        buttonOptions: {
          symbolStroke: '#DDDDDD',
          theme: {
            fill: '#505053'
          }
        }
      },

      // scroll charts
      rangeSelector: {
        buttonTheme: {
          fill: '#505053',
          stroke: '#000000',
          style: {
            color: '#CCC'
          },
          states: {
            hover: {
              fill: '#707073',
              stroke: '#000000',
              style: {
                color: 'white'
              }
            },
            select: {
              fill: '#000003',
              stroke: '#000000',
              style: {
                color: 'white'
              }
            }
          }
        },
        inputBoxBorderColor: '#505053',
        inputStyle: {
          backgroundColor: '#333',
          color: 'silver'
        },
        labelStyle: {
          color: 'silver'
        }
      },

      navigator: {
        handles: {
          backgroundColor: '#666',
          borderColor: '#AAA'
        },
        outlineColor: '#CCC',
        maskFill: 'rgba(255,255,255,0.1)',
        series: {
          color: '#7798BF',
          lineColor: '#A6C7ED'
        },
        xAxis: {
          gridLineColor: '#505053'
        }
      },

      scrollbar: {
        barBackgroundColor: '#808083',
        barBorderColor: '#808083',
        buttonArrowColor: '#CCC',
        buttonBackgroundColor: '#606063',
        buttonBorderColor: '#606063',
        rifleColor: '#FFF',
        trackBackgroundColor: '#404043',
        trackBorderColor: '#404043'
      }
    };
    return this.theme;

  }

  setLightThemes() {
    this.theme = {
      colors: ['#7cb5ec', '#f7a35c', '#90ee7e', '#7798BF', '#aaeeee', '#ff0066',
        '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
      chart: {
        backgroundColor: {
          linearGradient: {x1: 0, y1: 0, x2: 1, y2: 1},
          stops: [
            [0, '#fff'],
            [1, '#fff']
          ]
        },
        style: {
          fontFamily: '"Roboto", sans-serif'
        },
        plotBorderColor: '#263238'
      },
      title: {
        style: {
          color: '#000',
          textTransform: 'uppercase',
          fontSize: '20px'
        }
      },
      subtitle: {
        style: {
          color: '#E0E0E3',
          textTransform: 'uppercase'
        }
      },
      xAxis: {
        gridLineColor: '#e6e6e6',
        labels: {
          style: {
            color: '#000'
          }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        title: {
          style: {
            color: '#000'

          }
        }
      },
      yAxis: {
        gridLineColor: '#e6e6e6',
        labels: {
          style: {
            color: '#000'
          }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        tickWidth: 1,
        title: {
          style: {
            color: '#000'
          }
        }
      },
      tooltip: {
        backgroundColor: '#fff',
        style: {
          color: '#000'
        }
      },
      plotOptions: {
        series: {
          dataLabels: {
            color: '#F0F0F3',
            style: {
              fontSize: '13px'
            }
          },
          marker: {
            lineColor: '#333'
          }
        },
        boxplot: {
          fillColor: '#505053'
        },
        candlestick: {
          lineColor: 'white'
        },
        errorbar: {
          color: 'white'
        }
      },
      legend: {
        backgroundColor: '#fff',
        itemStyle: {
          color: '#000'
        },
        itemHoverStyle: {
          color: '#FFF'
        },
        itemHiddenStyle: {
          color: '#ccc'
        },
        title: {
          style: {
            color: '#C0C0C0'
          }
        }
      },
      credits: {
        style: {
          color: '#666'
        }
      },
      labels: {
        style: {
          color: '#707073'
        }
      },

      drilldown: {
        activeAxisLabelStyle: {
          color: '#F0F0F3'
        },
        activeDataLabelStyle: {
          color: '#F0F0F3'
        }
      },

      navigation: {
        buttonOptions: {
          symbolStroke: '#000',
          theme: {
            fill: '#fff'
          }
        }
      },

      // scroll charts
      rangeSelector: {
        buttonTheme: {
          fill: '#505053',
          stroke: '#000000',
          style: {
            color: '#CCC'
          },
          states: {
            hover: {
              fill: '#707073',
              stroke: '#000000',
              style: {
                color: 'white'
              }
            },
            select: {
              fill: '#000003',
              stroke: '#000000',
              style: {
                color: 'white'
              }
            }
          }
        },
        inputBoxBorderColor: '#505053',
        inputStyle: {
          backgroundColor: '#333',
          color: 'silver'
        },
        labelStyle: {
          color: 'silver'
        }
      },

      navigator: {
        handles: {
          backgroundColor: '#666',
          borderColor: '#AAA'
        },
        outlineColor: '#CCC',
        maskFill: 'rgba(255,255,255,0.1)',
        series: {
          color: '#7798BF',
          lineColor: '#A6C7ED'
        },
        xAxis: {
          gridLineColor: '#505053'
        }
      },

      scrollbar: {
        barBackgroundColor: '#808083',
        barBorderColor: '#808083',
        buttonArrowColor: '#CCC',
        buttonBackgroundColor: '#606063',
        buttonBorderColor: '#606063',
        rifleColor: '#FFF',
        trackBackgroundColor: '#404043',
        trackBorderColor: '#404043'
      }
    };
    return this.theme;

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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
