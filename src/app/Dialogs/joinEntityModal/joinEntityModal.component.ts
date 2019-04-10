import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Translation } from 'src/app/models/translate.model';
import { entityCode } from 'src/app/models/entity.model';
import { AdminControlService } from '../../pages/adminControl/services/adminControl.service';
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
    private adminServices: AdminControlService,
    public helperService: HelperService
  ) {
    this.translated = this.helperService.translation;
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.JOINENTITY);
    this.appConstants = this.helperService.constants.appConstant;
  }

  ngOnInit() {
    this.joinEntityForm = this.formBuilder.group({
      joinCode: ['', Validators.required]
    });
  }

  /**
   * this function is used to close the dialog
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * this function is used to validate Join Entity form and show error if the form field is invalid
   */
  get formValidation() { return this.joinEntityForm.controls; }

  /**
   *this function is used to make a new entity and checks if it already exists/ if its not found
   * @params value
   * @params valid
   */
  entityJoin({ value, valid }: { value: entityCode; valid: boolean }) {
    if (!valid) {
      this.helperService.appLoggerDev(this.helperService.constants.status.WARNING, valid);
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.translated.LOGGER.MESSAGES.CREATEENTITY_ERROR);
      return;
    }
    this.joinEntityData = {
      moduleName: this.translated.BUTTONS.SAFETYBEAT,
      entityCode: value.joinCode
    };
    this.helperService.appLoggerDev(this.helperService.constants.status.INFO, valid);
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(value));
    this.adminServices.joinEntity(this.joinEntityData).subscribe((res) => {
      this.entityResponse = res;
      this.onNoClick();
      if (this.entityResponse.responseDetails.code === '0025') {
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS, 'Entity is Joined successfully');
      } else if (this.entityResponse.responseDetails.code === '0027') {
        this.helperService.appLogger(this.helperService.constants.status.ERROR, 'Already Joined this entity')
      } else if (this.entityResponse.responseDetails.code === '0026') {
        this.helperService.appLogger(this.helperService.constants.status.ERROR, 'Entity Not Found')
      }
    }, (error) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR, 'You can not joined entity.');
      this.helperService.logoutError(error.status)
    })

  }


}
