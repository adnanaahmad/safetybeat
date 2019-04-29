import {Component, OnDestroy, OnInit} from '@angular/core';
import {Translation} from 'src/app/models/translate.model';
import {HelperService} from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-particle2-container',
  templateUrl: './particleContainer2.component.html',
  styleUrls: ['./particleContainer2.component.scss']
})
export class ParticleContainerComponent implements OnInit, OnDestroy {
  translated: Translation;
  particlesIcons: any;

  constructor(
    public helperService: HelperService,
  ) {
    this.translated = this.helperService.translated;
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.PARTICLE_COMPONENT);
    this.particlesIcons = this.helperService.constants.particlesIcons;
  }

  ngOnInit() {

  }

  /**
   * this function is called when the component is destroyed and in this function debugger messages are being hidden.
   */

  ngOnDestroy() {
    this.helperService.hideLoggers();
  }
}
