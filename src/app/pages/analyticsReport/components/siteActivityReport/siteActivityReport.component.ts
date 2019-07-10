import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionReport, ActionReportApiData, HighChartType} from 'src/app/models/analyticsReport/actionReports.model';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {AnalyticsReportService} from 'src/app/pages/analyticsReport/services/analyticsReport.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {HighchartService} from 'src/app/shared/highchart/highchart.service';
import * as Highcharts from 'highcharts';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';

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
    this.getAllSites();
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

  }

  get actionFormValidations() {
    return this.actionReportObj.actionReportForm.controls;
  }

  // defaultReport() {
  //   let data = {
  //     'entityId': this.siteActivityObj.entityId,
  //     'dateTo': null,
  //     'dateFrom': null,
  //     'filter': null
  //   };
  //   this.makeReport(data);
  // }

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

  getAllSites() {
    let entityData = {
      'entityId': JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key))
    };
    this.adminServices.getSiteList(entityData).subscribe((res) => {
      this.actionReportObj.sitesData = this.compiler.constructSiteList(res);
      console.log(this.actionReportObj.sitesData);
    });
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
