import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HazardReport} from '../../../../models/analyticsReport/averageDailyActions.model';
import {HelperService} from '../../../../shared/helperService/helper.service';
import {MemberCenterService} from '../../../adminControl/modules/memberCenter/services/member-center.service';
import {CompilerProvider} from '../../../../shared/compiler/compiler';
import {AdminControlService} from '../../../adminControl/services/adminControl.service';
import {AnalyticsReportService} from '../../services/analyticsReport.service';
import {HighChartType} from '../../../../models/analyticsReport/actionReports.model';
import * as Highcharts from 'highcharts';
import {HighchartService} from '../../../../shared/highchart/highchart.service';

@Component({
  selector: 'app-hazarReport',
  templateUrl: './hazardReport.component.html',
  styleUrls: ['./hazardReport.component.scss']
})
export class HazardReportComponent implements OnInit {
  hazardObj: HazardReport = <HazardReport>{};
  private data: any;

  constructor(public helperService: HelperService,
              public formBuilder: FormBuilder,
              public memberService: MemberCenterService,
              public analyticsService: AnalyticsReportService,
              public compiler: CompilerProvider,
              private adminServices: AdminControlService,
              private highChartSettings: HighchartService) { }

  ngOnInit() {
    this.hazardObj.hazardReportForm = this.formBuilder.group({
      range: [''],
      allTeams: ['', Validators.required],
      dateTo: [],
      dateFrom: []
    });
    this.hazardObj.entityId =  JSON.parse(this.helperService.decrypt
    (localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
      this.helperService.appConstants.key));
    this.getAllTeams({entity: this.hazardObj.entityId});
    this.getHazardReport({entityId: this.hazardObj.entityId,
      'dateTo': null,
      'dateFrom': null,
      'filter': 'Lifetime'});
  }

  getAllTeams(data) {
    this.adminServices.allTeamsData(data).subscribe(res => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.hazardObj.allTeams = this.compiler.constructAllTeamsData(res);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[3]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.TEAMS_NOT_FOUND,
          this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_TEAMS_FAILURE,
        this.helperService.constants.status.ERROR);
    });
  }

  getHazardReport(data) {
    this.analyticsService.getHazardReport(data).subscribe(res => {
      console.log(res);
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[3]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.TEAMS_NOT_FOUND,
          this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_TEAMS_FAILURE,
        this.helperService.constants.status.ERROR);
    });
  }



  formSubmit(hazardReportForm: FormGroup) {

  }
}
