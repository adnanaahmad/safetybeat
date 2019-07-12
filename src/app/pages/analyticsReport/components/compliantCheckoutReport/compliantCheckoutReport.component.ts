import { Component, OnInit } from '@angular/core';
import {HelperService} from '../../../../shared/helperService/helper.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MemberCenterService} from 'src/app/pages/adminControl/modules/memberCenter/services/member-center.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {CompliantCheckOut} from 'src/app/models/analyticsReport/averageDailyActions.model';
import {PaginationData} from '../../../../models/site.model';

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
    let paginationData: PaginationData = {
      offset: null,
      limit: null,
      search: ''
    };
    this.adminServices.allTeamsData(data, paginationData).subscribe(res => {
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
