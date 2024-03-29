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
    this.joinEntity.loading = false;
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
      this.helperService.createSnack(this.helperService.translated.LOGGER.MESSAGES.CREATEENTITY_ERROR,
        this.helperService.constants.status.ERROR);
      return;
    }
    this.joinEntity.loading = true;
    this.joinEntity.joinEntityData = {
      moduleName: this.helperService.translated.BUTTONS.SAFETYBEAT,
      entityCode: value.joinCode
    };
    this.adminServices.joinEntity(this.joinEntity.joinEntityData).subscribe(
      res => {
        this.joinEntity.entityResponse = res;
        if (this.joinEntity.entityResponse.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          let data = {
            moduleName: 'Safetybeat'
          };
          this.adminServices.viewEntities(data).subscribe(res => {
            let entityUserData = this.compiler.constructUserEntityData(
              res.data.allEntities
            );
            this.joinEntity.loading = false;
            this.onNoClick();
            this.navService.changeEntites(entityUserData);
          });
          this.helperService.createSnack(
            this.helperService.translated.MESSAGES.JOINENTITY_SUCCESS,
            this.helperService.constants.status.SUCCESS
          );
        } else if (this.joinEntity.entityResponse.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
          this.joinEntity.loading = false;
          this.onNoClick();
          this.helperService.createSnack(
            this.helperService.translated.MESSAGES.ALREADYJOINED_ENTITY,
            this.helperService.constants.status.ERROR
          );
        } else if (this.joinEntity.entityResponse.responseDetails.code === this.helperService.appConstants.codeValidations[3]) {
          this.joinEntity.loading = false;
          this.onNoClick();
          this.helperService.createSnack(
            this.helperService.translated.MESSAGES.ENTITYNOTFOUND,
            this.helperService.constants.status.ERROR
          );
        } else {
          this.joinEntity.loading = false;
        }
      },
      (error) => {
        this.joinEntity.loading = false;
        this.onNoClick();
        this.helperService.createSnack(
          error.error,
          this.helperService.translated.MESSAGES.ENTITYJOINFIAL
        );
      }
    );
  }
}
