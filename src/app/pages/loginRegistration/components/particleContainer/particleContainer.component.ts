import {Component, OnInit} from '@angular/core';
import {Translation} from 'src/app/models/translate.model';
import {HelperService} from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-particle-container',
  templateUrl: './particleContainer.component.html',
  styleUrls: ['./particleContainer.component.scss']
})
export class ParticleContainerComponent implements OnInit {
  translated: Translation;
  particlesIcons: any;
  constructor(
    public helperService: HelperService,
  ) {
    this.translated = this.helperService.translated;
    this.particlesIcons = this.helperService.constants.particlesIcons;
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.PARTICLE_COMPONENT);
  }
  ngOnInit() {
  }

}
