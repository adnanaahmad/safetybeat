import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionReportApiData, HighChartType, Report} from 'src/app/models/analyticsReport/reports.model';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {AnalyticsReportService} from 'src/app/features/adminControl/modules/analyticsReport/services/analyticsReport.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {HighchartService} from 'src/app/services/common/highchart/highchart.service';
import * as Highcharts from 'highcharts';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {PaginationData, ViewAllSiteEntityData} from 'src/app/models/site.model';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-siteActivityReport',
  templateUrl: './siteActivityReport.component.html',
  styleUrls: ['./siteActivityReport.component.scss']
})
export class SiteActivityReportComponent implements OnInit, OnDestroy {

  actionReportObj: Report = <Report>{};

  constructor(
    public helperService: HelperService,
    public formBuilder: FormBuilder,
    private navService: NavigationService,
    public analyticsService: AnalyticsReportService,
    public compiler: CompilerProvider,
    private highChartSettings: HighchartService,
    public adminServices: AdminControlService,
  ) {

  }

  ngOnInit() {
    this.actionReportObj.actionReportForm = this.formBuilder.group({
      entityName: ['', Validators.required],
      dateTo: ['', Validators.required],
      dateFrom: ['', Validators.required],
      site: ['', Validators.required],
      filter: ['']
    });

  }

  get actionFormValidations() {
    return this.actionReportObj.actionReportForm.controls;
  }

  makeReport(data) {
    // this.analyticsService.siteActivityReport(data).subscribe((res) => {
    //   this.actionReportObj.userActionReportData = this.compiler.constructUserActionReportData(res);
    //   if (this.actionReportObj.userActionReportData.CheckIns.length === 0 &&
    //     this.actionReportObj.userActionReportData.CheckOuts.length === 0) {
    //     this.actionReportObj.showChart = false;
    //   } else {
    //     this.actionReportObj.showChart = true;
    //     let chartType: HighChartType = {
    //       type: 'column',
    //       title: this.actionReportObj.userActionReportData.site,
    //       subtitle: ''
    //     };
    //     let checkInChart = 1;
    //     let data1 = this.highChartSettings.reportSettings(chartType, [], this.actionReportObj.userActionReportData, checkInChart);
    //     Highcharts.chart('checkInContainer', data1);
    //     let checkOutChart = 2;
    //     let data2 = this.highChartSettings.reportSettings(chartType, [], this.actionReportObj.userActionReportData, checkOutChart);
    //     Highcharts.chart('checkOutContainer', data2);
    //   }
    // });
  }

  actionReportFormSubmit({value, valid}: { value: ActionReportApiData; valid: boolean; }) {
    if (!valid) {
      return;
    }
    let data;
    if (value.filter !== 'range') {
      data = {
        'entityId': this.helperService.getEntityId(),
        'dateTo': null,
        'dateFrom': null,
        'filter': value.filter,
        'siteId': value.site
      };
    } else {
      data = {
        'entityId': this.helperService.getEntityId(),
        'dateTo': value.dateTo,
        'dateFrom': value.dateFrom,
        'siteId': value.site,
        'filter': null
      };
    }
    this.makeReport(data);

  }


  filteredReport(value: any) {
    if (value !== 'range') {
      this.actionFormValidations[this.helperService.appConstants.dateFrom].disable();
      this.actionFormValidations[this.helperService.appConstants.dateTo].disable();
    } else {
      this.actionFormValidations[this.helperService.appConstants.dateFrom].enable();
      this.actionFormValidations[this.helperService.appConstants.dateTo].enable();
    }
  }

  ngOnDestroy() {
    this.actionReportObj.subscription.unsubscribe();
  }

}
