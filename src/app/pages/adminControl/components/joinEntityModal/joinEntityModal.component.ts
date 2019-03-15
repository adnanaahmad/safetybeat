import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { Translation } from 'src/app/models/translate.model';
import { joinEntity, entityCode } from 'src/app/models/entity.model';
import { AdminControlService } from '../../services/adminControl.service';

@Component({
  selector: 'app-joinEntityModal',
  templateUrl: './joinEntityModal.component.html',
  styleUrls: ['./joinEntityModal.component.scss']
})
export class JoinEntityModalComponent implements OnInit {
  joinEntityForm:FormGroup;
  translated: Translation;
  appConstants:any;
  joinEntityData:any;


  constructor(
    private translate: TranslateService,
    public formBuilder: FormBuilder,
    private logging: LoggingService,
    private adminServices:AdminControlService
  ) { 
    this.translate.get(['LOGGER', 'BUTTONS', 'AUTH', 'MESSAGES']).subscribe((values) => {
      this.translated = values;
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.JOINENTITY);
    });
    this.appConstants = ConstantService.appConstant;
  }

  ngOnInit() {
    this.joinEntityForm = this.formBuilder.group({
      joinCode: ['',Validators.required]
    });
  }

  get formValidation() { return this.joinEntityForm.controls; }

  entityJoin({ value, valid }: { value: entityCode; valid: boolean }){
    if(!valid){
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.WARNING, valid);
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.translated.LOGGER.MESSAGES.CREATEENTITY_ERROR);
      return;
    }
    this.joinEntityData = {
      moduleName:this.translated.BUTTONS.SAFETYBEAT,
      entityCode:value
    };
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.INFO, valid);
    this.logging.appLogger(this.translated.LOGGER.STATUS.INFO, JSON.stringify(value));
    this.adminServices.joinEntity(this.joinEntityData).subscribe((res)=>{
      this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS,"You have joined entity successfully.");
    },(error)=>{
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR,"You have not joined entity.");

    })

  }


}
