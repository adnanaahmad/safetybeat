import {Component, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CheckInActivityReport} from 'src/app/models/analyticsReport/averageDailyActions.model';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {PaginationData} from 'src/app/models/site.model';

@Component({
  selector: 'app-checkinActivityReport',
  templateUrl: './checkinActivityReport.component.html',
  styleUrls: ['./checkinActivityReport.component.scss']
})
export class CheckInActivityReportComponent implements OnInit {
  checkInActivityObj: CheckInActivityReport = <CheckInActivityReport>{};

  constructor(public helperService: HelperService,
              public formBuilder: FormBuilder,
              public compiler: CompilerProvider,
              private adminServices: AdminControlService) {
  }

  ngOnInit() {
    this.checkInActivityObj.checkInActivityForm = this.formBuilder.group({
      range: [''],
      allSites: ['', Validators.required],
      allTeams: ['', Validators.required],
      dateTo: [],
      dateFrom: []
    });
    this.checkInActivityObj.entityId = JSON.parse(this.helperService.decrypt
    (localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
      this.helperService.appConstants.key));
    this.getAllTeams({entityId: this.checkInActivityObj.entityId});
  }

  getAllTeams(data) {
    let paginationData: PaginationData = {
      offset: null,
      limit: null,
      search: ''
    };
    this.adminServices.allTeamsData(data, paginationData).subscribe(res => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.checkInActivityObj.allTeams = this.compiler.constructAllTeamsData(res);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[3]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.TEAMS_NOT_FOUND,
          this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_TEAMS_FAILURE,
        this.helperService.constants.status.ERROR);
    });
  }

  activityFormSubmit(checkInActivityForm: FormGroup) {

  }
}
