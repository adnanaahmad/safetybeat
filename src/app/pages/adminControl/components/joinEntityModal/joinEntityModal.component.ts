import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {Translation} from 'src/app/models/translate.model';
import {entityCode} from 'src/app/models/entity.model';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {MatDialogRef} from '@angular/material';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';

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
  entites: any;

  constructor(
    public dialogRef: MatDialogRef<JoinEntityModalComponent>,
    public formBuilder: FormBuilder,
    private adminServices: AdminControlService,
    public helperService: HelperService,
    private compiler: CompilerProvider,
    private navService: NavigationService
  ) {
    this.translated = this.helperService.translation;
    this.helperService.appLoggerDev(
      this.helperService.constants.status.SUCCESS,
      this.translated.LOGGER.MESSAGES.JOINENTITY
    );
    this.appConstants = this.helperService.constants.appConstant;
  }

  ngOnInit() {
    this.joinEntityForm = this.formBuilder.group({
      joinCode: ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get formValidation() {
    return this.joinEntityForm.controls;
  }

  entityJoin({value, valid}: { value: entityCode; valid: boolean }) {
    if (!valid) {
      this.helperService.appLoggerDev(
        this.helperService.constants.status.WARNING,
        valid
      );
      this.helperService.appLogger(
        this.helperService.constants.status.ERROR,
        this.translated.LOGGER.MESSAGES.CREATEENTITY_ERROR
      );
      return;
    }
    this.joinEntityData = {
      moduleName: this.translated.BUTTONS.SAFETYBEAT,
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
    this.adminServices.joinEntity(this.joinEntityData).subscribe(
      res => {
        this.entityResponse = res;
        if (this.entityResponse.responseDetails.code === '0025') {
          let data = {
            moduleName: 'Safetybeat'
          };
          this.adminServices.viewEntities(data).subscribe(res => {
            this.entites = res;
            let entityUserData = this.compiler.constructUserEntityData(
              this.entites.data
            );
            this.onNoClick();
            this.navService.changeEntites(entityUserData);
          });
          this.helperService.appLogger(
            this.helperService.constants.status.SUCCESS,
            this.translated.MESSAGES.JOINENTITY_SUCCESS
          );
        } else if (this.entityResponse.responseDetails.code === '0027') {
          this.helperService.appLogger(
            this.helperService.constants.status.ERROR,
            this.translated.MESSAGES.ALREADYJOINED_ENTITY
          );
        } else if (this.entityResponse.responseDetails.code === '0026') {
          this.helperService.appLogger(
            this.helperService.constants.status.ERROR,
            this.translated.MESSAGES.ENTITYNOTFOUND
          );
        }
      },
      error => {
        this.helperService.appLogger(
          this.helperService.constants.status.ERROR,
          this.translated.MESSAGES.ENTITYJOINFIAL
        );
        this.helperService.logoutError(error.status);
      }
    );
  }
}
