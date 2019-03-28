import { Component, OnInit } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-particle2-container',
  templateUrl: './particleContainer2.component.html',
  styleUrls: ['./particleContainer2.component.scss']
})
export class ParticleContainerComponent2 implements OnInit {
  translated: Translation;
  appConstants: any;
  constructor(
    public helperService: HelperService,
  ) {
    this.translated = this.helperService.translation;
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.PARTICLE_COMPONENT);
    this.appConstants = this.helperService.constants.appIcons;
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.helperService.hideLoggers();
  }
}
