import {Component, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {AnalyticsReportService} from 'src/app/features/adminControl/modules/analyticsReport/services/analyticsReport.service';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {ActionReportApiData, CheckInByActivityData, HighChartType, Report} from 'src/app/models/analyticsReport/reports.model';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';
import * as Highcharts from 'highcharts';
import {HighchartService} from 'src/app/services/common/highchart/highchart.service';

@Component({
  selector: 'app-checkinActivityReport',
  templateUrl: './checkinActivityReport.component.html',
  styleUrls: ['./checkinActivityReport.component.scss']
})
export class CheckInActivityReportComponent implements OnInit {
  checkInActivityObj: Report = <Report>{};

  constructor(public helperService: HelperService,
              public formBuilder: FormBuilder,
              public compiler: CompilerProvider,
              private navService: NavigationService,
              private memberService: MemberCenterService,
              public analyticsService: AnalyticsReportService,
              private highChartSettings: HighchartService) {
    this.initialize()
    this.setEntityName();
    this.getFilters();
    this.getAllUsers();
  }

  ngOnInit() {
    this.makeReport(0, null, null, null)
  }

  initialize() {
    this.checkInActivityObj.loading = false
    this.checkInActivityObj.checkInActivityForm = this.formBuilder.group({
      filter: [''],
      user: [''],
      entityName: ['', Validators.required],
      dateTo: [],
      dateFrom: []
    });
    this.checkInActivityObj.entityId = this.helperService.getEntityId();
    this.checkInActivityFormValidations[this.helperService.appConstants.dateFrom].disable();
    this.checkInActivityFormValidations[this.helperService.appConstants.dateTo].disable();
  }

  setEntityName() {
    this.checkInActivityObj.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res !== 1) {
        this.checkInActivityObj.entityName = res.entityInfo.name;
        this.checkInActivityFormValidations['entityName'].setValue(this.checkInActivityObj.entityName);
        this.checkInActivityFormValidations['entityName'].disable();
      }
    });
  }

  getFilters() {
    this.analyticsService.filter().subscribe((res) => {
      if (res) {
        this.checkInActivityObj.filters = res;
        this.checkInActivityObj.lifetimeObj = this.helperService.find(this.checkInActivityObj.filters, function (obj) {
          return obj.name === 'Lifetime';
        });
        this.checkInActivityFormValidations['filter'].setValue(this.checkInActivityObj.lifetimeObj.id);
      }
    });
  }

  get checkInActivityFormValidations() {
    return this.checkInActivityObj.checkInActivityForm.controls;
  }

  getAllUsers() {
    let data = {
      entityId: this.helperService.getEntityId()
    };
    this.memberService.allEntityUsers(data).subscribe((res) => {
      if (res) {
        this.checkInActivityObj.entityUsers = this.compiler.constructDataForTeams(res.data);
      }
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  enableDates(value: any) {
    this.checkInActivityObj.dateEnableObj = this.helperService.find(this.checkInActivityObj.filters, function (obj) {
      return obj.name === 'Choose a Range';
    });
    if (value === this.checkInActivityObj.dateEnableObj.id) {
      this.checkInActivityFormValidations[this.helperService.appConstants.dateFrom].enable();
      this.checkInActivityFormValidations[this.helperService.appConstants.dateTo].enable();
    } else {
      this.checkInActivityFormValidations[this.helperService.appConstants.dateFrom].disable();
      this.checkInActivityFormValidations[this.helperService.appConstants.dateTo].disable();
    }
  }

  makeReport(days, dateTo, dateFrom, userId) {
    this.checkInActivityObj.loading = true
    let data = {
      'entityId': this.checkInActivityObj.entityId,
      'dateTo': dateTo,
      'dateFrom': dateFrom,
      'days': days,
      'user': userId
    };
    this.analyticsService.checkInByActivityReport(data).subscribe((res) => {
      if (res && res.responseDetails.code === 100) {
        this.checkInActivityObj.checkInByActivityReportData = res.data.checkInByActivity;
        let chartType: HighChartType = {
          type: 'column',
          title: 'Check In By Activity Report ( Maintenance / Installation )',
          subtitle: ''
        };
        let data = this.highChartSettings.reportSettings(chartType,
          [], this.generateCharSeries(this.checkInActivityObj.checkInByActivityReportData,
            res.data.maintenancePercentage, res.data.installationPercentage));
        Highcharts.chart('container', data);
        this.checkInActivityObj.loading = false;
      } else {
        this.checkInActivityObj.loading = false;
      }
    });
  }

  generateCharSeries(reportData: any, maintenancePercentage, installationPercentage) {
    let charSeries = [];
    this.helperService.iterations(reportData, function (checkInByActivityReport: CheckInByActivityData) {
      let checkIn = {
        type: 'column',
        name: checkInByActivityReport.date,
        data: [checkInByActivityReport.maintenance, checkInByActivityReport.installation]
      };
      charSeries.push(checkIn);

    });
    charSeries.push({
      type: 'pie',
      name: 'Total CheckIns',
      data: [{
        name: 'Maintenance',
        y: maintenancePercentage,
        color: Highcharts.getOptions().colors[0]
      }, {
        name: 'Installation',
        y: installationPercentage,
        color: Highcharts.getOptions().colors[1]
      }],
      center: [50, 10],
      size: 100,
      showInLegend: false,
      dataLabels: {
        enabled: false
      }
    })
    let data = {
      charSeries: charSeries,
      categories: ['Maintenance', 'Installation'],
      title: 'No of Check In By Activity(Maintenance/Installation)'
    }
    return data;
  }

  checkInActivityFormSubmit({value, valid}: { value: ActionReportApiData; valid: boolean; }) {
    if (!valid) {
      return;
    }
    this.checkInActivityObj.days = this.helperService.find(this.checkInActivityObj.filters, function (obj) {
      return obj.id === value.filter;
    });
    this.makeReport(this.checkInActivityObj.days.days, value.dateTo, value.dateFrom, value.user)
  }
}
