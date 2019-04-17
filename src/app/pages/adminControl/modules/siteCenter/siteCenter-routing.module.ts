import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SiteCenterComponent} from './components/siteCenter/siteCenter.component';
import {ViewSiteComponent} from './components/viewSite/viewSite.component';

const routes: Routes = [
  {
    path: '',
    component: SiteCenterComponent
  },
  {
    path: 'viewSite',
    component: ViewSiteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteCenterRoutingModule {
}
