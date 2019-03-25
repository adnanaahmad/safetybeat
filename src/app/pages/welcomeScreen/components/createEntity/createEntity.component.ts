import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { Translation } from 'src/app/models/translate.model';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { entityData } from 'src/app/models/entity.model';

@Component({
  selector: 'app-createEntity',
  templateUrl: './createEntity.component.html',
  styleUrls: ['./createEntity.component.scss']
})
export class CreateEntityComponent implements OnInit {
  createEntityForm: FormGroup;
  translated:Translation;
  appConstants:any;
  city: any;
  country: any;
  zipCode: any;
  addr: any;
  addrKeys: string[];
  entityDetails: any;
  constructor(
    private formBuilder:FormBuilder,
    private translate: TranslateService,
    private logging: LoggingService,
    private zone: NgZone,

  ) { 
    this.translate.get(['LOGGER', 'BUTTONS', 'AUTH', 'MESSAGES']).subscribe((values) => {
      this.translated = values;
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.CREATEENTITY);
    });
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
    debugger;
    this.city = addrObj.locality;
    this.country = addrObj.country;
    this.zipCode = addrObj.zipCode;
    this.zone.run(() => {
      this.addr = addrObj;
      this.addrKeys = Object.keys(addrObj);
    });
  }

  get formValidation() { return this.createEntityForm.controls; }

  entityCreation({ value, valid }: { value: entityData; valid: boolean }):void{
    this.entityDetails = {
      moduleName: this.translated.BUTTONS.SAFETYBEAT,
      entityData: value
    }
    if(!valid){
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.WARNING, valid);
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.translated.LOGGER.MESSAGES.CREATEENTITY_ERROR);
      return;
    }
  }

}
