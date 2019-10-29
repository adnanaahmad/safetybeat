import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EditEntity} from 'src/app/models/profile.model';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {EntitySetting, IntervalsData} from 'src/app/models/Settings/entitySetting.model';
import {ProfileService} from 'src/app/features/profile/services/profile.service';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {SettingsService} from 'src/app/features/settings/services/settings.service';
import {PaginationData} from 'src/app/models/site.model';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';
import {ValidateInterval} from './interval.validator';

export interface PeriodicElement {
  position: string;
  notifiesUser: string;
  interval: string;
  notifiesTeamLead?: string;
  notifiesSiteSafetyManager?: string;
  notifiesEntityManager?: string;
  notifiesAdmin?: string;


}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: '1st', notifiesUser: 'User', interval: 'interval1'},
  {position: '2nd', notifiesUser: 'User', notifiesTeamLead: 'Team Leader', interval: 'interval2'},
  {
    position: '3rd',
    notifiesUser: 'User',
    notifiesTeamLead: 'Team Leader',
    notifiesSiteSafetyManager: 'Site Safety Manager',
    interval: 'interval3'
  },
  {
    position: '4th',
    notifiesUser: 'User',
    notifiesTeamLead: 'Team Leader',
    notifiesSiteSafetyManager: 'Site Safety Manager',
    notifiesEntityManager: 'Entity Manager',
    interval: 'interval4'
  },
  {
    position: '5th',
    notifiesUser: 'User',
    notifiesTeamLead: 'Team Leader',
    notifiesSiteSafetyManager: 'Site Safety Manager',
    notifiesEntityManager: 'Entity Manager',
    notifiesAdmin: 'Administrator',
    interval: 'interval5',
  }

];

@Component({
  selector: 'app-entity-setting',
  templateUrl: './entitySetting.component.html',
  styleUrls: ['./entitySetting.component.scss']
})
export class EntitySettingComponent implements OnInit, OnDestroy {
  entitySettingObj: EntitySetting = <EntitySetting>{};
  @ViewChild('gmap') gMapElement: ElementRef;
  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource = ELEMENT_DATA;
  intervalData: IntervalsData;

  constructor(private formBuilder: FormBuilder,
              public helperService: HelperService,
              private navService: NavigationService,
              private profile: ProfileService,
              private adminServices: AdminControlService,
              private compiler: CompilerProvider,
              public settings: SettingsService,
              private memberService: MemberCenterService) {
    this.entitySettingObj.disabled = false;
    this.entitySettingObj.loading = false;
  }

  ngOnInit() {
    this.entitySettingObj.allUsersList = [];
    this.entitySettingObj.subscription = this.profile.usersData.subscribe((res) => {
      if (res !== 1) {
        this.entitySettingObj.allUsersList = res;
      } else {
        this.getAllUsers(0);
      }
    });
    this.selectedEntityData();
    this.getAllEntityUsers();
  }

  ngOnDestroy() {
    if (this.entitySettingObj.subscription !== null && this.entitySettingObj.subscription !== undefined) {
      this.entitySettingObj.subscription.unsubscribe();
    }
  }

