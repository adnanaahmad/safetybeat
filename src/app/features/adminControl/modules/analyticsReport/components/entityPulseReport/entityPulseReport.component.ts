import {Component, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {PulseEntityReport} from 'src/app/models/analyticsReport/averageDailyActions.model';
import {PaginationData} from 'src/app/models/site.model';

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
              private adminServices: AdminControlService) {
  }

  ngOnInit() {
    this.pulseEntityObj.pulseEntityForm = this.formBuilder.group({
      range: [''],
      allTeams: ['', Validators.required],
      dateTo: [],
      dateFrom: []
    });
    this.pulseEntityObj.entityId = this.helperService.getEntityId();;
    this.getAllTeams({entityId: this.pulseEntityObj.entityId});
  }

  getAllTeams(data) {
    let paginationData: PaginationData = {
      offset: null,
      limit: null,
      search: ''
    };
    this.adminServices.allTeamsData(data, paginationData).subscribe(res => {
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
