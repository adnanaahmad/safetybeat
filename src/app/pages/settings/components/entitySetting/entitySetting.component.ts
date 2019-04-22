import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {EditEntity} from 'src/app/models/profile.model';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {SettingService} from 'src/app/shared/settings/setting.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {EntitySetting} from 'src/app/models/settings/entitySetting.model';

@Component({
  selector: 'app-entity-setting',
  templateUrl: './entitySetting.component.html',
  styleUrls: ['./entitySetting.component.scss']
})
export class EntitySettingComponent implements OnInit {
  entitySettingObj: EntitySetting = <EntitySetting>{};

  constructor(private formBuilder: FormBuilder,
              public helperService: HelperService,
              private navService: NavigationService,
              public settings: SettingService) {

    this.entitySettingObj.disabled = false;
  }

  ngOnInit() {
    this.entitySettingObj.entityForm = this.formBuilder.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      headOffice: ['', Validators.required]
    });
    this.entitySettingObj.entityForm.disable();
    this.navService.selectedEntityData.subscribe((selectedEntity) => {
      if (selectedEntity !== 1) {
        this.entitySettingObj.entitiesData = selectedEntity.entityInfo;
        this.entityFormValidations['name'].setValue(this.entitySettingObj.entitiesData.name);
        this.entityFormValidations['code'].setValue(this.entitySettingObj.entitiesData.code);
        this.entityFormValidations['headOffice'].setValue(this.entitySettingObj.entitiesData.headOffice);
      }
    });
  }

  updateEntity({value, valid}: { value: EditEntity; valid: boolean }): void {
    this.entitySettingObj.disabled = false;
    this.entitySettingObj.entityForm.disable();
    let data = {
      'name': value.name,
      'code': value.code,
      'headOffice': value.headOffice,
      'managedBy': this.entitySettingObj.entitiesData.managedBy,
      'createdBy': this.entitySettingObj.entitiesData.createdBy
    };
    if (!valid) {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.INVALID_ENTITY,
        this.helperService.translated.MESSAGES.INVALID_DATA, this.helperService.constants.status.ERROR);
      return;
    }
    this.settings.editEntity(this.entitySettingObj.entitiesData.id, data).subscribe((res) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ENTITY_UPDATED,
        this.helperService.translated.MESSAGES.ENTITY_UPDATED_T, this.helperService.constants.status.SUCCESS);
    });
  }

  editEntity() {
    this.entitySettingObj.disabled = true;
    this.entitySettingObj.entityForm.enable();
  }

  get entityFormValidations() {
    return this.entitySettingObj.entityForm.controls;
  }
}
