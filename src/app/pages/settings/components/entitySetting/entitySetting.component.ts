import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {EditEntity} from 'src/app/models/profile.model';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {SettingService} from 'src/app/shared/settings/setting.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {EntitySetting} from 'src/app/models/Settings/entitySetting.model';
import {ProfileService} from '../../../profile/services/profile.service';
import {AdminControlService} from '../../../adminControl/services/adminControl.service';
import {CompilerProvider} from '../../../../shared/compiler/compiler';

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
              public settings: SettingService) {

    this.entitySettingObj.disabled = false;
  }

  ngOnInit() {
    this.entitySettingObj.allUsersList = []
    this.entitySettingObj.subscription = this.profile.usersData.subscribe((res) => {
      if (res !== 1) {
        this.entitySettingObj.allUsersList = res;
      } else {
        this.getAllUsers();
      }
    })
    this.selectedEntityData();
  }

  ngOnDestroy() {
    this.entitySettingObj.subscription.unsubscribe();
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

  getAllUsers() {
    this.profile.getAllUsers().subscribe(
      result => {
        this.entitySettingObj.allUsers = result;
        this.entitySettingObj.allUsersList = this.entitySettingObj.allUsers.data;
        this.profile.updateUsers(this.entitySettingObj.allUsersList);
      },
      error => {
        this.helperService.logoutError(error.status);
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
      let entityUserData = this.compiler.constructUserEntityData(this.entitySettingObj.entitiesList.data);
      this.navService.changeEntites(entityUserData);
    });
  }

  updateEntity({value, valid}: { value: EditEntity; valid: boolean }): void {
    this.entitySettingObj.disabled = false;
    this.entitySettingObj.entityForm.disable();
    let data = {
      'name': value.name,
      'code': value.code,
      'headOffice': this.helperService.address,
      'managedBy': this.entitySettingObj.entitiesData.managedBy,
      'createdBy': this.entitySettingObj.entitiesData.createdBy
    };
    if (!valid) {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.INVALID_ENTITY,
        this.helperService.translated.MESSAGES.INVALID_DATA, this.helperService.constants.status.ERROR);
      return;
    }
    this.settings.editEntity(this.entitySettingObj.entitiesData.id, data).subscribe((res) => {
      this.viewEntitiesApiCall();
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ENTITY_UPDATED,
        this.helperService.translated.MESSAGES.ENTITY_UPDATED_T, this.helperService.constants.status.SUCCESS);
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
