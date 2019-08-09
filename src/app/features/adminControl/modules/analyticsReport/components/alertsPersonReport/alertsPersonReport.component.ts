import {Component, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';
import {PaginationData} from 'src/app/models/site.model';
import {Report} from '../../../../../../models/analyticsReport/reports.model';

@Component({
  selector: 'app-alerts-person-report',
  templateUrl: './alertsPersonReport.component.html',
  styleUrls: ['./alertsPersonReport.component.scss']
})
export class AlertsPersonReportComponent implements OnInit {
  alertPersonObj: Report = <Report>{};


  constructor(public helperService: HelperService,
              public formBuilder: FormBuilder,
              public compiler: CompilerProvider,
              public memberService: MemberCenterService,
              private adminServices: AdminControlService) {
  }

  ngOnInit() {

  }

}
