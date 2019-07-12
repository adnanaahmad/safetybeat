import {Component, OnInit} from '@angular/core';
import {HelperService} from '../../../../../../shared/helperService/helper.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MemberCenterService} from '../../../memberCenter/services/member-center.service';
import {CompilerProvider} from '../../../../../../shared/compiler/compiler';
import {AdminControlService} from '../../../../services/adminControl.service';
import {PulsePersonReport} from '../../../../../../models/analyticsReport/averageDailyActions.model';

@Component({
  selector: 'app-person-pulse-report',
  templateUrl: './personPulseReport.component.html',
  styleUrls: ['./personPulseReport.component.scss']
})
export class PersonPulseReportComponent implements OnInit {
  pulsePersonObj: PulsePersonReport = <PulsePersonReport>{};


  constructor(public helperService: HelperService,
              public formBuilder: FormBuilder,
              public memberService: MemberCenterService,
              public compiler: CompilerProvider,
              private adminServices: AdminControlService) {
  }

  ngOnInit() {
    this.pulsePersonObj.pulsePersonForm = this.formBuilder.group({
      range: [''],
      allUsers: ['', Validators.required],
      allTeams: ['', Validators.required],
      dateTo: [],
      dateFrom: []
    });
    this.pulsePersonObj.entityId = JSON.parse(this.helperService.decrypt
    (localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
      this.helperService.appConstants.key));
    this.getAllUsers({entityId: this.pulsePersonObj.entityId});
    this.getAllTeams({entity: this.pulsePersonObj.entityId});
  }

  getAllUsers(data) {
    this.memberService.allEntityUsers(data).subscribe((res) => {
      if (res) {
        this.pulsePersonObj.allUserList = this.compiler.entityUser(res.data);
      }
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  getAllTeams(data) {
    this.adminServices.allTeamsData(data).subscribe(res => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.pulsePersonObj.allTeams = this.compiler.constructAllTeamsData(res);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[3]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.TEAMS_NOT_FOUND,
          this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_TEAMS_FAILURE,
        this.helperService.constants.status.ERROR);
    });
  }

  formSubmit(pulsePersonForm: FormGroup) {

  }
}
