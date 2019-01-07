import { Component, OnInit } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import { TranslateService } from '@ngx-translate/core';
import { LoggingService } from 'src/app/shared/logging/logging.service';

@Component({
  selector: 'app-particle-container',
  templateUrl: './particle-container.component.html',
  styleUrls: ['./particle-container.component.scss']
})
export class ParticleContainerComponent implements OnInit {
  translated: Translation;
  constructor(
    public translate: TranslateService,
    private logging: LoggingService
  ) {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER']).subscribe((values) => {
      this.translated = values;
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.PARTICLE_COMPONENT);
    });
  }

  ngOnInit() {
  }

}
