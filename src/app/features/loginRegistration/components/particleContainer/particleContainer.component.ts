import {Component, OnInit} from '@angular/core';
import {Translation} from 'src/app/models/translate.model';
import {HelperService} from 'src/app/services/common/helperService/helper.service';

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
  }
  ngOnInit() {
  }

}
