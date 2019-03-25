import { Component, OnInit, NgZone, Input } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { entity, entityData } from 'src/app/models/entity.model';
import { AdminControlService } from '../../services/adminControl.service';
import { MatDialogRef } from '@angular/material';
import { InvokeFunctionExpr } from '@angular/compiler';

@Component({
  selector: 'app-createEntity',
  templateUrl: './createEntity.component.html',
  styleUrls: ['./createEntity.component.scss']
})
export class CreateEntityComponent implements OnInit {
  translated: Translation;
  appConstants:any;
  @Input() entitySelected;
  public title = 'Places';
  public addrKeys: string[];
  public addr: object;
  city:string;
  country:string;
  zipCode:string;
  appIcons:any;
  createEntityForm:FormGroup;
  entityDetails:any;
  entityResponse:any;
  constructor(
    public dialogRef: MatDialogRef<CreateEntityComponent>,
    private translate: TranslateService,
    public formBuilder: FormBuilder,
    private logging: LoggingService,
    private zone: NgZone,
    private adminServices:AdminControlService
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
    console.log(this.entitySelected);
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
  onNoClick(): void {
    this.dialogRef.close();
  }

  entityCreation({ value, valid }: { value: entityData; valid: boolean }): void {
    this.entityDetails = {
      moduleName: this.translated.BUTTONS.SAFETYBEAT,
      entityData: value
    }
    if(!valid){
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.WARNING, valid);
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.translated.LOGGER.MESSAGES.CREATEENTITY_ERROR);
      return;
    }
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.INFO, valid);
    this.logging.appLogger(this.translated.LOGGER.STATUS.INFO, JSON.stringify(value));
    this.adminServices.createEntity(this.entityDetails).subscribe((result)=>{
      this.entityResponse = result;
      this.onNoClick();
      if(this.entityResponse.responseDetails.code=='0012'){
        var data = {
          'moduleName': 'Safetybeat'
        }
        this.adminServices.viewEntities(data).subscribe(res=>{
          debugger;
        })
        this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.entityResponse.responseDetails.message);
      }
      else if(this.entityResponse.responseDetails.code=='0013'){
        this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.entityResponse.responseDetails.message)
      }
      else if(this.entityResponse.responseDetails.code=='0017'){
        this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.entityResponse.responseDetails.message)
      }
    },(error=>{
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR,this.translated.LOGGER.MESSAGES.ENTITYNOTCREATED);
    })
    );
  }


}
