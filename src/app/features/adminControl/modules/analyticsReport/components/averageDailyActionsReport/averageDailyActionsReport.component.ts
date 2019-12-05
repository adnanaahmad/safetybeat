import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {
  ActionReportApiData,
  Report
} from 'src/app/models/analyticsReport/reports.model';
import {AnalyticsReportService} from 'src/app/features/adminControl/modules/analyticsReport/services/analyticsReport.service';
import {SubSink} from 'subsink';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {PaginationData} from 'src/app/models/site.model';

@Component({
  selector: 'app-averageDailyActionsReport',
  templateUrl: './averageDailyActionsReport.component.html',
  styleUrls: ['./averageDailyActionsReport.component.scss']
})
export class AverageDailyActionsReportComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  averageActionObj: Report = <Report>{};
  displayedColumns: string[] = ['user', 'averageCheckIn', 'averageCheckOut', 'averageDuration'];
  private subs = new SubSink();

  constructor(public helperService: HelperService,
              public formBuilder: FormBuilder,
              public memberService: MemberCenterService,
              public compiler: CompilerProvider,
              private navService: NavigationService,
              public analyticsService: AnalyticsReportService) {
    this.initialize();
    this.setEntityName();
    this.getAllUsers();
    this.getFilters()

  }

  ngOnInit() {
    this.makeReport(7, null, null, null, 0)
  }

  initialize() {
    this.averageActionObj.averageActionForm = this.formBuilder.group({
      filter: [''],
      entityName: ['', Validators.required],
      dateTo: [],
      dateFrom: [],
      user: ['']

    });
    this.averageActionObj.search = '';
    this.averageActionObj.pageSize = 10;
    this.averageActionObj.entityId = this.helperService.getEntityId();
    this.averageDailyActionsValidations[this.helperService.appConstants.dateFrom].disable();
    this.averageDailyActionsValidations[this.helperService.appConstants.dateTo].disable();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  setEntityName() {
    this.subs.add(
      this.navService.selectedEntityData.subscribe((res) => {
        if (res !== 1) {
          this.averageActionObj.entityName = res.entityInfo.name;
          this.averageDailyActionsValidations['entityName'].setValue(this.averageActionObj.entityName);
          this.averageDailyActionsValidations['entityName'].disable();
        }
      }));
  }

  getFilters() {
    this.subs.add(
      this.analyticsService.filter().subscribe((res) => {
        if (res) {
          this.averageActionObj.filters = res;
          this.averageActionObj.lastWeekObj = this.helperService.find(this.averageActionObj.filters, function (obj) {
            return obj.name === 'Last Week';
          });
          this.averageDailyActionsValidations['filter'].setValue(this.averageActionObj.lastWeekObj.id);
        }
      }));
  }

  averageActionSubmit({value, valid}: { value: ActionReportApiData; valid: boolean; }) {
    console.log(value);
    if (!valid) {
      return;
    }
    this.averageActionObj.days = this.helperService.find(this.averageActionObj.filters, function (obj) {
      return obj.id === value.filter;
    });
    this.makeReport(this.averageActionObj.days.days, value.dateTo, value.dateFrom, value.user, 0);
  }

  getAllUsers() {
    let data = {
      entityId: this.helperService.getEntityId()
    };
    this.subs.add(
      this.memberService.allEntityUsers(data).subscribe((res) => {
        if (res) {
          this.averageActionObj.entityUsers = this.compiler.constructDataForTeams(res.data);
        }
      }, (error) => {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
      }));
  }

  get averageDailyActionsValidations() {
    return this.averageActionObj.averageActionForm.controls;
  }

  enableDates(value: any) {
    this.averageActionObj.dateEnableObj = this.helperService.find(this.averageActionObj.filters, function (obj) {
      return obj.name === 'Choose a Range';
    });
    if (value === this.averageActionObj.dateEnableObj.id) {
      this.averageDailyActionsValidations[this.helperService.appConstants.dateFrom].enable();
      this.averageDailyActionsValidations[this.helperService.appConstants.dateTo].enable();
    } else {
      this.averageDailyActionsValidations[this.helperService.appConstants.dateFrom].disable();
      this.averageDailyActionsValidations[this.helperService.appConstants.dateTo].disable();
    }
  }

  makeReport(days, dateTo, dateFrom, user, pageIndex) {
    this.averageActionObj.loading = true;
    let data = {
      'entityId': this.averageActionObj.entityId,
      'dateTo': dateTo,
      'dateFrom': dateFrom,
      'days': days,
      'user': user
    };
    let paginationData: PaginationData = {
      offset: pageIndex * this.helperService.appConstants.paginationLimit,
      limit: this.helperService.appConstants.paginationLimit,
    };
    this.subs.add(
      this.analyticsService.averageDailyActionsReport(data, paginationData).subscribe((res) => {
        if (res && res.responseDetails.code === 100) {
          this.averageActionObj.pageCount = res.data.pageCount;
          this.averageActionObj.averageActionReportData = res.data.report;
          this.averageActionObj.dataSource = new MatTableDataSource(this.averageActionObj.averageActionReportData);
          this.averageActionObj.loading = false;
        } else {
          this.averageActionObj.loading = false;
        }
      }));
  }
}
