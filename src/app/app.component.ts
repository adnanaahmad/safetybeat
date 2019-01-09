import { Component, Injector, OnInit, Renderer2 } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SettingService } from "src/app/shared/settings/setting.service";
import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { ConstantService } from './shared/constant/constant.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  // host: { '[class]': 'selectedTheme' }
})
export class AppComponent implements OnInit {
  title = "anonymous-FrontEnd";
  selectedTheme: any;
  constructor(protected injector: Injector,
    public settings: SettingService,
    public overlay: OverlayContainer,
    private render: Renderer2) {
    this.settings.getActiveTheme().subscribe(val => {
      this.selectedTheme = val;
      this.render.removeAttribute(document.body, 'class')
      this.render.addClass(document.body, this.selectedTheme)
      this.overlay.getContainerElement().classList.add(this.selectedTheme)
    });
  }
  ngOnInit() {
    const translate = this.injector.get(TranslateService);
    translate.setDefaultLang("en");
    const browserLang = translate.getBrowserLang();
    if (browserLang) {
      if (browserLang === "zh") {
        const browserCultureLang = translate.getBrowserCultureLang();
        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          translate.use("zh-cmn-Hans");
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          translate.use("zh-cmn-Hant");
        }
      } else {
        translate.use(translate.getBrowserLang());
      }
    } else {
      translate.use("en"); // Set your language here
    }

  }

}
