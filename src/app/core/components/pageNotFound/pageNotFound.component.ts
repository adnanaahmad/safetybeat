import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { Translation } from 'src/app/models/translate.model';
import { TranslateService } from '@ngx-translate/core';
import { LoggingService } from 'src/app/shared/logging/logging.service';
@Component({
  selector: 'app-page-not-found',
  templateUrl: './pageNotFound.component.html',
  styleUrls: ['./pageNotFound.component.scss']
})
export class PageNotFoundComponent implements OnInit,OnDestroy {

  translated: Translation;
    constructor(
      private render: Renderer2,
      public translate:TranslateService,
      public logging:LoggingService
    ) { 
    this.render.addClass(document.body, ConstantService.config.theme.background);
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER', 'ICONS', 'STRINGS']).subscribe((values) => {
      this.translated = values;
    });
    }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.render.removeClass(document.body, ConstantService.config.theme.background);
  }

}
