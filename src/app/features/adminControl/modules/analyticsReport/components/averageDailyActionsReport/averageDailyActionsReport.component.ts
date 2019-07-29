import {Component, OnDestroy, OnInit} from '@angular/core';
import {AverageDailyActions} from 'src/app/models/analyticsReport/averageDailyActions.model';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {PaginationData} from 'src/app/models/site.model';

@Component({
  selector: 'app-averageDailyActionsReport',
  templateUrl: './averageDailyActionsReport.component.html',
  styleUrls: ['./averageDailyActionsReport.component.scss']
})
export class AverageDailyActionsReportComponent implements OnInit, OnDestroy {
  averageActionObj: AverageDailyActions = <AverageDailyActions>{};

  constructor(public helperService: HelperService,
              public formBuilder: FormBuilder,
              public memberService: MemberCenterService,
              public compiler: CompilerProvider,
              private navService: NavigationService,
              private adminServices: AdminControlService) {
  }

  ngOnInit() {
    this.averageActionObj.averageActionForm = this.formBuilder.group({
      range: [''],
      allUsers: ['', Validators.required],
      allTeams: ['', Validators.required],
      dateTo: [],
      dateFrom: []
    });
    this.averageActionObj.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res && res !== 1) {
        this.averageActionObj.entityId = res.entityInfo.id;
        this.getAllUsers({entityId: this.averageActionObj.entityId});
      }
    });
    this.getAllTeams({entityId: this.averageActionObj.entityId});
  }

  ngOnDestroy(): void {
    this.averageActionObj.subscription.unsubscribe();
  }

  getAllUsers(data) {
    this.memberService.allEntityUsers(data).subscribe((res) => {
      if (res) {
        this.averageActionObj.allUserList = this.compiler.constructDataForTeams(res.data);
      }
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
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
        this.averageActionObj.allTeams = this.compiler.constructAllTeamsData(res);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[3]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.TEAMS_NOT_FOUND,
          this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_TEAMS_FAILURE,
        this.helperService.constants.status.ERROR);
    });
  }

  averageActionSubmit(averageActionForm: FormGroup) {

  }
}
