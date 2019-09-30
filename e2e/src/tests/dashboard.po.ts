import { browser, by, element } from 'protractor';
import {values} from '../shared/constants';

export class DashboardPage {
    navigateToDashboardPage() {
        return browser.get(values.urls.dashboardPage);
    }

    getTitleText() {
        return browser.getTitle();
    }

    getPageUrl() {
        return browser.getCurrentUrl();
    }

    getProfileImageSrc() {
        return element(by.css('.ng-star-inserted'));
    }

    

}
