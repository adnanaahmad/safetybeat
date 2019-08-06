import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {AnalyticsReportService} from 'src/app/features/adminControl/modules/analyticsReport/services/analyticsReport.service';
import {HighchartService} from 'src/app/services/common/highchart/highchart.service';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {
  ActionReportApiData,
  HazardReportByStatusData,
  HazardReportData,
  HighChartType,
  Report
} from 'src/app/models/analyticsReport/reports.model';
import * as Highcharts from 'highcharts';


@Component({
  selector: 'app-hazardReport',
  templateUrl: './hazardReport.component.html',
  styleUrls: ['./hazardReport.component.scss']
})
export class HazardReportComponent implements OnInit {
  hazardObj: Report = <Report>{};
  private data: any;

  constructor(public helperService: HelperService,
              public formBuilder: FormBuilder,
              public memberService: MemberCenterService,
              public analyticsService: AnalyticsReportService,
              public compiler: CompilerProvider,
              private adminServices: AdminControlService,
              private navService: NavigationService,
              private highChartSettings: HighchartService) {
    this.initialize();
    this.setEntityName();
    this.getFilters();
    this.getAllUsers();
  }

  ngOnInit() {
    this.makeReport(0, null, null, null)
  }

  initialize() {
    this.hazardObj.loading = false;
    this.hazardObj.hazardReportForm = this.formBuilder.group({
      filter: [''],
      entityName: ['', Validators.required],
      dateTo: [],
      dateFrom: [],
      user: ['']
    });
    this.hazardObj.entityId = this.helperService.getEntityId();
    this.hazardFormValidations[this.helperService.appConstants.dateFrom].disable();
    this.hazardFormValidations[this.helperService.appConstants.dateTo].disable();
  }

  setEntityName() {
    this.hazardObj.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res !== 1) {
        this.hazardObj.entityName = res.entityInfo.name;
        this.hazardFormValidations['entityName'].setValue(this.hazardObj.entityName);
        this.hazardFormValidations['entityName'].disable();
      }
    });
  }

  get hazardFormValidations() {
    return this.hazardObj.hazardReportForm.controls;
  }

  getFilters() {
    this.analyticsService.filter().subscribe((res) => {
      if (res) {
        this.hazardObj.filters = res;
        this.hazardObj.lifetimeObj = this.helperService.find(this.hazardObj.filters, function (obj) {
          return obj.name === 'Lifetime';
        });
        this.hazardFormValidations['filter'].setValue(this.hazardObj.lifetimeObj.id);
      }
    });
  }

  getAllUsers() {
    let data = {
      entityId: this.helperService.getEntityId()
    };
    this.memberService.allEntityUsers(data).subscribe((res) => {
      if (res) {
        this.hazardObj.entityUsers = this.compiler.constructDataForTeams(res.data);
      }
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  makeReport(days, dateTo, dateFrom, user) {
    this.hazardObj.loading = true;
    let data = {
      'entityId': this.hazardObj.entityId,
      'dateTo': dateTo,
      'dateFrom': dateFrom,
      'days': days,
      'user': user
    };
    this.analyticsService.getHazardReport(data).subscribe((res) => {
      if (res && res.responseDetails.code === 100) {
        this.hazardObj.hazardReportData = res.data.hazardReportBySeverity;
        this.hazardObj.resolvedHazards = res.data.resolvedHazard;
        this.hazardObj.unResolvedHazards = res.data.unResolvedHazard;
        this.hazardObj.hazardReportByStatusData = res.data.hazardReportByStatus;
        this.reportBySeverity(this.hazardObj.hazardReportData);
        this.reportByStatus(this.hazardObj.hazardReportByStatusData);
        this.hazardObj.loading = false;
      } else {
        this.hazardObj.loading = false;
      }
    });
  }

  reportBySeverity(hazardSeverityData) {
    let chartType: HighChartType = {
      type: 'column',
      title: 'Hazard Report with Severity',
      subtitle: ''
    };
    let reportBySeverityData = this.highChartSettings.reportSettings(chartType,
      [], this.generateCharSeries(hazardSeverityData));
    Highcharts.chart('severityReport', reportBySeverityData);
  }

  reportByStatus(hazardStatusData) {
    let chartTypeForStatus: HighChartType = {
      type: 'column',
      title: 'Hazard Report with Status',
      subtitle: ''
    };
    let reportByStatusData = this.highChartSettings.reportSettings(chartTypeForStatus,
      [], this.generateHazardStatusData(hazardStatusData));
    Highcharts.chart('statusReport', reportByStatusData);
  }

  generateCharSeries(reportData: any) {
    let charSeries = [];
    this.helperService.iterations(reportData, function (hazardReport: HazardReportData) {
      let pulse = {
        name: hazardReport.date,
        data: [hazardReport.minor, hazardReport.moderate, hazardReport.major, hazardReport.extreme]
      };
      charSeries.push(pulse);
    });
    let data = {
      charSeries: charSeries,
      categories: ['Minor', 'Moderate', 'Major', 'Extreme'],
      title: 'No of Hazard with Severity'
    }
    return data;
  }

  generateHazardStatusData(reportData: HazardReportByStatusData) {
    let charSeries = [{
      name: 'Minor',
      data: [reportData.minorResolved, reportData.minorUnResolved]
    },
      {
        name: 'Moderate',
        data: [reportData.moderateResolved, reportData.moderateUnResolved]
      }, {
        name: 'Major',
        data: [reportData.majorResolved, reportData.majorUnResolved]
      }, {
        name: 'Extreme',
        data: [reportData.extremeResolved, reportData.extremeUnResolved]
      }];
    let data = {
      charSeries: charSeries,
      categories: ['Resolved', 'UnResolved'],
      title: 'No of Hazard with Status'
    }
    return data;
  }

  enableDates(value: any) {
    this.hazardObj.dateEnableObj = this.helperService.find(this.hazardObj.filters, function (obj) {
      return obj.name === 'Choose a Range';
    });
    if (value === this.hazardObj.dateEnableObj.id) {
      this.hazardFormValidations[this.helperService.appConstants.dateFrom].enable();
      this.hazardFormValidations[this.helperService.appConstants.dateTo].enable();
    } else {
      this.hazardFormValidations[this.helperService.appConstants.dateFrom].disable();
      this.hazardFormValidations[this.helperService.appConstants.dateTo].disable();
    }
  }


  formSubmit({value, valid}: { value: ActionReportApiData; valid: boolean; }) {
    if (!valid) {
      return;
    }
    this.hazardObj.days = this.helperService.find(this.hazardObj.filters, function (obj) {
      return obj.id === value.filter;
    });
    this.makeReport(this.hazardObj.days.days, value.dateTo, value.dateFrom, value.user)
  }
}
