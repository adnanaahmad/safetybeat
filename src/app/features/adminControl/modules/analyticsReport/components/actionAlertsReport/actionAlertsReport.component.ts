import {Component, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {PaginationData} from 'src/app/models/site.model';
import {Report} from 'src/app/models/analyticsReport/reports.model';

@Component({
  selector: 'app-actionAlertsReport',
  templateUrl: './actionAlertsReport.component.html',
  styleUrls: ['./actionAlertsReport.component.scss']
})
export class ActionAlertsReportsComponent implements OnInit {
  actionAlertObj: Report = <Report>{};


  constructor(public helperService: HelperService,
              public formBuilder: FormBuilder,
              public memberService: MemberCenterService,
              public compiler: CompilerProvider,
              private adminServices: AdminControlService) {
  }

  ngOnInit() {
  }
}
