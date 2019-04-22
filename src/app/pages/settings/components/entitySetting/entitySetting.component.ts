import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EditEntity} from '../../../../models/profile.model';
import {HelperService} from '../../../../shared/helperService/helper.service';
import {SettingService} from '../../../../shared/settings/setting.service';
import {EntityInfo} from '../../../../models/userEntityData.model';
import {NavigationService} from '../../../navigation/services/navigation.service';

@Component({
  selector: 'app-entity-setting',
  templateUrl: './entitySetting.component.html',
  styleUrls: ['./entitySetting.component.scss']
})
export class EntitySettingComponent implements OnInit {
  entityForm: FormGroup;
  disabled: boolean = false;
  createdBy: any;
  managedBy: any;
  entityId: any;
  entitiesData: EntityInfo;
  allEntities: any;
  constructor(private formBuilder: FormBuilder,
              public helperService: HelperService,
              private navService: NavigationService,
              public settings: SettingService) {
  }

  ngOnInit() {
    this.entityForm = this.formBuilder.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      headOffice: ['', Validators.required]
    });
    this.entityForm.disable();
    this.navService.selectedEntityData.subscribe((selectedEntity) => {
      if (selectedEntity !== 1) {
        this.allEntities = selectedEntity;
        this.entitiesData = this.allEntities.entityInfo;
        this.entityFormValidations['name'].setValue(this.entitiesData.name);
        this.entityFormValidations['code'].setValue(this.entitiesData.code);
        this.entityFormValidations['headOffice'].setValue(this.entitiesData.headOffice);
        this.entityId = this.entitiesData.id;
        this.createdBy = this.entitiesData.createdBy;
        this.managedBy = this.entitiesData.managedBy;
      }
    });
  }

  updateEntity({value, valid}: { value: EditEntity; valid: boolean }): void {
    this.disabled = false;
    this.entityForm.disable();
    let data = {
      'name': value.name,
      'code': value.code,
      'headOffice': value.headOffice,
      'managedBy': this.managedBy,
      'createdBy': this.createdBy
    };
    if (!valid) {
      this.helperService.appLogger(this.helperService.translated.STATUS.ERROR, 'Invalid Entity Fields');
      return;
    }
    this.settings.editEntity(this.entityId, data).subscribe((res) => {
      this.helperService.createSnack('Entity has been updated Successfully', 'Entity Updated', this.helperService.constants.status.SUCCESS);
    });
  }

  editEntity() {
    this.disabled = true;
    this.entityForm.enable();
  }

  get entityFormValidations() {
    return this.entityForm.controls;
  }
}
