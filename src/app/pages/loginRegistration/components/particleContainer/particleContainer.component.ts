import { Component, OnInit } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-particle-container',
  templateUrl: './particleContainer.component.html',
  styleUrls: ['./particleContainer.component.scss']
})
export class ParticleContainerComponent implements OnInit {
  translated: Translation;
  appIcons: any;
  constructor(
    private logging: LoggingService,
    public helperService: HelperService,
  ) {
    this.translated = this.helperService.translation;
    this.appIcons = this.helperService.constants.appIcons;
    this.logging.appLoggerForDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.PARTICLE_COMPONENT);
  }

  ngOnInit() {
  }

}
