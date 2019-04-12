import {Component, OnInit, NgZone, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {entityData} from 'src/app/models/entity.model';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {MatDialogRef} from '@angular/material';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {CreateEntity} from 'src/app/models/adminControl/createEntity.model';

@Component({
  selector: 'app-createEntity',
  templateUrl: './createEntity.component.html',
  styleUrls: ['./createEntity.component.scss']
})
export class CreateEntityComponent implements OnInit, AfterViewInit {
  createEntity: CreateEntity = <CreateEntity>{};
  @ViewChild('gmap') gMapElement: ElementRef;

  constructor(
    public formBuilder: FormBuilder,
    private zone: NgZone,
    private adminServices: AdminControlService,
    public helperService: HelperService,
    private navService: NavigationService,
    private compiler: CompilerProvider,
    public dialogRef: MatDialogRef<CreateEntityComponent>,
  ) {
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS,
      this.helperService.translated.LOGGER.MESSAGES.CREATEENTITY);
  }

  ngOnInit() {
    this.createEntity.loading = false;
    this.helperService.createMap(this.gMapElement);
    this.createEntity.createEntityForm = this.formBuilder.group({
      name: ['', Validators.required],
      headOffice: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    this.navService.currentRoleId.subscribe((res) => {
      this.createEntity.roleId = res;
    });
  }

  /**
   * this function is used for validation of createEntity form and shows errors if the
   * form field is invalid
   */
  get formValidation() {
    return this.createEntity.createEntityForm.controls;
  }

  /**
   * this function is used to close the dialog
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * this function is used for creating entities and get the values for adding entites from
   * createEntity form and if the values are valid then proceeds otherwise throws error in the
   * snackbar
   * @params value
   * @params valid
   */
  entityCreation({value, valid}: { value: entityData; valid: boolean }): void {
    value.headOffice = this.helperService.address;
    this.createEntity.entityDetails = {
      moduleName: this.helperService.translated.BUTTONS.SAFETYBEAT,
      entityData: value,
      active: true,
      roleId: this.createEntity.roleId
    };
    if (!valid) {
      this.helperService.appLoggerDev(this.helperService.constants.status.WARNING, valid);
      this.helperService.appLogger(this.helperService.constants.status.ERROR,
        this.helperService.translated.LOGGER.MESSAGES.CREATEENTITY_ERROR);
      return;
    }
    this.helperService.appLoggerDev(this.helperService.constants.status.INFO, valid);
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(value));
    this.createEntity.loading = true;
    this.adminServices.createEntity(this.createEntity.entityDetails).subscribe((result) => {
        this.createEntity.entityResponse = result;
        if (this.createEntity.entityResponse.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          let data = {
            'moduleName': 'Safetybeat'
          };
          this.adminServices.viewEntities(data).subscribe(res => {
            this.createEntity.loading = false;
            this.createEntity.entities = res;
            let entityUserData = this.compiler.constructUserEntityData(this.createEntity.entities.data);
            this.navService.changeEntites(entityUserData);
            this.onNoClick();
            this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
              this.createEntity.entityResponse.responseDetails.message);
          });
        } else if (this.createEntity.entityResponse.responseDetails.code === this.helperService.appConstants.codeValidations[3] ||
          this.helperService.appConstants.codeValidations[4]) {
          this.createEntity.loading = false;
          this.helperService.appLogger(this.helperService.constants.status.ERROR,
            this.createEntity.entityResponse.responseDetails.message);
        } else if (this.createEntity.entityResponse.responseDetails.code === this.helperService.appConstants.codeValidations[1]) {
          this.createEntity.loading = false;
          this.helperService.appLogger(this.helperService.constants.status.ERROR,
            this.createEntity.entityResponse.responseDetails.message);
        }
      }, (error => {
        this.helperService.appLogger(this.helperService.translated.LOGGER.STATUS.ERROR,
          this.helperService.translated.LOGGER.MESSAGES.ENTITYNOTCREATED);
        this.createEntity.loading = false;
        this.helperService.logoutError(error.status);
      })
    );
  }
}
