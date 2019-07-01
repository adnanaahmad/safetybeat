import {FormGroup} from '@angular/forms';


export interface AverageDailyActions {
  averageActionForm: FormGroup;
  allUserList: any;
  entityId: number;
  allTeams: any;
}

export interface CheckInActivityReport {
  checkInActivityForm: FormGroup;
  allTeams: any;
  entityId: number;
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

export interface PulseEntityReport {
  pulseEntityForm: FormGroup;
  allTeams: any;
  entityId: number;
}

export interface PulsePersonReport {
  allUserList: any;
  pulsePersonForm: FormGroup;
  allTeams: any;
  entityId: number;
}

export interface CompliantCheckOut {
  allUserList: any;
  compliantCheckOutForm: FormGroup;
  allTeams: any;
  entityId: number;
}

export interface HazardReport {
  hazardReportForm: FormGroup;
  allTeams: any;
  entityId: number;
}
