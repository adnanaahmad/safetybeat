import {Component, OnDestroy, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {Report} from '../../../../../../models/analyticsReport/reports.model';
import {AnalyticsReportService} from '../../services/analyticsReport.service';

@Component({
  selector: 'app-averageDailyActionsReport',
  templateUrl: './averageDailyActionsReport.component.html',
  styleUrls: ['./averageDailyActionsReport.component.scss']
})
export class AverageDailyActionsReportComponent implements OnInit, OnDestroy {
  averageActionObj: Report = <Report>{};

  constructor(public helperService: HelperService,
              public formBuilder: FormBuilder,
              public memberService: MemberCenterService,
              public compiler: CompilerProvider,
              private navService: NavigationService,
              public analyticsService: AnalyticsReportService) {
    this.initialize();
    this.setEntityName();
    this.getAllUsers();
    this.getFilters()

  }

  ngOnInit() {
    this.makeReport(0, null, null, null)
  }

  initialize() {
    this.averageActionObj.averageActionForm = this.formBuilder.group({
      filter: [''],
      entityName: ['', Validators.required],
      dateTo: [],
      dateFrom: [],
      user: ['']
    });
    this.averageActionObj.entityId = this.helperService.getEntityId();
    this.averageDailyActionsValidations[this.helperService.appConstants.dateFrom].disable();
    this.averageDailyActionsValidations[this.helperService.appConstants.dateTo].disable();
  }

  ngOnDestroy(): void {
    this.averageActionObj.subscription.unsubscribe();
  }

  setEntityName() {
    this.averageActionObj.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res !== 1) {
        this.averageActionObj.entityName = res.entityInfo.name;
        this.averageDailyActionsValidations['entityName'].setValue(this.averageActionObj.entityName);
        this.averageDailyActionsValidations['entityName'].disable();
      }
    });
  }

  getFilters() {
    this.analyticsService.filter().subscribe((res) => {
      if (res) {
        this.averageActionObj.filters = res;
        this.averageActionObj.lastWeekObj = this.helperService.find(this.averageActionObj.filters, function (obj) {
          return obj.name === 'Last Week';
        });
        this.averageDailyActionsValidations['filter'].setValue(this.averageActionObj.lastWeekObj.id);
      }
    });
  }

  getAllUsers() {
    let data = {
      entityId: this.helperService.getEntityId()
    };
    this.memberService.allEntityUsers(data).subscribe((res) => {
      if (res) {
        this.averageActionObj.entityUsers = this.compiler.constructDataForTeams(res.data);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

  averageActionSubmit(averageActionForm: FormGroup) {

  }

  get averageDailyActionsValidations() {
    return this.averageActionObj.averageActionForm.controls;
  }

  enableDates(value: any) {
    this.averageActionObj.dateEnableObj = this.helperService.find(this.averageActionObj.filters, function (obj) {
      return obj.name === 'Choose a Range';
    });
    if (value === this.averageActionObj.dateEnableObj.id) {
      this.averageDailyActionsValidations[this.helperService.appConstants.dateFrom].enable();
      this.averageDailyActionsValidations[this.helperService.appConstants.dateTo].enable();
    } else {
      this.averageDailyActionsValidations[this.helperService.appConstants.dateFrom].disable();
      this.averageDailyActionsValidations[this.helperService.appConstants.dateTo].disable();
    }
  }

  makeReport(days, dateTo, dateFrom, user) {
    this.averageActionObj.loading = true;
    let data = {
      'entityId': this.averageActionObj.entityId,
      'dateTo': dateTo,
      'dateFrom': dateFrom,
      'days': days,
      'user': user
    };
    this.analyticsService.averageDailyActionsReport(data).subscribe((res) => {
      if (res && res.responseDetails.code === 100) {
        // this.hazardObj.hazardReportData = res.data.hazardReportBySeverity;
        // this.hazardObj.resolvedHazards = res.data.resolvedHazard;
        // this.hazardObj.unResolvedHazards = res.data.unResolvedHazard;
        // this.hazardObj.hazardReportByStatusData = res.data.hazardReportByStatus;
        // this.reportBySeverity(this.hazardObj.hazardReportData);
        // this.reportByStatus(this.hazardObj.hazardReportByStatusData);
        // this.hazardObj.loading = false;
      } else {
        // this.hazardObj.loading = false;
      }
    });
  }
}
