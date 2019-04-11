import {Component, OnInit, NgZone, Input, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {Translation} from 'src/app/models/translate.model';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {entity, entityData} from 'src/app/models/entity.model';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {MatDialogRef} from '@angular/material';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import { CreateEntity } from 'src/app/models/adminControl/createEntity.model';

@Component({
  selector: 'app-createEntity',
  templateUrl: './createEntity.component.html',
  styleUrls: ['./createEntity.component.scss']
})
export class CreateEntityComponent implements OnInit, AfterViewInit {
  createEntity: CreateEntity = <CreateEntity>{}
  @ViewChild('gmap') gmapElement: ElementRef;
  constructor(
    public formBuilder: FormBuilder,
    private zone: NgZone,
    private adminServices: AdminControlService,
    public helperService: HelperService,
    private navService: NavigationService,
    private compiler: CompilerProvider,
    public dialogRef: MatDialogRef<CreateEntityComponent>,
  ) {
    this.createEntity.translated = this.helperService.translation;
    this.createEntity.appConstants = this.helperService.constants.appConstant;
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.createEntity.translated.LOGGER.MESSAGES.CREATEENTITY);
  }

  ngOnInit() {
    this.helperService.createMap(this.gmapElement);
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
   * this function is used for google based searching in which we can get the city,country
   * and zip code etc and can also get the longitude and latitude for the particular address
   * @params addrObj
   */
  setAddress(addrObj) {
    let address = '', onSelect: boolean = false;
    this.createEntity.displaySubmitButton = true;
    if (!this.helperService.isEmpty(addrObj)) {
      this.createEntity.city = addrObj.locality;
      this.createEntity.country = addrObj.country;
      this.createEntity.zipCode = addrObj.zipCode;
      this.zone.run(() => {
        this.createEntity.addr = addrObj;
        this.createEntity.addrKeys = Object.keys(addrObj);
        this.createEntity.addr = addrObj.formatted_address;
      });
      address = addrObj.formatted_address;
      onSelect = true;
    } else {
      address = this.createEntity.createEntityForm.controls.headOffice.value;
      this.createEntity.addr = address;
    }
    this.setMap({address: address, onSelect: onSelect});
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
    this.createEntity.entityDetails = {
      moduleName: this.createEntity.translated.BUTTONS.SAFETYBEAT,
      entityData: value,
      active: true,
      roleId: this.createEntity.roleId
    };
    if (!valid) {
      this.helperService.appLoggerDev(this.helperService.constants.status.WARNING, valid);
      this.helperService.appLogger(this.helperService.constants.status.ERROR,
        this.createEntity.translated.LOGGER.MESSAGES.CREATEENTITY_ERROR);
      return;
    }
    debugger
    this.helperService.appLoggerDev(this.helperService.constants.status.INFO, valid);
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(value));
    this.adminServices.createEntity(this.createEntity.entityDetails).subscribe((result) => {
        this.createEntity.entityResponse = result;
        this.onNoClick();
        if (this.createEntity.entityResponse.responseDetails.code === '0012') {
          let data = {
            'moduleName': 'Safetybeat'
          };
          this.adminServices.viewEntities(data).subscribe(res => {
            this.createEntity.entites = res;
            let entityUserData = this.compiler.constructUserEntityData(this.createEntity.entites.data);
            this.navService.changeEntites(entityUserData);
          });
          this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.createEntity.entityResponse.responseDetails.message);
        } else if (this.createEntity.entityResponse.responseDetails.code === '0013') {
          this.helperService.appLogger(this.helperService.constants.status.ERROR, this.createEntity.entityResponse.responseDetails.message);
        } else if (this.createEntity.entityResponse.responseDetails.code === '0017') {
          this.helperService.appLogger(this.helperService.constants.status.ERROR, this.createEntity.entityResponse.responseDetails.message);
        }
      }, (error => {
        this.helperService.appLogger(this.createEntity.translated.LOGGER.STATUS.ERROR, this.createEntity.translated.LOGGER.MESSAGES.ENTITYNOTCREATED);
        this.helperService.logoutError(error.status);
      })
    );
  }

  /**
   * Set map location according to address in organization form
   */
  setMap({address, onSelect}: { address: any, onSelect: boolean }) {
    this.createEntity.displaySubmitButton = onSelect;
    this.helperService.setLocationGeocode(address, this.helperService.createMap(this.gmapElement)).then(res => {
      this.createEntity.displaySubmitButton = true;
      return this.formValidation.headOffice.setErrors(null);
    }).catch(err => {
      this.createEntity.displaySubmitButton = false;
      return this.formValidation.headOffice.setErrors({invalid: true});
    });
  }


}
