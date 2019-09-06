import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {EditEntity} from 'src/app/models/profile.model';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {EntitySetting} from 'src/app/models/Settings/entitySetting.model';
import {ProfileService} from 'src/app/features/profile/services/profile.service';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {SettingsService} from 'src/app/features/settings/services/settings.service';
import {PaginationData} from '../../../../models/site.model';

@Component({
  selector: 'app-entity-setting',
  templateUrl: './entitySetting.component.html',
  styleUrls: ['./entitySetting.component.scss']
})
export class EntitySettingComponent implements OnInit, OnDestroy {
  entitySettingObj: EntitySetting = <EntitySetting>{};
  @ViewChild('gmap') gMapElement: ElementRef;

  constructor(private formBuilder: FormBuilder,
              public helperService: HelperService,
              private navService: NavigationService,
              private profile: ProfileService,
              private adminServices: AdminControlService,
              private compiler: CompilerProvider,
              public settings: SettingsService) {

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
      headOffice: ['', Validators.required]
    });
    this.entitySettingObj.entityForm.disable();
    this.entitySettingObj.subscription = this.navService.selectedEntityData.subscribe((selectedEntity) => {
      if (selectedEntity !== 1) {
        this.entitySettingObj.entitiesData = selectedEntity.entityInfo;
        this.entitySettingObj.entityManagedBy = selectedEntity.managedBy;
        this.entityFormValidations['name'].setValue(this.entitySettingObj.entitiesData.name);
        this.entityFormValidations['code'].setValue(this.entitySettingObj.entitiesData.code);
        this.entityFormValidations['headOffice'].setValue(this.entitySettingObj.entitiesData.headOffice);
        this.helperService.address = this.entitySettingObj.entitiesData.headOffice;
        this.helperService.setLocationGeocode(this.entitySettingObj.entitiesData.headOffice,
          this.helperService.createMap(this.gMapElement)).then();
      }
    });
  }

  cancelEditEntity() {
    this.entitySettingObj.entityForm.disable();
    this.entitySettingObj.disabled = false;
    this.selectedEntityData();
    this.entitySettingObj.subscription.unsubscribe();
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
      'managedBy': this.entitySettingObj.entitiesData.managedBy,
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
}
