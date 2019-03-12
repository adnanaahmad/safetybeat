import { Component, OnInit, NgZone } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { entity } from 'src/app/models/entity.model';

@Component({
  selector: 'app-createEntity',
  templateUrl: './createEntity.component.html',
  styleUrls: ['./createEntity.component.scss']
})
export class CreateEntityComponent implements OnInit {
  translated: Translation;
  appConstants:any;
  public title = 'Places';
  public addrKeys: string[];
  public addr: object;
  city:string;
  country:string;
  zipCode:string;
  appIcons:any;
  createEntityForm:FormGroup;
  constructor(
    private translate: TranslateService,
    public formBuilder: FormBuilder,
    private logging: LoggingService,
    private zone: NgZone
  ) {
    this.translate.get(['LOGGER', 'BUTTONS', 'AUTH', 'MESSAGES']).subscribe((values) => {
      this.translated = values;
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.CREATEENTITY);
    });
    this.appConstants = ConstantService.appConstant;
   }

  ngOnInit() {
    this.createEntityForm = this.formBuilder.group({
      entityName: ['', Validators.required],
      headOffice: ['', Validators.required],
      status: ['']
    });
  }

  setAddress(addrObj) {
    this.city = addrObj.locality;
    this.country = addrObj.country;
    this.zipCode = addrObj.zipCode;
    this.zone.run(() => {
      this.addr = addrObj;
      this.addrKeys = Object.keys(addrObj);
    });
  }

  get formValidation() { return this.createEntityForm.controls; }

  createEntity({ value, valid }: { value: entity; valid: boolean }): void {
    if(!valid){

    }
  }


}
