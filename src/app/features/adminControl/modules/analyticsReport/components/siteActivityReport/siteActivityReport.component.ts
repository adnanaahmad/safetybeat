import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  ActionReportApiData,
  HighChartType,
  Report,
  SiteDetailsReport,
  SiteReportData
} from 'src/app/models/analyticsReport/reports.model';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {AnalyticsReportService} from 'src/app/features/adminControl/modules/analyticsReport/services/analyticsReport.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {HighchartService} from 'src/app/services/common/highchart/highchart.service';
import * as Highcharts from 'highcharts';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {PaginationData, ViewAllSiteArchivedData, ViewAllSiteEntityData, ViewAllSitesApiResponse} from 'src/app/models/site.model';
import {SubSink} from 'subsink';

@Component({
  selector: 'app-siteActivityReport',
  templateUrl: './siteActivityReport.component.html',
  styleUrls: ['./siteActivityReport.component.scss']
})
export class SiteActivityReportComponent implements OnInit, OnDestroy {

  siteReportObj: Report = <Report>{};
  private subs = new SubSink();

  constructor(
    public helperService: HelperService,
    public formBuilder: FormBuilder,
    private navService: NavigationService,
    public analyticsService: AnalyticsReportService,
    public compiler: CompilerProvider,
    private highChartSettings: HighchartService,
    public adminServices: AdminControlService,
  ) {
    this.initialize();
    this.getFilters();
    this.subs.add(
      this.navService.selectedEntityData.subscribe((res) => {
        if (res && res !== 1) {
          this.siteReportObj.entityId = res.entityInfo.id;
          this.siteReportObj.entityName = res.entityInfo.name;
          this.siteFormValidations['entityName'].setValue(this.siteReportObj.entityName);
          this.siteFormValidations['entityName'].disable();
          this.getSites(false);
          this.makeReport(7, null, null, null, false);
        }
      }));
  }

  ngOnInit() {

  }

  initialize() {
    this.siteReportObj.siteReportForm = this.formBuilder.group({
      entityName: ['', Validators.required],
      dateTo: [],
      dateFrom: [],
      site: [''],
      filter: [''],
      archive: [false]
    });
    this.siteFormValidations[this.helperService.appConstants.dateFrom].disable();
    this.siteFormValidations[this.helperService.appConstants.dateTo].disable();
    this.siteReportObj.maxDate = new Date();
    this.siteReportObj.minDate = null;
  }


  get siteFormValidations() {
    return this.siteReportObj.siteReportForm.controls;
  }

  onArchivedChange(value) {
    this.getSites(value)
  }

  getSites(archive) {
    let entityData: ViewAllSiteArchivedData = {
      entityId: this.siteReportObj.entityId,
      archived: archive
    };
    this.subs.add(
      this.adminServices.viewArchivedSites(entityData).subscribe((res) => {
        if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.siteReportObj.sites = res.data.sitesList;
        }
      }));

  }

  makeReport(days, dateTo, dateFrom, site, archive) {
    this.siteReportObj.loading = true;
    let data = {
      'entityId': this.siteReportObj.entityId,
      'dateTo': dateTo,
      'dateFrom': dateFrom,
      'days': days,
      'site': site,
      'archive': archive
    };
    this.subs.add(
      this.analyticsService.siteActivityReport(data).subscribe((res) => {
        if (res && res.responseDetails.code === 100) {
          if (res.data.details) {
            this.siteReportObj.siteReportDetails = res.data.siteActivityReport;
            let chartType: HighChartType = {
              type: 'column',
              title: 'Site Detail Activity',
              subtitle: '',
              inverted: false
            };
            let siteActivityReportData = this.highChartSettings.reportSettings(chartType,
              [], this.generateSiteDetailReport(this.siteReportObj.siteReportDetails));
            Highcharts.chart('container', siteActivityReportData);
          } else {
            this.siteReportObj.siteReportData = res.data.siteActivityReport;
            let chartType: HighChartType = {
              type: 'column',
              title: 'All Sites Activity',
              subtitle: '',
              inverted: false
            };
            let siteActivityReportData = this.highChartSettings.reportSettings(chartType,
              [], this.generateCharSeries(this.siteReportObj.siteReportData));
            this.siteReportObj.containerDiv = document.getElementById('container')
            if (this.siteReportObj.containerDiv) {
              Highcharts.chart('container', siteActivityReportData);
            }
          }
          this.siteReportObj.loading = false;
        } else {
          this.siteReportObj.loading = false;
        }
      }));
  }

  siteReportFormSubmit({value, valid}: { value: ActionReportApiData; valid: boolean; }) {
    if (!valid) {
      return;
    }
    this.siteReportObj.days = this.helperService.find(this.siteReportObj.filters, function (obj) {
      return obj.id === value.filter;
    });
    this.makeReport(this.siteReportObj.days.days, value.dateTo, value.dateFrom, value.site, value.archive)
  }

  generateCharSeries(reportData: any) {
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

  generateSiteDetailReport(reportData: any) {
    let charSeries = [];
    let dates = [];
    let checkIns = [];
    let checkOuts = [];
    this.helperService.iterations(reportData, function (siteReport: SiteDetailsReport) {
      dates.push(siteReport.date);
      checkIns.push(siteReport.siteCheckIns);
      checkOuts.push(siteReport.siteCheckOuts);
    });
    charSeries.push({
      name: 'CheckIns',
      data: checkIns
    });
    charSeries.push({
      name: 'CheckOuts',
      data: checkOuts
    });
    let data = {
      charSeries: charSeries,
      categories: dates,
      title: 'No of CheckIns and CheckOuts'
    };
    return data;
  }

  enableDates(value: any) {
    this.siteReportObj.dateEnableObj = this.helperService.find(this.siteReportObj.filters, function (obj) {
      return obj.name === 'Choose a Range';
    });
    if (value === this.siteReportObj.dateEnableObj.id) {
      this.siteFormValidations[this.helperService.appConstants.dateFrom].enable();
    } else {
      this.siteFormValidations[this.helperService.appConstants.dateFrom].disable();
      this.siteFormValidations[this.helperService.appConstants.dateTo].disable();
    }
  }

  getFilters() {
    this.subs.add(
      this.analyticsService.filter().subscribe((res) => {
        if (res) {
          this.siteReportObj.filters = res;
          this.siteReportObj.lastWeekObj = this.helperService.find(this.siteReportObj.filters, function (obj) {
            return obj.name === 'Last Week';
          });
          this.siteFormValidations['filter'].setValue(this.siteReportObj.lastWeekObj.id);
        }
      }, (error) => {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
      }));
  }

  enableDateFrom() {
    this.siteFormValidations[this.helperService.appConstants.dateTo].enable();
    this.siteReportObj.minDate = this.siteFormValidations[this.helperService.appConstants.dateFrom].value;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    // if (this.siteReportObj.subscription !== null && this.siteReportObj.subscription !== undefined) {
    //   this.siteReportObj.subscription.unsubscribe();
    // }
  }

}