  selectedEntityData() {
    this.entitySettingObj.entityForm = this.formBuilder.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      headOffice: ['', Validators.required],
      entityManager: [''],
    });
    this.entitySettingObj.intervalForm = this.formBuilder.group({
      interval1: ['', [Validators.required, ValidateInterval, Validators.max(1440), Validators.min(5)]],
      interval2: ['', [Validators.required, ValidateInterval, Validators.max(1440), Validators.min(5)]],
      interval3: ['', [Validators.required, ValidateInterval, Validators.max(1440), Validators.min(5)]],
      interval4: ['', [Validators.required, ValidateInterval, Validators.max(1440), Validators.min(5)]],
      interval5: ['', [Validators.required, ValidateInterval, Validators.max(1440), Validators.min(5)]]
    });
    this.entitySettingObj.entityForm.disable();
    this.entitySettingObj.subscription = this.navService.selectedEntityData.subscribe((selectedEntity) => {
      if (selectedEntity !== 1) {
        this.entitySettingObj.entitiesData = selectedEntity.entityInfo;
        this.entitySettingObj.entityManagedBy = selectedEntity.managedBy;
        this.defaultIntervals(this.entitySettingObj.entitiesData.id);
        this.entityFormValidations['name'].setValue(this.entitySettingObj.entitiesData.name);
        this.entityFormValidations['code'].setValue(this.entitySettingObj.entitiesData.code);
        this.entityFormValidations['headOffice'].setValue(this.entitySettingObj.entitiesData.headOffice);
        this.entityFormValidations['entityManager'].setValue(this.entitySettingObj.entityManagedBy.id);
        this.helperService.address = this.entitySettingObj.entitiesData.headOffice;
        this.helperService.setLocationGeocode(this.entitySettingObj.entitiesData.headOffice,
          this.helperService.createMap(this.gMapElement)).then();
      }
    });
  }


  get intervalFormValidations() {
    return this.entitySettingObj.intervalForm.controls;
  }

  defaultIntervals(entity: number) {
    let data = {
      entityId: entity
    };
    this.settings.getDefaultIntervals(data).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.intervalData = res.data;
        localStorage.setItem('defaultIntervals', JSON.stringify(this.intervalData));
        this.intervalFormValidations['interval1'].setValue(this.intervalData.interval1);
        this.intervalFormValidations['interval2'].setValue(this.intervalData.interval2);
        this.intervalFormValidations['interval3'].setValue(this.intervalData.interval3);
        this.intervalFormValidations['interval4'].setValue(this.intervalData.interval4);
        this.intervalFormValidations['interval5'].setValue(this.intervalData.interval5);
      }
    }, ((error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    }));
  }

  cancelEditEntity() {
    this.entitySettingObj.entityForm.disable();
    this.entitySettingObj.disabled = false;
    this.selectedEntityData();
    this.entitySettingObj.subscription.unsubscribe();
    this.entitySettingObj.entityForm.markAsPristine();
  }

  getAllUsers(pageIndex) {
    let paginationData: PaginationData = {
      limit: this.helperService.constants.appConstant.paginationLimit,
      offset: pageIndex * this.helperService.constants.appConstant.paginationLimit,
    };
    this.profile.getAllUsers(paginationData).subscribe(
      result => {
        this.entitySettingObj.allUsers = result;
        this.entitySettingObj.allUsersList = this.entitySettingObj.allUsers.data;
        this.profile.updateUsers(this.entitySettingObj.allUsersList);
      },
      error => {
      }
    );
  }

  viewEntitiesApiCall() {
    let data = {
      moduleName: 'Safetybeat'
    };
    this.adminServices.viewEntities(data).subscribe((res) => {
      this.helperService.toggleLoader(false);
      this.entitySettingObj.entitiesList = res;
      let entityUserData = this.compiler.constructUserEntityData(this.entitySettingObj.entitiesList.data.allEntities);
      this.navService.changeEntites(entityUserData);
    });
  }

  updateEntity({value, valid}: { value: EditEntity; valid: boolean }): void {
    this.entitySettingObj.disabled = false;
    this.entitySettingObj.loading = true;
    this.entitySettingObj.entityForm.disable();
    let data = {
      'name': value.name,
      'code': value.code,
      'headOffice': this.helperService.address,
      'entityManager': value.entityManager,
      'createdBy': this.entitySettingObj.entitiesData.createdBy
    };
    if (!valid) {
      this.entitySettingObj.loading = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.INVALID_ENTITY, this.helperService.constants.status.ERROR);
      return;
    }
    this.settings.editEntity(this.entitySettingObj.entitiesData.id, data).subscribe((res) => {
      if (res) {
        this.viewEntitiesApiCall();
        this.entitySettingObj.entityForm.markAsPristine();
        this.entitySettingObj.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ENTITY_UPDATED, this.helperService.constants.status.SUCCESS);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

  editEntity() {
    this.entitySettingObj.disabled = true;
    this.entitySettingObj.entityForm.enable();
    this.entityFormValidations['code'].disable();
  }

  get entityFormValidations() {
    return this.entitySettingObj.entityForm.controls;
  }


  getAllEntityUsers() {
    let data = {
      entityId: this.entitySettingObj.entitiesData.id
    };
    this.memberService.allEntityUsers(data).subscribe((res) => {
      if (res) {
        this.entitySettingObj.entityUsers = this.compiler.constructDataForTeams(res.data);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

  intervalSubmit(intervalForm: FormGroup) {
    if (intervalForm.invalid) {
      this.helperService.createSnack('Notification intervals must be in ascending order.', this.helperService.constants.status.ERROR);
      return;
    }
    let interval1 = intervalForm.value.interval1;
    let interval2 = intervalForm.value.interval2;
    let interval3 = intervalForm.value.interval3;
    let interval4 = intervalForm.value.interval4;
    let interval5 = intervalForm.value.interval5;
    if (interval1 >= interval2 || interval1 >= interval3 || interval1 >= interval4 || interval1 >= interval5) {
      this.helperService.createSnack('Notification intervals must be in ascending order.', this.helperService.constants.status.ERROR);
      return;
    } else if (interval2 <= interval1 || interval2 >= interval3 || interval2 >= interval4 || interval2 >= interval5) {
      this.helperService.createSnack('Notification intervals must be in ascending order.', this.helperService.constants.status.ERROR);
      return;
    } else if (interval3 <= interval1 || interval3 <= interval2 || interval3 >= interval4 || interval4 >= interval5) {
      this.helperService.createSnack('Notification intervals must be in ascending order.', this.helperService.constants.status.ERROR);
      return;
    } else if (interval4 <= interval1 || interval4 <= interval2 || interval4 <= interval3 || interval4 >= interval5) {
      this.helperService.createSnack('Notification intervals must be in ascending order.', this.helperService.constants.status.ERROR);
      return;
    } else if (interval5 <= interval1 || interval5 <= interval2 || interval5 <= interval3 || interval5 <= interval4) {
      this.helperService.createSnack('Notification intervals must be in ascending order.', this.helperService.constants.status.ERROR);
      return;
    }
    let data = {
      entity: this.entitySettingObj.entitiesData.id,
      interval1: interval1,
      interval2: interval2,
      interval3: interval3,
      interval4: interval4,
      interval5: interval5
    };
    this.settings.updateIntervals(data, this.intervalData.id).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.intervalData = res.data;
        this.intervalFormValidations['interval1'].setValue(this.intervalData.interval1);
        this.intervalFormValidations['interval2'].setValue(this.intervalData.interval2);
        this.intervalFormValidations['interval3'].setValue(this.intervalData.interval3);
        this.intervalFormValidations['interval4'].setValue(this.intervalData.interval4);
        this.intervalFormValidations['interval5'].setValue(this.intervalData.interval5);
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.SUCCESS);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

  addition(interval: any) {
    if (this.intervalFormValidations[interval].value < 1440) {
      let updatedValue = this.intervalFormValidations[interval].value + 5;
      this.intervalFormValidations[interval].setValue(parseInt(updatedValue, 10));
    }
  }

  subtraction(interval: any) {
    if (this.intervalFormValidations[interval].value !== 5) {
      let updatedValue = this.intervalFormValidations[interval].value - 5;
      this.intervalFormValidations[interval].setValue(updatedValue);
    }
  }

  cancelEditIntervals() {
    this.intervalData = JSON.parse(localStorage.getItem('defaultIntervals'));
    this.intervalFormValidations['interval1'].setValue(this.intervalData.interval1);
    this.intervalFormValidations['interval2'].setValue(this.intervalData.interval2);
    this.intervalFormValidations['interval3'].setValue(this.intervalData.interval3);
    this.intervalFormValidations['interval4'].setValue(this.intervalData.interval4);
    this.intervalFormValidations['interval5'].setValue(this.intervalData.interval5);
  }
}
