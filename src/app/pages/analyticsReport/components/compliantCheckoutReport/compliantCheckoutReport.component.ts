import { Component, OnInit } from '@angular/core';
import {HelperService} from '../../../../shared/helperService/helper.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MemberCenterService} from '../../../adminControl/modules/memberCenter/services/member-center.service';
import {CompilerProvider} from '../../../../shared/compiler/compiler';
import {AdminControlService} from '../../../adminControl/services/adminControl.service';
import {CompliantCheckOut} from '../../../../models/analyticsReport/averageDailyActions.model';

@Component({
  selector: 'app-compliantCheckoutReport',
  templateUrl: './compliantCheckoutReport.component.html',
  styleUrls: ['./compliantCheckoutReport.component.scss']
})
export class CompliantCheckoutReportComponent implements OnInit {
  compliantObj: CompliantCheckOut = <CompliantCheckOut>{};


  constructor(public helperService: HelperService,
              public formBuilder: FormBuilder,
              public memberService: MemberCenterService,
              public compiler: CompilerProvider,
              private adminServices: AdminControlService) { }

  ngOnInit() {
    this.compliantObj.compliantCheckOutForm = this.formBuilder.group({
      range: [''],
      allUsers: ['', Validators.required],
      allTeams: ['', Validators.required],
      dateTo: [],
      dateFrom: []
    });
    this.compliantObj.entityId =  JSON.parse(this.helperService.decrypt
    (localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
      this.helperService.appConstants.key));
    this.getAllUsers({entityId: this.compliantObj.entityId});
    this.getAllTeams({entity: this.compliantObj.entityId});
  }

  getAllUsers(data) {
    this.memberService.entityUsers(data).subscribe((res) => {
      this.compliantObj.allUserList = this.compiler.entityUser(res);
    });
  }

  getAllTeams(data) {
    this.adminServices.allTeamsData(data).subscribe(res => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.compliantObj.allTeams = this.compiler.constructAllTeamsData(res);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[3]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.TEAMS_NOT_FOUND,
          this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_TEAMS_FAILURE,
        this.helperService.constants.status.ERROR);
    });
  }

  formSubmit(compliantCheckOutForm: FormGroup) {

  }
}