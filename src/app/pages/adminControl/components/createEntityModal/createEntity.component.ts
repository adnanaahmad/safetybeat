import {Component, OnInit, NgZone, AfterViewInit} from '@angular/core';
import {Translation} from 'src/app/models/translate.model';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import { entityData} from 'src/app/models/entity.model';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {MatDialogRef} from '@angular/material';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {CreateEntity} from '../../../../models/adminControl/createEntity.model';

@Component({
  selector: 'app-createEntity',
  templateUrl: './createEntity.component.html',
  styleUrls: ['./createEntity.component.scss']
})
export class CreateEntityComponent implements OnInit, AfterViewInit {

  createEntity: CreateEntity = <CreateEntity>{};

  constructor(
    public formBuilder: FormBuilder,
    private zone: NgZone,
    private adminServices: AdminControlService,
    public helperService: HelperService,
    private navService: NavigationService,
    private compiler: CompilerProvider,
    public dialogRef: MatDialogRef<CreateEntityComponent>,
  ) {
    this.intialize();
    this.createEntity.translated = this.helperService.translation;
    this.createEntity.appConstants = this.helperService.constants.appConstant;
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS,
      this.createEntity.translated.LOGGER.MESSAGES.CREATEENTITY);
  }

  intialize() {
    this.createEntity.title = 'Places';
  }

  ngOnInit() {
    this.createEntity.createEntityForm = this.formBuilder.group({
      name: ['', Validators.required],
      headOffice: ['', Validators.required],
      status: false
    });
  }

  ngAfterViewInit() {
    this.navService.currentRoleId.subscribe((res) => {
      this.createEntity.roleId = res;
    });
  }

  setAddress(addrObj) {
    this.createEntity.city = addrObj.locality;
    this.createEntity.country = addrObj.country;
    this.createEntity.zipCode = addrObj.zipCode;
    this.zone.run(() => {
      this.createEntity.addr = addrObj;
      this.createEntity.addrKeys = Object.keys(addrObj);
    });
  }

  get formValidation() {
    return this.createEntity.createEntityForm.controls;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  entityCreation({value, valid}: { value: entityData; valid: boolean }): void {
    this.createEntity.entityDetails = {
      moduleName: this.createEntity.translated.BUTTONS.SAFETYBEAT,
      entityData: value,
      active: value.status,
      roleId: this.createEntity.roleId
    }
    if (!valid) {

      this.helperService.appLoggerDev(this.helperService.constants.status.WARNING, valid);
      this.helperService.appLogger(this.helperService.constants.status.ERROR,
        this.createEntity.translated.LOGGER.MESSAGES.CREATEENTITY_ERROR);
      return;
    }
    this.helperService.appLoggerDev(this.helperService.constants.status.INFO, valid);
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(value));
    this.adminServices.createEntity(this.createEntity.entityDetails).subscribe((result) => {
        this.createEntity.entityResponse = result;
        this.onNoClick();
        if (this.createEntity.entityResponse.responseDetails.code === '0012') {
          let data = {
            'moduleName': 'Safetybeat'
          }
          this.adminServices.viewEntities(data).subscribe(res => {
            this.createEntity.entites = res;
            let entityUserData = this.compiler.constructUserEntityData(this.createEntity.entites.data);
            this.navService.changeEntites(entityUserData);
          })
          this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
            this.createEntity.entityResponse.responseDetails.message);
        } else if (this.createEntity.entityResponse.responseDetails.code === '0013') {
          this.helperService.appLogger(this.helperService.constants.status.ERROR,
            this.createEntity.entityResponse.responseDetails.message)
        } else if (this.createEntity.entityResponse.responseDetails.code === '0017') {
          this.helperService.appLogger(this.helperService.constants.status.ERROR,
            this.createEntity.entityResponse.responseDetails.message)
        }
      }, (error => {
        this.helperService.appLogger(this.createEntity.translated.LOGGER.STATUS.ERROR,
          this.createEntity.translated.LOGGER.MESSAGES.ENTITYNOTCREATED);
        this.helperService.logoutError(error.status)
      })
    );
  }


}
