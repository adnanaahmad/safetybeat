import {Component, OnDestroy, OnInit} from '@angular/core';
import {Translation} from 'src/app/models/translate.model';
import {HelperService} from 'src/app/services/common/helperService/helper.service';

@Component({
  selector: 'app-particle2Container',
  templateUrl: './particleContainer2.component.html',
  styleUrls: ['./particleContainer2.component.scss']
})
export class ParticleContainer2Component implements OnDestroy {
  translated: Translation;
  particlesIcons: any;

  constructor(
    public helperService: HelperService,
  ) {
    this.translated = this.helperService.translated;
    this.particlesIcons = this.helperService.constants.particlesIcons;
  }


  /**
   * this function is called when the component is destroyed and in this function debugger messages are being hidden.
   */

  ngOnDestroy() {
    this.helperService.hideLoggers();
  }
}
