import { Component, Injector, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'anonymous-FrontEnd';
  constructor(public injector: Injector) {
    
  }
  ngOnInit(){
    const translate = this.injector.get(TranslateService);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = translate.getBrowserCultureLang();
        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          translate.use('zh-cmn-Hant');
        }
      } else {
        translate.use(translate.getBrowserLang());
      }
    } else {
      translate.use('en'); // Set your language here
    }
  }
}
