import {Component, OnDestroy, OnInit} from '@angular/core';
import {HelperService} from '../../../../shared/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {ActionReport, ActionReportApiData, HighChartType} from '../../../../models/analyticsReport/actionReports.model';
import {NavigationService} from '../../../navigation/services/navigation.service';
import {AnalyticsReportService} from '../../services/analyticsReport.service';
import {CompilerProvider} from '../../../../shared/compiler/compiler';
import {HighchartService} from '../../../../shared/highchart/highchart.service';
import * as Highcharts from 'highcharts';
import {AdminControlService} from '../../../adminControl/services/adminControl.service';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-action-report',
  templateUrl: './actionReport.component.html',
  styleUrls: ['./actionReport.component.scss']
})
export class ActionReportComponent implements OnInit, OnDestroy {
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
    this.getAllSites();
  }

  ngOnInit() {
    this.actionReportObj.actionReportForm = this.formBuilder.group({
      entityName: ['', Validators.required],
      dateTo: ['', Validators.required],
      dateFrom: ['', Validators.required],
      site: ['', Validators.required]
    });
    this.actionReportObj.subscription = this.navService.data.subscribe((res) => {
      if (res !== 1) {
        this.actionReportObj.allEntitiesData = res;
        this.actionReportObj.entityUserData = this.actionReportObj.allEntitiesData.entities;
        this.actionReportObj.entityName = this.actionReportObj.entityUserData[0].entityInfo.name;
        this.actionFormValidations['entityName'].setValue(this.actionReportObj.entityName);
        this.actionFormValidations['entityName'].disable();
      }
    });

  }

  get actionFormValidations() {
    return this.actionReportObj.actionReportForm.controls;
  }

  actionReportFormSubmit({value, valid}: { value: ActionReportApiData; valid: boolean; }) {
    if (!valid) {
      return;
    }
    let data = {
      'entityId': this.actionReportObj.entityUserData[0].entityInfo.id,
      'dateTo': value.dateTo,
      'dateFrom': value.dateFrom,
      'siteId': value.site,
    };
    this.analyticsService.actionReportForUser(data).subscribe((res) => {
      this.actionReportObj.userActionReportData = this.compiler.constructUserActionReportData(res);
      let chartType: HighChartType = {
        type: 'column',
        title: this.actionReportObj.userActionReportData.site,
        subtitle: ''
      };
      let checkInChart = 1;
      let data1 = this.highChartSettings.reportSettings(chartType, [], this.actionReportObj.userActionReportData, checkInChart);
      console.log(data1);
      Highcharts.chart('checkInContainer', data1);
      let checkOutChart = 2;
      let data2 = this.highChartSettings.reportSettings(chartType, [], this.actionReportObj.userActionReportData, checkOutChart);
      console.log(data2);
      Highcharts.chart('checkOutContainer', data2);
    });

  }

  getAllSites() {
    let entityData = {
      'entityId': JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
    };
    this.adminServices.viewSites(entityData).subscribe((res) => {
      this.actionReportObj.sitesData = this.compiler.constructAllSitesData(res);
    });
  }

  ngOnDestroy() {
    this.actionReportObj.subscription.unsubscribe();
  }

}
