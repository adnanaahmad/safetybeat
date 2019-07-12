import {Component, OnInit} from '@angular/core';
import {Validators, FormBuilder} from '@angular/forms';
import {entityCode} from 'src/app/models/entity.model';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {MatDialogRef} from '@angular/material';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {JoinEntity} from 'src/app/models/adminControl/joinEntity.model';

@Component({
  selector: 'app-joinEntityModal',
  templateUrl: './joinEntityModal.component.html',
  styleUrls: ['./joinEntityModal.component.scss']
})
export class JoinEntityModalComponent implements OnInit {
  joinEntity: JoinEntity = <JoinEntity>{};

  constructor(
    public dialogRef: MatDialogRef<JoinEntityModalComponent>,
    public formBuilder: FormBuilder,
    private adminServices: AdminControlService,
    public helperService: HelperService,
    private compiler: CompilerProvider,
    private navService: NavigationService
  ) {
    this.helperService.appLoggerDev(
      this.helperService.constants.status.SUCCESS,
      this.helperService.translated.LOGGER.MESSAGES.JOINENTITY
    );
  }

  /**
   * this function is used for creating joinEntityForm and we also assign the formControlNames and their validations
   * over here.
   */

  ngOnInit() {
    this.joinEntity.joinEntityForm = this.formBuilder.group({
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
  get formValidation() {
    return this.joinEntity.joinEntityForm.controls;
  }

  /**
   *this function is used to join the entity using join entity code.
   * @params value
   * @params valid
   */
  entityJoin({value, valid}: { value: entityCode; valid: boolean }) {
    if (!valid) {
      this.helperService.appLoggerDev(
        this.helperService.constants.status.WARNING,
        valid
      );
      this.helperService.appLogger(
        this.helperService.constants.status.ERROR,
        this.helperService.translated.LOGGER.MESSAGES.CREATEENTITY_ERROR
      );
      return;
    }
    this.joinEntity.joinEntityData = {
      moduleName: this.helperService.translated.BUTTONS.SAFETYBEAT,
      entityCode: value.joinCode
    };
    this.helperService.appLoggerDev(
      this.helperService.constants.status.INFO,
      valid
    );
    this.helperService.appLogger(
      this.helperService.constants.status.INFO,
      JSON.stringify(value)
    );
    this.adminServices.joinEntity(this.joinEntity.joinEntityData).subscribe(
      res => {
        this.joinEntity.entityResponse = res;
        if (this.joinEntity.entityResponse.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          let data = {
            moduleName: 'Safetybeat'
          };
          this.adminServices.viewEntities(data).subscribe(res => {
            let entityUserData = this.compiler.constructUserEntityData(
              res.data
            );
            this.onNoClick();
            this.navService.changeEntites(entityUserData);
          });
          this.helperService.appLogger(
            this.helperService.constants.status.SUCCESS,
            this.helperService.translated.MESSAGES.JOINENTITY_SUCCESS
          );
        } else if (this.joinEntity.entityResponse.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
          this.helperService.appLogger(
            this.helperService.constants.status.ERROR,
            this.helperService.translated.MESSAGES.ALREADYJOINED_ENTITY
          );
        } else if (this.joinEntity.entityResponse.responseDetails.code === this.helperService.appConstants.codeValidations[3]) {
          this.helperService.appLogger(
            this.helperService.constants.status.ERROR,
            this.helperService.translated.MESSAGES.ENTITYNOTFOUND
          );
        }
      },
      error => {
        this.helperService.appLogger(
          this.helperService.constants.status.ERROR,
          this.helperService.translated.MESSAGES.ENTITYJOINFIAL
        );
      }
    );
  }
}
