import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionReport, ActionReportApiData, HighChartType} from 'src/app/models/analyticsReport/actionReports.model';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {AnalyticsReportService} from 'src/app/features/adminControl/modules/analyticsReport/services/analyticsReport.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {HighchartService} from 'src/app/services/common/highchart/highchart.service';
import * as Highcharts from 'highcharts';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {PaginationData, ViewAllSiteEntityData} from '../../../../../../models/site.model';
import {MatTableDataSource} from '@angular/material';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-siteActivityReport',
  templateUrl: './siteActivityReport.component.html',
  styleUrls: ['./siteActivityReport.component.scss']
})
export class SiteActivityReportComponent implements OnInit, OnDestroy {

  actionReportObj: ActionReport = <ActionReport>{};
  constructor(
    public helperService: HelperService,
    public formBuilder: FormBuilder,
    private navService: NavigationService,
    public analyticsService: AnalyticsReportService,
    public compiler: CompilerProvider,
    private highChartSettings: HighchartService,
    public adminServices: AdminControlService,
  ) {
    this.actionReportObj.filters = ['range', 'weekly', 'monthly', 'yearly', 'Lifetime']
    this.actionReportObj.showChart = true;
  }

  ngOnInit() {
    this.actionReportObj.actionReportForm = this.formBuilder.group({
      entityName: ['', Validators.required],
      dateTo: ['', Validators.required],
      dateFrom: ['', Validators.required],
      site: ['', Validators.required],
      filter: ['']
    });
    this.actionReportObj.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res !== 1) {
        this.actionReportObj.allEntitiesData = res;
        this.actionReportObj.entityName = this.actionReportObj.allEntitiesData.entityInfo.name;
        this.actionFormValidations['entityName'].setValue(this.actionReportObj.entityName);
        this.actionFormValidations['entityName'].disable();
      }
    });
     this.getSitesData();

  }

  get actionFormValidations() {
    return this.actionReportObj.actionReportForm.controls;
  }

  makeReport(data) {
    this.analyticsService.siteActivityReport(data).subscribe((res) => {
      this.actionReportObj.userActionReportData = this.compiler.constructUserActionReportData(res);
      if (this.actionReportObj.userActionReportData.CheckIns.length === 0 &&
        this.actionReportObj.userActionReportData.CheckOuts.length === 0) {
        this.actionReportObj.showChart = false;
      } else {
        this.actionReportObj.showChart = true;
        let chartType: HighChartType = {
          type: 'column',
          title: this.actionReportObj.userActionReportData.site,
          subtitle: ''
        };
        let checkInChart = 1;
        let data1 = this.highChartSettings.reportSettings(chartType, [], this.actionReportObj.userActionReportData, checkInChart);
        Highcharts.chart('checkInContainer', data1);
        let checkOutChart = 2;
        let data2 = this.highChartSettings.reportSettings(chartType, [], this.actionReportObj.userActionReportData, checkOutChart);
        Highcharts.chart('checkOutContainer', data2);
      }
    });
  }

  actionReportFormSubmit({ value, valid }: { value: ActionReportApiData; valid: boolean; }) {
    if (!valid) {
      return;
    }
    let data;
    if (value.filter !== 'range') {
      data = {
        'entityId': JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
              this.helperService.appConstants.key)),
        'dateTo': null,
        'dateFrom': null,
        'filter': value.filter,
        'siteId': value.site
      };
    } else {
      data = {
        'entityId': JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
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

  getSitesData() {
    let entityData: ViewAllSiteEntityData = {
      entityId: JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
    };
    let paginationData: PaginationData = {
      offset: null,
      limit: this.helperService.appConstants.paginationLimit,
      search: ''
    };
    this.adminServices.viewSites(entityData, paginationData).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        console.log(res.data);
        this.actionReportObj.sitesData = this.compiler.constructAllSitesData(res);
        console.log(this.actionReportObj.sitesData);
      } else if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[3]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_SITES_FAILURE,
          this.helperService.constants.status.ERROR);
      }
    }, (error: HttpErrorResponse) => {
      this.helperService.createSnack(error.error,
        this.helperService.constants.status.ERROR);
    });
  }

}
