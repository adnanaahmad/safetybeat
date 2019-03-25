import { Component, OnInit } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-particle-container',
  templateUrl: './particleContainer.component.html',
  styleUrls: ['./particleContainer.component.scss']
})
export class ParticleContainerComponent implements OnInit {
  translated: Translation;
  appConstants: any;
  constructor(
    private logging: LoggingService,
    public helperService: HelperService,
  ) {
    this.translated = this.helperService.translation;
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.PARTICLE_COMPONENT);
    this.appConstants = ConstantService.appIcons;
  }

  ngOnInit() {
  }

}
