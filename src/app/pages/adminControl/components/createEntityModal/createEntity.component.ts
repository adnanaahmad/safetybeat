import {Component, OnInit, NgZone, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {entityData} from 'src/app/models/entity.model';
import {AdminControlService} from '../../services/adminControl.service';
import {MatDialogRef} from '@angular/material';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {CreateEntity} from '../../../../models/adminControl/createEntity.model';

@Component({
  selector: 'app-createEntity',
  templateUrl: './createEntity.component.html',
  styleUrls: ['./createEntity.component.scss']
})
export class CreateEntityComponent implements OnInit, AfterViewInit {
  @ViewChild('gmap') gmapElement: ElementRef;
  createEntity: CreateEntity = <CreateEntity>{};

  constructor(
    public formBuilder: FormBuilder,
    private zone: NgZone,
    private adminServices: AdminControlService,
    public helperService: HelperService,
    private navService: NavigationService,
    private compiler: CompilerProvider,
    public dialogRef: MatDialogRef<CreateEntityComponent>,
  ) {
    this.intialize();
    this.createEntity.translated = this.helperService.translation;
    this.createEntity.appConstants = this.helperService.constants.appConstant;
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS,
      this.createEntity.translated.LOGGER.MESSAGES.CREATEENTITY);
  }

  intialize() {
    this.createEntity.title = 'Places';
    this.createEntity.displaySubmitButton = false;
  }

  ngOnInit() {
    this.helperService.createMap(this.gmapElement);
    this.createEntity.createEntityForm = this.formBuilder.group({
      name: ['', Validators.required],
      headOffice: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.navService.currentRoleId.subscribe((res) => {
      this.createEntity.roleId = res;
    });
  }

  setAddress(addrObj) {
    debugger;
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

  get formValidation() {
    return this.createEntity.createEntityForm.controls;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  entityCreation({value, valid}: { value: entityData; valid: boolean }): void {
    this.setAddress({});
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
          this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
            this.createEntity.entityResponse.responseDetails.message);
        } else if (this.createEntity.entityResponse.responseDetails.code === '0013') {
          this.helperService.appLogger(this.helperService.constants.status.ERROR,
            this.createEntity.entityResponse.responseDetails.message);
        } else if (this.createEntity.entityResponse.responseDetails.code === '0017') {
          this.helperService.appLogger(this.helperService.constants.status.ERROR,
            this.createEntity.entityResponse.responseDetails.message);
        }
      }, (error => {
        this.helperService.appLogger(this.createEntity.translated.LOGGER.STATUS.ERROR,
          this.createEntity.translated.LOGGER.MESSAGES.ENTITYNOTCREATED);
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
