import {Component, OnInit, NgZone, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {entityData} from 'src/app/models/entity.model';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
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
      name: value.name,
      headOffice: value.headOffice,
      role: 'Owner',
      active: true,
      status: true
    };
    let data = {
      moduleName: 'Safetybeat'
    };

    if (!valid) {
      this.helperService.createSnack(
        this.helperService.translated.LOGGER.MESSAGES.CREATEENTITY_ERROR,
        this.helperService.constants.status.ERROR
      );
      this.createEntityObj.loading = false;
      return;
    }
    this.adminServices.createEntity(this.createEntityObj.entityDetails).subscribe(
      result => {
        this.createEntityObj.entityResponse = result;
        if (result && this.createEntityObj.entityResponse.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.adminServices.viewEntities(data).subscribe(res => {
            this.createEntityObj.entitiesList = res;
            this.createEntityObj.entityUserData = this.compiler.constructUserEntityData(this.createEntityObj.entitiesList.data.allEntities);
            this.navService.changeEntites(this.createEntityObj.entityUserData);
            if (this.createEntityObj.entityUserData.entities.length === 1) {
              let entityCode = this.createEntityObj.entityResponse.data.entityCode;
              let index = this.helperService.findIndex(this.createEntityObj.entityUserData.entities, function (entity) {
                return entity.entityInfo.code === entityCode;
              });
              this.navService.changeSelectedEntity(this.createEntityObj.entityUserData.entities[index]);
            }
            this.helperService.navigateTo([this.helperService.appConstants.paths.home]);
            this.createEntityObj.loading = false;
            this.helperService.createSnack(
              this.createEntityObj.entityResponse.responseDetails.message,
              this.helperService.constants.status.SUCCESS
            );
          });
        } else if (this.createEntityObj.entityResponse.responseDetails.code === this.helperService.appConstants.codeValidations[3] ||
          this.helperService.appConstants.codeValidations[4]) {
          this.createEntityObj.loading = false;
          this.helperService.createSnack(result.responseDetails.message, this.helperService.constants.status.ERROR);
        } else if (this.createEntityObj.entityResponse.responseDetails.code === this.helperService.appConstants.codeValidations[1]) {
          this.createEntityObj.loading = false;
          this.helperService.createSnack(result.responseDetails.message, this.helperService.constants.status.ERROR);
        }
      },
      error => {
        this.createEntityObj.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
      }
    );
  }
}
