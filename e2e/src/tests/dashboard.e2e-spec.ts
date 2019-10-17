import { DashboardPage } from './dashboard.po';
import {values} from '../shared/constants';
import { browser} from 'protractor';

describe('Dashboard Page Testing', () => {
  let page: DashboardPage;
  page = new DashboardPage();

  beforeAll(async () => {
    browser.ignoreSynchronization = true
    await browser.sleep(10000)
    let url = await browser.getCurrentUrl();
    if(url !== values.urls.dashboardPage) {
        browser.quit();
    }
  });

  it('It should test page title', async () => {
    expect(await page.getTitleText()).toEqual(values.dashboardPage.appTitle);
  });

  it('It should check dashboard page url', async () => {
    expect(await page.getPageUrl()).toEqual(values.urls.dashboardPage);
  });

  it('It should check profile image existance in tool bar', async () => {
    page.getProfileImageSrc().getAttribute('src').then((attr) => {
        expect(attr.length).not.toEqual(0);
    })
  });
});
