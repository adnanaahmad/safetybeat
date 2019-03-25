import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { Translation } from 'src/app/models/translate.model';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { entityData } from '../../../../models/entity.model';
import { AdminControlService } from '../../../adminControl/services/adminControl.service';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-createEntity',
  templateUrl: './createEntity.component.html',
  styleUrls: ['./createEntity.component.scss']
})
export class CreateEntityComponent implements OnInit {
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
  constructor(
    public formBuilder: FormBuilder,
    private logging: LoggingService,
    private zone: NgZone,
    private adminServices: AdminControlService,
    public helperService: HelperService
  ) {
    this.translated = this.helperService.translation;
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.CREATEENTITY);
    this.appConstants = ConstantService.appConstant;
  }

  ngOnInit() {
    this.createEntityForm = this.formBuilder.group({
      name: ['', Validators.required],
      headOffice: ['', Validators.required],
      status: false
    });
  }

  setAddress(addrObj) {
    debugger
    this.city = addrObj.locality;
    this.country = addrObj.country;
    this.zipCode = addrObj.zipCode;
    this.zone.run(() => {
      this.addr = addrObj;
      this.addrKeys = Object.keys(addrObj);
    });
  }

  get formValidation() { return this.createEntityForm.controls; }

  entityCreation({ value, valid }: { value: entityData; valid: boolean }): void {
    this.entityDetails = {
      moduleName: this.translated.BUTTONS.SAFETYBEAT,
      entityData: value
    }
    if (!valid) {
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.WARNING, valid);
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.translated.LOGGER.MESSAGES.CREATEENTITY_ERROR);
      return;
    }
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.INFO, valid);
    this.logging.appLogger(this.translated.LOGGER.STATUS.INFO, JSON.stringify(value));
    this.adminServices.createEntity(this.entityDetails).subscribe((result) => {
      this.entityResponse = result;
      if (this.entityResponse.responseDetails.code == '0012') {
        this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.entityResponse.responseDetails.message);
      }
      else if (this.entityResponse.responseDetails.code == '0013') {
        this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.entityResponse.responseDetails.message)
      }
      else if (this.entityResponse.responseDetails.code == '0017') {
        this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.entityResponse.responseDetails.message)
      }
    }, (error => {
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.translated.LOGGER.MESSAGES.ENTITYNOTCREATED);
    })
    );
  }


}
