import { SignUpPage } from './signup.po';
import {values} from '../shared/constants';
import { browser} from 'protractor';

describe('SignUp Page Testing', () => {
  let page: SignUpPage;
  page = new SignUpPage();
  
  beforeAll(async () => {
    browser.ignoreSynchronization = true
    await page.navigateToSignUpPage();
  });

  it('It should test page title', async () => {
    expect(await page.getTitleText()).toEqual(values.signUpPage.appTitle);
  });

  it('It should check signup page url', async () => {
    expect(await page.getPageUrl()).toEqual(values.signUpPage.signupUserInfoLink);
  });

});
