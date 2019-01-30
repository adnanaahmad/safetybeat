import { Component, OnInit } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import { TranslateService } from '@ngx-translate/core';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { ConstantService } from 'src/app/shared/constant/constant.service';

@Component({
  selector: 'app-particle2-container',
  templateUrl: './particleContainer2.component.html',
  styleUrls: ['./particleContainer2.component.scss']
})
export class ParticleContainerComponent2 implements OnInit {
  translated: Translation;
  appConstants: any;
  constructor(
    public translate: TranslateService,
    private logging: LoggingService
  ) {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER', 'ICONS']).subscribe((values) => {
      this.translated = values;
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.PARTICLE_COMPONENT);
    });
    this.appConstants = ConstantService.appIcons;
  }

  ngOnInit() {
  }

}
