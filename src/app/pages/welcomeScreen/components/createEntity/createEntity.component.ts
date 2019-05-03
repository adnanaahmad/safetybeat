import {Component, OnInit, NgZone, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {entityData} from 'src/app/models/entity.model';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {CreateEntity} from 'src/app/models/welcomeScreen/createEntity.model';

@Component({
  selector: 'app-createEntity',
  templateUrl: './createEntity.component.html',
  styleUrls: ['./createEntity.component.scss']
})
export class CreateEntityComponent implements OnInit {
  @ViewChild('gmap') gMapElement: ElementRef;
  createEntityObj: CreateEntity = <CreateEntity>{};

  constructor(
    public formBuilder: FormBuilder,
    private zone: NgZone,
    private adminServices: AdminControlService,
    public helperService: HelperService,
    private compiler: CompilerProvider,
    private navService: NavigationService,
  ) {
    this.helperService.appLoggerDev(
      this.helperService.translated.LOGGER.STATUS.SUCCESS,
      this.helperService.translated.LOGGER.MESSAGES.CREATEENTITY
    );
  }

  /**
   * this function is used to make the createEntityForm
   */

  ngOnInit() {
    this.helperService.createMap(this.gMapElement);
    this.createEntityObj.loading = false;
    this.createEntityObj.createEntityForm = this.formBuilder.group({
      name: ['', Validators.required],
      headOffice: ['', Validators.required],
      status: true
    });
  }

  /**
   *this function is used to validate form and show error if the oninput field is invalid
   */
  get formValidation() {
    return this.createEntityObj.createEntityForm.controls;
  }

  /**
   * this function is used for creating entity after passing data of the entity that we want to add.
   * @params value
   * @params valid
   */
  entityCreation({value, valid}: { value: entityData; valid: boolean; }): void {
    value.headOffice = this.helperService.address;
    this.createEntityObj.loading = true;
    this.createEntityObj.entityDetails = {
      moduleName: this.helperService.translated.BUTTONS.SAFETYBEAT,
      entityData: value,
      active: true
    };
    let data = {
      moduleName: 'Safetybeat'
    };

    if (!valid) {
      this.helperService.appLoggerDev(
        this.helperService.constants.status.WARNING,
        valid
      );
      this.helperService.appLogger(
        this.helperService.constants.status.ERROR,
        this.helperService.translated.LOGGER.MESSAGES.CREATEENTITY_ERROR
      );
      this.createEntityObj.loading = false;
      return;
    }
    this.helperService.appLoggerDev(
      this.helperService.constants.status.INFO,
      valid
    );
    this.helperService.appLogger(
      this.helperService.constants.status.INFO,
      JSON.stringify(value)
    );
    this.adminServices.createEntity(this.createEntityObj.entityDetails).subscribe(
      result => {
        this.createEntityObj.entityResponse = result;
        if (this.createEntityObj.entityResponse.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.adminServices.viewEntities(data).subscribe(res => {
            this.createEntityObj.entitiesList = res;
            this.createEntityObj.entityUserData = this.compiler.constructUserEntityData(this.createEntityObj.entitiesList.data);
            this.navService.changeEntites(this.createEntityObj.entityUserData);
            this.createEntityObj.loading = false;
            this.helperService.appLogger(
              this.helperService.constants.status.SUCCESS,
              this.createEntityObj.entityResponse.responseDetails.message
            );
            this.helperService.navigateTo([this.helperService.appConstants.paths.home]);
          });
        } else if (this.createEntityObj.entityResponse.responseDetails.code === this.helperService.appConstants.codeValidations[3] ||
          this.helperService.appConstants.codeValidations[4]) {
          this.createEntityObj.loading = false;
          this.helperService.appLogger(
            this.helperService.constants.status.ERROR,
            this.createEntityObj.entityResponse.responseDetails.message
          );
        } else if (this.createEntityObj.entityResponse.responseDetails.code === this.helperService.appConstants.codeValidations[1]) {
          this.createEntityObj.loading = false;
          this.helperService.appLogger(
            this.helperService.constants.status.ERROR,
            this.createEntityObj.entityResponse.responseDetails.message
          );
        }
      },
      error => {
        this.helperService.appLogger(
          this.helperService.constants.status.ERROR,
          this.helperService.translated.LOGGER.MESSAGES.ENTITYNOTCREATED
        );
        this.createEntityObj.loading = false;
      }
    );
  }
}
