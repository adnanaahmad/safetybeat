import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { Translation } from 'src/app/models/translate.model';
import { joinEntity, entityCode } from 'src/app/models/entity.model';
import { AdminControlService } from '../../services/adminControl.service';
import { MatDialogRef } from '@angular/material';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-joinEntityModal',
  templateUrl: './joinEntityModal.component.html',
  styleUrls: ['./joinEntityModal.component.scss']
})
export class JoinEntityModalComponent implements OnInit {
  joinEntityForm: FormGroup;
  translated: Translation;
  appConstants: any;
  joinEntityData: any;
  entityResponse: any;


  constructor(
    public dialogRef: MatDialogRef<JoinEntityModalComponent>,
    public formBuilder: FormBuilder,
    private logging: LoggingService,
    private adminServices: AdminControlService,
    public helperService: HelperService
  ) {
    this.translated = this.helperService.translation;
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.JOINENTITY);
    this.appConstants = ConstantService.appConstant;
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
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.WARNING, valid);
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.translated.LOGGER.MESSAGES.CREATEENTITY_ERROR);
      return;
    }
    this.joinEntityData = {
      moduleName: this.translated.BUTTONS.SAFETYBEAT,
      entityCode: value.joinCode
    };
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.INFO, valid);
    this.logging.appLogger(this.translated.LOGGER.STATUS.INFO, JSON.stringify(value));
    this.adminServices.joinEntity(this.joinEntityData).subscribe((res) => {
      this.entityResponse = res;
      this.onNoClick();
      if (this.entityResponse.responseDetails.code == '0025') {
        this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, 'Entity is Joined successfully');
      }
      else if (this.entityResponse.responseDetails.code == '0027') {
        this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, 'Already Joined this entity')
      }
      else if (this.entityResponse.responseDetails.code == '0026') {
        this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, 'Entity Not Found')
      }
    }, (error) => {
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, "You can not joined entity.");
      this.helperService.logoutError(error.status)
    })

  }


}
