import {Component, OnInit, NgZone, ViewChild, ElementRef} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ConstantService} from 'src/app/shared/constant/constant.service';
import {Translation} from 'src/app/models/translate.model';
import {entityData} from 'src/app/models/entity.model';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';

@Component({
  selector: 'app-createEntity',
  templateUrl: './createEntity.component.html',
  styleUrls: ['./createEntity.component.scss']
})
export class CreateEntityComponent implements OnInit {
  @ViewChild('gmap') gmapElement: ElementRef;
  translated: Translation;
  appConstants: any;
  public title = 'Places';
  public addrKeys: string[];
  public addr: object;
  city: string;
  country: string;
  zipCode: string;
  appIcons: any;
  createEntityForm: FormGroup;
  entityDetails: any;
  entityResponse: any;
  entites: any;
  roleId: any;
  entitiesList: any;
  entityUserData: any;
  loading: boolean = false;
  displayCreateButton: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private zone: NgZone,
    private adminServices: AdminControlService,
    public helperService: HelperService,
    private compiler: CompilerProvider,
    private navService: NavigationService,
  ) {
    this.translated = this.helperService.translation;
    this.helperService.appLoggerDev(
      this.translated.LOGGER.STATUS.SUCCESS,
      this.translated.LOGGER.MESSAGES.CREATEENTITY
    );
    this.appConstants = ConstantService.appConstant;
  }

  ngOnInit() {
    this.helperService.createMap(this.gmapElement);
    this.createEntityForm = this.formBuilder.group({
      name: ['', Validators.required],
      headOffice: ['', Validators.required],
    });
  }

  setAddress(addrObj) {
    let address = '', onSelect: boolean = false;
    ;
    this.displayCreateButton = true;
    if (!this.helperService.isEmpty(addrObj)) {
      this.city = addrObj.locality;
      this.country = addrObj.country;
      this.zipCode = addrObj.zipCode;
      this.zone.run(() => {
        this.addr = addrObj;
        this.addrKeys = Object.keys(addrObj);
      });
      address = addrObj.formatted_address;
      onSelect = true;
    } else {
      address = this.createEntityForm.controls.headOffice.value;
    }
    this.setMap(address, onSelect);
  }

  /**
   * Set map location according to address in organization form
   * @param address
   */
  setMap(address, onSelect: boolean) {
    this.displayCreateButton = onSelect;
    this.helperService.setLocationGeocode(address, this.helperService.createMap(this.gmapElement)).then(res => {
      this.displayCreateButton = true;
      return this.createEntityForm.controls.headOffice.setErrors(null);
    }).catch(err => {
      this.displayCreateButton = false;
      return this.createEntityForm.controls.headOffice.setErrors({invalid: true});
    });
  }

  get formValidation() {
    return this.createEntityForm.controls;
  }

  entityCreation({
                   value,
                   valid
                 }: {
    value: entityData;
    valid: boolean;
  }): void {
    this.setAddress({});
    this.loading = true;
    this.entityDetails = {
      moduleName: this.translated.BUTTONS.SAFETYBEAT,
      entityData: value,
      active: true,
      roleId: 2
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
        this.translated.LOGGER.MESSAGES.CREATEENTITY_ERROR
      );
      this.loading = false;
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
    this.adminServices.createEntity(this.entityDetails).subscribe(
      result => {
        this.entityResponse = result;
        if (this.entityResponse.responseDetails.code === '0012') {
          this.adminServices.viewEntities(data).subscribe(res => {
            this.entitiesList = res;
            this.entityUserData = this.compiler.constructUserEntityData(this.entitiesList.data);
            this.navService.changeEntites(this.entityUserData);
            this.loading = false;
            this.helperService.appLogger(
              this.helperService.constants.status.SUCCESS,
              this.entityResponse.responseDetails.message
            );
            this.helperService.navigateTo(['/home']);
          });
        } else if (this.entityResponse.responseDetails.code === '0013') {
          this.loading = false;
          this.helperService.appLogger(
            this.helperService.constants.status.ERROR,
            this.entityResponse.responseDetails.message
          );
        } else if (this.entityResponse.responseDetails.code === '0017') {
          this.loading = false;
          this.helperService.appLogger(
            this.helperService.constants.status.ERROR,
            this.entityResponse.responseDetails.message
          );
        }
      },
      error => {
        this.helperService.appLogger(
          this.helperService.constants.status.ERROR,
          this.translated.LOGGER.MESSAGES.ENTITYNOTCREATED
        );
        this.loading = false;
      }
    );
  }

  setFalse(event) {
    if (event.which !== this.appConstants.enterKey) {
      this.displayCreateButton = false;
    }
  }
}
