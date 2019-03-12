import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { Translation } from 'src/app/models/translate.model';

@Component({
  selector: 'app-joinEntityModal',
  templateUrl: './joinEntityModal.component.html',
  styleUrls: ['./joinEntityModal.component.scss']
})
export class JoinEntityModalComponent implements OnInit {
  joinEntityForm:FormGroup;
  translated: Translation;
  appConstants:any;


  constructor(
    private translate: TranslateService,
    public formBuilder: FormBuilder,
    private logging: LoggingService,
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


}
