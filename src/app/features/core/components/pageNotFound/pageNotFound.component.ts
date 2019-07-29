import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import { HelperService } from 'src/app/services/common/helperService/helper.service';
@Component({
  selector: 'app-page-not-found',
  templateUrl: './pageNotFound.component.html',
  styleUrls: ['./pageNotFound.component.scss']
})
export class PageNotFoundComponent implements OnInit, OnDestroy {

  translated: Translation;
  constructor(
    private render: Renderer2,
    public helperService: HelperService
  ) {
    this.render.addClass(document.body, this.helperService.constants.config.theme.background);
    this.translated = this.helperService.translated;
  }

  ngOnInit() {
  }

  /**
   * this function is called when the component is destroyed and in this function the class that we have given to the background
   * is removed so that this doesn't affect the other's components backgrounds. in the constructor we have assigned the class.
   */
  ngOnDestroy() {
    this.render.removeClass(document.body, this.helperService.constants.config.theme.background);
  }

}
