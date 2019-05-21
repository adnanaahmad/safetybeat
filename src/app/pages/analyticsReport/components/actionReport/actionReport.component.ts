import {Component, OnDestroy, OnInit} from '@angular/core';
import {HelperService} from '../../../../shared/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {ActionReport, ActionReportApiData} from '../../../../models/analyticsReport/actionReports.model';
import {NavigationService} from '../../../navigation/services/navigation.service';
import {AnalyticsReportService} from '../../services/analyticsReport.service';

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
  ) {
  }

  ngOnInit() {
    this.actionReportObj.actionReportForm = this.formBuilder.group({
      entityName: ['', Validators.required],
      dateTo: ['', Validators.required],
      dateFrom: ['', Validators.required]
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
      'dateFrom': value.dateFrom
    }
    this.analyticsService.actionReport(data).subscribe((res) => {
      console.log(res);
    });

  }

  ngOnDestroy() {
    this.actionReportObj.subscription.unsubscribe();
  }

}
