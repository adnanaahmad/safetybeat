import { browser, by, element } from 'protractor';
import {values} from '../shared/constants';

export class AppPage {
  navigateToLoginPage() {
    return browser.get(values.urls.loginPage);
  }

  navigateToDashboardPage() {
    return browser.get(values.urls.dashboardPage);
  }

  getTitleText() {
    return browser.getTitle();
  }

  getPageUrl() {
    return browser.getCurrentUrl();
  }

  getLegendContent() {
    return {
      welcome: element(by.css('.legendContent h3')).getText(),
      siteName: element(by.css('.legendContent h1')).getText(),
      description: element(by.css('.legendContent p')).getText()
    }
  }

  getLoginBoxText() {
    return {
      loginBoxHeading: element(by.css('.loginbox .mat-card-title')).getText(),
      loginBoxDescription: element(by.css('.loginbox .subheading')).getText(),
      loginButtonText: element(by.css('.loginbox .button .mat-button-wrapper')).getText(),
      loginForgetPassText: element(by.css('.loginbox .link a')).getText()
    }
  }

  getLoginInputFields() {
    return {
      loginBoxEmailField: element(by.id('email-field')),
      loginBoxPassField: element(by.id('password-field')),
      loginButton: element(by.css('.loginbox .button .mat-button-wrapper'))
    }
  }

}
