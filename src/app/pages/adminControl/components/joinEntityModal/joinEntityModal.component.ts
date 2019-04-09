import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Translation } from 'src/app/models/translate.model';
import { entityCode } from 'src/app/models/entity.model';
import { AdminControlService } from '../../services/adminControl.service';
import { MatDialogRef } from '@angular/material';
import { HelperService } from 'src/app/shared/helperService/helper.service';
import {JoinEntity} from '../../../../models/adminControl/joinEntity.model';

@Component({
  selector: 'app-joinEntityModal',
  templateUrl: './joinEntityModal.component.html',
  styleUrls: ['./joinEntityModal.component.scss']
})
export class JoinEntityModalComponent implements OnInit {
  joinEntityForm: FormGroup;
  joinEntity: JoinEntity = <JoinEntity>{};


  constructor(
    public dialogRef: MatDialogRef<JoinEntityModalComponent>,
    public formBuilder: FormBuilder,
    private adminServices: AdminControlService,
    public helperService: HelperService
  ) {
    this.joinEntity.translated = this.helperService.translation;
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS,
      this.joinEntity.translated.LOGGER.MESSAGES.JOINENTITY);
    this.joinEntity.appConstants = this.helperService.constants.appConstant;
  }

  ngOnInit() {
    this.joinEntityForm = this.formBuilder.group({
      joinCode: ['', Validators.required]
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  get formValidation() { return this.joinEntityForm.controls; }

  entityJoin({ value, valid }: { value: entityCode; valid: boolean }) {
    if (!valid) {
      this.helperService.appLoggerDev(this.helperService.constants.status.WARNING, valid);
      this.helperService.appLogger(this.helperService.constants.status.ERROR,
        this.joinEntity.translated.LOGGER.MESSAGES.CREATEENTITY_ERROR);
      return;
    }
    this.joinEntity.joinEntityData = {
      moduleName: this.joinEntity.translated.BUTTONS.SAFETYBEAT,
      entityCode: value.joinCode
    };
    this.helperService.appLoggerDev(this.helperService.constants.status.INFO, valid);
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(value));
    this.adminServices.joinEntity(this.joinEntity.joinEntityData).subscribe((res) => {
      this.joinEntity.entityResponse = res;
      this.onNoClick();
      if (this.joinEntity.entityResponse.responseDetails.code === '0025') {
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS, 'Entity is Joined successfully');
      }
      else if (this.joinEntity.entityResponse.responseDetails.code === '0027') {
        this.helperService.appLogger(this.helperService.constants.status.ERROR, 'Already Joined this entity')
      }
      else if (this.joinEntity.entityResponse.responseDetails.code === '0026') {
        this.helperService.appLogger(this.helperService.constants.status.ERROR, 'Entity Not Found')
      }
    }, (error) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR, 'You can not joined entity.');
      this.helperService.logoutError(error.status)
    })

  }


}
