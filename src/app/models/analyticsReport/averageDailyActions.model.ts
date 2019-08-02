import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';


export interface AverageDailyActions {
  subscription: Subscription;
  averageActionForm: FormGroup;
  allUserList: any;
  entityId: number;
  allTeams: any;
}

export interface AlertPersonReport {
  entityId: number;
  allTeams: any[];
  allUserList: any[];
  alertPersonReportForm: FormGroup;
}

export interface ActionVSAlert {
  entityId: number;
  actionVsAlertForm: FormGroup;
  allUserList: any;
  allTeams: any;
}

export interface CompliantCheckOut {
  allUserList: any;
  compliantCheckOutForm: FormGroup;
  allTeams: any;
  entityId: number;
}
