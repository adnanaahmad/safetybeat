import { AppPage } from './login.po';
import {values} from '../shared/constants';
import { browser} from 'protractor';

describe('Login Page Testing', () => {
  let page: AppPage;
  page = new AppPage();
  
  beforeAll(async () => {
    browser.ignoreSynchronization = true
    await page.navigateToLoginPage();
    console.log(await browser.getCurrentUrl());
  });

  it('It should test page title', async () => {
    expect(await page.getTitleText()).toEqual(values.loginPage.appTitle);
  });

  it('It should check login page url', async () => {
    expect(await page.getPageUrl()).toEqual(values.urls.loginPage);
  });

  it('It should check legends content', async () => {
    let obj = page.getLegendContent();
    expect(await obj.welcome).toEqual(values.loginPage.legendWelcome);
    expect(await obj.siteName).toEqual(values.loginPage.legendAppName);
    expect(await obj.description).toEqual(values.loginPage.legendDescription);
  });

  it('It should check Login box texts', async () => {
    let obj = page.getLoginBoxText();
    expect(await obj.loginBoxHeading).toEqual(values.loginPage.loginBoxHeading);
    expect(await obj.loginBoxDescription).toEqual(values.loginPage.loginBoxDescription);
    expect(await obj.loginButtonText).toEqual(values.loginPage.loginButtonText);
    expect(await obj.loginForgetPassText).toEqual(values.loginPage.loginForgetPassText);
  });

  it('It should check login functionality', async () => {
    let obj = page.getLoginInputFields();
    await obj.loginBoxEmailField.sendKeys(values.loginPage.email);
    await obj.loginBoxPassField.sendKeys(values.loginPage.password);
    await obj.loginButton.click();
    await page.navigateToDashboardPage();
    expect(await browser.getCurrentUrl()).toEqual(values.urls.dashboardPage);
  });
});
