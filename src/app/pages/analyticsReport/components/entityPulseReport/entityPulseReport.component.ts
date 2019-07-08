import { Component, OnInit } from '@angular/core';
import {HelperService} from '../../../../shared/helperService/helper.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MemberCenterService} from '../../../adminControl/modules/memberCenter/services/member-center.service';
import {CompilerProvider} from '../../../../shared/compiler/compiler';
import {AdminControlService} from '../../../adminControl/services/adminControl.service';
import {PulseEntityReport} from '../../../../models/analyticsReport/averageDailyActions.model';

@Component({
  selector: 'app-entityPulseReport',
  templateUrl: './entityPulseReport.component.html',
  styleUrls: ['./entityPulseReport.component.scss']
})
export class EntityPulseReportComponent implements OnInit {
  pulseEntityObj: PulseEntityReport = <PulseEntityReport>{};


  constructor(public helperService: HelperService,
              public formBuilder: FormBuilder,
              public compiler: CompilerProvider,
              private adminServices: AdminControlService) { }

  ngOnInit() {
    this.pulseEntityObj.pulseEntityForm = this.formBuilder.group({
      range: [''],
      allTeams: ['', Validators.required],
      dateTo: [],
      dateFrom: []
    });
    this.pulseEntityObj.entityId =  JSON.parse(this.helperService.decrypt
    (localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
      this.helperService.appConstants.key));
    this.getAllTeams({entity: this.pulseEntityObj.entityId});
  }

  getAllTeams(data) {
    this.adminServices.allTeamsData(data).subscribe(res => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.pulseEntityObj.allTeams = this.compiler.constructAllTeamsData(res);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[3]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.TEAMS_NOT_FOUND,
          this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_TEAMS_FAILURE,
        this.helperService.constants.status.ERROR);
    });
  }
  formSubmit(pulseEntityForm: FormGroup) {

  }
}
