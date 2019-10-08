import { browser, by, element } from 'protractor';
import {values} from '../shared/constants';

export class SignUpPage {
  navigateToSignUpPage() {
    return browser.get(values.signUpPage.signupUserInfoLink);
  }

  getTitleText() {
    return browser.getTitle();
  }

  getPageUrl() {
    return browser.getCurrentUrl();
  }
}
